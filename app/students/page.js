'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock student data - shows what companies would see (demo data)
const mockStudents = [
  {
    id: 1,
    name: 'Sarah Chen',
    major: 'Computer Science',
    gradYear: 'May 2025',
    careerInterests: 'Software Engineering, Machine Learning',
    githubUrl: 'https://github.com/sarahchen',
    peerScore: 95,
    nominationCount: 12,
    topSkills: ['Technical Skills', 'Problem Solving', 'Communication'],
    gpa: 3.85,
    peerFeedback: [
      'Consistently delivers high-quality code and helps debug team issues',
      'Great at explaining complex concepts and mentoring others',
      'Reliable team player who always meets deadlines'
    ]
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    major: 'Information Systems',
    gradYear: 'December 2025',
    careerInterests: 'Product Management, Business Analysis',
    portfolioUrl: 'https://marcusj.com',
    peerScore: 92,
    nominationCount: 10,
    topSkills: ['Leadership', 'Communication', 'Problem Solving'],
    gpa: 3.72,
    peerFeedback: [
      'Excellent at coordinating team efforts and keeping projects on track',
      'Strong analytical skills and creative problem-solver',
      'Very organized and professional in all interactions'
    ]
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    major: 'Computer Science',
    gradYear: 'May 2025',
    careerInterests: 'Full-Stack Development, Cloud Architecture',
    githubUrl: 'https://github.com/erodriguez',
    peerScore: 89,
    nominationCount: 9,
    topSkills: ['Technical Skills', 'Creativity', 'Teamwork'],
    gpa: 3.91,
    peerFeedback: [
      'Innovative thinker who brings creative solutions to technical challenges',
      'Great collaborator who helps others succeed',
      'Strong work ethic and attention to detail'
    ]
  },
  {
    id: 4,
    name: 'David Park',
    major: 'Business Analytics',
    gradYear: 'May 2026',
    careerInterests: 'Data Analysis, Business Intelligence',
    portfolioUrl: 'https://davidpark.io',
    peerScore: 88,
    nominationCount: 8,
    topSkills: ['Attention to Detail', 'Problem Solving', 'Communication'],
    gpa: 3.68,
    peerFeedback: [
      'Excellent at data visualization and presenting insights clearly',
      'Detail-oriented and catches errors others miss',
      'Positive attitude that motivates the entire team'
    ]
  },
  {
    id: 5,
    name: 'Jessica Liu',
    major: 'Computer Science',
    gradYear: 'August 2025',
    careerInterests: 'Software Engineering, DevOps',
    githubUrl: 'https://github.com/jliu',
    peerScore: 94,
    nominationCount: 11,
    topSkills: ['Technical Skills', 'Reliability', 'Work Ethic'],
    gpa: 3.79,
    peerFeedback: [
      'Always delivers on commitments and goes above and beyond',
      'Strong technical foundation and quick learner',
      'Great at automating processes and improving workflow'
    ]
  },
  {
    id: 6,
    name: 'Alex Thompson',
    major: 'Information Systems',
    gradYear: 'May 2025',
    careerInterests: 'Consulting, Project Management',
    portfolioUrl: 'https://alexthompson.com',
    peerScore: 87,
    nominationCount: 7,
    topSkills: ['Leadership', 'Teamwork', 'Communication'],
    gpa: 3.64,
    peerFeedback: [
      'Natural leader who brings out the best in team members',
      'Excellent communicator with clients and stakeholders',
      'Organized and keeps projects moving forward'
    ]
  },
  {
    id: 7,
    name: 'Michael Chang',
    major: 'Finance',
    gradYear: 'May 2025',
    careerInterests: 'Investment Banking, Corporate Finance',
    linkedinUrl: 'https://linkedin.com/in/michaelchang',
    peerScore: 91,
    nominationCount: 10,
    topSkills: ['Attention to Detail', 'Problem Solving', 'Leadership'],
    gpa: 3.82,
    peerFeedback: [
      'Exceptional analytical skills and financial modeling expertise',
      'Always prepared and contributes valuable insights',
      'Great at breaking down complex financial concepts for the team'
    ]
  },
  {
    id: 8,
    name: 'Rachel Martinez',
    major: 'Marketing',
    gradYear: 'December 2025',
    careerInterests: 'Brand Management, Digital Marketing',
    linkedinUrl: 'https://linkedin.com/in/rachelmartinez',
    peerScore: 93,
    nominationCount: 11,
    topSkills: ['Creativity', 'Communication', 'Teamwork'],
    gpa: 3.76,
    peerFeedback: [
      'Creative problem solver with excellent campaign ideas',
      'Strong presentation skills and confident communicator',
      'Very collaborative and values team input'
    ]
  },
  {
    id: 9,
    name: 'Kevin Wu',
    major: 'Computer Science',
    gradYear: 'May 2026',
    careerInterests: 'Backend Development, Database Architecture',
    githubUrl: 'https://github.com/kevinwu',
    peerScore: 90,
    nominationCount: 9,
    topSkills: ['Technical Skills', 'Problem Solving', 'Reliability'],
    gpa: 3.88,
    peerFeedback: [
      'Strong database design skills and optimization knowledge',
      'Patient teacher who helps teammates understand concepts',
      'Writes clean, well-documented code'
    ]
  },
  {
    id: 10,
    name: 'Amanda Foster',
    major: 'Accounting',
    gradYear: 'May 2025',
    careerInterests: 'Public Accounting, Tax Advisory',
    linkedinUrl: 'https://linkedin.com/in/amandafoster',
    peerScore: 88,
    nominationCount: 8,
    topSkills: ['Attention to Detail', 'Work Ethic', 'Communication'],
    gpa: 3.91,
    peerFeedback: [
      'Incredibly thorough and catches every detail in audits',
      'Reliable teammate who always meets deadlines',
      'Great at explaining accounting principles clearly'
    ]
  },
  {
    id: 11,
    name: 'James Wilson',
    major: 'Computer Science',
    gradYear: 'December 2025',
    careerInterests: 'Cybersecurity, Network Engineering',
    githubUrl: 'https://github.com/jameswilson',
    peerScore: 92,
    nominationCount: 10,
    topSkills: ['Technical Skills', 'Problem Solving', 'Attention to Detail'],
    gpa: 3.79,
    peerFeedback: [
      'Deep knowledge of security principles and best practices',
      'Proactive in identifying potential vulnerabilities',
      'Great team player who shares knowledge willingly'
    ]
  },
  {
    id: 12,
    name: 'Sophia Patel',
    major: 'Management',
    gradYear: 'May 2026',
    careerInterests: 'Operations Management, Strategy Consulting',
    linkedinUrl: 'https://linkedin.com/in/sophiapatel',
    peerScore: 94,
    nominationCount: 12,
    topSkills: ['Leadership', 'Problem Solving', 'Communication'],
    gpa: 3.85,
    peerFeedback: [
      'Natural leader with excellent organizational skills',
      'Strategic thinker who sees the big picture',
      'Exceptional at facilitating group discussions'
    ]
  },
  {
    id: 13,
    name: 'Tyler Anderson',
    major: 'Information Systems',
    gradYear: 'May 2025',
    careerInterests: 'IT Consulting, Systems Analysis',
    portfolioUrl: 'https://tyleranderson.dev',
    peerScore: 86,
    nominationCount: 8,
    topSkills: ['Problem Solving', 'Communication', 'Teamwork'],
    gpa: 3.71,
    peerFeedback: [
      'Great at bridging technical and business requirements',
      'Clear communicator who keeps everyone informed',
      'Strong problem solver with creative solutions'
    ]
  },
  {
    id: 14,
    name: 'Lauren Kim',
    major: 'Business Analytics',
    gradYear: 'December 2025',
    careerInterests: 'Data Science, Business Intelligence',
    linkedinUrl: 'https://linkedin.com/in/laurenkim',
    peerScore: 95,
    nominationCount: 13,
    topSkills: ['Problem Solving', 'Technical Skills', 'Communication'],
    gpa: 3.93,
    peerFeedback: [
      'Outstanding at statistical analysis and visualization',
      'Translates complex data insights into actionable recommendations',
      'Mentor to peers learning analytics tools'
    ]
  },
  {
    id: 15,
    name: 'Brandon Lee',
    major: 'Computer Science',
    gradYear: 'May 2026',
    careerInterests: 'Mobile Development, UI/UX Design',
    githubUrl: 'https://github.com/brandonlee',
    peerScore: 89,
    nominationCount: 9,
    topSkills: ['Creativity', 'Technical Skills', 'Attention to Detail'],
    gpa: 3.77,
    peerFeedback: [
      'Creates beautiful, intuitive user interfaces',
      'Strong eye for design and user experience',
      'Collaborative and open to feedback'
    ]
  },
  {
    id: 16,
    name: 'Nicole Harris',
    major: 'Finance',
    gradYear: 'May 2025',
    careerInterests: 'Financial Planning, Wealth Management',
    linkedinUrl: 'https://linkedin.com/in/nicoleharris',
    peerScore: 87,
    nominationCount: 8,
    topSkills: ['Communication', 'Problem Solving', 'Work Ethic'],
    gpa: 3.68,
    peerFeedback: [
      'Excellent client-facing skills and professionalism',
      'Strong understanding of investment strategies',
      'Detail-oriented with financial calculations'
    ]
  },
  {
    id: 17,
    name: 'Christopher Taylor',
    major: 'Computer Science',
    gradYear: 'August 2025',
    careerInterests: 'AI/ML Engineering, Data Science',
    githubUrl: 'https://github.com/ctaylor',
    peerScore: 96,
    nominationCount: 14,
    topSkills: ['Technical Skills', 'Problem Solving', 'Creativity'],
    gpa: 3.94,
    peerFeedback: [
      'Deep expertise in machine learning algorithms',
      'Innovative thinker who pushes project boundaries',
      'Patient mentor who helps others learn ML concepts'
    ]
  },
  {
    id: 18,
    name: 'Ashley Brown',
    major: 'Marketing',
    gradYear: 'May 2026',
    careerInterests: 'Social Media Marketing, Content Strategy',
    linkedinUrl: 'https://linkedin.com/in/ashleybrown',
    peerScore: 90,
    nominationCount: 10,
    topSkills: ['Creativity', 'Communication', 'Leadership'],
    gpa: 3.73,
    peerFeedback: [
      'Exceptional at creating engaging social media content',
      'Data-driven approach to campaign optimization',
      'Great team leader on group marketing projects'
    ]
  },
  {
    id: 19,
    name: 'Ryan Mitchell',
    major: 'Information Systems',
    gradYear: 'December 2025',
    careerInterests: 'Business Intelligence, Data Analytics',
    portfolioUrl: 'https://ryanmitchell.io',
    peerScore: 88,
    nominationCount: 9,
    topSkills: ['Problem Solving', 'Technical Skills', 'Teamwork'],
    gpa: 3.81,
    peerFeedback: [
      'Strong SQL and data visualization skills',
      'Excellent at identifying business insights from data',
      'Reliable team member who delivers quality work'
    ]
  },
  {
    id: 20,
    name: 'Megan Davis',
    major: 'Accounting',
    gradYear: 'May 2025',
    careerInterests: 'Audit, Forensic Accounting',
    linkedinUrl: 'https://linkedin.com/in/megandavis',
    peerScore: 91,
    nominationCount: 10,
    topSkills: ['Attention to Detail', 'Problem Solving', 'Work Ethic'],
    gpa: 3.89,
    peerFeedback: [
      'Meticulous attention to detail in complex audits',
      'Strong analytical skills for investigating discrepancies',
      'Professional demeanor and excellent work ethic'
    ]
  },
  {
    id: 21,
    name: 'Daniel Garcia',
    major: 'Computer Science',
    gradYear: 'May 2026',
    careerInterests: 'Full-Stack Development, Software Architecture',
    githubUrl: 'https://github.com/danielgarcia',
    peerScore: 93,
    nominationCount: 11,
    topSkills: ['Technical Skills', 'Leadership', 'Problem Solving'],
    gpa: 3.86,
    peerFeedback: [
      'Versatile developer comfortable with front and backend',
      'Strong architectural thinking and system design',
      'Leads code reviews with constructive feedback'
    ]
  },
  {
    id: 22,
    name: 'Emma Nelson',
    major: 'Economics',
    gradYear: 'May 2025',
    careerInterests: 'Economic Research, Policy Analysis',
    linkedinUrl: 'https://linkedin.com/in/emmanelson',
    peerScore: 89,
    nominationCount: 9,
    topSkills: ['Problem Solving', 'Communication', 'Attention to Detail'],
    gpa: 3.92,
    peerFeedback: [
      'Excellent research skills and economic modeling',
      'Clear writer who explains complex concepts well',
      'Thorough in data analysis and interpretation'
    ]
  },
  {
    id: 23,
    name: 'Justin Wang',
    major: 'Computer Science',
    gradYear: 'December 2025',
    careerInterests: 'Game Development, Graphics Programming',
    githubUrl: 'https://github.com/justinwang',
    peerScore: 87,
    nominationCount: 8,
    topSkills: ['Creativity', 'Technical Skills', 'Teamwork'],
    gpa: 3.74,
    peerFeedback: [
      'Creative game designer with strong programming skills',
      'Great at 3D graphics and shader programming',
      'Fun to work with and brings energy to projects'
    ]
  },
  {
    id: 24,
    name: 'Olivia Carter',
    major: 'Management',
    gradYear: 'May 2026',
    careerInterests: 'Human Resources, Organizational Development',
    linkedinUrl: 'https://linkedin.com/in/oliviacarter',
    peerScore: 92,
    nominationCount: 11,
    topSkills: ['Leadership', 'Communication', 'Teamwork'],
    gpa: 3.78,
    peerFeedback: [
      'Exceptional interpersonal skills and emotional intelligence',
      'Great at conflict resolution and team building',
      'Natural leader who empowers team members'
    ]
  },
  {
    id: 25,
    name: 'Matthew Robinson',
    major: 'Business Analytics',
    gradYear: 'May 2025',
    careerInterests: 'Predictive Analytics, Data Modeling',
    linkedinUrl: 'https://linkedin.com/in/matthewrobinson',
    peerScore: 94,
    nominationCount: 12,
    topSkills: ['Technical Skills', 'Problem Solving', 'Communication'],
    gpa: 3.87,
    peerFeedback: [
      'Advanced skills in predictive modeling and forecasting',
      'Great at presenting technical findings to non-technical audiences',
      'Collaborative approach to solving business problems'
    ]
  },
  {
    id: 26,
    name: 'Hannah Scott',
    major: 'Marketing',
    gradYear: 'December 2025',
    careerInterests: 'Product Marketing, Market Research',
    linkedinUrl: 'https://linkedin.com/in/hannahscott',
    peerScore: 88,
    nominationCount: 9,
    topSkills: ['Communication', 'Creativity', 'Problem Solving'],
    gpa: 3.71,
    peerFeedback: [
      'Strong market research and consumer insights skills',
      'Creative thinker with data-backed strategies',
      'Excellent presentation and storytelling abilities'
    ]
  },
  {
    id: 27,
    name: 'Andrew Phillips',
    major: 'Computer Science',
    gradYear: 'May 2026',
    careerInterests: 'Cloud Engineering, Infrastructure',
    githubUrl: 'https://github.com/andrewphillips',
    peerScore: 91,
    nominationCount: 10,
    topSkills: ['Technical Skills', 'Problem Solving', 'Reliability'],
    gpa: 3.83,
    peerFeedback: [
      'Deep knowledge of AWS and cloud architecture',
      'Excellent at automating deployment pipelines',
      'Reliable and always delivers on commitments'
    ]
  },
  {
    id: 28,
    name: 'Victoria Moore',
    major: 'Finance',
    gradYear: 'May 2025',
    careerInterests: 'Risk Management, Financial Analysis',
    linkedinUrl: 'https://linkedin.com/in/victoriamoore',
    peerScore: 90,
    nominationCount: 10,
    topSkills: ['Problem Solving', 'Attention to Detail', 'Communication'],
    gpa: 3.84,
    peerFeedback: [
      'Strong risk assessment and mitigation skills',
      'Detail-oriented with financial models and forecasts',
      'Clear communicator of complex financial concepts'
    ]
  },
  {
    id: 29,
    name: 'Nathan Young',
    major: 'Information Systems',
    gradYear: 'August 2025',
    careerInterests: 'IT Project Management, Business Process',
    portfolioUrl: 'https://nathanyoung.dev',
    peerScore: 86,
    nominationCount: 8,
    topSkills: ['Leadership', 'Communication', 'Problem Solving'],
    gpa: 3.69,
    peerFeedback: [
      'Excellent at managing project timelines and deliverables',
      'Strong communicator across technical and business teams',
      'Organized and detail-oriented project leader'
    ]
  },
  {
    id: 30,
    name: 'Isabella Martinez',
    major: 'Computer Science',
    gradYear: 'May 2026',
    careerInterests: 'Software Engineering, Quality Assurance',
    githubUrl: 'https://github.com/imartinez',
    peerScore: 89,
    nominationCount: 9,
    topSkills: ['Technical Skills', 'Attention to Detail', 'Teamwork'],
    gpa: 3.76,
    peerFeedback: [
      'Thorough testing approach that catches edge cases',
      'Strong automation and testing framework knowledge',
      'Great team player who improves overall code quality'
    ]
  },
  {
    id: 31,
    name: 'Ethan Lewis',
    major: 'Accounting',
    gradYear: 'December 2025',
    careerInterests: 'Corporate Accounting, Financial Reporting',
    linkedinUrl: 'https://linkedin.com/in/ethanlewis',
    peerScore: 87,
    nominationCount: 8,
    topSkills: ['Attention to Detail', 'Work Ethic', 'Problem Solving'],
    gpa: 3.88,
    peerFeedback: [
      'Meticulous with financial statements and reports',
      'Strong understanding of GAAP and accounting standards',
      'Reliable teammate who produces quality work'
    ]
  },
  {
    id: 32,
    name: 'Samantha Turner',
    major: 'Marketing',
    gradYear: 'May 2025',
    careerInterests: 'Email Marketing, Marketing Automation',
    linkedinUrl: 'https://linkedin.com/in/samanthaturner',
    peerScore: 85,
    nominationCount: 7,
    topSkills: ['Creativity', 'Technical Skills', 'Communication'],
    gpa: 3.67,
    peerFeedback: [
      'Expert at email campaign optimization and A/B testing',
      'Strong technical skills with marketing platforms',
      'Data-driven approach to campaign performance'
    ]
  },
  {
    id: 33,
    name: 'Jacob Hill',
    major: 'Computer Science',
    gradYear: 'May 2026',
    careerInterests: 'Backend Development, API Design',
    githubUrl: 'https://github.com/jacobhill',
    peerScore: 92,
    nominationCount: 11,
    topSkills: ['Technical Skills', 'Problem Solving', 'Communication'],
    gpa: 3.81,
    peerFeedback: [
      'Excellent REST API design and implementation',
      'Strong database optimization skills',
      'Clear documentation and code comments'
    ]
  },
  {
    id: 34,
    name: 'Grace Allen',
    major: 'Management',
    gradYear: 'May 2025',
    careerInterests: 'Supply Chain Management, Logistics',
    linkedinUrl: 'https://linkedin.com/in/graceallen',
    peerScore: 88,
    nominationCount: 9,
    topSkills: ['Problem Solving', 'Leadership', 'Attention to Detail'],
    gpa: 3.72,
    peerFeedback: [
      'Strong analytical skills for supply chain optimization',
      'Great at coordinating complex logistics projects',
      'Detail-oriented with process improvement'
    ]
  },
  {
    id: 35,
    name: 'Joshua Wright',
    major: 'Business Analytics',
    gradYear: 'December 2025',
    careerInterests: 'Marketing Analytics, Customer Insights',
    linkedinUrl: 'https://linkedin.com/in/joshuawright',
    peerScore: 91,
    nominationCount: 10,
    topSkills: ['Problem Solving', 'Technical Skills', 'Communication'],
    gpa: 3.85,
    peerFeedback: [
      'Exceptional at customer segmentation and analysis',
      'Strong visualization skills with Tableau and Power BI',
      'Great at translating data into marketing strategies'
    ]
  },
  {
    id: 36,
    name: 'Abigail King',
    major: 'Finance',
    gradYear: 'May 2026',
    careerInterests: 'Mergers & Acquisitions, Valuation',
    linkedinUrl: 'https://linkedin.com/in/abigailking',
    peerScore: 93,
    nominationCount: 12,
    topSkills: ['Problem Solving', 'Attention to Detail', 'Communication'],
    gpa: 3.91,
    peerFeedback: [
      'Outstanding financial modeling and valuation skills',
      'Detail-oriented with due diligence processes',
      'Strong presentation skills for investment pitches'
    ]
  },
  {
    id: 37,
    name: 'Connor Baker',
    major: 'Computer Science',
    gradYear: 'May 2025',
    careerInterests: 'Software Engineering, Open Source',
    githubUrl: 'https://github.com/connorbaker',
    peerScore: 90,
    nominationCount: 10,
    topSkills: ['Technical Skills', 'Teamwork', 'Creativity'],
    gpa: 3.79,
    peerFeedback: [
      'Active open source contributor with strong portfolio',
      'Collaborative coder who practices pair programming',
      'Creative problem solver with elegant solutions'
    ]
  },
  {
    id: 38,
    name: 'Chloe Campbell',
    major: 'Economics',
    gradYear: 'December 2025',
    careerInterests: 'Economic Consulting, Quantitative Analysis',
    linkedinUrl: 'https://linkedin.com/in/chloecampbell',
    peerScore: 89,
    nominationCount: 9,
    topSkills: ['Problem Solving', 'Communication', 'Technical Skills'],
    gpa: 3.86,
    peerFeedback: [
      'Strong econometric analysis and statistical modeling',
      'Excellent at interpreting complex economic data',
      'Clear communicator of technical findings'
    ]
  },
  {
    id: 39,
    name: 'Dylan Green',
    major: 'Information Systems',
    gradYear: 'May 2026',
    careerInterests: 'Cybersecurity, Information Assurance',
    portfolioUrl: 'https://dylangreen.io',
    peerScore: 87,
    nominationCount: 8,
    topSkills: ['Technical Skills', 'Problem Solving', 'Attention to Detail'],
    gpa: 3.74,
    peerFeedback: [
      'Strong understanding of security frameworks and compliance',
      'Proactive in identifying system vulnerabilities',
      'Great team player on security projects'
    ]
  },
  {
    id: 40,
    name: 'Natalie Adams',
    major: 'Marketing',
    gradYear: 'May 2025',
    careerInterests: 'Brand Strategy, Consumer Behavior',
    linkedinUrl: 'https://linkedin.com/in/natalieadams',
    peerScore: 91,
    nominationCount: 11,
    topSkills: ['Creativity', 'Communication', 'Problem Solving'],
    gpa: 3.77,
    peerFeedback: [
      'Exceptional brand positioning and messaging skills',
      'Deep understanding of consumer psychology',
      'Creative strategist with strong execution'
    ]
  },
  {
    id: 41,
    name: 'Luke Martinez',
    major: 'Computer Science',
    gradYear: 'August 2025',
    careerInterests: 'Data Engineering, Big Data',
    githubUrl: 'https://github.com/lukemartinez',
    peerScore: 94,
    nominationCount: 12,
    topSkills: ['Technical Skills', 'Problem Solving', 'Work Ethic'],
    gpa: 3.89,
    peerFeedback: [
      'Expert in Spark, Hadoop, and distributed systems',
      'Builds efficient data pipelines at scale',
      'Strong work ethic and consistently delivers'
    ]
  },
  {
    id: 42,
    name: 'Lily Hernandez',
    major: 'Accounting',
    gradYear: 'May 2026',
    careerInterests: 'Management Accounting, Cost Analysis',
    linkedinUrl: 'https://linkedin.com/in/lilyhernandez',
    peerScore: 86,
    nominationCount: 8,
    topSkills: ['Attention to Detail', 'Problem Solving', 'Communication'],
    gpa: 3.83,
    peerFeedback: [
      'Strong cost accounting and variance analysis skills',
      'Detail-oriented with budgeting and forecasting',
      'Clear communicator of financial insights'
    ]
  },
  {
    id: 43,
    name: 'Caleb Jackson',
    major: 'Management',
    gradYear: 'December 2025',
    careerInterests: 'Entrepreneurship, Business Development',
    linkedinUrl: 'https://linkedin.com/in/calebjackson',
    peerScore: 92,
    nominationCount: 11,
    topSkills: ['Leadership', 'Creativity', 'Communication'],
    gpa: 3.68,
    peerFeedback: [
      'Entrepreneurial mindset with innovative ideas',
      'Strong networking and relationship building',
      'Natural leader who inspires team members'
    ]
  },
  {
    id: 44,
    name: 'Zoe Cooper',
    major: 'Computer Science',
    gradYear: 'May 2026',
    careerInterests: 'Frontend Development, Web Performance',
    githubUrl: 'https://github.com/zoecooper',
    peerScore: 88,
    nominationCount: 9,
    topSkills: ['Technical Skills', 'Creativity', 'Attention to Detail'],
    gpa: 3.75,
    peerFeedback: [
      'Expert at React and modern frontend frameworks',
      'Strong focus on web performance optimization',
      'Creates accessible, user-friendly interfaces'
    ]
  },
  {
    id: 45,
    name: 'Mason Reed',
    major: 'Finance',
    gradYear: 'May 2025',
    careerInterests: 'Private Equity, Venture Capital',
    linkedinUrl: 'https://linkedin.com/in/masonreed',
    peerScore: 95,
    nominationCount: 13,
    topSkills: ['Problem Solving', 'Leadership', 'Communication'],
    gpa: 3.94,
    peerFeedback: [
      'Outstanding investment analysis and due diligence',
      'Strong leadership in financial modeling projects',
      'Excellent presenter with persuasive communication'
    ]
  },
  {
    id: 46,
    name: 'Ella Richardson',
    major: 'Business Analytics',
    gradYear: 'May 2025',
    careerInterests: 'Operations Analytics, Process Optimization',
    linkedinUrl: 'https://linkedin.com/in/ellarichardson',
    peerScore: 89,
    nominationCount: 9,
    topSkills: ['Problem Solving', 'Technical Skills', 'Teamwork'],
    gpa: 3.80,
    peerFeedback: [
      'Strong process mapping and efficiency analysis',
      'Great at identifying bottlenecks and solutions',
      'Collaborative teammate on analytics projects'
    ]
  },
  {
    id: 47,
    name: 'Owen Stewart',
    major: 'Computer Science',
    gradYear: 'December 2025',
    careerInterests: 'Systems Programming, Operating Systems',
    githubUrl: 'https://github.com/owenstewart',
    peerScore: 91,
    nominationCount: 10,
    topSkills: ['Technical Skills', 'Problem Solving', 'Work Ethic'],
    gpa: 3.87,
    peerFeedback: [
      'Deep understanding of low-level programming concepts',
      'Excellent debugging and troubleshooting skills',
      'Reliable teammate who takes ownership'
    ]
  },
  {
    id: 48,
    name: 'Ava Morgan',
    major: 'Marketing',
    gradYear: 'May 2026',
    careerInterests: 'Growth Marketing, Performance Marketing',
    linkedinUrl: 'https://linkedin.com/in/avamorgan',
    peerScore: 90,
    nominationCount: 10,
    topSkills: ['Creativity', 'Technical Skills', 'Problem Solving'],
    gpa: 3.73,
    peerFeedback: [
      'Data-driven approach to growth experiments',
      'Strong technical skills with marketing tools',
      'Creative problem solver for user acquisition'
    ]
  },
  {
    id: 49,
    name: 'Logan Peterson',
    major: 'Information Systems',
    gradYear: 'May 2025',
    careerInterests: 'Enterprise Architecture, Digital Transformation',
    portfolioUrl: 'https://loganpeterson.com',
    peerScore: 88,
    nominationCount: 9,
    topSkills: ['Problem Solving', 'Communication', 'Leadership'],
    gpa: 3.76,
    peerFeedback: [
      'Strong understanding of enterprise systems integration',
      'Great at stakeholder communication and requirements',
      'Strategic thinker with implementation focus'
    ]
  },
  {
    id: 50,
    name: 'Madison Clark',
    major: 'Economics',
    gradYear: 'May 2026',
    careerInterests: 'Financial Economics, Market Analysis',
    linkedinUrl: 'https://linkedin.com/in/madisonclark',
    peerScore: 87,
    nominationCount: 8,
    topSkills: ['Problem Solving', 'Communication', 'Attention to Detail'],
    gpa: 3.84,
    peerFeedback: [
      'Strong market analysis and forecasting skills',
      'Excellent at economic modeling and simulation',
      'Clear communicator of complex market dynamics'
    ]
  },
  {
    id: 51,
    name: 'Carter Hughes',
    major: 'Computer Science',
    gradYear: 'May 2026',
    careerInterests: 'Blockchain Development, Cryptocurrency',
    githubUrl: 'https://github.com/carterhughes',
    peerScore: 90,
    nominationCount: 10,
    topSkills: ['Technical Skills', 'Creativity', 'Problem Solving'],
    gpa: 3.78,
    peerFeedback: [
      'Deep knowledge of blockchain technology and smart contracts',
      'Creative problem solver in decentralized systems',
      'Strong cryptography and security understanding'
    ]
  },
  {
    id: 52,
    name: 'Aria Ross',
    major: 'Management',
    gradYear: 'December 2025',
    careerInterests: 'Change Management, Organizational Leadership',
    linkedinUrl: 'https://linkedin.com/in/ariaross',
    peerScore: 93,
    nominationCount: 12,
    topSkills: ['Leadership', 'Communication', 'Teamwork'],
    gpa: 3.81,
    peerFeedback: [
      'Exceptional change management and leadership skills',
      'Great at motivating teams through transitions',
      'Strong emotional intelligence and people skills'
    ]
  },
  {
    id: 53,
    name: 'Wyatt Powell',
    major: 'Business Analytics',
    gradYear: 'May 2025',
    careerInterests: 'Financial Analytics, Risk Modeling',
    linkedinUrl: 'https://linkedin.com/in/wyattpowell',
    peerScore: 92,
    nominationCount: 11,
    topSkills: ['Technical Skills', 'Problem Solving', 'Attention to Detail'],
    gpa: 3.88,
    peerFeedback: [
      'Advanced statistical modeling and risk analysis',
      'Detail-oriented with complex financial models',
      'Great at communicating technical findings'
    ]
  },
  {
    id: 54,
    name: 'Scarlett Barnes',
    major: 'Computer Science',
    gradYear: 'August 2025',
    careerInterests: 'Embedded Systems, IoT Development',
    githubUrl: 'https://github.com/scarlettbarnes',
    peerScore: 89,
    nominationCount: 9,
    topSkills: ['Technical Skills', 'Problem Solving', 'Creativity'],
    gpa: 3.82,
    peerFeedback: [
      'Strong hardware and software integration skills',
      'Creative solutions for resource-constrained systems',
      'Great troubleshooting and debugging abilities'
    ]
  },
  {
    id: 55,
    name: 'Landon Kelly',
    major: 'Finance',
    gradYear: 'May 2026',
    careerInterests: 'Real Estate Finance, Investment Analysis',
    linkedinUrl: 'https://linkedin.com/in/landonkelly',
    peerScore: 88,
    nominationCount: 9,
    topSkills: ['Problem Solving', 'Communication', 'Attention to Detail'],
    gpa: 3.75,
    peerFeedback: [
      'Strong real estate valuation and investment analysis',
      'Detail-oriented with financial feasibility studies',
      'Great at presenting investment opportunities'
    ]
  },
  {
    id: 56,
    name: 'Penelope Long',
    major: 'Marketing',
    gradYear: 'December 2025',
    careerInterests: 'Event Marketing, Experiential Marketing',
    linkedinUrl: 'https://linkedin.com/in/penelopelong',
    peerScore: 86,
    nominationCount: 8,
    topSkills: ['Creativity', 'Leadership', 'Communication'],
    gpa: 3.69,
    peerFeedback: [
      'Exceptional event planning and execution skills',
      'Creative approach to brand experiences',
      'Strong project management and coordination'
    ]
  },
  {
    id: 57,
    name: 'Grayson Howard',
    major: 'Computer Science',
    gradYear: 'May 2026',
    careerInterests: 'Computer Vision, Robotics',
    githubUrl: 'https://github.com/graysonhoward',
    peerScore: 94,
    nominationCount: 12,
    topSkills: ['Technical Skills', 'Problem Solving', 'Creativity'],
    gpa: 3.91,
    peerFeedback: [
      'Deep expertise in computer vision algorithms',
      'Innovative approach to robotics challenges',
      'Strong mathematical foundation for ML applications'
    ]
  },
  {
    id: 58,
    name: 'Brooklyn Perry',
    major: 'Accounting',
    gradYear: 'May 2025',
    careerInterests: 'Internal Audit, Compliance',
    linkedinUrl: 'https://linkedin.com/in/brooklynperry',
    peerScore: 87,
    nominationCount: 8,
    topSkills: ['Attention to Detail', 'Work Ethic', 'Communication'],
    gpa: 3.86,
    peerFeedback: [
      'Thorough auditor with strong attention to detail',
      'Excellent understanding of internal controls',
      'Professional and ethical in all work'
    ]
  },
  {
    id: 59,
    name: 'Levi Jenkins',
    major: 'Information Systems',
    gradYear: 'May 2025',
    careerInterests: 'Product Management, Agile Development',
    portfolioUrl: 'https://levijenkins.dev',
    peerScore: 91,
    nominationCount: 10,
    topSkills: ['Leadership', 'Communication', 'Problem Solving'],
    gpa: 3.77,
    peerFeedback: [
      'Excellent product vision and roadmap planning',
      'Great at facilitating agile ceremonies and sprints',
      'Strong communicator across technical and business teams'
    ]
  },
  {
    id: 60,
    name: 'Nora Butler',
    major: 'Management',
    gradYear: 'December 2025',
    careerInterests: 'Operations Management, Continuous Improvement',
    linkedinUrl: 'https://linkedin.com/in/norabutler',
    peerScore: 89,
    nominationCount: 9,
    topSkills: ['Problem Solving', 'Leadership', 'Attention to Detail'],
    gpa: 3.73,
    peerFeedback: [
      'Strong lean/six sigma and process improvement skills',
      'Data-driven approach to operational efficiency',
      'Great team leader on improvement projects'
    ]
  },
]

export default function StudentsPreview() {
  const [selectedMajor, setSelectedMajor] = useState('All')
  const [selectedGradYear, setSelectedGradYear] = useState('All')
  const [selectedSkill, setSelectedSkill] = useState('All')
  const [selectedCareer, setSelectedCareer] = useState('All')
  const [selectedStudent, setSelectedStudent] = useState(null)

  // Demo page - only show mock data
  const allStudents = mockStudents

  const majors = ['All', ...new Set(allStudents.map(s => s.major))]
  const gradYears = ['All', ...new Set(allStudents.map(s => s.gradYear))]
  const skills = ['All', 'Technical Skills', 'Problem Solving', 'Communication', 'Leadership', 'Teamwork', 'Creativity']
  const careers = ['All', 'Software Engineering', 'Product Management', 'Data Analysis', 'Consulting']

  const filteredStudents = allStudents.filter(student => {
    if (selectedMajor !== 'All' && student.major !== selectedMajor) return false
    if (selectedGradYear !== 'All' && student.gradYear !== selectedGradYear) return false
    if (selectedSkill !== 'All' && !student.topSkills.includes(selectedSkill)) return false
    if (selectedCareer !== 'All' && !student.careerInterests.includes(selectedCareer)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src="/logo.png.png" alt="Signl Logo" className="h-14 object-contain hover:opacity-90 transition-opacity" />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Company Preview</span>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Peer-Validated Student Talent</h1>
          <p className="text-gray-600">Browse top students validated by their peers at BYU</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filter Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Major</label>
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {majors.map(major => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Graduation</label>
              <select
                value={selectedGradYear}
                onChange={(e) => setSelectedGradYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {gradYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Top Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Career Interest</label>
              <select
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {careers.map(career => (
                  <option key={career} value={career}>{career}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredStudents.length} of {allStudents.length} students
          </div>
        </div>

        {/* Student Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`bg-white rounded-xl p-6 shadow-sm cursor-pointer transition-all hover:shadow-lg ${
                    selectedStudent?.id === student.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{student.major}</p>
                      <p className="text-sm text-gray-600">{student.gradYear}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{student.peerScore}</div>
                      <div className="text-xs text-gray-500">Peer Score</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-600 mb-2">Career Interests</div>
                    <p className="text-sm text-gray-700">{student.careerInterests}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {student.topSkills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      {student.nominationCount} peer nominations
                    </div>
                    <div className="text-xs text-gray-600">
                      GPA: {student.gpa}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Detail */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              {selectedStudent ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedStudent.name}</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Major</div>
                      <div className="text-gray-900">{selectedStudent.major}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Graduation</div>
                      <div className="text-gray-900">{selectedStudent.gradYear}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Career Interests</div>
                      <div className="text-gray-900">{selectedStudent.careerInterests}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">
                        {selectedStudent.linkedinUrl ? 'LinkedIn' : selectedStudent.githubUrl ? 'GitHub' : 'Portfolio'}
                      </div>
                      <a href={selectedStudent.linkedinUrl || selectedStudent.githubUrl || selectedStudent.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        {selectedStudent.linkedinUrl || selectedStudent.githubUrl || selectedStudent.portfolioUrl}
                      </a>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-600 mb-2">Top Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.topSkills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-600 mb-2">Peer Validation</div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{selectedStudent.peerScore}</div>
                      <div className="text-sm text-gray-600">{selectedStudent.nominationCount} nominations from peers</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-600 mb-2">Peer Feedback</div>
                    <div className="space-y-2">
                      {selectedStudent.peerFeedback.map((feedback, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                          "{feedback}"
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    Request Introduction
                  </button>
                </>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p>Select a student to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
