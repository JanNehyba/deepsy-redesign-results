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

Sbalený blok „Doporučení založená na důkazech“ pod zápisy DeePsy, DAP a SIRP je
doslovný výstup DeePsy nad stejným fiktivním přepisem:
- vznikl příkazem `php spark generate:evidence --transcript-file … --modality
  "Psychodynamická psychoterapie"` 24. 9. 2026;
- český text psal `deepseek` (u jedné fáze záložně `kimi`), vyhledávání a čtení abstraktů `deepseek-v4-flash`;
- do HTML je jen převedený, nic se nepřepisovalo;
- všechny citované články jsou skutečné a ověřené proti Crossref nebo PubMed.

Modalita je záměrně jiná než kognitivně-behaviorální, aby bylo vidět, jak doporučení
pracují s evidencí z jiného přístupu. Tvar bloku odpovídá kartě v aplikaci:
- jen odrážky s citacemi APA, které vedou přímo na článek;
- věta k přístupu terapeuta a limity výzkumu;
- štítek síly dokladů s tooltipem, který vysvětluje stupnici;
- žádný úvod ani seznam zdrojů.

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
