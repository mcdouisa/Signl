'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { allSkills } from '../../../lib/collegeData'

export default function PeersPage() {
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [peers, setPeers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Endorsement modal state
  const [showModal, setShowModal] = useState(false)
  const [selectedPeer, setSelectedPeer] = useState(null)
  const [selectedSkills, setSelectedSkills] = useState([])
  const [endorsing, setEndorsing] = useState(false)
  const [endorseMessage, setEndorseMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const fetchData = async () => {
      const session = localStorage.getItem('signl_session')
      if (!session) {
        router.push('/student/login')
        return
      }

      try {
        const { student: studentData } = JSON.parse(session)
        setStudent(studentData)

        // Check if student has college and major set
        if (!studentData.college || !studentData.major) {
          setError('Please set your college and major in Settings before viewing peers.')
          setLoading(false)
          return
        }

        // Fetch peers
        const response = await fetch(
          `/api/student/peers?studentId=${studentData.id}&college=${encodeURIComponent(studentData.college)}&major=${encodeURIComponent(studentData.major)}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch peers')
        }

        setPeers(data.peers)
      } catch (err) {
        console.error('Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('signl_session')
    router.push('/student/login')
  }

  const openEndorseModal = (peer) => {
    setSelectedPeer(peer)
    setSelectedSkills([])
    setEndorseMessage({ type: '', text: '' })
    setShowModal(true)
  }

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill))
    } else if (selectedSkills.length < 3) {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const submitEndorsement = async () => {
    if (selectedSkills.length === 0) {
      setEndorseMessage({ type: 'error', text: 'Please select at least 1 skill' })
      return
    }

    setEndorsing(true)
    setEndorseMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/student/endorse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endorserId: student.id,
          recipientId: selectedPeer.id,
          skills: selectedSkills,
          college: student.college,
          major: student.major
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit endorsement')
      }

      // Update local state
      setPeers(peers.map(p =>
        p.id === selectedPeer.id ? { ...p, hasEndorsed: true } : p
      ))

      // Update student's endorsement count in session
      const session = JSON.parse(localStorage.getItem('signl_session'))
      session.student.endorsementsGiven = (session.student.endorsementsGiven || 0) + 1
      localStorage.setItem('signl_session', JSON.stringify(session))
      setStudent(session.student)

      setEndorseMessage({ type: 'success', text: `Successfully endorsed ${selectedPeer.firstName}!` })
      setTimeout(() => {
        setShowModal(false)
      }, 1500)
    } catch (err) {
      setEndorseMessage({ type: 'error', text: err.message })
    } finally {
      setEndorsing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading peers...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  const endorsementsRemaining = 5 - (student.endorsementsGiven || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png.png" alt="Signl Logo" className="w-10 h-10 rounded-lg object-contain" />
              <span className="text-2xl font-bold text-gray-900">Signl</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/student/settings" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Settings
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Peers</h1>
              <p className="text-gray-600 mt-1">
                {student.major} @ {student.college}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{endorsementsRemaining}</div>
              <div className="text-sm text-gray-500">endorsements left</div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Setup Required</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/student/settings"
              className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Go to Settings
            </Link>
          </div>
        )}

        {/* No Peers State */}
        {!error && peers.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Peers Yet</h2>
            <p className="text-gray-600">
              No other students have registered with {student.major} at {student.college} yet. Check back later!
            </p>
          </div>
        )}

        {/* Peers List */}
        {!error && peers.length > 0 && (
          <div className="space-y-4">
            {peers.map(peer => (
              <div key={peer.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {peer.firstName} {peer.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Graduation: {peer.gradYear || 'Not specified'}
                    </p>

                    {peer.skills && peer.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {peer.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {peer.bio && (
                      <p className="text-gray-600 mt-3 text-sm">{peer.bio}</p>
                    )}

                    {(peer.linkedinUrl || peer.githubUrl) && (
                      <div className="flex gap-4 mt-3">
                        {peer.linkedinUrl && (
                          <a
                            href={peer.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                        {peer.githubUrl && (
                          <a
                            href={peer.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    {peer.hasEndorsed ? (
                      <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Endorsed
                      </span>
                    ) : endorsementsRemaining > 0 ? (
                      <button
                        onClick={() => openEndorseModal(peer)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                      >
                        Endorse
                      </button>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-semibold text-sm">
                        No endorsements left
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Endorsement Modal */}
      {showModal && selectedPeer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Endorse {selectedPeer.firstName} {selectedPeer.lastName}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Select 1-3 skills to endorse. Your endorsement is weighted by your peer score.
            </p>

            <div className="space-y-2 mb-6">
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedSkills.includes(skill)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skill}</span>
                    {selectedSkills.includes(skill) && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Selected: {selectedSkills.length}/3 skills
            </p>

            {endorseMessage.text && (
              <div className={`p-3 rounded-lg mb-4 ${
                endorseMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {endorseMessage.text}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={endorsing}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitEndorsement}
                disabled={endorsing || selectedSkills.length === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {endorsing ? 'Submitting...' : 'Confirm Endorsement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
