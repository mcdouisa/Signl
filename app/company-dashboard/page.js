'use client'

import { useState } from 'react'
import Link from 'next/link'

const mockStudents = [
  { id: 1, name: 'Sarah Chen', major: 'Computer Science', gradYear: 'May 2025', careerInterests: 'Software Engineering, ML', peerScore: 95, nominationCount: 12, topSkills: ['Technical Skills', 'Problem Solving', 'Communication'], gpa: 3.85, status: 'Available' },
  { id: 2, name: 'Marcus Johnson', major: 'Information Systems', gradYear: 'Dec 2025', careerInterests: 'Product Management, BA', peerScore: 92, nominationCount: 10, topSkills: ['Leadership', 'Communication', 'Problem Solving'], gpa: 3.72, status: 'Available' },
  { id: 3, name: 'Emily Rodriguez', major: 'Computer Science', gradYear: 'May 2025', careerInterests: 'Full-Stack Dev, Cloud', peerScore: 89, nominationCount: 9, topSkills: ['Technical Skills', 'Creativity', 'Teamwork'], gpa: 3.91, status: 'Available' },
]

export default function CompanyDashboard() {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [requestedIntros, setRequestedIntros] = useState([])

  const requestIntro = (studentId) => {
    setRequestedIntros([...requestedIntros, studentId])
    alert('Introduction request sent! The student will be notified.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.png.png" alt="Signl Logo" className="h-10 object-contain hover:opacity-90 transition-opacity" />
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Acme Corp</span>
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Peer-Validated Talent</h1>
          <p className="text-gray-600">Browse top students validated by their classmates</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 mb-1">247</div>
            <div className="text-sm text-gray-600">Available Students</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">{requestedIntros.length}</div>
            <div className="text-sm text-gray-600">Introductions Requested</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-2xl font-bold text-teal-600 mb-1">3</div>
            <div className="text-sm text-gray-600">Scheduled Interviews</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
            <div className="text-sm text-gray-600">Hires Remaining</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filter Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>All Majors</option>
              <option>Computer Science</option>
              <option>Information Systems</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>All Graduation Dates</option>
              <option>May 2025</option>
              <option>December 2025</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>All Skills</option>
              <option>Technical Skills</option>
              <option>Leadership</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>All Career Interests</option>
              <option>Software Engineering</option>
              <option>Product Management</option>
            </select>
          </div>
        </div>

        {/* Student Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {mockStudents.map(student => (
              <div key={student.id} onClick={() => setSelectedStudent(student)} className={`bg-white rounded-xl p-6 shadow-sm cursor-pointer transition-all hover:shadow-lg ${selectedStudent?.id === student.id ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                    <p className="text-gray-600">{student.major} • {student.gradYear}</p>
                    <p className="text-sm text-gray-500 mt-1">{student.careerInterests}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{student.peerScore}</div>
                    <div className="text-xs text-gray-500">Peer Score</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {student.topSkills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">{skill}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">{student.nominationCount} peer nominations</span>
                  <span className="text-sm text-gray-600">GPA: {student.gpa}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              {selectedStudent ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedStudent.name}</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Peer Validation</div>
                      <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{selectedStudent.peerScore}</div>
                        <div className="text-sm text-gray-600">{selectedStudent.nominationCount} nominations</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-2">Top Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.topSkills.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Career Interests</div>
                      <p className="text-gray-900">{selectedStudent.careerInterests}</p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Academic</div>
                      <p className="text-gray-900">GPA: {selectedStudent.gpa}</p>
                      <p className="text-gray-600 text-sm">{selectedStudent.major}</p>
                    </div>
                  </div>

                  {requestedIntros.includes(selectedStudent.id) ? (
                    <button disabled className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
                      Introduction Requested ✓
                    </button>
                  ) : (
                    <button onClick={() => requestIntro(selectedStudent.id)} className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                      Request Introduction
                    </button>
                  )}
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
