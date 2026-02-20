import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs, doc, addDoc, updateDoc, getDoc, increment } from 'firebase/firestore'
import { Resend } from 'resend'

const MAX_ENDORSEMENTS = 5

function endorsementEmailHtml({ firstName, endorserName, skillsList, scoreImpact }) {
  const year = new Date().getFullYear()
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
<tr><td style="background:linear-gradient(135deg,#2563eb,#0d9488);padding:32px;text-align:center;">
  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Signl</h1>
  <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Peer-validated talent</p>
</td></tr>
<tr><td style="padding:40px 32px;">
  <h2 style="margin:0 0 20px;color:#111827;font-size:22px;font-weight:700;">You received a peer endorsement!</h2>
  <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.6;">Hi ${firstName},</p>
  <p style="margin:0 0 24px;color:#4b5563;font-size:16px;line-height:1.6;"><strong>${endorserName}</strong> just endorsed you for <strong>${skillsList}</strong> on Signl. Your Peer Score increased by <strong>+${scoreImpact} points</strong>.</p>
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:0 0 32px;">
    <p style="margin:0;color:#166534;font-size:14px;">Peer endorsements boost your visibility to companies searching for talent on Signl.</p>
  </div>
  <a href="https://signl.cc/student/dashboard" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0d9488);color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">View Your Profile →</a>
</td></tr>
<tr><td style="padding:24px 32px;border-top:1px solid #e5e7eb;text-align:center;">
  <p style="margin:0 0 6px;color:#9ca3af;font-size:13px;">You're receiving this because you have email notifications enabled on Signl.</p>
  <a href="https://signl.cc/student/settings" style="color:#6b7280;font-size:13px;text-decoration:underline;">Manage notification settings</a>
  <p style="margin:8px 0 0;color:#d1d5db;font-size:12px;">&copy; ${year} Signl. All rights reserved.</p>
</td></tr>
</table></td></tr></table></body></html>`
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { endorserId, recipientId, skills, college, major } = body

    // Validate required fields
    if (!endorserId || !recipientId || !skills || !college || !major) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate skills array
    if (!Array.isArray(skills) || skills.length < 1 || skills.length > 3) {
      return NextResponse.json(
        { error: 'Please select 1-3 skills to endorse' },
        { status: 400 }
      )
    }

    // Can't endorse yourself
    if (endorserId === recipientId) {
      return NextResponse.json(
        { error: 'You cannot endorse yourself' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    if (!db) {
      console.log('Firebase not configured - returning mock success')
      return NextResponse.json({
        success: true,
        message: 'Endorsement submitted (development mode)'
      })
    }

    // Get the endorser's data to check their endorsement count and score
    const endorserRef = doc(db, 'students', endorserId)
    const endorserSnap = await getDoc(endorserRef)

    if (!endorserSnap.exists()) {
      return NextResponse.json(
        { error: 'Endorser not found' },
        { status: 404 }
      )
    }

    const endorserData = endorserSnap.data()
    const endorsementsGiven = endorserData.endorsementsGiven || 0

    // Check if endorser has reached the limit
    if (endorsementsGiven >= MAX_ENDORSEMENTS) {
      return NextResponse.json(
        { error: `You have already used all ${MAX_ENDORSEMENTS} endorsements` },
        { status: 400 }
      )
    }

    // Check if endorser is from the same college and major
    if (endorserData.college !== college || endorserData.major !== major) {
      return NextResponse.json(
        { error: 'You can only endorse peers from your college and major' },
        { status: 400 }
      )
    }

    // Get the recipient's data
    const recipientRef = doc(db, 'students', recipientId)
    const recipientSnap = await getDoc(recipientRef)

    if (!recipientSnap.exists()) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      )
    }

    const recipientData = recipientSnap.data()

    // Verify recipient is from the same college and major
    if (recipientData.college !== college || recipientData.major !== major) {
      return NextResponse.json(
        { error: 'Recipient must be from your college and major' },
        { status: 400 }
      )
    }

    // Check if already endorsed this person
    const endorsementsRef = collection(db, 'endorsements')
    const existingQuery = query(
      endorsementsRef,
      where('endorserId', '==', endorserId),
      where('recipientId', '==', recipientId)
    )
    const existingSnapshot = await getDocs(existingQuery)

    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: 'You have already endorsed this person' },
        { status: 400 }
      )
    }

    // Calculate score impact: endorser_score * 0.1 * num_skills
    const endorserScore = endorserData.peerScore || 70
    const scoreImpact = Math.round(endorserScore * 0.1 * skills.length)

    // Create the endorsement
    await addDoc(endorsementsRef, {
      endorserId,
      endorserScore,
      recipientId,
      skills,
      college,
      major,
      scoreImpact,
      createdAt: new Date().toISOString()
    })

    // Update endorser's count
    await updateDoc(endorserRef, {
      endorsementsGiven: increment(1),
      updatedAt: new Date().toISOString()
    })

    // Update recipient's score
    await updateDoc(recipientRef, {
      peerScore: increment(scoreImpact),
      updatedAt: new Date().toISOString()
    })

    // Send email notification if recipient has not opted out (default: opted in)
    if (recipientData.emailNotifications !== false && recipientData.schoolEmail) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const endorserName = `${endorserData.firstName} ${endorserData.lastName}`
        const skillsList = skills.join(', ')
        await resend.emails.send({
          from: 'Signl Team <team@signl.cc>',
          to: recipientData.schoolEmail,
          replyTo: 'support@signl.cc',
          subject: `${endorserName} endorsed your skills on Signl`,
          text: `Hi ${recipientData.firstName},\n\n${endorserName} just endorsed you for ${skillsList} on Signl! Your Peer Score increased by +${scoreImpact} points.\n\nSign in to see your profile: https://signl.cc/student/dashboard\n\nTo manage email notifications, visit: https://signl.cc/student/settings\n\n— The Signl Team`,
          html: endorsementEmailHtml({
            firstName: recipientData.firstName,
            endorserName,
            skillsList,
            scoreImpact
          })
        })
      } catch (emailError) {
        console.error('Failed to send endorsement email:', emailError)
        // Email failure should not block the endorsement response
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Endorsement submitted successfully',
      scoreImpact,
      endorsementsRemaining: MAX_ENDORSEMENTS - endorsementsGiven - 1
    })

  } catch (error) {
    console.error('Endorsement error:', error)
    return NextResponse.json(
      { error: 'Failed to submit endorsement. Please try again.' },
      { status: 500 }
    )
  }
}
