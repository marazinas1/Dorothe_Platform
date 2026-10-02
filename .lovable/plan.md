# Pradžios puslapio sulyginimas su HTML etalonu

## Tikslas
Atkurti visą viešą pradžios puslapį pagal prisegtą `broker-site.html` ir PDF vaizdą, išlaikant baltą meniu juostą. Šiame etape tiksliai statoma struktūra, mastelis, tarpai, spalvos ir sekcijų seka; tekstai bei nuotraukos vėliau galės būti keičiami per administravimą.

## Darbai
1. **Bendras karkasas**
   - Balta, 80 px aukščio meniu juosta virš nuotraukos; tokia pati navigacijos, kalbų ir „Contact“ mygtuko vieta kaip etalone.
   - 1280 px turinio plotis, 40 px šoniniai tarpai kompiuteryje ir 20 px telefone.
   - Vienodi Noir šriftai, linijos, 2 px kampai, mygtukai ir sekcijų vertikalūs tarpai.

2. **Pirmasis ekranas**
   - Namo nuotrauka su tokiu pačiu aukščiu, užtemdymu, teksto pločiu ir padėtimi.
   - Vertinimo forma baltoje juostoje po tekstu, ne atskiras veiksmo mygtukas virš jos.
   - Trys kvalifikacijos eilutės po forma.

3. **Puslapio sekcijos tikslia etalono tvarka**
   - Selling / Buying dviejų lygių juosta.
   - Brokerės pristatymas: portretas kairėje, tekstas ir trys kvalifikacijos eilutės dešinėje.
   - Selected properties: trys esamų objektų kortelės.
   - **How a sale works with me**: pilkas fonas, antraštė ir nuoroda viršuje, keturi horizontalūs numeruoti etapai.
   - What clients say: trys citatų kortelės.
   - Juodas turto vertinimo blokas su keturių punktų sąrašu.
   - Recently sold: keturi kompaktiški objektai.
   - Guides for owners and buyers: trys straipsniai pilkame bloke.
   - Juodas poraštės blokas pagal etaloną.

4. **Duomenys ir administravimas**
   - Naudoti esamas administruojamas pradžios puslapio nuotraukas, tekstus, objektus, atsiliepimus ir straipsnius.
   - Objektų nuotraukų nekeisti; rodyti tas, kurios jau įkeltos administravime.
   - Jei turinio įrašo nėra, atitinkama duomenų sekcija lieka saugiai paslėpta, neįrašant kliento duomenų į komponentus.

5. **Patikra**
   - Vizualiai palyginti su PDF 1280 px pločiu nuo meniu iki poraštės.
   - Patikrinti telefono vaizdą, tekstų neperdengimą ir visų nuorodų pasiekiamumą.
   - Patikrinti projekto surinkimą ir klaidų žurnalą.

## Techninės ribos
- Keisti tik viešo pradžios puslapio pateikimą ir bendrą viešą meniu / poraštę tiek, kiek būtina etalonui.
- Administravimo, duomenų bazės, teisių ir kitų puslapių logikos nekeisti.
- Išlaikyti SSR, semantinius dizaino tokenus, `core/brand` ribą ir failus iki 200 eilučių.
