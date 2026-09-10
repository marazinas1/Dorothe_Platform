# „Dorothe“ admin dalis pagal „Lumidenta“

## Tikslas

Padaryti visą „Dorothe“ administravimo dalį vizualiai ir ergonomiškai tokią pat aiškią kaip „Lumidenta“: tas pats išdėstymo principas, tarpai, laukų forma, kortelės, mygtukų hierarchija, ikonų dydžiai, tuščios būsenos, nuotraukų valdymas ir mobilus meniu.

Pasirinkta kryptis: **„Lumidenta“ struktūra ir stilistika, bet „Dorothe“ brandingas**. Lieka bendra „Dorothe“ spalvų ir tipografijos sistema (Fraunces + IBM Plex Sans), todėl vieša svetainė ir admin dalis neatsiskirs į dvi nesusijusias temas.

## Ką parodė palyginimas

### „Lumidenta“ stiprybės, kurias perkelsime

- Rami beveik balta darbo drobė, balta šoninė juosta, plonos neutralios linijos ir aiškiai atskirtos sekcijos.
- Vienodas 12–14 px vizualinis apvalinimas laukams, kortelėms, navigacijai ir pranešimams.
- Aiškios puslapio antraštės su trumpu paaiškinimu, o ne vien antraštė be konteksto.
- Tvarkingos sekcijos su `rounded-xl`, lengvu border ir be nereikalingų šešėlių.
- Vienodi mažų ikonų dydžiai, aiški active menu būsena ir kompaktiškos unread žymos.
- Nuotraukos laukas kaip pilnas objektas: pavadinimas, rekomenduojamas formatas, nuotraukos kilmė, tikro formato preview, alt tekstas, upload/reset/pin veiksmai ir aiški „Nėra nuotraukos“ būsena.
- Mygtukų hierarchija: vienas pagrindinis veiksmas, neutralūs outline antriniai veiksmai, ghost tik tretiniams veiksmams.
- Tvarkingos tuščios būsenos ir paaiškinimai, ką vartotojas gali padaryti toliau.

### Kas „Dorothe“ jau geriau ir bus išsaugota

- Išsamesnis Dashboard darbų sąrašas, skelbimų problemos, užklausos ir dienotvarkė.
- Pilnas skelbimų lifecycle ir statusų logika.
- Galingesnė Analytics dalis.
- Owner → Developer numatytojo teksto patvirtinimo užklausos, email pranešimas ir „Lock all“.
- Dvikalbiai EN/DE tekstai bei dabartinio viešo puslapio preview.
- Išsamesnės skelbimų, vartotojų, straipsnių ir atsiliepimų valdymo galimybės.
- Bendras `StatusChip` standartas ir permission sistema.

## Įgyvendinimo planas

### 1. Vienas „Lumidenta“ admin vizualinis karkasas

- Pertvarkyti admin-scoped dizaino taisykles, kad fonas, paviršiai, border, focus, tarpai ir kontrolės proporcijos atkartotų „Lumidenta“.
- Palikti „Dorothe“ semantinius spalvų ir fontų tokenus; nekurti atskiros admin temos.
- Suvienodinti puslapių horizontalų ritmą ir antraščių bloką: H1, vienos eilutės paaiškinimas, tada turinys.
- Išlaikyti pilną darbo plotį ten, kur reikia sąrašams ir lentelėms; tekstų formoms taikyti patogų skaitomą plotį.
- Neliesime bendrų `/components/ui` primityvų; vienodumas bus kuriamas admin wrapper komponentais ir admin-scoped stiliais.

### 2. Sidebar, mobile menu ir signed-in footer

- Pritaikyti „Lumidenta“ navigacijos tankį, grupių pavadinimus, active būseną, ikonų dydžius ir unread skaičiuką.
- Supaprastinti viršutinę juostą, išlaikant esamą sutraukiamą sidebar ir mobilų drawer.
- Apačioje išlaikyti aiškią prisijungusio vartotojo tapatybę, rolę, „View site“ ir „Sign out“.
- „Dorothe“ logotipas toliau ateis iš bendrų nustatymų ir atsinaujins viešoje bei admin dalyje kartu.

### 3. Bendra puslapio, sekcijos ir formos kalba

Sukurti arba suvienodinti admin lygmens pateikimo komponentus:

- `AdminPageHeader` — antraštė, paaiškinimas, pagrindinis veiksmas.
- `AdminSection` — pavadinimas, pagalbinis tekstas ir turinys.
- `AdminEmptyState` — ikona, aiški būsena ir vienas kitas žingsnis.
- Vienodi label, help, error, disabled, loading ir read-only vaizdai.
- Vienodas Input, Textarea, Select, tabs, search ir filter valdiklių aukštis bei apvalinimas tik admin srityje.
- Vienodi list rows, kortelių border, tarpai ir mobile stacking.

### 4. Mygtukai, badges ir ikonėlės

- Visose admin vietose taikyti vieną veiksmų hierarchiją:
  - primary — išsaugoti, sukurti, įkelti, publikuoti;
  - outline — pakeisti, filtruoti, atstatyti, peržiūrėti;
  - ghost — šalutiniai ir reti veiksmai;
  - destructive — tik negrįžtamas trynimas.
- Pašalinti lokalius, vienkartinius mygtukų stilius ir naudoti bendrus admin variantus/wrapperius.
- Visus statusus, roles, „Edited“, „Pending“, „Published“ ir panašias žymas vesti per bendrą `StatusChip` kalbą.
- Sulyginti Lucide ikonų dydį, tarpus ir semantiką visame Dashboard, Listings, Inquiries, Calendar, Articles, Testimonials, Analytics, Users ir Settings.

### 5. Nuotraukų valdymas kaip „Lumidenta“

- Dabartinį upload veikimą apgaubti pilnu, pakartotinai naudojamu admin nuotraukos lauku.
- Kiekviename Home ir Page texts media laukelyje rodyti:
  - aiškų nuotraukos pavadinimą ir rekomenduojamą proporciją;
  - „Owner image“ / „Developer default“ / „No image“ būseną;
  - preview realia puslapio proporcija;
  - alt tekstą su SEO ir accessibility paaiškinimu;
  - „Upload image“, „Restore default“, „Pin as default“ ir, kur tinka, „Remove default“.
- Išlaikyti esamą failų optimizavimą, saugojimo kelius ir Developer/Owner teises.
- Brand logo, dark logo, favicon ir OG image pateikti tokiu pačiu aiškiu preview + upload/reset principu.

### 6. Tekstų redaktoriai ir default būsena

- Išlaikyti dabartinę stipresnę „Dorothe“ logiką, bet vizualiai sutapatinti su „Lumidenta“.
- Pilką, neaktyviai atrodantį dabartinio/default teksto bloką padaryti vienodo dydžio ir stiliaus visose sekcijose.
- Editable override aiškiai atskirti nuo read-only reference.
- „Reset“, „Set as default“ ir Owner request veiksmams taikyti vienodą ikonų bei mygtukų kalbą.
- Pending/approved/declined būsenas pateikti bendrais status chip ir notice komponentais.
- Preview įrankių juostą, kalbų pasirinkimą ir Save veiksmą suvienodinti Home bei visų puslapių redaktoriuose.

### 7. Visų admin ekranų nuoseklumo perėjimas

Nuosekliai pritaikyti sistemą šiems ekranams:

1. Dashboard ir default request queue.
2. Listings sąrašas, filtrai, kortelės, statusai ir listing formos sekcijos.
3. Inquiries sąrašas ir detalė.
4. Calendar bei appointment forma.
5. Articles ir article editor.
6. Testimonials.
7. Analytics.
8. Users, invitation ir account rows/dialogai.
9. Settings: Business, Page texts, Legal.
10. Home ir vidinių puslapių tekstų/nuotraukų redaktoriai.

Nekeisime veikiančios verslo logikos vien dėl dizaino; tik suvienodinsime pateikimą ir sąveiką.

### 8. Naudinga „Lumidenta“ logika, kurios „Dorothe“ dar neturi

Pridėti bendram brokerio darbui tinkamą **opening-hours exceptions** valdymą:

- vienkartinė uždarymo diena, atostogos arba kitoks darbo laikas konkrečią datą;
- data, optional time range ir pastaba;
- aiškus būsimos išimties sąrašas su pašalinimo veiksmu;
- viešoje kontaktų informacijoje išimtis turi papildyti, o ne sugadinti įprastą savaitės grafiką.

Neperkelti odontologijai specifinių dalykų: paslaugų/kainų katalogo, gydytojo licencijų, dental laukų, paruoštų „Lumidenta“ logotipų ir hardcoded Lithuanian tekstų.

## Techninės ribos

- Core neimportuos Brand komponentų.
- Verslo logika liks `/lib`; admin komponentai tik komponuos ir rodys.
- Visi tekstai bus EN ir DE message failuose.
- Kliento duomenys nebus hardcoded komponentuose ar migracijose.
- Failai bus skaidomi, kad neviršytų 200 eilučių.
- Bendri shadcn `/components/ui` failai nebus keičiami.
- Admin ir vieša svetainė išlaikys vieną bendrą semantinę dizaino sistemą.

## Patikra

- Patikrinti visus admin kelius desktop ir mobile dydžiais.
- Patikrinti ilgiausius EN/DE tekstus, loading, empty, error, disabled ir permission būsenas.
- Patikrinti upload, replace, reset, alt text, default pin/request/approval ir logo/favicon atsinaujinimą.
- Patikrinti listing statusų pakeitimą, inquiry veiksmus, calendar įrašus, article/testimonial redagavimą ir vartotojo pakvietimą.
- Paleisti i18n patikrą, TypeScript, lint/build ir peržiūrėti runtime/console/network klaidas.

## Rezultatas

Admin dalis atrodys kaip tos pačios aukštos kokybės „Lumidenta“ produkto šeimos narys, tačiau liks aiškiai „Dorothe“: jos spalvos, jos tipografija, jos logotipas ir brokerio darbo procesai. „Lumidenta“ bus naudojama kaip vizualinis bei UX standartas, o ne aklai kopijuojamas odontologijos produktas.
