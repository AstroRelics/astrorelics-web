/**
 * Sintetizador de efeitos sonoros espaciais baseado na Web Audio API.
 * O áudio inicia estritamente desativado (`enabled = false`) e só emite som
 * após ativação explícita pelo usuário no controle da interface.
 */
class SpaceSoundController {
  private ctx: AudioContext | null = null;
  private enabled = false;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(nextState: boolean): boolean {
    this.enabled = nextState;

    if (this.enabled) {
      this.ensureContext();
      this.startAmbientPad();
      this.playSubtleChime(520, 0.08);
    } else {
      this.stopAmbientPad();
    }

    return this.enabled;
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private startAmbientPad(): void {
    const ctx = this.ensureContext();
    if (!ctx || this.ambientGain) return;

    try {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 1.2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, ctx.currentTime);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 profundo

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(82.41, ctx.currentTime); // E2 quinta espacial

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      this.ambientGain = masterGain;
      this.ambientOsc1 = osc1;
      this.ambientOsc2 = osc2;
    } catch {
      // Ignora silenciosamente se o navegador bloquear áudio
    }
  }

  private stopAmbientPad(): void {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      const osc1 = this.ambientOsc1;
      const osc2 = this.ambientOsc2;
      setTimeout(() => {
        try {
          osc1?.stop();
          osc2?.stop();
          osc1?.disconnect();
          osc2?.disconnect();
        } catch {
          // noop
        }
      }, 400);
    } catch {
      // noop
    } finally {
      this.ambientGain = null;
      this.ambientOsc1 = null;
      this.ambientOsc2 = null;
    }
  }

  public playHighlightPing(): void {
    if (!this.enabled) return;
    this.playSubtleChime(660, 0.09);
  }

  public playResetTone(): void {
    if (!this.enabled) return;
    this.playSubtleChime(440, 0.11);
  }

  private playSubtleChime(freq: number, duration: number): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.12, now + duration);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // noop
    }
  }

  /**
   * Efeito sonoro cinematográfico em três fases sincronizado com a viagem espacial:
   * 1. Aceleração (subida harmônica)
   * 2. Viagem (impulso grave filtrado)
   * 3. Chegada (desaceleração suave na órbita do destino)
   */
  public playHyperspaceTravel(durationSec = 2.5): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const accelEnd = now + durationSec * 0.26;
      const cruiseEnd = now + durationSec * 0.74;
      const arrivalEnd = now + durationSec;

      // Oscilador grave de propulsão
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(48, now);
      subOsc.frequency.exponentialRampToValueAtTime(135, accelEnd);
      subOsc.frequency.setValueAtTime(135, cruiseEnd);
      subOsc.frequency.exponentialRampToValueAtTime(52, arrivalEnd);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now);
      filter.frequency.exponentialRampToValueAtTime(620, accelEnd);
      filter.frequency.exponentialRampToValueAtTime(110, arrivalEnd);

      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.exponentialRampToValueAtTime(0.075, accelEnd);
      subGain.gain.setValueAtTime(0.065, cruiseEnd);
      subGain.gain.exponentialRampToValueAtTime(0.0001, arrivalEnd);

      subOsc.connect(filter);
      filter.connect(subGain);
      subGain.connect(ctx.destination);

      subOsc.start(now);
      subOsc.stop(arrivalEnd + 0.05);

      // Harmônico etéreo de chegada
      const shimmerOsc = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmerOsc.type = 'sine';
      shimmerOsc.frequency.setValueAtTime(220, now);
      shimmerOsc.frequency.exponentialRampToValueAtTime(440, accelEnd);
      shimmerOsc.frequency.exponentialRampToValueAtTime(293.66, arrivalEnd);

      shimmerGain.gain.setValueAtTime(0.0001, now);
      shimmerGain.gain.exponentialRampToValueAtTime(0.03, accelEnd);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, arrivalEnd);

      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);

      shimmerOsc.start(now);
      shimmerOsc.stop(arrivalEnd + 0.05);
    } catch {
      // noop
    }
  }
}

export const soundEffects = new SpaceSoundController();
