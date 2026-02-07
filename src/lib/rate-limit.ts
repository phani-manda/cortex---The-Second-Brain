/**
 * Rate Limiting Utility
 * 
 * Simple in-memory rate limiter for API protection.
 * Uses a sliding window approach with per-IP tracking.
 */

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

// In-memory store (use Redis for production with multiple instances)
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export type RateLimitConfig = {
  maxRequests: number;  // Max requests per window
  windowMs: number;     // Window size in milliseconds
  identifier?: string;  // Custom identifier prefix
};

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;  // Seconds until reset (only if limited)
};

/**
 * Check if a request should be rate limited
 * @param ip - Client IP address or identifier
 * @param config - Rate limit configuration
 * @returns Result with success status and metadata
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig
): RateLimitResult {
  const { maxRequests, windowMs, identifier = "default" } = config;
  const key = `${identifier}:${ip}`;
  const now = Date.now();

  const existing = rateLimitStore.get(key);

  // No existing record or expired
  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt,
    };
  }

  // Increment count
  existing.count++;

  // Check if over limit
  if (existing.count > maxRequests) {
    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfter,
    };
  }

  return {
    success: true,
    remaining: maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Check various headers used by proxies
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback for development
  return "127.0.0.1";
}

/**
 * Create rate limit headers for response
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };

  if (result.retryAfter !== undefined) {
    headers["Retry-After"] = String(result.retryAfter);
  }

  return headers;
}

// Preset configurations
export const RATE_LIMITS = {
  // Standard API: 60 requests per minute
  standard: { maxRequests: 60, windowMs: 60 * 1000 },
  
  // AI Operations (expensive): 10 per minute
  ai: { maxRequests: 10, windowMs: 60 * 1000 },
  
  // Public API: 30 per minute
  public: { maxRequests: 30, windowMs: 60 * 1000 },
  
  // Create operations: 20 per minute
  create: { maxRequests: 20, windowMs: 60 * 1000 },
  
  // Query/Search: 30 per minute
  query: { maxRequests: 30, windowMs: 60 * 1000 },
} as const;
