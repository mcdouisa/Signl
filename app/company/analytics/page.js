'use client'

import { useState, useEffect } from 'react'
import CompanyLayout from '../CompanyLayout'

function SimpleBarChart({ data, maxValue }) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="text-xs text-gray-500">{d.value}</div>
          <div
            className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-md transition-all"
            style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? '4px' : '0' }}
          />
          <div className="text-xs text-gray-600 truncate w-full text-center">{d.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/company/analytics?range=${timeRange}`)
        const data = await res.json()
        if (data.success) setStats(data.stats)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [timeRange])

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </CompanyLayout>
    )
  }

  const viewsBySchool = stats?.viewsBySchool || [
    { label: 'U of Utah', value: 34 },
    { label: 'BYU', value: 28 },
    { label: 'Utah State', value: 19 },
    { label: 'Weber St', value: 12 },
    { label: 'SUU', value: 8 },
  ]

  const nominationsBySkill = stats?.nominationsBySkill || [
    { label: 'Tech', value: 45 },
    { label: 'Lead', value: 38 },
    { label: 'Comm', value: 32 },
    { label: 'Solve', value: 28 },
    { label: 'Team', value: 25 },
    { label: 'Create', value: 18 },
  ]

  const nominationsByMajor = stats?.nominationsByMajor || [
    { label: 'CS', value: 52 },
    { label: 'IS', value: 35 },
    { label: 'Business', value: 28 },
    { label: 'Finance', value: 20 },
    { label: 'Eng', value: 15 },
  ]

  const outreachMetrics = stats?.outreach || {
    sent: 24,
    opened: 18,
    responded: 12,
    openRate: 75,
    responseRate: 50,
  }

  const weeklyViews = stats?.weeklyViews || [
    { label: 'W1', value: 12 },
    { label: 'W2', value: 18 },
    { label: 'W3', value: 24 },
    { label: 'W4', value: 31 },
  ]

  return (
    <CompanyLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
            <p className="text-gray-400">Track your recruiting activity and trends</p>
          </div>
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Profile Views', value: stats?.profileViews || 127, change: '+18%', color: 'teal' },
            { label: 'Students Viewed', value: stats?.studentsViewed || 45, change: '+12%', color: 'blue' },
            { label: 'Messages Sent', value: outreachMetrics.sent, change: '+8%', color: 'purple' },
            { label: 'Pipeline Candidates', value: stats?.inPipeline || 18, change: '+24%', color: 'amber' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-5">
              <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <span className="text-xs text-green-400 font-medium">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Profile Views Over Time */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">Profile Views Over Time</h3>
            <p className="text-sm text-gray-500 mb-4">Weekly student profile views</p>
            <SimpleBarChart data={weeklyViews} />
          </div>

          {/* Outreach Engagement */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">Outreach Engagement</h3>
            <p className="text-sm text-gray-500 mb-6">Message performance metrics</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{outreachMetrics.sent}</div>
                <div className="text-xs text-gray-500">Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{outreachMetrics.openRate}%</div>
                <div className="text-xs text-gray-500">Open Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">{outreachMetrics.responseRate}%</div>
                <div className="text-xs text-gray-500">Response Rate</div>
              </div>
            </div>
            {/* Funnel */}
            <div className="space-y-2">
              {[
                { label: 'Sent', value: outreachMetrics.sent, pct: 100 },
                { label: 'Opened', value: outreachMetrics.opened, pct: outreachMetrics.openRate },
                { label: 'Responded', value: outreachMetrics.responded, pct: outreachMetrics.responseRate },
              ].map(step => (
                <div key={step.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20">{step.label}</span>
                  <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all" style={{ width: `${step.pct}%` }} />
                  </div>
                  <span className="text-xs text-white font-medium w-8">{step.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Views by School */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">Views by School</h3>
            <p className="text-sm text-gray-500 mb-4">Which schools you view most</p>
            <SimpleBarChart data={viewsBySchool} />
          </div>

          {/* Nominations by Skill */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">Nomination Trends by Skill</h3>
            <p className="text-sm text-gray-500 mb-4">Most nominated skills on platform</p>
            <SimpleBarChart data={nominationsBySkill} />
          </div>

          {/* Nominations by Major */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">Nomination Trends by Major</h3>
            <p className="text-sm text-gray-500 mb-4">Most active majors</p>
            <SimpleBarChart data={nominationsByMajor} />
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}
