import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const maxResults = parseInt(searchParams.get('limit') || '15')

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    if (!db) {
      return NextResponse.json({
        success: true,
        activity: [
          { id: '1', type: 'endorsement_received', message: 'Alex Johnson endorsed your Problem Solving skills', timestamp: new Date(Date.now() - 1800000).toISOString(), icon: 'star' },
          { id: '2', type: 'nomination_received', message: 'You were nominated by a peer in your major', timestamp: new Date(Date.now() - 7200000).toISOString(), icon: 'user-plus' },
          { id: '3', type: 'endorsement_given', message: 'You endorsed Sarah Williams', timestamp: new Date(Date.now() - 14400000).toISOString(), icon: 'thumbs-up' },
          { id: '4', type: 'profile_view', message: 'Your profile was viewed 3 times this week', timestamp: new Date(Date.now() - 86400000).toISOString(), icon: 'eye' },
          { id: '5', type: 'score_change', message: 'Your peer score increased by 7 points', timestamp: new Date(Date.now() - 172800000).toISOString(), icon: 'trending-up' },
          { id: '6', type: 'new_peer', message: '2 new students joined your major at BYU', timestamp: new Date(Date.now() - 259200000).toISOString(), icon: 'users' },
          { id: '7', type: 'badge_earned', message: 'You earned the "Early Adopter" badge!', timestamp: new Date(Date.now() - 345600000).toISOString(), icon: 'award' },
          { id: '8', type: 'milestone', message: 'You\'re now in the top 25% of peer scores in your major', timestamp: new Date(Date.now() - 432000000).toISOString(), icon: 'trophy' }
        ],
        stats: {
          profileViews: 12,
          profileViewsTrend: 'up',
          endorsementsReceived: 4,
          endorsementsGiven: 2,
          nominationsReceived: 3,
          peerScore: 85,
          peerScoreTrend: 'up',
          peerScoreChange: 7,
          networkSize: 18,
          rank: { position: 5, total: 23, percentile: 78 }
        }
      })
    }

    // Fetch endorsements received
    const endorsementsRef = collection(db, 'endorsements')
    const receivedQuery = query(
      endorsementsRef,
      where('recipientId', '==', studentId),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    )
    const receivedSnapshot = await getDocs(receivedQuery)

    // Fetch endorsements given
    const givenQuery = query(
      endorsementsRef,
      where('endorserId', '==', studentId),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    )
    const givenSnapshot = await getDocs(givenQuery)

    // Build activity items
    const activity = []

    receivedSnapshot.forEach(doc => {
      const data = doc.data()
      activity.push({
        id: doc.id,
        type: 'endorsement_received',
        message: `Someone endorsed your ${data.skills.join(', ')} skills`,
        timestamp: data.createdAt,
        icon: 'star',
        scoreImpact: data.scoreImpact
      })
    })

    givenSnapshot.forEach(doc => {
      const data = doc.data()
      activity.push({
        id: doc.id,
        type: 'endorsement_given',
        message: `You endorsed a peer's skills`,
        timestamp: data.createdAt,
        icon: 'thumbs-up'
      })
    })

    // Sort by timestamp
    activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    // Calculate stats
    const studentsRef = collection(db, 'students')
    const studentQuery = query(studentsRef, where('__name__', '==', studentId))
    const studentSnapshot = await getDocs(studentQuery)
    let studentData = null
    studentSnapshot.forEach(doc => { studentData = { id: doc.id, ...doc.data() } })

    let stats = {
      profileViews: 0,
      endorsementsReceived: receivedSnapshot.size,
      endorsementsGiven: givenSnapshot.size,
      nominationsReceived: 0,
      peerScore: studentData?.peerScore || 70,
      peerScoreTrend: 'stable',
      peerScoreChange: 0,
      networkSize: 0,
      rank: { position: 0, total: 0, percentile: 0 }
    }

    // Get nomination count and rank
    if (studentData?.college && studentData?.major) {
      const peersQuery = query(
        studentsRef,
        where('college', '==', studentData.college),
        where('major', '==', studentData.major),
        where('status', '==', 'active')
      )
      const peersSnapshot = await getDocs(peersQuery)
      const allScores = []
      let nominationsReceived = 0

      peersSnapshot.forEach(doc => {
        const data = doc.data()
        allScores.push({ id: doc.id, score: data.peerScore || 70 })
        // Count nominations where this student is nominated
        if (data.nominations) {
          data.nominations.forEach(nom => {
            if (nom.email === studentData.schoolEmail || nom.linkedinUrl === studentData.linkedinUrl) {
              nominationsReceived++
            }
          })
        }
      })

      allScores.sort((a, b) => b.score - a.score)
      const position = allScores.findIndex(s => s.id === studentId) + 1
      const total = allScores.length
      const percentile = total > 0 ? Math.round(((total - position) / total) * 100) : 0

      stats.networkSize = total - 1
      stats.nominationsReceived = nominationsReceived
      stats.rank = { position, total, percentile }
    }

    return NextResponse.json({ success: true, activity: activity.slice(0, maxResults), stats })
  } catch (error) {
    console.error('Activity fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
}
