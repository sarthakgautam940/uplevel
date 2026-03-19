import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, business, email, phone, services, message } = body;

    // Send via Resend if API key is present
    const apiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFICATION_EMAIL;

    if (apiKey && notifyEmail) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "UpLevel Services <noreply@uplevelservices.co>",
          to: [notifyEmail],
          subject: `New Lead: ${business} — ${name}`,
          html: `
            <div style="font-family: monospace; max-width: 600px; padding: 32px; background: #111010; color: #F5F0E8;">
              <h2 style="color: #C9A87C; margin-bottom: 24px;">New Inquiry — UpLevel Services</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6B635A; width: 140px;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #6B635A;">Business</td><td style="padding: 8px 0;">${business}</td></tr>
                <tr><td style="padding: 8px 0; color: #6B635A;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
                <tr><td style="padding: 8px 0; color: #6B635A;">Phone</td><td style="padding: 8px 0;">${phone || "Not provided"}</td></tr>
                <tr><td style="padding: 8px 0; color: #6B635A;">Services</td><td style="padding: 8px 0;">${(services || []).join(", ") || "None selected"}</td></tr>
                <tr><td style="padding: 8px 0; color: #6B635A; vertical-align: top;">Message</td><td style="padding: 8px 0;">${message || "No message"}</td></tr>
              </table>
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #2C2825; color: #6B635A; font-size: 11px;">
                Submitted via uplevelservices.co
              </div>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        console.error("Resend error:", await res.text());
      }
    }

    // Forward to Make.com webhook if URL is set
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (makeWebhookUrl) {
      await fetch(makeWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, business, email, phone, services, message }),
      }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
