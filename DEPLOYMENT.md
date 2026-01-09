# 🚀 QUICK DEPLOYMENT GUIDE

## Deploy to Vercel in 5 Minutes

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
(Follow the email verification)

### Step 3: Deploy!
```bash
cd signl-website
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? (Select your account)
- Link to existing project? **N**
- Project name? **signl** (or whatever you want)
- Directory? **./ ** (just press Enter)
- Override settings? **N**

**That's it!** You'll get a live URL instantly.

### Step 4: Set Production Domain
```bash
vercel --prod
```

Your site is now live at: `https://signl.vercel.app` (or your custom domain)

---

## Alternative: GitHub + Vercel (Auto-deploy on push)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `signl-website` repo
4. Click "Deploy"

Done! Every push to `main` auto-deploys.

---

## Domain Setup (Optional)

### Using Vercel Domain (Free)
Your project is automatically at: `your-project-name.vercel.app`

### Using Custom Domain
1. Go to Vercel Dashboard > Your Project > Settings > Domains
2. Add your domain (e.g., `signl.co`)
3. Update DNS records (Vercel shows you exactly what to do)

---

## Environment Variables (For Firebase)

If using Firebase, add environment variables in Vercel:

1. Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add these:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - etc.

Then update `lib/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... etc
}
```

---

## Troubleshooting

**Build fails?**
- Make sure all files are committed
- Check there are no TypeScript errors
- Try `npm run build` locally first

**Site loads but looks broken?**
- Vercel might need a few seconds after first deploy
- Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)

**Can't find vercel command?**
- Make sure you ran `npm install -g vercel`
- Try closing and reopening your terminal

---

## Pro Tips

1. **Custom 404 Page**: Create `app/not-found.js`
2. **Analytics**: Vercel has built-in analytics (free!)
3. **Preview Deployments**: Every branch gets its own preview URL
4. **Instant Rollbacks**: One click to revert to previous version

---

Need help? The Vercel dashboard is super intuitive - just click around!
