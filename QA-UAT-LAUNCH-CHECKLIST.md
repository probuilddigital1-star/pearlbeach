# Pearl Beach Cottages - QA/UAT Launch Checklist

**Website:** https://pearlbeachcottages.com
**Technology Stack:** Astro (Static Site), Tailwind CSS, TypeScript
**Test Date:** _____________
**Tester Name:** _____________

---

## 1. FUNCTIONAL TESTING

### 1.1 Navigation & Routing

| Test ID | Test Case | Steps | Expected Result | Status | Notes |
|---------|-----------|-------|-----------------|--------|-------|
| NAV-001 | Homepage loads correctly | Navigate to `/` | Homepage displays with hero image, trust bar, cottages section, features, reviews, and CTA | ☐ Pass ☐ Fail | |
| NAV-002 | Main navigation links work | Click each nav link in header | All pages load correctly (Home, Cottages, Amenities, Location, Reviews, Contact) | ☐ Pass ☐ Fail | |
| NAV-003 | Mobile menu toggle | 1. Resize to mobile<br>2. Click hamburger icon | Mobile menu slides in from right | ☐ Pass ☐ Fail | |
| NAV-004 | Mobile menu links work | Click each link in mobile menu | Pages load correctly and menu closes | ☐ Pass ☐ Fail | |
| NAV-005 | Mobile menu close button | Click X button in mobile menu | Menu closes smoothly | ☐ Pass ☐ Fail | |
| NAV-006 | Mobile menu backdrop click | Click backdrop outside menu | Menu closes | ☐ Pass ☐ Fail | |
| NAV-007 | Footer links work | Click all footer links | All pages load correctly (Privacy, Terms, Security, etc.) | ☐ Pass ☐ Fail | |
| NAV-008 | Breadcrumb navigation | Navigate to cottage detail page | Breadcrumbs show correct path and links work | ☐ Pass ☐ Fail | |
| NAV-009 | "Book Now" CTA buttons | Click all "Book Now" buttons | Navigate to /cottages page | ☐ Pass ☐ Fail | |
| NAV-010 | Active page highlighting | Navigate to each page | Current page is highlighted in navigation | ☐ Pass ☐ Fail | |

### 1.2 Cottage Pages

| Test ID | Test Case | Steps | Expected Result | Status | Notes |
|---------|-----------|-------|-----------------|--------|-------|
| COT-001 | Cottages index page loads | Navigate to `/cottages` | Page displays both cottages with cards, stats, and comparison table | ☐ Pass ☐ Fail | |
| COT-002 | Cottage card "View Full Details" | Click button on cottage card | Navigate to individual cottage page | ☐ Pass ☐ Fail | |
| COT-003 | Pearl Beach Lakehouse detail page | Navigate to `/cottages/pearl-beach-lakehouse` | Page loads with hero, stats, description, amenities, gallery | ☐ Pass ☐ Fail | |
| COT-004 | Lakehurst Bungalow detail page | Navigate to `/cottages/lakehurst-bungalow` | Page loads with all sections correctly | ☐ Pass ☐ Fail | |
| COT-005 | Cottage highlights display | Check highlights section | All 3 highlights show with icons and descriptions | ☐ Pass ☐ Fail | |
| COT-006 | Amenities list displays | Check amenities section | All amenities show with checkmark icons | ☐ Pass ☐ Fail | |
| COT-007 | Quick stats bar | Check bedroom/bathroom/sleeps/sqft | All stats display correctly for each cottage | ☐ Pass ☐ Fail | |
| COT-008 | Sidebar booking card sticky | Scroll down cottage detail page | Booking card remains sticky in sidebar | ☐ Pass ☐ Fail | |
| COT-009 | "Contact Owner" button | Click Contact Owner button | Navigate to /contact page | ☐ Pass ☐ Fail | |
| COT-010 | Comparison table | View comparison on /cottages | Table shows accurate data for both cottages | ☐ Pass ☐ Fail | |

### 1.3 Photo Gallery & Lightbox

| Test ID | Test Case | Steps | Expected Result | Status | Notes |
|---------|-----------|-------|-----------------|--------|-------|
| GAL-001 | Gallery grid displays | View cottage detail page | Photo thumbnails display in responsive grid | ☐ Pass ☐ Fail | |
| GAL-002 | Thumbnail hover effect | Hover over thumbnail | Image scales slightly with overlay icon | ☐ Pass ☐ Fail | |
| GAL-003 | Open lightbox | Click any thumbnail | Lightbox opens with full-size image | ☐ Pass ☐ Fail | |
| GAL-004 | Lightbox close button | Click X button | Lightbox closes | ☐ Pass ☐ Fail | |
| GAL-005 | Lightbox backdrop close | Click backdrop outside image | Lightbox closes | ☐ Pass ☐ Fail | |
| GAL-006 | Lightbox next navigation | Click next arrow | Next image loads with smooth transition | ☐ Pass ☐ Fail | |
| GAL-007 | Lightbox previous navigation | Click previous arrow | Previous image loads | ☐ Pass ☐ Fail | |
| GAL-008 | Keyboard navigation - ESC | Press ESC key while lightbox open | Lightbox closes | ☐ Pass ☐ Fail | |
| GAL-009 | Keyboard navigation - Arrow Right | Press right arrow key | Next image loads | ☐ Pass ☐ Fail | |
| GAL-010 | Keyboard navigation - Arrow Left | Press left arrow key | Previous image loads | ☐ Pass ☐ Fail | |
| GAL-011 | Touch swipe right | Swipe right on mobile | Previous image loads | ☐ Pass ☐ Fail | |
| GAL-012 | Touch swipe left | Swipe left on mobile | Next image loads | ☐ Pass ☐ Fail | |
| GAL-013 | Image counter | Open lightbox | Counter shows "X / Total" and updates correctly | ☐ Pass ☐ Fail | |
| GAL-014 | Image lazy loading | Scroll to gallery section | First 8 images load eagerly, rest load lazily | ☐ Pass ☐ Fail | |
| GAL-015 | Body scroll lock | Open lightbox | Background page doesn't scroll | ☐ Pass ☐ Fail | |

### 1.4 Contact Form

| Test ID | Test Case | Steps | Expected Result | Status | Notes |
|---------|-----------|-------|-----------------|--------|-------|
| FORM-001 | Contact form displays | Navigate to `/contact` | Form shows all fields with proper labels | ☐ Pass ☐ Fail | |
| FORM-002 | Required field validation - Name | 1. Leave name blank<br>2. Submit | Error shown - field is required | ☐ Pass ☐ Fail | |
| FORM-003 | Required field validation - Email | 1. Leave email blank<br>2. Submit | Error shown - field is required | ☐ Pass ☐ Fail | |
| FORM-004 | Required field validation - Message | 1. Leave message blank<br>2. Submit | Error shown - field is required | ☐ Pass ☐ Fail | |
| FORM-005 | Email format validation | 1. Enter invalid email (e.g., "test")<br>2. Submit | Error shown - invalid email format | ☐ Pass ☐ Fail | |
| FORM-006 | Name minimum length | Enter 1 character in name | Validation error shown | ☐ Pass ☐ Fail | |
| FORM-007 | Name special characters | Enter name with numbers (e.g., "John123") | Validation error shown | ☐ Pass ☐ Fail | |
| FORM-008 | Phone format validation | Enter invalid phone (e.g., "123") | Validation error shown | ☐ Pass ☐ Fail | |
| FORM-009 | Phone optional field | Leave phone blank and submit valid form | Form submits successfully | ☐ Pass ☐ Fail | |
| FORM-010 | Message minimum length | Enter message with <10 characters | Validation error shown | ☐ Pass ☐ Fail | |
| FORM-011 | Message maximum length | Enter message with >5000 characters | Validation error shown | ☐ Pass ☐ Fail | |
| FORM-012 | Cottage dropdown | Select each cottage option | Selection is saved | ☐ Pass ☐ Fail | |
| FORM-013 | Dates field format hint | Check dates field | Format hint "July 15-22, 2025" is visible | ☐ Pass ☐ Fail | |
| FORM-014 | Honeypot field hidden | Inspect form | Website field is visually hidden | ☐ Pass ☐ Fail | |
| FORM-015 | Submit button disabled state | Click submit | Button shows "Sending..." and is disabled | ☐ Pass ☐ Fail | |
| FORM-016 | Successful submission | Fill valid data and submit | Success message appears, form resets | ☐ Pass ☐ Fail | |
| FORM-017 | Submission error handling | Simulate API error | Error message displays clearly | ☐ Pass ☐ Fail | |
| FORM-018 | Status message scroll | Submit form | Page scrolls status message into view | ☐ Pass ☐ Fail | |
| FORM-019 | Autocomplete attributes | Check form fields | Name, email, phone, tel have autocomplete | ☐ Pass ☐ Fail | |
| FORM-020 | ARIA labels | Check with screen reader | All form elements have proper labels | ☐ Pass ☐ Fail | |

### 1.5 External Links & VRBO Integration

| Test ID | Test Case | Steps | Expected Result | Status | Notes |
|---------|-----------|-------|-----------------|--------|-------|
| EXT-001 | VRBO link - Pearl Beach Lakehouse | Click "Book on VRBO" on Lakehouse page | Opens https://www.vrbo.com/122526 in new tab | ☐ Pass ☐ Fail | |
| EXT-002 | VRBO link - Lakehurst Bungalow | Click "Book on VRBO" on Bungalow page | Opens https://www.vrbo.com/238763 in new tab | ☐ Pass ☐ Fail | |
| EXT-003 | VRBO links from /cottages | Click both VRBO links on cottages index | Both open correct VRBO URLs | ☐ Pass ☐ Fail | |
| EXT-004 | VRBO links from /contact | Click VRBO links in contact sidebar | Links open correctly | ☐ Pass ☐ Fail | |
| EXT-005 | External link security | Check all VRBO links | Have rel="noopener noreferrer" | ☐ Pass ☐ Fail | |
| EXT-006 | External link new tab | Click any VRBO link | Opens in new tab (target="_blank") | ☐ Pass ☐ Fail | |

### 1.6 Maps Integration

| Test ID | Test Case | Steps | Expected Result | Status | Notes |
|---------|-----------|-------|-----------------|--------|-------|
| MAP-001 | Contact page map loads | Navigate to /contact | Google Map iframe loads correctly | ☐ Pass ☐ Fail | |
| MAP-002 | Location page map loads | Navigate to /location | Large map iframe loads correctly | ☐ Pass ☐ Fail | |
| MAP-003 | Map interactivity | Try to zoom/pan map | Map is interactive and responsive | ☐ Pass ☐ Fail | |
| MAP-004 | Map API key check | Inspect map src | API key is present and valid | ☐ Pass ☐ Fail | |
| MAP-005 | Map location accuracy | Check map center point | Shows Saybrook Township, OH area | ☐ Pass ☐ Fail | |
| MAP-006 | Map accessibility title | Check iframe | Has descriptive title attribute | ☐ Pass ☐ Fail | |

### 1.7 Reviews Page

| Test ID | Test Case | Steps | Expected Result | Status | Notes |
|---------|-----------|-------|-----------------|--------|-------|
| REV-001 | Reviews page loads | Navigate to `/reviews` | Page displays with all reviews | ☐ Pass ☐ Fail | |
| REV-002 | Review cards display | Check review layout | Cards show quote, author, formatting | ☐ Pass ☐ Fail | |
| REV-003 | Featured reviews on homepage | Check homepage | 3 featured reviews display | ☐ Pass ☐ Fail | |
| REV-004 | "Read All Reviews" link | Click link on homepage | Navigate to /reviews page | ☐ Pass ☐ Fail | |

### 1.8 Additional Pages

| Test ID | Test Case | Steps | Expected Result | Status | Notes |
|---------|-----------|-------|-----------------|--------|-------|
| ADD-001 | Amenities page loads | Navigate to `/amenities` | Page displays all amenity categories | ☐ Pass ☐ Fail | |
| ADD-002 | Amenities icons display | Check amenity cards | All SVG icons render correctly | ☐ Pass ☐ Fail | |
| ADD-003 | Location page loads | Navigate to `/location` | Page shows location info, map, attractions | ☐ Pass ☐ Fail | |
| ADD-004 | FAQ page loads | Navigate to `/faq` | Page displays FAQ content | ☐ Pass ☐ Fail | |
| ADD-005 | Privacy policy loads | Navigate to `/privacy` | Privacy policy displays | ☐ Pass ☐ Fail | |
| ADD-006 | Terms of service loads | Navigate to `/terms` | Terms content displays | ☐ Pass ☐ Fail | |
| ADD-007 | Security page loads | Navigate to `/security` | Security information displays | ☐ Pass ☐ Fail | |

---

## 2. CROSS-BROWSER TESTING

### 2.1 Desktop Browsers

| Browser | Version | OS | Test Status | Issues Found |
|---------|---------|----|-----------|--------------|
| Chrome | Latest | Windows | ☐ Pass ☐ Fail | |
| Chrome | Latest | macOS | ☐ Pass ☐ Fail | |
| Firefox | Latest | Windows | ☐ Pass ☐ Fail | |
| Firefox | Latest | macOS | ☐ Pass ☐ Fail | |
| Safari | Latest | macOS | ☐ Pass ☐ Fail | |
| Edge | Latest | Windows | ☐ Pass ☐ Fail | |
| Opera | Latest | Windows | ☐ Pass ☐ Fail | |

**Key Items to Test in Each Browser:**
- [ ] Navigation menu works correctly
- [ ] Mobile menu toggle (resize window)
- [ ] Lightbox gallery opens and navigates
- [ ] Contact form submission
- [ ] All images load correctly
- [ ] CSS animations and transitions
- [ ] Font rendering
- [ ] Layout consistency

### 2.2 Mobile Browsers

| Browser | Device Type | OS | Test Status | Issues Found |
|---------|-------------|----|-----------|--------------|
| Safari | iPhone 14/15 | iOS 17+ | ☐ Pass ☐ Fail | |
| Chrome | iPhone | iOS | ☐ Pass ☐ Fail | |
| Chrome | Android Phone | Android 12+ | ☐ Pass ☐ Fail | |
| Samsung Internet | Samsung Galaxy | Android | ☐ Pass ☐ Fail | |
| Safari | iPad | iOS | ☐ Pass ☐ Fail | |

**Key Items to Test:**
- [ ] Touch interactions (tap, swipe)
- [ ] Mobile menu functionality
- [ ] Form input on mobile keyboards
- [ ] Lightbox touch gestures
- [ ] Viewport sizing
- [ ] Orientation changes (portrait/landscape)

---

## 3. MOBILE RESPONSIVENESS

### 3.1 Breakpoint Testing

| Viewport | Width | Test Status | Issues Found |
|----------|-------|-------------|--------------|
| Mobile Small | 320px | ☐ Pass ☐ Fail | |
| Mobile Medium | 375px | ☐ Pass ☐ Fail | |
| Mobile Large | 414px | ☐ Pass ☐ Fail | |
| Tablet Portrait | 768px | ☐ Pass ☐ Fail | |
| Tablet Landscape | 1024px | ☐ Pass ☐ Fail | |
| Desktop | 1280px | ☐ Pass ☐ Fail | |
| Desktop Large | 1440px | ☐ Pass ☐ Fail | |
| Desktop XL | 1920px | ☐ Pass ☐ Fail | |

### 3.2 Responsive Elements Testing

| Test ID | Element | Test Case | Expected Behavior | Status | Notes |
|---------|---------|-----------|-------------------|--------|-------|
| RES-001 | Header navigation | Resize from desktop to mobile | Desktop menu hides, hamburger appears at 768px | ☐ Pass ☐ Fail | |
| RES-002 | Hero section | View on mobile | Hero text is readable, image crops appropriately | ☐ Pass ☐ Fail | |
| RES-003 | Cottage cards | View on mobile | Cards stack vertically, maintain proper spacing | ☐ Pass ☐ Fail | |
| RES-004 | Comparison table | View on mobile | Table is scrollable horizontally or stacks | ☐ Pass ☐ Fail | |
| RES-005 | Gallery grid | Check all breakpoints | Columns adjust: 2 (mobile), 3 (tablet), 4 (desktop) | ☐ Pass ☐ Fail | |
| RES-006 | Contact form | View on mobile | Form fields full width, proper spacing | ☐ Pass ☐ Fail | |
| RES-007 | Footer | Check mobile layout | Stacks vertically, links remain accessible | ☐ Pass ☐ Fail | |
| RES-008 | Stats sections | View responsive behavior | Grid adjusts from 4 columns to 2 on tablet, 2 on mobile | ☐ Pass ☐ Fail | |
| RES-009 | CTA buttons | Check on all sizes | Buttons are appropriately sized and clickable | ☐ Pass ☐ Fail | |
| RES-010 | Text readability | Check all text sizes | No text too small to read comfortably | ☐ Pass ☐ Fail | |
| RES-011 | Touch targets | Mobile devices | All buttons/links min 44x44px tap area | ☐ Pass ☐ Fail | |
| RES-012 | Sidebar booking card | Mobile view | Sidebar moves to bottom or displays appropriately | ☐ Pass ☐ Fail | |
| RES-013 | Amenities grid | All breakpoints | Grid adjusts: 1 (mobile), 2 (tablet), 3 (desktop) | ☐ Pass ☐ Fail | |
| RES-014 | Maps | Mobile view | Maps scale down appropriately, remain interactive | ☐ Pass ☐ Fail | |
| RES-015 | Images | All viewports | Images load appropriate sizes, no pixelation | ☐ Pass ☐ Fail | |

---

## 4. ACCESSIBILITY TESTING (WCAG 2.1 AA)

### 4.1 Keyboard Navigation

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| A11Y-001 | Tab through entire site | All interactive elements are reachable via Tab key | ☐ Pass ☐ Fail | |
| A11Y-002 | Tab order is logical | Focus moves in logical reading order | ☐ Pass ☐ Fail | |
| A11Y-003 | Visible focus indicators | All focused elements have clear visual indicator | ☐ Pass ☐ Fail | |
| A11Y-004 | Skip to main content link | Skip link appears on Tab and works | ☐ Pass ☐ Fail | |
| A11Y-005 | Mobile menu keyboard access | Can open/close mobile menu with keyboard | ☐ Pass ☐ Fail | |
| A11Y-006 | Lightbox keyboard control | Can open, navigate, close lightbox with keyboard | ☐ Pass ☐ Fail | |
| A11Y-007 | Form keyboard submission | Can fill and submit form using only keyboard | ☐ Pass ☐ Fail | |
| A11Y-008 | Escape key closes modals | ESC closes lightbox and mobile menu | ☐ Pass ☐ Fail | |
| A11Y-009 | No keyboard traps | Focus never gets trapped in any element | ☐ Pass ☐ Fail | |

### 4.2 Screen Reader Testing

| Test ID | Test Case | Tool | Expected Result | Status | Notes |
|---------|-----------|------|-----------------|--------|-------|
| A11Y-010 | Page structure | NVDA/JAWS | Proper heading hierarchy (H1 > H2 > H3) | ☐ Pass ☐ Fail | |
| A11Y-011 | Images alt text | Screen reader | All images have descriptive alt text | ☐ Pass ☐ Fail | |
| A11Y-012 | Decorative images | Screen reader | Decorative images have empty alt="" | ☐ Pass ☐ Fail | |
| A11Y-013 | Link purpose | Screen reader | Links have clear, descriptive text | ☐ Pass ☐ Fail | |
| A11Y-014 | Form labels | Screen reader | All form inputs have associated labels | ☐ Pass ☐ Fail | |
| A11Y-015 | Form errors | Screen reader | Errors are announced and associated with fields | ☐ Pass ☐ Fail | |
| A11Y-016 | Required fields | Screen reader | Required fields are announced | ☐ Pass ☐ Fail | |
| A11Y-017 | Button labels | Screen reader | All buttons have clear labels/text | ☐ Pass ☐ Fail | |
| A11Y-018 | Icon-only buttons | Screen reader | Have aria-label attributes | ☐ Pass ☐ Fail | |
| A11Y-019 | Landmark regions | Screen reader | Page has proper landmarks (nav, main, footer) | ☐ Pass ☐ Fail | |
| A11Y-020 | ARIA attributes | Screen reader | ARIA used correctly (modals, live regions) | ☐ Pass ☐ Fail | |
| A11Y-021 | Current page indicator | Screen reader | aria-current="page" on active nav link | ☐ Pass ☐ Fail | |
| A11Y-022 | Comparison table | Screen reader | Table has caption, th scope attributes | ☐ Pass ☐ Fail | |

### 4.3 Color & Contrast

| Test ID | Test Case | Tool | Expected Result | Status | Notes |
|---------|-----------|------|-----------------|--------|-------|
| A11Y-023 | Text contrast ratios | WebAIM Contrast Checker | All text meets 4.5:1 minimum (AA standard) | ☐ Pass ☐ Fail | |
| A11Y-024 | Large text contrast | Contrast checker | Large text (18pt+) meets 3:1 minimum | ☐ Pass ☐ Fail | |
| A11Y-025 | Button contrast | Contrast checker | Buttons meet contrast requirements | ☐ Pass ☐ Fail | |
| A11Y-026 | Link contrast | Contrast checker | Links are distinguishable from text | ☐ Pass ☐ Fail | |
| A11Y-027 | Focus indicator contrast | Contrast checker | Focus outlines have 3:1 contrast | ☐ Pass ☐ Fail | |
| A11Y-028 | Color not sole indicator | Visual inspection | Information not conveyed by color alone | ☐ Pass ☐ Fail | |

### 4.4 Automated Accessibility Testing

| Test ID | Tool | Test Case | Status | Issues Found |
|---------|------|-----------|--------|--------------|
| A11Y-029 | axe DevTools | Run on all pages | ☐ Pass ☐ Fail | |
| A11Y-030 | WAVE | Scan all pages | ☐ Pass ☐ Fail | |
| A11Y-031 | Lighthouse | Accessibility score >90 | ☐ Pass ☐ Fail | |
| A11Y-032 | HTML Validator | Valid HTML markup | ☐ Pass ☐ Fail | |

### 4.5 Additional Accessibility Items

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| A11Y-033 | Zoom to 200% | Text reflows, no horizontal scroll | ☐ Pass ☐ Fail | |
| A11Y-034 | Text spacing | Content readable with modified spacing | ☐ Pass ☐ Fail | |
| A11Y-035 | Animations | No motion triggers seizures (no flashing) | ☐ Pass ☐ Fail | |
| A11Y-036 | Auto-playing content | No auto-play videos or carousels | ☐ Pass ☐ Fail | |
| A11Y-037 | Language attribute | HTML lang="en" attribute present | ☐ Pass ☐ Fail | |
| A11Y-038 | Consistent navigation | Nav is consistent across all pages | ☐ Pass ☐ Fail | |

---

## 5. PERFORMANCE TESTING

### 5.1 Page Load Performance

| Test ID | Page | Tool | Metric | Target | Actual | Status |
|---------|------|------|--------|--------|--------|--------|
| PERF-001 | Homepage | Lighthouse | Performance Score | >90 | | ☐ Pass ☐ Fail |
| PERF-002 | Homepage | PageSpeed Insights | LCP (Largest Contentful Paint) | <2.5s | | ☐ Pass ☐ Fail |
| PERF-003 | Homepage | PageSpeed Insights | FID (First Input Delay) | <100ms | | ☐ Pass ☐ Fail |
| PERF-004 | Homepage | PageSpeed Insights | CLS (Cumulative Layout Shift) | <0.1 | | ☐ Pass ☐ Fail |
| PERF-005 | Homepage | WebPageTest | Time to Interactive | <3.5s | | ☐ Pass ☐ Fail |
| PERF-006 | Cottages Page | Lighthouse | Performance Score | >90 | | ☐ Pass ☐ Fail |
| PERF-007 | Cottage Detail | Lighthouse | Performance Score | >85 | | ☐ Pass ☐ Fail |
| PERF-008 | Contact Page | Lighthouse | Performance Score | >90 | | ☐ Pass ☐ Fail |
| PERF-009 | All Pages | Browser DevTools | First Paint | <1s | | ☐ Pass ☐ Fail |
| PERF-010 | All Pages | Network Tab | Total Page Size | <3MB | | ☐ Pass ☐ Fail |

### 5.2 Image Optimization

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| IMG-001 | Hero images format | WebP or optimized JPEG | ☐ Pass ☐ Fail | |
| IMG-002 | Hero images size | <500KB per image | ☐ Pass ☐ Fail | |
| IMG-003 | Gallery images optimization | Compressed, appropriate dimensions | ☐ Pass ☐ Fail | |
| IMG-004 | Lazy loading implementation | Images below fold have loading="lazy" | ☐ Pass ☐ Fail | |
| IMG-005 | Responsive images | Different sizes served at different breakpoints | ☐ Pass ☐ Fail | |
| IMG-006 | Image dimensions specified | Width/height attributes prevent CLS | ☐ Pass ☐ Fail | |
| IMG-007 | No missing images | All image URLs resolve correctly | ☐ Pass ☐ Fail | |

### 5.3 Asset Optimization

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| ASSET-001 | CSS minification | CSS files are minified in production | ☐ Pass ☐ Fail | |
| ASSET-002 | JavaScript minification | JS files are minified | ☐ Pass ☐ Fail | |
| ASSET-003 | Font loading | Web fonts load efficiently, no FOIT/FOUT | ☐ Pass ☐ Fail | |
| ASSET-004 | Icon optimization | SVG icons are optimized | ☐ Pass ☐ Fail | |
| ASSET-005 | No render-blocking resources | Critical CSS inlined, defer non-critical | ☐ Pass ☐ Fail | |
| ASSET-006 | Compression enabled | Gzip/Brotli compression on text assets | ☐ Pass ☐ Fail | |
| ASSET-007 | Caching headers | Static assets have proper cache headers | ☐ Pass ☐ Fail | |

### 5.4 Network Performance

| Test ID | Test Case | Tool | Expected Result | Status | Notes |
|---------|-----------|------|-----------------|--------|-------|
| NET-001 | HTTP requests count | DevTools Network | <50 requests per page | ☐ Pass ☐ Fail | |
| NET-002 | 3G simulation | DevTools | Site usable on slow 3G | ☐ Pass ☐ Fail | |
| NET-003 | DNS lookup time | WebPageTest | <200ms | ☐ Pass ☐ Fail | |
| NET-004 | Server response time (TTFB) | WebPageTest | <600ms | ☐ Pass ☐ Fail | |
| NET-005 | Third-party scripts | Network tab | Minimal third-party dependencies | ☐ Pass ☐ Fail | |

---

## 6. FORM VALIDATION TESTING

### 6.1 Contact Form Validation

| Test ID | Field | Input | Expected Validation | Status | Notes |
|---------|-------|-------|---------------------|--------|-------|
| VAL-001 | Name | Empty | "Name is required" error | ☐ Pass ☐ Fail | |
| VAL-002 | Name | "A" (1 char) | "Name must be at least 2 characters" | ☐ Pass ☐ Fail | |
| VAL-003 | Name | 101 characters | "Name must be less than 100 characters" | ☐ Pass ☐ Fail | |
| VAL-004 | Name | "John123" | "Name contains invalid characters" | ☐ Pass ☐ Fail | |
| VAL-005 | Name | "John Doe" | Accepts valid name | ☐ Pass ☐ Fail | |
| VAL-006 | Name | "Mary-Jane O'Brien" | Accepts hyphens and apostrophes | ☐ Pass ☐ Fail | |
| VAL-007 | Email | Empty | "Email is required" error | ☐ Pass ☐ Fail | |
| VAL-008 | Email | "notanemail" | "Invalid email address" | ☐ Pass ☐ Fail | |
| VAL-009 | Email | "test@" | "Invalid email address" | ☐ Pass ☐ Fail | |
| VAL-010 | Email | "test@domain" | "Invalid email address" | ☐ Pass ☐ Fail | |
| VAL-011 | Email | "valid@email.com" | Accepts valid email | ☐ Pass ☐ Fail | |
| VAL-012 | Email | "CAPS@EMAIL.COM" | Converts to lowercase | ☐ Pass ☐ Fail | |
| VAL-013 | Phone | "123" | "Invalid phone format" error | ☐ Pass ☐ Fail | |
| VAL-014 | Phone | "abc-def-ghij" | "Invalid phone format" error | ☐ Pass ☐ Fail | |
| VAL-015 | Phone | "555-123-4567" | Accepts valid phone | ☐ Pass ☐ Fail | |
| VAL-016 | Phone | "(555) 123-4567" | Accepts valid phone | ☐ Pass ☐ Fail | |
| VAL-017 | Phone | "5551234567" | Accepts valid phone | ☐ Pass ☐ Fail | |
| VAL-018 | Phone | Empty | Accepts empty (optional field) | ☐ Pass ☐ Fail | |
| VAL-019 | Message | Empty | "Message is required" error | ☐ Pass ☐ Fail | |
| VAL-020 | Message | "Short" (5 chars) | "Message must be at least 10 characters" | ☐ Pass ☐ Fail | |
| VAL-021 | Message | 5001 characters | "Message must be less than 5000 characters" | ☐ Pass ☐ Fail | |
| VAL-022 | Message | Valid 50 char message | Accepts valid message | ☐ Pass ☐ Fail | |
| VAL-023 | Cottage | Each option | All options selectable | ☐ Pass ☐ Fail | |
| VAL-024 | Dates | 201 characters | "Dates must be less than 200 characters" | ☐ Pass ☐ Fail | |
| VAL-025 | Dates | Empty | Accepts empty (optional field) | ☐ Pass ☐ Fail | |

### 6.2 Honeypot & Security Testing

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| SEC-001 | Honeypot field visible | Field has class "visually-hidden" | ☐ Pass ☐ Fail | |
| SEC-002 | Honeypot field in DOM | Field exists but not visible to users | ☐ Pass ☐ Fail | |
| SEC-003 | Honeypot filled (bot test) | Form appears to submit but is rejected server-side | ☐ Pass ☐ Fail | |
| SEC-004 | Rate limiting | Submit 6 forms rapidly, 6th is blocked with 429 error | ☐ Pass ☐ Fail | |
| SEC-005 | XSS prevention - Name | Enter `<script>alert('xss')</script>` | Script tags removed/escaped | ☐ Pass ☐ Fail | |
| SEC-006 | XSS prevention - Message | Enter HTML/JS in message | Dangerous code sanitized | ☐ Pass ☐ Fail | |
| SEC-007 | SQL injection attempt | Enter SQL in fields | Properly handled, no errors | ☐ Pass ☐ Fail | |
| SEC-008 | Input trimming | Enter "  John  " | Whitespace trimmed to "John" | ☐ Pass ☐ Fail | |

### 6.3 API Endpoint Testing

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| API-001 | POST /api/contact with valid data | Returns 200 with success message | ☐ Pass ☐ Fail | |
| API-002 | POST /api/contact with invalid data | Returns 400 with error details | ☐ Pass ☐ Fail | |
| API-003 | GET /api/contact | Returns 405 Method Not Allowed | ☐ Pass ☐ Fail | |
| API-004 | POST /api/contact - missing name | Returns validation error | ☐ Pass ☐ Fail | |
| API-005 | POST /api/contact - missing email | Returns validation error | ☐ Pass ☐ Fail | |
| API-006 | POST /api/contact - missing message | Returns validation error | ☐ Pass ☐ Fail | |
| API-007 | API response headers | Content-Type is application/json | ☐ Pass ☐ Fail | |

---

## 7. EXTERNAL LINK VERIFICATION

### 7.1 VRBO Booking Links

| Test ID | Location | URL | Expected Behavior | Status | Notes |
|---------|----------|-----|-------------------|--------|-------|
| LINK-001 | Homepage - Lakehouse card | https://www.vrbo.com/122526 | Opens in new tab to correct listing | ☐ Pass ☐ Fail | |
| LINK-002 | Homepage - Bungalow card | https://www.vrbo.com/238763 | Opens in new tab to correct listing | ☐ Pass ☐ Fail | |
| LINK-003 | /cottages - Lakehouse card | https://www.vrbo.com/122526 | Opens in new tab | ☐ Pass ☐ Fail | |
| LINK-004 | /cottages - Bungalow card | https://www.vrbo.com/238763 | Opens in new tab | ☐ Pass ☐ Fail | |
| LINK-005 | /cottages/pearl-beach-lakehouse sidebar | https://www.vrbo.com/122526 | Opens in new tab | ☐ Pass ☐ Fail | |
| LINK-006 | /cottages/lakehurst-bungalow sidebar | https://www.vrbo.com/238763 | Opens in new tab | ☐ Pass ☐ Fail | |
| LINK-007 | /contact page - Lakehouse link | https://www.vrbo.com/122526 | Opens in new tab | ☐ Pass ☐ Fail | |
| LINK-008 | /contact page - Bungalow link | https://www.vrbo.com/238763 | Opens in new tab | ☐ Pass ☐ Fail | |

### 7.2 Internal Link Verification

| Test ID | Link Type | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------|-----------------|--------|-------|
| LINK-009 | All internal links | Click every internal link | No 404 errors, correct page loads | ☐ Pass ☐ Fail | |
| LINK-010 | Footer links | Test all footer links | All navigate correctly | ☐ Pass ☐ Fail | |
| LINK-011 | Breadcrumb links | Test breadcrumb navigation | Links work on all pages | ☐ Pass ☐ Fail | |
| LINK-012 | Logo link | Click logo | Returns to homepage | ☐ Pass ☐ Fail | |
| LINK-013 | CTA buttons | Test all CTA buttons | Navigate to correct pages | ☐ Pass ☐ Fail | |

---

## 8. 404 ERROR HANDLING

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| 404-001 | Navigate to `/nonexistent-page` | Custom 404 page displays | ☐ Pass ☐ Fail | |
| 404-002 | 404 page design | Matches site design, helpful message | ☐ Pass ☐ Fail | |
| 404-003 | 404 page navigation | Header/footer present and functional | ☐ Pass ☐ Fail | |
| 404-004 | 404 links to homepage | Link to return to homepage works | ☐ Pass ☐ Fail | |
| 404-005 | Invalid cottage slug | Navigate to `/cottages/invalid` | Shows 404 or redirects gracefully | ☐ Pass ☐ Fail | |
| 404-006 | HTTP status code | Check response headers | Returns proper 404 status code | ☐ Pass ☐ Fail | |
| 404-007 | SEO meta tags | Check 404 page source | Has noindex meta tag | ☐ Pass ☐ Fail | |

---

## 9. SSL/HTTPS VERIFICATION

### 9.1 SSL Certificate

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| SSL-001 | Certificate validity | Valid SSL certificate for pearlbeachcottages.com | ☐ Pass ☐ Fail | |
| SSL-002 | Certificate expiration | Not expired, >30 days until expiration | ☐ Pass ☐ Fail | |
| SSL-003 | Certificate issuer | Issued by trusted CA | ☐ Pass ☐ Fail | |
| SSL-004 | Certificate chain | Complete certificate chain | ☐ Pass ☐ Fail | |
| SSL-005 | SSL Labs test | Grade A or A+ on SSL Labs | ☐ Pass ☐ Fail | |
| SSL-006 | TLS version | TLS 1.2 or 1.3 | ☐ Pass ☐ Fail | |
| SSL-007 | Cipher suites | Strong cipher suites only | ☐ Pass ☐ Fail | |

### 9.2 HTTPS Implementation

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| HTTPS-001 | All pages serve over HTTPS | No HTTP pages accessible | ☐ Pass ☐ Fail | |
| HTTPS-002 | HTTP to HTTPS redirect | http://pearlbeachcottages.com redirects to https:// | ☐ Pass ☐ Fail | |
| HTTPS-003 | Mixed content check | No mixed content warnings in console | ☐ Pass ☐ Fail | |
| HTTPS-004 | All assets over HTTPS | Images, CSS, JS served via HTTPS | ☐ Pass ☐ Fail | |
| HTTPS-005 | HSTS header | Strict-Transport-Security header present | ☐ Pass ☐ Fail | |
| HTTPS-006 | Secure cookies | Cookies have Secure flag (if applicable) | ☐ Pass ☐ Fail | |
| HTTPS-007 | Browser padlock | Green padlock shows in address bar | ☐ Pass ☐ Fail | |
| HTTPS-008 | External links protocol | External links use https:// where available | ☐ Pass ☐ Fail | |

---

## 10. SEO VERIFICATION

### 10.1 Meta Tags & Structured Data

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| SEO-001 | Homepage title tag | Unique, descriptive, <60 chars | ☐ Pass ☐ Fail | |
| SEO-002 | Homepage meta description | Unique, compelling, 150-160 chars | ☐ Pass ☐ Fail | |
| SEO-003 | All pages unique titles | Every page has unique title | ☐ Pass ☐ Fail | |
| SEO-004 | All pages meta descriptions | Every page has unique description | ☐ Pass ☐ Fail | |
| SEO-005 | Canonical URLs | Canonical tags present and correct | ☐ Pass ☐ Fail | |
| SEO-006 | Open Graph tags | OG tags for social sharing | ☐ Pass ☐ Fail | |
| SEO-007 | Schema.org markup | LocalBusiness and VacationRental schema present | ☐ Pass ☐ Fail | |
| SEO-008 | Robots meta tag | No "noindex" on public pages | ☐ Pass ☐ Fail | |
| SEO-009 | Sitemap exists | /sitemap.xml accessible | ☐ Pass ☐ Fail | |
| SEO-010 | Sitemap completeness | All pages included in sitemap | ☐ Pass ☐ Fail | |
| SEO-011 | Robots.txt | /robots.txt exists and configured | ☐ Pass ☐ Fail | |

### 10.2 Content & Keywords

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| SEO-012 | H1 tags | Every page has exactly one H1 | ☐ Pass ☐ Fail | |
| SEO-013 | Heading hierarchy | Proper H1 > H2 > H3 structure | ☐ Pass ☐ Fail | |
| SEO-014 | Keyword usage | Target keywords in titles, headings, content | ☐ Pass ☐ Fail | |
| SEO-015 | Alt text on images | All content images have descriptive alt text | ☐ Pass ☐ Fail | |
| SEO-016 | Internal linking | Good internal link structure | ☐ Pass ☐ Fail | |
| SEO-017 | URL structure | Clean, descriptive URLs | ☐ Pass ☐ Fail | |

---

## 11. SECURITY TESTING

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| SEC-009 | Security headers | CSP, X-Frame-Options, X-Content-Type-Options present | ☐ Pass ☐ Fail | |
| SEC-010 | No sensitive data in source | No API keys, credentials in client code | ☐ Pass ☐ Fail | |
| SEC-011 | Environment variables | API keys use PUBLIC_ prefix or server-side | ☐ Pass ☐ Fail | |
| SEC-012 | Console logs in production | Console.log removed in production build | ☐ Pass ☐ Fail | |
| SEC-013 | Source maps in production | Source maps disabled in production | ☐ Pass ☐ Fail | |
| SEC-014 | Dependency vulnerabilities | Run `npm audit` - no high/critical vulns | ☐ Pass ☐ Fail | |

---

## 12. CONTENT VERIFICATION

| Test ID | Test Case | Expected Result | Status | Notes |
|---------|-----------|-----------------|--------|-------|
| CONT-001 | Spelling and grammar | No spelling/grammar errors | ☐ Pass ☐ Fail | |
| CONT-002 | Contact information accuracy | Phone, email, address correct | ☐ Pass ☐ Fail | |
| CONT-003 | Property details accuracy | Bedrooms, bathrooms, sleeps numbers correct | ☐ Pass ☐ Fail | |
| CONT-004 | Pricing information | Base prices accurate and up-to-date | ☐ Pass ☐ Fail | |
| CONT-005 | Check-in/out times | Times consistent across pages (4pm/10am) | ☐ Pass ☐ Fail | |
| CONT-006 | VRBO IDs correct | Property IDs match actual VRBO listings | ☐ Pass ☐ Fail | |
| CONT-007 | Location information | Saybrook Township, OH 44004 consistent | ☐ Pass ☐ Fail | |
| CONT-008 | Copyright year | Current year in footer | ☐ Pass ☐ Fail | |
| CONT-009 | Brand consistency | "Pearl Beach Cottages" used consistently | ☐ Pass ☐ Fail | |

---

## 13. DEPLOYMENT CHECKLIST

### Pre-Launch Tasks

- [ ] Domain configured and DNS pointing to hosting
- [ ] SSL certificate installed and verified
- [ ] Environment variables set on hosting platform
- [ ] Google Maps API key configured
- [ ] Contact form email integration tested (if applicable)
- [ ] Analytics installed (Google Analytics, etc.)
- [ ] Backup strategy in place
- [ ] Monitoring/uptime alerts configured

### Launch Day Tasks

- [ ] Final content review completed
- [ ] All tests from this checklist passed
- [ ] Production build created and tested
- [ ] Deploy to production
- [ ] Verify production site loads correctly
- [ ] Test contact form on production
- [ ] Submit sitemap to Google Search Console
- [ ] Test VRBO links on production
- [ ] Monitor error logs for 24 hours

### Post-Launch Tasks

- [ ] Monitor Core Web Vitals
- [ ] Track contact form submissions
- [ ] Review analytics after 1 week
- [ ] Check search console for crawl errors
- [ ] Gather user feedback

---

## 14. TESTING TOOLS RECOMMENDED

### Browser Testing
- Chrome DevTools
- Firefox Developer Tools
- BrowserStack (cross-browser testing)
- LambdaTest (cross-browser testing)

### Performance
- Google Lighthouse
- WebPageTest
- PageSpeed Insights
- GTmetrix

### Accessibility
- axe DevTools
- WAVE Browser Extension
- NVDA Screen Reader
- JAWS Screen Reader
- macOS VoiceOver

### SEO
- Google Search Console
- Screaming Frog SEO Spider
- SEMrush Site Audit
- Ahrefs Site Audit

### Security
- SSL Labs Server Test
- Mozilla Observatory
- Security Headers
- OWASP ZAP

### Validation
- W3C HTML Validator
- W3C CSS Validator
- Schema.org Validator
- Open Graph Debugger

---

## SIGN-OFF

### QA Tester Sign-Off

**Tester Name:** ___________________________
**Date:** ___________________________
**Overall Status:** ☐ Ready for Launch  ☐ Issues Found (see notes)
**Signature:** ___________________________

### Critical Issues Log

| Issue ID | Severity | Description | Page/Feature | Status | Resolution |
|----------|----------|-------------|--------------|--------|------------|
| | | | | | |
| | | | | | |
| | | | | | |

### Launch Recommendation

☐ **APPROVE FOR LAUNCH** - All critical tests passed
☐ **CONDITIONAL APPROVAL** - Minor issues documented, acceptable for launch
☐ **DO NOT LAUNCH** - Critical issues must be resolved

**Notes:**
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________

---

**Document Version:** 1.0
**Last Updated:** 2026-01-17
**Project:** Pearl Beach Cottages Website Launch
