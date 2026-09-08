# One button style across the whole site

Right now buttons differ from page to page: some are amber, some dark, some
rounded like pills, some square; some show an arrow, some don't; and one form
button doesn't even show the hand cursor. This fixes that with a single written
rule applied everywhere.

## The rule

Main action (one per area, e.g. "Contact", "Request a valuation", "Send enquiry")
- amber background, white text, darker amber on hover
- 4px corners, 48px tall, comfortable side padding
- uppercase, wide letter spacing, no arrow
- hand cursor on hover, dimmed while sending

Secondary action ("View all properties", "Read more")
- no filled box: text in the page's dark colour with a thin underline
- keeps the arrow, since that is what marks it as a quiet link

Never used again: pill/round buttons, dark-filled main buttons on light pages,
arrows inside filled buttons, one-off colours written into a page.

Only exception: on the dark amber-free bands (the valuation strip, testimonials),
the main button flips to a light background with dark text, because amber on dark
reads as an error. Same size, same corners, still no arrow.

## What changes

- Two shared button pieces become the single source: one filled main button, one
  quiet link. Both read colour and corner size from the site's design settings,
  so changing the brand colour later still changes every button at once.
- Every public page and form is switched over to them: navigation Contact,
  homepage hero, the two paths, valuation strip, property cards, sold strip,
  contact page, all enquiry forms (short, seller, buyer, listing), listing sticky
  rail and action bar, mobile menu, "About" intro.
- Arrows are removed from all filled buttons and kept on quiet links.
- The hand cursor and the disabled/sending state are added everywhere, which also
  fixes "Send enquiry" not showing the cursor.
- The admin panel keeps its own compact buttons, but inherits the same amber and
  the same 4px corners so nothing looks foreign.

## Technical notes

- `src/components/brand/home/HomeActions.tsx` is promoted to
  `src/components/brand/ui/ActionButton.tsx` + `QuietLink.tsx` (brand-level,
  presentational, props only), exporting variants `primary` and `on-dark`.
- Classes centralised there; page/route files stop carrying button class strings.
- Colours stay token-based (`bg-accent`, `text-accent-foreground`,
  `rounded-[var(--radius-button)]`); no hex or `text-white` in components.
- `--radius-button` stays 4px; hover uses the existing amber hover token rather
  than opacity, so all buttons hover identically.
- Files touched: `SiteNav.tsx`, `NavDrawer.tsx`, `H1Hero.tsx`, `H1Paths.tsx`,
  `H1Valuation.tsx`, `H2*/H3*/H4*/H5*` action spots, `Hero.tsx`,
  `ValuationInvite.tsx`, `TwoPaths.tsx`, `AgentIntro.tsx`, `ContactSection.tsx`,
  `ShortInquiryForm.tsx`, `SellerInquiryForm.tsx`, `BuyerInquiryForm.tsx`,
  `ListingInquiryForm.tsx`, `ListingStickyRail.tsx`, `ListingActionBar.tsx`,
  `ListingHeroOverlay.tsx`, `$locale.kontakt.tsx`.
- No data, schema or business-logic changes; each file stays under 200 lines.

## Check

Build, then view the homepage, a property page, the contact page and the mobile
menu: every filled button is amber, 4px, arrow-free, with a hand cursor, and the
dark bands use the light-on-dark version.
