// Tiny synth-based sound effects using the Web Audio API.
// No external audio assets, so nothing to license or ship.

let ctx = null;
function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function tone({ freq = 440, duration = 0.12, type = "sine", gain = 0.05, delay = 0 }) {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const now = audioCtx.currentTime + delay;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(g).connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export const sfx = {
  click: () => tone({ freq: 720, duration: 0.06, type: "square", gain: 0.03 }),
  correct: () => {
    tone({ freq: 520, duration: 0.1, type: "sine", gain: 0.05 });
    tone({ freq: 780, duration: 0.14, type: "sine", gain: 0.05, delay: 0.08 });
  },
  wrong: () => {
    tone({ freq: 220, duration: 0.18, type: "sawtooth", gain: 0.04 });
    tone({ freq: 140, duration: 0.22, type: "sawtooth", gain: 0.04, delay: 0.1 });
  },
  warning: () => tone({ freq: 900, duration: 0.08, type: "square", gain: 0.03 }),
  complete: () => {
    [520, 660, 780, 1040].forEach((f, i) =>
      tone({ freq: f, duration: 0.16, type: "sine", gain: 0.05, delay: i * 0.09 })
    );
  },
};

export function playSfx(name, enabled) {
  if (!enabled) return;
  try {
    sfx[name] && sfx[name]();
  } catch {
    // ignore -- audio is a nice-to-have, never block gameplay on it
  }
}
