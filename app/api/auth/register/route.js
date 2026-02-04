import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import crypto from 'crypto'

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

    // Validate LinkedIn URL is provided
    if (!linkedinUrl) {
      return NextResponse.json(
        { error: 'LinkedIn Profile URL is required' },
        { status: 400 }
      )
    }

    // Validate LinkedIn URL format (more permissive - allows query params, locales, etc.)
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+/i
    if (!linkedinPattern.test(linkedinUrl)) {
      return NextResponse.json(
        { error: 'Please provide a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)' },
        { status: 400 }
      )
    }

    // Validate nominations - at least 1 required with email or LinkedIn
    if (!nominations || nominations.length === 0) {
      return NextResponse.json(
        { error: 'At least one peer nomination is required' },
        { status: 400 }
      )
    }

    // Validate each nomination has either email or LinkedIn URL
    for (let i = 0; i < nominations.length; i++) {
      const nom = nominations[i]
      if (!nom.name || !nom.name.trim()) {
        return NextResponse.json(
          { error: `Nomination #${i + 1}: Name is required` },
          { status: 400 }
        )
      }
      
      const hasEmail = nom.email && nom.email.trim() && nom.email.includes('@')
      const hasLinkedIn = nom.linkedinUrl && nom.linkedinUrl.trim() && linkedinPattern.test(nom.linkedinUrl)
      
      if (!hasEmail && !hasLinkedIn) {
        return NextResponse.json(
          { error: `Nomination #${i + 1}: Either email or LinkedIn URL is required` },
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

    // Check if email already exists (case-insensitive)
    const normalizedEmail = schoolEmail.trim().toLowerCase()
    const studentsRef = collection(db, 'students')
    const emailQuery = query(studentsRef, where('schoolEmail', '==', normalizedEmail))
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

    // Parse GPA safely (avoid NaN in Firestore)
    let parsedGpa = null
    if (gpa && String(gpa).trim() !== '') {
      const num = parseFloat(gpa)
      if (!isNaN(num) && num >= 0 && num <= 4.0) {
        parsedGpa = num
      }
    }

    // Clean nominations data for Firestore
    const cleanNominations = (nominations || [])
      .filter(n => n && n.name && n.name.trim())
      .map(n => ({
        name: (n.name || '').trim(),
        email: (n.email || '').trim(),
        linkedinUrl: (n.linkedinUrl || '').trim(),
        major: (n.major || '').trim(),
        projectContext: (n.projectContext || '').trim(),
        skills: Array.isArray(n.skills) ? n.skills : [],
        reason: (n.reason || '').trim()
      }))

    // Create student document
    const studentData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      schoolEmail: schoolEmail.trim().toLowerCase(),
      personalEmail: personalEmail ? personalEmail.trim() : null,
      passwordHash: hash,
      passwordSalt: salt,
      gpa: parsedGpa,
      college: college || null,
      major: major || null,
      gradYear: gradYear || null,
      careerInterests: careerInterests || null,
      skills: Array.isArray(skills) ? skills : [],
      linkedinUrl: linkedinUrl.trim(),
      githubUrl: githubUrl ? githubUrl.trim() : null,
      bio: bio ? bio.trim() : null,
      nominations: cleanNominations,
      peerScore: initialPeerScore,
      nominationCount: 0,
      endorsementsGiven: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const docRef = await addDoc(studentsRef, studentData)

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
