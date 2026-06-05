"use client";

interface CircuitBackgroundProps {
  className?: string;
  opacity?: number;
}

export default function CircuitBackground({ className = "", opacity = 0.6 }: CircuitBackgroundProps) {
  return (
    <>
      {/* Base Solid Obsidian Background Layer */}
      <div 
        className={`fixed inset-0 z-[-11] bg-[#05050a] ${className}`} 
        aria-hidden="true" 
      />

      {/* Premium Ambient Floating Mesh Gradients */}
      <div 
        className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden"
        style={{ opacity }}
        aria-hidden="true"
      >
        {/* Violet mesh blob floating */}
        <div 
          className="absolute rounded-full blur-[130px] opacity-25 mix-blend-screen animate-pulse-slow"
          style={{
            top: '-10%',
            left: '-10%',
            width: '60vw',
            height: '60vw',
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
          }}
        />

        {/* Hot pink/rose mesh blob floating */}
        <div 
          className="absolute rounded-full blur-[140px] opacity-20 mix-blend-screen"
          style={{
            top: '25%',
            right: '-15%',
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
          }}
        />

        {/* Amber/orange mesh blob floating */}
        <div 
          className="absolute rounded-full blur-[150px] opacity-15 mix-blend-screen"
          style={{
            bottom: '-15%',
            left: '20%',
            width: '55vw',
            height: '40vh',
            background: 'radial-gradient(circle, #f97316 0%, transparent 75%)',
          }}
        />

        {/* Subtle dark radial mask to focus content */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(5,5,10,0.8)_80%)]"
        />
      </div>
    </>
  );
}
