"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen text-[rgba(224,247,255,0.9)] flex flex-col" style={{ background: "var(--bg-void)" }}>
      {/* Sticky Navbar */}
      <Navbar />

      {/* Background FX */}
      <div className="circuit-bg" aria-hidden="true">
        {[10, 22, 35, 47, 60, 73, 84, 92].map((left, i) => (
          <div
            key={i}
            className="circuit-line"
            style={{
              left: `${left}%`,
              animationDelay: `${i * 1.1}s`,
              animationDuration: `${10 + (i % 4) * 2}s`,
              height: `${140 + (i % 3) * 60}px`,
            }}
          />
        ))}
      </div>

      {/* Scanline */}
      <div className="scanline-overlay" aria-hidden="true" />

      {/* Page Content */}
      <main className="relative z-10 flex-1">
        {children}
      </main>
    </div>
  );
}