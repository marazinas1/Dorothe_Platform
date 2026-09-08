# Home page valdymas: 3 versijos, kortelė kaip įėjimas į redaktorių

## Ką siūlau (aiškūs sprendimai)

1. **Trys versijos vietoj penkių.** Dabartinis gyvas dizainas tampa **Home V1**
   ir nesikeičia nė vienu pikseliu. Paliekame dar dvi: **V2** (dabartinis
   „Expert“ / `h2`) ir **V3** (dabartinis „Modern“ / `h4`). Ištrinami du, kurie
   reikalauja pločio (landscape) full-bleed hero nuotraukos ir todėl netinka
   Dorothe's portretui: „Four walls“ (`h3`) ir „Editorial“ (`h5`).
   Vidiniai keys lieka `h1`, `h2`, `h3` — perkeliame `h4` turinį į `h3` vietą,
   kad būtų tvarkinga eilė. Visos trys naudoja tik **portrait** portretą +
   vieną papildomą nuotraukos slotą.

2. **Kortelė = mygtukas.** Galerijoje kiekviena kortelė yra vienas didelis
   paspaudžiamas blokas: viršuje **sumažintas realaus puslapio vaizdas**
   (thumbnail), po juo pavadinimas („Home V1“), trumpas apibūdinimas,
   „LIVE“ ženklelis ir vienas veiksmas — „Set as main home page“ (tik ne
   gyvai esančiai). Paspaudus pačią kortelę atsidaro tos versijos
   **redagavimo langas**.

3. **Thumbnail rodo tikrą puslapį.** Ne ranka darytas paveikslėlis: kortelėje
   įdedamas mažas, ne interaktyvus `iframe` su ta pačia esama saugia preview
   nuoroda (`?home=<key>&t=<token>`), sumažintas per CSS `transform: scale`.
   Taip vaizdas visada teisingas ir atsinaujina pats. Papildomai lieka
   „Preview“ nuoroda, atidaranti pilną puslapį naujame skirtuke.

4. **Redagavimo langas — tik tai, kas priklauso Home page.** Atsidaro
   pilno ekrano panelė (Sheet) su tos versijos tekstų laukais, nuotraukų
   slotais („Default“ / „Choose your own“) ir kalbos perjungimu (EN/DE).
   Objektų (skelbimų) kortelių turinys čia neredaguojamas — jos ateina iš
   Listings, kaip ir dabar. Redagavimas nepakeičia gyvos versijos: turinys
   bendras, tad įrašai persineša ir tarp versijų.

5. **Testimonials — vieną kartą, visoms versijoms.** Šiuo metu atsiliepimų
   laukai priskirti tik `h1`/`h5`. Padarysiu juos bendrus: suvedami vieną kartą
   ir rodomi visose trijose versijose. Tai ir SEO požiūriu teisinga — kiekviena
   Home versija turi tą patį `Review` turinį, taigi jokia versija nenusmunka.

6. **SEO.** Home route jau kuria `title` / `description` / `og:*` / canonical.
   Papildomai: kai atsiliepimai užpildyti, į Home įdedamas `JSON-LD`
   (`RealEstateAgent` + `review`), vienodai visoms trims versijoms.
   Preview puslapiai lieka `noindex`, kad Google nematytų neaktyvių versijų.

## Kaip tai atrodys admin

```text
Home page
Choose a design and edit its words and photographs.

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ [mini vaizdas]│  │ [mini vaizdas]│  │ [mini vaizdas]│
│ Home V1  LIVE │  │ Home V2       │  │ Home V3       │
│ trumpas apib. │  │ trumpas apib. │  │ trumpas apib. │
│ Edit · Preview│  │ Set as main   │  │ Set as main   │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Techninė dalis

- `src/lib/home/templates.ts` — `HomeTemplateKey` sutraukiamas iki
  `"h1" | "h2" | "h3"`; senasis `h4` įrašas perkeliamas į `h3`; `h3`/`h5`
  įrašai ir jų `src/components/brand/home/h3|h4|h5` katalogai
  perorganizuojami/ištrinami. `HomeTemplate.tsx` switch atnaujinamas.
- `src/lib/home/fields.ts` — nuimamas `templates: ["h1","h5"]` nuo `testi*`
  laukų (bendri visiems); `statement`/`facts` laukai išimami su ištrintomis
  versijomis.
- `src/components/brand/home/HomeTemplate.tsx` + likusios versijos —
  atsiliepimų sekcija įtraukiama į visų trijų `sections` sąrašą.
- Nauja migracija: `site_settings_validate_home_template` leidžia tik
  `h1,h2,h3`, o esamos reikšmės `h4`/`h5` pervedamos (`h4`→`h3`, `h5`→`h1`).
  Klientinio turinio migracijoje nebus.
- Admin: `TemplateCard.tsx` perrašoma į paspaudžiamą kortelę su
  thumbnail `iframe` (token gaunamas per esamą `createHomePreviewLink`);
  naujas `HomeTemplateSheet.tsx` apgaubia esamus `HomeTextEditor` /
  `HomeMediaEditor` / `SaveButton`; `HomeAdminPage.tsx` sutrumpėja iki
  galerijos + panelės (visi failai < 200 eilučių).
- `src/messages/en.json` / `de.json` — pavadinimai „Home V1/V2/V3“,
  redagavimo panelės tekstai, ištrintų versijų keys pašalinami; paleidžiamas
  `bun run check:i18n`.
- SEO: `JSON-LD` sudedamas per esamą `src/lib/seo/build-head.ts` kelią Home
  route'e, iš to paties resolved copy bago (nulinis klientinis tekstas kode).
- Spalvos, šriftai, kampai — tik per esamus tokenus; admin ir svetainė lieka
  vienoje dizaino sistemoje.

## Ko nekeičiu

- Gyvo V1 dizaino išvaizda, mygtukai, hero kompozicija.
- Skelbimų kortelės, Listings valdymas, teisių logika.
- Preview saugumo mechanizmas (HMAC token) — panaudojamas kaip yra.
