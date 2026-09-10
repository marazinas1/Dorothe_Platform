# Numatytieji tekstai: užrakinimas ir aiškesnis vaizdas

## Kur dabar esame (patikrinta)

- Užrakintų numatytųjų tekstų dar **nėra nė vieno**: `site_settings.home_defaults` yra tuščias, o `page_content.defaults` buvo ką tik pridėtas.
- Todėl pilkas tekstas, kurį matai lauke, kol kas atkeliauja iš senų `site_settings` stulpelių arba iš vertimų failų — ne iš „užrakinto“ numatytojo.
- Taigi taip: dabartinę svetainės formuluotę reikia vieną kartą užrakinti kaip numatytąją. Kai Dorothe parašo kitą tekstą, tas tekstas yra tik jos pataisymas ant viršaus — numatytasis nepasikeičia, kol tu jo neužrakini.

## Ką padarysime

### 1. „Užrakinti visus dabartinius tekstus“ vienu paspaudimu (tik developeriui)

- Home redaktoriuje ir kiekvieno puslapio tekstų redaktoriuje viršuje atsiranda developerio mygtukas „Lock all current wording as default“.
- Jis paima tai, ką puslapis šiuo metu rodo (pataisymas, jei yra, kitu atveju esamas tekstas), ir įrašo kaip numatytąjį visiems tos kalbos laukams iš karto. Pataisymai po to išvalomi, tekstas svetainėje nepasikeičia.
- Šalia — trumpas skaitiklis: „12 of 14 fields locked“, kad matytum, kas dar neužrakinta.

### 2. Spynelė rodo tikrą būseną

- Kiekvieno lauko spynelė turi dvi būsenas: **atrakinta** (numatytasis dar neužfiksuotas) ir **užrakinta** (numatytasis įrašytas).
- Kai Dorothe parašo savo tekstą, laukas pažymimas „Edited“ — spynelė nepasikeičia, nes numatytasis lieka toks, kokį užrakinai tu. Tu paspaudi spynelę tik jei nori jos tekstą padaryti nauju numatytuoju.

### 3. Numatytasis tekstas atrodo kaip tekstas, o ne kaip laukas

Pagal įprastą praktiką numatytoji formuluotė nebekabės pačiame lauke (dabar atrodo, tarsi ją būtų galima taisyti):

- Numatytasis tekstas rodomas **virš** lauko, blankiu smulkesniu šriftu, su etikete „Currently shown“ ir spynelės ikona.
- Pats laukas lieka tuščias su neutraliu kvietimu „Write your own wording…“.
- Kai kas nors įrašyta, blankus numatytasis lieka matomas apačioje kaip „Default: …“, kad būtų aišku, prie ko grąžins „Reset“.
- Ilgi numatytieji tekstai sutraukiami iki kelių eilučių su „Show more“.

## Techninė dalis

- `src/components/admin/ui/DefaultTextField.tsx` — numatytasis persikelia iš `placeholder` į atskirą blankią eilutę; pridedama `isLocked`, „Edited“ žymė, sutraukimas.
- `src/lib/home/use-home-admin.ts` ir `src/lib/pages/use-page-admin.ts` — pridedami `isLocked(key)` ir `lockAllDefaults()`, kurie sudeda visų laukų reikšmes ir išsaugo vienu `saveHomeDefaults` / `savePageDefaults` kvietimu (serverio pusėje developerio patikra jau yra).
- `HomeTextEditor` / `PageTextEditor` — antraštėje mygtukas ir skaitiklis, matomi tik developeriui.
- Nauji EN/DE tekstai `src/messages`; be naujų migracijų.
