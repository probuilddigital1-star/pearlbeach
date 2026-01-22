import { sequence } from 'astro:middleware';
import { onRequest as securityHeaders } from './security';

/**
 * Middleware Chain
 *
 * Applies middleware in sequence to all requests.
 * Currently includes:
 * - Security headers (CSP, HSTS, X-Frame-Options, etc.)
 *
 * To add more middleware, import and add to the sequence array.
 */

export const onRequest = sequence(
  securityHeaders
);
