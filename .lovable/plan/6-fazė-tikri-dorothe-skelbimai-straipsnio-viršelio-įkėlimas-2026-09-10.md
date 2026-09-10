# 6 fazė: tikri Dorothe skelbimai + straipsnio viršelio įkėlimas

Failai iš SwissTransfer jau parsisiųsti ir peržiūrėti: 10 objektų (4 pardavimui,
2 nuomai, 4 parduoti/išnuomoti), kiekvienam yra nuotraukos ir viso exposé
ekrano nuotrauka PDF formatu (tekstas atpažįstamas OCR).

## Ką darysime

### A. Straipsnio viršelio nuotrauka per failo įkėlimą

Šiandien viršelis įrašomas kaip nuoroda į tekstinį lauką. Pakeisim į tokį patį
įkėlimą kaip skelbimų foto: pasirenki failą, jis sumažinamas ir konvertuojamas
naršyklėje, įkeliamas į saugyklą, rodoma miniatiūra, galima pakeisti arba
pašalinti. Alt tekstas EN/DE lieka kaip yra.

### B. Skelbimų suvienodinimas su ImmobilienScout24

Portale šiuo metu yra:

| Kategorija | Objektai |
|---|---|
| Zum Kauf (4) | Illingen 146 m² 235.000 € · Saarbrücken 67 m² 145.000 € · Nonnweiler 210 m² 249.000 € · Nonnweiler 254 m² 289.000 € |
| Zur Miete (2) | Saarbrücken 66 m² 695 € · Püttlingen 100 m² 1.050 € |
| Vermarktet (4) | tie patys keturi pagal exposé failus |

Tikslūs duomenys (pavadinimas, miestas, kaina, plotas, kambariai, metai,
energija, komisiniai, aprašymas) bus nuskaityti iš kiekvieno exposé ir
suvienodinti su portalu 1:1.

Sprendimai pagal tavo atsakymus:
- nuomai — abu objektai, kaip portale;
- „Vermarktet“ — visi 4 kaip parduoti / išnuomoti;
- „Titelbild“ (nuotrauka su logotipu) — nenaudojama visai;
- aprašymai — vokiškas originalas + mano vertimas į anglų kalbą.

Planai (Grundriss) ir žemėlapio iškarpos (Flurkarte) bus pažymėti kaip planai,
kad nepatektų į viršelį, o rikiuojami taip: išorė → gyvenamosios erdvės →
virtuvė → vonios → planai.

### C. Senų testinių skelbimų pašalinimas

Visi iki šiol įkelti testiniai objektai ir jų nuotraukos ištrinami, kad
liktų tik tikri portalo objektai. Sena Schwalbach ir kiti testai — pašalinami.

## Eiga

1. Straipsnio viršelio įkėlimas (A) — su nauja saugyklos vieta ir taisyklėmis.
2. Iš exposé failų surenkami visų 10 objektų duomenys ir parengiami DE + EN aprašymai.
3. Ištrinami testiniai skelbimai su nuotraukomis.
4. Sukuriami 10 tikrų objektų per admin panelę: laukai, nuotraukos, tvarka, viršeliai.
5. Statusai: 4 aktyvūs pardavimui, 2 nuomai, 4 parduoti/išnuomoti.
6. Patikrinimas: viešas sąrašas, parduotų archyvas, kiekvieno objekto puslapis, nuotraukos, EN/DE, mobili versija.

## Techninė dalis

- Naujas privatus/viešas `post-images` bucket, kelias `posts/<post_id>/...`,
  RLS per esamas rolių funkcijas; `recordPostCover` serverio funkcija `/lib/posts`.
- Viršelio įkėlimas naudoja tą patį `src/lib/images/optimize.ts` variantų
  konvejerį kaip `ImageManager`, todėl logika nesidubliuoja.
- Skelbimų nuotraukos keliamos per realų admin UI konvejerį (variantai + originalas
  + `recordListingImage`), nieko neįrašant į DB aplinkiniu būdu.
- Exposé tekstas nuskaitomas OCR (vokiečių kalba) sandbox'e; į kodą klientės
  duomenys nepatenka — viskas lieka DB.
- `is_floorplan` naudojamas planams; `sort_order` ir `is_primary` nustatomi pagal
  aukščiau aprašytą tvarką.
- Failai iki 200 eilučių, core/brand riba nekeičiama.
