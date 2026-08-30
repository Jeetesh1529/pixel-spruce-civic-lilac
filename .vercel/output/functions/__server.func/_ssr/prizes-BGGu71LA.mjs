import { i as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { r as getSql } from "./db-RziVT_id.mjs";
import { r as authMiddleware, t as DECADE_IDS } from "./levels-DIROB1NF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prizes-BGGu71LA.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function parseDecades(raw) {
	try {
		const v = JSON.parse(raw || "[]");
		if (!Array.isArray(v)) return [];
		return v.filter((id) => typeof id === "string");
	} catch {
		return [];
	}
}
function makeCode(tier) {
	const prefix = tier === "golden" ? "GOLD" : tier === "campaign" ? "CAMP" : "HOP";
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let tail = "";
	for (let i = 0; i < 6; i++) tail += alphabet[Math.floor(Math.random() * 32)];
	return `GH60-${prefix}-${tail}`;
}
var getMyProgress_createServerFn_handler = createServerRpc({
	id: "cc1dc7fb9f5528dbef9543fd6f8cc8e9049ababddb112653ffe5f274f3b8c2e4",
	name: "getMyProgress",
	filename: "src/lib/prizes.ts"
}, (opts) => getMyProgress.__executeServer(opts));
var getMyProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProgress_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const row = (await sql`
      select decades_completed, golden_best_hop, golden_completed, best_score
      from player_progress
      where user_id = ${context.userId}
    `)[0];
	return {
		progress: row ? {
			decades: parseDecades(row.decades_completed),
			goldenBest: row.golden_best_hop,
			goldenDone: row.golden_completed,
			bestScore: row.best_score
		} : {
			decades: [],
			goldenBest: 0,
			goldenDone: false,
			bestScore: 0
		},
		claims: await sql`
      select prize_tier, code, status from prize_claims where user_id = ${context.userId}
    `
	};
});
var saveMyProgress_createServerFn_handler = createServerRpc({
	id: "8acf258a73d1cf9cd30cad2ac25e968aa2243a1753a1268a6b4d9bf48bb90eed",
	name: "saveMyProgress",
	filename: "src/lib/prizes.ts"
}, (opts) => saveMyProgress.__executeServer(opts));
var saveMyProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveMyProgress_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const decades = JSON.stringify(data.decades);
	await sql`
      insert into player_progress (user_id, decades_completed, golden_best_hop, golden_completed, best_score, updated_at)
      values (${context.userId}, ${decades}, ${data.goldenBest}, ${data.goldenDone}, ${data.bestScore}, now())
      on conflict (user_id) do update set
        decades_completed = excluded.decades_completed,
        golden_best_hop = excluded.golden_best_hop,
        golden_completed = excluded.golden_completed,
        best_score = excluded.best_score,
        updated_at = now()
    `;
	return { ok: true };
});
var recordRun_createServerFn_handler = createServerRpc({
	id: "ad418558bf4d0633fd04e0e05c4c766e7c0c6919eb7ab37ee84758944e70b508",
	name: "recordRun",
	filename: "src/lib/prizes.ts"
}, (opts) => recordRun.__executeServer(opts));
var recordRun = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(recordRun_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      insert into game_runs (user_id, level_id, hops, completed, perfects, score, elapsed_ms)
      values (
        ${context.userId},
        ${data.levelId},
        ${data.hops},
        ${data.completed},
        ${data.perfects},
        ${data.score},
        ${data.elapsedMs}
      )
    `;
	return { ok: true };
});
var submitClaim_createServerFn_handler = createServerRpc({
	id: "9459412ed7fea33ca06419a341296259966bcc39b6902863ee21343e98aa32cb",
	name: "submitClaim",
	filename: "src/lib/prizes.ts"
}, (opts) => submitClaim.__executeServer(opts));
var submitClaim = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const fullName = input.fullName.trim();
	const email = input.email.trim();
	if (fullName.length < 2) throw new Error("Please enter your name");
	if (!email.includes("@")) throw new Error("Please enter a valid email");
	return {
		...input,
		fullName,
		email
	};
}).handler(submitClaim_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const rows = await sql`
      select decades_completed, golden_completed
      from player_progress
      where user_id = ${context.userId}
    `;
	const decades = parseDecades(rows[0]?.decades_completed);
	const goldenDone = Boolean(rows[0]?.golden_completed);
	if (!(data.prizeTier === "golden" ? goldenDone : data.prizeTier === "campaign" ? DECADE_IDS.every((id) => decades.includes(id)) : decades.length >= 1)) throw new Error("You have not unlocked this prize yet. Keep hopping.");
	const existing = await sql`
      select code, status from prize_claims
      where user_id = ${context.userId} and prize_tier = ${data.prizeTier}
    `;
	if (existing[0]) return {
		code: existing[0].code,
		status: existing[0].status,
		already: true
	};
	const code = makeCode(data.prizeTier);
	await sql`
      insert into prize_claims (
        user_id, prize_tier, code, full_name, email, phone, shoe_style, shoe_size
      ) values (
        ${context.userId},
        ${data.prizeTier},
        ${code},
        ${data.fullName},
        ${data.email},
        ${data.phone ?? null},
        ${data.shoeStyle ?? null},
        ${data.shoeSize ?? null}
      )
    `;
	return {
		code,
		status: "pending",
		already: false
	};
});
var listMyClaims_createServerFn_handler = createServerRpc({
	id: "168321d473fb6fc57c9f01d26ad345eee79aa97a56cffab51479ed005adbdeab",
	name: "listMyClaims",
	filename: "src/lib/prizes.ts"
}, (opts) => listMyClaims.__executeServer(opts));
var listMyClaims = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyClaims_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select prize_tier, code, status, shoe_style, created_at
      from prize_claims
      where user_id = ${context.userId}
      order by created_at desc
    `;
});
//#endregion
export { getMyProgress_createServerFn_handler, listMyClaims_createServerFn_handler, recordRun_createServerFn_handler, saveMyProgress_createServerFn_handler, submitClaim_createServerFn_handler };
