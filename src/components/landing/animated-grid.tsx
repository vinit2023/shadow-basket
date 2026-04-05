"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedGrid() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Mesh gradient background — the "living" feel */}
      <div className="absolute inset-0">
        {/* Primary orb — cyan */}
        <motion.div
          className="absolute w-[1000px] h-[1000px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,229,255,0.12) 0%, rgba(0,229,255,0.04) 30%, transparent 70%)",
            filter: "blur(80px)",
            top: "-20%",
            right: "-10%",
          }}
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 80, -40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Secondary orb — purple */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.10) 0%, rgba(124,58,237,0.03) 30%, transparent 70%)",
            filter: "blur(80px)",
            top: "30%",
            left: "-15%",
          }}
          animate={{
            x: [0, 120, -60, 0],
            y: [0, -60, 80, 0],
            scale: [1.1, 0.9, 1.15, 1.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tertiary orb — rose */}
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(244,63,94,0.08) 0%, rgba(255,176,32,0.03) 30%, transparent 70%)",
            filter: "blur(80px)",
            bottom: "-10%",
            right: "20%",
          }}
          animate={{
            x: [0, -80, 100, 0],
            y: [0, 60, -80, 0],
            scale: [0.9, 1.2, 1, 0.9],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Fourth orb — for depth */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, rgba(124,58,237,0.04) 40%, transparent 70%)",
            filter: "blur(60px)",
            top: "60%",
            left: "40%",
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -100, 40, 0],
            scale: [1, 1.3, 0.85, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Subtle dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="dotgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" className="text-foreground" />
      </svg>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            background: i % 3 === 0 ? "rgba(0,229,255,0.4)" : i % 3 === 1 ? "rgba(124,58,237,0.4)" : "rgba(244,63,94,0.3)",
          }}
          animate={{
            y: [0, -(30 + Math.random() * 60), 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }} />
    </div>
  );
}
