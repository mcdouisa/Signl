import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore'

export async function POST(request) {
  try {
    const body = await request.json()
    const { token, newEmail, studentId } = body

    // Validate required fields
    if (!token || !newEmail || !studentId) {
      return NextResponse.json(
        { error: 'Token, new email, and student ID are required' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    if (!db) {
      console.log('Firebase not configured - returning mock success')
      return NextResponse.json({
        success: true,
        message: 'Email updated (development mode)'
      })
    }

    // Find the email change token
    const tokensRef = collection(db, 'email_change_tokens')
    const tokenQuery = query(
      tokensRef,
      where('token', '==', token),
      where('newEmail', '==', newEmail),
      where('studentId', '==', studentId),
      where('used', '==', false)
    )

    const tokenSnapshot = await getDocs(tokenQuery)

    if (tokenSnapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid or expired confirmation link' },
        { status: 400 }
      )
    }

    const tokenDoc = tokenSnapshot.docs[0]
    const tokenData = tokenDoc.data()

    // Check if token has expired
    const expiresAt = new Date(tokenData.expiresAt)
    const now = new Date()

    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Confirmation link has expired. Please request a new email change.' },
        { status: 400 }
      )
    }

    // Verify the student exists
    const studentRef = doc(db, 'students', studentId)
    const studentSnap = await getDoc(studentRef)

    if (!studentSnap.exists()) {
      return NextResponse.json(
        { error: 'Student account not found' },
        { status: 404 }
      )
    }

    // Double-check the new email isn't already taken
    const studentsRef = collection(db, 'students')
    const emailQuery = query(studentsRef, where('schoolEmail', '==', newEmail))
    const existingStudent = await getDocs(emailQuery)

    if (!existingStudent.empty) {
      return NextResponse.json(
        { error: 'This email is now in use by another account' },
        { status: 409 }
      )
    }

    // Update the student's email
    await updateDoc(studentRef, {
      schoolEmail: newEmail,
      updatedAt: new Date().toISOString()
    })

    // Mark the token as used
    await updateDoc(doc(db, 'email_change_tokens', tokenDoc.id), {
      used: true,
      usedAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Email updated successfully. Please log in with your new email address.',
      newEmail
    })

  } catch (error) {
    console.error('Email change confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to update email. Please try again.' },
      { status: 500 }
    )
  }
}
