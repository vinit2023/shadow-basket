"use client";

import { useTheme } from "./theme-provider";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full p-0.5 transition-colors duration-300 ${
        isDark
          ? "bg-white/10 border border-white/10"
          : "bg-black/10 border border-black/10"
      } ${className ?? ""}`}
      aria-label="Toggle theme"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isDark
            ? "bg-accent/20 ml-auto"
            : "bg-warning/20 ml-0"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-accent" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-warning" />
        )}
      </motion.div>
    </motion.button>
  );
}
