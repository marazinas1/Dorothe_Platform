import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";

import { actionButtonClass } from "@/components/brand/ui/ActionButton";
import { buttonClass } from "@/components/brand/ui/Button";
import type { Locale } from "@/i18n/config";

type Props = { title: string; body?: string; action: string; locale: Locale; phone?: string | null; intent?: "selling" | "other" };

export function DarkActionBand({ title, body, action, locale, phone, intent = "selling" }: Props) {
  return (
    <section className="bg-footer text-footer-foreground">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-5 py-16 md:px-10 lg:flex-row lg:items-end lg:justify-between lg:py-24">
        <div><h2 className="max-w-[17ch] font-heading text-4xl font-bold leading-[1.05] md:text-6xl">{title}</h2>{body ? <p className="mt-6 max-w-2xl text-lg leading-8 text-footer-muted">{body}</p> : null}</div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link to="/$locale/kontakt" params={{ locale }} search={{ intent }} className={actionButtonClass("on-dark")}>{action}</Link>
          {phone ? <a href={`tel:${phone.replace(/\s+/g, "")}`} className={buttonClass({ variant: "outline", inverse: true })}><Phone className="size-4" />{phone}</a> : null}
        </div>
      </div>
    </section>
  );
}