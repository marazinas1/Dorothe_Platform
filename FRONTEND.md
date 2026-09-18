# FRONTEND.md

How the interface of this project is built. Read together with `AGENTS.md`
(binding rules) and `PLAN.md` (context and current work).

## Two visual languages

- **Public site** — per client. Colours, fonts and shape come from
  `site_settings` through `ThemeStyleTag` into `:root`.
- **Admin** — fixed and identical in every clone, scoped to `.admin-theme` in
  `src/styles.css`. It defines only the core semantic roles and reuses the
  project's `--font-sans` and `--radius`. No admin-only token aliases, no
  admin typeface, no pill shapes.

Components never hardcode a colour or a font. `text-white`, `bg-black` and hex
values are forbidden; use the semantic roles.

## Structure

```text
src/routes                 composition + head() metadata only
src/components/brand       public presentational components (props in, markup out)
src/components/public      public shell pieces (chrome, gates, banners)
src/components/admin       the whole admin panel (core)
src/components/admin/ui    shared admin building blocks
src/components/ui          shadcn primitives — never modified
src/lib                    server functions, queries, validation, business rules
src/messages               en.json / de.json — every client-visible string
```

Brand imports from core; core never imports from brand. No data fetching,
permission checks or business rules inside `/components/brand`.

## Shared admin building blocks

| Component | Use |
|---|---|
| `AdminPageHeader` | page title, one sentence, up to one primary action |
| `AdminSection` | bordered card section with its own save where relevant |
| `AdminTabs` | the one tab row: transparent, one bottom line, primary underline |
| `AdminEmptyState` | explains the situation and the next action |
| `StatusChip` / `Badge` | state and role labels — text always, colour never alone |
| `ConfirmDialog` | every destructive confirmation; names the record and the loss |
| `UnsavedChangesGuard` | warns before leaving a form with unsaved edits |
| `ImageUploadField` / `BrandAssetField` | media slots with preview, replace, reset |
| `DefaultTextField` | owner override on top of a locked or translated default |

## Admin layout rules

- Pages are full width. Only the shell pads: `px-4 py-6 md:px-6 md:py-8`.
- No `max-w-*` islands in admin routes — dialogs, sheets and genuinely short
  fields only.
- Sidebar groups are fixed: `WORKSPACE`, `MANAGE`, `SETTINGS`; the footer shows
  the signed-in email, the role, "Back to site" and "Sign out".
- Settings tabs: `Business & appearance` first (identity, contact, opening
  hours, social, brand images, maintenance card), then one tab per public page
  in menu order using the public menu names, with `Contact` last.
- Labels sit above controls, help and errors below. Saving shows a toast and
  keeps the button width constant.

## Public site

- Container `max-w-7xl` with `px-4 md:px-6 lg:px-8`; sections `py-16 md:py-24`.
- Every public route is server-rendered and defines its own `head()`.
- Page wording comes from `usePageCopy(page, locale)`: owner text, then locked
  default, then translation. An empty field is a finished state.
- Animation is CSS-only and respects `prefers-reduced-motion`.

## Adding a public page

1. Add the route file under `src/routes` (composition + `head()`).
2. Add a `PAGE_DEFINITIONS` entry in `src/lib/pages/fields.ts` with a field per
   visible line and a translation key as its default.
3. Add the EN/DE defaults and the `admin.pageEditor.fields.<page>.*` labels.
4. Add the Settings tab in `SettingsTabs` and the route switch, in public menu
   order.
