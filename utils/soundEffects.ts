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
 * Speak Arabic text for animal or educational learning
 */
export function speakArabic(text: string): void {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  } catch (e) {
    // Ignore speech failure on unsupported browsers
  }
}

/**
 * Play synthesized animal sounds with realistic acoustic physics and acoustic formant synthesis
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
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.linearRampToValueAtTime(840, now + 0.22);
      osc.frequency.linearRampToValueAtTime(510, now + 0.58);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.07);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.42);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.66);
    } else if (clean.includes('كلب') || clean.includes('نباح') || clean.includes('dog') || clean.includes('🐶')) {
      // Dog Bark: two crisp modulated bursts
      [0, 0.2].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(360, now + offset);
        osc.frequency.exponentialRampToValueAtTime(110, now + offset + 0.13);

        gain.gain.setValueAtTime(0.35, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.15);
      });
    } else if (clean.includes('بقر') || clean.includes('موو') || clean.includes('خوار') || clean.includes('cow') || clean.includes('🐮')) {
      // Cow Moo: Low resonant tone with subtle vibrato
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.8);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.95);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.96);
    } else if (clean.includes('خروف') || clean.includes('ثغاء') || clean.includes('sheep') || clean.includes('🐑')) {
      // Sheep Baaa: Vibrato tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(270, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.65);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.71);
    } else if (clean.includes('ماعز') || clean.includes('goat') || clean.includes('🐐')) {
      // Goat Bleat: Rapid staccato vibrato
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(310, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.55);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.61);
    } else if (clean.includes('أسد') || clean.includes('زئير') || clean.includes('lion') || clean.includes('🦁') || clean.includes('نمر') || clean.includes('tiger') || clean.includes('🐯')) {
      // Lion / Tiger Roar: Powerful low frequency growl sweep
      [0, 0.1].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now + off);
        osc.frequency.linearRampToValueAtTime(65, now + off + 0.85);

        gain.gain.setValueAtTime(0.4, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.92);
      });
    } else if (clean.includes('حصان') || clean.includes('صهيل') || clean.includes('horse') || clean.includes('🐴') || clean.includes('🐎')) {
      // Horse Whinny (صهيل): Ascending pitch vibrato sweep then descending
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.85);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.92);
    } else if (clean.includes('فيل') || clean.includes('نفير') || clean.includes('elephant') || clean.includes('🐘')) {
      // Elephant Trumpet (نفير الفيل): Dual brassy tone blast
      [220, 440].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 1.6, now + 0.25);
        osc.frequency.linearRampToValueAtTime(freq * 0.9, now + 0.75);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.82);
      });
    } else if (clean.includes('ذئب') || clean.includes('عواء') || clean.includes('wolf') || clean.includes('🐺')) {
      // Wolf Howl (عواء الذئب): Haunting rising and falling smooth sine
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.45);
      osc.frequency.exponentialRampToValueAtTime(380, now + 1.1);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.38, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.16);
    } else if (clean.includes('قرد') || clean.includes('monkey') || clean.includes('🐒') || clean.includes('🐵')) {
      // Monkey Chatter: Staccato rhythmic bursts (أوو أأ أأ)
      [0, 0.12, 0.24, 0.38].forEach((off, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + (i % 2) * 200, now + off);
        osc.frequency.exponentialRampToValueAtTime(350, now + off + 0.08);

        gain.gain.setValueAtTime(0.3, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.1);
      });
    } else if (clean.includes('دب') || clean.includes('bear') || clean.includes('🐻')) {
      // Bear Growl (زمجرة الدب)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.7);

      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.76);
    } else if (clean.includes('حمار') || clean.includes('نهيق') || clean.includes('donkey') || clean.includes('🫏')) {
      // Donkey Bray (نهيق الحمار: شهيق وزفير متتابع)
      [0, 0.35, 0.7].forEach((off, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        const startFreq = idx % 2 === 0 ? 550 : 220;
        const endFreq = idx % 2 === 0 ? 750 : 150;
        osc.frequency.setValueAtTime(startFreq, now + off);
        osc.frequency.linearRampToValueAtTime(endFreq, now + off + 0.25);

        gain.gain.setValueAtTime(0.3, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.3);
      });
    } else if (clean.includes('جمل') || clean.includes('رغاء') || clean.includes('camel') || clean.includes('🐪') || clean.includes('🐫')) {
      // Camel Grunt (رغاء الجمل)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.6);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.66);
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
    } else if (clean.includes('بومة') || clean.includes('owl') || clean.includes('🦉')) {
      // Owl Hoot (نعيق البومة): Soft two-tone hoot
      [0, 0.25].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now + off);
        osc.frequency.linearRampToValueAtTime(320, now + off + 0.2);

        gain.gain.setValueAtTime(0, now + off);
        gain.gain.linearRampToValueAtTime(0.3, now + off + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.23);
      });
    } else if (clean.includes('نسر') || clean.includes('صقر') || clean.includes('eagle') || clean.includes('falcon') || clean.includes('🦅')) {
      // Eagle / Falcon Screech
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.linearRampToValueAtTime(2400, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.56);
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
    } else if (clean.includes('دلفين') || clean.includes('dolphin') || clean.includes('🐬')) {
      // Dolphin Click-Whistle
      [0, 0.06, 0.12, 0.22].forEach((off, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2800 + i * 400, now + off);
        osc.frequency.exponentialRampToValueAtTime(4000, now + off + 0.05);

        gain.gain.setValueAtTime(0.25, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.07);
      });
    } else if (clean.includes('نحلة') || clean.includes('bee') || clean.includes('🐝')) {
      // Bee Buzz: Sawtooth pitch buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(290, now + 0.4);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    } else if (clean.includes('حمامة') || clean.includes('حمام') || clean.includes('pigeon') || clean.includes('dove') || clean.includes('🕊️')) {
      // Pigeon Coo (هديل الحمام)
      [0, 0.2].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, now + off);
        osc.frequency.linearRampToValueAtTime(400, now + off + 0.15);

        gain.gain.setValueAtTime(0.25, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.2);
      });
    } else if (clean.includes('ثعلب') || clean.includes('ضباح') || clean.includes('fox') || clean.includes('🦊')) {
      // Fox Yip / Bark (ضباح الثعلب: صيحات سريعة حادة)
      [0, 0.14, 0.28].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now + off);
        osc.frequency.exponentialRampToValueAtTime(1400, now + off + 0.05);
        osc.frequency.exponentialRampToValueAtTime(450, now + off + 0.1);

        gain.gain.setValueAtTime(0.3, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.11);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.12);
      });
    } else if (clean.includes('أرنب') || clean.includes('rabbit') || clean.includes('bunny') || clean.includes('🐰') || clean.includes('🐇')) {
      // Rabbit Sniff & Squeak (خنين وخرخرة الأرنب اللطيفة)
      [0, 0.08, 0.16, 0.24].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now + off);
        osc.frequency.linearRampToValueAtTime(900, now + off + 0.05);

        gain.gain.setValueAtTime(0.2, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.07);
      });
    } else if (clean.includes('فهد') || clean.includes('نمر') || clean.includes('leopard') || clean.includes('cheetah') || clean.includes('🐆')) {
      // Leopard / Cheetah Snarl & Chirp
      [0, 0.18].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now + off);
        osc.frequency.exponentialRampToValueAtTime(90, now + off + 0.15);

        gain.gain.setValueAtTime(0.35, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.17);
      });
    } else if (clean.includes('حوت') || clean.includes('whale') || clean.includes('🐋') || clean.includes('🐳')) {
      // Whale Song: Deep resonant acoustic ocean tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.5);
      osc.frequency.linearRampToValueAtTime(120, now + 1.2);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    } else if (clean.includes('بطريق') || clean.includes('penguin') || clean.includes('🐧')) {
      // Penguin Honk
      [0, 0.2].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now + off);
        osc.frequency.linearRampToValueAtTime(520, now + off + 0.08);
        osc.frequency.linearRampToValueAtTime(380, now + off + 0.16);

        gain.gain.setValueAtTime(0.3, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.17);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.18);
      });
    } else if (clean.includes('فأر') || clean.includes('جرذ') || clean.includes('mouse') || clean.includes('rat') || clean.includes('🐭') || clean.includes('سنجاب') || clean.includes('🐿️')) {
      // Mouse Squeak (صرير الفأر الحاد السريع)
      [0, 0.1, 0.2].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(3200, now + off);
        osc.frequency.exponentialRampToValueAtTime(4200, now + off + 0.04);
        osc.frequency.exponentialRampToValueAtTime(2800, now + off + 0.07);

        gain.gain.setValueAtTime(0.25, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.09);
      });
    } else if (clean.includes('صرصور') || clean.includes('جدجد') || clean.includes('cricket') || clean.includes('🦗')) {
      // Cricket Chirp (صرير صرصور الليل)
      [0, 0.05, 0.1, 0.25, 0.3, 0.35].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(4500, now + off);

        gain.gain.setValueAtTime(0.2, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.04);
      });
    } else if (clean.includes('ببغاء') || clean.includes('parrot') || clean.includes('🦜')) {
      // Parrot Squawk
      [0, 0.18].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, now + off);
        osc.frequency.linearRampToValueAtTime(2100, now + off + 0.08);
        osc.frequency.linearRampToValueAtTime(1100, now + off + 0.15);

        gain.gain.setValueAtTime(0.3, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.17);
      });
    } else if (clean.includes('زرافة') || clean.includes('giraffe') || clean.includes('🦒')) {
      // Giraffe Hum
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.3);
      osc.frequency.linearRampToValueAtTime(95, now + 0.7);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (clean.includes('خنزير') || clean.includes('pig') || clean.includes('🐷') || clean.includes('خنصرة')) {
      // Pig Oink / Grunt (قباع / خنصرة الخنزير)
      [0, 0.2].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now + off);
        osc.frequency.linearRampToValueAtTime(160, now + off + 0.14);

        gain.gain.setValueAtTime(0.32, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.16);
      });
    } else if (clean.includes('دجاجة') || clean.includes('chicken') || clean.includes('hen') || clean.includes('🐔') || clean.includes('نقنقة')) {
      // Hen Cluck (نقنقة الدجاجة: بق بق بق)
      [0, 0.12, 0.24].forEach((off) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now + off);
        osc.frequency.exponentialRampToValueAtTime(260, now + off + 0.08);

        gain.gain.setValueAtTime(0.3, now + off);
        gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + off);
        osc.stop(now + off + 0.1);
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
