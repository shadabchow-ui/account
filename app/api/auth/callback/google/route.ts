import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, getUserInfo } from "lib/auth/google";
import { validateAndClearOAuthState, validateReturnTo } from "lib/auth/oauth";
import { createPersistentSessionOnResponse } from "lib/auth/session-store";
import { buildRateLimitKey, checkRateLimit } from "lib/auth/rate-limit";
import { upsertUserFromGoogle } from "lib/auth/user-store";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const baseUrl = process.env.NEXT_PUBLIC_ACCOUNT_URL ?? request.nextUrl.origin;

  if (error) {
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(error)}`, baseUrl),
    );
  }

  if (!code || !state) {
    return NextResponse.json(
      { error: "Missing code or state parameter." },
      { status: 400 },
    );
  }

  const rateLimitKey = buildRateLimitKey("callback", request);
  const rateLimitResult = await checkRateLimit({
    identifier: rateLimitKey,
    maxRequests: 20,
    windowSeconds: 60,
  });

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
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

  const { valid, returnTo } = await validateAndClearOAuthState(state);

  if (!valid) {
    return NextResponse.redirect(
      new URL("/signin?error=invalid_state", baseUrl),
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const googleUser = await getUserInfo(tokens.access_token);
    const user = await upsertUserFromGoogle(googleUser);
    const redirectTarget = validateReturnTo(returnTo) ?? "/";
    const response = NextResponse.redirect(new URL(redirectTarget, baseUrl));

    await createPersistentSessionOnResponse(
      response,
      {
        sub: user.id,
        email: user.email,
        name: user.name ?? googleUser.name,
        picture: user.avatar_url ?? googleUser.picture,
      },
      request.headers.get("user-agent"),
      request.headers.get("x-forwarded-for"),
    );

    return response;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "OAuth callback failed";
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(message)}`, baseUrl),
    );
  }
}
