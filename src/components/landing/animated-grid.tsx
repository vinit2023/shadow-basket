"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Matrix rain characters
const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01";

function MatrixColumn({ x, speed, delay }: { x: number; speed: number; delay: number }) {
  const char = chars[Math.floor(Math.random() * chars.length)];
  return (
    <motion.div
      className="absolute text-[10px] font-mono text-accent/20"
      style={{ left: `${x}%` }}
      initial={{ y: "-5%", opacity: 0 }}
      animate={{ y: "105%", opacity: [0, 0.6, 0.6, 0] }}
      transition={{ duration: speed, delay, repeat: Infinity, ease: "linear" }}
    >
      {char}
    </motion.div>
  );
}

export function AnimatedGrid() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Aurora gradient blobs */}
      <motion.div
        className="absolute -top-60 -right-60 w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,229,255,0.07) 0%, rgba(124,58,237,0.04) 40%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.3, 1], rotate: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -left-60 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(244,63,94,0.05) 0%, rgba(255,176,32,0.03) 40%, transparent 70%)",
        }}
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 60%)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full" style={{ animation: "grid-fade 8s ease-in-out infinite" }}>
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,229,255,0.03)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Matrix rain effect */}
      {Array.from({ length: 15 }).map((_, i) => (
        <MatrixColumn key={i} x={Math.random() * 100} speed={5 + Math.random() * 8} delay={Math.random() * 10} />
      ))}

      {/* Floating orbs */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: i % 3 === 0 ? "rgba(0,229,255,0.3)" : i % 3 === 1 ? "rgba(124,58,237,0.3)" : "rgba(244,63,94,0.2)",
          }}
          animate={{ y: [0, -(20 + Math.random() * 40), 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 8, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
