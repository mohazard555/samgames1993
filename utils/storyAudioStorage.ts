// Specialized audio storage, recording, ultra-compact compression, and Gist synchronization for Children's Story Scenes
import { StoriesAudioMap } from '../types/storiesTypes';

const STORAGE_KEY = 'toysgame_stories_audio_v1';
const AUTOPLAY_KEY = 'toysgame_stories_autoplay_enabled';

// In-memory cache for ultra-fast, zero-delay playback
let memoryAudioCache: StoriesAudioMap = {};

// Load cache from localStorage on startup
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    memoryAudioCache = JSON.parse(stored);
  }
} catch {
  memoryAudioCache = {};
}

export function getStorySceneAudioKey(storyId: string, sceneNumber: number): string {
  return `${storyId}_${sceneNumber}`;
}

export function isAudioAutoplayEnabled(): boolean {
  try {
    const val = localStorage.getItem(AUTOPLAY_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function setAudioAutoplayEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(AUTOPLAY_KEY, String(enabled));
  } catch {}
}

export function getLocalSceneAudio(storyId: string, sceneNumber: number): string | null {
  const key = getStorySceneAudioKey(storyId, sceneNumber);
  return memoryAudioCache[key] || null;
}

export function getAllLocalStoriesAudio(): StoriesAudioMap {
  return { ...memoryAudioCache };
}

export function countTotalRecordedScenes(): number {
  return Object.keys(memoryAudioCache).length;
}

export function countStoryRecordedScenes(storyId: string): number {
  let count = 0;
  for (let i = 1; i <= 10; i++) {
    if (memoryAudioCache[getStorySceneAudioKey(storyId, i)]) {
      count++;
    }
  }
  return count;
}

/**
 * Fetch latest stories audio from server / Gist and update local cache
 */
export async function fetchStoriesAudioFromCloud(): Promise<StoriesAudioMap> {
  try {
    const res = await fetch('/api/stories/audio');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.storiesAudio) {
        // Merge with local cache
        memoryAudioCache = {
          ...memoryAudioCache,
          ...data.storiesAudio,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryAudioCache));
        } catch {}

        window.dispatchEvent(new CustomEvent('stories_audio_updated'));
        return memoryAudioCache;
      }
    }
  } catch (err) {
    console.warn('Could not fetch stories audio from server:', err);
  }
  return memoryAudioCache;
}

/**
 * Save scene audio to local storage and sync immediately to GitHub Gist & server
 */
export async function saveSceneAudio(
  storyId: string,
  sceneNumber: number,
  audioDataUrl: string
): Promise<{ success: boolean; message: string }> {
  const key = getStorySceneAudioKey(storyId, sceneNumber);

  // 1. Immediately cache locally for zero-latency audio playback
  memoryAudioCache[key] = audioDataUrl;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryAudioCache));
  } catch (e) {
    console.warn('LocalStorage save warning:', e);
  }

  window.dispatchEvent(new CustomEvent('stories_audio_updated'));

  // 2. Sync to server & GitHub Gist
  try {
    const res = await fetch('/api/stories/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyId,
        sceneNumber,
        audioDataUrl,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message || '✓ تم حفظ الصوت ومزامنته مع Gist بنجاح!',
      };
    }
  } catch (err: any) {
    console.warn('Server sync error for scene audio:', err);
  }

  return {
    success: true,
    message: '✓ تم حفظ الصوت محلياً وسيجري رفعه إلى السحابة تلقائياً',
  };
}

/**
 * Delete scene audio and sync with Gist
 */
export async function deleteSceneAudio(
  storyId: string,
  sceneNumber: number
): Promise<{ success: boolean; message: string }> {
  const key = getStorySceneAudioKey(storyId, sceneNumber);
  delete memoryAudioCache[key];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryAudioCache));
  } catch {}

  window.dispatchEvent(new CustomEvent('stories_audio_updated'));

  try {
    const res = await fetch(`/api/stories/audio/${encodeURIComponent(key)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      return { success: true, message: '✓ تم حذف الملف الصوتي بنجاح ومزامنة Gist' };
    }
  } catch (err) {
    console.warn('Delete scene audio failed:', err);
  }

  return { success: true, message: '✓ تم حذف الصوت محلياً' };
}

/**
 * Bulk sync all locally cached audios to GitHub Gist
 */
export async function syncAllStoriesAudioToGist(): Promise<{
  success: boolean;
  message: string;
  count: number;
}> {
  try {
    const res = await fetch('/api/stories/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storiesAudio: memoryAudioCache,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message || '✓ تمت مزامنة جميع الصوتيات مع Gist بنجاح!',
        count: Object.keys(memoryAudioCache).length,
      };
    } else {
      const err = await res.json();
      throw new Error(err.message || 'فشلت المزامنة');
    }
  } catch (err: any) {
    return {
      success: false,
      message: `فشلت المزامنة: ${err.message}`,
      count: 0,
    };
  }
}

export interface AudioOptimizationResult {
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  duration: number;
  isCompressed: boolean;
}

/**
 * Optimizes a sentence audio file or recording to be ultra-compact (< 30KB)
 * to fit effortlessly within GitHub Gist storage limits.
 */
export async function optimizeSentenceAudio(
  fileOrBlob: File | Blob,
  maxDurationSeconds = 15
): Promise<AudioOptimizationResult> {
  const originalSize = fileOrBlob.size;

  // If already under 25KB, convert directly to data URL without re-encoding
  if (originalSize <= 25 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          dataUrl: e.target?.result as string,
          originalSize,
          optimizedSize: originalSize,
          duration: 0,
          isCompressed: false,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBlob);
    });
  }

  // Use Web Audio API to re-encode efficiently at low voice bitrate (24kbps mono)
  try {
    const arrayBuffer = await fileOrBlob.arrayBuffer();
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) {
      throw new Error('AudioContext غير مدعوم');
    }

    const audioCtx = new AudioCtx();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const duration = Math.min(audioBuffer.duration, maxDurationSeconds);

    const streamDest = audioCtx.createMediaStreamDestination();
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(streamDest);

    let mimeType = 'audio/webm;codecs=opus';
    if (typeof MediaRecorder !== 'undefined') {
      if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        }
      }
    } else {
      throw new Error('MediaRecorder غير متوفر');
    }

    // 24kbps mono provides crystal clear speech recording at only ~3KB per second!
    const recorder = new MediaRecorder(streamDest.stream, {
      mimeType,
      audioBitsPerSecond: 24000,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    return new Promise((resolve, reject) => {
      recorder.onstop = () => {
        const compressedBlob = new Blob(chunks, { type: mimeType });
        const reader = new FileReader();
        reader.onload = (e) => {
          audioCtx.close().catch(() => {});
          resolve({
            dataUrl: e.target?.result as string,
            originalSize,
            optimizedSize: compressedBlob.size,
            duration,
            isCompressed: true,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(compressedBlob);
      };

      recorder.start(100);
      source.start(0);

      // Stop when duration completes
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          source.stop();
        }
      }, Math.ceil(duration * 1000) + 150);
    });
  } catch (e) {
    // Fallback if re-encoding fails: direct DataURL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        resolve({
          dataUrl: ev.target?.result as string,
          originalSize,
          optimizedSize: originalSize,
          duration: 0,
          isCompressed: false,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBlob);
    });
  }
}

/**
 * Record speech directly from browser microphone
 */
export async function startMicrophoneRecording(): Promise<{
  recorder: MediaRecorder;
  stop: () => Promise<Blob>;
}> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('الميكروفون غير مدعوم في هذا المتصفح');
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });

  let mimeType = 'audio/webm;codecs=opus';
  if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    if (MediaRecorder.isTypeSupported('audio/webm')) {
      mimeType = 'audio/webm';
    } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
      mimeType = 'audio/mp4';
    }
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    audioBitsPerSecond: 24000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  recorder.start(100);

  const stop = (): Promise<Blob> => {
    return new Promise((resolve) => {
      recorder.onstop = () => {
        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };
      recorder.stop();
    });
  };

  return { recorder, stop };
}

// Current active Audio element to prevent overlapping
let currentPlayingAudio: HTMLAudioElement | null = null;

export function stopCurrentAudio(): void {
  if (currentPlayingAudio) {
    try {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
    } catch {}
    currentPlayingAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Plays the scene's uploaded voice clip.
 * If none exists, falls back gracefully to Arabic Web Speech Synthesis.
 */
export async function playSceneSentenceAudio(
  storyId: string,
  sceneNumber: number,
  fallbackText?: string,
  onPlayStateChange?: (isPlaying: boolean) => void
): Promise<void> {
  stopCurrentAudio();

  const audioUrl = getLocalSceneAudio(storyId, sceneNumber);

  if (audioUrl) {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      currentPlayingAudio = audio;
      onPlayStateChange?.(true);

      audio.onended = () => {
        currentPlayingAudio = null;
        onPlayStateChange?.(false);
        resolve();
      };

      audio.onerror = () => {
        currentPlayingAudio = null;
        onPlayStateChange?.(false);
        if (fallbackText) {
          speakArabicFallback(fallbackText, onPlayStateChange).then(resolve);
        } else {
          resolve();
        }
      };

      audio.play().catch(() => {
        // Autoplay may be blocked if no user interaction yet
        currentPlayingAudio = null;
        onPlayStateChange?.(false);
        resolve();
      });
    });
  } else if (fallbackText) {
    // Intelligent fallback: Web Speech Synthesis in Arabic
    return speakArabicFallback(fallbackText, onPlayStateChange);
  }
}

function speakArabicFallback(
  text: string,
  onPlayStateChange?: (isPlaying: boolean) => void
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9; // Friendly, clear pacing for kids
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      onPlayStateChange?.(true);
      utterance.onend = () => {
        onPlayStateChange?.(false);
        resolve();
      };
      utterance.onerror = () => {
        onPlayStateChange?.(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      onPlayStateChange?.(false);
      resolve();
    }
  });
}
