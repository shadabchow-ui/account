"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AccountTheme = "dark" | "light";

const STORAGE_KEY = "upcube-account-theme";

function getSystemTheme(): AccountTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme: AccountTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

type AccountThemeContextValue = {
  theme: AccountTheme;
  setTheme: (theme: AccountTheme) => void;
  toggleTheme: () => void;
  ready: boolean;
};

const AccountThemeContext = createContext<AccountThemeContextValue | null>(
  null,
);

export function AccountThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AccountTheme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const nextTheme =
      saved === "light" || saved === "dark" ? saved : getSystemTheme();

    setThemeState(nextTheme);
    applyTheme(nextTheme);
    setReady(true);

    if (saved === null) {
      const media = window.matchMedia("(prefers-color-scheme: light)");
      const handleChange = () => {
        const systemTheme = media.matches ? "light" : "dark";
        setThemeState(systemTheme);
        applyTheme(systemTheme);
      };

      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }
  }, []);

  const value = useMemo<AccountThemeContextValue>(
    () => ({
      theme,
      ready,
      setTheme: (nextTheme) => {
        setThemeState(nextTheme);
        applyTheme(nextTheme);
        window.localStorage.setItem(STORAGE_KEY, nextTheme);
      },
      toggleTheme: () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setThemeState(nextTheme);
        applyTheme(nextTheme);
        window.localStorage.setItem(STORAGE_KEY, nextTheme);
      },
    }),
    [ready, theme],
  );

  return (
    <AccountThemeContext.Provider value={value}>
      {children}
    </AccountThemeContext.Provider>
  );
}

export function useAccountTheme() {
  const context = useContext(AccountThemeContext);
  if (!context) {
    throw new Error("useAccountTheme must be used inside AccountThemeProvider");
  }
  return context;
}
