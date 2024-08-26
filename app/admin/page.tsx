"use client";

import { RoleGuard } from "@/components/role-guard";
import AdminDashboard from "./components/admin-dashboard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <RoleGuard allowedRoles={["admin"]}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
            <AdminDashboard />
          </div>
        </RoleGuard>
      </main>
      <Footer />
    </div>
  );
}
