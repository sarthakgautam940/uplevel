import { NextRequest, NextResponse } from 'next/server'
import { integrations } from '@/lib/integrations'

interface ContactPayload {
  name: string
  business: string
  email: string
  phone: string
  services: string[]
  message: string
}

// ─── PLACEHOLDER HANDLERS ────────────────────────────────────────────────────
// Each function logs what it would do in dev. Flip `enabled: true` in
// lib/integrations.ts and add real keys to activate the real version.

async function sendEmailNotification(payload: ContactPayload) {
  if (!integrations.email.enabled) {
    console.log('[EMAIL PLACEHOLDER] Would send lead notification to:', integrations.email.toAddress)
    console.log('[EMAIL PLACEHOLDER] Lead data:', JSON.stringify(payload, null, 2))
    return { success: true, simulated: true }
  }

  // ── REAL IMPLEMENTATION (Resend) ──────────────────────────────────────────
  // Uncomment when integrations.email.enabled = true and key is set
  /*
  const { Resend } = await import('resend')
  const resend = new Resend(integrations.email.apiKey)

  await resend.emails.send({
    from: integrations.email.fromAddress,
    to: integrations.email.toAddress,
    subject: `New Lead: ${payload.business} — ${payload.services.join(', ')}`,
    html: `
      <h2>New Lead from UpLevel Website</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Business:</strong> ${payload.business}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Phone:</strong> ${payload.phone}</p>
      <p><strong>Services:</strong> ${payload.services.join(', ')}</p>
      <p><strong>Message:</strong></p>
      <p>${payload.message}</p>
    `,
  })
  */

  return { success: true }
}

async function sendSmsAlert(payload: ContactPayload) {
  if (!integrations.sms.enabled) {
    console.log('[SMS PLACEHOLDER] Would text lead alert to:', integrations.sms.toNumber)
    console.log(`[SMS PLACEHOLDER] Message: New lead from ${payload.name} at ${payload.business} (${payload.phone})`)
    return { success: true, simulated: true }
  }

  // ── REAL IMPLEMENTATION (Twilio) ──────────────────────────────────────────
  /*
  const twilio = (await import('twilio')).default
  const client = twilio(integrations.sms.accountSid, integrations.sms.authToken)

  await client.messages.create({
    body: `🔔 New UpLevel Lead\n${payload.name} · ${payload.business}\n${payload.phone}\nServices: ${payload.services.join(', ')}`,
    from: integrations.sms.fromNumber,
    to: integrations.sms.toNumber,
  })
  */

  return { success: true }
}

async function pushToCRM(payload: ContactPayload) {
  if (!integrations.crm.enabled) {
    console.log('[CRM PLACEHOLDER] Would create contact in:', integrations.crm.provider)
    console.log('[CRM PLACEHOLDER] Contact:', payload.name, '/', payload.email)
    return { success: true, simulated: true }
  }

  // ── REAL IMPLEMENTATION (GoHighLevel) ────────────────────────────────────
  /*
  const res = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${integrations.crm.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: payload.name.split(' ')[0],
      lastName: payload.name.split(' ').slice(1).join(' '),
      email: payload.email,
      phone: payload.phone,
      companyName: payload.business,
      source: 'Website Contact Form',
      tags: payload.services,
      customField: { message: payload.message },
    }),
  })
  if (!res.ok) throw new Error('CRM push failed')
  */

  return { success: true }
}

// ─── MAIN ROUTE HANDLER ──────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: ContactPayload = await request.json()

    // Basic validation
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Run all integrations in parallel
    const results = await Promise.allSettled([
      sendEmailNotification(body),
      sendSmsAlert(body),
      pushToCRM(body),
    ])

    // Log any failures (don't surface to user)
    results.forEach((result, i) => {
      const names = ['email', 'sms', 'crm']
      if (result.status === 'rejected') {
        console.error(`[CONTACT API] ${names[i]} integration failed:`, result.reason)
      }
    })

    return NextResponse.json(
      { success: true, message: 'Submission received.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('[CONTACT API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Only allow POST
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
