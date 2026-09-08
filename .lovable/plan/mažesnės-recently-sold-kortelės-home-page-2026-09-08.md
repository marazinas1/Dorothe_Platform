# Mažesnės „Recently sold" kortelės home page

## Tikslas
Home page „Recently sold" sekcijos kortelės turi būti vizualiai mažesnės ir kompaktinės už viršuje esančias „Selected properties" korteles, bet išlaikyti tą pačią struktūrą, šriftų ir spalvų sistemą.

## Techninė dalis
1. Pridėti `compact` variantą prie `ListingCard` komponento (`src/components/brand/ListingCard.tsx`), kuris:
   - sumažina nuotraukos aukštį (3:2 aspect ratio pasilieka);
   - sumažina pavadinimo ir lokacijos šriftų dydį;
   - sumažina padding tarp eilučių;
   - palieka „Sold" žymą, paskutinę parduoto objekto nuotrauką ir pritildytą atvaizdą;
   - nekeičia interaktyvumo (link į objekto detalę) ir feature ikonų logikos.

2. Pritaikyti `HomeRecentlySold` / `SoldStrip` sekciją (`src/components/brand/SoldStrip.tsx`) naudoti `compact` variantą:
   - desktop: 2 kortelės per eilutę;
   - mobile: 1 kortelė per eilutę;
   - sumažinti tarpus tarp sekcijos antraštės ir kortelių.

3. „Selected properties" ir kitos sąrašų/archyvo vietos toliau naudoja pilno dydžio kortelę be `compact` prop.

4. Patikrinti:
   - EN ir DE home page atvaizdavimą;
   - build’ą;
   - naršyklės preview be horizontal overflow.

## Nekeičiama
- Kortelių dizainas, turinio eilės tvarka, feature ikonos, statusų žymos išlieka identiški visur kitur.
- Nėra keičiami backend duomenys, tik pateikimo variantas.
