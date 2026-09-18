import React from 'react';
import { ChildSkillsStats } from '../../types/childSkillsTypes';
import { SKILL_BADGES } from '../../data/childSkillsGamesData';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ChildSkillsStats;
}

export const ChildSkillsAchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 via-white to-sky-50 rounded-3xl p-5 sm:p-6 shadow-2xl border-4 border-amber-300 max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 w-10 h-10 bg-white/90 hover:bg-red-50 text-gray-700 hover:text-red-500 rounded-full flex items-center justify-center font-bold text-xl shadow-md border border-gray-200 transition-transform active:scale-90"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center pt-2 pb-4">
          <div className="inline-block p-3 bg-amber-100 rounded-full text-4xl sm:text-5xl mb-2 shadow-inner animate-bounce">
            🏆
          </div>
          <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            إنجازاتي وأوسمتي
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-bold mt-1">
            أنت رائع يا بطل! واصل التحدي لتجمع كل النجوم وتصبح ملك المهارات ⭐
          </p>
        </div>

        {/* Highlight Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-center">
          <div className="bg-amber-100/80 border-2 border-amber-300 rounded-2xl p-2.5 shadow-xs">
            <span className="text-2xl block mb-0.5">⭐</span>
            <div className="text-xl sm:text-2xl font-black text-amber-900">{stats.totalStars}</div>
            <div className="text-[11px] font-bold text-amber-700">نجومي</div>
          </div>
          <div className="bg-sky-100/80 border-2 border-sky-300 rounded-2xl p-2.5 shadow-xs">
            <span className="text-2xl block mb-0.5">🎮</span>
            <div className="text-xl sm:text-2xl font-black text-sky-900">
              {stats.completedGamesCount} / 40
            </div>
            <div className="text-[11px] font-bold text-sky-700">الألعاب المكتملة</div>
          </div>
          <div className="bg-purple-100/80 border-2 border-purple-300 rounded-2xl p-2.5 shadow-xs">
            <span className="text-2xl block mb-0.5">🏅</span>
            <div className="text-xl sm:text-2xl font-black text-purple-900">
              {stats.badges.length} / {SKILL_BADGES.length}
            </div>
            <div className="text-[11px] font-bold text-purple-700">شاراتي</div>
          </div>
          <div className="bg-rose-100/80 border-2 border-rose-300 rounded-2xl p-2.5 shadow-xs">
            <span className="text-2xl block mb-0.5">🔥</span>
            <div className="text-xl sm:text-2xl font-black text-rose-900">{stats.streak}</div>
            <div className="text-[11px] font-bold text-rose-700">أيام التتابع</div>
          </div>
        </div>

        {/* Badges List */}
        <div className="space-y-3">
          <h3 className="text-sm sm:text-base font-black text-gray-800 flex items-center gap-1.5">
            <span>🎖️ قائمة الشارات والأوسمة:</span>
          </h3>

          <div className="space-y-2.5">
            {SKILL_BADGES.map((badge) => {
              const isUnlocked = stats.badges.includes(badge.id);
              const progressPct = Math.min(
                100,
                Math.round((stats.completedGamesCount / badge.minGames) * 100)
              );

              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-3.5 p-3 rounded-2xl border-2 transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-100 border-amber-400 shadow-sm'
                      : 'bg-gray-50 border-gray-200 opacity-75'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-xs shrink-0 ${
                      isUnlocked
                        ? 'bg-amber-300 text-amber-950 ring-2 ring-amber-400 animate-pulse'
                        : 'bg-gray-200 text-gray-400 grayscale'
                    }`}
                  >
                    {badge.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-sm font-black truncate ${
                          isUnlocked ? 'text-amber-950' : 'text-gray-700'
                        }`}
                      >
                        {badge.title}
                      </h4>
                      {isUnlocked ? (
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                          مكتملة ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-500 shrink-0">
                          {stats.completedGamesCount} / {badge.minGames} لعبة
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium mt-0.5 truncate">
                      {badge.description}
                    </p>

                    {/* Progress Bar */}
                    {!isUnlocked && (
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Return / Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            العودة إلى الألعاب 🎮
          </button>
        </div>
      </div>
    </div>
  );
};
