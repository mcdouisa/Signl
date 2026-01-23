import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs, doc, addDoc, getDoc } from 'firebase/firestore'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

// Verify password against stored hash
function verifyPassword(password, storedHash, salt) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === storedHash
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { studentId, newEmail, password } = body

    // Validate required fields
    if (!studentId || !newEmail || !password) {
      return NextResponse.json(
        { error: 'Student ID, new email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    if (!db) {
      console.log('Firebase not configured - returning mock success')
      return NextResponse.json({
        success: true,
        message: 'Verification email sent (development mode)'
      })
    }

    // Get the student document
    const studentRef = doc(db, 'students', studentId)
    const studentSnap = await getDoc(studentRef)

    if (!studentSnap.exists()) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    const studentData = studentSnap.data()

    // Verify password
    if (!verifyPassword(password, studentData.passwordHash, studentData.passwordSalt)) {
      return NextResponse.json(
        { error: 'Password is incorrect' },
        { status: 401 }
      )
    }

    // Check if new email is same as current
    if (studentData.schoolEmail === newEmail) {
      return NextResponse.json(
        { error: 'New email must be different from current email' },
        { status: 400 }
      )
    }

    // Check if new email is already in use by another student
    const studentsRef = collection(db, 'students')
    const emailQuery = query(studentsRef, where('schoolEmail', '==', newEmail))
    const existingStudent = await getDocs(emailQuery)

    if (!existingStudent.empty) {
      return NextResponse.json(
        { error: 'This email is already in use by another account' },
        { status: 409 }
      )
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // Store email change token
    try {
      await addDoc(collection(db, 'email_change_tokens'), {
        studentId,
        oldEmail: studentData.schoolEmail,
        newEmail,
        token,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        used: false
      })
    } catch (err) {
      console.error('Failed to store email change token:', err)
      return NextResponse.json(
        { error: 'Failed to initiate email change. Please try again.' },
        { status: 500 }
      )
    }

    // Create confirmation link
    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/student/confirm-email?token=${token}&newEmail=${encodeURIComponent(newEmail)}&studentId=${studentId}`

    // Send verification email to the NEW email address
    try {
      await resend.emails.send({
        from: 'Signl Team <team@signl.cc>',
        to: [newEmail],
        subject: 'Confirm Your New Email Address - Signl',
        replyTo: 'support@signl.cc',
        text: `Hello ${studentData.firstName},

You recently requested to change your Signl account email from ${studentData.schoolEmail} to ${newEmail}.

To confirm this change, please click the link below:

${confirmUrl}

This link will expire in 24 hours. If you didn't request this change, you can safely ignore this email and your account will remain unchanged.

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
                <h1 style="color: white; margin: 0; font-size: 28px;">Confirm Email Change</h1>
              </div>

              <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hello ${studentData.firstName},</p>

                <p style="font-size: 16px; margin-bottom: 20px;">
                  You recently requested to change your Signl account email address.
                </p>

                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                  <p style="margin: 0; font-size: 14px;"><strong>Current email:</strong> ${studentData.schoolEmail}</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>New email:</strong> ${newEmail}</p>
                </div>

                <p style="font-size: 16px; margin-bottom: 20px;">
                  Click the button below to confirm this change:
                </p>

                <div style="text-align: center; margin: 35px 0;">
                  <a href="${confirmUrl}"
                     style="background: linear-gradient(135deg, #667eea 0%, #14b8a6 100%);
                            color: white;
                            padding: 14px 32px;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: 600;
                            font-size: 16px;
                            display: inline-block;">
                    Confirm Email Change
                  </a>
                </div>

                <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                  This link will expire in 24 hours. If you didn't request this change, you can safely ignore this email.
                </p>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${confirmUrl}" style="color: #667eea; word-break: break-all;">${confirmUrl}</a>
                </p>
              </div>

              <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Signl. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
      })

      return NextResponse.json({
        success: true,
        message: `Verification email sent to ${newEmail}. Please check your inbox.`
      })

    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Email change request error:', error)
    return NextResponse.json(
      { error: 'Failed to process email change request. Please try again.' },
      { status: 500 }
    )
  }
}
