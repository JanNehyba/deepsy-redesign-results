import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const html = await readFile(join(directory, "index.html"), "utf8");
const css = await readFile(join(directory, "styles.css"), "utf8");
const js = await readFile(join(directory, "app.js"), "utf8");
const publicSources = `${html}\n${css}\n${js}`;

function stripMarkup(value) {
	return value
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/&[a-z]+;/gi, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function countWords(value) {
	return (value.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || []).length;
}

function noteBody(format) {
	const match = html.match(
		new RegExp(`<div class="note-body[^"]*" data-note-body="${format}"[^>]*>([\\s\\S]*?)\\n\\t\\t\\t\\t</div>`),
	);
	assert.ok(match, `Text formátu ${format} nebyl nalezen`);
	return match[1];
}

assert.match(html, /<meta name="robots" content="noindex, nofollow, noarchive">/);
assert.match(html, /Jana N\. není skutečná klientka a text není zdravotnickou dokumentací\./);

const tabOrder = ["deepsy", "dap", "sirp", "dekurz"];

for (const format of tabOrder) {
	assert.match(html, new RegExp(`id="tab-${format}"[\\s\\S]*?aria-controls="panel-${format}"`));
	assert.match(html, new RegExp(`id="panel-${format}"[\\s\\S]*?aria-labelledby="tab-${format}"`));
	assert.match(html, new RegExp(`data-note-body="${format}"`));
}

assert.equal((html.match(/role="tab"/g) || []).length, tabOrder.length);
assert.equal((html.match(/role="tabpanel"/g) || []).length, tabOrder.length);

for (let index = 1; index < tabOrder.length; index += 1) {
	assert.ok(
		html.indexOf(`id="tab-${tabOrder[index - 1]}"`) < html.indexOf(`id="tab-${tabOrder[index]}"`),
		`Záložka ${tabOrder[index]} má následovat po ${tabOrder[index - 1]}`,
	);
}

assert.ok(html.indexOf('class="source-notice') > html.indexOf('id="panel-dekurz"'));
assert.doesNotMatch(html, /word-count|data-word-count-for/, "Počty slov nemají být veřejně zobrazené");
assert.doesNotMatch(html, /<h3>[DAGIRPBS]\s+—/, "Nadpisy sekcí nemají obsahovat písmeno zkratky");
assert.match(html, /Zkratka DAP označuje Data, Assessment \(hodnocení\) a Plan \(plán\)/);
assert.match(html, /Zkratka SIRP označuje Situation \(situace\), Intervention \(intervence\), Response \(reakce\) a Plan \(plán\)/);

const forbidden = [
	[/Konstrukty|Fenomény/i, "zakázaná sekce"],
	[/\bHEs\b/i, "artefakt HEs"],
	[/\bJana\s+[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][\p{L}-]{2,}/u, "celé jméno"],
	[/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/, "e-mail"],
	[/(?:\+420\s*)?(?:\d[ -]?){9}/, "telefonní číslo"],
	[/kofein|zvracen|meditac|hledání práce|matk[ay]|sestr[ay]/i, "detail zdrojového případu"],
	[
		/bez (?:přiřazeného|výpočtu|posouzení)|nebyla posouzena|nebylo posouzeno|samotné skóry však|není k dispozici informace|informace o statistické spolehlivosti/i,
		"hedging o chybějících psychometrických datech",
	],
];

for (const [pattern, label] of forbidden) {
	assert.doesNotMatch(stripMarkup(html), pattern, `Nalezeno: ${label}`);
}

// Stránka nic nenačítá z cizích serverů. Jediné povolené adresy jsou odkazy na
// citované články (doi.org, PubMed), na které čtenář klikne sám.
const citationLink = /<a href="https:\/\/(?:doi\.org\/10\.\d{4,9}\/[^"\s]+|pubmed\.ncbi\.nlm\.nih\.gov\/\d+\/)" rel="noopener noreferrer" referrerpolicy="no-referrer">/g;
assert.doesNotMatch(
	publicSources.replace(citationLink, ""),
	/https?:\/\//i,
	"Veřejná stránka nesmí načítat vzdálené zdroje; povolené jsou jen odkazy na citované články",
);

for (const asset of html.matchAll(/(?:src|href)="(assets\/[^"#?]+)"/g)) {
	await access(join(directory, asset[1]));
}

const deepsyBody = noteBody("deepsy");
const deepsyWords = countWords(stripMarkup(deepsyBody));
assert.ok(deepsyWords >= 750 && deepsyWords <= 900, `Plný zápis DeePsy má ${deepsyWords} slov; očekáváno je 750–900`);
assert.deepEqual(
	Array.from(deepsyBody.matchAll(/<h3>([^<]+)<\/h3>/g), (match) => match[1]),
	[
		"Data",
		"Hodnocení — sumarizace dotazníků",
		"Hodnocení — hodnocení rizika",
		"Hodnocení — klinické hypotézy",
		"Hodnocení — hodnocení změny/progresu",
		"Hodnocení — terapeutická aliance",
		"Plán",
	],
);
const dataSection = deepsyBody.match(/<section class="note-section">([\s\S]*?)<\/section>/);
assert.ok(dataSection, "Sekce Data nebyla nalezena");
assert.deepEqual(
	Array.from(dataSection[1].matchAll(/<h4>([^<]+)<\/h4>/g), (match) => match[1]),
	[
		"Hlavní témata",
		"Problémy a symptomy",
		"Terapeutické cíle",
		"Zdroje a silné stránky klienta",
		"Důležité osoby",
		"Důležité události a data",
	],
);
const dataItems = Array.from(dataSection[1].matchAll(/<li>([\s\S]*?)<\/li>/g), (match) => countWords(stripMarkup(match[1])));
assert.equal(dataItems.length, 6, "Každá podsekce Data má obsahovat právě jednu odrážku");
assert.ok(dataItems.every((words) => words <= 28), `Některá odrážka Data překročila 28 slov: ${dataItems.join(", ")}`);
assert.doesNotMatch(deepsyBody, /Průběh od minulého sezení|Práce v sezení|Přetrvávající obtíže/);

const hypothesesSection = deepsyBody.match(/<h3>Hodnocení — klinické hypotézy<\/h3>([\s\S]*?)<\/section>/);
assert.ok(hypothesesSection, "Sekce Klinické hypotézy nebyla nalezena");
const hypothesisPerspectives = Array.from(
	hypothesesSection[1].matchAll(/<strong>Přístup:<\/strong>\s*([^.<]+)/g),
	(match) => match[1].trim(),
);
assert.equal(hypothesisPerspectives.length, 4, "Demo má obsahovat čtyři klinické hypotézy");
assert.equal(new Set(hypothesisPerspectives).size, 4, "Každá hypotéza má použít jinou terapeutickou perspektivu");
assert.deepEqual(
	hypothesisPerspectives.slice().sort(),
	["Existenciální", "Kognitivně-behaviorální", "Psychodynamický", "Systemický"],
	"Demo má ukázat všechny čtyři perspektivy, které prompt vyjmenovává",
);

// Tři části hypotézy se čtou každá jinak. Když splynou do jednoho odstavce, je
// z odrážky zeď textu a popisky se v ní ztratí — to se jednou už stalo.
const hypothesisItems = Array.from(hypothesesSection[1].matchAll(/<li>([\s\S]*?)<\/li>/g), (match) => match[1]);
assert.equal(hypothesisItems.length, 4, "Sekce hypotéz má mít čtyři odrážky");
for (const item of hypothesisItems) {
	assert.equal(
		(item.match(/class="hypothesis-line/g) || []).length,
		3,
		"Přístup, Hypotéza a Zdůvodnění mají být každý na vlastním řádku",
	);
}
assert.match(css, /\.hypothesis-line\s*\{[^}]*display:\s*block/, "Řádky hypotézy musí být blokové");

const dekurzWords = countWords(stripMarkup(noteBody("dekurz")));
assert.ok(dekurzWords <= 200, `Dekurz má ${dekurzWords} slov; maximum je 200`);

const budgets = {
	dap: [300, 350],
	"dap-bullets": [265, 350],
	sirp: [300, 360],
	"sirp-bullets": [270, 360],
};

const formatWords = {};
for (const [format, [min, max]] of Object.entries(budgets)) {
	const words = countWords(stripMarkup(noteBody(format)));
	formatWords[format] = words;
	assert.ok(words >= min && words <= max, `${format} má ${words} slov; očekáváno je ${min}–${max}`);
}

// DAP i SIRP se nabízejí ve dvou podobách nad stejnými fakty — proto se rozsahy nesmí rozejít.
const variantFormats = { dap: ["Data", "Hodnocení", "Plán"], sirp: ["Situace", "Intervence", "Reakce", "Plán"] };
for (const [format, headings] of Object.entries(variantFormats)) {
	const label = format.toUpperCase();
	const bullets = `${format}-bullets`;
	assert.ok(
		Math.abs(formatWords[format] - formatWords[bullets]) <= 40,
		`Obě podoby ${label} se rozsahem rozcházejí o ${Math.abs(formatWords[format] - formatWords[bullets])} slov`,
	);
	assert.match(html, new RegExp(`data-variant-switch="${format}"`), `Záložka ${label} má obsahovat přepínač podoby zápisu`);
	assert.equal(
		(html.match(new RegExp(`<div class="note-body" data-note-body="${bullets}"[^>]*>[\\s\\S]*?<ul>`, "g")) || []).length,
		1,
		`Odrážková podoba ${label} má být zapsaná seznamem`,
	);
	assert.doesNotMatch(noteBody(format), /<ul>/, `Souvislá podoba ${label} nemá obsahovat odrážky`);
	assert.doesNotMatch(noteBody(bullets), /<p>/, `Odrážková podoba ${label} nemá obsahovat odstavce`);

	// Kdyby se odrážková podoba rozdrobila, neporovnávala by se forma, ale míra drobení.
	const bulletSections = Array.from(
		noteBody(bullets).matchAll(/<h3>([^<]+)<\/h3>([\s\S]*?)<\/section>/g),
		(match) => [match[1], (match[2].match(/<li>/g) || []).length],
	);
	assert.deepEqual(bulletSections.map(([heading]) => heading), headings, `Odrážková podoba ${label} má mít sekce ${headings.join(", ")}`);
	for (const [heading, count] of bulletSections) {
		assert.ok(count <= 6, `Sekce ${heading} v odrážkové podobě ${label} má ${count} odrážek; maximum je 6`);
	}
}

// Doporučení založená na důkazech: jeden sbalený blok pod zápisem pro DeePsy,
// DAP a SIRP. Uvnitř jen odrážky s citacemi v textu, věta k přístupu terapeuta
// a limity; žádný úvod, zdůvodnění, metadata ani seznam zdrojů.
const evidenceMatch = html.match(/<details class="evidence" id="evidence" data-evidence-for="([^"]+)"([^>]*)>([\s\S]*?)\n\t\t\t<\/details>/);
assert.ok(evidenceMatch, "Blok doporučení nebyl nalezen");
assert.deepEqual(evidenceMatch[1].split(" "), ["deepsy", "dap", "sirp"], "Doporučení patří k DeePsy, DAP a SIRP, ne k dekurzu");
assert.doesNotMatch(evidenceMatch[2], /\bopen\b/, "Blok doporučení má být ve výchozím stavu sbalený");
const evidenceHtml = evidenceMatch[3];
assert.match(evidenceHtml, /<summary>Doporučení založená na důkazech<\/summary>/);
assert.ok(html.indexOf('class="evidence"') > html.indexOf('id="panel-sirp"'), "Blok doporučení patří pod zápisy");
assert.ok(html.indexOf('class="evidence"') < html.indexOf('class="source-notice'), "Blok doporučení patří do karty zápisu");
assert.doesNotMatch(evidenceHtml, /<ol|evidence__sources|evidence__lead|evidence__meta|evidence__kicker|<h3/, "V bloku není seznam zdrojů, úvod ani metadata");

const evidenceText = stripMarkup(evidenceHtml.replace(/<span class="evidence__scale"[\s\S]*?<\/span><\/span>/g, "</span>"));
assert.doesNotMatch(evidenceText, /Podklad pro klinický úsudek|Modalita terapeuta v ukázce|glm|deepseek|kimi/i, "V bloku nemají být poučky ani metadata");
assert.doesNotMatch(evidenceText, /měl[a]?\s+byste|měl\/a byste|doporučujeme|musíte/i, "Doporučení nemají terapeutovi přikazovat");
// Slovník aplikace: odborný žargon a doslovné překlady nemají v doporučeních co dělat.
assert.doesNotMatch(
	evidenceText,
	/anticipačn|habituac|expozic|ruminac|zážitkov\S* vyhýbání|akceptačně|acceptance|mindfulness|metaanalýza ukazuje|\bRCT\b/i,
	"Doporučení mají být psaná obyčejnou češtinou (viz slovník)",
);

const problems = Array.from(evidenceHtml.matchAll(/<div class="evidence__problem">([\s\S]*?)\n\t\t\t\t\t<\/div>/g), (match) => match[1]);
assert.ok(problems.length >= 1, "Blok doporučení nemá žádné téma");
for (const problem of problems) {
	assert.match(problem, /<span class="evidence__level evidence__level--[a-z]+" tabindex="0">/, "Téma má štítek síly dokladů");
	assert.equal((problem.match(/<span class="evidence__scale" role="tooltip">/g) || []).length, 1, "Štítek má vysvětlit stupnici");
	assert.equal((problem.match(/aria-current="true"/g) || []).length, 1, "Stupnice vyznačí právě aktuální úroveň");
	assert.match(problem, /<strong>Pro váš přístup:<\/strong>/);
	assert.match(problem, /<strong>Limity výzkumu:<\/strong>/);

	const bullets = Array.from(problem.matchAll(/<li>([\s\S]*?)<\/li>/g), (match) => match[1]);
	assert.ok(bullets.length >= 1 && bullets.length <= 4, `Téma má ${bullets.length} odrážek; očekáváno 1–4`);
	for (const bullet of bullets) {
		const cite = bullet.match(/ <span class="evidence__cite">\(([\s\S]*?)\)<\/span>$/);
		assert.ok(cite, `Odrážka nemá citaci na konci: ${stripMarkup(bullet)}`);
		const links = Array.from(cite[1].matchAll(/<a [^>]*>[^<]*<\/a>/g), (match) => match[0]);
		assert.ok(links.length >= 1, `Odrážka nemá odkazovanou citaci: ${stripMarkup(bullet)}`);
		assert.equal(cite[1].replace(/<a [^>]*>[^<]*<\/a>/g, "").replace(/; /g, ""), "", `Citace mají být jen odkazy oddělené středníkem: ${cite[1]}`);
		for (const link of links) {
			assert.match(link, new RegExp(`^${citationLink.source}[^<]+<\\/a>$`), `Citace není odkaz na DOI nebo PubMed: ${link}`);
			const label = link.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");
			assert.match(label, /^[\p{L}' -]+(?: & [\p{L}' -]+| et al\.)?, (?:\d{4}|b\.r\.)$/u, `Citace není ve tvaru APA: ${label}`);
		}
		const words = countWords(stripMarkup(bullet.slice(0, cite.index)));
		assert.ok(words <= 35, `Odrážka má ${words} slov; maximum je 35: ${stripMarkup(bullet)}`);
	}
}

// Poznámka pro tým je sbalená a nese důvody výběru formátů.
const rationale = html.match(/<details class="format-rationale">([\s\S]*?)<\/details>/);
assert.ok(rationale, "Poznámka k výběru formátů nebyla nalezena");
assert.doesNotMatch(rationale[1], /open/, "Poznámka má být ve výchozím stavu sbalená");
assert.ok(html.indexOf('class="format-rationale"') > html.indexOf('class="closing-note"'), "Poznámka patří až úplně dolů");
for (const term of ["BIRP", "GIRP", "PIRP", "léčebného plánu", "neverbálního"]) {
	assert.ok(rationale[1].includes(term), `Poznámka má vysvětlit: ${term}`);
}

assert.match(js, /ArrowLeft/);
assert.match(js, /ArrowRight/);
assert.match(js, /Home/);
assert.match(js, /End/);
assert.match(js, /history\.replaceState/);
assert.match(js, /aria-pressed/);

const counts = [`DeePsy: ${deepsyWords}`]
	.concat(Object.entries(formatWords).map(([format, words]) => `${format}: ${words}`))
	.concat([`dekurz: ${dekurzWords}`]);
console.log(`Kontrola prošla. ${counts.join(", ")} slov.`);
