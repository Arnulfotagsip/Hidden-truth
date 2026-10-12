/**
 * Procedural audio via WebAudio. No asset files are required, nothing plays
 * before a user gesture, and every call fails silently if audio is
 * unavailable — audio can never break gameplay.
 */
export type Sfx = "click" | "collect" | "paper" | "unlock" | "solve" | "wrong" | "miss" | "hint" | "combine" | "complete" | "step";

type AmbientKind = "interior" | "rain" | "wind" | "train" | "none";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambient: { stop: () => void } | null = null;
  private ambientKind: AmbientKind = "none";
  private unlocked = false;
  sfxOn = true;
  musicOn = true;
  sfxVolume = 0.7;
  musicVolume = 0.4;

  /** Must be called from a user gesture. */
  unlock() {
    if (this.unlocked) {
      void this.ctx?.resume();
      return;
    }
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain.connect(this.master);
      this.musicGain.connect(this.master);
      this.applyVolumes();
      this.unlocked = true;
      if (this.ambientKind !== "none") this.startAmbient(this.ambientKind);
    } catch {
      this.ctx = null;
    }
  }

  configure(s: { sfx: boolean; music: boolean; sfxVolume: number; musicVolume: number }) {
    this.sfxOn = s.sfx;
    this.musicOn = s.music;
    this.sfxVolume = s.sfxVolume;
    this.musicVolume = s.musicVolume;
    this.applyVolumes();
    if (!this.musicOn) this.stopAmbient(false);
    else if (this.ambientKind !== "none" && !this.ambient) this.startAmbient(this.ambientKind);
  }

  private applyVolumes() {
    if (!this.ctx || !this.sfxGain || !this.musicGain) return;
    const t = this.ctx.currentTime;
    this.sfxGain.gain.setTargetAtTime(this.sfxOn ? this.sfxVolume : 0, t, 0.05);
    this.musicGain.gain.setTargetAtTime(this.musicOn ? this.musicVolume * 0.5 : 0, t, 0.2);
  }

  private tone(freq: number, dur: number, opts: { type?: OscillatorType; gain?: number; delay?: number; slide?: number } = {}) {
    if (!this.ctx || !this.sfxGain) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = opts.type ?? "sine";
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * opts.slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(opts.gain ?? 0.25, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  private noise(dur: number, opts: { gain?: number; freq?: number; q?: number; delay?: number } = {}) {
    if (!this.ctx || !this.sfxGain) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = opts.freq ?? 2000;
    f.Q.value = opts.q ?? 0.8;
    const g = this.ctx.createGain();
    g.gain.value = opts.gain ?? 0.2;
    src.connect(f).connect(g).connect(this.sfxGain);
    src.start(t0);
  }

  play(s: Sfx) {
    if (!this.sfxOn || !this.ctx) return;
    try {
      switch (s) {
        case "click":
          this.tone(880, 0.05, { type: "triangle", gain: 0.08 });
          break;
        case "step":
          this.noise(0.12, { freq: 400, gain: 0.15 });
          break;
        case "miss":
          this.tone(220, 0.08, { type: "sine", gain: 0.05 });
          break;
        case "collect":
          this.tone(660, 0.18, { type: "triangle", gain: 0.16 });
          this.tone(990, 0.28, { type: "triangle", gain: 0.12, delay: 0.08 });
          break;
        case "paper":
          this.noise(0.25, { freq: 3500, q: 0.6, gain: 0.18 });
          break;
        case "unlock":
          this.noise(0.05, { freq: 1500, gain: 0.25 });
          this.tone(320, 0.1, { type: "square", gain: 0.05, delay: 0.06 });
          this.tone(480, 0.2, { type: "triangle", gain: 0.12, delay: 0.12 });
          break;
        case "combine":
          this.tone(520, 0.12, { type: "triangle", gain: 0.12 });
          this.tone(780, 0.2, { type: "triangle", gain: 0.12, delay: 0.1 });
          break;
        case "solve":
          [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.35, { type: "triangle", gain: 0.12, delay: i * 0.09 }));
          break;
        case "complete":
          [392, 523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.6, { type: "sine", gain: 0.14, delay: i * 0.12 }));
          break;
        case "wrong":
          this.tone(196, 0.22, { type: "sawtooth", gain: 0.05, slide: 0.8 });
          break;
        case "hint":
          this.tone(740, 0.3, { type: "sine", gain: 0.08 });
          this.tone(1110, 0.4, { type: "sine", gain: 0.05, delay: 0.1 });
          break;
      }
    } catch {
      /* audio is optional */
    }
  }

  setAmbient(kind: AmbientKind) {
    if (kind === this.ambientKind && this.ambient) return;
    this.ambientKind = kind;
    this.stopAmbient(true);
    if (kind !== "none") this.startAmbient(kind);
  }

  private stopAmbient(keepKind: boolean) {
    this.ambient?.stop();
    this.ambient = null;
    if (!keepKind) {
      /* keep ambientKind so it can resume when music is re-enabled */
    }
  }

  private startAmbient(kind: AmbientKind) {
    if (!this.ctx || !this.musicGain || !this.musicOn || kind === "none") return;
    try {
      const ctx = this.ctx;
      const out = ctx.createGain();
      out.gain.value = 0;
      out.connect(this.musicGain);
      out.gain.setTargetAtTime(1, ctx.currentTime, 1.5);
      const nodes: AudioScheduledSourceNode[] = [];
      // Low drone: two detuned oscillators through a lowpass filter.
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = kind === "train" ? 260 : 380;
      lp.connect(out);
      const base = kind === "wind" ? 65.4 : kind === "train" ? 55 : 73.4;
      [base, base * 1.5, base * 2.01].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = i === 0 ? "sine" : "triangle";
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = i === 0 ? 0.25 : 0.06;
        o.connect(g).connect(lp);
        o.start();
        nodes.push(o);
      });
      // Texture: filtered looping noise for rain / wind / rails.
      if (kind === "rain" || kind === "wind" || kind === "train") {
        const len = ctx.sampleRate * 2;
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const f = ctx.createBiquadFilter();
        f.type = kind === "rain" ? "highpass" : "bandpass";
        f.frequency.value = kind === "rain" ? 2500 : kind === "wind" ? 500 : 180;
        const g = ctx.createGain();
        g.gain.value = kind === "rain" ? 0.05 : kind === "wind" ? 0.08 : 0.12;
        src.connect(f).connect(g).connect(out);
        src.start();
        nodes.push(src);
      }
      this.ambient = {
        stop: () => {
          try {
            out.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
            nodes.forEach((n) => n.stop(ctx.currentTime + 1.5));
          } catch {
            /* ignore */
          }
        },
      };
    } catch {
      this.ambient = null;
    }
  }
}

export const audio = typeof window === "undefined" ? (null as unknown as AudioEngine) : new AudioEngine();

export function playSfx(s: Sfx) {
  audio?.play(s);
}
