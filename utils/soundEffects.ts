// Web Audio API sound synthesizers for educational feedback and interactive games

let audioCtx: AudioContext | null = null;

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

/**
 * Play a cheerful, sparkling success fanfare (Correct Answer)
 */
export function playSuccessSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Chime notes: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.09);

      gain.gain.setValueAtTime(0, now + index * 0.09);
      gain.gain.linearRampToValueAtTime(0.25, now + index * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.09 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.09);
      osc.stop(now + index * 0.09 + 0.36);
    });
  } catch (err) {
    console.error('Audio play error:', err);
  }
}

/**
 * Play a soft, friendly "try again / oops" boing (Wrong Answer)
 */
export function playErrorSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  } catch (err) {
    console.error('Audio play error:', err);
  }
}

/**
 * Play a short UI bubble/click pop
 */
export function playClickSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (err) {
    console.error('Audio play error:', err);
  }
}

/**
 * Play synthesized animal sound by name or sound description
 */
export function playAnimalSound(animal: string): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const clean = animal.toLowerCase().trim();

    if (clean.includes('قط') || clean.includes('مواء') || clean.includes('cat') || clean.includes('🐱')) {
      // Cat Meow: gliding sine wave
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.25);
      osc.frequency.linearRampToValueAtTime(500, now + 0.6);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.4);
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
        osc.frequency.setValueAtTime(320, now + offset);
        osc.frequency.exponentialRampToValueAtTime(120, now + offset + 0.14);

        gain.gain.setValueAtTime(0.3, now + offset);
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
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.7);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.86);
    } else if (clean.includes('خروف') || clean.includes('ثغاء') || clean.includes('sheep') || clean.includes('🐑')) {
      // Sheep Baaa: Vibrato sine tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(230, now + 0.6);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.66);
    } else if (clean.includes('أسد') || clean.includes('زئير') || clean.includes('lion') || clean.includes('🦁')) {
      // Lion Roar: Low noise/rumble sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.7);

      gain.gain.setValueAtTime(0.35, now);
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
        gain.gain.setValueAtTime(0.25, start);
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

        gain.gain.setValueAtTime(0.2, now + off);
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

        gain.gain.setValueAtTime(0.25, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.13);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.14);
      });
    } else {
      // Default cute animal chirp
      playSuccessSound();
    }
  } catch (err) {
    console.error('Animal sound error:', err);
  }
}

/**
 * Play synthesized object/instrument sound
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
        gain.gain.setValueAtTime(0.2, now);
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
          gain.gain.setValueAtTime(0.2, now + off);
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
      gain.gain.setValueAtTime(0.3, now);
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
        gain.gain.setValueAtTime(0.2, now + off);
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
        gain.gain.setValueAtTime(0.25, now);
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
        gain.gain.setValueAtTime(0.2, start);
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

      gain.gain.setValueAtTime(0.4, now);
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
      gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
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
