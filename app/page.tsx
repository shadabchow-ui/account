"use client";

import { AccountShell } from "components/account/account-shell";
import {
  LoadingState,
  OverviewSection,
  StateMessage,
} from "components/account/account-sections";
import { useSession } from "lib/account/session";

export default function HomePage() {
  const { user, loading, error } = useSession();

  return (
    <AccountShell user={user} title="Account overview" eyebrow="Upcube Account">
      {loading ? <LoadingState /> : null}
      {!loading && error ? (
        <StateMessage
          title="Session unavailable"
          message={error}
          actionHref="/signin"
          actionLabel="Sign in again"
          tone="danger"
        />
      ) : null}
      {!loading && !error && !user ? (
        <StateMessage
          title="Sign in to open your account center"
          message="Use your Upcube Account to manage profile details, review security state, browse connected apps, and return safely to linked product surfaces."
          actionHref="/signin"
          actionLabel="Continue to sign in"
        />
      ) : null}
      {!loading && !error && user ? <OverviewSection user={user} /> : null}
    </AccountShell>
  );
}
