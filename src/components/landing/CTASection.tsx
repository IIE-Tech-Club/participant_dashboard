"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    const run = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (cardRef.current) {
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 40, scale: 0.97 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)",
              scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
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
      {/* BG glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,245,255,0.05)_0%,transparent_70%)]" />

      <div className="max-w-3xl mx-auto text-center" ref={cardRef}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[rgba(0,245,255,0.2)] bg-[rgba(0,245,255,0.04)] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse-dot" />
          <span className="font-orbitron font-bold text-[9px] text-[#00f5ff] uppercase tracking-[0.3em]">Ready to Start?</span>
        </div>

        {/* Headline */}
        <h2 className="font-orbitron font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tighter leading-none mb-4">
          Build{" "}
          <span style={{ color: "#00f5ff", textShadow: "0 0 30px rgba(0,245,255,0.4)" }}>Something</span>
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "2px rgba(139,92,246,0.7)" }}
          >
            Amazing
          </span>
        </h2>

        <p className="font-mono-cc text-sm sm:text-base text-[rgba(224,247,255,0.85)] max-w-prose mx-auto leading-relaxed mb-8 sm:mb-10">
          Join thousands of developers and designers. Participate in your first hackathon today and unlock new opportunities with your community.
        </p>

        {/* Card */}
        <div className="glass-card border-[rgba(0,245,255,0.2)] p-6 sm:p-10 relative overflow-hidden max-w-md mx-auto">
          <div className="card-shimmer" aria-hidden />
          <div className="data-stream-line" />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link
              href="/dashboard"
              className="flex-1 neon-btn-cyan py-3.5 px-6 text-sm flex items-center justify-center gap-2 group magnetic-btn"
            >
              Start Building Now
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <button className="flex-1 btn-primary py-3.5 px-6 text-sm flex items-center justify-center gap-2 magnetic-btn">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read Documentation
            </button>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap justify-center gap-4">
            {["Free to Join", "No Credit Card", "Instant Setup"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-mono-cc text-[9px] text-[rgba(224,247,255,0.4)] uppercase tracking-wider">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
