import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import {
  createDefaultTextRequest,
  defaultTextRequestsQueryOptions,
  markDefaultTextRequestsSeen,
  resolveDefaultTextRequest,
} from "./requests.functions";
import type { DefaultTextRequest, DefaultTextRequestStatus } from "./types";

type Scope = "home" | "page";

/**
 * Admin state for "make my wording the default" requests: the owner asks, the
 * developer approves. The public site only changes on approval.
 */
export function useDefaultRequests(scope: Scope, page: string | null, locale: string) {
  const qc = useQueryClient();
  const { data: all } = useSuspenseQuery(defaultTextRequestsQueryOptions);

  const mine = all.filter(
    (r) => r.scope === scope && (scope === "home" || r.page === page) && r.locale === locale,
  );

  async function invalidate() {
    await qc.invalidateQueries({ queryKey: defaultTextRequestsQueryOptions.queryKey });
  }

  /** The newest request for one field, whatever its outcome. */
  function latest(field: string): DefaultTextRequest | null {
    return mine.find((r) => r.field_key === field) ?? null;
  }

  function status(field: string): DefaultTextRequestStatus | null {
    const row = latest(field);
    if (!row) return null;
    if (row.status !== "pending" && row.seen_by_requester) return null;
    return row.status;
  }

  async function request(field: string, text: string | string[]) {
    await createDefaultTextRequest({
      data: {
        scope,
        page: scope === "page" ? page : null,
        field_key: field,
        locale,
        requested_text: text,
      },
    });
    await invalidate();
  }

  /** Developer: everything still waiting for a decision, across pages. */
  const pending = all.filter((r) => r.status === "pending");

  async function resolve(id: string, approve: boolean) {
    await resolveDefaultTextRequest({ data: { id, approve } });
    await invalidate();
  }

  /** Requester: outcomes they have not acknowledged yet. */
  const notices = all.filter((r) => r.status !== "pending" && !r.seen_by_requester);

  async function dismissNotices(ids: string[]) {
    if (ids.length === 0) return;
    await markDefaultTextRequestsSeen({ data: { ids } });
    await invalidate();
  }

  return { status, request, pending, resolve, notices, dismissNotices };
}
