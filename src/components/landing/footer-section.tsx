"use client";

import { ShoppingBasket } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/20 flex items-center justify-center">
            <ShoppingBasket className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-xs font-mono font-bold">
            <span className="gradient-text">SHADOW BASKET</span>
            <span className="text-muted ml-2">v0.2.0</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[11px] text-muted/50 hover:text-muted transition-colors cursor-pointer">Privacy</span>
          <span className="text-[11px] text-muted/50 hover:text-muted transition-colors cursor-pointer">Terms</span>
          <span className="text-[11px] text-muted/50 hover:text-muted transition-colors cursor-pointer">GitHub</span>
          <span className="text-[11px] text-muted/50 hover:text-muted transition-colors cursor-pointer">Twitter</span>
        </div>
        <p className="text-[10px] text-muted/30 font-mono">&copy; 2026 Shadow Basket. All rights reserved.</p>
      </div>
    </footer>
  );
}
