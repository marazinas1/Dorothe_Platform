# Įjungti password leak detection ir sustiprinti slaptažodžių politiką

## Tikslas
Įjungti Have I Been Pwned (HIBP) password leak detection Lovable Cloud auth nustatymuose ir pridėti vienodą, griežtesnę slaptažodžio validaciją visuose slaptažodžio keitimo / kvietimo priėmimo srautuose.

## Techniniai žingsniai

1. **Įjungti HIBP tikrinimą**
   - Naudoti `supabase--configure_auth` su `password_hibp_enabled: true`.
   - Tai užtikrins, kad sign-up, sign-in ir password reset metu slaptažodis bus patikrintas prieš viešai žinomus nutekėjimus naudojant k-anonymity metodą — tik pirmi 5 SHA-1 hash simboliai palieka sistemą, tikras slaptažodis niekada neišeina.

2. **Sustiprinti slaptažodžio reikalavimus**
   - Pridėti Zod schemą slaptažodžiams: minimum 8 simbolių, bent viena didžioji raidė, viena mažoji raidė ir vienas skaitmuo.
   - Taikyti šią schemą kliento pusėje formose ir serverio pusėje `createServerFn` handleriuose, kurie priima slaptažodį (kvietimo priėmimas, password reset).
   - Pridėti aiškius vertimo raktus `src/messages/en.json` ir `src/messages/de.json`.

3. **Atnaujinti auth UI**
   - Admin auth formose (sign-in, forgot password, invite accept) rodyti slaptažodžio reikalavimus ir HIBP klaidos pranešimą, jei slaptažodis aptiktas nutekėjusių sąraše.

4. **Testavimas**
   - Patikrinti, kad esamas Developer prisijungimas ir toliau veikia.
   - Išbandyti kvietimo srautą su testiniu el. paštu ir pabandyti nustatyti silpną / žinomai nutekintą slaptažodį; patvirtinti, kad sistema blokuoja ir rodo aiškią klaidą.

## Kas nekeičiama
- Email/password login išlieka vienintelis admin prisijungimo būdas.
- Google OAuth ar kiti provideriai neįjungiami ir nekeičiami.
- Esami naudotojai nebus išmesti ar priversti iškart keisti slaptažodžio — tikrinimas suveiks kitą kartą keičiant slaptažodį ar prisijungiant.
