"use client";

import { InventoryItem } from "@/lib/types";
import {
  estimatedRemainingPercent,
  burnRateLabel,
  statusColor,
  statusBgColor,
  healthScore,
  healthScoreLabel,
  healthScoreColor,
} from "@/lib/inventory";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUp, Flame, TrendingUp } from "lucide-react";

interface Props {
  items: InventoryItem[];
}

function BurnIndicator({ rate }: { rate: number }) {
  const label = burnRateLabel(rate);
  if (label === "HIGH")
    return (
      <span className="inline-flex items-center gap-1 text-danger text-[11px] font-mono">
        <ArrowUp className="w-3 h-3" /> HIGH
      </span>
    );
  if (label === "MED")
    return (
      <span className="inline-flex items-center gap-1 text-warning text-[11px] font-mono">
        <ArrowRight className="w-3 h-3" /> MED
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-success text-[11px] font-mono">
      <ArrowDown className="w-3 h-3" /> LOW
    </span>
  );
}

function StockBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            pct <= 15 ? "bg-danger" : pct <= 40 ? "bg-warning" : "bg-success"
          )}
        />
      </div>
      <span className={cn("text-xs font-mono tabular-nums", statusColor(pct))}>
        {pct}%
      </span>
    </div>
  );
}

export function LedgerView({ items }: Props) {
  const critical = items.filter((i) => estimatedRemainingPercent(i) <= 15).length;
  const warning = items.filter((i) => {
    const pct = estimatedRemainingPercent(i);
    return pct > 15 && pct <= 40;
  }).length;
  const healthy = items.filter((i) => estimatedRemainingPercent(i) > 40).length;

  const summaryCards = [
    { label: "TOTAL ITEMS", value: items.length, accent: "text-foreground", icon: TrendingUp },
    { label: "CRITICAL", value: critical, accent: "text-danger", icon: ArrowUp },
    { label: "WARNING", value: warning, accent: "text-warning", icon: ArrowRight },
    { label: "HEALTHY", value: healthy, accent: "text-success", icon: ArrowDown },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="border border-card-border rounded-xl bg-card p-4 hover:border-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono text-muted tracking-wider">
                {card.label}
              </p>
              <card.icon className={cn("w-3.5 h-3.5 opacity-40", card.accent)} />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className={cn("text-2xl font-semibold mt-2 font-mono", card.accent)}
            >
              {card.value}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="border border-card-border rounded-xl overflow-hidden bg-card"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-card-border bg-white/[0.01]">
              <th className="text-left px-4 py-3 text-[11px] font-mono text-muted tracking-wider">
                ITEM
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-mono text-muted tracking-wider">
                CATEGORY
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-mono text-muted tracking-wider">
                LAST PURCHASED
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-mono text-muted tracking-wider">
                EST. REMAINING
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-mono text-muted tracking-wider">
                <span className="inline-flex items-center gap-1">
                  <Flame className="w-3 h-3" /> BURN RATE
                </span>
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-mono text-muted tracking-wider">
                HEALTH
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-mono text-muted tracking-wider">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const pct = estimatedRemainingPercent(item);
              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + idx * 0.04 }}
                  className={cn(
                    "border-b border-card-border/50 hover:bg-white/[0.02] transition-colors",
                    idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={
                          pct <= 15
                            ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }
                            : {}
                        }
                        transition={
                          pct <= 15
                            ? { duration: 1.5, repeat: Infinity }
                            : {}
                        }
                        className={cn(
                          "w-2 h-2 rounded-full",
                          pct <= 15
                            ? "bg-danger"
                            : pct <= 40
                            ? "bg-warning"
                            : "bg-success"
                        )}
                      />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-[11px] text-muted font-mono">
                          {item.current_stock_level} {item.unit_type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-muted font-mono">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {formatDistanceToNow(new Date(item.last_restock_date), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <StockBar pct={pct} />
                  </td>
                  <td className="px-4 py-3">
                    <BurnIndicator rate={item.daily_burn_rate} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-sm font-mono font-black", healthScoreColor(healthScore(item)))}>
                      {healthScoreLabel(healthScore(item))}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-[11px] font-mono px-2 py-1 rounded border",
                        statusBgColor(pct)
                      )}
                    >
                      {pct <= 15 ? "CRITICAL" : pct <= 40 ? "LOW" : "OK"}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
