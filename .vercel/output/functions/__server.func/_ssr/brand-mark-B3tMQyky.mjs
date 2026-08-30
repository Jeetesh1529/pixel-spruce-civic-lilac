import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-mark-B3tMQyky.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function BrandMark({ className, light = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-center gap-3", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: light ? "/assets/logo-60-sm.png" : "/assets/logo-hex.png",
			alt: "60 years since 1966",
			className: cn(light ? "h-9 w-auto sm:h-11" : "h-10 w-auto sm:h-12")
		})
	});
}
function SixtyBadge({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid size-16 place-items-center border-2 border-brand bg-ink text-center sm:size-[4.5rem]", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl leading-none text-brand",
			children: "60"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[0.55rem] font-semibold tracking-[0.18em] text-paper uppercase",
			children: "Years"
		})] })
	});
}
//#endregion
export { SixtyBadge as n, cn as r, BrandMark as t };
