# Amber mygtukai su gintarinės spalvos hover, be juodo peršokimo

## Sprendimas

Paliekame primary mygtukus gintarinės spalvos (`#B8752B`), kaip ir buvo. Pataisome tik `hover` būseną: kai ant mygtuko užvedama pelė, jis nebeturi staigiai pereiti į juodą. Vietoje to hover išlieka gintarinės šeimos spalvų ribose — tamsesnis gintaras (`#8F5A1E`) arba šiek tiek pritempiamas fonas, bet be juodo.

## Pakeitimai

1. **`ActionButton.tsx` / button token'ai**:
   - Filled primary fonas: išlieka `#B8752B` (amber).
   - Hover fonas: pereinama į tamsesnį gintarą `#8F5A1E` arba `color-mix` su 15–20% juodo, bet ne į pilną `#221D17` ink.
   - Tekstas hover metu išlieka šviesus (white/paper).
   - 4px radius, 48px aukštis, uppercase/letter-spacing, be rodyklių — nesikeičia.
2. **Quiet/underlined nuorodos** (pvz. „Request a valuation →"):
   - Hover gali likti gintarinis pabraukimas arba teksto spalvos pasikeitimas, bet ne invertuoti į juodą.
3. **Admin panelė** lieka su juodais mygtukais, kaip Halliday-Architects projekte — šis planas liečia tik public svetainę.
4. **Scope**: tik presentation layer — `ActionButton.tsx`, galbūt `QuietLink.tsx` ir `src/styles.css` token'ai. Jokių duomenų, schemos ar business logic pakeitimų.

## Techniniai žingsniai

1. Peržiūrėti `src/components/brand/ui/ActionButton.tsx` ir rasti, kur hover nustatytas į juodą / ink spalvą.
2. Pakeisti hover klasę/tašką į tamsesnį amber variantą (`hover:bg-amber-700` arba custom `--primary-hover` token).
3. Patikrinti `QuietLink.tsx`, kad ir ten hover neperšoktų į juodą.
4. Paleisti `typecheck` ir `build`.
5. Naršyklės patikra `/` ir `/de`: mygtukai gintariniai, užvedus pelę lieka gintarinės šeimos, rodyklės neatsiranda filled mygtukuose, cursor rodo pointer.

## Konsultacija

Jei vėliau nuspręstumėte, kad gintariniai mygtukai vis dėlto per daug „šilti", galėsime juos vienu kartu perjungti į near-black (`#221D17`) keisdami tik tą patį `ActionButton.tsx` failą. Dabar darome mažiausią pataisą — hover spalvą.
