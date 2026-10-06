# Admin design system rules

## Two design systems: fixed admin, per-client public site

- The product has **two** visual languages, deliberately separate:
  - **Admin (inside)** — one fixed design system, identical in every clone. It
    does not read client branding at all. Colours, fonts, radii, button shape
    and control sizing are defined once in the admin theme scope
    (`.admin-theme` in `src/styles.css`) and are never client-configurable.
  - **Public site (outside)** — fully per-client, driven by `site_settings`
    tokens through `ThemeStyleTag`.
- Changing a client's primary colour, fonts or corner style must change the
  public site only. The admin must look identical across clients.
- Never let client tokens leak into the admin scope, and never put a
  client-specific colour or font inside the admin theme.
- Both sides still use semantic tokens. Components never hardcode colours or
  fonts; the admin scope supplies the admin values, `:root`/`ThemeStyleTag` the
  public ones.
- The admin scope defines only the core semantic roles (`background`,
  `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`,
  `destructive`, `border`, `input`, `ring`, status pairs). No admin-only
  aliases, no separate admin typeface, no separate shape language: the admin
  uses the project's `--font-sans` and `--radius`, and never pill-shaped
  controls or tabs.
- Tabs everywhere in the admin use the shared `AdminTabs` component: a
  transparent row on one `border-border` line with a 3px `primary` underline on
  the active tab.
- Destructive actions use the shared `ConfirmDialog` (never `window.confirm`)
  and name the record plus what disappears from the public site. Forms with
  unsaved edits render `UnsavedChangesGuard`.
- The one exception carried over from the client theme is the logo, which is
  brand identity rather than styling.

Source of truth for admin screens: `docs/broker-book.md` sections 6, 7 and 13 (visual reference `docs/reference/broker-admin.html`).
