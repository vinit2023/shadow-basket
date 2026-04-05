"use client";

import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import { ArrowRight, ShoppingBasket, Sparkles, Zap, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// Typewriter with smooth cursor
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
        className="inline-block w-[3px] h-[0.85em] bg-accent ml-1 align-middle rounded-full"
      />
    </span>
  );
}

// Animated counter
function Counter({ target, suffix = "", prefix = "" }: { target: string; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);
  const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ""));

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = numericTarget / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericTarget) {
        current = numericTarget;
        clearInterval(timer);
      }
      setValue(current);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numericTarget]);

  const display = target.includes(".")
    ? `${prefix}${value.toFixed(1)}${suffix}`
    : `${prefix}${Math.round(value)}${suffix}`;

  return <span ref={ref}>{isInView ? display : `${prefix}0${suffix}`}</span>;
}

export function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [4, -4]);
  const rotateY = useTransform(mouseX, [-300, 300], [-4, 4]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto text-center relative z-10"
      >
        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-10"
        >
          <motion.span
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/[0.08] text-xs backdrop-blur-xl bg-white/[0.03]"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
            </motion.div>
            <span className="text-muted font-medium">Powered by AI Vision Intelligence</span>
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-accent/20 to-accent-2/20 text-accent text-[10px] font-bold tracking-wide"
            >
              BETA
            </motion.span>
          </motion.span>
        </motion.div>

        {/* Headline — bigger, bolder */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-[-0.03em] leading-[0.9]"
        >
          <span className="block text-foreground">Your kitchen.</span>
          <span className="block mt-2">
            <TypewriterText
              texts={["Quantified.", "Predicted.", "Optimized.", "Automated."]}
              className="gradient-text-animate"
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Shadow Basket is the{" "}
          <span className="text-foreground font-semibold">AI-native command center</span> for home inventory.
          Snap a photo. Track burn rates. Predict restocks.{" "}
          <span className="text-accent font-semibold">Eliminate waste.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/auth?mode=signup" className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold overflow-hidden shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-shadow">
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
          <a href="#how-it-works" className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/[0.08] text-sm text-muted hover:text-foreground hover:border-white/20 hover:bg-white/[0.02] transition-all font-medium backdrop-blur-sm">
            <Play className="w-4 h-4 text-accent" />
            See How It Works
          </a>
        </motion.div>

        {/* Stats — animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto"
        >
          {[
            { value: "99.2", suffix: "%", label: "AI Accuracy" },
            { value: "1.8", suffix: "s", label: "Photo Scan" },
            { prefix: "$", value: "52", suffix: "", label: "Monthly Savings" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.15 }}
              whileHover={{ scale: 1.08, y: -4 }}
              className="text-center group cursor-default relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity -m-3" />
              <p className="text-3xl sm:text-4xl font-black font-mono gradient-text-animate relative">
                <Counter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
              </p>
              <p className="text-[10px] text-muted mt-2 tracking-[0.2em] uppercase font-bold relative">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 3D Floating dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
          className="mt-24 relative mx-auto max-w-4xl"
          style={{ perspective: 1200 }}
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
          {/* Glow behind card */}
          <motion.div
            className="absolute -inset-8 rounded-3xl opacity-60"
            style={{
              background: "linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(124,58,237,0.12) 50%, rgba(244,63,94,0.10) 100%)",
              filter: "blur(60px)",
            }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <motion.div
            style={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
            className="relative rounded-2xl border border-white/[0.1] overflow-hidden shadow-2xl shadow-black/40"
          >
            {/* Glass top bar */}
            <div className="h-11 border-b border-white/[0.06] flex items-center px-4 gap-2 bg-white/[0.02] backdrop-blur-xl">
              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-accent-3/70" />
                <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-warning/70" />
                <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-success/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
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
          transition={{ delay: 3 }}
          className="mt-20 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] text-muted/40 tracking-[0.3em] uppercase font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border border-white/[0.08] flex items-start justify-center pt-2"
          >
            <motion.div
              animate={{ height: [6, 14, 6], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 rounded-full bg-accent/60"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function DashboardPreview() {
  const items = [
    { name: "Organic Milk", cat: "Dairy", pct: 23, burn: "HIGH", health: "C" },
    { name: "Sourdough Bread", cat: "Grains", pct: 67, burn: "MED", health: "A" },
    { name: "Free-Range Eggs", cat: "Protein", pct: 8, burn: "CRIT", health: "F" },
    { name: "Avocados", cat: "Produce", pct: 45, burn: "MED", health: "B" },
    { name: "Greek Yogurt", cat: "Dairy", pct: 12, burn: "HIGH", health: "D" },
  ];
  return (
    <div className="p-6 bg-card/80 backdrop-blur-xl">
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
            transition={{ delay: 1.8 + i * 0.1 }}
            className="border border-white/[0.06] rounded-xl p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
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
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.2 + i * 0.1 }}
            className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] px-2 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={item.pct <= 15 ? { scale: [1, 1.4, 1] } : {}}
                transition={item.pct <= 15 ? { duration: 1.5, repeat: Infinity } : {}}
                className={`w-2 h-2 rounded-full ${item.pct <= 15 ? "bg-danger" : item.pct <= 40 ? "bg-warning" : "bg-success"}`}
              />
              <span className="text-xs font-medium">{item.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-muted font-mono">{item.cat}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-mono font-black ${item.pct <= 15 ? "text-danger" : item.pct <= 40 ? "text-warning" : "text-success"}`}>
                {item.health}
              </span>
              <div className="w-20 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ delay: 2.4 + i * 0.1, duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${item.pct <= 15 ? "bg-danger" : item.pct <= 40 ? "bg-warning" : "bg-success"}`}
                />
              </div>
              <span className={`text-[10px] font-mono font-bold tabular-nums w-8 text-right ${item.pct <= 15 ? "text-danger" : item.pct <= 40 ? "text-warning" : "text-success"}`}>
                {item.pct}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
