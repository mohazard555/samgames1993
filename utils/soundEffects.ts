// Comprehensive Web Audio API Sound System for Games, Quizzes, and Interactive Learning

let audioCtx: AudioContext | null = null;
let hasUserInteracted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Auto-activate AudioContext on first interaction in the browser or mobile WebView
if (typeof window !== 'undefined') {
  const resumeAudio = () => {
    hasUserInteracted = true;
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  ['click', 'touchstart', 'touchend', 'keydown'].forEach((eventName) => {
    window.addEventListener(eventName, resumeAudio, { once: false, passive: true });
  });
}

/**
 * Play a cheerful sparkling success chime (Correct Answer)
 */
export function playSuccessSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Chime notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  } catch (err) {
    console.error('Audio play error:', err);
  }
}

/**
 * Play a friendly cartoon "boing / oops" (Wrong Answer)
 */
export function playErrorSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.3);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (err) {
    console.error('Audio play error:', err);
  }
}

/**
 * Play a crisp popping sound (Balloons, bubbles)
 */
export function playPopSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.07);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (err) {
    console.error('Pop sound error:', err);
  }
}

/**
 * Play button click / tap sound
 */
export function playClickSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (err) {
    console.error('Click sound error:', err);
  }
}

/**
 * Play card flip sound
 */
export function playFlipSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch (err) {
    console.error('Flip sound error:', err);
  }
}

/**
 * Play arcade whack / bonk sound
 */
export function playWhackSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (err) {
    console.error('Whack sound error:', err);
  }
}

/**
 * Play grand victory fanfare
 */
export function playWinFanfare(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Victory fanfare notes: C5, C5, C5, G5, A5, B5, C6
    const melody = [
      { freq: 523.25, dur: 0.12, time: 0 },
      { freq: 523.25, dur: 0.12, time: 0.14 },
      { freq: 523.25, dur: 0.12, time: 0.28 },
      { freq: 783.99, dur: 0.25, time: 0.42 },
      { freq: 880.0, dur: 0.2, time: 0.7 },
      { freq: 987.77, dur: 0.2, time: 0.92 },
      { freq: 1046.5, dur: 0.6, time: 1.15 },
    ];

    melody.forEach((item) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.freq, now + item.time);

      gain.gain.setValueAtTime(0, now + item.time);
      gain.gain.linearRampToValueAtTime(0.35, now + item.time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.time + item.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + item.time);
      osc.stop(now + item.time + item.dur + 0.02);
    });
  } catch (err) {
    console.error('Win fanfare error:', err);
  }
}

/**
 * Play Piano note with realistic harmonics
 */
export function playPianoNote(note: string): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const noteFrequencies: Record<string, number> = {
      C: 261.63,
      D: 293.66,
      E: 329.63,
      F: 349.23,
      G: 392.0,
      A: 440.0,
      B: 493.88,
      C2: 523.25,
      دو: 261.63,
      ري: 293.66,
      مي: 329.63,
      فا: 349.23,
      صول: 392.0,
      لا: 440.0,
      سي: 493.88,
    };

    const cleanNote = note.toUpperCase().trim();
    const freq = noteFrequencies[cleanNote] || 440;

    // Fundamental + overtone for rich piano sound
    [1, 2, 3].forEach((mult, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq * mult, now);

      const amp = i === 0 ? 0.4 : 0.15 / mult;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 / mult);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    });
  } catch (err) {
    console.error('Piano note error:', err);
  }
}

/**
 * Play synthesized animal sounds
 */
export function playAnimalSound(animal: string): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const clean = animal.toLowerCase().trim();

    if (clean.includes('قط') || clean.includes('مواء') || clean.includes('cat') || clean.includes('🐱')) {
      // Cat Meow: smooth gliding sine pitch sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(820, now + 0.25);
      osc.frequency.linearRampToValueAtTime(520, now + 0.6);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.45);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.66);
    } else if (clean.includes('كلب') || clean.includes('نباح') || clean.includes('dog') || clean.includes('🐶')) {
      // Dog Bark: two quick modulated bursts
      [0, 0.22].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(340, now + offset);
        osc.frequency.exponentialRampToValueAtTime(110, now + offset + 0.14);

        gain.gain.setValueAtTime(0.35, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.16);
      });
    } else if (clean.includes('بقر') || clean.includes('موو') || clean.includes('cow') || clean.includes('🐮')) {
      // Cow Moo: Low resonant tone with subtle vibrato
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.linearRampToValueAtTime(125, now + 0.7);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.38, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.86);
    } else if (clean.includes('خروف') || clean.includes('ثغاء') || clean.includes('sheep') || clean.includes('🐑')) {
      // Sheep Baaa: Vibrato tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(230, now + 0.6);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.66);
    } else if (clean.includes('أسد') || clean.includes('زئير') || clean.includes('lion') || clean.includes('🦁')) {
      // Lion Roar: Low noise sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(75, now + 0.7);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.76);
    } else if (clean.includes('ديك') || clean.includes('صياح') || clean.includes('rooster') || clean.includes('🐔')) {
      // Rooster Cock-a-doodle-doo
      const freqs = [440, 520, 660, 580];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = now + idx * 0.16;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.16);
      });
    } else if (clean.includes('عصفور') || clean.includes('طائر') || clean.includes('bird') || clean.includes('تغريد') || clean.includes('🐦')) {
      // Bird Chirp: High pitch frequency trill
      [0, 0.08, 0.16].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2200, now + off);
        osc.frequency.exponentialRampToValueAtTime(3200, now + off + 0.05);

        gain.gain.setValueAtTime(0.25, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.07);
      });
    } else if (clean.includes('بطة') || clean.includes('duck') || clean.includes('🦆')) {
      // Duck Quack: Nasal twin pulse
      [0, 0.15].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(380, now + off);
        osc.frequency.exponentialRampToValueAtTime(240, now + off + 0.12);

        gain.gain.setValueAtTime(0.3, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.13);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.14);
      });
    } else if (clean.includes('ضفدع') || clean.includes('frog') || clean.includes('🐸')) {
      // Frog Ribbit
      [0, 0.12].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now + off);
        osc.frequency.linearRampToValueAtTime(220, now + off + 0.08);

        gain.gain.setValueAtTime(0.3, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.11);
      });
    } else {
      playSuccessSound();
    }
  } catch (err) {
    console.error('Animal sound error:', err);
  }
}

/**
 * Play synthesized object sounds (Car, Bell, Telephone, etc.)
 */
export function playObjectSound(name: string): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const clean = name.toLowerCase().trim();

    if (clean.includes('سيار') || clean.includes('بييب') || clean.includes('car') || clean.includes('🚗')) {
      // Car Horn: Dual tone
      [440, 550].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.42);
      });
    } else if (clean.includes('هاتف') || clean.includes('رن') || clean.includes('phone') || clean.includes('☎️')) {
      // Telephone Ring: Dual Frequency Ring
      [0, 0.25].forEach((off) => {
        [440, 480].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + off);
          gain.gain.setValueAtTime(0.22, now + off);
          gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + off);
          osc.stop(now + off + 0.2);
        });
      });
    } else if (clean.includes('جرس') || clean.includes('bell') || clean.includes('🔔')) {
      // Bell Ding: Bright harmonic ring
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.82);
    } else if (clean.includes('ساعة') || clean.includes('clock') || clean.includes('⏰')) {
      // Clock Tick-Tock
      [0, 0.18].forEach((off, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(i === 0 ? 900 : 700, now + off);
        gain.gain.setValueAtTime(0.25, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.09);
      });
    } else if (clean.includes('بيانو') || clean.includes('piano') || clean.includes('🎹')) {
      // Piano Chord
      [523.25, 659.25, 783.99].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.92);
      });
    } else if (clean.includes('جيتار') || clean.includes('guitar') || clean.includes('🎸')) {
      // Guitar Strum
      [330, 392, 494, 659].forEach((freq, idx) => {
        const start = now + idx * 0.035;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.72);
      });
    } else if (clean.includes('طبل') || clean.includes('drum') || clean.includes('🥁')) {
      // Drum Kick & Snare
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (clean.includes('كمان') || clean.includes('violin') || clean.includes('🎻')) {
      // Violin bowed vibrato
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(445, now + 0.3);
      osc.frequency.linearRampToValueAtTime(440, now + 0.6);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.82);
    } else {
      playSuccessSound();
    }
  } catch (err) {
    console.error('Object sound error:', err);
  }
}
