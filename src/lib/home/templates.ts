/**
 * Home page template registry (core).
 *
 * Each entry is a complete visual direction for the home page and the site
 * chrome: its palette, typefaces, corner/button style, which blocks it renders
 * and which photo slots it needs. The registry is the single source of truth
 * for the admin gallery, the preview route and the public page, so a template
 * can never disagree with itself.
 *
 * Labels live in the message files, never here — no client wording in code.
 */

export type HomeTemplateKey = "h1" | "h2" | "h3";

export type HomeMediaSlot = "portrait" | "hero_photo" | "band_photo";

export type HomeSectionKey =
  | "hero"
  | "statement"
  | "paths"
  | "credentials"
  | "listings"
  | "sold"
  | "valuation"
  | "contact";

/** Branding values a template brings with it; written into site_settings on activation. */
export interface HomeTemplateTheme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  muted_text_color: string;
  border_color: string;
  font_heading: string;
  font_body: string;
  radius_scale: "sharp" | "soft" | "rounded";
  button_style: "square" | "rounded" | "pill";
}

export interface HomeTemplateDef {
  key: HomeTemplateKey;
  /** Message keys: admin.home.templates.<key>.label / .description */
  sections: HomeSectionKey[];
  media: HomeMediaSlot[];
  theme: HomeTemplateTheme;
  chrome: {
    /** A dark footer band belongs to the darker, warmer directions. */
    footerTone: "dark" | "light";
    /** The header sits on top of a full-bleed hero photograph. */
    heroOverlay: boolean;
  };
}

export const HOME_TEMPLATES: Record<HomeTemplateKey, HomeTemplateDef> = {
  h1: {
    key: "h1",
    sections: ["hero", "paths", "credentials", "listings", "sold", "valuation", "contact"],
    media: ["hero_photo", "portrait"],
    theme: {
      primary_color: "#24352A",
      secondary_color: "#E7DFCF",
      accent_color: "#B8802E",
      background_color: "#F1ECE2",
      surface_color: "#E7DFCF",
      text_color: "#241F19",
      muted_text_color: "#5A5347",
      border_color: "#D8CFBE",
      font_heading: "fraunces",
      font_body: "ibm-plex-sans",
      radius_scale: "sharp",
      button_style: "square",
    },
    chrome: { footerTone: "dark", heroOverlay: false },
  },
  h2: {
    key: "h2",
    sections: [
      "hero",
      "statement",
      "paths",
      "credentials",
      "listings",
      "sold",
      "valuation",
      "contact",
    ],
    media: ["hero_photo", "portrait"],
    theme: {
      primary_color: "#5C2A2E",
      secondary_color: "#EFE7DB",
      accent_color: "#BE7A2E",
      background_color: "#F6F1E9",
      surface_color: "#EFE7DB",
      text_color: "#2A211C",
      muted_text_color: "#6B5F54",
      border_color: "#DDD3C6",
      font_heading: "newsreader",
      font_body: "work-sans",
      radius_scale: "rounded",
      button_style: "pill",
    },
    chrome: { footerTone: "dark", heroOverlay: true },
  },
  h3: {
    key: "h3",
    sections: ["hero", "paths", "credentials", "listings", "sold", "valuation", "contact"],
    media: ["band_photo", "portrait"],
    theme: {
      primary_color: "#17140F",
      secondary_color: "#F1EEE8",
      accent_color: "#C5661B",
      background_color: "#FAF8F4",
      surface_color: "#F1EEE8",
      text_color: "#17140F",
      muted_text_color: "#6E6A61",
      border_color: "#DFDBD3",
      font_heading: "archivo",
      font_body: "archivo",
      radius_scale: "sharp",
      button_style: "square",
    },
    chrome: { footerTone: "light", heroOverlay: false },
  },
};

export const HOME_TEMPLATE_KEYS = Object.keys(HOME_TEMPLATES) as HomeTemplateKey[];

export const DEFAULT_HOME_TEMPLATE: HomeTemplateKey = "h1";

/** Any unknown or missing value falls back to the first template. */
export function homeTemplateKey(value: string | null | undefined): HomeTemplateKey {
  return value && (HOME_TEMPLATE_KEYS as string[]).includes(value)
    ? (value as HomeTemplateKey)
    : DEFAULT_HOME_TEMPLATE;
}

export function homeTemplate(value: string | null | undefined): HomeTemplateDef {
  return HOME_TEMPLATES[homeTemplateKey(value)];
}
