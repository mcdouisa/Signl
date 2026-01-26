'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function OptIn() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    nominationCount: 0
  })
  const [profileData, setProfileData] = useState({
    phone: '',
    linkedin: '',
    github: '',
    resume: null,
    gpa: '',
    bio: '',
    careerInterests: '',
    skills: [],
    availability: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  const allSkills = ['Problem Solving', 'Communication', 'Technical Skills', 'Leadership', 'Teamwork', 'Creativity', 'Reliability', 'Work Ethic', 'Attention to Detail']

  useEffect(() => {
    const token = searchParams.get('token')
    // TODO: Verify token and load student data
    // Mock data for now
    setTimeout(() => {
      setStudentData({
        name: 'Jane Smith',
        email: 'jane.smith@byu.edu',
        nominationCount: 8
      })
      setLoading(false)
    }, 1000)
  }, [searchParams])

  const toggleSkill = (skill) => {
    if (profileData.skills.includes(skill)) {
      setProfileData({ ...profileData, skills: profileData.skills.filter(s => s !== skill) })
    } else if (profileData.skills.length < 5) {
      setProfileData({ ...profileData, skills: [...profileData.skills, skill] })
    }
  }

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Save to Firebase
    console.log('Profile created:', profileData)
    setSubmitted(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your nomination...</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Signl!</h2>
          <p className="text-xl text-gray-600 mb-8">
            Your profile is now live. Companies will be able to discover you through peer validation, and we'll notify you when there's interest.
          </p>
          <Link href="/" className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Done
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <nav className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <img src="/logo.png.png" alt="Signl Logo" className="h-14 object-contain hover:opacity-90 transition-opacity" />
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Congratulations Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">🎉 Congratulations, {studentData.name}!</h1>
          <p className="text-xl text-blue-100 mb-2">
            You received <strong>{studentData.nominationCount} peer nominations</strong> from your classmates.
          </p>
          <p className="text-blue-100">
            This puts you in the top tier of students at BYU. Create your profile to connect with companies looking for talent like you.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Step {step} of 3</span>
            <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Contact Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email (verified)</label>
                <input type="email" value={studentData.email} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="(555) 123-4567" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL *</label>
                <input type="url" name="linkedin" value={profileData.linkedin} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="linkedin.com/in/yourname" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub/Portfolio URL (optional)</label>
                <input type="url" name="github" value={profileData.github} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="github.com/username" />
              </div>

              <button type="button" onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Academic & Skills */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Profile</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GPA *</label>
                <input type="number" step="0.01" min="0" max="4.0" name="gpa" value={profileData.gpa} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="3.75" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Career Interests *</label>
                <input type="text" name="careerInterests" value={profileData.careerInterests} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Software Engineering, Product Management..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select up to 5 of your top skills *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allSkills.map(skill => (
                    <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${profileData.skills.includes(skill) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Selected: {profileData.skills.length}/5 skills</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Short Bio (optional)</label>
                <textarea name="bio" value={profileData.bio} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Tell companies about yourself, your projects, and what you're passionate about..."></textarea>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300">Back</button>
                <button type="button" onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Availability</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">When are you available to start? *</label>
                <select name="availability" value={profileData.availability} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select timeframe</option>
                  <option value="Immediately">Immediately</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="Summer 2025">Summer 2025</option>
                  <option value="After graduation">After graduation</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">How Signl Works</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Your profile is visible to verified companies on our platform</li>
                  <li>• Companies can request introductions if they're interested</li>
                  <li>• You'll receive an email when a company wants to connect</li>
                  <li>• You control which opportunities you respond to</li>
                  <li>• Your information is never shared without your consent</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <label className="flex items-start">
                  <input type="checkbox" required className="mt-1 mr-3" />
                  <span className="text-sm text-gray-700">
                    I consent to Signl sharing my profile with verified companies for recruiting purposes. I understand I can opt out at any time.
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(2)} className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300">Back</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg">Create Profile</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
