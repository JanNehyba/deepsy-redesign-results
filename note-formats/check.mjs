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

assert.match(html, /<meta name="robots" content="noindex, nofollow, noarchive">/);
assert.match(html, /Jana N\. není skutečná klientka a text není zdravotnickou dokumentací\./);

for (const format of ["deepsy", "dap", "dekurz", "girp"]) {
	assert.match(html, new RegExp(`id="tab-${format}"[\\s\\S]*?aria-controls="panel-${format}"`));
	assert.match(html, new RegExp(`id="panel-${format}"[\\s\\S]*?aria-labelledby="tab-${format}"`));
	assert.match(html, new RegExp(`data-note-body="${format}"`));
}

assert.equal((html.match(/role="tab"/g) || []).length, 4);
assert.equal((html.match(/role="tabpanel"/g) || []).length, 4);

const forbidden = [
	[/Konstrukty|Fenomény/i, "zakázaná sekce"],
	[/\bHEs\b/i, "artefakt HEs"],
	[/\bJana\s+[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][\p{L}-]{2,}/u, "celé jméno"],
	[/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/, "e-mail"],
	[/(?:\+420\s*)?(?:\d[ -]?){9}/, "telefonní číslo"],
	[/kofein|zvracen|meditac|hledání práce|matk[ay]|sestr[ay]/i, "detail zdrojového případu"],
];

for (const [pattern, label] of forbidden) {
	assert.doesNotMatch(stripMarkup(html), pattern, `Nalezeno: ${label}`);
}

assert.doesNotMatch(publicSources, /https?:\/\//i, "Veřejná stránka nesmí načítat vzdálené zdroje");

for (const asset of html.matchAll(/(?:src|href)="(assets\/[^"#?]+)"/g)) {
	await access(join(directory, asset[1]));
}

const dekurzMatch = html.match(/<div class="note-body note-body--narrative" data-note-body="dekurz">([\s\S]*?)<\/div>/);
assert.ok(dekurzMatch, "Text dekurzu nebyl nalezen");
const dekurzWords = countWords(stripMarkup(dekurzMatch[1]));
assert.ok(dekurzWords <= 200, `Dekurz má ${dekurzWords} slov; maximum je 200`);

assert.match(js, /ArrowLeft/);
assert.match(js, /ArrowRight/);
assert.match(js, /Home/);
assert.match(js, /End/);
assert.match(js, /history\.replaceState/);

console.log(`Kontrola prošla. Dekurz: ${dekurzWords} slov.`);
