import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as BrandMark } from "./brand-mark-B3tMQyky.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prizes-RGCNHoGc.js
var import_jsx_runtime = require_jsx_runtime();
function PrizesInfo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh bg-ink px-4 py-8 text-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-8 font-display text-5xl text-paper uppercase",
					children: "60th birthday prizes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizeCard, {
							title: "R50 voucher",
							body: "Clear any single decade. A taste of comfort at the shop."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizeCard, {
							title: "R250 voucher",
							body: "Walk all seven decades — 1966 through 2026 — and take a proper discount home."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizeCard, {
							title: "A free pair of your choice",
							body: "Beat The Golden Pair: 80 hops, one life, shrinking gold boots. Extremely hard. If you finish, pick any style in stock.",
							gold: true
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-8 inline-flex h-12 items-center bg-brand px-6 font-semibold tracking-wide text-ink uppercase",
					children: "Play The Great Hop"
				})
			]
		})
	});
}
function PrizeCard({ title, body, gold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: gold ? "border border-brand bg-surface p-5" : "border border-line bg-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: gold ? "font-display text-2xl text-brand uppercase" : "font-display text-2xl text-paper uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-paper/70",
			children: body
		})]
	});
}
//#endregion
export { PrizesInfo as component };
