
import React, { createContext, useState, useEffect, useContext, useRef, ReactNode, useCallback } from 'react';
import { useSettings } from './SettingsContext';

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (settings.backgroundMusicUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(settings.backgroundMusicUrl);
        audioRef.current.loop = true;
      } else {
        audioRef.current.src = settings.backgroundMusicUrl;
      }
      if(isPlaying) {
         audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
    }
  }, [settings.backgroundMusicUrl, isPlaying]);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);
  
   useEffect(() => {
    const playAudioOnFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
            setIsPlaying(true);
        }).catch(e => console.error("Autoplay failed:", e));
        document.removeEventListener('click', playAudioOnFirstInteraction);
      }
    };

    document.addEventListener('click', playAudioOnFirstInteraction);

    return () => {
      document.removeEventListener('click', playAudioOnFirstInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay }}>
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
