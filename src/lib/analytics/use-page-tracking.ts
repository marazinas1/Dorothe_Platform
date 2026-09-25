import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const ENDPOINT = "/api/public/track-view";
const SESSION_KEY = "deerva-visit";
const INTERNAL_KEY = "deerva-internal-browser";
const IDLE_MS = 30 * 60 * 1000;
const ENGAGE_MS = 5000;

/** Marks this browser as staff; its traffic is never counted again. */
export function markInternalBrowser() {
  try {
    localStorage.setItem(INTERNAL_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

function isNonProductionHost(h: string) {
  return (
    h === "localhost" ||
    /^127\.|^0\.0\.0\.0$|^10\.|^192\.168\./.test(h) ||
    h.includes("lovableproject.com") ||
    h.includes("preview--") ||
    h.endsWith("-dev.lovable.app")
  );
}

function isAutomated() {
  return Boolean((navigator as Navigator & { webdriver?: boolean }).webdriver);
}

/** Per-tab visit id with a 30-minute inactivity window. Never persistent. */
function visitId(): string {
  const now = Date.now();
  try {
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null");
    if (stored && now - stored.at < IDLE_MS) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: stored.id, at: now }));
      return stored.id;
    }
  } catch {
    /* fall through */
  }
  const id = crypto.randomUUID();
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, at: now }));
  } catch {
    /* storage unavailable */
  }
  return id;
}

function send(body: object) {
  const payload = JSON.stringify(body);
  try {
    // text/plain avoids a CORS preflight so sendBeacon can actually transmit.
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([payload], { type: "text/plain" }))) return;
  } catch {
    /* fall through */
  }
  void fetch(ENDPOINT, { method: "POST", body: payload, keepalive: true }).catch(() => {});
}

/**
 * First-party, cookieless visit tracking: counted only after 5 s or a real
 * interaction; engaged time stops while the tab is hidden.
 */
export function usePageTracking() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (/\/admin(\/|$)|\/auth(\/|$)/.test(pathname)) return;
    if (isNonProductionHost(location.hostname) || isAutomated()) return;
    try {
      if (localStorage.getItem(INTERNAL_KEY)) return;
    } catch {
      /* ignore */
    }

    const id = crypto.randomUUID();
    let sent = false;
    let engagedMs = 0;
    let visibleSince: number | null = document.visibilityState === "visible" ? Date.now() : null;
    let session = "";

    const params = new URLSearchParams(location.search);
    const utm = {
      source: params.get("utm_source"),
      medium: params.get("utm_medium"),
      campaign: params.get("utm_campaign"),
    };

    const engage = () => {
      if (sent) return;
      sent = true;
      session = visitId();
      send({ type: "view", id, session, path: pathname, referrer: document.referrer, utm });
      cleanupListeners();
    };
    const timer = window.setTimeout(engage, ENGAGE_MS);
    const events = ["scroll", "pointerdown", "keydown"] as const;
    const cleanupListeners = () => events.forEach((e) => window.removeEventListener(e, engage));
    events.forEach((e) => window.addEventListener(e, engage, { passive: true, once: true }));

    const flush = () => {
      if (visibleSince != null) engagedMs += Date.now() - visibleSince;
      visibleSince = null;
      if (sent) send({ type: "end", id, session, seconds: Math.round(engagedMs / 1000) });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else visibleSince = Date.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(timer);
      cleanupListeners();
      document.removeEventListener("visibilitychange", onVisibility);
      flush();
    };
  }, [pathname]);
}
