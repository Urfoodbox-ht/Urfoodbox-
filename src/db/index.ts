import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export function cleanEnvConnectionValue(value?: string): string | null {
  if (!value) return null;
  let cleaned = value.trim();
  // Handle accidental copy-paste of Neon CLI snippet like: psql 'postgresql://...'
  if (/^psql\s+/i.test(cleaned)) {
    cleaned = cleaned.replace(/^psql\s+/i, '').trim();
  }
  // Strip wrapping single or double quotes if pasted with quotes
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned || null;
}

export const isValidPostgresUrl = (value?: string): value is string => {
  const cleaned = cleanEnvConnectionValue(value);
  if (!cleaned) return false;
  return cleaned.startsWith('postgres://') || cleaned.startsWith('postgresql://');
};

export function resolvePostgresUrl(): string | null {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.NEON_DATABASE_URL,
    process.env.SUPABASE_DB_URL,
  ];
  for (const candidate of candidates) {
    const cleaned = cleanEnvConnectionValue(candidate);
    if (cleaned && (cleaned.startsWith('postgres://') || cleaned.startsWith('postgresql://'))) {
      return cleaned;
    }
  }
  return null;
}

export function hasConfiguredDatabase(): boolean {
  if (resolvePostgresUrl()) return true;
  return Boolean(process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_DB_NAME);
}

function normalizeConnectionForPool(rawUrl: string): {
  connectionString: string;
  ssl: false | { rejectUnauthorized: boolean };
} {
  let sslDisableRequested = process.env.DATABASE_SSL === 'false';
  let sanitizedUrl = rawUrl;

  try {
    const parsed = new URL(rawUrl);
    const sslMode = parsed.searchParams.get('sslmode')?.toLowerCase();
    const isLocalHost =
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '::1';

    if (sslMode === 'disable' || isLocalHost) {
      sslDisableRequested = true;
    } else if (sslMode && sslMode !== 'verify-full') {
      // pg@8 treats sslmode=require/prefer/verify-ca as verify-full and overrides the ssl option.
      // Remove sslmode/channel_binding so our explicit SSL config governs TLS cleanly on Vercel & poolers.
      parsed.searchParams.delete('sslmode');
      parsed.searchParams.delete('channel_binding');
      sanitizedUrl = parsed.toString();
    } else if (parsed.searchParams.has('channel_binding')) {
      parsed.searchParams.delete('channel_binding');
      sanitizedUrl = parsed.toString();
    }
  } catch {
    // Keep rawUrl if URL constructor cannot parse custom socket/host syntax
  }

  return {
    connectionString: sanitizedUrl,
    ssl: sslDisableRequested ? false : { rejectUnauthorized: false },
  };
}

function isExpectedPoolDisconnectError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const record = err as { code?: string; message?: string };
  const code = record.code || '';
  const message = record.message || '';

  if (
    code === '57P01' ||
    code === '57P02' ||
    code === '57P03' ||
    code === '08006' ||
    code === '08003' ||
    code === 'ECONNRESET' ||
    code === 'EPIPE' ||
    code === 'ETIMEDOUT'
  ) {
    return true;
  }

  return /Connection terminated|terminating connection|socket hang up|read ECONNRESET|Client has encountered a connection error/i.test(
    message
  );
}

export const createPool = () => {
  if (!global._postgresPool) {
    const databaseUrl = resolvePostgresUrl();
    if (databaseUrl) {
      const { connectionString, ssl } = normalizeConnectionForPool(databaseUrl);

      global._postgresPool = new Pool({
        connectionString,
        ssl,
        max: 5,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 15000,
        allowExitOnIdle: true,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
      });
    } else {
      global._postgresPool = new Pool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        max: 10,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 15000,
        allowExitOnIdle: true,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
      });
    }

    global._postgresPool.on('error', (err) => {
      if (isExpectedPoolDisconnectError(err)) {
        // pg.Pool automatically evicts closed idle clients and reconnects on the next query.
        return;
      }
      console.warn(
        'SQL pool client warning:',
        err instanceof Error ? err.message : String(err)
      );
    });
  }
  return global._postgresPool;
};

export const pool = createPool();

export const db = drizzle(pool, { schema });
