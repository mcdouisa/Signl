'use client'

import Link from 'next/link'

export default function SignIn() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <img src="/logo.png.png" alt="Signl Logo" className="h-14 object-contain hover:opacity-90 transition-opacity" />
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to Signl
            </h1>
            <p className="text-xl text-gray-400">
              Choose how you'd like to sign in
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Sign In */}
            <Link href="/student/login" className="group">
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 transition-all duration-300 hover:border-blue-400/50 cursor-pointer">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500 transition-colors">
                  <svg className="w-8 h-8 text-blue-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-4">
                  I'm a Student
                </h2>
                <p className="text-gray-400 text-center mb-6">
                  Create your profile, nominate peers, and connect with companies looking for talent like you.
                </p>
                <div className="text-center">
                  <span className="text-blue-400 font-semibold group-hover:underline">
                    Sign In or Create Account →
                  </span>
                </div>
              </div>
            </Link>

            {/* Company Sign In */}
            <Link href="/company/login" className="group">
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 transition-all duration-300 hover:border-teal-400/50 cursor-pointer">
                <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-500 transition-colors">
                  <svg className="w-8 h-8 text-teal-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-4">
                  I'm a Company
                </h2>
                <p className="text-gray-400 text-center mb-6">
                  Access peer-validated college talent and streamline your campus recruiting process.
                </p>
                <div className="text-center">
                  <span className="text-teal-400 font-semibold group-hover:underline">
                    Sign In to Dashboard →
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">New to Signl?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/student/signup" className="text-blue-400 hover:underline font-semibold">
                Create Student Account
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/demo" className="text-teal-400 hover:underline font-semibold">
                Request Company Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
