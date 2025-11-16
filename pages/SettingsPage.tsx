
import React, { useState, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Settings } from '../types';

const SettingsPage: React.FC = () => {
  const { settings, saveSettings, gistUrl, setGistUrl, gistToken, setGistToken, loadFromGist, saveToGist } = useSettings();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [saveMessage, setSaveMessage] = useState('');
  const [syncMessage, setSyncMessage] = useState({ text: '', type: '' });
  const importFileRef = useRef<HTMLInputElement>(null);


  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
       setLocalSettings(prev => ({ ...prev, adSettings: { ...prev.adSettings, [name]: checked } }));
    } else {
       setLocalSettings(prev => ({ ...prev, [name]: value }));
    }
  };

   const handleAdChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, adSettings: { ...prev.adSettings, [name]: value } }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Settings | keyof Settings['adSettings']) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (fieldName in localSettings.adSettings) {
             setLocalSettings(prev => ({ ...prev, adSettings: { ...prev.adSettings, [fieldName]: result }}));
        } else {
            setLocalSettings(prev => ({ ...prev, [fieldName as keyof Settings]: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(localSettings);
    setSaveMessage('تم حفظ الإعدادات المحلية بنجاح!');
    setTimeout(() => setSaveMessage(''), 3000);
  };
  
  const handleLoadFromGist = async () => {
    setSyncMessage({ text: '...جاري التحميل', type: 'info' });
    const success = await loadFromGist();
    if (success) {
      setSyncMessage({ text: 'تم تحميل الإعدادات بنجاح!', type: 'success' });
      const savedSettings = localStorage.getItem('toysGameSettings');
      if(savedSettings) setLocalSettings(JSON.parse(savedSettings));
    } else {
      setSyncMessage({ text: 'فشل التحميل. تحقق من الرابط.', type: 'error' });
    }
     setTimeout(() => setSyncMessage({ text: '', type: '' }), 4000);
  }
  
  const handleSaveToGist = async () => {
    saveSettings(localSettings);
    setSyncMessage({ text: '...جاري الحفظ والمزامنة', type: 'info' });
    const success = await saveToGist();
     if (success) {
      setSyncMessage({ text: 'تم حفظ الإعدادات ومزامنتها بنجاح!', type: 'success' });
    } else {
      setSyncMessage({ text: 'فشل الحفظ. تحقق من الرابط والتوكن.', type: 'error' });
    }
    setTimeout(() => setSyncMessage({ text: '', type: '' }), 4000);
  }

  const exportSettings = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(settings))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "toysgame-settings.json";
    link.click();
  };

  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const newSettings = JSON.parse(event.target?.result as string);
          // Basic validation
          if (newSettings.siteName && newSettings.youtubeUrls) {
            saveSettings(newSettings);
            setLocalSettings(newSettings);
            alert("تم استيراد الإعدادات بنجاح!");
          } else {
            alert("ملف الإعدادات غير صالح.");
          }
        } catch (error) {
          alert("خطأ في قراءة الملف.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* General Settings */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">إعدادات الموقع</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="siteName" className="block text-lg font-medium text-gray-700 mb-2">اسم الموقع</label>
            <input type="text" id="siteName" name="siteName" value={localSettings.siteName} onChange={handleLocalChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">شعار الموقع</label>
            <div className="flex items-center gap-4">
              <img src={localSettings.logoUrl} alt="Logo Preview" className="h-16 w-16 object-contain border p-1 rounded-md bg-gray-50" />
              <input type="file" id="logoUrl" accept="image/*" onChange={(e) => handleFileChange(e, 'logoUrl')} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"/>
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">موسيقى الخلفية</label>
            <input type="file" id="backgroundMusicUrl" accept="audio/*" onChange={(e) => handleFileChange(e, 'backgroundMusicUrl')} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"/>
          </div>
           <div>
            <label htmlFor="subscriptionUrl" className="block text-lg font-medium text-gray-700 mb-2">رابط الاشتراك الأساسي</label>
            <input type="url" id="subscriptionUrl" name="subscriptionUrl" value={localSettings.subscriptionUrl} onChange={handleLocalChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" placeholder="https://www.youtube.com/channel/..."/>
          </div>
          <div>
            <label htmlFor="youtubeUrls" className="block text-lg font-medium text-gray-700 mb-2">روابط قنوات يوتيوب احتياطية (رابط واحد في كل سطر)</label>
            <textarea id="youtubeUrls" name="youtubeUrls" value={localSettings.youtubeUrls} onChange={handleLocalChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" />
          </div>
           <div>
            <label htmlFor="contactEmail" className="block text-lg font-medium text-gray-700 mb-2">بريد التواصل الإلكتروني</label>
            <input type="email" id="contactEmail" name="contactEmail" value={localSettings.contactEmail} onChange={handleLocalChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" placeholder="contact@example.com"/>
          </div>
          <div>
            <label htmlFor="feedbackEmail" className="block text-lg font-medium text-gray-700 mb-2">بريد تلقي آراء المستخدمين</label>
            <input type="email" id="feedbackEmail" name="feedbackEmail" value={localSettings.feedbackEmail} onChange={handleLocalChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" placeholder="feedback@example.com"/>
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors">حفظ الإعدادات المحلية</button>
            {saveMessage && <p className="text-green-600 font-semibold">{saveMessage}</p>}
          </div>
        </form>
      </div>

      {/* Ad Settings */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">إعدادات الإعلان</h2>
        <div className="space-y-6">
           <div className="flex items-center">
             <input type="checkbox" id="enabled" name="enabled" checked={localSettings.adSettings.enabled} onChange={handleLocalChange} className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"/>
             <label htmlFor="enabled" className="mr-3 block text-lg font-medium text-gray-700">تفعيل الإعلان</label>
          </div>
          {localSettings.adSettings.enabled && <>
            <div>
              <label htmlFor="adName" className="block text-lg font-medium text-gray-700 mb-2">اسم الإعلان</label>
              <input type="text" id="adName" name="name" value={localSettings.adSettings.name} onChange={handleAdChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="adDescription" className="block text-lg font-medium text-gray-700 mb-2">وصف الإعلان</label>
              <textarea id="adDescription" name="description" value={localSettings.adSettings.description} onChange={handleAdChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="adUrl" className="block text-lg font-medium text-gray-700 mb-2">رابط الإعلان</label>
              <input type="url" id="adUrl" name="url" value={localSettings.adSettings.url} onChange={handleAdChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
             <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">صورة الإعلان</label>
                <input type="file" id="imageUrl" accept="image/*" onChange={(e) => handleFileChange(e, 'imageUrl')} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"/>
            </div>
             <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">أيقونة الإشعار</label>
                <input type="file" id="iconUrl" accept="image/*" onChange={(e) => handleFileChange(e, 'iconUrl')} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"/>
            </div>
            <button onClick={(e) => handleSubmit(e)} className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors">حفظ إعدادات الإعلان</button>
          </>}
        </div>
      </div>

       {/* Import/Export */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">استيراد وتصدير</h2>
        <p className="text-center text-gray-600 mb-6">احفظ إعداداتك في ملف أو قم باستعادتها.</p>
        <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={exportSettings} className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">تصدير الإعدادات</button>
            <button onClick={() => importFileRef.current?.click()} className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">استيراد الإعدادات</button>
            <input type="file" ref={importFileRef} onChange={importSettings} accept=".json" className="hidden" />
        </div>
      </div>

      {/* Gist Sync */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">المزامنة عبر GitHub Gist</h2>
        <div className="space-y-4 text-sm text-gray-600 mb-6">
          <p>استخدم هذه الميزة المتقدمة لمزامنة إعداداتك عبر الإنترنت باستخدام GitHub.</p>
        </div>
        <div className="space-y-6">
            <div>
              <label htmlFor="gistUrl" className="block text-lg font-medium text-gray-700 mb-2">رابط Gist Raw للمزامنة</label>
              <input type="url" id="gistUrl" value={gistUrl} onChange={(e) => setGistUrl(e.target.value)} placeholder="https://gist.githubusercontent.com/..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="gistToken" className="block text-lg font-medium text-gray-700 mb-2">GitHub Personal Access Token</label>
              <input type="password" id="gistToken" value={gistToken} onChange={(e) => setGistToken(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
               <button onClick={handleLoadFromGist} className="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">تحميل الإعدادات</button>
               <button onClick={handleSaveToGist} className="flex-1 bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors">حفظ ومزامنة</button>
            </div>
            {syncMessage.text && <p className={`font-semibold ${syncMessage.type === 'success' ? 'text-green-600' : syncMessage.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>{syncMessage.text}</p>}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;