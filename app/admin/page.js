'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [people, setPeople] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [view, setView] = useState('overview') // 'overview' or 'responses'
  const [filter, setFilter] = useState('all') // 'all', 'verified', 'unverified'
  const [copiedField, setCopiedField] = useState(null)

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'signl2025') {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  // Fetch data after authentication
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/admin/students')
        const data = await res.json()
        if (data.success) {
          setPeople(data.people || [])
          setStats(data.stats || null)
        } else {
          setError(data.error || 'Failed to load data')
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
          <p className="text-gray-600 font-medium">Loading data...</p>
        </div>
      </div>
    )
  }

  // Stats
  const totalPeople = stats?.totalPeople || people.length
  const verifiedCount = stats?.verifiedStudents || people.filter(p => p.verified).length
  const unverifiedCount = stats?.unverifiedNominees || people.filter(p => !p.verified).length
  const totalNominations = stats?.totalNominations || 0

  // Filtered list
  const filteredPeople = filter === 'all'
    ? people
    : filter === 'verified'
      ? people.filter(p => p.verified)
      : people.filter(p => !p.verified)

  // Format date helpers
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

  // Verified badge component
  const VerifiedBadge = ({ verified, size = 'sm' }) => {
    if (verified) {
      return (
        <span className={`inline-flex items-center gap-1 ${size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'} bg-green-50 text-green-700 font-semibold rounded-full`}>
          <svg className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
      )
    }
    return (
      <span className={`inline-flex items-center gap-1 ${size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'} bg-amber-50 text-amber-700 font-semibold rounded-full`}>
        <svg className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Nominated
      </span>
    )
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
                People
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
                <div className="text-sm font-semibold text-gray-600 mb-2">Total People</div>
                <div className="text-3xl font-bold text-blue-600">{totalPeople}</div>
                <div className="text-sm text-gray-500 mt-1">Students & nominees</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Verified Students</div>
                <div className="text-3xl font-bold text-green-600">{verifiedCount}</div>
                <div className="text-sm text-gray-500 mt-1">Registered accounts</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Unverified Nominees</div>
                <div className="text-3xl font-bold text-amber-600">{unverifiedCount}</div>
                <div className="text-sm text-gray-500 mt-1">Pending registration</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Total Nominations</div>
                <div className="text-3xl font-bold text-teal-600">{totalNominations}</div>
                <div className="text-sm text-gray-500 mt-1">Peer nominations made</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => {
                  if (people.length === 0) return alert('No data to export')
                  const headers = 'Name,Email,College,Major,Grad Year,GPA,Verified,Times Nominated,Skills,LinkedIn,GitHub,Bio,Registered'
                  const csvContent = people.map(p => {
                    const name = `"${(p.name || '').replace(/"/g, '""')}"`
                    const email = p.schoolEmail || ''
                    const college = p.college || ''
                    const major = `"${(p.major || '').replace(/"/g, '""')}"`
                    const gradYear = p.gradYear || ''
                    const gpa = p.gpa || ''
                    const verified = p.verified ? 'Yes' : 'No'
                    const timesNom = p.timesNominated || 0
                    const skills = `"${(p.skills || []).join(', ')}"`
                    const linkedin = p.linkedinUrl || ''
                    const github = p.githubUrl || ''
                    const bio = `"${(p.bio || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
                    const registered = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''
                    return [name, email, college, major, gradYear, gpa, verified, timesNom, skills, linkedin, github, bio, registered].join(',')
                  }).join('\n')
                  const blob = new Blob([`${headers}\n${csvContent}`], { type: 'text/csv' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `signl-people-${new Date().toISOString().split('T')[0]}.csv`
                  a.click()
                  window.URL.revokeObjectURL(url)
                }} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left cursor-pointer">
                  <div className="font-semibold text-gray-900 mb-1">Export Data</div>
                  <div className="text-sm text-gray-600">Download all data as CSV</div>
                </button>
                <button onClick={() => {
                  setView('responses')
                }} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left cursor-pointer">
                  <div className="font-semibold text-gray-900 mb-1">View All People</div>
                  <div className="text-sm text-gray-600">Browse profiles and nominations</div>
                </button>
              </div>
            </div>

            {/* Recent People */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent People</h2>
              {people.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p>No people yet</p>
                  <p className="text-sm mt-1">Students and nominees will appear here</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {people.slice(0, 8).map((person) => (
                      <div key={person.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { setSelectedPerson(person); setView('responses') }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{person.name || 'Unnamed'}</span>
                                <VerifiedBadge verified={person.verified} />
                              </div>
                              <div className="text-sm text-gray-600">
                                {person.major || 'Unknown'}{person.college ? ` - ${person.college}` : ''}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {person.verified && (
                              <div className="text-sm text-gray-600">
                                {formatDate(person.createdAt)}
                              </div>
                            )}
                            <div className="text-sm font-semibold text-blue-600">
                              Nominated {person.timesNominated || 0} time{(person.timesNominated || 0) !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {people.length > 8 && (
                    <button
                      onClick={() => setView('responses')}
                      className="mt-4 w-full py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View All {people.length} People →
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {view === 'responses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* People List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">All People ({filteredPeople.length})</h2>

              {/* Filter */}
              <div className="flex gap-1 mb-4">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'verified', label: 'Verified' },
                  { id: 'unverified', label: 'Nominated' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      filter === f.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredPeople.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No people found</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredPeople.map((person) => (
                    <button
                      key={person.id}
                      onClick={() => setSelectedPerson(person)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedPerson?.id === person.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : person.verified
                            ? 'border border-gray-200 hover:bg-gray-50'
                            : 'border border-dashed border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 text-sm">{person.name || 'Unnamed'}</span>
                        {person.verified ? (
                          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">{person.major || 'Unknown'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Nominated {person.timesNominated || 0} time{(person.timesNominated || 0) !== 1 ? 's' : ''}
                      </div>
                      {!person.verified && (person.schoolEmail || person.linkedinUrl) && (
                        <div className="text-xs text-blue-600 mt-1 truncate">
                          {person.schoolEmail || person.linkedinUrl}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Person Detail */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              {selectedPerson ? (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPerson.name || 'Unnamed'}</h2>
                      <VerifiedBadge verified={selectedPerson.verified} size="lg" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-gray-600 text-sm">
                      {selectedPerson.schoolEmail && (
                        <span>{selectedPerson.schoolEmail}</span>
                      )}
                      {selectedPerson.college && (
                        <>
                          <span>•</span>
                          <span>{selectedPerson.college}</span>
                        </>
                      )}
                      {selectedPerson.major && (
                        <>
                          <span>•</span>
                          <span>{selectedPerson.major}</span>
                        </>
                      )}
                      {selectedPerson.gradYear && (
                        <>
                          <span>•</span>
                          <span>{selectedPerson.gradYear}</span>
                        </>
                      )}
                    </div>

                    {selectedPerson.gpa && (
                      <div className="text-sm text-gray-500 mt-1">GPA: {selectedPerson.gpa}</div>
                    )}

                    {selectedPerson.verified && selectedPerson.createdAt && (
                      <div className="text-sm text-gray-500 mt-1">
                        Registered: {formatDateTime(selectedPerson.createdAt)}
                      </div>
                    )}

                    {/* Nomination count highlight */}
                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                      <span className="text-2xl font-bold text-blue-600">{selectedPerson.timesNominated || 0}</span>
                      <span className="text-sm text-blue-700 font-medium">
                        time{(selectedPerson.timesNominated || 0) !== 1 ? 's' : ''} nominated
                      </span>
                    </div>

                    {/* Contact Outreach - for unverified nominees */}
                    {!selectedPerson.verified && (selectedPerson.schoolEmail || selectedPerson.linkedinUrl) && (() => {
                      const firstName = selectedPerson.firstName || selectedPerson.name?.split(' ')[0] || 'there'
                      const nominatorNames = (selectedPerson.nominatedBy || []).map(n => n.byName).filter(Boolean)
                      const nominatedByText = nominatorNames.length > 0
                        ? nominatorNames.length === 1
                          ? nominatorNames[0]
                          : nominatorNames.slice(0, -1).join(', ') + ' and ' + nominatorNames[nominatorNames.length - 1]
                        : 'your peers'
                      const emailMessage = `Subject: You've been nominated by your peers on Signl\n\nHey ${firstName},\n\nGood news - ${nominatedByText} nominated you on Signl, a peer-validated recruiting platform we're building.\n\nWhat this means: Someone you worked with in a group project said they'd want to work with you again and vouched for your skills. We're connecting students like you with recruiters who want peer-validated talent, not just resumes.\n\nNext step: Claim your profile and opt in to be visible to recruiters. Takes 2 minutes:\n\n1. Verify your student email\n2. Add your LinkedIn/portfolio (optional)\n3. Choose whether you want companies to see you\n\nImportant: This is 100% opt-in. If you don't want to be visible to recruiters, just don't complete your profile. But if you're interested in opportunities, this is a way to get noticed based on what your peers actually think of your work.\n\nhttps://signl.cc/student/signup\n\nLet me know if you have questions!\n\nIsaac\nSignl`
                      const linkedinMessage = `Hey ${firstName}! Good news - ${nominatedByText} nominated you on Signl, a peer-validated recruiting platform we're building. Someone you worked with vouched for your skills, and we're connecting students like you with recruiters who want peer-validated talent. It's 100% opt-in and takes 2 min to claim your profile: signl.cc/student/signup`

                      return (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="text-sm font-semibold text-amber-800 mb-3">Outreach</div>

                          {/* Contact Info */}
                          <div className="space-y-2 mb-4">
                            {selectedPerson.schoolEmail && (
                              <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-200">
                                <div className="flex items-center gap-2 min-w-0">
                                  <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-sm text-gray-700 truncate">{selectedPerson.schoolEmail}</span>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(selectedPerson.schoolEmail, `email-${selectedPerson.id}`)}
                                  className="ml-2 px-3 py-1 text-xs font-semibold rounded-md transition-colors flex-shrink-0 bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  {copiedField === `email-${selectedPerson.id}` ? 'Copied!' : 'Copy'}
                                </button>
                              </div>
                            )}
                            {selectedPerson.linkedinUrl && (
                              <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-200">
                                <div className="flex items-center gap-2 min-w-0">
                                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                  </svg>
                                  <span className="text-sm text-gray-700 truncate">{selectedPerson.linkedinUrl}</span>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(selectedPerson.linkedinUrl, `linkedin-${selectedPerson.id}`)}
                                  className="ml-2 px-3 py-1 text-xs font-semibold rounded-md transition-colors flex-shrink-0 bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  {copiedField === `linkedin-${selectedPerson.id}` ? 'Copied!' : 'Copy'}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Pre-written Messages */}
                          {selectedPerson.schoolEmail && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-amber-700 uppercase">Email Message</span>
                                <button
                                  onClick={() => copyToClipboard(emailMessage, `msg-email-${selectedPerson.id}`)}
                                  className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                  {copiedField === `msg-email-${selectedPerson.id}` ? 'Copied!' : 'Copy Message'}
                                </button>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-amber-200 text-xs text-gray-600 whitespace-pre-line max-h-32 overflow-y-auto">
                                {emailMessage}
                              </div>
                            </div>
                          )}

                          {selectedPerson.linkedinUrl && (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-amber-700 uppercase">LinkedIn Message</span>
                                <button
                                  onClick={() => copyToClipboard(linkedinMessage, `msg-linkedin-${selectedPerson.id}`)}
                                  className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                  {copiedField === `msg-linkedin-${selectedPerson.id}` ? 'Copied!' : 'Copy Message'}
                                </button>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-amber-200 text-xs text-gray-600 whitespace-pre-line max-h-32 overflow-y-auto">
                                {linkedinMessage}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })()}

                    {/* Bio - verified students only */}
                    {selectedPerson.bio && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Bio</div>
                        <p className="text-sm text-gray-700">{selectedPerson.bio}</p>
                      </div>
                    )}

                    {/* Skills */}
                    {selectedPerson.skills && selectedPerson.skills.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedPerson.skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    {(selectedPerson.linkedinUrl || selectedPerson.githubUrl || selectedPerson.personalEmail) && (
                      <div className="flex gap-3 mt-3">
                        {selectedPerson.linkedinUrl && (
                          <a href={selectedPerson.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            LinkedIn ↗
                          </a>
                        )}
                        {selectedPerson.githubUrl && (
                          <a href={selectedPerson.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:underline">
                            GitHub ↗
                          </a>
                        )}
                        {selectedPerson.personalEmail && (
                          <span className="text-sm text-gray-500">Personal: {selectedPerson.personalEmail}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Nominated By Section */}
                  {(selectedPerson.nominatedBy || []).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Nominated By ({(selectedPerson.nominatedBy || []).length})
                      </h3>
                      <div className="space-y-3">
                        {(selectedPerson.nominatedBy || []).map((nom, index) => (
                          <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-gray-900 text-sm">{nom.byName}</div>
                              <span className="text-xs text-gray-500">{nom.byEmail}</span>
                            </div>
                            {nom.projectContext && (
                              <div className="text-sm text-gray-700 bg-white p-3 rounded border border-green-100 mb-2">
                                <span className="text-xs font-semibold text-gray-500">Project: </span>
                                {nom.projectContext}
                              </div>
                            )}
                            {nom.reason && (
                              <div className="text-sm text-gray-700 bg-white p-3 rounded border border-green-100 mb-2">
                                <span className="text-xs font-semibold text-gray-500">Reason: </span>
                                {nom.reason}
                              </div>
                            )}
                            {nom.skills && nom.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {nom.skills.map((skill, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nominations Given Section - only for verified students */}
                  {selectedPerson.verified && (selectedPerson.nominations || []).length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Nominations Given ({(selectedPerson.nominations || []).length})
                      </h3>
                      <div className="space-y-3">
                        {(selectedPerson.nominations || []).map((nomination, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between mb-1">
                              <div className="font-semibold text-gray-900 text-sm">
                                {nomination.firstName && nomination.lastName
                                  ? `${nomination.firstName} ${nomination.lastName}`
                                  : nomination.firstName || nomination.name || 'Unnamed'}
                              </div>
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
                                <span className="text-xs font-semibold text-gray-500">Project: </span>
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
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Select a person to view details</p>
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
