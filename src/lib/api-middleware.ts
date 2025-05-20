import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimitConfig } from '@/lib/security';
import rateLimit from 'express-rate-limit';

// Create rate limiter
const limiter = rateLimit(rateLimitConfig);

// Convert Express middleware to Edge compatible function
const rateLimiterMiddleware = (ip: string) => {
  return new Promise((resolve, reject) => {
    const req = { ip } as any;
    const res = {
      status: (code: number) => ({
        json: (data: any) => reject({ code, data }),
      }),
    } as any;
    
    limiter(req, res, () => resolve(true));
  });
};

export async function withProtectedApi(
  request: NextRequest,
  handler: (req: NextRequest, token: any) => Promise<NextResponse>,
  requiredRole?: string[]
) {
  try {
    // Apply rate limiting
    const ip = request.ip ?? '127.0.0.1';
    try {
      await rateLimiterMiddleware(ip);
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Verify authentication
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check role if required
    if (requiredRole && !requiredRole.includes(token.role as string)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Add security headers
    const response = await handler(request, token);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );

    return response;
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
