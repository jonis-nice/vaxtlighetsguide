# Växtlighetsguide 4.1

En lokal prototyp för växtregister, ståndortssökning, jämförelser, blomningsöversikt och egna växtlistor.

## Starta
Öppna `index.html` i en modern webbläsare. Om webbläsaren begränsar lokala filer, kör:
```bash
python3 -m http.server 8000
```
Öppna därefter `http://localhost:8000`.

## Nyheter i 4.1

- Katalogen har utökats från 64 till **120 registerposter**.
- Varje växtpost har nu en separat `claims`-samling för framtida faktapåståenden med egen källhänvisning.
- Databasschemat är omarbetat för separata växter, synonymer, påståenden, källkopplingar och revisionshistorik.
- Ny CSV-mall för import av faktapåståenden på fältnivå.
- Lokal lagringsnyckel har versionshöjts till `vaxtlighetsguide.v4`.
- Migrering från äldre V3-data slår ihop poster med den nya startkatalogen: befintliga lokala ändringar bevaras, samtidigt som nya registerposter läggs till.
- `claims` bevaras när en befintlig växtpost redigeras.

## Viktig avgränsning: 120 poster är inte 120 verifierade växtporträtt

Katalogen är en prioriterad arbetslista för svenska planteringssammanhang. De nytillkomna posterna är registerkandidater. Deras taxonomi, svenska namn och växtgrupp behöver kontrolleras. Det finns ännu **inte** inlagda, källbelagda uppgifter om exempelvis höjd, bredd, ståndort, blomning, härdighet, skötsel, ekologi eller gestaltning. `claims` är förberedda men tomma. Appen ska därför inte användas som fristående odlingsrådgivare för dessa poster.

## Källprincip: ett påstående – en verifierbar källa

Varje faktavärde ska lagras som ett separat påstående. Exempel på separata påståenden:
- blomningens startmånad
- blomningens slutmånad
- typisk höjd i odling
- optimal markfukt
- tolererad markfukt
- rekommenderat växtavstånd
- härdighet och vilket zon-/klassificeringssystem uppgiften avser

För varje påstående ska följande registreras:
- exakt fält och värde, inklusive enhet
- källa och upplaga
- kapitel/avsnitt
- tryckt sida separat från PDF-sida
- URL när källan är digital
- datum och person för verifiering
- bedömning om källan stöder påståendet direkt, indirekt eller inte alls

En källa på växtpostnivå räcker inte. En källa om en art bevisar inte automatiskt alla fakta om arten. Sorter och kultivarer ska hållas isär från artens generella egenskaper. Konflikter mellan källor ska dokumenteras, inte döljas genom att välja ett bekvämt värde.

## Katalogens prioritering

120 poster täcker träd, buskar, perenner, prydnadsgräs, lök- och knölväxter, annueller, klätterväxter och ormbunkar. Urvalet är tänkt att vara användbart för svenska privata trädgårdar och offentliga planteringar. Det är inte en komplett flora eller en lista över enbart inhemska arter.

## Funktioner från tidigare versioner

- Sökning och kategorifilter
- Ståndortsfilter (ljus, fukt, jordtext och zon)
- Jämförelse av upp till fyra växter
- Egna växtlistor med CSV-export
- Blomningsöversikt utifrån registrerade data
- Import/export av databasen som JSON
- Redigeringsläge med grundläggande källfält

## Kända begränsningar i 4.1

- Det grafiska redigeringsformuläret hanterar fortfarande en enkel källpost per växt, inte ett komplett claim-editorflöde. `claims` kan tills vidare importeras/redigeras via JSON och CSV-mallen är en specifikation, inte en automatisk importfunktion.
- Lagring sker lokalt i webbläsaren. Ingen inloggning, molnsynkronisering eller fleranvändarhantering finns.
- Statusen `Källgranskad` ska inte sättas innan påståenden faktiskt har verifierats. Nuvarande UI-kontroll är grundläggande och inte en fullständig kvalitetsgranskning.
- Zonkarta från Riksförbundet Svensk Trädgård gäller vedartade växter och ska inte generaliseras till perenner.
- Bilder kräver separat kontroll av upphovsrätt, licens och attribution.

## Rekommenderad fortsättning

### 4.2 – Ståndortsanalys
Lägg till jordart, pH, dränering, vind, salttålighet, konkurrens och mikroklimat. Skilj mellan toleransintervall och optimal ståndort. Visa varför matchningen görs och vilka indata som saknas.

### 4.3 – Samplanteringsdesigner
Komponera planteringar med höjdskikt, bredd, avstånd, antal per kvadratmeter, succession, färg, bladverk, fröställningar och vinterstruktur. Skilj biologiska fakta från estetiska rekommendationer.

### 4.4 – Svensk växtgeografi
Hantera zon, proveniens, naturlig utbredning, förvildning, odling och mikroklimat som separata begrepp.

### 4.5 – Produktionsplattform
Inför autentisering, rollstyrning, revisionshistorik, säkerhetskopiering, licensierade bilder, publik läsvy och privat administration.

## Filer
- `index.html` – gränssnitt
- `styles.css` – formgivning
- `app.js` – funktionalitet och startdata
- `data.json` – exportbar startdatabas
- `supabase_schema.sql` – förslag till relationsschema med påståenden och källkopplingar
- `claim_import_template.csv` – mall för påståenden
- `source_import_template.csv` – tidigare källmall
