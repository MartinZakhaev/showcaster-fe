"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleSSOButton from "@/components/auth/GoogleSSOButton";
import { getPasswordStrength } from "@/utils/auth/passwordStrength";
import { apiRegister, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import GuestGuard from "@/components/GuestGuard";

export default function RegisterPage() {
  const router = useRouter();
  const { setPendingEmail } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength.score < 3) {
      setError("Please choose a stronger password.");
      return;
    }
    if (!agreeTerms) {
      setError("You must accept the Terms of Service to continue.");
      return;
    }

    setLoading(true);
    try {
      await apiRegister({ email, fullName, password });
      setPendingEmail(email);
      router.push("/verify-otp");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSSO = () => {
    setGoogleLoading(true);
    // TODO: Replace with real Google OAuth — e.g. signIn("google")
    setTimeout(() => setGoogleLoading(false), 1500);
  };

  return (
    <GuestGuard>
    <div className="auth-card-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-card-header">
          <div className="auth-card-logo-mobile">
            <div className="auth-brand-logo-mark" style={{ width: 36, height: 36 }}>
              <span style={{ fontSize: 14 }}>SC</span>
            </div>
            <span className="auth-brand-logo-name" style={{ color: '#1e293b', fontSize: 18 }}>Showcaster</span>
          </div>
          <h1 className="auth-card-title">Create your account</h1>
          <p className="auth-card-subtitle">
            Start generating viral videos in under 5 minutes
          </p>
        </div>

        {/* Google SSO */}
        <GoogleSSOButton onClick={handleGoogleSSO} loading={googleLoading} label="Sign up with Google" />

        {/* Divider */}
        <div className="auth-divider">
          <span>or register with email</span>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error" role="alert">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5"/>
              <path d="M8 5v3M8 11h.01" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Full Name */}
          <div className="auth-field">
            <label htmlFor="register-name" className="auth-label">
              Full name
            </label>
            <input
              id="register-name"
              type="text"
              name="name"
              autoComplete="name"
              required
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="auth-input"
            />
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="register-email" className="auth-label">
              Email address
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="register-password" className="auth-label">
              Password
            </label>
            <div className="auth-input-group">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                required
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
              <button
                type="button"
                className="auth-input-action"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Strength bar */}
            {password && (
              <div className="pw-strength-wrapper" aria-label={`Password strength: ${strength.label}`}>
                <div className="pw-strength-bars">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className="pw-strength-bar"
                      style={{
                        backgroundColor:
                          strength.score >= level ? strength.color : "#E2E8F0",
                        transition: "background-color 0.3s ease",
                      }}
                    />
                  ))}
                </div>
                <span className="pw-strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label htmlFor="register-confirm" className="auth-label">
              Confirm password
            </label>
            <div className="auth-input-group">
              <input
                id="register-confirm"
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                required
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`auth-input ${
                  confirmPassword && confirmPassword !== password
                    ? "auth-input--error"
                    : confirmPassword && confirmPassword === password
                    ? "auth-input--success"
                    : ""
                }`}
              />
              <button
                type="button"
                className="auth-input-action"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="auth-field-error">Passwords do not match</p>
            )}
          </div>

          {/* Terms */}
          <label className="auth-checkbox-label" htmlFor="register-terms">
            <input
              id="register-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="auth-checkbox"
            />
            <span>
              I agree to the{" "}
              <Link href="#" className="auth-footer-link">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="auth-footer-link">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit */}
          <button
            id="btn-register-submit"
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? (
              <>
                <span className="auth-btn-spinner" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link href="/login" className="auth-footer-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
    </GuestGuard>
  );
}
