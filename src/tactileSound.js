// Tactile Mechanical Sound Synthesizer for Project Showcase Transitions
// Uses Web Audio API for zero-latency, zero-dependency, pristine tactile clicks

let audioCtx = null;
let soundEnabled = false;

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = !!enabled;
  if (soundEnabled && !audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    } catch (e) {
      console.warn('Web Audio not supported', e);
    }
  }
  if (soundEnabled && audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return soundEnabled;
}

export function playSlideSound() {
  if (!soundEnabled) return;

  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      } else {
        return;
      }
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
      return;
    }

    const t = audioCtx.currentTime;

    // 1. High transient snap (mechanical switch click)
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.038);

    oscGain.gain.setValueAtTime(0.09, t);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.042);

    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.045);

    // 2. Subtle low-end mechanical resonance
    const subOsc = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(260, t);
    subOsc.frequency.exponentialRampToValueAtTime(60, t + 0.05);

    subGain.gain.setValueAtTime(0.06, t);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);

    subOsc.connect(subGain);
    subGain.connect(audioCtx.destination);

    subOsc.start(t);
    subOsc.stop(t + 0.06);
  } catch (err) {
    // Graceful fallback
  }
}
