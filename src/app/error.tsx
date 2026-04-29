"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-[calc(100vh-var(--nav-h))] flex items-center justify-center p-5" style={{ background: "var(--bg-void)" }}>
      <div className="scanline-overlay" />

      <div className="w-full max-w-lg text-center animate-fade-up scanlines-glitch py-12">
        {/* Glitchy error code */}
        <div className="mb-8 glitch-container">
          <div 
            className="glitch-text text-[100px] md:text-[130px] leading-none select-none text-rose-500"
            data-text="500"
          >
            500
          </div>
          <div className="glitch-glow text-[100px] md:text-[130px] leading-none text-rose-600">500</div>
        </div>

        <div className="section-tag mx-auto mb-5 w-fit border-[rgba(244,63,94,0.25)] bg-[rgba(244,63,94,0.05)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
          <span className="text-[#f43f5e]">System Exception</span>
        </div>

        <h1 className="font-orbitron font-black text-2xl text-white uppercase tracking-tight mb-3">
          Critical Failure
        </h1>
        <p className="font-mono-cc text-sm text-[rgba(224,247,255,0.4)] leading-relaxed max-w-sm mx-auto mb-8">
          An unexpected error has disrupted the system. Our diagnostics have been notified.
        </p>

        {error.digest && (
          <div className="mb-6 mx-auto max-w-xs font-mono-cc text-[9px] text-[rgba(224,247,255,0.2)] uppercase tracking-wider border border-[rgba(255,255,255,0.05)] px-3 py-2">
            Digest: {error.digest}
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
            </svg>
            Retry
          </button>
          <Link href="/dashboard" className="btn-ghost">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
