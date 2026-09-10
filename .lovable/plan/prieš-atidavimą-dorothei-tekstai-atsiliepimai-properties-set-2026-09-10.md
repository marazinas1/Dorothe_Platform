# Prieš atidavimą Dorothei: tekstai, atsiliepimai, Properties, Settings supaprastinimas

## 1. Kas tie „[Placeholder]“

Selling puslapyje 13 laikinų tekstų rodomi viešai su žymomis
`[Placeholder]` / `[Platzhalter]`: „What she brings“, „What it costs“, formos
įvadas, „Already sold“ blokas ir 4 paslaugų punktai. Jie buvo įrašyti kaip
griaučiai ir liko neperrašyti.

Parašau realius EN + DE tekstus tuo pačiu stiliumi kaip likusi Selling dalis.
Provizija formuluojama neutraliai („sutariama individualiai, raštu prieš
mandatą“) — be procento, kol Dorothe nepatvirtins.

## 2. Atsiliepimai — iš kur jie ateina (svarbu)

Dabar 3 lorem ipsum atsiliepimai NEATEINA iš duomenų bazės: `testimonials`
tabelė tuščia, todėl viešoji svetainė rodo tekstinį fallback iš vertimų failo.
Todėl admin dalyje rašo „No testimonials yet“ — Dorothe jų nemato ir negali
pataisyti.

Sutvarkymas: įrašau 3 tikras eiles į `testimonials` (EN + DE, tie patys lorem
ipsum tekstai, `published = true`, `show_on_home = true`). Tada:
- Admin → Testimonials rodo 3 įrašus, kuriuos ji redaguoja ir iš karto mato
  svetainėje;
- fallback iš vertimų nebenaudojamas, kai eilės yra (paliekamas tik tam
  atvejui, jei viską ištrintų);
- `home_content` testi1/2/3 laukai išimami iš Home page redaktoriaus, kad
  nebūtų dviejų vietų tam pačiam turiniui.

## 3. Properties puslapis (dabar rodo tik 5 objektus)

Priežastis: užklausiami tik `active` + `coming_soon` statusai, filtruose nėra
statuso.

- Statuso chip'ai: **Available** (numatyta) / **Sold & rented** / **All**,
  URL parametras, kiekio skaitiklis.
- Parduoti/išnuomoti rodomi toje pačioje tinklelėje su SOLD / RENTED ženkleliu.
- `/verkauft` archyvas lieka ir gauna nuorodą iš chip'ų.

## 4. Žemėlapis

Vietoje beveik nepastebimo teksto „Show map“ — segmentuotas **List / Map**
perjungiklis filtrų juostoje (kaip ImmoScout / Zillow). List numatytai, Map —
pilnas plotis, ratukas nezoomina, zoom + / − mygtukais, „Reset view“ mygtukas.
Taip pat sutvarkau žemėlapio plytelių tiekėją, kad nebeliktų „API KEY
REQUIRED“ užrašo (dabar matosi ir admin dalyje).

## 5. Settings: ką reiškia kiekvienas laukas ir ką siūlau

| Laukas | Ką daro | Sprendimas |
| --- | --- | --- |
| Site name | Svetainės pavadinimas antraštėse ir Google rezultatuose | Lieka |
| Legal name | Juridinis vardas Impressum ir Google struktūrizuotuose duomenyse | Lieka |
| Country | Nustato, kokių Energieausweis laukų reikalauja sistema (DE) ir adreso šalį | Paslėpti — fiksuota DE, developerio dalykas |
| Default locale | Kuri kalba yra pagrindinė (URL be prefikso, atsarginis tekstas) | Paslėpti; kai atiduosiu, perstatau į DE |
| Enabled locales | Kokios kalbos veikia (EN, DE) | Paslėpti |
| Service region (en/de) | Regiono vardas, įterpiamas į tekstus („{{region}}“ → Saarland) | Lieka, bet perkelta prie tekstų ir pavadinta „Region name“ |
| Currency | Kokia valiuta rodomos kainos (EUR) | Paslėpti |
| Area unit | m² ar sq ft | Paslėpti |
| Logo, dark logo, favicon, OG image | Paveikslai visoje svetainėje ir admin dalyje | Lieka, viršuje |
| Contact email / phone / WhatsApp | Rodomi kontaktuose, CTA blokuose, formose | Lieka |
| Address + Latitude/Longitude + žemėlapio smeigtukė | Biuro adresas ir taškas žemėlapyje | Lieka (smeigtukė kaip dabar) |
| Opening hours (JSON) | Darbo laikas | Perrašau į paprastas savaitės dienų eiles: nuo / iki + „Uždaryta“ |
| Social links (JSON) | Facebook / LinkedIn nuorodos | Perrašau į atskirus laukus: Facebook, LinkedIn, Instagram |

Struktūra po pertvarkos — tik trys skirtukai:
1. **Business** (General + Contact sujungta): logotipai ir favicon, pavadinimas,
   kontaktai, adresas su žemėlapiu, darbo laikas, socialiniai tinklai.
2. **Page texts** — tekstai pagal puslapius.
3. **Legal** — Impressum, privatumas, AGB.

**Modules skirtukas ištrinamas visiškai** — nerodomas nei Dorothei, nei
developeriui. Moduliai (nuoma, blogas, atsiliepimai, archyvas) lieka įjungti
duomenų bazėje; jei ką reikės išjungti, pakeisiu kode.

Techninius laukus (country, locales, currency, area unit) matys tik developeris;
Dorothei jų visai nebus.

## 6. Page texts — kad rodytų tai, kas tikrai svetainėje

Dabar redaktorius rodo numatytus tekstus pilkai kaip užuominas, o įrašytos
reikšmės tuščios — atrodo, tarsi tekstai nesutampa su svetaine. Padarysiu:
- Numatytas tekstas įkeliamas į laukus kaip tikra reikšmė, todėl matai lygiai
  tai, ką rodo svetainė (kaip Halliday projekte).
- Lieka tik svarbiausi laukai: antraštė, paantraštė, pagrindinės sekcijų
  antraštės ir įžanginiai sakiniai. Antriniai ir techniniai laukai išimami.
- Kiekvienas laukas ir kiekvienas puslapis gauna **„Reset to default“** —
  matomą tik developeriui, kad grąžintų pradinį tekstą.

## 7. Viso UI/UX + tekstų auditas (EN ir DE)

Visi vieši puslapiai ir admin ekranai: trūkstami/nepervesti tekstai, likusios
angliškos vietos DE versijoje, vienodi mygtukai ir nuorodos, vienodi tarpai ir
sekcijų antgalviai, prieinamumas (label/id, alt, fokusas), mobilus vaizdas,
tuščios būsenos ir 404. Radinius, kurių negaliu nuspręsti pats (reali provizija,
tikri atsiliepimai, dviejų objektų energijos duomenys), surašau atskirai.

## Techninė dalis

- `src/messages/en.json`, `de.json` — Selling copy + audito taisymai; `check:i18n` žalias.
- `run_sql` — 3 `testimonials` eilės (EN/DE, published, show_on_home).
- `src/lib/testimonials/fallback.ts` + Home fields — fallback tik kai tabelė tuščia; testi* laukai išimti.
- `src/lib/listings/search-schema.ts`, `queries.functions.ts` — `status` ir `view` param'ai + statusų žemėlapis.
- `src/routes/$locale.immobilien.index.tsx`, `FiltersBar.tsx`, `ListingsMap.tsx`, `MapCanvas.tsx` — chip'ai, List/Map, plytelių tiekėjas.
- Settings: `GeneralTab` + `ContactTab` → vienas `BusinessTab`; nauji `OpeningHoursField`, `SocialLinksField`; developer-only blokas; `SettingsTabs` atnaujintas.
- `src/lib/pages/*`, `PageTextEditor` — numatytos reikšmės kaip realios, trumpesnis laukų sąrašas, `Reset to default` developeriui.
- Patikra: `check:i18n`, TypeScript, build, Playwright EN/DE desktop + mobile.
