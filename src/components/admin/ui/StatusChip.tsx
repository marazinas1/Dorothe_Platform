import type { LucideIcon } from "lucide-react";
import {
  Archive,
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  Circle,
  Clock,
  Home,
  Mail,
  MailOpen,
  PencilLine,
  ShieldCheck,
  Tag,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The single way the admin shows a small explanatory rectangle. One shape, one
 * size, always an icon — so a role badge, a "Published" mark and a calendar
 * status all read as the same kind of object.
 */
export type ChipTone = "neutral" | "active" | "muted";

/** Shared meaning → icon map, so the same idea never gets two icons. */
export const CHIP_ICONS = {
  role: ShieldCheck,
  published: CheckCircle2,
  draft: PencilLine,
  home: Home,
  unread: Mail,
  read: MailOpen,
  archived: Archive,
  confirmed: CalendarCheck,
  cancelled: CalendarX,
  pending: Clock,
  type: Tag,
  dot: Circle,
} satisfies Record<string, LucideIcon>;

export type ChipIcon = keyof typeof CHIP_ICONS;

const TONES: Record<ChipTone, string> = {
  neutral: "border-border bg-background text-foreground",
  active: "border-border bg-secondary text-secondary-foreground",
  muted: "border-border bg-background text-muted-foreground",
};

interface Props {
  icon: ChipIcon;
  tone?: ChipTone;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function StatusChip({ icon, tone = "neutral", children, className, title }: Props) {
  const Icon = CHIP_ICONS[icon];
  return (
    <span
      title={title}
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-md border px-2 text-xs font-medium leading-none",
        TONES[tone],
        className,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      <span className="truncate">{children}</span>
    </span>
  );
}
