# Bendras planas: Noir bazė viešai svetainei + tolesni etapai

Sujungta: Claude užduotis (vieša svetainė į Noir šeimą, 6 punktai) ir mano ankstesnis planas (admin stuburas, tapatybė, sellers-first, remix šablonas). Dabar vykdomas tik **A etapas**; B–E lieka eilėje ir kiekvienas gaus atskirą planą.

## Mano vertinimas, kur Claude ir aš sutampame / ką papildau

- Sutinku su visais 6 Claude punktais ir su „NELIESTI“ sąrašu.
- **Papildymas 1 (svarbiausias):** šiandien svetainės spalvas, šriftus ir kampus perrašo nustatymai iš duomenų bazės (spalvų, šriftų, kampų, mygtukų formos laukai). Jei pakeisime tik CSS, Noir vis tiek nebus matomas. Todėl pagal taisyklę „klientas keičia tik pagrindinę spalvą ir logotipą“ tokenų variklis nuo šiol perrašys tik `--primary` (ir iš jo išvestus žiedo tonus). Kiti laukai lieka duomenų bazėje nepaliesti, tik nebenaudojami; jų pašalinimas — vėlesnis atskiras žingsnis su migracija.
- **Papildymas 2:** dabartinis mygtukas remiasi gintarine `--accent` spalva ir „on-dark“ išimtimi. Noir neturi gintaro — „on-dark“ tampa `outline` variantu ant tamsaus fono (balta linija, hover invertuoja).
- **Papildymas 3:** parašo šriftas Tangerine realiai naudojamas tik `Signature.tsx` — paliekamas tik jam.
- **Papildymas 4:** 404 ir klaidos puslapiai (`__root.tsx`) taip pat turi ranka stilizuotus mygtukus — įtraukiami.

## A etapas — vieša svetainė pereina į Noir (vykdomas dabar)

### A1. Spalvų ir formos tokenai
Viešas `:root` blokas tiksliai pagal Noir:
background #FFFFFF, foreground #111111, card #F5F5F5, primary #111111, primary-foreground #FFFFFF, muted-foreground #5E5E5E, border/input #E0E0E0, ring = primary, naujas `--footer` #000000 + `--footer-foreground` #FFFFFF, `--radius` 2px, `--radius-media` 2px, `--radius-button` 2px. Secondary/muted/accent = #F5F5F5 su #111111 tekstu. Pašalinami `--sage`, `--paper`, olive/amber likučiai ir `--accent-hover`. Admin blokas neliečiamas.

### A2. Šriftai
- Viešas `--font-sans`, `--font-body`, `--font-heading` = Urbanist (400/500/600/700; antraštės 700, tekstas 400). Kraunama per `<link>` root head (latin-ext).
- Fraunces ir IBM Plex Sans pašalinami iš viešos dalies ir šriftų registro numatytųjų.
- Tangerine paliekamas tik `--font-script`, naudojamas vien parašo komponente.

### A3. Vienas Button komponentas
Naujas viešas `Button` (brand/ui) su penkiais variantais: primary, secondary, outline, ghost, link.
- Bendra: min. 44px aukštis, `cursor-pointer`, focus-visible 2px žiedas su 2px offset, active `scale(0.98)`, disabled 50% + `not-allowed`, loading — spinneris pakeičia tekstą, plotis nekinta.
- Noir registras: UPPERCASE, 0.12em, 700; hover pakyla 2px, 90% užpildas, 200ms; `prefers-reduced-motion` išjungia judesį.
- Veikia ir kaip nuoroda (vidinis Link / išorinis `a`) ir kaip `button`.
- `ActionButton`, `QuietLink`, `HomeActions` tampa ploni sinonimai šio komponento (kad homepage šablonai nesulūžtų) arba importai pakeičiami tiesiogiai.

Keičiami failai (mygtukai/CTA):
`SiteNav.tsx`, `NavDrawer.tsx`, `Hero.tsx`, `CtaBand.tsx`, `ValuationInvite.tsx`, `AgentIntro.tsx`, `ContactSection.tsx`, `ShortInquiryForm.tsx`, `SellerInquiryForm.tsx`, `BuyerInquiryForm.tsx`, `ListingInquiryForm.tsx`, `ListingStickyRail.tsx`, `ListingActionBar.tsx`, `ListingHeroOverlay.tsx`, `ListingGallery.tsx`, `ListingDocuments.tsx`, `ListingCardCarousel.tsx`, `CardRail.tsx`, `ListingLocationMap.tsx`, `ListingsMap.tsx`, `MapCanvas.tsx`, `home/HomeActions.tsx`, `home/h1..h5` CTA vietos, `ui/ActionButton.tsx`, `ui/QuietLink.tsx`, `public/FiltersBar.tsx`, `public/ShareButtons.tsx`, `public/MaintenanceBanner.tsx`, `routes/$locale.kontakt.tsx`, `routes/$locale.immobilien.index.tsx`, `routes/__root.tsx` (404/klaida).
Ikonų mygtukai (galerijos rodyklės, uždaryti, žemėlapio valdikliai) naudoja `ghost` variantą 44×44 su `aria-label`.

### A4. Jokių tiesioginių reikšmių
Viešuose komponentuose (be `components/ui` ir admin) pakeičiami tokenais: hex, `text-white`/`bg-black`/`text-gray-*`/`bg-amber-*`, `rounded-[..px]`, `font-[...]`, šriftų pavadinimai. Žinomi failai: `BrandMark.tsx`, `HeroFrame.tsx`, `TestimonialsCarousel.tsx`, `AuthCard.tsx`, `home/HomeTestimonials.tsx`, `ListingHeroOverlay.tsx`, `blog/PostCard.tsx`, `home/h1/H1Hero.tsx`, `Signature.tsx`, `MapCanvas.tsx`, `ui/ActionButton.tsx`. Ant nuotraukų naudojami nauji tokenai `--on-media` / `--on-media-muted` / `--scrim`. Žemėlapio spalvos imamos iš CSS tokenų runtime. Paieška po pakeitimo turi grąžinti 0.

### A5. Logotipo atsarginis failas
- `logoSrc` API lieka; be įkelto logotipo grąžina `null`, tada `SiteLogo` rodo `BrandMark` (svetainės pavadinimas Urbanist šriftu, be deskriptoriaus dekoro).
- Įkėlus per Settings → Brand assets, kliento logotipas rodomas visur (viešai, auth, admin); tamsiam fonui — dark logo, jei įkeltas, kitaip tas pats.
- **Trinami:** `src/assets/brand/logo.png.asset.json`, `src/assets/brand/logo-mono.png.asset.json`.

### A6. Taisyklės projekte
- `src/components/brand/AGENTS.md` (naujas): 8 privalomos taisyklės iš „Binding rules“ (du tokenų blokai, jokių tiesioginių reikšmių, vienas Button, vienas primary regione, 44px + matomas focus, šriftai pagal sluoksnį, kontrastas prieš spalvą, fiksuotas žodynas).
- Root `AGENTS.md`: viena eilutė su nuoroda, ir pakeičiama senoji taisyklė apie kliento spalvas/šriftus iš `site_settings` į „klientas keičia tik primary ir logotipą“.
- `FRONTEND.md` atnaujinamas pagal Noir.

### Neliečiama A etape
Admin tema ir sidebar, skelbimų duomenų modelis, maršrutai, RLS, duomenų bazė, tekstai ir vertimai, sekcijų tvarka.

### Priėmimo kriterijai
(a) `/`, `/immobilien`, skelbimo puslapis, `/verkaufen`, `/erben`, `/ueber-mich`, `/kontakt` atrodo pagal Noir (patikrinama naršyklės ekrano nuotraukomis, desktop ir mobile);
(b) visi vieši mygtukai eina per vieną Button;
(c) tiesioginių reikšmių paieška = 0;
(d) be logotipo — tekstinis ženklas, su logotipu — kliento logotipas visur;
(e) typecheck ir build praeina.

## Eilėje po A (atskiri planai)

- **B. Admin stuburas ir meniu:** meniu pavadinimai/tvarka per vertimus, mobilus pilno ekrano meniu su slinkimo užraktu, admin Button su `destructive` pagal tą pačią taisyklių sistemą.
- **C. Tapatybės nustatymų sutvarkymas:** nebenaudojamų spalvų/šriftų/kampų laukų pašalinimas iš nustatymų ir duomenų bazės (migracija), lieka primary + logotipai.
- **D. Vieša sellers-first patirtis:** puslapių anatomija pagal NN/g/Baymard, skelbimų UX pagal `broker-listings.html`, 7 skelbimų statusai su fiksuotais žodžiais.
- **E. Remix šablonas:** seed failai, kliento keitimo instrukcija, patikros sąrašas naujam brokeriui.

## Techninės pastabos

- `src/lib/theme/tokens.ts`: `buildThemeVariables` emituoja tik `--primary`, `--ring`, `--sidebar-primary`, `--sidebar-ring` (+ apskaičiuotą `--primary-foreground` pagal kontrastą). `RADIUS_SCALES`/`BUTTON_STYLES` lieka tipams, bet neberašo `:root`.
- `src/lib/theme/fonts.ts`: numatytasis Urbanist; Fraunces/IBM Plex lieka registre tik jei pasirenkami, bet viešas sluoksnis jų nebekrauna (`@fontsource` importai iš `styles.css` pašalinami).
- `src/routes/__root.tsx`: Google Fonts `<link>` Urbanist 400–700 + Tangerine 400 (latin-ext), preconnect.
- Footer naudoja `bg-footer text-footer-foreground` (`PublicChrome.tsx`).
- Kiekvienas failas lieka iki 200 eilučių.
