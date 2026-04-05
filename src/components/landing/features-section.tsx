"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { LayoutList, Camera, AlertTriangle, Tag, Brain, LineChart, Leaf, Users, ArrowRight } from "lucide-react";

const features = [
  {
    icon: LayoutList, title: "Smart Ledger", description: "Real-time inventory with AI-calculated burn rates, depletion curves, and stock health scoring.",
    color: "from-accent/20 to-accent/5", iconColor: "text-accent", borderHover: "hover:border-accent/30",
    detail: "Track every item with precision. See health grades (A+ to F), burn rates, and estimated days until empty — all updating in real-time.",
    gradient: "from-accent/10 via-transparent to-transparent",
  },
  {
    icon: Camera, title: "Photo-to-Inventory", description: "Snap a photo of your pantry. Our vision AI identifies items, estimates quantities, and categorizes instantly.",
    color: "from-accent-2/20 to-accent-2/5", iconColor: "text-accent-2", borderHover: "hover:border-accent-2/30",
    detail: "Powered by Llama 3.2 Vision AI. Point your camera, snap, and watch items appear in your ledger. No manual entry needed.",
    gradient: "from-accent-2/10 via-transparent to-transparent",
  },
  {
    icon: AlertTriangle, title: "Predictive Restock", description: "ML-powered predictions flag items hitting zero within 72 hours. Never make emergency runs again.",
    color: "from-warning/20 to-warning/5", iconColor: "text-warning", borderHover: "hover:border-warning/30",
    detail: "Smart alerts with urgency levels. See exactly when each item runs out and get restocking suggestions before it's too late.",
    gradient: "from-warning/10 via-transparent to-transparent",
  },
  {
    icon: Tag, title: "Smart Deals Engine", description: "Compare prices across BigBasket, Zepto, Swiggy, Amazon, Flipkart & JioMart. Find the lowest price instantly.",
    color: "from-success/20 to-success/5", iconColor: "text-success", borderHover: "hover:border-success/30",
    detail: "Click any item to see prices from 6 stores. Lowest price highlighted. One-click to buy directly on the store.",
    gradient: "from-success/10 via-transparent to-transparent",
  },
  {
    icon: Brain, title: "AI Meal Planner", description: "Suggests meals from what you already have. Full recipes with ingredients, steps, and YouTube tutorials.",
    color: "from-accent-3/20 to-accent-3/5", iconColor: "text-accent-3", borderHover: "hover:border-accent-3/30",
    detail: "Get 6 AI-generated meal ideas from your current inventory. Click any meal for the full recipe with pro tips and video links.",
    gradient: "from-accent-3/10 via-transparent to-transparent",
  },
  {
    icon: Leaf, title: "Waste Analytics", description: "Track your waste score over time. See what you throw away most and get AI suggestions to improve.",
    color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-500", borderHover: "hover:border-emerald-500/30",
    detail: "Health score dashboards, at-risk item tracking, category breakdowns, and personalized AI tips to reduce food waste.",
    gradient: "from-emerald-500/10 via-transparent to-transparent",
  },
  {
    icon: LineChart, title: "Spending Insights", description: "See where every dollar goes. Category breakdowns, trend analysis, and budget optimization.",
    color: "from-blue/20 to-blue/5", iconColor: "text-blue", borderHover: "hover:border-blue/30",
    detail: "Visual dashboards showing stock distribution, category spending, and consumption rate analysis across your household.",
    gradient: "from-blue/10 via-transparent to-transparent",
  },
  {
    icon: Users, title: "Household Sync", description: "Multi-user support. Everyone sees the same inventory. No more duplicate purchases.",
    color: "from-purple/20 to-purple/5", iconColor: "text-purple", borderHover: "hover:border-purple/30",
    detail: "Sign in with Google, GitHub, or email. All household members share the same real-time inventory view.",
    gradient: "from-purple/10 via-transparent to-transparent",
  },
];

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section id="features" ref={ref} className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-[11px] font-mono text-accent tracking-[0.2em] uppercase font-bold mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            8 MODULES
          </motion.span>
          <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]">
            Not just tracking.
            <br />
            <span className="gradient-text-animate">Intelligence.</span>
          </h2>
          <p className="mt-6 text-muted max-w-lg mx-auto font-medium text-base">
            Every feature is designed to save you time, money, and food.
          </p>
        </motion.div>

        {/* Interactive feature showcase — ElevenLabs style */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
          {/* Feature tabs — left side */}
          <div className="space-y-2">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isActive = activeFeature === i;
              return (
                <motion.button
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
                  onClick={() => setActiveFeature(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? "border-white/[0.12] bg-white/[0.04]"
                      : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Active indicator — sliding highlight */}
                  {isActive && (
                    <motion.div
                      layoutId="feature-highlight"
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 transition-transform ${isActive ? "scale-110" : ""}`}>
                      <Icon className={`w-4 h-4 ${feature.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold transition-colors ${isActive ? "text-foreground" : "text-muted"}`}>{feature.title}</p>
                      <p className="text-[11px] text-muted/70 truncate">{feature.description.split(".")[0]}.</p>
                    </div>
                    {isActive && (
                      <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
                        <ArrowRight className={`w-4 h-4 ${feature.iconColor}`} />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Feature detail — right side with morphing content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative lg:sticky lg:top-24"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
              >
                {/* Background gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${features[activeFeature].gradient} opacity-50`}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <div className="relative z-10">
                  {(() => {
                    const Icon = features[activeFeature].icon;
                    return (
                      <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${features[activeFeature].color} flex items-center justify-center mb-6`}
                      >
                        <Icon className={`w-8 h-8 ${features[activeFeature].iconColor}`} />
                      </motion.div>
                    );
                  })()}
                  <h3 className="text-2xl font-black mb-3">{features[activeFeature].title}</h3>
                  <p className="text-muted leading-relaxed mb-6">{features[activeFeature].description}</p>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-sm text-muted leading-relaxed">{features[activeFeature].detail}</p>
                  </div>

                  {/* Feature visual — mini preview */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + j * 0.1 }}
                        className="h-2 rounded-full bg-white/[0.06] overflow-hidden"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${40 + j * 20}%` }}
                          transition={{ delay: 0.4 + j * 0.1, duration: 0.8 }}
                          className={`h-full rounded-full ${
                            activeFeature % 3 === 0 ? "bg-accent/40" : activeFeature % 3 === 1 ? "bg-accent-2/40" : "bg-success/40"
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
