import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

// ── In-memory rate limiter ───────────────────────────────────────
// 3 submissions per IP per 15-minute window. Resets on server restart.
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX       = 3;

const _rateMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const data = _rateMap.get(ip);

  if (!data || now - data.windowStart > RATE_WINDOW_MS) {
    _rateMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (data.count >= RATE_MAX) return true;
  data.count += 1;
  return false;
}

// ── Zod schema ───────────────────────────────────────────────────
const ContactSchema = z.object({
  name:      z.string().trim().min(2, "Name required"),
  business:  z.string().trim().min(2, "Business name required"),
  email:     z.string().email("Valid email required"),
  phone:     z.string().trim().optional(),
  situation: z.string().trim().optional(),
  details:   z.string().trim().min(10, "Please share more detail (10 chars min)"),
  budget:    z.string().trim().optional(),
});

type ContactPayload = z.infer<typeof ContactSchema>;

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Email (Resend) ────────────────────────────────────────────────
async function sendEmail(p: ContactPayload): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to  = process.env.CONTACT_TO_EMAIL ?? "admin@uplevelservicesllc.com";
  if (!key) return;

  const html = `
    <h2 style="font-family:sans-serif">New brief — ${esc(p.name)}</h2>
    <p><strong>Business:</strong> ${esc(p.business)}</p>
    <p><strong>Email:</strong> ${esc(p.email)}</p>
    ${p.phone     ? `<p><strong>Phone:</strong> ${esc(p.phone)}</p>` : ""}
    ${p.situation ? `<p><strong>Situation:</strong> ${esc(p.situation)}</p>` : ""}
    <p><strong>Details:</strong></p>
    <blockquote style="border-left:3px solid #4d82ff;padding-left:12px;margin-left:0">
      ${esc(p.details).replace(/\n/g, "<br>")}
    </blockquote>
    ${p.budget ? `<p><strong>Budget range:</strong> ${esc(p.budget)}</p>` : ""}
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:     "UpLevel Contact <onboarding@resend.dev>",
      to,
      reply_to: p.email,
      subject:  `New brief — ${p.business} (${p.name})`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${text}`);
  }
}

// ── SMS (Twilio) ──────────────────────────────────────────────────
async function sendSMS(p: ContactPayload): Promise<void> {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_FROM;
  const to    = process.env.CONTACT_TO_PHONE;
  if (!sid || !token || !from || !to) return;

  const body = `UpLevel brief — ${p.name.slice(0, 50)} @ ${p.business.slice(0, 50)} (${p.email.slice(0, 80)}). Check email.`;

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Twilio ${res.status}: ${text}`);
  }
}

// ── Handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Rate limit by IP (X-Forwarded-For for proxied envs, fallback to remote addr)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before submitting again." },
      { status: 429 }
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Validation failed.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const payload = parsed.data;

  // Fire both channels; partial failure still returns 200 (logged server-side)
  const results = await Promise.allSettled([
    sendEmail(payload),
    sendSMS(payload),
  ]);

  for (const r of results) {
    if (r.status === "rejected") {
      console.error("[contact/route] delivery error:", r.reason);
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
