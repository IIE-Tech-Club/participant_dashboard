"use client";

import { useEffect, useState, useMemo } from "react";
import HackathonCard from "@/components/hackathon/HackathonCard";
import { useAuth } from "@/hooks/useAuth";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { fetchProgress } from "@/store/hackathonStore";
import type { Hackathon, HackathonProgress } from "@/types/hackathon";
import { signOutUser } from "@/lib/firebase/client";
import Link from "next/link";
import Image from "next/image";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-68px)] bg-[#020617] animate-pulse">
      {/* Hero Skeleton */}
      <div className="relative h-48 md:h-64 shrink-0 overflow-hidden border-b border-[rgba(0,245,255,0.1)]">
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.02)]" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-8">
          <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="h-2 w-24 bg-[rgba(255,255,255,0.05)] rounded" />
              <div className="h-12 w-64 bg-[rgba(255,255,255,0.05)] rounded" />
              <div className="h-4 w-96 bg-[rgba(255,255,255,0.03)] rounded" />
              <div className="flex gap-3 pt-2">
                <div className="h-10 w-32 bg-[rgba(255,255,255,0.05)] rounded" />
                <div className="h-10 w-24 bg-[rgba(255,255,255,0.02)] rounded" />
              </div>
            </div>
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-[rgba(255,255,255,0.03)] border-2 border-[rgba(255,255,255,0.05)]" />
          </div>
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="border-b border-[rgba(0,245,255,0.05)] bg-[rgba(2,6,23,0.4)] py-6">
        <div className="max-w-7xl mx-auto px-5 flex gap-8">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="h-3 w-16 bg-[rgba(255,255,255,0.03)] rounded" />
           ))}
        </div>
      </div>

      {/* Main List Skeleton */}
      <main className="flex-1 w-full p-5 lg:p-14 max-w-7xl mx-auto space-y-4">
         {[...Array(3)].map((_, i) => (
           <div key={i} className="glass-card h-[140px] w-full flex overflow-hidden">
             <div className="w-64 bg-[rgba(255,255,255,0.02)] shrink-0" />
             <div className="p-6 flex-1 space-y-4">
               <div className="h-5 w-3/4 bg-[rgba(255,255,255,0.04)]" />
               <div className="h-3 w-1/2 bg-[rgba(255,255,255,0.02)]" />
               <div className="h-2 w-full bg-[rgba(255,255,255,0.02)]" />
             </div>
           </div>
         ))}
      </main>
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

  const handleLogout = async () => {
    await Promise.all([
      fetch("/api/auth/logout", { method: "POST" }),
      signOutUser(),
    ]);
    window.location.href = "/";
  };

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
      } catch (err: unknown) {
        console.error("Dashboard fetch error:", err);
        setFetchError(err instanceof Error ? err.message : "Connection to neural link severed.");
      } finally {
        setHackathonsLoading(false);
      }
    };
    if (!authLoading) fetchAll();
  }, [user, authLoading]);
  
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

  const loading = authLoading || hackathonsLoading;

  if (loading) return <DashboardSkeleton />;

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
                  Agent.Verified
                </span>
              </div>
              <h1 className="font-orbitron font-black text-3xl md:text-6xl text-white uppercase tracking-tighter leading-none mb-3 drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]">
                {user?.displayName || firstName}
              </h1>
              <p className="font-mono-cc text-xs md:text-base text-[rgba(224,247,255,0.5)] max-w-xl leading-relaxed mb-6">
                Welcome back {firstName}. All systems operational. 
              </p>
              
              <div className="flex items-center gap-3">
                <Link href={`/${user?.uid}`} className="btn-primary">
                  UPDATE PROFILE
                </Link>
                <button onClick={handleLogout} className="btn-ghost">
                  LOGOUT
                </button>
              </div>
            </div>

            <div className="shrink-0 relative group">
              {/* Decorative rings */}
              <div className="absolute inset-[-8px] border border-[rgba(0,245,255,0.1)] rounded-full animate-pulse-slow" />
              <div className="absolute inset-[-16px] border border-[rgba(0,245,255,0.05)] rounded-full animate-pulse-slow" style={{ animationDelay: "1s" }} />
              
              <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border-2 border-[rgba(0,245,255,0.3)] bg-[#040b14] overflow-hidden relative z-10 shadow-[0_0_40px_rgba(0,245,255,0.15)] group-hover:border-[#00f5ff] group-hover:shadow-[0_0_50px_rgba(0,245,255,0.3)] transition-all duration-500">
                {user?.photoURL ? (
                  <Image 
                    src={user.photoURL} 
                    alt={user.displayName || "User Profile"} 
                    fill
                    priority
                    sizes="(max-width: 768px) 96px, 144px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#00f5ff] text-4xl md:text-5xl font-black font-orbitron">
                    {firstName[0]}
                  </div>
                )}
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none border-10 border-transparent border-t-[rgba(0,245,255,0.1)] rounded-full" />
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#020617] rounded-full p-1 z-20 border border-[rgba(0,245,255,0.2)]">
                <div className="w-full h-full bg-[#10b981] rounded-full shadow-[0_0_10px_#10b981]" />
              </div>
            </div>
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
          {filteredHackathons.length === 0 ? (
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