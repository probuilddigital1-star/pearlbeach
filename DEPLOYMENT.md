# Deployment Guide - Pearl Beach Cottages

## Deploying to Cloudflare Pages (Recommended)

Cloudflare Pages offers the best combination of performance, features, and cost (FREE!).

### Prerequisites
- GitHub account
- Cloudflare account (free to create at cloudflare.com)

### Step 1: Push to GitHub

1. **Create a new GitHub repository:**
   - Go to github.com
   - Click "New repository"
   - Name it "pearl-beach-cottages"
   - Make it private
   - Don't initialize with README (we already have one)

2. **Push your code:**
```bash
cd pearl-beach-cottages
git init
git add .
git commit -m "Initial commit - Pearl Beach Cottages website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pearl-beach-cottages.git
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages

1. **Log in to Cloudflare:** https://dash.cloudflare.com

2. **Navigate to Pages:**
   - Click "Workers & Pages" in left sidebar
   - Click "Create application"
   - Choose "Pages" tab
   - Click "Connect to Git"

3. **Connect GitHub:**
   - Authorize Cloudflare to access GitHub
   - Select your repository: `pearl-beach-cottages`

4. **Configure build settings:**
   ```
   Project name: pearl-beach-cottages
   Production branch: main
   Framework preset: Astro
   Build command: npm run build
   Build output directory: dist
   ```

5. **Environment variables** (if needed):
   - None required for basic deployment
   - Add later if you integrate forms/APIs

6. **Click "Save and Deploy"**

7. **Wait for build** (usually 2-3 minutes)

8. **Your site is live!** 
   - URL: `https://pearl-beach-cottages.pages.dev`
   - Access at the provided URL

### Step 3: Add Custom Domain

1. **In Cloudflare Pages project:**
   - Go to "Custom domains" tab
   - Click "Set up a custom domain"

2. **If domain is in Cloudflare:**
   - Type your domain: `pearlbeachcottages.com`
   - Cloudflare automatically configures DNS
   - Done! ✅

3. **If domain is elsewhere:**
   - You'll get DNS records to add
   - Add CNAME record to your DNS provider
   - Wait for DNS propagation (can take 24-48 hours)

### Step 4: Configure SSL

- Cloudflare automatically provides free SSL
- Your site will be https:// within minutes
- No additional configuration needed!

---

## Alternative: Deploying to Vercel

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps:

1. **Push to GitHub** (same as above)

2. **Go to Vercel:** https://vercel.com

3. **Import project:**
   - Click "Add New Project"
   - Import from GitHub
   - Select `pearl-beach-cottages`

4. **Configure:**
   - Framework Preset: Astro
   - Build command: `npm run build`
   - Output directory: `dist`
   - Click "Deploy"

5. **Your site is live!**
   - URL: `https://pearl-beach-cottages.vercel.app`

6. **Add custom domain** in project settings

---

## Alternative: Deploying to Netlify

### Option A: Git Integration

1. **Push to GitHub** (same as above)

2. **Go to Netlify:** https://netlify.com

3. **Import from Git:**
   - Click "Add new site" > "Import an existing project"
   - Connect GitHub
   - Select repository

4. **Build settings:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

5. **Deploy!**

### Option B: Manual Deploy (Quickest)

1. **Build locally:**
```bash
npm run build
```

2. **Go to Netlify:** https://netlify.com

3. **Drag and drop:**
   - Drag the `dist` folder onto Netlify
   - Site deploys instantly!
   - Get a URL like: `https://random-name-123.netlify.app`

4. **Change site name** in settings

---

## Automatic Deployments

Once connected to Git (GitHub), your site will automatically redeploy when you:

1. **Make changes locally**
2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Updated cottage photos"
   git push
   ```
3. **Platform automatically rebuilds** (2-3 minutes)
4. **Changes are live!**

---

## Post-Deployment Checklist

After deploying, complete these tasks:

### Immediate:
- [ ] Verify all pages load correctly
- [ ] Test on mobile device
- [ ] Check all images display properly
- [ ] Test contact form (if integrated)
- [ ] Verify VRBO links work

### Within 24 Hours:
- [ ] Add custom domain
- [ ] Set up Google Analytics (optional)
- [ ] Submit sitemap to Google Search Console
- [ ] Test site speed (PageSpeed Insights)
- [ ] Share with friends/family for feedback

### Within 1 Week:
- [ ] Set up email notifications for contact form
- [ ] Configure error monitoring (optional)
- [ ] Add Google Business Profile link
- [ ] Update VRBO listings with new website link
- [ ] Share on social media

---

## Updating Content

### To update cottage information:

1. **Edit Markdown files:**
   ```bash
   src/content/cottages/pearl-beach-lakehouse.md
   ```

2. **Save and commit:**
   ```bash
   git add .
   git commit -m "Updated amenities list"
   git push
   ```

3. **Site rebuilds automatically!**

### To add new images:

1. **Add images to:**
   ```
   public/images/lakehouse/new-photo.jpg
   ```

2. **Update references in content files**

3. **Commit and push**

---

## Environment Variables (For Advanced Features)

If you add contact form integration or APIs:

### Cloudflare Pages:
1. Go to project settings
2. Click "Environment variables"
3. Add variables like:
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`

### Vercel/Netlify:
Similar process in project settings

---

## Troubleshooting

### Build Fails
- Check build logs in platform dashboard
- Verify `package.json` dependencies
- Ensure Node version compatibility (18+)

### Images Not Loading
- Verify images exist in `/public/images/`
- Check file paths are correct (case-sensitive!)
- Ensure images are under 2MB

### Site Not Updating
- Clear browser cache
- Check if build succeeded in dashboard
- Verify you pushed to correct branch

### Custom Domain Not Working
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check domain registrar settings

---

## Performance Optimization

Your site should achieve excellent scores by default:

### Google PageSpeed Insights
- Target: 90+ on all metrics
- Test at: https://pagespeed.web.dev

### Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s ✅
- FID (First Input Delay): < 100ms ✅
- CLS (Cumulative Layout Shift): < 0.1 ✅

### Tips:
- Compress images before uploading
- Use WebP format when possible
- Astro handles most optimization automatically

---

## Cost Summary

### Cloudflare Pages:
- Hosting: FREE
- Bandwidth: Unlimited FREE
- SSL: FREE
- Builds: 500/month FREE
- **Total: $0/month** ✅

### Vercel:
- Hobby: FREE
- Bandwidth: 100GB/month
- After that: $20/month Pro plan

### Netlify:
- Starter: FREE
- Bandwidth: 100GB/month
- After that: $19/month Pro plan

**Recommendation: Start with Cloudflare Pages for best value**

---

## Support Resources

- **Astro Docs:** https://docs.astro.build
- **Cloudflare Pages:** https://developers.cloudflare.com/pages
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com

---

## Next Steps After Deployment

1. ✅ Deploy to Cloudflare Pages
2. ✅ Add custom domain
3. ✅ Upload real images
4. ✅ Test all functionality
5. ✅ Set up contact form backend
6. ✅ Submit to search engines
7. ✅ Monitor performance
8. ✅ Share with guests!

**Questions?** Refer to this guide or the platform's documentation.
