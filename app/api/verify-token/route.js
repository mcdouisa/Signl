import { NextResponse } from 'next/server'
import { db } from '../../../lib/firebase.js'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'

export async function POST(request) {
  try {
    const { token, email } = await request.json()

    // Validate input
    if (!token || !email) {
      return NextResponse.json(
        { error: 'Token and email are required' },
        { status: 400 }
      )
    }

    // If Firebase is configured, validate the token
    if (db) {
      try {
        // Query Firestore for the verification token
        const tokensRef = collection(db, 'verification_tokens')
        const q = query(
          tokensRef,
          where('token', '==', token),
          where('email', '==', email),
          where('used', '==', false)
        )

        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          return NextResponse.json(
            { error: 'Invalid or expired verification link' },
            { status: 400 }
          )
        }

        // Get the token document
        const tokenDoc = querySnapshot.docs[0]
        const tokenData = tokenDoc.data()

        // Check if token has expired
        const expiresAt = new Date(tokenData.expiresAt)
        const now = new Date()

        if (now > expiresAt) {
          return NextResponse.json(
            { error: 'Verification link has expired. Please request a new one.' },
            { status: 400 }
          )
        }

        // Mark token as used
        await updateDoc(doc(db, 'verification_tokens', tokenDoc.id), {
          used: true,
          usedAt: new Date().toISOString()
        })

        return NextResponse.json({
          success: true,
          email: tokenData.email,
          message: 'Email verified successfully'
        })

      } catch (firebaseError) {
        console.error('Firebase query error:', firebaseError)
        throw firebaseError
      }
    } else {
      // Development mode - Firebase not configured
      // Allow any token to pass for testing
      console.log('Firebase not configured - allowing verification in development mode')

      return NextResponse.json({
        success: true,
        email: email,
        message: 'Email verified (development mode - add Firebase for production)'
      })
    }

  } catch (error) {
    console.error('Error in verify-token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
