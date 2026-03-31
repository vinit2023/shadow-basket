"use client";

import { type Tab } from "@/app/dashboard/page";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LayoutList, AlertTriangle, Tag, ShoppingBasket, LogOut, Settings, Brain, Leaf, LineChart } from "lucide-react";
import Link from "next/link";

const tabs: { id: Tab; label: string; icon: React.ElementType; color: string }[] = [
  { id: "ledger", label: "Smart Ledger", icon: LayoutList, color: "text-accent" },
  { id: "restock", label: "Restock", icon: AlertTriangle, color: "text-warning" },
  { id: "deals", label: "Smart Deals", icon: Tag, color: "text-success" },
  { id: "meals", label: "AI Meals", icon: Brain, color: "text-accent-2" },
  { id: "waste", label: "Waste Score", icon: Leaf, color: "text-emerald-400" },
  { id: "insights", label: "Spending", icon: LineChart, color: "text-blue" },
];

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function DashboardSidebar({ activeTab, onTabChange }: Props) {
  return (
    <aside className="w-60 border-r border-card-border bg-card flex flex-col">
      <div className="p-5 border-b border-card-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }} className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/20 flex items-center justify-center">
            <ShoppingBasket className="w-5 h-5 text-accent" />
          </motion.div>
          <div>
            <h1 className="text-sm font-black tracking-wide gradient-text">SHADOW</h1>
            <p className="text-[9px] tracking-[0.2em] text-muted uppercase font-bold">Basket</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-2.5 space-y-0.5">
        <p className="text-[9px] font-mono text-muted tracking-wider font-bold px-3 py-2">MODULES</p>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button key={tab.id} onClick={() => onTabChange(tab.id)} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }} className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all duration-150 relative", isActive ? "text-foreground" : "text-muted hover:text-foreground")}>
              {isActive && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent-2/5 border border-accent/15 rounded-xl" transition={{ type: "spring", bounce: 0.15, duration: 0.4 }} />
              )}
              <Icon className={cn("w-4 h-4 relative z-10", isActive ? tab.color : "")} />
              <span className="font-semibold relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="p-2.5 space-y-0.5 border-t border-card-border">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-muted hover:text-foreground hover:bg-white/5 transition-all font-medium"><Settings className="w-4 h-4" /><span>Settings</span></button>
        <Link href="/" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-muted hover:text-danger hover:bg-danger/5 transition-all font-medium"><LogOut className="w-4 h-4" /><span>Sign Out</span></Link>
      </div>

      <div className="px-4 py-3 border-t border-card-border">
        <div className="flex items-center gap-2"><motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-success" /><span className="text-[10px] text-muted font-mono font-bold">ONLINE</span></div>
        <p className="text-[9px] text-muted/30 font-mono mt-0.5">v0.2.0</p>
      </div>
    </aside>
  );
}
