'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CompanyLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Demo credentials check
      if (email === 'demo@signl.com' && password === 'signl2025') {
        const session = {
          company: {
            id: 'demo_company',
            name: 'Acme Corp',
            email: 'demo@signl.com',
            industry: 'Technology',
            size: '50-200',
            location: 'San Francisco, CA',
            verified: true,
            onboardingComplete: false,
          },
          token: 'demo_token',
          unreadMessages: 0,
          loginAt: new Date().toISOString(),
        }
        localStorage.setItem('signl_company_session', JSON.stringify(session))
        router.push('/company/dashboard')
        return
      }

      // Try Firebase auth (for real accounts)
      const res = await fetch('/api/company/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          localStorage.setItem('signl_company_session', JSON.stringify(data.session))
          router.push('/company/dashboard')
          return
        }
      }

      setError('Invalid credentials. Please try again or request a demo.')
      setPassword('')
    } catch (err) {
      setError('Invalid credentials. Please try again or request a demo.')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <img src="/logo.png.png" alt="Signl Logo" className="h-14 object-contain hover:opacity-90 transition-opacity" />
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">Company Sign In</h2>
          <p className="text-gray-400 text-center mb-8">Access peer-validated college talent</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="company@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400 mb-3">Don't have an account?</p>
            <Link href="/demo" className="text-teal-400 hover:underline font-semibold text-sm">
              Request a Demo
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/signin" className="text-sm text-gray-400 hover:text-white">
              &larr; Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
