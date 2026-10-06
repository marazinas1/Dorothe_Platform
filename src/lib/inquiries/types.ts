// Shared inquiry types + small pure helpers (client-safe).

/** The workflow an enquiry moves through, in the order the owner works it. */
export const INQUIRY_STATUSES = ["new", "in_progress", "answered", "closed"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

/** Rows written before the workflow existed carry the old names. */
export function normalizeInquiryStatus(raw: string): InquiryStatus {
  if (raw === "read") return "in_progress";
  if (raw === "handled") return "closed";
  return (INQUIRY_STATUSES as readonly string[]).includes(raw) ? (raw as InquiryStatus) : "new";
}

/** Statuses that still need the owner's attention. */
export const OPEN_INQUIRY_STATUSES = ["new", "in_progress", "read"] as const;

export const INQUIRY_TYPES = ["listing", "buyer", "seller"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = any;

export interface AdminInquiryRow {
  id: string;
  type: string;
  status: InquiryStatus;
  name: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  locale: string | null;
  source: string | null;
  payload: Json;
  photo_paths: string[];
  listing_id: string | null;
  created_at: string;
  read_at: string | null;
  handled_at: string | null;
  internal_note: string;
  listing: { id: string; slug: string; title: Json } | null;
}

/** Translation key suffix for the human label of an inquiry type. */
export function inquiryTypeKey(type: string): string {
  return (INQUIRY_TYPES as readonly string[]).includes(type) ? type : "other";
}

/** Ordered, non-empty payload entries for display. */
export function payloadEntries(payload: Json): [string, string][] {
  if (!payload || typeof payload !== "object") return [];
  return Object.entries(payload as Record<string, unknown>)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => [k, String(v)] as [string, string]);
}

/** Short one-line preview for the list view. */
export function inquiryPreview(row: AdminInquiryRow): string {
  if (row.message && row.message.trim().length > 0) return row.message.trim();
  return payloadEntries(row.payload)
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
}
