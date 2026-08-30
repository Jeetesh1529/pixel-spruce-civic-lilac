import { o as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as createServerFn, o as getServerFnById, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { i as signOut } from "./client-sGid3STf.mjs";
import { n as useCurrentUserState, t as useCurrentUser } from "./use-current-user-DZ7NZd4-.mjs";
import { n as SixtyBadge, r as cn, t as BrandMark } from "./brand-mark-B3tMQyky.mjs";
import { n as LEVELS, r as authMiddleware, t as DECADE_IDS } from "./levels-DIROB1NF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BLhcIlje.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void signOut(),
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline",
				children: "Sign out"
			})
		]
	});
}
function AuthChip({ light = false }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-9 w-24 animate-pulse bg-paper/10" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: cn("inline-flex h-9 items-center px-4 text-sm font-semibold tracking-wide uppercase", light ? "border border-paper/30 text-paper hover:border-brand hover:text-brand" : "bg-brand text-ink hover:bg-paper"),
		children: "Sign in"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("text-paper", light && "[&_span]:text-paper [&_button]:text-brand"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
	});
}
var HopAudio = class {
	ctx = null;
	muted = false;
	unlock() {
		if (this.ctx) {
			this.ctx.resume();
			return;
		}
		const AC = window.AudioContext || window.webkitAudioContext;
		this.ctx = new AC();
		this.ctx.resume();
	}
	tone(freq, dur, type, gain = .08, slide = 0) {
		if (this.muted || !this.ctx) return;
		const t = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, t);
		if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
		g.gain.setValueAtTime(gain, t);
		g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
		osc.connect(g);
		g.connect(this.ctx.destination);
		osc.start(t);
		osc.stop(t + dur + .02);
	}
	chargeTick(charge) {
		this.tone(180 + charge * 420, .05, "sine", .03);
	}
	hop() {
		this.tone(280, .18, "triangle", .09, 220);
	}
	land(perfect) {
		if (perfect) {
			this.tone(520, .12, "sine", .08);
			this.tone(780, .2, "triangle", .05);
		} else this.tone(240, .1, "sine", .07);
	}
	fall() {
		this.tone(220, .35, "sawtooth", .05, -160);
	}
	win() {
		this.tone(392, .16, "triangle", .08);
		this.tone(523, .2, "triangle", .07);
		this.tone(659, .28, "sine", .06);
	}
};
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to load ${src}`));
		img.src = src;
	});
}
async function loadGameImages() {
	const frame = (prefix) => Promise.all([
		1,
		2,
		3,
		4
	].map((n) => loadImage(`/assets/${prefix}-${n}.png`)));
	const [idle, charge, jump, wheat, tan, cocoa, black, gold, urban, industrial, outdoor, forest, golden] = await Promise.all([
		frame("runner-idle"),
		frame("runner-charge"),
		frame("runner-jump"),
		loadImage("/assets/shoe-wheat.png"),
		loadImage("/assets/shoe-tan.png"),
		loadImage("/assets/shoe-cocoa.png"),
		loadImage("/assets/shoe-black.png"),
		loadImage("/assets/shoe-gold.png"),
		loadImage("/assets/bg-urban.jpg"),
		loadImage("/assets/bg-industrial.jpg"),
		loadImage("/assets/bg-outdoor.jpg"),
		loadImage("/assets/bg-forest.jpg"),
		loadImage("/assets/bg-golden.jpg")
	]);
	return {
		idle,
		charge,
		jump,
		shoes: {
			wheat,
			tan,
			cocoa,
			black,
			gold
		},
		backgrounds: {
			"/assets/bg-urban.jpg": urban,
			"/assets/bg-industrial.jpg": industrial,
			"/assets/bg-outdoor.jpg": outdoor,
			"/assets/bg-forest.jpg": forest,
			"/assets/bg-golden.jpg": golden
		}
	};
}
var GRAVITY = 1950;
var PLAYER_H = 216;
var SHOE_H = 52;
var FIXED = 1 / 60;
var BRAND = "#fce300";
var PAPER = "#ffffff";
function clamp(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function rand(a, b) {
	return a + Math.random() * (b - a);
}
var HopEngine = class {
	canvas;
	ctx;
	images;
	level;
	audio;
	onFinish;
	onHud;
	running = false;
	raf = 0;
	acc = 0;
	last = 0;
	elapsed = 0;
	animT = 0;
	mode = "ready";
	hop = 0;
	lives;
	score = 0;
	perfects = 0;
	message = "Hold to charge · release to hop";
	messageT = 0;
	player = {
		x: 180,
		y: 420,
		vx: 0,
		vy: 0,
		w: 72,
		h: PLAYER_H
	};
	shoes = [];
	camX = 0;
	camY = 0;
	shake = 0;
	particles = [];
	charge = 0;
	chargeDir = 1;
	holding = false;
	sweetLo = .42;
	sweetHi = .58;
	lastChargeTick = 0;
	celebrateT = 0;
	fallT = 0;
	startMs = 0;
	dpr = 1;
	viewW = 1280;
	viewH = 720;
	constructor(canvas, images, level, audio, hooks) {
		this.canvas = canvas;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas 2D unavailable");
		this.ctx = ctx;
		this.images = images;
		this.level = level;
		this.audio = audio;
		this.onFinish = hooks.onFinish;
		this.onHud = hooks.onHud;
		this.lives = level.lives;
		this.resetWorld();
	}
	start() {
		this.running = true;
		this.resize();
		this.resetWorld();
		this.startMs = performance.now();
		this.last = performance.now();
		const loop = (now) => {
			if (!this.running) return;
			let dt = (now - this.last) / 1e3;
			this.last = now;
			dt = Math.min(dt, .1);
			this.acc += dt;
			while (this.acc >= FIXED) {
				this.step(FIXED);
				this.acc -= FIXED;
			}
			this.draw();
			this.emitHud();
			this.raf = requestAnimationFrame(loop);
		};
		this.raf = requestAnimationFrame(loop);
		this.resize();
	}
	stop() {
		this.running = false;
		cancelAnimationFrame(this.raf);
	}
	resize() {
		const parent = this.canvas.parentElement;
		const w = parent?.clientWidth ?? 1280;
		const h = parent?.clientHeight ?? 720;
		this.dpr = Math.min(window.devicePixelRatio || 1, 2);
		this.canvas.width = Math.floor(w * this.dpr);
		this.canvas.height = Math.floor(h * this.dpr);
		this.canvas.style.width = `${w}px`;
		this.canvas.style.height = `${h}px`;
		this.viewW = w;
		this.viewH = h;
	}
	pointerDown() {
		if (this.mode === "ready" || this.mode === "celebrate") {
			this.mode = "charging";
			this.holding = true;
			this.charge = this.level.oscillate ? 0 : .08;
			this.chargeDir = 1;
			this.audio.unlock();
		}
	}
	pointerUp() {
		if (this.mode !== "charging" || !this.holding) return;
		this.holding = false;
		this.launch();
	}
	resetWorld() {
		this.shoes = [];
		const first = this.makeShoe(120, 0, (this.level.baseWidth + 24) * this.worldScale());
		this.shoes.push(first);
		this.player.h = 216 * clamp(this.worldScale() * 1.05, .72, 1);
		this.player.x = first.x + first.w * .22;
		this.player.y = first.y - this.player.h + 28;
		this.player.vx = 0;
		this.player.vy = 0;
		this.spawnNext();
		this.recomputeSweet();
		this.camX = this.player.x - this.viewW * (this.viewW < 560 ? .18 : .3);
		this.camY = 0;
	}
	worldScale() {
		return clamp(this.viewW / 960, .56, 1);
	}
	makeShoe(x, hopIndex, width) {
		const t = hopIndex / Math.max(1, this.level.hops);
		const scale = this.worldScale();
		const w = width ?? Math.max(this.level.minWidth * scale, (this.level.baseWidth - hopIndex * this.level.widthShrink) * scale);
		const kinds = this.level.shoeKinds;
		const kind = kinds[hopIndex % kinds.length];
		const yJitter = hopIndex === 0 ? 0 : rand(-28, 34) * (.4 + t) * scale;
		return {
			x,
			y: this.viewH * .68 + yJitter,
			w,
			h: SHOE_H,
			kind,
			phase: rand(0, Math.PI * 2),
			baseX: x,
			moveAmp: hopIndex === 0 ? 0 : this.level.moveAmp * (.35 + t),
			moveSpeed: this.level.moveSpeed * (.8 + t * .7)
		};
	}
	spawnNext() {
		const prev = this.shoes[this.shoes.length - 1];
		const idx = this.hop + 1;
		const scale = this.worldScale();
		const gap = (this.level.baseGap + idx * this.level.gapScale + rand(-12, 18)) * scale;
		const nextW = Math.max(this.level.minWidth * scale, (this.level.baseWidth - (this.hop + 1) * this.level.widthShrink) * scale);
		const shoe = this.makeShoe(prev.x + prev.w + gap, this.hop + 1, nextW);
		this.shoes.push(shoe);
		if (this.shoes.length > 4) this.shoes.shift();
	}
	velocityFor(power) {
		const p = clamp(power, .05, 1);
		const s = this.worldScale();
		return {
			vx: (340 + p * 820) * s,
			vy: -(400 + p * 420) * Math.sqrt(s)
		};
	}
	predictLandX(power) {
		const { vx, vy } = this.velocityFor(power);
		const shoe = this.currentShoe();
		const next = this.nextShoe();
		if (!shoe || !next) return 0;
		const startX = this.player.x;
		const startY = shoe.y - this.player.h + 28;
		const targetY = next.y - this.player.h + 28;
		let x = startX;
		let y = startY;
		let vxi = vx + this.windNow();
		let vyi = vy;
		for (let i = 0; i < 240; i++) {
			vxi += this.windNow() * FIXED * .15;
			vyi += GRAVITY * FIXED;
			x += vxi * FIXED;
			y += vyi * FIXED;
			if (vyi > 0 && y >= targetY) break;
		}
		return x;
	}
	recomputeSweet() {
		const next = this.nextShoe();
		if (!next) return;
		const pad = this.level.sweetPad;
		const samples = [];
		for (let i = 0; i <= 40; i++) {
			const p = i / 40;
			samples.push({
				p,
				x: this.predictLandX(p)
			});
		}
		const loX = next.x + next.w * .22;
		const hiX = next.x + next.w * .72;
		const hits = samples.filter((s) => s.x >= loX && s.x <= hiX);
		if (hits.length >= 2) {
			this.sweetLo = clamp(hits[0].p - pad * .15, .08, .9);
			this.sweetHi = clamp(hits[hits.length - 1].p + pad * .15, this.sweetLo + .03, .96);
		} else {
			this.sweetLo = .45 - pad;
			this.sweetHi = .55 + pad;
		}
		if (this.level.oscillate) {
			const mid = (this.sweetLo + this.sweetHi) / 2;
			const half = Math.max(.012, (this.sweetHi - this.sweetLo) * .35 - this.hop * 3e-4);
			this.sweetLo = mid - half;
			this.sweetHi = mid + half;
		}
	}
	currentShoe() {
		return this.shoes[this.shoes.length - 2] ?? this.shoes[0];
	}
	nextShoe() {
		return this.shoes[this.shoes.length - 1];
	}
	windNow() {
		const t = this.hop / Math.max(1, this.level.hops);
		return this.level.wind * (.4 + t) * Math.sin(this.elapsed * 1.3 + this.hop);
	}
	launch() {
		const power = clamp(this.charge, .06, 1);
		const { vx, vy } = this.velocityFor(power);
		this.player.vx = vx;
		this.player.vy = vy;
		this.mode = "flight";
		this.audio.hop();
		this.burst(this.player.x, this.player.y + this.player.h, 10, PAPER);
	}
	step(dt) {
		this.elapsed += dt;
		this.animT += dt;
		this.messageT = Math.max(0, this.messageT - dt);
		this.shake *= .88;
		for (const s of this.shoes) if (s.moveAmp > 0) s.x = s.baseX + Math.sin(this.elapsed * s.moveSpeed + s.phase) * s.moveAmp;
		if (this.mode === "charging" && this.holding) {
			if (this.level.oscillate) {
				const spd = this.level.oscSpeed + this.hop * .022;
				this.charge += this.chargeDir * spd * dt;
				if (this.charge >= 1) {
					this.charge = 1;
					this.chargeDir = -1;
				}
				if (this.charge <= 0) {
					this.charge = 0;
					this.chargeDir = 1;
				}
			} else this.charge = clamp(this.charge + .68 * dt, 0, 1);
			if (this.elapsed - this.lastChargeTick > .09) {
				this.audio.chargeTick(this.charge);
				this.lastChargeTick = this.elapsed;
			}
		}
		if (this.mode === "flight") {
			this.player.vx += this.windNow() * dt * 4;
			this.player.vy += GRAVITY * dt;
			this.player.x += this.player.vx * dt;
			this.player.y += this.player.vy * dt;
			this.checkLand();
			if (this.player.y > this.viewH + 80) this.failHop();
		}
		if (this.mode === "celebrate") {
			this.celebrateT -= dt;
			if (this.celebrateT <= 0) {
				if (this.hop >= this.level.hops) this.win();
				else {
					this.mode = "ready";
					this.message = this.level.id === "golden" ? `${this.hop} / ${this.level.hops}` : "Hold · release";
				}
			}
		}
		if (this.mode === "fallen") {
			this.player.vy += GRAVITY * dt;
			this.player.y += this.player.vy * dt;
			this.fallT -= dt;
			if (this.fallT <= 0) {
				if (this.lives <= 0) this.lose();
				else this.restoreOnShoe();
			}
		}
		for (const p of this.particles) {
			p.life -= dt;
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.vy += 420 * dt;
		}
		this.particles = this.particles.filter((p) => p.life > 0);
		const lead = this.viewW < 560 ? .18 : .3;
		const targetCam = this.player.x - this.viewW * lead;
		this.camX += (targetCam - this.camX) * (1 - Math.exp(-4.2 * dt));
	}
	checkLand() {
		if (this.player.vy < 80) return;
		const next = this.nextShoe();
		if (!next) return;
		const feetY = this.player.y + this.player.h;
		const cx = this.player.x + this.player.w * .45;
		const onTop = feetY >= next.y - 8 && feetY <= next.y + 22;
		const inX = cx >= next.x + next.w * .08 && cx <= next.x + next.w * .92;
		if (onTop && inX) {
			this.player.y = next.y - this.player.h + 28;
			this.player.vx = 0;
			this.player.vy = 0;
			const mid = next.x + next.w * .5;
			const perfect = Math.abs(cx - mid) < next.w * .16;
			this.succeedHop(perfect);
		}
	}
	succeedHop(perfect) {
		this.hop += 1;
		const base = 100 + this.hop * 8;
		this.score += perfect ? base * 2 : base;
		if (perfect) {
			this.perfects += 1;
			this.message = "Crepe perfect";
			this.burst(this.player.x + 20, this.player.y + this.player.h, 16, BRAND);
		} else {
			this.message = "Comfort landing";
			this.burst(this.player.x + 20, this.player.y + this.player.h, 10, PAPER);
		}
		this.messageT = 1.1;
		this.audio.land(perfect);
		this.shake = perfect ? 7 : 3;
		this.mode = "celebrate";
		this.celebrateT = .38;
		this.spawnNext();
		this.recomputeSweet();
	}
	failHop() {
		if (this.mode === "fallen" || this.mode === "lost" || this.mode === "won") return;
		this.lives -= 1;
		this.mode = "fallen";
		this.fallT = .7;
		this.shake = 10;
		this.audio.fall();
		this.message = this.level.id === "golden" ? "Back to hop 1" : "Missed the sole";
		this.messageT = 1.2;
		this.burst(this.player.x, this.player.y + 40, 14, BRAND);
	}
	restoreOnShoe() {
		if (this.level.id === "golden") {
			this.hop = 0;
			this.score = Math.floor(this.score * .15);
			this.perfects = 0;
			this.resetWorld();
			this.lives = 1;
			this.mode = "ready";
			this.message = `One life. ${this.level.hops} hops.`;
			return;
		}
		const shoe = this.currentShoe();
		this.player.x = shoe.x + shoe.w * .22;
		this.player.y = shoe.y - this.player.h + 28;
		this.player.vx = 0;
		this.player.vy = 0;
		this.mode = "ready";
	}
	finish(won) {
		this.mode = won ? "won" : "lost";
		this.running = false;
		cancelAnimationFrame(this.raf);
		this.onFinish({
			levelId: this.level.id,
			won,
			hops: this.hop,
			total: this.level.hops,
			score: this.score,
			perfects: this.perfects,
			elapsedMs: Math.round(performance.now() - this.startMs)
		});
	}
	win() {
		this.audio.win();
		this.finish(true);
	}
	lose() {
		this.finish(false);
	}
	burst(x, y, n, color) {
		for (let i = 0; i < n; i++) this.particles.push({
			x,
			y,
			vx: rand(-180, 180),
			vy: rand(-280, -40),
			life: rand(.3, .7),
			max: .7,
			size: rand(2, 6),
			color
		});
	}
	emitHud() {
		this.onHud({
			mode: this.mode,
			hop: this.hop,
			total: this.level.hops,
			lives: Math.max(0, this.lives),
			score: this.score,
			perfects: this.perfects,
			charge: this.charge,
			sweetLo: this.sweetLo,
			sweetHi: this.sweetHi,
			message: this.messageT > 0 ? this.message : this.mode === "charging" ? "" : this.message,
			elapsed: this.elapsed
		});
	}
	activeBackground() {
		const list = this.level.backgrounds?.length ? this.level.backgrounds : [this.level.background];
		const t = this.hop / Math.max(1, this.level.hops);
		const i = Math.min(list.length - 1, Math.floor(t * list.length));
		return this.images.backgrounds[list[i]] ?? this.images.backgrounds[this.level.background];
	}
	draw() {
		const ctx = this.ctx;
		ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
		ctx.clearRect(0, 0, this.viewW, this.viewH);
		const shakeX = this.shake ? (Math.random() - .5) * this.shake : 0;
		const shakeY = this.shake ? (Math.random() - .5) * this.shake : 0;
		const bg = this.activeBackground();
		if (bg) {
			const par = this.camX * .12;
			const scale = Math.max(this.viewW / bg.width, this.viewH / bg.height) * 1.08;
			const bw = bg.width * scale;
			const bh = bg.height * scale;
			const bx = -(par % bw + bw * .15);
			ctx.drawImage(bg, bx + shakeX * .3, (this.viewH - bh) * .35 + shakeY * .3, bw, bh);
			ctx.drawImage(bg, bx + bw - 2 + shakeX * .3, (this.viewH - bh) * .35 + shakeY * .3, bw, bh);
		} else {
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, this.viewW, this.viewH);
		}
		const g = ctx.createLinearGradient(0, 0, 0, this.viewH);
		g.addColorStop(0, "rgba(0,0,0,0.28)");
		g.addColorStop(.35, "rgba(0,0,0,0)");
		g.addColorStop(.72, "rgba(0,0,0,0.08)");
		g.addColorStop(1, "rgba(0,0,0,0.42)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, this.viewW, this.viewH);
		ctx.save();
		ctx.translate(-this.camX + shakeX, 8 + shakeY);
		for (const s of this.shoes) this.drawShoe(s);
		if (this.mode === "charging" && this.hop < this.level.hidePreviewAfter) this.drawPreview();
		this.drawPlayer();
		for (const p of this.particles) {
			ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
			ctx.fillStyle = p.color;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
		ctx.restore();
		if (this.mode === "charging") this.drawMeter();
	}
	drawShoe(s) {
		const img = this.images.shoes[s.kind];
		const ctx = this.ctx;
		ctx.save();
		ctx.fillStyle = "rgba(0,0,0,0.35)";
		ctx.beginPath();
		ctx.ellipse(s.x + s.w * .5, s.y + 18, s.w * .52, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		if (img) {
			const drawW = s.w * 1.18;
			const drawH = drawW * (img.height / img.width);
			const drawX = s.x - (drawW - s.w) * .45;
			const drawY = s.y - drawH * .78;
			ctx.drawImage(img, drawX, drawY, drawW, drawH);
		} else {
			ctx.fillStyle = BRAND;
			ctx.fillRect(s.x, s.y, s.w, s.h);
		}
		ctx.restore();
	}
	drawPreview() {
		const ctx = this.ctx;
		ctx.save();
		ctx.strokeStyle = "rgba(252,227,0,0.55)";
		ctx.setLineDash([6, 8]);
		ctx.lineWidth = 2;
		ctx.beginPath();
		const { vx, vy } = this.velocityFor(this.charge);
		let x = this.player.x + this.player.w * .45;
		let y = this.player.y + this.player.h * .4;
		let vxi = vx;
		let vyi = vy;
		ctx.moveTo(x, y);
		for (let i = 0; i < 36; i++) {
			vxi += this.windNow() * FIXED * .2;
			vyi += GRAVITY * FIXED;
			x += vxi * FIXED * 2.2;
			y += vyi * FIXED * 2.2;
			ctx.lineTo(x, y);
		}
		ctx.stroke();
		ctx.restore();
	}
	drawPlayer() {
		const ctx = this.ctx;
		let frames = this.images.idle;
		let fi = Math.floor(this.animT * 6) % 4;
		if (this.mode === "charging") {
			frames = this.images.charge;
			fi = clamp(Math.floor(this.charge * 3.99), 0, 3);
		} else if (this.mode === "flight" || this.mode === "fallen") {
			frames = this.images.jump;
			fi = this.player.vy < 0 ? 1 : 3;
		}
		const img = frames[fi] ?? frames[0];
		if (!img) return;
		const aspect = img.width / img.height;
		const h = this.player.h;
		const w = h * aspect;
		this.player.w = w;
		ctx.save();
		ctx.fillStyle = "rgba(0,0,0,0.28)";
		ctx.beginPath();
		ctx.ellipse(this.player.x + w * .52, this.player.y + h - 6, w * .34, 8, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.drawImage(img, this.player.x, this.player.y, w, h);
		ctx.restore();
	}
	drawMeter() {
		const ctx = this.ctx;
		const x = 22;
		const y = this.viewH * .26;
		const w = 22;
		const h = this.viewH * .44;
		ctx.save();
		ctx.fillStyle = "rgba(0,0,0,0.62)";
		ctx.beginPath();
		ctx.roundRect(14, y - 16, 38, h + 32, 4);
		ctx.fill();
		ctx.fillStyle = "rgba(255,255,255,0.12)";
		ctx.fillRect(x, y, w, h);
		const lo = y + h * (1 - this.sweetHi);
		const hi = y + h * (1 - this.sweetLo);
		ctx.fillStyle = BRAND;
		ctx.fillRect(x, lo, w, Math.max(6, hi - lo));
		const ny = y + h * (1 - this.charge);
		ctx.fillStyle = PAPER;
		ctx.fillRect(18, ny - 3, 30, 6);
		ctx.restore();
	}
};
function GameStage({ levelId, onExit, onFinish }) {
	const canvasRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	const audioRef = (0, import_react.useRef)(new HopAudio());
	const finishRef = (0, import_react.useRef)(onFinish);
	finishRef.current = onFinish;
	const [ready, setReady] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [hud, setHud] = (0, import_react.useState)(null);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const level = LEVELS[levelId];
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let dead = false;
		const audio = audioRef.current;
		loadGameImages().then((images) => {
			if (dead) return;
			const engine = new HopEngine(canvas, images, level, audio, {
				onFinish: (r) => finishRef.current(r),
				onHud: setHud
			});
			engineRef.current = engine;
			engine.start();
			setReady(true);
		}).catch((err) => {
			setError(err instanceof Error ? err.message : "Could not load the game");
		});
		const onResize = () => engineRef.current?.resize();
		window.addEventListener("resize", onResize);
		return () => {
			dead = true;
			window.removeEventListener("resize", onResize);
			engineRef.current?.stop();
			engineRef.current = null;
		};
	}, [level]);
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if (e.code === "Space" || e.code === "Enter") {
				e.preventDefault();
				engineRef.current?.pointerDown();
			}
			if (e.code === "Escape") onExit();
		};
		const up = (e) => {
			if (e.code === "Space" || e.code === "Enter") {
				e.preventDefault();
				engineRef.current?.pointerUp();
			}
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		};
	}, [onExit]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-dvh min-h-0 flex-1 flex-col bg-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onExit,
						className: "h-10 bg-ink/75 px-4 text-sm font-semibold tracking-wide text-paper uppercase backdrop-blur-sm hover:bg-ink",
						children: "Exit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							audioRef.current.muted = !audioRef.current.muted;
							setMuted(audioRef.current.muted);
						},
						className: "h-10 bg-ink/75 px-3 text-sm font-semibold tracking-wide text-paper uppercase backdrop-blur-sm hover:bg-ink",
						children: muted ? "Sound off" : "Sound on"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-ink/75 px-3 py-2 text-right text-paper backdrop-blur-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl leading-none uppercase",
						children: level.year
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[0.7rem] tracking-wide text-brand uppercase",
						children: level.title
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 top-16 z-10 flex justify-center px-3 sm:top-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 bg-ink/70 px-4 py-2 text-paper backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Hop",
							value: `${hud?.hop ?? 0}/${level.hops}`,
							gold: levelId === "golden"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Lives",
							value: String(hud?.lives ?? level.lives)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Score",
							value: String(hud?.score ?? 0)
						})
					]
				})
			}),
			hud?.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute inset-x-0 top-[7.5rem] z-10 text-center font-display text-2xl text-brand uppercase drop-shadow sm:text-3xl",
				children: hud.message
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-0 flex-1 touch-none",
				onPointerDown: (e) => {
					if (e.target.closest("button")) return;
					engineRef.current?.pointerDown();
				},
				onPointerUp: () => engineRef.current?.pointerUp(),
				onPointerCancel: () => engineRef.current?.pointerUp(),
				onContextMenu: (e) => e.preventDefault(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
						ref: canvasRef,
						className: "block h-full w-full"
					}),
					!ready && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 grid place-items-center bg-ink text-paper",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl uppercase",
							children: "Warming the crepe soles…"
						})
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 grid place-items-center bg-ink p-6 text-center text-paper",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: error })
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute inset-x-0 bottom-3 z-10 text-center text-xs font-medium tracking-wide text-paper/85 uppercase sm:bottom-5",
				children: "Hold to charge · release to hop · land on the crepe sole"
			})
		]
	});
}
function Stat({ label, value, gold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-[3.4rem] text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[0.62rem] tracking-[0.16em] text-paper/60 uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("font-display text-lg tabular-nums leading-none", gold && "text-brand"),
			children: value
		})]
	});
}
var KEY = "gh60-progress-v2";
var EMPTY_PROGRESS = {
	decades: [],
	goldenBest: 0,
	goldenDone: false,
	bestScore: 0
};
function loadLocalProgress() {
	if (typeof window === "undefined") return { ...EMPTY_PROGRESS };
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return { ...EMPTY_PROGRESS };
		const parsed = JSON.parse(raw);
		return {
			decades: Array.isArray(parsed.decades) ? parsed.decades : [],
			goldenBest: Number(parsed.goldenBest) || 0,
			goldenDone: Boolean(parsed.goldenDone),
			bestScore: Number(parsed.bestScore) || 0
		};
	} catch {
		return { ...EMPTY_PROGRESS };
	}
}
function saveLocalProgress(p) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(KEY, JSON.stringify(p));
}
function mergeProgress(a, b) {
	const set = /* @__PURE__ */ new Set([...a.decades, ...b.decades]);
	return {
		decades: DECADE_IDS.filter((id) => set.has(id)),
		goldenBest: Math.max(a.goldenBest, b.goldenBest),
		goldenDone: a.goldenDone || b.goldenDone,
		bestScore: Math.max(a.bestScore, b.bestScore)
	};
}
function applyRun(p, levelId, won, hops, score) {
	const next = {
		...p,
		decades: [...p.decades]
	};
	if (won && levelId !== "golden" && !next.decades.includes(levelId)) next.decades.push(levelId);
	if (levelId === "golden") {
		next.goldenBest = Math.max(next.goldenBest, hops);
		if (won) next.goldenDone = true;
	}
	next.bestScore = Math.max(next.bestScore, score);
	return next;
}
function earnedTiers(p) {
	return {
		decade: p.decades.length >= 1,
		campaign: DECADE_IDS.every((id) => p.decades.includes(id)),
		golden: p.goldenDone
	};
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getMyProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("cc1dc7fb9f5528dbef9543fd6f8cc8e9049ababddb112653ffe5f274f3b8c2e4"));
var saveMyProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8acf258a73d1cf9cd30cad2ac25e968aa2243a1753a1268a6b4d9bf48bb90eed"));
var recordRun = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ad418558bf4d0633fd04e0e05c4c766e7c0c6919eb7ab37ee84758944e70b508"));
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
}).handler(createSsrRpc("9459412ed7fea33ca06419a341296259966bcc39b6902863ee21343e98aa32cb"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("168321d473fb6fc57c9f01d26ad345eee79aa97a56cffab51479ed005adbdeab"));
function GameApp() {
	const { user, isPending } = useCurrentUserState();
	const [screen, setScreen] = (0, import_react.useState)("title");
	const [progress, setProgress] = (0, import_react.useState)(EMPTY_PROGRESS);
	const [levelId, setLevelId] = (0, import_react.useState)("1966");
	const [result, setResult] = (0, import_react.useState)(null);
	const [claimTier, setClaimTier] = (0, import_react.useState)(null);
	const [synced, setSynced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setProgress(loadLocalProgress());
	}, []);
	(0, import_react.useEffect)(() => {
		if (isPending || !user || synced) return;
		let cancelled = false;
		getMyProgress().then((remote) => {
			if (cancelled) return;
			const merged = mergeProgress(loadLocalProgress(), remote.progress);
			setProgress(merged);
			saveLocalProgress(merged);
			saveMyProgress({ data: merged }).catch(() => void 0);
			setSynced(true);
		}).catch(() => setSynced(true));
		return () => {
			cancelled = true;
		};
	}, [
		isPending,
		user,
		synced
	]);
	const persist = (0, import_react.useCallback)((next) => {
		setProgress(next);
		saveLocalProgress(next);
		if (user) saveMyProgress({ data: next }).catch(() => void 0);
	}, [user]);
	const handleFinish = (0, import_react.useCallback)((run) => {
		setResult(run);
		setScreen("result");
		const next = applyRun(progress, run.levelId, run.won, run.hops, run.score);
		persist(next);
		if (user) recordRun({ data: {
			levelId: run.levelId,
			hops: run.hops,
			completed: run.won,
			perfects: run.perfects,
			score: run.score,
			elapsedMs: run.elapsedMs
		} }).catch(() => void 0);
	}, [
		persist,
		progress,
		user
	]);
	const startLevel = (id) => {
		setLevelId(id);
		setResult(null);
		setScreen("play");
	};
	const tiers = earnedTiers(progress);
	const allDecades = DECADE_IDS.every((id) => progress.decades.includes(id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh flex-col bg-ink text-paper",
		children: screen === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameStage, {
			levelId,
			onExit: () => setScreen("select"),
			onFinish: handleFinish
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-10 pt-4 sm:px-6",
			children: [
				screen === "title" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, {
					onPlay: () => setScreen("select"),
					onHow: () => setScreen("how"),
					onPrizes: () => setScreen("prizes")
				}) : null,
				screen === "how" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowTo, {
					onBack: () => setScreen("title"),
					onPlay: () => setScreen("select")
				}) : null,
				screen === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecadeSelect, {
					progress,
					allDecades,
					onPick: startLevel,
					onBack: () => setScreen("title")
				}) : null,
				screen === "result" && result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultScreen, {
					result,
					progress,
					tiers,
					onReplay: () => startLevel(result.levelId),
					onSelect: () => setScreen("select"),
					onClaim: (tier) => {
						setClaimTier(tier);
						setScreen("prizes");
					},
					onGolden: () => startLevel("golden")
				}) : null,
				screen === "prizes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizesScreen, {
					progress,
					tiers,
					userEmail: user?.primaryEmail ?? "",
					userName: user?.displayName ?? "",
					signedIn: Boolean(user),
					focusTier: claimTier,
					onBack: () => setScreen(result ? "result" : "title"),
					onTerms: () => setScreen("terms")
				}) : null,
				screen === "terms" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TermsScreen, { onBack: () => setScreen("prizes") }) : null
			]
		})] })
	});
}
function TopBar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center justify-between gap-3 px-4 py-3 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://www.grasshoppers.co.za",
				target: "_blank",
				rel: "noreferrer",
				className: "hidden text-sm font-semibold tracking-wide text-paper/70 uppercase underline-offset-4 hover:text-brand hover:underline sm:inline",
				children: "Shop"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthChip, {})]
		})]
	});
}
function TitleScreen({ onPlay, onHow, onPrizes }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid flex-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden bg-surface",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/assets/title-hero.jpg",
					alt: "Low-angle leap in a desert boot — urban campaign still",
					className: "aspect-[4/3] w-full object-cover object-top sm:aspect-[16/11]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-[0.28em] text-brand uppercase",
						children: "1966 — 2026"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-3xl uppercase text-paper sm:text-4xl",
						children: "The most comfy step."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SixtyBadge, { className: "absolute top-4 right-4" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/assets/logo-60.png",
					alt: "60 years since 1966",
					className: "mb-6 w-full max-w-md"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold tracking-[0.28em] text-brand uppercase",
					children: "Official birthday game"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-2 font-display text-6xl leading-[0.88] text-paper uppercase sm:text-7xl",
					children: [
						"The Great",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Hop"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-md text-base leading-relaxed text-paper/70",
					children: "Seven decades. Real desert boots. Land on the crepe sole and walk away with a voucher — or, if you can survive eighty golden hops, a free pair of your choice."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-7 flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onPlay,
							className: "h-12 bg-brand px-8 text-base font-semibold tracking-wide text-ink uppercase hover:bg-paper",
							children: "Start walking"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onHow,
							className: "h-12 border border-paper/25 px-6 text-base font-semibold tracking-wide text-paper uppercase hover:border-brand hover:text-brand",
							children: "How to play"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onPrizes,
							className: "h-12 px-5 text-base font-semibold tracking-wide text-paper/70 uppercase underline-offset-4 hover:text-brand hover:underline",
							children: "Prizes"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs leading-relaxed text-muted",
					children: "Handmade in Great Brak River. Play for fun — prizes are fulfilled after we verify your claim."
				})
			]
		})]
	});
}
function HowTo({ onBack, onPlay }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-2xl py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onBack,
				className: "text-sm font-semibold tracking-wide text-paper/70 uppercase",
				children: "← Back"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-display text-5xl text-paper uppercase",
				children: "How to play"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-8 space-y-4",
				children: [
					{
						n: "01",
						t: "Charge the hop",
						d: "Hold anywhere (or the space bar). The meter fills. On The Golden Pair it swings — release in the yellow band."
					},
					{
						n: "02",
						t: "Land on the crepe",
						d: "Every platform is a real desert boot from the campaign. Hit the cream sole. A centre landing is a Crepe Perfect."
					},
					{
						n: "03",
						t: "Walk the decades",
						d: "Clear a decade for a R50 voucher. Clear all seven — 1966 through 2026 — for R250. Beat eighty golden hops, one life, for any pair you want."
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-4 border border-line bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-3xl text-brand",
						children: s.n
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl text-paper uppercase",
						children: s.t
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-paper/70",
						children: s.d
					})] })]
				}, s.n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onPlay,
				className: "mt-8 h-12 bg-brand px-8 font-semibold tracking-wide text-ink uppercase hover:bg-paper",
				children: "Choose a decade"
			})
		]
	});
}
function DecadeSelect({ progress, allDecades, onPick, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onBack,
			className: "text-sm font-semibold tracking-wide text-paper/70 uppercase",
			children: "← Home"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap items-end justify-between gap-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-5xl text-paper uppercase",
				children: "Walk the decades"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-paper/70",
				children: [
					progress.decades.length,
					" of ",
					DECADE_IDS.length,
					" decades complete",
					progress.goldenBest ? ` · Golden best ${progress.goldenBest}/80` : ""
				]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-2",
			children: [DECADE_IDS.map((id) => {
				const lvl = LEVELS[id];
				const done = progress.decades.includes(id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPick(id),
					className: "group overflow-hidden bg-surface text-left ring-1 ring-line transition hover:-translate-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-32 overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: lvl.card,
								alt: "",
								className: "h-full w-full object-cover object-top transition group-hover:scale-105"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-3 left-3 bg-ink/80 px-2.5 py-1 text-xs font-semibold tracking-wider text-brand uppercase",
								children: lvl.year
							}),
							done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-3 right-3 bg-brand px-2.5 py-1 text-xs font-semibold tracking-wide text-ink uppercase",
								children: "Cleared"
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl text-paper uppercase",
								children: lvl.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-paper/70",
								children: lvl.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs font-semibold tracking-[0.16em] text-brand uppercase",
								children: [
									lvl.hops,
									" hops · ",
									lvl.lives,
									" lives"
								]
							})
						]
					})]
				}, id);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: !allDecades,
				onClick: () => allDecades && onPick("golden"),
				className: cn("overflow-hidden text-left ring-1 transition sm:col-span-2", allDecades ? "bg-ink text-paper ring-brand hover:-translate-y-0.5" : "cursor-not-allowed bg-surface text-muted ring-line"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-0 sm:grid-cols-[16rem_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/assets/bg-golden.jpg",
						alt: "",
						className: "h-32 w-full object-cover sm:h-full"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-[0.22em] text-brand uppercase",
								children: "Final challenge"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1 font-display text-3xl text-brand uppercase",
								children: "The Golden Pair"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-xl text-sm leading-relaxed text-paper/70",
								children: "Eighty hops. One life. Moving gold boots, a swinging meter, and no second chances. Beat it and choose any pair on the shop."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs font-semibold tracking-wide uppercase",
								children: allDecades ? "Unlocked — if you dare" : "Clear all seven decades to unlock"
							})
						]
					})]
				})
			})]
		})
	] });
}
function ResultScreen({ result, progress, tiers, onReplay, onSelect, onClaim, onGolden }) {
	const lvl = LEVELS[result.levelId];
	const allDecades = DECADE_IDS.every((id) => progress.decades.includes(id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-xl py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold tracking-[0.2em] text-brand uppercase",
				children: lvl.year
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-5xl text-paper uppercase",
				children: result.won ? "Decade walked" : "Sole missed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-paper/70",
				children: result.won ? result.levelId === "golden" ? "You did the impossible. A free pair is yours." : lvl.blurb : result.levelId === "golden" ? `You reached hop ${result.hops} of 80. The golden pair is still waiting.` : "The crepe is forgiving. Try the hop again."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-6 grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, {
						label: "Hops",
						value: `${result.hops}/${result.total}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, {
						label: "Perfects",
						value: String(result.perfects)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, {
						label: "Score",
						value: String(result.score)
					})
				]
			}),
			result.won && result.levelId !== "golden" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl text-paper uppercase",
						children: "You unlocked a prize"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-paper/70",
						children: tiers.campaign ? "All seven decades are yours — claim the R250 voucher." : "Claim a R50 voucher, then keep walking."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onClaim(tiers.campaign ? "campaign" : "decade"),
						className: "mt-3 h-11 bg-brand px-5 text-sm font-semibold tracking-wide text-ink uppercase",
						children: "Claim voucher"
					})
				]
			}) : null,
			result.won && result.levelId === "golden" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 border border-brand bg-ink p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl text-brand uppercase",
						children: "The Golden Pair is yours"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-paper/70",
						children: "Any style on the site. Sign in and tell us your size."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onClaim("golden"),
						className: "mt-3 h-11 bg-brand px-5 text-sm font-semibold tracking-wide text-ink uppercase",
						children: "Claim your pair"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onReplay,
						className: "h-11 bg-paper px-5 text-sm font-semibold tracking-wide text-ink uppercase",
						children: "Play again"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onSelect,
						className: "h-11 border border-paper/25 px-5 text-sm font-semibold tracking-wide text-paper uppercase",
						children: "Decades"
					}),
					allDecades && result.levelId !== "golden" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onGolden,
						className: "h-11 bg-brand px-5 text-sm font-semibold tracking-wide text-ink uppercase",
						children: "Face The Golden Pair"
					}) : null
				]
			})
		]
	});
}
function ScoreCell({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-line bg-surface px-3 py-3 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[0.65rem] tracking-[0.16em] text-muted uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl tabular-nums text-paper",
			children: value
		})]
	});
}
function PrizesScreen({ progress, tiers, userEmail, userName, signedIn, focusTier, onBack, onTerms }) {
	const [tier, setTier] = (0, import_react.useState)(focusTier ?? (tiers.golden ? "golden" : tiers.campaign ? "campaign" : "decade"));
	const [fullName, setFullName] = (0, import_react.useState)(userName);
	const [email, setEmail] = (0, import_react.useState)(userEmail);
	const [phone, setPhone] = (0, import_react.useState)("");
	const [shoeStyle, setShoeStyle] = (0, import_react.useState)("Any in-stock pair");
	const [shoeSize, setShoeSize] = (0, import_react.useState)("8");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const locked = !tiers[tier];
	const submit = async (e) => {
		e.preventDefault();
		setErr(null);
		if (!signedIn) {
			setErr("Sign in to claim — we need to know who the pair belongs to.");
			return;
		}
		setBusy(true);
		try {
			const res = await submitClaim({ data: {
				prizeTier: tier,
				fullName,
				email,
				phone,
				shoeStyle,
				shoeSize
			} });
			setCode(res.code);
		} catch (error) {
			setErr(error instanceof Error ? error.message : "Could not submit claim");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-2xl py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onBack,
				className: "text-sm font-semibold tracking-wide text-paper/70 uppercase",
				children: "← Back"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-display text-5xl text-paper uppercase",
				children: "Birthday prizes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-paper/70",
				children: "Vouchers and the free pair are fulfilled after we verify your run. One claim per prize per person."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizePick, {
						active: tier === "decade",
						locked: !tiers.decade,
						title: "R50 voucher",
						sub: `${progress.decades.length >= 1 ? "Unlocked" : "Clear one decade"}`,
						onClick: () => setTier("decade")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizePick, {
						active: tier === "campaign",
						locked: !tiers.campaign,
						title: "R250 voucher",
						sub: tiers.campaign ? "Unlocked" : `${progress.decades.length}/${DECADE_IDS.length} decades`,
						onClick: () => setTier("campaign")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizePick, {
						active: tier === "golden",
						locked: !tiers.golden,
						title: "Free pair",
						sub: tiers.golden ? "You did it" : `Best ${progress.goldenBest}/80`,
						gold: true,
						onClick: () => setTier("golden")
					})
				]
			}),
			code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 border border-brand bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-[0.2em] text-brand uppercase",
						children: "Your claim code"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-4xl tracking-wide text-brand",
						children: code
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-paper/70",
						children: "Save this code. We will match it to your account and send the voucher — or start making your pair — once verified."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://www.grasshoppers.co.za",
						target: "_blank",
						rel: "noreferrer",
						className: "mt-4 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold tracking-wide text-ink uppercase",
						children: "Visit the shop"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void submit(e),
				className: "mt-6 space-y-3 border border-line bg-surface p-5",
				children: [
					!signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "bg-ink px-3 py-2 text-sm text-paper/70",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "font-semibold text-brand underline-offset-2 hover:underline",
								children: "Sign in"
							}),
							" ",
							"to claim a prize. You can play as a guest; claims need an account."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Full name",
						value: fullName,
						onChange: setFullName,
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						value: email,
						onChange: setEmail,
						type: "email",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Phone",
						value: phone,
						onChange: setPhone
					}),
					tier === "golden" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-paper",
								children: "Preferred pair"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: shoeStyle,
								onChange: (e) => setShoeStyle(e.target.value),
								className: "mt-1 h-11 w-full border-0 bg-ink px-3 text-paper",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Any in-stock pair" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Wheat desert boot" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Tan suede" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Cocoa leather" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Black leather" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Kyle boot" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Sierra lace-up" })
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-paper",
								children: "UK size"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: shoeSize,
								onChange: (e) => setShoeSize(e.target.value),
								className: "mt-1 h-11 w-full border-0 bg-ink px-3 text-paper",
								children: [
									"4",
									"5",
									"6",
									"7",
									"8",
									"9",
									"10",
									"11",
									"12",
									"13"
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
							})]
						})]
					}) : null,
					err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-brand",
						children: err
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy || locked || !signedIn,
						className: "h-12 w-full bg-brand text-sm font-semibold tracking-wide text-ink uppercase disabled:cursor-not-allowed disabled:opacity-50",
						children: locked ? "Keep hopping to unlock" : busy ? "Sending…" : "Submit claim"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onTerms,
						className: "w-full text-center text-xs text-muted underline-offset-2 hover:underline",
						children: "Prize terms"
					})
				]
			})
		]
	});
}
function PrizePick({ active, locked, title, sub, gold, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("px-3 py-3 text-left ring-1", active && gold && "bg-brand text-ink ring-brand", active && !gold && "bg-brand text-ink ring-brand", !active && "bg-surface text-paper ring-line", locked && !active && "opacity-50"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("text-xs", active ? "text-ink/70" : "text-paper/60"),
			children: sub
		})]
	});
}
function Field({ label, value, onChange, type = "text", required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold text-paper",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			required,
			value,
			onChange: (e) => onChange(e.target.value),
			className: "mt-1 h-11 w-full border-0 bg-ink px-3 text-paper outline-none ring-0 focus:ring-2 focus:ring-brand"
		})]
	});
}
function TermsScreen({ onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-2xl py-2 text-sm leading-relaxed text-paper/70",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onBack,
				className: "text-sm font-semibold tracking-wide text-paper/70 uppercase",
				children: "← Prizes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-display text-4xl text-paper uppercase",
				children: "Prize terms"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 list-disc space-y-2 pl-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The Great Hop is the official 60th birthday game for the South African store." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Complete any decade to claim a R50 shop voucher. Complete all seven decades for a R250 voucher." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The Golden Pair (80 hops, one life) awards one free pair of any current style, subject to stock." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "One claim per prize tier per person. You must be 18+ and a South African resident." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Sign in, submit the form, and keep your claim code. Runs are verified before fulfilment." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Vouchers apply on grasshoppers.co.za and cannot be exchanged for cash. Staff decision is final." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Duplicate, automated, or clearly cheated claims may be refused." })
				]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { Home as component };
