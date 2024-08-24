"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendMagicLink, completeSignIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";

export default function Login() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { user, loginGoogle } = useAuth();

  useEffect(() => {
    // Handle magic link sign-in
    const handleSignIn = async () => {
      const emailForSignIn = localStorage.getItem("emailForSignIn");
      if (emailForSignIn) {
        const user = await completeSignIn(emailForSignIn, window.location.href);
        if (user) {
          localStorage.removeItem("emailForSignIn");
          // Redirect to patients page after successful sign-in
          router.push("/patient");
        } else {
          console.error("Sign-in failed");
        }
      }
    };

    // Check if the current URL is the result of a magic link sign-in
    if (
      typeof window !== "undefined" &&
      window.location.href.includes("apiKey")
    ) {
      handleSignIn();
    }
  }, [router]);

  useEffect(() => {
    // Redirect to patients page if user is already signed in
    if (user) {
      router.push("/patient");
    }
  }, [user, router]);

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await sendMagicLink(email);
    if (success) {
      localStorage.setItem("emailForSignIn", email);
      alert("Magic link sent! Check your email.");
    } else {
      alert("Error sending magic link. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginGoogle();
      // The user will be redirected in the useEffect hook if sign-in is successful
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Error signing in with Google. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">JM-Qafri Medicine</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Sign in with Magic Link
            </Button>
          </form>
          <div className="mt-4">
            <Button onClick={handleGoogleSignIn} className="w-full">
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
