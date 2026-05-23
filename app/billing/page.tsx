"use client";

import { AccountShell } from "components/account/account-shell";
import {
  BillingSection,
  LoadingState,
  StateMessage,
} from "components/account/account-sections";
import { useSession } from "lib/account/session";

export default function BillingPage() {
  const { user, loading, error } = useSession();

  return (
    <AccountShell user={user} title="Billing" eyebrow="Subscriptions">
      {loading ? <LoadingState /> : null}
      {!loading && error ? (
        <StateMessage
          title="Billing state unavailable"
          message={error}
          tone="danger"
        />
      ) : null}
      {!loading && !error ? <BillingSection /> : null}
    </AccountShell>
  );
}
