import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, budget } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    const resendKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL ?? "hello@uplevelservicesllc.com";

    const payload = {
      name,
      email,
      phone,
      company: company ?? "",
      message: message ?? "",
      budget: budget ?? "",
      source: "Contact Form",
      timestamp: new Date().toISOString(),
    };

    // Fire Make.com webhook
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Non-blocking — don't fail if webhook is down
      });
    }

    // Send confirmation via Resend
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "UpLevel Services <hello@uplevelservicesllc.com>",
          to: [email],
          bcc: [notificationEmail],
          subject: "Got your message — we'll be in touch within 24 hours.",
          html: `
            <div style="font-family:'Satoshi',Arial,sans-serif;max-width:560px;margin:0 auto;background:#050709;color:#EDF0F7;padding:40px;border:1px solid rgba(36,97,232,0.18);border-radius:8px;">
              <p style="font-family:'Clash Display',Arial,sans-serif;font-size:24px;font-weight:700;color:#EDF0F7;margin:0 0 8px;">${name},</p>
              <p style="font-size:16px;color:#A8B3C8;line-height:1.7;margin:0 0 24px;">We received your message. Expect a response within 24 hours — usually same day.</p>
              <div style="background:#0A0D14;border:1px solid rgba(36,97,232,0.10);border-radius:6px;padding:20px;margin:0 0 24px;">
                <p style="font-size:13px;font-family:monospace;color:#8895AA;margin:0 0 8px;letter-spacing:0.1em;">YOUR SUBMISSION</p>
                <p style="font-size:14px;color:#EDF0F7;margin:0 0 6px;"><strong>Company:</strong> ${company || "—"}</p>
                <p style="font-size:14px;color:#EDF0F7;margin:0 0 6px;"><strong>Phone:</strong> ${phone}</p>
                <p style="font-size:14px;color:#EDF0F7;margin:0;"><strong>Message:</strong> ${message || "—"}</p>
              </div>
              <p style="font-size:14px;color:#8895AA;margin:0;">— UpLevel Services<br/><a href="https://uplevelservicesllc.com" style="color:#2461E8;">uplevelservicesllc.com</a></p>
            </div>
          `,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
