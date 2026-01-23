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
      githubUrl: githubUrl || null,
      bio: bio || null,
      nominations: nominations || [],
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
