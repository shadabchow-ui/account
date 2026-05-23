"use client";

import { AccountShell } from "components/account/account-shell";
import {
  AppsSection,
  LoadingState,
  StateMessage,
} from "components/account/account-sections";
import { useSession } from "lib/account/session";

export default function AppsPage() {
  const { user, loading, error } = useSession();

  return (
    <AccountShell user={user} title="Connected apps" eyebrow="Product access">
      {loading ? <LoadingState /> : null}
      {!loading && error ? (
        <StateMessage
          title="Connected apps unavailable"
          message={error}
          tone="danger"
        />
      ) : null}
      {!loading && !error ? <AppsSection /> : null}
    </AccountShell>
  );
}
