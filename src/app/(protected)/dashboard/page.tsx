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
      <div className="relative h-40 sm:h-56 md:h-64 shrink-0 overflow-hidden border-b border-[rgba(0,245,255,0.1)]">
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.02)]" />
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-2 w-20 bg-[rgba(255,255,255,0.05)] rounded" />
              <div className="h-8 sm:h-12 w-48 sm:w-64 bg-[rgba(255,255,255,0.05)] rounded" />
              <div className="h-3 w-64 sm:w-96 bg-[rgba(255,255,255,0.03)] rounded" />
              <div className="flex gap-3 pt-1">
                <div className="h-9 w-28 bg-[rgba(255,255,255,0.05)] rounded" />
                <div className="h-9 w-20 bg-[rgba(255,255,255,0.02)] rounded" />
              </div>
            </div>
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full bg-[rgba(255,255,255,0.03)] border-2 border-[rgba(255,255,255,0.05)] hidden sm:block" />
          </div>
        </div>
      </div>
      {/* Filter Skeleton */}
      <div className="border-b border-[rgba(0,245,255,0.05)] bg-[rgba(2,6,23,0.4)] py-4">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 w-12 bg-[rgba(255,255,255,0.03)] rounded" />
          ))}
        </div>
      </div>
      {/* Cards Skeleton */}
      <main className="flex-1 w-full p-4 lg:p-14 max-w-7xl mx-auto space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card h-28 sm:h-36 w-full" />
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
        setFetchError(err instanceof Error ? err.message : "Connection severed.");
      } finally {
        setHackathonsLoading(false);
      }
    };
    if (!authLoading) fetchAll();
  }, [user, authLoading]);

  const availableFilters = useMemo(() => ["All", "Live", "Completed", "In Progress", "Upcoming", "Closed"], []);

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
      let status = "Live";
      if (pct >= 100) status = "Completed";
      else if (completedPhases > 0) status = "In Progress";
      else if (isClosed) status = "Closed";
      else if (isUpcoming) status = "Upcoming";
      return status === activeFilter;
    });
  }, [hackathons, progressMap, activeFilter]);

  const loading = authLoading || hackathonsLoading;
  if (loading) return <DashboardSkeleton />;

  if (authError || fetchError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-24">
        <ErrorAlert
          title={authError ? "Auth Protocol Failure" : "Data Link Error"}
          message={authError || fetchError || "Unknown system error."}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Hacker";

  const filterColors: Record<string, string> = {
    All: "#ffffff",
    Live: "#00f5ff",
    Completed: "#10b981",
    "In Progress": "#f59e0b",
    Upcoming: "rgba(224,247,255,0.4)",
    Closed: "#f43f5e",
  };

  return (
    <div
      className="flex flex-col min-h-[calc(100vh-68px)] bg-[#020617]"
      style={{ animation: "fade-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) both" }}
    >
      {/* ── Hero Banner ── */}
      <div className="relative h-40 sm:h-52 md:h-64 shrink-0 overflow-hidden border-b border-[rgba(0,245,255,0.15)]">
        {/* BG layers */}
        <div className="absolute inset-0 bg-linear-to-br from-[rgba(0,245,255,0.05)] to-[rgba(139,92,246,0.05)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[rgba(2,6,23,0.5)] to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-5 pb-4 sm:pb-6 lg:pb-8 flex flex-row items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Status indicator */}
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse-dot" />
                <span className="font-orbitron font-bold text-[9px] sm:text-[10px] text-[rgba(0,245,255,0.8)] uppercase tracking-[0.3em]">
                  Agent.Verified
                </span>
              </div>
              {/* Name */}
              <h1 className="font-orbitron font-black text-2xl sm:text-4xl md:text-6xl text-white uppercase tracking-tighter leading-none mb-2 drop-shadow-[0_0_20px_rgba(0,245,255,0.4)] truncate">
                {user?.displayName || firstName}
              </h1>
              {/* Subtitle */}
              <p className="font-mono-cc text-xs text-[rgba(224,247,255,0.45)] mb-3 hidden sm:block">
                Welcome back, {firstName}. All systems operational.
              </p>
              {/* Actions */}
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                <Link
                  href={`/${user?.uid}/profile`}
                  className="btn-primary py-2! px-4! sm:py-3! sm:px-6! text-[10px] sm:text-[11px]"
                >
                  PROFILE
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-ghost py-2! px-3! sm:py-3! sm:px-5! text-[10px] sm:text-[11px]"
                >
                  LOGOUT
                </button>
              </div>
            </div>

            {/* Avatar */}
            <div className="shrink-0 relative group hidden sm:block">
              <div className="absolute inset-[-6px] border border-[rgba(0,245,255,0.1)] rounded-full animate-pulse-slow" />
              <div className="w-24 h-24 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-full border-2 border-[rgba(0,245,255,0.3)] bg-[#040b14] overflow-hidden relative z-10 shadow-[0_0_40px_rgba(0,245,255,0.15)] group-hover:border-[#00f5ff] transition-all duration-500">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    fill
                    priority
                    loading="eager"
                    sizes="(max-width: 768px) 96px, (max-width: 1024px) 144px, 192px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#00f5ff] text-3xl sm:text-5xl font-black font-orbitron">
                    {firstName[0]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="border-b border-[rgba(0,245,255,0.1)] bg-[rgba(2,6,23,0.85)] backdrop-blur-md sticky top-(--nav-h) z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-5 sm:gap-8 min-w-max">
            <span className="font-orbitron text-[9px] font-bold text-[rgba(224,247,255,0.2)] uppercase tracking-[0.3em] flex items-center gap-2 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="icon icon-tabler icons-tabler-filled icon-tabler-filter"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M20 3h-16a1 1 0 0 0 -1 1v2.227l.008 .223a3 3 0 0 0 .772 1.795l4.22 4.641v8.114a1 1 0 0 0 1.316 .949l6 -2l.108 -.043a1 1 0 0 0 .576 -.906v-6.586l4.121 -4.12a3 3 0 0 0 .879 -2.123v-2.171a1 1 0 0 0 -1 -1z" />
              </svg>
              Filter
            </span>
            <div className="flex items-center gap-4 sm:gap-6">
              {availableFilters.map((label) => {
                const color = filterColors[label] || "#a855f7";
                const isActive = activeFilter === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveFilter(label)}
                    className={`flex items-center gap-1.5 transition-all duration-300 outline-none ${
                      isActive ? "opacity-100" : "opacity-40 hover:opacity-75"
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        background: color,
                        boxShadow:
                          isActive &&
                          label !== "Upcoming" &&
                          label !== "Closed" &&
                          label !== "All"
                            ? `0 0 7px ${color}`
                            : "none",
                      }}
                    />
                    <span
                      className={`font-orbitron font-bold text-[10px] uppercase tracking-wider ${
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

      {/* ── Hackathon List ── */}
      <main className="flex-1 w-full bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-6 sm:py-10 lg:py-14">
          {filteredHackathons.length === 0 ? (
            <div className="glass-card p-10 sm:p-16 text-center max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto mb-4 border border-[rgba(0,245,255,0.2)] flex items-center justify-center bg-[rgba(0,245,255,0.05)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="icon icon-tabler icons-tabler-filled icon-tabler-ufo"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 3c3.067 0 5.6 2.29 5.957 5.246c3.067 .903 5.043 2.476 5.043 4.478c0 2.3 -2.653 4.053 -6.427 4.833l1.26 1.888a1 1 0 1 1 -1.665 1.11l-1.78 -2.67c-.77 .076 -1.57 .115 -2.388 .115c-.966 0 -1.905 -.055 -2.801 -.16l-1.305 2.607a1 1 0 0 1 -1.788 -.894l1.028 -2.06c-3.618 -.807 -6.134 -2.529 -6.134 -4.768c0 -1.999 1.981 -3.58 5.044 -4.483c.36 -2.955 2.89 -5.242 5.956 -5.242m.01 10l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993m-5 -1l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993m10 0l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993m-5.01 -7c-2.11 0 -3.835 1.618 -3.989 3.667a1 1 0 0 1 .057 .4c.104 .087 .348 .251 .768 .419c.806 .322 1.94 .514 3.164 .514s2.358 -.192 3.164 -.514c.445 -.178 .693 -.352 .789 -.435l-.003 -.051q 0 -.113 .029 -.229l.014 -.046c-.125 -2.076 -1.864 -3.725 -3.993 -3.725" />
                </svg>
              </div>
              <h3 className="font-orbitron font-black text-sm text-white uppercase tracking-wider mb-2">
                No Missions Found
              </h3>
              <p className="font-mono-cc text-xs text-[rgba(224,247,255,0.4)] leading-relaxed">
                {activeFilter !== "All"
                  ? `No hackathons match: ${activeFilter}.`
                  : "No hackathons available. Check back soon."}
              </p>
            </div>
          ) : (
            <div
              className="flex flex-col gap-3 sm:gap-4"
              style={{
                animation:
                  "fade-up 0.5s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both",
              }}
            >
              {filteredHackathons.map((h, idx) => (
                <div
                  key={h.id}
                  style={{
                    animationDelay: `${0.05 * idx}s`,
                    animationFillMode: "both",
                  }}
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