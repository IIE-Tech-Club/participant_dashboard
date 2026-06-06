"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import type { Hackathon, HackathonProgress } from "@/types/hackathon";

interface HackathonCardProps {
  hackathon: Hackathon;
  progress?: HackathonProgress;
}

export default function HackathonCard({ hackathon, progress }: HackathonCardProps) {
  const completedCount = progress?.responses ? Object.keys(progress.responses).length : 0;
  const total = hackathon.phases?.length || 1;
  const pct = Math.min(Math.round((completedCount / total) * 100), 100);

  const now = new Date();
  const startDate = hackathon.startDate ? new Date(hackathon.startDate) : null;
  const endDate = hackathon.endDate ? new Date(hackathon.endDate) : null;

  const isUpcoming = startDate && now < startDate;
  const isClosed = endDate && now > endDate;
  const isUserCompleted = pct >= 100;
  const isUserStarted = completedCount > 0;

  let statusLabel = "Live";
  let statusColor = "#ec4899"; // Fuchsia
  let statusPulse = true;

  if (isUserCompleted) {
    statusLabel = "Completed";
    statusColor = "#10b981"; // Emerald
    statusPulse = false;
  } else if (isUserStarted) {
    statusLabel = "In Progress";
    statusColor = "#f97316"; // Orange
    statusPulse = true;
  } else if (isClosed) {
    statusLabel = "Closed";
    statusColor = "#ef4444"; // Red
    statusPulse = false;
  } else if (isUpcoming) {
    statusLabel = "Upcoming";
    statusColor = "#a855f7"; // Purple
    statusPulse = false;
  }

  const progressBarRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Animate progress bar when visible
  useEffect(() => {
    if (!progressBarRef.current || !isUserStarted) return;
    const bar = progressBarRef.current;
    let hasAnimated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            const { gsap } = await import("gsap");
            gsap.fromTo(
              bar,
              { width: "0%" },
              {
                width: `${pct}%`,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.2,
              }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(bar);
    return () => observer.disconnect();
  }, [pct, isUserStarted]);

  return (
    <Link
      href={`/dashboard/${hackathon.id}`}
      className="hackathon-card-link outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
    >
      <article
        ref={cardRef}
        className="glass-card hackathon-card-article overflow-hidden flex flex-col md:flex-row items-stretch relative min-h-[160px]"
      >
        {/* Banner image as absolute card background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {hackathon.banner && (hackathon.banner.startsWith("http") || hackathon.banner.startsWith("/")) ? (
            <Image
              src={hackathon.banner}
              alt={hackathon.title}
              fill
              priority
              loading="eager"
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover opacity-30 group-hover:opacity-45 transition-all duration-700 scale-100 group-hover:scale-103"
            />
          ) : hackathon.banner ? (
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: hackathon.banner }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.08) 50%, rgba(249,115,22,0.03) 100%)",
              }}
            />
          )}

          {/* Softer dark linear gradient overlay to make background image more visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#05050a]/75 via-[#05050a]/30 to-[#05050a]/75" />
        </div>

        {/* Shimmer effect layer */}
        <div className="card-shimmer z-1" aria-hidden="true" />

        {/* ── Info Content ── */}
        <div className="p-5 md:p-6 flex flex-col flex-1 justify-center min-w-0 bg-transparent relative z-10">
          {/* Status and phase badge row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Status badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#05050a]/60 border border-white/[0.06] rounded-md backdrop-blur-xs">
              <div className="relative shrink-0">
                <span
                  className={`w-1.5 h-1.5 rounded-full block ${statusPulse ? "animate-pulse-dot" : ""}`}
                  style={{ background: statusColor, boxShadow: statusPulse ? `0 0 8px ${statusColor}` : "none" }}
                />
                {statusPulse && (
                  <span
                    className="absolute inset-[-3px] rounded-full"
                    style={{
                      border: `1px solid ${statusColor}`,
                      animation: "badge-ring 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
                      opacity: 0.5,
                    }}
                  />
                )}
              </div>
              <span
                className="font-mono-cc text-[8.5px] uppercase tracking-wider font-bold"
                style={{ color: statusColor }}
              >
                {statusLabel}
              </span>
            </div>

            {/* Phases count badge */}
            {hackathon.phases?.length > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/[0.04] border border-purple-500/10 rounded-md">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="rgba(192, 132, 252, 0.8)">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="font-mono-cc text-[8.5px] text-purple-300 uppercase tracking-widest font-semibold">
                  {hackathon.phases.length} phases
                </span>
              </div>
            )}
          </div>

          <h2 className="font-orbitron font-black text-lg sm:text-xl text-white uppercase tracking-tight leading-snug group-hover:text-purple-300 transition-colors duration-300 line-clamp-2 mb-0.5">
            {hackathon.title}
          </h2>
          <p className="font-mono-cc text-[9.5px] text-[rgba(241,240,255,0.4)] uppercase tracking-wider font-semibold truncate">
            {hackathon.organizer}
          </p>
          <p className="font-grotesk text-xs text-[rgba(241,240,255,0.5)] mt-2 leading-relaxed line-clamp-2 max-w-2xl">
            {hackathon.tagline}
          </p>

          {/* Date */}
          {hackathon.date && (
            <div className="mt-3 flex items-center gap-2 text-[9.5px] font-mono-cc text-[rgba(241,240,255,0.35)]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="font-semibold">{hackathon.date}</span>
            </div>
          )}
        </div>

        {/* ── Stats & Progress Content ── */}
        <div className="w-full md:w-56 px-5 pb-5 md:px-5 md:py-6 flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l border-white/[0.04] bg-white/[0.01] shrink-0 gap-4 pt-4 md:pt-0 relative z-10">

          {/* Prize / Slots */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-2.5">
            {hackathon.prize && (
              <div className="px-2.5 py-1 bg-amber-500/[0.04] border border-amber-500/20 rounded-md relative overflow-hidden group/prize">
                <span className="font-orbitron font-bold text-[9.5px] text-amber-400 relative z-10">
                  🏆 {hackathon.prize}
                </span>
              </div>
            )}
            {hackathon.slots != null && (
              <span className="font-mono-cc text-[9.5px] text-[rgba(241,240,255,0.35)] uppercase tracking-wide font-semibold">
                {hackathon.slots} slots left
              </span>
            )}
          </div>

          {/* Progress / CTA */}
          <div className="text-right flex flex-col items-end justify-end w-full md:w-auto">
            {isUserStarted ? (
              <div className="w-full md:w-[130px] space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono-cc">
                  <span className="text-purple-300 uppercase tracking-widest font-semibold">Progress</span>
                  <span style={{ color: isUserCompleted ? "#10b981" : "#c084fc" }} className="font-bold">
                    {completedCount}/{total}
                  </span>
                </div>
                <div className="progress-track h-1">
                  <div
                    ref={progressBarRef}
                    className="progress-fill"
                    style={{
                      width: "0%", // animated by GSAP
                      background: isUserCompleted
                        ? "linear-gradient(90deg, rgba(16,185,129,0.5), #10b981)"
                        : undefined,
                    }}
                  />
                </div>
                <p className="text-[9px] font-mono-cc text-right font-semibold" style={{ color: isUserCompleted ? "#10b981" : "#c084fc" }}>
                  {pct}%
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1.5 w-full md:w-auto">
                <span className="font-mono-cc text-[9px] text-[rgba(241,240,255,0.3)] uppercase tracking-widest hidden md:block font-semibold">
                  {isUpcoming ? "Starts soon" : isClosed ? "Entry Closed" : "Ready to Start"}
                </span>
                {!isClosed && (
                  <span className="btn-secondary py-1.5! px-3.5! text-[9.5px] font-bold tracking-widest uppercase transition-all duration-200 group/cta rounded-lg">
                    {isUpcoming ? "Notify" : "Enter"}
                    <span className="cta-arrow ml-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
