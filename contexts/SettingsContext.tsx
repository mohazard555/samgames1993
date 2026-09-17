import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Settings, FeedbackItem, ContactMessage, SkillTestResult } from '../types';
import { saveAudioToCache, getAudioFromCache, clearAudioCache } from '../utils/audioStorage';

export const DEFAULT_GIST_URL =
  'https://gist.githubusercontent.com/mohazard555/b98509446eaf8132fc819cff8f3f7956/raw/toysgame.json';

const defaultPaidSettings: Settings['paidSettings'] = {
  enabled: true,
  price: 3,
  currency: 'دولار',
  currencySymbol: '$',
  periodName: 'تفعيل دائم مدى الحياة',
  paidGameIds: [1, 5, 12, 18, 25, 30, 40, 50], // Initial premium/VIP games
  questionGateEnabled: true, // تفعيل طلب الاشتراك عند الوصول لسؤال محدد
  questionGateNumber: 15, // السؤال رقم 15
  shamCash: {
    enabled: true,
    accountName: 'mohannad anis ahmad',
    accountCode: 'c08a30e9e1f27a4b0d98b215562a0dbc',
    instructions: 'افتح تطبيق شام كاش، امسح الباركود أو انسخ الرمز أدناه، ثم أرسل المبلغ المحدد وأرسل لنا رقم العملية لتفعيل نسختك فوراً.',
    price: 3,
    currency: 'ليرة سورية',
    currencySymbol: 'ل.س',
  },
  otherMethods: [],
};

const defaultSettings: Settings = {
  siteName: 'ToysGame World',
  logoUrl: 'https://img.icons8.com/plasticine/100/controller.png',
  subscriptionUrl: 'https://www.youtube.com/@mkstudio_963',
  youtubeUrls: 'https://www.youtube.com/@mkstudio_963\nhttps://www.youtube.com/channel/UC-xUFz2i5-2j4o27sK6l3-A',
  backgroundMusicUrl: '/audio/default-music.mp3',
  backgroundMusicEnabled: true,
  contactEmail: 'contact@toysgameworld.com',
  feedbackEmail: 'feedback@toysgameworld.com',
  videoWaitTime: 15, // مهلة انتظار فتح الفيديو بالثواني
  videoRequiredGameIds: [1, 3, 7, 10, 22], // الألعاب المحددة التي تتطلب مشاهدة فيديو
  requireSubscriptionAndVideos: true, // عند التعطيل: تفتح جميع الألعاب فوراً بدون اشتراك ولا مشاهدة فيديو
  paidSettings: defaultPaidSettings,
  purchaseOrders: [],
  approvedActivationCodes: ['VIP-TOYS-2026-PREMIUM', 'VIP-SHAM-8832-7719'],
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
  // VIP Paid state (Permanent local activation)
  isVipActive: boolean;
  vipActivationCode: string;
  activateVip: (code: string) => { success: boolean; message: string };
  deactivateVip: () => void;
  // Subscription Orders & Activation Codes
  addPurchaseOrder: (
    order: Omit<SubscriptionOrder, 'id' | 'createdAt' | 'activationCode' | 'status'>
  ) => Promise<SubscriptionOrder>;
  updateOrderStatus: (orderId: string, status: 'معلق' | 'موافق عليه' | 'مرفوض') => void;
  deletePurchaseOrder: (orderId: string) => void;
  generateManualActivationCode: (note?: string) => string;
  revokeActivationCode: (code: string) => void;
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
          requireSubscriptionAndVideos:
            typeof parsed.requireSubscriptionAndVideos === 'boolean'
              ? parsed.requireSubscriptionAndVideos
              : defaultSettings.requireSubscriptionAndVideos ?? true,
          paidSettings: {
            ...defaultPaidSettings,
            ...(parsed.paidSettings || {}),
            shamCash: {
              ...defaultPaidSettings.shamCash,
              ...(parsed.paidSettings?.shamCash || {}),
            },
          },
          purchaseOrders: Array.isArray(parsed.purchaseOrders) ? parsed.purchaseOrders : [],
          approvedActivationCodes: Array.isArray(parsed.approvedActivationCodes)
            ? parsed.approvedActivationCodes
            : defaultSettings.approvedActivationCodes,
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

  // VIP Paid state stored locally per browser/device
  const [isVipActive, setIsVipActiveState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('toysGameVipActive') === 'true';
    } catch {
      return false;
    }
  });

  const [vipActivationCode, setVipActivationCodeState] = useState<string>(() => {
    try {
      return localStorage.getItem('toysGameVipCode') || '';
    } catch {
      return '';
    }
  });

  const activateVip = (rawCode: string): { success: boolean; message: string } => {
    const code = (rawCode || '').trim().toUpperCase();
    if (!code) {
      return { success: false, message: 'يرجى كتابة كود التفعيل أولاً.' };
    }

    // 1. Check if code exists in approved codes list
    const isApprovedCode = settings.approvedActivationCodes?.some(
      (c) => c.trim().toUpperCase() === code
    );

    // 2. Check if code exists in any purchase order that is approved or valid
    const matchingOrder = settings.purchaseOrders?.find(
      (o) => o.activationCode?.trim().toUpperCase() === code
    );

    // 3. Algorithmic fallback: codes starting with VIP- and having 3 parts
    const isAlgorithmicValid = /^VIP-[A-Z0-9]{4}-[A-Z0-9]{4,}$/i.test(code);

    if (isApprovedCode || (matchingOrder && matchingOrder.status !== 'مرفوض') || isAlgorithmicValid) {
      try {
        localStorage.setItem('toysGameVipActive', 'true');
        localStorage.setItem('toysGameVipCode', code);
      } catch (e) {
        console.error(e);
      }
      setIsVipActiveState(true);
      setVipActivationCodeState(code);

      // If matched an order and not approved yet, mark it approved with activation timestamp
      if (matchingOrder && matchingOrder.status === 'معلق') {
        updateOrderStatus(matchingOrder.id, 'موافق عليه');
      }

      return {
        success: true,
        message: 'تهانينا! تم تفعيل النسخة الكاملة (VIP) بنجاح على هذا الجهاز مدى الحياة 🎉',
      };
    }

    return {
      success: false,
      message: 'كود التفعيل غير صحيح أو غير معتمد. يرجى مراجعة الإدارة أو التأكد من إدخال الرمز بشكل دقيق.',
    };
  };

  const deactivateVip = () => {
    try {
      localStorage.removeItem('toysGameVipActive');
      localStorage.removeItem('toysGameVipCode');
    } catch (e) {
      console.error(e);
    }
    setIsVipActiveState(false);
    setVipActivationCodeState('');
  };

  // Subscription Orders Management
  const addPurchaseOrder = async (
    orderData: Omit<SubscriptionOrder, 'id' | 'createdAt' | 'activationCode' | 'status'>
  ): Promise<SubscriptionOrder> => {
    const randomHex1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomHex2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueCode = `VIP-SHAM-${randomHex1}-${randomHex2}`;
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    const newOrder: SubscriptionOrder = {
      ...orderData,
      id: orderId,
      status: 'معلق',
      createdAt: new Date().toLocaleString('ar-EG'),
      activationCode: uniqueCode,
      barcodeValue: uniqueCode,
    };

    let updatedOrders = [newOrder, ...(settings.purchaseOrders || [])];
    
    // Post to server API
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(gistToken ? { 'x-gist-token': gistToken, 'x-gist-url': gistUrl } : {}),
        },
        body: JSON.stringify({ ...newOrder, gistToken, gistUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.purchaseOrders)) {
          updatedOrders = data.purchaseOrders;
        }
      }
    } catch (e) {
      console.warn('API post order failed, using local:', e);
    }

    const newSettings: Settings = {
      ...settings,
      purchaseOrders: updatedOrders,
    };

    saveSettings(newSettings);

    if (gistToken) {
      saveToGist(newSettings).catch((e) => console.warn('Background Gist sync failed:', e));
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: 'معلق' | 'موافق عليه' | 'مرفوض') => {
    let orderActivationCode = '';
    const updatedOrders = (settings.purchaseOrders || []).map((ord) => {
      if (ord.id === orderId) {
        orderActivationCode = ord.activationCode;
        return {
          ...ord,
          status,
          activatedAt: status === 'موافق عليه' ? new Date().toLocaleString('ar-EG') : ord.activatedAt,
        };
      }
      return ord;
    });

    let updatedApprovedCodes = settings.approvedActivationCodes || [];
    if (status === 'موافق عليه' && orderActivationCode) {
      if (!updatedApprovedCodes.includes(orderActivationCode)) {
        updatedApprovedCodes = [...updatedApprovedCodes, orderActivationCode];
      }
    }

    const newSettings: Settings = {
      ...settings,
      purchaseOrders: updatedOrders,
      approvedActivationCodes: updatedApprovedCodes,
    };

    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
  };

  const deletePurchaseOrder = (orderId: string) => {
    const updatedOrders = (settings.purchaseOrders || []).filter((ord) => ord.id !== orderId);
    const newSettings: Settings = {
      ...settings,
      purchaseOrders: updatedOrders,
    };
    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
  };

  const generateManualActivationCode = (note?: string): string => {
    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `VIP-MANUAL-${part1}-${part2}`;

    const updatedCodes = [newCode, ...(settings.approvedActivationCodes || [])];
    const manualOrder: SubscriptionOrder = {
      id: `MAN-${Date.now().toString().slice(-5)}`,
      customerName: note ? `كود مخصص: ${note}` : 'توليد يدوي من الإدارة',
      customerPhone: 'مباشر من الإدارة',
      paymentMethod: 'sham_cash',
      amount: settings.paidSettings?.price || 3,
      currency: settings.paidSettings?.currency || 'دولار',
      transactionId: 'MANUAL_ACTIVATION',
      status: 'موافق عليه',
      createdAt: new Date().toLocaleString('ar-EG'),
      activationCode: newCode,
      barcodeValue: newCode,
      activatedAt: new Date().toLocaleString('ar-EG'),
    };

    const updatedOrders = [manualOrder, ...(settings.purchaseOrders || [])];
    const newSettings: Settings = {
      ...settings,
      approvedActivationCodes: updatedCodes,
      purchaseOrders: updatedOrders,
    };

    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }

    return newCode;
  };

  const revokeActivationCode = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const updatedCodes = (settings.approvedActivationCodes || []).filter(
      (c) => c.trim().toUpperCase() !== normalized
    );
    const updatedOrders = (settings.purchaseOrders || []).map((ord) => {
      if (ord.activationCode.trim().toUpperCase() === normalized) {
        return { ...ord, status: 'مرفوض' as const };
      }
      return ord;
    });

    const newSettings: Settings = {
      ...settings,
      approvedActivationCodes: updatedCodes,
      purchaseOrders: updatedOrders,
    };
    saveSettings(newSettings);

    // If active on this machine, revoke locally
    if (vipActivationCode.trim().toUpperCase() === normalized) {
      deactivateVip();
    }

    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
  };


  // Check IndexedDB audio cache on initial load
  useEffect(() => {
    // If backgroundMusicUrl is already an external web link, wipe any old obsolete huge audio cache
    if (
      settings.backgroundMusicUrl?.startsWith('http://') ||
      settings.backgroundMusicUrl?.startsWith('https://')
    ) {
      clearAudioCache().catch(() => {});
      return;
    }

    getAudioFromCache().then((cachedAudio) => {
      if (cachedAudio && cachedAudio.startsWith('data:audio/')) {
        setSettings((prev) => {
          if (!prev.backgroundMusicUrl) {
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
    // 1. If game is marked as a VIP paid game
    const isVipPaidGame =
      settings.paidSettings?.enabled &&
      Array.isArray(settings.paidSettings?.paidGameIds) &&
      settings.paidSettings.paidGameIds.includes(gameId);

    if (isVipPaidGame) {
      return isVipActive;
    }

    // 2. If general video/channel subscription is disabled
    if (settings.requireSubscriptionAndVideos === false) {
      return true;
    }

    // 3. Regular games: check if video watch required or channel subscribed
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
    } else {
      // It's a web URL or empty: clear old IndexedDB heavy audio cache to avoid memory issues
      clearAudioCache().catch(() => {});
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

      // Method 3: Also fetch from server API to include any visitor submissions stored on server disk
      let serverSubmissions: { purchaseOrders?: any[]; contactMessages?: any[]; feedbacks?: any[] } = {};
      try {
        const serverRes = await fetch('/api/data');
        if (serverRes.ok) {
          const serverData = await serverRes.json();
          if (serverData.success) {
            serverSubmissions = serverData;
          }
        }
      } catch (err) {
        console.warn('Could not fetch server submissions:', err);
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
          ...(Array.isArray(serverSubmissions.feedbacks) ? serverSubmissions.feedbacks : []),
          ...(Array.isArray(localParsed.feedbacks) ? localParsed.feedbacks : []),
        ].filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

        const mergedMessages: ContactMessage[] = [
          ...(Array.isArray(fetchedSettings.contactMessages) ? fetchedSettings.contactMessages : []),
          ...(Array.isArray(serverSubmissions.contactMessages) ? serverSubmissions.contactMessages : []),
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
          requireSubscriptionAndVideos:
            typeof fetchedSettings.requireSubscriptionAndVideos === 'boolean'
              ? fetchedSettings.requireSubscriptionAndVideos
              : typeof localParsed.requireSubscriptionAndVideos === 'boolean'
              ? localParsed.requireSubscriptionAndVideos
              : defaultSettings.requireSubscriptionAndVideos ?? true,
          paidSettings: {
            ...defaultPaidSettings,
            ...(localParsed.paidSettings || {}),
            ...(fetchedSettings.paidSettings || {}),
            shamCash: {
              ...defaultPaidSettings.shamCash,
              ...(localParsed.paidSettings?.shamCash || {}),
              ...(fetchedSettings.paidSettings?.shamCash || {}),
            },
          },
          purchaseOrders: [
            ...(Array.isArray(fetchedSettings.purchaseOrders) ? fetchedSettings.purchaseOrders : []),
            ...(Array.isArray(serverSubmissions.purchaseOrders) ? serverSubmissions.purchaseOrders : []),
            ...(Array.isArray(localParsed.purchaseOrders) ? localParsed.purchaseOrders : []),
          ].filter((item, index, self) => index === self.findIndex((t) => t.id === item.id)),
          approvedActivationCodes: Array.from(
            new Set([
              ...(Array.isArray(fetchedSettings.approvedActivationCodes) ? fetchedSettings.approvedActivationCodes : []),
              ...(Array.isArray(localParsed.approvedActivationCodes) ? localParsed.approvedActivationCodes : []),
              ...(defaultSettings.approvedActivationCodes || []),
            ])
          ),
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

    const rawData = overrideSettings || settings;
    // Prepare safe, lightweight payload for GitHub Gist (strict 1MB limit).
    // If backgroundMusicUrl has a raw base64 dataURI or an oversized string,
    // replace it with the default fast online EdgeOne URL for Gist syncing.
    const dataToSave: Settings = { ...rawData };
    if (
      typeof dataToSave.backgroundMusicUrl === 'string' &&
      dataToSave.backgroundMusicUrl.startsWith('data:audio/')
    ) {
      dataToSave.backgroundMusicUrl = defaultSettings.backgroundMusicUrl;
    }
    if (
      typeof dataToSave.logoUrl === 'string' &&
      dataToSave.logoUrl.startsWith('data:image/') &&
      dataToSave.logoUrl.length > 200000
    ) {
      dataToSave.logoUrl = defaultSettings.logoUrl;
    }
    if (
      typeof dataToSave.adSettings?.imageUrl === 'string' &&
      dataToSave.adSettings.imageUrl.startsWith('data:image/') &&
      dataToSave.adSettings.imageUrl.length > 200000
    ) {
      dataToSave.adSettings = {
        ...dataToSave.adSettings,
        imageUrl: defaultSettings.adSettings.imageUrl,
      };
    }

    const jsonPayload = JSON.stringify(dataToSave, null, 2);

    // GitHub Gist 1MB hard limit safeguard
    if (jsonPayload.length > 950000) {
      const kb = Math.round(jsonPayload.length / 1024);
      const errMsg = `حجم البيانات (${kb} كيلوبايت) يتجاوز الحد المسموح به في سحابة GitHub Gist (1 ميجابايت). يرجى استخدام روابط وسائط خارجية (URL).`;
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

    let updatedFeedbacks = [newFeedback, ...(settings.feedbacks || [])];

    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(gistToken ? { 'x-gist-token': gistToken, 'x-gist-url': gistUrl } : {}),
        },
        body: JSON.stringify({ ...newFeedback, gistToken, gistUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.feedbacks)) {
          updatedFeedbacks = data.feedbacks;
        }
      }
    } catch (e) {
      console.warn('API post feedback failed, using local:', e);
    }

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

    let updatedMessages = [newMsg, ...(settings.contactMessages || [])];

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(gistToken ? { 'x-gist-token': gistToken, 'x-gist-url': gistUrl } : {}),
        },
        body: JSON.stringify({ ...newMsg, gistToken, gistUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.contactMessages)) {
          updatedMessages = data.contactMessages;
        }
      }
    } catch (e) {
      console.warn('API post message failed, using local:', e);
    }

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
        isVipActive,
        vipActivationCode,
        activateVip,
        deactivateVip,
        addPurchaseOrder,
        updateOrderStatus,
        deletePurchaseOrder,
        generateManualActivationCode,
        revokeActivationCode,
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
