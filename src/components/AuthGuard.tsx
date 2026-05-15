"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

/**
 * Redirects unauthenticated users to /login.
 * Wrap any protected layout or page with this component.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Don't render children until we know the user is authenticated.
  // This prevents a flash of protected content before the redirect fires.
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
