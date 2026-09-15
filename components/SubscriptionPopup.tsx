import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Game } from '../types';
import { VideoCameraIcon, StarIcon } from './Icons';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed: () => void;
  game?: Game | null;
  isVideoRequiredGame?: boolean;
}

// Helper to extract YouTube embed URL if a video ID is present
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0&playsinline=1`;
  }
  return null;
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

  const [step, setStep] = useState<'initial' | 'waiting' | 'ready'>('initial');
  const [countdown, setCountdown] = useState<number>(waitDuration);
  const [activeUrl, setActiveUrl] = useState<string>('');
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // Pick target YouTube URL
  const pickTargetUrl = (): string => {
    let target = settings.subscriptionUrl?.trim() || 'https://www.youtube.com/@mkstudio_963';
    const urls = (settings.youtubeUrls || '')
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    if (urls.length > 0) {
      target = urls[Math.floor(Math.random() * urls.length)];
    }
    return target;
  };

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      const url = pickTargetUrl();
      setActiveUrl(url);
      setEmbedUrl(getYouTubeEmbedUrl(url));
      setCountdown(waitDuration);
      setStep('initial');
      startTimeRef.current = null;
    }
  }, [isOpen, waitDuration]);

  // Recalculate time accurately when returning from external app or background in WebView
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (startTimeRef.current && step === 'waiting') {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = Math.max(0, waitDuration - elapsed);
        setCountdown(remaining);
        if (remaining === 0) {
          setStep('ready');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [step, waitDuration]);

  // Regular 1-second interval timer
  useEffect(() => {
    if (isOpen && step === 'waiting' && countdown > 0) {
      timerRef.current = window.setTimeout(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const remaining = Math.max(0, waitDuration - elapsed);
          setCountdown(remaining);
          if (remaining === 0) {
            setStep('ready');
          }
        } else {
          setCountdown((c) => {
            if (c <= 1) {
              setStep('ready');
              return 0;
            }
            return c - 1;
          });
        }
      }, 1000);
    } else if (countdown === 0 && step === 'waiting') {
      setStep('ready');
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, step, countdown, waitDuration]);

  if (!isOpen) return null;

  // Safe external window open without replacing current WebView page
  const openExternalLink = (url: string) => {
    try {
      // In Android WebView, window.open might be blocked or navigate current frame.
      // Creating an anchor with target="_blank" and rel="noopener noreferrer" is the safest standard.
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleStartWatchOrSubscribe = (openExternal: boolean = false) => {
    startTimeRef.current = Date.now();
    setCountdown(waitDuration);
    setStep('waiting');

    // Save state to sessionStorage in case Android destroys/recreates the activity
    if (game) {
      try {
        sessionStorage.setItem('toysGamePendingGameId', game.id.toString());
        sessionStorage.setItem('toysGamePendingStartTime', Date.now().toString());
      } catch (e) {
        console.error(e);
      }
    }

    if (openExternal && activeUrl) {
      openExternalLink(activeUrl);
    }
  };

  const handleComplete = () => {
    try {
      sessionStorage.removeItem('toysGamePendingGameId');
      sessionStorage.removeItem('toysGamePendingStartTime');
    } catch {}

    if (isVideoRequiredGame && game) {
      unlockVideoGame(game.id);
    } else {
      setIsSubscribed(true);
    }
    onSubscribed();
  };

  const progressPercent = Math.min(100, Math.round(((waitDuration - countdown) / waitDuration) * 100));

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-7 max-w-lg w-full text-center border-4 border-sky-300 transform animate-scale-up relative my-auto">
        {/* Decorative header badge */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-tr from-red-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
          {isVideoRequiredGame ? <VideoCameraIcon /> : <StarIcon />}
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-2">
          {isVideoRequiredGame
            ? `مشاهدة فيديو لفتح: ${game?.name || 'اللعبة'}`
            : 'اشترك بقناتنا لفتح جميع الألعاب!'}
        </h2>

        {/* Content body */}
        <div className="text-gray-600 mb-5 text-sm sm:text-base">
          {step === 'initial' && (
            <div className="space-y-3">
              {isVideoRequiredGame ? (
                <>
                  <p className="font-semibold text-gray-700">
                    هذه اللعبة مميزة وتتطلب مشاهدة فيديو قصير لمدة <span className="font-bold text-sky-600">{waitDuration} ثانية</span>.
                  </p>
                  <p className="text-xs text-gray-500">
                    يمكنك المشاهدة هنا مباشرة دون مغادرة اللعبة أو فتحها في تطبيق خارجي.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-700">
                    اشترك مرة واحدة في قناتنا على يوتيوب واستمتع بجميع الألعاب مفتوحة دائماً!
                  </p>
                  <p className="text-xs text-gray-500">
                    مهلة التأكيد: <span className="font-bold text-sky-600">{waitDuration} ثانية</span> فقط.
                  </p>
                </>
              )}
            </div>
          )}

          {step === 'waiting' && (
            <div className="w-full space-y-3">
              {/* If YouTube video embed is available, show in-app player */}
              {embedUrl && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-black">
                  <iframe
                    src={embedUrl}
                    title="YouTube Player"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div>
                <p className="font-bold text-sky-700 text-sm sm:text-base mb-1">
                  {isVideoRequiredGame ? 'جاري المشاهدة ودعم القناة... 🌟' : 'جاري تأكيد الاشتراك... 🌟'}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3.5 sm:h-4 mb-2 overflow-hidden border border-gray-300">
                  <div
                    className="bg-gradient-to-r from-red-500 to-sky-500 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold px-1">
                  <span className="text-gray-500">المدة الكلية: {waitDuration} ثانية</span>
                  <span className="text-red-600 font-mono text-base font-black animate-pulse">
                    متبقي: {countdown} ث
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 'ready' && (
            <div className="text-green-600 font-bold flex flex-col items-center gap-1.5 animate-bounce my-2">
              <span className="text-4xl">🎉</span>
              <p className="text-base sm:text-lg text-gray-800 font-black">شكراً جزيلاً لبطلنا الرائع!</p>
              <p className="text-sm text-green-600 font-bold">تم اكتمال المدة وفتح اللعبة بنجاح.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {step === 'initial' && (
            <>
              {/* Main action: Start inside or open external */}
              <button
                type="button"
                onClick={() => handleStartWatchOrSubscribe(true)}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                <span>{isVideoRequiredGame ? 'مشاهدة الفيديو في نافذة / تطبيق خارجي' : 'الاشتراك في يوتيوب وبدء العداد'}</span>
                <span>↗</span>
              </button>

              {/* Option to watch inside the app without leaving */}
              <button
                type="button"
                onClick={() => handleStartWatchOrSubscribe(false)}
                className="w-full bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold py-2.5 px-4 rounded-xl transition-colors text-xs sm:text-sm"
              >
                ▶ المشاهدة وبدء العداد هنا داخل التطبيق
              </button>
            </>
          )}

          {step === 'waiting' && (
            <>
              {/* Option to open in external tab if user wants */}
              <button
                type="button"
                onClick={() => openExternalLink(activeUrl)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold py-2 px-3 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5"
              >
                <span>فتح الرابط في تطبيق YouTube الخارجي</span>
                <span>↗</span>
              </button>

              <button
                disabled
                className="w-full bg-gray-200 text-gray-500 font-bold py-2.5 px-4 rounded-xl cursor-not-allowed text-xs sm:text-sm"
              >
                يرجى الانتظار حتى انتهاء العداد... ({countdown})
              </button>
            </>
          )}

          {step === 'ready' && (
            <button
              type="button"
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-3.5 px-4 rounded-xl shadow-lg transition-transform active:scale-95 text-base sm:text-lg animate-pulse"
            >
              الدخول واللعب الآن! 🚀
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-xl transition-colors text-xs sm:text-sm"
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
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SubscriptionPopup;
