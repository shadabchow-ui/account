const RATE_LIMIT_ENABLED = process.env.RATE_LIMIT_ENABLED !== "false";

interface RateLimitConfig {
  identifier: string;
  maxRequests: number;
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

async function noopCheck(): Promise<RateLimitResult> {
  return { allowed: true, remaining: Infinity, resetAt: new Date() };
}

let rateLimitImpl: (config: RateLimitConfig) => Promise<RateLimitResult> =
  noopCheck;

export function configureRateLimiter(
  impl: (config: RateLimitConfig) => Promise<RateLimitResult>,
): void {
  rateLimitImpl = impl;
}

export async function checkRateLimit(
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  if (!RATE_LIMIT_ENABLED) return noopCheck();
  return rateLimitImpl(config);
}

export function buildRateLimitKey(prefix: string, request: Request): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";
  const ua = request.headers.get("user-agent") || "unknown";

  return `${prefix}:${ip}:${ua}`;
}
