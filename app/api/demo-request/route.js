import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '../../../lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { name, email, phone, company } = await request.json()

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Name and either email or phone number are required' },
        { status: 400 }
      )
    }

    const submission = {
      name,
      email: email || '',
      phone: phone || '',
      company: company || '',
      createdAt: new Date().toISOString(),
      status: 'new'
    }

    // Save to Firestore
    if (db) {
      await addDoc(collection(db, 'demo_requests'), submission)
    }

    // Email notification to you
    await resend.emails.send({
      from: 'Signl Team <team@signl.cc>',
      to: ['mcdougalisaac@gmail.com'],
      replyTo: email || undefined,
      subject: `New Demo Request from ${name}`,
      text: `New demo request received!\n\nName: ${name}\nEmail: ${email || 'Not provided'}\nPhone: ${phone || 'Not provided'}\nCompany: ${company || 'Not provided'}\n\nSubmitted: ${new Date().toLocaleString()}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #34d399 100%); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Demo Request</h1>
            </div>
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; width: 120px;">Name</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151;">Email</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${email ? `<a href="mailto:${email}" style="color: #667eea;">${email}</a>` : 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151;">Phone</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${phone ? `<a href="tel:${phone}" style="color: #667eea;">${phone}</a>` : 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: 600; color: #374151;">Company</td>
                  <td style="padding: 12px 0; color: #111827;">${company || 'Not provided'}</td>
                </tr>
              </table>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} Signl</p>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Demo request submitted successfully'
    })

  } catch (error) {
    console.error('Demo request error:', error)
    return NextResponse.json(
      { error: 'Failed to submit request. Please try again.' },
      { status: 500 }
    )
  }
}
