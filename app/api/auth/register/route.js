import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import crypto from 'crypto'
import { Resend } from 'resend'

function nominationReceivedHtml({ firstName, nominatorName, skills, projectContext }) {
  const year = new Date().getFullYear()
  const skillsList = (skills || []).join(', ') || 'your contributions'
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
<tr><td style="background:linear-gradient(135deg,#2563eb,#0d9488);padding:32px;text-align:center;">
  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Signl</h1>
  <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Peer-validated talent</p>
</td></tr>
<tr><td style="padding:40px 32px;">
  <h2 style="margin:0 0 20px;color:#111827;font-size:22px;font-weight:700;">You received a peer nomination!</h2>
  <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.6;">Hi ${firstName},</p>
  <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.6;"><strong>${nominatorName}</strong> just joined Signl and nominated you for <strong>${skillsList}</strong>${projectContext ? ` from your work on <em>${projectContext}</em>` : ''}.</p>
  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:0 0 32px;">
    <p style="margin:0;color:#1e40af;font-size:14px;">Peer nominations signal real-world credibility to companies browsing Signl for talent.</p>
  </div>
  <a href="https://signl.cc/student/nominations" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0d9488);color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">View Your Nominations →</a>
</td></tr>
<tr><td style="padding:24px 32px;border-top:1px solid #e5e7eb;text-align:center;">
  <p style="margin:0 0 6px;color:#9ca3af;font-size:13px;">You're receiving this because you have email notifications enabled on Signl.</p>
  <a href="https://signl.cc/student/settings" style="color:#6b7280;font-size:13px;text-decoration:underline;">Manage notification settings</a>
  <p style="margin:8px 0 0;color:#d1d5db;font-size:12px;">&copy; ${year} Signl. All rights reserved.</p>
</td></tr>
</table></td></tr></table></body></html>`
}

function welcomeNominationsHtml({ firstName, count }) {
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
  <h2 style="margin:0 0 20px;color:#111827;font-size:22px;font-weight:700;">Welcome to Signl — your peers already nominated you!</h2>
  <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.6;">Hi ${firstName},</p>
  <p style="margin:0 0 24px;color:#4b5563;font-size:16px;line-height:1.6;">Before you even signed up, <strong>${count} peer${count !== 1 ? 's' : ''}</strong> already nominated you on Signl. Sign in to see what they said about you and your work.</p>
  <a href="https://signl.cc/student/nominations" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0d9488);color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">View Your Nominations →</a>
</td></tr>
<tr><td style="padding:24px 32px;border-top:1px solid #e5e7eb;text-align:center;">
  <a href="https://signl.cc/student/settings" style="color:#6b7280;font-size:13px;text-decoration:underline;">Manage notification settings</a>
  <p style="margin:8px 0 0;color:#d1d5db;font-size:12px;">&copy; ${year} Signl. All rights reserved.</p>
</td></tr>
</table></td></tr></table></body></html>`
}

// Hash password using SHA-256 with salt
function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex')
  }
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return { hash, salt }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      schoolEmail,
      personalEmail,
      password,
      gpa,
      college,
      major,
      gradYear,
      careerInterests,
      skills,
      linkedinUrl,
      githubUrl,
      bio,
      nominations
    } = body

    // Validate required fields
    if (!firstName || !lastName || !schoolEmail || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, schoolEmail, password' },
        { status: 400 }
      )
    }

    // Validate LinkedIn URL format only if provided (it is optional)
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+/i
    if (linkedinUrl && linkedinUrl.trim() && !linkedinPattern.test(linkedinUrl)) {
      return NextResponse.json(
        { error: 'Please provide a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)' },
        { status: 400 }
      )
    }

    // Filter out empty nominations and validate
    const validNominations = (nominations || []).filter(nom => nom.name && nom.name.trim())
    
    // Validate at least 1 nomination with content
    if (validNominations.length === 0) {
      return NextResponse.json(
        { error: 'At least one peer nomination is required' },
        { status: 400 }
      )
    }

    // Validate each valid nomination has an email address (required for matching)
    for (let i = 0; i < validNominations.length; i++) {
      const nom = validNominations[i]
      const hasEmail = nom.email && nom.email.trim() && nom.email.includes('@')

      if (!hasEmail) {
        return NextResponse.json(
          { error: `Nomination for "${nom.name}": A valid email address is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(schoolEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    if (!db) {
      console.log('Firebase not configured - using development mode')
      return NextResponse.json({
        success: true,
        message: 'Account created (development mode)',
        studentId: 'dev-' + Date.now()
      })
    }

    // Check if email already exists
    const studentsRef = collection(db, 'students')
    const emailQuery = query(studentsRef, where('schoolEmail', '==', schoolEmail))
    const existingStudents = await getDocs(emailQuery)

    if (!existingStudents.empty) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash the password
    const { hash, salt } = hashPassword(password)

    // Calculate initial peer score (base score, will increase with nominations)
    const initialPeerScore = 70

    // Create student document
    const studentData = {
      firstName,
      lastName,
      schoolEmail,
      personalEmail: personalEmail || null,
      passwordHash: hash,
      passwordSalt: salt,
      gpa: gpa ? parseFloat(gpa) : null,
      college: college || null,
      major: major || null,
      gradYear: gradYear || null,
      careerInterests: careerInterests || null,
      skills: skills || [],
      linkedinUrl: linkedinUrl,
      githubUrl: githubUrl || null,
      bio: bio || null,
      nominations: validNominations,
      peerScore: initialPeerScore,
      nominationCount: 0,
      endorsementsGiven: 0,
      emailNotifications: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const docRef = await addDoc(studentsRef, studentData)

    // Send nomination emails after registration (non-blocking)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const allStudentsSnap = await getDocs(query(studentsRef, where('status', '==', 'active')))

      // 1. Find existing students who had already nominated this new student
      let incomingCount = 0
      const notifiedExisting = new Set()

      allStudentsSnap.forEach(d => {
        if (d.id === docRef.id) return
        const data = d.data()
        if (!data.nominations) return
        data.nominations.forEach(nom => {
          if (nom.email && nom.email.toLowerCase() === schoolEmail.toLowerCase()) {
            incomingCount++
          }
        })
      })

      // Send welcome email to new student if they already have incoming nominations
      if (incomingCount > 0) {
        await resend.emails.send({
          from: 'Signl Team <team@signl.cc>',
          to: schoolEmail,
          replyTo: 'support@signl.cc',
          subject: `Welcome to Signl — ${incomingCount} peer${incomingCount !== 1 ? 's have' : ' has'} already nominated you!`,
          text: `Hi ${firstName},\n\nWelcome to Signl! Before you even signed up, ${incomingCount} peer${incomingCount !== 1 ? 's' : ''} already nominated you. Sign in to see what they said: https://signl.cc/student/nominations\n\n— The Signl Team`,
          html: welcomeNominationsHtml({ firstName, count: incomingCount })
        }).catch(e => console.error('Welcome nomination email failed:', e))
      }

      // 2. For each nomination the new student made, notify the nominee if they already have an account
      for (const nom of validNominations) {
        if (!nom.email) continue
        const nomineeSnap = await getDocs(query(studentsRef, where('schoolEmail', '==', nom.email.toLowerCase())))
        if (nomineeSnap.empty) continue
        let nomineeData = null
        nomineeSnap.forEach(d => { nomineeData = d.data() })
        if (!nomineeData || nomineeData.emailNotifications === false) continue
        if (notifiedExisting.has(nom.email.toLowerCase())) continue
        notifiedExisting.add(nom.email.toLowerCase())

        await resend.emails.send({
          from: 'Signl Team <team@signl.cc>',
          to: nomineeData.schoolEmail,
          replyTo: 'support@signl.cc',
          subject: `${firstName} ${lastName} nominated you on Signl`,
          text: `Hi ${nomineeData.firstName},\n\n${firstName} ${lastName} just joined Signl and nominated you for ${(nom.skills || []).join(', ') || 'your contributions'}${nom.projectContext ? ` from your work on "${nom.projectContext}"` : ''}.\n\nSign in to view your nominations: https://signl.cc/student/nominations\n\nTo manage email notifications, visit: https://signl.cc/student/settings\n\n— The Signl Team`,
          html: nominationReceivedHtml({
            firstName: nomineeData.firstName,
            nominatorName: `${firstName} ${lastName}`,
            skills: nom.skills,
            projectContext: nom.projectContext
          })
        }).catch(e => console.error('Nomination notification email failed:', e))
      }
    } catch (emailError) {
      console.error('Post-registration email error:', emailError)
      // Email failures must not break registration success
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      studentId: docRef.id
    })

  } catch (error) {
    console.error('Registration error:', error.message, error.stack)
    return NextResponse.json(
      { error: `Failed to create account: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
