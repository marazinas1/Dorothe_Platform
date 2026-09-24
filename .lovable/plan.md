# Admin atnaujinimas pagal aktyvius Deerva standartus

## Tikslas

Suvienodinti visą administravimo ir prisijungimo dalį pagal dabartinius `deerva-admin-ui`, `deerva-admin-structure`, `deerva-admin-screens` ir `deerva-content-model` reikalavimus, išlaikant Deerva Estate → Agent struktūrą ir nekeičiant viešos svetainės dizaino ar veikiančios verslo logikos.

## Esama būklė

- Bendras `/admin` layout jau vieną kartą atlieka prisijungimo patikrą ir montuoja sidebar, topbar bei vidinius puslapius.
- Sidebar jau turi tik `Workspace`, `Manage`, `Settings`; `Listings` yra pirmas `Manage` modulis.
- `Business` tabas jau apima verslo duomenis, išvaizdą ir paskutinę automatiškai išsisaugančią Maintenance kortelę.
- Articles ir Testimonials redaktoriai pagal nutylėjimą užverti.
- Didžiausi neatitikimai: admin dar aktyvuojamas sena `.admin-theme` klase, auth ekranai negauna Noir temos, tipografinis balsas daug kur įrašytas tiesioginėmis `uppercase/tracking` klasėmis, `AdminTabs` turi 3 px liniją, o dalis paviršių naudoja ne Noir 4 px radius.
- Settings turinio registrai viršija 2–6 laukų stuburo ribą kai kuriuose puslapiuose, o media editorius dar neatspindi trijų sluoksnių (`Your choice → Studio default → Built-in`) modelio.

## Įgyvendinimas

### 1. Noir temos sutartis ir ribos

- Admin shell ir visas auth medis gaus `data-admin-theme="noir"`.
- Noir semantiniai tokenai bus aprašyti vienoje temos srityje: spalvos, 4 px radius skalė, Urbanist sans ir tipografinio balso kintamieji.
- Portalams tema bus perduodama per `body` atributą tik tol, kol atidaryta admin arba auth dalis.
- Viešo fronto `:root`, `ThemeStyleTag` ir brand komponentų stilius nebus keičiami.

### 2. Tipografinis balsas ir bendri primityvai

- Sukursiu bendras admin label, section-title, group-label ir tab tipografijos klases, skaitančias Noir balso tokenus.
- Pašalinsiu tiesiogines `uppercase` ir `tracking-*` klases iš admin/auth komponentų.
- Visi admin paviršiai, kortelės, laukai ir valdikliai naudos semantinius tokenus bei vienodą 4 px radius; nebus `text-white`, `bg-black` ar komponentuose įrašytų spalvų.

### 3. AdminTabs ir navigacija

- Vienintelis shared `AdminTabs` naudos skaidrią horizontalią eilę, `border-border` pagrindo liniją ir 2 px aktyvų pabraukimą.
- Patikrinsiu, kad sidebar liktų 256 px desktop režime, mobile būtų drawer, o grupės liktų tik `Workspace`, `Manage`, `Settings` su `Listings` pirmoje `Manage` vietoje.
- Išlaikysiu vieną bendrą authenticated layout, kad naviguojant sidebar ir topbar nebūtų permontuojami.

### 4. Settings ir turinio modelis

- Pirmą tabą pervadinsiu ir pateiksiu kaip `Business & appearance`; Maintenance liks paskutinė maža kortelė su vienu auto-save jungikliu ir be atskiro žinutės lauko.
- Patikrinsiu galutinį, baigtinį kiekvieno puslapio tekstų ir nuotraukų slotų katalogą bei realius viešo puslapio vartotojus.
- Settings stuburą sumažinsiu iki 2–6 realiai dažnai keičiamų laukų puslapiui; kartojami įrašai liks Manage moduliuose, techniniai ir teisiniai tekstai — kode arba jiems skirtoje esamoje vietoje.
- Media pateikimą sulyginsiu su trimis sluoksniais fiksuota tvarka `Your choice → Studio default → Built-in`, nepaversdamas vieno puslapio nuotraukų bendru „Images“ tabu.
- Prieš bet kokį media rakto pervadinimą ar sujungimą patikrinsiu gyvas reikšmes; be būtinybės raktų nekeisiu.

### 5. Ekranai ir būsenos

- Visi collection ir editor ekranai naudos bendrus header, toolbar, status badge, empty/error/read-only ir destructive confirmation modelius.
- Articles, Testimonials, wording ir media blokai pagal nutylėjimą bus užverti; išskleidimas turės aiškią būseną, chevron ir `aria-expanded`.
- Neišsaugotų pakeitimų apsauga ir aiškūs rolės apribojimai liks visuose redaktoriuose.

## Techninės ribos

- Nekeičiami vieši puslapiai, jų vizualas, duomenų schema, RLS, saugumo taisyklės ir verslo logika, nebent slotų auditui reikėtų tik saugaus esamos reikšmės perkėlimo.
- Core nekvies brand kodo; route failai liks kompozicijai; komponentai bus skaidomi iki 200 eilučių ribos.
- Nauji matomi tekstai bus įtraukti į EN ir DE žodynus.

## Patikra

- TypeScript, i18n ir automatinis build patikrinimas.
- Prisijungimo, Dashboard, Listings, Articles, Testimonials, Users ir visų Settings tabų patikra naršyklėje.
- Desktop, tablet ir phone patikra: sidebar/drawer, horizontalūs tabai, formos, expandable blokai, dialogai ir horizontalus overflow.
- Atskirai patikrinsiu, kad viešas frontas vizualiai nepasikeitė, o admin ir auth turi `data-admin-theme="noir"`.
