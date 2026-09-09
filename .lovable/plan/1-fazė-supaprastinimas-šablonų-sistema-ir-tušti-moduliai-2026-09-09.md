# 1 fazė — supaprastinimas (šablonų sistema ir tušti moduliai)

Ši fazė nieko naujo nepridedi. Ji nuima du dalykus, kurie kuria klaidingą
įspūdį, kad platforma turi funkcijų, kurių iš tikrųjų nėra: tris pasirenkamus
Home dizainus ir penkis modulių jungtukus be jokios logikos už jų.

Testimonials laukai, blog’as ir admin meniu pertvarka lieka 2–4 fazėms.

## Ką pamatys savininkė

- Admin → The website → Home atsidaro iš karto kaip vienas redagavimo langas:
  kairėje visi tekstai ir nuotraukos, dešinėje gyvas puslapio vaizdas.
  Nebėra trijų kortelių galerijos, „Preview“ nuorodų ir mygtuko
  „Set as main home page“.
- Dabartinis viešas Home puslapio vaizdas nesikeičia nė viena pikseliu —
  tai buvo H1 ir jis lieka vienintelis.
- Visi jau įrašyti tekstai ir nuotraukos lieka vietoje.
- Settings → Modules sąraše lieka tik tie jungtukai, kurie tikrai kažką daro.

## Modulių sąrašas

Išimama (nėra jokio kodo): `area_pages`, `saved_search`, `mortgage_calc`,
`virtual_tours`, `crm_sync`.

Lieka: `sales`, `rentals`, `valuation`, `sold_archive`, `team`,
`testimonials`, `listing_documents`, `blog`. `blog` lieka sąraše, nes 3 fazėje
už jo atsiras veikiantis puslapis.

## Techninė dalis

Frontend / core:

- Ištrinami `src/components/brand/home/h2/` ir `h3/` katalogai bei
  `HomeTemplate.tsx` perjungėjas; `src/routes/$locale.index.tsx` renderina
  `H1Home` tiesiogiai (`h1/` failai lieka nepakeisti).
- `src/lib/home/templates.ts` sutraukiamas iki vieno „house“ chrome konstanto
  (`footerTone: "dark"`, `heroOverlay: false`); `HomeTemplateKey` tipas ir
  `homeTemplate*` funkcijos išnyksta. `fields.ts` netenka `templates` filtro,
  `content.ts` — šablono argumento. Palečių įrašymo į `site_settings`
  aktyvacijos metu nebėra — spalvos ir šriftai jau įrašyti ir toliau
  redaguojami per Branding.
- Ištrinami `src/lib/home/admin.functions.ts`, `preview.server.ts`,
  `use-preview-urls.ts`, `src/components/admin/home/TemplateCard.tsx`,
  `TemplateThumb.tsx`.
- `HomeAdminPage.tsx` atsidaro `HomeEditorWorkspace` be galerijos; dešinės
  pusės iframe rodo `/{locale}` (parašo/tokeno nebereikia, nes rodomas
  gyvas puslapis su išsaugotu turiniu).
- `$locale.index.tsx` netenka `home` ir `t` search parametrų, `noindex`
  atvejo ir preview temos `<style>` bloko. SEO galvutė ir
  `home-jsonld.ts` lieka kaip yra (JSON-LD į lentelę pereis 2 fazėje).
- `ModulesTab.tsx` — sutrumpintas `FLAG_KEYS`; iš `en.json` / `de.json`
  išimami penkių modulių ir `admin.home.templates.*` tekstai.

Duomenų bazė (viena migracija):

- `DELETE FROM feature_flags` penkiems išimtiems `key`.
- `DROP COLUMN site_settings.active_home_template` ir
  `home_template_extras`, kartu ištrinant
  `site_settings_validate_home_template()` triggerį ir funkciją.
  Šie du stulpeliai — duomenis naikinantis žingsnis, todėl migracija
  paprašys tavo patvirtinimo. Dabartinė reikšmė yra `h1` ir tuščias
  `{}`, todėl nieko vertingo neprarandama. `home_content` ir `home_media`
  nepajudinami.

Patikrinimas: `bun run check:i18n`, build’as, ir naršyklėje — viešas Home
(EN ir /de) atrodo identiškai kaip dabar, o admin Home atsidaro į redaktorių ir
išsaugo tekstą.
