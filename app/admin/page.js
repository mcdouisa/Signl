'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedResponse, setSelectedResponse] = useState(null)
  const [view, setView] = useState('overview') // 'overview' or 'responses'

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'signl2025') {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  // Fetch real students from Firebase after authentication
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchStudents = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/admin/students')
        const data = await res.json()
        if (data.success) {
          setStudents(data.students || [])
        } else {
          setError(data.error || 'Failed to load students')
        }
      } catch (err) {
        console.error('Error fetching students:', err)
        setError('Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Admin Access</h2>
          <p className="text-gray-600 text-center mb-6">Enter password to access dashboard</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Login
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading student data...</p>
        </div>
      </div>
    )
  }

  // Stats from real data
  const totalResponses = students.length
  const totalNominations = students.reduce((sum, s) => sum + (s.nominations?.length || 0), 0)
  const avgNominations = totalResponses > 0 ? (totalNominations / totalResponses).toFixed(1) : '0'

  // Count unique nominees across all students
  const allNominees = students.flatMap(s => (s.nominations || []).map(n => (n.email || n.name || '').toLowerCase()))
  const uniqueNominees = new Set(allNominees.filter(Boolean)).size

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
      d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src="/logo.png.png" alt="Signl Logo" className="h-14 object-contain hover:opacity-90 transition-opacity" />
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView('overview')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  view === 'overview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setView('responses')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  view === 'responses'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Responses
              </button>
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
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {view === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Total Responses</div>
                <div className="text-3xl font-bold text-blue-600">{totalResponses}</div>
                <div className="text-sm text-gray-500 mt-1">Registered students</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Total Nominations</div>
                <div className="text-3xl font-bold text-teal-600">{totalNominations}</div>
                <div className="text-sm text-gray-500 mt-1">Peer nominations</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Avg Nominations</div>
                <div className="text-3xl font-bold text-blue-600">{avgNominations}</div>
                <div className="text-sm text-gray-500 mt-1">Per student</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Unique Nominees</div>
                <div className="text-3xl font-bold text-teal-600">{uniqueNominees}</div>
                <div className="text-sm text-gray-500 mt-1">Different students</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => {
                  if (students.length === 0) return alert('No students to export')
                  const headers = 'Name,Email,College,Major,Grad Year,GPA,Nominations Given,Skills,LinkedIn,GitHub,Bio,Registered'
                  const csvContent = students.map(s => {
                    const name = `"${(s.name || '').replace(/"/g, '""')}"`
                    const email = s.schoolEmail || ''
                    const college = s.college || ''
                    const major = `"${(s.major || '').replace(/"/g, '""')}"`
                    const gradYear = s.gradYear || ''
                    const gpa = s.gpa || ''
                    const nominations = (s.nominations || []).length
                    const skills = `"${(s.skills || []).join(', ')}"`
                    const linkedin = s.linkedinUrl || ''
                    const github = s.githubUrl || ''
                    const bio = `"${(s.bio || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
                    const registered = s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''
                    return [name, email, college, major, gradYear, gpa, nominations, skills, linkedin, github, bio, registered].join(',')
                  }).join('\n')
                  const blob = new Blob([`${headers}\n${csvContent}`], { type: 'text/csv' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `signl-students-${new Date().toISOString().split('T')[0]}.csv`
                  a.click()
                  window.URL.revokeObjectURL(url)
                }} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left cursor-pointer">
                  <div className="font-semibold text-gray-900 mb-1">Export Data</div>
                  <div className="text-sm text-gray-600">Download all student data as CSV</div>
                </button>
                <button onClick={() => {
                  setView('responses')
                }} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left cursor-pointer">
                  <div className="font-semibold text-gray-900 mb-1">View All Responses</div>
                  <div className="text-sm text-gray-600">Browse detailed student profiles</div>
                </button>
              </div>
            </div>

            {/* Recent Responses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Responses</h2>
              {students.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p>No registered students yet</p>
                  <p className="text-sm mt-1">Students will appear here after completing registration</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {students.slice(0, 5).map((student) => (
                      <div key={student.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { setSelectedResponse(student); setView('responses') }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{student.name || 'Unnamed'}</div>
                            <div className="text-sm text-gray-600">
                              {student.college && `${student.college} • `}{student.major || 'Undeclared'} • {student.gradYear || 'TBD'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {formatDate(student.createdAt)}
                            </div>
                            <div className="text-sm font-semibold text-blue-600">
                              {(student.nominations || []).length} nominations
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {students.length > 5 && (
                    <button
                      onClick={() => setView('responses')}
                      className="mt-4 w-full py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View All {students.length} Responses →
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {view === 'responses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Response List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">All Responses ({students.length})</h2>
              {students.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No registered students yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedResponse(student)}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        selectedResponse?.id === student.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{student.name || 'Unnamed'}</div>
                      <div className="text-sm text-gray-600">{student.major || 'Undeclared'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(student.nominations || []).length} nominations • {formatDate(student.createdAt)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Response Detail */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              {selectedResponse ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedResponse.name || 'Unnamed'}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-gray-600 text-sm">
                      <span>{selectedResponse.schoolEmail}</span>
                      {selectedResponse.college && (
                        <>
                          <span>•</span>
                          <span>{selectedResponse.college}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{selectedResponse.major || 'Undeclared'}</span>
                      <span>•</span>
                      <span>{selectedResponse.gradYear || 'TBD'}</span>
                    </div>
                    {selectedResponse.gpa && (
                      <div className="text-sm text-gray-500 mt-1">GPA: {selectedResponse.gpa}</div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                      Registered: {formatDateTime(selectedResponse.createdAt)}
                    </div>

                    {/* Bio */}
                    {selectedResponse.bio && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Bio</div>
                        <p className="text-sm text-gray-700">{selectedResponse.bio}</p>
                      </div>
                    )}

                    {/* Skills */}
                    {selectedResponse.skills && selectedResponse.skills.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedResponse.skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-3 mt-3">
                      {selectedResponse.linkedinUrl && (
                        <a href={selectedResponse.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          LinkedIn ↗
                        </a>
                      )}
                      {selectedResponse.githubUrl && (
                        <a href={selectedResponse.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:underline">
                          GitHub ↗
                        </a>
                      )}
                      {selectedResponse.personalEmail && (
                        <span className="text-sm text-gray-500">Personal: {selectedResponse.personalEmail}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Nominations ({(selectedResponse.nominations || []).length})
                    </h3>
                    {(selectedResponse.nominations || []).length === 0 ? (
                      <div className="text-center py-6 text-gray-400 text-sm">
                        No nominations submitted
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(selectedResponse.nominations || []).map((nomination, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between mb-1">
                              <div className="font-semibold text-gray-900">{nomination.name}</div>
                              {nomination.major && (
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{nomination.major}</span>
                              )}
                            </div>
                            {nomination.email && (
                              <div className="text-sm text-gray-600 mb-1">{nomination.email}</div>
                            )}
                            {nomination.linkedinUrl && (
                              <a href={nomination.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mb-1 inline-block">
                                LinkedIn ↗
                              </a>
                            )}
                            {nomination.skills && nomination.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {nomination.skills.map((skill, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                            {nomination.projectContext && (
                              <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 mb-2">
                                <span className="text-xs font-semibold text-gray-500">Project Context: </span>
                                {nomination.projectContext}
                              </div>
                            )}
                            {nomination.reason && (
                              <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                                <span className="text-xs font-semibold text-gray-500">Reason: </span>
                                {nomination.reason}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Select a response to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
