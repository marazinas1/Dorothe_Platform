// Server-only classification and persistence for visit pings. Follows the
// Deerva analytics standard: no IP stored or hashed, no persistent identity,
// invalid traffic rejected before insert, 14-month retention.

const BOT_PATTERN =
  /bot|crawl|spider|slurp|bing|yandex|baidu|duckduck|facebookexternalhit|embedly|quora|pinterest|semrush|ahrefs|petal|headless|lighthouse|preview|monitor|curl|wget|python-requests|node-fetch|go-http|phantom|puppeteer|playwright|selenium/i;

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT_PATTERN.test(userAgent);
}

/** Development, preview and builder hosts never count as business traffic. */
export function isNonProductionHost(host: string | null | undefined): boolean {
  if (!host) return true;
  const h = host.toLowerCase().split(":")[0];
  return (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    /^127\.|^0\.0\.0\.0$|^\[?::1\]?$|^10\.|^192\.168\./.test(h) ||
    h.includes("lovableproject.com") ||
    h.startsWith("id-preview--") ||
    h.endsWith("-dev.lovable.app") ||
    h.includes("preview--")
  );
}

export function deviceFrom(ua: string): "mobile" | "tablet" | "desktop" {
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|windows phone/i.test(ua)) return "mobile";
  return "desktop";
}

const SEARCH = /google\.|bing\.|duckduckgo|yahoo\.|ecosia|yandex|baidu|startpage|qwant/;
const SOCIAL = /facebook|fb\.|instagram|linkedin|lnkd\.in|t\.co$|twitter|x\.com|pinterest|tiktok|youtube|xing|whatsapp|reddit/;
const AI = /chatgpt|openai|perplexity|claude\.ai|gemini\.google|copilot|you\.com/;
const EMAIL = /mail\.|outlook|webmail/;

/** Deterministic, UTM-first channel grouping (DAA). */
export function channelFrom(
  utm: { source: string | null; medium: string | null },
  referrerHost: string | null,
): string {
  const medium = utm.medium ?? "";
  if (medium) {
    if (/^(cpc|ppc|paid-?search)$/.test(medium)) return "paid_search";
    if (/^(paid-?social|social-?paid)$/.test(medium)) return "paid_social";
    if (/^(social|social-network)$/.test(medium)) return "organic_social";
    if (/^(email|e-mail|newsletter)$/.test(medium)) return "email";
    if (medium === "referral") return "referral";
    if (/^(organic)$/.test(medium)) return "organic_search";
    return "other_campaign";
  }
  if (utm.source) return "other_campaign";
  if (!referrerHost) return "direct";
  const h = referrerHost;
  if (AI.test(h)) return "ai_assistant";
  if (SEARCH.test(h)) return "organic_search";
  if (SOCIAL.test(h)) return "organic_social";
  if (EMAIL.test(h)) return "email";
  return "referral";
}

/** Campaign tag values: lowercase kebab-case, no personal data, short. */
export function cleanTag(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .slice(0, 80);
  if (!v || v.includes("@")) return null;
  return v;
}

export interface PageViewRow {
  id: string;
  path: string;
  referrer_host: string | null;
  source: string;
  channel: string;
  device: string;
  country: string | null;
  session_id: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  day: string;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return supabaseAdmin as any;
}

export async function insertPageView(row: PageViewRow): Promise<void> {
  const db = await admin();
  const { error } = await db.from("page_views").insert(row);
  if (error) console.error("page_views insert failed:", error.message);
  // Opportunistic, idempotent retention until a scheduler exists.
  if (Math.random() < 0.02) await db.rpc("purge_old_page_views");
}

export async function recordEngagedTime(
  id: string,
  sessionId: string,
  seconds: number,
): Promise<void> {
  const db = await admin();
  const { error } = await db
    .from("page_views")
    .update({ engaged_seconds: Math.max(0, Math.min(seconds, 4 * 3600)) })
    .eq("id", id)
    .eq("session_id", sessionId);
  if (error) console.error("page_views duration failed:", error.message);
}
