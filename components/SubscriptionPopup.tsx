import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed: () => void;
}

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({ isOpen, onClose, onSubscribed }) => {
  const { settings } = useSettings();
  const [step, setStep] = useState<'initial' | 'confirming' | 'waiting' | 'ready'>('initial');
  const [countdown, setCountdown] = useState(22);
  const timerRef = useRef<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (isOpen && step === 'waiting' && countdown > 0) {
      timerRef.current = window.setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && step === 'waiting') {
      setStep('ready');
    }
    
    // Cleanup timer on unmount or state change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, step, countdown]);

  // Reset state when popup is closed or reopened
  useEffect(() => {
    if (!isOpen) {
      // Use a timeout to reset state after the closing animation
      setTimeout(() => {
        setStep('initial');
        setCountdown(22);
        if (timerRef.current) clearTimeout(timerRef.current);
      }, 300);
    }
  }, [isOpen]);

  const handleSubscribeClick = () => {
    setStep('confirming');
  };

  const handleOpenYoutubeAndStartTimer = () => {
    let urlToOpen = settings.subscriptionUrl?.trim();
    if (!urlToOpen) {
        const urls = settings.youtubeUrls.split('\n').filter(url => url.trim() !== '');
        if (urls.length > 0) {
            urlToOpen = urls[Math.floor(Math.random() * urls.length)];
        }
    }
    if (urlToOpen) {
      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
    }
    setStep('waiting');
  };
  
  const handleProceedClick = () => {
      onSubscribed();
  };

  const handleClose = () => {
    onClose();
  };


  if (!isOpen) return null;
  
  const renderContent = () => {
      switch (step) {
          case 'confirming':
            return {
                title: "تنبيه قبل المتابعة",
                description: "ستنتظر 22 ثانية بعد فتح يوتيوب لتتمكن من الدخول للعبة. نرجو منك مشاهدة الفيديو لدعمنا حتى انتهاء الوقت.",
            };
          case 'waiting':
              return {
                  title: "شكراً لك!",
                  description: (
                    <>
                        <p>نرجو منك التفاعل معنا والاشتراك ليصلك كل جديد وممتع.</p>
                        <p className="mt-2">يرجى مشاهدة الفيديو لمدة 22 ثانية على الأقل لدعمنا.</p>
                        <p className="font-bold text-lg mt-4 text-blue-600 animate-pulse">
                            انتظر من فضلك... تبقى {countdown} ثانية
                        </p>
                    </>
                  )
              };
          case 'ready':
              return {
                  title: "شكراً لدعمك!",
                  description: "يمكنك الآن المتابعة إلى اللعبة."
              };
          case 'initial':
          default:
              return {
                  title: "اشترك أولاً للاستمرار",
                  description: "لدعمنا، يرجى الاشتراك في قناتنا على يوتيوب ثم المتابعة إلى اللعبة."
              };
      }
  }
  
  const { title, description } = renderContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 opacity-100 animate-scale-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="text-gray-600 mb-6 min-h-[120px] flex flex-col justify-center">{description}</div>
        <div className="flex flex-col gap-3">
          
          {step === 'initial' && (
              <button onClick={handleSubscribeClick} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  الاشتراك في يوتيوب
              </button>
          )}

          {step === 'confirming' && (
              <button onClick={handleOpenYoutubeAndStartTimer} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  افتح يوتيوب وابدأ العد
              </button>
          )}

           <button
            onClick={handleProceedClick}
            disabled={step !== 'ready'}
            className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-sky-300 disabled:cursor-not-allowed"
          >
            لقد اشتركت، افتح اللعبة
          </button>
          <button
            onClick={handleClose}
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