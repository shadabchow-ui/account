"use client";

import { useCallback, useEffect, useState } from "react";

export interface UpcubeUser {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface SessionResponse {
  user: UpcubeUser | null;
}

export function useSession() {
  const [user, setUser] = useState<UpcubeUser | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/auth/session", {
        credentials: "include",
      });
      if (res.status === 401) {
        setUser(null);
        return;
      }
      if (!res.ok) {
        throw new Error(`Session fetch failed: ${res.status}`);
      }
      const data: SessionResponse = await res.json();
      setUser(data.user ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch session");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return { user, loading, error, refetch: fetchSession };
}
