# Prototyp formátů terapeutického zápisu

Statická výzkumná ukázka čtyř způsobů zápisu jednoho fiktivního sezení:
plný zápis DeePsy, DAP, SIRP a dekurz.

## Ochrana zdroje

Veřejný případ je nová fiktivní kompozice tematicky inspirovaná pátým sezením
interní demo epizody. Neobsahuje zdrojový přepis, mapování na původní veřejná
videa ani jejich unikátní sled událostí. Změněny byly identifikační,
biografické, situační i další klinicky nepodstatné detaily.

Sekce „Klinické hypotézy" v plném zápisu DeePsy je doslovný výstup modelu
`deepseek-v4-flash` nad revidovaným promptem, ne ručně psaná ilustrace. Vstupem
byl fiktivní přepis složený k tomuto případu; přepis sám se nezveřejňuje.
Ostatní sekce zůstávají ručně psané.

Blok „Doporučení založená na důkazech“ pod zápisy DeePsy, DAP a SIRP je doslovný
výstup DeePsy (`php spark generate:evidence --transcript-file … --modality
"Psychodynamická psychoterapie"`, 24. 9. 2026, modely glm-5.2, deepseek-v4-flash
a kimi) nad stejným fiktivním přepisem. Text je jen převedený do HTML, nic se
nepřepisovalo. Všechny citované články jsou skutečné a ověřené proti Crossref nebo
PubMed. Pipeline našla v sezení tři problémy; třetí („Popírání pozitivních
zkušeností“) při tomto běhu v jedné z fází selhal a ukázka ho neuvádí. Modalita je
záměrně jiná než kognitivně-behaviorální, aby bylo vidět, jak doporučení pracují
s evidencí z jiného přístupu.

Dotazníkové hodnoty byly vytvořeny z nových odpovědí a spočítány existujícím
skórovacím algoritmem DeePsy:

- CORE-10: 1,6 → 0,9;
- WHO-5: 2,2 → 2,8;
- SRS-3-B: nápomocné reakce 3,9; brzdící reakce 1,5.

## Lokální náhled

Z kořene repozitáře spusťte například:

```shell
python -m http.server 8000
```

Stránka bude na `http://localhost:8000/note-formats/`. Neobsahuje backend,
analytiku, cookies ani síťové požadavky na služby třetích stran. Jediné vnější
adresy jsou odkazy na citované články (doi.org, PubMed); otevře je až čtenář
kliknutím a odcházejí bez refereru.

## Kontrola před publikací

```shell
node note-formats/check.mjs
node --check note-formats/app.js
```

Vizuální podklady pocházejí z aplikace DeePsy. Písmo Montserrat je přibalené
lokálně a jeho licence SIL Open Font License je v `assets/OFL-Montserrat.txt`.
