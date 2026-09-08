# Vienas objektų kortelės standartas visoje svetainėje

## Problema

Šiandien turime tris skirtingas kortelių išvaizdas: `direct` variantą home page,
„pilną" variantą /immobilien ir dar atskirą admin tile. Todėl tas pats objektas
atrodo skirtingai skirtingose vietose, o pridėjus naują klientą (remix) reikia
prisiminti, kurią versiją tvarkyti.

Tikslas: **viena kortelė, vienas standartas** — informatyvi kaip /immobilien,
tokia pati aiški ir tyli kaip home page.

## Kaip kortelė turi atrodyti (Active listing)

```text
┌─────────────────────────────────────┐
│  FOTO 3:2, tiesūs kampai            │
│  ▸ carousel: swipe / rodyklės / dots│
│  ▸ apačioje kairėje statuso badge   │
│    (For sale / Reserved / New)      │
└─────────────────────────────────────┘
  SCHMELZ                     FOR SALE   ← eyebrow, uppercase, tracking
  ⛶ 159 m²  ▦ 5  🛏 3  🛁 1   ( D )     ← ikonos + skaičiai + energy class
  A well-kept semi-detached house       ← Fraunces, 2 eilutės max
  of 159 m² in the centre of…
  Schmelz, the Saarland                 ← lokacija visada, pilna
  ─────────────────────────────────────
  Purchase price  €249,000              ← pinned apačioje
```

Sprendimai, kurie taikomi visur:

- **Foto tiesiais kampais** (kaip home page dabar), 3:2 formatas, be rėmelio
  aplink patį vaizdą.
- **Kortelė be sunkios kortelės**: plonas 1px border, 4px suapvalinimas
  (kaip mygtukai), baltas fonas, be shadow. Hover — tik lengvas foto zoom ir
  antraštės pritemimas.
- **Lokacija visada matoma** (miestas + regionas iš settings).
- **Features su ikonėlėmis visada** — plotas, kambariai, miegamieji, vonios,
  energy class raidė. Trūkstamos reikšmės tiesiog nerodomos, bet eilutės
  aukštis rezervuotas, kad kortelės grid'e baigtųsi vienodai.
- **Kaina su etikete** („Purchase price" / „Rent"), tabular skaičiai.
- **Statuso badge** ant nuotraukos tik kai statusas nėra „paprastas pardavimas"
  (Reserved, Coming soon, New); kitu atveju statusas lieka eyebrow eilutėje.
- Visa kortelė — vienas paspaudžiamas plotas, vienas tab stop.

## Sold kortelė (kita kategorija, ta pati DNR)

Ta pati kortelė, tik: nuotrauka pritildyta (grayscale hover'yje atsigauna),
badge „Sold" + data, kainos eilutė pakeičiama į „Sold" (arba pasiektą kainą,
jei klientas įjungęs `show_sold_prices`). Jokios atskiros komponentės.

## Kur ji naudojama

| Vieta | Dabar | Po darbo |
|---|---|---|
| Home V1 „Selected properties" | `direct` variantas | standartinė kortelė, 3 vnt. |
| Home V2 / V3 | savi variantai | ta pati kortelė, 3 vnt. |
| Home „Recently sold" | mini thumbnail eilutė | sold kortelė, 3–4 vnt. |
| /immobilien | pilnas variantas | ta pati kortelė |
| /verkauft | pilnas variantas | sold kortelė |
| Related / Agent listings | pilnas variantas | ta pati kortelė |
| Admin listings grid | atskiras tile | ta pati vizuali kalba (foto, eyebrow, features, kaina) + admin valdymo eilutė apačioje |

Kiek objektų rodoma home page — ir toliau ateina iš admin (featured objektai),
ne iš kodo; V2/V3 naudos tą patį sąrašą, tik po 3.

## Techninė dalis

- `src/components/brand/ListingCard.tsx`: pašalinamas `appearance="direct"`
  atskiras render tree; lieka vienas markup ir `size` (`large` | `compact`)
  tik tankumui (kiek eilučių antraštės, ar rodomas aprašymas), plius
  `tone` (`active` | `closed`) sold logikai.
- `ListingCardCarousel.tsx`: `appearance` prop išimamas, media visada 3:2
  tiesiais kampais; statuso badge tampa `badge` prop.
- `ListingCardSpecs.tsx` ir `src/lib/listings/card-specs.ts` lieka vienintelis
  šaltinis, kurios features rodomos ir kokia tvarka — čia nieko nedubliuojam.
- Naujas `src/lib/listings/card-tone.ts`: iš `status` + settings nusprendžia
  badge, ar kaina rodoma, ar rodoma sold data. Komponentai statuso netikrina.
- `SoldStrip.tsx`, `HomeListings.tsx`, `FeaturedListings.tsx`,
  `RelatedListings.tsx`, `AgentListings.tsx` — nustoja perdavinėti
  `appearance`, tik `items` + `size`.
- Admin `ListingCardTile.tsx` perrašomas ant tų pačių tokenų ir
  `ListingCardSpecs`, kad pakeitus primary color pasikeistų abi pusės.
- Grid ritmas suvienodinamas per `src/lib/homepage/card-grid.ts`
  (3 stulpeliai desktop, 2 tablet, 1 mobile, vienodas gap).
- Failai lieka <200 eilučių; jokių naujų spalvų — tik esami semantic tokens.

## Ko šis darbas nekeičia

Objekto detalės puslapio (`/immobilien/$slug`) išdėstymo, filtrų juostos,
duomenų modelio ar admin formos logikos. Tik kortelės ir jų grid'ai.
