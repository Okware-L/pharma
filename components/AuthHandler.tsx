"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { completeSignIn } from "@/lib/auth";

export default function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleSignIn = async () => {
      const email = localStorage.getItem("emailForSignIn");
      if (email) {
        const user = await completeSignIn(email, window.location.href);
        if (user) {
          localStorage.removeItem("emailForSignIn");
          // Redirect based on user role
          if (user.role === "admin") {
            router.push("/admin");
          } else if (user.role === "doctor") {
            router.push("/doctors");
          } else {
            router.push("/patient");
          }
        } else {
          console.error("Sign-in failed");
          router.push("/login"); // Redirect back to login page on failure
        }
      } else {
        console.error("No email found for sign-in");
        router.push("/login");
      }
    };

    handleSignIn();
  }, [router]);

  return <div>Completing sign-in...</div>;
}
