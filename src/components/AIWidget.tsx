"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, MicOff, Activity } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { brand } from "@lib/brand.config";

const WAVE_HEIGHTS = [20, 50, 35, 65, 28, 58, 42, 72, 32, 55, 45, 62, 22, 70, 38];

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const vapiInstanceRef = useRef<Vapi | null>(null);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => {
      setTooltip(true);
      setTimeout(() => setTooltip(false), 5000);
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  const vapiKey = typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_VAPI_KEY ?? "")
    : "";
  const vapiAssistantId = typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "")
    : "";

  const handleToggle = () => {
    setOpen(o => !o);
    setTooltip(false);
  };

  const handleMicToggle = async () => {
    if (!active) {
      setActive(true);
      if (vapiKey && vapiAssistantId) {
        try {
          const vapi = new Vapi(vapiKey);
          vapiInstanceRef.current = vapi;
          await vapi.start(vapiAssistantId);
        } catch {
          // Vapi not available — mock mode
        }
      }
    } else {
      setActive(false);
      if (vapiInstanceRef.current) {
        await vapiInstanceRef.current.stop();
        vapiInstanceRef.current = null;
      }
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && !open && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", bottom: "44px", right: "96px",
              zIndex: 199, pointerEvents: "none",
            }}
          >
            <div style={{
              padding: "10px 16px", borderRadius: "6px",
              fontFamily: "var(--font-mono)", fontSize: "11px",
              letterSpacing: "0.1em", color: "var(--text-primary)",
              background: "rgba(10,13,20,0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border-mid)",
              whiteSpace: "nowrap",
            }}>
              Speak with {brand.aiConcierge.name} ✦
            </div>
            {/* Arrow */}
            <div style={{
              position: "absolute", right: "-6px", top: "50%",
              transform: "translateY(-50%)",
              width: 0, height: 0,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderLeft: "6px solid rgba(10,13,20,0.95)",
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        onClick={handleToggle}
        style={{
          position: "fixed", bottom: "32px", right: "32px",
          zIndex: 200, width: "60px", height: "60px",
          borderRadius: "50%",
          background: open
            ? "var(--surface-2)"
            : "linear-gradient(135deg, var(--electric) 0%, var(--glow) 100%)",
          border: open ? "1px solid var(--border-mid)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          boxShadow: open
            ? "none"
            : "0 0 40px rgba(36,97,232,0.35), 0 0 80px rgba(36,97,232,0.12)",
          transition: "all 300ms var(--ease-expo)",
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open AI Assistant"
      >
        {open
          ? <X size={22} color="var(--text-secondary)" />
          : <Mic size={22} color="white" />
        }
        {/* Online indicator */}
        {!open && (
          <div style={{
            position: "absolute", top: "3px", right: "3px",
            width: "10px", height: "10px", borderRadius: "50%",
            background: "#22d3a0",
            border: "2px solid var(--void)",
            boxShadow: "0 0 6px rgba(34,211,160,0.8)",
          }} />
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom: "108px", right: "32px",
              zIndex: 199,
              width: "clamp(300px, 90vw, 360px)",
              background: "var(--surface)",
              border: "1px solid var(--border-mid)",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(36,97,232,0.08)",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border-dim)",
              display: "flex", alignItems: "center", gap: "12px",
              background: "linear-gradient(135deg, rgba(36,97,232,0.06) 0%, transparent 100%)",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--electric) 0%, var(--glow) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 0 20px rgba(36,97,232,0.4)",
              }}>
                <Activity size={16} color="white" />
              </div>
              <div>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: "14px",
                  fontWeight: 700, color: "var(--text-primary)",
                }}>
                  {brand.aiConcierge.name}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  letterSpacing: "0.12em", color: "var(--electric)",
                }}>
                  UpLevel AI Assistant
                </div>
              </div>
              <div style={{
                marginLeft: "auto",
                display: "flex", alignItems: "center", gap: "5px",
              }}>
                <div style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: active ? "var(--electric)" : "#22d3a0",
                  boxShadow: active
                    ? "0 0 8px rgba(36,97,232,0.8)"
                    : "0 0 8px rgba(34,211,160,0.8)",
                }} />
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px",
                  letterSpacing: "0.12em", color: "var(--text-dim)",
                }}>
                  {active ? "LISTENING" : "ONLINE"}
                </span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "20px" }}>
              {/* Greeting */}
              <div style={{
                padding: "14px 16px",
                background: "var(--surface-2)",
                border: "1px solid var(--border-dim)",
                borderRadius: "8px",
                fontSize: "14px", color: "var(--text-secondary)",
                lineHeight: 1.6, marginBottom: "20px",
              }}>
                {brand.aiConcierge.greeting}
              </div>

              {/* Waveform (active state) */}
              {active && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "3px", height: "48px", marginBottom: "20px",
                  }}
                >
                  {WAVE_HEIGHTS.map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [1, 0.3, 1.1, 0.5, 1] }}
                      transition={{
                        repeat: Infinity, duration: 0.8,
                        delay: i * 0.07, ease: "easeInOut",
                      }}
                      style={{
                        width: "3px", height: `${h * 0.4}%`,
                        borderRadius: "2px",
                        background: `rgba(36,97,232,${0.4 + (i % 3) * 0.2})`,
                        transformOrigin: "bottom",
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Mic button */}
              <button
                onClick={handleMicToggle}
                className={active ? "btn-secondary" : "btn-primary"}
                style={{
                  width: "100%", justifyContent: "center",
                  gap: "10px",
                }}
              >
                {active ? (
                  <><MicOff size={16} /> Stop Listening</>
                ) : (
                  <><Mic size={16} /> Start Speaking</>
                )}
              </button>

              {/* Footer note */}
              <p style={{
                marginTop: "12px",
                fontFamily: "var(--font-mono)", fontSize: "10px",
                letterSpacing: "0.10em", color: "var(--text-dim)",
                textAlign: "center", lineHeight: 1.5,
              }}>
                {vapiKey ? "Voice powered by Vapi" : "Demo mode — voice requires API key"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
