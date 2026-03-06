'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CompanyLayout from '../CompanyLayout'

const STEPS = [
  {
    id: 'profile',
    title: 'Complete Your Company Profile',
    description: 'Add your company details, culture info, and what you look for in candidates.',
    link: '/company/profile',
    linkText: 'Edit Profile',
    check: (data) => !!(data.profile?.name && data.profile?.description && data.profile?.industry),
  },
  {
    id: 'job',
    title: 'Post Your First Job or Internship',
    description: 'Create a posting to attract peer-validated talent. Tie it to the nomination flow.',
    link: '/company/jobs',
    linkText: 'Create Posting',
    check: (data) => (data.jobs || []).length > 0,
  },
  {
    id: 'search',
    title: 'Search the Talent Pool',
    description: 'Browse peer-validated students and filter by major, skills, GPA, and more.',
    link: '/company/talent',
    linkText: 'Search Talent',
    check: (data) => data.hasSearched,
  },
  {
    id: 'pipeline',
    title: 'Add a Candidate to Your Pipeline',
    description: 'Start building your recruiting pipeline by adding interesting candidates.',
    link: '/company/pipeline',
    linkText: 'View Pipeline',
    check: (data) => {
      const pipeline = data.pipeline || {}
      return Object.values(pipeline).some(col => col?.length > 0)
    },
  },
  {
    id: 'message',
    title: 'Send Your First Message',
    description: 'Reach out to a student or request an introduction through their nominator.',
    link: '/company/messages',
    linkText: 'Send Message',
    check: (data) => (data.messages || []).length > 0,
  },
  {
    id: 'digest',
    title: 'Enable Weekly Digest',
    description: 'Get matched nominees delivered to your inbox every week.',
    link: '/company/settings',
    linkText: 'Configure',
    check: (data) => data.settings?.weeklyDigest !== false,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [completedSteps, setCompletedSteps] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('signl_company_profile') || '{}')
    const jobs = JSON.parse(localStorage.getItem('signl_job_postings') || '[]')
    const pipeline = JSON.parse(localStorage.getItem('signl_pipeline') || '{}')
    const messages = JSON.parse(localStorage.getItem('signl_messages') || '[]')
    const settings = JSON.parse(localStorage.getItem('signl_company_settings') || '{}')
    const hasSearched = !!localStorage.getItem('signl_has_searched')

    const data = { profile, jobs, pipeline, messages, settings, hasSearched }
    const completed = {}
    STEPS.forEach(step => {
      completed[step.id] = step.check(data)
    })
    setCompletedSteps(completed)
    setLoading(false)
  }, [])

  const completedCount = Object.values(completedSteps).filter(Boolean).length
  const progress = Math.round((completedCount / STEPS.length) * 100)
  const allComplete = completedCount === STEPS.length

  const markComplete = () => {
    const session = JSON.parse(localStorage.getItem('signl_company_session') || '{}')
    session.company = { ...session.company, onboardingComplete: true }
    localStorage.setItem('signl_company_session', JSON.stringify(session))
    router.push('/company/dashboard')
  }

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </CompanyLayout>
    )
  }

  return (
    <CompanyLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Signl!</h1>
          <p className="text-gray-400">Complete these steps to get the most out of your recruiting experience</p>
        </div>

        {/* Progress */}
        <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">{completedCount} of {STEPS.length} completed</span>
            <span className="text-sm font-bold text-teal-400">{progress}%</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, idx) => {
            const isComplete = completedSteps[step.id]
            return (
              <div key={step.id} className={`bg-white/[0.04] backdrop-blur-md border rounded-xl p-5 transition-all ${isComplete ? 'border-teal-500/20' : 'border-white/[0.08]'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-teal-500' : 'bg-white/10'}`}>
                    {isComplete ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <span className="text-sm font-medium text-gray-400">{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold ${isComplete ? 'text-teal-400' : 'text-white'}`}>{step.title}</h3>
                      {!isComplete && (
                        <Link href={step.link} className="text-sm text-teal-400 hover:underline flex-shrink-0">{step.linkText}</Link>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {allComplete && (
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-teal-500/30 rounded-xl p-6 mb-4">
              <div className="text-3xl mb-2">&#127881;</div>
              <h3 className="text-xl font-bold text-white mb-2">All Set!</h3>
              <p className="text-gray-400">You've completed all onboarding steps. You're ready to find amazing talent.</p>
            </div>
            <button onClick={markComplete} className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              Go to Dashboard
            </button>
          </div>
        )}

        {!allComplete && (
          <div className="mt-6 text-center">
            <button onClick={markComplete} className="text-sm text-gray-500 hover:text-gray-400">Skip for now</button>
          </div>
        )}
      </div>
    </CompanyLayout>
  )
}
