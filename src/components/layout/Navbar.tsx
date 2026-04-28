"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{ height: "var(--nav-h)" }}
      className={`w-full sticky top-0 z-100 transition-all duration-300 ${
        scrolled
          ? "bg-[#040b14]/95 backdrop-blur-xl border-b border-[rgba(0,245,255,0.12)] shadow-[0_4px_32px_rgba(0,0,0,0.6)]"
          : "bg-[#040b14]/80 backdrop-blur-md border-b border-[rgba(0,245,255,0.06)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 h-full grid grid-cols-3 items-center">
        {/* Left Side Placeholder */}
        <div></div>

        {/* Centered Branding */}
        <div className="flex justify-center">
          <Link href="/" className="group">
            <span className="font-orbitron font-black text-lg text-white group-hover:text-[#00f5ff] transition-all duration-300 tracking-[0.2em] uppercase whitespace-nowrap">
              IIE <span className="text-[#00f5ff]">TECH</span> CLUB
            </span>
          </Link>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center justify-end gap-4">
           <NotificationBell />
        </div>
      </div>
    </header>
  );
}
