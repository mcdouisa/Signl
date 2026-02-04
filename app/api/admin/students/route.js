import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Normalize LinkedIn URL for matching (strip protocol, www, trailing slashes)
function normalizeLinkedIn(url) {
  if (!url) return ''
  return url.trim().toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '')
}

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({
        success: true,
        people: [],
        message: 'Firebase not configured'
      })
    }

    // Fetch all registered students
    const studentsRef = collection(db, 'students')
    const querySnapshot = await getDocs(studentsRef)

    const registeredStudents = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      registeredStudents.push({ id: doc.id, ...data })
    })

    // Build lookup maps for matching nominees to registered students
    const emailMap = {}    // normalized email → student index
    const linkedinMap = {} // normalized linkedin → student index

    // Build unified people map - start with registered students
    const peopleMap = {}

    registeredStudents.forEach((data, idx) => {
      const id = data.id
      const email = (data.schoolEmail || '').trim().toLowerCase()
      const linkedin = normalizeLinkedIn(data.linkedinUrl)

      if (email) emailMap[email] = id
      if (linkedin) linkedinMap[linkedin] = id

      // Also map personal email
      const personalEmail = (data.personalEmail || '').trim().toLowerCase()
      if (personalEmail) emailMap[personalEmail] = id

      peopleMap[id] = {
        id,
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
        verified: true,
        timesNominated: 0,
        nominatedBy: [],
        nominations: (data.nominations || []).map(n => ({
          firstName: n.firstName || n.name || '',
          lastName: n.lastName || '',
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
      }
    })

    // Process all nominations to build nominee profiles and count
    registeredStudents.forEach((student) => {
      const nominatorName = `${student.firstName || ''} ${student.lastName || ''}`.trim()
      const nominatorEmail = (student.schoolEmail || '').trim().toLowerCase()

      const nominations = student.nominations || []
      nominations.forEach((nom) => {
        const nomEmail = (nom.email || '').trim().toLowerCase()
        const nomLinkedin = normalizeLinkedIn(nom.linkedinUrl)
        const nomFirstName = nom.firstName || nom.name || ''
        const nomLastName = nom.lastName || ''

        // Try to match to a registered student
        let matchedId = null
        if (nomEmail && emailMap[nomEmail]) {
          matchedId = emailMap[nomEmail]
        } else if (nomLinkedin && linkedinMap[nomLinkedin]) {
          matchedId = linkedinMap[nomLinkedin]
        }

        const nominationInfo = {
          byName: nominatorName,
          byEmail: nominatorEmail,
          projectContext: nom.projectContext || '',
          reason: nom.reason || '',
          skills: nom.skills || []
        }

        if (matchedId && peopleMap[matchedId]) {
          // Matched to registered student
          peopleMap[matchedId].timesNominated++
          peopleMap[matchedId].nominatedBy.push(nominationInfo)
        } else {
          // Unverified nominee - key by email or linkedin
          const key = nomEmail ? `email:${nomEmail}` : `linkedin:${nomLinkedin}`

          if (!key || key === 'email:' || key === 'linkedin:') return // skip if no identifier

          if (peopleMap[key]) {
            // Already seen this nominee - increment count, merge info
            peopleMap[key].timesNominated++
            peopleMap[key].nominatedBy.push(nominationInfo)
            // Update name if we have better info
            if (nomFirstName && !peopleMap[key].firstName) {
              peopleMap[key].firstName = nomFirstName
              peopleMap[key].lastName = nomLastName
              peopleMap[key].name = `${nomFirstName} ${nomLastName}`.trim()
            }
            // Merge skills
            if (nom.skills && nom.skills.length > 0) {
              const existingSkills = new Set(peopleMap[key].skills || [])
              nom.skills.forEach(s => existingSkills.add(s))
              peopleMap[key].skills = [...existingSkills]
            }
            // Update major if missing
            if (nom.major && !peopleMap[key].major) {
              peopleMap[key].major = nom.major
            }
          } else {
            // New unverified nominee
            peopleMap[key] = {
              id: key,
              firstName: nomFirstName,
              lastName: nomLastName,
              name: `${nomFirstName} ${nomLastName}`.trim(),
              schoolEmail: nomEmail || null,
              personalEmail: null,
              college: null,
              major: nom.major || null,
              gradYear: null,
              careerInterests: null,
              skills: nom.skills || [],
              linkedinUrl: nom.linkedinUrl || null,
              githubUrl: null,
              bio: null,
              gpa: null,
              peerScore: null,
              verified: false,
              timesNominated: 1,
              nominatedBy: [nominationInfo],
              nominations: [],
              status: 'nominated',
              createdAt: null,
              updatedAt: null
            }
          }
        }
      })
    })

    // Convert to array and sort: verified first (by createdAt desc), then unverified (by timesNominated desc)
    const people = Object.values(peopleMap).sort((a, b) => {
      // Verified first
      if (a.verified && !b.verified) return -1
      if (!a.verified && b.verified) return 1

      // Within same verified status
      if (a.verified && b.verified) {
        // Sort by createdAt descending
        if (!a.createdAt) return 1
        if (!b.createdAt) return -1
        return new Date(b.createdAt) - new Date(a.createdAt)
      }

      // Both unverified - sort by timesNominated descending
      return (b.timesNominated || 0) - (a.timesNominated || 0)
    })

    const verifiedCount = people.filter(p => p.verified).length
    const unverifiedCount = people.filter(p => !p.verified).length
    const totalNominations = registeredStudents.reduce((sum, s) => sum + (s.nominations || []).length, 0)

    return NextResponse.json({
      success: true,
      people,
      stats: {
        totalPeople: people.length,
        verifiedStudents: verifiedCount,
        unverifiedNominees: unverifiedCount,
        totalNominations
      }
    })

  } catch (error) {
    console.error('Error fetching admin data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
