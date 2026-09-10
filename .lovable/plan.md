# Numatytųjų tekstų užrakinimas: Dorothe prašo, developeris patvirtina

## Kur dabar esame (patikrinta)

- `site_settings.home_defaults` yra tuščias, o `page_content` lentelėje kol kas **nėra nė vienos eilutės** — vadinasi užrakintų numatytųjų nėra nė vieno.
- Svetainėje tekstai vis tiek rodomi, nes jie atkeliauja iš vertimų failų ir senų `site_settings` stulpelių. Tavo sprendimu tai taip ir lieka pirmam Dorothės testavimui — nieko dabar neužrakiname.

## Ką padarysime

### 1. Dorothe gali paprašyti, kad jos tekstas taptų numatytuoju

- Kiekvieno lauko spynelės mygtukas atsiranda ir savininkui, tik jo užrašas kitas: „Request as default“.
- Paspaudus, laukas pažymimas žyme **Requested** ir mygtukas tampa neaktyvus, kol užklausa neišspręsta. Svetainėje tuo metu niekas nepasikeičia.
- Užrakinti gali tik developeris — savininko paspaudimas niekada pats neįrašo numatytojo.

### 2. Tu gauni užklausą į admin ir el. paštu

- Apžvalgos (Dashboard) viršuje developeriui atsiranda blokas „Default wording requests“ su laukiančiomis užklausomis: puslapis, laukas, kalba, prašomas tekstas, dabartinis numatytasis, ir mygtukai **Approve** / **Decline**.
- Kartu tau išeina laiškas, kad atėjo nauja užklausa, su nuoroda į admin.
- **Approve** įrašo tekstą kaip numatytąjį ir išvalo pataisymą — tas pats veiksmas, kurį šiandien daro tavo „Set as default“, tik atliktas iš užklausos.
- **Decline** uždaro užklausą; jos tekstas lieka kaip paprastas pataisymas svetainėje.

### 3. Ką mato Dorothe

- Laukas rodo **Requested**, kol nesprendi.
- Prisijungusi ji admin skydelyje mato pranešimą „Your wording was approved as default“ arba „… was declined“, kurį gali uždaryti. El. laiškų jai nesiunčiame.

### 4. Tavo „Lock all current wording as default“ nesikeičia

Vienu paspaudimu užrakinti visus dabartinius tekstus lieka kaip yra — pasinaudosi, kai Dorothe baigs rašyti.

## Techninė dalis

- Nauja migracija: `public.default_text_requests` (`id`, `scope` `'home' | 'page'`, `page`, `field_key`, `locale`, `requested_text jsonb`, `status` `'pending' | 'approved' | 'declined'`, `requested_by`, `resolved_by`, `resolved_at`, `seen_by_requester bool`, timestamps) + GRANT `authenticated`/`service_role`, RLS: `SELECT` sau arba `is_developer()`, `INSERT` su `current_user_has_permission('settings.edit')`, `UPDATE` tik `is_developer()`. Unikalus dalinis indeksas per (`scope`,`page`,`field_key`,`locale`) kai `status='pending'`.
- `src/lib/copy-requests/` — `requests.functions.ts` (`createDefaultTextRequest`, `listDefaultTextRequests`, `resolveDefaultTextRequest`, `markRequestSeen`), validacija `src/lib/validation/copy-requests.ts`. Patvirtinimas serverio pusėje pakartotinai naudoja tą pačią numatytųjų įrašymo logiką (`home_defaults` / `page_content.defaults`) ir išvalo tos kalbos pataisymą.
- Laiškas developeriui — per esamą managed sending kelią, gavėjas iš `profiles` eilutės, kurios `role = 'developer'`; jei laiško nepavyksta išsiųsti, užklausa vis tiek išsaugoma.
- UI: `DefaultTextField` gauna `requestState` ir `onRequestDefault` (savininkui rodomas „Request as default“, developeriui — dabartinis „Set as default“); naujas `src/components/admin/copy/DefaultRequestQueue.tsx` Apžvalgoje ir `DefaultRequestNotices.tsx` savininkui; `useHomeAdmin` / `usePageAdmin` prijungia užklausų būsenas.
- Nauji EN/DE tekstai `src/messages`. Failai lieka po 200 eilučių.
