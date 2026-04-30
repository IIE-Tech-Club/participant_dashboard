import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthProvider";
import "@/globals.css";
import type { ReactNode } from "react";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

// ✅ Proper font loading (Next.js optimized)
import { Orbitron, Space_Grotesk, JetBrains_Mono, Audiowide } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
});

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-audiowide",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CodeCraft — Student Dashboard",
  description:
    "The next-generation hackathon management platform for elite student developers.",
  keywords: ["hackathon", "codecraft", "student", "developer", "competition"],
};

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${audiowide.variable} antialiased`}
      >
        <CustomCursor />
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
