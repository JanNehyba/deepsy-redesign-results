# DeePsy Redesign Audit

> **Účel:** Jediný zdroj pravdy pro rozhodnutí, co se bude měnit v rámci vizuálního refinementu DeePsy. Bez auditu **nesmí žádná SCSS / PHP změna proběhnout**. Princip: _"Senior designer cleanup, not AI redesign."_
>
> **Zdroj:** Reálné PHP views v [`app/Views/`](../app/Views/), reálné screenshoty v [`design-screenshots/`](../design-screenshots/), barvy a komponenty v [`_sass/screen.scss`](../_sass/screen.scss). **Ne HTML mockupy** — ty byly chybná cesta, smazány v Fázi 0.

---

## Princip status legendy

Každý prvek má jeden ze statusů:

| Status | Význam |
|---|---|
| 🟢 **PRESERVE** | Zachovat 1:1 — funkce i vzhled. Část DeePsy DNA nebo dobře navržená komponenta. |
| 🔵 **MODERNIZE** | Vizuálně upravit (typografie / spacing / focus / kontrast) **bez změny** funkce nebo markupu. |
| 🟡 **MOVE** | Funkce zůstává, ale je dostupná z jiného místa (např. méně časté akce do `⋯` dropdownu, ne v top toolbaru). |
| ⚪ **HIDE** | Schovat za interakci — překrytí, expand, second click. Pro málo používané prvky. |
| 🔴 **REMOVE** | Odstranit — vždy s odůvodněním v poznámce. Vzácné. |

Každý řádek obsahuje:
- **Status** (1 z 5 výše)
- **Důvod** (proč právě tento status)
- **Zdroj** (screenshot path NEBO PHP view path:line NEBO SCSS path:line)
- **Akce** (konkrétní změna v Fázi 3, pokud `MODERNIZE` / `MOVE` / `HIDE` / `REMOVE`)

---

## 1. Globální layout (header / footer / glass)

Soubory: [`app/Views/templates/header.php`](../app/Views/templates/header.php), [`templates/footer.php`](../app/Views/templates/footer.php), [`templates/menu_authenticated.php`](../app/Views/templates/menu_authenticated.php), [`templates/menu_secondary.php`](../app/Views/templates/menu_secondary.php), [`_sass/screen.scss`](../_sass/screen.scss).

| Prvek | Status | Důvod | Zdroj | Akce v Fázi 3 |
|---|---|---|---|---|
| `.background.{context}` JPG pozadí (mořské vlnky) | 🟢 PRESERVE | DeePsy DNA — vizuální identita | `_sass/screen.scss:96-123` | – |
| `.foreground` z-index wrapper | 🟢 PRESERVE | Layout nutnost | `_sass/screen.scss:96-123` | – |
| `.glass` container (bílá karta uprostřed) | 🟢 PRESERVE | DeePsy DNA — vizuální identita | `_sass/screen.scss:719-723` | – |
| Cyan brand barva `#00b7d6` (`$blue`) | 🟢 PRESERVE | Brand barva | `_sass/screen.scss:24-47` | Sémantický alias `$brand-primary` v Fázi 2 |
| Logo `deepsy-logo-120x30.png` | 🟢 PRESERVE | Brand | `public/img/` + `menu_authenticated.php` | – |
| Top nav `.navbar-dark.navbar-primary` | 🟢 PRESERVE | Funkční, brand-correct | `_sass/screen.scss:249-300` + `menu_authenticated.php` | – |
| Top nav položky (Domů / Klienti / Epizody / Statistiky / Návod) | 🟢 PRESERVE | Reálná struktura | `menu_authenticated.php` | – |
| Top nav active state — cyan bottom border | 🟢 PRESERVE | Jasný indikátor | `_sass/screen.scss:281-285` | – |
| User dropdown vpravo (`Jan Nehyba ▾`) | 🟢 PRESERVE | Funkční | `menu_authenticated.php` | – |
| Role switcher v dropdownu (admin/site/therapist) | 🟢 PRESERVE | Funkční | `menu_authenticated.php` | – |
| Sekundární menu pruh (`.navbar-secondary`) | 🔵 MODERNIZE | Padding moc velký, hover state nečitelný | `_sass/screen.scss:316-350` + `menu_secondary.php` | Spacing tokens (`$space-3` / `$space-4`), jasnější hover (`$brand-primary-hover`) |
| Footer s loga MUNI/TAČR/BUT | 🟢 PRESERVE | DeePsy = výzkumný projekt — branding klíčový | `footer.php` | – |
| Cookie consent banner (`#cookie-consent`) | 🔵 MODERNIZE | 60% opacity black — slabý kontrast WCAG | `_sass/screen.scss:1007-1021` | Bg `rgba(14, 54, 65, 0.92)`, lepší kontrast |
| Modal `#confirmModal` | 🟢 PRESERVE | Funkční | `footer.php:48-100` | – |
| Modal `#alertModal` | 🟢 PRESERVE | Funkční | `footer.php:101-180` | – |
| Modal `#measureModal` (3 mode tabs: Direct/Email/Link) | 🟢 PRESERVE | Funkční, dobře navržená UX | `footer.php:181-270` | – |
| FontAwesome 6.5.2 ikony | 🟢 PRESERVE | Sjednocený icon library | `header.php:28` | – |
| Montserrat font (300, 700) | 🟢 PRESERVE | Brand font | `header.php:26` + `_sass/screen.scss:53-61` | – |
| `.list-table` tabulkový styl | 🔵 MODERNIZE | Cyan thead bg silný — modernější je světlejší | `_sass/screen.scss:1111-1185` | Thead bg `$surface-alt`, text `$brand-dark` (lepší kontrast) — **POZN. ke konzultaci** |
| Sort šipky `▲▼` (Unicode) | 🔵 MODERNIZE | Unicode šipky neelegantní | tabulky v list views | Lucide SVG ikona (nebo subtle decimal arrows) — **POZN. ke konzultaci** |
| Bootstrap `outline` focus | 🔵 MODERNIZE | Bootstrap default — nečitelný kontrast | global | `box-shadow` focus ring `$focus-ring-width $focus-ring-color` |
| `.button-primary` (cyan bg, hover dark) | 🟢 PRESERVE | Funkční | `_sass/screen.scss:479-510` | Možná `$space-3 $space-4` padding pro konzistenci |
| `.button-secondary` (transparent, cyan border) | 🟢 PRESERVE | Funkční | `_sass/screen.scss:511-540` | – |
| `.button-inline` (light bg + cyan text) | 🟢 PRESERVE | Funkční | `_sass/screen.scss:541-560` | – |
| `.button-measurement` (large, klient flow) | 🟢 PRESERVE | Funkční pro měření | `_sass/screen.scss:560-573` | – |
| Flash messages (`.alert.alert-{type}`) | 🔵 MODERNIZE | Bold white text na barvě — moderní je inverze (světlá bg, tmavý text) | `_sass/screen.scss:1031-1050` | Status `$status-*-bg` + text `$status-*` — **POZN. ke konzultaci** |
| Utility color classes (`.light` `.dark` `.blue` `.orange` `.yellow` `.red` `.green`) | 🟢 PRESERVE | Široce použité v PHP views | `_sass/screen.scss:163-194` | – |
| `.underline` (cyan bottom border link) | 🟢 PRESERVE | Funkční | `_sass/screen.scss:185-194` | – |
| Inline `<style>` v 7 views | 🔵 MODERNIZE | Údržbové utrpení — přesunout do SCSS partials | `app/Views/sessions_view.php:1-86`, atd. (Fáze 5 detail) | Přesunout do `_sass/_components/_*.scss` |
| Inline jQuery v `footer.php:36-270` | 🟢 PRESERVE | Funkční globální (confirmDialog, measureModal) | `footer.php` | – |

---

## 2. Dashboard (`/dashboard`)

Zdroj: [`design-screenshots/therapist/desktop/00_dashboard.png`](../design-screenshots/therapist/desktop/00_dashboard.png) + [`app/Views/dashboard_list.php`](../app/Views/dashboard_list.php).

| Prvek | Status | Důvod | Zdroj | Akce v Fázi 3 |
|---|---|---|---|---|
| H1 "/ DOMŮ" se slash prefixem | 🟢 PRESERVE | DeePsy stylové; brand-correct | screenshot + `_sass/screen.scss:153-161` (`.glass h1::before { content: "/"; }`) | Typo cleanup: weight + letter-spacing |
| News feed cards (zprávy s prioritou) | 🟢 PRESERVE | Reálná struktura DeePsy | screenshot | – |
| Priority pilulky (high / normal / info) | 🔵 MODERNIZE | Aktuálně via `.segment.{color}` — barvy plné, modernější je tlumené pill | `dashboard_list.php` + screenshot | `$status-*-bg` + text `$status-*` |
| NEW badge pro nepřečtené zprávy | 🟢 PRESERVE | Užitečný indikátor | screenshot | – |
| Author + date u zprávy | 🟢 PRESERVE | Funkční | screenshot | – |
| News-toggler "více / méně" | 🟢 PRESERVE | Funkční | screenshot | – |
| Admin Edit/Delete u zprávy | 🟡 MOVE | Vizuální šum pro non-admin; admin to vidí stejně přes `⋯` | `dashboard_list.php` | Do `⋯` dropdownu v rohu karty zprávy |
| Pagination zpráv | 🟢 PRESERVE | Funkční | `dashboard_list.php` | – |
| 4 klikací karty vpravo (Vyplň sezení / Něco se pokazilo / Příručka / DeePsy info) | 🟢 PRESERVE | DeePsy DNA — známý UX pattern | screenshot + `dashboard_list.php` | Spacing rytmus, žádná funkční změna |
| Oranžová karta "Vyplň prosím sezení" | 🟢 PRESERVE | Primární CTA terapeuta | screenshot | – |
| Modré karty (Pomoc / Příručka / Info / Co nového) | 🟢 PRESERVE | Sekundární akce | screenshot | – |
| Alert "Periodické měření terapeuta" (oranžový baner) | 🟢 PRESERVE | Real flow | `dashboard_list.php` | – |
| Alert "Neuzavřené epizody" | 🟢 PRESERVE | Real flow | `dashboard_list.php` | – |
| Consent upgrade alert | 🟢 PRESERVE | Real flow | `dashboard_list.php` | – |
| Empty state "Nemáte žádné zprávy" | 🔵 MODERNIZE | Holý text — vhodnější přidat ikonu + krátký vysvětlující text | screenshot + `dashboard_list.php` | Centered icon + 1-line vysvětlení |

---

## 3. Klienti — list (`/clients/list`)

Zdroj: [`design-screenshots/therapist/desktop/10_clients_list.png`](../design-screenshots/therapist/desktop/10_clients_list.png) + [`app/Views/clients_list.php`](../app/Views/clients_list.php).

| Prvek | Status | Důvod | Zdroj | Akce v Fázi 3 |
|---|---|---|---|---|
| H1 "/ KLIENTI (1)" s počtem | 🟢 PRESERVE | DeePsy styl | screenshot + `clients_list.php` | Typo cleanup |
| Subnav: pill "Aktivní" / "Neaktivní" | 🟢 PRESERVE | Funkční filtr | `menu_secondary.php` | – |
| Subnav: "+ Nový klient" tlačítko (oranžová `.nav-item.orange`) | 🟢 PRESERVE | Primární akce | `menu_secondary.php` | – |
| Search input + lupa ikona | 🟢 PRESERVE | Funkční | screenshot | – |
| `.list-table` thead (KLIENT / E-MAIL / EPIZODY / UPOZORNĚNÍ) | 🔵 MODERNIZE | Cyan thead bg agresivní | `_sass/screen.scss:1111-1185` | Světlejší thead variant (viz globální audit) |
| Sortable column header (s ▲▼) | 🔵 MODERNIZE | Unicode šipky | `_sass/screen.scss:1163-1166` | Subtle inline-svg arrow nebo decimal arrows |
| Klikatelný řádek (`tr.row.clickable[data-url]`) | 🟢 PRESERVE | Funkční | `clients_list.php:48` + `pagination.php` | – |
| Klient name (link) | 🟢 PRESERVE | Funkční | `clients_list.php:51-54` | – |
| Email column | 🟢 PRESERVE | Funkční | `clients_list.php:55` | – |
| Episode count column | 🟢 PRESERVE | Funkční info | `clients_list.php:56` | – |
| Status alerts 3-stack ikony (outcome/suicidality/process) | 🟢 PRESERVE | DeePsy DNA — klinicky kritické | `clients_list.php:59-64` + `app/Helpers/monitor_helper.php:61-67` | – |
| Status alert tooltip (hover) | 🟢 PRESERVE | Funkční | tooltip `data-toggle="tooltip"` | – |
| Pagination (10 / 20 / 30 per page) | 🟢 PRESERVE | Funkční | `pagination.php` | – |
| Empty state "Žádné záznamy" | 🔵 MODERNIZE | Holý text | `clients_list.php:72-73` | Friendly empty state + CTA "Vytvořit prvního klienta" |
| "Klient bez souhlasu" warning v řádku | 🟢 PRESERVE | Klinicky důležité | `clients_list.php` | – |

---

## 4. Klient — view (`/clients/view/{id}`)

Zdroj: [`design-screenshots/therapist/desktop/13_clients_view.png`](../design-screenshots/therapist/desktop/13_clients_view.png) + [`app/Views/clients_view.php`](../app/Views/clients_view.php) (129 řádků).

| Prvek | Status | Důvod | Zdroj | Akce v Fázi 3 |
|---|---|---|---|---|
| 2-sloupcový layout (`.d-flex flex-column flex-lg-row`) | 🟢 PRESERVE | DeePsy struktura | `clients_view.php:1` | – |
| **NESMÍ být taby** | 🔴 REMOVE (z plánu) | Verze 1 mockupu mylně přidala taby — DeePsy je NEMÁ | – | Žádné taby! Klient = 2-sloupcový profil. |
| Levý sloupec `.segment.light.flex-2` | 🟢 PRESERVE | DeePsy struktura | `clients_view.php:3` | – |
| H1 = jméno klienta (`$client->fullname()`) | 🟢 PRESERVE | – | `clients_view.php:5` | Typo cleanup |
| Initial measurement retake button | 🟢 PRESERVE | Funkční | `clients_view.php:7-15` | – |
| Demografická tabulka (věk, pohlaví, vzdělání, medikace) | 🟢 PRESERVE | Klinicky důležité | `clients_view.php:17-65` (extrakce z InitialBasic) | – |
| `.horizontal-lines` tabulka stylu | 🔵 MODERNIZE | Border styly | `_sass/screen.scss` (search `horizontal-lines`) | Spacing + line-height |
| Souhlasy tabulka (mandatory + recordings) | 🟢 PRESERVE | Klinicky důležité | `clients_view.php:67-81` | – |
| "Regenerate consent" link (modal trigger) | 🟢 PRESERVE | Funkční | `clients_view.php:71, 78` | – |
| Rodné číslo + pojišťovna (pokud `dekurz_enabled`) | 🟢 PRESERVE | Pro dekurz | `clients_view.php:82-89` | – |
| E-mail + jazyk | 🟢 PRESERVE | – | `clients_view.php:90-91` | – |
| Initial + pre_episode instrument tables (`Charts::genericTable`) | 🟢 PRESERVE | Vstupní měření | `clients_view.php:94-106` | – |
| Pravý sloupec `.segment.light.flex-1` | 🟢 PRESERVE | – | `clients_view.php:110` | – |
| H1 "Epizody" | 🟢 PRESERVE | – | `clients_view.php:112` | – |
| `<ol reversed>` seznam epizod (od nejnovější) | 🟢 PRESERVE | Funkční | `clients_view.php:114-126` | – |
| Anchor na `/episodes/view/{id}` | 🟢 PRESERVE | – | `clients_view.php:123` | – |
| Aktivní epizoda label `(aktivní)` | 🟢 PRESERVE | – | `clients_view.php:120` | – |
| Sekundární menu (Upravit / Smazat / Nová epizoda / Export) | 🟡 MOVE | Šum, akce nesouvisí s primárním tokem | `menu_secondary.php` (kontext clients/view) | `[Zaznamenat sezení]` primary + `[Otevřít průběh]` secondary + `[Poslat měření]` secondary + `⋯` (Upravit/Smazat/Export) — viz Fáze 4 |
| **NOVÉ: "Rychlé akce" sekce** (Fáze 4) | 🆕 NEW | UX zlepšení — primární akce viditelná | – | Přidat sekci mezi demografii a epizody pro aktivního klienta (viz plán Fáze 4) |

---

## 5. Epizody — list (`/episodes/list`)

Zdroj: [`design-screenshots/therapist/desktop/20_episodes_list.png`](../design-screenshots/therapist/desktop/20_episodes_list.png) + [`app/Views/episodes_list.php`](../app/Views/episodes_list.php).

| Prvek | Status | Důvod | Zdroj | Akce v Fázi 3 |
|---|---|---|---|---|
| H1 "/ EPIZODY (N)" | 🟢 PRESERVE | DeePsy styl | screenshot | – |
| Subnav: Aktivní / Neaktivní + "+ Nová epizoda" | 🟢 PRESERVE | Funkční | `menu_secondary.php` | – |
| Search + filter (setting + label) | 🟢 PRESERVE | Funkční | `episodes_list.php` | – |
| `.list-table` (EPIZODA / PRVNÍ SEZ. / POSLEDNÍ SEZ. / SEZENÍ / UPOZORNĚNÍ) | 🟢 PRESERVE | Funkční struktura | screenshot + `episodes_list.php` | Modernizace stejně jako u klienty list |
| Klikatelný řádek (`tr.row.clickable[data-url]`) | 🟢 PRESERVE | – | `episodes_list.php:81` | – |
| Alert "suggested closing" | 🟢 PRESERVE | Funkční | `episodes_list.php` | – |
| Alert "post-episode unanswered" | 🟢 PRESERVE | Funkční | `episodes_list.php` | – |
| Status alerts (outcome / suicidality / process) | 🟢 PRESERVE | DeePsy DNA | `episodes_list.php:91-93` | – |
| Pagination | 🟢 PRESERVE | – | `pagination.php` | – |

---

## 6. Epizoda — view (`/episodes/view/{id}`) — TOP priorita

> **Zdroj:** [`design-screenshots/therapist/desktop/23_episodes_view.png`](../design-screenshots/therapist/desktop/23_episodes_view.png) (captured 2026-05-24 po fix Playwright resolveru).
> **PHP:** `app/Views/episodes_view.php` (2 034 řádků — největší view).
>
> **Reálné prvky pozorované na screenshotu:**
> - Sekundární menu nahoře (Upravit epizodu / Přejít na klienta / Poslat dotazník / Nahrávka / Sdílet přístup / Souhrn poznámek / Smazat epizodu)
> - 2-sloupcový layout: levý `/ EPIZODA` meta (1. terapie, Začátek 23.1.2026, Klient Pepa Veverka, MKN-10 F32 + F33), pravý `/ PŘEJÍT NA SEZENÍ` + `/ NOVÉ SEZENÍ` form
> - Tab "Cílový distres (CORE-10)" s legendou + ZingChart s konfidenčními intervaly (red/yellow/green zones)
> - Checkbox filtry nad grafem (Klienti, Vlastní hodnocení, Reaktivita, Preference, Účinnost)
> - Kartičky účastníků (avatar + jméno)
> - Tabulka položek pod grafem
> - "/ ŠTÍTKY" sekce s "Přidat štítek" button

| Prvek | Status | Důvod | Zdroj | Akce v Fázi 3 |
|---|---|---|---|---|
| Levý sloupec metadata (vlastník, název, time_start/end, setting, projekt, pracoviště) | 🟢 PRESERVE | Funkční detail | `episodes_view.php` | Modernizace typography |
| MKN-10 diagnózy (primary + secondary) | 🟢 PRESERVE | Klinicky kritické pro dekurz | `episodes_view.php` | – |
| MKN-10 autocomplete search | 🟢 PRESERVE | Funkční | `episodes_view.php` (`#diagnosis-search`) | – |
| Primary diagnosis označení | 🟢 PRESERVE | – | `episodes_view.php` | – |
| Pravý sloupec: tabs klientů (`tabs_clients.php`) | 🟢 PRESERVE | Pro group/couple sezení | `app/Views/templates/tabs_clients.php` | – |
| TABS s instrumenty + ZingChart grafy | 🟢 PRESERVE | DeePsy DNA — kritické pro průběh | `episodes_view.php` | – |
| Tab nav (Bootstrap nav-tabs) | 🔵 MODERNIZE | Bootstrap default | `_sass/screen.scss` (nav-tabs) | Modernizace underline + hover |
| ZingChart grafy (per instrument) | 🟢 PRESERVE | Kritická data viz | `episodes_view.php` + `Charts::*` | – |
| Charts: `itemTable`, `genericTable`, `semanticDifferentialTable` | 🟢 PRESERVE | Funkční | `app/Libraries/Charts.php` | – |
| Toggle viditelnosti řad grafu (`togglePlotVisibility`) | 🟢 PRESERVE | Funkční | `footer.php:64-183` | – |
| Tooltip + legenda instrumentů | 🟢 PRESERVE | – | `episodes_view.php` | – |
| Measure button + modal (3 způsoby) | 🟢 PRESERVE | DeePsy flow | `episodes_view.php` + `#measureModal` | – |
| Sekundární menu (Edit / Manage clients / Close / Manage access / Notes / Export / Delete) | 🟡 MOVE | Příliš mnoho akcí v pruhu | `menu_secondary.php` (kontext episodes/view) | Primární "Zaznamenat sezení" + sekundární `⋯` (Edit / Manage clients / Manage access / Notes / Export / Close / Delete) |

---

## 7. Sezení — view (`/sessions/view/{id}`) — HLAVNÍ PRACOVNÍ OBRAZOVKA

> **Zdroj:** [`design-screenshots/therapist/desktop/31_sessions_view.png`](../design-screenshots/therapist/desktop/31_sessions_view.png) (captured 2026-05-24 — sezení **bez nahrávky**, alt stav).
> **PHP:** `app/Views/sessions_view.php` (2 980 řádků — největší view DeePsy).
>
> **Alt stav (bez nahrávky) pozorován na screenshotu:**
> - H1 "/ 6. SEZENÍ (1. 3. 2026) — PEPA"
> - Jen 1 tab "Dotazníky" viditelný (Poznámka/Dekurz/Přepis/Grafy chybí bez recording)
> - Sekce "Zadat dotazník PŘED SEZENÍM" + "Zadat dotazník PO SEZENÍ"
> - Buttons "Vyplnit klient" / "Vyplnit klient" (post-session) / "Vyplnit terapeut" (post-session)
>
> **Plný stav (s nahrávkou)** nepokrytý automaticky — pro audit detailu se odvolávám na `app/Views/sessions_view.php` strukturu (tabs 113-148) + structure.php (8 AI sekcí).

### 7.1 Header

| Prvek | Status | Důvod | Zdroj | Akce |
|---|---|---|---|---|
| H1 "X. sezení (datum) — jméno klienta" | 🟢 PRESERVE | Funkční | `sessions_view.php:103` | Typo cleanup |
| Prev/Next navigace sezení (šipky) | 🟢 PRESERVE | Funkční | `sessions_view.php:99-102` | – |

### 7.2 Tab navigace (5 tabů)

Definováno v `sessions_view.php:113-148`.

| Tab | Status | Důvod | Akce |
|---|---|---|---|
| **Dotazníky** (`fa-clipboard-list`) — pre/post measurement, klient/terapeut | 🟢 PRESERVE | Funkční | – |
| **Poznámka** (`fa-notes-medical`) — AI poznámka 8 sekcí | 🟢 PRESERVE | Funkční | – |
| **Dekurz** (`fa-file-medical`) — jen pokud `dekurz_enabled` | 🟢 PRESERVE | Funkční | – |
| **Přepis** (`fa-file-alt`) — jen pokud recording | 🟢 PRESERVE | Funkční | – |
| **Grafy** (`fa-chart-area`) — NLP analýzy | 🟢 PRESERVE | Funkční | – |
| Alt stav "Nahrávka" upload (`fa-upload`) — jen bez recording | 🟢 PRESERVE | Funkční | – |
| Tab nav styling (inline `<style>` v sessions_view.php:1-86) | 🔵 MODERNIZE | Inline CSS — Fáze 5 přesunout do `_sass/_components/_session-tabs.scss` | `sessions_view.php:1-86` | Přesun (žádná vizuální změna) |
| Tab active state — cyan underline | 🟢 PRESERVE | DeePsy styling | `sessions_view.php:65-72` | – |

### 7.3 Tab Dotazníky

| Prvek | Status | Důvod | Zdroj | Akce |
|---|---|---|---|---|
| Pre-session measurement button (client + therapist) | 🟢 PRESERVE | Funkční | `sessions_view.php:165-200` | – |
| Post-session measurement button | 🟢 PRESERVE | Funkční | `sessions_view.php:165-200` | – |
| State `finished` / `needed` / `skipped` / `not-defined` | 🟢 PRESERVE | – | – | – |
| "Klient bez souhlasu" disabled measure button | 🟢 PRESERVE | Klinicky důležité | `sessions_view.php:178-184` | – |
| Result tables per instrument (`Charts::itemTable`) | 🟢 PRESERVE | – | – | – |

### 7.4 Tab Poznámka — AI poznámka 8 sekcí

Zdroj: [`app/Config/TherapyNote/structure.php`](../app/Config/TherapyNote/structure.php) (single source of truth).

| Sekce (key → label) | Status | Subsekce |
|---|---|---|
| `data` → **DATA** | 🟢 PRESERVE | Hlavní témata / Problémy a symptomy / Terapeutické cíle / Zdroje a silné stránky / Důležité osoby |
| `questionnaire_summary` → **HODNOCENÍ — Sumarizace dotazníků** | 🟢 PRESERVE | Aktuální skóry / Analýza změny / Klinická interpretace |
| `risk_assessment` → **HODNOCENÍ — Hodnocení rizika** | 🟢 PRESERVE | Riziko sebevraždy / Sebepoškozování / Návykové látky / Bezpečnostní plán |
| `clinical_hypotheses` → **HODNOCENÍ — Klinické hypotézy** | 🟢 PRESERVE | Hypotézy (KBT / psychodynamický / systemický / existenciální) |
| `constructs` → **HODNOCENÍ — Konstrukty / Fenomény** | 🟢 PRESERVE | Identifikované fenomény / Nejisté fenomény |
| `progress` → **HODNOCENÍ — Hodnocení změny / progresu** | 🟢 PRESERVE | Zlepšení / Beze změny / Zhoršení / Pozorování terapeuta |
| `alliance` → **HODNOCENÍ — Terapeutická aliance** | 🟢 PRESERVE | Kvalita aliance / Emoční pouto / Spolupráce / Brzdící faktory / Doporučení |
| `plan` → **PLÁN** | 🟢 PRESERVE | Terapeutický plán / Nevyřešené problémy / Úkoly mezi sezeními / Doporučení / Krizové plánování |

| Komponenta | Status | Důvod | Akce |
|---|---|---|---|
| Generate button | 🟢 PRESERVE | Funkční | `sessions_view.php:261` | – |
| Progress indicator generování (1/8, 2/8, …) | 🟢 PRESERVE | Funkční | – | – |
| Bubble toolbar editor | 🟢 PRESERVE | Funkční | `sessions_view.php:270-280` | – |
| Per-section auto-save indicator | 🟢 PRESERVE | Funkční | – | – |
| Approve / Unapprove button | 🟢 PRESERVE | Funkční | – | – |
| Warning banner "neschváleno" | 🟢 PRESERVE | Funkční | `sessions_view.php:307` | – |
| Toast UI Editor styling (inline `<style>` v sessions_view.php:1558-1680) | 🔵 MODERNIZE | Inline CSS — Fáze 5 | `sessions_view.php:1558-1680` | Přesun do `_sass/_components/_note-editor.scss` |

### 7.5 Tab Dekurz

| Prvek | Status | Důvod | Akce |
|---|---|---|---|
| Diagnostika MKN-10 metadata | 🟢 PRESERVE | Klinicky kritické | – |
| Patient + pojišťovna metadata | 🟢 PRESERVE | Pro pojišťovnu | – |
| IČP + IČZ (z account/edit) | 🟢 PRESERVE | Pro pojišťovnu | – |
| Výkon code | 🟢 PRESERVE | Pro pojišťovnu | – |
| Generate dekurz button | 🟢 PRESERVE | Funkční | `sessions_view.php:293` | – |
| Approve dekurz button | 🟢 PRESERVE | Funkční | – | – |
| Warning "Diagnóza klienta není zadána" | 🟢 PRESERVE | Klinicky důležité | `sessions_view.php:289-310` | – |
| Bubble toolbar editor (stejně jako poznámka) | 🟢 PRESERVE | – | – |

### 7.6 Tab Přepis

| Prvek | Status | Důvod | Zdroj | Akce |
|---|---|---|---|---|
| Audio player (MediaElement.js) | 🟢 PRESERVE | DeePsy DNA | `sessions_view.php` | – |
| Přepis tabulka (věty po větách s timestampy) | 🟢 PRESERVE | Funkční | `sessions_view.php` | – |
| Sync zvýraznění během přehrávání | 🟢 PRESERVE | UX vyšperkované | `sessions_view.php:471-560` | – |
| Klikatelná věta = jump na čas | 🟢 PRESERVE | – | – | – |
| Inline `<style>` highlight (sessions_view.php:377-396) | 🔵 MODERNIZE | Inline CSS — Fáze 5 | `sessions_view.php:377-396` | Přesun do `_sass/_components/_transcript.scss` |
| Stav "Generuje se přepis" (spinner) | 🟢 PRESERVE | – | `sessions_view.php:845-890` | – |
| Stav "Chyba přepisu" (retry button) | 🟢 PRESERVE | – | `sessions_view.php:831-840` | – |
| "Zastaralý formát" warning + retranscribe | 🟢 PRESERVE | – | `sessions_view.php:810-825` | – |
| Hide nepřesnosti slider | 🟢 PRESERVE | UX | `sessions_view.php:933` | – |
| Automatically scroll checkbox | 🟢 PRESERVE | UX | `sessions_view.php:933` | – |
| Download transcript button | 🟢 PRESERVE | Funkční | `sessions_view.php:933` | – |

### 7.7 Tab Grafy (NLP)

| Prvek | Status | Důvod | Akce |
|---|---|---|---|
| Speed chart (rychlost řeči) | 🟢 PRESERVE | Funkční | – |
| Sentiment chart klient + terapeut | 🟢 PRESERVE | Funkční | – |
| Tense chart klient + terapeut | 🟢 PRESERVE | Funkční | – |
| ZingChart styling overrides (inline `<style>`) | 🔵 MODERNIZE | Inline CSS — Fáze 5 | Přesun do `_sass/_components/_charts.scss` |

### 7.8 Sekundární menu sessions/view

| Prvek | Status | Důvod | Akce |
|---|---|---|---|
| "Back to episode" link | 🟢 PRESERVE | Funkční | – |
| Edit / Manage clients / Notes / Delete | 🟡 MOVE | Šum | Primární "Schválit poznámku" + `⋯` (Edit / Manage clients / Notes / Delete / Stáhnout nahrávku / Stáhnout přepis / Retranscribe) |

---

## 8. Co je výslovně mimo rozsah tohoto auditu

- **Admin role** — `/projects/*`, `/users/*`, `/sites/*`, `/adminclients/*`. Bude audited v další fázi po dokončení 6 klíčových obrazovek.
- **Měřicí flow** — `/m/{linkID}/*`. Aktuálně čistý, soustředěný UX. Modernizace jen typo/spacing.
- **Souhlasy** — `/consents/*`. Aktuálně čistý flow.
- **Veřejné stránky** — landing / about / login / register. Audit later.
- **Statistiky** — `/indivstats` (HTTP 500 v lokální DB). Audit po naseedování pre-episode dat.
- **Štítky** (`/labels`), **Odznaky** (`/badges`), **Account** (`/account/*`) — minoritní obrazovky, audit later.

---

## 9. Stop pravidla (pro implementaci v Fázích 2–5)

- ❌ **Nepřidávat nový framework** (Tailwind / React / Vue)
- ❌ **Negenerovat fake content** (umělé statistiky, AI dashboardy, SaaS hero)
- ❌ **Nepřejmenovávat CSS třídy** (`.list-table`, `.button-primary`, atd. — lámalo by se JS / view)
- ❌ **Nepřepisovat HTML markup v PHP views** (kromě Fáze 4 — quick actions v `clients_view.php`)
- ❌ **Nezavádět SOAP poznámku** — DeePsy má 8 vlastních AI sekcí (`structure.php`)
- ❌ **Nerušit `/episodes/view`** — zůstává plnohodnotná obrazovka
- ❌ **Nerušit ZingChart / CKEditor / MediaElement** — funkční komponenty
- ❌ **Nepřidávat trendy aesthetic** (gradient blobs, glassmorphism, neon, AI illustrations)
- ❌ **Nepřejmenovávat datový model** (Episode entity, Client entity — zůstávají)
- ❌ **Neměnit routes ani controller logic**

---

## 10. Akční seznam pro Fázi 3 (souhrn `MODERNIZE` položek)

Pro každý 🔵 MODERNIZE záznam výše:

1. **Sekundární menu padding/hover** — `_sass/screen.scss:316-350`
2. **Cookie banner kontrast** — `_sass/screen.scss:1007-1021`
3. **`.list-table` thead barva** — `_sass/screen.scss:1111-1185` (POZN. konzultace)
4. **Sort šipky modernizace** — tabulky v list views (POZN. konzultace)
5. **Bootstrap focus → brand focus ring** — globální
6. **Flash messages styling** — `_sass/screen.scss:1031-1050` (POZN. konzultace)
7. **Dashboard priority pilulky** — `dashboard_list.php`
8. **Empty states** — `clients_list.php:72-73`, `dashboard_list.php`
9. **`.horizontal-lines` tabulka** — `_sass/screen.scss` (search "horizontal-lines")
10. **Bootstrap nav-tabs styling** — `episodes_view.php` + `sessions_view.php`
11. **Typo cleanup** napříč H1 / H2 / H3 (Fáze 2 tokens)

**POZN. konzultace:** Tři položky vyžadují tvoje rozhodnutí, protože jsou subjektivní:
- Thead barva tabulek (cyan současně vs. světlejší modernější)
- Sort šipky (Unicode vs. SVG ikona)
- Flash messages (bold bílá současně vs. tlumený light bg)

---

## 11. Akční seznam pro Fázi 4 (UX zjednodušení epizody)

V [`app/Views/clients_view.php`](../app/Views/clients_view.php) přidat sekci **"Rychlé akce"** mezi demografii a tabulku souhlasů:

```php
<?php
$activeEpisode = null;
foreach ($client->episodes as $ep) {
    if (!$ep->time_end) { $activeEpisode = $ep; break; }
}
if ($activeEpisode):
?>
<div class="segment light quick-actions mb-3">
    <h2><?= lang('general.clients.quick_actions'); ?></h2>
    <div class="d-flex flex-wrap" style="gap: 12px;">
        <a href="/sessions/new?episodeID=<?= $activeEpisode->id ?>" class="button button-primary"><?= icon('plus'); ?> <?= lang('general.clients.record_session'); ?></a>
        <a href="/episodes/view/<?= $activeEpisode->id ?>" class="button button-secondary"><?= icon('chart-line'); ?> <?= lang('general.clients.open_progress'); ?></a>
        <a href="#measureModal" data-toggle="modal" class="button button-secondary" data-controller="clients/measure" data-params="<?= $client->id ?>"><?= icon('clipboard-list'); ?> <?= lang('general.clients.send_measurement'); ?></a>
    </div>
</div>
<?php endif; ?>
```

Lang strings v `app/Language/cs_CZ/general.php`:
```php
'clients' => [
    'quick_actions'    => 'Rychlé akce',
    'record_session'   => 'Zaznamenat sezení',
    'open_progress'    => 'Otevřít průběh epizody',
    'send_measurement' => 'Poslat měření',
    // …
],
```

---

## 12. Test plan (pro každou implementaci v Fázi 2+)

1. **Před změnou:** `node scripts/capture-screenshots.js --role=therapist --no-mobile`
2. **Po změně:** `node scripts/capture-screenshots.js --role=therapist --no-mobile`
3. **Diff:** ImageMagick `compare` mezi dvojicemi PNG
4. **Manuál:** klikat napříč 6 obrazovkami, ověřit funkčnost
5. **Accessibility:** Lighthouse + axe — WCAG AA
6. **Mobile breakpoint:** Chrome DevTools 375×812
7. **Console errors:** žádné JS errory v běžícím Monitoru

---

## 13. Changelog

- **2026-05-24** — V1.0. Vytvořeno na základě reálných screenshotů + PHP views + design_podklady.md. Cíl: jediný zdroj pravdy pro Fáze 2–5.
