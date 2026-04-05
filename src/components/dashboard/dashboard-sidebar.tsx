"use client";

import { type Tab } from "@/app/dashboard/page";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LayoutList, AlertTriangle, Tag, ShoppingBasket, LogOut, Settings, Brain, Leaf, LineChart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/lib/supabase";

const tabs: { id: Tab; label: string; icon: React.ElementType; color: string; hoverBg: string }[] = [
  { id: "ledger", label: "Smart Ledger", icon: LayoutList, color: "text-accent", hoverBg: "hover:bg-accent/5" },
  { id: "restock", label: "Restock", icon: AlertTriangle, color: "text-warning", hoverBg: "hover:bg-warning/5" },
  { id: "deals", label: "Smart Deals", icon: Tag, color: "text-success", hoverBg: "hover:bg-success/5" },
  { id: "meals", label: "AI Meals", icon: Brain, color: "text-accent-2", hoverBg: "hover:bg-accent-2/5" },
  { id: "waste", label: "Waste Score", icon: Leaf, color: "text-emerald-400", hoverBg: "hover:bg-emerald-400/5" },
  { id: "insights", label: "Spending", icon: LineChart, color: "text-blue", hoverBg: "hover:bg-blue/5" },
];

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function DashboardSidebar({ activeTab, onTabChange }: Props) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth?mode=signin");
  };

  return (
    <aside className="w-60 border-r border-card-border bg-card/80 backdrop-blur-xl flex flex-col relative overflow-hidden">
      {/* Subtle glassmorphism background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[200px] h-[200px] rounded-full bg-accent/[0.03] blur-[60px]" />
        <div className="absolute -bottom-20 -right-20 w-[200px] h-[200px] rounded-full bg-accent-2/[0.03] blur-[60px]" />
      </div>

      {/* Logo */}
      <div className="p-5 border-b border-card-border/50 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/20 flex items-center justify-center shadow-sm shadow-accent/10"
          >
            <ShoppingBasket className="w-5 h-5 text-accent" />
          </motion.div>
          <div>
            <h1 className="text-sm font-black tracking-wide gradient-text">SHADOW</h1>
            <p className="text-[9px] tracking-[0.2em] text-muted uppercase font-bold">Basket</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2.5 space-y-0.5 relative z-10">
        <p className="text-[9px] font-mono text-muted tracking-wider font-bold px-3 py-2">MODULES</p>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 relative overflow-hidden",
                isActive ? "text-foreground" : `text-muted hover:text-foreground ${tab.hoverBg}`
              )}
            >
              {/* Sliding highlight with glow */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent-2/5 border border-accent/15 rounded-xl"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              {/* Active glow */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-glow"
                  className="absolute -left-1 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-accent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <motion.div
                animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Icon className={cn("w-4 h-4 relative z-10 transition-colors", isActive ? tab.color : "")} />
              </motion.div>
              <span className="font-semibold relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-2.5 space-y-0.5 border-t border-card-border/50 relative z-10">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[11px] text-muted font-mono font-bold tracking-wider">THEME</span>
          <ThemeToggle />
        </div>
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-muted hover:text-foreground hover:bg-white/[0.03] transition-all font-medium"
        >
          <Settings className="w-4 h-4" /><span>Settings</span>
        </motion.button>
        <motion.button
          onClick={handleSignOut}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-muted hover:text-danger hover:bg-danger/5 transition-all font-medium"
        >
          <LogOut className="w-4 h-4" /><span>Sign Out</span>
        </motion.button>
      </div>

      {/* Status */}
      <div className="px-4 py-3 border-t border-card-border/50 relative z-10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-success shadow-sm shadow-success/50"
          />
          <span className="text-[10px] text-muted font-mono font-bold">ONLINE</span>
        </div>
        <p className="text-[9px] text-muted/30 font-mono mt-0.5">v1.0.0</p>
      </div>
    </aside>
  );
}
