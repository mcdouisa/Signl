'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CompanyLayout from '../CompanyLayout'

function StatCard({ label, value, change, color = 'teal', icon }) {
  const colorMap = {
    teal: 'text-teal-400 bg-teal-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
  }
  return (
    <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-xs font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}

export default function CompanyDashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentCandidates, setRecentCandidates] = useState([])
  const [onboardingComplete, setOnboardingComplete] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem('signl_company_session')
    if (session) {
      const data = JSON.parse(session)
      setOnboardingComplete(data.company?.onboardingComplete !== false)
    }

    // Fetch dashboard data
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/company/analytics')
        const data = await res.json()
        if (data.success) {
          setStats(data.stats)
          setRecentCandidates(data.recentCandidates || [])
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  return (
    <CompanyLayout>
      <div className="max-w-7xl mx-auto">
        {/* Onboarding banner */}
        {!onboardingComplete && (
          <Link href="/company/onboarding" className="block mb-6 bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-teal-500/30 rounded-xl p-5 hover:border-teal-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Complete your setup</div>
                  <div className="text-xs text-gray-400">Finish onboarding to unlock all features</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Recruiter Dashboard</h1>
          <p className="text-gray-400">Overview of your recruiting activity on Signl</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Available Talent"
            value={loading ? '...' : (stats?.totalTalent || 0)}
            change={stats?.talentChange}
            color="teal"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <StatCard
            label="In Pipeline"
            value={loading ? '...' : (stats?.inPipeline || 0)}
            change={stats?.pipelineChange}
            color="blue"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard
            label="Profile Views"
            value={loading ? '...' : (stats?.profileViews || 0)}
            change={stats?.viewsChange}
            color="purple"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          />
          <StatCard
            label="Messages Sent"
            value={loading ? '...' : (stats?.messagesSent || 0)}
            change={stats?.messagesChange}
            color="amber"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Matched Candidates */}
          <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Recent Talent Matches</h2>
              <Link href="/company/talent" className="text-sm text-teal-400 hover:underline">View All</Link>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentCandidates.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-500 mb-3">No matched candidates yet</p>
                <Link href="/company/talent" className="text-sm text-teal-400 hover:underline">Search Talent</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCandidates.slice(0, 5).map(candidate => (
                  <div key={candidate.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {candidate.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{candidate.name}</div>
                      <div className="text-xs text-gray-500">{candidate.major} &middot; {candidate.gradYear}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-teal-400">{candidate.peerScore}</div>
                      <div className="text-xs text-gray-600">Score</div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {candidate.schoolVerified && (
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full font-medium">.edu</span>
                      )}
                      {candidate.nominationCount >= 5 && (
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full font-medium">{candidate.nominationCount} noms</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions + Pipeline Summary */}
          <div className="space-y-6">
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/company/talent" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Search Talent</span>
                </Link>
                <Link href="/company/pipeline" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Manage Pipeline</span>
                </Link>
                <Link href="/company/messages" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Messages</span>
                </Link>
                <Link href="/company/jobs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Post a Job</span>
                </Link>
              </div>
            </div>

            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Pipeline Summary</h2>
              <div className="space-y-3">
                {[
                  { label: 'Interested', count: stats?.pipeline?.interested || 0, color: 'bg-teal-400' },
                  { label: 'Reached Out', count: stats?.pipeline?.reachedOut || 0, color: 'bg-blue-400' },
                  { label: 'Interviewing', count: stats?.pipeline?.interviewing || 0, color: 'bg-purple-400' },
                  { label: 'Offer Extended', count: stats?.pipeline?.offerExtended || 0, color: 'bg-amber-400' },
                ].map(stage => (
                  <div key={stage.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                      <span className="text-sm text-gray-400">{stage.label}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{stage.count}</span>
                  </div>
                ))}
              </div>
              <Link href="/company/pipeline" className="block mt-4 text-center text-sm text-teal-400 hover:underline">
                View Pipeline
              </Link>
            </div>

            {/* Weekly Digest Preview */}
            <div className="bg-gradient-to-br from-teal-600/10 to-blue-600/10 border border-teal-500/20 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-2">Weekly Digest</h3>
              <p className="text-xs text-gray-400 mb-3">Get matched nominees delivered to your inbox every week.</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400 font-medium">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}
