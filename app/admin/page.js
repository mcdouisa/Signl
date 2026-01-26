'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data - replace with real Firebase data
const mockResponses = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@byu.edu',
    major: 'Computer Science',
    gradYear: 'May 2026',
    submittedAt: '2025-01-08T10:30:00',
    nominations: [
      { name: 'Jane Smith', email: 'jane@byu.edu', major: 'CS', reason: 'Excellent team player, always delivers quality work' },
      { name: 'Bob Johnson', email: 'bob@byu.edu', major: 'CS', reason: 'Strong technical skills and great communicator' },
      { name: 'Alice Williams', email: 'alice@byu.edu', major: 'CS', reason: 'Very organized and helps others succeed' },
    ]
  },
  {
    id: 2,
    name: 'Sarah Miller',
    email: 'sarah.m@byu.edu',
    major: 'Business Analytics',
    gradYear: 'December 2026',
    submittedAt: '2025-01-08T11:45:00',
    nominations: [
      { name: 'Mike Davis', email: 'mike@byu.edu', major: 'BA', reason: 'Great at problem solving and data analysis' },
      { name: 'Lisa Chen', email: 'lisa@byu.edu', major: 'BA', reason: 'Incredibly detail-oriented and reliable' },
      { name: 'Tom Anderson', email: 'tom@byu.edu', major: 'BA', reason: 'Strong leadership and collaboration skills' },
    ]
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'mbrown@byu.edu',
    major: 'Mechanical Engineering',
    gradYear: 'May 2026',
    submittedAt: '2025-01-08T14:20:00',
    nominations: [
      { name: 'Emma Wilson', email: 'emma@byu.edu', major: 'ME', reason: 'Innovative thinker with excellent technical skills' },
      { name: 'David Lee', email: 'david@byu.edu', major: 'ME', reason: 'Very thorough and great at explaining concepts' },
      { name: 'Rachel Kim', email: 'rachel@byu.edu', major: 'ME', reason: 'Hard worker who always meets deadlines' },
      { name: 'Chris Martinez', email: 'chris@byu.edu', major: 'ME', reason: 'Positive attitude and helps team stay motivated' },
    ]
  },
]

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [selectedResponse, setSelectedResponse] = useState(null)
  const [view, setView] = useState('overview') // 'overview' or 'responses'

  const handleLogin = (e) => {
    e.preventDefault()
    // Simple password protection - replace with real auth
    if (password === 'signl2025') {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

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

  const totalResponses = mockResponses.length
  const totalNominations = mockResponses.reduce((sum, r) => sum + r.nominations.length, 0)
  const avgNominations = (totalNominations / totalResponses).toFixed(1)
  
  // Count unique nominees
  const allNominees = mockResponses.flatMap(r => r.nominations.map(n => n.name.toLowerCase()))
  const uniqueNominees = new Set(allNominees).size

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
        {view === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Total Responses</div>
                <div className="text-3xl font-bold text-blue-600">{totalResponses}</div>
                <div className="text-sm text-gray-500 mt-1">Survey submissions</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Total Nominations</div>
                <div className="text-3xl font-bold text-teal-600">{totalNominations}</div>
                <div className="text-sm text-gray-500 mt-1">Peer nominations</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Avg Nominations</div>
                <div className="text-3xl font-bold text-blue-600">{avgNominations}</div>
                <div className="text-sm text-gray-500 mt-1">Per response</div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => {
                  const csvContent = mockResponses.map(r => `${r.name},${r.email},${r.major},${r.gradYear},${r.nominations.length}`).join('\n')
                  const blob = new Blob([`Name,Email,Major,Graduation,Nominations\n${csvContent}`], { type: 'text/csv' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `signl-responses-${new Date().toISOString().split('T')[0]}.csv`
                  a.click()
                }} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left cursor-pointer">
                  <div className="font-semibold text-gray-900 mb-1">Export Data</div>
                  <div className="text-sm text-gray-600">Download all responses as CSV</div>
                </button>
                <button onClick={() => alert('Ranking algorithm running...\n\nCalculating peer scores:\n• Nominations (60%)\n• GPA (20%)\n• Skills (20%)\n\nDone!')} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left cursor-pointer">
                  <div className="font-semibold text-gray-900 mb-1">Calculate Rankings</div>
                  <div className="text-sm text-gray-600">Run peer validation algorithm</div>
                </button>
                <button onClick={() => alert('Sending opt-in emails to:\n\n• Jane Smith (8 nominations)\n• Bob Johnson (7 nominations)\n• Alice Williams (6 nominations)\n\nEmails sent!')} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left cursor-pointer">
                  <div className="font-semibold text-gray-900 mb-1">Send Opt-In Emails</div>
                  <div className="text-sm text-gray-600">Contact top nominees</div>
                </button>
              </div>
            </div>

            {/* Recent Responses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Responses</h2>
              <div className="space-y-3">
                {mockResponses.slice(0, 5).map((response) => (
                  <div key={response.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{response.name}</div>
                        <div className="text-sm text-gray-600">{response.major} • {response.gradYear}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm font-semibold text-blue-600">
                          {response.nominations.length} nominations
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setView('responses')}
                className="mt-4 w-full py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
              >
                View All Responses →
              </button>
            </div>
          </>
        )}

        {view === 'responses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Response List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">All Responses ({mockResponses.length})</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {mockResponses.map((response) => (
                  <button
                    key={response.id}
                    onClick={() => setSelectedResponse(response)}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      selectedResponse?.id === response.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{response.name}</div>
                    <div className="text-sm text-gray-600">{response.major}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {response.nominations.length} nominations
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Response Detail */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              {selectedResponse ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedResponse.name}</h2>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span>{selectedResponse.email}</span>
                      <span>•</span>
                      <span>{selectedResponse.major}</span>
                      <span>•</span>
                      <span>{selectedResponse.gradYear}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Submitted: {new Date(selectedResponse.submittedAt).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Nominations ({selectedResponse.nominations.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedResponse.nominations.map((nomination, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="font-semibold text-gray-900 mb-1">{nomination.name}</div>
                          {nomination.email && (
                            <div className="text-sm text-gray-600 mb-1">{nomination.email}</div>
                          )}
                          {nomination.major && (
                            <div className="text-sm text-gray-600 mb-2">{nomination.major}</div>
                          )}
                          <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                            {nomination.reason}
                          </div>
                        </div>
                      ))}
                    </div>
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
