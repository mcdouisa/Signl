import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const college = searchParams.get('college')
    const major = searchParams.get('major')

    // Validate required params
    if (!studentId || !college || !major) {
      return NextResponse.json(
        { error: 'Student ID, college, and major are required' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    if (!db) {
      console.log('Firebase not configured - returning mock peers')
      return NextResponse.json({
        success: true,
        peers: [
          {
            id: 'mock-1',
            firstName: 'Alex',
            lastName: 'Johnson',
            gradYear: 'May 2026',
            skills: ['Problem Solving', 'Leadership'],
            bio: 'Passionate about building great software.',
            college,
            major
          },
          {
            id: 'mock-2',
            firstName: 'Sarah',
            lastName: 'Williams',
            gradYear: 'December 2026',
            skills: ['Communication', 'Teamwork', 'Creativity'],
            bio: 'Love working on collaborative projects.',
            college,
            major
          }
        ],
        count: 2
      })
    }

    // Query students with same college and major, excluding the requesting student
    const studentsRef = collection(db, 'students')
    const peersQuery = query(
      studentsRef,
      where('college', '==', college),
      where('major', '==', major),
      where('status', '==', 'active')
    )

    const querySnapshot = await getDocs(peersQuery)

    // Get the requesting student's endorsements to check who they've already endorsed
    const endorsementsRef = collection(db, 'endorsements')
    const endorsementsQuery = query(
      endorsementsRef,
      where('endorserId', '==', studentId)
    )
    const endorsementsSnapshot = await getDocs(endorsementsQuery)

    const endorsedIds = new Set()
    endorsementsSnapshot.forEach(doc => {
      endorsedIds.add(doc.data().recipientId)
    })

    // Filter out the requesting student and map to safe data
    const peers = []
    querySnapshot.forEach(doc => {
      if (doc.id !== studentId) {
        const data = doc.data()
        peers.push({
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          gradYear: data.gradYear,
          skills: data.skills || [],
          bio: data.bio || '',
          college: data.college,
          major: data.major,
          linkedinUrl: data.linkedinUrl,
          githubUrl: data.githubUrl,
          hasEndorsed: endorsedIds.has(doc.id)
        })
      }
    })

    return NextResponse.json({
      success: true,
      peers,
      count: peers.length
    })

  } catch (error) {
    console.error('Peers fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch peers. Please try again.' },
      { status: 500 }
    )
  }
}
