import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthProvider";
import "@/globals.css";
import type { ReactNode } from "react";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "CodeCraft — Student Dashboard",
  description: "The next-generation hackathon management platform for elite student developers.",
  keywords: ["hackathon", "codecraft", "student", "developer", "competition"],
};

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <CustomCursor />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}