# Växtlighetsguide 3.0

En lokal webbprototyp för växtporträtt, ståndortssökning, jämförelser, blomningsöversikt och egna växtlistor.

## Starta
Öppna `index.html` i en modern webbläsare. Om webbläsaren begränsar lokala filer, kör i mappen:
```bash
python3 -m http.server 8000
```
Öppna sedan `http://localhost:8000`.

## Nyheter i 3.0
- Nytt namn och omarbetat gränssnitt: Växtlighetsguide.
- Fungerande ståndortsfilter: ljus, markfukt, jordtext och zon.
- Växtjämförelse för upp till fyra poster.
- Egna växtlistor med CSV-export.
- Blomningskalender räknad från registrerade blomningsmånader.
- Sortering efter namn, höjd och blomningsstart.
- Källfält med separat tryckt sida och PDF-sida.
- Import/export av hela databasen som JSON.
- Migrering av lokala data från tidigare nycklar `vaxtencyklopedin.v1` och `vaxtligt-talat.v2`.

## Viktiga begränsningar
- Detta är fortfarande en lokal prototyp. Data lagras i `localStorage` i aktuell webbläsare/enhet.
- Ingen autentisering, molndatabas, fleranvändarsynkronisering eller publiceringsworkflow finns.
- Redigeringsläget är inte skyddat. Publicera inte den här prototypen med redigering tillgänglig.
- De sex medföljande växtposterna är registerstommar och saknar verifierade växtfakta. De ska inte användas som odlingsråd.
- Blomningskalendern visar endast registrerade data. Tomma värden betyder okänt, inte blomningsfri månad.
- Zonkartan från Riksförbundet Svensk Trädgård gäller vedartade växter (träd och buskar), inte perenner generellt.
- Samplanteringsfält är manuella anteckningar. Inga automatiska kompatibilitetsbedömningar görs.
- Källgranskad status är en grundkontroll. Kvaliteten och relevansen i den angivna källan måste fortfarande granskas manuellt.
- Bilder kräver rättigheter, licens och attribution. En URL i bildfältet bevisar inte att bilden får publiceras.

## Källprincip
- Kursmaterial prioriteras när en uppgift hämtas ur det.
- Exakta kapitel och tryckta sidnummer ska verifieras mot originalet. Gissa aldrig sidnummer.
- PDF-sida och tryckt sida hålls isär.
- Externa källor kompletterar kursmaterialet; skyddade texter och bilder kopieras inte utan tillstånd.
- I en framtida produktionsversion bör varje enskilt faktavärde ha en egen källkoppling (claim-level provenance), inte bara hela växtposten.

## Rekommenderad fortsättning mot publik tjänst
1. Flytta data till PostgreSQL/Supabase eller motsvarande.
2. Lägg till autentisering och rollstyrning: privat admin, publik läsning.
3. Normalisera taxa, synonymer, sorter/kultivarer och växtfakta.
4. Inför källkoppling per faktapåstående med källa, utgåva, kapitel, tryckt sida, PDF-sida, URL, verifierare och datum.
5. Lägg till revisionshistorik och granskningsflöde.
6. Inför licensierat bildbibliotek med attribution.
7. Testa tillgänglighet, mobil, prestanda, säkerhet och datamigrering före publicering.

## Filer
- `index.html` – gränssnitt
- `styles.css` – formgivning
- `app.js` – funktionalitet
- `data.json` – startdata
- `supabase_schema.sql` – preliminärt databasschema från tidigare version (måste granskas/uppdateras innan skarp användning)
- `source_import_template.csv` – enkel källmall
