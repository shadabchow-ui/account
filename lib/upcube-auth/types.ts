export interface UpcubeUser {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
}

export interface SessionResult {
  session: { user: UpcubeUser } | null;
  authenticated: boolean;
}
