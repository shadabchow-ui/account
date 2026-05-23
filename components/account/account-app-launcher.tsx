"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { accountApps } from "lib/account/dashboard";

function LauncherDots() {
  return (
    <span className="grid w-[0.95rem] grid-cols-3 gap-[0.12rem]" aria-hidden>
      {Array.from({ length: 9 }).map((_, index) => (
        <span
          key={index}
          className="block h-[0.2rem] w-[0.2rem] rounded-full bg-current"
        />
      ))}
    </span>
  );
}

export function AccountAppLauncher() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label="Open Upcube apps"
        aria-controls={panelId}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--account-border)] bg-[var(--account-surface-strong)] text-[var(--account-text)] transition hover:border-[var(--account-border-strong)] hover:bg-[var(--account-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
      >
        <LauncherDots />
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Upcube app launcher"
          className="absolute top-[calc(100%+0.75rem)] right-0 z-50 w-[min(23rem,calc(100vw-1.5rem))] rounded-[1.75rem] border border-[var(--account-border)] bg-[var(--account-panel)] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.32)]"
        >
          <p className="mb-4 text-[11px] tracking-[0.16em] text-[var(--account-subtle)] uppercase">
            Apps
          </p>
          <div className="grid grid-cols-3 gap-2">
            {accountApps.map((app) => (
              <Link
                key={app.id}
                href={app.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="group grid min-h-[5.9rem] justify-items-center gap-2 rounded-[1rem] p-3 text-center transition hover:bg-[var(--account-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--account-border)] bg-[var(--account-surface-strong)] text-[11px] font-semibold tracking-[0.12em] text-[var(--account-text)]">
                  {app.shortName}
                </span>
                <span className="text-[13px] leading-4 font-medium text-[var(--account-text)] group-hover:text-[var(--account-text-strong)]">
                  {app.name}
                </span>
                <span
                  className={clsx(
                    "rounded-full px-2 py-1 text-[9px] tracking-[0.12em] uppercase",
                    app.status === "connected" &&
                      "bg-[var(--account-status-solid)] text-[var(--account-status-solid-text)]",
                    app.status !== "connected" &&
                      "bg-[var(--account-surface-strong)] text-[var(--account-subtle)]",
                  )}
                >
                  {app.statusLabel}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
