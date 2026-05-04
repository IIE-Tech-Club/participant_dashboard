"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { signInWithGoogle } from "@/lib/firebase/client";
import ErrorAlert from "@/components/ui/ErrorAlert";
import Loader from "@/components/ui/Loader";

export default function AuthPage() {
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-[calc(100vh-var(--nav-h))] flex items-center justify-center p-5 relative overflow-hidden bg-transparent">

      {/* Background circuits & grid */}

      {/* Background circuits & grid handled globally */}
      <div className="particles-container" aria-hidden="true" />

      {/* Radial glow */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,245,255,0.06) 0%, transparent 70%)"
      }} />

      <div className="w-full max-w-6xl relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left animate-fade-up">
          <div className="section-tag mx-auto lg:mx-0 mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse-dot" />
            IIE.TECH.CLUB.PORTAL
          </div>

          <h1 className="font-orbitron font-black text-5xl md:text-7xl text-white tracking-tight uppercase m-0 leading-tight">
            IIE <br className="hidden md:block" />
            <span className="text-[#00f5ff]" style={{ textShadow: "0 0 30px rgba(0,245,255,0.6)" }}>TECH CLUB</span>
          </h1>

          <p className="font-mono-cc text-sm md:text-base text-[rgba(224,247,255,0.6)] mt-6 tracking-wide leading-relaxed max-w-xl mx-auto lg:mx-0">
            Welcome to the official portal of the IIE Tech Club. A community of innovators, builders, and visionaries. Join us to participate in hackathons, workshops, and exclusive tech events.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start font-mono-cc text-[10px] text-[rgba(0,245,255,0.8)] uppercase tracking-widest">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#00f5ff] animate-pulse" />
              INNOVATE
            </div>
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#00f5ff] animate-pulse" style={{ animationDelay: '0.2s' }} />
              INSPIRE
            </div>
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#00f5ff] animate-pulse" style={{ animationDelay: '0.4s' }} />
              ELEVATE
            </div>
          </div>
        </div>

        {/* Right Content - Auth Card */}
        <div className="w-full max-w-md shrink-0">
          <div className="glass-card p-8 animate-fade-up" style={{ animationDelay: "0.12s", animationFillMode: "both" }}>

            {error && (
              <div className="mb-6">
                <ErrorAlert title="Auth Failed" message={error} onRetry={() => setError(null)} />
              </div>
            )}

            {/* Title inside card */}
            <h2 className="font-orbitron text-xl text-center text-white mb-6 tracking-wider uppercase">
              Club Access
            </h2>

            {/* Google sign-in */}
            <button
              id="auth-google-btn"
              onClick={handleSignIn}
              disabled={loading || authLoading}
              className="neon-btn-cyan w-full py-3.5 text-[11px] tracking-[0.2em]"
            >
              {loading || authLoading ? (
                <span className="flex items-center justify-center gap-2.5 scale-75">
                  <Loader text="Initializing..." />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  REGISTER / ENTER
                </span>
              )}
            </button>

            <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.04)]">
              <p className="text-center font-mono-cc text-[9px] text-[rgba(224,247,255,0.2)] uppercase tracking-widest flex items-center justify-center gap-2">
                <svg width="10" height="10" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
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
    </div>
  );
}
