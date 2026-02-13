'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CompaniesPage() {
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [companies, setCompanies] = useState([])
  const [industries, setIndustries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const session = localStorage.getItem('signl_session')
    if (!session) { router.push('/student/login'); return }
    try { setStudent(JSON.parse(session).student) } catch { router.push('/student/login') }
  }, [router])

  useEffect(() => {
    fetchCompanies()
  }, [selectedIndustry])

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedIndustry !== 'all') params.set('industry', selectedIndustry)
      if (searchQuery) params.set('search', searchQuery)
      const res = await fetch(`/api/companies?${params}`)
      const data = await res.json()
      if (data.success) {
        setCompanies(data.companies || [])
        if (data.industries) setIndustries(data.industries)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCompanies()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><img src="/logo.png.png" alt="Signl" className="h-14 object-contain" /></Link>
          <div className="flex items-center space-x-4">
            <Link href="/student/dashboard" className="text-gray-400 hover:text-white text-sm font-medium">Dashboard</Link>
            <Link href="/student/peers" className="text-gray-400 hover:text-white text-sm font-medium">Peers</Link>
            <Link href="/student/settings" className="text-gray-400 hover:text-white text-sm font-medium">Settings</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Discover Companies</h1>
          <p className="text-gray-400 mt-1">Browse companies on Signl looking for peer-validated talent.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies, roles, or industries..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedIndustry('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedIndustry === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              All
            </button>
            {industries.map(ind => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedIndustry === ind ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">🏢</div>
            <h2 className="text-xl font-bold text-white mb-2">No companies found</h2>
            <p className="text-gray-400">Try adjusting your filters or check back later as more companies join Signl.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map(company => (
              <div key={company.id} className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{company.name}</h3>
                      <p className="text-sm text-gray-500">{company.industry} &middot; {company.size} employees</p>
                    </div>
                  </div>
                  {company.activelyHiring && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full flex-shrink-0">
                      Hiring
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{company.description}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {company.location}
                </div>

                {company.hiringRoles && company.hiringRoles.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-2">Open Roles</p>
                    <div className="flex flex-wrap gap-2">
                      {company.hiringRoles.map((role, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full font-medium">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-500">
            More companies are joining Signl regularly. Build your profile and earn endorsements to be discoverable when they start recruiting.
          </p>
        </div>
      </div>
    </div>
  )
}
