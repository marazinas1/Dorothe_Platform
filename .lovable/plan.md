# Deerva admin standarto įgyvendinimas

## Tikslas

Sutvarkyti administravimo panelę kaip vieną aiškų kasdienį darbo įrankį pagal Deerva standartą, nekeičiant viešos Dorothe svetainės dizaino ir neperrašant jau veikiančios verslo logikos.

## Kas bus pakeista

### 1. Fiksuota meniu struktūra

Meniu bus pergrupuotas ir surikiuotas pagal naudojimo dažnį:

- **DAILY:** Overview, Enquiries, Calendar, Analytics
- **MANAGE:** Properties, Articles, Testimonials
- **SETTINGS:** Users, Settings

„Calendar“ lieka kasdienėje dalyje, nes šiame projekte jis jau yra realus Dorothe darbo modulis. „Messages“ nebus rodomas, nes atskiro pokalbių modulio nėra. Apačioje išliks prisijungusio vartotojo el. paštas, rolė, „Back to site“ ir „Sign out“.

### 2. Settings pagal viešos svetainės struktūrą

Dabartiniai bendri „Business / Page texts / Legal“ tabai bus pakeisti į aiškesnę seką:

- **Business** — įmonės ir kontaktiniai duomenys
- **Appearance** — logo, favicon ir bendrinamas paveikslas; tiesioginis failų įkėlimas ir „Restore default“
- **Home**
- **Properties**
- **Selling**
- **Inheritance**
- **About**
- **Contact**
- **Legal**
- **Maintenance**

Puslapių tekstai bus pasiekiami tiesiogiai atskiruose tabu, o ne paslėpti antrame „Page texts“ tabų lygyje. Esamas default/override/request approval veikimas bus išsaugotas. „Properties“ turės tik realiai redaguojamą šio puslapio tekstą; nebus kuriami tušti ar neveikiantys laukai.

### 3. Appearance ir logotipo nuoseklumas

- Vienas settings valdomas logotipas bus naudojamas viešos svetainės viršuje, prisijungimo lange ir admin šoninėje juostoje.
- Bus pridėtas logotipo dydžio valdymas, taikomas visose trijose vietose.
- Logo, favicon ir bendrinamo paveikslo įkėlimas liks toks pat paprastas kaip skelbimų nuotraukų.
- „Restore default“ veiks tik tada, kai yra ką atstatyti, ir grąžins vaizdą į numatytą būseną.

### 4. Overview pagal tris Deerva blokus

Overview bus aiškiai suskirstytas tokia tvarka:

1. **Needs attention** — neperskaitytos užklausos, artėjantys susitikimai, skelbimai su trūkumais, default tekstų prašymai.
2. **Numbers** — 7 dienų apsilankymai, aktyvūs objektai, naujos užklausos ir užbaigti sandoriai.
3. **Quick actions** — naujas skelbimas, naujas susitikimas, naujas straipsnis ir užklausų peržiūra.

Esamos tikslios metrikos ir darbų eilės logika bus pakartotinai panaudota, o ne dubliuota.

### 5. Bendras admin vaizdas ir elgsena

- Vienoda pilno pločio puslapio struktūra, antraštės, sekcijos, mygtukai, statusų žymos ir tuščios būsenos visuose moduliuose.
- Visi neapdoroti HTML mygtukai admin dalyje bus pakeisti bendru valdikliu, išskyrus atvejus, kur semantiškai reikalingas specialus komponentas.
- Naikinant bus aiškiai parašyta, kas bus prarasta, ir paprašyta patvirtinti.
- Išsaugojus bus rodomas patvirtinimas; redagavimo formos perspės bandant išeiti su neišsaugotais pakeitimais.
- Editor rolė matys aiškų paaiškinimą ten, kur veiksmą gali atlikti tik Owner arba Developer.
- Telefonuose meniu, lentelės, kortelės, tabai ir pagrindiniai veiksmai liks patogiai pasiekiami.

### 6. Maintenance režimas

Bus pridėtas Settings → Maintenance jungiklis. Įjungus viešos svetainės lankytojai matys lokalizuotą laikiną puslapį, o prisijungę administratoriaus vartotojai galės toliau tikrinti svetainę ir panelę. Būsena bus saugoma per bendrą settings prieigą, ne skaitoma tiesiai komponentuose.

## Techninės detalės

- Admin išliks fiksuotoje `.admin-theme` sistemoje; Dorothe viešos svetainės spalvos ir šriftai nesikeis.
- Route failai liks tik kompozicijai, business logic — `/lib`, o brand komponentai negaus duomenų užklausų ar permission logikos.
- Nauji tekstai bus pridėti į EN ir DE žodynus.
- Jei schemai reikės naujų settings laukų, migracijoje bus RLS ir būtini GRANT; klientui matomos reikšmės bus seed/settings, ne migracijoje.
- Visi keičiami failai bus laikomi iki 200 eilučių, didesnės dalys skaidomos į mažus komponentus.

## Patikra

- TypeScript, i18n ir build patikra.
- Authenticated browser patikra: Overview, Properties, Enquiries, Calendar, Articles, Testimonials, Analytics, Users ir visi Settings tabai.
- Desktop ir telefono dydžių patikra, įskaitant šoninį meniu, ilgas formas, naikinimo dialogus ir neišsaugotų pakeitimų perspėjimus.
- Viešos svetainės patikra su išjungtu ir įjungtu Maintenance režimu.
