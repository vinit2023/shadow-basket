"use client";

import { type Tab } from "@/app/dashboard/page";
import { Plus, Camera, Search, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { InventoryItem } from "@/lib/types";
import { getUrgentItems } from "@/lib/inventory";

interface Props { activeTab: Tab; itemCount: number; onAddItem: () => void; onPhotoUpload: () => void; items?: InventoryItem[]; }

const TAB_TITLES: Record<Tab, string> = { ledger: "Smart Ledger", restock: "Predictive Replenishment", deals: "Smart Deals", meals: "AI Meal Planner", waste: "Waste Analytics", insights: "Spending Insights" };
const TAB_DESCRIPTIONS: Record<Tab, string> = { ledger: "Real-time inventory tracking and burn rate analysis", restock: "Items predicted to deplete within 72 hours", deals: "Price intelligence for low-stock items", meals: "AI-generated meal suggestions from your current inventory", waste: "Track and reduce food waste with your sustainability score", insights: "Category breakdowns, trends, and budget optimization" };

export function DashboardHeader({ activeTab, itemCount, onAddItem, onPhotoUpload, items = [] }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const urgentCount = getUrgentItems(items).length;

  return (
    <header className="border-b border-card-border/50 bg-card/60 backdrop-blur-xl px-6 py-4 relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        {/* Tab title with morph animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 10, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-bold tracking-tight">{TAB_TITLES[activeTab]}</h2>
            <p className="text-[11px] text-muted mt-0.5 font-medium">{TAB_DESCRIPTIONS[activeTab]}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3">
          {/* Search with focus glow */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 pl-9 pr-3 py-2 text-xs bg-background/80 backdrop-blur-sm border border-card-border rounded-xl text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/40 focus:shadow-sm focus:shadow-accent/10 transition-all"
            />
          </div>

          {/* Urgent badge with pulse */}
          {urgentCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="px-3 py-1.5 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-1.5 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-danger/5 animate-pulse" />
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                <AlertTriangle className="w-3.5 h-3.5 text-danger relative z-10" />
              </motion.div>
              <span className="text-[10px] font-mono text-danger font-bold relative z-10">{urgentCount} URGENT</span>
            </motion.div>
          )}

          {/* Item count pill */}
          <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-card-border rounded-xl">
            <span className="text-[10px] font-mono text-muted font-bold">
              ITEMS: <motion.span key={itemCount} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-accent inline-block">{itemCount}</motion.span>
            </span>
          </div>

          {/* Scan button */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onPhotoUpload}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-background/80 backdrop-blur-sm border border-card-border rounded-xl text-muted hover:text-foreground hover:border-accent/30 hover:shadow-sm hover:shadow-accent/10 transition-all"
          >
            <Camera className="w-3.5 h-3.5" /><span>Scan</span>
          </motion.button>

          {/* Add button with glow */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAddItem}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl overflow-hidden relative shadow-sm shadow-accent/10 hover:shadow-md hover:shadow-accent/20 transition-shadow"
          >
            <motion.div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-2/20 border border-accent/20 rounded-xl" />
            <Plus className="w-3.5 h-3.5 text-accent relative z-10" />
            <span className="text-accent relative z-10">Add Item</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
