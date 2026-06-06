"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4m0 0l-4 4m4-4H3" /></svg>,
    title: "Build Together",
    description: "Collaborate with talented developers and designers in real-time hackathons with phase-by-phase progress tracking.",
    color: "#00f5ff",
    bg: "rgba(0,245,255,0.07)",
    border: "rgba(0,245,255,0.2)",
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    title: "Ship Fast",
    description: "From idea to deployed project in 24-48 hours. Structured phases and mentors keep you on track the whole way.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.07)",
    border: "rgba(139,92,246,0.2)",
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
    title: "Win & Showcase",
    description: "Compete for prizes, get your project featured on our hall of fame, and build a killer portfolio.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM16 20a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    title: "Connect & Network",
    description: "Meet industry professionals, mentors, and fellow innovators from around the world. Build lasting relationships.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.07)",
    border: "rgba(16,185,129,0.2)",
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: "Learn & Grow",
    description: "Master new technologies through intensive workshops and mentorship from senior engineers and industry leaders.",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.07)",
    border: "rgba(244,63,94,0.2)",
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    title: "Cloud Resources",
    description: "Instant access to APIs, cloud credits, and premium development tools sponsored by tech leaders.",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.07)",
    border: "rgba(6,182,212,0.2)",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    const run = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Header
        gsap.fromTo(
          ".features-header",
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: ".features-header", start: "top 85%" },
          }
        );

        // Cards
        const cards = sectionRef.current?.querySelectorAll(".feature-item");
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.09, ease: "power2.out",
              scrollTrigger: { trigger: cards[0], start: "top 85%" },
            }
          );
        }
      }, sectionRef);
    };
    run();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-[rgba(0,245,255,0.08)]">
      {/* BG */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-[rgba(0,245,255,0.04)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[rgba(139,92,246,0.04)] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="features-header text-center mb-14 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[rgba(0,245,255,0.2)] bg-[rgba(0,245,255,0.04)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse-dot" />
            <span className="font-orbitron font-bold text-[9px] text-[#00f5ff] uppercase tracking-[0.3em]">Why Join Us</span>
          </div>
          <h2 className="font-orbitron font-black text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tighter">
            Unlock Your{" "}
            <span style={{ color: "#00f5ff", textShadow: "0 0 30px rgba(0,245,255,0.4)" }}>Potential</span>
          </h2>
          <p className="font-mono-cc text-sm sm:text-base text-[rgba(224,247,255,0.5)] max-w-xl mx-auto">
            Everything you need to succeed as a hacker, builder, and innovator
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="feature-item glass-card p-6 sm:p-7 group relative overflow-hidden cursor-default"
            >
              <div className="card-shimmer" aria-hidden />

              {/* Icon */}
              <div
                className="w-11 h-11 mb-5 flex items-center justify-center border transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  borderColor: f.border,
                  background: f.bg,
                  color: f.color,
                  boxShadow: `0 0 0 0 ${f.color}00`,
                }}
              >
                {f.icon}
              </div>

              <h3 className="font-orbitron font-bold text-sm sm:text-base text-white mb-2.5 uppercase tracking-wide">
                {f.title}
              </h3>
              <p className="font-mono-cc text-xs sm:text-sm text-[rgba(224,247,255,0.5)] leading-relaxed">
                {f.description}
              </p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }}
              />

              {/* Top-right corner glow */}
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${f.color}12, transparent 70%)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
