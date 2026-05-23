import localFont from "next/font/local";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AccountThemeProvider } from "components/account/account-theme-provider";
import "./globals.css";

const inter = localFont({
  src: [
    {
      path: "../md/Inter/Inter-VariableFont_opsz,wght.ttf",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../md/Inter/Inter-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-account-sans",
  display: "swap",
});

const accountUrl =
  process.env.NEXT_PUBLIC_ACCOUNT_URL || "https://account.upcube.ai";

const themeBootScript = `
(function() {
  try {
    var key = 'upcube-account-theme';
    var saved = window.localStorage.getItem(key);
    var theme = saved === 'light' || saved === 'dark'
      ? saved
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.colorScheme = 'dark';
  }
})();`;

export const metadata: Metadata = {
  metadataBase: new URL(accountUrl),
  title: {
    default: "Upcube Account",
    template: "%s | Upcube Account",
  },
  description:
    "Trusted identity and session center for the Upcube product family.",
  robots: {
    follow: true,
    index: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <AccountThemeProvider>{children}</AccountThemeProvider>
      </body>
    </html>
  );
}
