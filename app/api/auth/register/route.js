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
