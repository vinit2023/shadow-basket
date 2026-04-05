"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Zap, ShoppingBasket, Shield, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="pricing" ref={ref} className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative p-14 sm:p-20 rounded-3xl border border-white/[0.08] overflow-hidden"
        >
          {/* Animated mesh background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at 30% 20%, rgba(0,229,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.08) 0%, transparent 50%)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-accent-2/40 to-transparent" />
          </div>

          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/20 flex items-center justify-center shadow-lg shadow-accent/10"
            >
              <ShoppingBasket className="w-10 h-10 text-accent" />
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-success/10 text-success text-xs font-bold border border-success/20">
                <Zap className="w-3.5 h-3.5" /> Free during beta — no limits
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]"
            >
              Stop wasting food.
              <br />
              <span className="gradient-text-animate">Start saving money.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-6 text-muted max-w-lg mx-auto font-medium text-base"
            >
              Join 12,000+ households who have eliminated food waste and saved an average of $52/month.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-center gap-6 text-[11px] text-muted"
            >
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-success" />Bank-level security</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-accent" />30-second setup</span>
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent-2" />AI-powered</span>
            </motion.div>

            {/* CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="mt-10"
            >
              <Link
                href="/auth?mode=signup"
                className="group relative inline-flex items-center gap-2 px-10 py-4.5 rounded-2xl text-base font-bold overflow-hidden shadow-xl shadow-accent/20 hover:shadow-accent/30 transition-shadow"
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
              <p className="mt-5 text-xs text-muted/50">No credit card required. Cancel anytime.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
