# Laikinas el. pašto siuntimas iš dorothe.deerva.com

Tikslas: pakvietimai ir visi auth el. laiškai (invite, slaptažodžio atkūrimas,
patvirtinimai) eitų iš tavo laikino subdomeno, be jokio Lovable pėdsako. Vėliau,
perkėlus projektą ant kliento domeno, sender domeną pakeisim į kliento.

Taip pat, kaip padaryta Lumidenta projekte (`lumidenta.deerva.com`).

## Ką reikės padaryti tau

1. Aš atidarysiu el. pašto nustatymų dialogą ir jame nurodysim
   `dorothe.deerva.com` kaip sender domeną.
2. Dialogas parodys **NS įrašus** (nsN.lovable.cloud) — juos reikės pridėti
   Cloudflare DNS deleguotam subdomenui. Taip, tavo supratimas teisingas: NS
   įrašai, ne SPF/DKIM po vieną — SPF, DKIM ir MX toliau valdomi automatiškai.
   Tikslias vertes rodys tik pats dialogas / Cloud → Emails; iš atminties jų
   nediktuosiu.
3. Kai DNS pasklis (iki 72 h, dažniausiai greitai), siuntimas įsijungia
   automatiškai.

## Ką padarysiu aš

1. Atidarysiu email setup dialogą su `dorothe.deerva.com`.
2. Sugeneruosiu auth el. laiškų šablonus (signup, invite, magic link, recovery,
   email change, reauthentication) ir pritaikysiu jiems projekto stilių:
   - Fraunces antraštės, IBM Plex Sans tekstas
   - ink `#221D17`, amber `#B8752B` mygtukas, 4px kampai
   - logotipas ir pavadinimas iš `site_settings`, jokio kliento duomenų kode
   - siuntėjas: `Immobilienberatung Dorothe Waltner <noreply@dorothe.deerva.com>`
     (pavadinimas iš `SITE_NAME`)
3. Patikrinsiu, kad pakvietimo nuoroda vestų į `dorothe.deerva.com/auth/...`, o
   ne į lovable.app.

## Testavimo eiga

1. Tu pasikeiti DNS.
2. Admin → Users pakvieti `marius@deerva.com` kaip owner ir pasitikrini laišką:
   siuntėjas iš tavo domeno, mygtukas veda į tavo subdomeną.
3. Kai viskas gerai — kvieti Dorothe kaip owner.

## Techninės detalės

- Auth laiškų šablonai gyvena `src/lib/email-templates/`, webhook route
  `src/routes/lovable/email/auth/webhook.ts` (generuojamas, nerašomas ranka).
- Deploy vyksta kartu su publish — atskiro žingsnio nėra.
- Perkėlus ant kliento domeno: pakeičiam sender domeną nustatymuose, o
  `SITE_NAME`/logotipas ir taip ateina iš `site_settings`.
- Rate limit: jei testuojant atsirastų 429 `over_email_send_rate_limit`,
  pakelsiu auth el. laiškų limitą.

## Kas pasikeis, jei DNS nepakeisi

Nieko nesulūžta: auth laiškai toliau eina iš Lovable numatytojo siuntėjo.
Tavo domeno siuntimas įsijungia tik po verifikacijos.
