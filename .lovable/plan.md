# Admin auditas ir sutvarkymas pagal Deerva standartus

## Ką radau (auditas)

### Stilius
- Admin turi atskirą paletę (`--admin-linen/-ink/-sage/...`), atskirą šriftą (Manrope) ir pill formas (`--radius-button: 999px`, mygtukai ir badges `border-radius: 999px`). Deerva reikalauja tik core spalvų rolių, projekto `--font-sans` ir projekto `--radius`.
- Settings tabai — užpildyta „segmented pill“ eilė. Deerva: skaidri eilė su apatine linija ir 3 px `primary` pabraukimu po aktyviu.

### Struktūra
- Sidebar grupė vadinasi `DAILY`, turi būti `WORKSPACE`.
- Footer nuoroda „View public site“, turi būti „Back to site“ su `ArrowLeft`.
- Settings tabai: `Business`, `Appearance`, `Home`, `Properties`, `Selling`, `Inheritance`, `About`, `Contact`, `Legal`, `Maintenance` — neatitinka reikalavimo (Business & appearance pirmas, Maintenance sekcija jame, pavadinimai kaip vieša meniu, Contact paskutinis, Legal prieš Contact).
- Nėra tabo viešam „Advice“ puslapiui, o `Properties` tabas yra tik paaiškinimas su nuoroda — ne puslapio editorius.

### Plotis ir elgsena
- `Settings` maršrutas apribotas `max-w-6xl`; shell padding `p-4 sm:p-6 lg:p-8`, ne `px-4 py-6 md:px-6 md:py-8`.
- Trys vietos naudoja `window.confirm` (Calendar, Articles, Testimonials) vietoje bendro patvirtinimo dialogo, kuris įvardija įrašą.
- Nėra dirty-state įspėjimo išeinant iš neišsaugotos formos; kai veiksmas neleistinas, dažniausiai mygtukas paslepiamas, o ne paaiškinama read-only būsena.

### Techninis pagrindas
- `Vite 7` (standartas — 8), nėra `FRONTEND.md`, veikia viena edge function `process-site-image` (naujam darbui – server functions).

## Ką darysiu

### 1. Admin token sluoksnis pagal Deerva
- `.admin-theme` palieka fiksuotas, klientui neprieinamas reikšmes, bet išreikštas tik core rolėmis: `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, status poros.
- Pašalinami `--admin-*` aliases, atskiras admin šriftas ir pill formos; admin naudoja projekto `--font-sans` ir `--radius`, o inputs/buttons/cards gauna tą patį radius.
- `AGENTS.md` ir `PLAN.md` 5.1 punktas perrašomas: admin lieka vienodas visuose klonuose, bet per core token roles ir projekto tipografiją.

### 2. Bendras `AdminTabs`
- Naujas shared komponentas: skaidri horizontali eilė, viena apatinė `border-border` linija, aktyvus — `text-foreground` su 3 px `primary` pabraukimu, neaktyvus — `text-muted-foreground`, mobile – viena scrollinama eilė.
- `SettingsTabs` naudoja jį; ta pati anatomija ir kitose tabuotose vietose.

### 3. Sidebar ir footer
- Grupė `DAILY` → `WORKSPACE` (EN/DE tekstai), punktų tvarka nesikeičia.
- Footer: „Back to site“ su `ArrowLeft`, po jo „Sign out“.

### 4. Settings pertvarka
- `Business & appearance` — verslo duomenys, adresas, kontaktai, socialai, logo, logo dydis, favicon, OG, o apačioje atskira bordered kortelė `Maintenance` (title, vienas sakinys, switch eilėje, žemiau žinutė su savo `Save`).
- Tada puslapių tabai vieša meniu tvarka ir tiksliais pavadinimais: `Home`, `Properties`, `Selling`, `Inheritance`, `Advice`, `About me`, `Legal`, `Contact`.
- `Properties` ir `Advice` tampa realiais puslapio editoriais (tekstai + media slot + alt), o ne nuorodomis; jei puslapis realiai neturi redaguojamo turinio, tabas nerodomas, o ne rodomas tuščias.
- Senieji `appearance`, `maintenance`, `about`, `texts`, `general`, `modules`, `branding`, `analytics` maršrutai redirectinami.

### 5. Plotis
- Iš `Settings` maršruto pašalinamas `max-w-6xl`; visi admin puslapiai `w-full`.
- Shell padding → `px-4 py-6 md:px-6 md:py-8`; `max-w-*` lieka tik dialogs/sheets ir pavieniams trumpiems laukams.

### 6. Elgsena
- Bendras destructive confirm dialogas, įvardijantis įrašą ir ką jis pašalins iš svetainės — pakeičia visus `window.confirm`.
- Vieningas save feedback: toast, nekintantis mygtuko plotis, matoma dirty būsena ir įspėjimas prieš navigaciją/uždarant naršyklės langą.
- Kur veiksmas neleistinas pagal rolę, rodomas trumpas read-only paaiškinimas vietoje tuščios vietos.
- Badges visur per shared `Badge`/`StatusChip` su token radius (nebe pill), aiškiu tekstu ir tik semantinėmis status spalvomis.

### 7. Techninis pagrindas
- `Vite 8` atnaujinimas ir `FRONTEND.md` sukūrimas. `process-site-image` edge function nekeičiama šiame darbe — tai atskiras migracijos darbas.

## Techninės detalės

- Keičiami failai: `src/styles.css`, `src/components/admin/AdminShell.tsx`, `AdminSidebar.tsx`, `AdminSidebarFooter.tsx`, naujas `src/components/admin/ui/AdminTabs.tsx` ir `AdminConfirmDialog.tsx`, `settings/*` (Business & appearance, Maintenance sekcija, tabų sąrašas), `src/routes/$locale.admin.settings.tsx`, `$locale.admin.settings.$tab.tsx`, Calendar/Posts/Testimonials sąrašai, EN/DE žodynai.
- Vieša svetainė, RLS, server functions ir verslo logika nekeičiami; SSR lieka.
- Visi failai laikomi iki 200 eilučių; nauji tekstai — į `src/messages/en.json` ir `de.json`.
- Patikra: `tsgo --noEmit`, `bun run check:i18n`, build, maršrutų atsakymai ir authenticated naršyklės patikra desktop + telefono dydžiu.

## Lieka atviri (ne šio darbo dalis)

Keturi ankstesni saugumo radiniai dėl anonimiškos prieigos prie neapdorotų listing lentelių ir per plačios appointment/inquiry eilučių apimties.
