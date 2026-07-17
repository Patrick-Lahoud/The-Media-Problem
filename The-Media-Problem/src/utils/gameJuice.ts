// Web Audio API and Haptic Vibration Engine for "Game Feel"

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn("Web Audio Context could not be created:", e);
    return null;
  }
}

/**
 * Plays an ascending arpeggio chime (Success feeling)
 */
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Ascending major chord (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + index * 0.08 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.35);
    });
  } catch (e) {
    console.warn("Success sound blocked or failed:", e);
  }
}

/**
 * Plays a low-pitched warning dual-frequency buzz (Error feeling)
 */
export function playErrorSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.type = "triangle";
    osc2.type = "sawtooth";
    
    // Low dissonant frequency pairs for tension
    osc1.frequency.setValueAtTime(135, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.28);
    
    osc2.frequency.setValueAtTime(138, now);
    osc2.frequency.exponentialRampToValueAtTime(81, now + 0.28);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 0.32);
    osc2.stop(now + 0.32);
  } catch (e) {
    console.warn("Error sound blocked or failed:", e);
  }
}

/**
 * Plays a very light tactile selection tick
 */
export function playTapSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.04);
    
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {
    // Silent catch
  }
}

/**
 * Triggers haptic double-vibration pulse for success
 */
export function triggerHapticSuccess() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate([35, 45, 35]);
    } catch (e) {
      // Ignored (unsupported or security restriction in iframe)
    }
  }
}

/**
 * Triggers a single heavy haptic vibration pulse for errors
 */
export function triggerHapticError() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(120);
    } catch (e) {
      // Ignored
    }
  }
}

/**
 * Triggers a very light tactile tap vibration pulse
 */
export function triggerHapticTap() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(10);
    } catch (e) {
      // Ignored
    }
  }
}
