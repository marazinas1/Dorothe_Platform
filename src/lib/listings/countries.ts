// Which countries a listing address may be in. Stored as an ISO 3166-1 alpha-2
// code, never as a display string: the label is rendered by the browser
// (Intl.DisplayNames) in the interface language, so there is no duplicate
// "Germany"/"Deutschland" entry and no translation file to maintain, and the
// value stays comparable with `site_settings.country`.
//
// The site's own country is the default and is pinned first, because almost
// every listing of a single broker is in their market. Any other country can
// still be chosen, so the template works for a clone in any market.

const ISO_CODES =
  "AD AE AF AG AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TZ UA UG US UY UZ VA VC VE VN VU WS YE ZA ZM ZW".split(
    " ",
  );

/** Country name in the given UI language; falls back to the code. */
export function countryName(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/**
 * Options for the form: the site's country first, then every other country
 * sorted by its localized name. A stored value outside the list is kept.
 */
export function listingCountryOptions(
  siteCountry: string | null | undefined,
  current: string | null | undefined,
  locale: string,
): { code: string; name: string }[] {
  const codes = new Set(ISO_CODES);
  if (current) codes.add(current);
  const rest = [...codes]
    .filter((c) => c !== siteCountry)
    .map((code) => ({ code, name: countryName(code, locale) }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
  return siteCountry ? [{ code: siteCountry, name: countryName(siteCountry, locale) }, ...rest] : rest;
}
