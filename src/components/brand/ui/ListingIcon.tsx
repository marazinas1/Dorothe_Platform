import { cn } from "@/lib/utils";

/**
 * The one listing icon set (broker listings reference): one icon per fact,
 * the same glyph on card, detail page and admin. Line icons, 1.75 stroke.
 * Decorative only: a word always sits next to an icon.
 */
const PATHS = {
  area: <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />,
  rooms: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M12 3v18M3 12h9" />
    </>
  ),
  bed: <path d="M3 19v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8M3 15h18M7 9V6h4v3" />,
  bath: <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2" />,
  plot: (
    <>
      <path d="M3 20h18M7 20v-4M7 16 3.5 16 7 8l3.5 8zM16 20v-5" />
      <circle cx="16" cy="11" r="3.5" />
    </>
  ),
  year: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="1" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  floor: <path d="M12 3 3 8l9 5 9-5zM3 13l9 5 9-5" />,
  heat: <path d="M12 3c3 4 5 6 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" />,
  energy: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  pin: (
    <>
      <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  cam: (
    <>
      <path d="M3 8h4l2-3h6l2 3h4v12H3z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  plan: <path d="M3 3h18v18H3zM3 12h8V3M11 12v4M15 12h6M15 12v9" />,
  doc: <path d="M6 2h8l5 5v15H6zM14 2v5h5M9 13h6M9 17h6" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="1" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  share: <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  list: <path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  map: <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" />,
  check: <path d="M20 6 9 17l-5-5" />,
  chev: <path d="m6 9 6 6 6-6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  cal: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="1" />
      <path d="M3 10h18M8 3v4M16 3v4M8 14h3v3H8z" />
    </>
  ),
  balcony: <path d="M4 21v-8h16v8M4 17h16M8 13v8M12 13v8M16 13v8M7 13V4h10v9" />,
  garden: <path d="M12 21V11M12 11c0-4 3-6 7-6 0 4-3 6-7 6zM12 14c0-3-2-5-6-5 0 3 2 5 6 5" />,
  lift: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 9l3-3 3 3M9 15l3 3 3-3" />
    </>
  ),
} as const;

export type ListingIconName = keyof typeof PATHS;

export function ListingIcon({ name, className }: { name: ListingIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-[18px] flex-none", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}
