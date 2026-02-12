import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import crypto from 'crypto'

function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex')
  }
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return { hash, salt }
}

export async function POST(request) {
  try {
    const { email, token, newPassword } = await request.json()

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 500 }
      )
    }

    // Find the reset token
    const tokensRef = collection(db, 'password_reset_tokens')
    const tokenQuery = query(
      tokensRef,
      where('email', '==', email),
      where('token', '==', token),
      where('used', '==', false)
    )
    const tokenSnapshot = await getDocs(tokenQuery)

    if (tokenSnapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link. Please request a new one.' },
        { status: 400 }
      )
    }

    const tokenDoc = tokenSnapshot.docs[0]
    const tokenData = tokenDoc.data()

    // Check expiry
    if (new Date(tokenData.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Find the student
    const studentsRef = collection(db, 'students')
    const studentQuery = query(studentsRef, where('schoolEmail', '==', email))
    const studentSnapshot = await getDocs(studentQuery)

    if (studentSnapshot.empty) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      )
    }

    // Update password
    const studentDoc = studentSnapshot.docs[0]
    const { hash, salt } = hashPassword(newPassword)

    await updateDoc(doc(db, 'students', studentDoc.id), {
      passwordHash: hash,
      passwordSalt: salt,
      updatedAt: new Date().toISOString()
    })

    // Mark token as used
    await updateDoc(doc(db, 'password_reset_tokens', tokenDoc.id), {
      used: true
    })

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    )
  }
}
