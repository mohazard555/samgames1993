import React from 'react';

interface ChildSplashScreenProps {
  onDismiss?: () => void;
}

const ChildSplashScreen: React.FC<ChildSplashScreenProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 via-indigo-400 to-purple-500 text-white p-6 select-none overflow-hidden animate-fade-in">
      {/* Floating decorative elements */}
      <div className="absolute top-8 left-8 text-4xl sm:text-5xl animate-bounce" style={{ animationDuration: '2.5s' }}>
        🎈
      </div>
      <div className="absolute top-14 right-12 text-4xl sm:text-5xl animate-pulse" style={{ animationDuration: '3s' }}>
        ⭐
      </div>
      <div className="absolute bottom-16 left-12 text-4xl sm:text-5xl animate-bounce" style={{ animationDuration: '3.5s' }}>
        🧸
      </div>
      <div className="absolute bottom-20 right-10 text-4xl sm:text-5xl animate-pulse" style={{ animationDuration: '2s' }}>
        🚀
      </div>
      <div className="absolute top-1/4 right-6 text-3xl opacity-60 animate-bounce" style={{ animationDuration: '4s' }}>
        ☁️
      </div>
      <div className="absolute top-1/3 left-6 text-3xl opacity-60 animate-bounce" style={{ animationDuration: '4.5s' }}>
        ☁️
      </div>

      {/* Main playful card */}
      <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-4 border-yellow-300 text-gray-800 transform hover:scale-[1.01] transition-transform">
        {/* Animated Cute Icon */}
        <div className="relative mb-4 flex justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-400 flex items-center justify-center text-5xl sm:text-6xl shadow-lg border-4 border-white animate-bounce" style={{ animationDuration: '1.8s' }}>
            🎮
          </div>
          <span className="absolute -top-2 -right-2 text-3xl animate-spin" style={{ animationDuration: '6s' }}>
            ✨
          </span>
        </div>

        {/* Childish Friendly Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-purple-800 mb-2 drop-shadow-sm">
          أهلاً يا بطل الأبطال! 🌟
        </h1>

        {/* Childish Friendly Message */}
        <p className="text-base sm:text-lg font-black text-sky-700 mb-4 leading-relaxed">
          انتظر لحظة صغيرة... نجهّز لك صندوق الألعاب والمفاجآت السحرية الجديدة! 🎁✨
        </p>

        {/* Playful Loading animation */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-3.5 h-3.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-3.5 h-3.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '450ms' }}></span>
          <span className="w-3.5 h-3.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '600ms' }}></span>
        </div>

        {/* Childish fun hint */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 mb-4 text-xs sm:text-sm font-bold text-amber-800">
          🚀 نحضر لك ألعاب الذكاء، السباقات، وأصوات الحيوانات الرائعة!
        </div>

        {/* Direct entry button if network is slow */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm sm:text-base py-3 px-6 rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>🎈 ادخل للعب مباشرة</span>
            <span>←</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChildSplashScreen;
