# Prieš atidavimą Dorothei: tekstai, Properties puslapis, UI/UX auditas

## 1. Kas tie „[Placeholder]“

Selling puslapyje yra 13 laikinų tekstų, kurie viešai rodomi su žymomis
`[Placeholder]` / `[Platzhalter]`: sekcijų antraštės „What she brings“,
„What it costs“, formos įvadas, „Already sold“ blokas ir 4 paslaugų punktai.
Jie buvo įrašyti kaip griaučiai ir liko neperrašyti.

Sutvarkymas: parašau realius profesionalius EN + DE tekstus tuo pačiu stiliumi,
kaip likusi Selling dalis (aštuoni žingsniai). Komisija formuluojama neutraliai
(„provizija sutariama individualiai, aiškiai raštu prieš mandatą“) — be procento,
kol Dorothe nepatvirtins. Tekstai lieka redaguojami per Settings → Page texts.

Taip pat: 3 atsiliepimai vis dar turi „Lorem ipsum“ fallback tekstą (rodomas,
kol `testimonials` tabelė tuščia). Perrašau į normalius neutralius atsiliepimus,
kad niekas nematytų lorem ipsum; kai Dorothe įrašys tikrus — fallback išnyksta.

## 2. Properties puslapis (dabar rodo tik 5 objektus)

Priežastis: puslapis užklausia tik `active` + `coming_soon` statusus, todėl
parduoti / išnuomoti objektai nerodomi, o filtruose nėra statuso pasirinkimo.

Padarysiu:
- Statuso chip'ai virš tinklelės: **Available** (numatyta) / **Sold & rented** / **All**,
  URL parametras `status`, kad nuoroda būtų dalinama, plius kiekio skaitiklis.
- Parduoti objektai rodomi toje pačioje tinklelėje su SOLD / RENTED ženkleliu
  (ta pati kortelė kaip visur), naujausi pirmi.
- `/verkauft` archyvas lieka kaip yra ir gauna nuorodą iš chip'ų.
- Puslapiavimas ir tušti rezultatai veikia su visais chip'ais.

## 3. Žemėlapis

Dabar žemėlapis yra po nematomu tekstiniu perjungikliu „Show map (n)“ — lengva
nepastebėti.

Padarysiu pasaulinį standartą (ImmoScout / Zillow):
- Segmentuotas perjungiklis **List / Map** filtrų juostos dešinėje.
- List numatytai (geriau SEO ir greitis), Map — pilno pločio žemėlapis su
  spustelėjamais taškais ir kortelės popup'u.
- Mobiliajame — tas pats perjungiklis, žemėlapis per visą ekrano plotį.
- Ratukas nezoomina (kaip Contact puslapyje), zoom + / − mygtukais, plius
  „Reset view“ į regiono vaizdą.
- Objektai be koordinačių (hidden precision) tiesiog nepatenka į žemėlapį.

## 4. Viso UI/UX + tekstų auditas (EN ir DE)

Atlieku sisteminę patikrą ir sutvarkau tai, kas randama:
- Visi vieši puslapiai EN ir DE: Home, Properties, objekto detalė, Selling,
  Inheritance, About, Contact, Sold, Advice + straipsnis, Impressum,
  Datenschutz, AGB — antraštės, meta, CTA, tuščios būsenos.
- Trūkstami / nesutampantys vertimai, likę angliški tekstai DE versijoje,
  neteisingi kabučių ir brūkšnių stiliai (DE „…“, EN “…”).
- Vienodi mygtukai ir nuorodų stiliai visur (viena mygtuko sistema, vienodi
  „→“ nuorodų variantai), vienodi sekcijų tarpai.
- Vienodi kortelių tinkleliai ir vienodi antgalvių formatai visuose sąrašuose.
- Prieinamumas: `label`/`id` sąsajos formose ir kalendoriuje, alt tekstai,
  fokuso rėmeliai, mygtukų `aria-label`.
- Mobilus vaizdas: navigacijos šuo, karuselių slinkimas, filtrai, žemėlapis.
- 404 / tuščios būsenos tekstai abiem kalbomis.

Radinius, kurių negaliu nuspręsti pats (pvz. reali komisija, tikri
atsiliepimai, dviejų objektų energijos duomenys), surašau tau atskirai —
jų neišradinėju.

## Techninė dalis

- `src/messages/en.json`, `de.json` — Selling copy, testimonial fallback,
  audito tekstų taisymai; `check:i18n` turi būti žalias.
- `src/lib/listings/search-schema.ts` — naujas `status` ir `view` param'ai
  su default'ais ir canonical URL logika.
- `src/lib/listings/queries.functions.ts` — statuso žemėlapis chip'ams
  (`available` → active/coming_soon, `archive` → sold/rented, `all` → visi).
- `src/routes/$locale.immobilien.index.tsx` — chip'ai, List/Map perjungiklis,
  rezultatų sekcija.
- `src/components/public/FiltersBar.tsx` — statuso chip'ai + view toggle.
- `src/components/brand/ListingsMap.tsx`, `MapCanvas.tsx` — pilno pločio
  režimas, reset, be wheel-zoom.
- Patikra: `check:i18n`, TypeScript, build, plus Playwright peržiūra EN/DE
  desktop ir mobile.
