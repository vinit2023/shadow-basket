"use client";

import { InventoryItem } from "@/lib/types";
import { motion } from "framer-motion";
import { Leaf, TrendingDown, Award, AlertCircle, ArrowDown, Lightbulb } from "lucide-react";

interface Props { items: InventoryItem[]; }

const weeklyData = [
  { week: "W1", score: 72, waste: 4.2, color: "bg-warning" },
  { week: "W2", score: 78, waste: 3.1, color: "bg-warning" },
  { week: "W3", score: 85, waste: 2.4, color: "bg-success" },
  { week: "W4", score: 91, waste: 1.1, color: "bg-success" },
];

const wastedItems = [
  { name: "Expired Yogurt", amount: "8oz", cost: "$2.40", reason: "Forgotten in back of fridge" },
  { name: "Brown Bananas", amount: "3 units", cost: "$1.20", reason: "Over-purchased" },
  { name: "Wilted Lettuce", amount: "4oz", cost: "$1.80", reason: "Not used in time" },
];

const tips = [
  "Move dairy to eye-level shelf — items at eye level get used 40% faster",
  "Buy spinach in smaller quantities — your burn rate shows 30% goes unused",
  "Freeze bread you won't eat within 3 days — saves $8/month on average",
];

export function WasteView({ }: Props) {
  return (
    <div className="space-y-6">
      {/* Score banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-1 border border-success/20 rounded-2xl bg-gradient-to-br from-success/5 to-transparent p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-3xl" />
          <Leaf className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="text-[10px] font-mono text-muted tracking-wider font-bold mb-1">YOUR WASTE SCORE</p>
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }} className="text-6xl font-black font-mono text-success">A+</motion.p>
          <p className="text-xs text-muted mt-2 font-medium">91/100 — Top 5% of households</p>
          <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-success font-bold"><ArrowDown className="w-3 h-3" />18% improvement this month</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 border border-card-border rounded-2xl bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono text-muted tracking-wider font-bold">WEEKLY TREND</h3>
            <span className="text-[10px] text-success font-mono font-bold flex items-center gap-1"><TrendingDown className="w-3 h-3" />Waste decreasing</span>
          </div>
          <div className="flex items-end gap-3 h-32">
            {weeklyData.map((w, i) => (
              <motion.div key={w.week} initial={{ height: 0 }} animate={{ height: `${w.score}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-foreground font-bold">{w.score}</span>
                <div className={`w-full rounded-xl ${w.color} relative overflow-hidden`} style={{ height: "100%" }}>
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                </div>
                <span className="text-[9px] font-mono text-muted font-bold">{w.week}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent waste + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border border-card-border rounded-2xl bg-card p-5">
          <h3 className="text-xs font-mono text-muted tracking-wider font-bold flex items-center gap-2 mb-4"><AlertCircle className="w-3.5 h-3.5 text-danger" />RECENT WASTE LOG</h3>
          <div className="space-y-3">
            {wastedItems.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center justify-between py-2 border-b border-card-border/50 last:border-0">
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-[10px] text-muted font-mono">{item.amount} — {item.reason}</p>
                </div>
                <span className="text-sm font-mono text-danger font-bold">-{item.cost}</span>
              </motion.div>
            ))}
            <p className="text-xs text-muted text-center pt-2 font-medium">Total waste this month: <span className="text-danger font-bold">$5.40</span></p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="border border-card-border rounded-2xl bg-card p-5">
          <h3 className="text-xs font-mono text-muted tracking-wider font-bold flex items-center gap-2 mb-4"><Lightbulb className="w-3.5 h-3.5 text-warning" />AI REDUCTION TIPS</h3>
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex gap-3 py-2 border-b border-card-border/50 last:border-0">
                <div className="w-6 h-6 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Award className="w-3 h-3 text-warning" /></div>
                <p className="text-xs text-muted leading-relaxed font-medium">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
