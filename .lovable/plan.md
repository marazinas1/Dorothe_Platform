# 5 fazė — paruošimas Dorothės testavimui

Tikslas: platforma tvarkinga ir „tikra“ tiek, kad Dorothe galėtų prisijungti,
kelti skelbimus, keisti statusus, rašyti straipsnį — be klaidų ir be pusiau
padarytų vietų. Laiško dar nerašom; jį rašysim tada, kai pasakysi.

## Ką radau dabartinėje būsenoje (patikrinta duomenų bazėje)

Svetainėje yra 9 objektai:

- 5 aktyvūs pardavimui, 2 parduoti, 2 juodraščiai (1 iš jų — nuoma).
- Ji sako: **4 pardavimui + 1 nuomai**. Taigi aktyvių yra vienu per daug ir
  nuomos objektas dar neopublikuotas.

Konkrečios problemos:

1. **„apartment-d680“ (Schwalbach, 549 000 €)** — testinis įrašas: pavadinimas
   įrašytas kaip „Schwalbach“, nėra aprašymo, `reference_code` = „test“, adresas
   be gatvės. Bet jis **publikuotas** ir matomas svetainėje.
2. **Saarbrücken / Vorstadtstraße (169 000 €)** — publikuotas, bet be vokiško
   pavadinimo, be kambarių ir be ploto. Vokiškoje svetainės versijoje jis
   atrodys tuščias.
3. Visiems kitiems objektams neįrašyta gatvė (tik pašto kodas ir miestas) —
   reikia nuspręsti, ar tai sąmoninga (adreso tikslumas) ar praleista.
4. **Moduliai išjungti**: nuoma (`rentals`), parduotų archyvas (`sold_archive`),
   atsiliepimai (`testimonials`), blogas (`blog`), vertinimas (`valuation`).
   Dėl to nuomos objektas ir parduoti objektai svetainėje nepasimatytų, o
   Dorothe nerastų nei blogo, nei atsiliepimų admin meniu.
5. **Dorothe dar neturi paskyros.** Yra tik du naudotojai: tu (developer) ir
   `marius@deerva.com` (editor).
6. **El. paštas**: `notify.dorothe.deerva.com` DNS jau patvirtintas, bet
   siuntimas įsijungs tik po publish — todėl prieš pakvietimą reikia
   paskelbti (publish) ir tada dar kartą patikrinti siuntėją.

## Žingsniai

### 1. Sutikrinti skelbimus su ImmoScout24

ImmoScout blokuoja paprastą užklausą (grąžina „Gleich geht's weiter“ patikrą —
jau patikrinau). Todėl: atidarysiu profilį tikru headless naršykliu su vokišku
profiliu ir nuskaitysiu jos objektų sąrašą (pavadinimas, miestas, kaina,
plotas, pardavimas/nuoma). Jei ir taip blokuos — pasakysiu ir paprašysiu tavęs
atsiųsti sąrašą (arba ekrano nuotrauką); toliau viskas tas pats.

Rezultatas: lentelė „ImmoScout ↔ svetainė“ su trimis stulpeliais: sutampa /
svetainėje per daug / svetainėje nėra.

### 2. Sutvarkyti skelbimų duomenis

- Testinį Schwalbach įrašą — arba ištraukti į tvarkingą tikrą objektą (jei jis
  yra jos sąraše), arba nuskelbti/ištrinti (jei tai tik testas). Sprendimą
  priimsim po 1 žingsnio.
- Saarbrücken/Vorstadtstraße — įrašyti vokišką pavadinimą ir aprašymą,
  kambarius, plotą; arba nuskelbti, jei jo jos sąraše nėra.
- Nuomos objektą (Altes Stadtbad) publikuoti, kai bus įjungtas nuomos modulis.
- Nonnweiler-Kastel juodraštį — palikti juodraščiu, jei jo sąraše nėra.

### 3. Įjungti modulius, kurie tikrai naudojami

`rentals`, `sold_archive`, `testimonials` (su pavyzdiniu tekstu, kaip
sutarėm — Dorothe pati pakeis tikrais klientų atsiliepimais), `blog`.
`valuation` ir `listing_documents` lieka išjungti, nes tų puslapių/logikos dar
nenaudojam.

Po įjungimo pereinu visus viešus puslapius abiem kalbomis ir patikrinu, kad
nauji blokai (nuoma, parduoti, atsiliepimai, Ratgeber) atrodo tvarkingai, o ne
kaip tušti rėmai.

### 4. Aš pats įkeliu vieną skelbimą per admin panelę

Kaip tikras naudotojas: nauja skelbimo forma → nuotraukų įkėlimas per
paveikslėlių tvarkyklę → publikavimo tikrinimo sąrašas → publish. Taip
pamatysiu tai, ką pamatys ji, ir surašysiu visas vietas, kur forma neaiški ar
lūžta. Rastas problemas ištaisom prieš pakvietimą.

### 5. Testavimo praėjimas (tai, ką darys Dorothe)

- Statuso keitimas: draft → active → reserved → sold, ir atgal.
- Straipsnio parašymas abiem kalbomis ir publikavimas.
- Užklausos formos išsiuntimas iš objekto puslapio → laiškas/įrašas admin
  dalyje su neperskaitytų burbulu.
- Puslapių redaktorius (Verkaufen, Erben, Über mich, Kontakt) — teksto
  pakeitimas ir peržiūra.
- Mobilus vaizdas pagrindiniams ekranams.

### 6. Publish + el. pašto patikra

Paskelbiu, tada dar kartą tikrinu el. pašto būseną ir išbandau pakvietimą į
`marius@deerva.com` — siuntėjas turi būti iš tavo domeno, nuoroda į
`dorothe.deerva.com`, ne į lovable.app.

### 7. Tik tada — pakvietimas Dorothei

Sukuriu jai owner paskyrą ir laukiu tavo signalo dėl laiško (rašysim angliškai
+ vokiškas vertimas, kaip visada).

## Techninės detalės

- Skelbimų taisymai daromi per admin UI arba server funkcijas — ne SQL
  INSERT'ais, kad suveiktų visi trigeriai, validacijos ir nuotraukų apdorojimas.
- Modulių įjungimas — `feature_flags` įrašų atnaujinimas (duomenys, ne schema).
- Kliento turinys niekur nekeliauja į migracijas ar komponentus.
- Kiekvieną žingsnį po eilės: padarom → parodau → patikrini → judam toliau.
