import type { Metadata } from "next";
import type React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: "Showcaster — Sign In",
  description:
    "Sign in to Showcaster — the AI-powered video generation platform for affiliators.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <div className="auth-root">
        {/* ── Left brand panel ── */}
        <aside className="auth-brand-panel" aria-hidden="true">
          {/* Animated mesh gradient */}
          <div className="auth-brand-bg" />

          {/* Logo */}
          <div className="auth-brand-logo">
            <div className="auth-brand-logo-mark">
              <span>SC</span>
            </div>
            <span className="auth-brand-logo-name">Showcaster</span>
          </div>

          {/* Hero copy */}
          <div className="auth-brand-hero">
            <h2 className="auth-brand-headline">
              Turn any product into a&nbsp;viral video — in&nbsp;minutes.
            </h2>
            <p className="auth-brand-tagline">
              AI-generated hook-to-closure pipelines trusted by 10,000+
              affiliators across TikTok, Reels &amp; YouTube Shorts.
            </p>
          </div>

          {/* Feature pills */}
          <ul className="auth-brand-features">
            {[
              "4-step AI video pipeline",
              "Midtrans-powered billing",
              "Real-time analytics",
              "Multi-platform export",
            ].map((f) => (
              <li key={f} className="auth-brand-feature-pill">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="7" cy="7" r="7" fill="rgba(255,255,255,0.15)" />
                  <path
                    d="M4 7l2 2 4-4"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          {/* Testimonial */}
          <blockquote className="auth-brand-testimonial">
            <p>
              &ldquo;We went from 3 video editors to zero. Showcaster
              handles&nbsp;everything.&rdquo;
            </p>
            <footer>
              <strong>Arya Santosa</strong>
              <span>Head of Growth, TERRA</span>
            </footer>
          </blockquote>
        </aside>

        {/* ── Right form panel ── */}
        <main className="auth-form-panel">{children}</main>
      </div>
    </AntdRegistry>
  );
}
