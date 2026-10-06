<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules — broker platform template

Binding rules. If a request conflicts, say so and propose the compliant version. Context and work plan: PLAN.md (read before planning).

## Design and content source of truth
- `docs/broker-book.md` is the single source of truth for colours, fonts, icons, components, EN/DE vocabulary, formats, content model and data fields. Read it before any UI, copy, icon, data or admin work.
- Visual reference: `docs/reference/broker-site.html` and `docs/reference/broker-admin.html`. When a mockup and the book disagree, the book wins.
- Mockup text, photos, listings and testimonials are samples and never become code, seed or database rows.

## Architecture
- Clone-per-client: one codebase, one deployment, database and domain per broker. Not multi-tenant: no tenant ids, tenant routing or cross-client tables; no frontend/backend split.
- Reuse comes from the core/brand boundary plus an upstream template. Fixes for every client go into core, never patched twice in brand.
- Read settings only via `@/lib/config/site-settings.functions`; never query `site_settings` from components or assume one row.
- RLS uses the SQL helpers (`current_user_role()`, `has_role(text[])`, `current_user_has_permission()`, `current_user_is_active()`); no inline role literals.
- Storage paths start with the owning entity id (`listings/<id>/...`).
- Business logic lives in server functions under `/lib`, never in components.

## Core / brand boundary
- CORE: `supabase/migrations`, `/lib`, `/components/admin` (see its AGENTS.md), `/components/ui` (never modified), engines (SEO, i18n, energy validation, images, tokens).
- BRAND: `/components/brand`, route files (composition + head only), `site_settings` rows and `supabase/seed/<client>.sql`.
- Core never imports brand (pass markup as props/children). Brand components only render props: no fetching, permissions or rules (type imports ok).

## Client data — never in code
- Visible strings in `/src/messages` (en/de); client words interpolated from `site_settings` via `@/lib/config/site-copy`.
- Client values in `site_settings`; optional capabilities behind `feature_flags` via `useFeatureFlag`.
- Client data only in seed files; migrations hold schema and are immutable (neutralise leaks with a follow-up migration).
- No client name, address, phone, email or town anywhere else — including comments, placeholders, defaults and migration WHERE clauses.

## Design tiers
- The public site starts from a Deerva theme family (Noir by default) in `src/styles.css`; a client brand overrides only `--primary` and the logo, because one look per family keeps every clone consistent. Binding UI rules: `src/components/brand/AGENTS.md`.
- The approved `broker-site.html` composition is the public-site visual reference; keep its shared chrome and page anatomy while rendering only live settings, content, media and records.
- Standard (default): differentiate via `site_settings` primary colour, `homepage_sections`, hero variants and flags. Premium: `/components/brand` may be rewritten. Prefer config, then a variant/token, before bespoke components.

## General
- Files under 200 lines (generated files and `/components/ui` exempt).
- Public site stays SSR. CSS-only animation.
- German market: `latin-ext` fonts; energy fields follow `site_settings.country`; no cookies without consent, cookieless analytics.
- Colours only from semantic tokens in `src/styles.css`.

- New public listing columns need both the `listings_public` view and a column-level `GRANT SELECT (...) ON listings TO anon`; the view is security_invoker, so without the grant every public page fails.
- Enquiry status is read through `normalizeInquiryStatus` (legacy `read`/`handled` map to `in_progress`/`closed`), because older deployed builds may still write the old values.
- Every email (auth and app) renders through `src/lib/email-templates/layout.tsx` with words from `src/messages` `emails.*`; enquiry mails are sent best-effort from `src/lib/inquiry/notify.server.ts` so a mail failure never loses an enquiry.
