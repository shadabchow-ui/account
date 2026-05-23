import type {
  AuditEvent,
  NewAuditEvent,
  NewOAuthAccount,
  NewSession,
  NewUser,
  OAuthAccount,
  Session,
  User,
} from "./types";

export interface DatabaseStore {
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: NewUser & { id: string }): Promise<User>;
  updateUser(
    id: string,
    fields: Partial<Pick<User, "name" | "avatar_url" | "email">>,
  ): Promise<User>;
  getOAuthAccount(
    provider: string,
    providerAccountId: string,
  ): Promise<OAuthAccount | null>;
  createOAuthAccount(
    account: NewOAuthAccount & { id: string },
  ): Promise<OAuthAccount>;
  createSession(session: NewSession & { id: string }): Promise<Session>;
  getSessionByTokenHash(tokenHash: string): Promise<Session | null>;
  revokeSession(id: string): Promise<void>;
  createAuditEvent(event: NewAuditEvent & { id: string }): Promise<AuditEvent>;
}

const now = () => new Date();

class MemoryStore implements DatabaseStore {
  private users = new Map<string, User>();
  private usersByEmail = new Map<string, string>();
  private oauthAccounts = new Map<string, OAuthAccount>();
  private oauthByProviderAndAccount = new Map<string, string>();
  private sessions = new Map<string, Session>();
  private auditEvents: AuditEvent[] = [];

  private oauthKey(provider: string, providerAccountId: string): string {
    return `${provider}:${providerAccountId}`;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const userId = this.usersByEmail.get(email.toLowerCase());
    if (!userId) return null;
    return this.users.get(userId) ?? null;
  }

  async createUser(user: NewUser & { id: string }): Promise<User> {
    const record: User = { ...user, created_at: now(), updated_at: now() };
    this.users.set(user.id, record);
    this.usersByEmail.set(user.email.toLowerCase(), user.id);
    return record;
  }

  async updateUser(
    id: string,
    fields: Partial<Pick<User, "name" | "avatar_url" | "email">>,
  ): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");

    if (fields.email !== undefined && fields.email !== user.email) {
      this.usersByEmail.delete(user.email.toLowerCase());
      user.email = fields.email;
      this.usersByEmail.set(user.email.toLowerCase(), id);
    }

    if (fields.name !== undefined) user.name = fields.name;
    if (fields.avatar_url !== undefined) user.avatar_url = fields.avatar_url;
    user.updated_at = now();
    return user;
  }

  async getOAuthAccount(
    provider: string,
    providerAccountId: string,
  ): Promise<OAuthAccount | null> {
    const key = this.oauthKey(provider, providerAccountId);
    const accountId = this.oauthByProviderAndAccount.get(key);
    if (!accountId) return null;
    return this.oauthAccounts.get(accountId) ?? null;
  }

  async createOAuthAccount(
    account: NewOAuthAccount & { id: string },
  ): Promise<OAuthAccount> {
    const record: OAuthAccount = {
      ...account,
      created_at: now(),
      updated_at: now(),
    };
    this.oauthAccounts.set(account.id, record);
    this.oauthByProviderAndAccount.set(
      this.oauthKey(account.provider, account.provider_account_id),
      account.id,
    );
    return record;
  }

  async createSession(session: NewSession & { id: string }): Promise<Session> {
    const record: Session = {
      ...session,
      created_at: now(),
      updated_at: now(),
    };
    this.sessions.set(session.id, record);
    return record;
  }

  async getSessionByTokenHash(tokenHash: string): Promise<Session | null> {
    for (const session of this.sessions.values()) {
      if (session.token_hash === tokenHash) return session;
    }
    return null;
  }

  async revokeSession(id: string): Promise<void> {
    const session = this.sessions.get(id);
    if (session) {
      session.revoked_at = now();
      session.updated_at = now();
    }
  }

  async createAuditEvent(
    event: NewAuditEvent & { id: string },
  ): Promise<AuditEvent> {
    const record: AuditEvent = { ...event, created_at: now() };
    this.auditEvents.push(record);
    return record;
  }
}

let store: DatabaseStore | null = null;

export function getStore(): DatabaseStore {
  if (!store) {
    store = new MemoryStore();
  }
  return store;
}
