"use client";

import { InventoryItem } from "@/lib/types";
import { motion } from "framer-motion";
import { LineChart, DollarSign, TrendingUp, TrendingDown, ShoppingCart, PieChart } from "lucide-react";

interface Props { items: InventoryItem[]; }

const monthlySpend = [
  { month: "Oct", amount: 420 },
  { month: "Nov", amount: 385 },
  { month: "Dec", amount: 510 },
  { month: "Jan", amount: 340 },
  { month: "Feb", amount: 295 },
  { month: "Mar", amount: 310 },
];
const maxSpend = Math.max(...monthlySpend.map((m) => m.amount));

const categoryBreakdown = [
  { name: "Produce", pct: 28, color: "bg-success", amount: "$86.80" },
  { name: "Dairy", pct: 22, color: "bg-accent", amount: "$68.20" },
  { name: "Protein", pct: 25, color: "bg-accent-3", amount: "$77.50" },
  { name: "Grains", pct: 10, color: "bg-warning", amount: "$31.00" },
  { name: "Beverages", pct: 8, color: "bg-blue", amount: "$24.80" },
  { name: "Other", pct: 7, color: "bg-purple", amount: "$21.70" },
];

export function InsightsView({ items }: Props) {
  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "THIS MONTH", value: "$310", icon: DollarSign, change: "-12%", positive: true, color: "text-foreground" },
          { label: "AVG MONTHLY", value: "$377", icon: LineChart, change: "", positive: true, color: "text-muted" },
          { label: "SAVED W/ DEALS", value: "$52", icon: TrendingDown, change: "+18%", positive: true, color: "text-success" },
          { label: "TOTAL ITEMS", value: String(items.length), icon: ShoppingCart, change: "+3", positive: true, color: "text-accent" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="border border-card-border rounded-2xl bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-mono text-muted tracking-wider font-bold">{stat.label}</p>
              <stat.icon className="w-3.5 h-3.5 text-muted/40" />
            </div>
            <p className={`text-2xl font-black font-mono mt-2 ${stat.color}`}>{stat.value}</p>
            {stat.change && <p className={`text-[10px] font-mono mt-1 font-bold ${stat.positive ? "text-success" : "text-danger"}`}>{stat.positive ? <TrendingDown className="w-3 h-3 inline" /> : <TrendingUp className="w-3 h-3 inline" />} {stat.change} vs last month</p>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Spend chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border border-card-border rounded-2xl bg-card p-6">
          <h3 className="text-xs font-mono text-muted tracking-wider font-bold flex items-center gap-2 mb-6"><LineChart className="w-3.5 h-3.5" />6-MONTH SPENDING</h3>
          <div className="flex items-end gap-3 h-40">
            {monthlySpend.map((m, i) => (
              <motion.div key={m.month} className="flex-1 flex flex-col items-center gap-2" initial={{ height: 0 }}>
                <span className="text-[10px] font-mono text-foreground font-bold">${m.amount}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.amount / maxSpend) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  className="w-full rounded-xl bg-gradient-to-t from-accent/40 to-accent-2/40 relative overflow-hidden"
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" animate={{ opacity: [0, 0.3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} />
                </motion.div>
                <span className="text-[9px] font-mono text-muted font-bold">{m.month}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Category breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="border border-card-border rounded-2xl bg-card p-6">
          <h3 className="text-xs font-mono text-muted tracking-wider font-bold flex items-center gap-2 mb-6"><PieChart className="w-3.5 h-3.5" />CATEGORY BREAKDOWN</h3>
          <div className="space-y-3">
            {categoryBreakdown.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className="flex items-center gap-3">
                <span className="text-xs font-medium w-20 text-muted">{cat.name}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }} className={`h-full rounded-full ${cat.color}`} />
                </div>
                <span className="text-[10px] font-mono text-muted font-bold w-10 text-right">{cat.pct}%</span>
                <span className="text-[10px] font-mono text-foreground font-bold w-14 text-right">{cat.amount}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
