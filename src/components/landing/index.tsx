"use client";

import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      {/* Main content */}
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />

      {/* Footer divider */}
      <div className="border-t border-[rgba(0,245,255,0.08)]" />
    </div>
  );
}
