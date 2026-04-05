"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedGrid } from "./animated-grid";
import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";
import { DemoSection } from "./demo-section";
import { CTASection } from "./cta-section";
import { LandingNav } from "./landing-nav";
import { FooterSection } from "./footer-section";
import { TestimonialsSection } from "./testimonials-section";

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Parallax effects for the background orbs
  const orbOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <LandingNav />
      <AnimatedGrid />

      {/* Top glow — fades as you scroll */}
      <motion.div style={{ opacity: orbOpacity, scale: orbScale }} className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full bg-accent/[0.04] blur-[120px]" />
      </motion.div>

      {/* Sections with dividers */}
      <div className="relative z-10">
        <HeroSection />

        {/* Gradient divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <FeaturesSection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <DemoSection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <TestimonialsSection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <CTASection />
        <FooterSection />
      </div>
    </div>
  );
}
