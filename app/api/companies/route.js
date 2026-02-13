import { NextResponse } from 'next/server'
import { db } from '../../../lib/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')
    const search = searchParams.get('search')

    if (!db) {
      // Mock companies for development
      const mockCompanies = [
        {
          id: '1',
          name: 'TechVenture Labs',
          industry: 'Technology',
          description: 'A fast-growing startup building AI-powered tools for education. We value innovation, collaboration, and creative problem-solving.',
          size: '50-200',
          location: 'San Francisco, CA',
          hiringRoles: ['Software Engineer Intern', 'Product Manager Intern', 'Data Analyst'],
          logo: null,
          website: 'https://techventurelabs.com',
          activelyHiring: true,
          joinedAt: new Date(Date.now() - 604800000).toISOString()
        },
        {
          id: '2',
          name: 'Summit Financial Group',
          industry: 'Finance',
          description: 'Leading financial advisory firm specializing in institutional asset management. Looking for analytical minds and strong communicators.',
          size: '200-1000',
          location: 'New York, NY',
          hiringRoles: ['Financial Analyst Intern', 'Investment Banking Analyst'],
          logo: null,
          website: 'https://summitfg.com',
          activelyHiring: true,
          joinedAt: new Date(Date.now() - 1209600000).toISOString()
        },
        {
          id: '3',
          name: 'GreenPath Consulting',
          industry: 'Consulting',
          description: 'Sustainability-focused management consulting firm helping Fortune 500 companies reduce their environmental impact.',
          size: '50-200',
          location: 'Remote',
          hiringRoles: ['Strategy Consultant Intern', 'Research Analyst'],
          logo: null,
          website: 'https://greenpath.co',
          activelyHiring: true,
          joinedAt: new Date(Date.now() - 2592000000).toISOString()
        },
        {
          id: '4',
          name: 'NovaBio Health',
          industry: 'Healthcare',
          description: 'Biotech company developing next-generation therapeutics. We\'re at the intersection of biology and technology.',
          size: '200-1000',
          location: 'Boston, MA',
          hiringRoles: ['Biotech Research Intern', 'Lab Technician', 'Data Science Intern'],
          logo: null,
          website: 'https://novabiohealth.com',
          activelyHiring: false,
          joinedAt: new Date(Date.now() - 3888000000).toISOString()
        },
        {
          id: '5',
          name: 'Pixel & Frame Studios',
          industry: 'Media & Entertainment',
          description: 'Creative agency producing immersive digital experiences for global brands. We blend design, storytelling, and technology.',
          size: '10-50',
          location: 'Los Angeles, CA',
          hiringRoles: ['UX Design Intern', 'Frontend Developer'],
          logo: null,
          website: 'https://pixelframe.io',
          activelyHiring: true,
          joinedAt: new Date(Date.now() - 5184000000).toISOString()
        },
        {
          id: '6',
          name: 'Crestline Engineering',
          industry: 'Engineering',
          description: 'Structural engineering firm working on landmark projects across the western US. Hands-on experience guaranteed.',
          size: '50-200',
          location: 'Salt Lake City, UT',
          hiringRoles: ['Civil Engineering Intern', 'Structural Analyst'],
          logo: null,
          website: 'https://crestline-eng.com',
          activelyHiring: true,
          joinedAt: new Date(Date.now() - 1728000000).toISOString()
        }
      ]

      let filtered = mockCompanies
      if (industry && industry !== 'all') {
        filtered = filtered.filter(c => c.industry.toLowerCase() === industry.toLowerCase())
      }
      if (search) {
        const s = search.toLowerCase()
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(s) ||
          c.description.toLowerCase().includes(s) ||
          c.hiringRoles.some(r => r.toLowerCase().includes(s))
        )
      }

      return NextResponse.json({
        success: true,
        companies: filtered,
        industries: ['Technology', 'Finance', 'Consulting', 'Healthcare', 'Media & Entertainment', 'Engineering'],
        count: filtered.length
      })
    }

    // Query companies from Firestore
    const companiesRef = collection(db, 'companies')
    let companiesQuery = query(companiesRef, where('status', '==', 'active'))

    if (industry && industry !== 'all') {
      companiesQuery = query(companiesRef, where('status', '==', 'active'), where('industry', '==', industry))
    }

    const snapshot = await getDocs(companiesQuery)
    let companies = []

    snapshot.forEach(doc => {
      const data = doc.data()
      companies.push({
        id: doc.id,
        name: data.name,
        industry: data.industry || 'Other',
        description: data.description || '',
        size: data.size || 'Unknown',
        location: data.location || 'Not specified',
        hiringRoles: data.hiringRoles || [],
        logo: data.logo || null,
        website: data.website || null,
        activelyHiring: data.activelyHiring || false,
        joinedAt: data.createdAt
      })
    })

    if (search) {
      const s = search.toLowerCase()
      companies = companies.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.description.toLowerCase().includes(s) ||
        c.hiringRoles.some(r => r.toLowerCase().includes(s))
      )
    }

    // Get unique industries
    const industries = [...new Set(companies.map(c => c.industry))].sort()

    return NextResponse.json({
      success: true,
      companies,
      industries,
      count: companies.length
    })
  } catch (error) {
    console.error('Companies fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}
