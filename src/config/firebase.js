const { initializeApp, cert, getApps, getApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const requiredEnv = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing Firebase environment variable: ${key}`);
  }
}

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

const firebaseApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(firebaseConfig),
    });

const db = getFirestore(firebaseApp);

module.exports = {
  db,
  firebaseApp,
};