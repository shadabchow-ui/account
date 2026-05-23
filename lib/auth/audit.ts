import { getStore } from "lib/db/store";
import type { AuditEvent, NewAuditEvent } from "lib/db/types";

const SENSITIVE_KEY_PATTERNS = [
  /access_token/i,
  /refresh_token/i,
  /id_token/i,
  /token/i,
  /secret/i,
  /password/i,
  /credential/i,
];

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

function sanitizeMetadata(metadataJson: string): string {
  try {
    const parsed = JSON.parse(metadataJson);
    const safe: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(parsed)) {
      if (isSensitiveKey(key)) continue;
      safe[key] = value;
    }

    return JSON.stringify(safe);
  } catch {
    return metadataJson;
  }
}

export async function createAuditEvent(
  event: NewAuditEvent & { id: string },
): Promise<AuditEvent> {
  const store = getStore();
  return store.createAuditEvent({
    ...event,
    metadata_json: sanitizeMetadata(event.metadata_json),
  });
}
