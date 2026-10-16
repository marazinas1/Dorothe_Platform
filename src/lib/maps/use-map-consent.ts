import { useCallback, useSyncExternalStore } from "react";

// Map tiles come from a third party, which receives the visitor's IP address.
// Under GDPR/TTDSG that needs an explicit action, so no map loads by itself.
// One click allows maps for the rest of this browser tab (sessionStorage: no
// cookie, gone when the tab closes), so a visitor is not asked on every page.
const KEY = "maps-allowed";
const EVENT = "maps-consent-change";

function read(): boolean {
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

/** Whether the visitor has allowed external maps in this tab, plus the allow action. */
export function useMapConsent() {
  const allowed = useSyncExternalStore(subscribe, read, () => false);
  const allow = useCallback(() => {
    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      // Storage blocked: the map still loads for this view.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { allowed, allow };
}
