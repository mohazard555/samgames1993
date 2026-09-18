import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CHILDREN_STORIES } from '../data/childrenStoriesData';
import { getStoriesProgress } from '../utils/storiesStorage';
import { StoriesProgress } from '../types/storiesTypes';

const StoriesHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<StoriesProgress>(getStoriesProgress);

  useEffect(() => {
    const handleUpdate = () => {
      setProgress(getStoriesProgress());
    };
    window.addEventListener('stories_progress_updated', handleUpdate);
    return () => window.removeEventListener('stories_progress_updated', handleUpdate);
  }, []);

  const completedCount = progress.completedStoryIds.length;
  const progressPercent = Math.round((completedCount / CHILDREN_STORIES.length) * 100);

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-purple-50/70 via-pink-50/40 to-sky-50/60" dir="rtl">
      {/* Top Header Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <span>🏠 الرئيسية</span>
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                قصص الأطفال المصورة
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/my-child-skills"
              className="px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold transition-all flex items-center gap-1"
            >
              <span>🌟 مهارات طفلي</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 pt-6 max-w-5xl">
        {/* Hero Banner */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black mb-3 border border-purple-200">
            <span>✨ قراءة تفاعلية مصورة وممتعة</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">
            حكايات ممتعة ومغامرات هادفة 🎈
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            {CHILDREN_STORIES.length} قصة مصورة ممتعة لكل قصة 10 مشاهد هادفة، تغرس قيم الصبر، الشجاعة، العناية بالطبيعة، الكرم والمشاركة، وفضول الاستكشاف!
          </p>

          {/* Progress Card */}
          <div className="mt-6 max-w-md mx-auto bg-white/95 rounded-2xl p-4 border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <span>🏆 إنجاز القراءة:</span>
                <span className="text-purple-700 font-black">{completedCount} من {CHILDREN_STORIES.length} قصة</span>
              </span>
              <span className="text-purple-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CHILDREN_STORIES.map((story) => {
            const isCompleted = progress.completedStoryIds.includes(story.id);
            const lastScene = progress.lastReadScene[story.id] || 1;
            const hasStarted = (progress.lastReadScene[story.id] || 0) > 1;

            return (
              <div
                key={story.id}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${story.colorTheme.badgeBg}`}>
                      {story.number === 1 && 'القصة الأولى'}
                      {story.number === 2 && 'القصة الثانية'}
                      {story.number === 3 && 'القصة الثالثة'}
                      {story.number === 4 && 'القصة الرابعة'}
                      {story.number === 5 && 'القصة الخامسة'}
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span>✓ مكتملة</span>
                        <span>⭐</span>
                      </span>
                    ) : hasStarted ? (
                      <span className="text-[11px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                        المشهد {lastScene} من 10
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
                        10 مشاهد
                      </span>
                    )}
                  </div>

                  {/* Character Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                      {story.characterIcon}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-gray-900 leading-snug group-hover:text-purple-700 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-xs text-purple-700 font-bold mt-1">
                        🌱 {story.moral}
                      </p>
                    </div>
                  </div>

                  {/* Character description */}
                  <div className="bg-gray-50/80 rounded-xl p-2.5 text-[11px] text-gray-600 mb-4 border border-gray-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="text-gray-400">البطل:</span>
                      <span className="font-bold text-gray-800">{story.characterDesc.name}</span>
                    </div>
                    <div className="text-gray-500 leading-relaxed line-clamp-2">
                      {story.characterDesc.clothing} • {story.characterDesc.features}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => navigate(`/stories/${story.id}`)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-xs ${
                    isCompleted
                      ? 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <span>📖 قراءة القصة مجدداً</span>
                    </>
                  ) : hasStarted ? (
                    <>
                      <span>متابعة القراءة (مشهد {lastScene})</span>
                      <span>➜</span>
                    </>
                  ) : (
                    <>
                      <span>ابدأ قراءة القصة</span>
                      <span>🚀</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-xs sm:text-sm shadow-xs hover:bg-gray-50 transition-colors"
          >
            <span>🏠 العودة إلى قائمة الألعاب الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoriesHomePage;
