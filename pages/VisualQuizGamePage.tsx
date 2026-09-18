import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { VISUAL_QUIZ_CATEGORIES, ALL_VISUAL_QUIZ_ITEMS, VisualQuizItem } from '../data/visualQuizData';
import { QuizVisualCard } from '../components/QuizVisualCard';
import GoogleAdBanner from '../components/GoogleAdBanner';

export const VisualQuizGamePage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const categoryInfo = useMemo(() => {
    return VISUAL_QUIZ_CATEGORIES.find((c) => c.id === categoryId) || VISUAL_QUIZ_CATEGORIES[0];
  }, [categoryId]);

  const questions: VisualQuizItem[] = useMemo(() => {
    return ALL_VISUAL_QUIZ_ITEMS.filter((item) => item.category === categoryInfo.id);
  }, [categoryInfo]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    setIsCorrectAnswer(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setIsCorrectAnswer(false);
    } else {
      setIsFinished(true);
      saveProgress(score + (isCorrectAnswer ? 0 : 0)); // final score saved
    }
  };

  const saveProgress = (finalScore: number) => {
    try {
      const saved = localStorage.getItem('visual_quiz_progress_v1');
      let allStats: Record<string, { completed: boolean; score: number; stars: number }> = {};
      if (saved) {
        allStats = JSON.parse(saved);
      }

      const stars = Math.round((finalScore / questions.length) * 5);

      allStats[categoryInfo.id] = {
        completed: true,
        score: finalScore,
        stars: Math.max(allStats[categoryInfo.id]?.stars || 0, stars),
      };

      localStorage.setItem('visual_quiz_progress_v1', JSON.stringify(allStats));
    } catch (e) {
      console.error(e);
    }
  };

  // Save progress dynamically even if user leaves midway
  useEffect(() => {
    if (score > 0 || currentIndex > 0) {
      try {
        const saved = localStorage.getItem('visual_quiz_progress_v1');
        let allStats: Record<string, { completed: boolean; score: number; stars: number }> = {};
        if (saved) {
          allStats = JSON.parse(saved);
        }
        allStats[categoryInfo.id] = {
          completed: allStats[categoryInfo.id]?.completed || false,
          score: Math.max(allStats[categoryInfo.id]?.score || 0, score),
          stars: allStats[categoryInfo.id]?.stars || 0,
        };
        localStorage.setItem('visual_quiz_progress_v1', JSON.stringify(allStats));
      } catch (e) {
        console.error(e);
      }
    }
  }, [score, currentIndex, categoryInfo.id]);

  if (!currentQuestion) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800">عذراً، لم يتم العثور على أسئلة لهذه المجموعة.</h2>
        <button
          onClick={() => navigate('/visual-quiz')}
          className="mt-4 px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl"
        >
          العودة للمجموعات
        </button>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const earnedStars = Math.round((score / questions.length) * 5);

    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-purple-100 text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg animate-bounce">
            🎉
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900">أحسنت يا بطل!</h1>
            <p className="text-gray-600 font-medium">لقد أنهيت مجموعة {categoryInfo.name} بنجاح!</p>
          </div>

          {/* Stars */}
          <div className="flex items-center justify-center gap-2 text-3xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < earnedStars ? 'text-amber-400 scale-110 drop-shadow' : 'text-gray-300'}>
                ⭐
              </span>
            ))}
          </div>

          {/* Result Score Card */}
          <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200 max-w-md mx-auto space-y-2">
            <div className="text-sm font-bold text-purple-700">نتيجتك النهائية</div>
            <div className="text-4xl font-black text-purple-900">
              {score} / {questions.length}
            </div>
            <div className="text-xs text-purple-600 font-bold">نسبة النجاح: {percentage}%</div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setSelectedOptionId(null);
                setIsAnswered(false);
                setIsCorrectAnswer(false);
                setIsFinished(false);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-md transition-all active:scale-95"
            >
              🔄 إعادة اللعب
            </button>
            <button
              onClick={() => navigate('/visual-quiz')}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-purple-700 border-2 border-purple-200 font-black rounded-2xl shadow-sm transition-all active:scale-95"
            >
              📚 اختيار مجموعة أخرى
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl transition-all"
            >
              🏠 الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-gray-100">
        <Link
          to="/visual-quiz"
          className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-bold text-xs sm:text-sm bg-purple-50 px-3.5 py-2 rounded-xl transition-colors"
        >
          <span>←</span>
          <span>المجموعات</span>
        </Link>
        <div className="flex items-center gap-2 font-black text-sm sm:text-base text-gray-800">
          <span>{categoryInfo.emoji}</span>
          <span>{categoryInfo.name}</span>
        </div>
        <div className="bg-amber-100 text-amber-800 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs">
          ⭐ {score} نقطة
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-gray-600">
          <span>السؤال {currentIndex + 1} من {questions.length}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Card & Main Image */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-purple-100 space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
            🔍 دقق النظر في الصورة الرئيسية
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Main Large Visual Card */}
        <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
          <QuizVisualCard
            visual={currentQuestion.mainVisual}
            size="large"
            className="shadow-xl"
          />
        </div>

        <div className="text-sm sm:text-base font-bold text-purple-700 pt-2">
          أي من الصورتين بالأسفل تطابق الصورة بالأعلى؟ 👇
        </div>

        {/* Options Grid (2 Large Options) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const showResultState = isAnswered;

            let borderStyle = 'border-gray-200 hover:border-purple-400 bg-white hover:shadow-lg';
            if (showResultState) {
              if (option.isCorrect) {
                borderStyle = 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 shadow-xl';
              } else if (isSelected && !option.isCorrect) {
                borderStyle = 'border-rose-500 bg-rose-50 ring-4 ring-rose-200';
              }
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id, option.isCorrect)}
                className={`cursor-pointer rounded-3xl p-4 sm:p-5 border-4 transition-all duration-200 flex flex-col items-center justify-between transform active:scale-95 shadow-md ${borderStyle}`}
              >
                <div className="w-full mb-3 flex items-center justify-center">
                  <QuizVisualCard
                    visual={option.visual}
                    size="medium"
                  />
                </div>

                <div className="flex items-center justify-between w-full px-2 mt-1">
                  <span className="font-black text-base sm:text-lg text-gray-800">
                    {option.label}
                  </span>
                  {showResultState && option.isCorrect && (
                    <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow">
                      ✓ صحيح
                    </span>
                  )}
                  {showResultState && isSelected && !option.isCorrect && (
                    <span className="bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow">
                      ✗ خطأ
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback and Next Button */}
        {isAnswered && (
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="text-right">
              {isCorrectAnswer ? (
                <div className="flex items-center gap-2 text-emerald-600 font-black text-lg sm:text-xl">
                  <span>🎉</span>
                  <span>أحسنت! إجابة صحيحة رائعة</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600 font-black text-lg sm:text-xl">
                  <span>💡</span>
                  <span>حاول مرة أخرى! الإجابة الصحيحة محددة بالأخضر</span>
                </div>
              )}
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-base"
            >
              السؤال التالي ➜
            </button>
          </div>
        )}
      </div>

      <GoogleAdBanner position="bottom" />
    </div>
  );
};
export default VisualQuizGamePage;
