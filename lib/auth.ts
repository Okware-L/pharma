import { auth, db } from "./firebase";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

export type UserRole = "patient" | "doctor" | "admin";

export interface EhrUser extends User {
  role: UserRole;
}

const actionCodeSettings = {
  url:
    process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || "http://localhost:3000/auth",
  handleCodeInApp: true,
};

export const sendMagicLink = async (email: string): Promise<boolean> => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem("emailForSignIn", email);
    return true;
  } catch (error) {
    console.error("Error sending magic link:", error);
    return false;
  }
};

export const completeSignIn = async (
  email: string,
  url: string
): Promise<EhrUser | null> => {
  if (isSignInWithEmailLink(auth, url)) {
    try {
      const result = await signInWithEmailLink(auth, email, url);
      const userRole = await getUserRole(result.user.uid);

      // If the user is new, set a default role
      if (!userRole) {
        await setDoc(doc(db, "users", result.user.uid), {
          role: "patient", // Default role
        });
      }

      return { ...result.user, role: userRole || "patient" } as EhrUser;
    } catch (error) {
      console.error("Error completing sign-in:", error);
      return null;
    }
  }
  return null;
};

export const getUserRole = async (uid: string): Promise<UserRole | null> => {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data().role as UserRole;
  }
  return null;
};

export const getCurrentUser = async (): Promise<EhrUser | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  const role = await getUserRole(user.uid);
  return { ...user, role: role || "patient" } as EhrUser;
};
