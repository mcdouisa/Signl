import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({
        success: true,
        students: [],
        message: 'Firebase not configured'
      })
    }

    // Fetch all students (no status filter - admin sees everything)
    const studentsRef = collection(db, 'students')
    const querySnapshot = await getDocs(studentsRef)

    const students = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      students.push({
        id: doc.id,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        schoolEmail: data.schoolEmail || '',
        personalEmail: data.personalEmail || null,
        college: data.college || null,
        major: data.major || 'Undeclared',
        gradYear: data.gradYear || 'TBD',
        careerInterests: data.careerInterests || '',
        skills: data.skills || [],
        linkedinUrl: data.linkedinUrl || null,
        githubUrl: data.githubUrl || null,
        bio: data.bio || '',
        gpa: data.gpa || null,
        peerScore: data.peerScore || 70,
        nominationCount: data.nominationCount || 0,
        endorsementsGiven: data.endorsementsGiven || 0,
        nominations: (data.nominations || []).map(n => ({
          name: n.name || '',
          email: n.email || '',
          linkedinUrl: n.linkedinUrl || '',
          major: n.major || '',
          projectContext: n.projectContext || '',
          skills: n.skills || [],
          reason: n.reason || ''
        })),
        status: data.status || 'active',
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null
      })
    })

    // Sort by most recently created first
    students.sort((a, b) => {
      if (!a.createdAt) return 1
      if (!b.createdAt) return -1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return NextResponse.json({
      success: true,
      students,
      count: students.length
    })

  } catch (error) {
    console.error('Error fetching admin students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}
