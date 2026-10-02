# Seed rules

## Per-client onboarding checklist

1. Clone the repository, create a fresh Lovable Cloud backend, apply all
   migrations.
2. Create `supabase/seed/<country>-<client>.sql` and fill the single
   `site_settings` row:
   - identity: `site_name`, `legal_name`, `country`, `currency`, `area_unit`
   - locales: `default_locale`, `enabled_locales`
   - branding: `primary_color`, `secondary_color`, `accent_color`,
     `font_heading`, `font_body`, `logo_url`, `logo_dark_url`, `favicon_url`,
     `og_default_image`
   - contact: `contact_email`, `contact_phone`, `whatsapp`, `address_*`,
     `geo_lat`, `geo_lng`, `opening_hours`, `social`
   - content: `homepage_sections`, `credibility_heading`, `credibility_stats`,
     `about_body`, `qualifications`, `primary_agent_*`
   - legal: `legal_impressum`, `legal_privacy`, `legal_terms`
3. Upload assets to the `site-assets` bucket (logo light/dark, favicon, agent
   portrait, hero image, OG default) and run them through the image
   optimisation function.
4. Set locales and country, then verify energy validation matches that country.
5. Toggle `feature_flags` for the modules sold (rentals, team, valuation,
   sold archive, maps, ...).
6. Create the owner user and grant permissions; confirm the admin panel loads.
7. Confirm no client detail was added outside the seed file and
   `site_settings`.
