'use client'

import { useState, useEffect } from 'react'
import CompanyLayout from '../CompanyLayout'

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    industry: '',
    description: '',
    size: '',
    location: '',
    website: '',
    logo: '',
    cultureVideoUrl: '',
    whatWeLookFor: '',
    employeeSpotlights: [{ name: '', role: '', quote: '' }],
    perks: [],
    socialLinks: { linkedin: '', twitter: '', instagram: '' },
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newPerk, setNewPerk] = useState('')
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('signl_company_session') || '{}')
    if (session.company) {
      setProfile(p => ({ ...p, ...session.company }))
      setVerified(session.company.verified || false)
    }
    const savedProfile = localStorage.getItem('signl_company_profile')
    if (savedProfile) {
      try { setProfile(p => ({ ...p, ...JSON.parse(savedProfile) })) } catch {}
    }
  }, [])

  const handleChange = (field, value) => {
    setProfile(p => ({ ...p, [field]: value }))
    setSaved(false)
  }

  const handleSocialChange = (field, value) => {
    setProfile(p => ({ ...p, socialLinks: { ...p.socialLinks, [field]: value } }))
    setSaved(false)
  }

  const addSpotlight = () => {
    setProfile(p => ({
      ...p,
      employeeSpotlights: [...p.employeeSpotlights, { name: '', role: '', quote: '' }]
    }))
  }

  const updateSpotlight = (idx, field, value) => {
    setProfile(p => {
      const updated = [...p.employeeSpotlights]
      updated[idx] = { ...updated[idx], [field]: value }
      return { ...p, employeeSpotlights: updated }
    })
    setSaved(false)
  }

  const removeSpotlight = (idx) => {
    setProfile(p => ({
      ...p,
      employeeSpotlights: p.employeeSpotlights.filter((_, i) => i !== idx)
    }))
  }

  const addPerk = () => {
    if (!newPerk.trim()) return
    setProfile(p => ({ ...p, perks: [...(p.perks || []), newPerk.trim()] }))
    setNewPerk('')
    setSaved(false)
  }

  const removePerk = (idx) => {
    setProfile(p => ({ ...p, perks: p.perks.filter((_, i) => i !== idx) }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      localStorage.setItem('signl_company_profile', JSON.stringify(profile))
      const session = JSON.parse(localStorage.getItem('signl_company_session') || '{}')
      session.company = { ...session.company, ...profile }
      localStorage.setItem('signl_company_session', JSON.stringify(session))
      setSaved(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <CompanyLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Company Profile</h1>
            <p className="text-gray-400">Showcase your company to attract top student talent</p>
          </div>
          <div className="flex items-center gap-3">
            {verified && (
              <span className="px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-medium rounded-full flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Verified Employer
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Company Name</label>
                <input type="text" value={profile.name} onChange={e => handleChange('name', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Industry</label>
                <select value={profile.industry} onChange={e => handleChange('industry', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                  <option value="">Select Industry</option>
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Consulting</option>
                  <option>Healthcare</option>
                  <option>Engineering</option>
                  <option>Media & Entertainment</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Company Size</label>
                <select value={profile.size} onChange={e => handleChange('size', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                  <option value="">Select Size</option>
                  <option>1-10</option>
                  <option>10-50</option>
                  <option>50-200</option>
                  <option>200-1000</option>
                  <option>1000+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Location</label>
                <input type="text" value={profile.location} onChange={e => handleChange('location', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="San Francisco, CA" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Website</label>
                <input type="url" value={profile.website} onChange={e => handleChange('website', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="https://yourcompany.com" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">About Your Company</h2>
            <textarea value={profile.description} onChange={e => handleChange('description', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 resize-none h-28" placeholder="Tell students about your company, mission, and culture..." />
          </div>

          {/* What We Look For */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">What We Look For</h2>
            <p className="text-sm text-gray-500 mb-4">Help students understand what makes a great candidate for your team</p>
            <textarea value={profile.whatWeLookFor} onChange={e => handleChange('whatWeLookFor', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 resize-none h-24" placeholder="We look for curiosity, grit, and strong collaboration skills..." />
          </div>

          {/* Culture Video */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Culture Video</h2>
            <p className="text-sm text-gray-500 mb-4">Add a YouTube or Vimeo link to showcase your culture</p>
            <input type="url" value={profile.cultureVideoUrl} onChange={e => handleChange('cultureVideoUrl', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="https://youtube.com/watch?v=..." />
          </div>

          {/* Employee Spotlights */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Employee Spotlights</h2>
                <p className="text-sm text-gray-500">Feature team members to attract talent</p>
              </div>
              <button onClick={addSpotlight} className="text-sm text-teal-400 hover:underline">+ Add</button>
            </div>
            <div className="space-y-4">
              {profile.employeeSpotlights.map((spotlight, idx) => (
                <div key={idx} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">Spotlight #{idx + 1}</span>
                    {profile.employeeSpotlights.length > 1 && (
                      <button onClick={() => removeSpotlight(idx)} className="text-gray-600 hover:text-red-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" value={spotlight.name} onChange={e => updateSpotlight(idx, 'name', e.target.value)} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-600" placeholder="Name" />
                    <input type="text" value={spotlight.role} onChange={e => updateSpotlight(idx, 'role', e.target.value)} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-600" placeholder="Role" />
                  </div>
                  <textarea value={spotlight.quote} onChange={e => updateSpotlight(idx, 'quote', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-600 resize-none h-16" placeholder="What they love about working here..." />
                </div>
              ))}
            </div>
          </div>

          {/* Perks */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Perks & Benefits</h2>
            <div className="flex gap-2 mb-3">
              <input type="text" value={newPerk} onChange={e => setNewPerk(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPerk()} className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 text-sm" placeholder="e.g., Remote-friendly, Free lunch" />
              <button onClick={addPerk} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.perks || []).map((perk, idx) => (
                <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-sm text-teal-400">
                  {perk}
                  <button onClick={() => removePerk(idx)} className="text-teal-400/50 hover:text-red-400 ml-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Social Links</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
                <input type="url" value={profile.socialLinks?.linkedin || ''} onChange={e => handleSocialChange('linkedin', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="https://linkedin.com/company/..." />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Twitter / X</label>
                <input type="url" value={profile.socialLinks?.twitter || ''} onChange={e => handleSocialChange('twitter', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="https://x.com/..." />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Instagram</label>
                <input type="url" value={profile.socialLinks?.instagram || ''} onChange={e => handleSocialChange('instagram', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="https://instagram.com/..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}
