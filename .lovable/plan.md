# Neutral near-black primary buttons, amber reserved for accents

## Decision

Filled primary buttons switch from amber `#B8752B` to near-black ink `#221D17`, matching the Halliday-Architects visual language already used for the admin panel and site backgrounds. Amber remains as a small accent color (icon tags, underlined quiet links, hover states), so the brand stays warm without large amber surfaces.

## Changes

1. **Primary button style** (centralized in `ActionButton.tsx` / button tokens):
   - Background: ink `#221D17` (existing `--foreground`-family token)
   - Text: paper/white
   - Hover: slightly softened ink (e.g. 85–90% opacity or a lighter ink token), no color shift to amber
   - Corners stay 4px, height 48px, uppercase/wide tracking, no arrows, `cursor: pointer` — all unchanged
2. **Dark-band variant** (used on dark sections): unchanged behavior — light background with dark text.
3. **Amber stays as accent only**: icon tags in "Why her" / credentials, underlined quiet links (arrows allowed there), small highlights. No filled amber surfaces.
4. Scope: public site only, presentation layer. The admin panel already uses black buttons — no change needed there. No data, schema, or logic changes.

## Technical details

- Edit `src/components/brand/ui/ActionButton.tsx` (and any token in `src/styles.css` that defines the amber primary fill) so the filled variant reads the ink token instead of amber.
- Check every place the filled button renders (nav Contact, hero actions, valuation, inquiry forms "Send enquiry", listing detail rail, mobile drawer) to confirm they all inherit the centralized style — no per-instance overrides.
- Verify: typecheck + build, then browser check at `/` and `/de` for color, 4px radius, 48px height, pointer cursor, and hover state.
