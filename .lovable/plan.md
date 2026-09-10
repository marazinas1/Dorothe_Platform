# Two design systems: fixed Lumidenta admin, per-client public site

## The decision

The old rule said the public site and the admin must share one visual language. That rule changes here:

- **Admin (inside)** — one fixed design, identical in every clone: the Lumidenta look. Colours, fonts, buttons, corners, sidebar, cards, upload controls. A client never changes it.
- **Public site (outside)** — stays fully per-client. Dorothe keeps her amber/Fraunces/IBM Plex look; the next client gets a different one.

This is what makes the remix valuable: you copy this project, rebuild only the public side, and the working tool the owner uses every day is already finished and familiar.

## What the admin will look like

Taken from Lumidenta, applied everywhere in the admin:

- Warm linen work canvas, white 260 px sidebar, deep sage active navigation and identity footer.
- Manrope typography across the whole admin, including headings.
- Sage primary buttons with pill shape, neutral outline secondary, ghost for rare actions.
- Softer 14 px corners on cards and sections, calmer field styling.
- Sage badges and unread counters, one icon size, thin neutral separators.
- Lumidenta's image cards: a real preview box, one clear upload button, a reset shown only when a custom image exists — the favicon card in the screenshot is the exact target.
- Same treatment for logo, dark logo, favicon, social preview image, home and page photos.

Dorothe's own modules stay exactly as they are in function: listings and statuses, inquiries, calendar, articles, testimonials, analytics, users, page texts, default-wording approval. Only their appearance changes.

## What does not change

- The public site keeps its current design untouched.
- No business logic, permissions, database or content changes.
- No dental content, no Lithuanian wording, no Lumidenta logos.
- Client details stay out of code.

## Steps

1. Rewrite the project rule in `AGENTS.md`/`PLAN.md`: one fixed admin design system, one per-client public design system, and how the two are kept apart.
2. Introduce a self-contained admin theme layer: Lumidenta palette, Manrope, radius and control sizing scoped to the admin and to portals opened from it, so client settings can no longer tint the admin.
3. Rebuild the admin shell chrome: sidebar, brand block, grouped navigation with active state, badges, identity footer, mobile drawer and top bar.
4. Restyle the shared admin building blocks: page header, section, empty state, status chip, buttons, inputs, tabs, tables and list rows.
5. Rebuild the admin image field on Lumidenta's card pattern and apply it to brand assets, home media and page media.
6. Walk every admin screen in order — dashboard, listings and listing form, inquiries, calendar, articles, testimonials, analytics, users, settings tabs, home and page editors — and align the presentation.
7. Verify: both languages, desktop and mobile, uploads, status changes, default-wording flow, plus a check that the public site is visually unchanged.

## Technical notes

- Admin tokens live in a scoped block in `src/styles.css` (extending the existing `.admin-density` scope), with fixed oklch values and Manrope loaded via the existing font setup; the client `ThemeStyleTag` variables must not leak into that scope, and the scope must also apply to the `body` for Radix portals.
- Public tokens and `site_settings` branding stay untouched; the admin simply stops reading them.
- Shared `src/components/ui/*` primitives are not modified; admin sizing/corner differences are applied through the admin scope and admin wrapper components.
- Business logic stays in `/lib`; files stay under 200 lines, so `ListingForm.tsx` and `ImageManager.tsx` get styling pushed into their sub-components rather than growing.
- New admin strings go into `src/messages/en.json` and `de.json`.
