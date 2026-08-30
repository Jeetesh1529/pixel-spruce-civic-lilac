import type { GameImages } from "./assets";
import { HopAudio } from "./audio";
import type { HudSnap, LevelDef, Particle, PlayMode, RunResult, Shoe, ShoeKind } from "./types";

const GRAVITY = 1950;
const PLAYER_H = 216;
const SHOE_H = 52;
const FIXED = 1 / 60;
const BRAND = "#fce300";
const PAPER = "#ffffff";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export class HopEngine {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private images: GameImages;
  private level: LevelDef;
  private audio: HopAudio;
  private onFinish: (r: RunResult) => void;
  private onHud: (h: HudSnap) => void;

  private running = false;
  private raf = 0;
  private acc = 0;
  private last = 0;
  private elapsed = 0;
  private animT = 0;

  private mode: PlayMode = "ready";
  private hop = 0;
  private lives: number;
  private score = 0;
  private perfects = 0;
  private message = "Hold to charge · release to hop";
  private messageT = 0;

  private player = { x: 180, y: 420, vx: 0, vy: 0, w: 72, h: PLAYER_H };
  private shoes: Shoe[] = [];
  private camX = 0;
  private camY = 0;
  private shake = 0;
  private particles: Particle[] = [];
  private charge = 0;
  private chargeDir = 1;
  private holding = false;
  private sweetLo = 0.42;
  private sweetHi = 0.58;
  private lastChargeTick = 0;
  private celebrateT = 0;
  private fallT = 0;
  private startMs = 0;
  private dpr = 1;
  private viewW = 1280;
  private viewH = 720;

  constructor(
    canvas: HTMLCanvasElement,
    images: GameImages,
    level: LevelDef,
    audio: HopAudio,
    hooks: { onFinish: (r: RunResult) => void; onHud: (h: HudSnap) => void },
  ) {
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
    const loop = (now: number) => {
      if (!this.running) return;
      let dt = (now - this.last) / 1000;
      this.last = now;
      dt = Math.min(dt, 0.1);
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
      this.charge = this.level.oscillate ? 0 : 0.02;
      this.chargeDir = 1;
      this.audio.unlock();
    }
  }

  pointerUp() {
    if (this.mode !== "charging" || !this.holding) return;
    this.holding = false;
    this.launch();
  }

  private resetWorld() {
    this.shoes = [];
    const first = this.makeShoe(120, 0, (this.level.baseWidth + 24) * this.worldScale());
    this.shoes.push(first);
    this.player.h = 216 * clamp(this.worldScale() * 1.05, 0.72, 1);
    this.player.x = first.x + first.w * 0.22;
    this.player.y = first.y - this.player.h + 28;
    this.player.vx = 0;
    this.player.vy = 0;
    this.spawnNext();
    this.recomputeSweet();
    this.camX = this.player.x - this.viewW * (this.viewW < 560 ? 0.18 : 0.3);
    this.camY = 0;
  }

  private worldScale() {
    return clamp(this.viewW / 960, 0.56, 1);
  }

  private makeShoe(x: number, hopIndex: number, width?: number): Shoe {
    const t = hopIndex / Math.max(1, this.level.hops);
    const scale = this.worldScale();
    const w =
      width ?? Math.max(this.level.minWidth * scale, (this.level.baseWidth - hopIndex * this.level.widthShrink) * scale);
    const kinds = this.level.shoeKinds;
    const kind = kinds[hopIndex % kinds.length] as ShoeKind;
    const yJitter = hopIndex === 0 ? 0 : rand(-28, 34) * (0.4 + t) * scale;
    const ground = this.viewH * 0.68;
    return {
      x,
      y: ground + yJitter,
      w,
      h: SHOE_H,
      kind,
      phase: rand(0, Math.PI * 2),
      baseX: x,
      moveAmp: hopIndex === 0 ? 0 : this.level.moveAmp * (0.35 + t),
      moveSpeed: this.level.moveSpeed * (0.8 + t * 0.7),
    };
  }

  private spawnNext() {
    const prev = this.shoes[this.shoes.length - 1];
    const idx = this.hop + 1;
    const scale = this.worldScale();
    const extra = idx === 1 ? 36 : 0;
    const gap = (this.level.baseGap + idx * this.level.gapScale + extra + rand(-10, 22)) * scale;
    const nextW = Math.max(
      this.level.minWidth * scale,
      (this.level.baseWidth - (this.hop + 1) * this.level.widthShrink) * scale,
    );
    const shoe = this.makeShoe(prev.x + prev.w + gap, this.hop + 1, nextW);
    this.shoes.push(shoe);
    if (this.shoes.length > 4) this.shoes.shift();
  }

  private velocityFor(power: number) {
    const p = clamp(power, 0.05, 1);
    const s = this.worldScale();
    return {
      vx: (340 + p * 820) * s,
      vy: -(400 + p * 420) * Math.sqrt(s),
    };
  }

  private predictLandX(power: number) {
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
      vxi += this.windNow() * FIXED * 0.15;
      vyi += GRAVITY * FIXED;
      x += vxi * FIXED;
      y += vyi * FIXED;
      if (vyi > 0 && y >= targetY) break;
    }
    return x;
  }

  private recomputeSweet() {
    const next = this.nextShoe();
    if (!next) return;
    const pad = this.level.sweetPad;
    const samples: { p: number; x: number }[] = [];
    for (let i = 0; i <= 40; i++) {
      const p = i / 40;
      samples.push({ p, x: this.predictLandX(p) });
    }
    const loX = next.x + next.w * 0.22;
    const hiX = next.x + next.w * 0.72;
    const hits = samples.filter((s) => s.x >= loX && s.x <= hiX);
    if (hits.length >= 2) {
      this.sweetLo = clamp(hits[0].p - pad * 0.15, 0.08, 0.9);
      this.sweetHi = clamp(hits[hits.length - 1].p + pad * 0.15, this.sweetLo + 0.03, 0.96);
    } else {
      this.sweetLo = 0.45 - pad;
      this.sweetHi = 0.55 + pad;
    }
    if (this.level.oscillate) {
      const mid = (this.sweetLo + this.sweetHi) / 2;
      const half = Math.max(0.012, (this.sweetHi - this.sweetLo) * 0.35 - this.hop * 0.0003);
      this.sweetLo = mid - half;
      this.sweetHi = mid + half;
    }
  }

  private currentShoe() {
    return this.shoes[this.shoes.length - 2] ?? this.shoes[0];
  }

  private nextShoe() {
    return this.shoes[this.shoes.length - 1];
  }

  private windNow() {
    const t = this.hop / Math.max(1, this.level.hops);
    return this.level.wind * (0.4 + t) * Math.sin(this.elapsed * 1.3 + this.hop);
  }

  private launch() {
    const power = clamp(this.charge, 0.06, 1);
    const { vx, vy } = this.velocityFor(power);
    this.player.vx = vx;
    this.player.vy = vy;
    this.mode = "flight";
    this.audio.hop();
    this.burst(this.player.x, this.player.y + this.player.h, 10, PAPER);
  }

  private step(dt: number) {
    this.elapsed += dt;
    this.animT += dt;
    this.messageT = Math.max(0, this.messageT - dt);
    this.shake *= 0.88;

    for (const s of this.shoes) {
      if (s.moveAmp > 0) {
        s.x = s.baseX + Math.sin(this.elapsed * s.moveSpeed + s.phase) * s.moveAmp;
      }
    }

    if (this.mode === "charging" && this.holding) {
      if (this.level.oscillate) {
        const spd = this.level.oscSpeed + this.hop * 0.022;
        this.charge += this.chargeDir * spd * dt;
        if (this.charge >= 1) {
          this.charge = 1;
          this.chargeDir = -1;
        }
        if (this.charge <= 0) {
          this.charge = 0;
          this.chargeDir = 1;
        }
      } else {
        this.charge = clamp(this.charge + this.level.chargeRate * dt, 0, 1);
      }
      if (this.elapsed - this.lastChargeTick > 0.09) {
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
        if (this.hop >= this.level.hops) {
          this.win();
        } else {
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
        if (this.lives <= 0) {
          this.lose();
        } else {
          this.restoreOnShoe();
        }
      }
    }

    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 420 * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    const lead = this.viewW < 560 ? 0.18 : 0.3;
    const targetCam = this.player.x - this.viewW * lead;
    this.camX += (targetCam - this.camX) * (1 - Math.exp(-4.2 * dt));
  }

  private checkLand() {
    if (this.player.vy < 80) return;
    const next = this.nextShoe();
    if (!next) return;
    const feetY = this.player.y + this.player.h;
    const cx = this.player.x + this.player.w * 0.45;
    const inset = this.level.landInset;
    const onTop = feetY >= next.y - 8 && feetY <= next.y + 22;
    const inX = cx >= next.x + next.w * inset && cx <= next.x + next.w * (1 - inset);
    if (onTop && inX) {
      this.player.y = next.y - this.player.h + 28;
      this.player.vx = 0;
      this.player.vy = 0;
      const mid = next.x + next.w * 0.5;
      const perfect = Math.abs(cx - mid) < next.w * 0.16;
      this.succeedHop(perfect);
    }
  }

  private succeedHop(perfect: boolean) {
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
    this.celebrateT = 0.38;
    this.spawnNext();
    this.recomputeSweet();
  }

  private failHop() {
    if (this.mode === "fallen" || this.mode === "lost" || this.mode === "won") return;
    this.lives -= 1;
    this.mode = "fallen";
    this.fallT = 0.7;
    this.shake = 10;
    this.audio.fall();
    this.message = this.level.id === "golden" ? "Back to hop 1" : "Missed the sole";
    this.messageT = 1.2;
    this.burst(this.player.x, this.player.y + 40, 14, BRAND);
  }

  private restoreOnShoe() {
    if (this.level.id === "golden") {
      this.hop = 0;
      this.score = Math.floor(this.score * 0.15);
      this.perfects = 0;
      this.resetWorld();
      this.lives = 1;
      this.mode = "ready";
      this.message = `One life. ${this.level.hops} hops.`;
      return;
    }
    const shoe = this.currentShoe();
    this.player.x = shoe.x + shoe.w * 0.22;
    this.player.y = shoe.y - this.player.h + 28;
    this.player.vx = 0;
    this.player.vy = 0;
    this.mode = "ready";
  }

  private finish(won: boolean) {
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
      elapsedMs: Math.round(performance.now() - this.startMs),
    });
  }

  private win() {
    this.audio.win();
    this.finish(true);
  }

  private lose() {
    this.finish(false);
  }

  private burst(x: number, y: number, n: number, color: string) {
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x,
        y,
        vx: rand(-180, 180),
        vy: rand(-280, -40),
        life: rand(0.3, 0.7),
        max: 0.7,
        size: rand(2, 6),
        color,
      });
    }
  }

  private emitHud() {
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
      elapsed: this.elapsed,
    });
  }

  private activeBackground() {
    const list = this.level.backgrounds?.length ? this.level.backgrounds : [this.level.background];
    const t = this.hop / Math.max(1, this.level.hops);
    const i = Math.min(list.length - 1, Math.floor(t * list.length));
    return this.images.backgrounds[list[i]] ?? this.images.backgrounds[this.level.background];
  }

  private draw() {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.viewW, this.viewH);

    const shakeX = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    const shakeY = this.shake ? (Math.random() - 0.5) * this.shake : 0;

    const bg = this.activeBackground();
    if (bg) {
      const par = this.camX * 0.12;
      const scale = Math.max(this.viewW / bg.width, this.viewH / bg.height) * 1.08;
      const bw = bg.width * scale;
      const bh = bg.height * scale;
      const bx = -((par % bw) + bw * 0.15);
      ctx.drawImage(bg, bx + shakeX * 0.3, (this.viewH - bh) * 0.35 + shakeY * 0.3, bw, bh);
      ctx.drawImage(bg, bx + bw - 2 + shakeX * 0.3, (this.viewH - bh) * 0.35 + shakeY * 0.3, bw, bh);
    } else {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, this.viewW, this.viewH);
    }

    const g = ctx.createLinearGradient(0, 0, 0, this.viewH);
    g.addColorStop(0, "rgba(0,0,0,0.28)");
    g.addColorStop(0.35, "rgba(0,0,0,0)");
    g.addColorStop(0.72, "rgba(0,0,0,0.08)");
    g.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.viewW, this.viewH);

    ctx.save();
    ctx.translate(-this.camX + shakeX, 8 + shakeY);

    for (const s of this.shoes) this.drawShoe(s);

    if (this.mode === "charging" && this.hop < this.level.hidePreviewAfter) {
      this.drawPreview();
    }

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

  private drawShoe(s: Shoe) {
    const img = this.images.shoes[s.kind];
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(s.x + s.w * 0.5, s.y + 18, s.w * 0.52, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    if (img) {
      const drawW = s.w * 1.18;
      const drawH = drawW * (img.height / img.width);
      const drawX = s.x - (drawW - s.w) * 0.45;
      const drawY = s.y - drawH * 0.78;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = BRAND;
      ctx.fillRect(s.x, s.y, s.w, s.h);
    }
    ctx.restore();
  }

  private drawPreview() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = "rgba(252,227,0,0.55)";
    ctx.setLineDash([6, 8]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    const { vx, vy } = this.velocityFor(this.charge);
    let x = this.player.x + this.player.w * 0.45;
    let y = this.player.y + this.player.h * 0.4;
    let vxi = vx;
    let vyi = vy;
    ctx.moveTo(x, y);
    for (let i = 0; i < 36; i++) {
      vxi += this.windNow() * FIXED * 0.2;
      vyi += GRAVITY * FIXED;
      x += vxi * FIXED * 2.2;
      y += vyi * FIXED * 2.2;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  private drawPlayer() {
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
    ctx.ellipse(this.player.x + w * 0.52, this.player.y + h - 6, w * 0.34, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(img, this.player.x, this.player.y, w, h);
    ctx.restore();
  }

  private drawMeter() {
    const ctx = this.ctx;
    const x = 22;
    const y = this.viewH * 0.26;
    const w = 22;
    const h = this.viewH * 0.44;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.62)";
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 16, w + 16, h + 32, 4);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(x, y, w, h);
    const lo = y + h * (1 - this.sweetHi);
    const hi = y + h * (1 - this.sweetLo);
    ctx.fillStyle = BRAND;
    ctx.fillRect(x, lo, w, Math.max(6, hi - lo));
    const ny = y + h * (1 - this.charge);
    ctx.fillStyle = PAPER;
    ctx.fillRect(x - 4, ny - 3, w + 8, 6);
    ctx.restore();
  }
}
