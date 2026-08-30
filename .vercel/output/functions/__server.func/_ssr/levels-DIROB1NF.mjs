import { r as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/levels-DIROB1NF.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out (auth on — the default, including live preview) -> throws
* `UnauthorizedError` (see `verify.server.ts`). Only when auth is explicitly
* disabled (`VITE_AUTH_ENABLED=false`) does it resolve the shared dev user and
* never throw. Use it on every server function that touches per-user data, and
* scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-sGid3STf.mjs").then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-DRWd_xMq.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var DECADE_IDS = [
	"1966",
	"1976",
	"1986",
	"1996",
	"2006",
	"2016",
	"2026"
];
var URBAN = "/assets/bg-urban.jpg";
var INDUSTRIAL = "/assets/bg-industrial.jpg";
var OUTDOOR = "/assets/bg-outdoor.jpg";
var FOREST = "/assets/bg-forest.jpg";
var GOLDEN = "/assets/bg-golden.jpg";
var LEVELS = {
	"1966": {
		id: "1966",
		year: "1966",
		title: "The First Pair",
		blurb: "Great Brak River. Leather, last, and the first comfortable step.",
		background: URBAN,
		backgrounds: [URBAN],
		card: "/assets/card-urban.jpg",
		hops: 22,
		lives: 4,
		baseGap: 148,
		gapScale: 5,
		baseWidth: 286,
		widthShrink: 2.2,
		minWidth: 210,
		moveAmp: 0,
		moveSpeed: 0,
		wind: 0,
		oscillate: false,
		hidePreviewAfter: 99,
		oscSpeed: 1.1,
		sweetPad: .11,
		shoeKinds: ["wheat"],
		prizeHint: "Finish any decade for a R50 voucher."
	},
	"1976": {
		id: "1976",
		year: "1976",
		title: "Schoolyard Classic",
		blurb: "The pair that outlasted every term. Dust, tar, and a crepe sole.",
		background: URBAN,
		backgrounds: [URBAN, INDUSTRIAL],
		card: "/assets/card-urban.jpg",
		hops: 26,
		lives: 4,
		baseGap: 168,
		gapScale: 6.5,
		baseWidth: 260,
		widthShrink: 2.6,
		minWidth: 188,
		moveAmp: 0,
		moveSpeed: 0,
		wind: 0,
		oscillate: false,
		hidePreviewAfter: 99,
		oscSpeed: 1.2,
		sweetPad: .1,
		shoeKinds: ["black", "wheat"],
		prizeHint: "Finish any decade for a R50 voucher."
	},
	"1986": {
		id: "1986",
		year: "1986",
		title: "Crepe & Comfort",
		blurb: "The trademark sole. Soft as Sunday. Built to walk forever.",
		background: INDUSTRIAL,
		backgrounds: [INDUSTRIAL, URBAN],
		card: "/assets/card-industrial.jpg",
		hops: 30,
		lives: 4,
		baseGap: 186,
		gapScale: 7.5,
		baseWidth: 242,
		widthShrink: 3,
		minWidth: 168,
		moveAmp: 8,
		moveSpeed: .5,
		wind: 6,
		oscillate: false,
		hidePreviewAfter: 16,
		oscSpeed: 1.3,
		sweetPad: .09,
		shoeKinds: ["wheat", "tan"],
		prizeHint: "Finish any decade for a R50 voucher."
	},
	"1996": {
		id: "1996",
		year: "1996",
		title: "Handmade Heart",
		blurb: "Third-generation hands in the Southern Cape. Thirteen small workshops.",
		background: INDUSTRIAL,
		backgrounds: [INDUSTRIAL, OUTDOOR],
		card: "/assets/card-industrial.jpg",
		hops: 34,
		lives: 4,
		baseGap: 204,
		gapScale: 8,
		baseWidth: 224,
		widthShrink: 3.2,
		minWidth: 152,
		moveAmp: 16,
		moveSpeed: .75,
		wind: 12,
		oscillate: false,
		hidePreviewAfter: 12,
		oscSpeed: 1.35,
		sweetPad: .08,
		shoeKinds: [
			"tan",
			"wheat",
			"cocoa"
		],
		prizeHint: "Finish any decade for a R50 voucher."
	},
	"2006": {
		id: "2006",
		year: "2006",
		title: "Street Style",
		blurb: "From the factory floor to Friday night. Comfort became a look.",
		background: OUTDOOR,
		backgrounds: [
			OUTDOOR,
			URBAN,
			INDUSTRIAL
		],
		card: "/assets/card-outdoor.jpg",
		hops: 38,
		lives: 4,
		baseGap: 220,
		gapScale: 8.5,
		baseWidth: 208,
		widthShrink: 3.2,
		minWidth: 138,
		moveAmp: 24,
		moveSpeed: .95,
		wind: 18,
		oscillate: false,
		hidePreviewAfter: 10,
		oscSpeed: 1.45,
		sweetPad: .07,
		shoeKinds: [
			"cocoa",
			"black",
			"tan"
		],
		prizeHint: "Finish any decade for a R50 voucher."
	},
	"2016": {
		id: "2016",
		year: "2016",
		title: "The Revival",
		blurb: "A new generation found the desert boot. Fathers nodded. The walk goes on.",
		background: FOREST,
		backgrounds: [
			FOREST,
			OUTDOOR,
			URBAN
		],
		card: "/assets/card-outdoor.jpg",
		hops: 44,
		lives: 4,
		baseGap: 236,
		gapScale: 9,
		baseWidth: 192,
		widthShrink: 3,
		minWidth: 126,
		moveAmp: 32,
		moveSpeed: 1.15,
		wind: 26,
		oscillate: false,
		hidePreviewAfter: 8,
		oscSpeed: 1.55,
		sweetPad: .06,
		shoeKinds: [
			"wheat",
			"tan",
			"cocoa",
			"black"
		],
		prizeHint: "Clear every decade for a R250 voucher."
	},
	"2026": {
		id: "2026",
		year: "2026",
		title: "Sixty",
		blurb: "Urban to industrial to outdoor — the shoe that takes you there in one step.",
		background: URBAN,
		backgrounds: [
			URBAN,
			INDUSTRIAL,
			OUTDOOR,
			FOREST,
			GOLDEN
		],
		card: "/assets/card-urban.jpg",
		hops: 50,
		lives: 4,
		baseGap: 248,
		gapScale: 8.2,
		baseWidth: 180,
		widthShrink: 2.4,
		minWidth: 118,
		moveAmp: 36,
		moveSpeed: 1.25,
		wind: 28,
		oscillate: false,
		hidePreviewAfter: 6,
		oscSpeed: 1.6,
		sweetPad: .05,
		shoeKinds: [
			"wheat",
			"tan",
			"cocoa",
			"black",
			"gold"
		],
		prizeHint: "Clear every decade for a R250 voucher."
	},
	golden: {
		id: "golden",
		year: "60",
		title: "The Golden Pair",
		blurb: "Eighty hops. One life. No mercy. Win any pair you want.",
		background: GOLDEN,
		backgrounds: [GOLDEN],
		card: "/assets/bg-golden.jpg",
		hops: 80,
		lives: 1,
		baseGap: 292,
		gapScale: 3.4,
		baseWidth: 148,
		widthShrink: 1.2,
		minWidth: 56,
		moveAmp: 20,
		moveSpeed: 1.05,
		wind: 18,
		oscillate: true,
		hidePreviewAfter: 10,
		oscSpeed: 1.7,
		sweetPad: .03,
		shoeKinds: ["gold"],
		prizeHint: "Beat this and choose any pair, on us."
	}
};
//#endregion
export { LEVELS as n, authMiddleware as r, DECADE_IDS as t };
