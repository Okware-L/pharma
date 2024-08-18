"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { UserRole } from "@/lib/auth";

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
        router.push("/login");
      } else if (user.role && allowedRoles.includes(user.role)) {
        setIsAuthorized(true);
      } else {
        router.push("/"); // Redirect to home if user doesn't have the required role
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? <>{children}</> : null;
};
