# Likę darbai iki pridavimo Dorothei

## Dabartinė būsena (patikrinta)

- Skelbimai: 5 active, 2 sold, 1 rented — viskas atitinka ImmoScout24 profilį. 2 objektai liko draft: **Schwalbach (549 tūkst.)** — trūksta „Energieträger", **Nonnweiler** — trūksta „Endenergiewert".
- Testimonials: lentelė tuščia — homepage rodo pavyzdinį lorem-ipsum tekstą.
- Blog (`ratgeber`): flag įjungtas, bet straipsnių 0 — puslapis tuščias.
- Vartotojai: tik Developer (tu) ir Editor. Dorothe paskyros dar nėra.
- Branded email (`notify.dorothe.deerva.com`): DNS patvirtintas, bet auth laiškams vis dar reikalingas publish.
- 5 saugumo linterio įspėjimai dėl `SECURITY DEFINER` funkcijų — neišspręsti.
- Sold archyve nustatytas 2,98 % pirkėjo komisinis — reikia Dorothe patvirtinimo.

## Darbų sąrašas

### 1. Užbaigti skelbimus (reikia tavo sprendimo)
- Schwalbach ir Nonnweiler draftams surasti trūkstamus energijos laukus (exposé PDF arba paklausti Dorothe) ir paskelbti, ARBA palikti draft kol Dorothe pati įves.
- Patvirtinti ar pakeisti 2,98 % komisinį sold/rented objektams.

### 2. Testimonials
- Variantai: (a) pakrauti 2–3 tikrus atsiliepimus, kuriuos atsiųstų Dorothe; (b) kol kas išjungti `testimonials` flag, kad nerodytų pavyzdinio teksto.

### 3. Blog
- Variantai: (a) parašyti 1 pavyzdinį straipsnį EN/DE, kad Dorothe matytų kaip veikia; (b) laikinai išjungti `blog` flag, kad nerodytų tuščio puslapio meniu.

### 4. Saugumo tvarkymas
- Peržiūrėti 5 `SECURITY DEFINER` funkcijų linterio įspėjimus ir pridėti `search_path` apsaugas, kur trūksta.

### 5. Galutinis QA
- Visų viešų puslapių patikra EN ir DE (home, listings, detail, sold, verkaufen, erben, ueber-mich, kontakt, impressum, datenschutz, agb) + mobile viewport.
- Kontaktų formos end-to-end testas (užklausa atsiranda admin + laiškas).
- Typecheck + build.

### 6. Dorothe onboarding (po publish)
- Publish (reikalingas ir branded auth email'ui).
- Sukurti Dorothe Owner kvietimą, pasiūlyti jai pakeisti slaptažodį.
- Paruošti pasveikinimo laišką EN su DE vertimu (instrukcija: ką testuoti — kelti skelbimą, keisti statusą, rašyti straipsnį, keisti tekstus).
- Atsiųsti tau peržiūrai prieš siunčiant.

## Ką padaryti šiame žingsnyje

Siūlau pradėti nuo **2–4** (testimonials sprendimas, blog sprendimas, sauguma) — tai galiu padaryti iškart be papildomos info. Punktams 1 ir 6 reikia tavo/Dorothe įvesties.
