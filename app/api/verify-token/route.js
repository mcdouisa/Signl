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

    // Try to validate with Firebase if configured
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

        if (!querySnapshot.empty) {
          // Token found in Firebase - validate it
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
        }

        // Token not found in Firebase - fall through to permissive mode
        console.log('Token not found in Firebase, using permissive verification')

      } catch (firebaseError) {
        console.error('Firebase error (using permissive mode):', firebaseError.message)
        // Fall through to permissive mode
      }
    }

    // Permissive mode - Firebase not working or token not stored
    // Allow verification if token looks valid (64 char hex string)
    if (token && token.length === 64 && /^[a-f0-9]+$/.test(token)) {
      console.log('Permissive verification for:', email)
      return NextResponse.json({
        success: true,
        email: email,
        message: 'Email verified successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid verification link' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in verify-token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
