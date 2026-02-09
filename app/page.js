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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.png.png" alt="Signl Logo" className="h-14 object-contain cursor-pointer hover:opacity-90 transition-opacity" />
          </Link>
          <div className="hidden md:flex items-center space-x-10">
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm tracking-wide">How It Works</a>
            <a href="#for-companies" className="text-gray-400 hover:text-white transition-colors text-sm tracking-wide">For Companies</a>
            <a href="#for-students" className="text-gray-400 hover:text-white transition-colors text-sm tracking-wide">For Students</a>
          </div>
          <Link href="/signin" className="border border-white/20 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-white hover:text-black transition-all duration-300">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 relative overflow-hidden">
        {/* Futuristic light effects */}
        <div className="absolute inset-0">
          {/* Main bright orb - top center */}
          <div className="glow-orb animate-pulse-slow" style={{
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(96,165,250,0.25) 0%, rgba(59,130,246,0.1) 40%, transparent 70%)',
          }}></div>
          {/* Secondary teal orb - right */}
          <div className="glow-orb animate-pulse-slower" style={{
            top: '20%',
            right: '-5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(94,234,212,0.15) 0%, transparent 70%)',
          }}></div>
          {/* Accent orb - left */}
          <div className="glow-orb animate-pulse-slower" style={{
            top: '30%',
            left: '-8%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 70%)',
          }}></div>
          {/* Bright spotlight beam effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[300px] bg-gradient-to-b from-white/20 via-blue-400/10 to-transparent"></div>
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 grid-pattern opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-medium">Peer-Validated Recruiting</p>
            <h1 className="font-serif text-6xl md:text-8xl font-bold text-white mb-8 leading-[1.05] tracking-tight">
              Connecting Talent<br />
              <span className="text-gradient-light">with Opportunity</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
              Stop relying on resumes and GPAs. Connect with university students who their classmates actually want to work with — verified through peer validation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/student/signup" className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-lg font-semibold text-base hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300">
                Get Started as Student
              </Link>
              <a href="#for-companies" className="w-full sm:w-auto border border-white/20 text-white px-10 py-4 rounded-lg font-semibold text-base hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300">
                For Companies
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto">
            <div className="text-center p-8 glass-dark rounded-2xl border-glow">
              <div className="text-5xl font-bold text-white mb-2 font-serif">60%</div>
              <div className="text-gray-500 text-sm tracking-wide">Based on Peer Validation</div>
            </div>
            <div className="text-center p-8 glass-dark rounded-2xl border-glow">
              <div className="text-5xl font-bold text-white mb-2 font-serif">$36B</div>
              <div className="text-gray-500 text-sm tracking-wide">College Recruiting Market</div>
            </div>
            <div className="text-center p-8 glass-dark rounded-2xl border-glow">
              <div className="text-5xl font-bold text-white mb-2 font-serif">30+</div>
              <div className="text-gray-500 text-sm tracking-wide">Hours Saved Per Hire</div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-white/5"></div>
      </div>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 px-6 relative">
        {/* Subtle ambient light */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="glow-orb animate-pulse-slower" style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(96,165,250,0.06) 0%, transparent 70%)',
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 font-medium">The Process</p>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
              How Signl Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Three simple steps to connect companies with peer-validated talent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 glass-dark rounded-2xl hover:border-white/15 transition-all duration-500 group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 border border-white/10 rounded-xl flex items-center justify-center text-xl font-serif font-bold mb-8 text-white group-hover:border-blue-400/40 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.15)] transition-all duration-500">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                  Students Nominate Peers
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  University students nominate 3-5 classmates they'd actually want to work with — especially from group projects in their major.
                </p>
              </div>
            </div>

            <div className="p-10 glass-dark rounded-2xl hover:border-white/15 transition-all duration-500 group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 border border-white/10 rounded-xl flex items-center justify-center text-xl font-serif font-bold mb-8 text-white group-hover:border-teal-400/40 group-hover:shadow-[0_0_15px_rgba(94,234,212,0.15)] transition-all duration-500">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                  Peer Verification
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Nomination patterns are analyzed to eliminate gaming and bias, ensuring authentic validation of student capabilities.
                </p>
              </div>
            </div>

            <div className="p-10 glass-dark rounded-2xl hover:border-white/15 transition-all duration-500 group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 border border-white/10 rounded-xl flex items-center justify-center text-xl font-serif font-bold mb-8 text-white group-hover:border-blue-400/40 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.15)] transition-all duration-500">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                  Companies Hire Better
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Companies access pre-vetted talent with quantified peer validation scores alongside traditional credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-white/5"></div>
      </div>

      {/* For Companies */}
      <section id="for-companies" className="py-28 px-6 relative">
        {/* Light accent */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="glow-orb" style={{
            bottom: '-20%',
            right: '10%',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(94,234,212,0.08) 0%, transparent 70%)',
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 font-medium">For Companies</p>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
              Stop wasting time on<br />the wrong candidates
            </h2>
            <p className="text-lg text-gray-400 mb-16 max-w-3xl mx-auto">
              Traditional recruiting misses 40% of underperformers. Peer validation catches red flags that resumes can't.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="glass-dark rounded-2xl p-10 text-center group hover:border-white/15 transition-all duration-500">
              <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-blue-400/30 group-hover:shadow-[0_0_20px_rgba(96,165,250,0.1)] transition-all duration-500">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="font-bold text-xl text-white mb-3 font-serif">Pre-Vetted Talent</div>
              <div className="text-gray-500">Access students who peers actually vouch for</div>
            </div>

            <div className="glass-dark rounded-2xl p-10 text-center group hover:border-white/15 transition-all duration-500">
              <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-teal-400/30 group-hover:shadow-[0_0_20px_rgba(94,234,212,0.1)] transition-all duration-500">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="font-bold text-xl text-white mb-3 font-serif">Save 30+ Hours</div>
              <div className="text-gray-500">Skip screening hundreds of unqualified applications</div>
            </div>

            <div className="glass-dark rounded-2xl p-10 text-center group hover:border-white/15 transition-all duration-500">
              <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-blue-400/30 group-hover:shadow-[0_0_20px_rgba(96,165,250,0.1)] transition-all duration-500">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="font-bold text-xl text-white mb-3 font-serif">Better Quality Hires</div>
              <div className="text-gray-500">Reduce underperformance and early turnover</div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/demo" className="inline-block bg-white text-black px-12 py-5 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-300">
              Schedule a Demo
            </Link>
            <p className="text-gray-600 mt-4 text-sm">Contact us to learn about pricing and get started</p>
          </div>
        </div>
      </section>

      {/* For Students */}
      <section id="for-students" className="py-28 px-6 relative overflow-hidden">
        {/* Dramatic light burst */}
        <div className="absolute inset-0">
          <div className="glow-orb animate-pulse-slow" style={{
            bottom: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(94,234,212,0.15) 0%, rgba(96,165,250,0.08) 40%, transparent 70%)',
          }}></div>
          {/* Light rays */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-[200px] bg-gradient-to-t from-teal-400/20 to-transparent"></div>
          <div className="absolute bottom-0 left-[calc(50%-60px)] w-[1px] h-[150px] bg-gradient-to-t from-blue-400/10 to-transparent rotate-[8deg] origin-bottom"></div>
          <div className="absolute bottom-0 left-[calc(50%+60px)] w-[1px] h-[150px] bg-gradient-to-t from-blue-400/10 to-transparent -rotate-[8deg] origin-bottom"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 font-medium">For Students</p>
          <h2 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-white">
            Get Found,<br />Don't Get Lost
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Stop mass-applying to hundreds of jobs. Let your peers vouch for you and companies find you.
          </p>
          <Link href="/student/signup" className="inline-block bg-white text-black px-10 py-4 rounded-lg font-semibold text-base hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300">
            Join Signl Today
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-white/5"></div>
      </div>

      {/* Testimonials */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="glow-orb" style={{
            top: '10%',
            left: '20%',
            width: '400px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(147,51,234,0.06) 0%, transparent 70%)',
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 font-medium">Testimonials</p>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
              Trusted by Recruiters
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              We're working with recruiters from leading companies to build the future of college hiring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="glass-dark rounded-2xl p-10 hover:border-white/15 transition-all duration-500">
              <svg className="w-8 h-8 text-white/10 mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 italic">
                "Peer referrals are our most successful hiring method. This platform captures that validation at scale, which is exactly what we need."
              </p>
              <div className="text-sm text-gray-500">University Relations, Major Financial Services Firm</div>
            </div>

            <div className="glass-dark rounded-2xl p-10 hover:border-white/15 transition-all duration-500">
              <svg className="w-8 h-8 text-white/10 mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 italic">
                "Experience matters more than GPA in tech. Being able to see actual project work and peer validation from group projects is a game-changer."
              </p>
              <div className="text-sm text-gray-500">Tech Recruiting Professional</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/" className="flex justify-center mb-6">
            <img src="/logo.png.png" alt="Signl Logo" className="h-14 object-contain hover:opacity-90 transition-opacity" />
          </Link>
          <p className="text-gray-600 mb-6 text-sm">Peer-validated college recruiting platform</p>
          <div className="flex items-center justify-center space-x-8 mb-10">
            <Link href="/student/signup" className="text-gray-500 hover:text-white transition-colors text-sm">For Students</Link>
            <a href="#for-companies" className="text-gray-500 hover:text-white transition-colors text-sm">For Companies</a>
          </div>
          <p className="text-gray-700 text-xs">&copy; 2025 Signl. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
