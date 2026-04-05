"use client";

import { InventoryItem } from "@/lib/types";
import {
  estimatedRemainingPercent,
  daysUntilEmpty,
} from "@/lib/inventory";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, ShoppingCart, TrendingDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  items: InventoryItem[];
}

export function RestockView({ items }: Props) {
  const urgentItems = items
    .map((item) => ({
      ...item,
      daysLeft: daysUntilEmpty(item),
      pct: estimatedRemainingPercent(item),
    }))
    .filter((item) => item.daysLeft <= 3)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const soonItems = items
    .map((item) => ({
      ...item,
      daysLeft: daysUntilEmpty(item),
      pct: estimatedRemainingPercent(item),
    }))
    .filter((item) => item.daysLeft > 3 && item.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-6">
      {/* Alert banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-3 bg-danger/5 border border-danger/20 rounded-xl"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        >
          <AlertTriangle className="w-4 h-4 text-danger" />
        </motion.div>
        <p className="text-sm text-danger">
          <span className="font-semibold">{urgentItems.length} items</span>{" "}
          predicted to deplete within 72 hours
        </p>
      </motion.div>

      {/* Urgent */}
      <div>
        <h3 className="text-xs font-mono text-muted tracking-wider mb-3 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          CRITICAL — DEPLETES IN &le;3 DAYS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {urgentItems.length === 0 ? (
            <p className="text-sm text-muted col-span-full py-8 text-center">
              No critical items. Your supply chain is healthy.
            </p>
          ) : (
            urgentItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <RestockCard item={item} urgent />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Watch list */}
      <div>
        <h3 className="text-xs font-mono text-muted tracking-wider mb-3 flex items-center gap-2">
          <TrendingDown className="w-3.5 h-3.5" />
          WATCH LIST — DEPLETES IN 4-7 DAYS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {soonItems.length === 0 ? (
            <p className="text-sm text-muted col-span-full py-8 text-center">
              No items on the watch list.
            </p>
          ) : (
            soonItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <RestockCard item={item} urgent={false} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function RestockCard({
  item,
  urgent,
}: {
  item: InventoryItem & { daysLeft: number; pct: number };
  urgent: boolean;
}) {
  const [restocked, setRestocked] = useState(false);

  const handleRestock = async () => {
    try {
      await supabase.from("items").update({
        current_stock_level: item.max_stock_level,
        last_restock_date: new Date().toISOString(),
      }).eq("id", item.id);
      setRestocked(true);
    } catch (err) {
      console.error("Restock failed:", err);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className={cn(
        "border rounded-xl p-4 transition-all cursor-default",
        restocked ? "border-success/30 bg-success/5 opacity-60" : urgent ? "border-danger/30 bg-danger/5" : "border-warning/30 bg-warning/5"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-medium">{item.name}</h4>
          <p className="text-[11px] text-muted font-mono mt-0.5">
            {item.category} &middot; {item.current_stock_level} {item.unit_type}
          </p>
        </div>
        <div className={cn("text-right", restocked ? "text-success" : urgent ? "text-danger" : "text-warning")}>
          {restocked ? (
            <p className="text-sm font-semibold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Restocked</p>
          ) : (
            <>
              <p className="text-lg font-mono font-semibold">
                {item.daysLeft === 0 ? "NOW" : `${item.daysLeft}d`}
              </p>
              <p className="text-[10px] font-mono opacity-60">remaining</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${restocked ? 100 : item.pct}%` }}
          transition={{ duration: 0.6 }}
          className={cn("h-full rounded-full", restocked ? "bg-success" : urgent ? "bg-danger" : "bg-warning")}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted">
          Burn: {item.daily_burn_rate} {item.unit_type}/day
        </span>
        {!restocked && (
          <button
            onClick={handleRestock}
            className="flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 transition-colors"
          >
            <ShoppingCart className="w-3 h-3" />
            Mark Restocked
          </button>
        )}
      </div>
    </motion.div>
  );
}
