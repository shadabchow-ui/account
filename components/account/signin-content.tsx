"use client";

import { BrandMark } from "./brand-mark";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_state: "Sign-in session expired. Please try again.",
  missing_code: "Sign-in request incomplete. Please try again.",
  missing_state: "Sign-in request incomplete. Please try again.",
  auth_failed: "Authentication failed. Please try again.",
};

function safeErrorMessage(error: string | null): string | null {
  if (!error) return null;
  return ERROR_MESSAGES[error] ?? error;
}

function ReturnDestination({ returnTo }: { returnTo: string | null }) {
  if (!returnTo) {
    return (
      <div className="rounded-[1.25rem] border border-[var(--account-border)] bg-[var(--account-surface-strong)] px-4 py-3 text-sm text-[var(--account-muted)]">
        No product handoff is attached to this sign-in request.
      </div>
    );
  }

  return (
    <div className="rounded-[1.25rem] border border-[var(--account-border)] bg-[var(--account-surface-strong)] px-4 py-3">
      <p className="text-[11px] tracking-[0.16em] text-[var(--account-subtle)] uppercase">
        Returning to
      </p>
      <p className="mt-2 text-sm break-all text-[var(--account-text)]">
        {returnTo}
      </p>
    </div>
  );
}

function FeaturePill({ label, copy }: { label: string; copy: string }) {
  return (
    <div className="rounded-[1.25rem] border border-[var(--account-border)] bg-[var(--account-surface-strong)] p-4">
      <p className="text-sm font-medium text-[var(--account-text-strong)]">
        {label}
      </p>
      <p className="mt-1 text-xs leading-6 text-[var(--account-muted)]">
        {copy}
      </p>
    </div>
  );
}

export function SignInContent({
  error,
  returnTo,
}: {
  error: string | null;
  returnTo: string | null;
}) {
  const loginHref = returnTo
    ? `/api/auth/login/google?return_to=${encodeURIComponent(returnTo)}`
    : "/api/auth/login/google";
  const displayError = safeErrorMessage(error);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--account-bg)] px-4 py-8 text-[var(--account-text)] md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1180px] items-center justify-center">
        <div className="grid w-full gap-6 rounded-[2rem] border border-[var(--account-border)] bg-[var(--account-card)] p-5 shadow-[0_32px_90px_rgba(0,0,0,0.18)] md:grid-cols-[1.08fr_0.92fr] md:p-7 lg:p-8">
          <section className="rounded-[1.75rem] border border-[var(--account-border)] bg-[var(--account-surface-muted)] p-6 md:p-7">
            <BrandMark />
            <p className="mt-10 text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
              Trusted identity hub
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-[var(--account-text-strong)] md:text-5xl">
              Sign in to continue.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--account-muted)] md:text-base">
              Use your Upcube Account to access News, Books, Jobs, Planet,
              Quantum, Robotics, University, Games, and Ethen.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <FeaturePill
                label="Google OAuth"
                copy="Existing sign-in flow preserved"
              />
              <FeaturePill
                label="Return handoff"
                copy="Validated product redirects supported"
              />
              <FeaturePill
                label="Account center"
                copy="Security, sessions, and connected apps"
              />
              <FeaturePill
                label="Monochrome UI"
                copy="Black, white, and gray across light and dark themes"
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-[var(--account-border)] bg-[var(--account-card)] p-6 md:p-7">
            <p className="text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
              Sign in
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--account-text-strong)]">
              Continue with your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--account-muted)]">
              Your Google sign-in is used only to start the existing account
              session flow configured in this app.
            </p>

            {displayError ? (
              <div className="mt-5 rounded-[1.25rem] border border-[var(--account-border-strong)] bg-[var(--account-surface-strong)] px-4 py-3 text-sm text-[var(--account-text)]">
                {displayError}
              </div>
            ) : null}

            <div className="mt-5">
              <ReturnDestination returnTo={returnTo} />
            </div>

            <a
              href={loginHref}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[var(--account-button)] px-5 py-3.5 text-sm font-medium text-[var(--account-button-text)] transition hover:bg-[var(--account-button-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--account-button-icon-border)] bg-[var(--account-button-icon-bg)] text-xs font-semibold text-[var(--account-button-icon-text)]">
                G
              </span>
              Continue with Google
            </a>

            <p className="mt-6 text-xs leading-6 text-[var(--account-muted)]">
              By continuing, you are signing in to the Upcube account service
              for session management across linked products.
            </p>

            <div className="mt-8 rounded-[1.25rem] border border-[var(--account-border)] bg-[var(--account-surface-strong)] p-4 text-sm text-[var(--account-muted)]">
              Product apps should send you here with a validated{" "}
              <code className="rounded bg-[var(--account-code-bg)] px-1.5 py-0.5 text-[11px] text-[var(--account-text)]">
                return_to
              </code>{" "}
              value when a post-login handoff is needed.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
