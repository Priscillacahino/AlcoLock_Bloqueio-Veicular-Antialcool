/**
 * Automotive Audio Synthesizer via Web Audio API
 * Generates realistic relays, lockout alarms, starter crank, and engine rumble.
 */

let audioCtx: AudioContext | null = null;
let engineOsc: OscillatorNode | null = null;
let engineGain: GainNode | null = null;
let engineFilter: BiquadFilterNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundEffects = {
  // Beep curto de confirmação
  playBeep: (freq = 880, duration = 0.08) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignorar se áudio bloqueado pelo navegador
    }
  },

  // Alerta sonoro urgente de bloqueio por álcool (pulso bi-tonal de sirene de advertência veicular)
  playLockoutAlarm: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [0, 0.2, 0.4].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(520, now + offset);
        osc.frequency.setValueAtTime(780, now + offset + 0.1);
        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.18);
      });
    } catch {
      // Audio safety
    }
  },

  // Sinal acústico de autorização/desbloqueio (acorde harmônico límpido de aprovação)
  playUnlockChime: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // Dó, Mi, Sol, Dó
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.14, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {
      // Audio safety
    }
  },

  // Clique de relé elétrico automotivo (trava solenoide)
  playRelayClick: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio safety
    }
  },

  // Sopro de amostragem de ar (ruído de fluxo de ar suave)
  playBreathAirflow: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {
      // Audio safety
    }
  },

  // Arranque e ronco da partida (Crank & Ignition)
  playStarterIgnition: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Pulsações de arranque do motor elétrico
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(45 + i * 8, now + i * 0.22);
        gain.gain.setValueAtTime(0.2, now + i * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.22 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.22);
        osc.stop(now + i * 0.22 + 0.18);
      }

      // Ignição pega e acelera suavemente
      const revOsc = ctx.createOscillator();
      const revGain = ctx.createGain();
      revOsc.type = 'triangle';
      revOsc.frequency.setValueAtTime(65, now + 0.9);
      revOsc.frequency.exponentialRampToValueAtTime(140, now + 1.3);
      revOsc.frequency.exponentialRampToValueAtTime(75, now + 1.8);
      revGain.gain.setValueAtTime(0.01, now + 0.9);
      revGain.gain.linearRampToValueAtTime(0.25, now + 1.2);
      revGain.gain.exponentialRampToValueAtTime(0.08, now + 2.0);
      revOsc.connect(revGain);
      revGain.connect(ctx.destination);
      revOsc.start(now + 0.9);
      revOsc.stop(now + 2.0);
    } catch {
      // Audio safety
    }
  },

  // Loop de marcha lenta do motor quando ligado
  startEngineIdleSound: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx || engineOsc) return;

      engineOsc = ctx.createOscillator();
      engineGain = ctx.createGain();
      engineFilter = ctx.createBiquadFilter();

      engineOsc.type = 'sawtooth';
      engineOsc.frequency.setValueAtTime(55, ctx.currentTime); // ~800 RPM fundamental harmonic

      engineFilter.type = 'lowpass';
      engineFilter.frequency.setValueAtTime(180, ctx.currentTime);

      engineGain.gain.setValueAtTime(0.04, ctx.currentTime);

      engineOsc.connect(engineFilter);
      engineFilter.connect(engineGain);
      engineGain.connect(ctx.destination);

      engineOsc.start();
    } catch {
      // Audio safety
    }
  },

  stopEngineIdleSound: () => {
    try {
      if (engineGain && audioCtx) {
        engineGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      }
      setTimeout(() => {
        if (engineOsc) {
          try {
            engineOsc.stop();
            engineOsc.disconnect();
          } catch {
            // ignore
          }
          engineOsc = null;
        }
        engineGain = null;
        engineFilter = null;
      }, 450);
    } catch {
      engineOsc = null;
    }
  },
};
