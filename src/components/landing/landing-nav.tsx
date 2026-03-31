"use client";

import { motion } from "framer-motion";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";

export function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-3">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between rounded-2xl glass-strong border border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/20 flex items-center justify-center"
            >
              <ShoppingBasket className="w-4 h-4 text-accent" />
            </motion.div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold tracking-wide gradient-text">SHADOW</span>
              <span className="text-[10px] tracking-[0.15em] text-muted font-medium">BASKET</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-[11px] text-muted hover:text-foreground transition-colors tracking-wider uppercase font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/auth?mode=signin"
              className="text-xs text-muted hover:text-foreground transition-colors px-4 py-2 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/auth?mode=signup"
              className="relative text-xs font-semibold px-5 py-2 rounded-xl overflow-hidden group"
            >
              <span className="relative z-10 text-background">Get Started</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent via-accent-2 to-accent"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
