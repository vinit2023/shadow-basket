"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LayoutList, Camera, AlertTriangle, Tag, Brain, LineChart, Leaf, Users } from "lucide-react";

const features = [
  { icon: LayoutList, title: "Smart Ledger", description: "Real-time inventory with AI-calculated burn rates, depletion curves, and stock health scoring.", color: "from-accent/20 to-accent/5", iconColor: "text-accent" },
  { icon: Camera, title: "Photo-to-Inventory", description: "Snap a photo of your pantry. Our vision AI identifies items, estimates quantities, and categorizes instantly.", color: "from-accent-2/20 to-accent-2/5", iconColor: "text-accent-2" },
  { icon: AlertTriangle, title: "Predictive Restock", description: "ML-powered predictions flag items hitting zero within 72 hours. Never make emergency runs again.", color: "from-warning/20 to-warning/5", iconColor: "text-warning" },
  { icon: Tag, title: "Smart Deals Engine", description: "Price intelligence that finds deals on items you actually need, right when you need them.", color: "from-success/20 to-success/5", iconColor: "text-success" },
  { icon: Brain, title: "AI Meal Planner", description: "Suggests meals from what you already have. Reduces waste by 60% and saves hours of planning.", color: "from-accent-3/20 to-accent-3/5", iconColor: "text-accent-3" },
  { icon: Leaf, title: "Waste Analytics", description: "Track your waste score over time. See what you throw away most and get AI suggestions to improve.", color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-500" },
  { icon: LineChart, title: "Spending Insights", description: "See where every dollar goes. Category breakdowns, trend analysis, and budget optimization.", color: "from-blue/20 to-blue/5", iconColor: "text-blue" },
  { icon: Users, title: "Household Sync", description: "Multi-user support. Everyone sees the same inventory. No more duplicate purchases.", color: "from-purple/20 to-purple/5", iconColor: "text-purple" },
];

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[11px] font-mono text-accent tracking-[0.2em] uppercase font-bold">
            8 MODULES
          </span>
          <h2 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Not just tracking.
            <br />
            <span className="gradient-text-animate">Intelligence.</span>
          </h2>
          <p className="mt-6 text-muted max-w-lg mx-auto font-medium">
            Every feature is designed to save you time, money, and food.
            Powered by AI. Built for real life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                </motion.div>
                <h3 className="text-sm font-bold mb-1.5">{feature.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
