'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DemoRequest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email && !formData.phone) {
      setError('Please provide either an email or phone number')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <nav className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between">
            <Link href="/">
              <img src="/logo.png.png" alt="Signl Logo" className="h-24 object-contain hover:opacity-90 transition-opacity" />
            </Link>
          </div>
        </nav>

        <div className="flex items-center justify-center px-6 py-20 relative">
          <div className="absolute inset-0">
            <div className="glow-orb" style={{
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '800px',
              height: '500px',
              background: 'radial-gradient(ellipse, rgba(52,211,153,0.15) 0%, rgba(96,165,250,0.08) 40%, transparent 70%)',
            }}></div>
          </div>

          <div className="max-w-md w-full glass-dark rounded-2xl p-10 text-center relative">
            <div className="w-20 h-20 border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">Request Received!</h2>
            <p className="text-gray-400 mb-8">
              Thanks for your interest in SIGNL. We'll be in touch within 24 hours to schedule your demo.
            </p>
            <Link href="/" className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.png.png" alt="Signl Logo" className="h-24 object-contain hover:opacity-90 transition-opacity" />
          </Link>
          <Link href="/for-companies" className="text-gray-500 hover:text-black transition-colors text-sm font-medium">
            &larr; Back
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center px-6 py-20 relative">
        <div className="absolute inset-0">
          <div className="glow-orb" style={{
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(96,165,250,0.15) 0%, rgba(52,211,153,0.1) 40%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            bottom: '-15%',
            right: '-5%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            top: '40%',
            left: '-8%',
            width: '450px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
          }}></div>
        </div>

        <div className="max-w-lg w-full relative">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Schedule a Demo
            </h1>
            <p className="text-gray-400">
              See how SIGNL can transform your current recruiting system
            </p>
          </div>

          <div className="glass-dark rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <p className="text-gray-500 text-xs -mt-2">* Please provide at least an email or phone number</p>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Company Name <span className="text-gray-600 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Acme Corp"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black px-6 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Request Demo'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
