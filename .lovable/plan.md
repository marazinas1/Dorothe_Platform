# Broker platform: bringing the site in line with the book and mockups (F0–F13)

Sources, in priority order: `broker-book.html` (wins on any conflict), `broker-site-5.html`, `broker-admin.html`. The mockups' page switcher, "Notes" and "Show toast" are documentation and are not built. After approval **only F1 is built**, then work stops for review.

## F0. Audit (current state vs mockup)

### Database (checked)
- `listings.status` currently holds `active` (5), `draft` (2), `sold` (2) and `rented` (1). The book's list is draft, coming_soon, live, reserved, sold, let, archived. Mapping: `active → live`, `rented → let`; `draft` and `sold` stay as they are. `reserved` and `coming_soon` are new values, and no existing listing uses them yet.
- These fields already exist: `listings.reference_code`, `features`, `published_at`; `testimonials.show_on_home`, `sort_order`, `published`; `inquiries.status`, `read_at`; `posts.status`.
- These fields are missing: `listings.hausgeld`, `reserve_fund`, `price_reduced`, `previous_price`, `cold_rent`, `utilities`, `warm_rent`, `deposit`, `available_from`, `floors_total`; `posts.topic`, `seo_title`, `seo_description`, `cover_alt`; `inquiries.internal_note`; `site_settings.listing_ref_prefix` (licence fields to be checked in F2).

### Public pages
| Page | State | Action |
|---|---|---|
| Home | H1 sections exist (Hero, Paths, Credentials, Listings, SaleProcess, Testimonials, Valuation, Sold, Articles) | F1: reorder sections, add the hero valuation form, rebuild the broker block, remove "amber" leftovers |
| Properties / Listing | Mostly aligned in earlier waves | F2: new fields, statuses, badges (New, Reserved, price reduced) |
| Sold and let | Aligned | F3: `let` status, price policy check |
| Selling / Valuation / Inherited | Aligned; valuation has no address prefill | F4: 3-step valuation with prefill from the hero, source=valuation |
| About / Contact | Contact done; About not aligned | F5 |
| Guides | Routes exist | F6: behind the blog flag, topics |
| Legal pages | Plain text | Unchanged |

### Admin
The shell, login, listings, posts, testimonials, settings, inquiries and analytics screens already exist. They differ from `broker-admin.html` in the sidebar brand block, the editor checklist, the inquiry note and status workflow, and the dashboard. These are covered in F7–F11.

## F1. Home page (detailed, build first)

**Goal:** match `p-home` at 1440 px and 390 px, in this section order: hero → two paths → broker → selected properties (3) → process (4) → testimonials (show_on_home, max 3, only real ones) → valuation band → recently sold (4) → guides (3, blog flag).

| Section | Data source | Change |
|---|---|---|
| Hero | Settings Home: headline, subline, hero photo (Your choice → Studio default → Built-in); credentials from settings | Replace the white CTA card with a **form**: Address field, Type select (House / Apartment / Multi-family house / Plot), "Start valuation" button. It goes to `/immobilienbewertung?address=…&type=…`. No submission happens here. |
| Two paths | Fixed copy in i18n | Selling → `/verkaufen`, Buying → `/immobilien`; check against the mockup and keep the component |
| Broker | Settings Home: heading, intro, portrait; qualifications from settings; name and town from `site_settings` | New `HomeBroker.tsx`, which replaces `H1Credentials` |
| Selected properties | `featuredListingsQueryOptions` (3) | Order and header with an "All properties" link; reuse the cards |
| Process | Fixed 4 steps in i18n | Move to after the properties; "The full process" link → `/verkaufen` |
| Testimonials | `testimonials` where published + show_on_home, max 3 | Hidden when there are none; mockup testimonials are not created (UWG) |
| Valuation band | Settings Home: heading, intro; phone from settings; 4 bullets in i18n | Align with the mockup, one primary CTA |
| Recently sold | `recentSoldQueryOptions` (4), `show_sold_prices` | Keep; header text "Sale prices stay private…" only when prices are hidden |
| Guides | `publicPostsQueryOptions` (3) | Only when the blog flag is on and at least one post is published |

**Files**
- Edit: `home/h1/H1Home.tsx` (order), `H1Hero.tsx` (form), `H1Valuation.tsx`, `H1SaleProcess.tsx`, `H1Paths.tsx`, `HomeArticles.tsx` (flag guard), `src/messages/en.json` and `de.json`. The comments mentioning "amber" are removed.
- Create: `home/HeroValuationForm.tsx`, `home/HomeBroker.tsx`.
- Delete: `home/h1/H1Credentials.tsx` (replaced).
- Valuation route: only reads the `address`/`type` search parameters to prefill the form (the full 3-step form comes in F4).

**New i18n keys (EN, DE marked as "pending Dorothe's review")**
`home.hero_form.address`, `home.hero_form.type`, `home.hero_form.types.{house,apartment,multi_family,plot}`, `home.hero_form.submit`, `home.broker.signature_role`, `home.listings_all`, `home.process_more`, `home.sold_private_note`, `home.sold_all`, `home.guides_title`, `home.guides_all`, `home.valuation_points` (4).

**Content rules:** no mockup text in code (copy goes to i18n or Settings), no Unsplash images, no mockup listings or testimonials as records. Unconfirmed facts (such as "a handful of properties at a time") are only used where they already exist in the approved copy; anything else is flagged for review.

**Acceptance:** (a) screenshots at 1440 and 390 px; (b) a search for mockup text and Unsplash returns 0; (c) a search for hex, `rounded-[`, font names and palette classes in `brand/home` returns 0; (d) no horizontal scrolling at 320–1920 px; (e) SSR, typecheck, i18n check and build pass; every file is under 200 lines.

**Risks:** removing `H1Credentials` loses the credential tags (they move into the broker block). The hero form must not slow down the largest image's load time, so it stays plain markup with no extra libraries.

## F2–F13 (overview, each approved separately)

- **F2 Listings: migration + Properties + Listing.** Schema only:
  ```text
  ALTER listings: drop status check; UPDATE active->live, rented->let;
    new check (draft,coming_soon,live,reserved,sold,let,archived);
    add hausgeld, reserve_fund, previous_price numeric; price_reduced bool default false;
    cold_rent, utilities, warm_rent, deposit numeric; available_from text; floors_total int
  ALTER site_settings: add listing_ref_prefix text (+ licence fields if missing)
  ```
  Every place that filters on `active`/`rented` is updated (queries, sitemap, admin, RLS helpers are only read, not changed). `previous_price` is never returned publicly. Badges: New (14 days after `published_at`), Reserved, Coming soon. Risk: the status rename touches many queries, so all of them are found with search before the migration.
- **F3 Sold and let.** Show `sold` + `let`; price policy; archived listings redirect to Properties.
- **F4 Selling, Valuation, Inherited.** 3-step valuation into `submitSellerInquiry` with source=valuation, prefilled from the hero; FAQ answers stay drafts until Dorothe confirms them.
- **F5 About, Contact.** About: portrait, qualifications from settings, all published testimonials. Contact: check it against the mockup.
- **F6 Guides.** Menu item and home section only when the flag is on and a post exists; migration `posts.topic` (selling, buying, inheritance, energy), `seo_title`, `seo_description`, `cover_alt`.
- **F7 Admin shell and sign-in.** Sidebar, top bar, split-screen login as in `broker-admin.html`; routes unchanged.
- **F8 Listing editor and list.** Sections, publish checklist (photo descriptions required for Live), reference code generator.
- **F9 Testimonials and Articles.** Expandable editor, max 3 on home enforced in the UI; article editor with an SEO block.
- **F10 Settings.** Tab order: Business & appearance, Home, Properties, Selling, Valuation, Inherited property, About me, Contact; media slots; remove old colour and font fields (the live values are checked first).
- **F11 Dashboard, Inquiries, Analytics.** Migration `inquiries.internal_note text`, status values new/in_progress/answered/closed (mapping existing ones); Needs attention, history.
- **F12 Emails.** One template, 4 emails (password reset, invitation, enquiry received, new enquiry).
- **F13 Remix readiness.** Separate the client seed, a clean seed for a new broker, a checklist.

## Untouched
RLS, the permissions matrix and roles, the `/admin` route structure, the i18n setup.
