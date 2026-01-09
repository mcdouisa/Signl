'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Logo placeholder - add your logo file here */}
            <img src="/logo.png" alt="Signl Logo" className="w-10 h-10 rounded-lg" onError={(e) => {
              // Fallback to letter logo if image not found
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }} />
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Signl</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#for-companies" className="text-gray-600 hover:text-gray-900 transition-colors">For Companies</a>
            <a href="#for-students" className="text-gray-600 hover:text-gray-900 transition-colors">For Students</a>
            <Link href="/students" className="text-gray-600 hover:text-gray-900 transition-colors">Student Profiles</Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">Admin</Link>
          </div>
          <Link href="/signin" className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Hire top talent{' '}
              <span className="text-gradient">validated by peers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Stop relying on resumes and GPAs. Connect with university students who their classmates actually want to work with—verified through peer validation and faculty oversight.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/verify" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Get Started as Student
              </Link>
              <a href="#for-companies" className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-gray-400 transition-all duration-300">
                For Companies
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/80 backdrop-blur rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">60%</div>
              <div className="text-gray-600">Based on Peer Validation</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-teal-600 mb-2">$36B</div>
              <div className="text-gray-600">College Recruiting Market</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">30+</div>
              <div className="text-gray-600">Hours Saved Per Hire</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Signl Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to connect companies with peer-validated talent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Students Nominate Peers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                University students anonymously nominate 3-5 classmates they'd actually want to work with—especially from group projects in their major.
              </p>
            </div>

            <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Faculty Verification
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Professors verify peer nomination lists to eliminate gaming and bias, ensuring authentic validation of student capabilities.
              </p>
            </div>

            <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Companies Hire Better
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Companies subscribe for monthly access to pre-vetted talent with quantified peer validation scores alongside traditional credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies */}
      <section id="for-companies" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                FOR COMPANIES
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Stop wasting time on the wrong candidates
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Traditional recruiting misses 40% of underperformers. Peer validation catches red flags that resumes can't.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Pre-Vetted Talent Pool</div>
                    <div className="text-gray-600">Access students who peers actually vouch for</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Save 30+ Hours Per Hire</div>
                    <div className="text-gray-600">Skip screening hundreds of unqualified applications</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Better Quality Hires</div>
                    <div className="text-gray-600">Reduce underperformance and early turnover</div>
                  </div>
                </li>
              </ul>
              <button className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Schedule a Demo
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl p-8 text-white">
              <div className="text-sm font-semibold mb-4">PRICING</div>
              <div className="text-4xl font-bold mb-2">$2K - $4K/month</div>
              <div className="text-blue-100 mb-8">Based on company size</div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Full access to peer-validated talent pool
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Unlimited student profiles
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Introduction facilitation
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Monthly talent updates
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Students */}
      <section id="for-students" className="py-20 px-6 bg-gradient-to-br from-blue-600 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get Found, Don't Get Lost
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Stop mass-applying to hundreds of jobs. Let your peers vouch for you and companies find you.
          </p>
          <Link href="/verify" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Join Signl Today
          </Link>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Recruiters
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're working with recruiters from leading companies to build the future of college hiring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-start mb-4">
                <svg className="w-12 h-12 text-blue-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 mb-2">University Relations, Major Financial Services Firm</div>
                  <p className="text-gray-600 italic mb-4">
                    "Peer referrals are our most successful hiring method. This platform captures that validation at scale, which is exactly what we need."
                  </p>
                  <p className="text-sm text-gray-500">
                    Recruiter feedback emphasized the importance of skills tagging and career interest filters for cross-functional hiring
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-start mb-4">
                <svg className="w-12 h-12 text-teal-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 mb-2">Tech Recruiting Professional</div>
                  <p className="text-gray-600 italic mb-4">
                    "Experience matters more than GPA in tech. Being able to see actual project work and peer validation from group projects is a game-changer."
                  </p>
                  <p className="text-sm text-gray-500">
                    Feedback helped us add portfolio links and focus survey questions on group project collaboration
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-700 font-semibold">Survey Responses Collected</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-teal-600 mb-2">15+</div>
                <div className="text-gray-700 font-semibold">Recruiter Conversations</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
                <div className="text-gray-700 font-semibold">Universities Launching Soon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-white">Signl</span>
          </div>
          <p className="mb-4">Peer-validated college recruiting platform</p>
          <div className="flex items-center justify-center space-x-6">
            <Link href="/survey" className="hover:text-white transition-colors">For Students</Link>
            <a href="#for-companies" className="hover:text-white transition-colors">For Companies</a>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-sm">© 2024 Signl. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
