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
      {/* Navigation - transforms on scroll */}
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
          <div className={`hidden md:flex items-center space-x-10 transition-all duration-500 ${
            scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            <a href="#how-it-works" className="text-gray-500 hover:text-black transition-colors text-sm tracking-wide font-medium">How It Works</a>
            <Link href="/for-companies" className="text-gray-500 hover:text-black transition-colors text-sm tracking-wide font-medium">For Companies</Link>
            <Link href="/for-students" className="text-gray-500 hover:text-black transition-colors text-sm tracking-wide font-medium">For Students</Link>
          </div>
          <Link href="/signin" className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-500 border ${
            scrolled
              ? 'border-white/20 text-white hover:bg-white hover:text-black'
              : 'border-black/20 text-black hover:bg-black hover:text-white'
          }`}>
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-12 px-6 relative">
        {/* Futuristic light effects */}
        <div className="absolute inset-0">
          {/* Main bright orb - top center */}
          <div className="glow-orb" style={{
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(96,165,250,0.18) 0%, rgba(52,211,153,0.12) 40%, transparent 70%)',
          }}></div>
          {/* Secondary teal orb - right */}
          <div className="glow-orb" style={{
            top: '20%',
            right: '-5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(74,222,128,0.18) 0%, transparent 70%)',
          }}></div>
          {/* Accent orb - left */}
          <div className="glow-orb" style={{
            top: '30%',
            left: '-8%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)',
          }}></div>
          {/* Bright spotlight beam effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[300px] bg-gradient-to-b from-white/20 via-emerald-400/15 to-transparent"></div>
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 grid-pattern opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-medium">Find College Talent</p>
            <h1 className="font-serif text-6xl md:text-8xl font-bold text-white mb-8 leading-[1.05] tracking-tight">
              Connecting Talent<br />
              <span className="text-gradient-light">with Opportunity</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
              Stop relying on resumes and GPA's. Whether hiring or a student, there is a better way to SIGNL the right person for the job.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/for-students" className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-lg font-semibold text-base hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300">
                I'm a Student
              </Link>
              <Link href="/for-companies" className="w-full sm:w-auto border border-white/20 text-white px-10 py-4 rounded-lg font-semibold text-base hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300">
                I'm a Company
              </Link>
            </div>
          </div>

          {/* Hero Image - scrolls with page */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <img
                src="/hero-library.jpg"
                alt="Students collaborating in university library"
                className="w-full h-auto object-cover"
                style={{ maxHeight: '500px', objectPosition: 'center 40%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 px-6 relative">
        {/* Ambient light effects */}
        <div className="absolute inset-0">
          <div className="glow-orb" style={{
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(52,211,153,0.12) 0%, rgba(96,165,250,0.06) 50%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            top: '40%',
            left: '-10%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            top: '30%',
            right: '-10%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)',
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 font-medium">The Process</p>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
              How Signl Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Three simple steps to connect companies and students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 glass-dark rounded-2xl hover:border-white/15 transition-all duration-500 group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 border border-white/10 rounded-xl flex items-center justify-center text-xl font-serif font-bold mb-8 text-white group-hover:border-emerald-400/40 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all duration-500">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                  Students Nominate Peers
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  University students nominate classmates they'd actually want to work with — especially from group projects in their major.
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
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 border border-white/10 rounded-xl flex items-center justify-center text-xl font-serif font-bold mb-8 text-white group-hover:border-green-400/40 group-hover:shadow-[0_0_15px_rgba(74,222,128,0.15)] transition-all duration-500">
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


      {/* Testimonials */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0">
          <div className="glow-orb" style={{
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(52,211,153,0.1) 0%, rgba(96,165,250,0.06) 50%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            top: '30%',
            right: '-10%',
            width: '450px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            bottom: '-15%',
            left: '10%',
            width: '500px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
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

      {/* Get Started */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0">
          <div className="glow-orb" style={{
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(52,211,153,0.15) 0%, rgba(96,165,250,0.08) 40%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            bottom: '-15%',
            right: '-5%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            top: '40%',
            left: '-8%',
            width: '450px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 font-medium">Join SIGNL</p>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
              Get Started
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Whether you're a student looking to get discovered or a company searching for top talent, SIGNL has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/for-students" className="glass-dark rounded-2xl p-12 text-center group hover:border-white/15 transition-all duration-500 block">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:border-emerald-400/40 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-500">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-serif">I'm a Student</h3>
                <p className="text-gray-400 mb-6">Get found by actively hiring recruiters. Let your peers vouch for you.</p>
                <span className="text-emerald-400 font-semibold text-sm group-hover:underline">Learn More &rarr;</span>
              </div>
            </Link>

            <Link href="/for-companies" className="glass-dark rounded-2xl p-12 text-center group hover:border-white/15 transition-all duration-500 block">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:border-blue-400/40 group-hover:shadow-[0_0_20px_rgba(96,165,250,0.15)] transition-all duration-500">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-serif">I'm a Company</h3>
                <p className="text-gray-400 mb-6">Access pre-vetted, peer-validated college talent. Hire smarter.</p>
                <span className="text-blue-400 font-semibold text-sm group-hover:underline">Learn More &rarr;</span>
              </div>
            </Link>
          </div>
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
