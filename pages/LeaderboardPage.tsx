import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

export const LeaderboardPage: React.FC = () => {
  const { settings } = useSettings();
  const results = settings.skillTestResults || [];

  // Sort by score descending, then percentage
  const sortedResults = [...results].sort((a, b) => b.score - a.score || b.percentage - a.percentage);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 px-4 animate-fade-in">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-6 sm:p-8 rounded-3xl text-white shadow-xl text-center relative overflow-hidden">
        <div className="text-6xl sm:text-7xl mb-2 animate-bounce">🏆</div>
        <h1 className="text-2xl sm:text-4xl font-black mb-1">لوحة شرف الأبطال العالمية</h1>
        <p className="text-amber-100 text-xs sm:text-sm">
          أبطال تحدي "اختبر مهاراتك" (50 سؤالاً) من جميع أنحاء العالم!
        </p>
      </div>

      {/* Action / Banner */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs sm:text-sm font-bold text-gray-700">
          هل تريد إرسال نتيجتك والانضمام إلى لوحة الشرف؟ خض التحدي الآن!
        </p>
        <Link
          to="/skill-test"
          className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-black py-2.5 px-6 rounded-xl shadow transition-transform active:scale-95 text-xs sm:text-sm"
        >
          🧠 ابدأ تحدي اختبر مهاراتك الآن
        </Link>
      </div>

      {sortedResults.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-md border border-gray-200 text-center space-y-4">
          <span className="text-6xl block">🏅</span>
          <h3 className="text-xl font-black text-gray-800">لا توجد نتائج مسجلة حتى الآن</h3>
          <p className="text-gray-500 text-sm">كن أول البطل الأبطال الذين ينهون التحدي ويسجلون أسماءهم هنا!</p>
          <div className="pt-2">
            <Link
              to="/skill-test"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-xl shadow cursor-pointer"
            >
              ابدأ التحدي الآن
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedResults.map((res, index) => {
            const isTop3 = index < 3;
            const rankBadge = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;

            return (
              <div
                key={res.id}
                className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  isTop3
                    ? 'bg-gradient-to-r from-amber-50/80 via-yellow-50/50 to-white border-amber-300 shadow-md scale-101'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-xl sm:text-2xl font-black shrink-0 shadow-sm">
                    {rankBadge}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-gray-800 flex items-center gap-2">
                      <span>{res.name}</span>
                      {res.country && (
                        <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                          📍 {res.country}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 font-bold mt-0.5">
                      العمر: {res.age} • تاريخ الإنجاز: {res.createdAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-black text-amber-700">
                      {res.score} / {res.total}
                    </div>
                    <div className="text-xs font-extrabold text-emerald-600">النسبة: {res.percentage}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
