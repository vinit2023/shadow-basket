"use client";

import { motion } from "framer-motion";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-3">
        <div className={`max-w-7xl mx-auto px-6 h-14 flex items-center justify-between rounded-2xl border transition-all duration-500 ${
          scrolled
            ? "glass-strong border-white/[0.08] shadow-lg shadow-black/20"
            : "bg-transparent border-transparent"
        }`}>
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
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
                className="text-[11px] text-muted hover:text-foreground transition-colors tracking-wider uppercase font-medium relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/auth?mode=signin"
              className="text-xs text-muted hover:text-foreground transition-colors px-4 py-2 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/auth?mode=signup"
              className="relative text-xs font-semibold px-5 py-2 rounded-xl overflow-hidden group shadow-md shadow-accent/10 hover:shadow-accent/20 transition-shadow"
            >
              <span className="relative z-10 text-white">Get Started</span>
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
