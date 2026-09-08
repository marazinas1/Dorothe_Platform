# Multiple selectable home page designs

Three finished mockups (H1 Sachverständige, H2 Vier Wände, H3 Saarland Modern) become
real, live-switchable home page designs. The owner previews all three in the admin,
activates one, and keeps editing its texts and photos afterwards.

## How it will work for the owner

New admin page **Home page** (replaces the empty "Content" stub):

1. **Designs** — three cards, each with a name, a short description, a colour/type
   swatch, and two actions: **Preview** (opens the real site rendered in that design,
   in a new tab, without activating it) and **Set as main home page** (one click, with
   a confirm; the active one is marked "Live").
2. **Texts** — one shared set of texts (opening headline, supporting line, the two
   paths, the "why her" block, valuation offer, closing contact line), per language.
   Written once, every design uses them. A design that has an extra line of its own
   (H2's statement band) gets that one extra field, shown only when relevant.
3. **Photos** — one slot list (portrait, opening photo, valuation photo, closing
   photo). Each slot is **Default** or **Choose your own** (upload / pick), exactly as
   in the Halliday home page editor. Default values stay editable by the developer.

Switching designs never loses text or photos, because content is stored once and
designs only decide how it is arranged.

Activating a design also applies its palette and typefaces to the whole site
(header, footer and inner pages included). Anything the owner has explicitly set in
Branding keeps winning over the design's defaults, so a colour tweak is never
overwritten.

## Data model

Add to `site_settings` (no new client data in migrations, values land in the seed):

- `active_home_template text not null default 'h1'` — which design is live.
- `home_content jsonb not null default '{}'` — shared localized texts keyed by slot.
- `home_media jsonb not null default '{}'` — per slot `{ mode: 'default' | 'custom', url }`.
- `home_template_extras jsonb not null default '{}'` — template-specific fields,
  keyed by template (`{ h2: { statement: { de, en } } }`).

Branding columns stay as they are; the design's palette/fonts are code-side defaults
used only where a branding column is empty. Existing `homepage_sections`,
`hero_headline`, `hero_subline` are migrated into `home_content` by a data step in
the seed, and the old columns keep working during the transition.

A validation trigger keeps `active_home_template` inside the known key set.

## Code structure (core / brand boundary respected)

Core:

- `src/lib/home/templates.ts` — registry: key, label, description, section list,
  media slots, theme defaults, chrome variant. Single source of truth for admin UI,
  preview and the public route.
- `src/lib/home/content.ts` — resolves texts, media (default vs custom) and extras
  for a given template + locale. All fallback logic lives here.
- `src/lib/home/preview.server.ts` / `preview.functions.ts` — short-lived HMAC
  preview token, same shape as the existing listing preview.
- `src/lib/config/site-settings.functions.ts` — new `home` tab in the update
  function, guarded by the existing `settings.edit` / `content.edit` permission.
- `src/lib/theme/tokens.ts` — template theme defaults merged under the owner's
  branding values.

Brand (presentation only, props in, no fetching):

- `src/components/brand/home/h1/…`, `h2/…`, `h3/…` — one small component per section
  of each design, each file under 200 lines. Shared pieces (listing card, signature,
  forms) are reused, not duplicated.
- Chrome variants for header/footer per design in `src/components/brand/chrome/`,
  selected by the active template.

Admin (core):

- `src/components/admin/home/TemplateGallery.tsx`, `TemplateCard.tsx`,
  `HomeTextFields.tsx`, `MediaSlotField.tsx`, `HomePage.tsx`.
- Route `src/routes/$locale.admin.content.tsx` renders it; sidebar label becomes
  "Home page".

Public route `src/routes/$locale.index.tsx` stays composition only: it reads the
active template (or the previewed one), resolves the plan, and renders the chosen
design's blocks. Preview requests are `noindex` and never write anything.

## Preview mechanism

`/{locale}?home=h2&t=<token>` — the token is HMAC-signed, valid ~30 minutes, and
minted by an admin-only server function. Server-rendered, so the preview is the real
page with real listings and real content, just a different design. Without a valid
token the parameter is ignored, so nobody can force a non-active design on visitors.

## Build order

1. Migration: new `site_settings` columns + validation trigger.
2. Template registry, content resolver, theme merge.
3. H1 as the first real template (current homepage blocks refactored into it), public
   route reads the active template.
4. H2 and H3 sections + chrome variants.
5. Admin Home page: gallery, preview, activate, texts, media slots.
6. Seed update for Dorothe (texts, defaults, active design), then verify switching
   and previewing end to end.

## Notes

- Achieved-price masking, listing limits and the sold-price policy stay in
  `src/lib/homepage/plan.ts` — designs cannot bypass them.
- Animation stays CSS-only; SSR stays intact.
- No client names, towns or contact details in code — everything through
  `site_settings` and the message files.
