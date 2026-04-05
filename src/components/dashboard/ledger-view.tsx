"use client";

import { InventoryItem } from "@/lib/types";
import { CATEGORIES, UNIT_TYPES } from "@/lib/types";
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
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUp, Flame, TrendingUp, Trash2, Pencil, X, Check } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  items: InventoryItem[];
  onItemsChange?: () => void;
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

export function LedgerView({ items, onItemsChange }: Props) {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<InventoryItem>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await supabase.from("items").delete().eq("id", id);
    setDeletingId(null);
    onItemsChange?.();
  };

  const startEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      category: item.category,
      unit_type: item.unit_type,
      current_stock_level: item.current_stock_level,
      max_stock_level: item.max_stock_level,
      daily_burn_rate: item.daily_burn_rate,
    });
  };

  const saveEdit = async () => {
    if (!editingItem) return;
    await supabase.from("items").update(editForm).eq("id", editingItem.id);
    setEditingItem(null);
    setEditForm({});
    onItemsChange?.();
  };

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
              <th className="text-left px-4 py-3 text-[11px] font-mono text-muted tracking-wider">
                ACTIONS
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
                    idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]",
                    deletingId === item.id ? "opacity-30" : ""
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-all"
                        title="Edit item"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-all"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingItem(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-card border border-card-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold">Edit Item</h3>
                <button onClick={() => setEditingItem(null)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5 font-bold">NAME</label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-white/[0.03] border border-white/[0.08] rounded-xl text-foreground focus:outline-none focus:border-accent/40 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5 font-bold">CATEGORY</label>
                    <select
                      value={editForm.category || ""}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-white/[0.03] border border-white/[0.08] rounded-xl text-foreground focus:outline-none focus:border-accent/40 transition-colors"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5 font-bold">UNIT</label>
                    <select
                      value={editForm.unit_type || ""}
                      onChange={(e) => setEditForm({ ...editForm, unit_type: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-white/[0.03] border border-white/[0.08] rounded-xl text-foreground focus:outline-none focus:border-accent/40 transition-colors"
                    >
                      {UNIT_TYPES.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5 font-bold">CURRENT</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editForm.current_stock_level || 0}
                      onChange={(e) => setEditForm({ ...editForm, current_stock_level: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2.5 text-sm bg-white/[0.03] border border-white/[0.08] rounded-xl text-foreground focus:outline-none focus:border-accent/40 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5 font-bold">MAX</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editForm.max_stock_level || 0}
                      onChange={(e) => setEditForm({ ...editForm, max_stock_level: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2.5 text-sm bg-white/[0.03] border border-white/[0.08] rounded-xl text-foreground focus:outline-none focus:border-accent/40 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5 font-bold">BURN/DAY</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.daily_burn_rate || 0}
                      onChange={(e) => setEditForm({ ...editForm, daily_burn_rate: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2.5 text-sm bg-white/[0.03] border border-white/[0.08] rounded-xl text-foreground focus:outline-none focus:border-accent/40 transition-colors font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={saveEdit}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
