# Skelbimų būsenos + tekstų redagavimas kaip Halliday

Du dalykai: (1) skelbimų būsenos pervadinamos pagal industrijos standartą ir tampa savaime suprantamos, (2) tekstų redaktorius pradeda veikti su papilkėjusiais defaultais ir atspindėti tikrą puslapio eiliškumą.

## 1. Skelbimų būsenos

Duomenų bazė nesikeičia (būsenų raktai lieka tie patys), keičiasi ką Dorothe mato ir skaito. Būsena visada rodoma pagal sandorio tipą, kurį ji pasirenka kurdama skelbimą (pardavimas / nuoma).

Gyvenimo ciklas:

```text
Juodraštis → Netrukus rinkoje → Parduodamas / Nuomojamas → Rezervuota → Parduota / Išnuomota → Archyvas
```

Pavadinimai (EN / DE):

| Būsena | Pardavimas | Nuoma |
| --- | --- | --- |
| draft | Draft / Entwurf | Draft / Entwurf |
| coming_soon | Coming soon / Demnächst | Coming soon / Demnächst |
| active | For sale / Zu verkaufen | For rent / Zu vermieten |
| reserved | Reserved / Reserviert | Reserved / Reserviert |
| sold | Sold / Verkauft | — |
| rented | — | Rented / Vermietet |
| archived | Archived / Archiviert | Archived / Archiviert |

Mygtukai irgi tampa veiksmais žmonių kalba: „Publish as for sale“ / „Publish as for rent“, „Mark reserved“, „Mark sold“ / „Mark rented“, „Back to draft“, „Archive“. „Active“ kaip žodis išnyksta iš visos sistemos — nei admin, nei svetainėje.

Viena vieta sprendžia pavadinimą (`statusLabel(status, dealType)`), ją naudoja skelbimų sąrašas, skelbimo forma, būsenos juosta, viešos kortelės ir Properties filtrai — kad niekur neatsirastų antro varianto.

## 2. Tekstai: papilkėję defaultai

Kiekvienas laukas veikia taip:

- Tuščias laukas rodo **papilkėjusį** defaultinį tekstą (tą patį, kurį šiuo metu rodo svetainė) — jo negalima netyčia perrašyti ar ištrinti.
- Įrašai savo tekstą — jis rodomas įprastai (juodai), o po „Save“ pasikeičia svetainėje.
- Išvalai lauką — grįžta papilkėjęs defaultas, svetainė vėl rodo jį.
- **Developeris** turi „Set as default“: dabartinis tekstas įrašomas kaip naujas defaultas ir tampa papilkėjusiu pagrindu. Owner (Dorothe) šio mygtuko nemato.

Ta pati logika visiems puslapiams: Home, Verkaufen, Erben, Über mich, Kontakt.

## 3. Laukų eiliškumas ir pavadinimai

Šiuo metu laukai vadinami techniškai („Small line above the headline“, „Point 1 — tag“) ir nesutampa su tuo, ką rodo peržiūra šone. Sutvarkoma:

- Laukai išdėstomi **tiksliai** ta eile, kuria sekcijos rodomos puslapyje (Home: hero → du keliai → kvalifikacija → objektai → atsiliepimai → vertinimas → kontaktas).
- Sekcijų antraštės redaktoriuje atitinka sekcijų pavadinimus svetainėje, o ne vidinius grupių raktus.
- Laukų pavadinimai pasakomi žmonių kalba pagal turinio rolę (pvz. hero: „Business name line“, „Main headline“, „Intro paragraph“).
- Išmetami seni nebenaudojami atsiliepimų laukų pavadinimai (atsiliepimai turi savo skiltį).

## Techninė dalis

- **Migracija:** `site_settings.home_defaults jsonb not null default '{}'` ir `page_content.defaults jsonb not null default '{}'` — čia gyvena „set as default“ tekstai.
- **Sprendimo tvarka** (viešoje pusėje ir redaktoriuje viena ir ta pati): override → įrašytas default → kodo/vertimo default. Įgyvendinama `src/lib/home/content.ts` ir `src/lib/pages/resolve.ts`.
- **Serverio funkcijos:** `setHomeDefaults` / `setPageDefaults` su `require-permission` patikra — leidžiama tik developeriui (`is_developer()`); tas pats tikrinimas ir kliento pusėje mygtuko rodymui.
- `use-home-admin.ts` / `use-page-admin.ts`: `value()` grąžina tik override; naujas `placeholder()` grąžina defaultą. `HomeTextEditor` / `PageTextEditor` deda jį į `placeholder` su `placeholder:text-muted-foreground`, prideda „Set as default“ developeriui, „Reset“ lieka override išvalymui.
- Būsenos: `src/lib/listings/status-label.ts` su `statusLabel(status, dealType)`; `status-options.ts` veiksmų raktai; vertimai `listings.status.sale.*` / `listings.status.rent.*` + bendri. Schema, `STATUS_FLOW` ir RLS nekeičiami.
- Failai lieka <200 eilučių; naujos eilutės tik `src/messages/en.json` + `de.json`.

## Patikrinimas

- `bunx tsc --noEmit`, `bun run check:i18n`, `bun run build:dev`.
- Admin: skelbimo būsenos juosta pardavimui ir nuomai, sąrašo grupės, statuso pakeitimas → objektas persimeta į teisingą svetainės skiltį.
- Tekstai: tuščias laukas rodo papilkėjusį tekstą; įrašius ir išsaugojus pasikeičia svetainė; išvalius grįžta defaultas; „Set as default“ matomas tik developeriui ir po jo tekstas tampa papilkėjusiu pagrindu.
- Ekrano nuotraukos: Home redaktorius, Verkaufen redaktorius, skelbimo forma, viešas Home ir Properties (EN ir DE).
