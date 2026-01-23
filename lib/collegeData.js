// College and Major data for BYU and UVU
// Comprehensive lists of undergraduate programs

export const colleges = ['BYU', 'UVU']

export const majorsByCollege = {
  BYU: [
    // Business
    'Accounting',
    'Business Management',
    'Entrepreneurship',
    'Finance',
    'Global Supply Chain Management',
    'Human Resource Management',
    'Information Systems',
    'Marketing',
    'Strategic Management',

    // Engineering & Technology
    'Chemical Engineering',
    'Civil Engineering',
    'Computer Engineering',
    'Computer Science',
    'Construction Management',
    'Cybersecurity',
    'Electrical Engineering',
    'Information Technology',
    'Manufacturing Engineering',
    'Mechanical Engineering',
    'Software Engineering',
    'Technology Management',

    // Physical & Mathematical Sciences
    'Applied Mathematics',
    'Biochemistry',
    'Bioinformatics',
    'Biology',
    'Chemistry',
    'Data Science',
    'Geology',
    'Mathematics',
    'Physics',
    'Statistics',

    // Life Sciences
    'Dietetics',
    'Exercise Science',
    'Genetics and Biotechnology',
    'Microbiology',
    'Molecular Biology',
    'Neuroscience',
    'Physiology and Developmental Biology',
    'Public Health',

    // Social Sciences
    'Anthropology',
    'Economics',
    'Geography',
    'History',
    'International Relations',
    'Political Science',
    'Psychology',
    'Sociology',

    // Communications
    'Advertising',
    'Broadcast Journalism',
    'Communications',
    'Media Arts Studies',
    'Public Relations',

    // Education
    'Early Childhood Education',
    'Elementary Education',
    'Secondary Education',
    'Special Education',

    // Fine Arts & Communications
    'Animation',
    'Art',
    'Dance',
    'Design',
    'Film',
    'Graphic Design',
    'Music',
    'Theatre Arts',

    // Humanities
    'American Studies',
    'Art History',
    'Comparative Literature',
    'English',
    'French',
    'German',
    'Linguistics',
    'Philosophy',
    'Portuguese',
    'Spanish',

    // Family, Home & Social Sciences
    'Family Life',
    'Human Development',
    'Marriage and Family Studies',
    'Social Work',

    // Nursing
    'Nursing',

    // Other
    'Food Science',
    'Recreation Management',
    'Other'
  ],

  UVU: [
    // Business
    'Accounting',
    'Business Administration',
    'Business Management',
    'Digital Marketing',
    'Economics',
    'Entrepreneurship',
    'Finance',
    'Hospitality Management',
    'Human Resource Management',
    'Information Systems',
    'Management',
    'Marketing',
    'Operations Management',
    'Personal Financial Planning',

    // Engineering & Technology
    'Civil Engineering Technology',
    'Computer Engineering',
    'Computer Science',
    'Construction Management',
    'Cybersecurity',
    'Electrical Engineering',
    'Information Technology',
    'Mechanical Engineering',
    'Mechatronics Engineering',
    'Network Administration',
    'Software Development',
    'Software Engineering',
    'Web Design & Development',

    // Science
    'Biochemistry',
    'Biology',
    'Botany',
    'Chemistry',
    'Data Science',
    'Earth Science',
    'Environmental Science',
    'Mathematics',
    'Microbiology',
    'Physics',
    'Statistics',
    'Zoology',

    // Health Sciences
    'Behavioral Science',
    'Community Health',
    'Dental Hygiene',
    'Emergency Services',
    'Exercise Science',
    'Health Administration',
    'Nursing',
    'Public Health',

    // Social Sciences
    'Anthropology',
    'Criminal Justice',
    'Geography',
    'History',
    'National Security Studies',
    'Political Science',
    'Psychology',
    'Social Work',
    'Sociology',

    // Arts & Communications
    'Animation',
    'Art',
    'Broadcasting',
    'Communication',
    'Dance',
    'Digital Media',
    'Film',
    'Graphic Design',
    'Journalism',
    'Music',
    'Photography',
    'Public Relations',
    'Theatre',

    // Education
    'Early Childhood Education',
    'Elementary Education',
    'Secondary Education',
    'Special Education',

    // Humanities
    'American Sign Language',
    'English',
    'French',
    'German',
    'Integrated Studies',
    'Philosophy',
    'Spanish',

    // Aviation
    'Aviation Science',
    'Professional Pilot',

    // Other
    'Culinary Arts',
    'Family Studies',
    'Interior Design',
    'Legal Studies',
    'Paralegal Studies',
    'Other'
  ]
}

// Helper function to get majors for a specific college
export function getMajorsForCollege(college) {
  return majorsByCollege[college] || []
}

// All unique skills for endorsements
export const allSkills = [
  'Problem Solving',
  'Communication',
  'Technical Skills',
  'Leadership',
  'Teamwork',
  'Creativity',
  'Reliability',
  'Work Ethic',
  'Attention to Detail'
]
