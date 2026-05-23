export type AccountAppStatus =
  | "connected"
  | "available"
  | "needs_verification"
  | "coming_soon";

export interface AccountAppLink {
  id: string;
  name: string;
  shortName: string;
  description: string;
  href: string;
  status: AccountAppStatus;
  statusLabel: string;
  fallback: boolean;
}

export interface AccountNavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: string;
}

export const accountNavItems: AccountNavItem[] = [
  { href: "/", label: "Home", shortLabel: "Home", icon: "home" },
  {
    href: "/profile",
    label: "Profile",
    shortLabel: "Profile",
    icon: "profile",
  },
  {
    href: "/security",
    label: "Security",
    shortLabel: "Security",
    icon: "shield",
  },
  { href: "/apps", label: "Connected Apps", shortLabel: "Apps", icon: "grid" },
  { href: "/privacy", label: "Privacy", shortLabel: "Privacy", icon: "lock" },
  { href: "/billing", label: "Billing", shortLabel: "Billing", icon: "wallet" },
  {
    href: "/sessions",
    label: "Sessions",
    shortLabel: "Sessions",
    icon: "devices",
  },
  {
    href: "/settings",
    label: "Settings",
    shortLabel: "Settings",
    icon: "settings",
  },
];

export const accountApps: AccountAppLink[] = [
  {
    id: "upcube",
    name: "Upcube",
    shortName: "UP",
    description: "Core entry point for the Upcube product family.",
    href: "https://upcube.ai",
    status: "connected",
    statusLabel: "Connected",
    fallback: false,
  },
  {
    id: "ethen",
    name: "Ethen",
    shortName: "ET",
    description: "Workspace intelligence and chat surfaces.",
    href: "https://ethen.upcube.ai",
    status: "connected",
    statusLabel: "Connected",
    fallback: false,
  },
  {
    id: "planet",
    name: "Planet",
    shortName: "PL",
    description: "Spatial exploration and geospatial product access.",
    href: "https://planet.upcube.ai",
    status: "available",
    statusLabel: "Available",
    fallback: false,
  },
  {
    id: "news",
    name: "News",
    shortName: "NW",
    description: "Current events and editorial discovery inside Upcube.",
    href: "https://news.upcube.ai",
    status: "available",
    statusLabel: "Available",
    fallback: false,
  },
  {
    id: "books",
    name: "Books",
    shortName: "BK",
    description: "Reading, catalog discovery, and knowledge surfaces.",
    href: "https://books.upcube.ai",
    status: "available",
    statusLabel: "Available",
    fallback: false,
  },
  {
    id: "games",
    name: "Games",
    shortName: "GM",
    description: "Games discovery and entertainment account access.",
    href: "https://games.upcube.ai",
    status: "available",
    statusLabel: "Available",
    fallback: false,
  },
  {
    id: "jobs",
    name: "Jobs",
    shortName: "JB",
    description: "Hiring, opportunity discovery, and career tools.",
    href: "https://jobs.upcube.ai",
    status: "available",
    statusLabel: "Available",
    fallback: false,
  },
  {
    id: "quantum",
    name: "Quantum",
    shortName: "QT",
    description: "Research and product direction for quantum computing.",
    href: "https://quantum.upcube.ai",
    status: "available",
    statusLabel: "Available",
    fallback: false,
  },
  {
    id: "robotics",
    name: "Robotics",
    shortName: "RB",
    description: "Robotics systems and automation surfaces.",
    href: "https://robotics.upcube.ai",
    status: "available",
    statusLabel: "Available",
    fallback: false,
  },
  {
    id: "university",
    name: "University",
    shortName: "UN",
    description: "Learning, curriculum, and educational product access.",
    href: "https://university.upcube.ai",
    status: "available",
    statusLabel: "Available",
    fallback: false,
  },
  {
    id: "cloud",
    name: "Cloud",
    shortName: "CL",
    description: "Infrastructure and platform work routed through Upcube.",
    href: "https://upcube.ai",
    status: "coming_soon",
    statusLabel: "Routes through Upcube",
    fallback: true,
  },
  {
    id: "commerce",
    name: "Commerce",
    shortName: "CM",
    description: "Commerce surfaces are not published here yet.",
    href: "https://upcube.ai",
    status: "coming_soon",
    statusLabel: "Routes through Upcube",
    fallback: true,
  },
  {
    id: "os",
    name: "OS",
    shortName: "OS",
    description: "Operating-system work remains a future linked surface.",
    href: "https://upcube.ai",
    status: "coming_soon",
    statusLabel: "Routes through Upcube",
    fallback: true,
  },
  {
    id: "mobile-os",
    name: "Mobile OS",
    shortName: "MO",
    description: "Mobile OS remains a future linked surface.",
    href: "https://upcube.ai",
    status: "coming_soon",
    statusLabel: "Routes through Upcube",
    fallback: true,
  },
  {
    id: "voice",
    name: "Voice",
    shortName: "VC",
    description: "Voice routes through the main Upcube surface for now.",
    href: "https://upcube.ai",
    status: "coming_soon",
    statusLabel: "Routes through Upcube",
    fallback: true,
  },
];

export type AccountStatusTone = "success" | "neutral" | "warning" | "muted";

export function getStatusTone(status: AccountAppStatus): AccountStatusTone {
  switch (status) {
    case "connected":
      return "success";
    case "available":
      return "neutral";
    case "needs_verification":
      return "warning";
    case "coming_soon":
      return "muted";
  }
}
