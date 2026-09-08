# Admin prisijungimo atstatymas

## Kas tikrai atsitiko (patikrinta)

Tavo paskyra yra tvarkinga ir slaptažodis veikia:

- `profiles` turi vieną įrašą — `rutkusmarius@gmail.com`, role `developer`,
  aktyvi, paskutinis prisijungimas 12:06 UTC.
- Auth logai rodo sėkmingą `login` (status 200) tuo pačiu metu.

Taigi paskyros kurti iš naujo nereikia — problema ne joje. Paskutinis security
taisymas atėmė role `authenticated` teisę vykdyti tris pagalbines DB funkcijas
(`is_owner_or_above()`, `can_manage_profile(uuid)`,
`storage_can_edit_listing_object(text, text)`). Būtent jos naudojamos 11 RLS
politikų lentelėms `profiles`, `permissions`, `user_invitations` ir storage
objektams. Politikos vykdomos prisijungusio naudotojo teisėmis, todėl po
sėkmingo prisijungimo profilio nuskaitymas grąžina „permission denied for
function", admin gate nukreipia atgal į login su `?error=gate`, o langas tą
klaidą parodo kaip „Sign-in failed." dar nieko neįvedus.

## Ką padarysiu

1. Migracija: `GRANT EXECUTE` role `authenticated` šioms trims funkcijoms.
   Jos yra `SECURITY DEFINER` ir grąžina tik boolean apie patį skambinantįjį —
   duomenų neatskleidžia. `anon` teisės lieka atimtos, kitos to paties taisymo
   dalys (anon kolonų apribojimai, trigger funkcijų revoke) nekeičiamos.
2. Login lange klaida iš `?error=` nebebus rodoma kaip „Sign-in failed."
   nieko neįvedus:
   - `error=noaccess` → „This account has no admin access."
   - `error=gate` → „Please sign in again."
   - nauji vertimai `en.json` / `de.json`.
3. Patikrinimas: realus prisijungimas naršyklėje su developerio paskyra —
   turi atsidaryti admin panelė, veikti Users ir permissions skaitymas.

## Dėl paskyrų perkūrimo ir saugumo

Paskyrų trynimas nieko neišspręstų, o nauja developerio paskyra per pakvietimą
net nesikurtų: `handle_new_user()` skiria tik `editor`/pakvietime nurodytą rolę,
o developerio rolės per pakvietimus išduoti negalima pagal jau įdiegtą taisyklę
(vienas developeris, aukščiausias hierarchijoje).

Saugumui pasiūlymas be paskyros trynimo:

- pasikeisti slaptažodį per „Forgot password?" — pati paskyra ir rolė lieka;
- palikti Developer rolę tik šiai paskyrai (jau taip yra);
- vėliau, jei nori, įjungti nutekėjusių slaptažodžių tikrinimą (HIBP) prisijungimui.

Jei vis tiek norėsi visiškai naujos paskyros, tai reikėtų atskiro žingsnio:
naujas el. paštas → pakvietimas Owner teisėmis → developerio rolės priskyrimas
migracija. Pasakyk, ar to nori — pagal nutylėjimą to nedarysiu.

## Techninės detalės

- Priežastis patvirtinta `pg_policies` užklausa (11 politikų priklauso nuo
  atimtų funkcijų) ir `profiles` bei auth logų patikra.
- Atitinkamas security finding po pataisymo bus pažymėtas su paaiškinimu, kad
  policy-only helperiai turi likti vykdomi `authenticated`.
