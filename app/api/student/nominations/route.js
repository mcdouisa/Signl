import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    if (!db) {
      // Dev mode mock data
      return NextResponse.json({
        success: true,
        outgoing: [
          {
            name: 'Jordan Lee',
            email: 'jordan.lee@byu.edu',
            linkedinUrl: 'https://linkedin.com/in/jordanlee',
            major: 'Computer Science',
            projectContext: 'We worked together on a machine learning project for our CS 401 class.',
            skills: ['Python', 'Machine Learning', 'Teamwork'],
            reason: 'Jordan was instrumental in debugging our model and always showed up prepared.'
          },
          {
            name: 'Taylor Kim',
            email: 'taylor.kim@byu.edu',
            linkedinUrl: null,
            major: 'Information Systems',
            projectContext: 'Built a full-stack web app together for our senior capstone.',
            skills: ['React', 'Problem Solving', 'Leadership'],
            reason: 'Taylor led our team through a really tough sprint and kept morale high.'
          }
        ],
        incoming: [
          {
            nominatorName: 'Alex Johnson',
            nominatorEmail: 'alex.johnson@byu.edu',
            nominatorMajor: 'Computer Science',
            nominatorCollege: 'BYU',
            projectContext: 'We collaborated on a database design project last semester.',
            skills: ['SQL', 'System Design', 'Communication'],
            reason: 'They were the most organized person on our team and kept everyone on track.',
            nominatorId: 'mock-alex-id'
          },
          {
            nominatorName: 'Sam Rivera',
            nominatorEmail: 'sam.rivera@byu.edu',
            nominatorMajor: 'Computer Science',
            nominatorCollege: 'BYU',
            projectContext: 'Hackathon team — we built an app in 24 hours.',
            skills: ['React', 'Problem Solving', 'JavaScript'],
            reason: 'Incredibly fast coder and a great teammate under pressure.',
            nominatorId: 'mock-sam-id'
          }
        ]
      })
    }

    // Fetch the current student to get their email and linkedinUrl for matching
    const studentsRef = collection(db, 'students')
    const studentQuery = query(studentsRef, where('__name__', '==', studentId))
    const studentSnapshot = await getDocs(studentQuery)

    if (studentSnapshot.empty) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    let currentStudent = null
    studentSnapshot.forEach(doc => {
      currentStudent = { id: doc.id, ...doc.data() }
    })

    // Outgoing nominations: stored in the student's own document
    const outgoing = (currentStudent.nominations || []).map(nom => ({
      name: nom.name,
      email: nom.email || null,
      linkedinUrl: nom.linkedinUrl || null,
      major: nom.major || null,
      projectContext: nom.projectContext || null,
      skills: nom.skills || [],
      reason: nom.reason || null
    }))

    // Incoming nominations: scan all students for nominations matching this student
    // Include all registered students regardless of status so nominations from
    // newer or differently-statused accounts are not missed
    const allStudentsSnapshot = await getDocs(studentsRef)
    const incoming = []

    allStudentsSnapshot.forEach(doc => {
      if (doc.id === studentId) return // skip self
      const data = doc.data()
      if (!data.nominations) return

      data.nominations.forEach(nom => {
        const matchesEmail = nom.email && currentStudent.schoolEmail &&
          nom.email.toLowerCase() === currentStudent.schoolEmail.toLowerCase()
        const matchesLinkedIn = nom.linkedinUrl && currentStudent.linkedinUrl &&
          nom.linkedinUrl.toLowerCase() === currentStudent.linkedinUrl.toLowerCase()

        if (matchesEmail || matchesLinkedIn) {
          incoming.push({
            nominatorId: doc.id,
            nominatorName: `${data.firstName} ${data.lastName}`,
            nominatorEmail: data.schoolEmail,
            nominatorMajor: data.major || null,
            nominatorCollege: data.college || null,
            projectContext: nom.projectContext || null,
            skills: nom.skills || [],
            reason: nom.reason || null
          })
        }
      })
    })

    return NextResponse.json({ success: true, outgoing, incoming })
  } catch (error) {
    console.error('Nominations fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch nominations' }, { status: 500 })
  }
}
