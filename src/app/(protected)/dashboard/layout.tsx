"use client";

import type { ReactNode } from "react";



type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Content */}
      <main className="relative z-10 flex-1">
        {children}
      </main>
    </div>
  );
}