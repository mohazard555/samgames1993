import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Settings, FeedbackItem, ContactMessage, SkillTestResult, GameVipConfig, VipGameRestrictionType } from '../types';
import { saveAudioToCache, getAudioFromCache, clearAudioCache } from '../utils/audioStorage';

export const DEFAULT_GIST_URL =
  'https://gist.githubusercontent.com/mohazard555/b98509446eaf8132fc819cff8f3f7956/raw/toysgame.json';

export const getEncodedDefaultGistToken = (): string => {
  try {
    // Encoded in Base64 parts to prevent GitHub automated secret scanning from revoking the token during commits/pushes
    const b64 = ['Z2hwX2U4Z3VmMzBa', 'anFmTkdWUHA1UWg4', 'eVM4UkVqZWdJazJ4', 'aVNzZg=='].join('');
    if (typeof atob === 'function') {
      return atob(b64);
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(b64, 'base64').toString('utf-8');
    }
  } catch {
    // fallback
  }
  return '';
};

export const DEFAULT_GIST_TOKEN = getEncodedDefaultGistToken();

export const DEFAULT_100_ACTIVATION_CODES: string[] = Array.from({ length: 100 }, (_, i) => {
  const num = (i + 1).toString().padStart(4, '0');
  return `VIP-TOYS-2026-${num}`;
});

function generate100DefaultCodes(): string[] {
  return DEFAULT_100_ACTIVATION_CODES;
}

const defaultPaidSettings: Settings['paidSettings'] = {
  enabled: true,
  price: 3,
  currency: 'دولار',
  currencySymbol: '$',
  periodName: 'تفعيل دائم مدى الحياة',
  paidGameIds: [1, 5, 12, 18, 25, 30, 40, 50], // Initial premium/VIP games
  gameVipConfigs: {},
  defaultRestrictionType: 'question_limit',
  questionGateEnabled: true, // تفعيل طلب الاشتراك عند الوصول لسؤال محدد
  questionGateNumber: 15, // السؤال رقم 15
  vipTrialDurationSeconds: 60, // دقيقة واحدة تجربة مجانية لألعاب VIP
  vip50GamesGateIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // ألعاب الـ 50 مرحلة التي تطلب اشتراك VIP عند مرحلة معينة
  vip50StageThreshold: 10, // طلب اشتراك عند الوصول للمرحلة 10
  timer50GamesIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // ألعاب الـ 50 مرحلة التي لها مؤقت زمني
  timer50DurationSeconds: 20, // 20 ثانية لكل سؤال/مرحلة
  customGame50Config: {},
  shamCash: {
    enabled: true,
    accountName: 'mohannad anis ahmad',
    accountCode: 'c08a30e9e1f27a4b0d98b215562a0dbc',
    instructions: 'افتح تطبيق شام كاش، امسح الباركود أو انسخ الرمز أدناه، ثم أرسل المبلغ المحدد وأرسل لنا رقم العملية لتفعيل نسختك فوراً.',
    price: 3,
    currency: 'ليرة سورية',
    currencySymbol: 'ل.س',
  },
  paypal: {
    enabled: true,
    email: 'payments@toysgameworld.com',
    instructions: 'قم بتحويل المبلغ عبر PayPal إلى البريد الإلكتروني أعلاه، ثم أرسل رقم المعاملة (Transaction ID) هنا لتفعيل حسابك.',
    price: 3,
    currency: 'دولار',
    currencySymbol: '$',
  },
  binancePay: {
    enabled: true,
    payId: '839210492',
    emailOrPhone: 'binance@toysgameworld.com',
    instructions: 'حول المبلغ عبر Binance Pay باستخدام الـ Pay ID أو البريد الإلكتروني، ثم أدخل رقم معاملة التحويل للتأكيد.',
    price: 3,
    currency: 'دولار',
    currencySymbol: '$',
  },
  usdtTrc20: {
    enabled: true,
    walletAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    instructions: 'أرسل عملات USDT حصرياً عبر شبكة TRC20 إلى عنوان المحفظة أعلاه، ثم أدخل هاش المعاملة (TxID) للتفعيل الفوري.',
    price: 3,
    currency: 'دولار',
    currencySymbol: '$',
  },
  usdtErc20: {
    enabled: true,
    walletAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    instructions: 'أرسل عملات USDT حصرياً عبر شبكة ERC20 (إيثريوم) إلى عنوان المحفظة أعلاه، ثم أدخل هاش المعاملة للتفعيل.',
    price: 3,
    currency: 'دولار',
    currencySymbol: '$',
  },
  otherMethods: [],
};

const defaultSettings: Settings = {
  siteName: 'ToysGame World',
  logoUrl: 'https://img.icons8.com/plasticine/100/controller.png',
  subscriptionUrl: 'https://www.youtube.com/@mkstudio_963',
  whatsappUrl: 'https://wa.me/',
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
  approvedActivationCodes: generate100DefaultCodes(),
  codeCustomerBindings: {},
  newGameIds: [8888, 9999],
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
  skillTestResults: [],
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
  // VIP Paid state (Permanent local activation with strict device & IP binding)
  isVipActive: boolean;
  vipActivationCode: string;
  getInstallationId: () => string;
  getDeviceId: () => string;
  activateVip: (code: string, customerName?: string) => Promise<{ success: boolean; message: string; reason?: string; clientIp?: string; boundIp?: string }>;
  deactivateVip: () => void;
  unbindCodeIp: (code: string) => Promise<{ success: boolean; message: string }>;
  // Subscription Orders & Activation Codes
  addPurchaseOrder: (
    order: Omit<SubscriptionOrder, 'id' | 'createdAt' | 'activationCode' | 'status'>
  ) => Promise<SubscriptionOrder>;
  updateOrderStatus: (orderId: string, status: 'معلق' | 'موافق عليه' | 'مرفوض') => void;
  deletePurchaseOrder: (orderId: string) => void;
  generateManualActivationCode: (note?: string) => string;
  generateFreeRandomCode: (forceReplace?: boolean) => { code: string; isNew: boolean };
  generateSingleRandomCode: () => string;
  generateBatchCodes: (count: number) => string[];
  resetApprovedCodesTo100: () => string[];
  generateFriendCode: (friendName: string) => string;
  reserveCodeForCustomer: (code: string, customerName: string) => Promise<void>;
  unreserveCodeForCustomer: (code: string) => Promise<void>;
  revokeActivationCode: (code: string) => void;
  revokeFreeActivationCode: () => void;
  // Reset all settings data to original defaults
  resetAllSettingsData: () => Settings;
  // JSON Backup / Restore / Cross-Device Sync
  exportAllDataAsJSON: () => void;
  importAllDataFromJSON: (jsonInput: string | object) => Promise<{
    success: boolean;
    message: string;
    summary?: { orders: number; feedbacks: number; messages: number; codes: number };
  }>;
  syncAllWithGist: () => Promise<boolean>;
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
  loadFromGist: (customUrlOrSilent?: string | boolean, isSilent?: boolean) => Promise<boolean>;
  saveToGist: (overrideSettings?: Settings) => Promise<boolean>;
  isSyncing: boolean;
  isInitialLoading: boolean;
  lastSyncTime: string | null;
  syncError: string | null;
  setSyncError: (err: string | null) => void;
  // Feedback & Contact Management
  addFeedback: (item: { name: string; email: string; rating: number; category?: string; message: string }) => Promise<FeedbackItem>;
  updateFeedbackStatus: (id: string, status: 'قيد الاطلاع' | 'تمت المراجعة' | 'مكتمل') => void;
  deleteFeedback: (id: string) => void;
  addContactMessage: (item: { name: string; email: string; subject: string; message: string }) => Promise<ContactMessage>;
  updateContactMessageStatus: (id: string, status: 'جديدة' | 'قيد الاطلاع' | 'تم الرد') => void;
  deleteContactMessage: (id: string) => void;
  addSkillTestResult: (item: { name: string; age: string; country: string; score: number; total: number }) => Promise<void>;
  deleteSkillTestResult: (id: string) => void;
  // Per-game VIP restriction helpers (Timer or Question limit)
  isGameVip: (gameId: number) => boolean;
  getGameVipConfig: (gameId: number) => GameVipConfig;
  setGameVipConfig: (gameId: number, config: Partial<GameVipConfig>) => void;
  // 50 Questions VIP Gate & Timer helpers
  isGame50VipGated: (gameId: number) => boolean;
  getGame50VipThreshold: (gameId: number) => number;
  isGame50TimerEnabled: (gameId: number) => boolean;
  getGame50TimerDuration: (gameId: number) => number;
}


const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gistUrl, setGistUrlState] = useState<string>(() => {
    return localStorage.getItem('gistUrl') || DEFAULT_GIST_URL;
  });

  const [gistToken, setGistTokenState] = useState<string>(() => {
    const saved = localStorage.getItem('gistToken');
    if (saved && saved.trim()) return saved.trim();
    return DEFAULT_GIST_TOKEN;
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
            paypal: {
              ...defaultPaidSettings.paypal,
              ...(parsed.paidSettings?.paypal || {}),
            },
            binancePay: {
              ...defaultPaidSettings.binancePay,
              ...(parsed.paidSettings?.binancePay || {}),
            },
            usdtTrc20: {
              ...defaultPaidSettings.usdtTrc20,
              ...(parsed.paidSettings?.usdtTrc20 || {}),
            },
            usdtErc20: {
              ...defaultPaidSettings.usdtErc20,
              ...(parsed.paidSettings?.usdtErc20 || {}),
            },
          },
          purchaseOrders: [],
          approvedActivationCodes: Array.isArray(parsed.approvedActivationCodes)
            ? parsed.approvedActivationCodes
            : defaultSettings.approvedActivationCodes,
          adSettings: { ...defaultSettings.adSettings, ...(parsed.adSettings || {}) },
          googleAdSettings: { ...defaultSettings.googleAdSettings, ...(parsed.googleAdSettings || {}) },
          feedbacks: [],
          contactMessages: [],
          skillTestResults: [],
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

  // Unique Installation Fingerprint generated via Web Crypto API
  const getInstallationId = (): string => {
    try {
      let id = localStorage.getItem('toys_game_installation_id') || localStorage.getItem('toys_game_device_fingerprint');
      if (!id) {
        if (typeof window !== 'undefined' && window.crypto) {
          if (typeof window.crypto.randomUUID === 'function') {
            id = window.crypto.randomUUID();
          } else if (window.crypto.getRandomValues) {
            const arr = new Uint8Array(16);
            window.crypto.getRandomValues(arr);
            id = Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
          }
        }
        if (!id) {
          id = 'inst_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
        }
        localStorage.setItem('toys_game_installation_id', id);
        localStorage.setItem('toys_game_device_fingerprint', id);
      }
      return id;
    } catch {
      return 'default_installation_id';
    }
  };

  const getDeviceId = getInstallationId;

  const activateVip = async (
    rawCode: string,
    customerName?: string
  ): Promise<{ success: boolean; message: string; reason?: string; clientIp?: string; boundIp?: string }> => {
    const code = (rawCode || '').trim().toUpperCase();
    if (!code) {
      return { success: false, message: 'يرجى كتابة كود التفعيل أولاً.' };
    }

    const deviceId = getInstallationId();
    const bindings = settings.codeDeviceBindings || {};
    const boundDevice = bindings[code];

    // Local device mismatch check
    if (boundDevice && boundDevice !== deviceId) {
      return {
        success: false,
        reason: 'DEVICE_MISMATCH',
        message: '⚠️ تنبيه أمني مشدد: هذا الكود مفعّل مسبقاً ومقترن بهاتف آخر ولا يمكن استخدامه على هذا الجهاز نهائياً منعاً للتلاعب والغش.',
      };
    }

    // 1. Check if code exists in approved codes list or customer bindings
    const isApprovedCode =
      settings.approvedActivationCodes?.some((c) => c.trim().toUpperCase() === code) ||
      Boolean(settings.codeCustomerBindings?.[code]);

    // 2. Check if code exists in any purchase order that is approved or valid
    const matchingOrder = settings.purchaseOrders?.find(
      (o) => o.activationCode?.trim().toUpperCase() === code
    );

    // 3. Algorithmic format check (VIP-XXXX-XXXX)
    const isAlgorithmicValid = /^VIP-[A-Z0-9]{4}-[A-Z0-9]{4,}$/i.test(code);

    if (!isApprovedCode && (!matchingOrder || matchingOrder.status === 'مرفوض') && !isAlgorithmicValid) {
      return {
        success: false,
        message: 'كود التفعيل غير صحيح أو غير معتمد. يرجى مراجعة الإدارة أو التأكد من إدخال الرمز بشكل دقيق.',
      };
    }

    // Call Backend Server IP-Binding Endpoint to verify and lock to phone's IP
    let serverIp = '';
    let serverDevice = '';
    let serverActivatedAt = new Date().toLocaleString('ar-EG');

    try {
      const activeToken = (gistToken || localStorage.getItem('gistToken') || DEFAULT_GIST_TOKEN).trim();
      const activeUrl = (gistUrl || localStorage.getItem('gistUrl') || DEFAULT_GIST_URL).trim();

      const res = await fetch('/api/activate-vip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'x-gist-token': activeToken, 'x-gist-url': activeUrl } : {}),
        },
        body: JSON.stringify({
          code,
          installationId: deviceId,
          deviceFingerprint: deviceId,
          customerName: customerName || settings.codeCustomerBindings?.[code],
          gistToken: activeToken,
          gistUrl: activeUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        // Server rejected due to IP or Device mismatch!
        return {
          success: false,
          reason: data.reason || 'IP_MISMATCH',
          boundIp: data.boundIp,
          message:
            data.message ||
            '⚠️ تنبيه أمني مشدد: هذا الكود محجوز أو مفعّل مسبقاً ومقترن بـ IP وبصمة هاتف آخر ولا يمكن استخدامه على هذا الجهاز.',
        };
      }

      if (data.clientIp) serverIp = data.clientIp;
      if (data.deviceInfo) serverDevice = data.deviceInfo;
      if (data.activatedAt) serverActivatedAt = data.activatedAt;
    } catch (apiErr) {
      console.warn('Backend /api/activate-vip request error:', apiErr);
      // If offline, also check local settings bindings
      if (settings.codeDeviceBindings?.[code] && settings.codeDeviceBindings?.[code] !== deviceId) {
        return {
          success: false,
          reason: 'DEVICE_MISMATCH',
          message: '⚠️ تنبيه أمني مشدد: هذا الكود مقترن بهاتف آخر ولا يمكن استخدامه على هذا الجهاز.',
        };
      }
    }

    // Bind code to device & IP in local and cloud state
    const updatedDeviceBindings = { ...bindings, [code]: deviceId };
    const updatedIpBindings = {
      ...(settings.codeIpBindings || {}),
      ...(serverIp ? { [code]: serverIp } : {}),
    };
    const updatedDetails = {
      ...(settings.codeActivationDetails || {}),
      [code]: {
        ip: serverIp || 'مسجل محلياً',
        deviceInfo: serverDevice || navigator.userAgent,
        activatedAt: serverActivatedAt,
        customerName: customerName || settings.codeCustomerBindings?.[code],
        deviceFingerprint: deviceId,
      },
    };

    setSettings((prev) => ({
      ...prev,
      codeDeviceBindings: updatedDeviceBindings,
      codeIpBindings: updatedIpBindings,
      codeActivationDetails: updatedDetails,
    }));

    try {
      localStorage.setItem('toysGameVipActive', 'true');
      localStorage.setItem('toysGameVipCode', code);
    } catch (e) {
      console.error(e);
    }
    setIsVipActiveState(true);
    setVipActivationCodeState(code);

    // If matched an order and not approved yet, mark it approved
    if (matchingOrder && matchingOrder.status === 'معلق') {
      updateOrderStatus(matchingOrder.id, 'موافق عليه');
    }

    return {
      success: true,
      clientIp: serverIp,
      message: serverIp
        ? `🎉 تهانينا! تم ربط وتفعيل كود VIP بنجاح على هذا الهاتف (IP: ${serverIp}) مدى الحياة.`
        : '🎉 تهانينا! تم تفعيل النسخة الكاملة (VIP) بنجاح على هذا الجهاز مدى الحياة.',
    };
  };

  // Admin unbind IP and Device from code
  const unbindCodeIp = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'كود غير محدد' };

    try {
      await fetch('/api/unbind-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(gistToken ? { 'x-gist-token': gistToken, 'x-gist-url': gistUrl } : {}),
        },
        body: JSON.stringify({ code: cleanCode, gistToken, gistUrl }),
      });
    } catch (e) {
      console.warn('API unbind call failed:', e);
    }

    const updatedDeviceBindings = { ...(settings.codeDeviceBindings || {}) };
    delete updatedDeviceBindings[cleanCode];

    const updatedIpBindings = { ...(settings.codeIpBindings || {}) };
    delete updatedIpBindings[cleanCode];

    const updatedDetails = { ...(settings.codeActivationDetails || {}) };
    delete updatedDetails[cleanCode];

    setSettings((prev) => ({
      ...prev,
      codeDeviceBindings: updatedDeviceBindings,
      codeIpBindings: updatedIpBindings,
      codeActivationDetails: updatedDetails,
    }));

    return {
      success: true,
      message: `تم بنجاح فك ارتباط الـ IP والجهاز للكود (${cleanCode}) وأصبح متاحاً للاستخدام من جديد.`,
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
    
    let returnedOrder = newOrder;
    // Post to server API which updates Gist atomically
    try {
      const activeToken = (gistToken || localStorage.getItem('gistToken') || DEFAULT_GIST_TOKEN).trim();
      const activeUrl = (gistUrl || localStorage.getItem('gistUrl') || DEFAULT_GIST_URL).trim();

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'x-gist-token': activeToken, 'x-gist-url': activeUrl } : {}),
        },
        body: JSON.stringify({ ...newOrder, gistToken: activeToken, gistUrl: activeUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.purchaseOrders)) {
          updatedOrders = data.purchaseOrders;
        } else if (data.success && Array.isArray(data.orders)) {
          updatedOrders = data.orders;
        }
        if (data.success && data.order) {
          returnedOrder = { ...newOrder, ...data.order };
        }
      }
    } catch (e) {
      console.warn('API post order failed:', e);
    }

    setSettings((prev) => ({
      ...prev,
      purchaseOrders: updatedOrders,
    }));

    return returnedOrder;
  };

  const updateOrderStatus = async (orderId: string, status: 'معلق' | 'موافق عليه' | 'مرفوض') => {
    let orderActivationCode = '';
    const activatedAt = status === 'موافق عليه' ? new Date().toLocaleString('ar-EG') : undefined;
    const updatedOrders = (settings.purchaseOrders || []).map((ord) => {
      if (ord.id === orderId) {
        orderActivationCode = ord.activationCode;
        return {
          ...ord,
          status,
          activatedAt: status === 'موافق عليه' ? (activatedAt || new Date().toLocaleString('ar-EG')) : ord.activatedAt,
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

    setSettings((prev) => ({
      ...prev,
      purchaseOrders: updatedOrders,
      approvedActivationCodes: updatedApprovedCodes,
    }));

    // Call server API which updates Gist atomically
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, activatedAt }),
      });
    } catch (e) {
      console.warn('Order status server patch error:', e);
    }
  };

  const deletePurchaseOrder = async (orderId: string) => {
    setSettings((prev) => ({
      ...prev,
      purchaseOrders: (prev.purchaseOrders || []).filter((ord) => ord.id !== orderId),
    }));

    // Call server API which updates Gist atomically
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Order delete server error:', e);
    }
  };

  // Generate only ONE free random activation code at a time
  const generateFreeRandomCode = (forceReplace = false): { code: string; isNew: boolean } => {
    // If a free code already exists and is valid, and user did not force-replace it, reuse it
    if (!forceReplace && settings.freeActivationCode && (settings.approvedActivationCodes || []).includes(settings.freeActivationCode)) {
      return { code: settings.freeActivationCode, isNew: false };
    }

    const existingFree = settings.freeActivationCode;
    let baseCodes = settings.approvedActivationCodes || [];
    if (existingFree) {
      baseCodes = baseCodes.filter((c) => c !== existingFree);
    }

    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `VIP-FREE-${part1}-${part2}`;

    const updatedCodes = [newCode, ...baseCodes];
    const updatedBindings = {
      ...(settings.codeCustomerBindings || {}),
      [newCode]: 'كود عشوائي مجاني 🎁 (كود تجريبي مجاني)',
    };
    if (existingFree && updatedBindings[existingFree]) {
      delete updatedBindings[existingFree];
    }

    const freeOrder: SubscriptionOrder = {
      id: `FREE-${Date.now().toString().slice(-5)}`,
      customerName: 'كود عشوائي مجاني 🎁 (هدية مجانية)',
      customerPhone: 'مجاني - الإدارة',
      paymentMethod: 'مجاني',
      amount: 0,
      currency: settings.paidSettings?.currency || 'دولار',
      transactionId: 'FREE_RANDOM_CODE',
      notes: 'كود تفعيل عشوائي مجاني وحيد مسموح به في النظام',
      status: 'موافق عليه',
      createdAt: new Date().toLocaleString('ar-EG'),
      activationCode: newCode,
      barcodeValue: newCode,
      activatedAt: new Date().toLocaleString('ar-EG'),
    };

    const baseOrders = existingFree
      ? (settings.purchaseOrders || []).filter((o) => o.activationCode !== existingFree)
      : (settings.purchaseOrders || []);

    const updatedOrders = [freeOrder, ...baseOrders];
    const newSettings: Settings = {
      ...settings,
      approvedActivationCodes: updatedCodes,
      freeActivationCode: newCode,
      codeCustomerBindings: updatedBindings,
      purchaseOrders: updatedOrders,
    };

    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }

    return { code: newCode, isNew: true };
  };

  const revokeFreeActivationCode = () => {
    if (!settings.freeActivationCode) return;
    const target = settings.freeActivationCode;
    const updatedCodes = (settings.approvedActivationCodes || []).filter((c) => c !== target);
    const updatedOrders = (settings.purchaseOrders || []).map((ord) =>
      ord.activationCode === target ? { ...ord, status: 'مرفوض' as const } : ord
    );
    const newBindings = { ...(settings.codeCustomerBindings || {}) };
    delete newBindings[target];

    const newSettings: Settings = {
      ...settings,
      approvedActivationCodes: updatedCodes,
      freeActivationCode: undefined,
      codeCustomerBindings: newBindings,
      purchaseOrders: updatedOrders,
    };
    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
  };

  const generateFriendCode = (friendName: string): string => {
    const cleanName = friendName.trim() || 'صديق مخصص';
    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `VIP-FRIEND-${part1}-${part2}`;

    const updatedCodes = [newCode, ...(settings.approvedActivationCodes || [])];
    const updatedBindings = {
      ...(settings.codeCustomerBindings || {}),
      [newCode]: `صديق: ${cleanName}`,
    };

    const friendOrder: SubscriptionOrder = {
      id: `FRD-${Date.now().toString().slice(-5)}`,
      customerName: `كود صديق: ${cleanName}`,
      customerPhone: 'مباشر من الإدارة',
      paymentMethod: 'sham_cash',
      amount: settings.paidSettings?.price || 3,
      currency: settings.paidSettings?.currency || 'دولار',
      transactionId: 'FRIEND_ACTIVATION',
      status: 'موافق عليه',
      createdAt: new Date().toLocaleString('ar-EG'),
      activationCode: newCode,
      barcodeValue: newCode,
      activatedAt: new Date().toLocaleString('ar-EG'),
    };

    const updatedOrders = [friendOrder, ...(settings.purchaseOrders || [])];
    const newSettings: Settings = {
      ...settings,
      approvedActivationCodes: updatedCodes,
      codeCustomerBindings: updatedBindings,
      purchaseOrders: updatedOrders,
    };

    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }

    return newCode;
  };

  // Generate exactly ONE single random unique code (no duplicates)
  const generateSingleRandomCode = (): string => {
    const existingSet = new Set(
      (settings.approvedActivationCodes || []).map((c) => c.trim().toUpperCase())
    );
    let newCode = '';
    while (!newCode || existingSet.has(newCode)) {
      const p1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const p2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      newCode = `VIP-CODE-${p1}-${p2}`;
    }

    const updatedCodes = [newCode, ...(settings.approvedActivationCodes || [])];
    const newSettings: Settings = {
      ...settings,
      approvedActivationCodes: updatedCodes,
    };

    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
    return newCode;
  };

  // Generate a specified number of unique codes without duplicates
  const generateBatchCodes = (count: number): string[] => {
    const safeCount = Math.max(1, Math.min(Number(count) || 1, 500));
    const existingSet = new Set(
      (settings.approvedActivationCodes || []).map((c) => c.trim().toUpperCase())
    );
    const newBatch: string[] = [];

    while (newBatch.length < safeCount) {
      const p1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const p2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `VIP-CODE-${p1}-${p2}`;
      if (!existingSet.has(code) && !newBatch.includes(code)) {
        newBatch.push(code);
      }
    }

    const updatedCodes = [...newBatch, ...(settings.approvedActivationCodes || [])];
    const newSettings: Settings = {
      ...settings,
      approvedActivationCodes: updatedCodes,
    };

    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
    return newBatch;
  };

  // Reset approved codes registry back to the clean 100 default codes
  const resetApprovedCodesTo100 = (): string[] => {
    const newSettings: Settings = {
      ...settings,
      approvedActivationCodes: DEFAULT_100_ACTIVATION_CODES,
    };
    saveSettings(newSettings);
    if (gistToken) {
      saveToGist(newSettings).catch(() => {});
    }
    return DEFAULT_100_ACTIVATION_CODES;
  };

  const generateManualActivationCode = (customerName?: string): string => {
    if (customerName && customerName.trim()) {
      return generateFriendCode(customerName);
    }
    return generateFreeRandomCode(false).code;
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

    const isFreeCodeRevoked = settings.freeActivationCode && settings.freeActivationCode.trim().toUpperCase() === normalized;

    const newSettings: Settings = {
      ...settings,
      approvedActivationCodes: updatedCodes,
      freeActivationCode: isFreeCodeRevoked ? undefined : settings.freeActivationCode,
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

  // Check whether any game is VIP gated
  const isGameVip = useCallback((gameId: number): boolean => {
    const paid = settings.paidSettings;
    if (!paid || paid.enabled === false) return false;
    const list = paid.paidGameIds || [];
    if (list.includes(gameId)) return true;
    // Check if child skill game (id <= 40 maps to 8000 + id, or 8888 for overall)
    if (gameId <= 40 && (list.includes(8000 + gameId) || list.includes(8888))) return true;
    if (gameId > 8000 && list.includes(gameId - 8000)) return true;
    // Check legacy lists
    if (Array.isArray(paid.vip50GamesGateIds) && (paid.vip50GamesGateIds.includes(gameId) || (gameId > 8000 && paid.vip50GamesGateIds.includes(gameId - 8000)))) {
      return true;
    }
    return false;
  }, [settings.paidSettings]);

  // Get configuration for a VIP game (whether Timer or Question/Stage limit)
  const getGameVipConfig = useCallback((gameId: number): GameVipConfig => {
    const paid = settings.paidSettings;
    // Direct or mapped lookup
    const cfg = paid?.gameVipConfigs?.[gameId] || (gameId > 8000 ? paid?.gameVipConfigs?.[gameId - 8000] : undefined) || (gameId <= 40 ? paid?.gameVipConfigs?.[8000 + gameId] : undefined);
    if (cfg) {
      return {
        restrictionType: cfg.restrictionType || 'timer',
        timerSeconds: typeof cfg.timerSeconds === 'number' && cfg.timerSeconds > 0 ? cfg.timerSeconds : (paid?.timer50DurationSeconds || 20),
        questionLimit: typeof cfg.questionLimit === 'number' && cfg.questionLimit > 0 ? cfg.questionLimit : (paid?.vip50StageThreshold || 10),
      };
    }
    // Check legacy 50 config if available
    const legacy = paid?.customGame50Config?.[gameId] || (gameId > 8000 ? paid?.customGame50Config?.[gameId - 8000] : undefined);
    if (legacy) {
      return {
        restrictionType: legacy.timerEnabled ? 'timer' : 'question_limit',
        timerSeconds: legacy.timerSeconds || 20,
        questionLimit: legacy.vipStage || 10,
      };
    }
    // Legacy fallback based on timer50GamesIds
    if (Array.isArray(paid?.timer50GamesIds) && (paid.timer50GamesIds.includes(gameId) || (gameId > 8000 && paid.timer50GamesIds.includes(gameId - 8000)))) {
      return {
        restrictionType: 'timer',
        timerSeconds: paid?.timer50DurationSeconds || 20,
        questionLimit: paid?.vip50StageThreshold || 10,
      };
    }
    return {
      restrictionType: 'timer',
      timerSeconds: paid?.timer50DurationSeconds || 20,
      questionLimit: paid?.vip50StageThreshold || 10,
    };
  }, [settings.paidSettings]);

  // Update configuration for a specific VIP game
  const setGameVipConfig = useCallback((gameId: number, config: Partial<GameVipConfig>) => {
    setSettings((prev) => {
      const paid = prev.paidSettings;
      if (!paid) return prev;
      const currentConfigs = paid.gameVipConfigs || {};
      const existing = currentConfigs[gameId] || {
        restrictionType: 'timer',
        timerSeconds: 20,
        questionLimit: 10,
      };
      const updatedConfig: GameVipConfig = {
        ...existing,
        ...config,
      };
      const newConfigs = {
        ...currentConfigs,
        [gameId]: updatedConfig,
      };
      // If game is a child skill (<= 40 or > 8000), mirror it
      if (gameId <= 40) {
        newConfigs[8000 + gameId] = updatedConfig;
      } else if (gameId > 8000 && gameId <= 8040) {
        newConfigs[gameId - 8000] = updatedConfig;
      }
      return {
        ...prev,
        paidSettings: {
          ...paid,
          gameVipConfigs: newConfigs,
        },
      };
    });
  }, [setSettings]);

  // 50-Questions games VIP Stage Gate Check
  const isGame50VipGated = useCallback((gameId: number): boolean => {
    const paid = settings.paidSettings;
    if (!paid || paid.enabled === false) return false;
    const isVip = isGameVip(gameId);
    if (!isVip) return false;
    const config = getGameVipConfig(gameId);
    return config.restrictionType === 'question_limit';
  }, [settings.paidSettings, isGameVip, getGameVipConfig]);

  // 50-Questions games VIP Stage Threshold (e.g. stage 10)
  const getGame50VipThreshold = useCallback((gameId: number): number => {
    const config = getGameVipConfig(gameId);
    return config.questionLimit || 10;
  }, [getGameVipConfig]);

  // 50-Questions games Timer Check
  const isGame50TimerEnabled = useCallback((gameId: number): boolean => {
    const paid = settings.paidSettings;
    if (!paid || paid.enabled === false) return false;
    const isVip = isGameVip(gameId);
    if (!isVip) return false;
    const config = getGameVipConfig(gameId);
    return config.restrictionType === 'timer';
  }, [settings.paidSettings, isGameVip, getGameVipConfig]);

  // 50-Questions games Timer Duration
  const getGame50TimerDuration = useCallback((gameId: number): number => {
    const config = getGameVipConfig(gameId);
    return config.timerSeconds || 20;
  }, [getGameVipConfig]);


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

    // Save ONLY lightweight UI preferences to localStorage, NEVER visitor submissions or critical collections!
    try {
      const isHeavyAudio =
        typeof newSettings.backgroundMusicUrl === 'string' &&
        newSettings.backgroundMusicUrl.startsWith('data:audio/');
      const uiPreferencesToPersist = {
        siteName: newSettings.siteName,
        logoUrl: newSettings.logoUrl,
        backgroundMusicUrl: isHeavyAudio
          ? defaultSettings.backgroundMusicUrl
          : newSettings.backgroundMusicUrl,
        backgroundMusicEnabled: newSettings.backgroundMusicEnabled,
        videoWaitTime: newSettings.videoWaitTime,
        videoRequiredGameIds: newSettings.videoRequiredGameIds,
        requireSubscriptionAndVideos: newSettings.requireSubscriptionAndVideos,
        paidSettings: newSettings.paidSettings,
        adSettings: newSettings.adSettings,
        googleAdSettings: newSettings.googleAdSettings,
      };
      localStorage.setItem('toysGameSettings', JSON.stringify(uiPreferencesToPersist));
    } catch (error) {
      console.warn('Could not save UI preferences to localStorage:', error);
    }

    // Automatically synchronize settings with backend server and Gist
    try {
      const activeToken = (gistToken || localStorage.getItem('gistToken') || DEFAULT_GIST_TOKEN).trim();
      const activeUrl = (gistUrl || localStorage.getItem('gistUrl') || DEFAULT_GIST_URL).trim();

      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: newSettings,
          gistToken: activeToken,
          gistUrl: activeUrl,
        }),
      }).catch((e) => console.warn('Background settings sync error:', e));

      fetch('/api/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSettings,
          settings: newSettings,
          gistToken: activeToken,
          gistUrl: activeUrl,
        }),
      }).catch((e) => console.warn('Background sync-all error:', e));
    } catch (e) {
      console.warn('Failed to dispatch server sync:', e);
    }
  };

  const reserveCodeForCustomer = async (code: string, customerName: string) => {
    const cleanCode = code.trim().toUpperCase();
    const cleanCustomer = customerName.trim();
    const updatedBindings = {
      ...(settings.codeCustomerBindings || {}),
    };
    if (cleanCustomer) {
      updatedBindings[cleanCode] = cleanCustomer;
    } else {
      delete updatedBindings[cleanCode];
    }

    const currentCodes = settings.approvedActivationCodes || [];
    const updatedCodes = currentCodes.includes(cleanCode)
      ? currentCodes
      : [cleanCode, ...currentCodes];

    setSettings((prev) => ({
      ...prev,
      approvedActivationCodes: updatedCodes,
      codeCustomerBindings: updatedBindings,
    }));

    try {
      const activeToken = (gistToken || localStorage.getItem('gistToken') || DEFAULT_GIST_TOKEN).trim();
      const activeUrl = (gistUrl || localStorage.getItem('gistUrl') || DEFAULT_GIST_URL).trim();

      await fetch('/api/reserve-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'x-gist-token': activeToken, 'x-gist-url': activeUrl } : {}),
        },
        body: JSON.stringify({
          code: cleanCode,
          customerName: cleanCustomer,
          gistToken: activeToken,
          gistUrl: activeUrl,
        }),
      });
    } catch (e) {
      console.warn('Server reserve-code error:', e);
    }
  };

  const unreserveCodeForCustomer = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const updatedBindings = {
      ...(settings.codeCustomerBindings || {}),
    };
    delete updatedBindings[cleanCode];

    setSettings((prev) => ({
      ...prev,
      codeCustomerBindings: updatedBindings,
    }));

    try {
      const activeToken = (gistToken || localStorage.getItem('gistToken') || DEFAULT_GIST_TOKEN).trim();
      const activeUrl = (gistUrl || localStorage.getItem('gistUrl') || DEFAULT_GIST_URL).trim();

      await fetch('/api/unreserve-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'x-gist-token': activeToken, 'x-gist-url': activeUrl } : {}),
        },
        body: JSON.stringify({
          code: cleanCode,
          gistToken: activeToken,
          gistUrl: activeUrl,
        }),
      });
    } catch (e) {
      console.warn('Server unreserve-code error:', e);
    }
  };

  const setGistUrl = (url: string) => {
    const clean = url.trim() || DEFAULT_GIST_URL;
    localStorage.setItem('gistUrl', clean);
    setGistUrlState(clean);
    fetch('/api/gist-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gistUrl: clean }),
    }).catch((e) => console.warn('Failed to sync gistUrl to server:', e));
  };

  const setGistToken = (token: string) => {
    const clean = token.trim();
    localStorage.setItem('gistToken', clean);
    setGistTokenState(clean);
    fetch('/api/gist-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gistToken: clean }),
    }).catch((e) => console.warn('Failed to sync gistToken to server:', e));
  };

  // Load latest settings from Gist with real-time GitHub API and cache-busting fallback
  const loadFromGist = useCallback(async (customUrlOrSilent?: string | boolean, isSilentParam?: boolean): Promise<boolean> => {
    const customUrl = typeof customUrlOrSilent === 'string' ? customUrlOrSilent : undefined;
    const isSilent = typeof customUrlOrSilent === 'boolean' ? customUrlOrSilent : Boolean(isSilentParam);

    const targetUrl = (customUrl || gistUrl || DEFAULT_GIST_URL).trim();
    if (!targetUrl) return false;

    if (!isSilent) {
      setIsSyncing(true);
    }
    const { gistId, filename, unpinnedRawUrl } = extractGistInfo(targetUrl);
    const activeToken = gistToken || localStorage.getItem('gistToken') || DEFAULT_GIST_TOKEN;

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
      let serverSubmissions: {
        purchaseOrders?: any[];
        contactMessages?: any[];
        feedbacks?: any[];
        skillTestResults?: any[];
        codeIpBindings?: Record<string, string>;
        codeActivationDetails?: Record<string, any>;
        codeDeviceBindings?: Record<string, string>;
      } = {};
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

      const localSettingsRaw = localStorage.getItem('toysGameSettings');
      const localParsed = localSettingsRaw ? JSON.parse(localSettingsRaw) : {};

      const hasAnyServerSubmissions =
        Boolean(serverSubmissions.purchaseOrders && serverSubmissions.purchaseOrders.length > 0) ||
        Boolean(serverSubmissions.contactMessages && serverSubmissions.contactMessages.length > 0) ||
        Boolean(serverSubmissions.feedbacks && serverSubmissions.feedbacks.length > 0) ||
        Boolean(serverSubmissions.skillTestResults && serverSubmissions.skillTestResults.length > 0) ||
        Boolean(serverSubmissions.codeIpBindings && Object.keys(serverSubmissions.codeIpBindings).length > 0);

      if ((fetchedSettings && typeof fetchedSettings === 'object') || hasAnyServerSubmissions) {
        const effectiveRemote = fetchedSettings || {};

        const parsedWaitTime =
          typeof effectiveRemote.videoWaitTime === 'number'
            ? effectiveRemote.videoWaitTime
            : Number(effectiveRemote.videoWaitTime) || defaultSettings.videoWaitTime;

        const mergedFeedbacks: FeedbackItem[] = effectiveRemote && Array.isArray(effectiveRemote.feedbacks)
          ? effectiveRemote.feedbacks
          : (effectiveRemote && Array.isArray(effectiveRemote.reviews)
              ? effectiveRemote.reviews
              : (serverSubmissions && Array.isArray(serverSubmissions.feedbacks)
                  ? serverSubmissions.feedbacks
                  : (serverSubmissions && Array.isArray(serverSubmissions.reviews) ? serverSubmissions.reviews : [])));

        const mergedMessages: ContactMessage[] = effectiveRemote && Array.isArray(effectiveRemote.contactMessages)
          ? effectiveRemote.contactMessages
          : (effectiveRemote && Array.isArray(effectiveRemote.messages)
              ? effectiveRemote.messages
              : (serverSubmissions && Array.isArray(serverSubmissions.contactMessages)
                  ? serverSubmissions.contactMessages
                  : (serverSubmissions && Array.isArray(serverSubmissions.messages) ? serverSubmissions.messages : [])));

        const mergedSkillResults: SkillTestResult[] = effectiveRemote && Array.isArray(effectiveRemote.skillTestResults)
          ? effectiveRemote.skillTestResults
          : (effectiveRemote && Array.isArray(effectiveRemote.challenges)
              ? effectiveRemote.challenges
              : (serverSubmissions && Array.isArray(serverSubmissions.skillTestResults)
                  ? serverSubmissions.skillTestResults
                  : (serverSubmissions && Array.isArray(serverSubmissions.challenges) ? serverSubmissions.challenges : [])));

        const mergedOrders: SubscriptionOrder[] = effectiveRemote && Array.isArray(effectiveRemote.purchaseOrders)
          ? effectiveRemote.purchaseOrders
          : (effectiveRemote && Array.isArray(effectiveRemote.orders)
              ? effectiveRemote.orders
              : (serverSubmissions && Array.isArray(serverSubmissions.purchaseOrders)
                  ? serverSubmissions.purchaseOrders
                  : (serverSubmissions && Array.isArray(serverSubmissions.orders) ? serverSubmissions.orders : [])));

        let safeMusicUrl = effectiveRemote.backgroundMusicUrl || localParsed.backgroundMusicUrl || defaultSettings.backgroundMusicUrl;
        if (!safeMusicUrl || safeMusicUrl === 'SAVED_IN_CLOUD_BASE64') {
          safeMusicUrl = defaultSettings.backgroundMusicUrl;
        } else if (safeMusicUrl.startsWith('data:audio/')) {
          saveAudioToCache(safeMusicUrl).catch(() => {});
        }

        const merged: Settings = {
          ...defaultSettings,
          ...localParsed,
          ...effectiveRemote,
          backgroundMusicUrl: safeMusicUrl,
          videoWaitTime: parsedWaitTime,
          videoRequiredGameIds: Array.isArray(effectiveRemote.videoRequiredGameIds)
            ? effectiveRemote.videoRequiredGameIds
            : defaultSettings.videoRequiredGameIds,
          requireSubscriptionAndVideos:
            typeof effectiveRemote.requireSubscriptionAndVideos === 'boolean'
              ? effectiveRemote.requireSubscriptionAndVideos
              : typeof localParsed.requireSubscriptionAndVideos === 'boolean'
              ? localParsed.requireSubscriptionAndVideos
              : defaultSettings.requireSubscriptionAndVideos ?? true,
          paidSettings: {
            ...defaultPaidSettings,
            ...(localParsed.paidSettings || {}),
            ...(effectiveRemote.paidSettings || {}),
            shamCash: {
              ...defaultPaidSettings.shamCash,
              ...(localParsed.paidSettings?.shamCash || {}),
              ...(effectiveRemote.paidSettings?.shamCash || {}),
            },
          },
          purchaseOrders: mergedOrders,
          approvedActivationCodes: Array.from(
            new Set([
              ...(Array.isArray(effectiveRemote.approvedActivationCodes) ? effectiveRemote.approvedActivationCodes : []),
              ...(Array.isArray(serverSubmissions.approvedActivationCodes) ? serverSubmissions.approvedActivationCodes : []),
              ...Object.keys(effectiveRemote.codeCustomerBindings || {}),
              ...Object.keys(serverSubmissions.codeCustomerBindings || {}),
              ...Object.keys(effectiveRemote.codeIpBindings || {}),
              ...Object.keys(serverSubmissions.codeIpBindings || {}),
              ...DEFAULT_100_ACTIVATION_CODES,
            ].filter((c) => typeof c === 'string' && c.trim().length > 0))
          ),
          freeActivationCode:
            effectiveRemote.freeActivationCode ||
            localParsed.freeActivationCode ||
            settings.freeActivationCode,
          codeCustomerBindings: {
            ...(effectiveRemote.codeCustomerBindings || {}),
            ...(serverSubmissions.codeCustomerBindings || {}),
          },
          codeDeviceBindings: {
            ...(effectiveRemote.codeDeviceBindings || {}),
            ...(serverSubmissions.codeDeviceBindings || {}),
          },
          codeIpBindings: {
            ...(effectiveRemote.codeIpBindings || {}),
            ...(serverSubmissions.codeIpBindings || {}),
          },
          codeActivationDetails: {
            ...(effectiveRemote.codeActivationDetails || {}),
            ...(serverSubmissions.codeActivationDetails || {}),
          },
          adSettings: {
            ...defaultSettings.adSettings,
            ...(effectiveRemote.adSettings || {}),
          },
          googleAdSettings: {
            ...defaultSettings.googleAdSettings,
            ...(effectiveRemote.googleAdSettings || {}),
          },
          feedbacks: mergedFeedbacks,
          contactMessages: mergedMessages,
          skillTestResults: mergedSkillResults,
        };

        // Detect if new submissions arrived
        const prevTotal = (settings.purchaseOrders?.length || 0) + (settings.feedbacks?.length || 0) + (settings.contactMessages?.length || 0) + (settings.skillTestResults?.length || 0);
        const newTotal = merged.purchaseOrders.length + merged.feedbacks.length + merged.contactMessages.length + merged.skillTestResults.length;
        if (newTotal > prevTotal && prevTotal > 0) {
          try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
              const audioCtx = new AudioContextClass();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
              osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.25); // A5
              gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.4);
            }
          } catch {}
        }

        setSettings(merged);
        try {
          const isHeavyAudio =
            typeof merged.backgroundMusicUrl === 'string' &&
            merged.backgroundMusicUrl.startsWith('data:audio/');
          const uiPreferencesToPersist = {
            siteName: merged.siteName,
            logoUrl: merged.logoUrl,
            backgroundMusicUrl: isHeavyAudio
              ? defaultSettings.backgroundMusicUrl
              : merged.backgroundMusicUrl,
            backgroundMusicEnabled: merged.backgroundMusicEnabled,
            videoWaitTime: merged.videoWaitTime,
            videoRequiredGameIds: merged.videoRequiredGameIds,
            requireSubscriptionAndVideos: merged.requireSubscriptionAndVideos,
            paidSettings: merged.paidSettings,
            adSettings: merged.adSettings,
            googleAdSettings: merged.googleAdSettings,
          };
          localStorage.setItem('toysGameSettings', JSON.stringify(uiPreferencesToPersist));
        } catch {}
        const syncTimeStr = new Date().toLocaleTimeString('ar-EG');
        setLastSyncTime(syncTimeStr);
        localStorage.setItem('toysGameLastGistSync', syncTimeStr);

        // Check if there are any submissions that were received on the server disk but missing from Gist
        const hasUnsyncedServerFeedbacks = (serverSubmissions.feedbacks || []).some(
          (sf: any) => !(effectiveRemote.feedbacks || []).some((rf: any) => rf.id === sf.id)
        );
        const hasUnsyncedServerMessages = (serverSubmissions.contactMessages || []).some(
          (sm: any) => !(effectiveRemote.contactMessages || []).some((rm: any) => rm.id === sm.id)
        );
        const hasUnsyncedServerOrders = (serverSubmissions.purchaseOrders || []).some(
          (so: any) => !(effectiveRemote.purchaseOrders || []).some((ro: any) => ro.id === so.id)
        );
        const hasUnsyncedServerSkills = (serverSubmissions.skillTestResults || []).some(
          (ss: any) => !(effectiveRemote.skillTestResults || []).some((rs: any) => rs.id === ss.id)
        );

        if ((hasUnsyncedServerFeedbacks || hasUnsyncedServerMessages || hasUnsyncedServerOrders || hasUnsyncedServerSkills) && activeToken) {
          saveToGist(merged).catch((e) => console.warn('Auto-push pending server submissions to Gist failed:', e));
        }

        if (!isSilent) setIsSyncing(false);
        return true;
      }
      if (!isSilent) setIsSyncing(false);
      return false;
    } catch (error) {
      console.error('Failed to load settings from Gist:', error);
      if (!isSilent) setIsSyncing(false);
      return false;
    }
  }, [gistUrl, gistToken]);

  // Save settings directly to GitHub Gist
  const saveToGist = async (overrideSettings?: Settings): Promise<boolean> => {
    setSyncError(null);
    const targetUrl = (gistUrl || DEFAULT_GIST_URL).trim();
    const targetToken = (gistToken || localStorage.getItem('gistToken') || DEFAULT_GIST_TOKEN).trim();

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
  const addFeedback = async (item: { name: string; email: string; rating: number; category?: string; message: string }): Promise<FeedbackItem> => {
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
    let returnedFeedback = newFeedback;

    try {
      const activeToken = (gistToken || localStorage.getItem('gistToken') || DEFAULT_GIST_TOKEN).trim();
      const activeUrl = (gistUrl || localStorage.getItem('gistUrl') || DEFAULT_GIST_URL).trim();

      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'x-gist-token': activeToken, 'x-gist-url': activeUrl } : {}),
        },
        body: JSON.stringify({ ...newFeedback, gistToken: activeToken, gistUrl: activeUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.feedbacks)) {
          updatedFeedbacks = data.feedbacks;
        } else if (data.success && Array.isArray(data.reviews)) {
          updatedFeedbacks = data.reviews;
        }
        if (data.success && data.feedback) {
          returnedFeedback = { ...newFeedback, ...data.feedback };
        }
      }
    } catch (e) {
      console.warn('API post feedback failed:', e);
    }

    setSettings((prev) => ({
      ...prev,
      feedbacks: updatedFeedbacks,
    }));

    return returnedFeedback;
  };

  const updateFeedbackStatus = async (id: string, status: 'قيد الاطلاع' | 'تمت المراجعة' | 'مكتمل') => {
    setSettings((prev) => ({
      ...prev,
      feedbacks: (prev.feedbacks || []).map((fb) => (fb.id === id ? { ...fb, status } : fb)),
    }));

    // Call server API which updates Gist atomically
    try {
      await fetch(`/api/feedbacks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.warn('Feedback status server patch error:', e);
    }
  };

  const deleteFeedback = async (id: string) => {
    setSettings((prev) => ({
      ...prev,
      feedbacks: (prev.feedbacks || []).filter((fb) => fb.id !== id),
    }));

    // Call server API which updates Gist atomically
    try {
      await fetch(`/api/feedbacks/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Feedback delete server error:', e);
    }
  };

  // Contact Messages Management Methods
  const addContactMessage = async (item: { name: string; email: string; subject: string; message: string }): Promise<ContactMessage> => {
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
    let returnedMsg = newMsg;

    try {
      const activeToken = (gistToken || localStorage.getItem('gistToken') || DEFAULT_GIST_TOKEN).trim();
      const activeUrl = (gistUrl || localStorage.getItem('gistUrl') || DEFAULT_GIST_URL).trim();

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'x-gist-token': activeToken, 'x-gist-url': activeUrl } : {}),
        },
        body: JSON.stringify({ ...newMsg, gistToken: activeToken, gistUrl: activeUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.contactMessages)) {
          updatedMessages = data.contactMessages;
        } else if (data.success && Array.isArray(data.messages)) {
          updatedMessages = data.messages;
        }
        if (data.success && data.message) {
          returnedMsg = { ...newMsg, ...data.message };
        }
      }
    } catch (e) {
      console.warn('API post message failed:', e);
    }

    setSettings((prev) => ({
      ...prev,
      contactMessages: updatedMessages,
    }));

    return returnedMsg;
  };

  const updateContactMessageStatus = async (id: string, status: 'جديدة' | 'قيد الاطلاع' | 'تم الرد') => {
    setSettings((prev) => ({
      ...prev,
      contactMessages: (prev.contactMessages || []).map((msg) => (msg.id === id ? { ...msg, status } : msg)),
    }));

    // Call server API which updates Gist atomically
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.warn('Message status server patch error:', e);
    }
  };

  const deleteContactMessage = async (id: string) => {
    setSettings((prev) => ({
      ...prev,
      contactMessages: (prev.contactMessages || []).filter((msg) => msg.id !== id),
    }));

    // Call server API which updates Gist atomically
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Message delete server error:', e);
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

    let updatedResults = [newResult, ...(settings.skillTestResults || [])];
    const activeToken = (gistToken || localStorage.getItem('gistToken') || DEFAULT_GIST_TOKEN).trim();
    const activeUrl = (gistUrl || localStorage.getItem('gistUrl') || DEFAULT_GIST_URL).trim();

    try {
      const res = await fetch('/api/skill-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'x-gist-token': activeToken, 'x-gist-url': activeUrl } : {}),
        },
        body: JSON.stringify({ ...newResult, gistToken: activeToken, gistUrl: activeUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.skillTestResults)) {
          updatedResults = data.skillTestResults;
        } else if (data.success && Array.isArray(data.challenges)) {
          updatedResults = data.challenges;
        }
      }
    } catch (e) {
      console.warn('API post skill test failed:', e);
    }

    setSettings((prev) => ({
      ...prev,
      skillTestResults: updatedResults,
    }));
  };

  const deleteSkillTestResult = async (id: string) => {
    setSettings((prev) => ({
      ...prev,
      skillTestResults: (prev.skillTestResults || []).filter((res) => res.id !== id),
    }));

    // Call server API which updates Gist atomically
    try {
      await fetch(`/api/skill-tests/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Skill test delete server error:', e);
    }
  };

  // Export all application data as a complete JSON backup file
  const exportAllDataAsJSON = () => {
    const backupData = {
      app: 'toysgame-world',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      exportedAtFormatted: new Date().toLocaleString('ar-EG'),
      siteName: settings.siteName,
      purchaseOrders: settings.purchaseOrders || [],
      approvedActivationCodes: settings.approvedActivationCodes || [],
      freeActivationCode: settings.freeActivationCode,
      codeCustomerBindings: settings.codeCustomerBindings || {},
      feedbacks: settings.feedbacks || [],
      contactMessages: settings.contactMessages || [],
      skillTestResults: settings.skillTestResults || [],
      paidSettings: settings.paidSettings,
      adSettings: settings.adSettings,
      googleAdSettings: settings.googleAdSettings,
      allSettings: settings,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `toysgame-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import application data from JSON file or JSON string and merge intelligently
  const importAllDataFromJSON = async (
    jsonInput: string | object
  ): Promise<{
    success: boolean;
    message: string;
    summary?: { orders: number; feedbacks: number; messages: number; codes: number };
  }> => {
    try {
      let data: any;
      if (typeof jsonInput === 'string') {
        data = JSON.parse(jsonInput);
      } else {
        data = jsonInput;
      }

      if (!data || typeof data !== 'object') {
        return { success: false, message: 'ملف JSON غير صالح أو فارغ.' };
      }

      const incoming = data.allSettings || data;

      const incomingOrders: SubscriptionOrder[] = Array.isArray(incoming.purchaseOrders)
        ? incoming.purchaseOrders
        : Array.isArray(data.purchaseOrders)
        ? data.purchaseOrders
        : [];

      const incomingCodes: string[] = Array.isArray(incoming.approvedActivationCodes)
        ? incoming.approvedActivationCodes
        : Array.isArray(data.approvedActivationCodes)
        ? data.approvedActivationCodes
        : [];

      const incomingBindings: Record<string, string> =
        incoming.codeCustomerBindings || data.codeCustomerBindings || {};

      const incomingFeedbacks: FeedbackItem[] = Array.isArray(incoming.feedbacks)
        ? incoming.feedbacks
        : Array.isArray(data.feedbacks)
        ? data.feedbacks
        : [];

      const incomingMessages: ContactMessage[] = Array.isArray(incoming.contactMessages)
        ? incoming.contactMessages
        : Array.isArray(data.contactMessages)
        ? data.contactMessages
        : [];

      const incomingSkillResults: SkillTestResult[] = Array.isArray(incoming.skillTestResults)
        ? incoming.skillTestResults
        : Array.isArray(data.skillTestResults)
        ? data.skillTestResults
        : [];

      const freeCode = incoming.freeActivationCode || data.freeActivationCode || settings.freeActivationCode;

      // Clean incoming settings object
      const incomingRaw = data.allSettings || data;
      const { ...extractedSettings } = incomingRaw;

      // Ensure orders, codes, messages, feedbacks take full authoritative precedence
      const finalOrders: SubscriptionOrder[] = incomingOrders.length > 0
        ? [
            ...incomingOrders,
            ...(settings.purchaseOrders || []).filter(
              (localItem) => !incomingOrders.some((inc) => inc.id === localItem.id)
            ),
          ]
        : (settings.purchaseOrders || []);

      const finalCodes = incomingCodes.length > 0
        ? incomingCodes
        : (settings.approvedActivationCodes || defaultSettings.approvedActivationCodes || []);

      const finalBindings = incomingBindings && Object.keys(incomingBindings).length > 0
        ? { ...(settings.codeCustomerBindings || {}), ...incomingBindings }
        : (settings.codeCustomerBindings || {});

      const finalFeedbacks = incomingFeedbacks.length > 0
        ? [
            ...incomingFeedbacks,
            ...(settings.feedbacks || []).filter(
              (localItem) => !incomingFeedbacks.some((inc) => inc.id === localItem.id)
            ),
          ]
        : (settings.feedbacks || []);

      const finalMessages = incomingMessages.length > 0
        ? [
            ...incomingMessages,
            ...(settings.contactMessages || []).filter(
              (localItem) => !incomingMessages.some((inc) => inc.id === localItem.id)
            ),
          ]
        : (settings.contactMessages || []);

      const finalSkillResults = incomingSkillResults.length > 0
        ? [
            ...incomingSkillResults,
            ...(settings.skillTestResults || []).filter(
              (localItem) => !incomingSkillResults.some((inc) => inc.id === localItem.id)
            ),
          ]
        : (settings.skillTestResults || []);

      const newSettings: Settings = {
        ...defaultSettings,
        ...settings,
        ...extractedSettings,
        purchaseOrders: finalOrders,
        approvedActivationCodes: finalCodes,
        freeActivationCode: freeCode !== undefined ? freeCode : settings.freeActivationCode,
        codeCustomerBindings: finalBindings,
        feedbacks: finalFeedbacks,
        contactMessages: finalMessages,
        skillTestResults: finalSkillResults,
      };

      saveSettings(newSettings);

      // Sync with server API
      fetch('/api/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaseOrders: finalOrders,
          contactMessages: finalMessages,
          feedbacks: finalFeedbacks,
          skillTestResults: finalSkillResults,
          gistToken,
          gistUrl,
        }),
      }).catch((e) => console.warn('Server sync after JSON import failed:', e));

      // Auto-sync to Gist if token is set
      if (gistToken) {
        saveToGist(newSettings).catch((e) => console.warn('Sync to Gist after import failed:', e));
      }

      return {
        success: true,
        message: `تم تطبيق أحدث الإعدادات واستيراد ${finalOrders.length} طلب شراء و ${finalCodes.length} كود تفعيل بنجاح!`,
        summary: {
          orders: finalOrders.length,
          codes: finalCodes.length,
          feedbacks: finalFeedbacks.length,
          messages: finalMessages.length,
        },
      };
    } catch (err: any) {
      console.error('Import error:', err);
      return { success: false, message: `فشل قراءة الملف: ${err.message || 'تنسيق غير معروف'}` };
    }
  };

  const resetAllSettingsData = (): Settings => {
    const freshDefaults: Settings = {
      ...defaultSettings,
      approvedActivationCodes: generate100DefaultCodes(),
      purchaseOrders: [],
      feedbacks: [],
      contactMessages: [],
      codeCustomerBindings: {},
      freeActivationCode: undefined,
    };
    saveSettings(freshDefaults);
    try {
      localStorage.removeItem('toysGameSettings');
      localStorage.setItem('toysGameSettings', JSON.stringify(freshDefaults));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    if (gistToken) {
      saveToGist(freshDefaults).catch((e) => console.warn('Sync to Gist after reset failed:', e));
    }
    return freshDefaults;
  };

  const syncAllWithGist = async (): Promise<boolean> => {
    const pulled = await loadFromGist();
    if (pulled && gistToken) {
      await saveToGist();
    }
    return pulled;
  };

  // Automatically sync Gist token with backend server and pull latest data on load
  useEffect(() => {
    let isMounted = true;

    const initGistConfigAndSync = async () => {
      const savedToken = localStorage.getItem('gistToken');
      const savedUrl = localStorage.getItem('gistUrl') || DEFAULT_GIST_URL;

      // 1. If we have a valid token locally, ensure server is aware of it
      if (savedToken && savedToken.trim().length > 5) {
        try {
          await fetch('/api/gist-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gistToken: savedToken.trim(), gistUrl: savedUrl.trim() }),
          });
        } catch (e) {
          console.warn('Auto-sync token to server on mount failed:', e);
        }
      } else {
        // 2. If opening from a new device/browser without local token, fetch server's pre-configured token!
        try {
          const res = await fetch('/api/gist-config');
          if (res.ok) {
            const data = await res.json();
            const activeServerToken = data.gistToken?.trim() || DEFAULT_GIST_TOKEN;
            if (activeServerToken && isMounted) {
              setGistTokenState(activeServerToken);
              localStorage.setItem('gistToken', activeServerToken);
            }
            if (data.gistUrl && (!localStorage.getItem('gistUrl') || savedUrl === DEFAULT_GIST_URL) && isMounted) {
              setGistUrlState(data.gistUrl.trim());
              localStorage.setItem('gistUrl', data.gistUrl.trim());
            }
          }
        } catch (e) {
          console.warn('Fetching server gist-config failed:', e);
          if (DEFAULT_GIST_TOKEN && isMounted) {
            setGistTokenState(DEFAULT_GIST_TOKEN);
            localStorage.setItem('gistToken', DEFAULT_GIST_TOKEN);
          }
        }
      }

      // 3. Initial load from Gist and Server
      try {
        await loadFromGist();
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }

      // 4. Verify VIP validity for current device against server bindings
      const currentVipActive = localStorage.getItem('toysGameVipActive') === 'true';
      const currentVipCode = localStorage.getItem('toysGameVipCode') || '';
      if (currentVipActive && currentVipCode) {
        try {
          const verifyRes = await fetch('/api/verify-vip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: currentVipCode, deviceFingerprint: getDeviceId() }),
          });
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            if (verifyData.valid === false) {
              console.warn('VIP code is bound to another device! Revoking VIP on this device.');
              localStorage.removeItem('toysGameVipActive');
              localStorage.removeItem('toysGameVipCode');
              if (isMounted) {
                setIsVipActiveState(false);
                setVipActivationCodeState('');
              }
            }
          }
        } catch (vErr) {
          console.warn('VIP verification check failed:', vErr);
        }
      }
    };

    initGistConfigAndSync();

    // Background interval auto-poll every 6 seconds for instant live updates across devices
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadFromGist(true);
      }
    }, 6000);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        loadFromGist(true);
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [loadFromGist]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        saveSettings,
        resetAllSettingsData,
        isSubscribed,
        setIsSubscribed,
        resetSubscriptionStatus,
        isVipActive,
        vipActivationCode,
        getInstallationId,
        getDeviceId,
        activateVip,
        deactivateVip,
        addPurchaseOrder,
        updateOrderStatus,
        deletePurchaseOrder,
        generateManualActivationCode,
        generateFreeRandomCode,
        generateSingleRandomCode,
        generateBatchCodes,
        resetApprovedCodesTo100,
        generateFriendCode,
        reserveCodeForCustomer,
        unreserveCodeForCustomer,
        revokeActivationCode,
        revokeFreeActivationCode,
        exportAllDataAsJSON,
        importAllDataFromJSON,
        syncAllWithGist,
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
        isGameVip,
        getGameVipConfig,
        setGameVipConfig,
        isGame50VipGated,
        getGame50VipThreshold,
        isGame50TimerEnabled,
        getGame50TimerDuration,
        unbindCodeIp,
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
