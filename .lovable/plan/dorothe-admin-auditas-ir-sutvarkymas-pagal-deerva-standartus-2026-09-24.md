# Dorothe admin auditas ir sutvarkymas pagal Deerva standartus

## Tikslas

Užbaigti Dorothe admin dalį kaip nuoseklų Deerva Estate → Agent darbo įrankį: išsaugoti jau teisingą Noir struktūrą, o Settings palikti tik svarbiausio puslapio turinio stuburą. Viešos svetainės dizainas ir veikianti verslo logika nekeičiami.

## Audito išvada

Jau atitinka standartą:

- vienas bendras prisijungusios admin dalies karkasas be sidebar persimontavimo;
- trys sidebar grupės — Workspace, Manage ir Settings; Listings yra pirmas Manage modulis;
- Noir tema su `data-admin-theme="noir"`, semantiniais tokenais ir 4 px radius sistema;
- vienas shared 2 px pabraukimo `AdminTabs`;
- pilno pločio admin puslapiai, bendros antraštės, statusų žymos, patvirtinimo dialogai ir neišsaugotų pakeitimų apsauga;
- Maintenance yra paskutinė Business & appearance kortelė ir išsisaugo iš karto;
- Articles ir Testimonials redaktoriai pagal nutylėjimą suskleisti.

Patvirtinti neatitikimai:

- Settings turi laukų, kurie yra techninis UI tekstas, o ne puslapio stuburas;
- 6 registruoti laukai išsaugomi, bet viešame puslapyje nieko nekeičia;
- About nuotraukos laukas išsaugomas, bet viešas puslapis naudoja kitą nuotraukos šaltinį;
- Contact turi 8 laukus, nors stuburas turi turėti 2–6 svarbiausius laukus;
- Home ir kitų puslapių redaktoriuose rodoma perteklinė iframe peržiūra;
- keli likę admin valdikliai dubliuoja bendrą tabų stilių, keli listing blokai turi netinkamai įdėtas korteles ir ne Noir radius;
- serveris tikrina veiksmų teises, tačiau kai kuriuose ekranuose vartotojas be teisės negauna aiškios read-only būsenos;
- `logo_dark_url` admin laukas neturi vartotojo matomo consumer, o logo dydžio nustatymas prieštarauja jau sutartam vienodam logotipo dydžiui.

Gyvoje duomenų bazėje `page_content` įrašų nėra, o Home override/default/media reikšmės tuščios, todėl laukų mažinimas nepraras kliento įvesto turinio.

## 1. Supaprastinti Settings turinio stuburą

Palikti tik šiuos Owner redaguojamus laukus:

| Tabas | Teksto laukai | Media |
|---|---|---|
| **Home** | `hero_headline`, `hero_subline`, `valuation_title`, `valuation_body` | `hero_photo` |
| **Properties** | `headline`, `intro` | — |
| **Selling** | `headline`, `intro` | — |
| **Inheritance** | `headline`, `intro`, `contact_title`, `contact_body` | — |
| **Blog** | `headline`, `intro` | — |
| **About** | `headline`, `paragraphs` | — |
| **Contact** | `headline`, `form_intro` | — |

Iš Settings pašalinti:

- techninius empty-state tekstus `properties:empty` ir `blog:empty`;
- eyebrow/section labels: `hero_kicker`, puslapių `kicker`, `address_title`, `hours_title`, `channels_title`, `map_title`, `form_title`, `contact_title`, kai tai tik fiksuota sekcijos etiketė;
- neveikiančius Selling CTA laukus `cta_title` ir `cta_body`;
- About puslapio neveikiantį atskirą `portrait` media slotą.

Pašalinti laukai ir toliau gaus EN/DE built-in tekstus iš kodo. Reset elgesys išlieka: pašalinamas Owner override ir atidengiamas kitas resolution sluoksnis.

## 2. Sutvarkyti kiekvieno likusio lauko realų poveikį

- About `headline` ir `paragraphs` prijungti prie viešo puslapio per esamą `copy()` resolution grandinę.
- Contact `headline` ir `form_intro` prijungti prie `copy()`, išsaugant esamą solo/team built-in fallback elgesį.
- Atlikti abipusį auditą: kiekvienas registre likęs laukas turi viešą consumer, o kiekvienas Owner keičiamas viešas stuburo tekstas turi registro įrašą.
- Mygtukų tekstai, filtrų pavadinimai, empty states, eyebrow ir techniniai/teisiniai paaiškinimai lieka EN/DE žodynuose arba kode, ne Settings formose.

## 3. Vienas agento portreto šaltinis

- `primary_agent_photo_url` palikti vieninteliu agento tapatybės portreto šaltiniu Business & appearance dalyje.
- Tą pačią įkeltą nuotrauką naudoti Home ir About vietose; nepalikti dviejų tariamai nepriklausomų laukų, kurių vienas neveikia.
- Išlaikyti esamą optimizuoto įkėlimo, pakeitimo ir seno failo išvalymo eigą.
- Jei dviejose viešose vietose patikros metu paaiškėtų objektyviai skirtingos proporcijos, vietoje slapto dubliavimo bus palikti atskiri placement slotai su tuo pačiu built-in assetu.

## 4. Pašalinti puslapių peržiūras iš redaktorių

- Iš Home ir bendro page editor workspace pašalinti iframe peržiūrą, refresh valdiklį ir dviejų kolonų preview išdėstymą.
- Palikti pilno pločio laukų redaktorių ir aiškią „Open page“ nuorodą į tikrą viešą puslapį.
- Visi wording ir media blokai lieka suskleisti pagal nutylėjimą; ilgesniam sąrašui palikti Expand all / Collapse all.

## 5. Sutvarkyti Business & appearance

- Išlaikyti vieną tabą su business/contact duomenimis, brand failais, technine read-only informacija Developer vartotojui ir Maintenance paskutine kortele.
- Pašalinti neveikiantį `Dark logo` lauką iš admin UI; duomenų bazės stulpelio dabar netrinti, kad nebūtų nereikalingos schemos rizikos.
- Pašalinti logo dydžio valdiklį ir likusį transformavimą: tas pats canonical `logo_url` visur rodomas vienodu sutartu dydžiu.
- Pridėti vieną aiškų agento portreto įkėlimo lauką prie business identity duomenų.
- Šalies, locale, valiutos ir ploto vieneto reikšmes palikti Developer-only read-only bloke, ne Owner formoje.

## 6. Užbaigti bendrą admin UI atitikimą

- Analytics periodo ir Dashboard periodo valdiklius perkelti į vieną bendrą underline control anatomiją, nepaliekant dviejų ranka dubliuotų tabų realizacijų.
- Listing redaktoriuje panaikinti dekoratyvinę kortelę kortelėje: SEO bloką paversti paprasta vidine sekcija arba atskiru lygiaverčiu bloku.
- Likusius `rounded-lg`/`rounded-md` admin paviršius pakeisti Noir radius tokenu; nekeisti public svetainės radius.
- Bendrinti admin error state vietoje vienkartinio Analytics klaidos bloko.
- Patikrinti icon-only veiksmų accessible names ir viso admin focus-visible būsenas.
- Suskaidyti 201 eilutės `ListingForm` žemiau 200 eilučių, nekeičiant jo autosave ir publish logikos.

## 7. Permission-aware būsenos

Serverio leidimų patikras palikti autoritetingas ir nekeisti RLS.

UI lygyje:

- Listings, Articles, Testimonials, Inquiries, Calendar ir Users ekranuose pagal esamą permission matrix aiškiai rodyti `Read only`, kai vartotojas gali peržiūrėti, bet negali keisti;
- tokiu atveju išjungti arba paslėpti mutacinius valdiklius, ne tik sidebar nuorodą;
- Developer-only ir Owner-only veiksmams rodyti trumpą paaiškinimą, o ne neveikiantį mygtuką.

## 8. Patikra

- Registry → public consumer ir public consumer → registry audit visiems likusiems Home/Page laukams.
- EN/DE save, per-field Reset, Owner request ir Developer default scenarijai.
- Agent portrait ir canonical logo patikra visuose realiuose consumer.
- Desktop, tablet ir phone patikra: sidebar, horizontalūs tabai, formos, listing editor, dialogai, dirty warning ir read-only būsenos.
- Authenticated browser patikra visuose admin maršrutuose; viešų Home, Properties, Selling, Inheritance, Blog, About ir Contact puslapių regresijos patikra.
- TypeScript, i18n, testai ir galutinis build; public svetainės vizualas nekeičiamas.

## Techninės ribos

- Route failai lieka kompozicijai, business logic — `/lib`, brand komponentai tik atvaizduoja props.
- Settings skaitomi tik per bendrą accessor; tiesioginių `site_settings` užklausų komponentuose nepridėti.
- Jokio naujo bendro „Images“ tabo ir jokio `page_text_defaults` dubliavimo.
- Jokios schemos ar RLS migracijos šiam sutvarkymui nenumatomos; jei įgyvendinant išaiškėtų neišvengiamas schemos poreikis, jis būtų atskirai pagrįstas prieš keičiant duomenų bazę.
- Visos admin spalvos, radius ir tipografinis balsas lieka semantiniuose Noir tokenuose; public dizaino tokenai neliečiami.
