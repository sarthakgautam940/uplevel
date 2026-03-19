"use client";

import { useState } from "react";
import { brand } from "@/config/brand.config";
import { CheckCircle, Calendar, Clock, Shield } from "lucide-react";

const serviceOptions = [
  "Website System",
  "AI Voice Agent",
  "Local SEO",
  "Brand Identity",
  "Full Machine",
];

export default function Contact() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    message: "",
  });

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, services: selectedServices }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Still show success for demo
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const trustPoints = [
    {
      icon: Clock,
      label: "Response in 2 hours",
      sub: "During business hours",
    },
    {
      icon: Calendar,
      label: "Free discovery call",
      sub: "No pitch, just answers",
    },
    {
      icon: Shield,
      label: "No obligation",
      sub: "We earn your business",
    },
  ];

  return (
    <section
      id="contact"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border-dim)",
        padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative text */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-40px",
          fontFamily: "var(--font-display)",
          fontSize: "40vw",
          fontWeight: 700,
          fontStyle: "italic",
          color: "var(--text-primary)",
          opacity: 0.018,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        START
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "80px",
          alignItems: "start",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left */}
        <div>
          <div className="section-eyebrow">Get Started</div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Let&apos;s build your{" "}
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
              system.
            </span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: 300,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: "380px",
              marginBottom: "48px",
            }}
          >
            Tell us about your business. We&apos;ll reach out within 2 hours to schedule your
            free discovery call — no obligation, no sales pitch.
          </p>

          {/* Trust points */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "48px" }}>
            {trustPoints.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "rgba(201,168,124,0.08)",
                    border: "1px solid rgba(201,168,124,0.15)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} color="var(--accent)" strokeWidth={1.5} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      marginBottom: "2px",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "8px",
                      letterSpacing: "0.12em",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Availability badge */}
          <div className="availability-badge" style={{ display: "inline-flex" }}>
            <span className="availability-dot" />
            {brand.availability.label} This Month
          </div>
        </div>

        {/* Right — form card */}
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-mid)",
            borderRadius: "6px",
            padding: "clamp(32px, 4vw, 52px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Success state */}
          {submitted ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
                textAlign: "center",
                gap: "20px",
              }}
            >
              <div
                style={{
                  animation: "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <CheckCircle size={48} color="var(--accent)" strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Message received.
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  maxWidth: "300px",
                }}
              >
                We&apos;ll be in touch within 2 hours with your discovery call link.
              </p>
              <a
                href={brand.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: "inline-flex", marginTop: "8px" }}
              >
                <span>Or schedule now →</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Name + Business */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder=" "
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <label className="form-label">Your Name</label>
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder=" "
                    value={form.business}
                    onChange={(e) =>
                      setForm({ ...form, business: e.target.value })
                    }
                    required
                  />
                  <label className="form-label">Business Name</label>
                </div>
              </div>

              {/* Email + Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                <div className="form-field">
                  <input
                    type="email"
                    className="form-input"
                    placeholder=" "
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                  <label className="form-label">Email Address</label>
                </div>
                <div className="form-field">
                  <input
                    type="tel"
                    className="form-input"
                    placeholder=" "
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                  <label className="form-label">Phone (Optional)</label>
                </div>
              </div>

              {/* Service chips */}
              <div style={{ marginBottom: "32px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "8px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                    marginBottom: "12px",
                  }}
                >
                  What Do You Need?
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {serviceOptions.map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      className={`service-chip ${
                        selectedServices.includes(svc) ? "active" : ""
                      }`}
                      onClick={() => toggleService(svc)}
                    >
                      {svc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="form-field">
                <textarea
                  className="form-input"
                  placeholder=" "
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  style={{ resize: "none" }}
                />
                <label className="form-label">Tell Us About Your Business</label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                  opacity: loading ? 0.7 : 1,
                  transition: "opacity 0.3s ease",
                  cursor: loading ? "wait" : "none",
                }}
                disabled={loading}
                data-cursor="SEND"
              >
                <span>{loading ? "Sending..." : "Send Message →"}</span>
              </button>

              <div
                style={{
                  textAlign: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: "8px",
                  letterSpacing: "0.14em",
                  color: "var(--text-dim)",
                }}
              >
                or{" "}
                <a
                  href={brand.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent)",
                    textDecoration: "none",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  Schedule 15-min call →
                </a>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 768px) {
          #contact > div > div:first-child + div {
            display: none !important;
          }
          #contact > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
