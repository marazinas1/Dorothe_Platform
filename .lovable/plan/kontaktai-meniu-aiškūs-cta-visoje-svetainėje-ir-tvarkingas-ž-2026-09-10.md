# Kontaktai meniu, aiškūs CTA visoje svetainėje, ir tvarkingas žemėlapis

## 1. „Kontaktai“ meniu

Šiuo metu Kontaktai yra tik tamsus mygtukas dešinėje (ir mobiliame meniu apačioje). Pridedu Kontaktus ir į patį meniu sąrašą — paskutinis punktas po „Apie mane“ — kad būtų matomas ir kaip įprasta nuoroda, ir mobiliame sąraše kartu su kitais punktais. Mygtukas dešinėje lieka.

Meniu tvarka: Pradžia · Objektai · Pardavimas · Palikimas · (Straipsniai) · Apie mane · Kontaktai + mygtukas.

## 2. Vienas aiškus CTA blokas visoje svetainėje

Šiuo metu iškvietimas veiksmui yra tik pradžios puslapyje, „Apie mane“ ir „Palikimas“. Šie puslapiai baigiasi be jokio veiksmo: Objektai, Pardavimas, Parduota, Straipsniai (sąrašas ir straipsnis).

Sukuriu vieną bendrą CTA juostą (naudojama visur, todėl atrodo vienodai):

- kairėje — trumpas sakinys („Turite klausimą apie savo objektą?“),
- dešinėje — du veiksmai: pagrindinis „Nemokamas vertinimas“ ir antrinis „Rašyti / skambinti“ su telefonu iš nustatymų,
- tekstai iš vertimų (EN/DE), telefonas ir el. paštas iš nustatymų.

Ši juosta pridedama į: Objektai, Pardavimas, Parduota, Straipsniai, straipsnio puslapį. Objekto puslapis jau turi savo užklausos formą, todėl jo nekeičiu.

## 3. Kontaktų puslapis: forma pirma, žemėlapis po ja

- Sekcijų tvarka: antraštė → adresas / kontaktai / darbo laikas → **forma** → **žemėlapis** (kaip Halliday puslapyje).
- Žemėlapis nebebus `iframe` iš OpenStreetMap. Naudosiu tą patį žemėlapio komponentą kaip objektų puslapiuose:
  - **touchpad / pelės ratukas nebezoomina** — puslapis slenka normaliai,
  - artinimas tik **+ / − mygtukais**,
  - pridedu **„Atstatyti vaizdą“** mygtuką: grąžina žemėlapį į Dorothe biuro tašką ir pradinį priartinimą,
  - taškas rodomas iš nustatymų (`geo_lat` / `geo_lng`), taigi pakeitus vietą admin dalyje → Nustatymai → Kontaktai, žemėlapio taškas pasikeičia ir svetainėje.
- Papildomai: nustatymų Kontaktų skirtuke prie koordinačių pridedu mažą žemėlapį su nutempiamu smeigtuku (tą patį, kuris jau naudojamas skelbimams), kad koordinačių nereikėtų rašyti ranka.
- Jei koordinačių nėra — vietoje žemėlapio lieka dabartinis paaiškinimas.

Dabar nustatymuose įrašyta: Kyllbergstraße 140, 66346 Püttlingen, 49.2843 / 6.8862.

## Technical notes

- `SiteNav.useNavItems`: append `/$locale/kontakt` item; drawer already receives the same list, so mobile picks it up. Keep the `actionButtonClass` CTA.
- New `src/components/brand/CtaBand.tsx` (presentational, props: `settings`, `locale`, optional heading/label keys) + EN/DE strings under `cta.*`. Mounted from the route files of `immobilien.index`, `verkaufen`, `verkauft`, `ratgeber.index`, `ratgeber.$slug`.
- Contact route: move the map `<section>` below the form section; replace `buildOsmEmbed`/iframe with a new `src/components/brand/OfficeMap.tsx` that lazy-loads `MapCanvas` behind `ClientOnly` with a single exact point built from `settings.geo_lat/geo_lng`.
- `MapCanvas`: `scrollZoom: false` is already set and `NavigationControl` gives +/−; add an optional `resetTo`/`resetLabel` prop that renders a small overlay button calling `map.easeTo({ center, zoom })`, plus `touchZoomRotate`/`dragRotate` left as-is and `touch-action` handled by MapLibre. Also memoise the `points` array at the call sites so the map is not re-created on every render.
- Delete `buildOsmEmbed` from the contact route once unused; drop the now-dead `map_missing` path only if still needed (keep it).
- Settings Contact tab: reuse `AddressMapPicker` bound to the `geo_lat`/`geo_lng` form fields; keep the numeric inputs as the source of truth.
- No schema change — the office point already lives in `site_settings`.
