"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  { quote: "Shadow Basket cut our grocery waste by 60% and saves us $50/month. The AI meal planner alone is worth it.", name: "Sarah P.", role: "Family of 5, Portland", initials: "SP", stars: 5 },
  { quote: "I never thought a grocery app could feel this premium. The burn rate predictions are scary accurate.", name: "Marcus T.", role: "Software Engineer, Austin", initials: "MT", stars: 5 },
  { quote: "We reduced our food waste from 30% to under 8%. The waste analytics dashboard is a game-changer.", name: "Priya K.", role: "Restaurant Owner, NYC", initials: "PK", stars: 5 },
  { quote: "The photo scanning feature is magic. I just snap my pantry and everything gets tracked instantly.", name: "James L.", role: "Home Cook, Seattle", initials: "JL", stars: 5 },
  { quote: "Best investment for our household. The spending insights helped us cut our grocery bill by 35%.", name: "Elena R.", role: "Budget Coach, Miami", initials: "ER", stars: 5 },
  { quote: "The predictive alerts saved us multiple times from running out of essentials. Truly intelligent.", name: "David W.", role: "Father of 3, Chicago", initials: "DW", stars: 5 },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section ref={ref} className="relative z-10 py-32 px-6 overflow-hidden">
      {/* Background accent */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-accent/[0.03] blur-[100px]" />
      </motion.div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-warning/20 bg-warning/5 text-[11px] font-mono text-warning tracking-[0.2em] uppercase font-bold mb-6"
          >
            <Star className="w-3 h-3 fill-warning" />
            TRUSTED BY THOUSANDS
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            What our users <span className="gradient-text-warm">love</span>
          </h2>
        </motion.div>

        {/* Testimonial card — large, centered */}
        <div className="relative max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative p-10 rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm"
            >
              {/* Quote icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Quote className="w-8 h-8 text-accent/20 mb-6" />
              </motion.div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonials[current].stars }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <Star className="w-4 h-4 text-warning fill-warning" />
                  </motion.div>
                ))}
              </div>

              {/* Quote text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-foreground/90 leading-relaxed font-medium"
              >
                &ldquo;{testimonials[current].quote}&rdquo;
              </motion.p>

              {/* Author */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-accent-2/30 flex items-center justify-center text-sm font-black border border-white/[0.08]">
                  {testimonials[current].initials}
                </div>
                <div>
                  <p className="text-sm font-bold">{testimonials[current].name}</p>
                  <p className="text-xs text-muted">{testimonials[current].role}</p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots — sleeker */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="relative p-1"
            >
              <motion.div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? "bg-accent w-8" : "bg-white/10 hover:bg-white/20 w-1.5"
                }`}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            </button>
          ))}
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-12"
        >
          {[
            { val: "12,000+", label: "Households" },
            { val: "4.9/5", label: "Average Rating" },
            { val: "60%", label: "Less Waste" },
            { val: "$52/mo", label: "Avg. Savings" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-black font-mono gradient-text">{stat.val}</p>
              <p className="text-[10px] text-muted tracking-wider uppercase font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
