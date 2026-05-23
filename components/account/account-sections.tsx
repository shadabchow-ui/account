"use client";

import clsx from "clsx";
import Link from "next/link";
import { accountApps, getStatusTone } from "lib/account/dashboard";
import type { UpcubeUser } from "lib/account/session";
import { GlyphChevron } from "./account-icons";

export function LoadingState() {
  return (
    <div className="space-y-5">
      <div className="h-40 animate-pulse rounded-[1.75rem] bg-[var(--account-skeleton)]" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-36 animate-pulse rounded-[1.5rem] bg-[var(--account-skeleton)]" />
        <div className="h-36 animate-pulse rounded-[1.5rem] bg-[var(--account-skeleton)]" />
      </div>
      <div className="h-48 animate-pulse rounded-[1.5rem] bg-[var(--account-skeleton)]" />
    </div>
  );
}

export function StateMessage({
  title,
  message,
  actionHref,
  actionLabel,
  tone = "default",
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  tone?: "default" | "danger";
}) {
  return (
    <section className="rounded-[1.75rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6 md:p-7">
      <p className="text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
        Account state
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--account-text-strong)]">
        {title}
      </h2>
      <p
        className={clsx(
          "mt-3 max-w-xl text-sm leading-6 text-[var(--account-muted)]",
          tone === "danger" && "text-[var(--account-text)]",
        )}
      >
        {message}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center rounded-full bg-[var(--account-button)] px-5 py-3 text-sm font-medium text-[var(--account-button-text)] transition hover:bg-[var(--account-button-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}

export function OverviewSection({ user }: { user: UpcubeUser }) {
  const initials = (user.name ?? user.email ?? "U")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const quickActions = [
    {
      href: "/security",
      label: "Security",
      copy: "Review sign-in status and active session details.",
    },
    {
      href: "/apps",
      label: "Connected Apps",
      copy: "Open and review the Upcube products linked to this account.",
    },
    {
      href: "/privacy",
      label: "Privacy",
      copy: "Read what account data is used for sign-in and session continuity.",
    },
    {
      href: "/sessions",
      label: "Sessions",
      copy: "View the current browser session and sign-out controls.",
    },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-16 w-16 rounded-[1.35rem] border border-[var(--account-border)] object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-[var(--account-border)] bg-[var(--account-surface-strong)] text-lg font-semibold tracking-[0.12em] text-[var(--account-text-strong)]">
                {initials}
              </div>
            )}
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
                Trusted identity hub
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--account-text-strong)]">
                {user.name ?? "Upcube Account"}
              </h2>
              <p className="mt-2 text-sm break-all text-[var(--account-muted)]">
                {user.email ?? "Signed in with Google"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusPill label="Signed in" tone="success" />
                <StatusPill label="Google connected" tone="neutral" />
                <StatusPill label="Review security" tone="warning" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center rounded-full bg-[var(--account-button)] px-5 py-3 text-sm font-medium text-[var(--account-button-text)] transition hover:bg-[var(--account-button-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
            >
              Manage profile
            </Link>
            <a
              href="/api/auth/logout"
              className="inline-flex items-center rounded-full border border-[var(--account-border-strong)] px-5 py-3 text-sm font-medium text-[var(--account-text)] transition hover:bg-[var(--account-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
            >
              Sign out
            </a>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-[1.65rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6">
          <p className="text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
            Account health
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--account-text-strong)]">
            Security review recommended
          </h3>
          <p className="mt-3 text-sm leading-6 text-[var(--account-muted)]">
            Google OAuth is active and the current session is valid. Passkeys,
            password rotation, and session history are not implemented in this
            app yet, so this dashboard stays explicit about what is and is not
            available.
          </p>
          <Link
            href="/security"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--account-text-strong)] transition hover:text-[var(--account-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
          >
            Manage security
            <GlyphChevron className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <section className="rounded-[1.65rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6">
          <p className="text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
            Recent activity
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--account-text-strong)]">
            Current browser session
          </h3>
          <p className="mt-3 text-sm leading-6 text-[var(--account-muted)]">
            This account center currently exposes the active signed-in browser
            session. Multi-device history, revoke controls, and audit timelines
            remain future work.
          </p>
          <div className="mt-5 rounded-[1.15rem] border border-[var(--account-border)] bg-[var(--account-surface-strong)] px-4 py-3 text-sm text-[var(--account-text)]">
            Signed in with Google and ready to return to linked Upcube products.
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-[1.5rem] border border-[var(--account-border)] bg-[var(--account-card)] p-5 transition hover:border-[var(--account-border-strong)] hover:bg-[var(--account-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
          >
            <p className="text-sm font-medium text-[var(--account-text-strong)]">
              {action.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--account-muted)]">
              {action.copy}
            </p>
          </Link>
        ))}
      </div>

      <section className="rounded-[1.75rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
              Product access
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--account-text-strong)]">
              Upcube app family
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--account-muted)]">
              Account access extends across the active Upcube product family.
              Apps without a confirmed public destination stay routed through
              the main Upcube surface instead of inventing product-specific
              URLs.
            </p>
          </div>
          <Link
            href="/apps"
            className="hidden rounded-full border border-[var(--account-border)] px-4 py-2 text-sm text-[var(--account-text)] transition hover:bg-[var(--account-surface-hover)] md:inline-flex md:items-center"
          >
            View all apps
          </Link>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {accountApps.slice(0, 6).map((app) => (
            <div
              key={app.id}
              className="rounded-[1.2rem] border border-[var(--account-border)] bg-[var(--account-surface-strong)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--account-text-strong)]">
                  {app.name}
                </p>
                <StatusPill
                  label={app.statusLabel}
                  tone={getStatusTone(app.status)}
                  compact
                />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--account-muted)]">
                {app.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ProfileSection({ user }: { user: UpcubeUser }) {
  const details = [
    { label: "Name", value: user.name ?? "Not provided by session" },
    { label: "Email", value: user.email ?? "Not provided by session" },
    {
      label: "Profile picture",
      value: user.avatar
        ? "Available from Google session"
        : "No profile image returned",
    },
    {
      label: "Account ID",
      value: user.id ?? "No support-facing account ID exposed in this view.",
    },
    { label: "Provider", value: "Google OAuth" },
    {
      label: "Created date",
      value: "Not provided by the current session API.",
    },
    {
      label: "Last sign-in",
      value: "Not provided by the current session API.",
    },
  ];

  return (
    <InfoGrid
      title="Profile"
      subtitle="Read-only identity details from the current account session."
      rows={details}
    />
  );
}

export function SecuritySection({ user }: { user: UpcubeUser }) {
  const cards = [
    {
      title: "Google sign-in connected",
      copy: "This account uses Google OAuth. Upcube does not manage your Google password or Google two-factor settings in this app.",
    },
    {
      title: "Session active",
      copy: "The current browser session is active. Device history and revoke-all controls are not implemented yet.",
    },
    {
      title: "No password stored by Upcube",
      copy: "This account center does not expose a local password or passkey flow today.",
    },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-[1.75rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6 md:p-7">
        <p className="text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
          Security overview
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--account-text-strong)]">
          Manage security with honest scope
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--account-muted)]">
          This view reflects the current account implementation: Google OAuth, a
          signed browser session, and clear placeholders where broader controls
          have not shipped.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-[1.2rem] border border-[var(--account-border)] bg-[var(--account-surface-strong)] p-4"
            >
              <p className="text-sm font-medium text-[var(--account-text-strong)]">
                {card.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--account-muted)]">
                {card.copy}
              </p>
            </div>
          ))}
        </div>
      </section>
      <InfoGrid
        title="Security details"
        subtitle="Current connection and session details for this signed-in account."
        rows={[
          { label: "Sign-in method", value: "Google OAuth" },
          { label: "Session state", value: "Active in this browser" },
          {
            label: "Password / passkeys",
            value: "Not implemented in this account app",
          },
          { label: "Account ID", value: user.id ?? "Not exposed" },
        ]}
      />
    </div>
  );
}

export function AppsSection() {
  return (
    <section className="rounded-[1.75rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6 md:p-7">
      <p className="text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
        Connected apps
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--account-text-strong)]">
        Access across the Upcube product family
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--account-muted)]">
        Statuses below describe whether an app is already linked, ready to open,
        needs additional verification, or is still routed through the main
        Upcube surface.
      </p>
      <div className="mt-6 space-y-3">
        {accountApps.map((app) => (
          <div
            key={app.id}
            className="rounded-[1.25rem] border border-[var(--account-border)] bg-[var(--account-surface-strong)] p-4 md:p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-[var(--account-text-strong)]">
                    {app.name}
                  </p>
                  <StatusPill
                    label={app.statusLabel}
                    tone={getStatusTone(app.status)}
                    compact
                  />
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--account-muted)]">
                  {app.description}
                </p>
                <p className="mt-2 text-xs break-all text-[var(--account-subtle)]">
                  {app.href}
                </p>
              </div>
              <Link
                href={app.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[var(--account-border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--account-text)] transition hover:bg-[var(--account-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
              >
                Open app
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PrivacySection() {
  return (
    <div className="space-y-5">
      <InfoGrid
        title="Privacy"
        subtitle="Legally careful summaries of what this account app currently uses and stores."
        rows={[
          {
            label: "Account data",
            value:
              "This app uses basic sign-in profile fields returned by Google, such as name, email, and profile image when available.",
          },
          {
            label: "Sign-in data",
            value:
              "Google OAuth is used to authenticate you. This dashboard does not claim broader access to your Google account beyond the configured sign-in scopes.",
          },
          {
            label: "Session and cookies",
            value:
              "A signed session cookie keeps you authenticated in the account app. Session continuity exists; a detailed multi-device dashboard does not yet.",
          },
          {
            label: "Connected app data",
            value:
              "Product-specific data controls are managed by each product app and are not fully centralized in this dashboard today.",
          },
        ]}
      />
      <section className="grid gap-4 md:grid-cols-2">
        <PlaceholderCard
          title="Export account data"
          copy="Data export is planned for a future release and is not available from this account app today."
        />
        <PlaceholderCard
          title="Delete account"
          copy="Account deletion controls are not implemented here yet. This page intentionally avoids presenting a fake destructive action."
        />
      </section>
    </div>
  );
}

export function BillingSection() {
  return (
    <section className="rounded-[1.75rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6 md:p-7">
      <p className="text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
        Billing
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--account-text-strong)]">
        Billing is not active for this account yet
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--account-muted)]">
        Paid plans, invoices, and subscription controls are not implemented in
        this repo. When billing exists, it should either appear here or clearly
        hand off to the responsible product app.
      </p>
      <div className="mt-6 rounded-[1.25rem] border border-dashed border-[var(--account-border-strong)] bg-[var(--account-surface-strong)] p-5 text-sm text-[var(--account-muted)]">
        Coming soon or managed by a product app.
      </div>
    </section>
  );
}

export function SessionsSection({ user }: { user: UpcubeUser }) {
  return (
    <div className="space-y-5">
      <InfoGrid
        title="Sessions"
        subtitle="Current session details and sign-out controls for this browser."
        rows={[
          { label: "Current browser session", value: "Active" },
          { label: "Provider", value: "Google OAuth" },
          {
            label: "Signed-in user",
            value: user.email ?? user.name ?? "Current session user",
          },
          {
            label: "Return destination",
            value:
              "Shown at sign-in when a validated return_to value is present.",
          },
        ]}
      />
      <section className="rounded-[1.5rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6">
        <p className="text-sm leading-6 text-[var(--account-muted)]">
          Revoke-all, device history, and long-lived session management are not
          implemented in this app yet.
        </p>
        <a
          href="/api/auth/logout"
          className="mt-5 inline-flex items-center rounded-full border border-[var(--account-border-strong)] px-5 py-3 text-sm font-medium text-[var(--account-text)] transition hover:bg-[var(--account-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
        >
          Sign out
        </a>
      </section>
    </div>
  );
}

export function SettingsSection() {
  return (
    <div className="space-y-5">
      <InfoGrid
        title="Settings"
        subtitle="Account-level settings remain intentionally small until this repo exposes real writable preferences."
        rows={[
          {
            label: "Notifications",
            value: "Not configured in this account app",
          },
          {
            label: "Default language",
            value: "Preference storage not implemented yet",
          },
          {
            label: "Developer access",
            value: "Future surface; not active from this dashboard",
          },
          {
            label: "Support",
            value:
              "Use the linked product surface or future account support entry points.",
          },
        ]}
      />
    </div>
  );
}

function InfoGrid({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="rounded-[1.75rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6 md:p-7">
      <p className="text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
        {title}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--account-text-strong)]">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--account-muted)]">
        {subtitle}
      </p>
      <div className="mt-6 divide-y divide-[var(--account-border)] overflow-hidden rounded-[1.25rem] border border-[var(--account-border)] bg-[var(--account-surface-strong)]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-2 px-4 py-4 md:grid-cols-[220px_minmax(0,1fr)] md:px-5"
          >
            <p className="text-xs font-medium tracking-[0.14em] text-[var(--account-subtle)] uppercase">
              {row.label}
            </p>
            <p className="text-sm leading-6 break-words text-[var(--account-text)]">
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlaceholderCard({ title, copy }: { title: string; copy: string }) {
  return (
    <section className="rounded-[1.5rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6">
      <p className="text-sm font-medium text-[var(--account-text-strong)]">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-[var(--account-muted)]">
        {copy}
      </p>
    </section>
  );
}

function StatusPill({
  label,
  tone,
  compact = false,
}: {
  label: string;
  tone: "success" | "neutral" | "warning" | "muted";
  compact?: boolean;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        compact && "px-2.5 py-1 text-[11px]",
        tone === "success" &&
          "bg-[var(--account-status-solid)] text-[var(--account-status-solid-text)]",
        tone === "neutral" &&
          "bg-[var(--account-surface-strong)] text-[var(--account-text)]",
        tone === "warning" &&
          "bg-[var(--account-surface-strong)] text-[var(--account-muted)]",
        tone === "muted" &&
          "bg-[var(--account-surface-strong)] text-[var(--account-subtle)]",
      )}
    >
      {label}
    </span>
  );
}
