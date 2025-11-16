import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed: () => void;
}

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({ isOpen, onClose, onSubscribed }) => {
  const { settings } = useSettings();

  const handleSubscribeClick = () => {
    const urls = settings.youtubeUrls.split('\n').filter(url => url.trim() !== '');
    if (urls.length > 0) {
      const randomUrl = urls[Math.floor(Math.random() * urls.length)];
      window.open(randomUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('لا توجد روابط يوتيوب مهيئة حالياً.');
    }
  };

  const handleProceedClick = () => {
      onSubscribed();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 opacity-100 animate-scale-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">اشترك أولاً للاستمرار</h2>
        <p className="text-gray-600 mb-6">لدعمنا، يرجى الاشتراك في قناتنا على يوتيوب ثم المتابعة إلى اللعبة.</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubscribeClick}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            الاشتراك في يوتيوب
          </button>
           <button
            onClick={handleProceedClick}
            className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-colors"
          >
            لقد اشتركت، افتح اللعبة
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scale-up {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
       `}</style>
    </div>
  );
};

export default SubscriptionPopup;
