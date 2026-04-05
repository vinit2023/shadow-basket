"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Camera, Check, ShoppingBasket, Cpu, Eye, ArrowRight, Mic, Brain } from "lucide-react";

const photoScanSteps = [
  { text: "> Initializing Llama 3.2 Vision pipeline...", delay: 0, type: "system" },
  { text: "> Image received (3.2MB) — preprocessing...", delay: 700, type: "system" },
  { text: "> Running multi-object detection...", delay: 1400, type: "system" },
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

const voiceScanSteps = [
  { text: "> Wake word detected: \"Hey Shadow\"", delay: 0, type: "system" },
  { text: "> Listening... capturing audio stream...", delay: 600, type: "system" },
  { text: "> Transcript: \"add 2 gallons of milk\"", delay: 1200, type: "detect" },
  { text: "> Sending to Llama 3.3 70B intent parser...", delay: 1800, type: "system" },
  { text: "  [PARSED] Action: ADD", delay: 2400, type: "detect" },
  { text: "  [PARSED] Item: Milk", delay: 2700, type: "detect" },
  { text: "  [PARSED] Quantity: 2 gallons", delay: 3000, type: "detect" },
  { text: "  [PARSED] Category: Dairy (auto-detected)", delay: 3300, type: "detect" },
  { text: "  [PARSED] Confidence: 98.2%", delay: 3600, type: "detect" },
  { text: "> Executing command against inventory...", delay: 4000, type: "system" },
  { text: "> Speaking response: \"Added 2 gallons of milk\"", delay: 4500, type: "system" },
  { text: "> Command executed. Ledger updated.", delay: 5200, type: "done" },
];

const photoSteps = [
  {
    step: "01", title: "Snap", desc: "Point your camera at any shelf, fridge, or pantry. One photo is all it takes.",
    icon: Camera, color: "text-accent", bg: "from-accent/20 to-accent/5", border: "border-accent/20",
  },
  {
    step: "02", title: "AI Analyzes", desc: "Llama 3.2 Vision identifies every item — quantity, category, and freshness.",
    icon: Eye, color: "text-accent-2", bg: "from-accent-2/20 to-accent-2/5", border: "border-accent-2/20",
  },
  {
    step: "03", title: "Ledger Updates", desc: "Your inventory reflects reality. Burn rates and predictions recalculate instantly.",
    icon: Cpu, color: "text-success", bg: "from-success/20 to-success/5", border: "border-success/20",
  },
];

const voiceSteps = [
  {
    step: "01", title: "Speak", desc: "Say \"Hey Shadow\" followed by your command. Add, restock, or delete — hands-free.",
    icon: Mic, color: "text-cyan-400", bg: "from-cyan-400/20 to-cyan-400/5", border: "border-cyan-400/20",
  },
  {
    step: "02", title: "AI Parses", desc: "Llama 3.3 70B understands natural language and extracts intent, item, and quantity.",
    icon: Brain, color: "text-accent-2", bg: "from-accent-2/20 to-accent-2/5", border: "border-accent-2/20",
  },
  {
    step: "03", title: "Ledger Updates", desc: "Your inventory updates instantly. Shadow speaks back to confirm the action.",
    icon: Cpu, color: "text-success", bg: "from-success/20 to-success/5", border: "border-success/20",
  },
];

export function DemoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState<"photo" | "voice">("photo");

  const currentScanSteps = mode === "photo" ? photoScanSteps : voiceScanSteps;
  const currentSteps = mode === "photo" ? photoSteps : voiceSteps;

  // Auto-toggle between photo and voice every 8 seconds
  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setMode((prev) => (prev === "photo" ? "voice" : "photo"));
    }, 8000);
    return () => clearInterval(timer);
  }, [isInView]);

  // Reset terminal animation when mode changes
  useEffect(() => {
    if (!isInView) return;
    setVisibleSteps([]);
    setActiveStep(0);
    const timeouts: NodeJS.Timeout[] = [];
    currentScanSteps.forEach((step, i) => {
      timeouts.push(setTimeout(() => setVisibleSteps((prev) => [...prev, i]), step.delay + 800));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [isInView, mode, currentScanSteps]);

  // Auto-cycle through step cards
  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, [isInView, mode]);

  return (
    <section id="how-it-works" ref={ref} className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-2/20 bg-accent-2/5 text-[11px] font-mono text-accent-2 tracking-[0.2em] uppercase font-bold mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent-2 animate-pulse" />
            HOW IT WORKS
          </motion.span>

          {/* Alternating headline */}
          <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]">
            <AnimatePresence mode="wait">
              <motion.span
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className={mode === "photo" ? "text-accent" : "text-cyan-400"}
              >
                {mode === "photo" ? "Photo" : "Voice"}
              </motion.span>
            </AnimatePresence>
            {" "}in. <span className="gradient-text">Inventory out.</span>
          </h2>

          <p className="mt-6 text-muted max-w-md mx-auto font-medium text-base">
            {mode === "photo"
              ? "Three steps. Under two seconds. Zero manual entry."
              : "Just speak. AI understands. Inventory updates."}
          </p>

          {/* Mode toggle pills */}
          <div className="mt-6 inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <button
              onClick={() => setMode("photo")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "photo"
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted hover:text-foreground border border-transparent"
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Photo
            </button>
            <button
              onClick={() => setMode("voice")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "voice"
                  ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                  : "text-muted hover:text-foreground border border-transparent"
              }`}
            >
              <Mic className="w-3.5 h-3.5" /> Voice
            </button>
          </div>
        </motion.div>

        {/* Steps — horizontal with connecting line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative"
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-[1px]">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="h-full bg-gradient-to-r from-accent/30 via-accent-2/30 to-success/30 origin-left"
            />
          </div>

          <AnimatePresence mode="wait">
            {currentSteps.map((s, i) => (
              <motion.div
                key={`${mode}-${s.step}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                onMouseEnter={() => setActiveStep(i)}
                className={`relative p-6 rounded-2xl border transition-all duration-500 cursor-default ${
                  activeStep === i
                    ? "border-white/[0.1] bg-white/[0.04] shadow-lg"
                    : "border-white/[0.04] bg-white/[0.01]"
                }`}
              >
                {activeStep === i && (
                  <motion.div
                    layoutId="step-glow"
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${s.bg} opacity-30`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative z-10">
                  <motion.div
                    animate={activeStep === i ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.bg} border ${s.border} flex items-center justify-center mb-5`}
                  >
                    <s.icon className={`w-6 h-6 ${s.color}`} />
                  </motion.div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-muted tracking-wider font-bold">STEP {s.step}</span>
                    <ArrowRight className="w-3 h-3 text-muted/30" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-3xl mx-auto"
        >
          <motion.div
            className="absolute -inset-6 rounded-3xl opacity-50"
            style={{
              background: mode === "photo"
                ? "linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(124,58,237,0.08) 50%, rgba(0,214,143,0.06) 100%)"
                : "linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(124,58,237,0.08) 50%, rgba(0,214,143,0.06) 100%)",
              filter: "blur(40px)",
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/30">
            <div className="h-11 border-b border-white/[0.06] flex items-center px-4 gap-2 bg-white/[0.02] backdrop-blur-xl">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-3/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <span className="ml-3 text-[10px] text-muted font-mono flex items-center gap-1.5 font-medium">
                <ShoppingBasket className="w-3 h-3" />
                shadow-basket // {mode === "photo" ? "vision-engine" : "voice-engine"}
              </span>
            </div>
            <div className="p-6 font-mono text-[11px] space-y-1.5 min-h-[340px] leading-relaxed bg-card/80">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentScanSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={visibleSteps.includes(i) ? { opacity: 1, x: 0 } : { opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={
                        step.type === "done" ? "text-success font-bold flex items-center gap-2 pt-2" :
                        step.type === "detect" ? mode === "photo" ? "text-accent" : "text-cyan-400" :
                        "text-muted"
                      }
                    >
                      {step.type === "done" && <Check className="w-4 h-4" />}
                      {step.text}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
              {visibleSteps.length < currentScanSteps.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className={`inline-block w-2 h-4 rounded-sm ${mode === "photo" ? "bg-accent" : "bg-cyan-400"}`}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
