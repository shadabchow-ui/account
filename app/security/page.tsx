"use client";

import { AccountShell } from "components/account/account-shell";
import {
  LoadingState,
  SecuritySection,
  StateMessage,
} from "components/account/account-sections";
import { useSession } from "lib/account/session";

export default function SecurityPage() {
  const { user, loading, error } = useSession();

  return (
    <AccountShell user={user} title="Security" eyebrow="Sign-in protection">
      {loading ? <LoadingState /> : null}
      {!loading && error ? (
        <StateMessage
          title="Security state unavailable"
          message={error}
          tone="danger"
        />
      ) : null}
      {!loading && !error && !user ? (
        <StateMessage
          title="Sign in required"
          message="Sign in to review security details for this account."
          actionHref="/signin"
          actionLabel="Go to sign in"
        />
      ) : null}
      {!loading && !error && user ? <SecuritySection user={user} /> : null}
    </AccountShell>
  );
}
