/** A request to lock the broker's wording in as the default (core). */
export type DefaultTextRequestStatus = "pending" | "approved" | "declined";

export interface DefaultTextRequest {
  id: string;
  scope: "home" | "page";
  page: string | null;
  field_key: string;
  locale: string;
  requested_text: string | string[];
  status: DefaultTextRequestStatus;
  requested_by: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  seen_by_requester: boolean;
  created_at: string;
}

export const DEFAULT_TEXT_REQUEST_COLUMNS =
  "id, scope, page, field_key, locale, requested_text, status, requested_by, resolved_by, resolved_at, seen_by_requester, created_at";

/** Key used to look a request up per field and language in the editors. */
export function requestKey(scope: "home" | "page", page: string | null, field: string, locale: string) {
  return `${scope}:${page ?? ""}:${field}:${locale}`;
}
