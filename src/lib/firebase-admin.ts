import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

if (!getApps().length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let initializedWithCert = false;
  if (serviceAccountJson) {
    try {
      initializeApp({
        credential: cert(JSON.parse(serviceAccountJson)),
        projectId: firebaseConfig.projectId,
      });
      initializedWithCert = true;
    } catch (err) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON, falling back to projectId config:', err);
    }
  }
  if (!initializedWithCert) {
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
}

export const adminAuth = getAuth();
