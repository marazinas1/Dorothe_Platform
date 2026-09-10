/**
 * The editable home page content model (core).
 *
 * The order below is the order the page renders in (H1Home): opening, the two
 * paths, qualification, client voices, properties, valuation, contact. The
 * editor walks this list, so what the broker reads on the left matches what the
 * preview shows on the right.
 */

export type HomeFieldKind = "line" | "paragraph" | "list";

export interface HomeTextField {
  key: string;
  kind: HomeFieldKind;
  /** Grouping in the admin editor — one group per page section. */
  group:
    | "opening"
    | "paths"
    | "credentials"
    | "testimonials"
    | "listings"
    | "valuation"
    | "contact";
}

export const HOME_TEXT_FIELDS: HomeTextField[] = [
  { key: "hero_kicker", kind: "line", group: "opening" },
  { key: "hero_headline", kind: "paragraph", group: "opening" },
  { key: "hero_subline", kind: "paragraph", group: "opening" },
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
  { key: "testi_title", kind: "line", group: "testimonials" },
  { key: "listings_title", kind: "line", group: "listings" },
  { key: "listings_note", kind: "paragraph", group: "listings" },
  { key: "valuation_title", kind: "line", group: "valuation" },
  { key: "valuation_body", kind: "paragraph", group: "valuation" },
  { key: "valuation_steps", kind: "list", group: "valuation" },
  { key: "contact_title", kind: "line", group: "contact" },
];

/** Section order in the editor — identical to the page's own order. */
export const HOME_FIELD_GROUPS = [
  "opening",
  "paths",
  "credentials",
  "testimonials",
  "listings",
  "valuation",
  "contact",
] as const;
