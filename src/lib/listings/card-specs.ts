import type { Locale } from "@/i18n/config";

import { formatArea } from "./format";
import { energyClassOf } from "./energy-class";

/**
 * The card's fact row, decided in one place (broker listings reference):
 * three facts per card, chosen by type because that is what sells it —
 * plot for houses, floor for apartments, year otherwise. Pure data; the
 * component maps keys to glyphs.
 */
export type CardSpecIcon = "area" | "rooms" | "plot" | "floor" | "year";

export type CardSpec = {
  key: CardSpecIcon;
  value: string;
  labelKey: string;
};

type SpecInput = {
  property_type?: string | null;
  living_area?: number | null;
  plot_area?: number | null;
  rooms?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floor?: number | null;
  year_built?: number | null;
  energy?: unknown;
};

const HOUSES = ["house", "villa", "townhouse"];
const FLATS = ["apartment", "penthouse"];

export function cardSpecs(
  listing: SpecInput,
  areaUnit: "sqm" | "sqft",
  locale: Locale,
): { specs: CardSpec[]; energyClass: string | null } {
  const nf = new Intl.NumberFormat(locale === "en" ? "en-US" : "de-DE", {
    maximumFractionDigits: 1,
  });
  const specs: CardSpec[] = [];
  const type = listing.property_type ?? "";
  const isLand = type === "land";

  const area = formatArea(isLand ? listing.plot_area : listing.living_area, areaUnit, locale);
  if (area !== "—") {
    specs.push({
      key: isLand ? "plot" : "area",
      value: area,
      labelKey: isLand ? "listings.detail.plot_area" : "listings.detail.living_area",
    });
  }
  if (listing.rooms != null && !isLand) {
    specs.push({ key: "rooms", value: nf.format(listing.rooms), labelKey: "listings.detail.rooms" });
  }

  const plot = formatArea(listing.plot_area, areaUnit, locale);
  if (HOUSES.includes(type) && plot !== "—") {
    specs.push({ key: "plot", value: plot, labelKey: "listings.detail.plot_area" });
  } else if (FLATS.includes(type) && listing.floor != null) {
    specs.push({ key: "floor", value: String(listing.floor), labelKey: "listings.detail.floor" });
  } else if (!isLand && listing.year_built != null) {
    specs.push({ key: "year", value: String(listing.year_built), labelKey: "listings.detail.year_built" });
  }

  return { specs: specs.slice(0, 3), energyClass: energyClassOf(listing.energy) };
}
