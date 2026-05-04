"use client";

import Link from "next/link";
import Image from "next/image";
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
  let statusColor = "#00f5ff";
  let statusPulse = true;

  if (isUserCompleted) {
    statusLabel = "Completed";
    statusColor = "#10b981";
    statusPulse = false;
  } else if (isUserStarted) {
    statusLabel = "In Progress";
    statusColor = "#f59e0b";
    statusPulse = true;
  } else if (isClosed) {
    statusLabel = "Closed";
    statusColor = "#f43f5e";
    statusPulse = false;
  } else if (isUpcoming) {
    statusLabel = "Upcoming";
    statusColor = "rgba(224,247,255,0.3)";
    statusPulse = false;
  }

  return (
    <Link
      href={`/dashboard/${hackathon.id}`}
      className="block group outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,245,255,0.5)]"
    >
      <article className="glass-card overflow-hidden flex flex-col sm:flex-row items-stretch group-hover:border-[rgba(0,245,255,0.3)] transition-all duration-300">

        {/* ── Left Banner ── */}
        <div className="w-full sm:w-56 md:w-64 h-40 sm:h-auto relative flex items-end overflow-hidden bg-[#040b14] shrink-0">
          {hackathon.banner && (hackathon.banner.startsWith("http") || hackathon.banner.startsWith("/")) ? (
            <Image
              src={hackathon.banner}
              alt={hackathon.title}
              fill
              priority
              loading="eager"
              sizes="(max-width: 640px) 100vw, 256px"
              className="absolute inset-0 object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700"
            />
          ) : hackathon.banner ? (
            <div
              className="absolute inset-0 opacity-25"
              style={{ background: hackathon.banner }}
            />
          ) : (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,245,255,0.25) 0%, rgba(139,92,246,0.2) 50%, rgba(0,245,255,0.1) 100%)",
              }}
            />
          )}



          {/* Gradient fades */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-[rgba(4,11,20,0.15)] to-[#040b14] hidden sm:block" />
          <div className="absolute inset-0 bg-linear-to-t from-[#040b14] via-[rgba(4,11,20,0.3)] to-transparent sm:hidden" />

          {/* Status badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 bg-[rgba(0,0,0,0.75)] border border-[rgba(255,255,255,0.06)] backdrop-blur-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusPulse ? "animate-pulse-dot" : ""}`}
              style={{ background: statusColor, boxShadow: statusPulse ? `0 0 6px ${statusColor}` : "none" }}
            />
            <span
              className="font-mono-cc text-[9px] uppercase tracking-wider font-bold"
              style={{ color: statusColor }}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        {/* ── Middle Info ── */}
        <div className="p-4 sm:p-5 md:py-6 flex flex-col flex-1 justify-center min-w-0 bg-[#040b14]">
          <h2 className="font-orbitron font-black text-base sm:text-lg md:text-xl text-white uppercase tracking-tight leading-snug group-hover:text-[#00f5ff] transition-colors duration-300 line-clamp-2 sm:truncate">
            {hackathon.title}
          </h2>
          <p className="font-mono-cc text-[10px] text-[rgba(224,247,255,0.35)] mt-1 uppercase tracking-widest truncate">
            {hackathon.organizer}
          </p>
          <p className="font-mono-cc text-xs text-[rgba(224,247,255,0.4)] mt-2 leading-relaxed line-clamp-2 max-w-2xl">
            {hackathon.tagline}
          </p>

          {/* Date */}
          {hackathon.date && (
            <div className="mt-3 flex items-center gap-2 text-[10px] font-mono-cc text-[rgba(224,247,255,0.3)]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{hackathon.date}</span>
            </div>
          )}
        </div>

        {/* ── Right Stats / CTA ── */}
        <div className="w-full sm:w-48 md:w-52 px-4 pb-4 sm:px-4 sm:py-6 flex flex-row sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 sm:border-l border-[rgba(255,255,255,0.05)] bg-[rgba(2,6,23,0.3)] shrink-0 gap-4 pt-3 sm:pt-0">

          {/* Prize / Slots */}
          <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-2">
            {hackathon.prize && (
              <div className="px-2.5 py-1 bg-[rgba(0,0,0,0.5)] border border-[rgba(245,158,11,0.3)]">
                <span className="font-orbitron font-bold text-[10px] text-[#f59e0b]">
                  {hackathon.prize}
                </span>
              </div>
            )}
            {hackathon.slots != null && (
              <span className="font-mono-cc text-[10px] text-[rgba(224,247,255,0.3)]">
                {hackathon.slots} slots left
              </span>
            )}
          </div>

          {/* Progress / CTA */}
          <div className="text-right flex flex-col items-end justify-end">
            {isUserStarted ? (
              <div className="w-full max-w-[130px] space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono-cc">
                  <span className="text-[rgba(0,245,255,0.6)] uppercase tracking-widest">Progress</span>
                  <span style={{ color: isUserCompleted ? "#10b981" : "#00f5ff" }}>
                    {completedCount}/{total}
                  </span>
                </div>
                <div className="progress-track h-1.5">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: isUserCompleted
                        ? "linear-gradient(90deg, rgba(16,185,129,0.5), #10b981)"
                        : undefined,
                    }}
                  />
                </div>
                <p className="text-[9px] font-mono-cc text-right" style={{ color: isUserCompleted ? "#10b981" : "#00f5ff" }}>
                  {pct}%
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono-cc text-[9px] text-[rgba(224,247,255,0.25)] uppercase tracking-widest hidden sm:block">
                  {isUpcoming ? "Starts soon" : isClosed ? "Entry Closed" : "Ready to Start"}
                </span>
                {!isClosed && (
                  <span className="font-orbitron font-bold text-[10px] text-[#00f5ff] flex items-center gap-1 group-hover:gap-2 transition-all duration-200 uppercase tracking-wider bg-[rgba(0,245,255,0.05)] border border-[rgba(0,245,255,0.2)] px-2.5 py-1.5">
                    {isUpcoming ? "Notify" : "Enter"}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
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
