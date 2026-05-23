import { NextRequest, NextResponse } from "next/server";
import { buildGoogleAuthUrl } from "lib/auth/google";
import {
  generateOAuthState,
  setOAuthStateCookies,
  validateReturnTo,
} from "lib/auth/oauth";
import { buildRateLimitKey, checkRateLimit } from "lib/auth/rate-limit";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Google OAuth is not configured." },
      { status: 503 },
    );
  }

  const rateLimitKey = buildRateLimitKey("login", request);
  const rateLimitResult = await checkRateLimit({
    identifier: rateLimitKey,
    maxRequests: 10,
    windowSeconds: 60,
  });

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1000),
          ),
        },
      },
    );
  }

  const state = generateOAuthState();
  const returnTo = validateReturnTo(
    request.nextUrl.searchParams.get("return_to"),
  );
  const authUrl = buildGoogleAuthUrl(state);
  const response = NextResponse.redirect(authUrl);

  await setOAuthStateCookies(response, state, returnTo);

  return response;
}
