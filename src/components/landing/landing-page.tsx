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

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <LandingNav />
      <AnimatedGrid />
      <motion.div style={{ opacity }} className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/[0.03] blur-[100px]" />
      </motion.div>
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
