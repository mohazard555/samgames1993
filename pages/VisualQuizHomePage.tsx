import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VISUAL_QUIZ_CATEGORIES, ALL_VISUAL_QUIZ_ITEMS } from '../data/visualQuizData';
import GoogleAdBanner from '../components/GoogleAdBanner';

interface CategoryStats {
  completed: boolean;
  score: number;
  stars: number;
}

export const VisualQuizHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Record<string, CategoryStats>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('visual_quiz_progress_v1');
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalCorrect = Object.values(stats).reduce((acc, curr) => acc + (curr.score || 0), 0);
  const totalStars = Object.values(stats).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const completedCount = Object.values(stats).filter((c) => c.completed).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      <GoogleAdBanner position="top" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner text-3xl sm:text-4xl mb-3">
          🖼️
        </div>
        <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">
          لعبة مطابقة الصور الذكية
        </h1>
        <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto font-medium">
          اختر مجموعة من المجموعات الـ 8 واكتشف الصورة المطابقة للصورة الرئيسية! أكثر من 200 سؤال ممتع وملون.
        </p>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 pt-6 border-t border-white/20">
          <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <div className="text-right">
              <div className="text-xs text-white/80 font-bold">النجوم المكتسبة</div>
              <div className="text-base sm:text-lg font-black">{totalStars}</div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div className="text-right">
              <div className="text-xs text-white/80 font-bold">الإجابات الصحيحة</div>
              <div className="text-base sm:text-lg font-black">{totalCorrect} / 200</div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <div className="text-right">
              <div className="text-xs text-white/80 font-bold">المجموعات المكتملة</div>
              <div className="text-base sm:text-lg font-black">{completedCount} / 8</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-gray-800 text-right px-2 flex items-center gap-2">
          <span>📚</span>
          <span>اختر مجموعة للبدء:</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {VISUAL_QUIZ_CATEGORIES.map((cat) => {
            const catStat = stats[cat.id];
            const isCompleted = catStat?.completed;
            const catScore = catStat?.score || 0;

            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/visual-quiz/${cat.id}`)}
                className="group bg-white rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-xl border-2 border-gray-100 hover:border-purple-300 transition-all duration-300 cursor-pointer flex flex-col justify-between transform hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Top badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl sm:text-3xl shadow-md group-hover:scale-110 transition-transform`}>
                    {cat.emoji}
                  </div>
                  <span className="text-xs font-black px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                    {cat.count} سؤالاً
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 group-hover:text-purple-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Progress / Status */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  {isCompleted ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                      <span>✓ مكتمل ({catScore}/{cat.count})</span>
                    </div>
                  ) : catScore > 0 ? (
                    <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
                      <span>قيد التقدم ({catScore}/{cat.count})</span>
                    </div>
                  ) : (
                    <div className="text-gray-400 font-bold text-xs">لم تبدأ بعد</div>
                  )}

                  <span className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black group-hover:bg-purple-700 transition-colors shadow">
                    ◀
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-2xl shadow-sm transition-all"
        >
          ← العودة للرئيسية
        </button>
      </div>

      <GoogleAdBanner position="bottom" />
    </div>
  );
};
export default VisualQuizHomePage;
