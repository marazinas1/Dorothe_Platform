# 1a etapas — admin ir prisijungimas į nepriklausomus /admin adresus

Vienas izoliuotas uždavinys. Dizainas, meniu, teisės, duomenų bazė ir vieši puslapiai nesikeičia.

## Ką gausite
- Admin adresai be kalbos: `/admin`, `/admin/listings`, `/admin/settings/business` ir t.t.
- Prisijungimas `/admin/login`, pamirštas slaptažodis `/admin/forgot-password`, pakvietimas ir atkūrimas `/admin/set-password`.
- Ištaisyta klaida: pakvietimo nuoroda šiandien veda į neegzistuojantį adresą ir nukreipia į pradinį puslapį. Po pakeitimo ji atidarys slaptažodžio formą.
- Seni adresai (`/de/admin/...`, `/de/auth/login`) nukreips į naujus.

## Claude pastabos — patikrinta
Su promptu sutinku, bet radau vieną dalyką, kurio jame nėra ir kuris viską sulaužytų: svetainės adresų taisyklė kiekvienam adresui be kalbos automatiškai prideda numatytąją kalbą. Todėl `/admin` tyliai virstų `/de/admin`. `/admin` reikia įrašyti į išimčių sąrašą, kaip `/api`.

## Failų struktūra

```text
src/routes/
  admin.tsx                         tik <Outlet/>, be apsaugos
  admin.login.tsx                   <- $locale.auth.login.tsx
  admin.forgot-password.tsx         <- $locale.auth.forgot-password.tsx
  admin.set-password.tsx            <- $locale.auth.reset-password.tsx
  admin._authenticated.tsx          <- $locale.admin.tsx (vienintelė apsauga)
  admin._authenticated.index.tsx    <- $locale.admin.index.tsx
  admin._authenticated.<...>.tsx    <- kiti 15 $locale.admin.* failų
  $locale.admin.$.tsx               nukreipimas į /admin/*
  $locale.auth.$.tsx                nukreipimas į /admin/login
```
Ištrinami: `$locale.auth.tsx` ir visi seni `$locale.admin.*` / `$locale.auth.*` failai (perkelti su `mv`).

Prisijungimo puslapiai lieka už apsaugos ribų — taip nesusidaro nukreipimų ciklas. Jie apgaubiami `AdminThemeScope` (dabar tai daro `$locale.auth.tsx`) ir savo kalbos tiekėju.

## Techninės detalės
1. `src/router.tsx`: `"/admin"` į `RESERVED`.
2. `admin._authenticated.tsx`: perkeltas `beforeLoad` (getUser + `verifyAdminAccess`), `ssr: false`; `loader` pats užkrauna `siteSettingsQueryOptions`, `featureFlagsQueryOptions`, `permissionMatrixQueryOptions` (anksčiau paveldėta iš `$locale`). `resolveMessageLocale` + `AdminI18nProvider` nepakitę.
3. Auth puslapiai: kalba = `site_settings.default_locale` (tas pats tiekėjas kaip admin).
4. `redirectTo`: `manage.server.ts` -> `${siteOrigin()}/admin/set-password`; forgot-password -> `${window.location.origin}/admin/set-password`.
5. Visos `"/$locale/admin..."` ir `"/$locale/auth..."` nuorodos (`Link`, `navigate`, `redirect`, `useSearch from`, `use-sign-out.ts`) pakeičiamos, `params: { locale }` pašalinamas. Admin kode `useParams().locale`: sąsajai — admin kalba; nuorodoms į viešą svetainę („Back to site“, skelbimo peržiūra) — `default_locale`.
6. `MaintenanceGate`: privataus adreso patikra atnaujinama naujiems keliams (admin nebėra po `$locale`, bet palieka saugų elgesį nukreipimams).
7. Auth nuorodų leidžiamų adresų sąrašas: patikrinti, kad `/admin/set-password` leidžiamas preview, lovable.app ir `dorothe.deerva.com`; jei ne — sukonfigūruoti.
8. AGENTS.md: taisyklė „admin ir auth gyvena po `/admin`, nepriklausomai nuo viešos kalbos“.

NELIEČIAMA: RLS, `permissions`/`role_permissions`, `profiles.role`, migracijos, meniu grupės, tema, šriftai, vieši maršrutai.

## Priėmimo kriterijai
- (a) typecheck ir build praeina
- (b) `rg '/\$locale/(admin|auth)' src` — 0 rezultatų (išskyrus du nukreipimo failus)
- (c) neprisijungus `/admin/listings` -> `/admin/login`, po prisijungimo grįžtama į `/admin/listings` (Playwright)
- (d) pakvietimo nuoroda atveria slaptažodžio formą — tikrinate patys inkognito lange
- (e) `/de/admin/listings` -> `/admin/listings`; viešas `/` ir `/immobilien` veikia kaip anksčiau
