import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHILD_SKILLS_GAMES } from '../data/childSkillsGamesData';
import { ChildSkillsStats, GameCategory } from '../types/childSkillsTypes';
import { getChildSkillsStats } from '../utils/childSkillsStorage';
import { ChildSkillsAchievementsModal } from '../components/child-skills/ChildSkillsAchievementsModal';

const CATEGORIES: { id: GameCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'الكل', icon: '🌟' },
  { id: 'visual', label: 'تمييز بصري', icon: '👁️' },
  { id: 'logic', label: 'تفكير ومنطق', icon: '🧩' },
  { id: 'math', label: 'عد وحساب', icon: '🔢' },
  { id: 'language', label: 'حروف ولغة', icon: '🔤' },
  { id: 'science', label: 'علوم وطبيعة', icon: '🌱' },
  { id: 'social', label: 'حياة ومجتمع', icon: '🏠' },
];

const ChildSkillsHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ChildSkillsStats>(getChildSkillsStats());
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'all'>('all');
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // Sync stats when updated
  useEffect(() => {
    const handleUpdate = () => {
      setStats(getChildSkillsStats());
    };
    window.addEventListener('child_skills_stats_updated', handleUpdate);
    return () => window.removeEventListener('child_skills_stats_updated', handleUpdate);
  }, []);

  // Filter games
  const filteredGames = useMemo(() => {
    if (selectedCategory === 'all') return CHILD_SKILLS_GAMES;
    return CHILD_SKILLS_GAMES.filter((g) => g.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-pink-50 py-6 sm:py-10 px-3 sm:px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Back to main home */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-sky-200 text-sky-800 rounded-2xl font-black text-xs sm:text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <span>🏠 العودة للرئيسية</span>
          </button>

          {/* Achievements Trigger Button */}
          <button
            onClick={() => setIsAchievementsOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black text-xs sm:text-sm rounded-2xl shadow-md border border-amber-300 transition-transform active:scale-95 cursor-pointer animate-pulse"
          >
            <span>🏆 إنجازاتي وشاراتي</span>
          </button>
        </div>

        {/* 🌈 Top Header */}
        <div className="text-center py-4 sm:py-6 mb-4">
          <div className="inline-block p-2 sm:p-3 bg-white/80 backdrop-blur-xs rounded-3xl border-2 border-amber-200 shadow-sm mb-3">
            <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-500 via-pink-500 to-sky-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <span>🌈</span>
              <span>مهارات طفلي الصغير</span>
            </h1>
          </div>
          <p className="text-base sm:text-xl font-black text-sky-900 drop-shadow-xs">
            العب وتعلّم وطوّر مهاراتك! ⭐
          </p>
          <p className="text-xs sm:text-sm text-gray-600 font-bold mt-1">
            40 لعبة تفاعلية تعليمية، في كل لعبة 50 مرحلة دون أي تكرار! ⭐
          </p>
        </div>

        {/* 📊 Star & Badge Stats Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-3 sm:p-5 shadow-md border-3 border-amber-200 mb-8 grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="p-2 sm:p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl">⭐</span>
            <div>
              <div className="text-base sm:text-xl font-black text-amber-900">{stats.totalStars}</div>
              <div className="text-[10px] sm:text-xs font-bold text-amber-700">نجومي</div>
            </div>
          </div>

          <div className="p-2 sm:p-3 bg-purple-50/80 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl">🏅</span>
            <div>
              <div className="text-base sm:text-xl font-black text-purple-900">{stats.badges.length}</div>
              <div className="text-[10px] sm:text-xs font-bold text-purple-700">شاراتي</div>
            </div>
          </div>

          <div className="p-2 sm:p-3 bg-sky-50/80 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl">🎮</span>
            <div>
              <div className="text-base sm:text-xl font-black text-sky-900">
                {stats.completedGamesCount} / 40
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-sky-700">ألعابي المكتملة</div>
            </div>
          </div>
        </div>

        {/* 🎯 Categories Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md scale-102 ring-2 ring-sky-300'
                    : 'bg-white hover:bg-sky-50 text-gray-700 border border-sky-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 🎮 The 40 Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredGames.map((game) => {
            const prog = stats.gamesProgress[game.id];
            const isCompleted = prog?.completed;
            const stars = prog?.stars || 0;
            // Progressive unlocking: first 10 games unlocked, then unlocked as child completes games
            const isUnlocked = stats.completedGamesCount >= game.minUnlockGames || game.minUnlockGames === 0;

            return (
              <div
                key={game.id}
                onClick={() => {
                  if (isUnlocked) {
                    navigate(`/my-child-skills/${game.id}`);
                  }
                }}
                className={`relative rounded-3xl p-4 sm:p-5 flex flex-col justify-between border-3 transition-all select-none ${
                  isUnlocked
                    ? 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-sky-50/50 border-sky-200 hover:border-sky-400 shadow-sm hover:shadow-lg cursor-pointer transform hover:-translate-y-1 active:scale-98'
                    : 'bg-gray-100/80 border-gray-300 opacity-65 cursor-not-allowed'
                }`}
              >
                {/* Number Badge */}
                <div className="absolute top-3 left-3 bg-sky-100 text-sky-800 text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center border border-sky-200">
                  {game.id}
                </div>

                {/* Stars / Lock Status & 50 Stages Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  {!isUnlocked ? (
                    <span className="bg-gray-200 text-gray-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-gray-300 flex items-center gap-1">
                      <span>🔒</span>
                      <span>{game.minUnlockGames} لعبة</span>
                    </span>
                  ) : (
                    <span className="bg-sky-50 text-sky-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-sky-200 flex items-center gap-0.5">
                      {prog?.completedStages && prog.completedStages.length > 0 ? (
                        <>
                          <span className="text-amber-500">⭐</span>
                          <span>{prog.completedStages.length}/50</span>
                        </>
                      ) : (
                        <span>50 مرحلة</span>
                      )}
                    </span>
                  )}
                </div>

                {/* Big Game Icon */}
                <div className="my-2 flex flex-col items-center justify-center">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-5xl sm:text-6xl shadow-sm mb-2 transition-transform ${
                      isUnlocked ? 'bg-gradient-to-br from-amber-50 to-sky-50 group-hover:scale-105' : 'bg-gray-200 grayscale'
                    }`}
                  >
                    <span role="img" aria-label={game.title}>
                      {game.icon}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-gray-900 text-center leading-tight">
                    {game.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-bold text-center mt-1 line-clamp-2">
                    {game.shortDesc}
                  </p>
                </div>

                {/* Skill pill & Action button */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {game.skill}
                  </span>

                  <button
                    disabled={!isUnlocked}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs shadow-xs transition-transform ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white active:scale-95'
                        : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    {isCompleted ? 'العب ثانية ↺' : 'ابدأ اللعب 🎮'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🏆 Achievements Modal */}
      <ChildSkillsAchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        stats={stats}
      />
    </div>
  );
};

export default ChildSkillsHomePage;
