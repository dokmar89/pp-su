# PassProve — portál a ověřování se Supabase

Varianta portálu v Next.js spojující zákaznické procesy, správu registrací a experimentální ověřovací funkce.

**Stav:** Starší nebo souběžná varianta PassProve uchovaná jako reference; nejde o označení hlavní produkční verze.

## Co projekt obsahuje

- Účet, e-shopy, přizpůsobení a podpora.
- Administrační stránky registrací a zdroj API.
- Funkce Supabase pro ověřovací metody, kódy a faktury.

## Technologie

Next.js, React, TypeScript, Tailwind CSS, Supabase.

## Architektura a struktura

- `src/app/` — stránky portálu a API
- `src/components/` — zákaznické a ověřovací rozhraní
- `src/lib/` — Supabase a datové pomocné funkce
- `supabase/functions/` — zdrojové kódy funkcí

## Lokální vývoj

Potřebujete Node.js a npm. V kořenové složce repozitáře spusťte:

```sh
npm install
npm run dev
```

Příkaz pro sestavení uvedený v projektu: `npm run build`.

Jde o příkazy deklarované v repozitáři, nikoli o potvrzení úspěšného sestavení. Instalace závislostí, sestavení ani napojení na živé služby nebyly při úpravě dokumentace spuštěny.

## Konfigurace a omezení

Použijte oddělené vývojové služby a ověřte databázové politiky i callbacky poskytovatelů. Vedle `.env.example` je přítomný starší soubor prostředí v `src/lib`; nepřebírejte commitnuté přihlašovací údaje. Některá rozhraní představují nedokončenou integrační práci.

## Co doplnit do dokumentace

Snímky obrazovky s fiktivními daty, opakovatelný postup ověření a přehled skutečně otestovaných integrací. Přihlašovací údaje a konfigurace konkrétního nasazení patří mimo Git.
