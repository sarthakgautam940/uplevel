"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const QUICK_REPLIES = [
  "What does it cost?",
  "How fast do you launch?",
  "What's an AI phone agent?",
  "Do you work with HVAC?",
  "Do you do pool builders?",
];

const RESPONSES: Record<string, string> = {
  "what does it cost?":
    "Our most popular plan — the Authority — is $6,500 setup + $497/month. That includes a custom site, AI phone agent, local SEO, and monthly strategy. Most clients earn it back with one new job. We also have Starter ($3,500 + $297/mo) and Dominator ($12,000 + $797/mo). Want to book a free call to find the right fit?",
  "how fast do you launch?":
    "48 hours from your onboarding call to a live site — that's our standard. Complex builds (Dominator tier) take 5–7 days. We build in parallel: design, development, and AI configuration all happen simultaneously.",
  "what's an ai phone agent?":
    "It's a voice AI that answers your business line 24/7. It sounds natural, qualifies your leads (project size, timeline, location), books discovery calls directly to your calendar, and sends you a summary email after each call. It handles your busiest inquiry times without you lifting a finger.",
  "do you work with hvac?":
    "Yes — HVAC is one of our strongest verticals. We've built systems for HVAC companies that handle high call volumes with AI, rank on page 1 for local searches, and generate review campaigns. Our AI phone agent is particularly powerful for HVAC because of the high call frequency.",
  "do you do pool builders?":
    "Pool builders are one of our best-fit clients. High ticket jobs ($75K–$300K), strong visual portfolio to showcase, and great local SEO opportunity. We've driven over $840K in attributed revenue for pool builder clients in their first 6 months.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (lower.includes(key.replace("?", "").trim().split(" ").slice(0, 3).join(" "))) {
      return val;
    }
  }
  return "Great question. The best way to get a precise answer is a quick 15-minute call — no pitch, just answers. Want me to send you the scheduling link?";
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi, I'm ARIA — UpLevel's AI. Ask me anything about our services, pricing, or timeline.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const aiResponse: Message = { role: "ai", text: getResponse(text) };
      setMessages((prev) => [...prev, aiResponse]);
    }, 700);
  };

  return (
    <>
      {/* Chat panel */}
      <div
        style={{
          position: "fixed",
          bottom: "88px",
          right: "24px",
          width: "360px",
          maxHeight: "520px",
          background: "var(--surface-2)",
          border: "1px solid var(--border-mid)",
          borderRadius: "12px",
          zIndex: 9000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,235,200,0.04)",
          transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
          transformOrigin: "bottom right",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-dim)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "rgba(201,168,124,0.12)",
                border: "1px solid rgba(201,168,124,0.25)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={13} color="var(--accent)" />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                  }}
                >
                  ARIA
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "7px",
                    letterSpacing: "0.14em",
                    background: "rgba(201,168,124,0.12)",
                    border: "1px solid rgba(201,168,124,0.2)",
                    padding: "2px 6px",
                    borderRadius: "100px",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                  }}
                >
                  AI
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "1px",
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#4ADE80",
                    animation: "pulseGold 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "7px",
                    letterSpacing: "0.1em",
                    color: "var(--text-secondary)",
                  }}
                >
                  UpLevel AI · Online
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              transition: "color 0.2s ease",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 16px 8px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                animation: "fadeSlideUp 0.3s ease",
              }}
            >
              <div
                className={
                  msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick replies */}
        <div
          style={{
            padding: "8px 16px",
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            flexShrink: 0,
            borderTop: "1px solid var(--border-dim)",
            scrollbarWidth: "none",
          }}
        >
          {QUICK_REPLIES.map((qr) => (
            <button
              key={qr}
              onClick={() => sendMessage(qr)}
              style={{
                background: "none",
                border: "1px solid var(--border-dim)",
                borderRadius: "100px",
                padding: "5px 12px",
                fontFamily: "var(--font-mono)",
                fontSize: "7px",
                letterSpacing: "0.1em",
                color: "var(--text-secondary)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = "rgba(201,168,124,0.3)";
                (e.target as HTMLElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = "var(--border-dim)";
                (e.target as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--border-dim)",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask anything..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--border-mid)",
              padding: "6px 0",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 300,
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            style={{
              background: "rgba(201,168,124,0.1)",
              border: "1px solid rgba(201,168,124,0.2)",
              borderRadius: "4px",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--accent)",
              transition: "background 0.2s ease",
              flexShrink: 0,
            }}
          >
            <Send size={13} />
          </button>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: open ? "var(--surface-3)" : "var(--bg)",
          border: "1px solid rgba(201,168,124,0.35)",
          cursor: "pointer",
          zIndex: 9001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent)",
          transition: "all 0.3s ease",
          boxShadow: "0 0 30px rgba(201,168,124,0.12), 0 4px 20px rgba(0,0,0,0.3)",
          animation: open ? "none" : "chatPulse 3s ease-in-out infinite",
        }}
        aria-label="Open AI chat"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} strokeWidth={1.5} />}
      </button>

      <style>{`
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(201,168,124,0.12), 0 4px 20px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 50px rgba(201,168,124,0.2), 0 4px 20px rgba(0,0,0,0.3); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          /* Chat panel full width on mobile */
          div[style*="width: 360px"] {
            width: calc(100vw - 48px) !important;
            right: 24px !important;
          }
        }
      `}</style>
    </>
  );
}
