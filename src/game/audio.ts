export class AudioManager {
  ctx: AudioContext | null = null;
  bgmGain: GainNode | null = null;
  isStarted = false;

  init() {
    if (this.isStarted) return;
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();
    this.bgmGain = this.ctx!.createGain();
    this.bgmGain.gain.value = 0.1;
    this.bgmGain.connect(this.ctx!.destination);
    this.startBGM();
    this.isStarted = true;
  }

  startBGM() {
    if (!this.ctx || !this.bgmGain) return;
    const playNote = (freq: number, time: number, duration: number, vol = 0.05, type: OscillatorType = 'triangle') => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(vol, time + 0.02);
      g.gain.linearRampToValueAtTime(0, time + duration);
      osc.connect(g);
      g.connect(this.bgmGain!);
      osc.start(time);
      osc.stop(time + duration);
    };

    const loop = () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const step = 0.2;
      const progressions = [
        [261.63, 329.63, 392.00], [349.23, 440.00, 523.25],
        [392.00, 493.88, 587.33], [261.63, 311.13, 392.00]
      ];
      for (let i = 0; i < 32; i++) {
        const time = now + i * step;
        const bar = Math.floor(i / 8);
        const chord = progressions[bar % progressions.length];
        if (i % 4 === 0) playNote(chord[0] / 2, time, step * 2, 0.1, 'sine');
        if (i % 2 === 0) playNote(chord[Math.floor(Math.random() * chord.length)], time, step * 0.6, 0.03, 'triangle');
      }
      setTimeout(loop, 32 * step * 1000);
    };
    loop();
  }

  playHit() { this.quickSound(880, 440, 0.1, 'sine'); }
  playBossHit() { this.quickSound(220, 110, 0.1, 'square'); }
  playPowerUp() { this.quickSound(440, 880, 0.3, 'sawtooth'); }
  playPopup() { this.quickSound(1000, 1200, 0.1, 'sine'); }

  quickSound(f1: number, f2: number, dur: number, type: OscillatorType) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f1, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(f2, this.ctx.currentTime + dur);
    g.gain.setValueAtTime(0.1, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);
    osc.connect(g); g.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + dur);
  }

  playGrandVictory() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const melody = [523, 659, 783, 1046, 1318, 1567];
    melody.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + i * 0.2);
      g.gain.setValueAtTime(0.1, now + i * 0.2);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.5);
      osc.connect(g); g.connect(this.ctx!.destination);
      osc.start(now + i * 0.2); osc.stop(now + i * 0.2 + 0.5);
    });
  }
}

export const audioManager = new AudioManager();
