import type { APIRoute } from 'astro';
import { z } from 'zod';

/**
 * Contact Form API Endpoint
 *
 * Security Features:
 * - Input validation with Zod
 * - Rate limiting (simple IP-based)
 * - Honeypot spam prevention
 * - Input sanitization
 * - CSRF protection ready
 *
 * TODO: Integrate with email service (SendGrid, AWS SES, Resend, etc.)
 */

// Validation schema
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),

  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),

  phone: z.string()
    .regex(/^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/, 'Invalid phone format')
    .optional()
    .or(z.literal('')),

  cottage: z.enum(['pearl-beach-lakehouse', 'lakehurst-bungalow', 'both', ''])
    .optional(),

  dates: z.string()
    .max(200, 'Dates must be less than 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),

  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),

  // Honeypot field - should be empty
  website: z.string().optional(),
});

// Simple in-memory rate limiting (for development)
// TODO: Use Redis or similar for production
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 hour
    return true;
  }

  if (limit.count >= 5) {
    // Exceeded limit
    return false;
  }

  // Increment count
  limit.count++;
  return true;
}

// Sanitize text to prevent XSS in email body
function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Get client IP for rate limiting
    const ip = clientAddress || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please try again later.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      cottage: formData.get('cottage'),
      dates: formData.get('dates'),
      message: formData.get('message'),
      website: formData.get('website'), // Honeypot
    };

    // Honeypot check - if filled, it's likely a bot
    if (data.website) {
      console.log('[SPAM] Honeypot triggered:', ip);
      // Return success to not alert the bot
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate input
    const validated = contactSchema.parse(data);

    // Sanitize all text fields
    const sanitized = {
      name: sanitizeText(validated.name),
      email: validated.email, // Email is already validated
      phone: validated.phone || 'Not provided',
      cottage: validated.cottage || 'Not specified',
      dates: validated.dates ? sanitizeText(validated.dates) : 'Not specified',
      message: sanitizeText(validated.message),
    };

    // Log submission (for development)
    console.log('[CONTACT FORM] New submission:', {
      from: sanitized.email,
      name: sanitized.name,
      ip,
      timestamp: new Date().toISOString(),
    });

    // Send email using Resend API
    // Requires RESEND_API_KEY environment variable
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (resendApiKey && resendApiKey !== 'YOUR_RESEND_API_KEY') {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Pearl Beach Cottages <noreply@pearlbeachcottages.com>',
            to: ['info@pearlbeachcottages.com'],
            reply_to: sanitized.email,
            subject: `New Inquiry: ${sanitized.name} - ${sanitized.cottage || 'General'}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3D5A4C; border-bottom: 2px solid #C4956A; padding-bottom: 10px;">
                  New Contact Form Submission
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${sanitized.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                      <a href="mailto:${sanitized.email}">${sanitized.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${sanitized.phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Property:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${sanitized.cottage}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Dates:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${sanitized.dates}</td>
                  </tr>
                </table>
                <div style="margin-top: 20px;">
                  <h3 style="color: #3D5A4C;">Message:</h3>
                  <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; line-height: 1.6;">
                    ${sanitized.message.replace(/\n/g, '<br>')}
                  </p>
                </div>
                <p style="color: #888; font-size: 12px; margin-top: 30px;">
                  Sent from Pearl Beach Cottages website contact form
                </p>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error('[EMAIL ERROR]:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('[EMAIL ERROR]:', emailError);
        // Don't fail the request if email fails - form data is logged
      }
    } else {
      console.log('[EMAIL] Resend API key not configured. Email not sent.');
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[CONTACT FORM ERROR]:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Please check your form fields',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generic error
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An error occurred. Please try again later.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Block GET requests
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      error: 'Method not allowed',
    }),
    {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
