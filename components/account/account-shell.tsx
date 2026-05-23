"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useMemo, useState } from "react";
import { accountNavItems } from "lib/account/dashboard";
import type { UpcubeUser } from "lib/account/session";
import { AccountAppLauncher } from "./account-app-launcher";
import { BrandMark } from "./brand-mark";
import { GlyphMenu, GlyphNav } from "./account-icons";
import { ThemeToggle } from "./theme-toggle";

function initialsForUser(user: UpcubeUser | null | undefined) {
  const seed = user?.name?.trim() || user?.email?.trim() || "Upcube";

  return seed
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AccountShell({
  children,
  user,
  title,
  eyebrow,
}: {
  children: ReactNode;
  user?: UpcubeUser | null;
  title: string;
  eyebrow: string;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sessionState = user ? "Signed in" : "Signed out";
  const nav = useMemo(() => accountNavItems, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--account-bg)] text-[var(--account-text)] transition-colors duration-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-0 px-0 lg:px-6">
        <aside className="hidden w-[270px] shrink-0 border-r border-[var(--account-border)] bg-[var(--account-sidebar)] px-5 py-6 lg:flex lg:flex-col">
          <BrandMark />
          <nav className="mt-8 space-y-1" aria-label="Account navigation">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]",
                    active
                      ? "border border-[var(--account-border-strong)] bg-[var(--account-surface-strong)] text-[var(--account-text-strong)]"
                      : "border border-transparent text-[var(--account-muted)] hover:bg-[var(--account-surface-hover)] hover:text-[var(--account-text)]",
                  )}
                >
                  <GlyphNav
                    icon={item.icon}
                    className="h-4 w-4 shrink-0"
                    aria-hidden
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-[1.4rem] border border-[var(--account-border)] bg-[var(--account-surface-strong)] p-4">
            <p className="text-xs tracking-[0.16em] text-[var(--account-subtle)] uppercase">
              Identity hub
            </p>
            <p className="mt-2 text-sm text-[var(--account-muted)]">
              One account across the Upcube product family, with sign-in,
              session, and return-path state kept explicit.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-[var(--account-border)] bg-[var(--account-header)] px-4 py-4 backdrop-blur md:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Open account navigation"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--account-border)] bg-[var(--account-surface-strong)] text-[var(--account-text)] transition hover:border-[var(--account-border-strong)] hover:bg-[var(--account-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)] lg:hidden"
                >
                  <GlyphMenu className="h-5 w-5" aria-hidden />
                </button>
                <div className="min-w-0">
                  <p className="text-[11px] tracking-[0.18em] text-[var(--account-subtle)] uppercase">
                    {eyebrow}
                  </p>
                  <h1 className="truncate text-lg font-semibold tracking-[-0.02em] text-[var(--account-text-strong)] md:text-xl">
                    {title}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-[var(--account-border)] bg-[var(--account-surface-strong)] px-3 py-2 text-xs text-[var(--account-muted)] sm:flex sm:items-center sm:gap-2">
                  <span
                    className={clsx(
                      "h-2 w-2 rounded-full bg-[var(--account-indicator)]",
                    )}
                    aria-hidden
                  />
                  {sessionState}
                </div>
                <ThemeToggle />
                <AccountAppLauncher />
                <div className="flex items-center gap-3 rounded-full border border-[var(--account-border)] bg-[var(--account-surface-strong)] px-2 py-2 pl-2.5">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-[var(--account-text)]">
                      {user?.name ?? "Guest"}
                    </p>
                    <p className="max-w-[16rem] truncate text-xs text-[var(--account-muted)]">
                      {user?.email ?? "Use Google to sign in"}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--account-avatar-bg)] text-xs font-semibold tracking-[0.12em] text-[var(--account-avatar-text)]">
                    {initialsForUser(user)}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {drawerOpen ? (
            <div
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            >
              <div
                className="h-full w-[min(86vw,320px)] overflow-y-auto border-r border-[var(--account-border)] bg-[var(--account-sidebar)] p-5"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-3">
                  <BrandMark />
                  <button
                    type="button"
                    aria-label="Close account navigation"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-full border border-[var(--account-border)] px-3 py-2 text-sm text-[var(--account-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <ThemeToggle />
                </div>
                <nav
                  className="mt-8 space-y-1"
                  aria-label="Mobile account navigation"
                >
                  {nav.map((item) => {
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={clsx(
                          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]",
                          active
                            ? "border border-[var(--account-border-strong)] bg-[var(--account-surface-strong)] text-[var(--account-text-strong)]"
                            : "border border-transparent text-[var(--account-muted)] hover:bg-[var(--account-surface-hover)] hover:text-[var(--account-text)]",
                        )}
                      >
                        <GlyphNav
                          icon={item.icon}
                          className="h-4 w-4 shrink-0"
                          aria-hidden
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          ) : null}

          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-[760px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
