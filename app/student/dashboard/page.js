'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function StudentDashboard() {
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for session
    const session = localStorage.getItem('signl_session')
    if (!session) {
      router.push('/student/login')
      return
    }

    try {
      const { student: studentData } = JSON.parse(session)
      setStudent(studentData)
    } catch (error) {
      console.error('Session error:', error)
      router.push('/student/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('signl_session')
    router.push('/student/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src="/logo.png.png" alt="Signl Logo" className="h-10 object-contain hover:opacity-90 transition-opacity" />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {student.firstName}!
              </span>
              <Link
                href="/student/peers"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Peers
              </Link>
              <Link
                href="/student/settings"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {student.firstName}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your profile and endorse your peers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-semibold text-gray-600 mb-1">College</div>
              <div className="text-gray-900">{student.college || 'Not specified'}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-semibold text-gray-600 mb-1">Major</div>
              <div className="text-gray-900">{student.major || 'Not specified'}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-semibold text-gray-600 mb-1">Graduation</div>
              <div className="text-gray-900">{student.gradYear || 'Not specified'}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-semibold text-gray-600 mb-1">Endorsements Given</div>
              <div className="text-gray-900">{student.endorsementsGiven || 0} / 5</div>
            </div>
          </div>
        </div>

        {/* Endorse Peers CTA */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Endorse Your Peers</h2>
              <p className="text-gray-600">
                Help your classmates stand out by endorsing their skills. You can endorse up to 5 peers from your college and major.
              </p>
            </div>
            <Link
              href="/student/peers"
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all whitespace-nowrap"
            >
              View Peers
            </Link>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Profile</h2>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">Email</div>
              <div className="text-gray-900">{student.schoolEmail}</div>
            </div>

            {student.careerInterests && (
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Career Interests</div>
                <div className="text-gray-900">{student.careerInterests}</div>
              </div>
            )}

            {student.skills && student.skills.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-2">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {student.bio && (
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Bio</div>
                <div className="text-gray-900">{student.bio}</div>
              </div>
            )}

            {student.githubUrl && (
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">GitHub/Portfolio</div>
                <a href={student.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {student.githubUrl}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-xl font-bold mb-4">Your Visibility Status</h2>
          <p className="text-blue-100 mb-6">
            Your profile is visible to verified companies. As peers nominate you, your peer score increases and you become more visible to recruiters.
          </p>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">Profile Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
