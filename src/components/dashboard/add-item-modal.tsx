"use client";

import { useState } from "react";
import { InventoryItem, CATEGORIES, UNIT_TYPES } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onAdd: (item: Omit<InventoryItem, "id" | "created_at">) => void;
}

export function AddItemModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [unitType, setUnitType] = useState<string>(UNIT_TYPES[0]);
  const [currentStock, setCurrentStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [burnRate, setBurnRate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !currentStock || !maxStock || !burnRate) return;
    onAdd({
      name,
      category,
      unit_type: unitType,
      current_stock_level: parseFloat(currentStock),
      max_stock_level: parseFloat(maxStock),
      daily_burn_rate: parseFloat(burnRate),
      last_restock_date: new Date().toISOString(),
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", bounce: 0.2 }}
          className="relative w-full max-w-lg mx-4 bg-card border border-card-border rounded-2xl shadow-2xl"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
            <div>
              <h3 className="text-sm font-semibold">Add Inventory Item</h3>
              <p className="text-[11px] text-muted mt-0.5">
                Register a new item to the ledger
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5">
                ITEM NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Organic Whole Milk"
                className="w-full px-3 py-2.5 text-sm bg-background border border-card-border rounded-lg text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/40 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5">
                  CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-accent/40 transition-colors"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5">
                  UNIT TYPE
                </label>
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-accent/40 transition-colors"
                >
                  {UNIT_TYPES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5">
                  CURRENT STOCK
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3 py-2.5 text-sm bg-background border border-card-border rounded-lg text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/40 transition-colors font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5">
                  MAX CAPACITY
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={maxStock}
                  onChange={(e) => setMaxStock(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3 py-2.5 text-sm bg-background border border-card-border rounded-lg text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/40 transition-colors font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-muted tracking-wider block mb-1.5">
                  BURN RATE/DAY
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={burnRate}
                  onChange={(e) => setBurnRate(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3 py-2.5 text-sm bg-background border border-card-border rounded-lg text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/40 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-medium bg-white/5 border border-card-border rounded-lg text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-sm font-medium bg-accent/10 border border-accent/20 rounded-lg text-accent hover:bg-accent/20 transition-all"
              >
                Add to Ledger
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
