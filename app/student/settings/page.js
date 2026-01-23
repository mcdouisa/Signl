'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { colleges, majorsByCollege, allSkills } from '../../../lib/collegeData'

export default function StudentSettings() {
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    bio: '',
    careerInterests: '',
    skills: [],
    college: '',
    major: '',
    gpa: ''
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' })
  const [availableMajors, setAvailableMajors] = useState([])

  // Update available majors when college changes
  useEffect(() => {
    if (profileForm.college && majorsByCollege[profileForm.college]) {
      setAvailableMajors(majorsByCollege[profileForm.college])
    } else {
      setAvailableMajors([])
    }
  }, [profileForm.college])

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })

  // Email change form state
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  })
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailMessage, setEmailMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const session = localStorage.getItem('signl_session')
    if (!session) {
      router.push('/student/login')
      return
    }

    try {
      const { student: studentData } = JSON.parse(session)
      setStudent(studentData)
      const studentCollege = studentData.college || ''
      setProfileForm({
        linkedinUrl: studentData.linkedinUrl || '',
        githubUrl: studentData.githubUrl || '',
        portfolioUrl: studentData.portfolioUrl || '',
        bio: studentData.bio || '',
        careerInterests: studentData.careerInterests || '',
        skills: studentData.skills || [],
        college: studentCollege,
        major: studentData.major || '',
        gpa: studentData.gpa || ''
      })
      // availableMajors will be set by the useEffect watching profileForm.college
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

  const handleCollegeChange = (newCollege) => {
    setProfileForm(prev => ({
      ...prev,
      college: newCollege,
      major: '' // Reset major when college changes
    }))
  }

  const toggleSkill = (skill) => {
    setProfileForm(prev => {
      if (prev.skills.includes(skill)) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) }
      } else if (prev.skills.length < 5) {
        return { ...prev, skills: [...prev.skills, skill] }
      }
      return prev
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          updates: profileForm
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // Update local session with new data
      const session = JSON.parse(localStorage.getItem('signl_session'))
      session.student = { ...session.student, ...profileForm }
      localStorage.setItem('signl_session', JSON.stringify(session))
      setStudent(session.student)

      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      setProfileMessage({ type: 'error', text: error.message })
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordSaving(true)
    setPasswordMessage({ type: '', text: '' })

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
      setPasswordSaving(false)
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' })
      setPasswordSaving(false)
      return
    }

    try {
      const response = await fetch('/api/student/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password')
      }

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' })
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.message })
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setEmailSaving(true)
    setEmailMessage({ type: '', text: '' })

    if (!emailForm.newEmail.includes('@')) {
      setEmailMessage({ type: 'error', text: 'Please enter a valid email address' })
      setEmailSaving(false)
      return
    }

    try {
      const response = await fetch('/api/student/request-email-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          newEmail: emailForm.newEmail,
          password: emailForm.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request email change')
      }

      setEmailForm({ newEmail: '', password: '' })
      setEmailMessage({ type: 'success', text: data.message })
    } catch (error) {
      setEmailMessage({ type: 'error', text: error.message })
    } finally {
      setEmailSaving(false)
    }
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
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png.png" alt="Signl Logo" className="w-10 h-10 rounded-lg object-contain" />
              <span className="text-2xl font-bold text-gray-900">Signl</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Dashboard
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

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Update your profile and security settings</p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={profileForm.linkedinUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={profileForm.githubUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Portfolio URL</label>
              <input
                type="url"
                value={profileForm.portfolioUrl}
                onChange={(e) => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">College/University</label>
                <select
                  value={profileForm.college}
                  onChange={(e) => handleCollegeChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your college</option>
                  {colleges.map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Major</label>
                {profileForm.major && profileForm.college && !availableMajors.includes(profileForm.major) && (
                  <p className="text-amber-600 text-sm mb-2">
                    Current: "{profileForm.major}" - Please select from standardized list below
                  </p>
                )}
                <select
                  value={availableMajors.includes(profileForm.major) ? profileForm.major : ''}
                  onChange={(e) => setProfileForm({ ...profileForm, major: e.target.value })}
                  disabled={!profileForm.college}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!profileForm.college ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">{profileForm.college ? 'Select your major' : 'Select college first'}</option>
                  {availableMajors.map(major => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">GPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={profileForm.gpa}
                onChange={(e) => setProfileForm({ ...profileForm, gpa: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="3.75"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Career Interests</label>
              <input
                type="text"
                value={profileForm.careerInterests}
                onChange={(e) => setProfileForm({ ...profileForm, careerInterests: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Software Engineering, Product Management..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Skills (up to 5)</label>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      profileForm.skills.includes(skill)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {profileMessage.text && (
              <div className={`p-4 rounded-lg ${profileMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {profileMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={profileSaving}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {profileSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {passwordMessage.text && (
              <div className={`p-4 rounded-lg ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {passwordMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={passwordSaving}
              className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Change Email */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Change Email</h2>
          <p className="text-gray-600 mb-6">
            Current email: <strong>{student.schoolEmail}</strong>
          </p>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Email Address</label>
              <input
                type="email"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="newemail@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm with Password</label>
              <input
                type="password"
                value={emailForm.password}
                onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your current password"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                A verification link will be sent to your new email address. You'll need to click the link to confirm the change. After confirming, you'll need to log in again with your new email.
              </p>
            </div>

            {emailMessage.text && (
              <div className={`p-4 rounded-lg ${emailMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {emailMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={emailSaving}
              className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {emailSaving ? 'Sending...' : 'Send Verification Email'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
