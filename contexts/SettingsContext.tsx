import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Settings } from '../types';

const defaultSettings: Settings = {
  siteName: 'ToysGame World',
  logoUrl: 'https://img.icons8.com/plasticine/100/controller.png',
  subscriptionUrl: 'https://www.youtube.com/@mkstudio_963',
  youtubeUrls: 'https://www.youtube.com/@mkstudio_963\nhttps://www.youtube.com/channel/UC-xUFz2i5-2j4o27sK6l3-A',
  backgroundMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  contactEmail: 'contact@toysgameworld.com',
  feedbackEmail: 'feedback@toysgameworld.com',
  videoWaitTime: 15, // مهلة انتظار فتح الفيديو بالثواني
  videoRequiredGameIds: [1, 3, 7, 10, 22], // الألعاب المحددة التي تتطلب مشاهدة فيديو
  adSettings: {
    enabled: false,
    name: 'مفاجأة للأبطال!',
    description: 'اكتشف المزيد من الألعاب والمرح والفيديوهات الممتعة عند زيارة هذا الرابط.',
    url: 'https://www.youtube.com/@mkstudio_963',
    imageUrl: 'https://img.icons8.com/plasticine/100/rocket.png',
    iconUrl: 'https://img.icons8.com/plasticine/100/gift.png',
  },
  googleAdSettings: {
    enabled: false,
    adClient: '',
    adSlot: '',
    customHtml: '',
    showTopBanner: true,
    showBottomBanner: true,
    showGameBanner: true,
  },
};

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  saveSettings: (newSettings: Settings) => void;
  // User subscription state
  isSubscribed: boolean;
  setIsSubscribed: (val: boolean) => void;
  resetSubscriptionStatus: () => void;
  // Video-unlocked games in session
  unlockedVideoGames: number[];
  unlockVideoGame: (gameId: number) => void;
  isGameUnlocked: (gameId: number) => boolean;
  // Admin authentication (Password 1993)
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (val: boolean) => void;
  verifyAdminPassword: (password: string) => boolean;
  lockAdmin: () => void;
  // Gist sync
  gistUrl: string;
  setGistUrl: (url: string) => void;
  gistToken: string;
  setGistToken: (token: string) => void;
  loadFromGist: () => Promise<boolean>;
  saveToGist: () => Promise<boolean>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const savedSettings = localStorage.getItem('toysGameSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return {
          ...defaultSettings,
          ...parsed,
          videoWaitTime: typeof parsed.videoWaitTime === 'number' ? parsed.videoWaitTime : defaultSettings.videoWaitTime,
          videoRequiredGameIds: Array.isArray(parsed.videoRequiredGameIds) ? parsed.videoRequiredGameIds : defaultSettings.videoRequiredGameIds,
          adSettings: { ...defaultSettings.adSettings, ...(parsed.adSettings || {}) },
          googleAdSettings: { ...defaultSettings.googleAdSettings, ...(parsed.googleAdSettings || {}) },
        };
      }
      return defaultSettings;
    } catch (error) {
      console.error('Error reading settings from localStorage', error);
      return defaultSettings;
    }
  });

  // User subscription state in localStorage
  const [isSubscribed, setIsSubscribedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('toysGameUserSubscribed') === 'true';
    } catch {
      return false;
    }
  });

  const setIsSubscribed = (val: boolean) => {
    try {
      localStorage.setItem('toysGameUserSubscribed', val ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
    setIsSubscribedState(val);
  };

  const resetSubscriptionStatus = () => {
    try {
      localStorage.removeItem('toysGameUserSubscribed');
    } catch (e) {
      console.error(e);
    }
    setIsSubscribedState(false);
  };

  // Video-unlocked games in session
  const [unlockedVideoGames, setUnlockedVideoGames] = useState<number[]>(() => {
    try {
      const saved = sessionStorage.getItem('toysGameUnlockedVideos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const unlockVideoGame = (gameId: number) => {
    setUnlockedVideoGames((prev) => {
      if (prev.includes(gameId)) return prev;
      const updated = [...prev, gameId];
      try {
        sessionStorage.setItem('toysGameUnlockedVideos', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const isGameUnlocked = (gameId: number): boolean => {
    // If game does not require video watch, it is unlocked if subscribed
    const requiresVideo = settings.videoRequiredGameIds?.includes(gameId);
    if (!requiresVideo) {
      return isSubscribed;
    }
    // If it requires video, check if it was unlocked in this session
    return unlockedVideoGames.includes(gameId);
  };

  // Admin lock state (Password 1993)
  const [isAdminUnlocked, setIsAdminUnlockedState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('toysGameAdminAuth') === 'true';
    } catch {
      return false;
    }
  });

  const setIsAdminUnlocked = (val: boolean) => {
    try {
      if (val) {
        sessionStorage.setItem('toysGameAdminAuth', 'true');
      } else {
        sessionStorage.removeItem('toysGameAdminAuth');
      }
    } catch (e) {
      console.error(e);
    }
    setIsAdminUnlockedState(val);
  };

  const verifyAdminPassword = (password: string): boolean => {
    if (password.trim() === '1993') {
      setIsAdminUnlocked(true);
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
  };

  const [gistUrl, setGistUrlState] = useState<string>(() => localStorage.getItem('gistUrl') || '');
  const [gistToken, setGistTokenState] = useState<string>(() => localStorage.getItem('gistToken') || '');

  const saveSettings = (newSettings: Settings) => {
    try {
      localStorage.setItem('toysGameSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings to localStorage', error);
    }
  };

  const setGistUrl = (url: string) => {
    localStorage.setItem('gistUrl', url);
    setGistUrlState(url);
  };

  const setGistToken = (token: string) => {
    localStorage.setItem('gistToken', token);
    setGistTokenState(token);
  };

  const loadFromGist = async (): Promise<boolean> => {
    if (!gistUrl) return false;
    try {
      const response = await fetch(gistUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch Gist: ${response.statusText}`);
      }
      const data = await response.json();
      saveSettings(data);
      return true;
    } catch (error) {
      console.error('Failed to load settings from Gist:', error);
      alert('فشل تحميل الإعدادات من Gist. تحقق من الرابط وصلاحيات الوصول.');
      return false;
    }
  };

  const saveToGist = async (): Promise<boolean> => {
    if (!gistUrl || !gistToken) return false;
    try {
      const urlParts = new URL(gistUrl).pathname.split('/');
      const gistId = urlParts[2];
      const filename = urlParts[urlParts.length - 1];

      if (!gistId || !filename) {
        throw new Error('Invalid Gist URL structure');
      }

      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `token ${gistToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: {
            [filename]: {
              content: JSON.stringify(settings, null, 2),
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save to Gist: ${errorData.message}`);
      }
      return true;
    } catch (error) {
      console.error('Failed to save settings to Gist:', error);
      alert(`فشل حفظ الإعدادات في Gist: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        saveSettings,
        isSubscribed,
        setIsSubscribed,
        resetSubscriptionStatus,
        unlockedVideoGames,
        unlockVideoGame,
        isGameUnlocked,
        isAdminUnlocked,
        setIsAdminUnlocked,
        verifyAdminPassword,
        lockAdmin,
        gistUrl,
        setGistUrl,
        gistToken,
        setGistToken,
        loadFromGist,
        saveToGist,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
