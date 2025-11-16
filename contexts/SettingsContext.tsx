
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Settings } from '../types';

const defaultSettings: Settings = {
  siteName: 'ToysGame World',
  logoUrl: 'https://img.icons8.com/plasticine/100/controller.png',
  youtubeUrls: 'https://www.youtube.com/channel/UC-xUFz2i5-2j4o27sK6l3-A\nhttps://www.youtube.com/@mkstudio_963',
  backgroundMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  saveSettings: (newSettings: Settings) => void;
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
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error('Error reading settings from localStorage', error);
      return defaultSettings;
    }
  });

  const [gistUrl, setGistUrlState] = useState<string>(() => localStorage.getItem('gistUrl') || '');
  const [gistToken, setGistTokenState] = useState<string>(() => localStorage.getItem('gistToken') || '');


  const saveSettings = (newSettings: Settings) => {
     try {
      localStorage.setItem('toysGameSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings to localStorage', error);
    }
  }
  
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
          'Authorization': `token ${gistToken}`,
          'Accept': 'application/vnd.github.v3+json',
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
    <SettingsContext.Provider value={{ settings, setSettings: saveSettings, saveSettings, gistUrl, setGistUrl, gistToken, setGistToken, loadFromGist, saveToGist }}>
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
