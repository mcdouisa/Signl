import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

// Mock students for development
const mockStudents = [
  {
    id: '1', name: 'Sarah Chen', major: 'Computer Science', gradYear: '2025', college: 'University of Utah',
    careerInterests: 'Software Engineering, Machine Learning', peerScore: 95, nominationCount: 12,
    topSkills: ['Technical Skills', 'Problem Solving', 'Communication'], gpa: 3.85,
    schoolVerified: true, credibilityScore: 92, nominationAuthentic: true, nominationFlagged: false,
    bio: 'Passionate about building tools that help people learn faster.',
    linkedinUrl: 'https://linkedin.com/in/sarahchen', githubUrl: 'https://github.com/sarahchen',
    peerFeedback: ['Consistently delivers high-quality code', 'Great at explaining complex concepts', 'Reliable team player'],
  },
  {
    id: '2', name: 'Marcus Johnson', major: 'Information Systems', gradYear: '2025', college: 'BYU',
    careerInterests: 'Product Management, Business Analysis', peerScore: 92, nominationCount: 10,
    topSkills: ['Leadership', 'Communication', 'Problem Solving'], gpa: 3.72,
    schoolVerified: true, credibilityScore: 88, nominationAuthentic: true, nominationFlagged: false,
    bio: 'Aspiring PM with a love for user research and data-driven decisions.',
    portfolioUrl: 'https://marcusj.com',
    peerFeedback: ['Excellent at coordinating team efforts', 'Strong analytical skills', 'Very organized and professional'],
  },
  {
    id: '3', name: 'Emily Rodriguez', major: 'Computer Science', gradYear: '2025', college: 'University of Utah',
    careerInterests: 'Full-Stack Development, Cloud Architecture', peerScore: 89, nominationCount: 9,
    topSkills: ['Technical Skills', 'Creativity', 'Teamwork'], gpa: 3.65,
    schoolVerified: true, credibilityScore: 85, nominationAuthentic: true, nominationFlagged: false,
    githubUrl: 'https://github.com/erodriguez',
    peerFeedback: ['Creative problem solver', 'Always willing to help teammates'],
  },
  {
    id: '4', name: 'James Park', major: 'Data Science', gradYear: '2026', college: 'Utah State',
    careerInterests: 'Data Engineering, Analytics', peerScore: 87, nominationCount: 8,
    topSkills: ['Analytics', 'Technical Skills', 'Problem Solving'], gpa: 3.9,
    schoolVerified: true, credibilityScore: 82, nominationAuthentic: true, nominationFlagged: false,
    linkedinUrl: 'https://linkedin.com/in/jamespark',
    peerFeedback: ['Incredible attention to detail', 'Makes complex data accessible'],
  },
  {
    id: '5', name: 'Aisha Williams', major: 'Business Administration', gradYear: '2026', college: 'University of Utah',
    careerInterests: 'Consulting, Strategy', peerScore: 85, nominationCount: 7,
    topSkills: ['Leadership', 'Communication', 'Analytics'], gpa: 3.78,
    schoolVerified: true, credibilityScore: 79, nominationAuthentic: true, nominationFlagged: false,
    linkedinUrl: 'https://linkedin.com/in/aishawilliams',
    peerFeedback: ['Natural leader', 'Great at synthesizing information'],
  },
  {
    id: '6', name: 'David Kim', major: 'Computer Science', gradYear: '2027', college: 'Weber State',
    careerInterests: 'Mobile Development, UI/UX', peerScore: 82, nominationCount: 6,
    topSkills: ['Design', 'Technical Skills', 'Creativity'], gpa: 3.55,
    schoolVerified: false, credibilityScore: 72, nominationAuthentic: true, nominationFlagged: false,
    githubUrl: 'https://github.com/dkim',
    peerFeedback: ['Eye for design and detail', 'Fast learner'],
  },
  {
    id: '7', name: 'Sofia Martinez', major: 'Finance', gradYear: '2025', college: 'BYU',
    careerInterests: 'Investment Banking, Financial Analysis', peerScore: 80, nominationCount: 5,
    topSkills: ['Analytics', 'Communication', 'Leadership'], gpa: 3.82,
    schoolVerified: true, credibilityScore: 76, nominationAuthentic: true, nominationFlagged: false,
    linkedinUrl: 'https://linkedin.com/in/sofiamartinez',
    peerFeedback: ['Excellent quantitative skills', 'Very professional'],
  },
  {
    id: '8', name: 'Tyler Brooks', major: 'Marketing', gradYear: '2026', college: 'University of Utah',
    careerInterests: 'Digital Marketing, Brand Strategy', peerScore: 78, nominationCount: 4,
    topSkills: ['Creativity', 'Communication', 'Writing'], gpa: 3.45,
    schoolVerified: true, credibilityScore: 68, nominationAuthentic: true, nominationFlagged: false,
    portfolioUrl: 'https://tylerbrooks.co',
    peerFeedback: ['Creative thinker', 'Strong writer'],
  },
  {
    id: '9', name: 'Rachel Kim', major: 'Engineering', gradYear: '2025', college: 'Utah State',
    careerInterests: 'Mechanical Engineering, Robotics', peerScore: 91, nominationCount: 11,
    topSkills: ['Technical Skills', 'Problem Solving', 'Teamwork'], gpa: 3.88,
    schoolVerified: true, credibilityScore: 90, nominationAuthentic: true, nominationFlagged: false,
    linkedinUrl: 'https://linkedin.com/in/rachelkim',
    peerFeedback: ['Brilliant engineer', 'Incredible work ethic', 'Great mentor'],
  },
  {
    id: '10', name: 'Alex Turner', major: 'Computer Science', gradYear: '2026', college: 'SUU',
    careerInterests: 'Cybersecurity, Backend Development', peerScore: 76, nominationCount: 3,
    topSkills: ['Technical Skills', 'Problem Solving', 'Analytics'], gpa: 3.6,
    schoolVerified: false, credibilityScore: 58, nominationAuthentic: true, nominationFlagged: true,
    githubUrl: 'https://github.com/alexturner',
    peerFeedback: ['Good at finding edge cases'],
  },
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const major = searchParams.get('major')
    const gradYear = searchParams.get('gradYear')
    const minGpa = searchParams.get('minGpa')
    const skills = searchParams.get('skills')
    const minNominations = searchParams.get('minNominations')
    const school = searchParams.get('school')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'peerScore'

    let students = []

    if (db) {
      // Fetch from Firebase
      const studentsRef = collection(db, 'students')
      const studentsQuery = query(studentsRef, where('status', '==', 'active'))
      const snapshot = await getDocs(studentsQuery)

      snapshot.forEach(doc => {
        const data = doc.data()
        students.push({
          id: doc.id,
          name: `${data.firstName} ${data.lastName}`,
          major: data.major || 'Undeclared',
          gradYear: data.gradYear || 'TBD',
          college: data.college || '',
          careerInterests: data.careerInterests || '',
          peerScore: data.peerScore || 70,
          nominationCount: data.nominationCount || 0,
          topSkills: data.skills || [],
          gpa: data.gpa || null,
          bio: data.bio || '',
          linkedinUrl: data.linkedinUrl || null,
          githubUrl: data.githubUrl || null,
          portfolioUrl: data.portfolioUrl || null,
          schoolVerified: data.schoolVerified || false,
          credibilityScore: data.credibilityScore || calculateCredibility(data),
          nominationAuthentic: data.nominationAuthentic !== false,
          nominationFlagged: data.nominationFlagged || false,
          peerFeedback: generatePeerFeedback(data.nominations || []),
        })
      })
    } else {
      students = [...mockStudents]
    }

    // Apply filters
    if (major && major !== 'All Majors') {
      students = students.filter(s => s.major.toLowerCase().includes(major.toLowerCase()))
    }
    if (gradYear && gradYear !== 'All Years') {
      students = students.filter(s => s.gradYear.includes(gradYear))
    }
    if (minGpa) {
      students = students.filter(s => s.gpa && s.gpa >= parseFloat(minGpa))
    }
    if (skills) {
      const skillList = skills.split(',').map(s => s.trim().toLowerCase())
      students = students.filter(s =>
        skillList.some(skill => (s.topSkills || []).some(ts => ts.toLowerCase().includes(skill)))
      )
    }
    if (minNominations) {
      students = students.filter(s => s.nominationCount >= parseInt(minNominations))
    }
    if (school) {
      students = students.filter(s => (s.college || '').toLowerCase().includes(school.toLowerCase()))
    }
    if (search) {
      const q = search.toLowerCase()
      students = students.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.major.toLowerCase().includes(q) ||
        (s.careerInterests || '').toLowerCase().includes(q) ||
        (s.topSkills || []).some(sk => sk.toLowerCase().includes(q)) ||
        (s.college || '').toLowerCase().includes(q)
      )
    }

    // Sort
    switch (sort) {
      case 'nominationCount':
        students.sort((a, b) => b.nominationCount - a.nominationCount)
        break
      case 'credibilityScore':
        students.sort((a, b) => (b.credibilityScore || 0) - (a.credibilityScore || 0))
        break
      case 'name':
        students.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        students.sort((a, b) => b.peerScore - a.peerScore)
    }

    return NextResponse.json({ success: true, students, count: students.length })
  } catch (error) {
    console.error('Talent search error:', error)
    return NextResponse.json({ error: 'Failed to search talent' }, { status: 500 })
  }
}

function calculateCredibility(student) {
  let score = 50
  if (student.nominationCount >= 5) score += 15
  else if (student.nominationCount >= 3) score += 10
  if (student.schoolVerified) score += 10
  if (student.peerScore >= 85) score += 10
  if (student.endorsementsReceived >= 3) score += 10
  return Math.min(score, 100)
}

function generatePeerFeedback(nominations) {
  if (!nominations || nominations.length === 0) return ['Recently joined - building peer validation']
  const feedback = nominations.filter(n => n.reason).map(n => n.reason).slice(0, 3)
  return feedback.length > 0 ? feedback : ['Peer-validated student']
}
