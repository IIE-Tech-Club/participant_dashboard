"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { signInWithGoogle } from "@/lib/firebase/client";
import ErrorAlert from "@/components/ui/ErrorAlert";
import Loader from "@/components/ui/Loader";

const BACKGROUND_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 33.7) % 100}%`,
  delay: `${(i * 0.5) % 15}s`,
  duration: `${10 + (i * 0.7) % 10}s`,
  opacity: 0.2 + (i * 0.1) % 0.5,
}));

export default function AuthPage() {
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linePositions = useMemo(() =>
    [8, 19, 31, 43, 55, 67, 79, 91].map((left, i) => ({
      left,
      delay: `${i * 0.7}s`,
      duration: `${8 + (i % 4) * 2.5}s`,
      height: `${120 + (i % 3) * 80}px`,
    })), []);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (!result.success) { setError(result.message); setLoading(false); return; }
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: result.data }),
      });
      if (!res.ok) { setError("Authentication service unavailable. Please try again."); setLoading(false); return; }
      window.location.href = "/dashboard";
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-var(--nav-h))] flex items-center justify-center" style={{ background: "var(--bg-void)" }}>
        <div className="scanline-overlay" />
        <Loader text="Verifying session..." />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-var(--nav-h))] flex items-center justify-center p-5 relative overflow-hidden" style={{ background: "var(--bg-void)" }}>

      {/* Background circuits & grid */}
      <div className="tech-grid" aria-hidden="true" />
      <div className="particles-container" aria-hidden="true">
        {BACKGROUND_PARTICLES.map((p, i) => (
          <div
            key={`particle-${i}`}
            className="particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>
      <div className="circuit-bg" aria-hidden="true">
        {linePositions.map((pos, i) => (
          <div key={i} className="circuit-line" style={{ left: `${pos.left}%`, animationDelay: pos.delay, animationDuration: pos.duration, height: pos.height }} />
        ))}
      </div>
      <div className="scanline-overlay" aria-hidden="true" />

      {/* Radial glow */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,245,255,0.06) 0%, transparent 70%)"
      }} />

      <div className="w-full max-w-sm relative z-10">

        {/* Brand */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="section-tag mx-auto mb-5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse-dot" />
            STUDENT.PORTAL
          </div>

          <h1 className="font-orbitron font-black text-5xl md:text-6xl text-white tracking-tight uppercase m-0">
            CODE<span className="text-[#00f5ff]" style={{ textShadow: "0 0 30px rgba(0,245,255,0.6)" }}>CRAFT</span>
          </h1>

          <p className="font-mono-cc text-[11px] text-[rgba(224,247,255,0.35)] mt-4 tracking-[0.25em] uppercase leading-relaxed">
            The next-gen hackathon platform
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 animate-fade-up" style={{ animationDelay: "0.12s", animationFillMode: "both" }}>

          {error && (
            <div className="mb-6">
              <ErrorAlert title="Auth Failed" message={error} onRetry={() => setError(null)} />
            </div>
          )}

          {/* Google sign-in */}
          <button
            id="auth-google-btn"
            onClick={handleSignIn}
            disabled={loading}
            className="neon-btn-cyan w-full py-3.5 text-[11px] tracking-[0.2em]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2.5 scale-75">
                <Loader text="Initializing..." />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2.5">
                {/* Google G */}
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </span>
            )}
          </button>

          <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.04)]">
            <p className="text-center font-mono-cc text-[9px] text-[rgba(224,247,255,0.2)] uppercase tracking-widest">
              Secured via Google OAuth 2.0
            </p>
          </div>
        </div>

        {/* System log lines */}
        <div
          className="mt-8 font-mono-cc text-[9px] text-[rgba(224,247,255,0.18)] uppercase tracking-wider flex flex-col items-center gap-1 animate-fade-up"
          style={{ animationDelay: "0.25s", animationFillMode: "both" }}
        >
          {[
            "[SYS] STABLE_CONNECTION_CONFIRMED",
            "[SEC] AES_256_BIT_ENCRYPTION_ACTIVE",
            "[AUTH] GOOGLE_OAUTH_NODE_READY",
          ].map((line, idx) => (
            <div 
              key={line} 
              className="flex items-center gap-2 animate-fade-up"
              style={{ animationDelay: `${0.4 + (idx * 0.2)}s`, animationFillMode: "both" }}
            >
              <span className="w-1 h-1 rounded-full bg-[rgba(0,245,255,0.3)] animate-pulse" />
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
