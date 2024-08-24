"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

// Define the allowed roles
type UserRole = "patient" | "doctor" | "admin";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If there's no user, redirect to login page
        router.push("/login");
      } else if (user.role && allowedRoles.includes(user.role)) {
        // If the user's role is in the allowed roles, authorize access
        setIsAuthorized(true);
      } else {
        // If the user's role is not allowed, redirect to home or an unauthorized page
        router.push("/"); // or "/unauthorized"
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    // Show a loading indicator while checking authorization
    return <div>Loading...</div>;
  }

  // Only render the children if the user is authorized
  return isAuthorized ? <>{children}</> : null;
};
