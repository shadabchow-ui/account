"use client";

import { AccountShell } from "components/account/account-shell";
import {
  LoadingState,
  PrivacySection,
  StateMessage,
} from "components/account/account-sections";
import { useSession } from "lib/account/session";

export default function PrivacyPage() {
  const { user, loading, error } = useSession();

  return (
    <AccountShell user={user} title="Privacy" eyebrow="Data and sessions">
      {loading ? <LoadingState /> : null}
      {!loading && error ? (
        <StateMessage
          title="Privacy details unavailable"
          message={error}
          tone="danger"
        />
      ) : null}
      {!loading && !error ? <PrivacySection /> : null}
    </AccountShell>
  );
}
