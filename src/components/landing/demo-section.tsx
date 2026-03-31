"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Camera, Check, ShoppingBasket, Cpu, Eye } from "lucide-react";

const scanSteps = [
  { text: "> Initializing GPT-4o vision pipeline...", delay: 0, type: "system" },
  { text: "> Image received (3.2MB) — preprocessing...", delay: 700, type: "system" },
  { text: "> Running multi-object detection (YOLOv9)...", delay: 1400, type: "system" },
  { text: "  [DETECTED] Organic Whole Milk — 1 gallon — Dairy", delay: 2000, type: "detect" },
  { text: "  [DETECTED] Free-Range Eggs — 12 count — Protein", delay: 2400, type: "detect" },
  { text: "  [DETECTED] Sourdough Bread — 1 loaf — Grains", delay: 2700, type: "detect" },
  { text: "  [DETECTED] Greek Yogurt — 32oz — Dairy", delay: 3000, type: "detect" },
  { text: "  [DETECTED] Baby Spinach — 10oz — Produce", delay: 3300, type: "detect" },
  { text: "  [DETECTED] Almond Butter — 16oz — Condiments", delay: 3600, type: "detect" },
  { text: "> Estimating quantities via depth analysis...", delay: 4000, type: "system" },
  { text: "> Calculating burn rates from historical data...", delay: 4500, type: "system" },
  { text: "> 6 items catalogued. Ledger updated.", delay: 5200, type: "done" },
];

export function DemoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isInView) return;
    const timeouts: NodeJS.Timeout[] = [];
    scanSteps.forEach((step, i) => {
      timeouts.push(setTimeout(() => setVisibleSteps((prev) => [...prev, i]), step.delay + 800));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section id="how-it-works" ref={ref} className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-mono text-accent-2 tracking-[0.2em] uppercase font-bold">HOW IT WORKS</span>
          <h2 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight">
            Photo in. <span className="gradient-text">Inventory out.</span>
          </h2>
          <p className="mt-4 text-muted max-w-md mx-auto font-medium">
            Three steps. Under two seconds. Zero manual entry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {[
              { step: "01", title: "Snap", desc: "Take a photo of any shelf, fridge, or pantry.", icon: Camera, color: "from-accent/20 to-accent/5 text-accent" },
              { step: "02", title: "AI Analyzes", desc: "GPT-4o vision identifies items, quantities, brands, and freshness.", icon: Eye, color: "from-accent-2/20 to-accent-2/5 text-accent-2" },
              { step: "03", title: "Ledger Updates", desc: "Your dashboard reflects reality. Burn rates recalculate instantly.", icon: Cpu, color: "from-success/20 to-success/5 text-success" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                whileHover={{ x: 4 }}
                className="flex gap-5 group cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center`}
                >
                  <s.icon className="w-6 h-6" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted tracking-wider font-bold">STEP {s.step}</span>
                  </div>
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-sm text-muted mt-0.5">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-accent/8 via-accent-2/8 to-accent-3/8 rounded-3xl blur-3xl opacity-50" />
            <div className="relative rounded-2xl border border-white/[0.08] overflow-hidden glass-strong">
              <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-3/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                </div>
                <span className="ml-3 text-[10px] text-muted font-mono flex items-center gap-1.5 font-medium">
                  <ShoppingBasket className="w-3 h-3" />
                  shadow-basket // vision-engine
                </span>
              </div>
              <div className="p-5 font-mono text-[11px] space-y-1 min-h-[340px] leading-relaxed">
                {scanSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={visibleSteps.includes(i) ? { opacity: 1, x: 0 } : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={
                      step.type === "done" ? "text-success font-bold flex items-center gap-1.5 pt-1" :
                      step.type === "detect" ? "text-accent" :
                      "text-muted"
                    }
                  >
                    {step.type === "done" && <Check className="w-3.5 h-3.5" />}
                    {step.text}
                  </motion.div>
                ))}
                {visibleSteps.length < scanSteps.length && (
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-2 h-4 bg-accent" />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
