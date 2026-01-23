import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs, doc, addDoc, updateDoc, getDoc, increment } from 'firebase/firestore'

const MAX_ENDORSEMENTS = 5

export async function POST(request) {
  try {
    const body = await request.json()
    const { endorserId, recipientId, skills, college, major } = body

    // Validate required fields
    if (!endorserId || !recipientId || !skills || !college || !major) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate skills array
    if (!Array.isArray(skills) || skills.length < 1 || skills.length > 3) {
      return NextResponse.json(
        { error: 'Please select 1-3 skills to endorse' },
        { status: 400 }
      )
    }

    // Can't endorse yourself
    if (endorserId === recipientId) {
      return NextResponse.json(
        { error: 'You cannot endorse yourself' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    if (!db) {
      console.log('Firebase not configured - returning mock success')
      return NextResponse.json({
        success: true,
        message: 'Endorsement submitted (development mode)'
      })
    }

    // Get the endorser's data to check their endorsement count and score
    const endorserRef = doc(db, 'students', endorserId)
    const endorserSnap = await getDoc(endorserRef)

    if (!endorserSnap.exists()) {
      return NextResponse.json(
        { error: 'Endorser not found' },
        { status: 404 }
      )
    }

    const endorserData = endorserSnap.data()
    const endorsementsGiven = endorserData.endorsementsGiven || 0

    // Check if endorser has reached the limit
    if (endorsementsGiven >= MAX_ENDORSEMENTS) {
      return NextResponse.json(
        { error: `You have already used all ${MAX_ENDORSEMENTS} endorsements` },
        { status: 400 }
      )
    }

    // Check if endorser is from the same college and major
    if (endorserData.college !== college || endorserData.major !== major) {
      return NextResponse.json(
        { error: 'You can only endorse peers from your college and major' },
        { status: 400 }
      )
    }

    // Get the recipient's data
    const recipientRef = doc(db, 'students', recipientId)
    const recipientSnap = await getDoc(recipientRef)

    if (!recipientSnap.exists()) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      )
    }

    const recipientData = recipientSnap.data()

    // Verify recipient is from the same college and major
    if (recipientData.college !== college || recipientData.major !== major) {
      return NextResponse.json(
        { error: 'Recipient must be from your college and major' },
        { status: 400 }
      )
    }

    // Check if already endorsed this person
    const endorsementsRef = collection(db, 'endorsements')
    const existingQuery = query(
      endorsementsRef,
      where('endorserId', '==', endorserId),
      where('recipientId', '==', recipientId)
    )
    const existingSnapshot = await getDocs(existingQuery)

    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: 'You have already endorsed this person' },
        { status: 400 }
      )
    }

    // Calculate score impact: endorser_score * 0.1 * num_skills
    const endorserScore = endorserData.peerScore || 70
    const scoreImpact = Math.round(endorserScore * 0.1 * skills.length)

    // Create the endorsement
    await addDoc(endorsementsRef, {
      endorserId,
      endorserScore,
      recipientId,
      skills,
      college,
      major,
      scoreImpact,
      createdAt: new Date().toISOString()
    })

    // Update endorser's count
    await updateDoc(endorserRef, {
      endorsementsGiven: increment(1),
      updatedAt: new Date().toISOString()
    })

    // Update recipient's score
    await updateDoc(recipientRef, {
      peerScore: increment(scoreImpact),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Endorsement submitted successfully',
      scoreImpact,
      endorsementsRemaining: MAX_ENDORSEMENTS - endorsementsGiven - 1
    })

  } catch (error) {
    console.error('Endorsement error:', error)
    return NextResponse.json(
      { error: 'Failed to submit endorsement. Please try again.' },
      { status: 500 }
    )
  }
}
