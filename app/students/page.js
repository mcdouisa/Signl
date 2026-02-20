'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StudentsPreview() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMajor, setSelectedMajor] = useState('All')
  const [selectedGradYear, setSelectedGradYear] = useState('All')
  const [selectedSkill, setSelectedSkill] = useState('All')
  const [selectedCareer, setSelectedCareer] = useState('All')
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('/api/students')
        const data = await res.json()
        if (data.success) {
          setStudents(data.students)
        } else {
          setError('Failed to load students')
        }
      } catch (err) {
        setError('Failed to load students')
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const allStudents = students

  const majors = ['All', ...new Set(allStudents.map(s => s.major))]
  const gradYears = ['All', ...new Set(allStudents.map(s => s.gradYear))]
  const skills = ['All', 'Technical Skills', 'Problem Solving', 'Communication', 'Leadership', 'Teamwork', 'Creativity']
  const careers = ['All', 'Software Engineering', 'Product Management', 'Data Analysis', 'Consulting']

  const filteredStudents = allStudents.filter(student => {
    if (selectedMajor !== 'All' && student.major !== selectedMajor) return false
    if (selectedGradYear !== 'All' && student.gradYear !== selectedGradYear) return false
    if (selectedSkill !== 'All' && !(student.topSkills || []).includes(selectedSkill)) return false
    if (selectedCareer !== 'All' && !(student.careerInterests || '').includes(selectedCareer)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src="/logo.png.png" alt="Signl Logo" className="h-14 object-contain hover:opacity-90 transition-opacity" />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Company Preview</span>
              <Link href="/" className="text-gray-400 hover:text-white">
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
          <h1 className="text-3xl font-bold text-white mb-2">Peer-Validated Student Talent</h1>
          <p className="text-gray-400">Browse top students validated by their peers</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading students...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6 mb-8">
              <h2 className="text-lg font-bold text-white mb-4">Filter Students</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Major</label>
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {majors.map(major => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Graduation</label>
                  <select
                    value={selectedGradYear}
                    onChange={(e) => setSelectedGradYear(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {gradYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Top Skill</label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {skills.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Career Interest</label>
                  <select
                    value={selectedCareer}
                    onChange={(e) => setSelectedCareer(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {careers.map(career => (
                      <option key={career} value={career}>{career}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                Showing {filteredStudents.length} of {allStudents.length} students
              </div>
            </div>

            {allStudents.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p>No verified students yet.</p>
              </div>
            ) : (
              /* Student Grid */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                          selectedStudent?.id === student.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-white">{student.name}</h3>
                            </div>
                            <p className="text-sm text-gray-400">{student.major}</p>
                            <p className="text-sm text-gray-400">{student.gradYear}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-400">{student.peerScore}</div>
                            <div className="text-xs text-gray-500">Peer Score</div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-xs font-semibold text-gray-400 mb-2">Career Interests</div>
                          <p className="text-sm text-gray-300">{student.careerInterests}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {(student.topSkills || []).map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="text-xs text-gray-400">
                            {student.nominationCount} peer nominations
                          </div>
                          {student.gpa && (
                            <div className="text-xs text-gray-400">
                              GPA: {student.gpa}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Detail */}
                <div className="lg:col-span-1">
                  <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6 sticky top-8">
                    {selectedStudent ? (
                      <>
                        <h3 className="text-xl font-bold text-white mb-4">{selectedStudent.name}</h3>

                        <div className="space-y-4 mb-6">
                          <div>
                            <div className="text-sm font-semibold text-gray-400 mb-1">Major</div>
                            <div className="text-white">{selectedStudent.major}</div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-400 mb-1">Graduation</div>
                            <div className="text-white">{selectedStudent.gradYear}</div>
                          </div>
                          {selectedStudent.careerInterests && (
                            <div>
                              <div className="text-sm font-semibold text-gray-400 mb-1">Career Interests</div>
                              <div className="text-white">{selectedStudent.careerInterests}</div>
                            </div>
                          )}
                          {selectedStudent.bio && (
                            <div>
                              <div className="text-sm font-semibold text-gray-400 mb-1">Bio</div>
                              <div className="text-gray-300 text-sm">{selectedStudent.bio}</div>
                            </div>
                          )}
                          {(selectedStudent.linkedinUrl || selectedStudent.githubUrl || selectedStudent.portfolioUrl) && (
                            <div>
                              <div className="text-sm font-semibold text-gray-400 mb-1">
                                {selectedStudent.linkedinUrl ? 'LinkedIn' : selectedStudent.githubUrl ? 'GitHub' : 'Portfolio'}
                              </div>
                              <a href={selectedStudent.linkedinUrl || selectedStudent.githubUrl || selectedStudent.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                                {selectedStudent.linkedinUrl || selectedStudent.githubUrl || selectedStudent.portfolioUrl}
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="mb-6">
                          <div className="text-sm font-semibold text-gray-400 mb-2">Top Skills</div>
                          <div className="flex flex-wrap gap-2">
                            {(selectedStudent.topSkills || []).map((skill) => (
                              <span key={skill} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full font-semibold">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6">
                          <div className="text-sm font-semibold text-gray-400 mb-2">Peer Validation</div>
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-3xl font-bold text-blue-400 mb-1">{selectedStudent.peerScore}</div>
                            <div className="text-sm text-gray-400">{selectedStudent.nominationCount} nominations from peers</div>
                          </div>
                        </div>

                        {selectedStudent.peerFeedback && selectedStudent.peerFeedback.length > 0 && (
                          <div className="mb-6">
                            <div className="text-sm font-semibold text-gray-400 mb-2">Peer Feedback</div>
                            <div className="space-y-2">
                              {selectedStudent.peerFeedback.map((feedback, i) => (
                                <div key={i} className="bg-white/5 rounded-lg p-3 text-sm text-gray-300">
                                  "{feedback}"
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

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
            )}
          </>
        )}
      </div>
    </div>
  )
}
