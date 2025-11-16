import React from 'react';
import { AdSettings } from '../types';

interface AdPopupProps {
  isOpen: boolean;
  onClose: () => void;
  adSettings: AdSettings;
}

const AdPopup: React.FC<AdPopupProps> = ({ isOpen, onClose, adSettings }) => {
  if (!isOpen) return null;

  const handleVisitClick = () => {
    window.open(adSettings.url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 opacity-100 animate-scale-up relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl" aria-label="إغلاق">&times;</button>
        <img src={adSettings.imageUrl} alt={adSettings.name} className="w-24 h-24 mx-auto mb-4 object-contain" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{adSettings.name}</h2>
        <p className="text-gray-600 mb-6">{adSettings.description}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleVisitClick}
            className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            زيارة الرابط
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

export default AdPopup;
