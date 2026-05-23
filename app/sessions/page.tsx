"use client";

import { AccountShell } from "components/account/account-shell";
import {
  LoadingState,
  SessionsSection,
  StateMessage,
} from "components/account/account-sections";
import { useSession } from "lib/account/session";

export default function SessionsPage() {
  const { user, loading, error } = useSession();

  return (
    <AccountShell user={user} title="Sessions" eyebrow="Current browser access">
      {loading ? <LoadingState /> : null}
      {!loading && error ? (
        <StateMessage
          title="Session details unavailable"
          message={error}
          tone="danger"
        />
      ) : null}
      {!loading && !error && !user ? (
        <StateMessage
          title="Sign in required"
          message="Sign in to view current session details and sign-out controls."
          actionHref="/signin"
          actionLabel="Go to sign in"
        />
      ) : null}
      {!loading && !error && user ? <SessionsSection user={user} /> : null}
    </AccountShell>
  );
}
