"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface EhrUser extends User {
  role: "patient" | "doctor" | "admin";
}

interface AuthContextType {
  user: EhrUser | null;
  loading: boolean;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 second

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<EhrUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (
    firebaseUser: User,
    retryCount = 0
  ): Promise<EhrUser | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          ...firebaseUser,
          role: userData.role as "patient" | "doctor" | "admin",
        };
      } else if (retryCount < MAX_RETRIES) {
        console.log(
          `User document not found, retrying... (${
            retryCount + 1
          }/${MAX_RETRIES})`
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return fetchUserData(firebaseUser, retryCount + 1);
      } else {
        console.error("User document not found after max retries");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("User signed in:", firebaseUser.uid);
        const ehrUser = await fetchUserData(firebaseUser);
        if (ehrUser) {
          setUser(ehrUser);
          console.log("User data fetched and set");
        } else {
          setUser(null);
          console.log("Failed to fetch user data");
        }
      } else {
        console.log("User signed out");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      console.log("Signed in with Google!", result.user.uid);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await auth.signOut();
      console.log("Signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    if (auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken(true);
        console.log("New token generated:", token.substring(0, 10) + "...");
        return token;
      } catch (error) {
        console.error("Error getting auth token:", error);
        return null;
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginGoogle, logout, getAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
