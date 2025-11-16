
import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Settings } from '../types';

const SettingsPage: React.FC = () => {
  const { settings, saveSettings, gistUrl, setGistUrl, gistToken, setGistToken, loadFromGist, saveToGist } = useSettings();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [saveMessage, setSaveMessage] = useState('');
  const [syncMessage, setSyncMessage] = useState({ text: '', type: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
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
      // update local form state as well
      const savedSettings = localStorage.getItem('toysGameSettings');
      if(savedSettings) setLocalSettings(JSON.parse(savedSettings));
    } else {
      setSyncMessage({ text: 'فشل التحميل. تحقق من الرابط.', type: 'error' });
    }
     setTimeout(() => setSyncMessage({ text: '', type: '' }), 4000);
  }
  
  const handleSaveToGist = async () => {
    // First save local settings to ensure they are up to date
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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">إعدادات الموقع</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="siteName" className="block text-lg font-medium text-gray-700 mb-2">اسم الموقع</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={localSettings.siteName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label htmlFor="logoUrl" className="block text-lg font-medium text-gray-700 mb-2">رابط الشعار (Logo URL)</label>
            <input
              type="text"
              id="logoUrl"
              name="logoUrl"
              value={localSettings.logoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label htmlFor="backgroundMusicUrl" className="block text-lg font-medium text-gray-700 mb-2">رابط موسيقى الخلفية</label>
            <input
              type="text"
              id="backgroundMusicUrl"
              name="backgroundMusicUrl"
              value={localSettings.backgroundMusicUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label htmlFor="youtubeUrls" className="block text-lg font-medium text-gray-700 mb-2">روابط قنوات يوتيوب (رابط واحد في كل سطر)</label>
            <textarea
              id="youtubeUrls"
              name="youtubeUrls"
              value={localSettings.youtubeUrls}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div className="flex items-center justify-between">
              <button
                  type="submit"
                  className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors"
              >
                  حفظ الإعدادات المحلية
              </button>
              {saveMessage && <p className="text-green-600 font-semibold">{saveMessage}</p>}
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">المزامنة عبر الإنترنت</h2>
        <div className="space-y-4 text-sm text-gray-600 mb-6">
          <p>1. الصق رابط Gist Raw URL ليكون مصدر بيانات الموقع.</p>
          <p>2. أنشئ Personal Access Token (Classic) من GitHub مع صلاحية `gist` فقط.</p>
          <p>3. الصق التوكن لتمكين الحفظ والمزامنة.</p>
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
