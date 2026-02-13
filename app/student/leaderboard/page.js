'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LeaderboardPage() {
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [peers, setPeers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('peerScore')

  useEffect(() => {
    const session = localStorage.getItem('signl_session')
    if (!session) { router.push('/student/login'); return }
    try {
      const { student: s } = JSON.parse(session)
      setStudent(s)
      fetchPeers(s)
    } catch { router.push('/student/login') }
  }, [router])

  const fetchPeers = async (s) => {
    try {
      const res = await fetch(`/api/student/peers?studentId=${s.id}&college=${encodeURIComponent(s.college)}&major=${encodeURIComponent(s.major)}`)
      const data = await res.json()
      if (data.success) {
        // Include current student in the leaderboard
        const allStudents = [
          {
            id: s.id,
            firstName: s.firstName,
            lastName: s.lastName,
            peerScore: s.peerScore || 70,
            skills: s.skills || [],
            endorsementsGiven: s.endorsementsGiven || 0,
            isCurrentUser: true
          },
          ...data.peers.map(p => ({
            ...p,
            peerScore: p.peerScore || 70,
            endorsementsGiven: p.endorsementsGiven || 0,
            isCurrentUser: false
          }))
        ]
        setPeers(allStudents)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const sortedPeers = [...peers].sort((a, b) => {
    if (sortBy === 'peerScore') return (b.peerScore || 70) - (a.peerScore || 70)
    if (sortBy === 'endorsements') return (b.endorsementsGiven || 0) - (a.endorsementsGiven || 0)
    if (sortBy === 'name') return a.firstName.localeCompare(b.firstName)
    return 0
  })

  const currentUserRank = sortedPeers.findIndex(p => p.isCurrentUser) + 1

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

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

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            <p className="text-gray-400 mt-1">{student?.major} @ {student?.college}</p>
          </div>
          {currentUserRank > 0 && (
            <div className="text-right bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3">
              <div className="text-2xl font-bold text-blue-400">#{currentUserRank}</div>
              <div className="text-xs text-gray-500">Your Rank</div>
            </div>
          )}
        </div>

        {/* Top 3 Podium */}
        {sortedPeers.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-xl font-bold mb-2 ${sortedPeers[1].isCurrentUser ? 'bg-gradient-to-br from-blue-600 to-teal-500 text-white ring-2 ring-blue-400' : 'bg-white/10 text-gray-300'}`}>
                {sortedPeers[1].firstName.charAt(0)}{sortedPeers[1].lastName.charAt(0)}
              </div>
              <div className="text-sm font-semibold text-gray-300">{sortedPeers[1].firstName} {sortedPeers[1].lastName.charAt(0)}.</div>
              <div className="text-xs text-gray-500">{sortedPeers[1].peerScore} pts</div>
              <div className="w-20 h-16 bg-gray-500/20 rounded-t-lg mt-2 mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-400">2</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="text-2xl mb-1">👑</div>
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-2 ${sortedPeers[0].isCurrentUser ? 'bg-gradient-to-br from-blue-600 to-teal-500 text-white ring-2 ring-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {sortedPeers[0].firstName.charAt(0)}{sortedPeers[0].lastName.charAt(0)}
              </div>
              <div className="text-sm font-bold text-white">{sortedPeers[0].firstName} {sortedPeers[0].lastName.charAt(0)}.</div>
              <div className="text-xs text-amber-400">{sortedPeers[0].peerScore} pts</div>
              <div className="w-20 h-24 bg-amber-500/20 rounded-t-lg mt-2 mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-amber-400">1</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-xl font-bold mb-2 ${sortedPeers[2].isCurrentUser ? 'bg-gradient-to-br from-blue-600 to-teal-500 text-white ring-2 ring-blue-400' : 'bg-white/10 text-gray-300'}`}>
                {sortedPeers[2].firstName.charAt(0)}{sortedPeers[2].lastName.charAt(0)}
              </div>
              <div className="text-sm font-semibold text-gray-300">{sortedPeers[2].firstName} {sortedPeers[2].lastName.charAt(0)}.</div>
              <div className="text-xs text-gray-500">{sortedPeers[2].peerScore} pts</div>
              <div className="w-20 h-12 bg-orange-500/10 rounded-t-lg mt-2 mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-400/60">3</span>
              </div>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'peerScore', label: 'Peer Score' },
            { key: 'endorsements', label: 'Endorsements' },
            { key: 'name', label: 'Name' }
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${sortBy === s.key ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Full Rankings */}
        <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden">
          {sortedPeers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">No peers in your major yet. Be the first to build your score!</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {sortedPeers.map((peer, idx) => (
                <div key={peer.id} className={`flex items-center gap-4 px-6 py-4 ${peer.isCurrentUser ? 'bg-blue-500/5 border-l-2 border-blue-500' : ''} hover:bg-white/[0.02] transition-colors`}>
                  <div className={`w-8 text-center font-bold text-lg ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                    {idx + 1}
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${peer.isCurrentUser ? 'bg-gradient-to-br from-blue-600 to-teal-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                    {peer.firstName.charAt(0)}{peer.lastName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${peer.isCurrentUser ? 'text-white' : 'text-gray-300'}`}>
                        {peer.firstName} {peer.lastName.charAt(0)}.
                      </span>
                      {peer.isCurrentUser && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">You</span>
                      )}
                    </div>
                    {peer.skills && peer.skills.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {peer.skills.slice(0, 3).map((skill, sIdx) => (
                          <span key={sIdx} className="text-xs text-gray-600">{skill}{sIdx < Math.min(peer.skills.length, 3) - 1 ? ' ·' : ''}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${idx === 0 ? 'text-amber-400' : 'text-white'}`}>{peer.peerScore || 70}</div>
                    <div className="text-xs text-gray-600">pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How Scoring Works */}
        <div className="mt-8 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">How Peer Scoring Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div>
              <div className="text-blue-400 font-semibold mb-1">Base Score</div>
              <p>Every student starts with a base peer score of 70 points when they join Signl.</p>
            </div>
            <div>
              <div className="text-teal-400 font-semibold mb-1">Endorsements</div>
              <p>When peers endorse your skills, your score increases. Higher-scored endorsers give bigger boosts.</p>
            </div>
            <div>
              <div className="text-amber-400 font-semibold mb-1">Nominations</div>
              <p>Being nominated during signup also contributes to your visibility and credibility with companies.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
