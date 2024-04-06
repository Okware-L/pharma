import { useAuth } from "@clerk/nextjs";
import { getAuth, signInWithCustomToken } from "firebase/auth";
//import { initializeApp } from "firebase/app";
import { app } from "../firebaseConfig";

export const useClerkAuth = () => {
  const { getToken } = useAuth();

  const signInWithClerk = async () => {
    const auth = getAuth(app);

    const token = await getToken({ template: "integration_firebase" });
    if (token) {
      const userCredentials = await signInWithCustomToken(auth, token);
      console.log("user ::", userCredentials.user);
    } else {
      console.error("Token is null");
    }
  };

  return { signInWithClerk };
};

{
  /**

import React from "react";

const signIn = async () => {
  const { getToken } = useAuth();
  const auth = getAuth();
  const token = await getToken({ template: "integration_firebase" });
  if (token) {
    const userCredentials = await signInWithCustomToken(auth, token);
    console.log("user ::", userCredentials.user);
  } else {
    console.error("Token is null");
  }

  return <div>signIn</div>;
};

export default signIn;

*/
}
