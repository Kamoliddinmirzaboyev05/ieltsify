# IELTSIFY - Vercel Deployment Guide

## Prerequisites
- Vercel account
- GitHub repository connected to Vercel

## Environment Variables Setup

After deploying to Vercel, you need to add the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **VITE_API_BASE_URL**
   - Value: `https://ieltsify.pythonanywhere.com`
   - Description: Backend API base URL

2. **VITE_GOOGLE_CLIENT_ID**
   - Value: Your Google OAuth Client ID
   - Description: Google OAuth authentication client ID

3. **VITE_GEMINI_API_KEY**
   - Value: Your Google Gemini API key
   - Description: Google Gemini AI API key for writing evaluation

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite framework
5. Add environment variables in "Environment Variables" section
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add VITE_API_BASE_URL
vercel env add VITE_GOOGLE_CLIENT_ID
vercel env add VITE_GEMINI_API_KEY

# Deploy to production
vercel --prod
```

## Post-Deployment

1. **Update Google OAuth Settings**
   - Add your Vercel domain to Google OAuth authorized domains
   - Add redirect URIs: `https://your-domain.vercel.app`

2. **Test the deployment**
   - Visit your Vercel URL
   - Test login/register functionality
   - Test Google OAuth
   - Test writing evaluation

## Troubleshooting

### 404 Errors on Page Refresh
- The `vercel.json` file handles SPA routing
- All routes are rewritten to `/index.html`

### Environment Variables Not Working
- Make sure variable names start with `VITE_`
- Redeploy after adding environment variables
- Check Vercel deployment logs

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

## Build Configuration

The project uses:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher

## Security Headers

The following security headers are automatically added:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Caching

Static assets in `/assets/` are cached for 1 year with immutable flag for optimal performance.

## Support

For issues related to:
- **Deployment**: Check Vercel documentation
- **Backend API**: Contact backend team
- **Frontend bugs**: Create an issue in GitHub repository
