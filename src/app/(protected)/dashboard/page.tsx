"use client";

import { useEffect, useState, useMemo } from "react";
import HackathonCard from "@/components/hackathon/HackathonCard";
import { useAuth } from "@/hooks/useAuth";
import ErrorAlert from "@/components/ui/ErrorAlert";
import Loader from "@/components/ui/Loader";
import { fetchProgress } from "@/store/hackathonStore";
import type { Hackathon, HackathonProgress } from "@/types/hackathon";

function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden animate-pulse min-h-[140px] flex flex-col md:flex-row">
      <div className="w-full md:w-64 h-36 md:h-auto bg-[rgba(255,255,255,0.03)] shrink-0" />
      <div className="p-6 flex-1 space-y-4">
        <div className="h-5 bg-[rgba(255,255,255,0.05)] rounded w-3/4 max-w-sm" />
        <div className="h-3 bg-[rgba(255,255,255,0.03)] rounded w-1/2" />
        <div className="h-2 bg-[rgba(255,255,255,0.03)] rounded w-full max-w-2xl mt-4" />
      </div>
      <div className="w-full md:w-56 p-6 bg-[rgba(255,255,255,0.01)] shrink-0 space-y-3 hidden md:block">
        <div className="h-4 bg-[rgba(255,255,255,0.03)] w-20 float-right" />
        <div className="clear-both" />
        <div className="h-8 bg-[rgba(255,255,255,0.05)] w-24 mt-8 float-right" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { loading: authLoading, user, error: authError } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<string, HackathonProgress>>({});
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [hackathonsLoading, setHackathonsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchAll = async () => {
      setFetchError(null);
      try {
        const hRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hackathons`);

        if (!hRes.ok) throw new Error("Failed to retrieve mission log.");

        const hData = await hRes.json();
        setHackathons(hData);

        if (user) {
          const pMap: Record<string, HackathonProgress> = {};
          await Promise.all(
            hData.map(async (h: Hackathon) => {
              const p = await fetchProgress(h.id, user.uid);
              if (p) pMap[h.id] = p;
            })
          );
          setProgressMap(pMap);
        }
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setFetchError(err.message || "Connection to neural link severed.");
      } finally {
        setHackathonsLoading(false);
      }
    };
    if (!authLoading) fetchAll();
  }, [user, authLoading]);

  const loading = authLoading || hackathonsLoading;

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

  const firstName =
    user?.displayName?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Hacker";

  const total = hackathons.length;
  const startedCount = Object.values(progressMap).filter(
    (p) => p?.responses && Object.keys(p.responses).length > 0
  ).length;
  const completedCountTotal = Object.values(progressMap).filter(
    (p) => p?.status === "completed"
  ).length;

  const availableFilters = useMemo(() => {
    return ["All", "Live", "Completed", "In Progress", "Upcoming", "Closed"];
  }, []);

  const filteredHackathons = useMemo(() => {
    if (activeFilter === "All") return hackathons;

    return hackathons.filter((h) => {
      const p = progressMap[h.id];
      const completedPhases = p?.responses ? Object.keys(p.responses).length : 0;
      const totalPhases = h.phases?.length || 1;
      const pct = Math.min(Math.round((completedPhases / totalPhases) * 100), 100);

      const now = new Date();
      const startDate = h.startDate ? new Date(h.startDate) : null;
      const endDate = h.endDate ? new Date(h.endDate) : null;

      const isUpcoming = startDate && now < startDate;
      const isClosed = endDate && now > endDate;
      const isUserCompleted = pct >= 100;
      const isUserStarted = completedPhases > 0;

      let status = "Live";
      if (isUserCompleted) status = "Completed";
      else if (isUserStarted) status = "In Progress";
      else if (isClosed) status = "Closed";
      else if (isUpcoming) status = "Upcoming";

      return status === activeFilter;
    });
  }, [hackathons, progressMap, activeFilter]);

  const getFilterColor = (label: string) => {
    if (label === "All") return "#ffffff";
    if (label === "Live") return "#00f5ff";
    if (label === "Completed") return "#10b981";
    if (label === "In Progress") return "#f59e0b";
    if (label === "Upcoming") return "rgba(224,247,255,0.4)";
    if (label === "Closed") return "#f43f5e";
    
    const colors = ["#a855f7", "#3b82f6", "#ec4899", "#06b6d4", "#8b5cf6"];
    const charSum = label.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  return (
    <div
      className="flex flex-col min-h-[calc(100vh-68px)] bg-[#020617]"
      style={{ animation: "fade-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) both" }}
    >
      <div className="relative h-48 md:h-64 shrink-0 overflow-hidden border-b border-[rgba(0,245,255,0.15)]">
        <div className="absolute inset-0 bg-linear-to-br from-[rgba(0,245,255,0.05)] to-[rgba(139,92,246,0.05)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[rgba(2,6,23,0.6)] to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl w-full mx-auto px-5 pb-6 lg:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse-dot" />
                <span className="font-orbitron font-bold text-[10px] text-[rgba(0,245,255,0.8)] uppercase tracking-[0.3em]">
                  System.Live
                </span>
              </div>
              <h1 className="font-orbitron font-black text-3xl md:text-5xl text-white uppercase tracking-tight leading-tight mb-2 drop-shadow-[0_0_15px_rgba(0,245,255,0.3)]">
                MISSION_LOG
              </h1>
              <p className="font-mono-cc text-xs md:text-sm text-[rgba(224,247,255,0.6)] max-w-2xl">
                Welcome back, <span className="text-[#00f5ff]">{firstName}</span>. Select a hackathon to begin your journey or resume your progress.
              </p>
            </div>

            {!loading && total > 0 && (
              <div className="flex items-center gap-6 md:gap-8 shrink-0">
                <div>
                  <p className="font-orbitron text-[9px] font-bold text-[rgba(245,158,11,0.6)] uppercase tracking-[0.2em] mb-1">
                    Active Missions
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-cc text-2xl text-[#f59e0b] font-bold">{startedCount}</span>
                  </div>
                </div>

                <div className="hidden md:block">
                  <p className="font-orbitron text-[9px] font-bold text-[rgba(16,185,129,0.6)] uppercase tracking-[0.2em] mb-1">
                    Completed
                  </p>
                  <span className="font-mono-cc text-2xl text-[#10b981] font-bold">{completedCountTotal}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-[rgba(0,245,255,0.1)] bg-[rgba(2,6,23,0.85)] backdrop-blur-md sticky top-[68px] z-30">
        <div className="max-w-7xl mx-auto px-5 py-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center min-w-max gap-8">
            <span className="font-orbitron text-[9px] font-bold text-[rgba(224,247,255,0.2)] uppercase tracking-[0.3em] flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter
            </span>
            <div className="flex items-center gap-6">
              {availableFilters.map((label) => {
                const color = getFilterColor(label);
                const isActive = activeFilter === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveFilter(label)}
                    className={`flex items-center gap-2 group transition-all duration-300 outline-none ${
                      isActive ? "opacity-100" : "opacity-40 hover:opacity-80"
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-shadow duration-300"
                      style={{
                        background: color,
                        boxShadow:
                          isActive && label !== "Upcoming" && label !== "Closed" && label !== "All"
                            ? `0 0 8px ${color}`
                            : "none",
                      }}
                    />
                    <span
                      className={`font-orbitron font-bold text-[10px] uppercase tracking-wider transition-colors ${
                        isActive ? "text-white" : "text-[rgba(224,247,255,0.8)]"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full bg-[#020617]">
        <div className="max-w-7xl mx-auto px-5 py-10 lg:py-14">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 w-full">
              <Loader text="Fetching Active Missions..." />
            </div>
          ) : filteredHackathons.length === 0 ? (
            <div className="glass-card p-16 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 mx-auto mb-5 border border-[rgba(0,245,255,0.2)] flex items-center justify-center bg-[rgba(0,245,255,0.05)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,245,255,0.5)" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-orbitron font-black text-base text-white uppercase tracking-wider mb-2">
                No Missions Found
              </h3>
              <p className="font-mono-cc text-xs text-[rgba(224,247,255,0.4)] leading-relaxed">
                {activeFilter !== "All"
                  ? `There are no hackathons matching the criteria: ${activeFilter}.`
                  : "No hackathons are currently available. Check back soon."}
              </p>
            </div>
          ) : (
            <div
              className="flex flex-col gap-4"
              style={{ animation: "fade-up 0.5s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both" }}
            >
              {filteredHackathons.map((h, idx) => (
                <div
                  key={h.id}
                  style={{ animationDelay: `${0.05 * idx}s`, animationFillMode: "both" }}
                  className="animate-fade-up w-full"
                >
                  <HackathonCard hackathon={h} progress={progressMap[h.id]} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}