'use client'

import { useState, useEffect } from 'react'
import CompanyLayout from '../CompanyLayout'

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState({
    weeklyDigest: true,
    digestDay: 'Monday',
    digestEmail: '',
    talentAlerts: true,
    alertFrequency: 'daily',
    teamMembers: [],
    notifications: {
      newNominees: true,
      messageReplies: true,
      pipelineUpdates: true,
      weeklyReport: true,
    },
  })
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'recruiter' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [companyEmail, setCompanyEmail] = useState('')

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('signl_company_session') || '{}')
    setCompanyEmail(session.company?.email || '')
    const savedSettings = localStorage.getItem('signl_company_settings')
    if (savedSettings) {
      try { setSettings(s => ({ ...s, ...JSON.parse(savedSettings) })) } catch {}
    }
  }, [])

  const handleSave = () => {
    setSaving(true)
    localStorage.setItem('signl_company_settings', JSON.stringify(settings))
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000) }, 300)
  }

  const updateSetting = (key, value) => {
    setSettings(s => ({ ...s, [key]: value }))
    setSaved(false)
  }

  const updateNotification = (key, value) => {
    setSettings(s => ({ ...s, notifications: { ...s.notifications, [key]: value } }))
    setSaved(false)
  }

  const addTeamMember = () => {
    if (!newMember.email.trim()) return
    setSettings(s => ({
      ...s,
      teamMembers: [...s.teamMembers, { ...newMember, id: Date.now().toString(), addedAt: new Date().toISOString() }]
    }))
    setNewMember({ name: '', email: '', role: 'recruiter' })
    setSaved(false)
  }

  const removeTeamMember = (id) => {
    setSettings(s => ({ ...s, teamMembers: s.teamMembers.filter(m => m.id !== id) }))
    setSaved(false)
  }

  return (
    <CompanyLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Configure your recruiting preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Weekly Digest */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Weekly Digest Emails</h2>
                <p className="text-sm text-gray-500">Get matched nominees delivered to your inbox</p>
              </div>
              <button
                onClick={() => updateSetting('weeklyDigest', !settings.weeklyDigest)}
                className={`relative w-12 h-6 rounded-full transition-colors ${settings.weeklyDigest ? 'bg-teal-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.weeklyDigest ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {settings.weeklyDigest && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Delivery Day</label>
                  <select value={settings.digestDay} onChange={e => updateSetting('digestDay', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Email</label>
                  <input type="email" value={settings.digestEmail || companyEmail} onChange={e => updateSetting('digestEmail', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-600" />
                </div>
              </div>
            )}
          </div>

          {/* Talent Alerts */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Talent Alerts</h2>
                <p className="text-sm text-gray-500">Get notified when new students match your saved searches</p>
              </div>
              <button
                onClick={() => updateSetting('talentAlerts', !settings.talentAlerts)}
                className={`relative w-12 h-6 rounded-full transition-colors ${settings.talentAlerts ? 'bg-teal-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.talentAlerts ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {settings.talentAlerts && (
              <div className="pt-4 border-t border-white/5">
                <label className="block text-xs text-gray-500 mb-1">Alert Frequency</label>
                <select value={settings.alertFrequency} onChange={e => updateSetting('alertFrequency', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm">
                  <option value="realtime">Real-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            )}
          </div>

          {/* Notification Preferences */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Notification Preferences</h2>
            <div className="space-y-3">
              {[
                { key: 'newNominees', label: 'New matched nominees', desc: 'When students matching your criteria get nominated' },
                { key: 'messageReplies', label: 'Message replies', desc: 'When students respond to your messages' },
                { key: 'pipelineUpdates', label: 'Pipeline updates', desc: 'When candidates move through your pipeline' },
                { key: 'weeklyReport', label: 'Weekly activity report', desc: 'Summary of your recruiting activity' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-white">{n.label}</div>
                    <div className="text-xs text-gray-500">{n.desc}</div>
                  </div>
                  <button
                    onClick={() => updateNotification(n.key, !settings.notifications[n.key])}
                    className={`relative w-10 h-5 rounded-full transition-colors ${settings.notifications[n.key] ? 'bg-teal-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications[n.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Team Collaboration */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Team Members</h2>
            <p className="text-sm text-gray-500 mb-4">Invite colleagues to collaborate on recruiting</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <input type="text" value={newMember.name} onChange={e => setNewMember(m => ({ ...m, name: e.target.value }))} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-600" placeholder="Name" />
              <input type="email" value={newMember.email} onChange={e => setNewMember(m => ({ ...m, email: e.target.value }))} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-600" placeholder="Email" />
              <div className="flex gap-2">
                <select value={newMember.role} onChange={e => setNewMember(m => ({ ...m, role: e.target.value }))} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm">
                  <option value="recruiter">Recruiter</option>
                  <option value="hiring_manager">Hiring Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={addTeamMember} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Add</button>
              </div>
            </div>

            {settings.teamMembers.length > 0 ? (
              <div className="space-y-2">
                {settings.teamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between py-2 px-3 bg-white/[0.03] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-400 font-bold text-xs">
                        {member.name?.charAt(0) || member.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm text-white">{member.name || member.email}</div>
                        <div className="text-xs text-gray-500">{member.email} &middot; {member.role}</div>
                      </div>
                    </div>
                    <button onClick={() => removeTeamMember(member.id)} className="text-gray-600 hover:text-red-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">No team members added yet</div>
            )}
          </div>

          {/* Mobile-Friendly Notice */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Mobile-Friendly</h3>
                <p className="text-xs text-gray-500">This dashboard is optimized for mobile devices. Access it from any browser on your phone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}
