# Signl - Peer-Validated College Recruiting Platform

A modern, professional website for Signl's peer-validated talent platform.

## 🚀 Features

- **Landing Page**: Professional B2B SaaS-style homepage with value proposition
- **Student Survey**: Multi-step form for collecting peer nominations
- **Admin Dashboard**: View responses, stats, and manage nominations
- **Modern Design**: Clean, trustworthy aesthetic with smooth animations
- **Mobile Responsive**: Works perfectly on all devices

## 📋 Pages

1. **Home (`/`)**: Landing page with company info, value prop, and CTAs
2. **Survey (`/survey`)**: 3-step student survey form
3. **Admin Dashboard (`/admin`)**: Protected admin panel with analytics

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore (ready to integrate)
- **Deployment**: Vercel (recommended)

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Firebase account (for database)

### Steps

1. **Install dependencies**:
```bash
npm install
```

2. **Set up Firebase** (optional but recommended):
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Firestore Database
   - Get your config from Project Settings > Your Apps
   - Update `lib/firebase.js` with your credentials

3. **Run development server**:
```bash
npm run dev
```

4. **Open browser**:
   Navigate to `http://localhost:3000`

## 🚀 Deployment to Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Follow prompts**:
   - Link to existing project or create new
   - Vercel will auto-detect Next.js
   - Your site will be live in ~30 seconds!

### Option 2: GitHub + Vercel (Automatic Deployments)

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel auto-configures everything
6. Every push to `main` branch auto-deploys!

## 🔐 Admin Access

Default admin password: `signl2024`

To change the password, edit `/app/admin/page.js` line 69:
```javascript
if (password === 'YOUR_NEW_PASSWORD') {
```

**IMPORTANT**: For production, implement proper authentication!

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: { ... },  // Blue colors
  accent: { ... },   // Teal colors
}
```

### Content

- **Landing page copy**: Edit `/app/page.js`
- **Survey questions**: Edit `/app/survey/page.js`
- **Admin dashboard**: Edit `/app/admin/page.js`

## 📊 Firebase Integration

To connect survey submissions to Firebase:

1. Update `/app/survey/page.js` in the `handleSubmit` function:

```javascript
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

const handleSubmit = async (e) => {
  e.preventDefault()
  
  try {
    await addDoc(collection(db, 'responses'), {
      ...formData,
      submittedAt: new Date().toISOString()
    })
    setSubmitted(true)
  } catch (error) {
    console.error('Error submitting survey:', error)
    alert('Error submitting survey. Please try again.')
  }
}
```

2. Update `/app/admin/page.js` to fetch real data:

```javascript
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'

// Inside component:
const [responses, setResponses] = useState([])

useEffect(() => {
  const fetchResponses = async () => {
    const querySnapshot = await getDocs(collection(db, 'responses'))
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setResponses(data)
  }
  fetchResponses()
}, [])
```

## 📁 Project Structure

```
signl-website/
├── app/
│   ├── admin/
│   │   └── page.js          # Admin dashboard
│   ├── survey/
│   │   └── page.js          # Student survey form
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout
│   └── page.js              # Landing page
├── lib/
│   └── firebase.js          # Firebase config
├── public/                  # Static assets
├── package.json
├── tailwind.config.js       # Tailwind settings
└── next.config.js           # Next.js config
```

## 🎯 Next Steps

### Immediate (For Demo):
1. Deploy to Vercel (takes 2 minutes)
2. Share the live link with recruiters
3. Collect feedback

### Short-term (Week 1-2):
1. Set up Firebase Firestore
2. Connect survey form to database
3. Connect admin dashboard to real data
4. Add email verification
5. Implement proper authentication

### Medium-term (Week 3-4):
1. Add ranking algorithm
2. Build student opt-in flow
3. Create company preview page
4. Add email notifications
5. Export functionality

## 💡 Tips

- **Testing Survey**: Fill out the form multiple times to see how it works
- **Admin Password**: Remember it's `signl2024` (change for production!)
- **Mobile Testing**: Open on your phone - it's fully responsive
- **Speed**: Next.js makes it lightning fast

## 🐛 Troubleshooting

**Port already in use?**
```bash
npm run dev -- -p 3001
```

**Module not found errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Firebase errors?**
- Make sure you've updated `lib/firebase.js` with your credentials
- Check Firebase Console > Firestore Database is enabled

## 📞 Support

Questions? Issues? Reach out to Isaac or check the Next.js docs:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)

---

Built with ❤️ for Signl
