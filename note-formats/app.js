(function () {
	"use strict";

	const tabs = Array.from(document.querySelectorAll("[role='tab'][data-format]"));
	const panels = Array.from(document.querySelectorAll("[role='tabpanel'][data-panel]"));
	const formats = new Set(tabs.map((tab) => tab.dataset.format));
	const switches = new Map();

	document.querySelectorAll("[data-variant-switch]").forEach((group) => {
		const format = group.dataset.variantSwitch;
		const buttons = Array.from(group.querySelectorAll("button[data-variant]"));
		if (!buttons.length) {
			return;
		}
		switches.set(format, {
			buttons: buttons,
			bodies: Array.from(document.querySelectorAll("[data-panel='" + format + "'] [data-body-variant]")),
			fallback: buttons[0].dataset.variant,
			current: buttons[0].dataset.variant,
		});
	});

	function variantsOf(format) {
		const group = switches.get(format);
		return group ? group.buttons.map((button) => button.dataset.variant) : [];
	}

	function setVariant(format, variant) {
		const group = switches.get(format);
		if (!group) {
			return;
		}
		if (!variantsOf(format).includes(variant)) {
			variant = group.fallback;
		}

		group.current = variant;
		group.buttons.forEach((button) => {
			button.setAttribute("aria-pressed", String(button.dataset.variant === variant));
		});
		group.bodies.forEach((body) => {
			body.hidden = body.dataset.bodyVariant !== variant;
		});
	}

	function hashFor(format) {
		const group = switches.get(format);
		if (!group || group.current === group.fallback) {
			return format;
		}
		return format + "-" + group.current;
	}

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
			history.replaceState(null, "", "#" + hashFor(format));
		}
	}

	function open(raw) {
		if (formats.has(raw)) {
			activate(raw, true);
			return;
		}

		const separator = raw.lastIndexOf("-");
		if (separator > 0) {
			const format = raw.slice(0, separator);
			const variant = raw.slice(separator + 1);
			if (formats.has(format) && variantsOf(format).includes(variant)) {
				setVariant(format, variant);
				activate(format, true);
				return;
			}
		}

		activate("deepsy", true);
	}

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

	switches.forEach((group, format) => {
		group.buttons.forEach((button) => {
			button.addEventListener("click", () => {
				setVariant(format, button.dataset.variant);
				activate(format, true);
			});
		});
		setVariant(format, group.fallback);
	});

	window.addEventListener("hashchange", () => {
		open(window.location.hash.slice(1));
	});

	open(window.location.hash.slice(1) || "deepsy");
})();
