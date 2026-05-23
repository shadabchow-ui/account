import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { randomBase64url } from "./crypto";

const PROD_STATE_COOKIE = "__Secure-upcube_oauth_state";
const DEV_STATE_COOKIE = "upcube_oauth_state";
const PROD_RETURN_TO_COOKIE = "__Secure-upcube_oauth_return_to";
const DEV_RETURN_TO_COOKIE = "upcube_oauth_return_to";
const STATE_TTL_S = 300;

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function stateCookieName(): string {
  return isProduction() ? PROD_STATE_COOKIE : DEV_STATE_COOKIE;
}

function returnToCookieName(): string {
  return isProduction() ? PROD_RETURN_TO_COOKIE : DEV_RETURN_TO_COOKIE;
}

function stateCookieBase() {
  return {
    httpOnly: true as const,
    secure: isProduction(),
    sameSite: "lax" as const,
    path: "/api/auth/callback/google",
  };
}

function getAllowedOrigins(): string[] {
  const configured = process.env.ALLOWED_RETURN_TO_DOMAINS || "";
  const fallback = [
    "https://upcube.ai",
    "https://news.upcube.ai",
    "https://books.upcube.ai",
    "https://jobs.upcube.ai",
    "https://planet.upcube.ai",
    "https://quantum.upcube.ai",
    "https://robotics.upcube.ai",
    "https://university.upcube.ai",
    "https://ethen.upcube.ai",
    "https://games.upcube.ai",
    "http://localhost:3000",
    "http://localhost:3001",
  ];

  const parsed = configured
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      if (value.startsWith("http://") || value.startsWith("https://")) {
        return value;
      }
      return `https://${value}`;
    });

  return parsed.length ? parsed : fallback;
}

export function generateOAuthState(): string {
  return randomBase64url(32);
}

export function validateReturnTo(raw: string | null): string | null {
  if (!raw) return null;

  if (raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }

  try {
    const url = new URL(raw);
    const origin = `${url.protocol}//${url.host}`;
    const allowedOrigins = getAllowedOrigins();
    return allowedOrigins.includes(origin) ? raw : null;
  } catch {
    return null;
  }
}

export async function setOAuthStateCookies(
  ...args:
    | [state: string, returnTo: string | null]
    | [response: NextResponse, state: string, returnTo: string | null]
): Promise<void> {
  if (
    args.length === 3 &&
    typeof args[0] === "object" &&
    "cookies" in (args[0] as NextResponse)
  ) {
    const [response, state, returnTo] = args as [
      NextResponse,
      string,
      string | null,
    ];
    const base = stateCookieBase();
    response.cookies.set(stateCookieName(), state, {
      ...base,
      maxAge: STATE_TTL_S,
    });
    if (returnTo) {
      response.cookies.set(returnToCookieName(), returnTo, {
        ...base,
        maxAge: STATE_TTL_S,
      });
    }
    return;
  }

  const [state, returnTo] = args as [string, string | null];
  const store = await cookies();
  const base = stateCookieBase();
  store.set(stateCookieName(), state, { ...base, maxAge: STATE_TTL_S });
  if (returnTo) {
    store.set(returnToCookieName(), returnTo, { ...base, maxAge: STATE_TTL_S });
  }
}

export async function validateAndClearOAuthState(
  ...args:
    | [state: string]
    | [request: NextRequest, response: NextResponse, state: string]
): Promise<{ valid: boolean; returnTo: string | null }> {
  if (args.length === 3) {
    const [request, response, state] = args as [
      NextRequest,
      NextResponse,
      string,
    ];
    const clearOpts = { ...stateCookieBase(), maxAge: 0 };
    const stored = request.cookies.get(stateCookieName())?.value;

    response.cookies.set(stateCookieName(), "", clearOpts);

    if (!stored || stored !== state) {
      response.cookies.set(returnToCookieName(), "", clearOpts);
      return { valid: false, returnTo: null };
    }

    const returnTo = request.cookies.get(returnToCookieName())?.value ?? null;
    if (returnTo) {
      response.cookies.set(returnToCookieName(), "", clearOpts);
    }

    return { valid: true, returnTo };
  }

  const [state] = args as [string];
  const store = await cookies();
  const clearOpts = { ...stateCookieBase(), maxAge: 0 };
  const stored = store.get(stateCookieName())?.value;

  store.set(stateCookieName(), "", clearOpts);

  if (!stored || stored !== state) {
    store.set(returnToCookieName(), "", clearOpts);
    return { valid: false, returnTo: null };
  }

  const returnTo = store.get(returnToCookieName())?.value ?? null;
  if (returnTo) {
    store.set(returnToCookieName(), "", clearOpts);
  }

  return { valid: true, returnTo };
}
