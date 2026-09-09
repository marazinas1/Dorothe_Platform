# „Recently sold" kortelės — tikrai mažesnės + el. pašto statusas

## Problema
`ListingCard` `size="small"` jau sumažina vidinius tarpus ir šriftus, bet
„Recently sold" grid'as (`SOLD_CARD_GRID`) rodo 2 korteles per visą 1400px
plotį, o „Selected properties" — 3. Todėl kortelė fiziškai platesnė ir
nuotrauka (3:2) aukštesnė — vizualiai *didesnė*, nors turinys mažesnis.

## Sprendimas
1. `src/lib/homepage/card-grid.ts` — `SOLD_CARD_GRID`: palikti 2 korteles
   per eilutę, bet pridėti plotį ribojantį wrapper: `max-w-[860px]`
   (≈ dvi kortelės po ~420px, t. y. siauresnės už ~440px aktyvias korteles)
   arba, jei aiškiau, `lg:grid-cols-3` su tuščiu trečiu stulpeliu.
   Renkuosi ribojamą plotį — 2 kortelės kairėje, likusi vieta tuščia,
   sekcija akivaizdžiai „žingsniu atgal".
2. `src/components/brand/SoldStrip.tsx` — grid'ui pritaikyti tą wrapper'į,
   nekeičiant `size="small"`, „Sold" žymos, datos ar kainos logikos.
3. Patikrinti EN ir DE home page, mobile 1 kortelė per eilutę, be horizontal
   overflow, build'as.

Nekeičiama: kortelės struktūra, feature ikonos, statusai, katalogas,
archyvas, admin sąrašas.

## El. paštas (notify.dorothe.deerva.com)
- Domenas: ✅ verified (NS delegacija Cloudflare veikia).
- Projekto siuntimo setup: vis dar „Setting up" — provisioning dar nebaigtas
  Lovable pusėje, todėl pakvietimai kol kas eina iš bendro sender'io.
- Delivery log'e per matomą laikotarpį nėra nė vieno įrašo, t. y. per naują
  domeną dar nieko nesiųsta.
- Kode nieko taisyti nereikia (templates ir webhook jau paruošti). Kai
  provisioning užsibaigs, pakvietimai automatiškai eis iš Dorothe domeno.
  Jei per artimiausią laiką statusas nepasikeis — tai platformos pusės
  provisioning problema, ne projekto.
