"use client";

import { InventoryItem } from "@/lib/types";
import { estimatedRemainingPercent, daysUntilEmpty } from "@/lib/inventory";
import { motion } from "framer-motion";
import { Tag, TrendingDown, Zap, ShoppingCart } from "lucide-react";

interface Props {
  items: InventoryItem[];
}

interface DealSuggestion {
  itemName: string;
  category: string;
  pctRemaining: number;
  daysLeft: number;
  priority: "urgent" | "soon" | "plan";
  suggestion: string;
}

function generateDealSuggestions(items: InventoryItem[]): DealSuggestion[] {
  return items
    .map((item) => {
      const pct = estimatedRemainingPercent(item);
      const days = daysUntilEmpty(item);
      let priority: "urgent" | "soon" | "plan";
      let suggestion: string;

      if (days <= 1) {
        priority = "urgent";
        suggestion = "Buy today — stock depleted or depleting within 24h";
      } else if (days <= 3) {
        priority = "urgent";
        suggestion = `Only ${days} days left — restock this week`;
      } else if (days <= 7) {
        priority = "soon";
        suggestion = `${days} days remaining — add to next shopping list`;
      } else {
        priority = "plan";
        suggestion = `${days} days left — plan ahead for bulk deals`;
      }

      return {
        itemName: item.name,
        category: item.category,
        pctRemaining: pct,
        daysLeft: days,
        priority,
        suggestion,
      };
    })
    .filter((d) => d.daysLeft <= 10)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

export function DealsView({ items }: Props) {
  const deals = generateDealSuggestions(items);
  const urgentCount = deals.filter((d) => d.priority === "urgent").length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-3 bg-accent/5 border border-accent/20 rounded-xl"
      >
        <Zap className="w-4 h-4 text-accent" />
        <p className="text-sm text-accent">
          <span className="font-semibold">{deals.length} items</span>{" "}
          need restocking — {urgentCount} urgent
        </p>
      </motion.div>

      {/* Shopping list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.length === 0 ? (
          <p className="text-sm text-muted col-span-full py-12 text-center">
            All items are well-stocked. No shopping needed right now.
          </p>
        ) : (
          deals.map((deal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <DealCard deal={deal} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: DealSuggestion }) {
  const borderColor = deal.priority === "urgent"
    ? "border-danger/30 hover:border-danger/50"
    : deal.priority === "soon"
    ? "border-warning/30 hover:border-warning/50"
    : "border-card-border hover:border-accent/20";

  const priorityBadge = deal.priority === "urgent"
    ? { text: "URGENT", color: "bg-danger/10 border-danger/20 text-danger" }
    : deal.priority === "soon"
    ? { text: "SOON", color: "bg-warning/10 border-warning/20 text-warning" }
    : { text: "PLAN", color: "bg-accent/10 border-accent/20 text-accent" };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className={`border rounded-xl bg-card p-4 transition-all group cursor-default ${borderColor}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium group-hover:text-accent transition-colors">
            {deal.itemName}
          </p>
          <p className="text-[11px] text-muted font-mono mt-0.5 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {deal.category}
          </p>
        </div>
        <span className={`px-2 py-0.5 border text-[11px] font-mono rounded-md ${priorityBadge.color}`}>
          {priorityBadge.text}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-mono font-semibold ${deal.daysLeft <= 1 ? "text-danger" : deal.daysLeft <= 3 ? "text-warning" : "text-foreground"}`}>
              {deal.daysLeft === 0 ? "NOW" : `${deal.daysLeft}d`}
            </span>
            <span className="text-xs text-muted">remaining</span>
          </div>
          <div className="mt-1 w-20 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${deal.pctRemaining <= 15 ? "bg-danger" : deal.pctRemaining <= 40 ? "bg-warning" : "bg-success"}`} style={{ width: `${deal.pctRemaining}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-muted">
          <TrendingDown className="w-3 h-3 text-danger" />
          {deal.pctRemaining}% left
        </div>
      </div>

      <p className="mt-3 text-[11px] text-muted font-medium">{deal.suggestion}</p>

      <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-medium bg-white/5 border border-card-border rounded-lg text-muted hover:text-accent hover:border-accent/30 transition-all">
        <ShoppingCart className="w-3 h-3" />
        Add to Shopping List
      </button>
    </motion.div>
  );
}
