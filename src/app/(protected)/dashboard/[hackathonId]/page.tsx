"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/ui/Loader";
import DynamicPhase from "@/components/phases/DynamicPhase";
import JudgePanel from "@/components/phases/JudgePanel";
import { fetchProgress, isPhaseUnlocked } from "@/store/hackathonStore";
import { useAuth } from "@/hooks/useAuth";
import ErrorAlert from "@/components/ui/ErrorAlert";
import type { HackathonProgress, Hackathon } from "@/types/hackathon";
import { API_BASE_URL } from "@/lib/site";

export default function HackathonDetailPage() {
  const { loading: authLoading, user, error: authError } = useAuth();
  const { hackathonId } = useParams<{ hackathonId: string }>();

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [hackathonLoading, setHackathonLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [progress, setProgress] = useState<HackathonProgress | null>(null);
  const [activePhaseId, setActivePhaseId] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [acceptingJudge, setAcceptingJudge] = useState(false);

  useEffect(() => {
    const fetchHackathon = async () => {
      setFetchError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/hackathons/${hackathonId}`
        );
        if (!res.ok) throw new Error("Failed to retrieve mission data from terminal.");
        setHackathon(await res.json());
      } catch (err: unknown) {
        console.error("Failed to fetch hackathon:", err);
        setFetchError(err instanceof Error ? err.message : "Connection to neural link severed.");
      } finally {
        setHackathonLoading(false);
      }
    };
    fetchHackathon();
  }, [hackathonId]);

  useEffect(() => {
    const init = async () => {
      if (!user || !hackathonId || !hackathon) return;
      const p = await fetchProgress(hackathonId, user.uid);
      setProgress(p);
      const phases = hackathon.phases || [];
      let deepest = phases[0]?.id ?? "";
      for (const ph of phases) {
        if (isPhaseUnlocked(phases, p.responses, ph.id)) deepest = ph.id;
      }
      setActivePhaseId(deepest);
      setMounted(true);
    };
    if (!authLoading && !hackathonLoading) init();
  }, [hackathonId, user, authLoading, hackathonLoading, hackathon]);

  const refreshProgress = async () => {
    if (!user || !hackathonId || !hackathon) return;
    const p = await fetchProgress(hackathonId, user.uid);
    setProgress(p);
    const phases = hackathon.phases || [];
    let deepest = phases[0]?.id ?? "";
    for (const ph of phases) {
      if (isPhaseUnlocked(phases, p.responses, ph.id)) deepest = ph.id;
    }
    setActivePhaseId(deepest);
  };

  if (authError || fetchError) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24">
        <ErrorAlert
          title={authError ? "Auth Protocol Failure" : "Data Link Error"}
          message={authError || fetchError || "Unknown system error."}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (authLoading || hackathonLoading || !mounted || !progress || !hackathon) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center">
        <Loader text="Loading mission data..." />
      </div>
    );
  }

  const handlePhaseSelect = (phaseId: string) => {
    if (isPhaseUnlocked(hackathon.phases, progress.responses, phaseId)) {
      setActivePhaseId(phaseId);
    }
  };

  const activePhaseObj = hackathon.phases.find((p) => p.id === activePhaseId);
  const completedCount = Object.keys(progress.responses).length;
  const totalPhases = hackathon.phases.length;
  const pct = Math.min(Math.round((completedCount / totalPhases) * 100), 100);

  const judge = user ? hackathon.judges?.find(j => j.email === user.email) : null;
  const isJudge = !!judge;
  const isAcceptedJudge = judge?.status === 'accepted';

  const handleAcceptJudge = async () => {
    if (!user) return;
    setAcceptingJudge(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hackathons/${hackathon.id}/judges/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
      });
      if (res.ok) {
        // Optimistic update
        setHackathon({
          ...hackathon,
          judges: hackathon.judges?.map(j => j.email === user.email ? { ...j, status: 'accepted' } : j)
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAcceptingJudge(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-[calc(100vh-68px)] bg-[#020617]"
      style={{ animation: "fade-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) both" }}
    >
      {/* ══════════════ HERO HEADER ══════════════ */}
      <div className="relative h-48 md:h-64 shrink-0 overflow-hidden border-b border-[rgba(0,245,255,0.15)]">
        {hackathon.banner &&
        (hackathon.banner.startsWith("http") ||
          hackathon.banner.startsWith("/")) ? (
          <Image
            src={hackathon.banner}
            alt={hackathon.title}
            fill
            sizes="100vw"
            priority
            loading="eager"
            className="absolute inset-0 object-cover opacity-30"
          />
        ) : hackathon.banner ? (
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: hackathon.banner }}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[rgba(0,245,255,0.1)] to-[rgba(139,92,246,0.1)]" />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[rgba(2,6,23,0.6)] to-transparent" />

        {/* Header Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl w-full mx-auto px-5 pb-6 lg:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <h1 className="font-orbitron font-black text-3xl md:text-5xl text-white uppercase tracking-tight leading-tight mb-2 drop-shadow-[0_0_15px_rgba(0,245,255,0.3)]">
                {hackathon.title}
              </h1>
              <p className="font-mono-cc text-xs md:text-sm text-[rgba(224,247,255,0.6)] max-w-2xl">
                {hackathon.tagline}
              </p>
            </div>

            {/* Stats Overlay */}
            <div className="flex items-center gap-4 md:gap-8 shrink-0">
              <div>
                <p className="font-orbitron text-[9px] font-bold text-[rgba(0,245,255,0.6)] uppercase tracking-[0.2em] mb-1">
                  Overall Progress
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-mono-cc text-lg text-[#00f5ff]">
                    {completedCount}/{totalPhases}
                  </span>
                  <div className="w-24 h-1.5 bg-[rgba(255,255,255,0.1)] overflow-hidden">
                    <div
                      className="h-full bg-[#00f5ff] transition-all duration-500 shadow-[0_0_8px_#00f5ff]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {hackathon.prize && (
                <div className="hidden md:block">
                  <p className="font-orbitron text-[9px] font-bold text-[rgba(245,158,11,0.6)] uppercase tracking-[0.2em] mb-1">
                    Prize Pool
                  </p>
                  <span className="font-mono-cc text-lg text-[#f59e0b] font-bold">
                    {hackathon.prize}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isJudge ? (
        <main className="flex-1 w-full bg-[#020617] max-w-7xl mx-auto px-5 py-10">
          {!isAcceptedJudge ? (
            <div className="glass-card p-10 border border-[#00f5ff]/20 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-white font-orbitron mb-4">Judge Invitation</h2>
              <p className="text-slate-400 font-mono text-sm mb-8">
                You have been invited to judge the <strong>{hackathon.title}</strong>. Accept the invitation to access the judging panel and evaluate team submissions.
              </p>
              <button 
                onClick={handleAcceptJudge}
                disabled={acceptingJudge}
                className="neon-btn-cyan px-8 py-3 text-lg"
              >
                {acceptingJudge ? "Accepting..." : "Accept Invitation"}
              </button>
            </div>
          ) : (
            <JudgePanel hackathon={hackathon} />
          )}
        </main>
      ) : (
        <>
          {/* ══════════════ PHASE BREADCRUMB TRACKER ══════════════ */}
      <div className="border-b border-[rgba(0,245,255,0.1)] bg-[rgba(2,6,23,0.85)] backdrop-blur-md sticky top-[68px] z-30">
        <div className="max-w-7xl mx-auto px-5 py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory sm:overflow-visible sm:snap-none">
          <div className="flex items-center gap-3">
            {hackathon.phases.map((phase, idx) => {
              const unlocked = isPhaseUnlocked(
                hackathon.phases,
                progress.responses,
                phase.id,
              );
              const isDone = progress.responses[phase.id] !== undefined;
              const isActive = activePhaseId === phase.id;

              return (
                <div
                  key={phase.id}
                  className={`flex items-center snap-start shrink-0 ${idx < hackathon.phases.length - 1 ? "flex-1" : ""}`}
                >
                  <button
                    disabled={!unlocked}
                    onClick={() => handlePhaseSelect(phase.id)}
                    className="flex flex-col items-center gap-2 group outline-none relative shrink-0"
                  >
                    {/* Active Glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-[#00f5ff] opacity-20 blur-lg rounded-full" />
                    )}

                    <div
                      className={`relative z-10 shrink-0 w-8 h-8 sm:w-10 sm:h-10 text-[9px] sm:text-[11px] flex items-center justify-center font-black font-orbitron transition-all duration-300 ${
                        isActive
                          ? "bg-[#00f5ff] text-[#020617] shadow-[0_0_15px_rgba(0,245,255,0.6)] border-2 border-[#00f5ff]"
                          : isDone
                            ? "bg-[rgba(0,245,255,0.1)] border border-[#00f5ff] text-[#00f5ff]"
                            : unlocked
                              ? "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.2)] text-[rgba(224,247,255,0.5)] group-hover:border-[rgba(0,245,255,0.5)] group-hover:text-[#00f5ff]"
                              : "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[rgba(224,247,255,0.15)] cursor-not-allowed"
                      }`}
                      style={{
                        clipPath:
                          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", // Hexagon shape
                      }}
                    >
                      {isDone && !isActive ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : !unlocked ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      ) : (
                        String(idx + 1).padStart(2, "0")
                      )}
                    </div>

                    <span
                      className={`font-orbitron font-bold text-[8px] sm:text-[9px] text-center leading-tight max-w-[70px] sm:max-w-none uppercase tracking-[0.15em] transition-colors ${
                        isActive
                          ? "text-[#00f5ff]"
                          : isDone
                            ? "text-[rgba(224,247,255,0.7)]"
                            : unlocked
                              ? "text-[rgba(224,247,255,0.4)] group-hover:text-[#00f5ff]"
                              : "text-[rgba(224,247,255,0.2)]"
                      }`}
                    >
                      {phase.name}
                    </span>
                  </button>

                  {/* Connector Line */}
                  {idx < hackathon.phases.length - 1 && (
                    <div className="hidden sm:flex flex-1 px-4 -mt-5">
                      <div className="h-[2px] w-full bg-[rgba(255,255,255,0.05)] relative overflow-hidden">
                        {isDone && (
                          <div className="absolute inset-0 bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="flex-1 w-full bg-[#020617]">
        <div className="max-w-7xl mx-auto px-5 py-10 lg:py-16 flex flex-col lg:flex-row gap-10 items-start">
          {/* Left Column: Mission Command */}
          {hackathon.organizers && hackathon.organizers.length > 0 && (
            <div
              className="w-full lg:w-72 shrink-0 order-2 lg:order-1 lg:sticky lg:top-[160px]"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="glass-card border border-[rgba(0,245,255,0.1)] bg-[rgba(2,6,23,0.4)] p-5">
                <p className="font-orbitron text-[10px] font-bold text-[rgba(224,247,255,0.3)] uppercase tracking-[0.25em] mb-5 flex items-center gap-3">
                  <span className="w-2 h-2 bg-[rgba(0,245,255,0.5)] rotate-45" />
                  Mission Command
                </p>
                <div className="flex flex-col gap-4">
                  {hackathon.organizers.map((org, i) => (
                    <div
                      key={i}
                      className="relative group bg-[rgba(2,6,23,0.5)]"
                    >
                      {/* Background/Border styling */}
                      <div className="absolute inset-0 bg-linear-to-r from-[rgba(0,245,255,0.05)] to-transparent border-l-2 border-[rgba(0,245,255,0.2)] group-hover:border-[#00f5ff] transition-all duration-300" />

                      <div className="relative p-4 flex flex-col gap-4">
                        {/* Profile Info */}
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 shrink-0 overflow-hidden bg-[rgba(0,245,255,0.05)] border border-[rgba(0,245,255,0.3)] group-hover:border-[#00f5ff] shadow-[0_0_10px_rgba(0,245,255,0.1)] group-hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all duration-300">
                            {org.avatar ? (
                              <Image
                                src={org.avatar}
                                alt={org.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-orbitron text-lg font-black text-[rgba(0,245,255,0.8)] group-hover:text-[#00f5ff] transition-all duration-300">
                                {org.name.charAt(0)}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-[rgba(0,245,255,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div>
                            <p className="font-orbitron font-bold text-xs text-white uppercase tracking-wide">
                              {org.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] shadow-[0_0_5px_#00f5ff] animate-pulse" />
                              <p className="font-mono-cc text-[9px] text-[rgba(0,245,255,0.8)] uppercase tracking-[0.2em]">
                                Active
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {org.email && (
                            <a
                              href={`mailto:${org.email}`}
                              className="flex-1 flex items-center justify-center gap-2 py-2 px-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,245,255,0.1)] hover:border-[#00f5ff] hover:text-[#00f5ff] hover:shadow-[0_0_15px_rgba(0,245,255,0.2)] text-[rgba(224,247,255,0.5)] transition-all duration-300"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="font-orbitron font-bold text-[9px] uppercase tracking-[0.15em]">
                                COMMS
                              </span>
                            </a>
                          )}
                          {org.phone && (
                            <a
                              href={`tel:${org.phone}`}
                              className="flex-1 flex items-center justify-center gap-2 py-2 px-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,245,255,0.1)] hover:border-[#00f5ff] hover:text-[#00f5ff] hover:shadow-[0_0_15px_rgba(0,245,255,0.2)] text-[rgba(224,247,255,0.5)] transition-all duration-300"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              <span className="font-orbitron font-bold text-[9px] uppercase tracking-[0.15em]">
                                LINK
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Mission Phase */}
          <div className="flex-1 w-full min-w-0 order-1 lg:order-2">
            {activePhaseObj ? (
              <div className="animate-fade-up" key={activePhaseObj.id}>
                <DynamicPhase
                  hackathon={hackathon}
                  phase={activePhaseObj}
                  existingResponse={progress.responses[activePhaseObj.id] || null}
                  onComplete={refreshProgress}
                />
              </div>
            ) : (
              <div className="glass-card p-12 text-center border border-[rgba(0,245,255,0.2)]">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-[rgba(0,245,255,0.4)] flex items-center justify-center animate-pulse-slow shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00f5ff"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    />
                  </svg>
                </div>
                <h2 className="font-orbitron font-black text-xl text-white uppercase tracking-wider mb-2">
                  Awaiting Designation
                </h2>
                <p className="font-mono-cc text-xs text-[rgba(224,247,255,0.4)] max-w-md mx-auto">
                  Select an unlocked phase from the mission tracker above to
                  establish a link and begin data transmission.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      </>
      )}
    </div>
  );
}
