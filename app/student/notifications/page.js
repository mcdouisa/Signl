'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const typeConfig = {
  nomination_received: { icon: '🎯', bg: 'bg-green-500/10', accent: 'text-green-400' },
  endorsement_received: { icon: '⭐', bg: 'bg-yellow-500/10', accent: 'text-yellow-400' },
  profile_view: { icon: '👀', bg: 'bg-purple-500/10', accent: 'text-purple-400' },
  milestone: { icon: '🏆', bg: 'bg-amber-500/10', accent: 'text-amber-400' },
  new_peer: { icon: '👥', bg: 'bg-blue-500/10', accent: 'text-blue-400' },
  badge_earned: { icon: '🏅', bg: 'bg-teal-500/10', accent: 'text-teal-400' },
  company_interest: { icon: '🏢', bg: 'bg-indigo-500/10', accent: 'text-indigo-400' },
}

export default function NotificationsPage() {
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem('signl_session')
    if (!session) { router.push('/student/login'); return }
    try {
      const { student: s } = JSON.parse(session)
      setStudent(s)
      fetchNotifications(s.id)
    } catch { router.push('/student/login') }
  }, [router])

  const fetchNotifications = async (id) => {
    try {
      const res = await fetch(`/api/student/notifications?studentId=${id}`)
      const data = await res.json()
      if (data.success) setNotifications(data.notifications || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const markAllRead = async () => {
    if (!student) return
    try {
      await fetch('/api/student/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, markAllRead: true })
      })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (e) { console.error(e) }
  }

  const unreadCount = notifications.filter(n => !n.read).length

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
            <Link href="/student/settings" className="text-gray-400 hover:text-white text-sm font-medium">Settings</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            <p className="text-gray-400 mt-1">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm text-blue-400 hover:text-blue-300 font-medium">
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">🔔</div>
            <h2 className="text-xl font-bold text-white mb-2">No notifications yet</h2>
            <p className="text-gray-400">When you receive endorsements, nominations, or profile views, they'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(notif => {
              const config = typeConfig[notif.type] || typeConfig.milestone
              return (
                <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${notif.read ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-white/[0.04] border-white/[0.1]'}`}>
                  <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0 text-lg`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`text-sm font-semibold ${notif.read ? 'text-gray-300' : 'text-white'}`}>{notif.title}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{notif.message}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{timeAgo(notif.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
