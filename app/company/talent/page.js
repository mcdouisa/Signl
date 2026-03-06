'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import CompanyLayout from '../CompanyLayout'

const SKILL_OPTIONS = ['Technical Skills', 'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Creativity', 'Analytics', 'Design', 'Writing', 'Public Speaking']
const MAJOR_OPTIONS = ['All Majors', 'Computer Science', 'Information Systems', 'Business Administration', 'Finance', 'Marketing', 'Engineering', 'Data Science', 'Economics', 'Psychology']
const GRAD_YEAR_OPTIONS = ['All Years', '2025', '2026', '2027', '2028']
const SORT_OPTIONS = [
  { value: 'peerScore', label: 'Peer Score (Highest)' },
  { value: 'nominationCount', label: 'Most Nominations' },
  { value: 'credibilityScore', label: 'Nomination Quality' },
  { value: 'name', label: 'Name (A-Z)' },
]

function NominationQualityBadge({ score }) {
  if (!score) return null
  let label, color
  if (score >= 90) { label = 'Exceptional'; color = 'text-green-400 bg-green-500/10' }
  else if (score >= 75) { label = 'Strong'; color = 'text-blue-400 bg-blue-500/10' }
  else if (score >= 60) { label = 'Good'; color = 'text-teal-400 bg-teal-500/10' }
  else { label = 'Building'; color = 'text-gray-400 bg-gray-500/10' }
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${color}`} title="Nomination quality based on endorser credibility">
      {label}
    </span>
  )
}

function VerificationBadges({ student }) {
  return (
    <div className="flex items-center gap-1.5">
      {student.schoolVerified && (
        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full font-medium flex items-center gap-1" title="School email verified">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          .edu
        </span>
      )}
      {student.nominationAuthentic !== false && student.nominationCount >= 3 && (
        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full font-medium flex items-center gap-1" title="Nominations verified as authentic">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Verified
        </span>
      )}
      {student.nominationFlagged && (
        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs rounded-full font-medium flex items-center gap-1" title="Some nominations flagged for review">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" /></svg>
          Review
        </span>
      )}
    </div>
  )
}

export default function TalentSearchPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    major: 'All Majors',
    gradYear: 'All Years',
    minGpa: '',
    skills: [],
    minNominations: '',
    school: '',
    search: '',
    sort: 'peerScore',
  })
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [savedSearches, setSavedSearches] = useState([])
  const [showSaveSearch, setShowSaveSearch] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [privateNote, setPrivateNote] = useState('')
  const [notes, setNotes] = useState({})
  const [interestSignals, setInterestSignals] = useState([])
  const [introRequests, setIntroRequests] = useState([])

  useEffect(() => {
    fetchStudents()
    loadSavedSearches()
    loadNotes()
    loadInterestSignals()
    loadIntroRequests()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.major !== 'All Majors') params.set('major', filters.major)
      if (filters.gradYear !== 'All Years') params.set('gradYear', filters.gradYear)
      if (filters.minGpa) params.set('minGpa', filters.minGpa)
      if (filters.skills.length > 0) params.set('skills', filters.skills.join(','))
      if (filters.minNominations) params.set('minNominations', filters.minNominations)
      if (filters.school) params.set('school', filters.school)
      if (filters.search) params.set('search', filters.search)
      params.set('sort', filters.sort)

      const res = await fetch(`/api/company/talent?${params}`)
      const data = await res.json()
      if (data.success) {
        setStudents(data.students)
      }
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback(() => {
    fetchStudents()
  }, [filters])

  useEffect(() => {
    const timeout = setTimeout(applyFilters, 300)
    return () => clearTimeout(timeout)
  }, [filters])

  const loadSavedSearches = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('signl_saved_searches') || '[]')
      setSavedSearches(saved)
    } catch { setSavedSearches([]) }
  }

  const loadNotes = () => {
    try {
      const n = JSON.parse(localStorage.getItem('signl_private_notes') || '{}')
      setNotes(n)
    } catch { setNotes({}) }
  }

  const loadInterestSignals = () => {
    try {
      const s = JSON.parse(localStorage.getItem('signl_interest_signals') || '[]')
      setInterestSignals(s)
    } catch { setInterestSignals([]) }
  }

  const loadIntroRequests = () => {
    try {
      const r = JSON.parse(localStorage.getItem('signl_intro_requests') || '[]')
      setIntroRequests(r)
    } catch { setIntroRequests([]) }
  }

  const saveSearch = () => {
    if (!searchName.trim()) return
    const newSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    }
    const updated = [...savedSearches, newSearch]
    setSavedSearches(updated)
    localStorage.setItem('signl_saved_searches', JSON.stringify(updated))
    setSearchName('')
    setShowSaveSearch(false)
  }

  const deleteSavedSearch = (id) => {
    const updated = savedSearches.filter(s => s.id !== id)
    setSavedSearches(updated)
    localStorage.setItem('signl_saved_searches', JSON.stringify(updated))
  }

  const applySavedSearch = (search) => {
    setFilters(search.filters)
  }

  const saveNote = (studentId) => {
    const updated = { ...notes, [studentId]: privateNote }
    setNotes(updated)
    localStorage.setItem('signl_private_notes', JSON.stringify(updated))
  }

  const sendInterestSignal = (studentId) => {
    if (interestSignals.includes(studentId)) return
    const updated = [...interestSignals, studentId]
    setInterestSignals(updated)
    localStorage.setItem('signl_interest_signals', JSON.stringify(updated))
  }

  const requestIntro = (studentId) => {
    if (introRequests.includes(studentId)) return
    const updated = [...introRequests, studentId]
    setIntroRequests(updated)
    localStorage.setItem('signl_intro_requests', JSON.stringify(updated))
  }

  const addToPipeline = (student, stage = 'interested') => {
    const pipeline = JSON.parse(localStorage.getItem('signl_pipeline') || '{}')
    if (!pipeline[stage]) pipeline[stage] = []
    if (!pipeline[stage].find(s => s.id === student.id)) {
      pipeline[stage].push({
        id: student.id,
        name: student.name,
        major: student.major,
        gradYear: student.gradYear,
        peerScore: student.peerScore,
        addedAt: new Date().toISOString(),
      })
    }
    localStorage.setItem('signl_pipeline', JSON.stringify(pipeline))
    alert(`${student.name} added to "${stage}" pipeline`)
  }

  const toggleSkill = (skill) => {
    setFilters(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill]
    }))
  }

  return (
    <CompanyLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Talent Search</h1>
            <p className="text-gray-400">Find peer-validated students matching your criteria</p>
          </div>
          <button
            onClick={() => setShowSaveSearch(true)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          >
            Save Search
          </button>
        </div>

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Saved Searches</div>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map(s => (
                <div key={s.id} className="flex items-center gap-1 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full">
                  <button onClick={() => applySavedSearch(s)} className="text-sm text-teal-400 hover:text-teal-300">{s.name}</button>
                  <button onClick={() => deleteSavedSearch(s.id)} className="text-teal-400/50 hover:text-red-400 ml-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Search Modal */}
        {showSaveSearch && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowSaveSearch(false)}>
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-4">Save This Search</h3>
              <input
                type="text"
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                placeholder="Search name (e.g., CS Seniors)"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 mb-4"
              />
              <div className="flex gap-2">
                <button onClick={saveSearch} className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700">Save</button>
                <button onClick={() => setShowSaveSearch(false)} className="px-4 py-2 border border-white/10 rounded-lg text-gray-400">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              placeholder="Search by name, skill, interest..."
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600"
            />
            <select
              value={filters.major}
              onChange={e => setFilters(f => ({ ...f, major: e.target.value }))}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              {MAJOR_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={filters.gradYear}
              onChange={e => setFilters(f => ({ ...f, gradYear: e.target.value }))}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              {GRAD_YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select
              value={filters.sort}
              onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Min GPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="4.0"
                value={filters.minGpa}
                onChange={e => setFilters(f => ({ ...f, minGpa: e.target.value }))}
                placeholder="e.g. 3.0"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Min Nominations</label>
              <input
                type="number"
                min="0"
                value={filters.minNominations}
                onChange={e => setFilters(f => ({ ...f, minNominations: e.target.value }))}
                placeholder="e.g. 3"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">School</label>
              <input
                type="text"
                value={filters.school}
                onChange={e => setFilters(f => ({ ...f, school: e.target.value }))}
                placeholder="e.g. University of Utah"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-2 block">Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.skills.includes(skill)
                      ? 'bg-teal-500/20 border-teal-500/40 text-teal-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            {loading ? 'Searching...' : `${students.length} student${students.length !== 1 ? 's' : ''} found`}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student List */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Searching talent...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                <p className="text-gray-400 mb-2">No students match your filters</p>
                <button onClick={() => setFilters({ major: 'All Majors', gradYear: 'All Years', minGpa: '', skills: [], minNominations: '', school: '', search: '', sort: 'peerScore' })} className="text-sm text-teal-400 hover:underline">Clear Filters</button>
              </div>
            ) : (
              students.map(student => (
                <div
                  key={student.id}
                  onClick={() => { setSelectedStudent(student); setPrivateNote(notes[student.id] || '') }}
                  className={`bg-white/[0.04] backdrop-blur-md border rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg ${
                    selectedStudent?.id === student.id ? 'border-teal-500/50 ring-1 ring-teal-500/20' : 'border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {student.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{student.name}</h3>
                          <VerificationBadges student={student} />
                        </div>
                        <p className="text-gray-400 text-sm">{student.major} &middot; {student.gradYear}</p>
                        {student.college && <p className="text-gray-500 text-xs">{student.college}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-teal-400">{student.peerScore}</div>
                      <div className="text-xs text-gray-600">Peer Score</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {(student.topSkills || []).slice(0, 4).map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full font-medium">{skill}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">{student.nominationCount} nominations</span>
                      {student.gpa && <span className="text-xs text-gray-500">GPA: {student.gpa}</span>}
                      <NominationQualityBadge score={student.credibilityScore} />
                    </div>
                    {interestSignals.includes(student.id) && (
                      <span className="text-xs text-teal-400 font-medium">Interested</span>
                    )}
                    {notes[student.id] && (
                      <span className="text-xs text-amber-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Note
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Student Detail Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6 sticky top-8">
              {selectedStudent ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      {selectedStudent.name?.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-white">{selectedStudent.name}</h3>
                    <p className="text-gray-400 text-sm">{selectedStudent.major} &middot; {selectedStudent.gradYear}</p>
                    {selectedStudent.college && <p className="text-gray-500 text-xs mt-1">{selectedStudent.college}</p>}
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <VerificationBadges student={selectedStudent} />
                    </div>
                  </div>

                  {/* Peer Score */}
                  <div className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-lg p-4 mb-4 border border-teal-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-400">Peer Score</span>
                      <NominationQualityBadge score={selectedStudent.credibilityScore} />
                    </div>
                    <div className="text-3xl font-bold text-teal-400">{selectedStudent.peerScore}</div>
                    <div className="text-xs text-gray-500 mt-1">{selectedStudent.nominationCount} peer nominations</div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">Top Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {(selectedStudent.topSkills || []).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full font-medium">{skill}</span>
                      ))}
                    </div>
                  </div>

                  {/* Academic */}
                  {(selectedStudent.gpa || selectedStudent.careerInterests) && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-gray-500 mb-2">Details</div>
                      {selectedStudent.gpa && <p className="text-sm text-white mb-1">GPA: {selectedStudent.gpa}</p>}
                      {selectedStudent.careerInterests && <p className="text-sm text-gray-400">{selectedStudent.careerInterests}</p>}
                    </div>
                  )}

                  {/* Bio */}
                  {selectedStudent.bio && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-gray-500 mb-2">Bio</div>
                      <p className="text-sm text-gray-300">{selectedStudent.bio}</p>
                    </div>
                  )}

                  {/* Links */}
                  {(selectedStudent.linkedinUrl || selectedStudent.githubUrl || selectedStudent.portfolioUrl) && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-gray-500 mb-2">Links</div>
                      <div className="flex flex-col gap-1">
                        {selectedStudent.linkedinUrl && <a href={selectedStudent.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">LinkedIn</a>}
                        {selectedStudent.githubUrl && <a href={selectedStudent.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">GitHub</a>}
                        {selectedStudent.portfolioUrl && <a href={selectedStudent.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">Portfolio</a>}
                      </div>
                    </div>
                  )}

                  {/* Peer Feedback */}
                  {selectedStudent.peerFeedback?.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-gray-500 mb-2">Peer Feedback</div>
                      <div className="space-y-2">
                        {selectedStudent.peerFeedback.map((fb, i) => (
                          <div key={i} className="text-sm text-gray-300 bg-white/5 rounded-lg p-3 italic">&ldquo;{fb}&rdquo;</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Private Note */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">Private Note</div>
                    <textarea
                      value={privateNote}
                      onChange={e => setPrivateNote(e.target.value)}
                      placeholder="Add internal notes about this candidate..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-600 resize-none h-20"
                    />
                    <button
                      onClick={() => saveNote(selectedStudent.id)}
                      className="mt-1 text-xs text-teal-400 hover:underline"
                    >
                      Save Note
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => addToPipeline(selectedStudent)}
                      className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                    >
                      Add to Pipeline
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => sendInterestSignal(selectedStudent.id)}
                        disabled={interestSignals.includes(selectedStudent.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          interestSignals.includes(selectedStudent.id)
                            ? 'bg-teal-500/20 text-teal-400 cursor-not-allowed'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:text-teal-400 hover:border-teal-500/30'
                        }`}
                      >
                        {interestSignals.includes(selectedStudent.id) ? 'Interested' : "We're Interested"}
                      </button>
                      <button
                        onClick={() => requestIntro(selectedStudent.id)}
                        disabled={introRequests.includes(selectedStudent.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          introRequests.includes(selectedStudent.id)
                            ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-500/30'
                        }`}
                      >
                        {introRequests.includes(selectedStudent.id) ? 'Requested' : 'Request Intro'}
                      </button>
                    </div>
                    <Link
                      href={`/company/messages?to=${selectedStudent.id}`}
                      className="block w-full text-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                    >
                      Send Message
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p>Select a student to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}
