/**
 * The editable home page content model (core).
 *
 * One shared set of fields serves every template: the owner writes the texts
 * once and switching designs never loses them. A field that only one design
 * shows declares that in `templates`.
 */

import type { HomeTemplateKey } from "./templates";

export type HomeFieldKind = "line" | "paragraph" | "list";

export interface HomeTextField {
  key: string;
  kind: HomeFieldKind;
  /** Undefined = used by every template. */
  templates?: HomeTemplateKey[];
  /** Grouping in the admin editor. */
  group: "opening" | "paths" | "credentials" | "listings" | "valuation" | "contact";
}

export const HOME_TEXT_FIELDS: HomeTextField[] = [
  { key: "hero_kicker", kind: "line", group: "opening" },
  { key: "hero_headline", kind: "paragraph", group: "opening" },
  { key: "hero_subline", kind: "paragraph", group: "opening" },
  { key: "statement", kind: "paragraph", templates: ["h2"], group: "opening" },
  { key: "sell_title", kind: "line", group: "paths" },
  { key: "sell_body", kind: "paragraph", group: "paths" },
  { key: "buy_title", kind: "line", group: "paths" },
  { key: "buy_body", kind: "paragraph", group: "paths" },
  { key: "cred_intro", kind: "paragraph", group: "credentials" },
  { key: "cred_title", kind: "line", group: "credentials" },
  { key: "cred1_title", kind: "line", group: "credentials" },
  { key: "cred1_body", kind: "paragraph", group: "credentials" },
  { key: "cred1_tag", kind: "line", group: "credentials" },
  { key: "cred2_title", kind: "line", group: "credentials" },
  { key: "cred2_body", kind: "paragraph", group: "credentials" },
  { key: "cred2_tag", kind: "line", group: "credentials" },
  { key: "cred3_title", kind: "line", group: "credentials" },
  { key: "cred3_body", kind: "paragraph", group: "credentials" },
  { key: "cred3_tag", kind: "line", group: "credentials" },
  { key: "listings_title", kind: "line", group: "listings" },
  { key: "listings_note", kind: "paragraph", group: "listings" },
  { key: "valuation_title", kind: "line", group: "valuation" },
  { key: "valuation_body", kind: "paragraph", group: "valuation" },
  { key: "valuation_steps", kind: "list", group: "valuation" },
  { key: "contact_title", kind: "line", group: "contact" },
];

export const HOME_FIELD_GROUPS = [
  "opening",
  "paths",
  "credentials",
  "listings",
  "valuation",
  "contact",
] as const;

export function fieldsForTemplate(template: HomeTemplateKey): HomeTextField[] {
  return HOME_TEXT_FIELDS.filter((f) => !f.templates || f.templates.includes(template));
}
