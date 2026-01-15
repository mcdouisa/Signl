import { NextResponse } from 'next/server'
import { db } from '../../../lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if Firebase is configured
    if (!db) {
      console.log('Firebase not configured - returning empty array')
      return NextResponse.json({
        success: true,
        students: [],
        message: 'Firebase not configured'
      })
    }

    // Fetch all active students
    const studentsRef = collection(db, 'students')
    const studentsQuery = query(studentsRef, where('status', '==', 'active'))

    const querySnapshot = await getDocs(studentsQuery)

    // Transform student data for company view (exclude sensitive fields)
    const students = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()

      // Calculate display name
      const name = `${data.firstName} ${data.lastName}`

      // Build student object for company view
      students.push({
        id: doc.id,
        name,
        major: data.major || 'Undeclared',
        gradYear: data.gradYear || 'TBD',
        careerInterests: data.careerInterests || '',
        githubUrl: data.githubUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        portfolioUrl: data.portfolioUrl || null,
        peerScore: data.peerScore || 70,
        nominationCount: data.nominationCount || 0,
        topSkills: data.skills || [],
        gpa: data.gpa || null,
        bio: data.bio || '',
        // Generate peer feedback from nominations if available
        peerFeedback: generatePeerFeedback(data.nominations || []),
        isRealStudent: true // Flag to differentiate from mock data
      })
    })

    // Sort by peer score (highest first)
    students.sort((a, b) => b.peerScore - a.peerScore)

    return NextResponse.json({
      success: true,
      students,
      count: students.length
    })

  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// Helper function to generate peer feedback from nominations
function generatePeerFeedback(nominations) {
  if (!nominations || nominations.length === 0) {
    return [
      'Recently joined - building peer validation',
      'Profile under review by peers'
    ]
  }

  // Extract reasons from nominations (these are peer comments)
  const feedback = nominations
    .filter(n => n.reason)
    .map(n => n.reason)
    .slice(0, 3)

  if (feedback.length === 0) {
    return [
      'Peer-validated student',
      'Nominated by classmates'
    ]
  }

  return feedback
}
