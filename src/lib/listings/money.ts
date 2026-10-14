// Money input formatting: grouped digits while typing, a plain number in state.
// Kept out of the components so every money field behaves identically.

/** Decimal separator of the market locale ("," for German, "." for English). */
export function decimalSeparator(locale: string): string {
  return locale.startsWith("en") ? "." : ",";
}

/**
 * Turn what the user typed into a number. Grouping separators are dropped and a
 * decimal comma is accepted, because a German broker types "1.250,50".
 */
export function parseMoneyInput(raw: string, locale: string): number | null {
  const cleaned = raw.replace(/[^\d.,-]/g, "");
  if (cleaned.trim() === "") return null;

  const german = decimalSeparator(locale) === ",";
  const normalized = german
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned.replace(/,/g, "");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/**
 * Live display while typing: the integer part is grouped immediately
 * ("500000" -> "500.000"), so 50k vs 500k vs 5M is visible at a glance. A
 * decimal part the user is still typing is kept exactly as typed.
 */
export function formatMoneyTyping(raw: string, locale: string): string {
  const dec = decimalSeparator(locale);
  const group = dec === "," ? "." : ",";
  const cleaned = raw.replace(new RegExp(`[^\\d${dec === "," ? "," : "."}]`, "g"), "");
  if (cleaned === "") return "";
  const [intPart, ...rest] = cleaned.split(dec);
  const digits = intPart.replace(/^0+(?=\d)/, "");
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, group);
  return rest.length > 0 ? `${grouped}${dec}${rest.join("").slice(0, 2)}` : grouped;
}

/** Display value for a stored number (initial render and after leaving the field). */
export function formatMoneyValue(value: number | null | undefined, locale: string): string {
  if (value == null) return "";
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
}

/** Count of digits before a caret position, used to restore the caret after regrouping. */
export function digitsBefore(text: string, caret: number): number {
  return text.slice(0, caret).replace(/\D/g, "").length;
}

/** Caret position in `text` right after the n-th digit. */
export function caretAfterDigits(text: string, n: number): number {
  if (n <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (/\d/.test(text[i])) seen += 1;
    if (seen === n) return i + 1;
  }
  return text.length;
}
