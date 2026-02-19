import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import crypto from 'crypto'

// Verify password against stored hash
function verifyPassword(password, storedHash, salt) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === storedHash
}

// Generate a simple session token
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    if (!db) {
      console.log('Firebase not configured - using development mode')
      return NextResponse.json({
        success: true,
        message: 'Login successful (development mode)',
        student: {
          id: 'dev-123',
          firstName: 'Dev',
          lastName: 'User',
          schoolEmail: email
        },
        sessionToken: generateSessionToken()
      })
    }

    // Find user by email
    const studentsRef = collection(db, 'students')
    const emailQuery = query(studentsRef, where('schoolEmail', '==', email))
    const querySnapshot = await getDocs(emailQuery)

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Get the student document
    const studentDoc = querySnapshot.docs[0]
    const studentData = studentDoc.data()

    // Verify password
    if (!verifyPassword(password, studentData.passwordHash, studentData.passwordSalt)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate session token
    const sessionToken = generateSessionToken()

    // Return student data (excluding sensitive fields)
    const safeStudentData = {
      id: studentDoc.id,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      schoolEmail: studentData.schoolEmail,
      personalEmail: studentData.personalEmail,
      college: studentData.college,
      major: studentData.major,
      gradYear: studentData.gradYear,
      careerInterests: studentData.careerInterests,
      skills: studentData.skills,
      linkedinUrl: studentData.linkedinUrl,
      githubUrl: studentData.githubUrl,
      portfolioUrl: studentData.portfolioUrl,
      bio: studentData.bio,
      gpa: studentData.gpa,
      lookingFor: studentData.lookingFor,
      targetIndustries: studentData.targetIndustries,
      peerScore: studentData.peerScore,
      nominationCount: studentData.nominationCount,
      endorsementsGiven: studentData.endorsementsGiven || 0,
      nominations: studentData.nominations || []
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      student: safeStudentData,
      sessionToken
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
