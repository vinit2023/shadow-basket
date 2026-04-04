"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  { quote: "Shadow Basket cut our grocery waste by 60% and saves us $50/month. The AI meal planner alone is worth it.", name: "Sarah P.", role: "Family of 5, Portland", initials: "SP" },
  { quote: "I never thought a grocery app could feel this premium. The burn rate predictions are scary accurate.", name: "Marcus T.", role: "Software Engineer, Austin", initials: "MT" },
  { quote: "We reduced our food waste from 30% to under 8%. The waste analytics dashboard is a game-changer.", name: "Priya K.", role: "Restaurant Owner, NYC", initials: "PK" },
  { quote: "The photo scanning feature is magic. I just snap my pantry and everything gets tracked instantly.", name: "James L.", role: "Home Cook, Seattle", initials: "JL" },
  { quote: "Best investment for our household. The spending insights helped us cut our grocery bill by 35%.", name: "Elena R.", role: "Budget Coach, Miami", initials: "ER" },
  { quote: "The predictive alerts saved us multiple times from running out of essentials. Truly intelligent.", name: "David W.", role: "Father of 3, Chicago", initials: "DW" },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative z-10 py-24 px-6">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-mono text-accent tracking-[0.3em] uppercase font-bold mb-3"
        >
          Trusted by thousands
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-black tracking-tight"
        >
          What our users say
        </motion.h2>
      </div>

      <div className="max-w-2xl mx-auto relative h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 p-8 rounded-2xl border border-white/[0.08] glass-strong"
          >
            <Quote className="w-6 h-6 text-accent/30 mb-4" />
            <p className="text-base text-muted leading-relaxed italic">
              &ldquo;{testimonials[current].quote}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-accent-2/30 flex items-center justify-center text-xs font-black">
                {testimonials[current].initials}
              </div>
              <div>
                <p className="text-sm font-bold">{testimonials[current].name}</p>
                <p className="text-[11px] text-muted">{testimonials[current].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current
                ? "bg-accent w-6"
                : "bg-white/10 hover:bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
