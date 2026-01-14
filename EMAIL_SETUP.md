# Email Verification Setup Guide

This guide will help you set up email verification for student account creation using Resend.

## Overview

The new email verification flow works as follows:

1. **Student enters email** on `/verify` page (any email address, not just BYU)
2. **Verification email sent** with a secure token link
3. **Student clicks link** in email, which takes them to `/student/signup?token=xxx&email=xxx`
4. **Token is verified** automatically, email is pre-filled and locked
5. **Student completes** the multi-step signup form
6. **Account created** in Firebase

## Setup Instructions

### 1. Sign Up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day on free tier)
3. Verify your email address

### 2. Get Your API Key

1. Log into Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "Signl Production")
5. Copy the API key (starts with `re_`)

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Resend API key:
   ```bash
   RESEND_API_KEY=re_your_actual_api_key_here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **IMPORTANT**: Never commit `.env.local` to git. It's already in `.gitignore`.

### 4. Configure Your Domain (For Production)

For production, you'll want to use your own domain for sending emails:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `signl.com`)
4. Add the DNS records Resend provides to your domain DNS settings
5. Wait for verification (usually takes a few minutes)
6. Update the email sending code in `/app/api/send-verification/route.js`:
   ```javascript
   from: 'Signl <noreply@yourdomain.com>', // Replace with your verified domain
   ```

**For development/testing**, you can use Resend's test domain:
- Keep `from: 'Signl <onboarding@resend.dev>'` in the code
- Emails will be sent but marked as "via resend.dev"

### 5. Test the Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/verify`

3. Enter any email address (your own for testing)

4. Check your email inbox for the verification email

5. Click the verification link

6. You should be redirected to the signup form with your email pre-filled

### 6. Deploy to Vercel

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the following variables:
   ```
   RESEND_API_KEY = re_your_api_key_here
   NEXT_PUBLIC_BASE_URL = https://your-app.vercel.app
   ```

4. Redeploy your application

## Firebase Configuration (Optional)

The verification tokens are stored in Firebase Firestore. If you haven't set up Firebase yet:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Enable **Firestore Database**
4. Update `/lib/firebase.js` with your Firebase config
5. Add Firebase environment variables to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

**Note**: The API routes have fallback logic, so the system will work in development mode even if Firebase isn't configured yet.

## Customizing the Email Template

The verification email template is in `/app/api/send-verification/route.js`. You can customize:

- **Email design**: Edit the HTML in the `html` parameter
- **Email subject**: Change the `subject` field
- **Sender name**: Update the `from` field
- **Link expiration**: Modify the token expiration time (currently 24 hours)

Example customization:
```javascript
await resend.emails.send({
  from: 'Your Company <hello@yourdomain.com>',
  to: [email],
  subject: 'Welcome! Verify your email',
  html: `...your custom HTML...`
})
```

## Troubleshooting

### Email not received
- Check spam/junk folder
- Verify your Resend API key is correct
- Check Resend dashboard for delivery logs
- Make sure you verified your domain (for production)

### "Email service not configured" error
- Make sure `RESEND_API_KEY` is set in `.env.local`
- Restart your development server after adding the env variable

### Verification link says "Invalid or expired"
- Links expire after 24 hours
- Each link can only be used once
- Make sure Firebase is configured correctly
- Check browser console for errors

### Emails go to spam
- Verify your domain in Resend (for production)
- Add SPF, DKIM, and DMARC records to your DNS
- Use a custom domain instead of `resend.dev`

## Security Best Practices

1. **Never commit** `.env.local` to git
2. **Use HTTPS** in production (Vercel does this automatically)
3. **Rotate API keys** periodically
4. **Monitor usage** in Resend dashboard to detect abuse
5. **Rate limit** the verification endpoint (consider adding this)
6. **Validate email format** on both client and server

## Cost Considerations

**Resend Pricing** (as of 2026):
- **Free tier**: 100 emails/day, 3,000/month
- **Paid tier**: $20/month for 50,000 emails/month

For most startups, the free tier is sufficient during early stages.

## Support

- **Resend Docs**: [https://resend.com/docs](https://resend.com/docs)
- **Resend Support**: support@resend.com
- **Next.js API Routes**: [https://nextjs.org/docs/app/building-your-application/routing/route-handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Note**: This system replaces the old BYU-only email verification. Any email address can now create an account after verifying their email.
