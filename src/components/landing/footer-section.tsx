"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShoppingBasket, GitBranch, MessageCircle, Mail } from "lucide-react";

export function FooterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="border-t border-white/[0.05] relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-accent/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/20 flex items-center justify-center">
                <ShoppingBasket className="w-4 h-4 text-accent" />
              </div>
              <div>
                <span className="text-sm font-bold gradient-text">SHADOW BASKET</span>
                <span className="text-[10px] text-muted ml-2 font-mono">v1.0</span>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed max-w-xs">
              AI-powered home inventory intelligence. Track, predict, and optimize your kitchen supply chain.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://github.com/vinit2023/shadow-basket" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-white/[0.06] flex items-center justify-center text-muted hover:text-foreground hover:border-white/[0.12] transition-all">
                <GitBranch className="w-3.5 h-3.5" />
              </a>
              <span className="w-8 h-8 rounded-lg border border-white/[0.06] flex items-center justify-center text-muted hover:text-foreground hover:border-white/[0.12] transition-all cursor-pointer">
                <MessageCircle className="w-3.5 h-3.5" />
              </span>
              <span className="w-8 h-8 rounded-lg border border-white/[0.06] flex items-center justify-center text-muted hover:text-foreground hover:border-white/[0.12] transition-all cursor-pointer">
                <Mail className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-[10px] font-mono text-muted tracking-[0.2em] uppercase font-bold mb-4">Product</p>
            <div className="space-y-2.5">
              {["Features", "How it Works", "Pricing", "Changelog"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="block text-xs text-muted hover:text-foreground transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-[10px] font-mono text-muted tracking-[0.2em] uppercase font-bold mb-4">Company</p>
            <div className="space-y-2.5">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <span key={item} className="block text-xs text-muted hover:text-foreground transition-colors cursor-pointer">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[10px] font-mono text-muted tracking-[0.2em] uppercase font-bold mb-4">Legal</p>
            <div className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <span key={item} className="block text-xs text-muted hover:text-foreground transition-colors cursor-pointer">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted/40 font-mono">&copy; 2026 Shadow Basket. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-muted/40 font-mono">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
