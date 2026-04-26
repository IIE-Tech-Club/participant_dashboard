import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "var(--bg-void)" }}>
      <div className="scanline-overlay" />

      {/* Ambient grid */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,245,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)",
          backgroundSize: "3.5rem 3.5rem",
        }}
      />

      <div className="w-full max-w-lg text-center relative z-10 animate-fade-up">
        {/* 404 display */}
        <div className="mb-4 relative">
          <span
            className="font-orbitron font-black text-[100px] leading-none select-none"
            style={{
              background: "linear-gradient(135deg, rgba(0,245,255,0.9) 0%, rgba(0,245,255,0.2) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </span>
          {/* Ghost duplicate for glitch look */}
          <span
            className="font-orbitron font-black text-[100px] leading-none select-none absolute inset-0 opacity-20"
            style={{
              color: "#f43f5e",
              transform: "translate(2px, -2px)",
              clipPath: "inset(30% 0 40% 0)",
            }}
          >
            404
          </span>
        </div>

        <div className="section-tag mx-auto mb-5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse-dot" />
          Route Not Found
        </div>

        <h1 className="font-orbitron font-black text-2xl text-white uppercase tracking-tight mb-3">
          Signal Lost
        </h1>
        <p className="font-mono-cc text-sm text-[rgba(224,247,255,0.4)] leading-relaxed max-w-xs mx-auto mb-8">
          The coordinates you requested do not exist within the system. Verify the path and try again.
        </p>

        {/* Console-style log */}
        <div className="mb-8 mx-auto max-w-sm text-left px-4 py-3 border border-[rgba(0,245,255,0.08)] bg-[rgba(0,245,255,0.02)]">
          <p className="font-mono-cc text-[9px] text-[rgba(0,245,255,0.3)] uppercase tracking-widest mb-1.5">
            [SYS] Diagnostic Output
          </p>
          <p className="font-mono-cc text-[10px] text-[rgba(244,63,94,0.6)]">
            ERROR: PATH_NOT_FOUND → 0x404
          </p>
          <p className="font-mono-cc text-[10px] text-[rgba(224,247,255,0.25)]">
            TRACE: Route resolution failed at navigation layer
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Return Home
          </Link>
          <Link href="/" className="btn-ghost">
            Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
