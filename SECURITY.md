# Security Policy

## Overview

This document outlines security practices, guidelines, and procedures for the Pearl Beach Cottages website project. For public-facing security information and responsible disclosure guidelines, visit [https://pearlbeachcottages.com/security](https://pearlbeachcottages.com/security).

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

- **Email:** security@pearlbeachcottages.com
- **Contact Form:** [pearlbeachcottages.com/contact](https://pearlbeachcottages.com/contact) (mark as security-related)
- **Security.txt:** [/.well-known/security.txt](https://pearlbeachcottages.com/.well-known/security.txt)

### What to Include

- Description of the vulnerability and potential impact
- Steps to reproduce the issue
- Proof of concept (if applicable)
- Your contact information
- Any suggested remediation

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Resolution Target:** Critical issues within 30 days
- **Public Disclosure:** Coordinated after fix deployment

## Implemented Security Measures

### Application Security

- **Content Security Policy (CSP):** Prevents XSS attacks by restricting content sources
- **Security Headers:** X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **HSTS:** HTTP Strict Transport Security in production
- **Input Validation:** Server-side validation on all form inputs
- **Rate Limiting:** Protection against brute force and spam
- **No Source Maps:** Source maps disabled in production builds

### Infrastructure

- **Static Site:** Reduced attack surface through JAMstack architecture
- **CDN Protection:** DDoS mitigation and global distribution
- **HTTPS/TLS:** All traffic encrypted with TLS 1.2+
- **Environment Variables:** API keys and secrets stored securely

### Development Practices

- **Dependency Updates:** Regular security updates
- **Vulnerability Scanning:** Automated checks in CI/CD
- **Code Review:** Security-focused reviews before deployment
- **Minimal Dependencies:** Reduced attack surface

## Security Requirements

### For Contributors

1. **Never commit sensitive data:**
   - API keys, secrets, or credentials
   - Private keys or certificates
   - Personal information (emails, phone numbers)
   - Internal URLs or infrastructure details

2. **Use environment variables:**
   - Create `.env` from `.env.example`
   - Never commit `.env` files
   - Document required environment variables

3. **Follow secure coding practices:**
   - Validate all user input server-side
   - Sanitize data before display
   - Use parameterized queries (if applicable)
   - Avoid `eval()` and similar dangerous functions
   - Follow OWASP Top 10 guidelines

4. **Dependencies:**
   - Review dependencies before adding
   - Keep dependencies up to date
   - Run `npm audit` regularly
   - Address high/critical vulnerabilities immediately

### Before Deployment

**Critical Pre-Launch Checklist:**

- [ ] Replace Google Maps API key with restricted key
- [ ] Configure email service (SendGrid/AWS SES/Resend)
- [ ] Enable HTTPS and verify SSL certificate
- [ ] Test security headers in production
- [ ] Verify `.env` is in `.gitignore`
- [ ] Remove any console.log statements
- [ ] Run security audit: `npm audit`
- [ ] Test contact form with real email
- [ ] Verify CSP doesn't block legitimate resources
- [ ] Test all forms for validation and rate limiting

## Known Issues

### Google Maps API Key (CRITICAL - Pre-Launch)

**Status:** Requires immediate attention before production deployment

The current Google Maps API key `AIzaSyBN6ceHKO7a7mOQbKyzh_wCZCeL8RWIOh8` is exposed in the repository and must be:

1. **Revoked immediately** in Google Cloud Console
2. **Replaced with a new restricted key:**
   - Restrict to HTTP referrer: `pearlbeachcottages.com/*`
   - Restrict APIs to: Maps JavaScript API only
   - Set usage quotas
   - Enable billing alerts

**Action Required:**
```bash
# 1. Go to Google Cloud Console
# 2. Navigate to APIs & Services > Credentials
# 3. Delete or restrict the exposed key
# 4. Create new API key with restrictions
# 5. Update .env file (never commit it!)
VITE_GOOGLE_MAPS_API_KEY=your_new_restricted_key_here
```

### Contact Form Email Service (Required - Pre-Launch)

**Status:** Currently using mock endpoint

The contact form needs a real email service configured:

**Options:**
- **SendGrid:** Recommended for transactional email
- **AWS SES:** Good for AWS-hosted sites
- **Resend:** Modern developer-friendly option

**Setup Required:**
1. Choose email provider
2. Create account and get API key
3. Implement email endpoint (see `/src/pages/api/contact.ts`)
4. Test thoroughly before launch
5. Monitor email delivery and bounce rates

## Security Testing

### Local Testing

```bash
# Run security audit
npm audit

# Check for outdated packages
npm outdated

# Run development server
npm run dev

# Test contact form
# Visit http://localhost:4321/contact and submit test form
```

### Production Testing

After deployment, verify:

1. **Security Headers:** Use [securityheaders.com](https://securityheaders.com)
2. **SSL/TLS:** Use [ssllabs.com](https://www.ssllabs.com/ssltest/)
3. **CSP:** Check browser console for CSP violations
4. **Forms:** Test validation, rate limiting, and email delivery
5. **Links:** Verify external links have `rel="noopener noreferrer"`

## Security Contacts

- **Project Security:** security@pearlbeachcottages.com
- **Public Policy:** [pearlbeachcottages.com/security](https://pearlbeachcottages.com/security)
- **RFC 9116 security.txt:** [/.well-known/security.txt](https://pearlbeachcottages.com/.well-known/security.txt)

## License

This security policy is part of the Pearl Beach Cottages project and follows the same license as the main project.

---

Last Updated: November 24, 2024
