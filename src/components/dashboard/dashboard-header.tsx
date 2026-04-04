"use client";

import { type Tab } from "@/app/dashboard/page";
import { Plus, Camera, Search, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
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
    <header className="border-b border-card-border bg-card/50 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <motion.div key={activeTab} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <h2 className="text-lg font-bold tracking-tight">{TAB_TITLES[activeTab]}</h2>
          <p className="text-[11px] text-muted mt-0.5 font-medium">{TAB_DESCRIPTIONS[activeTab]}</p>
        </motion.div>
        <div className="flex items-center gap-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-40 pl-9 pr-3 py-2 text-xs bg-background border border-card-border rounded-xl text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/40 transition-colors" /></div>
          {urgentCount > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-3 py-1.5 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-1.5">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}><AlertTriangle className="w-3.5 h-3.5 text-danger" /></motion.div>
              <span className="text-[10px] font-mono text-danger font-bold">{urgentCount} URGENT</span>
            </motion.div>
          )}
          <div className="px-3 py-1.5 bg-background border border-card-border rounded-xl"><span className="text-[10px] font-mono text-muted font-bold">ITEMS: <span className="text-accent">{itemCount}</span></span></div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onPhotoUpload} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-background border border-card-border rounded-xl text-muted hover:text-foreground hover:border-accent/30 transition-all"><Camera className="w-3.5 h-3.5" /><span>Scan</span></motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onAddItem} className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl overflow-hidden relative"><motion.div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-2/20 border border-accent/20 rounded-xl" /><Plus className="w-3.5 h-3.5 text-accent relative z-10" /><span className="text-accent relative z-10">Add Item</span></motion.button>
        </div>
      </div>
    </header>
  );
}
