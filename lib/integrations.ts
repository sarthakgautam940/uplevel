/**
 * UPLEVEL SERVICES — INTEGRATIONS CONFIG
 * =======================================
 * All external service keys and settings live here.
 * Replace placeholder values with real credentials to activate each integration.
 *
 * For production: move these to environment variables in .env.local
 * and reference them as process.env.VARIABLE_NAME
 */

export const integrations = {

  // ─── EMAIL (Resend) ───────────────────────────────────────────────────────
  // Sign up at resend.com → API Keys → Create Key
  // Paste key below OR set RESEND_API_KEY in .env.local
  email: {
    provider: 'resend',                          // 'resend' | 'sendgrid' | 'nodemailer'
    apiKey: process.env.RESEND_API_KEY || 'RESEND_API_KEY_HERE',
    fromAddress: 'hello@uplevelservices.co',
    toAddress: 'hello@uplevelservices.co',       // where leads go
    enabled: false,                              // flip to true once key is set
  },

  // ─── SMS NOTIFICATIONS (Twilio) ───────────────────────────────────────────
  // Sign up at twilio.com → Account → API Keys
  sms: {
    provider: 'twilio',
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'TWILIO_ACCOUNT_SID_HERE',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'TWILIO_AUTH_TOKEN_HERE',
    fromNumber: process.env.TWILIO_FROM_NUMBER || '+1XXXXXXXXXX',
    toNumber: process.env.NOTIFY_PHONE || '+1XXXXXXXXXX',  // your number for lead alerts
    enabled: false,
  },

  // ─── CRM (GoHighLevel / HubSpot / etc.) ───────────────────────────────────
  crm: {
    provider: 'gohighlevel',                    // 'gohighlevel' | 'hubspot' | 'none'
    apiKey: process.env.CRM_API_KEY || 'CRM_API_KEY_HERE',
    locationId: process.env.GHL_LOCATION_ID || 'GHL_LOCATION_ID_HERE',
    enabled: false,
  },

  // ─── AI PHONE AGENT (Bland.ai / Vapi / Retell) ────────────────────────────
  aiAgent: {
    provider: 'bland',                          // 'bland' | 'vapi' | 'retell'
    apiKey: process.env.BLAND_API_KEY || 'BLAND_API_KEY_HERE',
    phoneNumber: process.env.AI_AGENT_PHONE || '+1XXXXXXXXXX',
    enabled: false,
  },

  // ─── ANALYTICS ────────────────────────────────────────────────────────────
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX',
    enabled: false,
  },

  // ─── CALENDLY ─────────────────────────────────────────────────────────────
  // No key needed — just confirm the URL is correct in lib/brand.ts
  calendly: {
    url: 'https://calendly.com/uplevelservices/discovery',
  },

}

export type IntegrationsConfig = typeof integrations
