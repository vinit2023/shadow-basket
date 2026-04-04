"use client";

import { InventoryItem } from "@/lib/types";
import { estimatedRemainingPercent, daysUntilEmpty, healthScore, healthScoreLabel, healthScoreColor } from "@/lib/inventory";
import { motion } from "framer-motion";
import { Leaf, TrendingDown, Award, AlertCircle, ArrowDown, Lightbulb } from "lucide-react";

interface Props { items: InventoryItem[]; }

export function WasteView({ items }: Props) {
  // Calculate real waste score from inventory health
  const avgScore = items.length > 0
    ? Math.round(items.reduce((sum, item) => sum + healthScore(item), 0) / items.length)
    : 100;

  const grade = healthScoreLabel(avgScore);
  const gradeColor = healthScoreColor(avgScore);

  // Find items at risk of waste (low remaining, high burn)
  const atRiskItems = items
    .map((item) => ({
      ...item,
      pct: estimatedRemainingPercent(item),
      daysLeft: daysUntilEmpty(item),
      score: healthScore(item),
    }))
    .filter((item) => item.pct <= 30)
    .sort((a, b) => a.pct - b.pct);

  // Calculate category waste risk
  const categories = Array.from(new Set(items.map((i) => i.category)));
  const categoryRisk = categories.map((cat) => {
    const catItems = items.filter((i) => i.category === cat);
    const avgPct = Math.round(catItems.reduce((s, i) => s + estimatedRemainingPercent(i), 0) / catItems.length);
    return { name: cat, count: catItems.length, avgRemaining: avgPct };
  }).sort((a, b) => a.avgRemaining - b.avgRemaining);

  // Dynamic tips based on actual inventory
  const tips: string[] = [];
  const criticalItems = atRiskItems.filter((i) => i.pct <= 15);
  if (criticalItems.length > 0) {
    tips.push(`${criticalItems.map((i) => i.name).join(", ")} ${criticalItems.length === 1 ? "is" : "are"} critically low — use or restock today`);
  }
  const highBurnItems = items.filter((i) => i.daily_burn_rate >= 2).slice(0, 2);
  if (highBurnItems.length > 0) {
    tips.push(`${highBurnItems.map((i) => i.name).join(" and ")} ${highBurnItems.length === 1 ? "has" : "have"} high burn rates — consider buying in bulk`);
  }
  const lowStockCategories = categoryRisk.filter((c) => c.avgRemaining <= 30);
  if (lowStockCategories.length > 0) {
    tips.push(`Your ${lowStockCategories.map((c) => c.name).join(", ")} ${lowStockCategories.length === 1 ? "category is" : "categories are"} running low overall`);
  }
  if (tips.length === 0) {
    tips.push("Great job! Your inventory is well-managed with minimal waste risk");
  }

  const percentile = avgScore >= 90 ? "Top 5%" : avgScore >= 80 ? "Top 15%" : avgScore >= 60 ? "Top 40%" : "Needs attention";

  return (
    <div className="space-y-6">
      {/* Score banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-1 border border-success/20 rounded-2xl bg-gradient-to-br from-success/5 to-transparent p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-3xl" />
          <Leaf className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="text-[10px] font-mono text-muted tracking-wider font-bold mb-1">YOUR WASTE SCORE</p>
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }} className={`text-6xl font-black font-mono ${gradeColor}`}>{grade}</motion.p>
          <p className="text-xs text-muted mt-2 font-medium">{avgScore}/100 — {percentile}</p>
          <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-success font-bold"><ArrowDown className="w-3 h-3" />{items.length} items tracked</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 border border-card-border rounded-2xl bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono text-muted tracking-wider font-bold">CATEGORY HEALTH</h3>
            <span className="text-[10px] text-success font-mono font-bold flex items-center gap-1"><TrendingDown className="w-3 h-3" />Real-time analysis</span>
          </div>
          <div className="flex items-end gap-3 h-32">
            {categoryRisk.slice(0, 6).map((cat, i) => (
              <motion.div key={cat.name} initial={{ height: 0 }} animate={{ height: `${cat.avgRemaining}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-foreground font-bold">{cat.avgRemaining}%</span>
                <div className={`w-full rounded-xl relative overflow-hidden ${cat.avgRemaining <= 15 ? "bg-danger" : cat.avgRemaining <= 40 ? "bg-warning" : "bg-success"}`} style={{ height: "100%" }}>
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                </div>
                <span className="text-[9px] font-mono text-muted font-bold truncate w-full text-center">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* At-risk items + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border border-card-border rounded-2xl bg-card p-5">
          <h3 className="text-xs font-mono text-muted tracking-wider font-bold flex items-center gap-2 mb-4"><AlertCircle className="w-3.5 h-3.5 text-danger" />AT-RISK ITEMS</h3>
          <div className="space-y-3">
            {atRiskItems.length === 0 ? (
              <p className="text-sm text-muted text-center py-4 font-medium">No items at risk of waste. Great job!</p>
            ) : (
              atRiskItems.slice(0, 5).map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center justify-between py-2 border-b border-card-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-[10px] text-muted font-mono">{item.pct}% remaining — {item.daysLeft === 0 ? "depleted" : `${item.daysLeft}d left`}</p>
                  </div>
                  <span className={`text-sm font-mono font-bold ${healthScoreColor(item.score)}`}>{healthScoreLabel(item.score)}</span>
                </motion.div>
              ))
            )}
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
