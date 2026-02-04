'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { colleges, majorsByCollege, allSkills } from '../../../lib/collegeData'

function StudentSignupContent() {
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationError, setVerificationError] = useState('')
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Account Info
    firstName: '',
    lastName: '',
    schoolEmail: '',
    personalEmail: '',
    password: '',
    confirmPassword: '',
    gpa: '',
    resume: null,

    // Step 2: Profile Info
    college: '',
    major: '',
    gradYear: '',
    careerInterests: '',
    skills: [],
    linkedinUrl: '',
    githubUrl: '',
    bio: '',

    // Step 3: Nominations
    nominations: [
      { firstName: '', lastName: '', email: '', linkedinUrl: '', major: '', projectContext: '', skills: [], reason: '' }
    ]
  })

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [availableMajors, setAvailableMajors] = useState([])

  // Update available majors when college changes
  useEffect(() => {
    if (formData.college) {
      setAvailableMajors(majorsByCollege[formData.college] || [])
      // Reset major if switching colleges
      if (formData.major && !majorsByCollege[formData.college]?.includes(formData.major)) {
        setFormData(prev => ({ ...prev, major: '' }))
      }
    } else {
      setAvailableMajors([])
    }
  }, [formData.college])

  // Verify email token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token')
      const email = searchParams.get('email')

      // If no token/email, redirect to verify page
      if (!token || !email) {
        window.location.href = '/verify'
        return
      }

      try {
        const response = await fetch('/api/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, email }),
        })

        const data = await response.json()

        if (!response.ok) {
          setVerificationError(data.error || 'Invalid verification link')
          setIsVerifying(false)
          return
        }

        // Token is valid, pre-fill email and allow signup
        setVerifiedEmail(data.email)
        setFormData(prev => ({ ...prev, schoolEmail: data.email }))
        setIsVerifying(false)

      } catch (error) {
        console.error('Verification error:', error)
        setVerificationError('Failed to verify email. Please try again.')
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [searchParams])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const toggleSkill = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })
    } else if (formData.skills.length < 5) {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
    }
  }

  const handleNominationChange = (index, field, value) => {
    const newNominations = [...formData.nominations]
    newNominations[index][field] = value
    setFormData({ ...formData, nominations: newNominations })
  }

  const toggleNominationSkill = (index, skill) => {
    const newNominations = [...formData.nominations]
    const currentSkills = newNominations[index].skills || []
    
    if (currentSkills.includes(skill)) {
      newNominations[index].skills = currentSkills.filter(s => s !== skill)
    } else if (currentSkills.length < 3) {
      newNominations[index].skills = [...currentSkills, skill]
    }
    
    setFormData({ ...formData, nominations: newNominations })
  }

  const addNomination = () => {
    setFormData({
      ...formData,
      nominations: [...formData.nominations, { firstName: '', lastName: '', email: '', linkedinUrl: '', major: '', projectContext: '', skills: [], reason: '' }]
    })
  }

  const removeNomination = (index) => {
    // Prevent removing if only 1 nomination left (minimum 1 required)
    if (formData.nominations.length <= 1) {
      alert('At least one nomination is required')
      return
    }
    const newNominations = formData.nominations.filter((_, i) => i !== index)
    setFormData({ ...formData, nominations: newNominations })
  }

  const nextStep = () => {
    // Validation for each step
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match')
        return
      }
      if (formData.schoolEmail && !formData.schoolEmail.includes('@')) {
        alert('Please enter a valid email address')
        return
      }
    }
    if (step === 2) {
      // Validate LinkedIn URL is provided and looks like a LinkedIn URL
      if (!formData.linkedinUrl) {
        alert('LinkedIn Profile URL is required')
        return
      }
      // More permissive LinkedIn pattern - allows query params, locales, etc.
      const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+/i
      if (!linkedinPattern.test(formData.linkedinUrl)) {
        alert('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)')
        return
      }
    }
    if (step === 3) {
      // Validate at least 1 nomination exists
      if (formData.nominations.length === 0) {
        alert('At least one nomination is required')
        return
      }
      
      // Validate each nomination has required fields and either email or LinkedIn URL
      for (let i = 0; i < formData.nominations.length; i++) {
        const nom = formData.nominations[i]
        
        // Check required fields
        if (!nom.firstName || !nom.firstName.trim()) {
          alert(`Nomination #${i + 1}: First name is required`)
          return
        }
        if (!nom.lastName || !nom.lastName.trim()) {
          alert(`Nomination #${i + 1}: Last name is required`)
          return
        }
        if (!nom.projectContext || !nom.projectContext.trim()) {
          alert(`Nomination #${i + 1}: Project context is required`)
          return
        }
        if (!nom.reason || !nom.reason.trim()) {
          alert(`Nomination #${i + 1}: Reason is required`)
          return
        }
        if (!nom.skills || nom.skills.length === 0) {
          alert(`Nomination #${i + 1}: Please select at least 1 skill`)
          return
        }
        
        // Check that either email or LinkedIn URL is provided
        const hasEmail = nom.email && nom.email.trim() && nom.email.includes('@')
        const hasLinkedIn = nom.linkedinUrl && nom.linkedinUrl.trim() && /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+/i.test(nom.linkedinUrl)
        
        if (!hasEmail && !hasLinkedIn) {
          alert(`Nomination #${i + 1}: Please provide either an email address or LinkedIn profile URL for your peer`)
          return
        }
      }
    }
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setSubmitError('')

    try {
      // Register student via API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          schoolEmail: formData.schoolEmail,
          personalEmail: formData.personalEmail,
          password: formData.password,
          gpa: formData.gpa,
          college: formData.college,
          major: formData.major,
          gradYear: formData.gradYear,
          careerInterests: formData.careerInterests,
          skills: formData.skills,
          linkedinUrl: formData.linkedinUrl,
          githubUrl: formData.githubUrl,
          bio: formData.bio,
          nominations: formData.nominations.filter(n => n.firstName && n.firstName.trim())
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      console.log('Student account created:', data)
      setSubmitted(true)
    } catch (error) {
      console.error('Error creating account:', error)
      setSubmitError(error.message || 'There was an error creating your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state while verifying token
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="animate-spin w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
          <p className="text-gray-600">Please wait while we verify your verification link.</p>
        </div>
      </div>
    )
  }

  // Error state if verification failed
  if (verificationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
          <p className="text-lg text-gray-600 mb-8">{verificationError}</p>
          <Link href="/verify" className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Request New Link
          </Link>
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
            Your account has been created successfully. Check your email ({formData.schoolEmail}) for next steps.
          </p>
          <Link href="/student/login" className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const totalSteps = 4

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <nav className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.png.png" alt="Signl Logo" className="h-14 object-contain hover:opacity-90 transition-opacity" />
          </Link>
          <Link href="/signin" className="text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join Signl and connect with top companies</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Step {step} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full transition-all" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Account Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="schoolEmail"
                  value={formData.schoolEmail}
                  onChange={handleChange}
                  required
                  readOnly={!!verifiedEmail}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${verifiedEmail ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="your.email@example.com"
                />
                {verifiedEmail && (
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Email verified
                  </p>
                )}
                {!verifiedEmail && (
                  <p className="text-sm text-gray-500 mt-1">This will be your primary email for Signl</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Email (Optional)</label>
                <input type="email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="john@gmail.com" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GPA (Optional)</label>
                <input type="number" step="0.01" min="0" max="4.0" name="gpa" value={formData.gpa} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="3.75" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resume (Optional)</label>
                <input type="file" name="resume" onChange={handleChange} accept=".pdf,.doc,.docx" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX format</p>
              </div>

              <button type="button" onClick={nextStep} className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Profile Info */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">College/University *</label>
                  <select name="college" value={formData.college} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select your college</option>
                    {colleges.map(college => (
                      <option key={college} value={college}>{college}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Major *</label>
                  <select
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    required
                    disabled={!formData.college}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${!formData.college ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    <option value="">{formData.college ? 'Select your major' : 'Select college first'}</option>
                    {availableMajors.map(major => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Graduation *</label>
                <select name="gradYear" value={formData.gradYear} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select graduation date</option>
                  <option value="May 2026">May 2026</option>
                  <option value="August 2026">August 2026</option>
                  <option value="December 2026">December 2026</option>
                  <option value="May 2027">May 2027</option>
                  <option value="August 2027">August 2027</option>
                  <option value="December 2027">December 2027</option>
                  <option value="May 2028">May 2028</option>
                  <option value="August 2028">August 2028</option>
                  <option value="December 2028">December 2028</option>
                  <option value="May 2029">May 2029</option>
                  <option value="August 2029">August 2029</option>
                  <option value="December 2029">December 2029</option>
                  <option value="May 2030">May 2030</option>
                  <option value="August 2030">August 2030</option>
                  <option value="December 2030">December 2030</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Career Interests *</label>
                <input type="text" name="careerInterests" value={formData.careerInterests} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Software Engineering, Product Management..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Your Top Skills (up to 5) *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allSkills.map(skill => (
                    <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${formData.skills.includes(skill) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Selected: {formData.skills.length}/5 skills</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn Profile URL *</label>
                <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="https://linkedin.com/in/yourprofile" />
                <p className="text-sm text-gray-500 mt-1">Companies use this to learn more about you</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub / Portfolio URL (Optional)</label>
                <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="https://github.com/yourusername" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio (Optional)</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Tell companies about yourself..."></textarea>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={prevStep} className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300">Back</button>
                <button type="button" onClick={nextStep} className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Nominations */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Nominate Your Peers</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-900 font-semibold mb-2">📋 Focus on Group Projects</p>
                <p className="text-blue-800 text-sm">
                  Think about classmates you've worked with on <strong>group projects in your major</strong>. Who delivered quality work and you'd actually want to work with again?
                </p>
              </div>

              {formData.nominations.map((nomination, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 rounded-xl relative">
                  {formData.nominations.length > 1 && (
                    <button type="button" onClick={() => removeNomination(index)} className="absolute top-4 right-4 text-red-600 hover:text-red-800">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-4">Nomination #{index + 1} {index === 0 && <span className="text-red-500">*</span>}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={nomination.firstName} onChange={(e) => handleNominationChange(index, 'firstName', e.target.value)} placeholder="First Name *" required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                      <input type="text" value={nomination.lastName} onChange={(e) => handleNominationChange(index, 'lastName', e.target.value)} placeholder="Last Name *" required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-amber-800 text-sm font-medium mb-2">Provide at least one way to contact your peer:</p>
                      <div className="space-y-3">
                        <input type="email" value={nomination.email} onChange={(e) => handleNominationChange(index, 'email', e.target.value)} placeholder="Email address" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                        <div className="text-center text-gray-500 text-sm">— OR —</div>
                        <input type="url" value={nomination.linkedinUrl || ''} onChange={(e) => handleNominationChange(index, 'linkedinUrl', e.target.value)} placeholder="LinkedIn profile URL (e.g., https://linkedin.com/in/username)" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    
                    <input type="text" value={nomination.major} onChange={(e) => handleNominationChange(index, 'major', e.target.value)} placeholder="Major (optional)" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                    <input type="text" value={nomination.projectContext} onChange={(e) => handleNominationChange(index, 'projectContext', e.target.value)} placeholder="Which group project? *" required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select 1-3 key skills *</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {allSkills.map(skill => (
                          <button key={skill} type="button" onClick={() => toggleNominationSkill(index, skill)} className={`px-3 py-2 rounded-lg text-sm font-semibold ${(nomination.skills || []).includes(skill) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            {skill}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Selected: {(nomination.skills || []).length}/3</p>
                    </div>

                    <textarea value={nomination.reason} onChange={(e) => handleNominationChange(index, 'reason', e.target.value)} placeholder="Why would you work with them again? *" required rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg"></textarea>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addNomination} className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all">
                + Add Another Nomination
              </button>

              <div className="flex gap-4">
                <button type="button" onClick={prevStep} className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300">Back</button>
                <button type="button" onClick={nextStep} className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg">Continue</button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Information</h3>
                  <p className="text-gray-700"><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p className="text-gray-700"><strong>Email:</strong> {formData.schoolEmail}</p>
                  <p className="text-gray-700"><strong>College:</strong> {formData.college}</p>
                  <p className="text-gray-700"><strong>Major:</strong> {formData.major}</p>
                  <p className="text-gray-700"><strong>Graduation:</strong> {formData.gradYear}</p>
                  <p className="text-gray-700"><strong>LinkedIn:</strong> <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{formData.linkedinUrl}</a></p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Nominations ({formData.nominations.length})</h3>
                  {formData.nominations.map((nom, idx) => (
                    <p key={idx} className="text-gray-700">• {nom.firstName && nom.lastName ? `${nom.firstName} ${nom.lastName}` : nom.firstName || `Nomination ${idx + 1}`}</p>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Privacy & Consent</h3>
                <label className="flex items-start">
                  <input type="checkbox" required className="mt-1 mr-3" />
                  <span className="text-sm text-blue-800">
                    I consent to Signl sharing my profile with verified companies for recruiting purposes. I understand I can opt out at any time and companies can only contact me through my provided email.
                  </span>
                </label>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm font-medium">{submitError}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={prevStep} disabled={submitting} className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50">Back</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default function StudentSignup() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <StudentSignupContent />
    </Suspense>
  )
}
