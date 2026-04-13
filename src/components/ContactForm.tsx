"use client";

import { useState } from "react";

const SITUATIONS = [
  "Website feels outdated or is hurting conversions",
  "No after-hours lead capture — losing leads overnight",
  "Both — site and lead capture need work",
  "Just exploring what's possible",
  "Not sure yet",
];

const BUDGET_OPTIONS = [
  { value: "exploring", label: "Exploring / not sure yet" },
  { value: "defined", label: "Defined project — ready when the fit is right" },
  { value: "urgent", label: "Urgent — this needs to move quickly" },
];

interface FormState {
  name: string;
  business: string;
  email: string;
  phone: string;
  situation: string;
  details: string;
  budget: string;
}

type FormTone = "site" | "paper" | "glass";

export default function ContactForm({ tone = "site" }: { tone?: FormTone }) {
  const paper = tone === "paper";
  const glass = tone === "glass";
  const light = paper || glass;

  const [form, setForm] = useState<FormState>({
    name: "",
    business: "",
    email: "",
    phone: "",
    situation: "",
    details: "",
    budget: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const canSubmit =
    form.name.trim().length >= 2 &&
    form.business.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.details.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Submission failed");
      }
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-5 py-4">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full border"
          style={{
            borderColor: light ? "rgba(201,168,76,0.45)" : "color-mix(in srgb, var(--warm) 45%, var(--border))",
            color: "var(--warm)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3.5 10.5L8 15L16.5 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p
            className={`font-display tracking-[-0.02em] ${glass ? "text-[var(--glass-ink)]" : light ? "text-neutral-900" : "text-[var(--text)]"}`}
            style={{ fontSize: "clamp(1.25rem,2.5vw,1.75rem)", fontWeight: 400 }}
          >
            Received.
          </p>
          <p
            className={`mt-3 max-w-[44ch] font-body text-[14px] leading-[1.72] ${glass ? "text-[var(--glass-ink-soft)]" : light ? "text-neutral-600" : "text-[var(--text-dim)]"}`}
          >
            If it looks like a fit, you&apos;ll hear back with an honest answer and a clear next step
            — usually within one business day, often the same day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        className={`mb-8 border-b pb-6 ${glass || paper ? "border-neutral-200" : "border-[var(--border)]"}`}
      >
        <div>
          <p
            className={`font-body text-[10px] font-medium uppercase tracking-[0.2em] ${glass ? "text-[var(--glass-ink)]" : light ? "text-neutral-500" : "text-[var(--text-dim)]"}`}
          >
            Project brief
          </p>
          <p
            className={`mt-2 max-w-[36ch] font-body text-[13px] leading-[1.55] ${glass ? "text-[var(--glass-ink-soft)]" : light ? "text-neutral-500" : "text-[var(--text-dim)]/80"}`}
          >
            Fields marked with an asterisk are required. Everything else helps us respond with context.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Field label="Your name" required tone={tone}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </Field>

        <Field label="Business name" required tone={tone}>
          <input
            type="text"
            value={form.business}
            onChange={(e) => setField("business", e.target.value)}
            placeholder="Business or practice name"
            autoComplete="organization"
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Email" required tone={tone}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="Work email"
              autoComplete="email"
            />
          </Field>

          <Field label="Phone" tone={tone}>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="Optional — prefer a callback?"
              autoComplete="tel"
            />
          </Field>
        </div>

        <Field label="What's the situation?" tone={tone}>
          <select value={form.situation} onChange={(e) => setField("situation", e.target.value)}>
            <option value="">Select one…</option>
            {SITUATIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="What's breaking right now" required tone={tone}>
          <textarea
            value={form.details}
            onChange={(e) => setField("details", e.target.value)}
            placeholder="What feels like it's costing you? What would 'fixed' actually look like for your business?"
            rows={4}
          />
        </Field>

        <div>
          <p
            className={`mb-3 font-body text-[10px] uppercase tracking-[0.18em] ${glass ? "text-[var(--glass-ink)]" : light ? "text-neutral-500" : "text-[var(--text-dim)]"}`}
          >
            Investment comfort
            <span
              className={`ml-1.5 ${glass ? "text-[var(--glass-ink-muted)]" : "opacity-40"}`}
            >
              (optional)
            </span>
          </p>
          <div className="flex flex-col gap-2">
            {BUDGET_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex cursor-none items-center gap-3">
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors"
                  style={{
                    borderColor:
                      form.budget === opt.value
                        ? "var(--warm)"
                        : glass || paper
                          ? "#d4d4d4"
                          : "var(--border)",
                    background:
                      glass ? "transparent" : form.budget === opt.value ? "var(--warm)" : "transparent",
                  }}
                  aria-hidden="true"
                >
                  {form.budget === opt.value && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${glass ? "bg-[var(--warm)]" : paper ? "bg-neutral-950" : "bg-[var(--void)]"}`}
                    />
                  )}
                </span>
                <input
                  type="radio"
                  className="sr-only"
                  name="budget"
                  value={opt.value}
                  checked={form.budget === opt.value}
                  onChange={() => setField("budget", opt.value)}
                />
                <span
                  className={`font-body text-[13px] ${glass ? "text-[var(--glass-ink-soft)]" : light ? "text-neutral-600" : "text-[var(--text-dim)]"}`}
                >
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className={`mt-4 font-body text-[12px] ${light ? "text-red-700" : "text-red-400"}`}>
          {error}
        </p>
      )}

      <div className="mt-8">
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="cta-primary inline-flex items-center justify-center rounded-full border px-8 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.14em] transition-all duration-300 disabled:opacity-40"
          style={
            glass
              ? {
                  borderColor: canSubmit ? "var(--warm)" : "color-mix(in srgb, var(--glass-ink-muted) 55%, #c4c4c4)",
                  background: "transparent",
                  color: canSubmit ? "var(--glass-ink)" : "var(--glass-ink-muted)",
                  cursor: canSubmit ? "none" : "not-allowed",
                  boxShadow: "none",
                  opacity: canSubmit ? 1 : 0.88,
                }
              : {
                  borderColor: canSubmit ? "var(--warm)" : paper ? "#d4d4d4" : "var(--border)",
                  background: canSubmit ? "var(--warm)" : "transparent",
                  color: canSubmit ? "var(--void)" : light ? "#737373" : "var(--text-dim)",
                  cursor: canSubmit ? "none" : "not-allowed",
                  boxShadow: canSubmit ? "0 0 0 1px rgba(201,168,76,0.2)" : "none",
                }
          }
        >
          {submitting ? "Sending…" : "Send the brief"}
        </button>
        <p
          className={`mt-3 font-body text-[11px] ${glass ? "text-[var(--glass-ink-muted)]" : light ? "text-neutral-400" : "text-[var(--text-dim)] opacity-40"}`}
        >
          No spam. No sales sequence. Just a direct response.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  tone = "site",
  children,
}: {
  label: string;
  required?: boolean;
  tone?: FormTone;
  children: React.ReactNode;
}) {
  const shell =
    tone === "glass"
      ? "[&_input]:border-neutral-300 [&_input]:bg-transparent [&_input]:text-[var(--glass-ink)] [&_input]:transition-colors [&_input:focus]:border-[#c9a84c] [&_input::placeholder]:text-[var(--glass-ink-muted)] [&_input::placeholder]:opacity-95 [&_select]:border-neutral-300 [&_select]:bg-transparent [&_select]:text-[var(--glass-ink)] [&_select]:transition-colors [&_select:focus]:border-[#c9a84c] [&_textarea]:border-neutral-300 [&_textarea]:bg-transparent [&_textarea]:text-[var(--glass-ink)] [&_textarea]:transition-colors [&_textarea:focus]:border-[#c9a84c] [&_textarea::placeholder]:text-[var(--glass-ink-muted)] [&_textarea::placeholder]:opacity-95"
      : tone === "paper"
        ? "[&_input]:border-neutral-200 [&_input]:bg-white [&_input]:text-neutral-900 [&_input]:transition-colors [&_input:focus]:border-[#c9a84c] [&_input::placeholder]:text-neutral-400 [&_select]:border-neutral-200 [&_select]:bg-white [&_select]:text-neutral-900 [&_select]:transition-colors [&_select:focus]:border-[#c9a84c] [&_textarea]:border-neutral-200 [&_textarea]:bg-white [&_textarea]:text-neutral-900 [&_textarea]:transition-colors [&_textarea:focus]:border-[#c9a84c] [&_textarea::placeholder]:text-neutral-400"
        : "[&_input]:border-[var(--border)] [&_input]:bg-[var(--void)] [&_input]:text-[var(--text)] [&_input]:transition-colors [&_input:focus]:border-[color-mix(in_srgb,var(--warm)_50%,var(--border))] [&_input::placeholder]:text-[var(--text-dim)] [&_input::placeholder]:opacity-40 [&_select]:border-[var(--border)] [&_select]:bg-[var(--void)] [&_select]:text-[var(--text)] [&_select]:transition-colors [&_select:focus]:border-[color-mix(in_srgb,var(--warm)_50%,var(--border))] [&_textarea]:border-[var(--border)] [&_textarea]:bg-[var(--void)] [&_textarea]:text-[var(--text)] [&_textarea]:transition-colors [&_textarea:focus]:border-[color-mix(in_srgb,var(--warm)_50%,var(--border))] [&_textarea::placeholder]:text-[var(--text-dim)] [&_textarea::placeholder]:opacity-40";

  const labelTone =
    tone === "glass"
      ? "text-[var(--glass-ink)]"
      : tone === "paper"
        ? "text-neutral-500"
        : "text-[var(--text-dim)]";

  return (
    <label className="flex flex-col gap-2">
      <span className={`font-body text-[10px] uppercase tracking-[0.18em] ${labelTone}`}>
        {label}
        {required && (
          <span className={`ml-1 ${tone === "glass" ? "text-[var(--glass-ink-muted)]" : "opacity-40"}`}>*</span>
        )}
      </span>
      <div
        className={`[&_input]:w-full [&_input]:rounded-sm [&_input]:border [&_input]:px-4 [&_input]:py-3 [&_input]:font-body [&_input]:text-[14px] [&_input]:outline-none [&_select]:w-full [&_select]:rounded-sm [&_select]:border [&_select]:px-4 [&_select]:py-3 [&_select]:font-body [&_select]:text-[14px] [&_select]:outline-none [&_textarea]:w-full [&_textarea]:resize-none [&_textarea]:rounded-sm [&_textarea]:border [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:font-body [&_textarea]:text-[14px] [&_textarea]:outline-none ${shell}`}
      >
        {children}
      </div>
    </label>
  );
}
