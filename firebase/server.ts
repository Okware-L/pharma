import { cert, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Auth, getAuth } from "firebase-admin/auth";
import serviceAccount from "./serviceAccount.json";

let firestore: Firestore | undefined = undefined;
let auth: Auth | undefined = undefined;

try {
  if (getApps().length === 0) {
    console.log("Initializing Firebase Admin SDK");
    const app = initializeApp({
      credential: cert(serviceAccount as any),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });
    firestore = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase Admin SDK initialized successfully");
  } else {
    console.log("Firebase Admin SDK already initialized");
    const app = getApps()[0];
    firestore = getFirestore(app);
    auth = getAuth(app);
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

export { firestore, auth };
