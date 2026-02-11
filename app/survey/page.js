'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Survey() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Respondent Info
    name: '',
    email: '',
    major: '',
    gradYear: '',
    
    // Nominations
    nominations: [
      { name: '', email: '', major: '', reason: '' },
      { name: '', email: '', major: '', reason: '' },
      { name: '', email: '', major: '', reason: '' },
    ]
  })

  const [submitted, setSubmitted] = useState(false)

  const totalSteps = 3

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNominationChange = (index, field, value) => {
    const newNominations = [...formData.nominations]
    newNominations[index][field] = value
    setFormData({ ...formData, nominations: newNominations })
  }

  const addNomination = () => {
    setFormData({
      ...formData,
      nominations: [...formData.nominations, { name: '', email: '', major: '', reason: '' }]
    })
  }

  const removeNomination = (index) => {
    const newNominations = formData.nominations.filter((_, i) => i !== index)
    setFormData({ ...formData, nominations: newNominations })
  }

  const nextStep = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Import Firebase functions
      const { db } = await import('../../lib/firebase')
      const { collection, addDoc } = await import('firebase/firestore')
      
      // Save to Firebase
      await addDoc(collection(db, 'responses'), {
        ...formData,
        submittedAt: new Date().toISOString()
      })
      
      console.log('Form submitted successfully to Firebase:', formData)
      setSubmitted(true)
    } catch (error) {
      console.error('Error saving to Firebase:', error)
      alert('There was an error submitting your survey. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
          <p className="text-xl text-gray-400 mb-8">
            Your survey has been submitted successfully. We'll review your nominations and reach out if you're selected for our platform.
          </p>
          <Link href="/" className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Student Survey</h1>
          <p className="text-gray-400">Help us identify top talent at your university</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-300">Step {step} of {totalSteps}</span>
            <span className="text-sm text-gray-400">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8">
          {/* Step 1: Your Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Your Information</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  University Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john.doe@byu.edu"
                />
                <p className="text-sm text-gray-500 mt-1">Must be a valid university email</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Major *
                </label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Expected Graduation *
                </label>
                <select
                  name="gradYear"
                  value={formData.gradYear}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select graduation date</option>
                  <option value="May 2025">May 2025</option>
                  <option value="August 2025">August 2025</option>
                  <option value="December 2025">December 2025</option>
                  <option value="May 2026">May 2026</option>
                  <option value="August 2026">August 2026</option>
                  <option value="December 2026">December 2026</option>
                  <option value="May 2027">May 2027</option>
                  <option value="August 2027">August 2027</option>
                </select>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Peer Nominations */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Nominate Your Peers</h2>
                <p className="text-gray-400 mb-6">
                  Nominate 3-5 classmates you'd actually want to work with—especially from group projects in your major.
                </p>
              </div>

              {formData.nominations.map((nomination, index) => (
                <div key={index} className="p-6 border-2 border-white/10 rounded-xl space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Nomination #{index + 1}</h3>
                    {formData.nominations.length > 3 && (
                      <button
                        type="button"
                        onClick={() => removeNomination(index)}
                        className="text-red-400 hover:text-red-300 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={nomination.name}
                      onChange={(e) => handleNominationChange(index, 'name', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Jane Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={nomination.email}
                      onChange={(e) => handleNominationChange(index, 'email', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="jane.smith@university.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Major (optional)
                    </label>
                    <input
                      type="text"
                      value={nomination.major}
                      onChange={(e) => handleNominationChange(index, 'major', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Business Analytics"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Why would you want to work with them? *
                    </label>
                    <textarea
                      value={nomination.reason}
                      onChange={(e) => handleNominationChange(index, 'reason', e.target.value)}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe their strengths, work ethic, and collaboration skills..."
                    />
                  </div>
                </div>
              ))}

              {formData.nominations.length < 5 && (
                <button
                  type="button"
                  onClick={addNomination}
                  className="w-full py-3 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors font-semibold"
                >
                  + Add Another Nomination
                </button>
              )}

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-white/10 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Review Your Submission</h2>

              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-white">Your Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="font-semibold">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="font-semibold">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Major:</span>
                    <p className="font-semibold">{formData.major}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Graduation:</span>
                    <p className="font-semibold">{formData.gradYear}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Your Nominations ({formData.nominations.length})</h3>
                <div className="space-y-3">
                  {formData.nominations.map((nom, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <p className="font-semibold text-white">{nom.name}</p>
                      {nom.email && <p className="text-sm text-gray-400">{nom.email}</p>}
                      {nom.major && <p className="text-sm text-gray-400">{nom.major}</p>}
                      <p className="text-sm text-gray-300 mt-2">{nom.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-200">
                    <p className="font-semibold mb-1">Privacy & Consent</p>
                    <p>By submitting this survey, you consent to Signl using your responses to build peer-validated talent rankings. Your nominations are anonymous and will be verified by faculty.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-white/10 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Submit Survey
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
