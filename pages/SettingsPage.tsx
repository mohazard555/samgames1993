import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Settings, FeedbackItem, ContactMessage, GameVipConfig } from '../types';
import { GAMES } from '../constants';
import { CHILD_SKILLS_GAMES } from '../data/childSkillsGamesData';
import { LockClosedIcon, VideoCameraIcon, CheckCircleIcon, KeyIcon } from '../components/Icons';
import ShamCashQrCard, { ShamCashLogoSvg } from '../components/ShamCashQrCard';
import SubscriptionOrdersManager from '../components/SubscriptionOrdersManager';

const SettingsPage: React.FC = () => {
  const {
    settings,
    saveSettings,
    isAdminUnlocked,
    verifyAdminPassword,
    lockAdmin,
    gistUrl,
    setGistUrl,
    gistToken,
    setGistToken,
    loadFromGist,
    saveToGist,
    exportAllDataAsJSON,
    importAllDataFromJSON,
    isSyncing,
    lastSyncTime,
    updateFeedbackStatus,
    deleteFeedback,
    updateContactMessageStatus,
    deleteContactMessage,
    deleteSkillTestResult,
    syncError,
    resetAllSettingsData,
  } = useSettings();

  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isLiveRefreshing, setIsLiveRefreshing] = useState(false);
  const [liveRefreshNotice, setLiveRefreshNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'general' | 'music' | 'feedbacks' | 'messages' | 'videos' | 'paid' | 'orders' | 'ads' | 'sync' | 'skillResults'
  >('general');
  const [saveMessage, setSaveMessage] = useState('');
  const [syncMessage, setSyncMessage] = useState({ text: '', type: '' });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showGistToken, setShowGistToken] = useState(false);
  const [tokenSaveNotice, setTokenSaveNotice] = useState<string | null>(null);
  const [gameSearch, setGameSearch] = useState('');
  const [gameCategoryFilter, setGameCategoryFilter] = useState('الكل');
  const [paidGameSearch, setPaidGameSearch] = useState('');
  const [paidGameCategoryFilter, setPaidGameCategoryFilter] = useState('الكل');

  // Filters for Feedback & Messages
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'قيد الاطلاع' | 'تمت المراجعة' | 'مكتمل'>('all');
  const [messageFilter, setMessageFilter] = useState<'all' | 'جديدة' | 'قيد الاطلاع' | 'تم الرد'>('all');

  const importFileRef = useRef<HTMLInputElement>(null);
  const musicFileRef = useRef<HTMLInputElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  // Keep localSettings in sync if settings update remotely
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Fast auto-sync when admin is unlocked and on tab switch
  useEffect(() => {
    if (isAdminUnlocked) {
      loadFromGist(true).catch(() => {});
      const pollTimer = setInterval(() => {
        if (document.visibilityState === 'visible') {
          loadFromGist(true).catch(() => {});
        }
      }, 4000);
      return () => clearInterval(pollTimer);
    }
  }, [isAdminUnlocked, activeTab, loadFromGist]);

  const handleLiveRefresh = async () => {
    setIsLiveRefreshing(true);
    setLiveRefreshNotice('⏳ جاري جلب أحدث الطلبات والرسائل والتقييمات...');
    try {
      const res = await loadFromGist(false);
      if (res) {
        setLiveRefreshNotice('✓ تم تحديث واستلام أحدث البيانات بنجاح!');
      } else {
        setLiveRefreshNotice('✓ تم فحص وتحديث القوائم!');
      }
    } catch {
      setLiveRefreshNotice('⚠️ تم تحديث القوائم محلياً');
    } finally {
      setIsLiveRefreshing(false);
      setTimeout(() => setLiveRefreshNotice(null), 3500);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    GAMES.forEach((g) => cats.add(g.category));
    return ['الكل', ...Array.from(cats)];
  }, []);

  // Filtered games for video selector
  const filteredGames = useMemo(() => {
    return GAMES.filter((game) => {
      const matchSearch =
        !gameSearch ||
        game.name.toLowerCase().includes(gameSearch.toLowerCase()) ||
        game.category.toLowerCase().includes(gameSearch.toLowerCase());
      const matchCat = gameCategoryFilter === 'الكل' || game.category === gameCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [gameSearch, gameCategoryFilter]);

  // Feedbacks count calculations
  const totalFeedbacks = localSettings.feedbacks?.length || 0;
  const pendingFeedbacks = localSettings.feedbacks?.filter((f) => f.status === 'قيد الاطلاع').length || 0;

  // Contact messages count calculations
  const totalMessages = localSettings.contactMessages?.length || 0;
  const newMessages = localSettings.contactMessages?.filter((m) => m.status === 'جديدة').length || 0;

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    const list = localSettings.feedbacks || [];
    if (feedbackFilter === 'all') return list;
    return list.filter((f) => f.status === feedbackFilter);
  }, [localSettings.feedbacks, feedbackFilter]);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    const list = localSettings.contactMessages || [];
    if (messageFilter === 'all') return list;
    return list.filter((m) => m.status === messageFilter);
  }, [localSettings.contactMessages, messageFilter]);

  // Filtered games for VIP Paid selector
  const filteredPaidGames = useMemo(() => {
    return GAMES.filter((game) => {
      const matchSearch =
        !paidGameSearch ||
        game.name.toLowerCase().includes(paidGameSearch.toLowerCase()) ||
        game.category.toLowerCase().includes(paidGameSearch.toLowerCase());
      const matchCat = paidGameCategoryFilter === 'الكل' || game.category === paidGameCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [paidGameSearch, paidGameCategoryFilter]);

  const pendingOrdersCount =
    localSettings.purchaseOrders?.filter((o) => o.status === 'معلق').length || 0;


  // Handle password entry
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(passwordInput)) {
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl shadow-xl border-4 border-amber-300 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center text-white shadow-lg">
          <LockClosedIcon />
        </div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">منطقة الإدارة محمية</h1>
        <p className="text-gray-500 text-sm mb-6">أدخل كلمة المرور الخاصة بالإدارة للمتابعة (1993)</p>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
              setPasswordError(false);
            }}
            placeholder="أدخل كلمة السر"
            className={`w-full text-center text-2xl tracking-widest font-mono py-3 px-4 rounded-xl border-2 outline-none ${
              passwordError ? 'border-red-500 bg-red-50' : 'border-sky-300 focus:border-sky-500'
            }`}
          />
          {passwordError && <p className="text-red-600 text-sm font-bold">كلمة المرور غير صحيحة! (1993)</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            فتح لوحة الإعدادات
          </button>
        </form>
      </div>
    );
  }

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      if (name in localSettings.adSettings) {
        setLocalSettings((prev) => ({ ...prev, adSettings: { ...prev.adSettings, [name]: checked } }));
      } else {
        setLocalSettings((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (name === 'videoWaitTime') {
      setLocalSettings((prev) => ({ ...prev, videoWaitTime: Number(value) || 0 }));
    } else {
      setLocalSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGoogleAdChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setLocalSettings((prev) => ({
        ...prev,
        googleAdSettings: {
          ...prev.googleAdSettings,
          [name]: checked,
        },
      }));
    } else {
      setLocalSettings((prev) => ({
        ...prev,
        googleAdSettings: {
          ...prev.googleAdSettings,
          [name]: value,
        },
      }));
    }
  };

  const handleAdChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({ ...prev, adSettings: { ...prev.adSettings, [name]: value } }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Settings | keyof Settings['adSettings']) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (fieldName in localSettings.adSettings) {
          setLocalSettings((prev) => ({ ...prev, adSettings: { ...prev.adSettings, [fieldName]: result } }));
        } else {
          setLocalSettings((prev) => ({ ...prev, [fieldName as keyof Settings]: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Music File Upload Handler
  const handleMusicFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        alert('الرجاء اختيار ملف صوتي صالح (MP3, WAV, OGG, M4A).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const audioDataUrl = event.target?.result as string;
        setLocalSettings((prev) => ({
          ...prev,
          backgroundMusicUrl: audioDataUrl,
          backgroundMusicEnabled: true,
        }));
        if (audioPreviewRef.current) {
          audioPreviewRef.current.src = audioDataUrl;
          audioPreviewRef.current.play().then(() => setIsPreviewPlaying(true)).catch(() => {});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreviewAudio = () => {
    if (audioPreviewRef.current) {
      if (isPreviewPlaying) {
        audioPreviewRef.current.pause();
        setIsPreviewPlaying(false);
      } else {
        audioPreviewRef.current.play().then(() => setIsPreviewPlaying(true)).catch(() => {});
      }
    }
  };

  // Video requirements toggling
  const toggleGameVideoRequirement = (gameId: number) => {
    setLocalSettings((prev) => {
      const current = prev.videoRequiredGameIds || [];
      const updated = current.includes(gameId) ? current.filter((id) => id !== gameId) : [...current, gameId];
      return { ...prev, videoRequiredGameIds: updated };
    });
  };

  const selectAllVideoGames = () => {
    const allIds = GAMES.map((g) => g.id);
    setLocalSettings((prev) => ({ ...prev, videoRequiredGameIds: allIds }));
  };

  const clearAllVideoGames = () => {
    setLocalSettings((prev) => ({ ...prev, videoRequiredGameIds: [] }));
  };

  const selectCategoryVideoGames = (cat: string) => {
    const catIds = GAMES.filter((g) => g.category === cat).map((g) => g.id);
    setLocalSettings((prev) => {
      const current = new Set(prev.videoRequiredGameIds || []);
      catIds.forEach((id) => current.add(id));
      return { ...prev, videoRequiredGameIds: Array.from(current) };
    });
  };

  // Paid VIP games toggling & per-game configuration (Timer vs Question limit)
  const toggleGamePaidRequirement = (gameId: number) => {
    setLocalSettings((prev) => {
      const current = prev.paidSettings?.paidGameIds || [];
      const isCurrentlyPaid = current.includes(gameId);
      const updated = isCurrentlyPaid
        ? current.filter((id) => id !== gameId)
        : [...current, gameId];

      const existingConfigs = prev.paidSettings?.gameVipConfigs || {};
      const newConfigs = { ...existingConfigs };
      if (!isCurrentlyPaid && !newConfigs[gameId]) {
        newConfigs[gameId] = {
          restrictionType: 'question_limit',
          timerSeconds: 20,
          questionLimit: 10,
        };
      }
      return {
        ...prev,
        paidSettings: {
          ...prev.paidSettings!,
          paidGameIds: updated,
          gameVipConfigs: newConfigs,
        },
      };
    });
  };

  const updateGameVipConfig = (gameId: number, update: Partial<GameVipConfig>) => {
    setLocalSettings((prev) => {
      const existingConfigs = prev.paidSettings?.gameVipConfigs || {};
      const current = existingConfigs[gameId] || {
        restrictionType: 'question_limit',
        timerSeconds: 20,
        questionLimit: 10,
      };
      const updatedConfig: GameVipConfig = { ...current, ...update };
      const newConfigs = {
        ...existingConfigs,
        [gameId]: updatedConfig,
      };
      // If it's a child skills game, mirror IDs
      if (gameId <= 40) {
        newConfigs[8000 + gameId] = updatedConfig;
      } else if (gameId > 8000 && gameId <= 8040) {
        newConfigs[gameId - 8000] = updatedConfig;
      }
      return {
        ...prev,
        paidSettings: {
          ...prev.paidSettings!,
          gameVipConfigs: newConfigs,
        },
      };
    });
  };

  const selectAllPaidGames = () => {
    const allIds = GAMES.map((g) => g.id);
    setLocalSettings((prev) => {
      const existingConfigs = prev.paidSettings?.gameVipConfigs || {};
      const newConfigs = { ...existingConfigs };
      allIds.forEach((id) => {
        if (!newConfigs[id]) {
          newConfigs[id] = {
            restrictionType: 'question_limit',
            timerSeconds: 20,
            questionLimit: 10,
          };
        }
      });
      return {
        ...prev,
        paidSettings: {
          ...prev.paidSettings!,
          paidGameIds: allIds,
          gameVipConfigs: newConfigs,
        },
      };
    });
  };

  const clearAllPaidGames = () => {
    setLocalSettings((prev) => ({
      ...prev,
      paidSettings: {
        ...prev.paidSettings!,
        paidGameIds: [],
      },
    }));
  };

  const setAllVipMode = (mode: 'timer' | 'question_limit') => {
    setLocalSettings((prev) => {
      const paid = prev.paidSettings;
      if (!paid) return prev;
      const existingConfigs = paid.gameVipConfigs || {};
      const newConfigs = { ...existingConfigs };
      (paid.paidGameIds || []).forEach((id) => {
        const cur = newConfigs[id] || { restrictionType: 'timer', timerSeconds: 20, questionLimit: 10 };
        newConfigs[id] = { ...cur, restrictionType: mode };
      });
      return {
        ...prev,
        paidSettings: {
          ...paid,
          gameVipConfigs: newConfigs,
        },
      };
    });
  };

  const selectCategoryPaidGames = (cat: string) => {
    const catIds = GAMES.filter((g) => g.category === cat).map((g) => g.id);
    setLocalSettings((prev) => {
      const current = new Set(prev.paidSettings?.paidGameIds || []);
      catIds.forEach((id) => current.add(id));
      return {
        ...prev,
        paidSettings: {
          ...prev.paidSettings!,
          paidGameIds: Array.from(current),
        },
      };
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(localSettings);
    setSaveMessage('⏳ جاري حفظ وتطبيق الإعدادات ومزامنتها مع السحابة (Gist)...');

    const synced = await saveToGist(localSettings);
    if (synced) {
      setSaveMessage('✓ تم حفظ الإعدادات ونشرها على السحابة (Gist) بنجاح ليراها جميع الزوار!');
    } else {
      setSaveMessage(syncError ? `✓ تم الحفظ محلياً. تنبيه السحابة: ${syncError}` : '✓ تم الحفظ محلياً بنجاح (تحقق من بيانات Gist للنشر السحابي العام)');
    }
    setTimeout(() => setSaveMessage(''), 6000);
  };

  const handleLoadFromGist = async () => {
    setSyncMessage({ text: '...جاري التحميل المباشر من Gist', type: 'info' });
    const success = await loadFromGist();
    if (success) {
      setSyncMessage({ text: 'تم تحميل أحدث الإعدادات السحابية بنجاح!', type: 'success' });
      const savedSettings = localStorage.getItem('toysGameSettings');
      if (savedSettings) setLocalSettings(JSON.parse(savedSettings));
    } else {
      setSyncMessage({ text: 'فشل التحميل. تحقق من الرابط وصلاحيات الوصول.', type: 'error' });
    }
    setTimeout(() => setSyncMessage({ text: '', type: '' }), 4000);
  };

  const handleSaveToGist = async () => {
    setSyncMessage({ text: '...جاري الحفظ والمزامنة مع Gist', type: 'info' });
    const success = await saveToGist(localSettings);
    if (success) {
      setSyncMessage({ text: 'تم حفظ الإعدادات ونشرها على Gist بنجاح ليراها الزوار!', type: 'success' });
    } else {
      setSyncMessage({ text: syncError || 'فشل الحفظ في Gist. يرجى التحقق من التوكن أو حجم الملف.', type: 'error' });
    }
    setTimeout(() => setSyncMessage({ text: '', type: '' }), 6000);
  };

  const exportSettings = () => {
    exportAllDataAsJSON();
    setSaveMessage('✓ تم تصدير وتحميل ملف النسخة الاحتياطية الكاملة (JSON) بنجاح!');
    setTimeout(() => setSaveMessage(''), 4000);
  };

  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          if (content) {
            const res = await importAllDataFromJSON(content);
            if (res.success) {
              setSaveMessage(`✓ ${res.message} (تم استيراد ودمج ${res.summary?.orders ?? 0} طلب و ${res.summary?.codes ?? 0} كود)`);
            } else {
              setSaveMessage(`⚠️ تنبيه الاستيراد: ${res.message}`);
            }
            setTimeout(() => setSaveMessage(''), 6000);
          }
        } catch (err: any) {
          setSaveMessage(`⚠️ خطأ في قراءة ملف JSON: ${err?.message || 'تنسيق غير مدعوم'}`);
          setTimeout(() => setSaveMessage(''), 5000);
        }
      };
      reader.readAsText(file);
      if (e.target) e.target.value = '';
    }
  };

  const handleClearSettingsData = () => {
    const fresh = resetAllSettingsData();
    setLocalSettings(fresh);
    setShowClearConfirm(false);
    setSaveMessage('✓ تم مسح بيانات الإعدادات وإعادتها إلى الوضع الافتراضي النظيف بنجاح!');
    setTimeout(() => setSaveMessage(''), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-700 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full">
              لوحة الإدارة 1993
            </span>
            {lastSyncTime && (
              <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                آخر مزامنة: {lastSyncTime}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black">⚙️ لوحة تحكم وإدارة التطبيق</h1>
          <p className="text-sky-100 text-xs sm:text-sm mt-0.5">
            إدارة الموسيقى، الآراء، الرسائل، الألعاب والإعدادات السحابية
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={lockAdmin}
            className="bg-white/10 hover:bg-white/25 text-white font-bold py-2 px-4 rounded-xl text-xs sm:text-sm transition-colors border border-white/30 cursor-pointer"
          >
            🔒 قفل المشرف
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl shadow-md border border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'general'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>🎨</span>
          <span>الهوية والبيانات</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('music')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'music'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>🎵</span>
          <span>رفع الموسيقى والصوتيات</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedbacks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'feedbacks'
              ? 'bg-amber-500 text-amber-950 shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>🌟</span>
          <span>مركز الآراء والتقييمات</span>
          {pendingFeedbacks > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {pendingFeedbacks}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>📬</span>
          <span>رسائل اتصل بنا</span>
          {newMessages > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {newMessages}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>⏳</span>
          <span>الاشتراك والفيديوهات</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('paid')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'paid'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 shadow-md font-black ring-2 ring-amber-400'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>👑</span>
          <span>النسخة المدفوعة والدفع (VIP)</span>
          {localSettings.paidSettings?.enabled && (
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              مفعّل
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>📦</span>
          <span>طلبات الشراء والأكواد</span>
          {pendingOrdersCount > 0 && (
            <span className="bg-amber-400 text-amber-950 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
              {pendingOrdersCount} معلق
            </span>
          )}
        </button>


        <button
          type="button"
          onClick={() => setActiveTab('ads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'ads'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>📢</span>
          <span>الإعلانات والهدية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sync')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'sync'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>🌐</span>
          <span>مزامنة Gist والنسخ الاحتياطي</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skillResults')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'skillResults'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>🏆</span>
          <span>نتائج تحدي المهارات ({localSettings.skillTestResults?.length || 0})</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: GENERAL & BRANDING */}
        {activeTab === 'general' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-gray-200 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <span className="text-3xl">🎨</span>
              <div>
                <h2 className="text-xl font-black text-gray-800">بيانات وهوية الموقع الأساسية</h2>
                <p className="text-xs text-gray-500">اسم التطبيق والشعار والبريد الإلكتروني</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-black text-gray-700 mb-1">
                  اسم التطبيق / الموقع
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={localSettings.siteName}
                  onChange={handleLocalChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 font-bold text-gray-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-1">شعار التطبيق (الأيقونة)</label>
                <div className="flex items-center gap-3">
                  <img
                    src={localSettings.logoUrl}
                    alt="Logo Preview"
                    className="h-12 w-12 object-contain border p-1 rounded-xl bg-gray-50 shadow-sm"
                  />
                  <input
                    type="file"
                    id="logoUrl"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'logoUrl')}
                    className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-black text-gray-700 mb-1">
                  البريد الإلكتروني للتواصل
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={localSettings.contactEmail}
                  onChange={handleLocalChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 font-bold text-gray-800 text-sm"
                />
              </div>

              <div>
                <label htmlFor="feedbackEmail" className="block text-sm font-black text-gray-700 mb-1">
                  البريد الإلكتروني للآراء والمقترحات
                </label>
                <input
                  type="email"
                  id="feedbackEmail"
                  name="feedbackEmail"
                  value={localSettings.feedbackEmail}
                  onChange={handleLocalChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 font-bold text-gray-800 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BACKGROUND MUSIC UPLOAD & CONTROLS */}
        {activeTab === 'music' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-4 border-purple-200 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <span className="text-3xl">🎵</span>
              <div>
                <h2 className="text-xl font-black text-purple-950">رفع ملف الموسيقى والموسيقى الخلفية</h2>
                <p className="text-xs text-gray-500">
                  رفع ملف صوتي يظهر ويعمل عند فتح التطبيق مع خيارات التحكم
                </p>
              </div>
            </div>

            {/* Enable switch */}
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-200">
              <div>
                <label htmlFor="backgroundMusicEnabled" className="block text-base font-black text-purple-950 cursor-pointer">
                  تفعيل الموسيقى الخلفية عند فتح الموقع
                </label>
                <p className="text-xs text-purple-700 font-bold">
                  تشغيل نغمة لطيفة للأطفال عند الدخول إلى التطبيق
                </p>
              </div>
              <input
                type="checkbox"
                id="backgroundMusicEnabled"
                name="backgroundMusicEnabled"
                checked={localSettings.backgroundMusicEnabled !== false}
                onChange={(e) =>
                  setLocalSettings((prev) => ({ ...prev, backgroundMusicEnabled: e.target.checked }))
                }
                className="h-6 w-6 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>

            {/* File Upload Box */}
            <div className="bg-gradient-to-b from-purple-50/50 to-white p-6 rounded-2xl border-2 border-dashed border-purple-300 text-center space-y-4">
              <span className="text-5xl block">🎼</span>
              <h3 className="text-lg font-black text-purple-900">اختر أو ارفع ملف موسيقى من جهازك</h3>
              <p className="text-xs text-gray-500">
                يدعم صيغ الصوت الشائعة: MP3, WAV, OGG, M4A
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => musicFileRef.current?.click()}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-black py-2.5 px-6 rounded-xl shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-2 text-sm"
                >
                  <span>📁</span>
                  <span>رفع ملف صوتي من الجهاز</span>
                </button>
                <input
                  type="file"
                  ref={musicFileRef}
                  accept="audio/*"
                  onChange={handleMusicFileUpload}
                  className="hidden"
                />

                {localSettings.backgroundMusicUrl && (
                  <button
                    type="button"
                    onClick={togglePreviewAudio}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-black py-2.5 px-6 rounded-xl shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-2 text-sm"
                  >
                    <span>{isPreviewPlaying ? '⏸️ إيقاف المعاينة' : '▶️ تجربة وتشغيل الموسيقى'}</span>
                  </button>
                )}
              </div>

              {/* Hidden audio element for preview */}
              <audio
                ref={audioPreviewRef}
                src={localSettings.backgroundMusicUrl}
                onEnded={() => setIsPreviewPlaying(false)}
              />
            </div>

            {/* Direct Music URL input */}
            <div>
              <label htmlFor="backgroundMusicUrl" className="block text-sm font-black text-gray-700 mb-1">
                رابط الموسيقى المباشر (URL):
              </label>
              <input
                type="text"
                id="backgroundMusicUrl"
                name="backgroundMusicUrl"
                value={localSettings.backgroundMusicUrl}
                onChange={handleLocalChange}
                placeholder="https://grubby-plum-uukfa7rf.edgeone.dev/ أو رابط صوت خارجي"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 font-mono text-xs text-gray-800"
              />
            </div>

            {/* Presets */}
            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200">
              <span className="block text-xs font-black text-purple-900 mb-2">النغمات السريعة والمقترحة:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      backgroundMusicUrl: 'https://grubby-plum-uukfa7rf.edgeone.dev/',
                      backgroundMusicEnabled: true,
                    }))
                  }
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black py-2 px-3.5 rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <span>⭐</span>
                  <span>نغمة الموقع الافتراضية (سيرفر EdgeOne فائق السرعة)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      backgroundMusicUrl: '/audio/default-music.mp3',
                      backgroundMusicEnabled: true,
                    }))
                  }
                  className="bg-white hover:bg-purple-50 text-purple-800 text-xs font-bold py-1.5 px-3 rounded-xl border border-purple-200 cursor-pointer shadow-sm"
                >
                  🎵 النسخة المحلية المخزنة
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      backgroundMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                      backgroundMusicEnabled: true,
                    }))
                  }
                  className="bg-white hover:bg-purple-50 text-purple-700 text-xs font-bold py-1.5 px-3 rounded-xl border border-purple-200 cursor-pointer shadow-sm"
                >
                  🎶 نغمة أطفال كلاسيكية 1
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      backgroundMusicUrl: '',
                      backgroundMusicEnabled: false,
                    }))
                  }
                  className="bg-white hover:bg-red-50 text-red-600 text-xs font-bold py-1.5 px-3 rounded-xl border border-red-200 cursor-pointer shadow-sm"
                >
                  🔇 إيقاف وكتم الموسيقى
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USER FEEDBACKS INBOX (مركز آراء ومقترحات الزوار) */}
        {activeTab === 'feedbacks' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-4 border-amber-200 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌟</span>
                <div>
                  <h2 className="text-xl font-black text-amber-950">مركز آراء وتقييمات المستخدمين</h2>
                  <p className="text-xs text-gray-500">
                    متابعة وتحديث حالة المشاركات الواردة من صفحة "شاركنا رأيك" (يتم التحديث المباشر تلقائياً)
                  </p>
                </div>
              </div>

              {/* Refresh Button & Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleLiveRefresh}
                  disabled={isLiveRefreshing}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow transition-all cursor-pointer disabled:opacity-50"
                  title="سحب فوري لأحدث الآراء من السيرفر والسحابة"
                >
                  <span className={isLiveRefreshing ? 'animate-spin' : ''}>🔄</span>
                  <span>{isLiveRefreshing ? 'جاري التحديث...' : 'تحديث فوري الآن'}</span>
                </button>

                <div className="flex flex-wrap gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200">
                  <button
                    type="button"
                    onClick={() => setFeedbackFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                      feedbackFilter === 'all' ? 'bg-amber-500 text-white shadow' : 'text-amber-950 hover:bg-amber-100'
                    }`}
                  >
                    الكل ({totalFeedbacks})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackFilter('قيد الاطلاع')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                      feedbackFilter === 'قيد الاطلاع'
                        ? 'bg-amber-500 text-white shadow'
                        : 'text-amber-950 hover:bg-amber-100'
                    }`}
                  >
                    قيد الاطلاع ({pendingFeedbacks})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackFilter('تمت المراجعة')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                      feedbackFilter === 'تمت المراجعة'
                        ? 'bg-blue-500 text-white shadow'
                        : 'text-blue-950 hover:bg-blue-100'
                    }`}
                  >
                    تمت المراجعة
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackFilter('مكتمل')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                      feedbackFilter === 'مكتمل'
                        ? 'bg-emerald-500 text-white shadow'
                        : 'text-emerald-950 hover:bg-emerald-100'
                    }`}
                  >
                    مكتمل
                  </button>
                </div>
              </div>
            </div>

            {liveRefreshNotice && (
              <div className="bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold px-4 py-2 rounded-xl text-center animate-fade-in">
                {liveRefreshNotice}
              </div>
            )}

            {/* Feedbacks List */}
            {filteredFeedbacks.length === 0 ? (
              <div className="text-center p-12 bg-amber-50/50 rounded-2xl border border-amber-200">
                <span className="text-5xl block mb-2">📭</span>
                <p className="text-gray-600 font-bold">لا توجد آراء أو تقييمات في هذا التصنيف حالياً.</p>
                <p className="text-xs text-gray-400 mt-1">
                  عند قيام الزوار بإرسال آرائهم من صفحة "شاركنا رأيك"، ستظهر هنا مباشرة!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                {filteredFeedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-5 rounded-2xl border-2 transition-all bg-white hover:shadow-md border-amber-100 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-800 text-sm">{fb.name}</span>
                        {fb.email && (
                          <a
                            href={`mailto:${fb.email}`}
                            className="text-xs text-sky-600 hover:underline font-mono"
                          >
                            ({fb.email})
                          </a>
                        )}
                        <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                          {fb.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-amber-400 text-sm">
                          {'★'.repeat(fb.rating || 5)}
                          {'☆'.repeat(5 - (fb.rating || 5))}
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono">{fb.createdAt}</span>
                      </div>
                    </div>

                    <p className="text-gray-800 text-sm font-semibold whitespace-pre-wrap leading-relaxed">
                      {fb.message}
                    </p>

                    {(fb.clientIp || fb.deviceInfo) && (
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 font-mono">
                        {fb.clientIp && (
                          <span className="flex items-center gap-1">
                            <span>🌐 IP المُرسل:</span>
                            <strong className="text-amber-900">{fb.clientIp}</strong>
                          </span>
                        )}
                        {fb.deviceInfo && (
                          <span className="flex items-center gap-1 truncate max-w-xs text-gray-600 font-sans">
                            <span>💻 الجهاز:</span>
                            <span>{fb.deviceInfo}</span>
                          </span>
                        )}
                        <span className="mr-auto text-emerald-700 font-bold font-sans">✓ مزامن سحابياً</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-600">الحالة الحالية:</span>
                        <div className="flex gap-1.5">
                          {(['قيد الاطلاع', 'تمت المراجعة', 'مكتمل'] as const).map((st) => (
                            <button
                              type="button"
                              key={st}
                              onClick={() => updateFeedbackStatus(fb.id, st)}
                              className={`text-xs font-black px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                fb.status === st
                                  ? st === 'قيد الاطلاع'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : st === 'تمت المراجعة'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-white text-gray-600 border hover:bg-gray-100'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذه المشاركة؟')) {
                            deleteFeedback(fb.id);
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-800 font-bold hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 cursor-pointer"
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONTACT MESSAGES INBOX (صندوق رسائل اتصل بنا) */}
        {activeTab === 'messages' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-4 border-emerald-200 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📬</span>
                <div>
                  <h2 className="text-xl font-black text-emerald-950">صندوق رسائل اتصل بنا</h2>
                  <p className="text-xs text-gray-500">
                    متابعة الرسائل والاستفسارات الواردة من صفحة "اتصل بنا" (يتم التحديث المباشر تلقائياً)
                  </p>
                </div>
              </div>

              {/* Refresh Button & Message Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleLiveRefresh}
                  disabled={isLiveRefreshing}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow transition-all cursor-pointer disabled:opacity-50"
                  title="سحب فوري لأحدث رسائل اتصل بنا من السيرفر والسحابة"
                >
                  <span className={isLiveRefreshing ? 'animate-spin' : ''}>🔄</span>
                  <span>{isLiveRefreshing ? 'جاري التحديث...' : 'تحديث فوري الآن'}</span>
                </button>

                <div className="flex flex-wrap gap-1 bg-emerald-50 p-1 rounded-xl border border-emerald-200">
                  <button
                    type="button"
                    onClick={() => setMessageFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                      messageFilter === 'all'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-emerald-950 hover:bg-emerald-100'
                    }`}
                  >
                    الكل ({totalMessages})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageFilter('جديدة')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                      messageFilter === 'جديدة'
                        ? 'bg-red-500 text-white shadow'
                        : 'text-emerald-950 hover:bg-emerald-100'
                    }`}
                  >
                    جديدة ({newMessages})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageFilter('قيد الاطلاع')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                      messageFilter === 'قيد الاطلاع'
                        ? 'bg-amber-500 text-white shadow'
                        : 'text-amber-950 hover:bg-amber-100'
                    }`}
                  >
                    قيد الاطلاع
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageFilter('تم الرد')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                      messageFilter === 'تم الرد'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-blue-950 hover:bg-blue-100'
                    }`}
                  >
                    تم الرد
                  </button>
                </div>
              </div>
            </div>

            {liveRefreshNotice && (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold px-4 py-2 rounded-xl text-center animate-fade-in">
                {liveRefreshNotice}
              </div>
            )}

            {/* Messages List */}
            {filteredMessages.length === 0 ? (
              <div className="text-center p-12 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                <span className="text-5xl block mb-2">📭</span>
                <p className="text-gray-600 font-bold">لا توجد رسائل في هذا التصنيف حالياً.</p>
                <p className="text-xs text-gray-400 mt-1">
                  الرسائل المرسلة من صفحة "اتصل بنا" تصل إلى هذا الصندوق فوراً.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 rounded-2xl border-2 transition-all bg-white hover:shadow-md border-emerald-100 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-gray-800 text-sm">{msg.name}</span>
                          <span className="text-xs text-sky-700 font-mono font-bold">({msg.email})</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-600">الموضوع: {msg.subject}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400 font-mono">{msg.createdAt}</span>
                      </div>
                    </div>

                    <p className="text-gray-800 text-sm font-semibold whitespace-pre-wrap leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                      {msg.message}
                    </p>

                    {(msg.clientIp || msg.deviceInfo) && (
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60 font-mono">
                        {msg.clientIp && (
                          <span className="flex items-center gap-1">
                            <span>🌐 IP المُرسل:</span>
                            <strong className="text-emerald-900">{msg.clientIp}</strong>
                          </span>
                        )}
                        {msg.deviceInfo && (
                          <span className="flex items-center gap-1 truncate max-w-xs text-gray-600 font-sans">
                            <span>💻 الجهاز:</span>
                            <span>{msg.deviceInfo}</span>
                          </span>
                        )}
                        <span className="mr-auto text-emerald-700 font-bold font-sans">✓ مزامن سحابياً</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-600">تغيير الحالة:</span>
                        <div className="flex gap-1.5">
                          {(['جديدة', 'قيد الاطلاع', 'تم الرد'] as const).map((st) => (
                            <button
                              type="button"
                              key={st}
                              onClick={() => updateContactMessageStatus(msg.id, st)}
                              className={`text-xs font-black px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                msg.status === st
                                  ? st === 'جديدة'
                                    ? 'bg-red-500 text-white shadow-sm'
                                    : st === 'قيد الاطلاع'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white text-gray-600 border hover:bg-gray-100'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent(
                            `رد على: ${msg.subject}`
                          )}`}
                          className="text-xs bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1"
                        >
                          <span>📧</span>
                          <span>رد عبر الإيميل</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
                              deleteContactMessage(msg.id);
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-800 font-bold hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 cursor-pointer"
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: VIDEO COUNTDOWN & YOUTUBE CHANNELS */}
        {activeTab === 'videos' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-gray-200 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <span className="text-3xl">⏳</span>
              <div>
                <h2 className="text-xl font-black text-gray-800">إعدادات الاشتراك بالقناة والفيديوهات الترويجية</h2>
                <p className="text-xs text-gray-500">
                  التحكم في تفعيل أو تعطيل شرط الاشتراك ومشاهدة الفيديو، وتحديد الألعاب المطلوبة
                </p>
              </div>
            </div>

            {/* MASTER TOGGLE: ENABLE / DISABLE SUBSCRIPTION & VIDEO REQUIREMENTS */}
            <div
              className={`p-5 sm:p-6 rounded-3xl border-2 transition-all shadow-sm ${
                localSettings.requireSubscriptionAndVideos !== false
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300'
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${
                      localSettings.requireSubscriptionAndVideos !== false
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {localSettings.requireSubscriptionAndVideos !== false ? '🔒' : '🔓'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black text-gray-900">
                        طلب الاشتراك بالقناة ومشاهدة الفيديوهات للعب
                      </h3>
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          localSettings.requireSubscriptionAndVideos !== false
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-amber-200 text-amber-900'
                        }`}
                      >
                        {localSettings.requireSubscriptionAndVideos !== false ? 'مفعّل (يتطلب اشتراك/مشاهدة)' : 'معطّل (لعب فوري بدون قيود)'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {localSettings.requireSubscriptionAndVideos !== false
                        ? 'عند التفعيل: تظهر للزائر نافذة تطلب الاشتراك بالقناة أو مشاهدة فيديو للألعاب المحددة أدناه.'
                        : 'عند عدم التفعيل: تفتح جميع الألعاب فوراً للزوار بدون طلب اشتراك بالقناة ولا مشاهدة أي فيديو!'}
                    </p>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0 self-end sm:self-center">
                  <input
                    type="checkbox"
                    id="requireSubscriptionAndVideos"
                    name="requireSubscriptionAndVideos"
                    checked={localSettings.requireSubscriptionAndVideos !== false}
                    onChange={(e) => {
                      setLocalSettings((prev) => ({
                        ...prev,
                        requireSubscriptionAndVideos: e.target.checked,
                      }));
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                </label>
              </div>

              {localSettings.requireSubscriptionAndVideos === false && (
                <div className="mt-4 pt-3 border-t border-amber-200 flex items-center gap-2 text-xs sm:text-sm text-amber-900 font-bold">
                  <span>🎉</span>
                  <span>
                    الوضع المباشر المجاني نشط الآن: يمكن لجميع الزوار والأطفال تشغيل أي لعبة فوراً دون توقف أو طلب اشتراك.
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Wait Time */}
              <div className="bg-sky-50 p-5 rounded-2xl border border-sky-200">
                <label htmlFor="videoWaitTime" className="block text-base font-black text-gray-800 mb-1">
                  ⏱️ مهلة انتظار الفيديو (بالثواني)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  المدة التي ينتظرها الطفل عند فتح الفيديو قبل أن يتاح له الدخول للعبة
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    id="videoWaitTime"
                    name="videoWaitTime"
                    min={0}
                    max={120}
                    value={localSettings.videoWaitTime}
                    onChange={handleLocalChange}
                    className="w-32 px-4 py-2 text-xl font-black text-center border-2 border-sky-300 rounded-xl bg-white"
                  />
                  <span className="font-bold text-gray-600 text-sm">ثانية (0 = دخول فوري)</span>
                </div>
              </div>

              {/* Main Subscription URL */}
              <div>
                <label htmlFor="subscriptionUrl" className="block text-sm font-black text-gray-700 mb-1">
                  رابط القناة الرئيسية للاشتراك
                </label>
                <input
                  type="url"
                  id="subscriptionUrl"
                  name="subscriptionUrl"
                  value={localSettings.subscriptionUrl}
                  onChange={handleLocalChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 font-mono text-xs"
                />
              </div>

              {/* WhatsApp Orders URL */}
              <div>
                <label htmlFor="whatsappUrl" className="block text-sm font-black text-gray-700 mb-1">
                  رابط أو رقم واتساب لاستقبال طلبات الشراء
                </label>
                <input
                  type="text"
                  id="whatsappUrl"
                  name="whatsappUrl"
                  value={localSettings.whatsappUrl || ''}
                  onChange={handleLocalChange}
                  placeholder="https://wa.me/9639xxxxxxxx أو رقم الهاتف"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 font-mono text-xs"
                />
              </div>

              {/* Multi YouTube URLs */}
              <div className="md:col-span-2">
                <label htmlFor="youtubeUrls" className="block text-sm font-black text-gray-700 mb-1">
                  روابط قنوات يوتيوب المدعومة (رابط في كل سطر)
                </label>
                <textarea
                  id="youtubeUrls"
                  name="youtubeUrls"
                  rows={3}
                  value={localSettings.youtubeUrls}
                  onChange={handleLocalChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 font-mono text-xs"
                  placeholder="https://www.youtube.com/@channel1&#10;https://www.youtube.com/@channel2"
                />
              </div>
            </div>

            {/* Game Selector for Video Requirements */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-black text-gray-800">
                    الألعاب التي تتطلب مشاهدة الفيديو ({localSettings.videoRequiredGameIds?.length || 0} لعبة محددة)
                  </h3>
                  <p className="text-xs text-gray-500">اختر الألعاب التي تطلب من الطفل مشاهدة الفيديو قبل اللعب</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllVideoGames}
                    className="text-xs bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                  >
                    تحديد الكل
                  </button>
                  <button
                    type="button"
                    onClick={clearAllVideoGames}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                  >
                    إلغاء التحديد
                  </button>
                </div>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="🔍 بحث عن لعبة بالاسم..."
                  value={gameSearch}
                  onChange={(e) => setGameSearch(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-xl text-xs"
                />
                <select
                  value={gameCategoryFilter}
                  onChange={(e) => setGameCategoryFilter(e.target.value)}
                  className="px-3 py-2 border rounded-xl text-xs bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      تصنيف: {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Games Grid */}
              <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-2xl p-3 bg-gray-50/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredGames.map((game) => {
                  const isChecked = localSettings.videoRequiredGameIds?.includes(game.id);
                  return (
                    <div
                      key={game.id}
                      onClick={() => toggleGameVideoRequirement(game.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all select-none ${
                        isChecked
                          ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-sky-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-xs text-gray-400 font-mono">#{game.id}</span>
                        <span className="text-xs truncate">{game.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-normal">
                          {game.category}
                        </span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                            isChecked ? 'bg-rose-600 border-rose-700 text-white' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isChecked && '✓'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ADS & GIFT POPUP */}
        {activeTab === 'ads' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-gray-200 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <span className="text-3xl">📢</span>
              <div>
                <h2 className="text-xl font-black text-gray-800">إعلانات Google والهدية المنبثقة</h2>
                <p className="text-xs text-gray-500">إعلانات Google AdMob / AdSense والهدية الداخلية</p>
              </div>
            </div>

            {/* Google Ads section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-sky-50/70 p-4 rounded-2xl border border-sky-200">
                <div>
                  <label htmlFor="googleAdsEnabled" className="block text-base font-bold text-gray-800 cursor-pointer">
                    تفعيل إعلانات Google
                  </label>
                  <p className="text-xs text-gray-500">إظهار البانرات الإعلانية في الموقع</p>
                </div>
                <input
                  type="checkbox"
                  id="googleAdsEnabled"
                  name="enabled"
                  checked={localSettings.googleAdSettings.enabled}
                  onChange={handleGoogleAdChange}
                  className="h-6 w-6 rounded border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
              </div>

              {localSettings.googleAdSettings.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label htmlFor="adClient" className="block text-xs font-bold text-gray-700 mb-1">
                      معرف الناشر (Ad Client)
                    </label>
                    <input
                      type="text"
                      id="adClient"
                      name="adClient"
                      value={localSettings.googleAdSettings.adClient}
                      onChange={handleGoogleAdChange}
                      placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                      className="w-full px-4 py-2 border rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="adSlot" className="block text-xs font-bold text-gray-700 mb-1">
                      معرف الوحدة الإعلانية (Ad Slot ID)
                    </label>
                    <input
                      type="text"
                      id="adSlot"
                      name="adSlot"
                      value={localSettings.googleAdSettings.adSlot}
                      onChange={handleGoogleAdChange}
                      placeholder="1234567890"
                      className="w-full px-4 py-2 border rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* In-app Gift Popup */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div>
                  <h3 className="text-base font-bold text-gray-800">إشعار الهدية / الإعلان الداخلي</h3>
                  <p className="text-xs text-gray-500">أيقونة متحركة في رأس الموقع تفتح نافذة للزوار</p>
                </div>
                <input
                  type="checkbox"
                  id="adEnabled"
                  name="enabled"
                  checked={localSettings.adSettings.enabled}
                  onChange={handleLocalChange}
                  className="h-6 w-6 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              {localSettings.adSettings.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">عنوان الهدية</label>
                    <input
                      type="text"
                      name="name"
                      value={localSettings.adSettings.name}
                      onChange={handleAdChange}
                      className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">رابط الهدية</label>
                    <input
                      type="url"
                      name="url"
                      value={localSettings.adSettings.url}
                      onChange={handleAdChange}
                      className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: GIST CLOUD SYNC & BACKUP */}
        {activeTab === 'sync' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Gist Sync */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-4 border-teal-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-black text-teal-950 flex items-center gap-2 text-lg">
                  <span>🌐</span>
                  <span>مزامنة سحابية عامة (GitHub Gist)</span>
                </h3>
                {gistToken && gistToken.trim().length > 5 ? (
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                    <span>🟢</span>
                    <span>متزامن مع الخادم</span>
                  </span>
                ) : (
                  <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                    <span>⚪</span>
                    <span>بانتظار إدخال الرمز</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                المزامنة السحابية تنشر التعديلات (الموسيقى، الألعاب، العداد، الإعلانات) وتستقبل طلبات التفعيل ورسائل الزوار فوراً من أي هاتف أو متصفح بدون إعادة إدخال الرمز في كل جهاز.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-black text-gray-700 mb-1">رابط Gist المستهدف:</label>
                  <input
                    type="url"
                    value={gistUrl}
                    onChange={(e) => setGistUrl(e.target.value)}
                    placeholder="رابط Gist Raw"
                    className="w-full px-3 py-2 border rounded-xl font-mono text-xs bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-black text-gray-700">رمز التحقق (GitHub Token):</label>
                    <button
                      type="button"
                      onClick={() => setShowGistToken(!showGistToken)}
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{showGistToken ? '🙈 إخفاء الرمز' : '👁️ إظهار الرمز'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showGistToken ? 'text' : 'password'}
                      value={gistToken}
                      onChange={(e) => setGistToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-3 py-2 border rounded-xl font-mono text-xs bg-gray-50 focus:bg-white pr-3"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 font-semibold">
                    ✓ الرمز يتم حفظه وتثبيته تلقائياً على الخادم ليتم مشاركته مع أي هاتف أو جهاز تفتحه مستقبلاً.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      setGistToken(gistToken);
                      setGistUrl(gistUrl);
                      setTokenSaveNotice('✓ تم حفظ وتثبيت رمز المزامنة بنجاح على الخادم وكافة الأجهزة!');
                      setTimeout(() => setTokenSaveNotice(null), 4000);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
                  >
                    <span>💾</span>
                    <span>حفظ وتثبيت الرمز على السيرفر وجميع الأجهزة</span>
                  </button>
                </div>

                {tokenSaveNotice && (
                  <p className="text-xs font-bold p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-center animate-fade-in">
                    {tokenSaveNotice}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleLoadFromGist}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow cursor-pointer transition-all active:scale-95"
                  >
                    <span>📥</span>
                    <span>سحب من Gist الآن</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveToGist}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow cursor-pointer transition-all active:scale-95"
                  >
                    <span>🚀</span>
                    <span>نشر فوري إلى Gist</span>
                  </button>
                </div>

                {syncMessage.text && (
                  <p
                    className={`text-xs font-bold p-2.5 rounded-xl ${
                      syncMessage.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {syncMessage.text}
                  </p>
                )}
              </div>
            </div>

            {/* Backup / Restore JSON */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-gray-200 space-y-4">
              <h3 className="font-black text-gray-800 flex items-center gap-2 text-lg pb-2 border-b">
                <span>📦</span>
                <span>النسخ الاحتياطي ونقل البيانات الشامل (JSON)</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                حفظ واستيراد كافة البيانات (طلبات الشراء، أكواد التفعيل، رسائل اتصل بنا، الآراء، والإعدادات) لنقلها وفتحها من أي هاتف أو كمبيوتر ومزامنتها بآخر تعديل.
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="button"
                  onClick={exportSettings}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow cursor-pointer"
                >
                  📥 تصدير ملف النسخة الاحتياطية الشامل (JSON)
                </button>
                <button
                  type="button"
                  onClick={() => importFileRef.current?.click()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow cursor-pointer"
                >
                  📤 استيراد إعدادات من ملف
                </button>
                <input type="file" ref={importFileRef} onChange={importSettings} accept=".json" className="hidden" />
              </div>
            </div>

            {/* Clear All Settings Data Card */}
            <div className="md:col-span-2 bg-red-50/80 p-6 sm:p-8 rounded-3xl shadow-md border-2 border-red-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-red-200">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🧹</span>
                  <div>
                    <h3 className="font-black text-red-950 text-lg">
                      مسح بيانات الإعدادات فقط (إعادة الضبط الافتراضي)
                    </h3>
                    <p className="text-xs text-red-700">
                      وظيفة هذا الزر مسح كل شيء من الإعدادات فقط واسترجاع القيم الافتراضية النظيفة فوراً.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-black py-3 px-6 rounded-xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <span>🗑️</span>
                  <span>مسح كل شيء من الإعدادات</span>
                </button>
              </div>
              <p className="text-xs text-red-600 font-semibold">
                ⚠️ تنبيه: يمسح هذا الإجراء الإعدادات المخصصة وتفريغ القوائم من الإعدادات محلياً وسحابياً وإعادتها لوضع المصنع. يمكنك أخذ نسخة احتياطية (JSON) قبل المسح إذا أردت.
              </p>
            </div>
          </div>
        )}

        {/* Clear Data Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-red-300 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                ⚠️
              </div>
              <h3 className="text-xl font-black text-gray-900">تأكيد مسح بيانات الإعدادات</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                هل أنت متأكد من رغبتك في مسح كل شيء من الإعدادات فقط؟
                <br />
                سيتم مسح وتصفير كافة التخصيصات والبيانات من الإعدادات واسترجاع القيم الافتراضية.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClearSettingsData}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 px-4 rounded-xl text-sm shadow cursor-pointer transition-all"
                >
                  نعم، مسح كل شيء الآن 🗑️
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl text-sm cursor-pointer transition-all"
                >
                  إلغاء التراجع
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: VIP PAID SYSTEM SETTINGS */}
        {activeTab === 'paid' && (
          <div className="space-y-6 animate-fade-in">
            {/* Master Toggle & Pricing */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-4 border-amber-300 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👑</span>
                  <div>
                    <h2 className="text-xl font-black text-amber-950">
                      إعدادات النسخة المدفوعة والاشتراك (VIP)
                    </h2>
                    <p className="text-xs text-gray-500">
                      حدد سعر الاشتراك وطرق الدفع والألعاب المخصصة للمشتركين فقط
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.paidSettings?.enabled ?? true}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          enabled: e.target.checked,
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  <span className="ms-3 text-xs sm:text-sm font-black text-gray-800">
                    {localSettings.paidSettings?.enabled ? 'النظام مفعّل' : 'النظام معطل'}
                  </span>
                </label>
              </div>

              {/* Price & Currency Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    💰 سعر الاشتراك العام (المبلغ الدقيق):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={localSettings.paidSettings?.price ?? 3}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          price: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-black text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    * المبلغ الدقيق المطلوب عند الدفع.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    💵 العملة العامة:
                  </label>
                  <input
                    type="text"
                    value={localSettings.paidSettings?.currency ?? 'دولار'}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          currency: e.target.value,
                        },
                      }))
                    }
                    placeholder="مثال: دولار أو ليرة سورية"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    🔣 رمز العملة:
                  </label>
                  <input
                    type="text"
                    value={localSettings.paidSettings?.currencySymbol ?? '$'}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          currencySymbol: e.target.value,
                        },
                      }))
                    }
                    placeholder="مثال: $ أو ل.س"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    ⏳ اسم ونوع الباقة:
                  </label>
                  <input
                    type="text"
                    value={localSettings.paidSettings?.periodName ?? 'تفعيل دائم مدى الحياة'}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          periodName: e.target.value,
                        },
                      }))
                    }
                    placeholder="مثال: تفعيل دائم مدى الحياة"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* 50 Questions Game Lock & Stage Configuration */}
              <div className="bg-amber-50/80 p-5 rounded-2xl border-2 border-amber-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-amber-950">
                        طلب اشتراك VIP عند مرحلة معينة في ألعاب الـ 50 سؤال
                      </h4>
                      <p className="text-xs text-gray-600 font-bold">
                        السماح للطفل باللعب مجاناً حتى سؤال معين، ثم طلب ترقية النسخة لمتابعة باقي الأسئلة الـ 50
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.paidSettings?.questionGateEnabled ?? true}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          paidSettings: {
                            ...prev.paidSettings!,
                            questionGateEnabled: e.target.checked,
                          },
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    <span className="ms-2.5 text-xs font-black text-amber-950">
                      {localSettings.paidSettings?.questionGateEnabled !== false ? 'مفعّل' : 'معطّل'}
                    </span>
                  </label>
                </div>

                {localSettings.paidSettings?.questionGateEnabled !== false && (
                  <div className="pt-3 border-t border-amber-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        رقم السؤال الذي يتوقف عنده اللعب ويطلب اشتراك (افتراضي: 15):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="49"
                          value={localSettings.paidSettings?.questionGateNumber ?? 15}
                          onChange={(e) =>
                            setLocalSettings((prev) => ({
                              ...prev,
                              paidSettings: {
                                ...prev.paidSettings!,
                                questionGateNumber: Math.max(1, parseInt(e.target.value) || 15),
                              },
                            }))
                          }
                          className="w-28 px-3.5 py-2 bg-white border border-amber-300 rounded-xl font-black text-center text-lg text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                        />
                        <span className="text-xs font-bold text-gray-600">
                          (سيلعب الطفل الأسئلة حتى السؤال {(localSettings.paidSettings?.questionGateNumber ?? 15) - 1}، وعند الوصول للسؤال {localSettings.paidSettings?.questionGateNumber ?? 15} ستظهر نافذة الترقية)
                        </span>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <span className="text-[11px] font-bold text-gray-500">نماذج سريعة:</span>
                      {[10, 15, 20, 25].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() =>
                            setLocalSettings((prev) => ({
                              ...prev,
                              paidSettings: {
                                ...prev.paidSettings!,
                                questionGateNumber: preset,
                              },
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            (localSettings.paidSettings?.questionGateNumber ?? 15) === preset
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-white text-gray-700 hover:bg-amber-100 border border-amber-200'
                          }`}
                        >
                          السؤال {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* VIP Trial Duration Settings */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-amber-300 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="p-2.5 bg-amber-100 text-amber-900 rounded-2xl">
                  <span className="text-xl">⏱️</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    مدة التجربة المجانية لألعاب VIP (بالثواني):
                  </h3>
                  <p className="text-xs text-gray-500">
                    حدد المدة الزمنية المسموح بها لتجربة ألعاب VIP قبل أن تتوقف وتطلب اشتراك التفعيل (افتراضي: 60 ثانية / دقيقة واحدة).
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="10"
                    max="600"
                    value={localSettings.paidSettings?.vipTrialDurationSeconds ?? 60}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          vipTrialDurationSeconds: Math.max(10, parseInt(e.target.value) || 60),
                        },
                      }))
                    }
                    className="w-32 px-3.5 py-2.5 bg-gray-50 border border-amber-300 rounded-xl font-black text-center text-lg text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                  />
                  <span className="text-xs font-bold text-gray-700">ثانية ({(localSettings.paidSettings?.vipTrialDurationSeconds ?? 60) / 60} دقيقة تقريباً)</span>
                </div>

                {/* Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-gray-500">نماذج سريعة:</span>
                  {[30, 60, 120, 300].map((presetSeconds) => (
                    <button
                      key={presetSeconds}
                      type="button"
                      onClick={() =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          paidSettings: {
                            ...prev.paidSettings!,
                            vipTrialDurationSeconds: presetSeconds,
                          },
                        }))
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        (localSettings.paidSettings?.vipTrialDurationSeconds ?? 60) === presetSeconds
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      {presetSeconds >= 60 ? `${presetSeconds / 60} دقيقة` : `${presetSeconds} ثانية`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sham Cash Settings */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-cyan-300 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-900 rounded-2xl shadow">
                    <ShamCashLogoSvg className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      إعدادات بوابة الدفع (شام كاش - Sham Cash)
                    </h3>
                    <p className="text-xs text-gray-500">
                      بيانات حسابك ورمز التحويل والباركود الخاص بالاستلام
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.paidSettings?.shamCash.enabled ?? true}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          shamCash: {
                            ...prev.paidSettings!.shamCash,
                            enabled: e.target.checked,
                          },
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                  <span className="ms-2 text-xs font-bold text-gray-700">تفعيل شام كاش</span>
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Form Fields */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Per-Method Price & Currency for Sham Cash */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-cyan-50/60 p-3.5 rounded-2xl border border-cyan-200">
                    <div>
                      <label className="block text-xs font-bold text-cyan-950 mb-1">
                        💰 سعر شام كاش:
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={localSettings.paidSettings?.shamCash.price ?? (localSettings.paidSettings?.price ?? 3)}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            paidSettings: {
                              ...prev.paidSettings!,
                              shamCash: {
                                ...prev.paidSettings!.shamCash,
                                price: parseFloat(e.target.value) || 0,
                              },
                            },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-cyan-300 rounded-xl font-black text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cyan-950 mb-1">
                        💵 عملة شام كاش:
                      </label>
                      <input
                        type="text"
                        value={localSettings.paidSettings?.shamCash.currency ?? 'ليرة سورية'}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            paidSettings: {
                              ...prev.paidSettings!,
                              shamCash: {
                                ...prev.paidSettings!.shamCash,
                                currency: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="مثال: ليرة سورية"
                        className="w-full px-3 py-2 bg-white border border-cyan-300 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cyan-950 mb-1">
                        🔣 رمز العملة:
                      </label>
                      <input
                        type="text"
                        value={localSettings.paidSettings?.shamCash.currencySymbol ?? 'ل.س'}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            paidSettings: {
                              ...prev.paidSettings!,
                              shamCash: {
                                ...prev.paidSettings!.shamCash,
                                currencySymbol: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="مثال: ل.س"
                        className="w-full px-3 py-2 bg-white border border-cyan-300 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      👤 اسم المستلم في شام كاش (Account Name):
                    </label>
                    <input
                      type="text"
                      value={localSettings.paidSettings?.shamCash.accountName ?? 'mohannad anis ahmad'}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          paidSettings: {
                            ...prev.paidSettings!,
                            shamCash: {
                              ...prev.paidSettings!.shamCash,
                              accountName: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      🔑 كود الحساب / الرمز (Account Code):
                    </label>
                    <input
                      type="text"
                      value={
                        localSettings.paidSettings?.shamCash.accountCode ??
                        'c08a30e9e1f27a4b0d98b215562a0dbc'
                      }
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          paidSettings: {
                            ...prev.paidSettings!,
                            shamCash: {
                              ...prev.paidSettings!.shamCash,
                              accountCode: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      📝 تعليمات الدفع المعروضة للزبون:
                    </label>
                    <textarea
                      rows={3}
                      value={
                        localSettings.paidSettings?.shamCash.instructions ??
                        'قم بمسح الباركود أو تحويل المبلغ إلى الحساب أعلاه عبر تطبيق شام كاش، ثم أرسل رقم عملية التحويل لتفعيل نسختك فوراً.'
                      }
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          paidSettings: {
                            ...prev.paidSettings!,
                            shamCash: {
                              ...prev.paidSettings!.shamCash,
                              instructions: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                {/* Live QR Preview */}
                <div className="lg:col-span-5 bg-gray-950 p-4 rounded-3xl text-center space-y-2 border border-gray-800">
                  <span className="text-[11px] font-bold text-cyan-400 block">
                    معاينة بطاقة الباركود الحية (كما يراها الزبون):
                  </span>
                  <ShamCashQrCard
                    accountName={localSettings.paidSettings?.shamCash.accountName || 'mohannad anis ahmad'}
                    accountCode={
                      localSettings.paidSettings?.shamCash.accountCode ||
                      'c08a30e9e1f27a4b0d98b215562a0dbc'
                    }
                    amount={localSettings.paidSettings?.shamCash.price ?? (localSettings.paidSettings?.price || 3)}
                    currency={localSettings.paidSettings?.shamCash.currency || 'ليرة سورية'}
                  />
                </div>
              </div>
            </div>

            {/* PayPal Settings */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-blue-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow font-black text-lg">
                    🅿️
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      إعدادات بوابة الدفع (PayPal)
                    </h3>
                    <p className="text-xs text-gray-500">
                      بريد حساب باي بال الخاص باستلام المدفوعات
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.paidSettings?.paypal?.enabled ?? true}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          paypal: {
                            ...prev.paidSettings!.paypal,
                            enabled: e.target.checked,
                          },
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    ✉️ البريد الإلكتروني (PayPal Email):
                  </label>
                  <input
                    type="email"
                    value={localSettings.paidSettings?.paypal?.email ?? ''}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          paypal: {
                            ...prev.paidSettings!.paypal,
                            email: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    💵 السعر (اختياري):
                  </label>
                  <input
                    type="number"
                    value={localSettings.paidSettings?.paypal?.price ?? ''}
                    placeholder="3"
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          paypal: {
                            ...prev.paidSettings!.paypal,
                            price: e.target.value ? parseFloat(e.target.value) : undefined,
                          },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    📝 تعليمات الدفع:
                  </label>
                  <textarea
                    rows={2}
                    value={localSettings.paidSettings?.paypal?.instructions ?? ''}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          paypal: {
                            ...prev.paidSettings!.paypal,
                            instructions: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Binance Pay Settings */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-amber-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 text-gray-950 rounded-2xl shadow font-black text-lg">
                    🟡
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      إعدادات بوابة الدفع (Binance Pay)
                    </h3>
                    <p className="text-xs text-gray-500">
                      معرف بينانس باي (Pay ID) أو البريد/الهاتف للتحويل
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.paidSettings?.binancePay?.enabled ?? true}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          binancePay: {
                            ...prev.paidSettings!.binancePay,
                            enabled: e.target.checked,
                          },
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    🆔 معرف بينانس (Binance Pay ID):
                  </label>
                  <input
                    type="text"
                    value={localSettings.paidSettings?.binancePay?.payId ?? ''}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          binancePay: {
                            ...prev.paidSettings!.binancePay,
                            payId: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    📱 البريد أو الهاتف المرتبط:
                  </label>
                  <input
                    type="text"
                    value={localSettings.paidSettings?.binancePay?.emailOrPhone ?? ''}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          binancePay: {
                            ...prev.paidSettings!.binancePay,
                            emailOrPhone: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    📝 تعليمات الدفع:
                  </label>
                  <textarea
                    rows={2}
                    value={localSettings.paidSettings?.binancePay?.instructions ?? ''}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          binancePay: {
                            ...prev.paidSettings!.binancePay,
                            instructions: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* USDT TRC20 Settings */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-emerald-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow font-black text-lg">
                    💎
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      إعدادات شبكة USDT (TRC20)
                    </h3>
                    <p className="text-xs text-gray-500">
                      عنوان محفظة التيذر عبر شبكة ترون TRC20
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.paidSettings?.usdtTrc20?.enabled ?? true}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          usdtTrc20: {
                            ...prev.paidSettings!.usdtTrc20,
                            enabled: e.target.checked,
                          },
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    🪙 عنوان المحفظة (Wallet Address - TRC20):
                  </label>
                  <input
                    type="text"
                    value={localSettings.paidSettings?.usdtTrc20?.walletAddress ?? ''}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          usdtTrc20: {
                            ...prev.paidSettings!.usdtTrc20,
                            walletAddress: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    📝 تعليمات الدفع:
                  </label>
                  <textarea
                    rows={2}
                    value={localSettings.paidSettings?.usdtTrc20?.instructions ?? ''}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          usdtTrc20: {
                            ...prev.paidSettings!.usdtTrc20,
                            instructions: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* USDT ERC20 Settings */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-indigo-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow font-black text-lg">
                    🔷
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      إعدادات شبكة USDT (ERC20)
                    </h3>
                    <p className="text-xs text-gray-500">
                      عنوان محفظة التيذر عبر شبكة إيثريوم ERC20
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.paidSettings?.usdtErc20?.enabled ?? true}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          usdtErc20: {
                            ...prev.paidSettings!.usdtErc20,
                            enabled: e.target.checked,
                          },
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    🪙 عنوان المحفظة (Wallet Address - ERC20):
                  </label>
                  <input
                    type="text"
                    value={localSettings.paidSettings?.usdtErc20?.walletAddress ?? ''}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          usdtErc20: {
                            ...prev.paidSettings!.usdtErc20,
                            walletAddress: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    📝 تعليمات الدفع:
                  </label>
                  <textarea
                    rows={2}
                    value={localSettings.paidSettings?.usdtErc20?.instructions ?? ''}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        paidSettings: {
                          ...prev.paidSettings!,
                          usdtErc20: {
                            ...prev.paidSettings!.usdtErc20,
                            instructions: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
            </div>

            {/* Paid Games Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-gray-200 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <span>🔒 تحديد الألعاب التي تتطلب اشتراك VIP لتفتح:</span>
                    <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                      {localSettings.paidSettings?.paidGameIds?.length || 0} لعبة مدفوعة
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    الألعاب المحددة هنا لن يتمكن الزائر من تشغيلها إلا بعد شراء النسخة المدفوعة وتفعيل الكود.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={selectAllPaidGames}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 transition-colors"
                  >
                    تحديد كل الألعاب 🔒
                  </button>
                  <button
                    type="button"
                    onClick={clearAllPaidGames}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    إلغاء التحديد (مجانية) 🔓
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllVipMode('timer')}
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold rounded-xl border border-sky-200 transition-colors"
                    title="ضبط كل ألعاب VIP لتظهر بنظام المؤقت الزمني"
                  >
                    الكل مؤقت ⏱️
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllVipMode('question_limit')}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
                    title="ضبط كل ألعاب VIP لتظهر بنظام عدد محدد من الأسئلة/المراحل"
                  >
                    الكل عدد محدد 🔢
                  </button>
                </div>
              </div>

              {/* Filters for Games */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={paidGameSearch}
                  onChange={(e) => setPaidGameSearch(e.target.value)}
                  placeholder="🔍 ابحث عن لعبة بالاسم أو القسم..."
                  className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />

                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPaidGameCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        paidGameCategoryFilter === cat
                          ? 'bg-amber-500 text-gray-950 font-black shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Games Grid with Per-Game Timer vs Question Limit Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[560px] overflow-y-auto pr-1">
                {filteredPaidGames.map((game) => {
                  const isPaid = localSettings.paidSettings?.paidGameIds?.includes(game.id) || false;
                  const vipConfig = localSettings.paidSettings?.gameVipConfigs?.[game.id] || {
                    restrictionType: 'question_limit',
                    timerSeconds: 20,
                    questionLimit: 10,
                  };
                  const mode = vipConfig.restrictionType || 'question_limit';
                  const timerSec = vipConfig.timerSeconds || 20;
                  const questionsCount = vipConfig.questionLimit || 10;

                  return (
                    <div
                      key={game.id}
                      className={`rounded-2xl border-2 transition-all p-3.5 flex flex-col justify-between gap-2.5 select-none ${
                        isPaid
                          ? 'bg-amber-50/70 border-amber-400 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Top Row: Game Info & VIP Toggle Button */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl shrink-0">{game.icon || '🎮'}</span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-gray-900 truncate" title={game.name}>
                              {game.name}
                            </h4>
                            <span className="text-[10px] text-gray-400">{game.category}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleGamePaidRequirement(game.id)}
                          className={`shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-black cursor-pointer transition-all border ${
                            isPaid
                              ? 'bg-amber-500 hover:bg-amber-600 text-gray-950 border-amber-600 shadow-xs'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-300'
                          }`}
                        >
                          {isPaid ? '🔒 مدفوعة VIP' : 'مجانية 🔓'}
                        </button>
                      </div>

                      {/* Per-Game Restriction: Timer vs Question Limit */}
                      {isPaid && (
                        <div className="bg-white/95 rounded-xl p-2.5 border border-amber-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-amber-950">ظهور اللعبة للزبون:</span>
                            <span className="text-[10px] text-amber-800 font-bold">
                              {mode === 'timer' ? `⏱️ مؤقت (${timerSec}ث)` : `🔢 أسئلة (${questionsCount})`}
                            </span>
                          </div>

                          {/* Two Options: Timer OR Question Limit */}
                          <div className="grid grid-cols-2 gap-1.5 p-1 bg-amber-100/70 rounded-lg">
                            <button
                              type="button"
                              onClick={() => updateGameVipConfig(game.id, { restrictionType: 'timer' })}
                              className={`py-1.5 px-2 rounded-md text-[11px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                mode === 'timer'
                                  ? 'bg-amber-500 text-gray-950 shadow-xs ring-1 ring-amber-400'
                                  : 'bg-transparent text-amber-900 hover:bg-amber-200/60'
                              }`}
                            >
                              <span>⏱️</span>
                              <span>مؤقت زمني</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => updateGameVipConfig(game.id, { restrictionType: 'question_limit' })}
                              className={`py-1.5 px-2 rounded-md text-[11px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                mode === 'question_limit'
                                  ? 'bg-amber-500 text-gray-950 shadow-xs ring-1 ring-amber-400'
                                  : 'bg-transparent text-amber-900 hover:bg-amber-200/60'
                              }`}
                            >
                              <span>🔢</span>
                              <span>عدد محدد</span>
                            </button>
                          </div>

                          {/* Settings for Selected Mode */}
                          {mode === 'timer' ? (
                            <div className="space-y-1 pt-0.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500">مدة المؤقت المجاني:</span>
                                <span className="font-black text-amber-900">{timerSec} ثانية</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[15, 20, 30, 45, 60].map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => updateGameVipConfig(game.id, { timerSeconds: s })}
                                    className={`flex-1 py-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer ${
                                      timerSec === s
                                        ? 'bg-amber-500 text-gray-950 border-amber-600 font-black'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                                    }`}
                                  >
                                    {s}ث
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1 pt-0.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500">الأسئلة/المراحل المجانية:</span>
                                <span className="font-black text-amber-900">{questionsCount} سؤال</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[3, 5, 10, 15, 20].map((q) => (
                                  <button
                                    key={q}
                                    type="button"
                                    onClick={() => updateGameVipConfig(game.id, { questionLimit: q })}
                                    className={`flex-1 py-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer ${
                                      questionsCount === q
                                        ? 'bg-amber-500 text-gray-950 border-amber-600 font-black'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                                    }`}
                                  >
                                    {q}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB: PURCHASE ORDERS & ACTIVATION CODES */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-indigo-200 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <span className="text-3xl">📦</span>
              <div>
                <h2 className="text-xl font-black text-indigo-950">
                  إدارة طلبات شراء النسخة المدفوعة وأكواد التفعيل
                </h2>
                <p className="text-xs text-gray-500">
                  عرض تحويلات الزبائن، اعتماد الأكواد، مشاركة باركود التفعيل عبر واتساب، وتوليد أكواد يدوية
                </p>
              </div>
            </div>

            <SubscriptionOrdersManager />
          </div>
        )}

        {/* TAB 8: SKILL TEST RESULTS MANAGEMENT */}

        {activeTab === 'skillResults' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border-4 border-amber-200 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <span className="text-3xl">🏆</span>
              <div>
                <h2 className="text-xl font-black text-amber-950">إدارة نتائج تحدي المهارات لوحة الشرف</h2>
                <p className="text-xs text-gray-500">مراجعة وحذف نتائج الأبطال المرسلة من تحدي 50 سؤالاً</p>
              </div>
            </div>

            {(!localSettings.skillTestResults || localSettings.skillTestResults.length === 0) ? (
              <div className="text-center p-12 bg-amber-50/50 rounded-2xl border border-amber-200">
                <span className="text-5xl block mb-2">🏅</span>
                <p className="text-gray-600 font-bold">لا توجد نتائج مسجلة لتحدي المهارات حالياً.</p>
                <p className="text-xs text-gray-400 mt-1">عندما يخوض الأطفال تحدي 50 سؤالاً ويرسلون نتائجهم، ستظهر هنا للإدارة!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {localSettings.skillTestResults.map((res) => (
                  <div key={res.id} className="p-4 rounded-2xl border-2 border-amber-100 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-800 text-base">{res.name}</span>
                        {res.testRound && (
                          <span className="text-[11px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-extrabold">
                            {res.testRound === 1 ? 'الاختبار 1' : res.testRound === 2 ? 'الاختبار 2' : 'الاختبار 3'}
                          </span>
                        )}
                        {res.country && (
                          <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                            {res.country}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 font-mono">العمر: {res.age}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-xs text-gray-400">تاريخ التسجيل: {res.createdAt}</p>
                        {res.clientIp && (
                          <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono border border-slate-200">
                            🌐 IP: {res.clientIp}
                          </span>
                        )}
                        {res.deviceInfo && (
                          <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-mono border border-blue-200">
                            📱 {res.deviceInfo}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-lg font-black text-amber-700">{res.score} / {res.total}</span>
                        <span className="text-xs font-bold text-emerald-600 block">({res.percentage}%)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف نتيجة البطل ${res.name}؟`)) {
                            deleteSkillTestResult(res.id);
                            setLocalSettings((prev) => ({
                              ...prev,
                              skillTestResults: (prev.skillTestResults || []).filter((r) => r.id !== res.id),
                            }));
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-800 font-bold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 cursor-pointer"
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Global Floating Save Bar */}
        <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-sky-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black py-3.5 px-8 rounded-xl shadow-lg transition-transform active:scale-95 text-base cursor-pointer"
          >
            💾 حفظ وتطبيق جميع الإعدادات
          </button>
          {saveMessage && (
            <p className="text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 font-black text-xs sm:text-sm animate-pulse">
              {saveMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
