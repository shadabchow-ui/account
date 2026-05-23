import type { SVGProps } from "react";

export function GlyphGrid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M5 5h4v4H5zM15 5h4v4h-4zM5 15h4v4H5zM15 15h4v4h-4z" />
    </svg>
  );
}

export function GlyphMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function GlyphChevron(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GlyphNav({
  icon,
  ...props
}: SVGProps<SVGSVGElement> & { icon: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  };

  switch (icon) {
    case "home":
      return (
        <svg {...common} {...props}>
          <path d="M4 10.5 12 4l8 6.5V20H4z" />
          <path d="M9.5 20v-5h5v5" />
        </svg>
      );
    case "profile":
      return (
        <svg {...common} {...props}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19c1.6-3.4 4-5 7-5s5.4 1.6 7 5" strokeLinecap="round" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} {...props}>
          <path d="M12 4 18 6.5V11c0 4.3-2.4 7-6 9-3.6-2-6-4.7-6-9V6.5z" />
          <path
            d="m9.5 12 1.7 1.7 3.3-3.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "grid":
      return <GlyphGrid {...props} />;
    case "lock":
      return (
        <svg {...common} {...props}>
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8.5A4 4 0 0 1 12 4.5a4 4 0 0 1 4 4V11" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...common} {...props}>
          <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 15.5z" />
          <path d="M16 13h4" strokeLinecap="round" />
          <circle cx="15.5" cy="13" r=".7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "devices":
      return (
        <svg {...common} {...props}>
          <rect x="4" y="5" width="11" height="9" rx="1.5" />
          <path d="M8.5 19h6" strokeLinecap="round" />
          <rect x="16.5" y="9" width="3.5" height="8" rx="1" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common} {...props}>
          <circle cx="12" cy="12" r="2.8" />
          <path
            d="M12 4.5v2M12 17.5v2M19.5 12h-2M6.5 12h-2M17.3 6.7l-1.4 1.4M8.1 15.9l-1.4 1.4M17.3 17.3l-1.4-1.4M8.1 8.1 6.7 6.7"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return <GlyphGrid {...props} />;
  }
}
