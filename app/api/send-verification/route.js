import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '../../../lib/firebase.js'
import { collection, addDoc } from 'firebase/firestore'
import crypto from 'crypto'

// Initialize Resend with your API key
// Get your API key from https://resend.com/api-keys
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Generate a secure verification token
    const token = crypto.randomBytes(32).toString('hex')

    // Store token in database with 24-hour expiration
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // Store token in Firebase (if configured)
    if (db) {
      try {
        await addDoc(collection(db, 'verification_tokens'), {
          email,
          token,
          expiresAt: expiresAt.toISOString(),
          createdAt: new Date().toISOString(),
          used: false
        })
      } catch (firebaseError) {
        console.error('Firebase error:', firebaseError)
        // Continue even if Firebase fails
      }
    } else {
      console.log('Firebase not configured - skipping token storage (development mode)')
    }

    // Create verification link
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/student/signup?token=${token}&email=${encodeURIComponent(email)}`

    // Send verification email using Resend
    try {
      const data = await resend.emails.send({
        from: 'Signl Team <onboarding@resend.dev>', // Replace with your verified domain
        to: [email],
        subject: 'Complete Your Signl Account Setup',
        replyTo: 'noreply@resend.dev',
        text: `Welcome to Signl!

You recently requested to create an account with Signl. To complete your registration and verify your email address, please click the link below:

${verificationUrl}

This link will expire in 24 hours. If you didn't request this email, you can safely ignore it.

© ${new Date().getFullYear()} Signl. All rights reserved.`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #14b8a6 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Signl!</h1>
              </div>

              <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>

                <p style="font-size: 16px; margin-bottom: 20px;">
                  You recently requested to create an account with Signl. To complete your registration and verify your email address, please click the button below.
                </p>

                <div style="text-align: center; margin: 35px 0;">
                  <a href="${verificationUrl}"
                     style="background: linear-gradient(135deg, #667eea 0%, #14b8a6 100%);
                            color: white;
                            padding: 14px 32px;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: 600;
                            font-size: 16px;
                            display: inline-block;">
                    Verify Email & Create Account
                  </a>
                </div>

                <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                  This link will expire in 24 hours. If you didn't request this email, you can safely ignore it.
                </p>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
                </p>
              </div>

              <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Signl. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
      })

      console.log('Verification email sent:', data)

      return NextResponse.json({
        success: true,
        message: 'Verification email sent successfully'
      })

    } catch (emailError) {
      console.error('Resend error:', emailError)

      // If Resend fails (e.g., API key not set), return helpful error
      if (emailError.message?.includes('API key')) {
        return NextResponse.json(
          { error: 'Email service not configured. Please add RESEND_API_KEY to your environment variables.' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in send-verification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
