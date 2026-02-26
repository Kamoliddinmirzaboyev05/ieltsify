# Vercel Deployment Guide - IELTSIFY

## 🚀 Quick Deploy

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite framework

3. **Configure Environment Variables**
   Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   VITE_API_BASE_URL=https://ieltsify.pythonanywhere.com
   VITE_ENABLE_GOOGLE_AUTH=true
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 📋 Pre-Deployment Checklist

- ✅ All environment variables configured
- ✅ `.env.example` file exists with all required variables
- ✅ `vercel.json` configured correctly
- ✅ `.vercelignore` excludes unnecessary files
- ✅ Build runs successfully locally (`npm run build`)
- ✅ No TypeScript errors (`npm run build`)
- ✅ All dependencies in `package.json`
- ✅ Node.js version specified in `.nvmrc`

## 🔧 Vercel Configuration

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install"
}
```

### Build Settings (Auto-detected)
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

## 🌍 Custom Domain Setup

1. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add `ieltsify.webportfolio.uz`
   - Follow DNS configuration instructions

2. **DNS Configuration**
   Add these records to your DNS provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Vercel automatically provisions SSL
   - Wait 24-48 hours for DNS propagation

## 🔐 Environment Variables

### Required Variables
```env
VITE_API_BASE_URL=https://ieltsify.pythonanywhere.com
VITE_ENABLE_GOOGLE_AUTH=true
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Optional Variables
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 🐛 Troubleshooting

### Build Fails

**Problem:** TypeScript errors
```bash
# Solution: Check for type errors locally
npm run build
```

**Problem:** Missing dependencies
```bash
# Solution: Install all dependencies
npm install
```

**Problem:** Environment variables not working
```bash
# Solution: Ensure all VITE_ prefixed variables are set in Vercel Dashboard
```

### Deployment Issues

**Problem:** 404 on routes
- ✅ Check `vercel.json` has correct rewrites
- ✅ Ensure SPA routing is configured

**Problem:** Assets not loading
- ✅ Check `public` folder structure
- ✅ Verify asset paths are relative

**Problem:** API calls failing
- ✅ Check CORS settings on backend
- ✅ Verify API base URL in environment variables

## 📊 Performance Optimization

### Implemented Optimizations
- ✅ Code splitting with Vite
- ✅ Asset caching headers
- ✅ Gzip compression
- ✅ Image optimization
- ✅ CSS minification
- ✅ JS minification

### Recommended Improvements
- [ ] Implement lazy loading for routes
- [ ] Add service worker for offline support
- [ ] Optimize images with WebP format
- [ ] Implement CDN for static assets

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push
Vercel automatically deploys when you push to:
- **Production:** `main` or `master` branch
- **Preview:** Any other branch or pull request

### Manual Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 📈 Monitoring

### Vercel Analytics
- Enable in Project Settings → Analytics
- Track page views, performance, and errors

### Logs
- View deployment logs in Vercel Dashboard
- Check runtime logs for debugging

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Custom Domain Setup](https://vercel.com/docs/concepts/projects/domains)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 📞 Support

If deployment issues persist:
1. Check Vercel deployment logs
2. Review build output for errors
3. Verify all environment variables
4. Contact Vercel support if needed

---

**Last Updated:** February 26, 2026
**Deployment Status:** ✅ Ready for Production
