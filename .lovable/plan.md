# Viešos svetainės Deerva standartų auditas ir sutvarkymas

## Tikslas

Sutvarkyti visą viešą svetainę kaip vieną nuoseklų brokerių platformos etaloną pagal Deerva, WCAG 2.2 AA, NN/g, Baymard ir Core Web Vitals principus. Išlaikomi gyvi skelbimų duomenys, administruojamas turinys ir patvirtinta HTML vizualinė kryptis. Admin dalis bei verslo logika šiame etape nekeičiami, išskyrus atvejus, kai viešas puslapis rodo neegzistuojantį ar neadministruojamą turinį.

## 1. CTA ir informacijos architektūra

- Pašalinti vertinimo CTA mygtuką iš footerio. Footeris lieka navigacijos, kontaktų, teisinių nuorodų, aptarnaujamų vietovių ir Deerva žymos zona.
- Pašalinti footeryje dubliuojamas „About“ ir „Contact“ nuorodas; kiekviena paskirtis rodoma vienoje aiškioje vietoje.
- Kiekvienam puslapiui nustatyti vieną kontekstinį pagrindinį veiksmą:
  - Home — turto vertinimas;
  - Properties — paieška / paieškos užklausa;
  - Listing — užklausa dėl konkretaus objekto;
  - Selling — pardavėjo forma;
  - Inheritance — kontekstinė konsultacijos užklausa;
  - About — kontaktinis veiksmas;
  - Contact — žinutės forma;
  - Guides / Article — grįžimas į susijusią paslaugą arba konsultaciją tik tada, kai tai nėra dubliuojama.
- Iš „Selling“ pašalinti bendrą CTA juostą po pilnos formos; forma turi būti aiški puslapio pabaiga.
- Kitų puslapių bendras CTA juostas pakeisti tik kontekstiniais užbaigimais, o ne vienodai kartojamu bloku.
- Nebevesti vidinių nuorodų per `/immobilienbewertung` peradresavimą. Navigacijoje panaikinti „Selling“ ir „Valuation“ dubliavimą arba vertinimą vesti tiesiai į aiškiai pažymėtą pardavimo puslapio vertinimo dalį.
- Patikrinti, kad viename matomame regione būtų tik vienas primary CTA, o alternatyvos būtų secondary, outline arba link.

## 2. Bendra dizaino sistema ir sąveikos

- Visus viešus mygtukus, nuorodų-mygtukų variantus, perjungiklius, galerijos ir žemėlapio veiksmus pervesti į bendrus viešos dizaino sistemos komponentus.
- Pašalinti rankomis sukonstruotus mygtukų stilius footeryje, katalogo vaizdo perjungikliuose, filtrų perjungikliuose, dalinimosi ir žemėlapio valdikliuose.
- Suvienodinti eyebrow, antraščių, kortelių meta informacijos ir smulkaus teksto balsus; komponentuose nebekartoti savų šrifto dydžių ir tracking reikšmių, kai tam yra bendras semantinis stilius.
- Užtikrinti 44×44 px paspaudimo zonas, ryškų `focus-visible`, aktyvią navigacijos būseną, klaviatūros valdymą ir aiškius disabled/loading statusus.
- Patikrinti mobilią navigaciją: uždarymas su Escape, focus grąžinimas, focus trap, fono slinkimo užrakinimas ir tiesioginis kontaktinis veiksmas.
- Išlaikyti Urbanist, Noir semantinius tokenus, mažą radius ir patvirtintą HTML kompoziciją; komponentuose nenaudoti naujų hardcoded spalvų ar temų.

## 3. Formų standartas

- Visas viešas formas padaryti vieno stulpelio ten, kur keli stulpeliai gali pakeisti skaitymo seką, ypač mobiliuose įrenginiuose.
- Pridėti teisingus `autocomplete`, `type`, `inputmode` ir prasmingus laukų pavadinimus (`name`, `email`, `tel`, adresas ir kt.).
- Neprivalomus laukus pažymėti žodžiu „Optional“, o ne palikti neaiškius.
- Įdiegti inline validaciją po lauko palikimo, aiškiai parašant, kaip klaidą ištaisyti; įvestos reikšmės po klaidos neprarandamos.
- Visoms formoms rodyti stabilaus pločio loading būseną, `aria-live` sėkmės/klaidos pranešimus ir aiškų retry kelią.
- Kontaktų formai pridėti tą pačią privatumo sutikimo kontrolę ir įrašo metaduomenis, kuriuos jau naudoja kitos užklausų formos.
- Home vertinimo forma negali būti vizualiai aktyvi, bet nieko nedaryti: ji turi arba realiai tęsti vertinimo eigą su įvestais duomenimis, arba būti pakeista sąžiningu CTA.

## 4. Turinys, privatumas ir pasitikėjimas

- Pašalinti išgalvotą darbo laikų fallback. Darbo laikai rodomi tik tada, kai jie realiai įvesti; kitu atveju visas blokas nerodomas.
- Suvienodinti žemėlapių privatumą: ir objekto, ir biuro žemėlapiai krauna trečiosios šalies žemėlapį tik po aiškaus lankytojo veiksmo, prieš tai nurodant teikėją.
- Nepridėti slapukų; išlaikyti esamą cookieless analitiką ir botų/admin atmetimą.
- Patikrinti, kad kontaktai, vietovės, nuotraukos, atsiliepimai, straipsniai ir skelbimai būtų rodomi tik iš jų administruojamo šaltinio, be kode paliktų kliento faktų ar demonstracinių teiginių.
- Tuščioms būsenoms pateikti aiškų kitą veiksmą, bet ne kurti fiktyvų social proof ar informaciją.

## 5. Prieinamumas, semantika ir SEO

- Kiekviename turinio puslapyje patikrinti tik vieną `h1`, nuoseklią `h2–h4` hierarchiją, `header/nav/main/footer` landmarks ir prasmingus paveikslų `alt`.
- Patikrinti teksto, input, ikonų ir focus kontrastą realiame fone pagal WCAG 2.2 AA.
- `prefers-reduced-motion` režime išjungti transform/reveal/zoom judesius, paliekant tik būtinus spalvų pokyčius.
- Užtikrinti, kad fiksuotas meniu neuždengtų focus ar anchor tikslų.
- Patikrinti kiekvieno tikro viešo turinio maršruto unikalų title, description, Open Graph ir Twitter metaduomenis; peradresavimo maršrutai neturi apsimesti atskirais turinio puslapiais.
- Patikrinti dvikalbystę, aktyvios kalbos būseną ir kalbos atributo atitikimą realiam puslapiui.

## 6. Greitis ir stabilumas

- Patikrinti pagrindinių nuotraukų dydžius, `srcset/sizes`, LCP prioriteto naudojimą ir lazy loading žemiau pirmo ekrano.
- Pašalinti išdėstymo šuolius dėl meniu duomenų, paveikslų, formų statusų ir dinamiškų blokų.
- Sumažinti nereikalingus klientinius užklausimus bendrame meniu ir neįkelti žemėlapių bibliotekos iki sutikimo.
- Patikrinti, kad SSR turinys nesiskirtų nuo hidratuoto vaizdo ir nebūtų naršyklės, tinklo ar hydration klaidų.

## 7. Puslapis po puslapio ir HTML etalonas

- Auditą bei taisymus vykdyti seka: bendras header/footer → Home → Properties → Listing → Sold → Selling → Inheritance → About → Contact → Guides/Article → legal.
- Kiekviename puslapyje išlaikyti patvirtinto HTML struktūrą ir vizualinį ritmą, bet taisyti etalono vietas, kurios prieštarauja WCAG, NN/g, Baymard arba realių duomenų principui.
- Užbaigti likusias roadmap HTML-parity bangas ant jau sutvarkytos bendros CTA, formų ir prieinamumo sistemos, kad vėliau nereikėtų taisyti tų pačių problemų kelis kartus.

## Techninis vykdymas ir priėmimas

- Keitimai skaidomi į mažas bangas; po kiekvienos tikrinami tipai, EN/DE raktai ir naujausias preview build įrašas.
- Playwright patikra: visi vieši maršrutai 1280 px ir 390 px pločiu, klaviatūra, Escape, focus, sumažintas judesys, formų klaida/sėkmė, žemėlapio sutikimas ir jokios console/runtime klaidos.
- CTA inventorius po pakeitimų turi parodyti: nėra footer CTA, nėra aklų peradresuojančių nuorodų, nėra dviejų primary veiksmų tame pačiame regione.
- Formų priėmimas: išsaugotos reikšmės po klaidos, teisinga mobili klaviatūra/autofill, aiški validacija, sutikimas ir stabilus submit mygtukas.
- Galutinis patikrinimas apima build, i18n, route metadata, desktop/mobile ekrano kopijas ir roadmap likučių peržiūrą.

## Už šio etapo ribų

- Admin dizaino pertvarkymas, teisių/RLS pakeitimai ir nauja verslo logika.
- Tikrų Dorothe darbo laikų, naujų kontaktų ar kitų nepatvirtintų faktų sugalvojimas.
- Publikavimas — atliekamas tik atskirai paprašius.