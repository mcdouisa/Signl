'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function calculateProfileCompleteness(student) {
  const fields = [
    { key: 'firstName', weight: 10, label: 'First Name' },
    { key: 'lastName', weight: 10, label: 'Last Name' },
    { key: 'college', weight: 10, label: 'College' },
    { key: 'major', weight: 10, label: 'Major' },
    { key: 'gradYear', weight: 5, label: 'Graduation Year' },
    { key: 'linkedinUrl', weight: 15, label: 'LinkedIn Profile' },
    { key: 'bio', weight: 10, label: 'Bio' },
    { key: 'careerInterests', weight: 10, label: 'Career Interests' },
    { key: 'skills', weight: 10, label: 'Skills', check: (v) => Array.isArray(v) && v.length > 0 },
    { key: 'githubUrl', weight: 5, label: 'GitHub/Portfolio' },
    { key: 'lookingFor', weight: 5, label: "What You're Looking For" },
  ]
  let total = 0, completed = 0
  const missing = []
  fields.forEach(f => {
    total += f.weight
    const val = student[f.key]
    const isComplete = f.check ? f.check(val) : (val && val.toString().trim() !== '')
    if (isComplete) completed += f.weight
    else missing.push(f.label)
  })
  return { percentage: Math.round((completed / total) * 100), missing, isComplete: completed === total }
}

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const BADGES = [
  { id: 'early_adopter', name: 'Early Adopter', icon: '⚡', description: 'Joined during early access', color: 'amber' },
  { id: 'connected', name: 'Connected', icon: '🔗', description: 'Gave all 5 endorsements', color: 'blue' },
  { id: 'top_scorer', name: 'Top Scorer', icon: '🏆', description: 'Top 10% peer score', color: 'yellow' },
  { id: 'team_player', name: 'Team Player', icon: '🤝', description: '3+ endorsements received', color: 'green' },
  { id: 'recruiter_pick', name: 'Recruiter Pick', icon: '🎯', description: 'Viewed by 5+ companies', color: 'purple' },
  { id: 'nominator', name: 'Nominator', icon: '📋', description: 'Nominated 3+ peers', color: 'teal' }
]

function getBadges(student, stats) {
  const earned = ['early_adopter']
  if ((student.endorsementsGiven || 0) >= 5) earned.push('connected')
  if (stats?.rank?.percentile >= 90) earned.push('top_scorer')
  if ((stats?.endorsementsReceived || 0) >= 3) earned.push('team_player')
  if ((student.nominations?.length || 0) >= 3) earned.push('nominator')
  return earned
}

function ActivityIcon({ type }) {
  const iconMap = {
    'endorsement_received': <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    'nomination_received': <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
    'endorsement_given': <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>,
    'profile_view': <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    'score_change': <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    'badge_earned': <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  }
  return iconMap[type] || <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}

export default function StudentDashboard() {
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activity, setActivity] = useState([])
  const [stats, setStats] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [activityLoading, setActivityLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem('signl_session')
    if (!session) { router.push('/student/login'); return }
    try {
      const { student: s } = JSON.parse(session)
      setStudent(s)
      fetchActivity(s.id)
      fetchNotifications(s.id)
    } catch { router.push('/student/login') }
    finally { setLoading(false) }
  }, [router])

  const fetchActivity = async (id) => {
    try {
      const res = await fetch(`/api/student/activity?studentId=${id}`)
      const data = await res.json()
      if (data.success) { setActivity(data.activity || []); setStats(data.stats || null) }
    } catch (e) { console.error(e) }
    finally { setActivityLoading(false) }
  }

  const fetchNotifications = async (id) => {
    try {
      const res = await fetch(`/api/student/notifications?studentId=${id}&unreadOnly=true`)
      const data = await res.json()
      if (data.success) setUnreadCount(data.unreadCount || 0)
    } catch (e) { console.error(e) }
  }

  const handleLogout = () => { localStorage.removeItem('signl_session'); router.push('/student/login') }

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading your dashboard...</p>
      </div>
    </div>
  )

  if (!student) return null

  const profile = calculateProfileCompleteness(student)
  const earnedBadgeIds = getBadges(student, stats)
  const earnedBadges = BADGES.filter(b => earnedBadgeIds.includes(b.id))
  const unearnedBadges = BADGES.filter(b => !earnedBadgeIds.includes(b.id))

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/"><img src="/logo.png.png" alt="Signl" className="h-14 object-contain hover:opacity-90 transition-opacity" /></Link>
            <div className="flex items-center space-x-4">
              <Link href="/student/notifications" className="relative text-gray-400 hover:text-white p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">{unreadCount}</span>}
              </Link>
              <Link href="/student/peers" className="text-gray-400 hover:text-white text-sm font-medium">Peers</Link>
              <Link href="/student/network" className="text-gray-400 hover:text-white text-sm font-medium">Network</Link>
              <Link href="/student/nominations" className="text-gray-400 hover:text-white text-sm font-medium">Nominations</Link>
              <Link href="/student/companies" className="text-gray-400 hover:text-white text-sm font-medium">Companies</Link>
              <Link href="/student/leaderboard" className="text-gray-400 hover:text-white text-sm font-medium">Leaderboard</Link>
              <Link href="/student/settings" className="text-gray-400 hover:text-white text-sm font-medium">Settings</Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm font-medium">Sign Out</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome back, {student.firstName}!</h1>
                <p className="text-gray-400 mt-1">{student.major} @ {student.college} &middot; {student.gradYear || 'Grad year not set'}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">{stats?.peerScore || student.peerScore || 70}</div>
                <div className="text-xs text-gray-500 font-medium">Peer Score</div>
                {stats?.peerScoreChange > 0 && <div className="text-xs text-green-400 mt-1">+{stats.peerScoreChange} this week</div>}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{stats?.endorsementsReceived || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Endorsements Received</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-teal-400">{stats?.nominationsReceived || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Nominations Received</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{stats?.profileViews || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Profile Views</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-amber-400">{stats?.rank?.percentile ? `Top ${100 - stats.rank.percentile}%` : '—'}</div>
                <div className="text-xs text-gray-500 mt-1">{stats?.rank?.position ? `#${stats.rank.position} of ${stats.rank.total}` : 'Rank in Major'}</div>
              </div>
            </div>
          </div>

          {/* Profile Completeness */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Profile Strength</h2>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={profile.percentage === 100 ? '#10b981' : profile.percentage >= 70 ? '#3b82f6' : '#f59e0b'} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${profile.percentage * 2.64} 264`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold text-white">{profile.percentage}%</span></div>
            </div>
            {profile.isComplete ? (
              <p className="text-green-400 text-sm text-center font-medium">Your profile is complete!</p>
            ) : (
              <div>
                <p className="text-gray-400 text-sm text-center mb-3">Complete your profile to stand out</p>
                <div className="space-y-1">
                  {profile.missing.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-500">
                      <svg className="w-3 h-3 mr-2 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" /></svg>
                      Add {item}
                    </div>
                  ))}
                  {profile.missing.length > 3 && <p className="text-xs text-gray-600 ml-5">+{profile.missing.length - 3} more</p>}
                </div>
                <Link href="/student/settings" className="block mt-3 text-center text-sm text-blue-400 hover:text-blue-300 font-medium">Complete Profile →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Badges & Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {earnedBadges.map(b => (
              <div key={b.id} className="bg-white/5 rounded-xl p-4 text-center border border-white/10 hover:border-white/20 transition-colors group">
                <div className="text-3xl mb-2">{b.icon}</div>
                <div className="text-sm font-semibold text-white">{b.name}</div>
                <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{b.description}</div>
              </div>
            ))}
            {unearnedBadges.map(b => (
              <div key={b.id} className="bg-white/[0.02] rounded-xl p-4 text-center border border-white/5 opacity-40 group">
                <div className="text-3xl mb-2 grayscale">{b.icon}</div>
                <div className="text-sm font-medium text-gray-600">{b.name}</div>
                <div className="text-xs text-gray-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{b.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
            {activityLoading ? (
              <div className="flex items-center justify-center py-8"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
            ) : activity.length === 0 ? (
              <div className="text-center py-8"><p className="text-gray-500">No activity yet. Start by endorsing peers!</p></div>
            ) : (
              <div className="space-y-1">
                {activity.slice(0, 8).map((item, idx) => (
                  <div key={item.id || idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5"><ActivityIcon type={item.type} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300">{item.message}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{timeAgo(item.timestamp)}</p>
                    </div>
                    {item.scoreImpact && <span className="text-xs text-green-400 font-medium flex-shrink-0">+{item.scoreImpact} pts</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">Endorsements</h2>
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => <div key={i} className={`h-2 flex-1 rounded-full ${i < (student.endorsementsGiven || 0) ? 'bg-blue-500' : 'bg-white/10'}`} />)}
              </div>
              <p className="text-sm text-gray-400 mb-4">{5 - (student.endorsementsGiven || 0)} endorsements remaining</p>
              <Link href="/student/peers" className="block w-full text-center bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition-all">Endorse Peers</Link>
            </div>

            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-2">Invite Classmates</h2>
              <p className="text-sm text-gray-400 mb-3">Help grow the network and boost your visibility.</p>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10 mb-3">
                <span className="text-xs text-gray-400 truncate flex-1">https://signl.cc/student/signup</span>
                <button onClick={() => { navigator.clipboard.writeText('https://signl.cc/student/signup'); const b = document.getElementById('copy-btn'); if(b){b.textContent='Copied!';setTimeout(()=>{b.textContent='Copy'},2000)} }} id="copy-btn" className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors flex-shrink-0">Copy</button>
              </div>
            </div>

            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">Explore</h2>
              <div className="space-y-2">
                <Link href="/student/nominations" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center"><svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg></div>
                  <div>
                    <div className="flex items-center gap-2"><div className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">Nominations</div>{stats?.nominationsReceived > 0 && <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">{stats.nominationsReceived}</span>}</div>
                    <div className="text-xs text-gray-500">View who nominated you</div>
                  </div>
                </Link>
                <Link href="/student/companies" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center"><svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
                  <div><div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Browse Companies</div><div className="text-xs text-gray-500">Find jobs &amp; apply</div></div>
                </Link>
                <Link href="/student/network" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center"><svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></div>
                  <div><div className="text-sm font-medium text-white group-hover:text-teal-400 transition-colors">Your Network</div><div className="text-xs text-gray-500">Visualize connections</div></div>
                </Link>
                <Link href="/student/leaderboard" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center"><svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
                  <div><div className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">Leaderboard</div><div className="text-xs text-gray-500">See top students</div></div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        {(stats?.nominationsReceived > 0 || stats?.endorsementsReceived > 0) && (
          <div className="bg-gradient-to-r from-blue-600/20 to-teal-500/20 border border-blue-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Peer Validated</h3>
                <p className="text-sm text-gray-300">You've been nominated by <span className="text-blue-400 font-semibold">{stats.nominationsReceived} peer{stats.nominationsReceived !== 1 ? 's' : ''}</span> and received <span className="text-teal-400 font-semibold">{stats.endorsementsReceived} endorsement{stats.endorsementsReceived !== 1 ? 's' : ''}</span>. Companies value this signal.</p>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">Your Status</h2>
              <p className="text-blue-100 text-sm">Profile saved and visible to recruiters once outreach begins. Build endorsements to rank higher.</p>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-3 h-3 bg-amber-300 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold whitespace-nowrap">Building Network</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
