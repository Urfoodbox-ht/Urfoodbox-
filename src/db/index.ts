import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const isValidPostgresUrl = (value?: string): value is string => {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed.startsWith('postgres://') || trimmed.startsWith('postgresql://');
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
    if (isValidPostgresUrl(candidate)) {
      return candidate.trim();
    }
  }
  return null;
}

export function hasConfiguredDatabase(): boolean {
  if (resolvePostgresUrl()) return true;
  return Boolean(process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_DB_NAME);
}

export const createPool = () => {
  if (!global._postgresPool) {
    const databaseUrl = resolvePostgresUrl();
    if (databaseUrl) {
      const useSsl =
        process.env.DATABASE_SSL !== 'false' &&
        !databaseUrl.includes('localhost') &&
        !databaseUrl.includes('127.0.0.1');

      global._postgresPool = new Pool({
        connectionString: databaseUrl,
        ssl: useSsl ? { rejectUnauthorized: false } : false,
        max: 5,
        idleTimeoutMillis: 20000,
        connectionTimeoutMillis: 15000,
      });
    } else {
      global._postgresPool = new Pool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        max: 10,
        connectionTimeoutMillis: 15000,
      });
    }

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

export const pool = createPool();

export const db = drizzle(pool, { schema });
