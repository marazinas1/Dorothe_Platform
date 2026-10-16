// Client-safe grouping of enquiries into people. A "client" is derived from
// enquiries by normalised email, so no second copy of personal data is stored.
import { inquiryTypeKey, type AdminInquiryRow, type InquiryStatus } from "./types";

export interface ClientSummary {
  email: string;
  name: string | null;
  phone: string | null;
  count: number;
  unread: number;
  lastAt: string;
  lastId: string;
  lastStatus: InquiryStatus;
  types: string[];
}

export function clientKey(email: string): string {
  return email.trim().toLowerCase();
}

/** Rows must arrive newest first; the newest row supplies name and phone. */
export function groupClients(rows: AdminInquiryRow[]): ClientSummary[] {
  const map = new Map<string, ClientSummary>();
  for (const r of rows) {
    const key = clientKey(r.email);
    const type = inquiryTypeKey(r.type);
    const c = map.get(key);
    if (!c) {
      map.set(key, {
        email: r.email.trim(),
        name: r.name,
        phone: r.phone,
        count: 1,
        unread: r.read_at ? 0 : 1,
        lastAt: r.created_at,
        lastId: r.id,
        lastStatus: r.status,
        types: [type],
      });
      continue;
    }
    c.count += 1;
    if (!r.read_at) c.unread += 1;
    c.name ??= r.name;
    c.phone ??= r.phone;
    if (!c.types.includes(type)) c.types.push(type);
  }
  return [...map.values()];
}

/** Other enquiries by the same person, newest first, excluding the current one. */
export function relatedInquiries(rows: AdminInquiryRow[], current: AdminInquiryRow): AdminInquiryRow[] {
  const key = clientKey(current.email);
  return rows.filter((r) => r.id !== current.id && clientKey(r.email) === key);
}
