'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ForCompanies() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-white/5'
          : 'bg-white'
      }`}>
        <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-1'
        }`}>
          <Link href="/">
            <img
              src="/logo.png.png"
              alt="Signl Logo"
              className={`object-contain cursor-pointer hover:opacity-90 transition-all duration-500 ${
                scrolled ? 'h-10 rounded-md' : 'h-24'
              }`}
            />
          </Link>
          <Link href="/" className={`transition-all duration-500 text-sm font-medium ${
            scrolled ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
          }`}>
            &larr; Back
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-44 pb-16 px-6 relative">
        <div className="absolute inset-0">
          <div className="glow-orb" style={{
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(96,165,250,0.18) 0%, rgba(52,211,153,0.1) 40%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            top: '20%',
            right: '-8%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            top: '30%',
            left: '-8%',
            width: '450px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)',
          }}></div>
          <div className="absolute inset-0 grid-pattern opacity-40"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-medium">For Companies</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-white leading-[1.05]">
            Stop Wasting Time on<br />
            <span className="text-gradient-light">the Wrong Candidates</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Traditional recruiting misses 40% of underperformers. Peer validation catches red flags that resumes can't.
          </p>
          <Link href="/demo" className="inline-block bg-white text-black px-10 py-4 rounded-lg font-semibold text-base hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300">
            Schedule a Demo
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0">
          <div className="glow-orb" style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(96,165,250,0.1) 0%, rgba(52,211,153,0.06) 50%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            top: '20%',
            right: '-10%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 font-medium">Why SIGNL</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              Hire With Confidence
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Access pre-vetted college talent validated by the people who actually worked with them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-dark rounded-2xl p-10 text-center group hover:border-white/15 transition-all duration-500 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-emerald-400/30 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.1)] transition-all duration-500">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="font-bold text-xl text-white mb-3 font-serif">Pre-Vetted Talent</div>
                <div className="text-gray-500">Access students who peers actually vouch for</div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-10 text-center group hover:border-white/15 transition-all duration-500 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-teal-400/30 group-hover:shadow-[0_0_20px_rgba(94,234,212,0.1)] transition-all duration-500">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="font-bold text-xl text-white mb-3 font-serif">Save 30+ Hours</div>
                <div className="text-gray-500">Skip screening hundreds of unqualified applications</div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-10 text-center group hover:border-white/15 transition-all duration-500 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-green-400/30 group-hover:shadow-[0_0_20px_rgba(74,222,128,0.1)] transition-all duration-500">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="font-bold text-xl text-white mb-3 font-serif">Better Quality Hires</div>
                <div className="text-gray-500">Reduce underperformance and early turnover</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works for companies */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0">
          <div className="glow-orb" style={{
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(52,211,153,0.1) 0%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            bottom: '-15%',
            left: '-5%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 font-medium">The Process</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works for Companies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-dark rounded-2xl p-10 group hover:border-white/15 transition-all duration-500 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 border border-white/10 rounded-xl flex items-center justify-center text-xl font-serif font-bold mb-8 text-white group-hover:border-blue-400/40 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.15)] transition-all duration-500">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-serif">Browse Talent</h3>
                <p className="text-gray-400 leading-relaxed">
                  Search our database of peer-validated students filtered by university, major, skills, and validation score.
                </p>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-10 group hover:border-white/15 transition-all duration-500 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 border border-white/10 rounded-xl flex items-center justify-center text-xl font-serif font-bold mb-8 text-white group-hover:border-teal-400/40 group-hover:shadow-[0_0_15px_rgba(94,234,212,0.15)] transition-all duration-500">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-serif">Review Validations</h3>
                <p className="text-gray-400 leading-relaxed">
                  See real peer nominations and feedback from classmates who worked alongside each candidate.
                </p>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-10 group hover:border-white/15 transition-all duration-500 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 border border-white/10 rounded-xl flex items-center justify-center text-xl font-serif font-bold mb-8 text-white group-hover:border-emerald-400/40 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all duration-500">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-serif">Connect & Hire</h3>
                <p className="text-gray-400 leading-relaxed">
                  Reach out directly to top candidates with confidence, knowing they've been vetted by peers who know them best.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0">
          <div className="glow-orb" style={{
            bottom: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(96,165,250,0.12) 0%, rgba(52,211,153,0.06) 50%, transparent 70%)',
          }}></div>
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Hire Smarter?
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Schedule a demo to see how SIGNL can transform your college recruiting pipeline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/demo" className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-300">
              Schedule a Demo
            </Link>
            <a href="mailto:team@signl.cc" className="w-full sm:w-auto border border-white/20 text-white px-12 py-5 rounded-lg font-semibold text-lg hover:border-white/40 transition-all duration-300">
              Contact Us
            </a>
          </div>
          <p className="text-gray-600 mt-4 text-sm">Contact us to learn about pricing and get started</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/" className="flex justify-center mb-6">
            <img src="/logo.png.png" alt="Signl Logo" className="h-14 object-contain hover:opacity-90 transition-opacity" />
          </Link>
          <div className="flex items-center justify-center space-x-8 mb-10">
            <Link href="/for-students" className="text-gray-500 hover:text-black transition-colors text-sm">For Students</Link>
            <Link href="/for-companies" className="text-gray-500 hover:text-black transition-colors text-sm">For Companies</Link>
          </div>
          <p className="text-gray-400 text-xs">&copy; 2025 Signl. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
