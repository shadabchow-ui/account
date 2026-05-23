import { getAccountUrl } from "./config";
import type { SessionResult, UpcubeUser } from "./types";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    throw new Error(
      `Upcube auth request failed: ${res.status} ${res.statusText}`,
    );
  }

  return res.json() as Promise<T>;
}

export async function getSession(): Promise<SessionResult> {
  try {
    const url = `${getAccountUrl()}/api/auth/session`;
    const data = await fetchJson<{ user: UpcubeUser | null }>(url);
    if (data.user) return { session: { user: data.user }, authenticated: true };
    return { session: null, authenticated: false };
  } catch {
    return { session: null, authenticated: false };
  }
}

function validateReturnToClient(raw: string): string | null {
  if (!raw) return null;
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  try {
    const url = new URL(raw);
    if (url.protocol === "https:" || url.protocol === "http:") return raw;
    return null;
  } catch {
    return null;
  }
}

export function buildLoginUrl(returnTo?: string): string {
  const base = `${getAccountUrl()}/api/auth/login/google`;
  if (returnTo) {
    const valid = validateReturnToClient(returnTo);
    if (valid) return `${base}?return_to=${encodeURIComponent(valid)}`;
  }
  return base;
}

export function buildLogoutUrl(returnTo?: string): string {
  const base = `${getAccountUrl()}/api/auth/logout`;
  if (returnTo) {
    const valid = validateReturnToClient(returnTo);
    if (valid) return `${base}?return_to=${encodeURIComponent(valid)}`;
  }
  return base;
}
