import { NextResponse } from 'next/server'
import { demoStudents } from '../../../../lib/demoStudents'

export const dynamic = 'force-dynamic'

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

    let students = [...demoStudents]

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
