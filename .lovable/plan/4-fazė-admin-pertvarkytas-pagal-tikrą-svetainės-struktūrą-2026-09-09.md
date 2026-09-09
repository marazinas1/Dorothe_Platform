# 4 fazė — admin pertvarkytas pagal tikrą svetainės struktūrą

Tikslas: „The website“ sekcija admin meniu skaito taip, kaip skaito pati
svetainė — Home, Properties, Selling, Inheritance, Valuation, About, Contact,
Testimonials, Ratgeber. Kiekvienas punktas atveria būtent to puslapio žodžius ir
nuotraukas. Šiandien 7 iš 9 viešų puslapių apskritai neredaguojami (tekstas
sėdi `en.json` / `de.json`), o Home slepiasi po abstrakčiu „Content“.

Papildomai užbaigiame vieną 3 fazės skolą: `sitemap.xml` svetainėje vis dar
nėra.

---

## Žingsnis 1 — turinio modelis puslapiams (core)

Nauja lentelė `public.page_content`: `page` (unikalus slug, pvz. `selling`),
`content` jsonb (laukas → locale → tekstas), `media` jsonb (slotas → default /
custom URL), laiko žymos. Viešas skaitymas — leidžiamas; rašymas — tik
aktyviems naudotojams su `settings.edit`, per esamas SQL helper funkcijas.
GRANT'ai + RLS + `updated_at` trigeris. Jokio kliento teksto migracijoje.

Rezoliucija (`src/lib/pages/resolve.ts`): sava reikšmė → default locale →
esamas `pages.*` vertimo tekstas → tuščia. Tai reiškia, kad nė vienas viešas
puslapis nepasikeičia tol, kol savininkė nieko neįrašo — dabartiniai vertimai
lieka kaip default.

## Žingsnis 2 — laukų registras ir server functions

`src/lib/pages/fields.ts`: kiekvienam puslapiui (selling, inheritance,
valuation, about, contact) laukų sąrašas su tipu (`line` / `paragraph` /
`list`), grupe ir vertimo raktu, iš kurio imamas default. Registras tiksliai
atkartoja tai, kas šiandien yra `pages.*` vertimuose — nauji tekstai
nekuriami.

`queries.functions.ts` viešam skaitymui, `admin.functions.ts` (autentikuotas,
`settings.edit`) skaitymui ir įrašymui. Media keliai — `pages/<page>/...`.

## Žingsnis 3 — bendras puslapio redaktorius

Iš Home redaktoriaus išskiriamas bendras `PageEditorWorkspace`: laukai
kairėje, gyvas puslapio preview dešinėje, EN/DE perjungimas, „Refresh“ ir
„Open page“ — viskas kaip Home šiandien. Home ir kiti puslapiai naudoja tą patį
komponentą, tik su savo laukų registru. Failai laikomi po 200 eilučių.

## Žingsnis 4 — meniu ir maršrutai

`/$locale/admin/pages/$page` — vienas maršrutas visiems statiniams puslapiams.
Sidebar „The website“ grupė pertvarkoma į: Home, Properties, Selling,
Inheritance, Valuation, About, Contact, Testimonials, Ratgeber. `Home` pakeičia
`Content`; senas `/admin/content` adresas nukreipiamas į naują Home, kad
išsaugotos nuorodos veiktų. Testimonials ir Ratgeber lieka po savo feature
flag'ais.

## Žingsnis 5 — vieši puslapiai skaito redaguotą turinį

Selling, Inheritance, Valuation, About, Contact loader'iai papildomi
`page_content` užklausa, o komponentai vietoje `t()` naudoja išspręstą turinio
maišą. SSR lieka nepakitęs, SEO galvutės ir JSON-LD nekeičiami.

## Žingsnis 6 — `sitemap.xml` (3 fazės skola)

`/sitemap.xml` maršrutas: statiniai puslapiai visomis įjungtomis kalbomis,
visi publikuoti objektai, visi publikuoti Ratgeber straipsniai, su
`lastmod`. Taip pat `robots.txt` su nuoroda į sitemap.

---

## Tikrinimas po kiekvieno žingsnio

`bun run check:i18n`, TypeScript, build, ir EN/DE viešų puslapių bei admin
ekranų patikrinimas naršyklėje. Po 6 žingsnio — `/sitemap.xml` atsakas ir jame
esančių URL kiekis.

## Ko šioje fazėje nedarome

Nekuriame naujų viešų puslapių, nekeičiame dizaino, neliečiame objektų
(Properties) redaktoriaus logikos — jis tik gauna savo vietą meniu.
