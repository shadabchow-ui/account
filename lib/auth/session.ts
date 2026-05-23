import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import {
  bufferEquals,
  decodeBase64url,
  encodeBase64url,
  getSecretKey,
  hmacSign,
} from "./crypto";

const SESSION_MAX_AGE = 7 * 24 * 60 * 60;
const PROD_COOKIE_NAME = "__Secure-upcube_session";
const DEV_COOKIE_NAME = "upcube_session";

export interface SessionPayload {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
  token?: string;
  iat: number;
  exp: number;
}

export interface SessionInput {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
  token?: string;
}

function isSecure(): boolean {
  return process.env.NODE_ENV === "production";
}

function getCookieName(): string {
  return isSecure() ? PROD_COOKIE_NAME : DEV_COOKIE_NAME;
}

function getCookieDomain(): string | undefined {
  if (!isSecure()) return undefined;
  return process.env.COOKIE_DOMAIN || undefined;
}

function cookieOpts(maxAge: number): Record<string, string | number | boolean> {
  const secure = isSecure();
  const domain = getCookieDomain();
  return {
    httpOnly: true,
    path: "/",
    maxAge,
    sameSite: "lax" as const,
    secure,
    ...(domain ? { domain } : {}),
  };
}

export async function createSessionToken(input: SessionInput): Promise<string> {
  const secret = getSecretKey();
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    ...input,
    iat: now,
    exp: now + SESSION_MAX_AGE,
  };
  const json = JSON.stringify(payload);
  const payloadB64 = encodeBase64url(
    new TextEncoder().encode(json).buffer as ArrayBuffer,
  );
  const sig = encodeBase64url(await hmacSign(secret, payloadB64));

  return `${payloadB64}.${sig}`;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const secret = getSecretKey();
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadB64, signatureB64] = parts;
    if (!payloadB64 || !signatureB64) return null;

    const expectedSig = await hmacSign(secret, payloadB64);
    const expectedSigB64 = encodeBase64url(expectedSig);

    if (
      !bufferEquals(
        new TextEncoder().encode(signatureB64).buffer as ArrayBuffer,
        new TextEncoder().encode(expectedSigB64).buffer as ArrayBuffer,
      )
    ) {
      return null;
    }

    const json = new TextDecoder().decode(decodeBase64url(payloadB64));
    const payload = JSON.parse(json) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;
  if (!token) return null;
  return validateSessionToken(token);
}

export async function applySessionCookieToResponse(
  response: NextResponse,
  input: SessionInput,
): Promise<void> {
  const token = await createSessionToken(input);
  response.cookies.set(getCookieName(), token, cookieOpts(SESSION_MAX_AGE));
}

export function applyClearSessionCookieToResponse(
  response: NextResponse,
): void {
  const opts = cookieOpts(0);
  response.cookies.set(getCookieName(), "", { ...opts, maxAge: 0 });
  response.cookies.set(
    getCookieName() === PROD_COOKIE_NAME ? DEV_COOKIE_NAME : PROD_COOKIE_NAME,
    "",
    { ...opts, maxAge: 0 },
  );
}
