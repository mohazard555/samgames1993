import React, { useState, useRef, useMemo } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Settings, GoogleAdSettings } from '../types';
import { GAMES } from '../constants';
import { LockClosedIcon, VideoCameraIcon, CheckCircleIcon, KeyIcon } from '../components/Icons';

const SettingsPage: React.FC = () => {
  const {
    settings,
    saveSettings,
    isAdminUnlocked,
    verifyAdminPassword,
    lockAdmin,
    resetSubscriptionStatus,
    isSubscribed,
    gistUrl,
    setGistUrl,
    gistToken,
    setGistToken,
    loadFromGist,
    saveToGist,
  } = useSettings();

  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [saveMessage, setSaveMessage] = useState('');
  const [syncMessage, setSyncMessage] = useState({ text: '', type: '' });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [gameSearch, setGameSearch] = useState('');
  const [gameCategoryFilter, setGameCategoryFilter] = useState('الكل');
  const importFileRef = useRef<HTMLInputElement>(null);

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

  // Handle password entry if directly visiting /settings
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

  // If not authenticated, show PIN password lock screen (Password 1993)
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl shadow-xl border-4 border-amber-300 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center text-white shadow-lg">
          <LockClosedIcon />
        </div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">منطقة الإدارة محمية</h1>
        <p className="text-gray-500 text-sm mb-6">أدخل كلمة المرور الخاصة بالإدارة للمتابعة</p>

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
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-transform active:scale-95"
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
      setLocalSettings((prev) => ({ ...prev, adSettings: { ...prev.adSettings, [name]: checked } }));
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

  // Toggle game video requirement
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(localSettings);
    setSaveMessage('✓ تم حفظ جميع الإعدادات بنجاح!');
    setTimeout(() => setSaveMessage(''), 3500);
  };

  const handleLoadFromGist = async () => {
    setSyncMessage({ text: '...جاري التحميل من Gist', type: 'info' });
    const success = await loadFromGist();
    if (success) {
      setSyncMessage({ text: 'تم تحميل الإعدادات بنجاح!', type: 'success' });
      const savedSettings = localStorage.getItem('toysGameSettings');
      if (savedSettings) setLocalSettings(JSON.parse(savedSettings));
    } else {
      setSyncMessage({ text: 'فشل التحميل. تحقق من الرابط.', type: 'error' });
    }
    setTimeout(() => setSyncMessage({ text: '', type: '' }), 4000);
  };

  const handleSaveToGist = async () => {
    saveSettings(localSettings);
    setSyncMessage({ text: '...جاري الحفظ والمزامنة مع Gist', type: 'info' });
    const success = await saveToGist();
    if (success) {
      setSyncMessage({ text: 'تم حفظ الإعدادات ومزامنتها بنجاح!', type: 'success' });
    } else {
      setSyncMessage({ text: 'فشل الحفظ. تحقق من الرابط والتوكن.', type: 'error' });
    }
    setTimeout(() => setSyncMessage({ text: '', type: '' }), 4000);
  };

  const exportSettings = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(localSettings, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'toysgame-settings.json';
    link.click();
  };

  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const newSettings = JSON.parse(event.target?.result as string);
          if (newSettings.siteName) {
            saveSettings(newSettings);
            setLocalSettings(newSettings);
            alert('تم استيراد الإعدادات بنجاح!');
          } else {
            alert('ملف الإعدادات غير صالح.');
          }
        } catch {
          alert('خطأ في قراءة الملف.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Admin Header Bar */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black">⚙️ لوحة تحكم وإعدادات الموقع</h1>
          <p className="text-sky-100 text-sm mt-1">تخصيص الفيديو، مهل الانتظار، إعلانات Google والألعاب</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={lockAdmin}
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors border border-white/30"
          >
            🔒 قفل المشرف (تسجيل الخروج)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Video Wait Duration & YouTube Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-sky-100">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
            <span className="text-2xl">⏳</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">مهلة انتظار الفيديو وإعدادات يوتيوب</h2>
              <p className="text-xs text-gray-500">تحديد المدة الزمنية للعداد قبل فتح اللعبة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video Wait Time (Seconds) */}
            <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-200">
              <label htmlFor="videoWaitTime" className="block text-base font-bold text-gray-800 mb-1">
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
                  min={3}
                  max={120}
                  value={localSettings.videoWaitTime}
                  onChange={handleLocalChange}
                  className="w-28 px-4 py-2.5 text-center text-xl font-bold border-2 border-sky-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
                <span className="font-bold text-gray-700">ثانية</span>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-gray-400">خيارات سريعة:</span>
                {[5, 10, 15, 20, 30].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setLocalSettings((prev) => ({ ...prev, videoWaitTime: sec }))}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      localSettings.videoWaitTime === sec
                        ? 'bg-sky-500 text-white'
                        : 'bg-white text-sky-700 border border-sky-200 hover:bg-sky-100'
                    }`}
                  >
                    {sec} ثانية
                  </button>
                ))}
              </div>
            </div>

            {/* Main Channel Subscription URL */}
            <div>
              <label htmlFor="subscriptionUrl" className="block text-sm font-bold text-gray-700 mb-1">
                رابط قناة يوتيوب الأساسية للزر
              </label>
              <input
                type="url"
                id="subscriptionUrl"
                name="subscriptionUrl"
                value={localSettings.subscriptionUrl}
                onChange={handleLocalChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-sm"
                placeholder="https://www.youtube.com/@channel"
              />
              <p className="text-xs text-gray-400 mt-1">يفتح عند الضغط على زر الاشتراك بالقناة</p>
            </div>
          </div>

          {/* Backup Video URLs */}
          <div className="mt-4">
            <label htmlFor="youtubeUrls" className="block text-sm font-bold text-gray-700 mb-1">
              روابط فيديوهات وقنوات يوتيوب للمشاهدة (رابط واحد في كل سطر)
            </label>
            <textarea
              id="youtubeUrls"
              name="youtubeUrls"
              value={localSettings.youtubeUrls}
              onChange={handleLocalChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-sm font-mono"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-400 mt-1">يتم اختيار رابط عشوائي منها عند فتح نافذة المشاهدة</p>
          </div>

          {/* Subscription Reset Test Button */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              حالة اشتراك المتصفح الحالي:{' '}
              <span className={`font-bold ${isSubscribed ? 'text-green-600' : 'text-amber-600'}`}>
                {isSubscribed ? 'مشترك (لا تظهر له رسالة الاشتراك بالألعاب العادية)' : 'غير مشترك'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                resetSubscriptionStatus();
                alert('تمت إعادة تعيين حالة الاشتراك في هذا المتصفح لتجربة رسائل الاشتراك من جديد.');
              }}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-1.5 px-3 rounded-lg border"
            >
              🔄 إعادة تعيين حالة الاشتراك للاختبار
            </button>
          </div>
        </div>

        {/* 2. Video-Required Games Selection */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-sky-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎬</span>
              <div>
                <h2 className="text-xl font-bold text-gray-800">تحديد الألعاب التي تتطلب مشاهدة فيديو لفتحها</h2>
                <p className="text-xs text-gray-500">
                  اختر الألعاب المحددة التي تريد قفلها بفيديو، بينما تفتح باقي الألعاب مباشرة بعد اشتراك القناة
                </p>
              </div>
            </div>
            <div className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full border border-red-200 self-start sm:self-auto">
              تم تحديد {localSettings.videoRequiredGameIds?.length || 0} من {GAMES.length} لعبة
            </div>
          </div>

          {/* Controls & Quick Selectors */}
          <div className="space-y-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={selectAllVideoGames}
                className="text-xs bg-sky-500 hover:bg-sky-600 text-white font-bold py-1.5 px-3 rounded-lg transition-colors"
              >
                تحديد جميع الألعاب ({GAMES.length})
              </button>
              <button
                type="button"
                onClick={clearAllVideoGames}
                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 px-3 rounded-lg transition-colors"
              >
                إلغاء تحديد الكل (0)
              </button>
              <button
                type="button"
                onClick={() => selectCategoryVideoGames('ذكاء')}
                className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-1.5 px-3 rounded-lg transition-colors"
              >
                + ألعاب الذكاء
              </button>
              <button
                type="button"
                onClick={() => selectCategoryVideoGames('تعليمية')}
                className="text-xs bg-green-100 hover:bg-green-200 text-green-700 font-bold py-1.5 px-3 rounded-lg transition-colors"
              >
                + الألعاب التعليمية
              </button>
            </div>

            {/* Filter & Search inside selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
                placeholder="بحث سريع في قائمة الألعاب..."
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <select
                value={gameCategoryFilter}
                onChange={(e) => setGameCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    تصنيف: {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Games Checkbox Grid */}
          <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-2xl p-3 bg-gray-50/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredGames.map((game) => {
              const isChecked = localSettings.videoRequiredGameIds?.includes(game.id);
              return (
                <div
                  key={game.id}
                  onClick={() => toggleGameVideoRequirement(game.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all select-none ${
                    isChecked
                      ? 'bg-red-50 border-red-300 text-red-900 font-bold shadow-sm'
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
                        isChecked ? 'bg-red-500 border-red-600 text-white' : 'border-gray-300 bg-white'
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

        {/* 3. Google AdSense & AdMob Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-sky-100">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
            <span className="text-2xl">📢</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">إعلانات Google AdMob / AdSense (اختيارية)</h2>
              <p className="text-xs text-gray-500">عرض مساحات إعلانية متجاوبة في مختلف أقسام الموقع</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Enable toggle */}
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
              <div className="space-y-4 pt-2 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="adClient" className="block text-sm font-bold text-gray-700 mb-1">
                      معرف الناشر (Ad Client)
                    </label>
                    <input
                      type="text"
                      id="adClient"
                      name="adClient"
                      value={localSettings.googleAdSettings.adClient}
                      onChange={handleGoogleAdChange}
                      placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="adSlot" className="block text-sm font-bold text-gray-700 mb-1">
                      معرف الوحدة الإعلانية (Ad Slot ID)
                    </label>
                    <input
                      type="text"
                      id="adSlot"
                      name="adSlot"
                      value={localSettings.googleAdSettings.adSlot}
                      onChange={handleGoogleAdChange}
                      placeholder="1234567890"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Custom HTML Code */}
                <div>
                  <label htmlFor="customHtml" className="block text-sm font-bold text-gray-700 mb-1">
                    أو كود إعلاني مخصص / Custom Banner HTML (اختياري)
                  </label>
                  <textarea
                    id="customHtml"
                    name="customHtml"
                    value={localSettings.googleAdSettings.customHtml}
                    onChange={handleGoogleAdChange}
                    rows={2}
                    placeholder="<script>...</script> أو كود إعلاني جاهز"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-xs font-mono"
                  />
                </div>

                {/* Positions */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <span className="block text-sm font-bold text-gray-700 mb-2">أماكن ظهور الإعلان:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        name="showTopBanner"
                        checked={localSettings.googleAdSettings.showTopBanner}
                        onChange={handleGoogleAdChange}
                        className="h-4 w-4 rounded text-sky-600"
                      />
                      <span>أعلى الصفحة الرئيسية</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        name="showBottomBanner"
                        checked={localSettings.googleAdSettings.showBottomBanner}
                        onChange={handleGoogleAdChange}
                        className="h-4 w-4 rounded text-sky-600"
                      />
                      <span>أسفل الصفحة الرئيسية</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        name="showGameBanner"
                        checked={localSettings.googleAdSettings.showGameBanner}
                        onChange={handleGoogleAdChange}
                        className="h-4 w-4 rounded text-sky-600"
                      />
                      <span>داخل صفحات الألعاب</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Site Identity & Branding */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-sky-100">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
            <span className="text-2xl">🎨</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">بيانات وهوية الموقع</h2>
              <p className="text-xs text-gray-500">اسم الموقع، الشعار وموسيقى الخلفية</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="siteName" className="block text-sm font-bold text-gray-700 mb-1">
                اسم الموقع
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={localSettings.siteName}
                onChange={handleLocalChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">شعار الموقع (الأيقونة)</label>
              <div className="flex items-center gap-3">
                <img
                  src={localSettings.logoUrl}
                  alt="Logo Preview"
                  className="h-12 w-12 object-contain border p-1 rounded-xl bg-gray-50"
                />
                <input
                  type="file"
                  id="logoUrl"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'logoUrl')}
                  className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-bold text-gray-700 mb-1">
                بريد التواصل
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={localSettings.contactEmail}
                onChange={handleLocalChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label htmlFor="feedbackEmail" className="block text-sm font-bold text-gray-700 mb-1">
                بريد الآراء والملاحظات
              </label>
              <input
                type="email"
                id="feedbackEmail"
                name="feedbackEmail"
                value={localSettings.feedbackEmail}
                onChange={handleLocalChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 5. Custom Ad / Gift Popup */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-sky-100">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <div>
                <h2 className="text-xl font-bold text-gray-800">إشعار الهدية / الإعلان الداخلي المنبثق</h2>
                <p className="text-xs text-gray-500">أيقونة متحركة في رأس الصفحة تفتح نافذة مخصصة</p>
              </div>
            </div>
            <input
              type="checkbox"
              id="adEnabled"
              name="enabled"
              checked={localSettings.adSettings.enabled}
              onChange={handleLocalChange}
              className="h-6 w-6 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
          </div>

          {localSettings.adSettings.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">عنوان الإعلان</label>
                <input
                  type="text"
                  name="name"
                  value={localSettings.adSettings.name}
                  onChange={handleAdChange}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رابط الإعلان</label>
                <input
                  type="url"
                  name="url"
                  value={localSettings.adSettings.url}
                  onChange={handleAdChange}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">نص ووصف الإعلان</label>
                <textarea
                  name="description"
                  value={localSettings.adSettings.description}
                  onChange={handleAdChange}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border-2 border-sky-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black py-3 px-8 rounded-xl shadow-lg transition-transform active:scale-95 text-base"
          >
            💾 حفظ وتطبيق جميع الإعدادات
          </button>
          {saveMessage && <p className="text-green-600 font-bold text-sm animate-pulse">{saveMessage}</p>}
        </div>
      </form>

      {/* 6. Import/Export & Gist Sync */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup / Restore */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>📦</span>
            <span>النسخ الاحتياطي والاستعادة</span>
          </h3>
          <p className="text-xs text-gray-500 mb-4">حفظ إعداداتك في ملف JSON أو استرجاعها بضغطة زر</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={exportSettings}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors"
            >
              تصدير الإعدادات
            </button>
            <button
              type="button"
              onClick={() => importFileRef.current?.click()}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors"
            >
              استيراد ملف
            </button>
            <input type="file" ref={importFileRef} onChange={importSettings} accept=".json" className="hidden" />
          </div>
        </div>

        {/* Gist Sync */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>🌐</span>
            <span>مزامنة سحابية عبر GitHub Gist</span>
          </h3>
          <div className="space-y-2 text-xs">
            <input
              type="url"
              value={gistUrl}
              onChange={(e) => setGistUrl(e.target.value)}
              placeholder="رابط Gist Raw"
              className="w-full px-3 py-1.5 border rounded-lg"
            />
            <input
              type="password"
              value={gistToken}
              onChange={(e) => setGistToken(e.target.value)}
              placeholder="GitHub Token"
              className="w-full px-3 py-1.5 border rounded-lg"
            />
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleLoadFromGist}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-2 rounded-lg text-xs"
              >
                تحميل من Gist
              </button>
              <button
                type="button"
                onClick={handleSaveToGist}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 px-2 rounded-lg text-xs"
              >
                حفظ في Gist
              </button>
            </div>
            {syncMessage.text && (
              <p className={`text-[11px] font-bold ${syncMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {syncMessage.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
