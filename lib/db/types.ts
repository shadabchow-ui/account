export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface OAuthAccount {
  id: string;
  user_id: string;
  provider: string;
  provider_account_id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
  revoked_at: Date | null;
  user_agent_hash: string | null;
  ip_hash: string | null;
}

export interface AuditEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  metadata_json: string;
  created_at: Date;
}

export type NewUser = Omit<User, "id" | "created_at" | "updated_at">;
export type NewOAuthAccount = Omit<
  OAuthAccount,
  "id" | "created_at" | "updated_at"
>;
export type NewSession = Omit<Session, "id" | "created_at" | "updated_at">;
export type NewAuditEvent = Omit<AuditEvent, "id" | "created_at">;
