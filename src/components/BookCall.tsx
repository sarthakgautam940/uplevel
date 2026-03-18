"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { brand } from "../../lib/brand.config";

export default function BookCall() {
  const headRef = useRef<HTMLDivElement>(null);
  const [headV, setHeadV] = useState(false);
  const [formState, setFormState] = useState({
    name: "", email: "", phone: "", company: "", message: "", budget: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeadV(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const d = await res.json();
        setError(d.error ?? "Something went wrong.");
      }
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border-dim)",
    borderRadius: "4px",
    padding: "12px 16px",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 200ms",
  };

  return (
    <section id="book" className="section-padding" style={{ position: "relative" }}>
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(36,97,232,0.05) 0%, transparent 70%)",
      }} />
      <div className="dot-grid-bg-dim" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      <div className="container-inner" style={{ position: "relative" }}>
        <div ref={headRef} style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 96px)",
          alignItems: "start",
        }}
          className="block md:grid"
        >
          {/* Left — headline + Calendly CTA */}
          <div>
            <motion.span
              initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
              className="label-eyebrow" style={{ display: "block", marginBottom: "16px" }}
            >
              Book A Call
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={headV ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-headline" style={{ marginBottom: "20px" }}
            >
              15 minutes.<br />
              No pitch.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: "clamp(15px, 1.8vw, 17px)", color: "var(--text-secondary)",
                lineHeight: 1.7, maxWidth: "420px", marginBottom: "36px",
              }}
            >
              We look at your current site before the call, walk you through exactly
              what&apos;s losing you money, and show you a live demo. If it&apos;s not a fit,
              we&apos;ll tell you in the first five minutes.
            </motion.p>

            {/* What to expect */}
            <motion.div
              initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              style={{
                display: "flex", flexDirection: "column", gap: "12px",
                marginBottom: "40px",
              }}
            >
              {[
                "We review your site before the call",
                "You see the demo live — no slides",
                "No follow-up pressure — clear answer either way",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: "var(--electric)",
                    boxShadow: "0 0 8px rgba(36,97,232,0.7)",
                    flexShrink: 0, marginTop: "7px",
                  }} />
                  <span style={{ fontSize: "15px", color: "var(--text-secondary)" }}>{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.a
              initial={{ opacity: 0, y: 10 }} animate={headV ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              href={brand.calendlyUrl} target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "inline-flex", fontSize: "15px", padding: "16px 36px" }}
            >
              Book a 15-Minute Call ↗
            </motion.a>

            <motion.div
              initial={{ opacity: 0 }} animate={headV ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: "20px",
                fontFamily: "var(--font-mono)", fontSize: "11px",
                letterSpacing: "0.1em", color: "var(--text-dim)",
              }}
            >
              <span style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "#22d3a0", display: "inline-block",
                boxShadow: "0 0 8px rgba(34,211,160,0.8)", marginRight: "8px",
              }} />
              {brand.availability.slotsTotal - brand.availability.slotsTaken} of {brand.availability.slotsTotal} slots open this month
            </motion.div>
          </div>

          {/* Right — fallback contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={headV ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            <div style={{
              padding: "clamp(24px, 4vw, 40px)",
              background: "var(--surface)",
              border: "1px solid var(--border-dim)",
              borderRadius: "8px",
            }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "10px",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--text-dim)", marginBottom: "24px",
              }}>
                Or Send a Message
              </div>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ textAlign: "center", padding: "48px 0" }}
                >
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: "rgba(36,97,232,0.1)",
                    border: "1px solid var(--electric)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: "20px",
                  }}>
                    ✓
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "18px",
                    fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px",
                  }}>
                    Message received.
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                    We&apos;ll reply within 24 hours — usually same day.
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <input
                      style={inputStyle}
                      placeholder="Your name *"
                      value={formState.name}
                      onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                      required
                      onFocus={e => (e.target.style.borderColor = "var(--electric)")}
                      onBlur={e => (e.target.style.borderColor = "var(--border-dim)")}
                    />
                    <input
                      style={inputStyle}
                      placeholder="Company"
                      value={formState.company}
                      onChange={e => setFormState(s => ({ ...s, company: e.target.value }))}
                      onFocus={e => (e.target.style.borderColor = "var(--electric)")}
                      onBlur={e => (e.target.style.borderColor = "var(--border-dim)")}
                    />
                  </div>
                  <input
                    style={inputStyle}
                    type="email"
                    placeholder="Email address *"
                    value={formState.email}
                    onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    required
                    onFocus={e => (e.target.style.borderColor = "var(--electric)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border-dim)")}
                  />
                  <input
                    style={inputStyle}
                    type="tel"
                    placeholder="Phone number *"
                    value={formState.phone}
                    onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))}
                    required
                    onFocus={e => (e.target.style.borderColor = "var(--electric)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border-dim)")}
                  />
                  <select
                    style={{ ...inputStyle, color: formState.budget ? "var(--text-primary)" : "var(--text-dim)" }}
                    value={formState.budget}
                    onChange={e => setFormState(s => ({ ...s, budget: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = "var(--electric)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border-dim)")}
                  >
                    <option value="">Monthly revenue range (optional)</option>
                    <option value="<25k">Under $25K/month</option>
                    <option value="25k-75k">$25K–$75K/month</option>
                    <option value="75k-200k">$75K–$200K/month</option>
                    <option value="200k+">$200K+/month</option>
                  </select>
                  <textarea
                    style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                    placeholder="Tell us about your business"
                    value={formState.message}
                    onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = "var(--electric)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border-dim)")}
                  />

                  {error && (
                    <div style={{
                      fontSize: "13px", color: "var(--warm)",
                      padding: "10px 14px", border: "1px solid var(--border-warm)",
                      borderRadius: "4px", background: "rgba(232,160,32,0.06)",
                    }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn-primary" disabled={sending}
                    style={{ opacity: sending ? 0.7 : 1, cursor: sending ? "wait" : "pointer" }}>
                    {sending ? "Sending…" : "Send Message ↗"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
