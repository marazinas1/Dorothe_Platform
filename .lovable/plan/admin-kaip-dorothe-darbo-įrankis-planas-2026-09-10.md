# Admin kaip Dorothe darbo įrankis — planas

## Ką patikrinau (faktai)

- Svetainės meniu **jau turi** Kontaktus ir Ratgeber (straipsnius) — naujų puslapių kurti nereikia.
- Skelbimai: 5 active, 2 sold, 1 rented, 2 draft (Schwalbach — trūksta „Energieträger"; Nonnweiler — trūksta „Endenergiewert").
- Straipsnių dar nėra nė vieno; atsiliepimų lentelė tuščia (svetainė rodo pavyzdinį tekstą).
- Logo ir favicon jau ateina iš nustatymų (`site_settings`), bet įvedami **kaip URL tekstas** — nėra failo įkėlimo, todėl jų realiai patogiai pakeisti negalima.
- Home kortelės rodomos pagal `is_featured` arba `coming_soon` — nėra ribos „3" ir nėra žymėjimo skelbimų sąraše.
- Atsiliepimuose jau yra `published` ir `show_on_home`.
- Šiuo metu admin meniu „The website" turi 8 punktus (Content, Listings, Selling, Inheritance, About, Contact, Testimonials, Posts) — būtent tai ir daro meniu netvarkingą.
- Nustatymai dabar turi tabus: general, branding, contact, legal, modules, analytics. Branding leidžia klientui keisti spalvas, šriftus, kampų apvalinimą, mygtukų stilių.
- Lumidenta kalendorius: `working_hours`, `schedule_exceptions`, `appointments` + mėnesio tinklelis; statusai laukia/patvirtinta/atvyko/neatvyko/atšaukta. Tinka perkelti apžiūroms.

## Etapai

### 1 etapas — meniu pertvarka pagal kasdienį darbą
Nauja struktūra (tekstai išeina iš pirmo plano):

```text
KASDIEN
  Apžvalga
  Skelbimai
  Užklausos      (su neperskaitytų burbulu)
  Kalendorius    (5 etapas)
  Straipsniai
  Atsiliepimai
  Analitika

NUSTATYMAI
  Nustatymai     (viskas kita, tabuose)
```

Skelbimai iškart antri; visi svetainės tekstų puslapiai išnyksta iš meniu.

### 2 etapas — Nustatymai su tabais (tekstai persikelia čia)
Vieni Nustatymai, tabai tokia eile:

```text
Bendra      logotipas (įkėlimas), favicon (įkėlimas), pavadinimas, kalbos
Kontaktai   telefonas, el. paštas, adresas, darbo laikas, socialiniai
Tekstai     antriniai tabai pagal svetainės meniu:
              Pradžia | Pardavimas | Palikimas | Apie mane | Kontaktai
Teisė       Impressum, privatumas, taisyklės
Moduliai    kas įjungta / išjungta (tik developeriui)
```

- Logotipas ir favicon — tikras failo įkėlimas, iškart matomas ir viešoje svetainėje, ir admin viršuje.
- „Tekstai" tabe rodomi tie patys tekstai, kurie dabar yra svetainėje, su EN/DE ir gyva peržiūra — kaip dabar Home redaktorius, tik po Nustatymais.

### 3 etapas — spalvų ir techninių nustatymų išėmimas
- Iš admin išimame: spalvas, šriftus, kampų apvalinimą, mygtukų stilių, spalvų peržiūrą.
- Reikšmės nesikeičia — jos toliau lieka `site_settings` ir jas keisiu aš kode. Klientei tiesiog nebeliks šių laukų.
- Rezultatas: klientė nebegali netyčia sugadinti svetainės išvaizdos.

### 4 etapas — mygtukų ir vizualo suvienodinimas admin dalyje
- Vienas standartas: juodas/neutralus pagrindinis, švarus outline, ghost antriniams. Gintarinė lieka tik viešoje svetainėje.
- Vienodos antraštės, kortelės, tarpai, tuščios būsenos, „Išsaugota" pranešimai, visur „Peržiūrėti puslapį".

### 5 etapas — skelbimų statusai ir home atranka
- Statuso pakeitimas vienu paspaudimu tiesiai iš skelbimų sąrašo: Aktyvus → Rezervuotas → Parduota / Išnuomota. Svetainėje objektas iškart peršoka į kitą kategoriją (kaip OCDG).
- Skelbimų sąraše žvaigždutė „Rodyti pradžios puslapyje", su skaitliuku „3 iš 3".
- Jei pažymėta mažiau nei 3 — automatiškai užpildoma naujausiais aktyviais, kad pradžia niekada neatrodytų tuščia.
- Atsiliepimuose ta pati logika: visi eina į „Apie mane", pažymėti 3 — į pradžią.

### 6 etapas — kalendorius apžiūroms
- Mėnesio tinklelis + dienos sąrašas, kaip Lumidentoje.
- Įrašas: data ir laikas, tipas (apžiūra / susitikimas / asmeninis), objektas (nebūtinas), kliento vardas, telefonas, pastaba, statusas.
- Iš užklausos galima iškart sukurti apžiūrą — užklausa ir apžiūra susijungia.
- Darbo laiko nustatymo nekuriam (nėra viešo rezervavimo) — tai tik Dorothes vidinis kalendorius.

### 7 etapas — testinis straipsnis (draft)
Vienas trumpas EN/DE straipsnis su viršelio nuotrauka, paliktas **draft** — Dorothe pati redaguos, paspaus publikuoti ir realiu laiku pamatys svetainėje.

### 8 etapas — Apžvalga kaip darbų sąrašas
Naujos užklausos, artimiausios apžiūros, skelbimai be nuotraukų, neužbaigti draft'ai, seniai neatnaujinti aktyvūs — kiekvienas su mygtuku „Tvarkyti".

### 9 etapas — užbaigimas
- Du draft skelbimai (trūkstami energijos laukai).
- Saugumo įspėjimai.
- Visų puslapių patikra EN/DE + telefone.
- Kvietimas Dorothei + pasveikinimo laiškas EN/DE.

## Mano įžvalgos

Brokerė kasdien daro tris dalykus: atsako į užklausą, atnaujina skelbimą, pakeičia statusą. Ketvirtas — susitarti dėl apžiūros. Tekstus ji perrašys vieną kartą ir daugiau prie jų negrįš — todėl tavo sprendimas juos kišti po Nustatymais yra teisingas ir tai atitinka geriausią praktiką: kasdieniai veiksmai priekyje, vienkartinė konfigūracija gilyje.

Spalvų atėmimas taip pat teisingas — tai vienintelis nustatymas, kuriuo klientas gali sugadinti visą svetainę ir net nesuprasti, kas atsitiko.

Straipsniams Vokietijoje geriausiai veikia praktiniai vietiniai tekstai („Kiek kainuoja notaras Saarlande", „Kaip pasidalinti paveldėtą namą") — jie atveda pardavėjus, ne smalsuolius.

## Techninė dalis

- Meniu: `AdminSidebar` grupės perrašomos; `pages/$page` maršrutai lieka veikti, bet pasiekiami per Nustatymų „Tekstai" tabą.
- Nustatymai: `SettingsTabs` → `general | contact | texts | legal | modules`; `texts` turi antrinį puslapio pasirinkimą ir naudoja esamą `PageEditorWorkspace` / `HomeEditorWorkspace`.
- `BrandingTab` išimamas; spalvų/šriftų/radiuso reikšmės lieka DB ir `src/lib/theme/tokens.ts`.
- Logo/favicon įkėlimas per `site-assets` bucket + `processImageFile`, kelias `site-assets/brand/...`.
- Kalendoriui nauja migracija: `appointments` (+ pasirinktinis `listing_id`, `inquiry_id`), RLS per `is_staff()` / `current_user_has_permission()`, grants kaip visur.
- Home atranka: `is_featured` + serverio pusėje užpildymas iki 3.
- Failai po 200 eilučių; logika `/lib`, `/components/brand` tik atvaizduoja; jokių hardcoded spalvų.

## Pradedam nuo

**1 + 2 + 3 etapo** viena banga (meniu, Nustatymai su tabais, spalvų išėmimas) — po jos iškart pamatysi tvarkingą admin. Tada 4, 5, 6, 7. Po kiekvieno patikrinam.
