# Admin kaip Dorothe darbo įrankis — planas iki pridavimo

## Ką patikrinau (faktai)

- Svetainės meniu **jau turi** Contact (mygtukas dešinėje) ir Ratgeber/straipsnius (rodomas, nes blog flag įjungtas). Naujų puslapių kurti nereikia — reikia tik geriau išryškinti.
- Skelbimai: 5 active, 2 sold, 1 rented, 2 draft (Schwalbach — trūksta „Energieträger"; Nonnweiler — trūksta „Endenergiewert").
- Straipsnių dar nėra nė vieno. Atsiliepimų lentelė tuščia (homepage rodo pavyzdinį tekstą).
- Home page kortelės rodomos pagal `is_featured` arba `coming_soon` — nėra ribos „3" ir nėra patogaus žymėjimo admin sąraše.
- Atsiliepimai jau turi `show_on_home` ir `published` laukus — logika yra, tik reikia UI patobulinti.
- Halliday jau turi tai, ko prašai: nuotraukų 3 lygiai (klientas → developerio užfiksuotas default → automatinis), „Set as default" tik developeriui, „Reset to default" savininkui. Tekstams tokios logikos ten **nėra** — tekstų default'ai gyvena kode. Pas mus reikia padaryti pilnesnę versiją: ir tekstams.

## Etapai

### 1 etapas — admin mygtukai ir vizualas (greita, matoma iškart)
- Vienas mygtukų standartas visame admin: juodas/neutralus `default`, švarus `outline`, `ghost` antriniams veiksmams. Amber lieka tik viešoje svetainėje.
- Vienodi tarpai, kortelės, antraštės, tuščių būsenų blokai, „Išsaugota" pranešimai.
- Vienodas puslapio karkasas: antraštė + paaiškinimas + „Peržiūrėti puslapį" mygtukas dešinėje (kaip Halliday).

### 2 etapas — admin meniu pertvarka pagal kasdienį darbą
Nauja struktūra:

```text
KASDIEN
  Apžvalga        (ką reikia padaryti šiandien)
  Užklausos       (su neperskaitytų burbulu)
  Skelbimai
  Straipsniai
  Kalendorius     (7 etapas, vėliau)

SVETAINĖS TEKSTAI
  Pradžia
  Pardavimas
  Palikimas
  Apie mane
  Kontaktai
  Atsiliepimai

RETAI
  Analitika
  Vartotojai
  Nustatymai (bendri: logotipas, favicon, spalvos, kalbos, moduliai, teisė)
```

Skelbimai ir straipsniai pakyla į kasdienį bloką; tekstų redagavimas atskiriamas kaip „retesnis, bet nuoseklus pagal svetainės meniu".

### 3 etapas — tekstų default'ai ir „Set as default" (svarbiausia dalis)
Trys lygiai kiekvienam tekstui ir nuotraukai:

1. Ką įrašė Dorothe (savininkė)
2. Developerio užfiksuotas default
3. Kode esantis pradinis tekstas

Elgesys:
- Redaguojant lauke rodomas **tikrasis dabartinis svetainės tekstas** (ne tuščias laukas). Jei tekstas ateina iš default'o — rodomas pilkai su žymele „Numatytasis".
- Savininkė gali: išsaugoti savo tekstą arba „Atstatyti numatytąjį".
- Ištrynus lauką svetainė **niekada nelieka tuščia** — grįžta default.
- Tik Developeris mato „Nustatyti kaip numatytąjį" — užfiksuoja dabartinį tekstą/nuotrauką kaip naują default.
- Ta pati logika nuotraukoms (jau dalinai yra) ir visiems puslapiams.

### 4 etapas — testinis straipsnis (draft)
Sukurti vieną trumpą EN/DE straipsnį su viršelio nuotrauka ir palikti **draft** — Dorothe galės pati redaguoti, paspausti publikuoti ir realiu laiku pamatyti, kaip jis atsiranda svetainėje.

### 5 etapas — home page atranka
- Skelbimų sąraše žvaigždutė „Rodyti pradžios puslapyje" su skaitliuku „3 iš 3".
- Jei pažymėta mažiau nei 3 — automatiškai užpildoma naujausiais aktyviais, kad pradžios puslapis niekada neatrodytų tuščias.
- Atsiliepimuose tas pats: visi eina į „Apie mane", pažymėti 3 — į pradžios puslapį, su ta pačia automatine atsarga.

### 6 etapas — Apžvalgos puslapis kaip darbų sąrašas
Dorothe atsidaro admin ir mato: naujos užklausos, skelbimai be nuotraukų, draft'ai kuriuos reikia užbaigti, seniai neatnaujinti aktyvūs skelbimai, straipsnių draft'ai. Viskas su mygtuku „Tvarkyti".

### 7 etapas — kalendorius (atskirai, po pridavimo)
Apžiūros ir susitikimai, susieti su skelbimu ir užklausa. Padarysim po to, kai Dorothe patestuos pagrindą — kad nevilkintume perdavimo.

### 8 etapas — užbaigimas
- Du draft skelbimai: trūkstami energijos laukai (arba paliekam Dorothei įvesti).
- Saugumo įspėjimų sutvarkymas.
- Visų puslapių patikra EN/DE + telefone.
- Kvietimas Dorothei + pasveikinimo laiškas EN/DE.

## Mano įžvalgos: kas brokerei tikrai svarbu

**Admin dalis.** Brokerė kasdien daro tris dalykus: atsako į užklausas, kelia/atnaujina skelbimą, keičia statusą. Viskas kita — kartą per mėnesį ar rečiau. Todėl tie trys turi būti pirmi ir prieinami vienu paspaudimu, o tekstų redagavimas — atskiroje dalyje. Telefone dažniausiai tikrinamos užklausos ir keičiamas statusas — tai turi veikti be zoominimo.

**Svetainės išorė.** Pirkėjui svarbu: kaina, m², kambariai, vieta, nuotraukos, ir „kas ta žmogus". Pardavėjui (kuris atneša pinigus) svarbu: pasitikėjimas — sertifikatai, atsiliepimai, aiškus procesas, greitas kontaktas. Todėl pardavimo kelias turi būti bent taip pat matomas kaip skelbimai, ir kiekviename puslapyje turi būti aiškus vienas veiksmas: „Prašau vertinimo".

**Straipsniai.** Vokietijoje veikia geriausiai praktiniai vietiniai straipsniai („Ką kainuoja notaras Saarlande", „Kaip dalintis paveldėtą namą") — jie atveda būtent pardavėjus, ne smalsuolius.

## Techninė dalis

- Naujas `page_content_defaults` (page, slot, locale, value) + `page_media_defaults` tekstų/nuotraukų default'ams; rašo tik Developeris (RLS per `is_developer()`).
- Skaitymo tvarka viena funkcija: klientas → default → kodo fallback. Tą pačią funkciją naudoja ir vieša svetainė, ir admin, kad niekada nesiskirtų.
- Mygtukų standartas per `buttonVariants` variantus + admin tokenus `src/styles.css` — jokių hardcoded spalvų komponentuose.
- Skelbimų home atranka per `is_featured` + serverio pusėje užpildymas iki 3.
- Failai lieka po 200 eilučių; visa logika `/lib`, `/components/brand` tik atvaizduoja.

## Pradedam nuo

**1 + 2 etapo** (mygtukai ir meniu — iškart pamatysi skirtumą), tada **3 etapas** (default'ų logika), tada **4** (testinis straipsnis). Po kiekvieno patikrinam ir tik tada judam toliau.
