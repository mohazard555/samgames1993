import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SMART_CHALLENGES_GAMES } from '../data/smartChallengesData';
import { SmartChallengeCategory } from '../types/smartChallengesTypes';
import { getSmartChallengesStats } from '../utils/smartChallengesStorage';

export const SmartChallengesHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(getSmartChallengesStats());
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'general' | 'time'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync stats when updated
  useEffect(() => {
    const handleUpdate = () => {
      setStats(getSmartChallengesStats());
    };
    window.addEventListener('smart_challenges_stats_updated', handleUpdate);
    return () => window.removeEventListener('smart_challenges_stats_updated', handleUpdate);
  }, []);

  // Filter games
  const filteredGames = useMemo(() => {
    return SMART_CHALLENGES_GAMES.filter((game) => {
      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'general' && game.category === 'general') ||
        (selectedFilter === 'time' && game.category === 'time');

      const matchesSearch =
        !searchQuery ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.skill.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchQuery]);

  // Separate games for sectioned display if 'all' is chosen
  const generalGames = useMemo(
    () => SMART_CHALLENGES_GAMES.filter((g) => g.category === 'general'),
    []
  );
  const timeGames = useMemo(
    () => SMART_CHALLENGES_GAMES.filter((g) => g.category === 'time'),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-pink-50 py-6 sm:py-10 px-3 sm:px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Top Back & Header Bar */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-sky-200 text-sky-800 rounded-2xl font-black text-xs sm:text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <span>🏠 العودة للرئيسية</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 border border-amber-300 rounded-2xl text-xs font-black text-amber-900 shadow-xs">
            <span>⭐ {stats.totalStars} نجمة</span>
            <span>•</span>
            <span>🏆 {stats.completedGamesCount}/50 مكتملة</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center py-4 sm:py-6 mb-4">
          <div className="inline-block p-2 sm:p-3 bg-white/90 backdrop-blur-xs rounded-3xl border-3 border-amber-300 shadow-md mb-3">
            <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <span>🌟</span>
              <span>عالم التحديات الذكية</span>
              <span>🧩</span>
            </h1>
          </div>
          <p className="text-base sm:text-xl font-black text-indigo-950 drop-shadow-xs">
            50 لعبة تفاعلية تعليمية تنمي العبقرية وسرعة البديهة! 🚀
          </p>
          <p className="text-xs sm:text-sm text-gray-600 font-bold mt-1">
            في كل لعبة 50 سؤالاً وتحدياً مستقلاً — إجمالي 2500 تحدٍ ممتع دون تكرار! ⭐
          </p>
        </div>

        {/* Stats Row */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-3 sm:p-5 shadow-md border-3 border-amber-200 mb-6 grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="p-2 sm:p-3 bg-amber-50/90 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl">⭐</span>
            <div>
              <div className="text-base sm:text-xl font-black text-amber-900">{stats.totalStars}</div>
              <div className="text-[10px] sm:text-xs font-bold text-amber-700">نجومي المحصلة</div>
            </div>
          </div>

          <div className="p-2 sm:p-3 bg-purple-50/90 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl">🏆</span>
            <div>
              <div className="text-base sm:text-xl font-black text-purple-900">{stats.badges.length}</div>
              <div className="text-[10px] sm:text-xs font-bold text-purple-700">شارات الفوز</div>
            </div>
          </div>

          <div className="p-2 sm:p-3 bg-sky-50/90 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl">🎮</span>
            <div>
              <div className="text-base sm:text-xl font-black text-sky-900">
                {stats.completedGamesCount} / 50
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-sky-700">الألعاب المكتملة</div>
            </div>
          </div>
        </div>

        {/* Controls: Search & Category Filter Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-xs ${
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              🌟 جميع الألعاب (50)
            </button>
            <button
              onClick={() => setSelectedFilter('general')}
              className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-xs ${
                selectedFilter === 'general'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              🧩 الألعاب الذكية (1 - 40)
            </button>
            <button
              onClick={() => setSelectedFilter('time')}
              className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-xs ${
                selectedFilter === 'time'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md animate-pulse'
                  : 'bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200'
              }`}
            >
              🕐 عالم الوقت والساعة (41 - 50)
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 ابحث عن لعبة أو مهارة..."
              className="w-full px-4 py-2 bg-white rounded-2xl border-2 border-sky-200 text-xs sm:text-sm font-bold placeholder-gray-400 focus:outline-hidden focus:border-sky-500 shadow-xs"
            />
          </div>
        </div>

        {/* Section: 🕐 عالم الوقت والساعة Highlight Banner if Filter is 'time' or 'all' */}
        {(selectedFilter === 'all' || selectedFilter === 'time') && !searchQuery && (
          <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 rounded-3xl text-white shadow-xl border-3 border-cyan-400">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
                  🕐
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-cyan-300">
                    🕐 عالم الوقت والساعة
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
                    10 ألعاب خاصة ومتطورة لتعليم قراءة الساعة، مطابقة العقارب، فترات اليوم، وحساب المدة والروتين اليومي بالساعة.
                  </p>
                </div>
              </div>
              <div className="shrink-0 px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-2xl text-xs font-black text-cyan-200">
                الألعاب من 41 إلى 50 ⭐
              </div>
            </div>
          </div>
        )}

        {/* Games Grid (Large card layout with fixed icons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredGames.map((game) => {
            const prog = stats.gamesProgress[game.id];
            const completedCount = prog ? prog.completedQuestions.length : 0;
            const isCompleted = prog?.isCompleted || false;

            return (
              <div
                key={game.id}
                onClick={() => navigate(`/smart-challenges/${game.id}`)}
                className={`group relative bg-white/95 rounded-3xl p-4 sm:p-5 border-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-98 cursor-pointer flex flex-col justify-between ${
                  game.category === 'time'
                    ? 'border-indigo-200 hover:border-indigo-400 shadow-indigo-50'
                    : 'border-amber-200 hover:border-amber-400 shadow-amber-50'
                }`}
              >
                <div>
                  {/* Card Header Badge & Number */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      لعبة #{game.id}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        game.category === 'time'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {game.skill}
                    </span>
                  </div>

                  {/* Fixed Large Icon Display */}
                  <div className="text-center my-2">
                    <div
                      className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${game.color} flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform duration-200`}
                    >
                      {game.icon}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="text-center mt-3">
                    <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {game.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1 line-clamp-2 leading-relaxed h-8">
                      {game.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Card Footer: 50 Challenges & Progress */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs font-black mb-1.5">
                    <span className="text-gray-700 flex items-center gap-1">
                      <span>🎯</span>
                      <span>50 تحديًا</span>
                    </span>
                    <span
                      className={`flex items-center gap-1 ${
                        isCompleted ? 'text-emerald-600' : 'text-amber-700'
                      }`}
                    >
                      <span>⭐</span>
                      <span>التقدم: {completedCount}/50</span>
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-amber-400 to-indigo-500'
                      }`}
                      style={{ width: `${(completedCount / 50) * 100}%` }}
                    />
                  </div>

                  {/* Play Action Button */}
                  <button
                    type="button"
                    className="w-full mt-3 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{completedCount > 0 ? 'متابعة اللعب 🚀' : 'ابدأ اللعب الآن 🎮'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredGames.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border-2 border-gray-200 mt-6">
            <div className="text-4xl mb-2">🔍</div>
            <div className="text-base font-black text-gray-700">لم يتم العثور على ألعاب مطابقة لبحثك</div>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl"
            >
              عرض جميع الألعاب الـ 50
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartChallengesHomePage;
