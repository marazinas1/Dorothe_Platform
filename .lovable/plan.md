# Visa „Dorothe“ admin dalis pagal „StageHomy“ ir Deerva standartą

## Tikslas

Pertvarkyti visą „Dorothe“ administravimo dalį į tokį pat nuoseklų darbo įrankį kaip „StageHomy“: ta pati administravimo anatomija, tankis, tipografijos hierarchija, juodas sidebar, 4 px formos, kortelių ir sąrašų modeliai, Settings turinio redagavimas bei elgsena. Paliekami tik brokerio projektui reikalingi moduliai ir esama anglų / vokiečių administravimo sąsaja.

Admin asistentas nepridedamas.

## Kas bus pertvarkyta

### 1. Vienas fiksuotas admin vaizdas

- Admin gaus „StageHomy“ / Deerva Estate **Noir** temą: beveik baltas darbo fonas, baltos kortelės, juodas pilnai išskleistas desktop sidebar, juodi pagrindiniai veiksmai, semantinės statusų spalvos ir vienodas 4 px radius.
- Visa administravimo dalis naudos vieną sans šriftą, aiškią `24 px` puslapio antraštę, uppercase sekcijų pavadinimus, mažas uppercase laukų etiketes ir vienodą 40 px valdiklių aukštį.
- Viešos svetainės spalvos, šriftai ir formos į admin nepateks; viešos svetainės dizainas nesikeis.
- Pašalinsiu likusias senos šviesiai žalios / klientinio brand'o admin išraiškas ir dubliuojančius CSS receptus.

### 2. Shell, sidebar ir navigacija

- Desktop sidebar visada bus 256 px ir pilnai išskleistas; ikonų režimo nebus.
- Mobile liks iš kairės atsidarantis meniu, kuris užsidaro pasirinkus punktą.
- Grupės ir tvarka:
  - **WORKSPACE:** Dashboard, Inquiries, Calendar, Analytics
  - **MANAGE:** Listings, Articles, Testimonials
  - **SETTINGS:** Users, Site settings
- Apačioje: prisijungusio vartotojo el. paštas, rolė, `Back to site`, `Sign out`.
- Viršutinė juosta, aktyvūs punktai, hover, unread badge ir mobile meniu bus sulyginti su etalonu.
- Admin auth ir shell liks viename bendrame layout'e, todėl naviguojant sidebar nemirksės ir nebus perstatomas.

### 3. Bendri ekranų komponentai

- Visi puslapiai naudos tą patį pilno pločio karkasą: antraštė su vienu sakiniu ir daugiausia vienu pagrindiniu veiksmu, tada toolbar / sekcijos / turinys.
- Suvienodinsiu `AdminPageHeader`, `AdminSection`, `AdminTabs`, `Badge` / `StatusChip`, empty, loading, error ir read-only būsenas.
- Pašalinsiu dekoratyvines korteles kortelėse; kortelė liks tik atskiram įrašui, formai ar realiai įrėmintam įrankiui.
- Visi veiksmai naudos bendrus mygtukus, ikonų mygtukai turės aiškų pavadinimą / tooltip, destructive veiksmai — bendrą patvirtinimo dialogą.
- Didesnius nei 200 eilučių admin failus (`ListingForm`, `ImageManager`) suskaidysiu į mažesnes atsakomybes nekeisdamas veikimo.

### 4. Dashboard, Inquiries, Calendar ir Analytics

- **Dashboard:** `Needs attention → Numbers → Quick actions`, su aiškiomis tuščiomis būsenomis ir tiesioginėmis nuorodomis į konkretų darbą.
- **Inquiries:** tankus, skenuojamas sąrašas su unread, žmogumi, laiku, šaltiniu ir workflow statusu; detail ekranas išlaikys atskirus kontakto ir būsenos veiksmus.
- **Calendar:** mėnesio navigacija, dienos įrašai ir create/edit forma bus vizualiai suvienodinti; formos uždarymas su pakeitimais perspės, trynimas įvardys susitikimą.
- **Analytics:** vienoda antraštė, laikotarpio valdymas, skaičių ir grafikų sekcijos, stabilios loading / empty / error būsenos.

### 5. Listings kaip pagrindinis Manage modulis

- Kolekcijos ekranas išlaikys paiešką, realius filtrus, rezultatų skaičių, grid / table pasirinkimą ir būsenų grupes, bet bus sulygintas su bendru Deerva kolekcijos modeliu.
- Kortelėse bus stabili nuotraukos zona, pavadinimas, svarbiausi faktai, statuso badge ir atskiri veiksmai; daugiau nei du antriniai veiksmai keliaus į overflow meniu.
- Listing editorius liks brokerio darbo seka, tačiau gaus bendrą puslapio antraštę, vienodas sekcijas, laukus, statuso valdymą, save būsenas ir mobile išdėstymą.
- Bus pridėta neišsaugotų pakeitimų apsauga ir išlaikytas esamas autosave bei publish checklist veikimas.
- Nuotraukų valdymas bus suskaidytas ir vizualiai sulygintas su bendra admin sistema, nekeičiant storage kelių ar optimizavimo logikos.

### 6. Articles ir Testimonials kaip expandable collections

- Pagal nutylėjimą visi įrašai bus suskleisti.
- Suskleista eilutė rodys pavadinimą / autorių, publikavimo būseną, trumpą santrauką ir atskirus veiksmus.
- Redagavimas vyks inline; vienu metu bus atvertas tik pasirinktas įrašas, o ilgesniam sąrašui atsiras `Expand all / Collapse all`, jei jo realiai reikės.
- Formose kalbos bus aiškiai sugrupuotos, publikavimo valdiklis turės aiškų label, Save rodys būseną ir toast.
- Uždarant neįrašytą Article ar Testimonial bus perspėjama; destructive dialogas įvardys konkretų įrašą ir kas dings iš svetainės.
- Testimonials tvarkos kontrolė išliks stabili ir prieinama telefone.

### 7. Site settings — pagal pateiktus „StageHomy“ vaizdus

Tabai bus viena scrollinama eilė su bendra apatine linija ir aktyvaus tabo pabraukimu:

1. **Business & appearance**
2. **Home**
3. **Properties**
4. **Selling**
5. **Inheritance**
6. **Advice**
7. **About me / About us** — pagal tą patį aktyvų viešo meniu pavadinimą
8. **Imprint**
9. **Privacy policy**
10. **Terms**
11. **Contact**

`Business & appearance` struktūra:

- business identity ir kontaktai;
- opening hours ir išimtys;
- socialiniai profiliai;
- Logo, Dark logo, Favicon ir dalinimosi vaizdas su vienoda media kortelės anatomija;
- vienas logo dydžio valdymas;
- `Maintenance mode` kaip paskutinė maža kortelė, išsisauganti iš karto perjungus.

Puslapių tabai:

- Laukai eis ta pačia tvarka kaip viešo puslapio sekcijos.
- Wording bus sugrupuotas pagal realias sekcijas, ne pagal techninius laukus.
- Visos wording sekcijos pagal nutylėjimą bus suskleistos; suskleista eilutė rodys sekcijos pavadinimą ir dabartinio teksto santrauką.
- Atvėrus bus EN / DE stulpeliai greta, `Built-in` tekstas, Reset kiekvienam laukui ir vienas Save kiekvienai kalbai bei sekcijai.
- Nuotraukos kortelė rodys thumbnail, dabartinį šaltinį ir `Edit / Close`; išskleista būsena visada rodys `Your choice → Studio default → Built-in`, aktyviam sluoksniui — `Showing` badge.
- Išlaikysiu esamą owner override → developer default → built-in fallback logiką ir išvalysiu pakeisto / atstatyto failo saugyklos objektą pagal dabartines taisykles.
- Kiekvienas laukas ir media slotas bus patikrintas iki realaus viešo vartotojo, kad nėra išsisaugančių, bet nieko nekeičiančių laukų.
- Trys footer dokumentai nebebus slepiami po techniniu `Legal` pavadinimu: kiekvienas gaus savo viešos nuorodos pavadinimą ir išlaikys dabartinį teisinio turinio saugojimą.
- `Contact` lieka paskutinis; atskiro bendro `Images` stalčiaus nebus.

### 8. Users ir teisių atvaizdavimas

- Users ekranas taps tankiu sąrašu su role, `You`, active / revoked ir dėmesio badges.
- Invite liks aiškus pagrindinis veiksmas, o role / revoke / restore / delete veiksmai bus vienodai pateikti ir patvirtinami.
- Esama serverio teisių sistema ir Developer / Owner / Editor hierarchija nesikeis.
- Kai rolė negali atlikti veiksmo, ekranas rodys trumpą read-only paaiškinimą, o ne tiesiog paslėps veiksmą.
- Navigacijoje neleistini moduliai ir toliau nebus rodomi; turinio ekranuose teisės bus aiškiai paaiškintos.

### 9. Neišsaugoti pakeitimai ir grįžtamasis ryšys

- Bendras `UnsavedChangesGuard` bus pritaikytas Listing, Calendar, Article, Testimonial, Home ir visų page Settings redaktoriams.
- Jis saugos ir nuo browser uždarymo, ir nuo navigacijos admin viduje.
- Save mygtukų plotis nesikeis tarp `Save / Saving / Saved`; sėkmė ir klaida bus aiškiai pranešta, o validation klaida neišvalys įvestų reikšmių.
- Reset / Close veiksmai, kurie praranda pakeitimus, prašys aiškaus patvirtinimo be `window.confirm`.
- Listing nuotraukos pašalinimas taip pat naudos bendrą dialogą, aiškiai įvardijantį, kad nuotrauka dings iš skelbimo ir viešos svetainės.

### 10. Responsive ir prieinamumas

- Patikrinsiu kiekvieną admin ekraną desktop, tablet ir telefono pločiu.
- Mobile sidebar, antraštės, tabai, filtrai, lentelės, kortelės, dialogs, formos ir sticky valdikliai neturės viso puslapio horizontalaus scroll ar persidengimų.
- Interaktyvūs elementai turės bent 40 px touch target, `focus-visible`, `aria-expanded` ir aiškius accessible names.
- Animacijos bus tik trumpos būsenų animacijos, gerbiančios reduced motion.

## Techninės ribos

- „StageHomy“ naudojamas kaip struktūros ir vaizdo etalonas, bet nekopijuojama jo projekto verslo logika, duomenys ar media nuorodos.
- Vieša svetainė, SSR, puslapių turinys, listing / inquiry / calendar verslo taisyklės, duomenų schema ir RLS šiame darbe nekeičiami.
- Nauji matomi tekstai bus tik EN ir DE žodynuose.
- Route failai liks kompozicijai, logika — core `/lib`, o admin komponentai neimportuos brand komponentų.
- Nebenaudojamas senasis atskiras page-editor maršrutas ir likę ankstesnės `Content` navigacijos tipai bus pašalinti, nes puslapių turinys gyvena tik `Site settings`.
- Keturi anksčiau užfiksuoti saugumo radiniai dėl anoniminių listing duomenų ir eilučių apimties lieka atskiras darbas; ši pertvarka jų tyliai nekeis.
- Įkelti PDF naudojami tik kaip vizualinis etalonas ir nebus talpinami svetainėje.

## Įgyvendinimo seka ir patikra

1. Tema, shell, sidebar ir bendri admin komponentai.
2. Site settings struktūra, wording ir media redaktoriai.
3. Dashboard / Inquiries / Calendar / Analytics.
4. Listings kolekcija ir editorius.
5. Articles / Testimonials expandable redaktoriai.
6. Users, permission-aware ir visos dirty / confirm būsenos.
7. Pilnas responsive ir prieinamumo patikrinimas.
8. TypeScript, i18n, testai, build ir authenticated Playwright patikra visuose admin maršrutuose desktop bei telefone.

Baigimo kriterijus: kiekvienas „Dorothe“ admin ekranas atrodo ir elgiasi kaip viena „StageHomy“ / Deerva sistema, tačiau rodo tik brokerio projektui reikalingus modulius ir nekeičia viešos svetainės.
