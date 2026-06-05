"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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

  // GSAP refs
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const phaseTrackerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  // Poll for team-synced progress every 15 seconds
  useEffect(() => {
    if (!mounted || !user || !hackathonId || !hackathon) return;
    const interval = setInterval(() => {
      refreshProgress();
    }, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, user, hackathonId, hackathon]);

  // GSAP mount animations
  useEffect(() => {
    if (!mounted || !hackathon) return;
    let ctx: { revert: () => void } | null = null;

    const runGSAP = async () => {
      const { gsap } = await import("gsap");

      ctx = gsap.context(() => {
        // Hero timeline
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (titleRef.current) {
          heroTl.fromTo(
            titleRef.current,
            { opacity: 0, y: 30, skewX: -2 },
            { opacity: 1, y: 0, skewX: 0, duration: 0.8 },
            0
          );
        }
        if (taglineRef.current) {
          heroTl.fromTo(
            taglineRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            0.25
          );
        }
        if (statsRef.current) {
          heroTl.fromTo(
            statsRef.current,
            { opacity: 0, x: 24 },
            { opacity: 1, x: 0, duration: 0.6 },
            0.2
          );
        }

        // Progress bar animate
        if (progressBarRef.current) {
          gsap.fromTo(
            progressBarRef.current,
            { width: "0%" },
            {
              width: `${pct}%`,
              duration: 1.4,
              ease: "power3.out",
              delay: 0.5,
            }
          );
        }

        // Phase tracker nodes stagger
        if (phaseTrackerRef.current) {
          const nodes = phaseTrackerRef.current.querySelectorAll(".phase-hex-node");
          const connectors = phaseTrackerRef.current.querySelectorAll(".phase-connector-fill");

          gsap.fromTo(
            nodes,
            { opacity: 0, scale: 0.3, rotation: -30 },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: "back.out(1.8)",
              delay: 0.4,
            }
          );

          gsap.fromTo(
            connectors,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.6,
              stagger: 0.15,
              ease: "power2.inOut",
              delay: 0.7,
              transformOrigin: "left center",
            }
          );
        }

        // Sidebar animate
        if (sidebarRef.current) {
          gsap.fromTo(
            sidebarRef.current,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.6 }
          );
        }

        // Main content animate
        if (mainContentRef.current) {
          gsap.fromTo(
            mainContentRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.5 }
          );
        }
      });
    };

    runGSAP();
    return () => ctx?.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, hackathon]);

  // Animate phase content change
  useEffect(() => {
    if (!mainContentRef.current || !mounted) return;
    const runPhaseAnim = async () => {
      const { gsap } = await import("gsap");
      gsap.fromTo(
        mainContentRef.current!,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    };
    runPhaseAnim();
  }, [activePhaseId, mounted]);

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
      const idToken = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/hackathons/${hackathon.id}/judges/accept`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
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
    <div className="flex flex-col min-h-[calc(100vh-68px)] bg-transparent relative">
      {/* ══════════════ HERO HEADER ══════════════ */}
      <div
        ref={heroRef}
        className="relative h-52 md:h-72 shrink-0 overflow-hidden border-b border-purple-500/15"
      >
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
            className="absolute inset-0 object-cover opacity-25 scale-105"
          />
        ) : hackathon.banner ? (
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: hackathon.banner }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(139,92,246,0.1)_0%,transparent_60%)]" />
        )}

        {/* Overlay layers */}
        <div className="absolute inset-0 bg-linear-to-t from-[#05050a] via-[#05050a]/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_30%,rgba(236,72,153,0.06)_0%,transparent_60%)]" />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="hero-particle" />
          <div className="hero-particle" />
          <div className="hero-particle" />
          <div className="hero-particle" />
          <div className="hero-particle" />
        </div>

        {/* Header Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl w-full mx-auto px-5 pb-6 lg:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              {/* Back button */}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 font-mono-cc text-[10px] text-[rgba(241,240,255,0.4)] hover:text-purple-400 transition-colors mb-3 group"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-1 transition-transform duration-200">
                  <polyline points="19 12 5 12" />
                  <polyline points="12 5 5 12 12 19" />
                </svg>
                Back to Dashboard
              </Link>
              <h1
                ref={titleRef}
                className="font-orbitron font-black text-3xl md:text-5xl bg-gradient-to-r from-white via-purple-200 to-fuchsia-300 bg-clip-text text-transparent uppercase tracking-tight leading-tight mb-2 drop-shadow-[0_0_20px_rgba(139,92,246,0.2)]"
              >
                {hackathon.title}
              </h1>
              <p ref={taglineRef} className="font-mono-cc text-xs md:text-sm text-[rgba(241,240,255,0.6)] max-w-2xl flex items-center gap-2">
                <span className="w-4 h-px bg-purple-500/40" />
                {hackathon.tagline}
              </p>
            </div>

            {/* Stats Overlay */}
            <div ref={statsRef} className="flex items-center gap-4 md:gap-8 shrink-0">
              <div>
                <p className="font-orbitron text-[9px] font-bold text-purple-300 uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-pink-500 rounded-full animate-pulse-dot" />
                  Overall Progress
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-mono-cc text-lg text-purple-300 font-bold">
                    {completedCount}/{totalPhases}
                  </span>
                  <div className="w-28 h-1.5 bg-[rgba(255,255,255,0.08)] overflow-hidden rounded-sm relative">
                    <div
                      ref={progressBarRef}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)] rounded-sm"
                      style={{ width: "0%" }}
                    />
                  </div>
                  <span className="font-mono-cc text-xs text-purple-200/70">{pct}%</span>
                </div>
              </div>

              {hackathon.prize && (
                <div className="hidden md:block">
                  <p className="font-orbitron text-[9px] font-bold text-[rgba(245,158,11,0.6)] uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-[#f59e0b] rounded-full" />
                    Prize Pool
                  </p>
                  <span className="font-mono-cc text-lg text-[#f59e0b] font-bold neon-text-amber">
                    {hackathon.prize}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isJudge ? (
        <main className="flex-1 w-full bg-[#05050a]/30 max-w-7xl mx-auto px-5 py-10">
          {!isAcceptedJudge ? (
            <div className="glass-card p-10 border border-purple-500/20 text-center max-w-2xl mx-auto animate-scale-in">
              <div className="w-16 h-16 mx-auto mb-6 border border-purple-500/30 flex items-center justify-center bg-purple-500/5 animate-pulse-slow">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white font-orbitron mb-3 uppercase tracking-wider">Judge Invitation</h2>
              <p className="text-slate-400 font-mono text-sm mb-8 leading-relaxed">
                You have been invited to judge the <strong className="text-white">{hackathon.title}</strong>. Accept the invitation to access the judging panel and evaluate team submissions.
              </p>
              <button 
                onClick={handleAcceptJudge}
                disabled={acceptingJudge}
                className="px-8 py-3 text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all"
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
          <div className="border-b border-purple-500/10 bg-[#05050a]/80 backdrop-blur-md sticky top-[68px] z-30">
            {/* Progress indicator line at bottom */}
            <div
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />

            <div ref={phaseTrackerRef} className="max-w-7xl mx-auto px-5 py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory sm:overflow-visible sm:snap-none">
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
                          <div className="absolute inset-0 bg-purple-500 opacity-20 blur-xl rounded-full" />
                        )}

                        <div
                          className={`phase-hex-node relative z-10 shrink-0 w-8 h-8 sm:w-10 sm:h-10 text-[9px] sm:text-[11px] flex items-center justify-center font-black font-orbitron transition-all duration-300 ${
                            isActive
                              ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.5),0_0_40px_rgba(139,92,246,0.3)] border-2 border-purple-400"
                              : isDone
                                ? "bg-purple-500/10 border border-purple-500/40 text-purple-300"
                                : unlocked
                                  ? "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.2)] text-[rgba(241,240,255,0.5)] group-hover:border-purple-500/50 group-hover:text-purple-300 group-hover:shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                                  : "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[rgba(241,240,255,0.15)] cursor-not-allowed"
                          }`}
                          style={{
                            clipPath:
                              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
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
                              ? "text-purple-300"
                              : isDone
                                ? "text-[rgba(241,240,255,0.7)]"
                                : unlocked
                                  ? "text-[rgba(241,240,255,0.4)] group-hover:text-purple-300"
                                  : "text-[rgba(241,240,255,0.2)]"
                          }`}
                        >
                          {phase.name}
                        </span>
                      </button>

                      {/* Connector Line */}
                      {idx < hackathon.phases.length - 1 && (
                        <div className="hidden sm:flex flex-1 px-4 -mt-5">
                          <div className="phase-connector h-[2px] w-full bg-[rgba(255,255,255,0.05)] relative overflow-hidden">
                            <div
                              className={`phase-connector-fill ${isDone ? "filled" : ""}`}
                            />
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
          <main className="flex-1 w-full bg-transparent">
            <div className="max-w-7xl mx-auto px-5 py-10 lg:py-16 flex flex-col lg:flex-row gap-10 items-start">
              {/* Left Column: Mission Command */}
              {hackathon.organizers && hackathon.organizers.length > 0 && (
                <div
                  ref={sidebarRef}
                  className="w-full lg:w-72 shrink-0 order-2 lg:order-1 lg:sticky lg:top-[160px]"
                >
                  <div className="glass-card border border-purple-500/10 bg-[#0f0f24]/50 p-5">
                    <p className="font-orbitron text-[10px] font-bold text-[rgba(241,240,255,0.3)] uppercase tracking-[0.25em] mb-5 flex items-center gap-3">
                      <span className="w-2 h-2 bg-purple-500/50 rotate-45 animate-pulse-slow" />
                      Mission Command
                    </p>
                    <div className="flex flex-col gap-4">
                      {hackathon.organizers.map((org, i) => (
                        <div
                          key={i}
                          className="relative group bg-[rgba(2,6,23,0.5)] transition-all duration-300 hover:bg-[rgba(2,6,23,0.7)]"
                        >
                          {/* Background/Border styling */}
                          <div className="absolute inset-0 bg-linear-to-r from-purple-500/5 to-transparent border-l-2 border-purple-500/20 group-hover:border-purple-400 transition-all duration-300" />

                          <div className="relative p-4 flex flex-col gap-4">
                            {/* Profile Info */}
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 shrink-0 overflow-hidden bg-purple-500/5 border border-purple-500/30 group-hover:border-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.1)] group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300">
                                {org.avatar ? (
                                  <Image
                                    src={org.avatar}
                                    alt={org.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-orbitron text-lg font-black text-purple-300 group-hover:text-purple-400 transition-all duration-300">
                                    {org.name.charAt(0)}
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                              <div>
                                <p className="font-orbitron font-bold text-xs text-white uppercase tracking-wide">
                                  {org.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_#ec4899] animate-pulse" />
                                  <p className="font-mono-cc text-[9px] text-purple-300 uppercase tracking-[0.2em]">
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
                                  className="flex-1 flex items-center justify-center gap-2 py-2 px-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] text-[rgba(241,240,255,0.5)] transition-all duration-300"
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
                                  className="flex-1 flex items-center justify-center gap-2 py-2 px-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] text-[rgba(241,240,255,0.5)] transition-all duration-300"
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
              <div
                ref={mainContentRef}
                className="flex-1 w-full min-w-0 order-1 lg:order-2"
              >
                {activePhaseObj ? (
                  <div key={activePhaseObj.id}>
                    <DynamicPhase
                      hackathon={hackathon}
                      phase={activePhaseObj}
                      existingResponse={progress.responses[activePhaseObj.id] || null}
                      onComplete={refreshProgress}
                    />
                  </div>
                ) : (
                  <div className="glass-card p-12 text-center border border-purple-500/20 animate-scale-in">
                    <div className="w-16 h-16 mx-auto mb-4 border-2 border-purple-500/40 flex items-center justify-center animate-pulse-slow shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#c084fc"
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
                    <p className="font-mono-cc text-xs text-[rgba(241,240,255,0.4)] max-w-md mx-auto">
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
