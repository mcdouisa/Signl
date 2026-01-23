import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'

// Allowed fields that can be updated without verification
const ALLOWED_FIELDS = [
  'linkedinUrl',
  'githubUrl',
  'portfolioUrl',
  'bio',
  'careerInterests',
  'skills',
  'major',
  'gpa',
  'gradYear'
]

export async function PUT(request) {
  try {
    const body = await request.json()
    const { studentId, updates } = body

    // Validate required fields
    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Updates object is required' },
        { status: 400 }
      )
    }

    // Filter to only allowed fields
    const sanitizedUpdates = {}
    for (const [key, value] of Object.entries(updates)) {
      if (ALLOWED_FIELDS.includes(key)) {
        // Validate specific fields
        if (key === 'skills' && Array.isArray(value)) {
          sanitizedUpdates[key] = value.slice(0, 5) // Max 5 skills
        } else if (key === 'gpa') {
          const gpaNum = parseFloat(value)
          sanitizedUpdates[key] = isNaN(gpaNum) ? null : Math.min(4.0, Math.max(0, gpaNum))
        } else if (typeof value === 'string') {
          sanitizedUpdates[key] = value.trim()
        } else {
          sanitizedUpdates[key] = value
        }
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    if (!db) {
      console.log('Firebase not configured - returning mock success')
      return NextResponse.json({
        success: true,
        message: 'Profile updated (development mode)',
        updates: sanitizedUpdates
      })
    }

    // Find the student document
    const studentRef = doc(db, 'students', studentId)

    // Add timestamp
    sanitizedUpdates.updatedAt = new Date().toISOString()

    // Update the document
    await updateDoc(studentRef, sanitizedUpdates)

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      updates: sanitizedUpdates
    })

  } catch (error) {
    console.error('Profile update error:', error)

    if (error.code === 'not-found') {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update profile. Please try again.' },
      { status: 500 }
    )
  }
}
