// Cookieless first-party visit collector. Public by design (the site pings it
// anonymously) and always silent: analytics must never affect the site.
import { createFileRoute } from "@tanstack/react-router";
// Loads the `server` route-option type augmentation.
import type {} from "@tanstack/react-start";
import { z } from "zod";

import {
  channelFrom,
  cleanTag,
  deviceFrom,
  insertPageView,
  isBot,
  isNonProductionHost,
  recordEngagedTime,
} from "@/lib/analytics/track.server";

const noContent = () => new Response(null, { status: 204 });

const ViewSchema = z.object({
  type: z.literal("view"),
  id: z.string().uuid(),
  session: z.string().uuid(),
  path: z.string().max(300),
  referrer: z.string().max(2000).optional(),
  utm: z
    .object({ source: z.unknown(), medium: z.unknown(), campaign: z.unknown() })
    .partial()
    .optional(),
});
const EndSchema = z.object({
  type: z.literal("end"),
  id: z.string().uuid(),
  session: z.string().uuid(),
  seconds: z.number().int().min(0).max(86400),
});
const Payload = z.discriminatedUnion("type", [ViewSchema, EndSchema]);

function hostOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase().slice(0, 200);
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/public/track-view")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const userAgent = request.headers.get("user-agent") ?? "";
          if (isBot(userAgent)) return noContent();

          // Server gate, independent of the browser gate.
          const selfHost = new URL(request.url).hostname.toLowerCase();
          const originHost = hostOf(request.headers.get("origin"));
          if (isNonProductionHost(selfHost)) return noContent();
          if (originHost && originHost !== selfHost) return noContent();

          const raw = await request.text();
          if (!raw || raw.length > 4000) return noContent();
          let parsed: z.infer<typeof Payload>;
          try {
            parsed = Payload.parse(JSON.parse(raw));
          } catch {
            return noContent();
          }

          if (parsed.type === "end") {
            await recordEngagedTime(parsed.id, parsed.session, parsed.seconds);
            return noContent();
          }

          const path = parsed.path;
          if (!path.startsWith("/") || /\/admin(\/|$)/.test(path)) return noContent();

          let referrerHost = hostOf(parsed.referrer);
          // Self-referral and development hosts count as direct.
          if (referrerHost === selfHost || isNonProductionHost(referrerHost)) {
            referrerHost = referrerHost === selfHost || !referrerHost ? null : null;
          }
          let utmSource = cleanTag(parsed.utm?.source);
          if (utmSource && isNonProductionHost(utmSource)) utmSource = null;
          const utmMedium = utmSource || parsed.utm?.medium ? cleanTag(parsed.utm?.medium) : null;
          const utmCampaign = cleanTag(parsed.utm?.campaign);
          const channel = channelFrom({ source: utmSource, medium: utmMedium }, referrerHost);

          await insertPageView({
            id: parsed.id,
            path,
            referrer_host: referrerHost,
            source: channel,
            channel,
            device: deviceFrom(userAgent),
            country: request.headers.get("cf-ipcountry")?.slice(0, 2) ?? null,
            session_id: parsed.session,
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            day: new Date().toISOString().slice(0, 10),
          });
        } catch (err) {
          console.error("track-view error:", err instanceof Error ? err.message : String(err));
        }
        return noContent();
      },
    },
  },
});
