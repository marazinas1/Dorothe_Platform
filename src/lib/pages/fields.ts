/**
 * The editable copy of the static public pages (core).
 *
 * One registry, one shape per page. Every field names the translation key it
 * falls back to, so an empty field is a finished state: the page keeps showing
 * its translated default line.
 */

export type PageKey = "selling" | "inheritance" | "about" | "contact";

export type PageFieldKind = "line" | "paragraph" | "list";

export interface PageField {
  key: string;
  kind: PageFieldKind;
  group: "opening" | "body" | "form" | "closing";
  /** Translation key holding the default line. */
  i18n: string;
}

export interface PageDefinition {
  key: PageKey;
  /** Public path segment, used for the preview and "open page" link. */
  path: string;
  fields: PageField[];
  mediaSlots: string[];
}

const line = (
  key: string,
  i18n: string,
  group: PageField["group"] = "body",
): PageField => ({ key, kind: "line", group, i18n });

const para = (
  key: string,
  i18n: string,
  group: PageField["group"] = "body",
): PageField => ({ key, kind: "paragraph", group, i18n });

const list = (
  key: string,
  i18n: string,
  group: PageField["group"] = "body",
): PageField => ({ key, kind: "list", group, i18n });

export const PAGE_DEFINITIONS: PageDefinition[] = [
  {
    key: "selling",
    path: "verkaufen",
    mediaSlots: [],
    fields: [
      line("kicker", "pages.selling.kicker", "opening"),
      para("headline", "pages.selling.headline", "opening"),
      para("intro", "pages.selling.intro", "opening"),
      line("steps_title", "pages.selling.steps_title"),
      line("services_title", "pages.selling.services_title"),
      para("services_body", "pages.selling.services_body"),
      list("services", "pages.selling.services"),
      line("costs_title", "pages.selling.costs_title"),
      para("costs_body", "pages.selling.costs_body"),
      line("proof_title", "pages.selling.proof_title"),
      para("proof_body", "pages.selling.proof_body"),
      line("form_title", "pages.selling.form_title", "form"),
      para("form_intro", "pages.selling.form_intro", "form"),
      line("cta_title", "pages.selling.cta_title", "closing"),
      para("cta_body", "pages.selling.cta_body", "closing"),
    ],
  },
  {
    key: "inheritance",
    path: "erben",
    mediaSlots: [],
    fields: [
      line("kicker", "pages.inheritance.kicker", "opening"),
      para("headline", "pages.inheritance.headline", "opening"),
      para("intro", "pages.inheritance.intro", "opening"),
      line("appraisal_title", "pages.inheritance.appraisal_title"),
      para("appraisal_body", "pages.inheritance.appraisal_body"),
      line("community_title", "pages.inheritance.community_title"),
      para("community_body", "pages.inheritance.community_body"),
      line("credential_title", "pages.inheritance.credential_title"),
      para("credential_body", "pages.inheritance.credential_body"),
      line("contact_title", "pages.inheritance.contact_title", "closing"),
      para("contact_body", "pages.inheritance.contact_body", "closing"),
    ],
  },
  {
    key: "about",
    path: "ueber-mich",
    mediaSlots: ["portrait"],
    fields: [
      line("kicker", "pages.about.kicker", "opening"),
      para("headline", "pages.about.solo.headline", "opening"),
      list("paragraphs", "pages.about.solo.paragraphs"),
      line("qualifications_title", "pages.about.solo.qualifications_title"),
      line("seals_title", "pages.about.seals_title"),
      line("testimonials_title", "pages.about.testimonials_title"),
      line("contact_title", "pages.about.contact_title_solo", "closing"),
    ],
  },
  {
    key: "contact",
    path: "kontakt",
    mediaSlots: [],
    fields: [
      line("kicker", "pages.contact.kicker", "opening"),
      para("headline", "pages.contact.headline_solo", "opening"),
      line("address_title", "pages.contact.address_title"),
      line("hours_title", "pages.contact.hours_title"),
      line("channels_title", "pages.contact.channels_title"),
      line("map_title", "pages.contact.map_title"),
      line("form_title", "pages.contact.form_title", "form"),
      para("form_intro", "pages.contact.form_intro_solo", "form"),
    ],
  },
];

export const PAGE_FIELD_GROUPS = ["opening", "body", "form", "closing"] as const;

export const PAGE_KEYS = PAGE_DEFINITIONS.map((p) => p.key);

export function pageDefinition(key: string): PageDefinition | undefined {
  return PAGE_DEFINITIONS.find((p) => p.key === key);
}
