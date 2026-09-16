import React, { createContext, useState, useEffect, useContext, useRef, ReactNode, useCallback } from 'react';
import { useSettings } from './SettingsContext';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  playMusic: () => void;
  pauseMusic: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

let lastRawAudio = '';
let lastBlobUrl = '';

function getPlayableUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  if (url === 'SAVED_IN_CLOUD_BASE64') return '';

  if (url.startsWith('data:audio/')) {
    if (lastRawAudio === url && lastBlobUrl) {
      return lastBlobUrl;
    }
    try {
      const parts = url.split(',');
      const byteString = atob(parts[1]);
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'audio/mpeg';
      const u8arr = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        u8arr[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([u8arr], { type: mime });
      if (lastBlobUrl && lastBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(lastBlobUrl);
      }
      lastBlobUrl = URL.createObjectURL(blob);
      lastRawAudio = url;
      return lastBlobUrl;
    } catch (e) {
      console.warn('Could not convert dataURI to blob URL:', e);
      return url;
    }
  }
  return url;
}

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('toys_bg_music_muted') === 'true';
    } catch {
      return false;
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentBlobUrlRef = useRef<string | null>(null);
  const hasUserInteractedRef = useRef<boolean>(false);
  const isPlayingRef = useRef<boolean>(false);
  const userMutedRef = useRef<boolean>(isMuted);

  // Sync refs
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    userMutedRef.current = isMuted;
  }, [isMuted]);

  // Audio setup when music URL or enabled setting changes
  useEffect(() => {
    const rawUrl = settings.backgroundMusicUrl;
    const isEnabled = settings.backgroundMusicEnabled !== false;

    if (!rawUrl || !isEnabled || rawUrl === 'SAVED_IN_CLOUD_BASE64') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    const playable = getPlayableUrl(rawUrl);
    if (!playable) return;

    if (currentBlobUrlRef.current && currentBlobUrlRef.current.startsWith('blob:') && currentBlobUrlRef.current !== playable) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
    }
    currentBlobUrlRef.current = playable;

    if (!audioRef.current) {
      const audio = new Audio(playable);
      audio.loop = true;
      audio.volume = 0.35;
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audioRef.current = audio;
    } else {
      if (audioRef.current.src !== playable) {
        audioRef.current.src = playable;
        audioRef.current.load();
      }
    }

    // ONLY attempt auto-playback if the user has NOT explicitly muted the audio
    if (!userMutedRef.current && (hasUserInteractedRef.current || isPlayingRef.current)) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Autoplay waiting for active user interaction:', err));
    }
  }, [settings.backgroundMusicUrl, settings.backgroundMusicEnabled]);

  // Toggle Play / Mute handler
  const togglePlay = useCallback(() => {
    hasUserInteractedRef.current = true;

    if (!audioRef.current) return;

    if (isPlayingRef.current) {
      // User requested MUTE: stop playing immediately and persist preference
      userMutedRef.current = true;
      setIsMuted(true);
      try {
        localStorage.setItem('toys_bg_music_muted', 'true');
      } catch (e) {
        console.error(e);
      }

      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // User requested UN-MUTE / PLAY: start playing and remove mute preference
      userMutedRef.current = false;
      setIsMuted(false);
      try {
        localStorage.removeItem('toys_bg_music_muted');
      } catch (e) {
        console.error(e);
      }

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((e) => console.error('Audio play toggle failed:', e));
    }
  }, []);

  const playMusic = useCallback(() => {
    hasUserInteractedRef.current = true;
    userMutedRef.current = false;
    setIsMuted(false);
    try {
      localStorage.removeItem('toys_bg_music_muted');
    } catch (e) {
      console.error(e);
    }

    if (audioRef.current && !isPlayingRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log('playMusic triggered:', e));
    }
  }, []);

  const pauseMusic = useCallback(() => {
    userMutedRef.current = true;
    setIsMuted(true);
    try {
      localStorage.setItem('toys_bg_music_muted', 'true');
    } catch (e) {
      console.error(e);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Global user interaction listener for first-gesture autoplay ONLY
  useEffect(() => {
    // If user previously chose to mute, do not listen to gestures to start music
    if (userMutedRef.current) return;

    const events = ['click', 'touchstart', 'pointerdown', 'keydown'];

    const cleanupGestureListeners = () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, handleGesture);
      });
    };

    const handleGesture = () => {
      hasUserInteractedRef.current = true;

      // If user muted during session, do nothing and clean up
      if (userMutedRef.current) {
        cleanupGestureListeners();
        return;
      }

      // If already playing, remove listeners and exit
      if (isPlayingRef.current) {
        cleanupGestureListeners();
        return;
      }

      if (
        audioRef.current &&
        settings.backgroundMusicUrl &&
        settings.backgroundMusicEnabled !== false &&
        settings.backgroundMusicUrl !== 'SAVED_IN_CLOUD_BASE64'
      ) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            // Once successfully started by gesture, remove listener so subsequent clicks never re-trigger
            cleanupGestureListeners();
          })
          .catch((e) => console.log('First user gesture audio play waiting:', e));
      }
    };

    events.forEach((evt) => {
      document.addEventListener(evt, handleGesture, { passive: true });
    });

    return () => {
      cleanupGestureListeners();
    };
  }, [settings.backgroundMusicUrl, settings.backgroundMusicEnabled]);

  return (
    <AudioContext.Provider value={{ isPlaying, isMuted, togglePlay, playMusic, pauseMusic }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
