"use client";

import { AccountShell } from "components/account/account-shell";
import {
  LoadingState,
  ProfileSection,
  StateMessage,
} from "components/account/account-sections";
import { useSession } from "lib/account/session";

export default function ProfilePage() {
  const { user, loading, error } = useSession();

  return (
    <AccountShell user={user} title="Profile" eyebrow="Personal info">
      {loading ? <LoadingState /> : null}
      {!loading && error ? (
        <StateMessage
          title="Profile unavailable"
          message={error}
          tone="danger"
        />
      ) : null}
      {!loading && !error && !user ? (
        <StateMessage
          title="Sign in required"
          message="Sign in to view your account profile details."
          actionHref="/signin"
          actionLabel="Go to sign in"
        />
      ) : null}
      {!loading && !error && user ? <ProfileSection user={user} /> : null}
    </AccountShell>
  );
}
