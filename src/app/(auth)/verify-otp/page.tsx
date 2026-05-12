"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isValidOTPDigit, extractOTPFromPaste } from "@/utils/auth/otpValidation";

export default function VerifyOTPPage() {
  const router = useRouter();
  const OTP_LENGTH = 6;
  const RESEND_COOLDOWN = 60;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-submit when all digits filled
  useEffect(() => {
    if (otp.every((d) => d !== "") && !loading && !success) {
      handleVerify(otp.join(""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleChange = (index: number, value: string) => {
    // Only allow single digit using utility
    const lastChar = value.slice(-1);
    const digit = isValidOTPDigit(lastChar) ? lastChar : "";
    setError(null);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    // Auto-focus next input
    if (digit && index < OTP_LENGTH - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const extracted = extractOTPFromPaste(pasted);
    if (extracted) {
      setOtp(extracted.split(""));
    }
  };

  const handleVerify = async (code: string) => {
    if (loading || success) return;
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with real API — POST /api/auth/verify-otp
      await new Promise((r) => setTimeout(r, 1200));

      // Mock: treat "000000" as invalid for UX demo
      if (code === "000000") {
        throw new Error("Invalid code");
      }

      setSuccess(true);
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/dashboard");
    } catch {
      setError("Incorrect code. Please check and try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      document.getElementById("otp-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    // TODO: Replace with real API — POST /api/auth/resend-otp
    await new Promise((r) => setTimeout(r, 800));
    setResending(false);
    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError(null);
    document.getElementById("otp-0")?.focus();
  };

  return (
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

          {/* Icon */}
          <div className="otp-icon-wrapper">
            <div className={`otp-icon ${success ? "otp-icon--success" : ""}`}>
              {success ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                </svg>
              )}
            </div>
          </div>

          <h1 className="auth-card-title">
            {success ? "Email Verified!" : "Check your email"}
          </h1>
          <p className="auth-card-subtitle">
            {success
              ? "Redirecting you to your dashboard…"
              : "We sent a 6-digit verification code to your email address."}
          </p>
        </div>

        {!success && (
          <>
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

            {/* OTP Inputs */}
            <div
              className="otp-input-row"
              onPaste={handlePaste}
              role="group"
              aria-label="One-time password input"
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`otp-digit ${digit ? "otp-digit--filled" : ""} ${error ? "otp-digit--error" : ""} ${loading ? "otp-digit--loading" : ""}`}
                  autoFocus={index === 0}
                  autoComplete="one-time-code"
                  aria-label={`Digit ${index + 1}`}
                  disabled={loading}
                />
              ))}
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className="otp-verifying">
                <span className="auth-btn-spinner" aria-hidden="true" />
                <span>Verifying…</span>
              </div>
            )}

            {/* Resend */}
            <div className="otp-resend-row">
              <span className="otp-resend-text">Didn&apos;t receive a code?</span>
              {canResend ? (
                <button
                  type="button"
                  id="btn-otp-resend"
                  onClick={handleResend}
                  disabled={resending}
                  className="otp-resend-btn"
                >
                  {resending ? "Sending…" : "Resend code"}
                </button>
              ) : (
                <span className="otp-countdown">
                  Resend in <strong>{countdown}s</strong>
                </span>
              )}
            </div>
          </>
        )}

        {/* Footer link */}
        <p className="auth-footer-text" style={{ marginTop: 16 }}>
          <Link href="/login" className="auth-footer-link">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
