# Admin prisijungimo atstatymas

## Kas atsitiko

Paskutinis security taisymas atėmė teisę prisijungusiems naudotojams naudoti tris
pagalbines duomenų bazės funkcijas (`is_owner_or_above()`, `can_manage_profile(uuid)`,
`storage_can_edit_listing_object(text, text)`).

Patikrinta duomenų bazėje: būtent šios funkcijos naudojamos RLS politikose lentelėms
`profiles`, `permissions`, `user_invitations` ir storage objektams. Politikos
vykdomos prisijungusio naudotojo teisėmis, todėl atėmus `EXECUTE` kiekvienas
profilio skaitymas grąžina `permission denied for function`.

Todėl:

- Slaptažodis veikia — auth logai rodo sėkmingą `login` (status 200).
- Bet iškart po prisijungimo admin gate nepavyksta perskaityti profilio ir
  nukreipia atgal į login su `?error=gate`, o langas tą klaidą parodo kaip
  „Sign-in failed." dar nieko neįvedus.

## Ką padarysiu

1. Nauja migracija: atgal `GRANT EXECUTE` role `authenticated` šioms funkcijoms —
   `is_owner_or_above()`, `can_manage_profile(uuid)`,
   `storage_can_edit_listing_object(text, text)`. Jos yra `SECURITY DEFINER` ir
   grąžina tik boolean apie patį skambinantįjį, todėl saugumo rizikos nekelia;
   `anon` teisės lieka atimtos.
2. Kitos to paties taisymo dalys (anon kolonų apribojimai, trigger funkcijų
   revoke) lieka nepakeistos — jos nieko nelaužo.
3. Login lange: klaida iš `?error=` nebebus rodoma kaip „Sign-in failed."
   nieko neįvedus. Vietoje to:
   - `error=noaccess` → aiškus tekstas „This account has no admin access."
   - `error=gate` → neutralus „Please sign in again."
   - abi žinutės su naujais vertimais `en.json` / `de.json`.
4. Patikrinimas: realus prisijungimas per naršyklę su developerio paskyra,
   kad pasimatytų admin panelė, plus users/permissions skaitymas.

## Techninės detalės

- Priežastis patvirtinta `pg_policies` užklausa: 11 politikų priklauso nuo
  atimtų funkcijų.
- Security finding, kuris to paprašė, po šio pataisymo bus pažymėtas su
  paaiškinimu, kad policy-only helperiai turi likti vykdomi `authenticated`.
