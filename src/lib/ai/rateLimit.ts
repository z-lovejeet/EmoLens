/**
 * Simple sliding-window rate limiter for API routes.
 * Uses in-memory Map (resets on server restart — fine for hackathon).
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  windowMs: number;   // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

const CONFIGS: Record<string, RateLimitConfig> = {
  checkin: { windowMs: 60_000, maxRequests: 10 },
  remap: { windowMs: 60_000, maxRequests: 5 },
  select: { windowMs: 60_000, maxRequests: 10 },
};

/**
 * Check if a request should be rate limited.
 * @returns `true` if the request is allowed, `false` if rate limited.
 */
export function checkRateLimit(
  identifier: string,
  endpoint: 'checkin' | 'remap' | 'select'
): boolean {
  const config = CONFIGS[endpoint];
  const key = `${endpoint}:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  if (entry.timestamps.length >= config.maxRequests) {
    return false; // Rate limited
  }

  entry.timestamps.push(now);
  return true; // Allowed
}

/**
 * Extract client identifier from request headers.
 * Uses x-forwarded-for or falls back to a default.
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'anonymous';
}
