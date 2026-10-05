import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, buttonClass } from "@/components/brand/ui/Button";

type Props = { url: string; title: string };

const pill = buttonClass({ variant: "ghost", size: "sm" });

export function ShareButtons({ url, title }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    {
      key: "facebook",
      label: t("share.facebook"),
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
    {
      key: "whatsapp",
      label: t("share.whatsapp"),
      href: `https://wa.me/?text=${enc(`${title} — ${url}`)}`,
    },
    {
      key: "email",
      label: t("share.email"),
      href: `mailto:?subject=${enc(title)}&body=${enc(url)}`,
    },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard unavailable — still give feedback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target="_blank"
          rel="noreferrer noopener"
          className={pill}
        >
          {l.label}
        </a>
      ))}
      <Button
        type="button"
        onClick={copy}
        aria-live="polite"
        variant="ghost"
        size="sm"
        className={copied ? "border-primary/50 text-primary" : undefined}
      >
        {copied ? t("share.copied") : t("share.copy")}
      </Button>
    </div>
  );
}
