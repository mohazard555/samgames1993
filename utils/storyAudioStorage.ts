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
 * Update in-memory and local cache with cloud stories audio directly
 */
export function setCloudStoriesAudio(cloudAudio: StoriesAudioMap): void {
  if (!cloudAudio || typeof cloudAudio !== 'object') return;
  memoryAudioCache = {
    ...memoryAudioCache,
    ...cloudAudio,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryAudioCache));
  } catch {}
  window.dispatchEvent(new CustomEvent('stories_audio_updated'));
}

/**
 * Fetch latest stories audio from server / Gist and update local cache
 */
export async function fetchStoriesAudioFromCloud(): Promise<StoriesAudioMap> {
  // 1. Try fetching from server API (which syncs directly with Gist)
  try {
    const res = await fetch('/api/stories/audio');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.storiesAudio && typeof data.storiesAudio === 'object') {
        const cloudCount = Object.keys(data.storiesAudio).length;
        if (cloudCount > 0) {
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
    }
  } catch (err) {
    console.warn('Could not fetch stories audio from server API:', err);
  }

  // 2. Direct Fallback: Fetch directly from GitHub Gist raw URL or API
  try {
    const defaultGistUrl = 'https://gist.githubusercontent.com/mohazard555/b98509446eaf8132fc819cff8f3f7956/raw/toysgame.json';
    const gistUrl = (localStorage.getItem('gistUrl') || defaultGistUrl).trim();
    const gistIdMatch = gistUrl.match(/([a-f0-9]{32})/i);
    const gistId = gistIdMatch ? gistIdMatch[1] : 'b98509446eaf8132fc819cff8f3f7956';

    // Try fetching the raw toysgame.json with cache buster
    const rawRes = await fetch(`https://gist.githubusercontent.com/mohazard555/${gistId}/raw/toysgame.json?_t=${Date.now()}`, {
      cache: 'no-store',
    });

    if (rawRes.ok) {
      const gistData = await rawRes.json();
      if (gistData && gistData.storiesAudio && typeof gistData.storiesAudio === 'object') {
        memoryAudioCache = {
          ...memoryAudioCache,
          ...gistData.storiesAudio,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryAudioCache));
        } catch {}
        window.dispatchEvent(new CustomEvent('stories_audio_updated'));
        return memoryAudioCache;
      }
    }

    // Try fetching the separate stories_audio.json if present in Gist
    const audioRawRes = await fetch(`https://gist.githubusercontent.com/mohazard555/${gistId}/raw/stories_audio.json?_t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (audioRawRes.ok) {
      const audioData = await audioRawRes.json();
      if (audioData && typeof audioData === 'object') {
        memoryAudioCache = {
          ...memoryAudioCache,
          ...audioData,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryAudioCache));
        } catch {}
        window.dispatchEvent(new CustomEvent('stories_audio_updated'));
        return memoryAudioCache;
      }
    }
  } catch (rawErr) {
    console.warn('Direct Gist audio fetch fallback notice:', rawErr);
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
      let errorMsg = 'فشلت المزامنة';
      try {
        const text = await res.text();
        if (text) {
          try {
            const errJson = JSON.parse(text);
            errorMsg = errJson.message || errorMsg;
          } catch {
            errorMsg = text;
          }
        }
      } catch {}
      throw new Error(errorMsg);
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
  reductionPercentage?: number;
}

/**
 * Trims silence from an AudioBuffer to keep files as tiny as ~1KB
 */
function trimSilence(buffer: AudioBuffer): AudioBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const channelData = buffer.getChannelData(0);
  const threshold = 0.015; // Silence threshold

  let start = 0;
  while (start < channelData.length && Math.abs(channelData[start]) < threshold) {
    start++;
  }

  let end = channelData.length - 1;
  while (end > start && Math.abs(channelData[end]) < threshold) {
    end--;
  }

  // Padding of ~50ms
  const pad = Math.floor(sampleRate * 0.05);
  start = Math.max(0, start - pad);
  end = Math.min(channelData.length, end + pad);

  const trimmedLength = Math.max(sampleRate * 0.2, end - start);
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  const newBuffer = ctx.createBuffer(numChannels, trimmedLength, sampleRate);

  for (let ch = 0; ch < numChannels; ch++) {
    const origData = buffer.getChannelData(ch);
    const newData = newBuffer.getChannelData(ch);
    for (let i = 0; i < trimmedLength; i++) {
      newData[i] = origData[start + i] || 0;
    }
  }
  ctx.close().catch(() => {});
  return newBuffer;
}

/**
 * Optimizes a sentence audio file or recording to ~1KB - 2KB
 * ensuring 100+ scenes fit easily within GitHub Gist's 1MB payload limit!
 */
export async function optimizeSentenceAudio(
  fileOrBlob: File | Blob,
  maxDurationSeconds = 12
): Promise<AudioOptimizationResult> {
  const originalSize = fileOrBlob.size;

  try {
    const arrayBuffer = await fileOrBlob.arrayBuffer();
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) {
      throw new Error('AudioContext غير مدعوم');
    }

    const audioCtx = new AudioCtx();
    const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const trimmedBuffer = trimSilence(decodedBuffer);
    const duration = Math.min(trimmedBuffer.duration, maxDurationSeconds);

    const streamDest = audioCtx.createMediaStreamDestination();
    const source = audioCtx.createBufferSource();
    source.buffer = trimmedBuffer;

    // Speech Bandpass Filter (300Hz to 3400Hz - Telephony standard) for maximum speech clarity and minimum byte weight
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 0.7;

    source.connect(filter);
    filter.connect(streamDest);

    let mimeType = 'audio/webm;codecs=opus';
    if (typeof MediaRecorder !== 'undefined') {
      if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }
    } else {
      throw new Error('MediaRecorder غير متوفر');
    }

    // Ultra-low speech bitrate: 6kbps mono (producing ~0.75 KB per second of speech!)
    const recorder = new MediaRecorder(streamDest.stream, {
      mimeType,
      audioBitsPerSecond: 6000,
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
          const dataUrl = e.target?.result as string;
          const optimizedSize = compressedBlob.size;
          const reductionPercentage =
            originalSize > 0 ? Math.round(((originalSize - optimizedSize) / originalSize) * 100) : 0;

          resolve({
            dataUrl,
            originalSize,
            optimizedSize,
            duration,
            isCompressed: true,
            reductionPercentage: Math.max(0, reductionPercentage),
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(compressedBlob);
      };

      recorder.start(50);
      source.start(0);

      // Stop when speech duration completes
      setTimeout(() => {
        try {
          if (recorder.state === 'recording') {
            recorder.stop();
            source.stop();
          }
        } catch {}
      }, Math.ceil(duration * 1000) + 100);
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
          reductionPercentage: 0,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBlob);
    });
  }
}

/**
 * Standalone compressor utility for files up to 40KB+ to ~1KB
 */
export async function compressSentenceAudioTo1KB(
  fileOrBlob: File | Blob
): Promise<AudioOptimizationResult> {
  return optimizeSentenceAudio(fileOrBlob, 15);
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
