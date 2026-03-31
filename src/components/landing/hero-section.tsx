"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, ShoppingBasket, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

// AI Typewriter effect
function TypewriterText({ texts, className }: { texts: string[]; className?: string }) {
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const text = texts[textIndex];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setCurrentText(text.slice(0, charIndex + 1));
          if (charIndex + 1 === text.length) {
            setTimeout(() => setDeleting(true), 2000);
          } else {
            setCharIndex((c) => c + 1);
          }
        } else {
          setCurrentText(text.slice(0, charIndex));
          if (charIndex === 0) {
            setDeleting(false);
            setTextIndex((i) => (i + 1) % texts.length);
          } else {
            setCharIndex((c) => c - 1);
          }
        }
      },
      deleting ? 30 : 60
    );
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts]);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[3px] h-[1em] bg-accent ml-0.5 align-middle"
      />
    </span>
  );
}

export function HeroSection() {
  // 3D card tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto text-center relative z-10"
      >
        {/* AI Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-strong border border-white/[0.08] text-xs"
          >
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-3.5 h-3.5 text-accent" />
            </motion.div>
            <span className="text-muted font-medium">Powered by AI Vision Intelligence</span>
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-accent/20 to-accent-2/20 text-accent text-[10px] font-bold tracking-wide">
              BETA
            </span>
          </motion.span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.92]">
          <span className="block text-foreground">Your kitchen.</span>
          <span className="block mt-3">
            <TypewriterText
              texts={["Quantified.", "Predicted.", "Optimized.", "Automated."]}
              className="gradient-text-animate"
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p variants={itemVariants} className="mt-8 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed font-medium">
          Shadow Basket is the{" "}
          <span className="text-foreground">AI-native command center</span> for home inventory.
          Snap a photo. Track burn rates. Predict restocks.{" "}
          <span className="text-accent">Eliminate waste.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth?mode=signup" className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent via-accent-2 to-accent-3"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "300% 300%" }}
            />
            <span className="relative z-10 text-white flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Start Free — No Card Needed
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <a href="#how-it-works" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-sm text-muted hover:text-foreground hover:border-white/20 transition-all font-medium">
            See How It Works
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: "99.2%", label: "AI Accuracy" },
            { value: "1.8s", label: "Photo Scan" },
            { value: "$52", label: "Monthly Savings" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05, y: -2 }}
              className="text-center group cursor-default"
            >
              <p className="text-2xl sm:text-3xl font-black font-mono gradient-text-animate">{stat.value}</p>
              <p className="text-[10px] text-muted mt-1.5 tracking-wider uppercase font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 3D Floating dashboard preview */}
        <motion.div
          variants={itemVariants}
          className="mt-24 relative mx-auto max-w-4xl"
          style={{ perspective: 1000 }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left - rect.width / 2);
            mouseY.set(e.clientY - rect.top - rect.height / 2);
          }}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
        >
          <div className="absolute -inset-8 bg-gradient-to-r from-accent/10 via-accent-2/10 to-accent-3/10 rounded-3xl blur-3xl opacity-50" />
          <motion.div
            style={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative rounded-2xl border border-white/[0.08] overflow-hidden glass-strong"
          >
            {/* Window chrome */}
            <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-accent-3/70" />
                <div className="w-3 h-3 rounded-full bg-warning/70" />
                <div className="w-3 h-3 rounded-full bg-success/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-white/[0.03] border border-white/5">
                  <ShoppingBasket className="w-3 h-3 text-accent/50" />
                  <span className="text-[10px] text-muted font-mono">shadow-basket.app/dashboard</span>
                </div>
              </div>
            </div>
            <DashboardPreview />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-muted/40 tracking-wider uppercase font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-accent/40" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function DashboardPreview() {
  const items = [
    { name: "Organic Milk", cat: "Dairy", pct: 23, burn: "HIGH" },
    { name: "Sourdough Bread", cat: "Grains", pct: 67, burn: "MED" },
    { name: "Free-Range Eggs", cat: "Protein", pct: 8, burn: "CRIT" },
    { name: "Avocados", cat: "Produce", pct: 45, burn: "MED" },
    { name: "Greek Yogurt", cat: "Dairy", pct: 12, burn: "HIGH" },
  ];
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "TRACKED", val: "24", col: "text-foreground" },
          { label: "CRITICAL", val: "5", col: "text-danger" },
          { label: "WASTE SCORE", val: "A+", col: "text-success" },
          { label: "SAVINGS", val: "$52", col: "text-accent" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + i * 0.1 }}
            className="border border-white/5 rounded-xl p-3 bg-white/[0.02]"
          >
            <p className="text-[9px] font-mono text-muted tracking-wider font-medium">{s.label}</p>
            <p className={`text-xl font-black font-mono ${s.col}`}>{s.val}</p>
          </motion.div>
        ))}
      </div>
      <div className="space-y-0">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 + i * 0.08 }}
            className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${item.pct <= 15 ? "bg-danger animate-pulse" : item.pct <= 40 ? "bg-warning" : "bg-success"}`} />
              <span className="text-xs font-medium">{item.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-muted font-mono">{item.cat}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ delay: 2.2 + i * 0.1, duration: 0.8 }}
                  className={`h-full rounded-full ${item.pct <= 15 ? "bg-danger" : item.pct <= 40 ? "bg-warning" : "bg-success"}`}
                />
              </div>
              <span className={`text-[10px] font-mono font-bold tabular-nums ${item.pct <= 15 ? "text-danger" : item.pct <= 40 ? "text-warning" : "text-success"}`}>
                {item.pct}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
