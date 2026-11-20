import {
  cert,
  getApp,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from 'firebase-admin/app';
import { getAuth, type Auth, type DecodedIdToken } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

function parseServiceAccountFromEnv(): ServiceAccount | null {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (rawJson) {
    try {
      const jsonText = rawJson.startsWith('{')
        ? rawJson
        : Buffer.from(rawJson, 'base64').toString('utf8');
      const parsed = JSON.parse(jsonText) as Record<string, unknown>;
      const privateKey =
        typeof parsed.private_key === 'string'
          ? parsed.private_key.replace(/\\n/g, '\n')
          : typeof parsed.privateKey === 'string'
            ? parsed.privateKey.replace(/\\n/g, '\n')
            : undefined;
      const clientEmail =
        typeof parsed.client_email === 'string'
          ? parsed.client_email
          : typeof parsed.clientEmail === 'string'
            ? parsed.clientEmail
            : undefined;
      const projectId =
        typeof parsed.project_id === 'string'
          ? parsed.project_id
          : typeof parsed.projectId === 'string'
            ? parsed.projectId
            : resolveFirebaseProjectId();

      if (clientEmail && privateKey) {
        return {
          projectId,
          clientEmail,
          privateKey,
        };
      }
      return parsed as ServiceAccount;
    } catch (err) {
      console.error(
        'Invalid FIREBASE_SERVICE_ACCOUNT_JSON environment variable, falling back to projectId configuration:',
        err
      );
    }
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
  if (clientEmail && rawPrivateKey) {
    const unquotedKey =
      (rawPrivateKey.startsWith('"') && rawPrivateKey.endsWith('"')) ||
      (rawPrivateKey.startsWith("'") && rawPrivateKey.endsWith("'"))
        ? rawPrivateKey.slice(1, -1)
        : rawPrivateKey;
    return {
      projectId: resolveFirebaseProjectId(),
      clientEmail,
      privateKey: unquotedKey.replace(/\\n/g, '\n'),
    };
  }

  return null;
}

export function resolveFirebaseProjectId(): string {
  return (
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    firebaseConfig.projectId
  );
}

export function hasFirebaseServiceAccount(): boolean {
  return parseServiceAccountFromEnv() !== null;
}

export function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = resolveFirebaseProjectId();
  const expectedClientProjectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || firebaseConfig.projectId;
  const serviceAccount = parseServiceAccountFromEnv();

  if (projectId !== expectedClientProjectId) {
    console.warn(
      `Firebase Admin projectId (${projectId}) differs from client projectId (${expectedClientProjectId}). Client tokens will fail verification if these projects do not match.`
    );
  }

  if (serviceAccount) {
    const resolvedProjectId = serviceAccount.projectId || projectId;
    if (resolvedProjectId !== expectedClientProjectId) {
      console.warn(
        `Firebase service account projectId (${resolvedProjectId}) differs from client projectId (${expectedClientProjectId}).`
      );
    }
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: resolvedProjectId,
    });
  }

  return initializeApp({
    projectId,
  });
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken> {
  return getAdminAuth().verifyIdToken(idToken);
}

export const adminAuth = {
  verifyIdToken: (idToken: string, checkRevoked?: boolean) =>
    getAdminAuth().verifyIdToken(idToken, checkRevoked),
};
