"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Zap, ShoppingBasket } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="pricing" ref={ref} className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative p-14 sm:p-20 rounded-3xl border border-white/[0.08] overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent-2/50 to-transparent" />
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/20 flex items-center justify-center"
            >
              <ShoppingBasket className="w-8 h-8 text-accent" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success text-xs font-bold border border-success/20">
                <Zap className="w-3 h-3" /> Free during beta
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="mt-8 text-4xl sm:text-5xl font-black tracking-tight"
            >
              Stop wasting food.
              <br />
              <span className="gradient-text-animate">Start saving money.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="mt-6 text-muted max-w-lg mx-auto font-medium"
            >
              12,000+ households have eliminated food waste and saved an average of $52/month with Shadow Basket.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="mt-10">
              <Link
                href="/auth?mode=signup"
                className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-sm font-bold overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent via-accent-2 to-accent"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                />
                <span className="relative z-10 text-white flex items-center gap-2">
                  Create Free Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <p className="mt-4 text-xs text-muted">No credit card required. Setup in 30 seconds.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
