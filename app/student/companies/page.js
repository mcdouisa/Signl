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
  const [hiringOnly, setHiringOnly] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem('signl_session')
    if (!session) { router.push('/student/login'); return }
    try { setStudent(JSON.parse(session).student) } catch { router.push('/student/login') }
  }, [router])

  useEffect(() => {
    fetchCompanies()
  }, [selectedIndustry, hiringOnly])

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

  const handleLogout = () => {
    localStorage.removeItem('signl_session')
    router.push('/student/login')
  }

  const handleApply = (company) => {
    const url = company.applicationUrl || company.website
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const filteredCompanies = hiringOnly
    ? companies.filter(c => c.activelyHiring)
    : companies

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><img src="/logo.png.png" alt="Signl" className="h-14 object-contain hover:opacity-90 transition-opacity" /></Link>
          <div className="flex items-center space-x-4">
            <Link href="/student/dashboard" className="text-gray-400 hover:text-white text-sm font-medium">Dashboard</Link>
            <Link href="/student/peers" className="text-gray-400 hover:text-white text-sm font-medium">Peers</Link>
            <Link href="/student/nominations" className="text-gray-400 hover:text-white text-sm font-medium">Nominations</Link>
            <Link href="/student/settings" className="text-gray-400 hover:text-white text-sm font-medium">Settings</Link>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm font-medium">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Discover Companies</h1>
          <p className="text-gray-400 mt-1">Browse companies on Signl and apply directly through their job portals.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
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
            <button type="submit" className="px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex-shrink-0">
              Search
            </button>
          </form>
          <label className="flex items-center gap-2 cursor-pointer select-none px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
            <div
              onClick={() => setHiringOnly(!hiringOnly)}
              className={`w-10 h-5 rounded-full transition-colors relative ${hiringOnly ? 'bg-green-500' : 'bg-white/10'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${hiringOnly ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
            <span className="text-sm text-gray-300 whitespace-nowrap">Actively hiring only</span>
          </label>
        </div>

        {/* Industry Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setSelectedIndustry('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedIndustry === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            All Industries
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

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-4">
            Showing {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'}
            {hiringOnly ? ' actively hiring' : ''}
          </p>
        )}

        {/* Companies Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">🏢</div>
            <h2 className="text-xl font-bold text-white mb-2">No companies found</h2>
            <p className="text-gray-400">Try adjusting your filters or check back later as more companies join Signl.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompanies.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                onApply={() => handleApply(company)}
              />
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-500">
            More companies are joining Signl regularly. Build your profile and earn peer nominations to stand out when recruiters browse talent.
          </p>
        </div>
      </div>
    </div>
  )
}

function CompanyCard({ company, onApply }) {
  const [expanded, setExpanded] = useState(false)
  const canApply = company.activelyHiring && (company.applicationUrl || company.website)

  return (
    <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {company.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.industry} &middot; {company.size} employees</p>
          </div>
        </div>
        {company.activelyHiring ? (
          <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full flex-shrink-0 border border-green-500/20">
            Hiring
          </span>
        ) : (
          <span className="px-2 py-1 bg-white/5 text-gray-500 text-xs font-medium rounded-full flex-shrink-0">
            Not Hiring
          </span>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {company.location}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">{company.description}</p>

      {/* Open Roles */}
      {company.hiringRoles && company.hiringRoles.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Open Roles</p>
          <div className="flex flex-wrap gap-2">
            {(expanded ? company.hiringRoles : company.hiringRoles.slice(0, 3)).map((role, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full font-medium border border-blue-500/20">
                {role}
              </span>
            ))}
            {!expanded && company.hiringRoles.length > 3 && (
              <button
                onClick={() => setExpanded(true)}
                className="px-2.5 py-1 bg-white/5 text-gray-400 text-xs rounded-full hover:text-white transition-colors"
              >
                +{company.hiringRoles.length - 3} more
              </button>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-auto pt-2">
        {canApply ? (
          <button
            onClick={onApply}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            Apply Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        ) : !company.activelyHiring ? (
          <div className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white/5 text-gray-500 text-sm font-medium rounded-xl cursor-not-allowed">
            Not Accepting Applications
          </div>
        ) : null}

        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/10 hover:text-white transition-all"
          >
            Website
          </a>
        )}
      </div>

      {/* External site note */}
      {canApply && (
        <p className="text-xs text-gray-600 text-center mt-2">
          Opens company's external application portal
        </p>
      )}
    </div>
  )
}
