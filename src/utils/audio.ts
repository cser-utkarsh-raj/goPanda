// Lightweight zero-RAM Web Audio API Synthesizer
let audioCtx: AudioContext | null = null;

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

/**
 * Play a gentle wooden bamboo clack sound
 */
export function playBambooClick(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 3;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {
    // Graceful fallback if audio is blocked
  }
}

/**
 * Play a gentle, soothing chime for phase completion (warm sine harmonic)
 */
export function playChime(volume = 0.6) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const startTime = ctx.currentTime + index * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume * 0.25, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.3);
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Play a cute celebratory fanfare for task completion
 */
export function playTaskCheer(volume = 0.6) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chords = [
      { freq: 440, delay: 0 },
      { freq: 554.37, delay: 0.08 },
      { freq: 659.25, delay: 0.16 },
      { freq: 880, delay: 0.28 },
    ];

    chords.forEach(({ freq, delay }) => {
      const startTime = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  } catch {
    // Graceful fallback
  }
}

// Ambient Noise Generator Nodes
let ambientSourceNode: AudioNode | null = null;
let ambientGainNode: GainNode | null = null;

export type AmbientSoundType = 'off' | 'rain' | 'whitenoise' | 'zenriver' | 'thetawaves';

export function stopAmbientSound() {
  if (ambientGainNode && audioCtx) {
    try {
      ambientGainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      setTimeout(() => {
        if (ambientSourceNode) {
          try {
            if ('stop' in ambientSourceNode && typeof (ambientSourceNode as AudioBufferSourceNode).stop === 'function') {
              (ambientSourceNode as AudioBufferSourceNode).stop();
            }
            ambientSourceNode.disconnect();
          } catch {
            // ignore
          }
          ambientSourceNode = null;
        }
      }, 350);
    } catch {
      // ignore
    }
  }
}

export function startAmbientSound(type: AmbientSoundType, volume = 0.25) {
  stopAmbientSound();
  if (type === 'off') return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    ambientGainNode = ctx.createGain();
    ambientGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    ambientGainNode.gain.linearRampToValueAtTime(volume * 0.2, ctx.currentTime + 0.5);
    ambientGainNode.connect(ctx.destination);

    if (type === 'whitenoise' || type === 'rain' || type === 'zenriver') {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink/Brown noise blend
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else if (type === 'zenriver') {
          // Softer rushing water
          output[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = output[i];
          output[i] *= 2.5;
        } else {
          // Standard soft white noise
          output[i] = white * 0.4;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 900;
      } else if (type === 'zenriver') {
        filter.type = 'bandpass';
        filter.frequency.value = 650;
        filter.Q.value = 1.2;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 1400;
      }

      whiteNoise.connect(filter);
      filter.connect(ambientGainNode);
      whiteNoise.start(ctx.currentTime + 0.1);
      ambientSourceNode = whiteNoise;
    } else if (type === 'thetawaves') {
      // 40Hz / 6Hz binaural/isochronic beat generator for deep focus
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(144, ctx.currentTime); // Grounding tone
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 250;

      osc.connect(filter);
      filter.connect(ambientGainNode);
      osc.start(ctx.currentTime + 0.1);
      ambientSourceNode = osc;
    }
  } catch {
    // fallback
  }
}

