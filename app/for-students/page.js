'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ForStudents() {
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
            background: 'radial-gradient(ellipse, rgba(52,211,153,0.18) 0%, rgba(74,222,128,0.1) 40%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            top: '20%',
            right: '-8%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            top: '30%',
            left: '-8%',
            width: '450px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)',
          }}></div>
          <div className="absolute inset-0 grid-pattern opacity-40"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 font-medium">For Students</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-white leading-[1.05]">
            Get Found by<br />
            <span className="text-gradient-light">Actively Hiring Recruiters</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Stop mass-applying to hundreds of jobs. Let your peers vouch for you and companies find you.
          </p>
          <Link href="/student/signup" className="inline-block bg-white text-black px-10 py-4 rounded-lg font-semibold text-base hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300">
            Join Signl Today
          </Link>
        </div>
      </section>

      {/* Lecture hall image */}
      <section className="px-6 pb-20 relative">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            <img
              src="/students-lecture.jpg"
              alt="Students in university lecture hall"
              className="w-full h-auto object-cover"
              style={{ maxHeight: '450px', objectPosition: 'center 60%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
          </div>
        </div>
      </section>

      {/* How it works for students */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0">
          <div className="glow-orb" style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(52,211,153,0.1) 0%, rgba(96,165,250,0.06) 50%, transparent 70%)',
          }}></div>
          <div className="glow-orb" style={{
            top: '20%',
            left: '-10%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 font-medium">Why SIGNL</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              Your Peers Are Your Best Reference
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Recruiters trust peer validation over resumes. Here's how SIGNL helps you stand out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-dark rounded-2xl p-10 group hover:border-white/15 transition-all duration-500 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:border-emerald-400/40 transition-all duration-500">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-serif">Build Your Profile</h3>
                <p className="text-gray-400 leading-relaxed">
                  Create your SIGNL profile and showcase your skills, projects, and experience beyond a traditional resume.
                </p>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-10 group hover:border-white/15 transition-all duration-500 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:border-teal-400/40 transition-all duration-500">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-serif">Get Nominated</h3>
                <p className="text-gray-400 leading-relaxed">
                  Your classmates nominate you based on real group project experience. Authentic validation that recruiters trust.
                </p>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-10 group hover:border-white/15 transition-all duration-500 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:border-green-400/40 transition-all duration-500">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-serif">Get Hired</h3>
                <p className="text-gray-400 leading-relaxed">
                  Companies discover your profile and reach out directly. No more mass-applying — let opportunities come to you.
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
            background: 'radial-gradient(ellipse, rgba(74,222,128,0.12) 0%, transparent 70%)',
          }}></div>
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Discovered?
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Create your free SIGNL profile and start getting nominated by your peers today.
          </p>
          <Link href="/student/signup" className="inline-block bg-white text-black px-12 py-5 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-300">
            Sign Up as Student
          </Link>
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
