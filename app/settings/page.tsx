"use client";

import { AccountShell } from "components/account/account-shell";
import {
  LoadingState,
  SettingsSection,
  StateMessage,
} from "components/account/account-sections";
import { useSession } from "lib/account/session";

export default function SettingsPage() {
  const { user, loading, error } = useSession();

  return (
    <AccountShell user={user} title="Settings" eyebrow="Account configuration">
      {loading ? <LoadingState /> : null}
      {!loading && error ? (
        <StateMessage
          title="Settings unavailable"
          message={error}
          tone="danger"
        />
      ) : null}
      {!loading && !error ? <SettingsSection /> : null}
    </AccountShell>
  );
}
