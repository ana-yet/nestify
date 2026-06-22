import admin from 'firebase-admin';

let initialized = false;

const initFirebaseAdmin = () => {
  if (initialized) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin credentials missing.');
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
  initialized = true;
};

export const getFirebaseAuth = () => {
  initFirebaseAdmin();
  return admin.apps.length ? admin.auth() : null;
};

export default initFirebaseAdmin;
