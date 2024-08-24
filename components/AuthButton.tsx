"use client";

import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <Button
        onClick={handleSignOut}
        className="py-2 px-4 rounded-md no-underline bg-slate-800 "
      >
        Logout
      </Button>
    </div>
  ) : (
    <Link href="/login" className="py-2 px-3 flex rounded-md no-underline ">
      <Button variant="outline">Sign In / Sign Up</Button>
    </Link>
  );
}
