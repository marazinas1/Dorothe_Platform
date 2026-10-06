import {
  ArrowUpDown,
  Bath,
  BedDouble,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  DoorOpen,
  Fence,
  FileText,
  Flame,
  LandPlot,
  LayoutGrid,
  LayoutPanelLeft,
  Layers,
  List,
  Lock,
  Mail,
  Map,
  MapPin,
  Maximize,
  Phone,
  Search,
  Share2,
  Sprout,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The one listing icon set, mapped to the Lucide names in docs/broker-book.md
 * section 6. Same glyph on card, detail page and admin; stroke 1.75.
 * Decorative only: a word always sits next to an icon.
 */
const ICONS = {
  area: Maximize,
  rooms: DoorOpen,
  bed: BedDouble,
  bath: Bath,
  plot: LandPlot,
  year: CalendarDays,
  floor: Layers,
  heat: Flame,
  energy: Zap,
  pin: MapPin,
  cam: Camera,
  plan: LayoutPanelLeft,
  doc: FileText,
  lock: Lock,
  phone: Phone,
  mail: Mail,
  share: Share2,
  grid: LayoutGrid,
  list: List,
  map: Map,
  check: Check,
  chev: ChevronDown,
  search: Search,
  cal: CalendarDays,
  balcony: Fence,
  garden: Sprout,
  lift: ArrowUpDown,
} satisfies Record<string, LucideIcon>;

export type ListingIconName = keyof typeof ICONS;

export function ListingIcon({ name, className }: { name: ListingIconName; className?: string }) {
  const Icon = ICONS[name];
  return (
    <Icon
      aria-hidden="true"
      strokeWidth={1.75}
      className={cn("size-[18px] flex-none", className)}
    />
  );
}
