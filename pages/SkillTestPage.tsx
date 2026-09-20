import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { playSuccessSound, playErrorSound, playWinFanfare } from '../utils/soundEffects';
import { getRandom50DiverseQuestions, EnrichedSkillQuestion } from '../games/banks/skillTestBank';

export const SkillTestPage: React.FC = () => {
  const { addSkillTestResult } = useSettings();

  const [testRound, setTestRound] = useState<number>(1);
  const [questions, setQuestions] = useState<EnrichedSkillQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // History of completed rounds in this session
  const [completedRounds, setCompletedRounds] = useState<
    Array<{ round: number; score: number; total: number; percentage: number }>
  >([]);

  // Form submission state
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [heroName, setHeroName] = useState('');
  const [heroAge, setHeroAge] = useState('');
  const [heroCountry, setHeroCountry] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSavingResult, setIsSavingResult] = useState(false);

  // Start round 1 or a specific round
  const startRound = (roundNumber: number) => {
    const freshQuestions = getRandom50DiverseQuestions();
    setQuestions(freshQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setIsCompleted(false);
    setShowSubmitForm(false);
    setIsSubmitted(false);
    setTestRound(roundNumber);
  };

  const startNewTest = () => {
    setCompletedRounds([]);
    setHeroName('');
    setHeroAge('');
    setHeroCountry('');
    startRound(1);
  };

  useEffect(() => {
    startRound(1);
  }, []);

  if (questions.length === 0) {
    return <div className="text-center py-16 font-bold text-sky-600">جاري تحميل تحدي اختبر مهاراتك...</div>;
  }

  const currentQ = questions[currentIndex];
  const total = questions.length;

  const handleAnswer = (option: string) => {
    if (feedback !== null) return;
    setSelectedAnswer(option);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setFeedback('correct');
      setScore((s) => s + 1);
      playSuccessSound();
    } else {
      setFeedback('incorrect');
      playErrorSound();
    }

    setTimeout(() => {
      if (currentIndex + 1 >= total) {
        const finalScore = isCorrect ? score + 1 : score;
        const finalPercentage = Math.round((finalScore / total) * 100);
        
        setCompletedRounds((prev) => [
          ...prev.filter((r) => r.round !== testRound),
          { round: testRound, score: finalScore, total, percentage: finalPercentage },
        ]);
        
        setIsCompleted(true);
        playWinFanfare();
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      }
    }, 1800);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroName.trim()) {
      alert('الرجاء إدخال اسم البطل الكريم.');
      return;
    }

    setIsSavingResult(true);
    try {
      await addSkillTestResult({
        name: heroName.trim(),
        age: heroAge.trim() || 'غير محدد',
        country: heroCountry.trim() || 'غير محدد',
        score,
        total,
      });
      setIsSubmitted(true);
      playWinFanfare();
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء حفظ النتيجة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSavingResult(false);
    }
  };

  const roundName = testRound === 1 ? 'الاختبار الأول' : testRound === 2 ? 'الاختبار الثاني' : 'الاختبار الثالث';

  if (isCompleted) {
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border-4 border-amber-300 animate-fade-in text-center my-6">
        <div className="text-7xl sm:text-8xl mb-3 animate-bounce">🏆</div>
        
        <div className="inline-block bg-amber-100 text-amber-900 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full mb-3 border border-amber-300">
          🌟 إنجاز رائع في {roundName} (50 سؤالاً)
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-amber-700 mb-1">
          أنهيت {roundName} بنجاح يا بطل!
        </h1>
        <p className="text-gray-600 font-bold mb-6 text-sm sm:text-base">
          لقد أجبت على 50 سؤالاً مميزاً في مجالات العلوم والذكاء والمعلومات العامة
        </p>

        {/* Score Card */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border-2 border-amber-200 mb-6 max-w-md mx-auto shadow-inner">
          <div className="text-xs font-bold text-gray-500 mb-1">نتيجة {roundName}</div>
          <div className="text-5xl font-black text-amber-700 mb-2">
            {score} / {total}
          </div>
          <div className="text-lg font-extrabold text-emerald-600">نسبة النجاح: {percentage}%</div>
        </div>

        {/* Summary of all rounds completed in this session if > 1 */}
        {completedRounds.length > 1 && (
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 mb-6 text-right max-w-md mx-auto">
            <h4 className="text-xs font-black text-amber-900 mb-2 text-center">📊 سجل اختباراتك في هذه الجلسة:</h4>
            <div className="space-y-1.5 text-xs font-bold">
              {completedRounds.map((r) => (
                <div key={r.round} className="flex justify-between items-center bg-white p-2 rounded-xl border border-amber-100">
                  <span className="text-gray-700">
                    {r.round === 1 ? 'الاختبار الأول' : r.round === 2 ? 'الاختبار الثاني' : 'الاختبار الثالث'}
                  </span>
                  <span className="text-amber-800 font-black">{r.score} / {r.total} ({r.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Choice: Continue to Next Test OR Submit to Leaderboard */}
        {!isSubmitted && (
          <div className="space-y-4 mb-6">
            {!showSubmitForm ? (
              <div className="bg-gradient-to-b from-sky-50 to-blue-50 p-6 rounded-2xl border-2 border-sky-300 space-y-4">
                <h3 className="text-lg font-black text-sky-950">ماذا تود أن تفعل الآن يا بطل؟</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {testRound < 3 ? (
                    <button
                      type="button"
                      onClick={() => startRound(testRound + 1)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black p-4 rounded-2xl shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="text-2xl">🚀</span>
                      <span className="text-base">
                        خوض {testRound === 1 ? 'الاختبار الثاني' : 'الاختبار الثالث'}
                      </span>
                      <span className="text-[11px] opacity-90 font-bold">50 سؤالاً جديدة ومختلفة تماماً</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startRound(1)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black p-4 rounded-2xl shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="text-2xl">🔄</span>
                      <span className="text-base">إعادة التحدي من البداية</span>
                      <span className="text-[11px] opacity-90 font-bold">مجموعة جديدة كلياً</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowSubmitForm(true)}
                    className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-black p-4 rounded-2xl shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="text-2xl">🏆</span>
                    <span className="text-base">إرسال نتيجتي للوحة الشرف</span>
                    <span className="text-[11px] opacity-90 font-bold">تسجيل اسمك وعرضه للجميع</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="bg-sky-50 p-6 rounded-2xl border-2 border-sky-200 space-y-4 text-right animate-fade-in">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-base font-black text-sky-950">
                    📝 تسجيل النتيجة في لوحة شرف الأبطال
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowSubmitForm(false)}
                    className="text-xs text-gray-500 hover:text-gray-700 font-bold"
                  >
                    ✕ رجوع للخيارات
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">اسم البطل / البطلة:</label>
                  <input
                    type="text"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    placeholder="مثال: أحمد محمد"
                    required
                    className="w-full px-4 py-2.5 border-2 border-sky-300 rounded-xl font-bold text-sm bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">العمر:</label>
                    <input
                      type="text"
                      value={heroAge}
                      onChange={(e) => setHeroAge(e.target.value)}
                      placeholder="مثال: 10 سنوات"
                      className="w-full px-4 py-2.5 border-2 border-sky-300 rounded-xl font-bold text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">الدولة:</label>
                    <input
                      type="text"
                      value={heroCountry}
                      onChange={(e) => setHeroCountry(e.target.value)}
                      placeholder="مثال: السعودية / مصر / سورية"
                      className="w-full px-4 py-2.5 border-2 border-sky-300 rounded-xl font-bold text-sm bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingResult}
                  className={`w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-base font-black py-3.5 px-6 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer ${
                    isSavingResult ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  {isSavingResult ? '⏳ جاري إرسال النتيجة إلى السيرفر...' : '🚀 تأكيد الإرسال إلى لوحة شرف الأبطال العالمية 🏆'}
                </button>
              </form>
            )}
          </div>
        )}

        {isSubmitted && (
          <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-300 text-emerald-900 font-bold mb-6 space-y-3 animate-fade-in">
            <span className="text-5xl block">🎉</span>
            <p className="text-xl font-black">✓ تم إرسال نتيجتك بنجاح ومزامنتها سحابياً مع لوحة الشرف والإدارة!</p>
            <p className="text-xs text-emerald-800">يمكنك الآن رؤية اسمك ونتيجتك في لوحة الشرف العامة مباشرة.</p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                to="/leaderboard"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-xl shadow cursor-pointer"
              >
                🏆 الذهاب إلى لوحة شرف الأبطال
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 pt-2 border-t border-gray-100">
          <button
            onClick={startNewTest}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer text-sm"
          >
            🔄 بدء تحدي جديد من البداية
          </button>
          <Link
            to="/"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-xl shadow text-sm"
          >
            🏠 العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-amber-300 my-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 mb-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🧠</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black text-amber-900">تحدي اختبر مهاراتك</h1>
              <span className="text-xs bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full font-extrabold">
                {roundName}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-bold">50 سؤالاً مميزاً لقياس الذكاء والمعلومات العامة</p>
          </div>
        </div>
        <div className="bg-amber-500 text-white font-black px-3 py-1.5 rounded-xl shadow text-sm">
          النقاط: {score}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
          <span>السؤال {currentIndex + 1} من {total} ({roundName})</span>
          <span>{Math.round(((currentIndex + 1) / total) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-b from-amber-50/50 to-white p-6 rounded-2xl border border-amber-200 shadow-inner mb-6 text-center">
        <div className="text-xs bg-amber-200 text-amber-900 font-black px-3 py-1 rounded-full inline-block mb-3">
          التصنيف: {currentQ.category}
        </div>
        <div className="text-5xl mb-3">❓</div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-6 leading-relaxed">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
          {currentQ.options.map((opt, idx) => {
            const isChosen = selectedAnswer === opt;
            const isCorrect = opt === currentQ.correctAnswer;

            let btnClass = 'bg-white text-gray-800 border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 shadow-md';
            if (feedback !== null) {
              if (isCorrect) {
                btnClass = 'bg-emerald-500 text-white border-2 border-emerald-600 scale-102';
              } else if (isChosen && !isCorrect) {
                btnClass = 'bg-rose-500 text-white border-2 border-rose-600 opacity-80';
              } else {
                btnClass = 'bg-gray-100 text-gray-400 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                className={`p-4 rounded-xl text-base sm:text-lg font-black transition-all transform active:scale-95 flex items-center justify-between text-right cursor-pointer ${btnClass}`}
              >
                <span>{opt}</span>
                {feedback !== null && isCorrect && <span>✅</span>}
                {feedback !== null && isChosen && !isCorrect && <span>❌</span>}
              </button>
            );
          })}
        </div>

        {feedback !== null && currentQ.explanation && (
          <div className="mt-4 bg-white/90 p-3 rounded-xl border border-amber-200 max-w-md mx-auto text-gray-700 text-xs sm:text-sm font-bold animate-fade-in">
            {currentQ.explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTestPage;
