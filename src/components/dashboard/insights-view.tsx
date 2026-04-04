"use client";

import { InventoryItem } from "@/lib/types";
import { estimatedRemainingPercent, daysUntilEmpty, healthScore } from "@/lib/inventory";
import { motion } from "framer-motion";
import { LineChart, DollarSign, TrendingDown, ShoppingCart, PieChart, AlertTriangle, Heart } from "lucide-react";

interface Props { items: InventoryItem[]; }

export function InsightsView({ items }: Props) {
  // Real category breakdown from inventory
  const categories = Array.from(new Set(items.map((i) => i.category)));
  const categoryData = categories.map((cat) => {
    const catItems = items.filter((i) => i.category === cat);
    const count = catItems.length;
    const pct = items.length > 0 ? Math.round((count / items.length) * 100) : 0;
    const avgRemaining = Math.round(catItems.reduce((s, i) => s + estimatedRemainingPercent(i), 0) / catItems.length);
    return { name: cat, count, pct, avgRemaining };
  }).sort((a, b) => b.pct - a.pct);

  const colors = ["bg-success", "bg-accent", "bg-accent-3", "bg-warning", "bg-danger", "bg-accent-2"];

  // Real stats
  const totalItems = items.length;
  const avgHealth = items.length > 0 ? Math.round(items.reduce((s, i) => s + healthScore(i), 0) / items.length) : 0;
  const criticalCount = items.filter((i) => estimatedRemainingPercent(i) <= 15).length;
  const depletingSoon = items.filter((i) => daysUntilEmpty(i) <= 3).length;

  // Burn rate analysis per category
  const burnByCategory = categories.map((cat) => {
    const catItems = items.filter((i) => i.category === cat);
    const avgBurn = catItems.reduce((s, i) => s + i.daily_burn_rate, 0) / catItems.length;
    return { name: cat, avgBurn: Math.round(avgBurn * 100) / 100, count: catItems.length };
  }).sort((a, b) => b.avgBurn - a.avgBurn);

  // Stock distribution
  const wellStocked = items.filter((i) => estimatedRemainingPercent(i) > 60).length;
  const moderate = items.filter((i) => { const p = estimatedRemainingPercent(i); return p > 30 && p <= 60; }).length;
  const low = items.filter((i) => { const p = estimatedRemainingPercent(i); return p > 0 && p <= 30; }).length;
  const depleted = items.filter((i) => estimatedRemainingPercent(i) <= 0).length;

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "TOTAL ITEMS", value: String(totalItems), icon: ShoppingCart, color: "text-accent" },
          { label: "AVG HEALTH", value: `${avgHealth}%`, icon: Heart, color: avgHealth >= 70 ? "text-success" : avgHealth >= 40 ? "text-warning" : "text-danger" },
          { label: "CRITICAL", value: String(criticalCount), icon: AlertTriangle, color: criticalCount > 0 ? "text-danger" : "text-success" },
          { label: "DEPLETING <3D", value: String(depletingSoon), icon: TrendingDown, color: depletingSoon > 0 ? "text-warning" : "text-success" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="border border-card-border rounded-2xl bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-mono text-muted tracking-wider font-bold">{stat.label}</p>
              <stat.icon className="w-3.5 h-3.5 text-muted/40" />
            </div>
            <p className={`text-2xl font-black font-mono mt-2 ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stock distribution */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border border-card-border rounded-2xl bg-card p-6">
          <h3 className="text-xs font-mono text-muted tracking-wider font-bold flex items-center gap-2 mb-6"><LineChart className="w-3.5 h-3.5" />STOCK DISTRIBUTION</h3>
          <div className="flex items-end gap-3 h-40">
            {[
              { label: "Well Stocked", value: wellStocked, color: "bg-success" },
              { label: "Moderate", value: moderate, color: "bg-warning" },
              { label: "Low", value: low, color: "bg-danger" },
              { label: "Depleted", value: depleted, color: "bg-danger/60" },
            ].map((bar, i) => {
              const maxVal = Math.max(wellStocked, moderate, low, depleted, 1);
              return (
                <motion.div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono text-foreground font-bold">{bar.value}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(bar.value / maxVal) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                    className={`w-full rounded-xl ${bar.color} relative overflow-hidden`}
                    style={{ minHeight: bar.value > 0 ? "8px" : "0" }}
                  >
                    <motion.div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" animate={{ opacity: [0, 0.3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} />
                  </motion.div>
                  <span className="text-[9px] font-mono text-muted font-bold text-center">{bar.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Category breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="border border-card-border rounded-2xl bg-card p-6">
          <h3 className="text-xs font-mono text-muted tracking-wider font-bold flex items-center gap-2 mb-6"><PieChart className="w-3.5 h-3.5" />CATEGORY BREAKDOWN</h3>
          <div className="space-y-3">
            {categoryData.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className="flex items-center gap-3">
                <span className="text-xs font-medium w-20 text-muted">{cat.name}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }} className={`h-full rounded-full ${colors[i % colors.length]}`} />
                </div>
                <span className="text-[10px] font-mono text-muted font-bold w-10 text-right">{cat.pct}%</span>
                <span className="text-[10px] font-mono text-foreground font-bold w-14 text-right">{cat.count} items</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Burn rate by category */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="border border-card-border rounded-2xl bg-card p-6">
        <h3 className="text-xs font-mono text-muted tracking-wider font-bold flex items-center gap-2 mb-6"><DollarSign className="w-3.5 h-3.5" />CONSUMPTION RATE BY CATEGORY</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {burnByCategory.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.05 }} className="border border-card-border rounded-xl p-3 text-center">
              <p className="text-[10px] font-mono text-muted font-bold truncate">{cat.name}</p>
              <p className={`text-lg font-black font-mono mt-1 ${cat.avgBurn >= 2 ? "text-danger" : cat.avgBurn >= 0.5 ? "text-warning" : "text-success"}`}>{cat.avgBurn}</p>
              <p className="text-[9px] font-mono text-muted">units/day</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
