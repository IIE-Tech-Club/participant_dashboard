"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NotificationBell from "./NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { signOutUser } from "@/lib/firebase/client";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change / outside click
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  const firstName =
    user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Hacker";

  const handleLogout = async () => {
    await Promise.all([
      fetch("/api/auth/logout", { method: "POST" }),
      signOutUser(),
    ]);
    window.location.href = "/";
  };

  return (
    <>
      <header
        style={{ height: "var(--nav-h)" }}
        className={`w-full sticky top-0 z-100 transition-all duration-300 ${
          scrolled
            ? "bg-[#040b14]/95 backdrop-blur-xl border-b border-[rgba(0,245,255,0.12)] shadow-[0_4px_32px_rgba(0,0,0,0.6)]"
            : "bg-[#040b14]/80 backdrop-blur-md border-b border-[rgba(0,245,255,0.06)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-5 h-full flex items-center justify-between gap-3">
          {/* Left: hamburger (mobile) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            className="sm:hidden p-2 -ml-1 text-slate-400 hover:text-cyan-400 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          {/* Center: Branding */}
          <div className="flex-1 flex justify-center">
            <Link href="/dashboard" className="group">
              <span className="font-charm font-black text-xl sm:text-2xl text-white group-hover:text-[#00f5ff] transition-all duration-300 tracking-wider sm:tracking-widest uppercase whitespace-nowrap">
                IIE <span className="text-[#00f5ff]">TECH</span> CLUB
              </span>
            </Link>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationBell />
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          className="sm:hidden fixed left-0 right-0 z-99 bg-[#040b14]/98 backdrop-blur-xl border-b border-[rgba(0,245,255,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          style={{ top: "var(--nav-h)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {user && (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-3 border-b border-[rgba(0,245,255,0.08)] mb-2">
                  <div className="w-9 h-9 rounded-full border border-[rgba(0,245,255,0.3)] bg-[#071120] overflow-hidden shrink-0">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={firstName}
                        width={36}
                        height={36}
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#00f5ff] text-sm font-black font-orbitron">
                        {firstName[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-orbitron font-bold text-xs text-white uppercase tracking-wide">
                      {firstName}
                    </p>
                    <p className="font-mono text-[10px] text-slate-500 truncate max-w-[200px]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 font-orbitron font-bold text-xs text-slate-400 hover:text-cyan-400 hover:bg-[rgba(0,245,255,0.04)] uppercase tracking-widest transition-all rounded-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-layout-dashboard"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 3a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 12a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2zm10 -4a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 -8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2z" />
                  </svg>
                  Dashboard
                </Link>

                <Link
                  href={`/${user.uid}/profile`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 font-orbitron font-bold text-xs text-slate-400 hover:text-cyan-400 hover:bg-[rgba(0,245,255,0.04)] uppercase tracking-widest transition-all rounded-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-user"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                    <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
                  </svg>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-3 font-orbitron font-bold text-xs text-slate-400 hover:text-cyan-400 hover:bg-[rgba(0,245,255,0.04)] uppercase tracking-widest transition-all rounded-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 shrink-0 -rotate-90"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-12a1 1 0 0 0 -.993 .883l-.007 .117v9h14v-9a1 1 0 0 0 -.883 -.993l-.117 -.007zm-5.387 3.21l.094 .083l2 2a1 1 0 0 1 -1.32 1.497l-.094 -.083l-1.293 -1.292l-1.293 1.292a1 1 0 0 1 -1.32 .083l-.094 -.083a1 1 0 0 1 -.083 -1.32l.083 -.094l2 -2a1 1 0 0 1 1.32 -.083z" />
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
