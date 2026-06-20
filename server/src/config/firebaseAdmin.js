import admin from 'firebase-admin';

let firebaseApp = null;

const initFirebaseAdmin = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      'Firebase Admin credentials missing. Google login and token verification will fail until configured.'
    );
    return null;
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return firebaseApp;
};

export const getFirebaseAuth = () => {
  initFirebaseAdmin();
  return admin.apps.length ? admin.auth() : null;
};

export default initFirebaseAdmin;
