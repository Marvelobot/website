import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const CollectionIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="11" height="15" rx="2" />
    <rect x="9" y="7" width="11" height="15" rx="2" />
    <path d="M13 12h3M13 16h3" />
  </svg>
);

export const MarketIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 20V10M9 20V6M15 20v-7M21 20V4" />
    <path d="M3 20h18" />
  </svg>
);

export const LevelIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20V8l4-4 4 4 4-4 4 4v12" />
    <path d="M4 20h16" />
  </svg>
);

export const EventIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 2l2.6 5.6L20 8.6l-4 4.1 1 5.9-5-2.8-5 2.8 1-5.9-4-4.1 5.4-1z" />
  </svg>
);

export const TradeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 8h13l-3-3M20 16H7l3 3" />
  </svg>
);

export const DustIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </svg>
);

export const BoltIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
  </svg>
);

export const BrainIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M9 4a3 3 0 00-3 3v1a3 3 0 00-2 5 3 3 0 002 5v1a3 3 0 003 3h6a3 3 0 003-3v-1a3 3 0 002-5 3 3 0 00-2-5V7a3 3 0 00-3-3z" />
  </svg>
);

export const SpeedIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 14a8 8 0 1116 0" />
    <path d="M12 14l4-4" />
  </svg>
);

export const FistIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="6" y="9" width="12" height="9" rx="2" />
    <path d="M9 9V6a1.5 1.5 0 013 0M12 9V5a1.5 1.5 0 013 0v4M15 9V7a1.5 1.5 0 013 0v2" />
  </svg>
);

export const StarIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3l2.8 6 6.6.6-5 4.6 1.5 6.5L12 17.6 6.1 20.7 7.6 14.2 2.6 9.6 9.2 9z" />
  </svg>
);

export const SparkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const DiscordIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M19.27 5.33A18.4 18.4 0 0014.7 4l-.2.4a16.6 16.6 0 014.07 1.3 15.4 15.4 0 00-13.16 0A16.6 16.6 0 019.5 4.4L9.3 4a18.4 18.4 0 00-4.57 1.33A19.6 19.6 0 002 16.6a18.5 18.5 0 005.62 2.8l.45-.65a12.6 12.6 0 01-2.18-1.04l.5-.37a13.1 13.1 0 0011.22 0l.5.37a12.6 12.6 0 01-2.18 1.04l.45.65A18.4 18.4 0 0022 16.6a19.6 19.6 0 00-2.73-11.27zM9.07 14.06c-.9 0-1.63-.83-1.63-1.85s.72-1.85 1.63-1.85c.9 0 1.64.83 1.63 1.85 0 1.02-.72 1.85-1.63 1.85zm5.86 0c-.9 0-1.63-.83-1.63-1.85s.72-1.85 1.63-1.85c.9 0 1.64.83 1.63 1.85 0 1.02-.72 1.85-1.63 1.85z" />
  </svg>
);

export const GithubIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.1.63-1.35-2.22-.25-4.55-1.11-4.55-4.95 0-1.1.39-2 1.03-2.7-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.7 0 3.85-2.34 4.7-4.57 4.94.36.31.68.93.68 1.87v2.78c0 .27.18.58.69.48A10 10 0 0012 2z" />
  </svg>
);

export const XIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18.244 2H21l-6.52 7.45L22 22h-6.84l-4.78-6.27L4.8 22H2l7-8L2 2h6.91l4.32 5.71zM17.05 20h1.66L7.05 4H5.27z" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
