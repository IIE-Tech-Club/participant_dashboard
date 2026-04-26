"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signOutUser } from "@/lib/firebase/client";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHackathonPage = pathname !== "/dashboard" && pathname.startsWith("/dashboard/");
  const segments = pathname.split("/").filter(Boolean);
  const hackathonSlug = segments[1]?.replace(/-/g, " ") ?? "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await Promise.all([
      fetch("/api/auth/logout", { method: "POST" }),
      signOutUser(),
    ]);
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial =
    user?.displayName?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <header
      style={{ height: "var(--nav-h)" }}
      className={`w-full sticky top-0 z-100 transition-all duration-300 ${
        scrolled
          ? "bg-[#040b14]/95 backdrop-blur-xl border-b border-[rgba(0,245,255,0.12)] shadow-[0_4px_32px_rgba(0,0,0,0.6)]"
          : "bg-[#040b14]/80 backdrop-blur-md border-b border-[rgba(0,245,255,0.06)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between gap-4">

        {/* ── Left ── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 relative flex items-center justify-center border border-[rgba(0,245,255,0.25)] bg-[rgba(0,245,255,0.06)] group-hover:bg-[rgba(0,245,255,0.12)] transition-colors">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="0" y="0" width="5.5" height="5.5" fill="#00f5ff" opacity="0.9"/>
                <rect x="7.5" y="0" width="5.5" height="5.5" fill="#00f5ff" opacity="0.35"/>
                <rect x="0" y="7.5" width="5.5" height="5.5" fill="#00f5ff" opacity="0.35"/>
                <rect x="7.5" y="7.5" width="5.5" height="5.5" fill="#00f5ff" opacity="0.9"/>
              </svg>
              {/* Corner glow */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-[inset_0_0_8px_rgba(0,245,255,0.3)]" />
            </div>
            <span className="font-orbitron font-black text-sm text-white group-hover:text-[#00f5ff] transition-colors tracking-tight">
              CODE<span className="text-[#00f5ff]">CRAFT</span>
            </span>
          </Link>

          {/* Breadcrumb */}
          {isHackathonPage && (
            <div className="flex items-center gap-2 min-w-0 opacity-0 animate-fade-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className="text-[rgba(224,247,255,0.4)] font-mono-cc text-[10px] uppercase tracking-[0.18em] truncate max-w-[120px] sm:max-w-[200px]">
                {hackathonSlug}
              </span>
            </div>
          )}
        </div>

        {/* ── Right ── */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 border border-[rgba(0,245,255,0.12)] bg-[rgba(0,245,255,0.04)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse-dot" />
            <span className="font-orbitron text-[9px] font-bold text-[rgba(0,245,255,0.6)] uppercase tracking-[0.2em]">Live</span>
          </div>

          {/* Avatar */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="navbar-profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-label="Open profile menu"
              className={`w-9 h-9 border transition-all duration-200 flex items-center justify-center overflow-hidden shrink-0 ${
                dropdownOpen
                  ? "border-[#00f5ff] bg-[rgba(0,245,255,0.1)] shadow-[0_0_12px_rgba(0,245,255,0.3)]"
                  : "border-[rgba(0,245,255,0.2)] bg-[rgba(0,245,255,0.05)] hover:border-[rgba(0,245,255,0.5)] hover:bg-[rgba(0,245,255,0.1)]"
              }`}
            >
              {user?.photoURL && !imgError ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-[#00f5ff] text-xs font-black font-orbitron">
                  {userInitial}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-64 bg-[#040b14] border border-[rgba(0,245,255,0.15)] shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden animate-fade-up">
                {/* Corner decorators */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00f5ff]/60 pointer-events-none" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#00f5ff]/60 pointer-events-none" />

                {/* User info */}
                <div className="p-4 border-b border-[rgba(0,245,255,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-[rgba(0,245,255,0.2)] flex items-center justify-center overflow-hidden bg-[rgba(0,245,255,0.05)] shrink-0">
                      {user?.photoURL && !imgError ? (
                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[#00f5ff] text-sm font-black font-orbitron">{userInitial}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-white font-bold font-orbitron uppercase tracking-wider truncate">
                        {user?.displayName || "User"}
                      </p>
                      <p className="text-[10px] text-[rgba(224,247,255,0.35)] font-mono-cc truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[10px] font-orbitron font-bold text-[rgba(224,247,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all uppercase tracking-widest mb-1"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Dashboard
                  </Link>

                  <div className="h-px bg-[rgba(255,255,255,0.05)] my-2" />

                  <button
                    id="navbar-logout-btn"
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[10px] font-orbitron font-bold text-[rgba(244,63,94,0.6)] hover:text-[#f43f5e] hover:bg-[rgba(244,63,94,0.08)] border border-transparent hover:border-[rgba(244,63,94,0.2)] transition-all uppercase tracking-widest"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
