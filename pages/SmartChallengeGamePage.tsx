import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { getSmartChallengeGameById } from '../data/smartChallengesData';
import { SmartChallengeQuestion, SmartChallengeOption } from '../types/smartChallengesTypes';
import { SmartChallengeVisual } from '../components/smart-challenges/SmartChallengeVisual';
import {
  recordSmartQuestionWin,
  recordSmartGameCompletion,
  getSmartChallengesStats,
} from '../utils/smartChallengesStorage';

export const SmartChallengeGamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const numericId = parseInt(gameId || '1', 10);
  const game = useMemo(() => getSmartChallengeGameById(numericId), [numericId]);

  const questions: SmartChallengeQuestion[] = useMemo(() => {
    return game ? game.questions : [];
  }, [game]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [sessionStars, setSessionStars] = useState(0);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [isCompletedGame, setIsCompletedGame] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<string | null>(null);
  const [wiggleKey, setWiggleKey] = useState(0);

  // Load existing progress for this game
  useEffect(() => {
    const stats = getSmartChallengesStats();
    const prog = stats.gamesProgress[numericId];
    if (prog) {
      setCompletedIndices(prog.completedQuestions.map((qId) => qId - 1));
      setSessionStars(prog.stars);
    }
  }, [numericId]);

  // Current question
  const currentQuestion: SmartChallengeQuestion | undefined = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;

  // Handle Option Click
  const handleOptionClick = (option: SmartChallengeOption) => {
    if (feedbackState === 'correct') return; // already solved

    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      setFeedbackState('correct');
      if (!completedIndices.includes(currentIndex)) {
        setCompletedIndices((prev) => [...prev, currentIndex]);
        setSessionStars((prev) => prev + 1);
        recordSmartQuestionWin(numericId, currentIndex + 1);
      }

      // Trigger pleasant soft celebration
      try {
        confetti({
          particleCount: 30,
          spread: 55,
          origin: { y: 0.7 },
          colors: ['#38bdf8', '#f59e0b', '#ec4899', '#10b981'],
        });
      } catch {
        // no-op
      }
    } else {
      setFeedbackState('wrong');
      setWiggleKey((k) => k + 1);
      setTimeout(() => {
        setFeedbackState('idle');
      }, 1300);
    }
  };

  // Next Question
  const handleNext = () => {
    if (isLastQuestion) {
      const finalScore = completedIndices.length;
      const { newlyEarnedBadge } = recordSmartGameCompletion(numericId, finalScore, sessionStars);
      if (newlyEarnedBadge) {
        setUnlockedBadge(newlyEarnedBadge);
      }
      setIsCompletedGame(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // no-op
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setFeedbackState('idle');
      setShowHint(false);
    }
  };

  // Previous Question
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOptionId(null);
      setFeedbackState('idle');
      setShowHint(false);
    }
  };

  // Restart
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setFeedbackState('idle');
    setShowHint(false);
    setIsCompletedGame(false);
  };

  if (!game || !currentQuestion) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="text-xl font-black text-gray-800 mb-2">لم يتم العثور على اللعبة المطلوبة</h2>
        <button
          onClick={() => navigate('/smart-challenges')}
          className="px-5 py-2.5 bg-sky-600 text-white font-black rounded-2xl shadow-md"
        >
          العودة لعالم التحديات الذكية
        </button>
      </div>
    );
  }

  // Completion Screen
  if (isCompletedGame) {
    const totalQuestions = questions.length;
    const score = completedIndices.length;
    const percent = Math.round((score / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-pink-50 py-8 px-4" dir="rtl">
        <div className="max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl text-center">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-5xl shadow-lg animate-bounce mb-4">
            🏆
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mb-1">
            أحسنت! لقد أكملت اللعبة!
          </h2>
          <p className="text-base font-bold text-gray-600 mb-6">
            لقد أتممت جميع تحديات <span className="text-sky-600">{game.title}</span> بنجاح باهر!
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="text-2xl sm:text-3xl font-black text-amber-800">{sessionStars}</div>
              <div className="text-xs font-bold text-amber-700">⭐ النجوم</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                {score} / {totalQuestions}
              </div>
              <div className="text-xs font-bold text-emerald-700">✅ الإجابات</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
              <div className="text-2xl sm:text-3xl font-black text-purple-800">{percent}%</div>
              <div className="text-xs font-bold text-purple-700">📊 الإنجاز</div>
            </div>
          </div>

          {/* Unlocked Badge if any */}
          {unlockedBadge && (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100 rounded-2xl border-2 border-amber-400 animate-pulse">
              <div className="text-xs font-black text-amber-900 mb-1">🎉 مبارك! نلت شارة جديدة:</div>
              <div className="text-lg font-black text-amber-950">{unlockedBadge}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              🔄 إعادة التحدي من جديد
            </button>
            <button
              onClick={() => navigate('/smart-challenges')}
              className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-black text-sm rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              🌟 العودة لعالم التحديات
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-purple-50 to-pink-50 py-4 sm:py-8 px-3 sm:px-6" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <button
            onClick={() => navigate('/smart-challenges')}
            className="px-4 py-2 bg-white hover:bg-gray-50 border-2 border-sky-200 text-sky-800 rounded-2xl font-black text-xs sm:text-sm shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>➜</span>
            <span>عالم التحديات</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 bg-amber-100/90 text-amber-900 border border-amber-300 rounded-2xl font-black text-xs sm:text-sm shadow-xs flex items-center gap-1">
              <span>⭐</span>
              <span>{sessionStars}</span>
            </div>
          </div>
        </div>

        {/* Game Main Header Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 border-3 border-sky-200 shadow-md mb-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-3xl sm:text-4xl shadow-md shrink-0">
                {game.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-lg sm:text-2xl font-black text-gray-900">{game.title}</h1>
                  {game.category === 'time' && (
                    <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                      عالم الوقت 🕐
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{game.shortDesc}</p>
              </div>
            </div>

            {/* Question Counter Badge */}
            <div className="px-4 py-2 bg-sky-50 border-2 border-sky-200 rounded-2xl text-center shrink-0">
              <div className="text-[11px] font-bold text-sky-700">التحدي الحالي</div>
              <div className="text-sm sm:text-base font-black text-sky-900">
                السؤال <span className="text-sky-600 font-extrabold">{currentIndex + 1}</span> من {questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-sky-100 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
              <div
                className="bg-gradient-to-r from-sky-400 via-indigo-500 to-pink-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question & Interactive Stage */}
        <div
          key={wiggleKey}
          className={`bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 border-3 shadow-lg mb-5 transition-all ${
            feedbackState === 'correct'
              ? 'border-emerald-400 shadow-emerald-100'
              : feedbackState === 'wrong'
              ? 'border-rose-400 shadow-rose-100 animate-wiggle'
              : 'border-purple-200 shadow-purple-50'
          }`}
        >
          {/* Question Prompt */}
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 leading-relaxed max-w-xl mx-auto">
              {currentQuestion.prompt}
            </h2>
          </div>

          {/* Visual Component (Clock, Tower, Room, Day/Night, etc.) */}
          <div className="mb-6">
            <SmartChallengeVisual question={currentQuestion} />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectOpt = option.isCorrect;

              let btnClasses =
                'p-4 rounded-2xl border-3 text-right font-black text-sm sm:text-base flex items-center justify-between gap-3 transition-all active:scale-95 cursor-pointer shadow-sm';

              if (feedbackState === 'correct') {
                if (isCorrectOpt) {
                  btnClasses += ' bg-emerald-500 text-white border-emerald-600 shadow-md scale-102';
                } else {
                  btnClasses += ' bg-gray-50 text-gray-400 border-gray-200 opacity-60';
                }
              } else if (isSelected && feedbackState === 'wrong') {
                btnClasses += ' bg-rose-50 text-rose-800 border-rose-400 animate-shake';
              } else {
                btnClasses +=
                  ' bg-white hover:bg-sky-50 text-slate-800 border-sky-100 hover:border-sky-300 shadow-xs';
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  disabled={feedbackState === 'correct'}
                  className={btnClasses}
                >
                  <div className="flex items-center gap-2.5">
                    {option.visual && option.visual.length < 5 && (
                      <span className="text-2xl">{option.visual}</span>
                    )}
                    <span>{option.text}</span>
                  </div>
                  {feedbackState === 'correct' && isCorrectOpt && (
                    <span className="text-xl">✨</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Cheer Banner */}
          {feedbackState === 'correct' && (
            <div className="mt-5 p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl text-center animate-fade-in">
              <div className="text-base sm:text-lg font-black text-emerald-900 flex items-center justify-center gap-2">
                <span>✨</span>
                <span>أحسنت! إجابة صحيحة ومتقنة! 🎉</span>
                <span>⭐</span>
              </div>
              {currentQuestion.explanation && (
                <div className="text-xs text-emerald-700 font-bold mt-1">
                  {currentQuestion.explanation}
                </div>
              )}
            </div>
          )}

          {feedbackState === 'wrong' && (
            <div className="mt-5 p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl text-center">
              <div className="text-sm font-black text-rose-800 flex items-center justify-center gap-1.5">
                <span>💪</span>
                <span>حاول مرة أخرى! يمكنك فعلها! ✨</span>
              </div>
            </div>
          )}

          {/* Hint Dropdown */}
          {showHint && (
            <div className="mt-4 p-3.5 bg-amber-50 border-2 border-amber-200 rounded-2xl text-xs sm:text-sm font-bold text-amber-900 text-center animate-fade-in">
              💡 تلميح: {currentQuestion.hint}
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all ${
              currentIndex === 0
                ? 'opacity-40 bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 active:scale-95 cursor-pointer shadow-xs'
            }`}
          >
            السابق ➔
          </button>

          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-2xl font-black text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>💡</span>
            <span>{showHint ? 'إخفاء التلميح' : 'تلميح'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className={`px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              feedbackState === 'correct'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white animate-pulse'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            <span>{isLastQuestion ? 'إنهاء التحدي 🏆' : 'التالي ⬅️'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartChallengeGamePage;
