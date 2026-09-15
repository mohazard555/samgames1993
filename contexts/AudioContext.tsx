import React, { createContext, useState, useEffect, useContext, useRef, ReactNode, useCallback } from 'react';
import { useSettings } from './SettingsContext';

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  playMusic: () => void;
  pauseMusic: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (settings.backgroundMusicUrl && settings.backgroundMusicEnabled !== false) {
      if (!audioRef.current) {
        audioRef.current = new Audio(settings.backgroundMusicUrl);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;
      } else {
        if (audioRef.current.src !== settings.backgroundMusicUrl) {
          audioRef.current.src = settings.backgroundMusicUrl;
        }
      }
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log('Audio autoplay postponed until interaction:', e));
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [settings.backgroundMusicUrl, settings.backgroundMusicEnabled, isPlaying]);

  const togglePlay = useCallback(() => {
    if (audioRef.current && settings.backgroundMusicUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.error('Audio play failed:', e));
      }
    }
  }, [isPlaying, settings.backgroundMusicUrl]);

  const playMusic = useCallback(() => {
    if (audioRef.current && settings.backgroundMusicUrl) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log('Play on click prevented:', e));
    }
  }, [settings.backgroundMusicUrl]);

  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const playAudioOnFirstInteraction = () => {
      if (audioRef.current && !isPlaying && settings.backgroundMusicUrl && settings.backgroundMusicEnabled !== false) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((e) => console.log('Autoplay waiting for active gesture:', e));
        document.removeEventListener('click', playAudioOnFirstInteraction);
        document.removeEventListener('touchstart', playAudioOnFirstInteraction);
      }
    };

    document.addEventListener('click', playAudioOnFirstInteraction);
    document.addEventListener('touchstart', playAudioOnFirstInteraction);

    return () => {
      document.removeEventListener('click', playAudioOnFirstInteraction);
      document.removeEventListener('touchstart', playAudioOnFirstInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [settings.backgroundMusicUrl, settings.backgroundMusicEnabled, isPlaying]);

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay, playMusic, pauseMusic }}>
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
