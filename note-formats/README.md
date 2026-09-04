# Prototyp formátů terapeutického zápisu

Statická výzkumná ukázka čtyř způsobů zápisu jednoho fiktivního sezení:
plný zápis DeePsy, DAP, dekurz a GIRP.

## Ochrana zdroje

Veřejný případ je nová fiktivní kompozice tematicky inspirovaná pátým sezením
interní demo epizody. Neobsahuje zdrojový přepis, mapování na původní veřejná
videa ani jejich unikátní sled událostí. Změněny byly identifikační,
biografické, situační i další klinicky nepodstatné detaily.

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
analytiku, cookies ani síťové požadavky na služby třetích stran.

## Kontrola před publikací

```shell
node note-formats/check.mjs
node --check note-formats/app.js
```

Vizuální podklady pocházejí z aplikace DeePsy. Písmo Montserrat je přibalené
lokálně a jeho licence SIL Open Font License je v `assets/OFL-Montserrat.txt`.
