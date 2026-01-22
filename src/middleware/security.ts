import type { MiddlewareHandler } from 'astro';

/**
 * Security Headers Middleware
 *
 * Adds comprehensive security headers to all responses to protect against
 * common web vulnerabilities (XSS, clickjacking, MIME sniffing, etc.)
 *
 * These headers follow OWASP security best practices.
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();

  // Clone response to modify headers
  const newResponse = new Response(response.body, response);

  // Content Security Policy (CSP)
  // Restricts sources of content to prevent XSS attacks
  newResponse.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.google.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.app.n8n.cloud",
      "frame-src 'self' https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  );

  // X-Frame-Options: Prevents clickjacking attacks
  newResponse.headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options: Prevents MIME sniffing
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy: Controls referrer information sent with requests
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: Controls browser features and APIs
  newResponse.headers.set(
    'Permissions-Policy',
    [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()'
    ].join(', ')
  );

  // Strict-Transport-Security (HSTS): Enforces HTTPS
  // Only add this header in production when using HTTPS
  if (import.meta.env.PROD) {
    newResponse.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // X-XSS-Protection: Legacy XSS protection (mostly deprecated but doesn't hurt)
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');

  return newResponse;
};
