# Broker platform: technical book

> Repository path: `docs/broker-book.md`. Read this before any UI, copy, icon, data or admin work (referenced from `AGENTS.md`). Reference mockups: `docs/reference/broker-site.html`, `docs/reference/broker-admin.html`. When a mockup and this book disagree, this book wins.

The single source of truth for how the broker platform looks, reads and behaves. Built on the Deerva Noir family. Dorothe Waltner is the first client; every future broker is a remix of this platform with a different logo, brand colour and content.

## 0. How to use this book

German is the default language at the root of every URL; English lives under `/en` with the same slugs. Three files describe the whole platform. They are stored in the repository, so every Lovable session can read them without re-attaching.

- **docs/broker-book.md**: This book, as Markdown in the repository. The single source of truth. Read it before any UI, copy, icon, data or admin work.

- **docs/reference/broker-site.html**: Every public page in final layout. Open in a browser; page picker bottom right, Notes toggle for implementation notes.

- **docs/reference/broker-admin.html**: Every admin screen. Same picker and Notes toggle.

> **Never place these files in `public/` or `src/`.** They contain placeholder content and sample client data and must not be served or bundled. The `docs/` folder is not part of the build.
>
> >
> **Remixes.** The docs travel with every remix. When a new broker starts, replace the sample client data in `docs/reference/` and keep the book; client values live only in `site_settings` and seed files.

> **Warning.** **Retired files.** `broker-design-system.html` and `broker-listings.html` are superseded by these three. They still show the earlier "Dorothe warm" direction and a wrong Listings icon. Do not attach them again.
>
> >
> **When a mockup and this book disagree, this book wins.** Mockup text and photos are placeholders; layout, sizes and behaviour are binding.

## 1. Principles and binding rules

### Three layers

| Layer           | What it is                                                                                             | What a client can change                                                                         |
|-----------------|--------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| **Public site** | Noir family. Same layout and components for every broker.                                              | Logo files, logo size, one brand colour (`--primary`), photos and anchor texts through Settings. |
| **Admin**       | Fixed Noir admin theme, identical for every broker. Same screens, same manual, same sales screenshots. | Nothing visual. Only the logo appears in the sidebar.                                            |
| **Sign-in**     | The bridge. Form uses admin tokens; the right panel shows the client's logo and brand colour.          | Logo and brand colour, inherited automatically.                                                  |

### Binding rules (also in AGENTS.md)

> **1. Two token blocks, no third.** Public tokens in `:root`, admin tokens in `[data-admin-theme="noir"]`. Nothing else defines colour, font or radius.
>
> >
> **2. No raw values in components.** No hex colours, font names, pixel radii or Tailwind palette classes (`bg-black`, `text-gray-*`) inside components. Tokens only.
>
> >
> **3. One Button component.** Five variants: primary, secondary, outline, ghost, link. Admin adds destructive. On dark or photo backgrounds, primary and outline take an inverse tone; that is a prop, not a new variant.
>
> >
> **4. One primary action per region.** Everything else is secondary, outline, ghost or link.
>
> >
> **5. Targets and focus.** Public controls at least 44 px tall (buttons 48), admin controls at least 40 px. Focus shows a 2 px ring with 2 px offset. Outlines are never removed without a replacement.
>
> >
> **6. Fonts by layer.** Urbanist everywhere. A script font may only render the optional signature, never UI text.
>
> >
> **7. Contrast before colour.** Text on any filled surface reaches 4.5:1. A brand colour that fails with white text is rejected in Settings.
>
> >
> **8. Fixed vocabulary.** Statuses, actions and fact labels use the words in section 8, in every screen and email. An action keeps its name through the flow.

## 2. Colour

### Public tokens (`:root`)

| Token                                | Value                                                                                  | Use                                                    |
|--------------------------------------|----------------------------------------------------------------------------------------|--------------------------------------------------------|
| `--background`                       | #FFFFFF                                                                               | Page background                                        |
| `--foreground`                       | #111111                                                                               | Text, dark bands, dark path panel                      |
| `--card` / `--secondary` / `--muted` | #F5F5F5                                                                               | Surface bands, cards, testimonial cards                |
| `--muted-foreground`                 | #5E5E5E                                                                               | Secondary text, meta labels (6.5:1 on white)           |
| `--border` / `--input`               | #E0E0E0                                                                               | Hairlines, field borders                               |
| `--primary`                          | #111111 (client may override)                                                         | Primary buttons. Dorothe: #221D17 (16.8:1 with white) |
| `--primary-foreground`               | #FFFFFF, computed for contrast                                                        | Text on primary                                        |
| `--footer` / `--footer-foreground`   | #000000 / #FFFFFF                                                                    | Footer only                                            |
| `--scrim`                            | linear-gradient(180deg, rgba(0,0,0,.30) 0%, rgba(0,0,0,.22) 40%, rgba(0,0,0,.66) 100%) | Over every photo that carries text                     |
| `--on-media` / `--on-media-muted`    | #FFFFFF / rgba(255,255,255,.78)                                                       | Text on photos                                         |

Photography is the only colour on the public site apart from the brand colour and the energy scale. No accent colour, no gradients except the scrim.

### Admin tokens (`[data-admin-theme="noir"]`, from 02-admin-ui.md)

| Token                      | Value                                                       | Use                                           |
|----------------------------|-------------------------------------------------------------|-----------------------------------------------|
| `--background`             | #FAFAFA                                                    | Content area                                  |
| `--card`                   | #FFFFFF                                                    | Cards, tables, top bar                        |
| `--foreground`             | #111111                                                    | Text                                          |
| `--primary`                | #1A1A1A, hover #333333                                    | Primary buttons                               |
| `--secondary` / `--accent` | #F2F2F2                                                    | Hover rows, ghost hover, neutral badges       |
| `--muted-foreground`       | #666666                                                    | Secondary text, labels, table headers (5.5:1) |
| `--border`                 | #E0E0E0                                                    | All borders                                   |
| `--destructive`            | #B00020                                                    | Delete, field errors                          |
| `--sidebar`                | #000000; text rgba(255,255,255,.62); hover .10; active .15 | Sidebar                                       |

> **Warning.** **Contrast finding.** The standard's faint grey #888888 reaches only 3.5:1 on white. It may be used for decoration and disabled states only, never for text someone needs to read. Table headers and labels use #666666.

### Status colours (admin badges)

| Status                                   | Background                          | Text     | Contrast |
|------------------------------------------|-------------------------------------|----------|----------|
| Draft, Closed, Hidden                    | #F2F2F2                            | #555555 | 6.6:1    |
| Coming soon, Invited                     | #E7EFF6                            | #245C8A | 6.1:1    |
| Live, Published, Answered, Shown on site | #E5F2EA                            | #287A4B | 4.6:1    |
| Reserved, In progress, Missing           | #F7EEDF                            | #9A5B00 | 4.7:1    |
| Sold, Let, New (inquiry), Developer      | #111111                            | #FFFFFF | 18.9:1   |
| Archived                                 | transparent, dashed #CFCFCF border | #666666 | 5.7:1    |

### Energy efficiency classes (GEG, residential)

| Class | kWh/(m²·a)    | Background | Text     |
|-------|---------------|------------|----------|
| A+    | below 30      | #00843D   | #FFFFFF |
| A     | 30 to 49      | #2EA343   | #111111 |
| B     | 50 to 74      | #7DB83A   | #111111 |
| C     | 75 to 99      | #B5C21E   | #111111 |
| D     | 100 to 129    | #F2D700   | #111111 |
| E     | 130 to 159    | #F6B11E   | #111111 |
| F     | 160 to 199    | #EE7A1D   | #111111 |
| G     | 200 to 249    | #E2231A   | #FFFFFF |
| H     | 250 and above | #A8151B   | #FFFFFF |

Text colour per class is chosen for 4.5:1. White on A, B or F fails and must not be used. The class is always derived from the energy value, never typed by hand.

## 3. Typography

One family: **Urbanist** 400, 500, 600, 700, latin-ext subset, loaded with `<link>` and `preconnect` in the root head, `display=swap`. Fallback stack: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`. Prices, areas, counts and dates use `font-variant-numeric: tabular-nums`.

### Public scale

| Token        | Size                     | Line height | Weight | Tracking          | Use                                                         |
|--------------|--------------------------|-------------|--------|-------------------|-------------------------------------------------------------|
| `display`    | clamp(40px, 6vw, 76px)   | 1.02        | 700    | -0.035em          | Home hero headline only                                     |
| `h1`         | clamp(34px, 4.4vw, 56px) | 1.06        | 700    | -0.03em           | Page titles, dark-band headlines                            |
| `h2`         | clamp(28px, 3.2vw, 40px) | 1.12        | 700    | -0.02em           | Section titles                                              |
| `h3`         | 22px                     | 1.25        | 700    | -0.01em           | Step and card titles                                        |
| `card-title` | 21px                     | 1.28        | 700    | -0.02em           | Listing card title, 2 lines max                             |
| `lead`       | clamp(18px, 1.6vw, 21px) | 1.55        | 400    | 0                 | Intro paragraph, muted colour, 56ch max                     |
| `body`       | 17px                     | 1.65        | 400    | 0                 | Running text, 66ch max                                      |
| `small`      | 15px                     | 1.6         | 400    | 0                 | Card descriptions, facts                                    |
| `meta`       | 11.5px                   | 1.4         | 600    | 0.14em, uppercase | Location on cards, field labels. Never above every heading. |
| `price`      | 23px (detail 34px)       | 1.1         | 700    | -0.01em           | Prices, tabular numerals                                    |
| `button`     | 12.5px                   | 1           | 700    | 0.12em, uppercase | All public buttons                                          |

### Admin scale

| Token         | Size                    | Weight       | Use                                                          |
|---------------|-------------------------|--------------|--------------------------------------------------------------|
| Page title    | 24px                    | 700, -0.01em | One per screen, with one sentence below                      |
| Section title | 15 to 16px              | 700          | Card and section headers                                     |
| Body          | 14px, line height 1.5   | 400 / 500    | Everything else                                              |
| Label         | 11px, uppercase, 0.14em | 600          | Field labels, table headers, sidebar groups, colour #666666 |
| Tabs          | 12px, uppercase, 0.12em | 600          | Underline tabs                                               |
| KPI number    | 28px                    | 700, tabular | Dashboard and analytics                                      |

## 4. Layout, spacing, breakpoints

| Item              | Value                                                                                                                                                                     |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Spacing base      | 4 px. Scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 88, 96, 120                                                                                                |
| Public container  | max-width 1280 px, side padding 40 px (20 px below 760 px)                                                                                                                |
| Section rhythm    | 120 px vertical desktop, 72 px mobile. Tight sections 88 / 56 px. No gap larger than about a third of the screen.                                                         |
| Section header    | Title left, one link right ("All properties"), 48 px below to content                                                                                                     |
| Listing grid      | 3 columns desktop, 2 below 1000 px, 1 below 640 px; gap 48 px vertical, 28 px horizontal                                                                                  |
| Header            | 80 px, sticky, white 96% with blur, bottom hairline. Full nav from 1080 px; below that a menu button opens a full-screen menu with scroll lock                            |
| Breakpoints       | 640 (sm), 768 (md), 1024 (lg), 1080 (nav), 1280 (xl)                                                                                                                      |
| Admin shell       | Sidebar 240 px, always expanded on desktop, hidden below 900 px behind a menu. Top bar 56 px. Content padding `px-4 py-6 md:px-6 md:py-8`, full width, no `max-w` islands |
| Admin page header | Title and one sentence left, at most one primary action right                                                                                                             |

### Image ratios

| Context              | Ratio                                            | Minimum source width |
|----------------------|--------------------------------------------------|----------------------|
| Home hero            | Full-bleed, min-height max(680px, 100svh - 80px) | 2400 px              |
| Listing card         | 4:3                                              | 1200 px              |
| Listing gallery main | 2-row mosaic, main tile 2:1 column span          | 2000 px              |
| Portrait             | 4:5                                              | 1200 px              |
| Article card / cover | 3:2 / 16:9                                       | 1600 px              |
| Sold strip           | 1:1                                              | 800 px               |

## 5. Shape and motion

| Item               | Public                                                                                                | Admin                                |
|--------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------|
| Radius             | 2 px everywhere                                                                                       | 4 px; badges and avatars fully round |
| Borders            | 1 px `--border`                                                                                       | 1 px `--border`                      |
| Shadows            | None, except dropdowns and dialogs: 0 8px 24px rgba(0,0,0,.12)                                        | Same, plus toast                     |
| Button hover       | Primary lifts 2 px and darkens, 200 ms ease. Outline inverts.                                         | Background change only, 150 ms       |
| Press              | scale(0.98) *(same in both columns)*                                                                  | same                                 |
| Listing card hover | Photo zooms to 1.05 over 700 ms ease-out; title fades to 70% over 300 ms; the card itself never moves |                                      |
| Footer links       | Move 4 px right and brighten, 300 ms                                                                  |                                      |
| Reduced motion     | `prefers-reduced-motion: reduce` removes transforms and smooth scrolling *(same in both columns)*     | same                                 |

## 6. Icons

**Lucide** (`lucide-react`), stroke 1.75, one icon per purpose, identical in every place it appears. Sizes: 16 px in buttons, facts and sidebar; 20 px in section headers; 22 to 24 px in feature grids. An icon never stands alone without text, except icon-only buttons, which carry an `aria-label` and a tooltip.

### Admin dictionary (from 02-admin-ui.md)

| Purpose                             | Lucide                            |
|-------------------------------------|-----------------------------------|
| Dashboard                           | `LayoutDashboard`                 |
| Inquiries                           | `Inbox`                           |
| Calendar (only if the module is on) | `CalendarDays`                    |
| Analytics                           | `BarChart3` (alias `ChartColumn`) |
| Listings                            | `House`                           |
| Articles                            | `Newspaper`                       |
| Testimonials                        | `Quote`                           |
| Users                               | `UserCog`                         |
| Site settings                       | `Settings`                        |
| Back to site                        | `ArrowLeft`                       |
| Sign out                            | `LogOut`                          |
| Admin assistant (optional)          | `MessageCircle`                   |

### Admin actions

| Purpose            | Lucide           |     | Purpose           | Lucide         |
|--------------------|------------------|-----|-------------------|----------------|
| Create             | `Plus`           |     | Edit              | `Pencil`       |
| Delete             | `Trash2`         |     | More actions      | `Ellipsis`     |
| Drag to reorder    | `GripVertical`   |     | Preview           | `Eye`          |
| Upload             | `Upload`         |     | Reset to default  | `RotateCcw`    |
| Search             | `Search`         |     | Expand / collapse | `ChevronDown`  |
| Expand all         | `ChevronsUpDown` |     | View site / page  | `ExternalLink` |
| Done, checklist ok | `Check`          |     | Missing, warning  | `CircleAlert`  |

### Public and listing icons

| Fact / purpose          | DE label                | Lucide                      |
|-------------------------|-------------------------|-----------------------------|
| Living area             | Wohnfläche              | `Maximize`                  |
| Rooms                   | Zimmer                  | `DoorOpen`                  |
| Bedrooms                | Schlafzimmer            | `BedDouble`                 |
| Bathrooms               | Badezimmer              | `Bath`                      |
| Plot area               | Grundstücksfläche       | `LandPlot`                  |
| Year built              | Baujahr                 | `CalendarDays`              |
| Floor                   | Etage                   | `Layers`                    |
| Available from          | Bezugsfrei ab           | `CalendarCheck`             |
| Parking                 | Stellplatz              | `SquareParking`             |
| Balcony / terrace       | Balkon / Terrasse       | `Fence`                     |
| Garden                  | Garten                  | `Sprout`                    |
| Lift                    | Aufzug                  | `ArrowUpDown`               |
| Cellar                  | Keller                  | `Archive`                   |
| Fitted kitchen          | Einbauküche             | `CookingPot`                |
| Heating / energy source | Heizung / Energieträger | `Flame`                     |
| Energy certificate      | Energieausweis          | `Zap`                       |
| Floor plan              | Grundriss               | `LayoutPanelLeft`           |
| 360° tour               | 360°-Rundgang           | `Rotate3d`                  |
| Exposé, documents       | Exposé, Unterlagen      | `FileText`                  |
| Available after enquiry | Nach Anfrage            | `Lock`                      |
| Photo count, all photos | Fotos                   | `Camera`                    |
| Location                | Lage                    | `MapPin`                    |
| Share                   | Teilen                  | `Share2`                    |
| Phone                   | Telefon                 | `Phone`                     |
| Email                   | E-Mail                  | `Mail`                      |
| Hours                   | Öffnungszeiten          | `Clock`                     |
| Qualification           | Qualifikation           | `ShieldCheck`               |
| Valuation               | Bewertung               | `Scale`                     |
| Qualified buyers        | Geprüfte Käufer         | `Users`                     |
| Grid / list / map view  | Raster / Liste / Karte  | `LayoutGrid`, `List`, `Map` |

The public mockup draws a few of these by hand; in code always use the Lucide component named here.

## 7. Components

### Button

| Variant     | Public                                                | Admin                                           | When                                                        |
|-------------|-------------------------------------------------------|-------------------------------------------------|-------------------------------------------------------------|
| primary     | `--primary` fill, white text, 48 px, 0 26 px padding  | #1A1A1A fill, 40 px, sentence case 13px 600    | The one main action of a region                             |
| secondary   | `--card` fill, border, hover border turns foreground  | White fill, border                              | Second action next to a primary                             |
| outline     | Transparent, foreground border, hover inverts         | Not used                                        | Main action on light panels where a fill would be too heavy |
| ghost       | Transparent, hover `--card`                           | Transparent, hover #F2F2F2                     | Tertiary actions, icon-only buttons                         |
| link        | Uppercase text with 1 px underline, hover 70% opacity | Sentence case underlined                        | Navigation inside text, "All properties"                    |
| destructive | Not used                                              | White fill, red border and text, hover red fill | Delete, always with confirmation naming the record          |

**Tone inverse:** on dark bands and photos, primary becomes white fill with dark text and outline becomes white border with white text. **States:** hover, focus-visible (2 px ring, 2 px offset), active scale(0.98), disabled 50% opacity with not-allowed cursor, loading shows a spinner in place of the leading icon and keeps the width. **Icon-only:** 44×44 public, 40×40 admin, with `aria-label` and tooltip. Public button text is uppercase; admin button text is sentence case.

### Form fields

| Item     | Public                                                                                                                                                                                                                                 | Admin                                   |
|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| Height   | 52 px                                                                                                                                                                                                                                  | 40 px                                   |
| Label    | Above the field, 12 px uppercase 0.14em, muted                                                                                                                                                                                         | Above, 11 px uppercase 0.14em, #666666 |
| Help     | Below the field, muted, 14 / 12.5 px. An error replaces the help text in the same spot, so the layout never jumps *(same in both columns)*                                                                                             | same                                    |
| Error    | Red border plus a sentence that says what to do: "Enter a full email address, for example name@example.de". Linked with `aria-describedby`. On submit, focus moves to the first error and all values are kept *(same in both columns)* | same                                    |
| Counters | Shown under fields with limits: title 80, SEO title 60, SEO description 160, testimonial 240 *(same in both columns)*                                                                                                                  | same                                    |
| Consent  | One checkbox, unticked by default, linking to the privacy notice. Required on every public form *(same in both columns)*                                                                                                               | same                                    |

### Listing card (public)

1.  Photo 4:3. One status badge top left at most (New, Coming soon, Price reduced, Reserved, Sold, Let). Photo count bottom right with the camera icon.
2.  Location in `meta` style (town only).
3.  Title, two lines, ellipsis after that.
4.  Three facts with icons, chosen by type. House: living area, rooms, plot. Apartment: living area, rooms, floor. Plot: plot area, development status. Rent: living area, rooms, available from.
5.  Hairline, then price left and energy class right. Apartments show Hausgeld under the price; rentals show cold rent with warm rent under it.
6.  Price variants: regular, "Price on request", "Sold in August 2026" (when sold prices are hidden), "Let in May 2026".

**New** means published within the last 14 days and nothing else applies. Order of precedence when several apply: Sold / Let, Reserved, Price reduced, Coming soon, New.

### Listing detail (public)

Order is fixed: breadcrumb, gallery (mosaic plus All photos, Floor plan, 360° tour, Share), reference and type in `meta`, title, location line, five key facts, About and features, Price and costs, Energy certificate, Documents, Location map, Similar properties. The contact card is sticky on desktop and becomes a fixed bottom bar on phones with Call and Book a viewing.

### Admin patterns (from 02-admin-screens.md)

| Pattern                | Where                              | Rules                                                                                                                                                                                                                      |
|------------------------|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Collection table       | Listings, Articles                 | Header with one primary create; toolbar with search, real filters and a count; drag order; thumbnail; title with town and reference; status badge; Edit and More. Empty, loading and error states each have their own text |
| Expandable editor      | Testimonials (reference), also FAQ | All rows collapsed by default; Expand all; collapsed row shows name, excerpt and labelled badges; inline editing; Shown on site switch; Save with toast; unsaved-changes warning; delete confirmation names the record     |
| Dedicated editor route | Listing, Article                   | Section anchors left with completeness dots, sections in fixed order, sticky publish checklist right that links to the missing field                                                                                       |
| Search                 | All lists                          | A click always wins over a search match. Matches inside a record show one muted context line under the title (`↳ Message: …Lake…`); rows never auto-expand                                                                 |
| Media slot             | Settings page tabs                 | Collapsed: thumbnail, label, "Currently showing …". Expanded: three tiles in fixed order Your choice, Studio default, Built-in, with a Showing badge; Upload, Reset to default, Request as default; editable alt text      |
| Wording section        | Settings page tabs                 | One row per public section; languages side by side; Reset per field; built-in text quoted under each field; one Save per section                                                                                           |
| Toast                  | Every save                         | Bottom centre, dark, "Changes saved. The site is updated." Disappears after about 3 seconds                                                                                                                                |
| Empty state            | Every list                         | Icon in a circle, one sentence saying what will appear here, one primary action                                                                                                                                            |

### Listing editor sections

| Section             | Icon       | Fields                                                                                                                                                       |
|---------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Basics              | `House`    | Title, deal (sale / rent), property type, status, reference (read-only)                                                                                      |
| Location            | `MapPin`   | Address, shown on site: exact / approximate area / town only                                                                                                 |
| Price and costs     | `Euro`     | Sale: purchase price, Hausgeld, reserve fund, price reduced. Rent: cold rent, utilities, warm rent, deposit. Commission: payer, amount, note shown to buyers |
| Facts               | `Ruler`    | Living area, rooms, bedrooms, bathrooms, floor, floors in building, plot area, available from, features                                                      |
| Description         | `FileText` | About this property, Location text. DE required, EN optional; the English site falls back to German                                                          |
| Energy certificate  | `Zap`      | Type, energy value, class (derived), main energy source, year built, valid until                                                                             |
| Photos              | `Image`    | Upload, reorder, first is cover, description required per photo                                                                                              |
| Documents and tours | `FileText` | Floor plan (public), full exposé (after enquiry switch), 360° tour link                                                                                      |

## 8. Fixed vocabulary EN / DE

These words are fixed. Use them identically in the site, admin, emails and Lovable prompts. German uses the formal "Sie".

### Navigation

| EN                        | DE                            |
|---------------------------|-------------------------------|
| Home                      | Startseite                    |
| Properties                | Immobilien                    |
| Selling                   | Verkaufen                     |
| Valuation                 | Immobilienbewertung           |
| Inherited property        | Erbimmobilien                 |
| About me                  | Über mich                     |
| Guides                    | Ratgeber                      |
| Contact                   | Kontakt                       |
| Sold and let              | Verkauft und vermietet        |
| Imprint / Privacy / Terms | Impressum / Datenschutz / AGB |

### Statuses

| EN                                    | DE                                            | Where        |
|---------------------------------------|-----------------------------------------------|--------------|
| Draft                                 | Entwurf                                       | Admin        |
| Coming soon                           | Demnächst                                     | Both         |
| Live                                  | Aktiv                                         | Admin        |
| Reserved                              | Reserviert                                    | Both         |
| Sold                                  | Verkauft                                      | Both         |
| Let                                   | Vermietet                                     | Both         |
| Archived                              | Archiviert                                    | Admin        |
| New                                   | Neu                                           | Public badge |
| Price reduced                         | Preis reduziert                               | Both         |
| New / In progress / Answered / Closed | Neu / In Bearbeitung / Beantwortet / Erledigt | Inquiries    |

### Actions

| EN                                  | DE                                           |
|-------------------------------------|----------------------------------------------|
| Request a valuation                 | Bewertung anfragen                           |
| Start valuation                     | Bewertung starten                            |
| View properties / Browse properties | Immobilien ansehen                           |
| Book a viewing                      | Besichtigung vereinbaren                     |
| Request exposé                      | Exposé anfordern                             |
| Send message                        | Nachricht senden                             |
| Get in touch                        | Kontakt aufnehmen                            |
| Save changes / Save draft           | Änderungen speichern / Als Entwurf speichern |
| Publish → Published                 | Veröffentlichen → Veröffentlicht             |
| Preview                             | Vorschau                                     |
| Delete                              | Löschen                                      |

### Facts

| EN                         | DE                     |
|----------------------------|------------------------|
| Living area                | Wohnfläche             |
| Rooms                      | Zimmer                 |
| Bedrooms                   | Schlafzimmer           |
| Bathrooms                  | Badezimmer             |
| Plot area                  | Grundstücksfläche      |
| Year built                 | Baujahr                |
| Floor / Floors in building | Etage / Etagen im Haus |
| Available from             | Bezugsfrei ab          |
| Fitted kitchen             | Einbauküche            |
| Balcony / Terrace          | Balkon / Terrasse      |
| Garden                     | Garten                 |
| Cellar                     | Keller                 |
| Lift                       | Aufzug                 |
| Parking space / Garage     | Stellplatz / Garage    |

### Price and costs

| EN                       | DE                      |
|--------------------------|-------------------------|
| Purchase price           | Kaufpreis               |
| Price on request         | Preis auf Anfrage       |
| Hausgeld                 | Hausgeld                |
| Reserve fund             | Instandhaltungsrücklage |
| Cold rent                | Kaltmiete               |
| Utilities                | Nebenkosten             |
| Warm rent                | Warmmiete               |
| Deposit                  | Kaution                 |
| Buyer's commission       | Käuferprovision         |
| Land transfer tax        | Grunderwerbsteuer       |
| Notary and land register | Notar und Grundbuch     |
| Total purchase costs     | Gesamtkosten            |

### Energy certificate

| EN                      | DE                                     |
|-------------------------|----------------------------------------|
| Energy certificate      | Energieausweis                         |
| Consumption certificate | Verbrauchsausweis                      |
| Demand certificate      | Bedarfsausweis                         |
| Energy value            | Endenergieverbrauch / Endenergiebedarf |
| Efficiency class        | Energieeffizienzklasse                 |
| Main energy source      | Wesentlicher Energieträger             |
| Valid until             | Gültig bis                             |

## 9. Formats

| Item           | EN                                                                                             | DE            |
|----------------|------------------------------------------------------------------------------------------------|---------------|
| Price          | €479,000                                                                                       | 479.000 €     |
| Monthly amount | €240 / month                                                                                   | 240 € / Monat |
| Area           | 58 m²                                                                                          | 58 m²         |
| Energy value   | 96 kWh/(m²·a)                                                                                  | 96 kWh/(m²·a) |
| Date           | 2 Oct 2026                                                                                     | 2\. Okt. 2026 |
| Month and year | August 2026                                                                                    | August 2026   |
| Percent        | 3.57%                                                                                          | 3,57 %        |
| Phone          | 0160 4444047 (display), +491604444047 (tel: link) *(same in both columns)*                     | same          |
| Reference      | `{PREFIX}-{YYYY}-{NNN}`, e.g. 4WS-2026-014. Prefix from site settings *(same in both columns)* | same          |

All numbers go through `Intl.NumberFormat` and `Intl.DateTimeFormat` with the page locale; never format by hand.

## 10. Voice, tone and legal limits

- **First person singular.** A solo broker writes "I" and "you" (German: "ich" and "Sie"). Never "we" or "our team".
- **Plain and specific.** Numbers and facts instead of adjectives. No "dream home", "unique opportunity", "best", "premium", "exclusive". No exclamation marks.
- **Short.** One idea per sentence. Lead paragraphs at most 56 characters wide per line, running text 66.
- **Errors and empty states say what to do next**, not that something went wrong.

> **Warning.** **Legal limits that copy must respect.**
>
> - **RDG:** a broker may not give legal or tax advice. Inheritance and valuation copy hands those questions to notary, lawyer or tax adviser, as in the approved inheritance text.
- **UWG:** no invented testimonials, ratings or sale results. Testimonials need the client's permission. Sample texts in the mockups are never published.
- **§ 87 GEG:** every advert shows certificate type, energy value, class, main energy source and year built. Listings cannot go Live without them.
- **§ 656c / 656d BGB:** for houses and apartments sold to private buyers, the buyer never pays more than half of the commission. Shown openly in the price box.
- **Impressum and privacy:** § 34c GewO permit, supervisory authority and VAT number are required before going live.

## 11. Content model

Three buckets, from the Deerva content-model standard. Every text on the site belongs to exactly one.

| Bucket                   | What                                                                     | Edited in                            | Examples                                                                                            |
|--------------------------|--------------------------------------------------------------------------|--------------------------------------|-----------------------------------------------------------------------------------------------------|
| **1. Manage entity**     | Repeating records                                                        | Admin → Manage                       | Listings, testimonials, articles. Never duplicated as Settings text; sections query the live table. |
| **2. Anchor copy**       | One headline and one supporting line per major section, plus page photos | Admin → Site settings → page tab     | Home hero headline, Selling page intro, hero and portrait photos                                    |
| **3. Fixed design copy** | Labels and microcopy tied to the design                                  | Code (i18n files), developer request | Button labels, step texts, fact labels, form labels, the vocabulary in section 8                    |

A public page gets its own Settings tab only if it is in the main or footer menu. Detail pages (one listing, one article) never do. Settings tabs for this platform, in order: Business & appearance, Home, Properties, Selling, Valuation, Inherited property, About me, Contact.

Media resolution for every page photo: **Your choice** (client upload) → **Studio default** (developer) → **Built-in** (neutral fallback in code). The page never breaks when a layer is empty.

## 12. Page inventory and data

### Public

| Route (DE / EN)                              | Mockup                      | Data sources                                                                                                                                                    | Settings tab            |
|----------------------------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|
| `/`                                          | site: Home                  | Anchor copy + hero and portrait media; listings via `plan.ts` (3); testimonials `show_on_home` (max 3); sold listings (4); posts (3, hidden with blog flag off) | Home                    |
| `/immobilien` (EN: `/en/immobilien`)         | site: Properties            | Listings with status Live, Coming soon, Reserved; buy / rent switch; filters with live count                                                                    | Properties (intro only) |
| `/immobilien/{slug}`                         | site: Listing detail        | One listing with images, documents, tours; similar listings (same type and town range)                                                                          | None                    |
| `/verkauft`                                  | site: Sold and let          | Listings Sold and Let; price hidden when `show_sold_prices` is off                                                                                              | None (footer link only) |
| `/verkaufen`                                 | site: Selling               | Anchor copy; 8 steps and FAQ as fixed copy                                                                                                                      | Selling                 |
| `/immobilienbewertung`                       | site: Valuation             | Anchor copy; 3-step form into the seller inquiry flow, source = valuation; address prefilled from the home hero                                                 | Valuation               |
| `/erben`                                     | site: Inherited property    | Approved inheritance copy; one photo                                                                                                                            | Inherited property      |
| `/ueber-mich`                                | site: About me              | Anchor copy, portrait, qualifications from settings, all published testimonials                                                                                 | About me                |
| `/kontakt`                                   | site: Contact               | Business details from settings; tabs switch seller, buyer and general forms                                                                                     | Contact                 |
| `/ratgeber`, `/ratgeber/{slug}` (new routes) | site: Guides, Guide article | Posts; menu item and home section only when at least one post is published and the blog flag is on                                                              | None                    |
| `/impressum`, `/datenschutz`, `/agb`         | Plain text template         | Settings legal fields and legal text                                                                                                                            | None                    |

### Admin

| Route                                                            | Mockup                                  | Notes                                                     |
|------------------------------------------------------------------|-----------------------------------------|-----------------------------------------------------------|
| `/admin/login`, `/admin/forgot-password`, `/admin/set-password`  | admin: Sign in, Set password            | Outside the guarded layout. Split screen with brand panel |
| `/admin`                                                         | admin: Dashboard                        | Needs attention, Numbers, Quick actions                   |
| `/admin/inquiries`, `/admin/inquiries/{id}`                      | admin: Inquiries, Inquiry detail        | Status workflow, linked listing, history, internal note   |
| `/admin/analytics`                                               | admin: Analytics                        | Visits, listing views, inquiries, sources                 |
| `/admin/listings`, `/admin/listings/new`, `/admin/listings/{id}` | admin: Listings, Listing editor         | Collection + dedicated editor with checklist              |
| `/admin/posts`, `/admin/posts/{id}`                              | admin: Articles, Article editor         | Collection + dedicated editor with SEO block              |
| `/admin/testimonials`                                            | admin: Testimonials                     | Expandable editor, max 3 on home                          |
| `/admin/users`                                                   | admin: Users                            | Existing developer / owner / editor page                  |
| `/admin/settings/{tab}`                                          | admin: Settings Business, Settings Home | Tabs in the order listed in section 11                    |

## 13. Data fields: what exists and what to add

Audited against the live schema on 5 Oct 2026. Client values go into seed and site settings, never into migrations. All changes are additive: no existing column, status key or policy is renamed.

### Already exist (do not create again)

| Table        | Fields                                                                                                                           |
|--------------|----------------------------------------------------------------------------------------------------------------------------------|
| listings     | `reference_code`, `features`, `published_at`, `deposit`, `status` (draft, coming_soon, active, reserved, sold, rented, archived) |
| testimonials | `show_on_home`, `sort_order`, `published`                                                                                        |
| inquiries    | `status` (new, read, handled), `read_at`                                                                                         |
| posts        | `status`, `cover_alt`                                                                                                            |

> **Warning.** **Status keys are never renamed.** The UI shows the section 8 words: `active` = Live / Aktiv, `rented` = Let / Vermietet. The transition trigger, RLS policies, a public view, the published_at / sold_at triggers and about 46 places in code depend on the keys.

### To add

| Table         | Field                                   | Type                           | Notes                                                                                                                                                                                                                 |
|---------------|-----------------------------------------|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| listings      | `hausgeld`, `reserve_fund`              | numeric, nullable              | Apartments for sale                                                                                                                                                                                                   |
| listings      | `price_reduced`, `previous_price`       | boolean default false, numeric | Previous price is private, never returned publicly                                                                                                                                                                    |
| listings      | `cold_rent`, `utilities`, `warm_rent`   | numeric, nullable              | Rentals; warm rent can be derived when both parts exist. Deposit already exists                                                                                                                                       |
| listings      | `available_from`                        | text                           | "On completion", "1 Nov 2026"                                                                                                                                                                                         |
| listings      | `floors_total`                          | integer                        | For "3 of 4"                                                                                                                                                                                                          |
| posts         | `topic`, `seo_title`, `seo_description` | text                           | Topic from a fixed list: selling, buying, inheritance, energy                                                                                                                                                         |
| site_settings | `listing_ref_prefix`                    | text                           | Dorothe: 4WS. Licence fields (§ 34c permit, supervisory authority, VAT number) added if not already present                                                                                                           |
| inquiries     | `internal_note`                         | text                           | Only visible in admin                                                                                                                                                                                                 |
| inquiries     | `status` values                         | extend the check               | The book's workflow is New, In progress, Answered, Closed; the schema has new, read, handled. Add the new values and map the old ones deliberately in F11 after finding every place that reads them. Do not overwrite |

## 14. Accessibility (WCAG 2.2 AA)

- Text contrast 4.5:1, large text and UI parts 3:1. Values in section 2 are checked; new colours must be checked too.
- Every interactive element reachable by keyboard, with a visible focus ring. Skip link to main content.
- One `h1` per page, headings in order, landmarks (`header`, `nav`, `main`, `footer`).
- `lang` attribute follows the page locale.
- Every listing photo has a description; the publish checklist blocks Live without them. Decorative images use empty alt.
- Form fields have visible labels; errors are announced and linked with `aria-describedby`.
- Gallery lightbox: focus trapped, Escape closes, arrow keys move, focus returns to the trigger.
- Status is never shown by colour alone: every badge carries its word.
- Touch targets at least 44 px public, 40 px admin.

## 15. SEO and performance

| Item              | Rule                                                                                                                                                                                                          |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Meta              | Unique title and description per page and per listing; listing title pattern: "{type} in {town}, {area} m² \| {short name}"                                                                                   |
| Languages         | German at root, English under `/en`; `hreflang` de, en and x-default; canonical per locale                                                                                                                    |
| Structured data   | Home: `RealEstateAgent` with address, phone, area served and reviews only from real published testimonials. Listing: `RealEstateListing` with offer price. Articles: `Article`. Breadcrumbs: `BreadcrumbList` |
| Sitemap           | `/sitemap.xml` with static pages, live listings and published posts, both locales                                                                                                                             |
| Archived listings | Redirect to the properties page; sold and let listings stay reachable as references                                                                                                                           |
| Images            | Responsive `srcset`, AVIF or WebP, hero with `fetchpriority="high"`, everything below the fold lazy; fixed aspect ratios so nothing shifts                                                                    |
| Fonts             | Preconnect, one family, `display=swap`                                                                                                                                                                        |
| Targets           | LCP under 2.5 s, CLS under 0.1, INP under 200 ms on a mid-range phone                                                                                                                                         |

## 16. Emails

Four transactional emails, one template. White background, Urbanist with Arial fallback, logo at the top, one primary button in the brand colour, the business name as sender name, a plain-text part. No amber or legacy colours.

| Email            | To             | Button                                                |
|------------------|----------------|-------------------------------------------------------|
| Password reset   | Admin user     | Set a new password → `/admin/set-password`            |
| Invitation       | New admin user | Accept invitation → `/admin/set-password`             |
| Enquiry received | Visitor        | None. Confirms what was sent and when an answer comes |
| New enquiry      | Broker         | Open in admin → `/admin/inquiries/{id}`               |

## 17. Build order and acceptance

1.  **Public pages**, one Lovable step each, in this order: Home; Properties and Listing detail (with the new listing fields); Sold and let; Selling, Valuation, Inherited property; About me, Contact; Guides.
2.  **Admin shell**: sidebar, top bar and sign-in exactly as broker-admin.html.
3.  **Listing editor** with sections, checklist and photo descriptions; then Listings collection.
4.  **Testimonials** expandable editor; **Articles** collection and editor.
5.  **Settings** tabs with media slots and wording sections; remove the old unused colour and font fields.
6.  **Dashboard, Inquiries, Analytics.**
7.  **Emails** on the shared template.
8.  **Remix readiness**: client data only in seed and site settings, a clean broker seed, checklist for a new broker.

### Every step is accepted when

- Screenshots at 1440 px and 390 px match the mockup.
- No mockup text or Unsplash photo is in the code; texts come from the content model and i18n.
- The search for raw colours, fonts and radii in components returns nothing.
- No horizontal scrolling at any width.
- Typecheck and build pass.
