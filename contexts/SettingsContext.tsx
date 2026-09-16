import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Settings, FeedbackItem, ContactMessage, SkillTestResult } from '../types';
import { saveAudioToCache, getAudioFromCache } from '../utils/audioStorage';

export const DEFAULT_GIST_URL =
  'https://gist.githubusercontent.com/mohazard555/b98509446eaf8132fc819cff8f3f7956/raw/toysgame.json';

const defaultSettings: Settings = {
  siteName: 'ToysGame World',
  logoUrl: 'https://img.icons8.com/plasticine/100/controller.png',
  subscriptionUrl: 'https://www.youtube.com/@mkstudio_963',
  youtubeUrls: 'https://www.youtube.com/@mkstudio_963\nhttps://www.youtube.com/channel/UC-xUFz2i5-2j4o27sK6l3-A',
  backgroundMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  backgroundMusicEnabled: true,
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
  feedbacks: [],
  contactMessages: [],
};

// Helper to extract Gist ID and file name from any Gist URL format
export function extractGistInfo(url: string) {
  const cleanUrl = (url || DEFAULT_GIST_URL).trim();
  const gistIdMatch = cleanUrl.match(/([a-f0-9]{32})/i);
  const gistId = gistIdMatch ? gistIdMatch[1] : 'b98509446eaf8132fc819cff8f3f7956';

  const fileMatch = cleanUrl.match(/\/([^\/?#]+\.json)/i);
  const filename = fileMatch ? fileMatch[1] : 'toysgame.json';

  const usernameMatch = cleanUrl.match(/gist\.github(?:usercontent)?\.com\/([^\/]+)/i);
  const username = usernameMatch ? usernameMatch[1] : 'mohazard555';
  const unpinnedRawUrl = `https://gist.githubusercontent.com/${username}/${gistId}/raw/${filename}`;

  return { gistId, filename, unpinnedRawUrl };
}

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
  loadFromGist: (customUrl?: string) => Promise<boolean>;
  saveToGist: (overrideSettings?: Settings) => Promise<boolean>;
  isSyncing: boolean;
  isInitialLoading: boolean;
  lastSyncTime: string | null;
  syncError: string | null;
  setSyncError: (err: string | null) => void;
  // Feedback & Contact Management
  addFeedback: (item: { name: string; email: string; rating: number; category?: string; message: string }) => Promise<void>;
  updateFeedbackStatus: (id: string, status: 'قيد الاطلاع' | 'تمت المراجعة' | 'مكتمل') => void;
  deleteFeedback: (id: string) => void;
  addContactMessage: (item: { name: string; email: string; subject: string; message: string }) => Promise<void>;
  updateContactMessageStatus: (id: string, status: 'جديدة' | 'قيد الاطلاع' | 'تم الرد') => void;
  deleteContactMessage: (id: string) => void;
  addSkillTestResult: (item: { name: string; age: string; country: string; score: number; total: number }) => Promise<void>;
  deleteSkillTestResult: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gistUrl, setGistUrlState] = useState<string>(() => {
    return localStorage.getItem('gistUrl') || DEFAULT_GIST_URL;
  });

  const [gistToken, setGistTokenState] = useState<string>(() => {
    return localStorage.getItem('gistToken') || '';
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('toysGameLastGistSync') || null;
  });

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const savedSettings = localStorage.getItem('toysGameSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.backgroundMusicUrl === 'SAVED_IN_CLOUD_BASE64') {
          delete parsed.backgroundMusicUrl;
        }
        return {
          ...defaultSettings,
          ...parsed,
          videoWaitTime:
            typeof parsed.videoWaitTime === 'number'
              ? parsed.videoWaitTime
              : Number(parsed.videoWaitTime) || defaultSettings.videoWaitTime,
          videoRequiredGameIds: Array.isArray(parsed.videoRequiredGameIds)
            ? parsed.videoRequiredGameIds
            : defaultSettings.videoRequiredGameIds,
          adSettings: { ...defaultSettings.adSettings, ...(parsed.adSettings || {}) },
          googleAdSettings: { ...defaultSettings.googleAdSettings, ...(parsed.googleAdSettings || {}) },
          feedbacks: Array.isArray(parsed.feedbacks) ? parsed.feedbacks : [],
          contactMessages: Array.isArray(parsed.contactMessages) ? parsed.contactMessages : [],
        };
      }
      return defaultSettings;
    } catch (error) {
      console.error('Error reading settings from localStorage', error);
      return defaultSettings;
    }
  });

  // Check IndexedDB audio cache on initial load
  useEffect(() => {
    getAudioFromCache().then((cachedAudio) => {
      if (cachedAudio && cachedAudio.startsWith('data:audio/')) {
        setSettings((prev) => {
          if (!prev.backgroundMusicUrl || prev.backgroundMusicUrl === defaultSettings.backgroundMusicUrl) {
            return { ...prev, backgroundMusicUrl: cachedAudio };
          }
          return prev;
        });
      }
    });
  }, []);

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
    const requiresVideo = settings.videoRequiredGameIds?.includes(gameId);
    if (!requiresVideo) {
      return isSubscribed;
    }
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

  const saveSettings = (newSettings: Settings) => {
    // Always update React state first so UI and Audio immediately have the latest settings!
    setSettings(newSettings);

    // If audio is a valid base64 dataURI, cache it securely in IndexedDB
    if (
      typeof newSettings.backgroundMusicUrl === 'string' &&
      newSettings.backgroundMusicUrl.startsWith('data:audio/')
    ) {
      saveAudioToCache(newSettings.backgroundMusicUrl).catch(() => {});
    }

    try {
      localStorage.setItem('toysGameSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.warn('LocalStorage quota exceeded. Storing lightweight copy without large media:', error);
      try {
        const isHeavyAudio =
          typeof newSettings.backgroundMusicUrl === 'string' &&
          newSettings.backgroundMusicUrl.startsWith('data:audio/');
        const lightweightSettings = {
          ...newSettings,
          // Never replace with invalid placeholder tokens; keep default or external URL for localStorage fallback
          backgroundMusicUrl: isHeavyAudio
            ? defaultSettings.backgroundMusicUrl
            : newSettings.backgroundMusicUrl,
        };
        localStorage.setItem('toysGameSettings', JSON.stringify(lightweightSettings));
      } catch (innerErr) {
        console.warn('Could not save lightweight settings to localStorage:', innerErr);
      }
    }
  };

  const setGistUrl = (url: string) => {
    const clean = url.trim() || DEFAULT_GIST_URL;
    localStorage.setItem('gistUrl', clean);
    setGistUrlState(clean);
  };

  const setGistToken = (token: string) => {
    const clean = token.trim();
    localStorage.setItem('gistToken', clean);
    setGistTokenState(clean);
  };

  // Load latest settings from Gist with real-time GitHub API and cache-busting fallback
  const loadFromGist = useCallback(async (customUrl?: string): Promise<boolean> => {
    const targetUrl = (customUrl || gistUrl || DEFAULT_GIST_URL).trim();
    if (!targetUrl) return false;

    setIsSyncing(true);
    const { gistId, filename, unpinnedRawUrl } = extractGistInfo(targetUrl);
    const activeToken = gistToken || localStorage.getItem('gistToken') || '';

    try {
      let fetchedSettings: Partial<Settings> | null = null;

      // Method 1: Try GitHub REST API directly (100% real-time, no CDN delay)
      try {
        const headers: Record<string, string> = {
          Accept: 'application/vnd.github.v3+json',
        };
        if (activeToken) {
          headers['Authorization'] = `token ${activeToken}`;
        }

        const apiRes = await fetch(`https://api.github.com/gists/${gistId}?_t=${Date.now()}`, {
          headers,
          cache: 'no-store',
        });

        if (apiRes.ok) {
          const gistData = await apiRes.json();
          const targetFile = gistData.files?.[filename] || Object.values(gistData.files || {})[0];
          
          if (targetFile) {
            // CRITICAL: If file is truncated by GitHub API (>1MB), fetch the full file from raw_url!
            if (targetFile.truncated && targetFile.raw_url) {
              const fullRawRes = await fetch(`${targetFile.raw_url}?_t=${Date.now()}`, { cache: 'no-store' });
              if (fullRawRes.ok) {
                fetchedSettings = await fullRawRes.json();
              }
            } else if (targetFile.content) {
              try {
                fetchedSettings = JSON.parse(targetFile.content);
              } catch {
                if (targetFile.raw_url) {
                  const fullRawRes = await fetch(`${targetFile.raw_url}?_t=${Date.now()}`, { cache: 'no-store' });
                  if (fullRawRes.ok) {
                    fetchedSettings = await fullRawRes.json();
                  }
                }
              }
            }
          }
        }
      } catch (apiErr) {
        console.warn('API fetch attempt failed, trying raw fallback:', apiErr);
      }

      // Method 2: Fallback to direct raw content with timestamp cache-buster
      if (!fetchedSettings) {
        try {
          const rawRes = await fetch(`${unpinnedRawUrl}?_t=${Date.now()}`, {
            cache: 'no-store',
          });
          if (rawRes.ok) {
            fetchedSettings = await rawRes.json();
          }
        } catch (rawErr) {
          console.warn('Raw fetch attempt failed:', rawErr);
        }
      }

      if (fetchedSettings && typeof fetchedSettings === 'object') {
        const parsedWaitTime =
          typeof fetchedSettings.videoWaitTime === 'number'
            ? fetchedSettings.videoWaitTime
            : Number(fetchedSettings.videoWaitTime) || defaultSettings.videoWaitTime;

        // Preserve local feedbacks and messages if remote doesn't have them yet or merge them
        const localSettingsRaw = localStorage.getItem('toysGameSettings');
        const localParsed = localSettingsRaw ? JSON.parse(localSettingsRaw) : {};

        const mergedFeedbacks: FeedbackItem[] = [
          ...(Array.isArray(fetchedSettings.feedbacks) ? fetchedSettings.feedbacks : []),
          ...(Array.isArray(localParsed.feedbacks) ? localParsed.feedbacks : []),
        ].filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

        const mergedMessages: ContactMessage[] = [
          ...(Array.isArray(fetchedSettings.contactMessages) ? fetchedSettings.contactMessages : []),
          ...(Array.isArray(localParsed.contactMessages) ? localParsed.contactMessages : []),
        ].filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

        let safeMusicUrl = fetchedSettings.backgroundMusicUrl;
        if (!safeMusicUrl || safeMusicUrl === 'SAVED_IN_CLOUD_BASE64') {
          safeMusicUrl = defaultSettings.backgroundMusicUrl;
        } else if (safeMusicUrl.startsWith('data:audio/')) {
          saveAudioToCache(safeMusicUrl).catch(() => {});
        }

        const merged: Settings = {
          ...defaultSettings,
          ...fetchedSettings,
          backgroundMusicUrl: safeMusicUrl,
          videoWaitTime: parsedWaitTime,
          videoRequiredGameIds: Array.isArray(fetchedSettings.videoRequiredGameIds)
            ? fetchedSettings.videoRequiredGameIds
            : defaultSettings.videoRequiredGameIds,
          adSettings: {
            ...defaultSettings.adSettings,
            ...(fetchedSettings.adSettings || {}),
          },
          googleAdSettings: {
            ...defaultSettings.googleAdSettings,
            ...(fetchedSettings.googleAdSettings || {}),
          },
          feedbacks: mergedFeedbacks,
          contactMessages: mergedMessages,
        };

        saveSettings(merged);
        const syncTimeStr = new Date().toLocaleTimeString('ar-EG');
        setLastSyncTime(syncTimeStr);
        localStorage.setItem('toysGameLastGistSync', syncTimeStr);
        setIsSyncing(false);
        return true;
      }
      setIsSyncing(false);
      return false;
    } catch (error) {
      console.error('Failed to load settings from Gist:', error);
      setIsSyncing(false);
      return false;
    }
  }, [gistUrl, gistToken]);

  // Save settings directly to GitHub Gist
  const saveToGist = async (overrideSettings?: Settings): Promise<boolean> => {
    setSyncError(null);
    const targetUrl = (gistUrl || DEFAULT_GIST_URL).trim();
    const targetToken = (gistToken || localStorage.getItem('gistToken') || '').trim();

    if (!targetUrl) {
      setSyncError('رابط Gist غير محدد.');
      return false;
    }
    if (!targetToken) {
      const msg = 'رمز التحقق (GitHub Token) غير مدخل. لن يتمكن الزوار من سماع الموسيقى الجديدة حتى تُدخل الـ Token في تبويب المزامنة لحفظها سحابياً.';
      console.warn(msg);
      setSyncError(msg);
      return false;
    }

    const dataToSave = overrideSettings || settings;
    const jsonPayload = JSON.stringify(dataToSave, null, 2);

    // GitHub Gist 1MB hard limit safeguard
    if (jsonPayload.length > 950000) {
      const kb = Math.round(jsonPayload.length / 1024);
      const errMsg = `حجم البيانات (${kb} كيلوبايت) يتجاوز الحد المسموح به في سحابة GitHub Gist (1 ميجابايت). ملف الموسيقى كبير جداً، يرجى استخدام ميزة الضغط التلقائي أو رابط صوت خارجي (URL).`;
      console.warn(errMsg);
      setSyncError(errMsg);
      return false;
    }

    setIsSyncing(true);
    const { gistId, filename } = extractGistInfo(targetUrl);

    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `token ${targetToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: {
            [filename]: {
              content: jsonPayload,
            },
          },
        }),
      });

      if (!response.ok) {
        let errMessage = 'فشل في حفظ البيانات على Gist';
        try {
          const errorData = await response.json();
          if (response.status === 401 || response.status === 403) {
            errMessage = 'رمز التحقق (GitHub Token) غير صالح أو انتهت صلاحيته أو تنقصه صلاحية gist.';
          } else if (response.status === 422) {
            errMessage = `رفض خادم GitHub الملف بسبب الحجم أو التنسيق: ${errorData.message || ''}`;
          } else {
            errMessage = errorData.message || errMessage;
          }
        } catch {
          // fallback
        }
        setSyncError(errMessage);
        setIsSyncing(false);
        return false;
      }

      // Also persist locally
      saveSettings(dataToSave);
      const syncTimeStr = new Date().toLocaleTimeString('ar-EG');
      setLastSyncTime(syncTimeStr);
      localStorage.setItem('toysGameLastGistSync', syncTimeStr);
      setSyncError(null);
      setIsSyncing(false);
      return true;
    } catch (error: unknown) {
      const errStr = error instanceof Error ? error.message : String(error);
      console.error('Failed to save settings to Gist:', error);
      setSyncError(`خطأ أثناء الاتصال بسحابة Gist: ${errStr}`);
      setIsSyncing(false);
      return false;
    }
  };

  // Feedback Management Methods
  const addFeedback = async (item: { name: string; email: string; rating: number; category?: string; message: string }) => {
    const newFeedback: FeedbackItem = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: item.name.trim() || 'فاعل خير مجهول',
      email: item.email.trim(),
      rating: item.rating || 5,
      category: item.category || 'اقتراح عام',
      message: item.message.trim(),
      status: 'قيد الاطلاع',
      createdAt: new Date().toLocaleString('ar-EG'),
    };

    const updatedFeedbacks = [newFeedback, ...(settings.feedbacks || [])];
    const newSettings: Settings = {
      ...settings,
      feedbacks: updatedFeedbacks,
    };
    saveSettings(newSettings);

    // If Gist token is present, auto-sync to Gist
    if (gistToken) {
      saveToGist(newSettings).catch((e) => console.warn('Background Gist sync failed:', e));
    }
  };

  const updateFeedbackStatus = (id: string, status: 'قيد الاطلاع' | 'تمت المراجعة' | 'مكتمل') => {
    const updatedFeedbacks = (settings.feedbacks || []).map((fb) => (fb.id === id ? { ...fb, status } : fb));
    const newSettings = { ...settings, feedbacks: updatedFeedbacks };
    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
  };

  const deleteFeedback = (id: string) => {
    const updatedFeedbacks = (settings.feedbacks || []).filter((fb) => fb.id !== id);
    const newSettings = { ...settings, feedbacks: updatedFeedbacks };
    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
  };

  // Contact Messages Management Methods
  const addContactMessage = async (item: { name: string; email: string; subject: string; message: string }) => {
    const newMsg: ContactMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: item.name.trim() || 'صديق مجهول',
      email: item.email.trim(),
      subject: item.subject.trim() || 'استفسار عام',
      message: item.message.trim(),
      status: 'جديدة',
      createdAt: new Date().toLocaleString('ar-EG'),
    };

    const updatedMessages = [newMsg, ...(settings.contactMessages || [])];
    const newSettings: Settings = {
      ...settings,
      contactMessages: updatedMessages,
    };
    saveSettings(newSettings);

    // If Gist token is present, auto-sync to Gist
    if (gistToken) {
      saveToGist(newSettings).catch((e) => console.warn('Background Gist sync failed:', e));
    }
  };

  const updateContactMessageStatus = (id: string, status: 'جديدة' | 'قيد الاطلاع' | 'تم الرد') => {
    const updatedMessages = (settings.contactMessages || []).map((msg) => (msg.id === id ? { ...msg, status } : msg));
    const newSettings = { ...settings, contactMessages: updatedMessages };
    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
  };

  const deleteContactMessage = (id: string) => {
    const updatedMessages = (settings.contactMessages || []).filter((msg) => msg.id !== id);
    const newSettings = { ...settings, contactMessages: updatedMessages };
    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
  };

  // Skill Test Results Management Methods
  const addSkillTestResult = async (item: { name: string; age: string; country: string; score: number; total: number }) => {
    const newResult: SkillTestResult = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: item.name.trim() || 'بطل مجهول',
      age: item.age.trim() || 'غير محدد',
      country: item.country.trim() || 'غير محدد',
      score: item.score,
      total: item.total,
      percentage: Math.round((item.score / item.total) * 100),
      createdAt: new Date().toLocaleString('ar-EG'),
    };

    const updatedResults = [newResult, ...(settings.skillTestResults || [])];
    const newSettings: Settings = {
      ...settings,
      skillTestResults: updatedResults,
    };
    saveSettings(newSettings);

    if (gistToken) {
      saveToGist(newSettings).catch((e) => console.warn('Background Gist sync failed:', e));
    }
  };

  const deleteSkillTestResult = (id: string) => {
    const updatedResults = (settings.skillTestResults || []).filter((res) => res.id !== id);
    const newSettings = { ...settings, skillTestResults: updatedResults };
    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
  };

  // Automatically fetch the latest Gist settings for any visitor on app load!
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await loadFromGist();
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [loadFromGist]);

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
        isSyncing,
        isInitialLoading,
        lastSyncTime,
        syncError,
        setSyncError,
        addFeedback,
        updateFeedbackStatus,
        deleteFeedback,
        addContactMessage,
        updateContactMessageStatus,
        deleteContactMessage,
        addSkillTestResult,
        deleteSkillTestResult,
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
