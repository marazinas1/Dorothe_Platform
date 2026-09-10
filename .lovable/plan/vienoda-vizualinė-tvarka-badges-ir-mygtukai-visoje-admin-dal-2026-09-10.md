# Vienoda vizualinė tvarka: badges ir mygtukai visoje admin dalyje

Tikslas: vienas standartas visam produktui. Users skiltyje atidirbtas badge (šviesus stačiakampis su rėmeliu, ikonėle ir tekstu) ir juodas mygtukas su ikonėle tampa taisykle visur.

## 1. Vienas badge komponentas

Sukuriamas `src/components/admin/ui/StatusChip.tsx` — vienintelis būdas rodyti paaiškinantį stačiakampiuką admin dalyje:

- viena forma ir dydis (rėmelis, `rounded-md`, `text-xs`, ikonėlė 12px kairėje);
- trys tonai: `neutral` (informacija, pvz. rolė, „You"), `active` (pvz. Published, On home page, Confirmed), `muted` (pvz. Draft, Revoked, Cancelled);
- kiekvienas chip'as **visada** turi ikonėlę (Lucide), niekada ne tik tekstas.

Ikonėlių žodynas, kad ta pati reikšmė visur atrodytų taip pat: rolė/asmuo `ShieldCheck`, publikuota `CheckCircle2`, draft `PencilLine`, home page `Home`, neperskaityta užklausa `Mail`, statusas „parduota/išnuomota" `Archive`, kalendoriaus statusai `CalendarCheck` / `CalendarX`.

## 2. Kur pakeičiama (badges)

- `users/UserRow.tsx` — pervedama į `StatusChip` (vaizdas nesikeičia, tai yra etalonas).
- `testimonials/TestimonialRow.tsx` — Published / Draft / On home page.
- `posts/PostRow.tsx` — Published / Draft.
- `inquiries/InquiryBadges.tsx` — nauja / apdoryta / tipas.
- `calendar/DayList.tsx` ir `MonthGrid.tsx` — susitikimo tipas ir statusas.
- `dashboard/InquiryQueue.tsx`, `ListingQueue.tsx`, `AgendaQueue.tsx`, `QueueGroup.tsx` — ad-hoc `span` pilių pakeitimas.
- `listings/ListingCardTile.tsx`, `ListingStatusSelect.tsx`, `ChecklistRail.tsx` — statusai ir „trūksta duomenų" žymos.
- `analytics/AnalyticsPage.tsx`, `settings/TechnicalBlock.tsx` — smulkios žymos.

## 3. Vienas mygtukų standartas

Taisyklė (kaip Users → „Send invitation"):

- **Pagrindinis veiksmas puslapyje/formoje** — juodas (`variant="default"`) su ikonėle: New listing, New article, New testimonial, New appointment, Send invitation, Save.
- **Antrinis veiksmas** — `variant="outline"` su ikonėle (Cancel, Preview, Reset to default, Revoke).
- **Griaunantis veiksmas** — `variant="outline"` su destructive tekstu ir `Trash2` (nebe pilkas ghost).
- **Ikonėlės tik mygtukai** (sąrašų eilutės: rodyklės, pieštukas, šiukšliadėžė) — `size="icon"`, `variant="ghost"`, su tooltip'u, kad būtų aišku ką daro.

Techniškai: `Button` jau turi `gap-2`, todėl visur išmetama nebereikalinga `mr-2` klasė nuo ikonėlių, kad tarpai būtų identiški.

Peržiūrimi visi ~60 admin mygtukų šiuose failuose: Listings (toolbar, forma, image manager, home pick), Posts, Testimonials, Inquiries, Calendar, Users, Settings (Save, brand asset upload/remove, reset to default), Dashboard.

## 4. Viešoji svetainė

Ten badge'ai turi savo brand stilių (statusas ant kortelės, fact pills), todėl jie **nekeičiami į admin stilių**, bet suvienodinami tarpusavyje: `ListingCardSpecs`, `ListingFactPills`, statusų žymos ir filtrų chip'ai gauna tą pačią formą, dydį ir tarpus. Mygtukai viešoje dalyje lieka gintariniai, bet visi su ta pačia aukščio/ikonėlės tvarka.

## 5. Patikrinimas

- `bunx tsc --noEmit`, `bun run check:i18n`, `bun run build:dev`;
- naršyklės screenshot'ai: Dashboard, Listings, Listing form, Inquiries, Calendar, Articles, Testimonials, Users, Settings — patikrinama, ar visi stačiakampiukai ir mygtukai atrodo vienodai;
- viešos svetainės screenshot'ai: Home, Properties (list + map), Sold, Article, About, Contact.

## Ko nedarysime

Nekeičiame spalvų sistemos, layout'o ar funkcionalumo — tik badge/mygtukų vienodinimas ir ikonėlių pridėjimas.
