import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Game } from '../types';
import { VideoCameraIcon, StarIcon, CheckCircleIcon } from './Icons';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed: () => void;
  game?: Game | null;
  isVideoRequiredGame?: boolean;
}

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({
  isOpen,
  onClose,
  onSubscribed,
  game,
  isVideoRequiredGame = false,
}) => {
  const { settings, setIsSubscribed, unlockVideoGame } = useSettings();
  const waitDuration = Math.max(3, settings.videoWaitTime || 15);

  const [step, setStep] = useState<'initial' | 'confirming' | 'waiting' | 'ready'>('initial');
  const [countdown, setCountdown] = useState<number>(waitDuration);
  const timerRef = useRef<number | null>(null);

  // Sync initial countdown with settings
  useEffect(() => {
    if (isOpen) {
      setCountdown(waitDuration);
      setStep('initial');
    }
  }, [isOpen, waitDuration]);

  // Countdown timer logic
  useEffect(() => {
    if (isOpen && step === 'waiting' && countdown > 0) {
      timerRef.current = window.setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (countdown === 0 && step === 'waiting') {
      setStep('ready');
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, step, countdown]);

  if (!isOpen) return null;

  const handleOpenVideoAndStartTimer = () => {
    let urlToOpen = settings.subscriptionUrl?.trim();
    const urls = (settings.youtubeUrls || '')
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    if (urls.length > 0) {
      urlToOpen = urls[Math.floor(Math.random() * urls.length)];
    }

    if (urlToOpen) {
      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
    }
    setCountdown(waitDuration);
    setStep('waiting');
  };

  const handleComplete = () => {
    if (isVideoRequiredGame && game) {
      unlockVideoGame(game.id);
    } else {
      setIsSubscribed(true);
    }
    onSubscribed();
  };

  const progressPercent = Math.min(100, Math.round(((waitDuration - countdown) / waitDuration) * 100));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center border-4 border-sky-300 transform animate-scale-up relative overflow-hidden">
        {/* Decorative header badge */}
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-red-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
          {isVideoRequiredGame ? <VideoCameraIcon /> : <StarIcon />}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-gray-800 mb-2">
          {isVideoRequiredGame
            ? `مشاهدة فيديو لفتح: ${game?.name || 'اللعبة'}`
            : 'اشترك بقناتنا لفتح جميع الألعاب!'}
        </h2>

        {/* Subtitle / Details */}
        <div className="text-gray-600 mb-6 text-sm md:text-base min-h-[90px] flex flex-col items-center justify-center">
          {step === 'initial' && (
            <div>
              {isVideoRequiredGame ? (
                <>
                  <p className="font-semibold text-gray-700">هذه اللعبة مميزة وتتطلب مشاهدة فيديو قصير لفتحها.</p>
                  <p className="mt-1 text-xs text-gray-500">
                    مهلة الانتظار: <span className="font-bold text-sky-600">{waitDuration} ثانية</span> فقط.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-700">
                    اشترك مرة واحدة في قناتنا على يوتيوب واستمتع بجميع الألعاب دون ظهور هذا الإشعار مجدداً!
                  </p>
                  <p className="mt-1 text-xs text-gray-500">دعمك لنا يساعدنا في إضافة ألعاب جديدة يومياً.</p>
                </>
              )}
            </div>
          )}

          {step === 'waiting' && (
            <div className="w-full">
              <p className="font-bold text-sky-700 mb-2">جاري مشاهدة الفيديو ودعم القناة... 🌟</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden border border-gray-300">
                <div
                  className="bg-gradient-to-r from-red-500 to-sky-500 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-2xl font-mono font-black text-red-600 animate-pulse">
                تبقى {countdown} ثانية
              </p>
            </div>
          )}

          {step === 'ready' && (
            <div className="text-green-600 font-bold flex flex-col items-center gap-1 animate-bounce">
              <span className="text-3xl">🎉</span>
              <p className="text-base text-gray-800">شكراً جزيلاً لدعمك الرائع!</p>
              <p className="text-sm text-green-600">تم فتح اللعبة الآن بنجاح.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {step === 'initial' && (
            <button
              onClick={handleOpenVideoAndStartTimer}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-lg"
            >
              <span>{isVideoRequiredGame ? 'مشاهدة الفيديو وبدء العداد' : 'الاشتراك في يوتيوب وبدء العداد'}</span>
              <span>▶</span>
            </button>
          )}

          {step === 'waiting' && (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-4 rounded-xl cursor-not-allowed"
            >
              يرجى الانتظار حتى انتهاء العداد... ({countdown})
            </button>
          )}

          {step === 'ready' && (
            <button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-transform active:scale-95 text-lg animate-pulse"
            >
              الدخول واللعب الآن! 🚀
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl transition-colors text-sm"
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
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.25s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.25s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SubscriptionPopup;
