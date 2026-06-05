"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "This platform transformed how we organize hackathons. The participant dashboard made everything seamless and transparent!",
    author: "Sarah Chen",
    role: "Hackathon Organizer",
    project: "TechStart 2024",
    gradient: "from-[#00f5ff] to-[#8b5cf6]",
    initials: "SC",
    rating: 5,
  },
  {
    quote: "Built my first AI project here. The resources, mentorship, and community support were absolutely incredible.",
    author: "Alex Rodriguez",
    role: "Full-Stack Developer",
    project: "AI Chat Assistant",
    gradient: "from-[#8b5cf6] to-[#f43f5e]",
    initials: "AR",
    rating: 5,
  },
  {
    quote: "Won my first hackathon! The phase tracking system helped me stay organized and submit on time without any stress.",
    author: "Jordan Kim",
    role: "Student Developer",
    project: "IoT Smart Home",
    gradient: "from-[#10b981] to-[#00f5ff]",
    initials: "JK",
    rating: 5,
  },
  {
    quote: "The networking opportunities were incredible. I landed an internship through connections I made right here!",
    author: "Emma Wilson",
    role: "CS Graduate",
    project: "Mobile App",
    gradient: "from-[#f59e0b] to-[#10b981]",
    initials: "EW",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    const run = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          ".testimonials-header",
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: ".testimonials-header", start: "top 85%" },
          }
        );

        const cards = sectionRef.current?.querySelectorAll(".testimonial-item");
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, x: -28 },
            {
              opacity: 1, x: 0, duration: 0.65, stagger: 0.12, ease: "power2.out",
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
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[rgba(139,92,246,0.05)] rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[rgba(0,245,255,0.04)] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="testimonials-header text-center mb-14 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[rgba(0,245,255,0.2)] bg-[rgba(0,245,255,0.04)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse-dot" />
            <span className="font-orbitron font-bold text-[9px] text-[#00f5ff] uppercase tracking-[0.3em]">Community Voices</span>
          </div>
          <h2 className="font-orbitron font-black text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tighter">
            What Builders{" "}
            <span style={{ color: "#00f5ff", textShadow: "0 0 30px rgba(0,245,255,0.4)" }}>Say</span>
          </h2>
          <p className="font-mono-cc text-sm sm:text-base text-[rgba(224,247,255,0.5)] max-w-xl mx-auto">
            Real stories from real innovators who transformed their ideas into reality
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t.author}
              className="testimonial-item glass-card p-6 sm:p-8 flex flex-col group relative overflow-hidden"
            >
              <div className="card-shimmer" aria-hidden />

              {/* Giant quote mark */}
              <div className="absolute top-3 right-5 font-orbitron font-black text-7xl text-[rgba(0,245,255,0.05)] pointer-events-none select-none leading-none">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-[#f59e0b]" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="font-charm text-sm sm:text-base text-[rgba(224,247,255,0.78)] mb-6 leading-relaxed italic flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-[rgba(0,245,255,0.08)] pt-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(0,245,255,0.15)]`}>
                  <span className="font-bold text-black text-sm">{t.initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-orbitron font-bold text-xs text-white uppercase tracking-wide truncate">{t.author}</p>
                  <p className="font-mono-cc text-[10px] text-[rgba(224,247,255,0.4)] truncate">{t.role} · {t.project}</p>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.4)] to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
