"use client";

import { useEffect, useRef, useState } from "react";

function useCounter(end: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 4)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

const stats = [
  { num: 500, suffix: "+", label: "Participants", sub: "From enthusiasts to pros", color: "#00f5ff" },
  { num: 50, suffix: "+", label: "Hackathons", sub: "Diverse themes & levels", color: "#8b5cf6" },
  { num: 1000, suffix: "+", label: "Projects Built", sub: "Innovative solutions", color: "#10b981" },
  { num: 500, suffix: "K+", label: "In Prizes", sub: "Distributed to winners", color: "#f59e0b", prefix: "$" },
];

function StatCard({ stat, started }: { stat: typeof stats[0]; started: boolean }) {
  const val = useCounter(stat.num, 1600, started);
  return (
    <div className="glass-card p-6 sm:p-8 text-center group relative overflow-hidden">
      <div className="card-shimmer" aria-hidden />
      <div
        className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl mb-2 group-hover:scale-105 transition-transform duration-300 tabular-nums"
        style={{ color: stat.color, textShadow: `0 0 24px ${stat.color}44` }}
      >
        {stat.prefix ?? ""}{val}{stat.suffix}
      </div>
      <h3 className="font-orbitron font-bold text-sm sm:text-base text-white mb-1 uppercase tracking-wide">{stat.label}</h3>
      <p className="font-mono-cc text-[10px] sm:text-xs text-[rgba(224,247,255,0.4)]">{stat.sub}</p>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-px transition-all duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${stat.color}88, transparent)` }}
      />
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    const run = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Marquee label
        gsap.fromTo(
          ".stats-label",
          { opacity: 0, x: -20 },
          {
            opacity: 1, x: 0, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
          }
        );

        // Stat cards
        const cards = sectionRef.current?.querySelectorAll(".glass-card");
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, scale: 0.85 },
            {
              opacity: 1, scale: 1, duration: 0.55, stagger: 0.1, ease: "back.out(1.4)",
              scrollTrigger: { trigger: sectionRef.current, start: "top 80%", onEnter: () => setStarted(true) },
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
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_50%,rgba(0,245,255,0.04)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="stats-label flex items-center gap-4 mb-10 sm:mb-14">
          <div className="w-6 h-px bg-[rgba(0,245,255,0.4)]" />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[rgba(0,245,255,0.2)] bg-[rgba(0,245,255,0.04)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse-dot" />
            <span className="font-orbitron font-bold text-[9px] text-[#00f5ff] uppercase tracking-[0.3em]">By The Numbers</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
