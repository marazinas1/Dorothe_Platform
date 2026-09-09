# 2 fazė — atsiliepimai kaip tikras turinys (ne fiksuoti laukai)

Šiandien atsiliepimai yra devyni fiksuoti tekstiniai laukai Home redaktoriuje
(`testi1_quote` … `testi3_town`). Todėl savininkė negali turėti nei keturių, nei
dviejų, ir to paties atsiliepimo negali panaudoti kitame puslapyje. Ši fazė
perkelia juos į atskirą duomenų lentelę su savo admin ekranu.

## Ką pamatys savininkė

- Admin → The website → **Testimonials**: sąrašas su „Add“, tvarkymu (rodyti
  aukščiau / žemiau), „Published“ ir „Show on home“ jungtukais. Kiekvienas
  įrašas: citata, autorės vardas, papildoma eilutė (miestas ar situacija).
- Home puslapyje toliau matoma iki **trijų** atsiliepimų — tų, kurie pažymėti
  „Show on home“. Sekcijos antraštė (`testi_title`) lieka Home redaktoriuje.
- **About** puslapyje po kvalifikacijų atsiranda visi publikuoti atsiliepimai
  (CSS-only karuselė / slankioji juosta, be motion bibliotekų).
- Meniu naujo punkto nėra — atsiliepimai yra įrodymas puslapiuose, kur
  priimamas sprendimas, o ne atskira vieta.
- Kol lentelė tuščia, Home rodo tuos pačius neutralius pavyzdinius tekstus kaip
  dabar, kad puslapis niekada neatrodytų tuščias.

## Žingsniai (po vieno, su patikrinimu)

1. **Migracija** — lentelė, RLS, GRANT.
2. **Core logika** — užklausos ir admin server funkcijos.
3. **Vieša atvaizdavimo dalis** — Home (iki 3) ir About (visi).
4. **Admin ekranas** — sąrašas, forma, tvarka, jungtukai.
5. **SEO** — `Review` iš lentelės + `aggregateRating`.
6. **Senų laukų nuėmimas** — Home redaktoriuje nebelieka `testi1..3_*`.

Po kiekvieno žingsnio: `bun run check:i18n`, build’as ir vaizdo patikrinimas
naršyklėje (EN ir `/de`), tik tada einam prie kito.

## Techninė dalis

Duomenų bazė (1 žingsnis, viena migracija — tik schema, jokių kliento tekstų):

```sql
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote jsonb not null default '{}'::jsonb,      -- { en, de }
  author_name text not null default '',
  author_detail text not null default '',
  sort_order integer not null default 0,
  published boolean not null default false,
  show_on_home boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```
- `GRANT SELECT ON public.testimonials TO anon, authenticated;`
  `GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;`
  `GRANT ALL ON public.testimonials TO service_role;`
- RLS: vieša `SELECT` tik `published = true`; rašymas per esamas SQL pagalbines
  funkcijas (`current_user_has_permission('settings.edit')`,
  `current_user_is_active()`) — jokių rolių tekstų policy viduje.
- `updated_at` trigeris pagal esamą projekto šabloną.
- Pavyzdiniai (lorem) įrašai — tik `supabase/seed/de-waltner.sql`, ne migracijoje.

Core (2 žingsnis):
- `src/lib/testimonials/queries.functions.ts` — `publicTestimonialsQueryOptions`
  (visi publikuoti, pagal `sort_order`) su `createPublicSupabase`.
- `src/lib/testimonials/admin.functions.ts` — `list`, `upsert`, `remove`,
  `reorder`; visos su `requireSupabaseAuth` + `assertPermission("settings.edit")`.
- Zod schema `src/lib/validation/testimonials.ts`.

Viešoji dalis (3 žingsnis):
- `TestiItem` tipas persikelia į `src/lib/testimonials/types.ts`;
  `testiItems(copy)` pakeičiamas į eilučių → `TestiItem` maperį su lokalės
  parinkimu (`pickLocalized`) ir i18n fallback’u, kai lentelė tuščia.
- `HomeTestimonials.tsx` gauna `items` per props (brand komponentas duomenų
  neužklausia); Home route loader’is prideda `ensureQueryData`.
- Naujas `src/components/brand/TestimonialsCarousel.tsx` (CSS scroll-snap)
  naudojamas About puslapyje; `$locale.ueber-mich.tsx` tik komponuoja.

Admin (4 žingsnis):
- `src/components/admin/testimonials/` — `TestimonialsPage.tsx`, `Row.tsx`,
  `Form.tsx` (kiekvienas < 200 eilučių), EN/DE citatų skirtukai kaip Home
  redaktoriuje.
- Maršrutas `src/routes/$locale.admin.testimonials.tsx`, punktas
  `AdminSidebar` „website“ grupėje (pilna pertvarka — 4 fazėje).
- EN/DE tekstai į `src/messages`.

SEO (5 žingsnis):
- `home-jsonld.ts` `review` masyvas formuojamas iš `show_on_home` rinkinio.
- `aggregateRating` (`ratingValue: 5`, `reviewCount`) pridedamas tik kai
  publikuotų atsiliepimų yra bent 3 — kitaip laukas praleidžiamas.
- About puslapis lieka be atskiro `Review` bloko, kad tas pats turinys nebūtų
  deklaruojamas dviese.

Nuėmimas (6 žingsnis):
- iš `HOME_TEXT_FIELDS` išimami `testi1..3_*` (`testi_title` lieka);
  `home_content` JSON’e senos reikšmės nesitrina — jos tiesiog nebeskaitomos,
  o pavyzdiniai tekstai lieka `src/messages` fallback’ui.
