"use client";
import { getApps, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

// Get firebase config from firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyCUIIOzNlUBGOKEZZ-CT9fatvAnSSTMMJA",
  authDomain: "jm-pharma.firebaseapp.com",
  projectId: "jm-pharma",
  storageBucket: "jm-pharma.appspot.com",
  messagingSenderId: "1005691740656",
  appId: "1:1005691740656:web:1ea4d55ec5c6f84dcc7d35",
  measurementId: "G-QMGX8K401T",
};

const currentApps = getApps();

let auth: Auth | undefined = undefined;

if (currentApps.length <= 0) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  if (
    process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
    process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
  ) {
    connectAuthEmulator(
      auth,
      `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`
    );
  }
} else {
  auth = getAuth(currentApps[0]);
  if (
    process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
    process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
  ) {
    connectAuthEmulator(
      auth,
      `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`
    );
  }
}

export { auth };
