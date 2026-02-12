import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 500 }
      )
    }

    // Find student by email
    const studentsRef = collection(db, 'students')
    const emailQuery = query(studentsRef, where('schoolEmail', '==', email))
    const querySnapshot = await getDocs(emailQuery)

    // Always return success to avoid leaking whether an account exists
    if (querySnapshot.empty) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.'
      })
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour expiry

    // Store token in Firestore
    await addDoc(collection(db, 'password_reset_tokens'), {
      email,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      used: false
    })

    // Build reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/student/reset-password?token=${token}&email=${encodeURIComponent(email)}`

    // Send reset email
    await resend.emails.send({
      from: 'Signl Team <team@signl.cc>',
      to: [email],
      subject: 'Reset Your Signl Password',
      replyTo: 'support@signl.cc',
      text: `You requested a password reset for your Signl account.

Click the link below to reset your password:

${resetUrl}

This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.

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
              <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
            </div>

            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                You requested to reset your Signl account password. Click the button below to set a new password.
              </p>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${resetUrl}"
                   style="background: linear-gradient(135deg, #667eea 0%, #14b8a6 100%);
                          color: white;
                          padding: 14px 32px;
                          text-decoration: none;
                          border-radius: 8px;
                          font-weight: 600;
                          font-size: 16px;
                          display: inline-block;">
                  Reset Password
                </a>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} Signl. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}
