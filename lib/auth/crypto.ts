const KEY_ALGORITHM: HmacImportParams = { name: "HMAC", hash: "SHA-256" };

export function getSecretKey(): string {
  const secret = process.env.ACCOUNT_SESSION_SECRET;
  if (!secret) throw new Error("ACCOUNT_SESSION_SECRET is not configured");
  return secret;
}

export async function hmacSign(
  secret: string,
  data: string,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    KEY_ALGORITHM,
    false,
    ["sign"],
  );
  return crypto.subtle.sign(KEY_ALGORITHM, key, encoder.encode(data));
}

export function encodeBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeBase64url(str: string): ArrayBuffer {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function bufferEquals(a: ArrayBuffer, b: ArrayBuffer): boolean {
  if (a.byteLength !== b.byteLength) return false;
  const va = new Uint8Array(a);
  const vb = new Uint8Array(b);
  return va.every((byte, i) => byte === vb[i]);
}

export function randomBase64url(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return encodeBase64url(bytes.buffer);
}
