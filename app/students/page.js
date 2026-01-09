'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock student data - shows what companies would see
const mockStudents = [
  {
    id: 1,
    name: 'Sarah Chen',
    major: 'Computer Science',
    gradYear: 'May 2025',
    careerInterests: 'Software Engineering, Machine Learning',
    githubUrl: 'https://github.com/sarahchen',
    peerScore: 95,
    nominationCount: 12,
    topSkills: ['Technical Skills', 'Problem Solving', 'Communication'],
    gpa: 3.85,
    peerFeedback: [
      'Consistently delivers high-quality code and helps debug team issues',
      'Great at explaining complex concepts and mentoring others',
      'Reliable team player who always meets deadlines'
    ]
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    major: 'Information Systems',
    gradYear: 'December 2025',
    careerInterests: 'Product Management, Business Analysis',
    portfolioUrl: 'https://marcusj.com',
    peerScore: 92,
    nominationCount: 10,
    topSkills: ['Leadership', 'Communication', 'Problem Solving'],
    gpa: 3.72,
    peerFeedback: [
      'Excellent at coordinating team efforts and keeping projects on track',
      'Strong analytical skills and creative problem-solver',
      'Very organized and professional in all interactions'
    ]
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    major: 'Computer Science',
    gradYear: 'May 2025',
    careerInterests: 'Full-Stack Development, Cloud Architecture',
    githubUrl: 'https://github.com/erodriguez',
    peerScore: 89,
    nominationCount: 9,
    topSkills: ['Technical Skills', 'Creativity', 'Teamwork'],
    gpa: 3.91,
    peerFeedback: [
      'Innovative thinker who brings creative solutions to technical challenges',
      'Great collaborator who helps others succeed',
      'Strong work ethic and attention to detail'
    ]
  },
  {
    id: 4,
    name: 'David Park',
    major: 'Business Analytics',
    gradYear: 'May 2026',
    careerInterests: 'Data Analysis, Business Intelligence',
    portfolioUrl: 'https://davidpark.io',
    peerScore: 88,
    nominationCount: 8,
    topSkills: ['Attention to Detail', 'Problem Solving', 'Communication'],
    gpa: 3.68,
    peerFeedback: [
      'Excellent at data visualization and presenting insights clearly',
      'Detail-oriented and catches errors others miss',
      'Positive attitude that motivates the entire team'
    ]
  },
  {
    id: 5,
    name: 'Jessica Liu',
    major: 'Computer Science',
    gradYear: 'August 2025',
    careerInterests: 'Software Engineering, DevOps',
    githubUrl: 'https://github.com/jliu',
    peerScore: 94,
    nominationCount: 11,
    topSkills: ['Technical Skills', 'Reliability', 'Work Ethic'],
    gpa: 3.79,
    peerFeedback: [
      'Always delivers on commitments and goes above and beyond',
      'Strong technical foundation and quick learner',
      'Great at automating processes and improving workflow'
    ]
  },
  {
    id: 6,
    name: 'Alex Thompson',
    major: 'Information Systems',
    gradYear: 'May 2025',
    careerInterests: 'Consulting, Project Management',
    portfolioUrl: 'https://alexthompson.com',
    peerScore: 87,
    nominationCount: 7,
    topSkills: ['Leadership', 'Teamwork', 'Communication'],
    gpa: 3.64,
    peerFeedback: [
      'Natural leader who brings out the best in team members',
      'Excellent communicator with clients and stakeholders',
      'Organized and keeps projects moving forward'
    ]
  },
]

export default function StudentsPreview() {
  const [selectedMajor, setSelectedMajor] = useState('All')
  const [selectedGradYear, setSelectedGradYear] = useState('All')
  const [selectedSkill, setSelectedSkill] = useState('All')
  const [selectedCareer, setSelectedCareer] = useState('All')
  const [selectedStudent, setSelectedStudent] = useState(null)

  const majors = ['All', ...new Set(mockStudents.map(s => s.major))]
  const gradYears = ['All', ...new Set(mockStudents.map(s => s.gradYear))]
  const skills = ['All', 'Technical Skills', 'Problem Solving', 'Communication', 'Leadership', 'Teamwork', 'Creativity']
  const careers = ['All', 'Software Engineering', 'Product Management', 'Data Analysis', 'Consulting']

  const filteredStudents = mockStudents.filter(student => {
    if (selectedMajor !== 'All' && student.major !== selectedMajor) return false
    if (selectedGradYear !== 'All' && student.gradYear !== selectedGradYear) return false
    if (selectedSkill !== 'All' && !student.topSkills.includes(selectedSkill)) return false
    if (selectedCareer !== 'All' && !student.careerInterests.includes(selectedCareer)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Signl</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Company Preview</span>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Peer-Validated Student Talent</h1>
          <p className="text-gray-600">Browse top students validated by their peers at BYU</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filter Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Major</label>
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {majors.map(major => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Graduation</label>
              <select
                value={selectedGradYear}
                onChange={(e) => setSelectedGradYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {gradYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Top Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Career Interest</label>
              <select
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {careers.map(career => (
                  <option key={career} value={career}>{career}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredStudents.length} of {mockStudents.length} students
          </div>
        </div>

        {/* Student Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`bg-white rounded-xl p-6 shadow-sm cursor-pointer transition-all hover:shadow-lg ${
                    selectedStudent?.id === student.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.major}</p>
                      <p className="text-sm text-gray-600">{student.gradYear}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{student.peerScore}</div>
                      <div className="text-xs text-gray-500">Peer Score</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-600 mb-2">Career Interests</div>
                    <p className="text-sm text-gray-700">{student.careerInterests}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {student.topSkills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      {student.nominationCount} peer nominations
                    </div>
                    <div className="text-xs text-gray-600">
                      GPA: {student.gpa}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Detail */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              {selectedStudent ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedStudent.name}</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Major</div>
                      <div className="text-gray-900">{selectedStudent.major}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Graduation</div>
                      <div className="text-gray-900">{selectedStudent.gradYear}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Career Interests</div>
                      <div className="text-gray-900">{selectedStudent.careerInterests}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Portfolio</div>
                      <a href={selectedStudent.githubUrl || selectedStudent.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        {selectedStudent.githubUrl || selectedStudent.portfolioUrl}
                      </a>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-600 mb-2">Top Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.topSkills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-600 mb-2">Peer Validation</div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{selectedStudent.peerScore}</div>
                      <div className="text-sm text-gray-600">{selectedStudent.nominationCount} nominations from peers</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-600 mb-2">Peer Feedback</div>
                    <div className="space-y-2">
                      {selectedStudent.peerFeedback.map((feedback, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                          "{feedback}"
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    Request Introduction
                  </button>
                </>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p>Select a student to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
