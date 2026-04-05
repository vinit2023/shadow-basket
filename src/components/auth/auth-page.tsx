"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, Mail, Lock, User, ArrowRight, Eye, EyeOff, Globe, TerminalSquare, AlertCircle } from "lucide-react";
import Link from "next/link";
import { signUp, signIn, signInWithGoogle, signInWithGitHub } from "@/lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";

const testimonials = [
  { quote: "Shadow Basket cut our grocery waste by 60% and saves us $50/month. The AI meal planner alone is worth it.", name: "Sarah P.", role: "Family of 5, Portland", initials: "SP" },
  { quote: "I never thought a grocery app could feel this premium. The burn rate predictions are scary accurate.", name: "Marcus T.", role: "Software Engineer, Austin", initials: "MT" },
  { quote: "We reduced our food waste from 30% to under 8%. The waste analytics dashboard is a game-changer.", name: "Priya K.", role: "Restaurant Owner, NYC", initials: "PK" },
  { quote: "The photo scanning feature is magic. I just snap my pantry and everything gets tracked instantly.", name: "James L.", role: "Home Cook, Seattle", initials: "JL" },
  { quote: "Best investment for our household. The spending insights helped us cut our grocery bill by 35%.", name: "Elena R.", role: "Budget Coach, Miami", initials: "ER" },
  { quote: "The predictive alerts saved us multiple times from running out of essentials. Truly intelligent.", name: "David W.", role: "Father of 3, Chicago", initials: "DW" },
];

export function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialMode = searchParams.get("mode") === "signin" ? "signin" : "signup";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const nextTestimonial = useCallback(() => {
    setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 4000);
    return () => clearInterval(timer);
  }, [nextTestimonial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      setError("Please complete the CAPTCHA verification.");
      return;
    }

    setLoading(true);

    if (mode === "signup") {
      const { error: signUpError } = await signUp(email, password, name);
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      router.push("/onboarding");
    } else {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)" }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.03) 0%, transparent 70%)" }} animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 10, repeat: Infinity }} />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative z-10 p-12">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/20 flex items-center justify-center">
              <ShoppingBasket className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="text-base font-bold gradient-text">SHADOW</span>
              <span className="text-[10px] tracking-[0.15em] text-muted ml-1.5 font-medium">BASKET</span>
            </div>
          </Link>

          <h2 className="text-4xl font-black tracking-tight leading-tight">
            Take control of your{" "}
            <span className="gradient-text-animate">supply chain</span>
          </h2>
          <p className="mt-4 text-muted leading-relaxed font-medium">
            AI-powered inventory tracking, predictive analytics, waste reduction, and intelligent deal-finding. All in one beautiful dashboard.
          </p>

          <div className="mt-12 relative h-[160px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              >
                <p className="text-sm text-muted leading-relaxed italic">&ldquo;{testimonials[testimonialIdx].quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent-2/30 flex items-center justify-center text-xs font-black">{testimonials[testimonialIdx].initials}</div>
                  <div>
                    <p className="text-xs font-bold">{testimonials[testimonialIdx].name}</p>
                    <p className="text-[10px] text-muted">{testimonials[testimonialIdx].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute -bottom-5 left-0 flex gap-1.5">
              {testimonials.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === testimonialIdx ? "w-5 bg-accent" : "w-1.5 bg-white/10"}`} />
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-8 flex gap-8">
            {[{ val: "12K+", label: "Households" }, { val: "60%", label: "Less waste" }, { val: "4.9", label: "Rating" }].map((s) => (
              <div key={s.label}>
                <p className="text-lg font-black font-mono gradient-text">{s.val}</p>
                <p className="text-[10px] text-muted font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent/20 to-accent-2/20 border border-accent/20 flex items-center justify-center">
              <ShoppingBasket className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-bold gradient-text">SHADOW BASKET</span>
          </Link>

          <div className="p-8 rounded-2xl border border-white/[0.08] glass-strong">
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl mb-8">
              {(["signup", "signin"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === m ? "bg-gradient-to-r from-accent/10 to-accent-2/10 text-accent border border-accent/20" : "text-muted hover:text-foreground border border-transparent"}`}>
                  {m === "signup" ? "Create Account" : "Sign In"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form key={mode} initial={{ opacity: 0, x: mode === "signup" ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: mode === "signup" ? -20 : 20 }} transition={{ duration: 0.3 }} onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
                {mode === "signup" && (
                  <div>
                    <label className="text-[11px] font-mono text-muted tracking-wider block mb-2 font-bold">FULL NAME</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full pl-11 pr-4 py-3 text-sm bg-white/[0.03] border border-white/[0.08] rounded-xl text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/40 transition-colors" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-[11px] font-mono text-muted tracking-wider block mb-2 font-bold">EMAIL</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-11 pr-4 py-3 text-sm bg-white/[0.03] border border-white/[0.08] rounded-xl text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/40 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-muted tracking-wider block mb-2 font-bold">PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-11 py-3 text-sm bg-white/[0.03] border border-white/[0.08] rounded-xl text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/40 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-center pt-1">
                  <ReCAPTCHA
                    sitekey="6LcHGqcsAAAAAG7K9ynCQzijc2V9hUZkzn1g-X5C"
                    onChange={(token) => setCaptchaToken(token)}
                    onExpired={() => setCaptchaToken(null)}
                    onErrored={() => setCaptchaToken(null)}
                    theme="dark"
                  />
                </div>
                <button type="submit" disabled={loading || !captchaToken} className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 overflow-hidden relative">
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-accent via-accent-2 to-accent" animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} style={{ backgroundSize: "200% 200%" }} />
                  {loading ? (
                    <div className="relative z-10 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="relative z-10 text-white flex items-center gap-2">
                      {mode === "signup" ? "Create Account" : "Sign In"}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </motion.form>
            </AnimatePresence>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] text-muted font-mono font-bold">OR</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={async () => {
                  setError("");
                  const { error: e } = await signInWithGoogle();
                  if (e) setError(e.message);
                }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs text-muted hover:text-foreground hover:border-white/15 transition-all font-medium"
              >
                <Globe className="w-4 h-4" /> Google
              </button>
              <button
                onClick={async () => {
                  setError("");
                  const { error: e } = await signInWithGitHub();
                  if (e) setError(e.message);
                }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs text-muted hover:text-foreground hover:border-white/15 transition-all font-medium"
              >
                <TerminalSquare className="w-4 h-4" /> GitHub
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-[10px]">
              <Link href="/" className="text-muted/50 hover:text-accent transition-colors font-medium">Home</Link>
              <span className="text-muted/20">·</span>
              <Link href="/#features" className="text-muted/50 hover:text-accent transition-colors font-medium">Features</Link>
              <span className="text-muted/20">·</span>
              <Link href="/#how-it-works" className="text-muted/50 hover:text-accent transition-colors font-medium">How it works</Link>
              <span className="text-muted/20">·</span>
              <Link href="/#pricing" className="text-muted/50 hover:text-accent transition-colors font-medium">Pricing</Link>
            </div>
            <p className="mt-3 text-center text-[10px] text-muted/40">By continuing, you agree to our Terms and Privacy Policy.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
