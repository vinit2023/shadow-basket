"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { AnimatedGrid } from "./animated-grid";
import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";
import { DemoSection } from "./demo-section";
import { CTASection } from "./cta-section";
import { LandingNav } from "./landing-nav";
import { FooterSection } from "./footer-section";
import { TestimonialsSection } from "./testimonials-section";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const orbOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax on section headers
      gsap.utils.toArray<HTMLElement>(".gsap-parallax").forEach((el) => {
        gsap.fromTo(el, { y: 60 }, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // Fade-up reveal for sections
      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 80 },
          {
            opacity: 1, y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Scale-in effect for feature cards
      gsap.utils.toArray<HTMLElement>(".gsap-scale-in").forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.9, y: 40 },
          {
            opacity: 1, scale: 1, y: 0,
            duration: 0.8,
            delay: i * 0.05,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Horizontal line draw animation
      gsap.utils.toArray<HTMLElement>(".gsap-line-draw").forEach((el) => {
        gsap.fromTo(el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <LandingNav />
      <AnimatedGrid />

      {/* Top glow */}
      <motion.div style={{ opacity: orbOpacity, scale: orbScale }} className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full bg-accent/[0.04] blur-[120px]" />
      </motion.div>

      <div className="relative z-10 space-y-0">
        <HeroSection />

        <div className="max-w-5xl mx-auto px-6">
          <div className="gsap-line-draw w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent origin-center" />
        </div>

        <div className="gsap-reveal">
          <FeaturesSection />
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <div className="gsap-line-draw w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent origin-center" />
        </div>

        <div className="gsap-reveal">
          <DemoSection />
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <div className="gsap-line-draw w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent origin-center" />
        </div>

        <div className="gsap-reveal">
          <TestimonialsSection />
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <div className="gsap-line-draw w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent origin-center" />
        </div>

        <div className="gsap-reveal">
          <CTASection />
        </div>

        <FooterSection />
      </div>
    </div>
  );
}
