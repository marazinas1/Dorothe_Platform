import { useEffect, useState } from "react";

const BASE = "https://www.deerva.com/";

/** Quiet footer attribution; utm_source is this site's own domain. */
export function DeervaBadge({ label }: { label: string }) {
  const [href, setHref] = useState(BASE);
  useEffect(() => {
    const host = window.location.hostname.replace(/^www\./, "");
    const params = new URLSearchParams({
      utm_source: host,
      utm_medium: "referral",
      utm_campaign: "platform-badge",
    });
    setHref(`${BASE}?${params.toString()}`);
  }, []);
  return (
    <div className="mt-2 md:text-right">
      <a href={href} target="_blank" rel="noopener" className="transition-colors hover:text-accent">
        {label}
      </a>
    </div>
  );
}
