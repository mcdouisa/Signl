'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function SkillTag({ skill }) {
  return (
    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full font-medium border border-blue-500/20">
      {skill}
    </span>
  )
}

function NominationCard({ nomination, direction }) {
  const [expanded, setExpanded] = useState(false)
  const isIncoming = direction === 'incoming'

  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.15] transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${isIncoming ? 'bg-gradient-to-br from-green-600 to-teal-500' : 'bg-gradient-to-br from-blue-600 to-purple-500'}`}>
            {isIncoming
              ? nomination.nominatorName?.charAt(0).toUpperCase()
              : nomination.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">
              {isIncoming ? nomination.nominatorName : nomination.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isIncoming
                ? `${nomination.nominatorMajor || 'Unknown Major'} @ ${nomination.nominatorCollege || 'Unknown College'}`
                : `${nomination.major || 'Unknown Major'}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium flex-shrink-0 flex items-center gap-1"
        >
          {expanded ? 'Less' : 'Details'}
          <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {nomination.skills && nomination.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {nomination.skills.map((s, i) => <SkillTag key={i} skill={s} />)}
        </div>
      )}

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
          {nomination.projectContext && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Project / Context</p>
              <p className="text-sm text-gray-300">{nomination.projectContext}</p>
            </div>
          )}
          {nomination.reason && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Why Nominated</p>
              <p className="text-sm text-gray-300 italic">"{nomination.reason}"</p>
            </div>
          )}
          {!isIncoming && (nomination.email || nomination.linkedinUrl) && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Contact</p>
              {nomination.email && <p className="text-sm text-gray-400">{nomination.email}</p>}
              {nomination.linkedinUrl && (
                <a
                  href={nomination.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  LinkedIn Profile →
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function NominationsPage() {
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [nominations, setNominations] = useState({ outgoing: [], incoming: [] })
  const [activeTab, setActiveTab] = useState('incoming')

  useEffect(() => {
    const session = localStorage.getItem('signl_session')
    if (!session) { router.push('/student/login'); return }
    try {
      const { student: s } = JSON.parse(session)
      setStudent(s)
      fetchNominations(s.id)
    } catch { router.push('/student/login') }
  }, [router])

  const fetchNominations = async (studentId) => {
    try {
      const res = await fetch(`/api/student/nominations?studentId=${studentId}`)
      const data = await res.json()
      if (data.success) {
        setNominations({ outgoing: data.outgoing || [], incoming: data.incoming || [] })
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('signl_session')
    router.push('/student/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!student) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="bg-black/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/"><img src="/logo.png.png" alt="Signl" className="h-14 object-contain hover:opacity-90 transition-opacity" /></Link>
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard" className="text-gray-400 hover:text-white text-sm font-medium">Dashboard</Link>
              <Link href="/student/peers" className="text-gray-400 hover:text-white text-sm font-medium">Peers</Link>
              <Link href="/student/network" className="text-gray-400 hover:text-white text-sm font-medium">Network</Link>
              <Link href="/student/companies" className="text-gray-400 hover:text-white text-sm font-medium">Companies</Link>
              <Link href="/student/leaderboard" className="text-gray-400 hover:text-white text-sm font-medium">Leaderboard</Link>
              <Link href="/student/settings" className="text-gray-400 hover:text-white text-sm font-medium">Settings</Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm font-medium">Sign Out</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Nominations</h1>
          <p className="text-gray-400 mt-1">Peer nominations are the foundation of your Signl profile — they signal real-world credibility.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`p-5 rounded-xl border text-left transition-all ${activeTab === 'incoming' ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.15]'}`}
          >
            <div className="text-3xl font-bold text-green-400">{nominations.incoming.length}</div>
            <div className="text-sm text-gray-400 mt-1">Nominations Received</div>
            <div className="text-xs text-gray-600 mt-0.5">Peers who nominated you</div>
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`p-5 rounded-xl border text-left transition-all ${activeTab === 'outgoing' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.15]'}`}
          >
            <div className="text-3xl font-bold text-blue-400">{nominations.outgoing.length}</div>
            <div className="text-sm text-gray-400 mt-1">Nominations Given</div>
            <div className="text-xs text-gray-600 mt-0.5">Peers you nominated</div>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6 w-fit">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'incoming' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Received ({nominations.incoming.length})
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'outgoing' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Given ({nominations.outgoing.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'incoming' && (
          <div>
            {nominations.incoming.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No nominations received yet</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  As peers join Signl and nominate you during signup, their nominations will appear here.
                  Share your invite link to grow the network.
                </p>
                <Link
                  href="/student/dashboard"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy Invite Link
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-gray-400">
                    {nominations.incoming.length} peer{nominations.incoming.length !== 1 ? 's have' : ' has'} nominated you. This validates your skills and boosts your profile visibility.
                  </p>
                </div>
                {nominations.incoming.map((nom, idx) => (
                  <NominationCard key={idx} nomination={nom} direction="incoming" />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'outgoing' && (
          <div>
            {nominations.outgoing.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No nominations given</h3>
                <p className="text-gray-500 text-sm">You haven't nominated any peers yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-sm text-gray-400">
                    You nominated {nominations.outgoing.length} peer{nominations.outgoing.length !== 1 ? 's' : ''} during signup. When they join Signl, they'll see your nomination.
                  </p>
                </div>
                {nominations.outgoing.map((nom, idx) => (
                  <NominationCard key={idx} nomination={nom} direction="outgoing" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info box */}
        <div className="mt-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-white mb-1">How nominations work</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Nominations are peer endorsements given during signup. When a classmate nominates you, they describe a project you worked on together and highlight your skills.
                Recruiters on Signl see these nominations as real-world proof of your abilities — more credible than self-reported skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
