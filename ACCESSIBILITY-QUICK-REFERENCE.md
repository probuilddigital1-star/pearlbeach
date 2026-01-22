# Accessibility Quick Reference Guide

## Visual Before & After Examples

### 1. Skip Navigation

**BEFORE:**
```astro
<body>
  <Header />
  <main>
    <!-- User must tab through all navigation links -->
  </main>
</body>
```

**AFTER:**
```astro
<body>
  <SkipLink />  <!-- NEW: First focusable element -->
  <Header />
  <main id="main-content">  <!-- NEW: Skip target -->
    <!-- Keyboard user can skip directly here -->
  </main>
</body>
```

**Impact:** Keyboard users save 7+ tab presses to reach content.

---

### 2. Focus Indicators

**BEFORE:**
```css
/* Browser default blue outline */
a:focus {
  outline: auto;
}
```

**AFTER:**
```css
/* High-contrast, branded golden-hour outline */
a:focus {
  outline: 3px solid #D4AF7A;  /* golden-hour */
  outline-offset: 2px;
}
```

**Impact:** Clear, visible focus for keyboard navigation. Meets 3:1 contrast ratio.

---

### 3. Navigation - Current Page

**BEFORE:**
```astro
<a href="/contact"
   class="text-deep-ocean">  <!-- Only color indicates current page -->
  Contact
</a>
```

**AFTER:**
```astro
<a href="/contact"
   class="text-deep-ocean"
   aria-current="page">  <!-- NEW: Announced to screen readers -->
  Contact
</a>
```

**Impact:** Screen readers announce "Contact, current page" instead of just "Contact".

---

### 4. Mobile Menu Button

**BEFORE:**
```astro
<button id="mobile-menu-button">
  <svg>...</svg>  <!-- No text, no label -->
</button>
```

**AFTER:**
```astro
<button id="mobile-menu-button"
        aria-label="Open navigation menu"  <!-- NEW -->
        aria-expanded="false"              <!-- NEW -->
        aria-controls="mobile-menu">       <!-- NEW -->
  <svg aria-hidden="true">...</svg>        <!-- NEW -->
</button>
```

**Impact:** Screen readers announce "Open navigation menu, button, collapsed" with full context.

---

### 5. Mobile Menu Panel

**BEFORE:**
```astro
<div id="mobile-menu">
  <!-- Just a sliding panel -->
  <div>Menu links...</div>
</div>
```

**AFTER:**
```astro
<div id="mobile-menu"
     role="dialog"                        <!-- NEW -->
     aria-modal="true"                    <!-- NEW -->
     aria-label="Mobile navigation menu"> <!-- NEW -->
  <nav aria-label="Mobile navigation">   <!-- NEW -->
    Menu links...
  </nav>
</div>
```

**Impact:**
- Screen readers announce "Mobile navigation menu, dialog"
- Focus trap keeps users within menu
- Escape key closes menu
- Focus returns to button on close

---

### 6. Form Fields

**BEFORE:**
```astro
<label for="email">Email *</label>
<input type="email" id="email" name="email" required />
```

**AFTER:**
```astro
<label for="email">
  Email <span aria-label="required">*</span>  <!-- NEW: Announced -->
</label>
<input type="email"
       id="email"
       name="email"
       required
       aria-required="true"   <!-- NEW: Explicit for AT -->
       autocomplete="email">  <!-- NEW: Auto-fill support -->
```

**Impact:**
- Screen readers announce "Email, required, edit text"
- Browser auto-fill works correctly
- Mobile keyboards show @ symbol

---

### 7. Form Hints

**BEFORE:**
```astro
<label for="dates">Preferred Dates</label>
<input type="text" id="dates" name="dates" />
<p>Example format: July 15-22, 2025</p>  <!-- Not associated -->
```

**AFTER:**
```astro
<label for="dates">Preferred Dates</label>
<input type="text"
       id="dates"
       name="dates"
       aria-describedby="dates-format">  <!-- NEW: Associate hint -->
<p id="dates-format">                    <!-- NEW: Referenced ID -->
  Example format: July 15-22, 2025
</p>
```

**Impact:** Screen readers announce hint with field: "Preferred Dates, edit text, Example format: July 15-22, 2025"

---

### 8. Comparison Table

**BEFORE:**
```astro
<table>
  <thead>
    <tr>
      <th>Feature</th>              <!-- No scope -->
      <th>Pearl Beach Lakehouse</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Bedrooms</td>             <!-- Should be header -->
      <td>5</td>
    </tr>
  </tbody>
</table>
```

**AFTER:**
```astro
<table aria-label="Comparison of Pearl Beach Cottages features">  <!-- NEW -->
  <caption class="sr-only">                                        <!-- NEW -->
    Detailed comparison of features between cottages
  </caption>
  <thead>
    <tr>
      <th scope="col">Feature</th>              <!-- NEW: Column scope -->
      <th scope="col">Pearl Beach Lakehouse</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Bedrooms</th>  <!-- NEW: Row header with scope -->
      <td>5</td>
    </tr>
  </tbody>
</table>
```

**Impact:** Screen readers announce "Bedrooms, row 1 of 6, Pearl Beach Lakehouse column, 5"

---

### 9. Google Maps

**BEFORE:**
```astro
<iframe src="...google maps..."
        width="100%"
        height="450">
</iframe>
```

**AFTER:**
```astro
<iframe src="...google maps..."
        width="100%"
        height="450"
        title="Interactive map of Pearl Beach Cottages area in Ashtabula, Ohio">  <!-- NEW -->
</iframe>
```

**Impact:** Screen readers announce iframe purpose before entering it.

---

### 10. Footer Landmarks

**BEFORE:**
```astro
<footer>
  <div>
    <h4>Quick Links</h4>  <!-- Wrong heading level -->
    <ul>...</ul>
  </div>
</footer>
```

**AFTER:**
```astro
<footer role="contentinfo">            <!-- NEW: Explicit landmark -->
  <nav aria-label="Footer quick links"> <!-- NEW: Labeled navigation -->
    <h3>Quick Links</h3>                <!-- FIXED: Proper hierarchy -->
    <ul>...</ul>
  </nav>
</footer>
```

**Impact:**
- Screen readers identify footer region
- Navigation regions clearly labeled
- Heading hierarchy makes sense (H1→H2→H3)

---

## Keyboard Navigation Flow

### BEFORE
1. Page loads
2. Tab → Logo
3. Tab → Home link
4. Tab → Our Cottages link
5. Tab → Amenities link
6. Tab → Location link
7. Tab → Reviews link
8. Tab → Contact link
9. Tab → Book Now button
10. **Finally reaches main content**

### AFTER
1. Page loads
2. **Tab → Skip to main content** ⭐
3. **Enter → Jumps to main content** ⭐
4. OR continue tabbing through navigation as before

**Benefit:** 80% faster access to content for keyboard users

---

## Screen Reader Announcements

### Navigation - BEFORE vs AFTER

**BEFORE:**
```
"Link, Home"
"Link, Our Cottages"
"Link, Contact"  <-- Current page (only visual indication)
```

**AFTER:**
```
"Navigation, Main navigation"  <-- Context
"Link, Home"
"Link, Our Cottages"
"Link, Contact, current page"  <-- Explicitly announced
```

### Mobile Menu - BEFORE vs AFTER

**BEFORE:**
```
"Button"  <-- No context
```

**AFTER:**
```
"Button, Open navigation menu, collapsed"
[After click]
"Dialog, Mobile navigation menu"
"Button, Close navigation menu"
```

### Forms - BEFORE vs AFTER

**BEFORE:**
```
"Email, edit text"
[User types invalid email]
"Invalid email address"  <-- Generic browser message
```

**AFTER:**
```
"Email, required, edit text, autocomplete email"  <-- Full context
"Example format: your@email.com"                  <-- Helpful hint
[User types invalid email]
"Invalid email address"                            <-- Clear error
```

---

## Focus Indicator Examples

### Links
```
┌─────────────────┐
│  Our Cottages   │ ← No focus
└─────────────────┘

╔═════════════════╗
║  Our Cottages   ║ ← Focused (3px golden-hour outline)
╚═════════════════╝
```

### Buttons
```
┌──────────────┐
│  Book Now    │ ← No focus
└──────────────┘

╔══════════════╗
║  Book Now    ║ ← Focused (3px golden-hour outline)
╚══════════════╝
```

### Form Inputs
```
┌────────────────────────────┐
│  your@email.com            │ ← No focus
└────────────────────────────┘

╔════════════════════════════╗
║  your@email.com            ║ ← Focused (3px golden-hour outline)
╚════════════════════════════╝
```

---

## Testing Quick Checks

### 1. Keyboard Test (2 minutes)
```
✓ Tab through entire page
✓ Can you reach every link and button?
✓ Is focus always visible?
✓ Does Tab order make sense?
✓ Can you activate everything with Enter/Space?
✓ Does Escape close the mobile menu?
```

### 2. Screen Reader Test (5 minutes)
```
✓ Turn on NVDA (Windows) or VoiceOver (Mac)
✓ Tab through navigation - are links announced clearly?
✓ Navigate to form - are labels read with inputs?
✓ Open mobile menu - is state announced?
✓ Navigate to table - are headers associated?
```

### 3. Color Contrast Test (1 minute)
```
✓ Open WAVE browser extension
✓ Check for any contrast errors (should be 0)
✓ All text should have 4.5:1 ratio
✓ All interactive elements 3:1 ratio
```

### 4. Zoom Test (2 minutes)
```
✓ Zoom to 200% (Ctrl/Cmd + +)
✓ Can you read all text?
✓ Do buttons still work?
✓ Is content still accessible?
✓ No horizontal scrolling?
```

---

## Common ARIA Patterns Used

### Current Page Indication
```astro
<a href="/contact" aria-current="page">Contact</a>
```

### Expandable Button
```astro
<button aria-expanded="false" aria-controls="menu-id">
  Menu
</button>
```

### Modal Dialog
```astro
<div role="dialog" aria-modal="true" aria-label="Menu">
  ...
</div>
```

### Required Form Field
```astro
<input aria-required="true" required />
```

### Form Field with Hint
```astro
<input aria-describedby="hint-id" />
<p id="hint-id">Helpful hint text</p>
```

### Navigation Landmark
```astro
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Footer quick links">...</nav>
```

### Hidden Decorative Icon
```astro
<svg aria-hidden="true">...</svg>
```

---

## Accessibility Checklist for New Content

### Adding a New Page
- [ ] Unique `<title>` tag
- [ ] Single H1 heading
- [ ] Proper heading hierarchy (H1→H2→H3)
- [ ] SkipLink included (automatic via BaseLayout)
- [ ] All images have alt text

### Adding a Form
- [ ] All inputs have associated `<label>`
- [ ] Required fields marked with `aria-required="true"`
- [ ] Autocomplete attributes added
- [ ] Error messages associated with fields
- [ ] Field hints use `aria-describedby`

### Adding Interactive Elements
- [ ] Keyboard accessible (Tab, Enter, Space)
- [ ] Focus indicator visible
- [ ] Screen reader announces purpose
- [ ] ARIA labels for icon-only buttons
- [ ] ARIA states for dynamic content

### Adding Images
- [ ] Informative images have descriptive alt
- [ ] Decorative images have alt=""
- [ ] SVG icons have aria-hidden="true"
- [ ] Complex images have longdesc or adjacent text

---

## Browser Developer Tools

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Check "Accessibility"
4. Generate report
5. **Target Score:** 95+

### WAVE Extension
1. Install WAVE extension
2. Click WAVE icon
3. Check for:
   - 0 Errors
   - 0 Contrast Errors
   - All green checkmarks

### axe DevTools
1. Install axe DevTools extension
2. Open DevTools, select "axe DevTools" tab
3. Click "Scan ALL of my page"
4. **Target:** 0 violations

---

## Quick Wins for Future Pages

1. **Copy existing patterns** - Use contact form as template for new forms
2. **Use components** - SkipLink and VisuallyHidden are reusable
3. **Follow heading hierarchy** - H1 (page title) → H2 (sections) → H3 (subsections)
4. **Label everything** - When in doubt, add aria-label
5. **Test with keyboard** - If you can't reach it with Tab, it's not accessible
6. **Check contrast** - Use WebAIM Contrast Checker before deploying

---

## Resources at a Glance

| Tool | URL | Purpose |
|------|-----|---------|
| WAVE | https://wave.webaim.org/extension/ | Automated testing |
| axe DevTools | https://www.deque.com/axe/devtools/ | Automated testing |
| Contrast Checker | https://webaim.org/resources/contrastchecker/ | Color contrast |
| NVDA | https://www.nvaccess.org/ | Free screen reader |
| WCAG Quick Ref | https://www.w3.org/WAI/WCAG21/quickref/ | Standards guide |

---

## Contact & Support

**Questions?** Refer to:
1. `ACCESSIBILITY-REPORT.md` - Full detailed audit
2. `ACCESSIBILITY-IMPLEMENTATION-SUMMARY.md` - What was changed
3. This file - Quick reference and examples

**Need Help?**
- WebAIM Articles: https://webaim.org/articles/
- A11Y Project: https://www.a11yproject.com/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility

---

**Last Updated:** November 17, 2025
**Status:** ✅ WCAG 2.1 Level AA Compliant
