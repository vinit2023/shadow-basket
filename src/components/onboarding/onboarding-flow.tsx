"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, LayoutList, Camera, AlertTriangle, Plus, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Brain, Leaf, LineChart } from "lucide-react";

interface Step {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  visual: React.ReactNode;
}

const steps: Step[] = [
  { id: "welcome", icon: ShoppingBasket, title: "Welcome to Shadow Basket", subtitle: "AI-powered home supply intelligence", description: "Shadow Basket gives you complete visibility into what you have, how fast it's depleting, and what to buy next. Powered by AI vision and predictive analytics.", visual: <WelcomeVisual /> },
  { id: "ledger", icon: LayoutList, title: "The Smart Ledger", subtitle: "Your real-time command center", description: "Track every item with live stock levels, AI-calculated burn rates, depletion curves, and health scores. It's the Bloomberg terminal for your kitchen.", visual: <LedgerVisual /> },
  { id: "add", icon: Plus, title: "Add Items Instantly", subtitle: "Photo scan or manual entry", description: "Snap a photo of your pantry and our GPT-4o vision AI identifies everything. Or add items manually with our quick-entry form. Your choice.", visual: <AddVisual /> },
  { id: "restock", icon: AlertTriangle, title: "Predictive Replenishment", subtitle: "AI predicts before you run out", description: "Machine learning analyzes your consumption patterns and flags items depleting within 72 hours. No more emergency grocery runs.", visual: <RestockVisual /> },
  { id: "ai", icon: Brain, title: "AI Meal Planner & Waste Score", subtitle: "Unique features you won't find anywhere else", description: "Our AI suggests meals from what you have, tracks your waste score over time, and provides spending insights across all categories.", visual: <AIFeaturesVisual /> },
  { id: "ready", icon: Sparkles, title: "You're all set!", subtitle: "Time to take control", description: "Your dashboard is ready. Start by scanning a photo of your kitchen or adding your first items manually.", visual: <ReadyVisual /> },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const next = () => isLast ? router.push("/dashboard") : setCurrentStep((s) => s + 1);
  const prev = () => currentStep > 0 && setCurrentStep((s) => s - 1);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,229,255,0.03) 0%, transparent 70%)" }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/20 flex items-center justify-center">
            <ShoppingBasket className="w-4 h-4 text-accent" />
          </div>
          <span className="text-[11px] font-mono text-muted font-bold tracking-wider">GETTING STARTED</span>
        </div>
        <button onClick={() => router.push("/dashboard")} className="text-xs text-muted hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-white/5 font-medium">Skip tour</button>
      </div>

      {/* Progress */}
      <div className="relative z-10 px-6">
        <div className="max-w-3xl mx-auto flex gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2" initial={{ width: "0%" }} animate={{ width: i <= currentStep ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-6 py-8">
        <div className="max-w-5xl w-full">
          <AnimatePresence mode="wait">
            <motion.div key={step.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.35 }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-[11px] font-mono text-muted tracking-wider uppercase font-bold">Step {currentStep + 1} of {steps.length}</span>
                </motion.div>
                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-3xl sm:text-4xl font-black tracking-tight">{step.title}</motion.h2>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-2 text-sm text-accent font-bold">{step.subtitle}</motion.p>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-6 text-muted leading-relaxed font-medium">{step.description}</motion.p>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>{step.visual}</motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <div className="relative z-10 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={prev} disabled={currentStep === 0} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-white/5 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-xs font-mono text-muted font-bold">{currentStep + 1}/{steps.length}</span>
          <button onClick={next} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold overflow-hidden relative">
            <motion.div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-2" animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} style={{ backgroundSize: "200% 200%" }} />
            <span className="relative z-10 text-white flex items-center gap-2">{isLast ? "Enter Dashboard" : "Next"}<ArrowRight className="w-4 h-4" /></span>
          </button>
        </div>
      </div>
    </div>
  );
}

function WelcomeVisual() {
  return (
    <div className="relative p-8 rounded-2xl border border-white/[0.08] glass-strong">
      <div className="text-center space-y-6">
        <motion.div animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }} transition={{ duration: 4, repeat: Infinity }} className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/20 flex items-center justify-center">
          <ShoppingBasket className="w-10 h-10 text-accent" />
        </motion.div>
        <div><p className="text-3xl font-black gradient-text-animate">SHADOW BASKET</p><p className="text-xs font-mono text-muted tracking-[0.3em] mt-1 font-bold">AI SUPPLY INTELLIGENCE</p></div>
        <div className="flex justify-center gap-2 flex-wrap">
          {["Vision AI", "Burn Rates", "Predictions", "Waste Score", "Meal Plans"].map((t, i) => (
            <motion.span key={t} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }} className="px-3 py-1 text-[10px] rounded-lg bg-white/5 border border-white/[0.08] text-muted font-mono font-bold">{t}</motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LedgerVisual() {
  const rows = [{ name: "Organic Milk", pct: 23, color: "bg-warning" }, { name: "Eggs (12ct)", pct: 8, color: "bg-danger" }, { name: "Avocados", pct: 67, color: "bg-success" }, { name: "Spinach", pct: 5, color: "bg-danger" }];
  return (
    <div className="rounded-2xl border border-white/[0.08] glass-strong overflow-hidden">
      <div className="h-8 border-b border-white/5 flex items-center px-4"><div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-accent-3/60" /><div className="w-2 h-2 rounded-full bg-warning/60" /><div className="w-2 h-2 rounded-full bg-success/60" /></div><span className="ml-3 text-[9px] text-muted font-mono font-bold">smart-ledger</span></div>
      <div className="p-4 space-y-0">
        {rows.map((row, i) => (
          <motion.div key={row.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${row.color} ${row.pct <= 15 ? "animate-pulse" : ""}`} /><span className="text-xs font-medium">{row.name}</span></div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${row.pct}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }} className={`h-full rounded-full ${row.color}`} /></div>
              <span className={`text-[10px] font-mono font-bold ${row.pct <= 15 ? "text-danger" : row.pct <= 40 ? "text-warning" : "text-success"}`}>{row.pct}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AddVisual() {
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.08] glass-strong p-5">
        <div className="flex items-center gap-3 mb-4"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center"><Plus className="w-4 h-4 text-accent" /></div><span className="text-xs font-bold">Manual Add</span></div>
        <div className="space-y-2"><div className="h-8 bg-white/[0.03] rounded-lg border border-white/5 flex items-center px-3"><span className="text-[10px] text-muted/30">Item name...</span></div></div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-accent-2/20 bg-accent-2/5 p-5">
        <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-2/20 to-accent-2/5 flex items-center justify-center"><Camera className="w-4 h-4 text-accent-2" /></div><div><span className="text-xs font-bold">Photo Scan</span><p className="text-[10px] text-muted">GPT-4o Vision AI</p></div></div>
      </motion.div>
    </div>
  );
}

function RestockVisual() {
  const items = [{ name: "Greek Yogurt", days: 0, pct: 8 }, { name: "Eggs", days: 1, pct: 11 }, { name: "Milk", days: 2, pct: 23 }];
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div key={item.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }} className="rounded-xl border border-danger/20 bg-danger/5 p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-bold">{item.name}</p><p className="text-[10px] text-muted font-mono font-bold">{item.pct}% left</p></div>
            <div className="text-right text-danger"><p className="text-lg font-mono font-black">{item.days === 0 ? "NOW" : `${item.days}d`}</p></div>
          </div>
          <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ delay: 0.5 + i * 0.1 }} className="h-full bg-danger rounded-full" /></div>
        </motion.div>
      ))}
    </div>
  );
}

function AIFeaturesVisual() {
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-accent-2/20 bg-accent-2/5 p-5">
        <div className="flex items-center gap-3 mb-3"><Brain className="w-5 h-5 text-accent-2" /><span className="text-xs font-bold">AI Meal Suggestions</span></div>
        <div className="space-y-2">{["Avocado Toast with Eggs", "Spinach & Yogurt Smoothie", "Chicken Stir-Fry with Rice"].map((m, i) => (
          <motion.div key={m} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.15 }} className="flex items-center gap-2 text-[11px] text-muted"><CheckCircle2 className="w-3 h-3 text-success" />{m}</motion.div>
        ))}</div>
      </motion.div>
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="rounded-xl border border-success/20 bg-success/5 p-4 text-center">
          <Leaf className="w-5 h-5 text-success mx-auto mb-1" /><p className="text-lg font-black font-mono text-success">A+</p><p className="text-[9px] text-muted font-mono font-bold">WASTE SCORE</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
          <LineChart className="w-5 h-5 text-accent mx-auto mb-1" /><p className="text-lg font-black font-mono text-accent">$52</p><p className="text-[9px] text-muted font-mono font-bold">SAVED/MO</p>
        </motion.div>
      </div>
    </div>
  );
}

function ReadyVisual() {
  return (
    <div className="rounded-2xl border border-white/[0.08] glass-strong p-8 text-center relative overflow-hidden">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-8 h-8 text-success" />
      </motion.div>
      <p className="text-lg font-black">Dashboard Ready</p>
      <p className="text-sm text-muted mt-2 font-medium">Click &ldquo;Enter Dashboard&rdquo; to start managing your inventory.</p>
    </div>
  );
}
