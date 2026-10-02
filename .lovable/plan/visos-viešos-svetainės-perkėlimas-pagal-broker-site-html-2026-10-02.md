# Visos viešos svetainės perkėlimas pagal `broker-site.html`

## Tikslas

Perkurti visą išorinę Dorothe svetainę pagal įkeltą HTML etaloną: vienoda Noir sistema, tokia pati puslapių anatomija, proporcijos, tarpai, tipografija, valdikliai ir mobilios būsenos. HTML yra vizualinis bei struktūrinis etalonas, bet ne tikrų klientų duomenų šaltinis.

Admin dalis, autentifikacija, teisės, RLS, skelbimų būsenų logika ir esami vieši URL šiame etape nekeičiami.

## Privalomos turinio ribos

1. **Tikri duomenys lieka duomenų bazėje:** skelbimai, parduoti objektai, jų nuotraukos, straipsniai, kontaktai, logotipai, portretas ir kita kliento informacija.
2. **HTML pavyzdiniai objektai neperkeliami.** Jokie Saarlouis, Heusweiler ar kiti maketo objektai ir kainos netampa tikrais įrašais.
3. **HTML atsiliepimai neperkeliami.** Atsiliepimų sekcijos rodomos tik tada, kai duomenų bazėje yra paskelbtų atsiliepimų; pagrindiniame puslapyje daugiausia trys, „Apie mane“ puslapyje visi paskelbti.
4. **Unsplash nuotraukos neperkeliamos.** Naudojamos tik jau valdomos puslapių, skelbimų, straipsnių ir profilio nuotraukos. Jei būtinoje vietoje nuotraukos nėra, naudojamas neutralus esamos sistemos fallback, ne išgalvotas vaizdas.
5. **Jau patvirtinti tekstai išsaugomi:** paveldėto turto puslapio tekstas, esama patvirtinta hero kryptis ir patvirtinti pardavimo žingsniai turi pirmenybę prieš HTML pavyzdžius.
6. **Nepatvirtinti faktai nepublikuojami:** pardavimo trukmė, antras biografijos sakinys, komisiniai procentai, darbo valandos ir HTML DUK atsakymai praleidžiami, kol Dorothe juos patvirtins.
7. **Nauji sąsajos ir sekcijų tekstai:** EN versija perkeliama pagal HTML į vertimus arba esamą puslapio turinio modelį; DE versija išverčiama profesionaliai, bet įtraukiama į atskirą Dorothės turinio peržiūros sąrašą.
8. **Jokių kliento duomenų komponentuose.** Kontaktai ir vardai visur skaitomi per `site_settings`; vienkartinės puslapio antraštės ir įvadai – per esamą `page_content`; pasikartojančios esybės – iš savo lentelių.

## Puslapių žemėlapis

HTML puslapiai perkeliami į esamus SSR maršrutus:

| HTML etalonas | Projekto puslapis |
|---|---|
| Home | `/$locale/` |
| Properties | `/$locale/immobilien` |
| Listing detail | `/$locale/immobilien/$slug` |
| Sold and let | `/$locale/verkauft` |
| Selling | `/$locale/verkaufen` |
| Valuation | `/$locale/immobilienbewertung` |
| Inherited property | `/$locale/erben` |
| About me | `/$locale/ueber-mich` |
| Contact | `/$locale/kontakt` |
| Guides | `/$locale/ratgeber` |
| Guide article | `/$locale/ratgeber/$slug` |

`Impressum`, `Datenschutz` ir `AGB` išlaiko savo teisinį turinį, bet gauna tą pačią antraštę, footer, tipografiją, plotį ir bendrą Noir ritmą.

## 1 etapas — tikslus bendras karkasas

- Užfiksuoti HTML dydžių sistemą semantiniais tokenais: 1280 px turinio plotis, 40/20 px kraštai, 120/72 px sekcijų ritmas, 2 px kampai, Urbanist, tipografijos mastelis, linijų aukščiai, šešėliai ir 1.75 px ikonų braižas.
- Atkurti 74 px antraštę: logotipas iš nustatymų, desktop navigacija, kalbos valdiklis, kontaktų CTA ir mobilus meniu.
- Mobilų meniu padaryti pilno ekrano, su 44 px paspaudimo zonomis, aiškiu focus ir fono slinkimo užrakinimu.
- Atkurti juodą keturių stulpelių footer: identitetas, navigacija, kontaktai, aptarnaujamos vietovės, teisinės nuorodos ir Deerva žyma; visi duomenys dinaminiai.
- Naudoti vieną viešą `Button`, vieną ikonų registrą ir bendrus `Section`, `PageHero`, `SectionHeader`, `DarkCta`, `ImageFrame` bei formų laukų raštus, kad puslapiai negalėtų vizualiai išsiskirti.
- Pašalinti likusias pavienes viešų komponentų išimtis, kurios neatitinka HTML: skirtingi mygtukai, kampai, šriftų svoriai, tarpai ir ranka įrašytos spalvos.

## 2 etapas — pagrindinis puslapis

Atkurti seką ir kompoziciją:

1. Pilno pločio fotografijos hero su scrim, patvirtinta antrašte, įvadu, vertinimo pradžios forma ir tik patvirtintais kvalifikacijų teiginiais.
2. Dvi horizontalios kryptys: pardavėjui ir pirkėjui.
3. Brokerės pristatymas su valdomu portretu, patvirtinta biografija, kvalifikacijomis ir parašu.
4. Trys pasirinkti tikri skelbimai.
5. Keturi patvirtinti pardavimo proceso žingsniai.
6. Iki trijų tikrų paskelbtų atsiliepimų; visa sekcija slepiama, jei jų nėra.
7. Tamsi vertinimo CTA juosta.
8. Iki keturių tikrų parduotų / išnuomotų objektų, laikantis kainų privatumo nustatymo.
9. Iki trijų tikrų paskelbtų straipsnių; sekcija slepiama, jei blogas išjungtas arba nėra turinio.

Esama `homepage_sections` tvarka lieka gerbiama; HTML nurodo numatytąją kompoziciją, o išjungta sekcija nėra pakeičiama fiktyviu turiniu.

## 3 etapas — objektų katalogas

Užbaigti pradėtą katalogo perkėlimą pagal bendrą HTML:

- Pirkimo / nuomos segmentas.
- Visada matomi vietos, tipo, kainos, kambarių ir ploto filtrai su gyvu rezultatų skaičiumi.
- Rezultatų ir rikiavimo eilutė; grid, list ir map režimai.
- Kortelės 1:1 pagal etaloną: 3:2 nuotrauka, viena būsenos žyma, nuotraukų skaičius, vieta, pavadinimas, trys tipui tinkami faktai, pagrindinė / papildoma kaina ir energijos klasė.
- Atskiros tikslios grid ir list kompozicijos; map išlaiko tikrą žemėlapio logiką.
- Tuščia būsena ir „neradote tinkamo?“ CTA.
- URL filtrai, SSR, puslapiavimas, paieškos indeksavimas ir tikri duomenys išlieka.

## 4 etapas — objekto puslapis

Atkurti HTML tvarką:

1. Breadcrumbs.
2. Penkių vaizdų galerija desktop ir vieno vaizdo galerija mobile; tikros nuotraukos, planai ir 360° turai.
3. Galerijos veiksmų juosta ir dalinimasis.
4. Objekto tipas / numeris, antraštė ir privatumo lygį gerbianti vieta.
5. Penki pagrindiniai faktai.
6. Aprašymas ir savybės.
7. Pardavimo arba nuomos kainų išklotinė tik iš turimų laukų; neegzistuojančios arba nepatvirtintos sumos nerodomos.
8. Pilna teisės aktams tinkama energijos kortelė su spalvų skale.
9. Dokumentai pagal viešumo ir užklausos taisykles.
10. Apytikslė arba tiksli vieta pagal `geo_precision`.
11. Sticky brokerės kontaktinė kortelė desktop ir fiksuota Call / Enquire juosta mobile.
12. Panašūs tikri objektai.

Jei HTML rodo lauką, kurio sistemoje nėra arba kuris nepatvirtintas, jo neimituoti. Naujo duomenų lauko ar migracijos poreikį pateikti atskirai, neplėsti duomenų modelio tyliai.

## 5 etapas — parduoti objektai ir turinio puslapiai

- **Parduota / išnuomota:** 3 stulpelių archyvo kortelės, statusas ir data, kainos tik pagal `show_sold_prices`, pabaigoje vertinimo CTA.
- **Pardavimas:** dviejų kolonų intro, 8 patvirtinti žingsniai, 4 paslaugų blokai, patvirtinta kainos informacija, tik patvirtinti DUK, tamsi CTA.
- **Vertinimas:** tekstas kairėje, trijų žingsnių esama veikianti forma dešinėje, žingsnių indikatorius, paveldėjimo nuoroda. Forma siunčia į esamą inquiry srautą.
- **Paveldėjimas:** HTML dviejų kolonų anatomija, bet dabartinis patvirtintas tekstas ir teisinės ribos išsaugomos pažodžiui.
- **Apie mane:** intro su valdomu portretu, faktų eilutė tik iš patvirtintų duomenų, kvalifikacijos, tikri atsiliepimai ir CTA.
- **Kontaktai:** HTML dviejų kolonų kompozicija, kontaktai iš nustatymų, tik patvirtintos darbo valandos, realus žemėlapis, esamos seller / buyer / general formos bei sutikimas su privatumu.

## 6 etapas — straipsniai

- Sąrašas: vienas pagrindinis publikuotas straipsnis ir žemiau kortelių tinklelis, naudojant tik `posts` lentelės turinį ir cover nuotraukas.
- Straipsnis: breadcrumbs, meta informacija, cover, 760 px teksto kolona, autorės blokas ir vertinimo CTA.
- Išlaikyti SSR, Article JSON-LD, unikalų head, sitemap, ankstesnių slug peradresavimą ir feature flag.
- Jei straipsnių nėra, nerodyti HTML pavyzdžių; naudoti aiškią esamą tuščią būseną.

## 7 etapas — turinio suvedimas ir Dorothės peržiūra

- Inventorizuoti kiekvieną HTML sakinį ir priskirti vienai vietai: `site_settings`, esamas `page_content`, `messages/en.json` / `messages/de.json`, arba kartojamos esybės lentelė.
- Settings stuburo šiame etape neplėsti. Esami puslapių laukai lieka baigtiniai; papildomi mygtukų, žymų, procesų ir techniniai tekstai eina į vertimus, kaip numato Deerva turinio modelis.
- Sukurti `docs/content-review.md` be klientų asmeninių duomenų dubliavimo: puslapis, DE teksto raktas / slotas, būsena „Needs Dorothe review“, priežastis. Patvirtinti esami tekstai į šį sąrašą neįtraukiami.
- Nepatvirtinti faktiniai teiginiai lieka neprijungti prie viešo vaizdo, o ne pažymėti lankytojui matomu „draft“ tekstu.

## 8 etapas — tikslumo ir kokybės patikra

Kiekvieną puslapį tikrinti atskirai prieš pereinant prie kito:

- Desktop 1280 × 1800 ir mobile 390 × 844 ekranuose palyginti su HTML atitinkamu puslapiu.
- Tikrinti antraštės, sekcijų, kolonų, kortelių, formų, CTA, footer, tarpo ir tipografijos geometriją.
- Patikrinti ilgus vokiškus tekstus, kad jie nepersidengtų ir neišplėstų valdiklių.
- Patikrinti keyboard focus, 44 px zonas, kontrastą, reduced motion, alt tekstus ir semantiką.
- Patikrinti visas interakcijas: mobile menu, kalba, filtrai, rikiavimas, trys katalogo režimai, galerija, dokumentai, formos, DUK, dalinimasis ir mobilioji objekto CTA.
- Patikrinti, kad kiekvienas viešas maršrutas turi unikalų title, description, og:title, og:description ir tinkamą canonical/hreflang.
- Paleisti tipų, i18n raktų, testų ir build patikras; pašalinti console, runtime ir network klaidas.
- Galutinis priėmimas: nėra Unsplash, fiktyvių objektų, fiktyvių atsiliepimų, ranka įrašytų klientų duomenų, naujų admin ar DB pakeitimų.

## Vykdymo tvarka ir sustojimo taškai

Kad „pikselis į pikselį“ netaptų vienu nepatikrinamu dideliu pakeitimu, darbai vykdomi šiomis užbaigiamomis bangomis:

1. Bendras karkasas + Home.
2. Properties + Listing detail.
3. Sold + Selling + Valuation + Inheritance.
4. About + Contact + Guides + Article + legal chrome.
5. Visos svetainės mobile/desktop palyginimas ir galutinis suvienodinimas.

Po kiekvienos bangos pateikiamos realios ekrano patikros ir tik tada tęsiamas kitas blokas. Vizualinė lygybė vertinama pagal HTML struktūrą ir stilių; dinaminio turinio eilučių skaičius bei nuotraukų vaizdas natūraliai priklausys nuo tikrų duomenų.

## Sąmoningai neliečiama

- Admin panelė ir jos Noir tema.
- Auth puslapiai ir slaptažodžio atkūrimas.
- Rolės, permissions, RLS ir migracijos.
- Skelbimų publikavimo, energijos validavimo, užklausų ir analitikos verslo logika.
- Viešų URL struktūra.
- Kliento duomenų seed, nebent vėliau atskirai pateikiami patvirtinti tekstai ar nuotraukos.
