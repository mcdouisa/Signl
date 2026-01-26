'use client'

import Link from 'next/link'

export default function Compare() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.png.png" alt="Signl Logo" className="h-10 object-contain hover:opacity-90 transition-opacity" />
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Signl Beats Free Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free recruiting platforms give you lots of applicants. Signl gives you quality candidates validated by their peers.
          </p>
        </div>

        {/* Main Comparison */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Header Row */}
            <div className="bg-gray-50 p-6">
              <h3 className="text-xl font-bold text-gray-900">What You Get</h3>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="text-xl font-bold text-gray-500">Free Tools (Handshake, LinkedIn)</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-teal-500 p-6">
              <h3 className="text-xl font-bold text-white">Signl</h3>
            </div>

            {/* Row 1: Volume vs Quality */}
            <div className="p-6">
              <div className="font-semibold text-gray-900 mb-2">Candidate Quality</div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>High volume, low signal</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Hundreds of applicants, most unqualified</p>
            </div>
            <div className="p-6 bg-blue-50">
              <div className="flex items-center text-blue-900 font-semibold">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Pre-validated by peers</span>
              </div>
              <p className="text-sm text-blue-700 mt-2">Only students their classmates vouch for</p>
            </div>

            {/* Row 2: Validation Method */}
            <div className="p-6">
              <div className="font-semibold text-gray-900 mb-2">Validation Method</div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Resumes & self-reported skills</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Easy to embellish, hard to verify</p>
            </div>
            <div className="p-6 bg-blue-50">
              <div className="flex items-center text-blue-900 font-semibold">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Peer nominations from group projects</span>
              </div>
              <p className="text-sm text-blue-700 mt-2">Real feedback from actual teamwork</p>
            </div>

            {/* Row 3: Time Investment */}
            <div className="p-6">
              <div className="font-semibold text-gray-900 mb-2">Time to Find Quality Hire</div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>30-40 hours per hire</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Screening hundreds of resumes manually</p>
            </div>
            <div className="p-6 bg-blue-50">
              <div className="flex items-center text-blue-900 font-semibold">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>5-10 hours per hire</span>
              </div>
              <p className="text-sm text-blue-700 mt-2">Pre-screened candidates, focus on interviews</p>
            </div>

            {/* Row 4: Team Fit Prediction */}
            <div className="p-6">
              <div className="font-semibold text-gray-900 mb-2">Team Fit Insight</div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>No collaboration data</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Can't tell if they work well with others</p>
            </div>
            <div className="p-6 bg-blue-50">
              <div className="flex items-center text-blue-900 font-semibold">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Validated teamwork skills</span>
              </div>
              <p className="text-sm text-blue-700 mt-2">See who their peers actually want to work with</p>
            </div>

            {/* Row 5: Early Turnover Risk */}
            <div className="p-6">
              <div className="font-semibold text-gray-900 mb-2">Early Turnover / Bad Hire Risk</div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>~40% within first year</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Resume doesn't show work ethic or reliability</p>
            </div>
            <div className="p-6 bg-blue-50">
              <div className="flex items-center text-blue-900 font-semibold">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Significantly reduced</span>
              </div>
              <p className="text-sm text-blue-700 mt-2">Peers flag reliability issues before you hire</p>
            </div>

            {/* Row 6: Cost */}
            <div className="p-6">
              <div className="font-semibold text-gray-900 mb-2">Annual Cost</div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free (basic tier)</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">But you get what you pay for</p>
            </div>
            <div className="p-6 bg-blue-50">
              <div className="flex items-center text-blue-900 font-semibold">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Flexible pricing for your team size</span>
              </div>
              <p className="text-sm text-blue-700 mt-2">Pay for quality, save on bad hire costs</p>
            </div>
          </div>
        </div>

        {/* The Real Cost Section */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">The Hidden Cost of "Free" Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">$50K+</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Cost per Bad Hire</div>
              <p className="text-gray-600 text-sm">Salary, training, and lost productivity before they quit or are let go</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">30-40hrs</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Wasted Per Hire</div>
              <p className="text-gray-600 text-sm">Screening hundreds of resumes to find one good candidate</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">40%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Fail in Year 1</div>
              <p className="text-gray-600 text-sm">New college hires who underperform or leave early</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Hire Smarter?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Stop wasting time on unqualified applicants. Start with peer-validated talent.
          </p>
          <Link href="/pricing" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 mr-4">
            View Pricing
          </Link>
          <Link href="/demo" className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
            Schedule a Demo
          </Link>
        </div>
      </div>
    </div>
  )
}
