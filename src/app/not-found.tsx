import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[#020408] relative overflow-hidden">
      {/* Ambient background layers */}
      <div className="scanline-overlay" />
      <div className="tech-grid opacity-40" />
      
      <div className="particles-container">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{ 
              left: `${(i * 31) % 100}%`, 
              top: `${(i * 73) % 100}%`,
              animationDelay: `${(i * 0.5) % 5}s`,
              animationDuration: `${10 + ((i * 2) % 10)}s`
            }} 
          />
        ))}
      </div>

      <div className="circuit-bg opacity-30">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="circuit-line" 
            style={{ 
              left: `${i * 15}%`, 
              animationDelay: `${(i * 1.2) % 4}s`,
              height: "250px"
            }} 
          />
        ))}
      </div>

      <div className="w-full max-w-xl text-center relative z-10 animate-fade-up">
        {/* Massive 404 display with glitch */}
        <div className="mb-10 glitch-container group">
          <div 
            className="glitch-text text-[140px] md:text-[180px] leading-none select-none text-white font-orbitron font-black tracking-tighter opacity-90 transition-all group-hover:scale-105"
            data-text="404"
          >
            404
          </div>
          <div className="glitch-glow text-[140px] md:text-[180px] leading-none text-cyan-500 font-orbitron font-black tracking-tighter select-none">
            404
          </div>
        </div>

        <div className="section-tag mx-auto mb-6 px-4 py-1.5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse-dot" />
          Neural Link Broken
        </div>

        <h1 className="font-orbitron font-black text-3xl md:text-4xl text-white uppercase tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          VOID_PATH_EXCEPTION
        </h1>
        
        <p className="font-grotesk text-base text-[rgba(224,247,255,0.5)] leading-relaxed max-w-sm mx-auto mb-10">
          The subnet you are trying to access has been de-indexed or moved to a restricted frequency. 
        </p>

        {/* Diagnostic Console */}
        <div className="mb-10 mx-auto max-w-md text-left glass-card p-5 border-white/5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.3em]">System Diagnostics</span>
          </div>
          
          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex gap-3">
              <span className="text-[#00f5ff]/40">0x8004</span>
              <span className="text-rose-400/80">ERROR: PATH_NOT_RESOLVED</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#00f5ff]/40">0x8005</span>
              <span className="text-white/40">TRACE: next_router.resolve_dynamic_segments()</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#00f5ff]/40">0x8006</span>
              <span className="text-[#00f5ff]/60">STATUS: RE-ROUTING_INITIATED...</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="btn-primary w-full sm:w-auto px-10 py-4 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Return to Dashboard
          </Link>
          <Link href="/" className="btn-ghost w-full sm:w-auto px-10 py-4 text-sm">
            Primary Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}
