"use client";

import { useState, useRef } from "react";
import { InventoryItem } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Camera, Loader2, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";

interface Props {
  onClose: () => void;
  onItemsDetected: (items: Omit<InventoryItem, "id" | "created_at">[]) => void;
}

type UploadState = "idle" | "uploading" | "analyzing" | "done" | "error";

export function PhotoUploadModal({ onClose, onItemsDetected }: Props) {
  const [state, setState] = useState<UploadState>("idle");
  const [detectedItems, setDetectedItems] = useState<Omit<InventoryItem, "id" | "created_at">[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState("uploading");

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => {
          const result = r.result as string;
          resolve(result.split(",")[1]);
        };
        r.readAsDataURL(file);
      });

      setState("analyzing");

      const response = await fetch("/api/analyze-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType: file.type }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Analysis failed");
      }

      setDetectedItems(data.items);
      setState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to analyze image");
      setState("error");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", bounce: 0.2 }}
          className="relative w-full max-w-xl mx-4 bg-card border border-card-border rounded-2xl shadow-2xl"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <div>
                <h3 className="text-sm font-semibold">Photo-to-Inventory</h3>
                <p className="text-[11px] text-muted mt-0.5">AI-powered pantry scanning</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {state === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-card-border rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-accent/30 transition-colors group"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors"
                >
                  <Camera className="w-8 h-8 text-accent/60" />
                </motion.div>
                <p className="text-sm text-foreground font-medium">Upload a photo of your pantry</p>
                <p className="text-xs text-muted mt-1">PNG, JPG up to 10MB</p>
                <button className="mt-4 flex items-center gap-2 px-4 py-2 text-xs font-medium bg-accent/10 border border-accent/20 rounded-lg text-accent">
                  <Upload className="w-3.5 h-3.5" /> Choose File
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </motion.div>
            )}

            {(state === "uploading" || state === "analyzing") && (
              <div className="flex flex-col items-center py-12">
                <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                <p className="text-sm font-medium">{state === "uploading" ? "Uploading image..." : "Analyzing with LLM vision..."}</p>
                <p className="text-xs text-muted mt-1">{state === "uploading" ? "Preparing for analysis" : "Identifying items and quantities"}</p>
                <div className="mt-6 w-full bg-background rounded-lg border border-card-border p-3 font-mono text-[11px] text-muted space-y-1">
                  <p className="text-success">&gt; Connecting to vision API...</p>
                  {state === "analyzing" && (
                    <>
                      <p className="text-success">&gt; Image uploaded (2.4MB)</p>
                      <motion.p animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-accent">
                        &gt; Running object detection...
                      </motion.p>
                    </>
                  )}
                </div>
              </div>
            )}

            {state === "error" && (
              <div className="flex flex-col items-center py-12">
                <AlertCircle className="w-10 h-10 text-danger mb-4" />
                <p className="text-sm font-medium text-danger">Analysis Failed</p>
                <p className="text-xs text-muted mt-1">{errorMsg}</p>
                <button onClick={() => { setState("idle"); setErrorMsg(""); }} className="mt-4 px-4 py-2 text-xs font-medium bg-accent/10 border border-accent/20 rounded-lg text-accent">Try Again</button>
              </div>
            )}

            {state === "done" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-4 h-4" />
                  <p className="text-sm font-medium">{detectedItems.length} items detected</p>
                </div>
                <div className="border border-card-border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-card-border bg-white/[0.02]">
                        <th className="text-left px-4 py-2 text-[10px] font-mono text-muted tracking-wider">ITEM</th>
                        <th className="text-left px-4 py-2 text-[10px] font-mono text-muted tracking-wider">CATEGORY</th>
                        <th className="text-left px-4 py-2 text-[10px] font-mono text-muted tracking-wider">QTY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detectedItems.map((item, idx) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="border-b border-card-border/50"
                        >
                          <td className="px-4 py-2.5 text-sm">{item.name}</td>
                          <td className="px-4 py-2.5">
                            <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted font-mono">{item.category}</span>
                          </td>
                          <td className="px-4 py-2.5 text-xs font-mono text-muted">{item.current_stock_level} {item.unit_type}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-3">
                  <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium bg-white/5 border border-card-border rounded-lg text-muted hover:text-foreground transition-colors">Discard</button>
                  <button onClick={() => onItemsDetected(detectedItems)} className="flex-1 py-2.5 text-sm font-medium bg-accent/10 border border-accent/20 rounded-lg text-accent hover:bg-accent/20 transition-all">Add All to Ledger</button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
