import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    let totalTalent = 0
    let recentCandidates = []

    if (db) {
      // Fetch real data from Firebase
      const studentsRef = collection(db, 'students')
      const studentsQuery = query(studentsRef, where('status', '==', 'active'))
      const snapshot = await getDocs(studentsQuery)

      const students = []
      snapshot.forEach(doc => {
        const data = doc.data()
        students.push({
          id: doc.id,
          name: `${data.firstName} ${data.lastName}`,
          major: data.major || 'Undeclared',
          gradYear: data.gradYear || 'TBD',
          peerScore: data.peerScore || 70,
          nominationCount: data.nominationCount || 0,
          schoolVerified: data.schoolVerified || false,
        })
      })

      totalTalent = students.length
      recentCandidates = students.sort((a, b) => b.peerScore - a.peerScore).slice(0, 5)
    } else {
      // Mock data for development
      totalTalent = 10
      recentCandidates = [
        { id: '1', name: 'Sarah Chen', major: 'Computer Science', gradYear: '2025', peerScore: 95, nominationCount: 12, schoolVerified: true },
        { id: '2', name: 'Marcus Johnson', major: 'Information Systems', gradYear: '2025', peerScore: 92, nominationCount: 10, schoolVerified: true },
        { id: '9', name: 'Rachel Kim', major: 'Engineering', gradYear: '2025', peerScore: 91, nominationCount: 11, schoolVerified: true },
        { id: '3', name: 'Emily Rodriguez', major: 'Computer Science', gradYear: '2025', peerScore: 89, nominationCount: 9, schoolVerified: true },
        { id: '4', name: 'James Park', major: 'Data Science', gradYear: '2026', peerScore: 87, nominationCount: 8, schoolVerified: true },
      ]
    }

    const stats = {
      totalTalent,
      talentChange: 12,
      inPipeline: 0,
      pipelineChange: 0,
      profileViews: 127,
      viewsChange: 18,
      messagesSent: 24,
      messagesChange: 8,
      studentsViewed: 45,
      pipeline: {
        interested: 0,
        reachedOut: 0,
        interviewing: 0,
        offerExtended: 0,
      },
      viewsBySchool: [
        { label: 'U of Utah', value: 34 },
        { label: 'BYU', value: 28 },
        { label: 'Utah State', value: 19 },
        { label: 'Weber St', value: 12 },
        { label: 'SUU', value: 8 },
      ],
      nominationsBySkill: [
        { label: 'Tech', value: 45 },
        { label: 'Lead', value: 38 },
        { label: 'Comm', value: 32 },
        { label: 'Solve', value: 28 },
        { label: 'Team', value: 25 },
        { label: 'Create', value: 18 },
      ],
      nominationsByMajor: [
        { label: 'CS', value: 52 },
        { label: 'IS', value: 35 },
        { label: 'Business', value: 28 },
        { label: 'Finance', value: 20 },
        { label: 'Eng', value: 15 },
      ],
      outreach: {
        sent: 24,
        opened: 18,
        responded: 12,
        openRate: 75,
        responseRate: 50,
      },
      weeklyViews: [
        { label: 'W1', value: 12 },
        { label: 'W2', value: 18 },
        { label: 'W3', value: 24 },
        { label: 'W4', value: 31 },
      ],
    }

    return NextResponse.json({
      success: true,
      stats,
      recentCandidates,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
