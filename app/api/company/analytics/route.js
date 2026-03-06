import { NextResponse } from 'next/server'
import { demoStudents } from '../../../../lib/demoStudents'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const recentCandidates = [...demoStudents]
      .sort((a, b) => b.peerScore - a.peerScore)
      .slice(0, 5)
      .map(s => ({
        id: s.id,
        name: s.name,
        major: s.major,
        gradYear: s.gradYear,
        peerScore: s.peerScore,
        nominationCount: s.nominationCount,
        schoolVerified: s.schoolVerified,
      }))

    const stats = {
      totalTalent: demoStudents.length,
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
