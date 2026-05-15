"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

/**
 * Redirects already-authenticated users away from guest-only pages
 * (login, register, verify-otp) to the dashboard.
 */
export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Don't flash the auth form if the user is already logged in
  if (isAuthenticated) return null;

  return <>{children}</>;
}
