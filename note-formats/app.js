(function () {
	"use strict";

	const tabs = Array.from(document.querySelectorAll("[role='tab'][data-format]"));
	const panels = Array.from(document.querySelectorAll("[role='tabpanel'][data-panel]"));
	const formats = new Set(tabs.map((tab) => tab.dataset.format));

	function activate(format, updateHash) {
		if (!formats.has(format)) {
			format = "deepsy";
		}

		tabs.forEach((tab) => {
			const active = tab.dataset.format === format;
			tab.classList.toggle("is-active", active);
			tab.setAttribute("aria-selected", String(active));
			tab.tabIndex = active ? 0 : -1;
		});

		panels.forEach((panel) => {
			panel.hidden = panel.dataset.panel !== format;
		});

		if (updateHash) {
			history.replaceState(null, "", "#" + format);
		}
	}

	function countWords(text) {
		return (text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || []).length;
	}

	document.querySelectorAll("[data-note-body]").forEach((body) => {
		const format = body.dataset.noteBody;
		const target = document.querySelector("[data-word-count-for='" + format + "']");
		if (target) {
			const total = countWords(body.textContent);
			target.textContent = total + (total >= 2 && total <= 4 ? " slova" : " slov");
		}
	});

	tabs.forEach((tab, index) => {
		tab.addEventListener("click", () => activate(tab.dataset.format, true));

		tab.addEventListener("keydown", (event) => {
			let nextIndex = null;
			if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
			if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
			if (event.key === "Home") nextIndex = 0;
			if (event.key === "End") nextIndex = tabs.length - 1;

			if (nextIndex !== null) {
				event.preventDefault();
				const nextTab = tabs[nextIndex];
				activate(nextTab.dataset.format, true);
				nextTab.focus();
			}
		});
	});

	window.addEventListener("hashchange", () => {
		activate(window.location.hash.slice(1), true);
	});

	activate(window.location.hash.slice(1) || "deepsy", true);
})();
