import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getZoneMeta,
  getQuestionsForGame,
  recordChallengeResult,
  loadIslandProgress,
  ADVENTURE_ISLAND_ZONES,
} from '../data/adventureIslandData';
import { IslandQuestion, IslandOption, IslandZoneMeta } from '../types/adventureIslandTypes';

export const AdventureIslandGamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const id = parseInt(gameId || '1', 10);
  const zoneMeta: IslandZoneMeta | undefined = useMemo(() => getZoneMeta(id), [id]);
  const questions: IslandQuestion[] = useMemo(() => getQuestionsForGame(id), [id]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [shakeKey, setShakeKey] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);

  // Memory inspection state for observation games
  const [memoryRevealed, setMemoryRevealed] = useState<boolean>(true);

  useEffect(() => {
    // Scroll to top on load or question change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setShowHint(false);
    setShowCelebration(false);
    setMemoryRevealed(true);
  }, [currentIndex, id]);

  const currentQ: IslandQuestion | undefined = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (opt: IslandOption) => {
    if (isAnswerChecked && isCorrect) return; // already solved correctly

    setSelectedOptionId(opt.id);
    setIsAnswerChecked(true);

    if (opt.isCorrect) {
      setIsCorrect(true);
      setShowCelebration(true);
      const newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);

      // Record star progress
      recordChallengeResult(id, currentIndex + 1, true);

      // Automatically transition to next after a gentle delay
      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setShowCompletionModal(true);
        }
      }, 1300);
    } else {
      setIsCorrect(false);
      setShakeKey((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setShowCompletionModal(false);
  };

  const handleNextZone = () => {
    const nextId = id < 24 ? id + 1 : 1;
    navigate(`/adventure-island/${nextId}`);
  };

  if (!zoneMeta || !currentQ) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md">
          <div className="text-5xl mb-4">🏝️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">منطقة غير موجودة</h2>
          <p className="text-gray-500 text-sm mb-4">الرجاء العودة إلى خريطة الجزيرة الرئيسية.</p>
          <Link
            to="/adventure-island"
            className="inline-block bg-teal-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
          >
            العودة إلى الجزيرة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-teal-100 to-amber-50 pb-20 text-gray-800">
      {/* Top Header Bar */}
      <div className="bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-md border-b border-teal-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Back to Island */}
          <Link
            to="/adventure-island"
            className="flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black transition-colors border border-teal-200"
          >
            <span>🏝️</span>
            <span>خريطة الجزيرة</span>
          </Link>

          {/* Zone Title & Icon */}
          <div className="flex items-center gap-2 text-right">
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm bg-gradient-to-br ${zoneMeta.color} text-white`}
            >
              {zoneMeta.icon}
            </div>
            <div>
              <h1 className="text-xs sm:text-base font-black text-gray-900 leading-tight">
                {zoneMeta.name}
              </h1>
              <div className="text-[10px] sm:text-xs font-bold text-teal-700">
                {zoneMeta.gameTitle}
              </div>
            </div>
          </div>

          {/* Challenge Counter & Stars */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1 border border-amber-300">
              <span>⭐</span>
              <span>{correctCount}</span>
            </div>

            <button
              onClick={() => setShowHint(!showHint)}
              className={`px-3 py-1 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1 border ${
                showHint
                  ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm'
                  : 'bg-yellow-50 text-amber-700 border-amber-200 hover:bg-yellow-100'
              }`}
              title="تلميح ذكي"
            >
              <span>💡</span>
              <span className="hidden sm:inline">تلميح</span>
            </button>
          </div>
        </div>

        {/* Challenge Progress Bar */}
        <div className="w-full bg-teal-100 h-2">
          <div
            className="bg-gradient-to-r from-amber-400 to-teal-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Challenge Arena */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Challenge Badge & Step indicator */}
        <div className="flex items-center justify-between mb-3 text-xs sm:text-sm font-black text-teal-900">
          <span className="bg-white/90 px-3 py-1 rounded-full shadow-sm border border-teal-200 flex items-center gap-1">
            <span>🎯 التحدي:</span>
            <span className="text-amber-600 font-black">{currentIndex + 1}</span>
            <span>من 50</span>
          </span>
          <span className="bg-white/90 px-3 py-1 rounded-full shadow-sm border border-teal-200">
            {zoneMeta.skill}
          </span>
        </div>

        {/* Question Card */}
        <div
          key={shakeKey}
          className={`bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-4 transition-all duration-300 relative ${
            isAnswerChecked && isCorrect
              ? 'border-emerald-400 ring-4 ring-emerald-200'
              : isAnswerChecked && !isCorrect
              ? 'border-rose-400 animate-wiggle'
              : 'border-amber-300'
          }`}
        >
          {/* Prompt */}
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-relaxed max-w-2xl mx-auto">
              {currentQ.prompt}
            </h2>
          </div>

          {/* Hint Drawer */}
          {showHint && (
            <div className="mb-6 bg-amber-50 border-2 border-amber-200 text-amber-900 p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 animate-fade-in">
              <span className="text-2xl">💡</span>
              <p className="flex-1 leading-relaxed">{currentQ.hint}</p>
            </div>
          )}

          {/* =========================================================================
              VISUAL GAMEPLAY DISPLAY (Tailored per game type)
              ========================================================================= */}
          <div className="mb-8">
            {/* 1. Memory Observation Scene */}
            {currentQ.type === 'memory_observe' && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-3xl p-6 border-2 border-emerald-200 text-center shadow-inner">
                {memoryRevealed ? (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-emerald-800 bg-emerald-200/60 inline-block px-3 py-1 rounded-full">
                      👀 احفظ تفاصيل مشهد: {currentQ.visualData?.sceneName}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                      {currentQ.visualData?.items?.map((item: string, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white px-5 py-3 rounded-2xl shadow-md border-2 border-emerald-300 text-lg font-black text-emerald-900 animate-bounce"
                          style={{ animationDelay: `${idx * 150}ms` }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setMemoryRevealed(false)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2 rounded-2xl text-xs sm:text-sm shadow-md transition-transform hover:scale-105"
                    >
                      أنا مستعد للإجابة! (إخفاء المشهد) 👀
                    </button>
                  </div>
                ) : (
                  <div className="py-6 space-y-3">
                    <div className="text-4xl animate-pulse">🙈</div>
                    <p className="text-sm font-black text-teal-800">
                      تم إخفاء المشهد! أين تتذكر الإجابة الصحيحة؟
                    </p>
                    <button
                      onClick={() => setMemoryRevealed(true)}
                      className="text-xs text-teal-600 underline font-bold"
                    >
                      إلقاء نظرة سريعة أخرى 👀
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. Vanished Item Shelf */}
            {currentQ.type === 'vanished_item' && (
              <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl p-6 border-2 border-amber-200 text-center shadow-inner">
                <div className="text-xs font-bold text-amber-800 mb-3">
                  الأشياء المتبقية على رف الغرفة بعد سحابة الدخان 💨
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  {currentQ.visualData?.remainingItems?.map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white px-4 py-2.5 rounded-2xl shadow border border-amber-300 text-sm sm:text-base font-black text-gray-800"
                    >
                      {item}
                    </div>
                  ))}
                  <div className="bg-dashed border-2 border-amber-400 bg-amber-100/50 px-5 py-2.5 rounded-2xl text-amber-600 font-black text-sm flex items-center gap-1 animate-pulse">
                    <span>💨</span>
                    <span>عنصر اختفى!</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Missing Number Abacus */}
            {currentQ.type === 'missing_number' && (
              <div className="bg-gradient-to-br from-lime-50 to-green-100 rounded-3xl p-6 border-2 border-lime-300 text-center shadow-inner">
                <div className="text-3xl sm:text-5xl font-black text-lime-900 tracking-wider font-mono py-2">
                  {currentQ.visualData?.equation}
                </div>
                <div className="text-xs font-bold text-lime-700 mt-2">
                  🧮 اكتشف الرقم الذي يحل المعادلة بدقة
                </div>
              </div>
            )}

            {/* 4. Dice Arena */}
            {currentQ.type === 'smart_dice' && (
              <div className="bg-gradient-to-br from-rose-50 to-red-100 rounded-3xl p-6 border-2 border-rose-300 text-center shadow-inner">
                <div className="flex items-center justify-center gap-4 py-2">
                  {currentQ.visualData?.diceValues?.map((val: number, idx: number) => (
                    <div
                      key={idx}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-3xl border-4 border-rose-500 shadow-xl flex items-center justify-center text-3xl sm:text-4xl font-black text-rose-700 transform hover:rotate-6 transition-transform"
                    >
                      {val}
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold text-rose-700 mt-3">
                  🎲 احسب نقاط أحجار النرد الظاهرة
                </div>
              </div>
            )}

            {/* 5. Bar Chart Observatory */}
            {currentQ.type === 'read_chart' && (
              <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-3xl p-6 border-2 border-sky-300 shadow-inner">
                <div className="text-center font-black text-sky-900 text-sm mb-4">
                  📊 {currentQ.visualData?.title}
                </div>
                <div className="flex items-end justify-center gap-6 sm:gap-10 h-40 pt-4 border-b-2 border-sky-300 pb-1">
                  {currentQ.visualData?.bars?.map((b: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <span className="text-xs font-black text-sky-800">{b.val}</span>
                      <div
                        className="w-10 sm:w-14 rounded-t-2xl bg-gradient-to-t from-sky-500 to-teal-400 shadow-md transition-all duration-500 hover:brightness-110"
                        style={{ height: `${Math.min(120, b.val * 8)}px` }}
                      />
                      <span className="text-xs font-black text-gray-700 whitespace-nowrap">
                        {b.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Shopping Market Stall */}
            {currentQ.type === 'shopping_cart' && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-6 border-2 border-amber-300 shadow-inner text-center">
                <div className="inline-block bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-black mb-3">
                  الميزانية: {currentQ.visualData?.budget} عملات 🪙
                </div>
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="bg-white px-4 py-3 rounded-2xl border-2 border-amber-300 shadow">
                    <div className="text-sm font-bold text-gray-800">{currentQ.visualData?.itemA}</div>
                    <div className="text-xs font-black text-amber-600">{currentQ.visualData?.priceA} عملات</div>
                  </div>
                  <span className="text-2xl font-black text-amber-600">+</span>
                  <div className="bg-white px-4 py-3 rounded-2xl border-2 border-amber-300 shadow">
                    <div className="text-sm font-bold text-gray-800">{currentQ.visualData?.itemB}</div>
                    <div className="text-xs font-black text-amber-600">{currentQ.visualData?.priceB} عملات</div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. General / Creative / Default Visual Board */}
            {!['memory_observe', 'vanished_item', 'missing_number', 'smart_dice', 'read_chart', 'shopping_cart'].includes(
              currentQ.type
            ) && (
              <div className="bg-gradient-to-br from-indigo-50 via-sky-50 to-teal-50 rounded-3xl p-6 border-2 border-teal-200 text-center shadow-inner flex flex-col items-center justify-center min-h-[140px]">
                <div className="text-5xl sm:text-6xl mb-2 animate-bounce">
                  {currentQ.visualData?.icon || zoneMeta.icon}
                </div>
                <div className="text-xs font-bold text-gray-500">
                  {zoneMeta.name} • {zoneMeta.gameTitle}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              INTERACTIVE MULTIPLE CHOICES (3 Big Touch-Friendly Buttons)
              ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnStyle =
                'bg-gray-50 hover:bg-teal-50 text-gray-800 border-2 border-gray-200 hover:border-teal-400';

              if (isAnswerChecked && isSelected) {
                if (opt.isCorrect) {
                  btnStyle =
                    'bg-emerald-500 text-white border-2 border-emerald-600 shadow-lg scale-105';
                } else {
                  btnStyle =
                    'bg-rose-500 text-white border-2 border-rose-600 shadow-lg animate-shake';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswerChecked && isCorrect}
                  className={`p-4 rounded-2xl font-black text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 min-h-[64px] shadow-sm hover:shadow-md active:scale-95 ${btnStyle}`}
                >
                  {opt.visual && <span className="text-xl">{opt.visual}</span>}
                  <span className="text-center leading-snug">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Instant Responsive Feedback */}
          {isAnswerChecked && (
            <div className="mt-6 text-center animate-fade-in">
              {isCorrect ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center justify-center gap-3">
                  <span className="text-3xl animate-spin">🌟</span>
                  <div>
                    <div className="font-black text-base">أحسنت يا بطل الجزيرة! 🎉</div>
                    <div className="text-xs font-bold text-emerald-700 mt-0.5">
                      {currentQ.explanation}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border-2 border-rose-200 text-rose-800 p-3 rounded-2xl flex items-center justify-center gap-2">
                  <span className="text-xl">💪</span>
                  <span className="font-black text-sm">حاول مرة أخرى! أنت تستطيع حلها!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          GAME COMPLETION CELEBRATION MODAL (At Challenge 50)
          ========================================================================= */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden">
            {/* Confetti & Glow */}
            <div className="text-6xl mb-3 animate-bounce">🏆</div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">أحسنت وأبدعت!</h2>
            <p className="text-sm font-bold text-teal-700 mb-6">
              لقد أكملت جميع الـ 50 تحدياً في {zoneMeta.name} بنجاح باهر!
            </p>

            {/* Scorecard */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-right">
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                <div className="text-xs text-gray-500 font-bold">النجوم المكتسبة</div>
                <div className="text-2xl font-black text-amber-600 flex items-center gap-1 mt-1">
                  <span>⭐</span>
                  <span>50 / 50</span>
                </div>
              </div>

              <div className="bg-teal-50 p-3.5 rounded-2xl border border-teal-200">
                <div className="text-xs text-gray-500 font-bold">نسبة الإنجاز</div>
                <div className="text-2xl font-black text-teal-700 mt-1">100% 🎯</div>
              </div>
            </div>

            {/* Badge Award */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-2xl mb-6 shadow-md">
              <div className="text-xs font-bold text-purple-200">وسام المنطقة المستحق:</div>
              <div className="text-lg font-black mt-1">🏅 {zoneMeta.badge}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-sm transition-colors"
              >
                🔄 العب مرة أخرى
              </button>
              <Link
                to="/adventure-island"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black text-sm shadow-md transition-transform hover:scale-105"
              >
                🏝️ العودة إلى الجزيرة
              </Link>
              <button
                onClick={handleNextZone}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm shadow-md transition-transform hover:scale-105"
              >
                المغامرة التالية ➡️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
