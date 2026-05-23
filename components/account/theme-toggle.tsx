"use client";

import clsx from "clsx";
import { useAccountTheme } from "./account-theme-provider";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="3.5" />
      <path
        d="M12 2.75v2.5M12 18.75v2.5M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2.75 12h2.5M18.75 12h2.5M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden
    >
      <path
        d="M20.2 14.2A7.8 7.8 0 0 1 9.8 3.8a8.7 8.7 0 1 0 10.4 10.4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme, ready } = useAccountTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={ready ? `Switch to ${nextTheme} theme` : "Toggle theme"}
      aria-pressed={theme === "light"}
      onClick={toggleTheme}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--account-border)] bg-[var(--account-surface-strong)] px-3 text-[var(--account-text)] transition hover:border-[var(--account-border-strong)] hover:bg-[var(--account-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--account-focus)]"
    >
      <span className="relative flex h-7 w-14 items-center rounded-full bg-[var(--account-toggle-track)] px-1">
        <span
          className={clsx(
            "absolute h-5 w-5 rounded-full bg-[var(--account-toggle-thumb)] shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition-transform duration-200",
            theme === "light" ? "translate-x-7" : "translate-x-0",
          )}
        />
        <span className="relative z-10 flex w-full items-center justify-between px-0.5 text-[var(--account-subtle)]">
          <MoonIcon className="h-3.5 w-3.5" />
          <SunIcon className="h-3.5 w-3.5" />
        </span>
      </span>
    </button>
  );
}
