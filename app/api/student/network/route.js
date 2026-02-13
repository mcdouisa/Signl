import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const college = searchParams.get('college')
    const major = searchParams.get('major')

    if (!studentId || !college || !major) {
      return NextResponse.json({ error: 'Student ID, college, and major are required' }, { status: 400 })
    }

    if (!db) {
      // Mock network data for development
      return NextResponse.json({
        success: true,
        nodes: [
          { id: 'you', label: 'You', group: 'self', score: 85, size: 40 },
          { id: '1', label: 'Alex J.', group: 'endorsed', score: 78, size: 30 },
          { id: '2', label: 'Sarah W.', group: 'endorsed', score: 92, size: 35 },
          { id: '3', label: 'Mike R.', group: 'endorser', score: 88, size: 32 },
          { id: '4', label: 'Emily C.', group: 'peer', score: 75, size: 28 },
          { id: '5', label: 'David L.', group: 'endorser', score: 80, size: 30 },
          { id: '6', label: 'Lisa T.', group: 'peer', score: 71, size: 26 },
          { id: '7', label: 'James K.', group: 'nominated', score: 0, size: 22 },
          { id: '8', label: 'Anna P.', group: 'nominated', score: 0, size: 22 },
        ],
        edges: [
          { from: 'you', to: '1', type: 'endorsed', label: 'endorsed' },
          { from: 'you', to: '2', type: 'endorsed', label: 'endorsed' },
          { from: '3', to: 'you', type: 'endorser', label: 'endorsed you' },
          { from: '5', to: 'you', type: 'endorser', label: 'endorsed you' },
          { from: '1', to: '4', type: 'endorsed', label: 'endorsed' },
          { from: '3', to: '2', type: 'endorsed', label: 'endorsed' },
          { from: 'you', to: '7', type: 'nominated', label: 'nominated' },
          { from: 'you', to: '8', type: 'nominated', label: 'nominated' },
          { from: '4', to: '6', type: 'endorsed', label: 'endorsed' },
        ],
        stats: {
          totalConnections: 8,
          endorsementsGiven: 2,
          endorsementsReceived: 2,
          nominations: 2,
          networkDensity: 0.42
        }
      })
    }

    // Get all students in the same college/major
    const studentsRef = collection(db, 'students')
    const peersQuery = query(
      studentsRef,
      where('college', '==', college),
      where('major', '==', major),
      where('status', '==', 'active')
    )
    const peersSnapshot = await getDocs(peersQuery)

    const studentMap = {}
    peersSnapshot.forEach(doc => {
      const data = doc.data()
      studentMap[doc.id] = {
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        peerScore: data.peerScore || 70,
        nominations: data.nominations || []
      }
    })

    // Get all endorsements in this college/major
    const endorsementsRef = collection(db, 'endorsements')
    const endorsementsQuery = query(
      endorsementsRef,
      where('college', '==', college),
      where('major', '==', major)
    )
    const endorsementsSnapshot = await getDocs(endorsementsQuery)

    // Build nodes and edges
    const nodes = []
    const edges = []
    const connectedIds = new Set()

    // Add all endorsement edges
    endorsementsSnapshot.forEach(doc => {
      const data = doc.data()
      connectedIds.add(data.endorserId)
      connectedIds.add(data.recipientId)
      edges.push({
        from: data.endorserId === studentId ? 'you' : data.endorserId,
        to: data.recipientId === studentId ? 'you' : data.recipientId,
        type: data.endorserId === studentId ? 'endorsed' : data.recipientId === studentId ? 'endorser' : 'peer',
        label: `endorsed (${data.skills.join(', ')})`
      })
    })

    // Add nomination edges from the requesting student
    const currentStudent = studentMap[studentId]
    if (currentStudent?.nominations) {
      currentStudent.nominations.forEach((nom, idx) => {
        const nomId = `nom-${idx}`
        nodes.push({
          id: nomId,
          label: nom.name || 'Nominee',
          group: 'nominated',
          score: 0,
          size: 22
        })
        edges.push({
          from: 'you',
          to: nomId,
          type: 'nominated',
          label: 'nominated'
        })
      })
    }

    // Build nodes for connected students
    for (const [id, data] of Object.entries(studentMap)) {
      if (!connectedIds.has(id) && id !== studentId) continue

      let group = 'peer'
      if (id === studentId) {
        group = 'self'
      } else {
        const hasEndorsed = edges.some(e => (e.from === 'you' && e.to === id))
        const hasBeenEndorsedBy = edges.some(e => (e.to === 'you' && e.from === id))
        if (hasEndorsed) group = 'endorsed'
        else if (hasBeenEndorsedBy) group = 'endorser'
      }

      nodes.push({
        id: id === studentId ? 'you' : id,
        label: id === studentId ? 'You' : `${data.firstName} ${data.lastName.charAt(0)}.`,
        group,
        score: data.peerScore,
        size: id === studentId ? 40 : Math.max(22, Math.min(38, data.peerScore * 0.4))
      })
    }

    // Ensure 'you' node exists
    if (!nodes.find(n => n.id === 'you') && currentStudent) {
      nodes.unshift({
        id: 'you',
        label: 'You',
        group: 'self',
        score: currentStudent.peerScore,
        size: 40
      })
    }

    const endorsementsGiven = edges.filter(e => e.from === 'you' && e.type === 'endorsed').length
    const endorsementsReceived = edges.filter(e => e.to === 'you' && e.type === 'endorser').length
    const nominationEdges = edges.filter(e => e.type === 'nominated').length

    return NextResponse.json({
      success: true,
      nodes,
      edges,
      stats: {
        totalConnections: nodes.length - 1,
        endorsementsGiven,
        endorsementsReceived,
        nominations: nominationEdges,
        networkDensity: nodes.length > 1 ? Math.round((edges.length / (nodes.length * (nodes.length - 1) / 2)) * 100) / 100 : 0
      }
    })
  } catch (error) {
    console.error('Network fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch network data' }, { status: 500 })
  }
}
