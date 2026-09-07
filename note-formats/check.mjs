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

assert.doesNotMatch(publicSources, /https?:\/\//i, "Veřejná stránka nesmí načítat vzdálené zdroje");

for (const asset of html.matchAll(/(?:src|href)="(assets\/[^"#?]+)"/g)) {
	await access(join(directory, asset[1]));
}

const deepsyBody = noteBody("deepsy");
const deepsyWords = countWords(stripMarkup(deepsyBody));
assert.ok(deepsyWords >= 600 && deepsyWords <= 700, `Plný zápis DeePsy má ${deepsyWords} slov; očekáváno je 600–700`);
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
assert.equal(hypothesisPerspectives.length, 3, "Demo má obsahovat tři klinické hypotézy");
assert.equal(new Set(hypothesisPerspectives).size, 3, "Každá hypotéza má použít jinou terapeutickou perspektivu");

const dekurzWords = countWords(stripMarkup(noteBody("dekurz")));
assert.ok(dekurzWords <= 200, `Dekurz má ${dekurzWords} slov; maximum je 200`);

const budgets = {
	dap: [300, 350],
	"dap-bullets": [280, 350],
	sirp: [300, 360],
};

const formatWords = {};
for (const [format, [min, max]] of Object.entries(budgets)) {
	const words = countWords(stripMarkup(noteBody(format)));
	formatWords[format] = words;
	assert.ok(words >= min && words <= max, `${format} má ${words} slov; očekáváno je ${min}–${max}`);
}

// DAP se nabízí ve dvou podobách nad stejnými fakty — proto se rozsahy nesmí rozejít.
assert.ok(
	Math.abs(formatWords.dap - formatWords["dap-bullets"]) <= 40,
	`Obě podoby DAP se rozsahem rozcházejí o ${Math.abs(formatWords.dap - formatWords["dap-bullets"])} slov`,
);
assert.match(html, /data-variant-switch="dap"/, "Záložka DAP má obsahovat přepínač podoby zápisu");
assert.equal(
	(html.match(/<div class="note-body" data-note-body="dap-bullets"[^>]*>[\s\S]*?<ul>/g) || []).length,
	1,
	"Odrážková podoba DAP má být zapsaná seznamem",
);
assert.doesNotMatch(noteBody("dap"), /<ul>/, "Souvislá podoba DAP nemá obsahovat odrážky");
assert.doesNotMatch(noteBody("dap-bullets"), /<p>/, "Odrážková podoba DAP nemá obsahovat odstavce");

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
