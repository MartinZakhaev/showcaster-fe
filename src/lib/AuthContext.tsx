"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, setToken, clearToken } from './api';

interface AuthContextValue {
  token: string | null;
  /** Email stored temporarily between register → verify-otp */
  pendingEmail: string | null;
  setPendingEmail: (email: string | null) => void;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = getToken();
    if (stored) setTokenState(stored);

    const email = sessionStorage.getItem('sc_pending_email');
    if (email) setPendingEmail(email);
  }, []);

  const login = useCallback((t: string) => {
    setToken(t);
    setTokenState(t);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  const handleSetPendingEmail = useCallback((email: string | null) => {
    setPendingEmail(email);
    if (email) sessionStorage.setItem('sc_pending_email', email);
    else sessionStorage.removeItem('sc_pending_email');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        pendingEmail,
        setPendingEmail: handleSetPendingEmail,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
