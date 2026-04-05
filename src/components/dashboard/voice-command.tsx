"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Volume2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { InventoryItem } from "@/lib/types";
import { supabase } from "@/lib/supabase";

/* eslint-disable @typescript-eslint/no-explicit-any */
type SpeechRecognitionType = any;

interface VoiceCommand {
  action: "add" | "empty" | "restock" | "delete" | "query" | "unknown";
  item: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
  confidence: number;
  response: string;
}

interface Props {
  items: InventoryItem[];
  userId: string | null;
  onItemsChange: () => void;
}

type ListenState = "idle" | "listening" | "processing" | "success" | "error";

export function VoiceCommand({ items, userId, onItemsChange }: Props) {
  const [state, setState] = useState<ListenState>("idle");
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [command, setCommand] = useState<VoiceCommand | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const wakeWordBuffer = useRef("");

  // Check mic permission on mount
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.permissions) {
      navigator.permissions.query({ name: "microphone" as PermissionName }).then((result) => {
        setPermissionGranted(result.state === "granted");
        result.onchange = () => setPermissionGranted(result.state === "granted");
      }).catch(() => {});
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  const processCommand = async (text: string) => {
    setState("processing");
    setTranscript(text);
    try {
      const res = await fetch("/api/process-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          existingItems: items.map((i) => ({ name: i.name, category: i.category })),
        }),
      });
      const data = await res.json();
      if (!data.command) throw new Error("No command returned");

      const cmd = data.command as VoiceCommand;
      setCommand(cmd);

      // Execute the command
      await executeCommand(cmd);

      setState("success");

      // Speak the response
      if (cmd.response && typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(cmd.response);
        utterance.rate = 1.1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setState("idle");
        setCommand(null);
        setTranscript("");
      }, 3500);
    } catch {
      setState("error");
      setErrorMsg("Couldn't understand that. Try again.");
      setTimeout(() => {
        setState("idle");
        setErrorMsg("");
      }, 3000);
    }
  };

  const executeCommand = async (cmd: VoiceCommand) => {
    if (!userId) return;

    switch (cmd.action) {
      case "add": {
        await supabase.from("items").insert([{
          name: cmd.item.charAt(0).toUpperCase() + cmd.item.slice(1),
          category: cmd.category || "Other",
          unit_type: cmd.unit || "units",
          current_stock_level: cmd.quantity || 1,
          max_stock_level: (cmd.quantity || 1) * 2,
          daily_burn_rate: 0.5,
          last_restock_date: new Date().toISOString(),
          user_id: userId,
        }]);
        onItemsChange();
        break;
      }
      case "empty": {
        const match = items.find((i) => i.name.toLowerCase().includes(cmd.item.toLowerCase()));
        if (match) {
          await supabase.from("items").update({ current_stock_level: 0 }).eq("id", match.id);
          onItemsChange();
        }
        break;
      }
      case "restock": {
        const match = items.find((i) => i.name.toLowerCase().includes(cmd.item.toLowerCase()));
        if (match) {
          await supabase.from("items").update({
            current_stock_level: match.max_stock_level,
            last_restock_date: new Date().toISOString(),
          }).eq("id", match.id);
          onItemsChange();
        }
        break;
      }
      case "delete": {
        const match = items.find((i) => i.name.toLowerCase().includes(cmd.item.toLowerCase()));
        if (match) {
          await supabase.from("items").delete().eq("id", match.id);
          onItemsChange();
        }
        break;
      }
      case "query": {
        // Query is handled by the response text — no DB action needed
        const match = items.find((i) => i.name.toLowerCase().includes(cmd.item.toLowerCase()));
        if (match && cmd.response) {
          cmd.response = `You have ${match.current_stock_level} ${match.unit_type} of ${match.name}.`;
        }
        break;
      }
    }
  };

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg("Speech recognition not supported in this browser.");
      setState("error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentText = (finalTranscript || interimTranscript).toLowerCase().trim();
      setTranscript(currentText);

      // Check for wake word "hey shadow"
      wakeWordBuffer.current = currentText;

      if (finalTranscript && currentText.includes("hey shadow")) {
        // Extract command after "hey shadow"
        const commandText = currentText.split("hey shadow").pop()?.trim();
        if (commandText && commandText.length > 2) {
          stopListening();
          processCommand(commandText);
        }
      } else if (finalTranscript && !currentText.includes("hey") && state === "listening") {
        // If user just speaks without wake word while mic is open, process directly
        if (currentText.length > 3) {
          stopListening();
          processCommand(currentText);
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        setPermissionGranted(false);
        setErrorMsg("Microphone access denied. Please allow access.");
      } else if (event.error !== "no-speech") {
        setErrorMsg("Error: " + event.error);
      }
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    };

    recognition.onend = () => {
      if (state === "listening") {
        // Restart if we're still supposed to be listening
        try { recognition.start(); } catch {}
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setState("listening");
    setTranscript("");
    setPermissionGranted(true);
    setIsOpen(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, stopListening, items, userId]);

  const toggleVoice = () => {
    if (state === "listening") {
      stopListening();
      setState("idle");
      setIsOpen(false);
    } else if (state === "idle") {
      startListening();
    }
  };

  return (
    <>
      {/* Floating Mic Button — the hero element */}
      <motion.button
        onClick={toggleVoice}
        className="fixed bottom-8 right-8 z-50 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Outer ring animation */}
        <AnimatePresence>
          {state === "listening" && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-accent/20"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 2.2, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 rounded-full bg-accent/10"
              />
            </>
          )}
        </AnimatePresence>

        {/* Main button */}
        <div className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          state === "listening"
            ? "bg-accent shadow-accent/30"
            : state === "processing"
            ? "bg-accent-2 shadow-accent-2/30"
            : state === "success"
            ? "bg-success shadow-success/30"
            : state === "error"
            ? "bg-danger shadow-danger/30"
            : "bg-gradient-to-br from-accent to-accent-2 shadow-accent/20 group-hover:shadow-accent/40"
        }`}>
          {state === "listening" ? (
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
              <Mic className="w-6 h-6 text-white" />
            </motion.div>
          ) : state === "processing" ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : state === "success" ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : state === "error" ? (
            <AlertCircle className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Idle tooltip */}
        {state === "idle" && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-2 rounded-xl bg-card border border-card-border text-xs font-medium text-muted shadow-lg"
          >
            <span className="text-accent font-bold">Hey Shadow</span> — voice commands
          </motion.div>
        )}
      </motion.button>

      {/* Voice Command Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 z-50 w-96"
          >
            <div className="rounded-2xl border border-card-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-card-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={state === "listening" ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      state === "listening" ? "bg-accent/20" : "bg-card"
                    }`}
                  >
                    {state === "listening" ? (
                      <Volume2 className="w-4 h-4 text-accent" />
                    ) : state === "processing" ? (
                      <Loader2 className="w-4 h-4 text-accent-2 animate-spin" />
                    ) : (
                      <Mic className="w-4 h-4 text-muted" />
                    )}
                  </motion.div>
                  <div>
                    <p className="text-xs font-bold">
                      {state === "listening" ? "Listening..." : state === "processing" ? "Processing..." : state === "success" ? "Done!" : "Shadow Voice"}
                    </p>
                    <p className="text-[10px] text-muted">
                      {state === "listening" ? 'Say "Hey Shadow" + your command' : state === "processing" ? "Understanding your command..." : state === "success" ? command?.response : "Tap the mic to start"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { stopListening(); setState("idle"); setIsOpen(false); }}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Transcript area */}
              <div className="p-5 min-h-[120px] flex flex-col items-center justify-center">
                {state === "listening" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    {/* Sound wave visualization */}
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(7)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [8, 24 + Math.random() * 16, 8] }}
                          transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 rounded-full bg-accent"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-foreground font-medium min-h-[20px]">
                      {transcript || <span className="text-muted italic">&quot;Hey Shadow, add milk...&quot;</span>}
                    </p>
                    {transcript && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-muted mt-2">
                        Waiting for &quot;Hey Shadow&quot; wake word...
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {state === "processing" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <Loader2 className="w-8 h-8 text-accent-2 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-muted">&quot;{transcript}&quot;</p>
                    <p className="text-[10px] text-muted/50 mt-1">Parsing intent with AI...</p>
                  </motion.div>
                )}

                {state === "success" && command && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                    >
                      <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
                    </motion.div>
                    <p className="text-sm font-bold text-success">{command.response}</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono font-bold uppercase">{command.action}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted font-mono">{command.item}</span>
                      {command.quantity && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted font-mono">x{command.quantity}</span>}
                    </div>
                  </motion.div>
                )}

                {state === "error" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <AlertCircle className="w-8 h-8 text-danger mx-auto mb-3" />
                    <p className="text-sm text-danger font-medium">{errorMsg}</p>
                  </motion.div>
                )}

                {state === "idle" && !isOpen && (
                  <p className="text-xs text-muted text-center">Tap the microphone to start voice commands</p>
                )}
              </div>

              {/* Examples */}
              {state === "listening" && (
                <div className="px-5 pb-4">
                  <p className="text-[9px] font-mono text-muted tracking-wider font-bold mb-2">TRY SAYING</p>
                  <div className="space-y-1.5">
                    {[
                      "Hey Shadow, add milk",
                      "Hey Shadow, I'm out of eggs",
                      "Hey Shadow, restock the rice",
                      "Hey Shadow, delete yogurt",
                    ].map((example) => (
                      <div key={example} className="text-[11px] text-muted/60 py-1 px-2.5 rounded-lg bg-white/[0.02] border border-white/[0.03] font-mono">
                        &quot;{example}&quot;
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permission denied state */}
              {permissionGranted === false && (
                <div className="p-4 border-t border-card-border/50 bg-danger/5">
                  <div className="flex items-center gap-2 text-xs text-danger">
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Microphone access denied. Enable it in browser settings.</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
