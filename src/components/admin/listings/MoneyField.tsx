import { useLayoutEffect, useRef, useState } from "react";
import { Coins } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { FALLBACK_LOCALE } from "@/i18n/config";
import {
  caretAfterDigits,
  digitsBefore,
  formatMoneyTyping,
  formatMoneyValue,
  parseMoneyInput,
} from "@/lib/listings/money";
import { FieldRow } from "./FieldRow";

/**
 * One money input. Grouping and parsing follow the SITE's locale
 * (site_settings.default_locale), never the operator's interface language:
 * money conventions belong to the market the listing is sold in. Otherwise a
 * figure copied from a German portal ("549.000") would parse as 549 while the
 * panel is in English.
 */
export function MoneyField({
  label,
  help,
  symbol,
  value,
  onChange,
  anchor,
  className,
  disabled = false,
  readOnly = false,
}: {
  label: string;
  help?: string;
  symbol: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  /** Anchor id so the publish checklist can scroll to this field. */
  anchor?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const moneyLocale = settings.default_locale ?? FALLBACK_LOCALE;
  // While focused the field shows the live-grouped text; otherwise the stored value.
  const [typing, setTyping] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (caret.current === null || !inputRef.current) return;
    inputRef.current.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  }, [typing]);

  return (
    <FieldRow label={label} help={help} className={className} anchor={anchor} icon={Coins}>
      <div className="flex items-center gap-2 rounded-md border border-input bg-background pl-3 focus-within:ring-1 focus-within:ring-ring">
        <span className="text-sm text-muted-foreground">{symbol}</span>
        <Input
          ref={inputRef}
          inputMode="decimal"
          disabled={disabled}
          readOnly={readOnly}
          className="border-0 bg-transparent shadow-none tabular-nums focus-visible:ring-0"
          value={typing ?? formatMoneyValue(value, moneyLocale)}
          onChange={(e) => {
            const input = e.target.value;
            const next = formatMoneyTyping(input, moneyLocale);
            const n = digitsBefore(input, e.target.selectionStart ?? input.length);
            caret.current = caretAfterDigits(next, n);
            setTyping(next);
            onChange(parseMoneyInput(next, moneyLocale));
          }}
          onBlur={() => setTyping(null)}
        />
      </div>
    </FieldRow>
  );
}
