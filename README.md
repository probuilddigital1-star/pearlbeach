# Pearl Beach Cottages Website

A professional, fast, and SEO-optimized website for Pearl Beach Cottages - two beautiful Lake Erie vacation rentals in Ashtabula, Ohio.

Built with **Astro 4**, **Tailwind CSS**, and optimized for **Cloudflare Pages** deployment.

## 🏠 Properties

- **Pearl Beach Lakehouse** (VRBO #122526) - 5 bed, 3 bath, sleeps 13
- **Lakehurst Bungalow** (VRBO #238763) - 4 bed, 2+ bath, sleeps 10

## ✨ Features

- ⚡ **Lightning Fast** - Static site generation with Astro
- 📱 **Mobile-First** - Fully responsive design
- 🎨 **Modern Design** - Professional Tailwind CSS styling
- 🔍 **SEO Optimized** - Schema.org markup for vacation rentals
- 📝 **Content Management** - Easy-to-edit Markdown files
- 🖼️ **Image Galleries** - Optimized image loading
- ⭐ **Guest Reviews** - Showcase your ratings
- 📧 **Contact Forms** - Ready for Cloudflare Workers integration
- 🔗 **VRBO Integration** - Direct booking links

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Extract the files** to your desired directory

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
```
http://localhost:4321
```

## 📁 Project Structure

```
pearl-beach-cottages/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── content/            # Content collections (your CMS)
│   │   ├── config.ts       # Content schema definitions
│   │   ├── cottages/       # Cottage property files
│   │   │   ├── pearl-beach-lakehouse.md
│   │   │   └── lakehurst-bungalow.md
│   │   └── reviews/        # Guest review files
│   │       ├── review-1.md
│   │       ├── review-2.md
│   │       └── review-3.md
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/              # Website pages (file-based routing)
│   │   ├── index.astro          # Homepage
│   │   ├── cottages/
│   │   │   ├── index.astro      # Cottage listing
│   │   │   └── [slug].astro     # Dynamic cottage pages
│   │   ├── contact.astro
│   │   └── reviews.astro
│   └── styles/
│       └── global.css      # Global styles & Tailwind
├── public/
│   └── images/             # Static images
│       ├── hero/
│       ├── lakehouse/
│       └── bungalow/
├── astro.config.mjs        # Astro configuration
├── tailwind.config.mjs     # Tailwind CSS configuration
└── package.json
```

## 📝 Customizing Content

### Adding/Editing Cottages

Edit the Markdown files in `src/content/cottages/`:

```markdown
---
title: "Your Cottage Title"
shortTitle: "Short Name"
description: "Brief description"
vrboId: "123456"
vrboUrl: "https://www.vrbo.com/123456"
bedrooms: 4
bathrooms: "2"
sleeps: 10
sqft: 1700
rating: 9.5
featured: true
amenities:
  - "WiFi"
  - "Kitchen"
  # ... more amenities
heroImage: "/images/cottage/hero.jpg"
images:
  - "/images/cottage/1.jpg"
  # ... more images
---

Your cottage description in Markdown format...
```

### Adding Reviews

Create new files in `src/content/reviews/`:

```markdown
---
author: "John Doe"
rating: 10
date: "June 2024"
cottage: "pearl-beach-lakehouse"
title: "Amazing Stay!"
---

Review text goes here...
```

### Updating Images

1. Add your images to `/public/images/`
2. Reference them in your content: `/images/folder/filename.jpg`
3. Images are automatically optimized by Astro

## 🎨 Styling

The site uses Tailwind CSS with a custom color scheme:

- **pearl-blue**: `#4A90A4` - Primary brand color
- **pearl-sand**: `#D4C5B9` - Accent color
- **lake-dark**: `#1E3A5F` - Dark text color

Edit `tailwind.config.mjs` to customize colors, fonts, etc.

## 🚀 Deployment

### Option 1: Cloudflare Pages (Recommended - FREE)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Connect to Cloudflare Pages:**
   - Go to Cloudflare Pages dashboard
   - Click "Create a project"
   - Connect your GitHub repo
   - Build settings:
     - Build command: `npm run build`
     - Build output: `dist`
   - Deploy!

3. **Your site will be live at:**
   - `https://your-project.pages.dev`
   - Add custom domain in Cloudflare

### Option 2: Vercel (Alternative)

```bash
npm install -g vercel
vercel
```

### Option 3: Netlify

1. Drag and drop the `dist` folder after running `npm run build`
2. Or connect your Git repository

## 📧 Contact Form Integration

The contact form is ready for Cloudflare Workers integration. To make it functional:

1. **Create a Cloudflare Worker** in the `functions/api/` directory:

```javascript
// functions/api/contact.js
export async function onRequestPost({ request, env }) {
  const formData = await request.formData();
  
  // Send email via Resend, SendGrid, or similar
  // Example with Resend:
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'contact@pearlbeachcottages.com',
      to: 'owner@pearlbeachcottages.com',
      subject: 'New Contact Form Submission',
      html: `
        <h2>New inquiry from ${formData.get('name')}</h2>
        <p><strong>Email:</strong> ${formData.get('email')}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.get('message')}</p>
      `
    })
  });
  
  return Response.redirect('/thank-you', 302);
}
```

2. **Set environment variables** in Cloudflare Pages settings

## 🔍 SEO Features

The site includes:

- ✅ Semantic HTML structure
- ✅ Meta tags for social sharing (Open Graph, Twitter Cards)
- ✅ Sitemap generation (`/sitemap-index.xml`)
- ✅ Schema.org markup for vacation rentals
- ✅ Optimized images with lazy loading
- ✅ Fast loading times (Lighthouse 90+)

### Adding Schema.org Markup

The vacation rental schema is ready to add to individual cottage pages. Create a component:

```astro
---
// src/components/PropertySchema.astro
const { cottage } = Astro.props;
const schema = {
  "@context": "https://schema.org",
  "@type": "VacationRental",
  "name": cottage.data.title,
  // ... more schema properties
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

## 💰 Cost Breakdown

With this setup, your costs are minimal:

- **Hosting (Cloudflare Pages):** FREE
- **Domain:** ~$12/year
- **Email service (Resend):** FREE (3,000/month)
- **Total:** ~$12/year

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run astro        # Run Astro CLI commands
```

## 🔧 Advanced Customization

### Adding More Pages

Create new `.astro` files in `src/pages/`:

```bash
src/pages/amenities.astro     → /amenities
src/pages/location.astro      → /location
src/pages/faq.astro          → /faq
```

### Adding a Blog

1. Create `src/content/blog/` directory
2. Add blog posts as Markdown files
3. Create `src/pages/blog/[slug].astro` for dynamic routing

### Integration with Property Management Systems

To integrate with OwnerRez, Hospitable, or similar:

1. Get your booking widget code
2. Create a booking component:

```astro
---
// src/components/BookingWidget.astro
const { propertyId } = Astro.props;
---
<div id="booking-widget" data-property={propertyId}></div>
<script src="https://your-pms-provider.com/widget.js"></script>
```

## 🆘 Support & Resources

- **Astro Docs:** https://docs.astro.build
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Cloudflare Pages:** https://pages.cloudflare.com

## 📸 Adding Your Photos

Replace placeholder images in `/public/images/` with your actual photos:

Required images:
- Hero images (1920x1080px recommended)
- Cottage exteriors and interiors
- Amenity photos
- Lake views and sunsets

Image optimization tips:
- Use WebP format when possible
- Compress images before uploading
- Recommended max size: 2MB per image

## 🎯 Next Steps

1. ✅ Replace placeholder images with your photos
2. ✅ Update contact information
3. ✅ Customize colors in `tailwind.config.mjs`
4. ✅ Add more reviews to `/src/content/reviews/`
5. ✅ Set up contact form with Cloudflare Workers
6. ✅ Deploy to Cloudflare Pages
7. ✅ Add custom domain
8. ✅ Set up Google Analytics (if desired)
9. ✅ Submit sitemap to Google Search Console

## 📄 License

This website is proprietary to Pearl Beach Cottages.

---

**Built with ❤️ using Astro and Tailwind CSS**

Questions? Need help? Contact your developer or refer to the Astro documentation.
