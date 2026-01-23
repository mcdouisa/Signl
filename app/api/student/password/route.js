import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import crypto from 'crypto'

// Verify password against stored hash
function verifyPassword(password, storedHash, salt) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === storedHash
}

// Hash a new password
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return { hash, salt }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { studentId, currentPassword, newPassword } = body

    // Validate required fields
    if (!studentId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Student ID, current password, and new password are required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    if (!db) {
      console.log('Firebase not configured - returning mock success')
      return NextResponse.json({
        success: true,
        message: 'Password updated (development mode)'
      })
    }

    // Get the student document
    const studentRef = doc(db, 'students', studentId)
    const studentsRef = collection(db, 'students')

    // We need to get the document to verify current password
    const studentQuery = query(studentsRef, where('__name__', '==', studentId))

    // Actually, let's query by document ID directly using getDocs with the doc reference
    const { getDoc } = await import('firebase/firestore')
    const studentSnap = await getDoc(studentRef)

    if (!studentSnap.exists()) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    const studentData = studentSnap.data()

    // Verify current password
    if (!verifyPassword(currentPassword, studentData.passwordHash, studentData.passwordSalt)) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash the new password
    const { hash: newHash, salt: newSalt } = hashPassword(newPassword)

    // Update the password
    await updateDoc(studentRef, {
      passwordHash: newHash,
      passwordSalt: newSalt,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    })

  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json(
      { error: 'Failed to update password. Please try again.' },
      { status: 500 }
    )
  }
}
