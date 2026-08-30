export class HopAudio {
  private ctx: AudioContext | null = null;
  muted = false;

  unlock() {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    void this.ctx.resume();
  }

  private tone(freq: number, dur: number, type: OscillatorType, gain = 0.08, slide = 0) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  chargeTick(charge: number) {
    this.tone(180 + charge * 420, 0.05, "sine", 0.03);
  }

  hop() {
    this.tone(280, 0.18, "triangle", 0.09, 220);
  }

  land(perfect: boolean) {
    if (perfect) {
      this.tone(520, 0.12, "sine", 0.08);
      this.tone(780, 0.2, "triangle", 0.05);
    } else {
      this.tone(240, 0.1, "sine", 0.07);
    }
  }

  fall() {
    this.tone(220, 0.35, "sawtooth", 0.05, -160);
  }

  win() {
    this.tone(392, 0.16, "triangle", 0.08);
    this.tone(523, 0.2, "triangle", 0.07);
    this.tone(659, 0.28, "sine", 0.06);
  }
}
