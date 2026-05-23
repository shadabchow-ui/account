import type { NextResponse } from "next/server";
import { createAuditEvent } from "./audit";
import {
  applyClearSessionCookieToResponse,
  applySessionCookieToResponse,
  getSessionFromCookies,
} from "./session";
import { getStore } from "lib/db/store";

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createPersistentSessionOnResponse(
  response: NextResponse,
  payload: {
    sub: string;
    email: string;
    name: string;
    picture?: string;
  },
  userAgent?: string | null,
  ip?: string | null,
): Promise<void> {
  const store = getStore();
  const rawToken = crypto.randomUUID();
  const tokenHash = await sha256(rawToken);

  await store.createSession({
    id: crypto.randomUUID(),
    user_id: payload.sub,
    token_hash: tokenHash,
    expires_at: new Date(Date.now() + SESSION_MAX_AGE_MS),
    revoked_at: null,
    user_agent_hash: userAgent ? await sha256(userAgent) : null,
    ip_hash: ip ? await sha256(ip) : null,
  });

  await applySessionCookieToResponse(response, {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    token: rawToken,
  });
}

export async function revokePersistentSessionOnResponse(
  response: NextResponse,
): Promise<void> {
  const sessionPayload = await getSessionFromCookies();
  if (!sessionPayload?.token) {
    applyClearSessionCookieToResponse(response);
    return;
  }

  const tokenHash = await sha256(sessionPayload.token);
  const store = getStore();
  const dbSession = await store.getSessionByTokenHash(tokenHash);
  if (dbSession && !dbSession.revoked_at) {
    await store.revokeSession(dbSession.id);
    await createAuditEvent({
      id: crypto.randomUUID(),
      user_id: dbSession.user_id,
      event_type: "session.revoked",
      metadata_json: JSON.stringify({ session_id: dbSession.id }),
    });
  }

  applyClearSessionCookieToResponse(response);
}

export async function getUserForSessionRequest(): Promise<{
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
} | null> {
  const sessionPayload = await getSessionFromCookies();
  if (!sessionPayload?.token) return null;

  const tokenHash = await sha256(sessionPayload.token);
  const store = getStore();
  const dbSession = await store.getSessionByTokenHash(tokenHash);
  if (!dbSession || dbSession.revoked_at || new Date() > dbSession.expires_at) {
    return null;
  }

  const user = await store.getUserById(dbSession.user_id);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  };
}
