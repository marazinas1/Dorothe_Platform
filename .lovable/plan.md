# 3 fazė — blog’as (Ratgeber) kaip tikras turinys

`blog` jungtukas jau yra Settings → Modules sąraše, bet už jo nieko nėra. Ši
fazė padaro veikiantį straipsnių modulį: savininkė rašo tekstus admin panelėje,
viešai jie atsiranda kaip atskiri puslapiai su savo SEO galvutėmis.

## Ką pamatys savininkė

- Admin → The website → **Ratgeber** (Blog): straipsnių sąrašas su „Add“,
  būsena (Draft / Published), publikavimo data, tvarkymu.
- Straipsnio forma: pavadinimas, adresas (slug, generuojamas iš pavadinimo),
  trumpas įvadas, tekstas, viršelio nuotrauka, publikavimo data, EN/DE
  skirtukai kaip Home redaktoriuje ir Testimonials.
- Viešai: `/{locale}/ratgeber` — straipsnių sąrašas kortelėmis; 
  `/{locale}/ratgeber/{slug}` — vienas straipsnis.
- Meniu punktas „Ratgeber“ atsiranda tik kai `blog` jungtukas įjungtas IR yra
  bent vienas publikuotas straipsnis. Kol nieko nėra — jokių tuščių puslapių.
- Home puslapio kompozicija nesikeičia.

## Žingsniai (po vieno, su patikrinimu)

1. **Migracija** — `posts` lentelė, RLS, GRANT, slug istorija, trigeriai.
2. **Core logika** — vieši ir admin server funkcijos, Zod validacija.
3. **Vieši puslapiai** — sąrašas ir straipsnis, SEO galvutės + `Article` JSON-LD.
4. **Admin ekranas** — sąrašas, forma, viršelio nuotrauka, publikavimas.
5. **Navigacija ir i18n** — meniu punktas už jungtuko, EN/DE tekstai.

Po kiekvieno žingsnio: `bun run check:i18n`, build’as ir vaizdo patikrinimas
naršyklėje (EN ir `/de`), tik tada einam prie kito.

## Techninė dalis

Duomenų bazė (1 žingsnis, viena migracija — tik schema, jokių kliento tekstų):

```sql
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'draft',        -- draft | published
  published_at timestamptz,
  cover_path text,
  cover_alt jsonb not null default '{}'::jsonb,
  title jsonb not null default '{}'::jsonb,    -- { en, de }
  excerpt jsonb not null default '{}'::jsonb,
  body jsonb not null default '{}'::jsonb,
  meta_title jsonb not null default '{}'::jsonb,
  meta_description jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.post_slug_history (...);   -- kaip listings, kad senos nuorodos gyventų
```

- `GRANT SELECT ON public.posts TO anon, authenticated;`
  `GRANT INSERT, UPDATE, DELETE ON public.posts TO authenticated;`
  `GRANT ALL ON public.posts TO service_role;`
- RLS: vieša `SELECT` tik `status = 'published' and published_at <= now()`;
  rašymas per esamas SQL pagalbines funkcijas
  (`current_user_has_permission('settings.edit')`, `current_user_is_active()`) —
  jokių rolių tekstų policy viduje.
- Slug generuojamas per esamas `slugify()` / `listing_unique_slug()` giminės
  funkcijas (nauja `post_unique_slug`), `updated_at` — esamas
  `tg_set_updated_at()` trigeris.
- Pavyzdiniai straipsniai — tik `supabase/seed/de-waltner.sql`, ne migracijoje.

Core (2 žingsnis):
- `src/lib/posts/types.ts`, `src/lib/validation/posts.ts` (Zod).
- `src/lib/posts/queries.functions.ts` — `publicPostsQueryOptions`,
  `publicPostQueryOptions(slug)` per `createPublicSupabase`, su slug istorijos
  peradresavimu.
- `src/lib/posts/admin.functions.ts` — `list`, `save`, `remove`, `publish`;
  visos su `requireSupabaseAuth` + `assertPermission("settings.edit")`.
- Viršelio nuotraukos kelias su savininko id prefiksu: `posts/<post_id>/...`,
  per esamą image pipeline.

Vieši puslapiai (3 žingsnis):
- `src/routes/$locale.ratgeber.index.tsx` ir `$locale.ratgeber.$slug.tsx` —
  tik kompozicija ir `buildHead` (unikalus title/description/og kiekvienam
  straipsniui), SSR įjungtas.
- `src/components/brand/blog/PostCard.tsx`, `PostList.tsx`, `PostArticle.tsx` —
  be duomenų užklausų, tik props.
- `src/lib/seo/post-jsonld.ts` — `Article` su `headline`, `datePublished`,
  `author` iš `site_settings`.
- Nežinomas slug → 404 per esamą `notFoundComponent`.

Admin (4 žingsnis):
- `src/components/admin/posts/` — `PostsPage.tsx`, `PostRow.tsx`, `PostForm.tsx`
  (kiekvienas < 200 eilučių), EN/DE skirtukai.
- Maršrutas `src/routes/$locale.admin.posts.tsx`, punktas `AdminSidebar`
  „website“ grupėje su `flag: "blog"`.

Navigacija ir tekstai (5 žingsnis):
- `PublicChrome` meniu punktas už `blog` jungtuko ir publikuotų straipsnių
  skaičiaus.
- Visi nauji tekstai — `src/messages/en.json` ir `de.json`, be kliento vardų.
