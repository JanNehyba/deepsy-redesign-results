# DeePsy redesign — výsledky konzervativního cleanup

> ⚠ **Test data only — no real patients.** Všechny screenshoty v tomto
> repozitáři pocházejí z lokální vývojové databáze s **fiktivními testovacími
> daty** (jméno "Pepa Veverka", testovací MKN-10 kódy F32 / F33). Žádná
> reálná pacientská data nejsou v repozitáři přítomna.

Veřejný repozitář s výsledky první fáze redesignu klinického monitorovacího
systému [DeePsy](https://deepsy.cz). **Obsahuje jen výsledky** (before/after
screenshoty + audit), žádný zdrojový kód Monitoru.

**Webová verze:** [jannehyba.github.io/deepsy-redesign-results](https://jannehyba.github.io/deepsy-redesign-results/)

## Princip

> **Senior designer cleanup, not AI redesign.**

První fáze redesignu DeePsy je **konzervativní vizuální cleanup** existující
PHP/Bootstrap aplikace. Cíl není nový redesign nebo migrace do jiného stacku
— cíl je modernizovat čitelnost, hierarchii a denní flow terapeuta při
zachování brand identity (cyan tyrkysová, glass karty, MUNI/TAČR kontext).

Postup:
1. **Audit** každého prvku (PRESERVE / MODERNIZE / MOVE / HIDE / REMOVE) — viz [AUDIT.md](AUDIT.md)
2. **Design tokens layer** v SCSS (sémantické aliasy nad současnými barvami)
3. **Konzervativní cleanup** podle auditu — typografie, spacing, focus, button cohesion
4. **UX zlepšení** kde má smysl — např. "Rychlé akce" v klient view

## Co se podařilo (v této fázi)

- ✅ Modernizovaný thead tabulek (světlý + cyan border místo plné cyan + bílá)
- ✅ SVG sort šipky (konzistentní v každém prohlížeči)
- ✅ Light bg + ikona flash messages (čitelnější)
- ✅ **NOVÉ:** Quick actions v klient view (1 klik místo 5 pro nové sezení)
- ✅ Design tokens layer v SCSS
- ✅ Cleanup chybné cesty (HTML mockupy z dřívějšího pokusu)

## Co se NEMĚNILO záměrně

- Datový model (Episode entity zůstává jako samostatný objekt)
- Routes, controllers, JS chování
- ZingChart grafy, CKEditor, audio player MediaElement
- Brand identity (cyan #00b7d6, glass karty, MUNI/TAČR footer)
- HTML markup mimo `clients_view.php` (Quick actions sekce)

## Co je mimo rozsah této fáze

- Admin role (`/projects`, `/sites`, `/users`)
- Měřicí flow pro klienty (`/m/{linkID}`)
- Souhlasy (`/consents/*`)
- Veřejné stránky (landing, about, login, register)
- Inline CSS cleanup (7 view souborů s `<style>` — Fáze 5, později)

## Soubory v tomto repu

| Soubor | Co to je |
|---|---|
| [index.html](index.html) | Landing — rozcestník výsledků |
| [before-after.html](before-after.html) | Side-by-side srovnání 4 klíčových obrazovek |
| [AUDIT.md](AUDIT.md) | Kompletní audit (600+ řádků, mapování každého prvku) |
| `before/` | Screenshoty z commitu 795f29eb (před Fází 3+4) |
| `after/` | Screenshoty z commitu 52391d40 (po Fázi 3+4) |

## Technický kontext

- **Stack:** CodeIgniter 4 + Bootstrap 4.5 + jQuery 3.5 + SCSS + ZingChart + CKEditor 5 + Montserrat
- **Zdrojový kód:** `JanNehyba/monitor-notes` (privátní)
- **Plán:** `JanNehyba/monitor-notes/.claude/plans/dob-e-ulo-mi-kroky-compiled-liskov.md`

## Reference

- [Nielsen Norman Group — AI as a UX Assistant](https://www.nngroup.com/articles/ai-roles-ux/)
- [Bootstrap 4 Theming](https://getbootstrap.com/docs/4.0/getting-started/theming/)
- [Sam Smith — Use design tokens to customise Bootstrap](https://smth.uk/use-design-tokens-to-customise-bootstrap/)

---

Vytvořeno 2026-05-24. Vyvinuto na **MUNI FSS** ([Centrum pro výzkum
psychoterapie](https://psychoterapie.fss.muni.cz/)) · Brno.
