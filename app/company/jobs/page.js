'use client'

import { useState, useEffect } from 'react'
import CompanyLayout from '../CompanyLayout'

export default function JobPostingsPage() {
  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [form, setForm] = useState({
    title: '',
    type: 'Internship',
    location: '',
    remote: false,
    description: '',
    requirements: '',
    skills: '',
    applicationUrl: '',
    linkedToNominations: true,
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('signl_job_postings') || '[]')
    setJobs(saved)
  }, [])

  const saveJobs = (updated) => {
    setJobs(updated)
    localStorage.setItem('signl_job_postings', JSON.stringify(updated))
  }

  const handleSubmit = () => {
    if (!form.title.trim()) return
    const job = {
      ...form,
      id: editingJob?.id || Date.now().toString(),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      createdAt: editingJob?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      applicants: editingJob?.applicants || 0,
    }

    let updated
    if (editingJob) {
      updated = jobs.map(j => j.id === editingJob.id ? job : j)
    } else {
      updated = [job, ...jobs]
    }
    saveJobs(updated)
    resetForm()
  }

  const resetForm = () => {
    setForm({ title: '', type: 'Internship', location: '', remote: false, description: '', requirements: '', skills: '', applicationUrl: '', linkedToNominations: true })
    setEditingJob(null)
    setShowForm(false)
  }

  const editJob = (job) => {
    setForm({ ...job, skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills })
    setEditingJob(job)
    setShowForm(true)
  }

  const toggleJobStatus = (jobId) => {
    const updated = jobs.map(j => j.id === jobId ? { ...j, status: j.status === 'active' ? 'paused' : 'active' } : j)
    saveJobs(updated)
  }

  const deleteJob = (jobId) => {
    saveJobs(jobs.filter(j => j.id !== jobId))
  }

  return (
    <CompanyLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Job Postings</h1>
            <p className="text-gray-400">Manage internships and job openings tied to the nomination flow</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all"
          >
            + New Posting
          </button>
        </div>

        {/* Job Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-lg my-8" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-4">{editingJob ? 'Edit Posting' : 'New Job Posting'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="Software Engineering Intern" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                      <option>Internship</option>
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Co-op</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Location</label>
                    <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="San Francisco, CA" />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={form.remote} onChange={e => setForm(f => ({ ...f, remote: e.target.checked }))} className="rounded bg-white/5 border-white/10" />
                  Remote-friendly
                </label>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 resize-none h-24" placeholder="Describe the role and responsibilities..." />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Requirements</label>
                  <textarea value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 resize-none h-20" placeholder="List requirements..." />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Skills (comma separated)</label>
                  <input type="text" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="React, Python, SQL" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">External Application URL (optional)</label>
                  <input type="url" value={form.applicationUrl} onChange={e => setForm(f => ({ ...f, applicationUrl: e.target.value }))} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="https://careers.yourcompany.com/apply" />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={form.linkedToNominations} onChange={e => setForm(f => ({ ...f, linkedToNominations: e.target.checked }))} className="rounded bg-white/5 border-white/10" />
                  Show to nominated students with matching skills
                </label>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={handleSubmit} className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700">{editingJob ? 'Update' : 'Publish'}</button>
                <button onClick={resetForm} className="px-4 py-2 border border-white/10 rounded-lg text-gray-400">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Job List */}
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.04] rounded-xl border border-white/[0.08]">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400 mb-2">No job postings yet</p>
            <p className="text-gray-500 text-sm mb-4">Create your first posting to attract peer-validated talent</p>
            <button onClick={() => setShowForm(true)} className="text-teal-400 hover:underline font-medium text-sm">Create Posting</button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{job.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${job.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                        {job.status === 'active' ? 'Active' : 'Paused'}
                      </span>
                      {job.linkedToNominations && (
                        <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 text-xs rounded-full font-medium">Nomination-Linked</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {job.type} &middot; {job.location || 'Location TBD'} {job.remote && '(Remote OK)'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editJob(job)} className="text-gray-500 hover:text-white p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => toggleJobStatus(job.id)} className="text-gray-500 hover:text-amber-400 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={job.status === 'active' ? "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" : "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"} /></svg>
                    </button>
                    <button onClick={() => deleteJob(job.id)} className="text-gray-500 hover:text-red-400 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                {job.description && <p className="text-sm text-gray-400 mb-3 line-clamp-2">{job.description}</p>}
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </CompanyLayout>
  )
}
