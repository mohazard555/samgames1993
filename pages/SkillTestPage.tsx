import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { playSuccessSound, playErrorSound, playWinFanfare, playPopSound } from '../utils/soundEffects';
import { getRandom50DiverseQuestions, EnrichedSkillQuestion } from '../games/banks/skillTestBank';

export const SkillTestPage: React.FC = () => {
  const { addSkillTestResult } = useSettings();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<EnrichedSkillQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form submission state
  const [heroName, setHeroName] = useState('');
  const [heroAge, setHeroAge] = useState('');
  const [heroCountry, setHeroCountry] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSavingResult, setIsSavingResult] = useState(false);

  const startNewTest = () => {
    // Generate fresh set of 50 authentic, diverse questions across all knowledge domains
    const freshQuestions = getRandom50DiverseQuestions();
    setQuestions(freshQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setIsCompleted(false);
    setIsSubmitted(false);
    setHeroName('');
    setHeroAge('');
    setHeroCountry('');
  };

  useEffect(() => {
    startNewTest();
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
        name: heroName,
        age: heroAge || 'غير محدد',
        country: heroCountry || 'غير محدد',
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

  if (isCompleted) {
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border-4 border-amber-300 animate-fade-in text-center my-6">
        <div className="text-7xl sm:text-8xl mb-3 animate-bounce">🏆</div>
        <h1 className="text-3xl font-black text-amber-600 mb-1">أنهيت تحدي 50 سؤالاً بنجاح يا بطل!</h1>
        <p className="text-gray-600 font-bold mb-6">لقد أجبت على أسئلة مهارات الذكاء والمعلومات العامة</p>

        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border-2 border-amber-200 mb-8 max-w-md mx-auto shadow-inner">
          <div className="text-sm font-bold text-gray-500 mb-1">نتيجتك النهائية</div>
          <div className="text-5xl font-black text-amber-700 mb-2">
            {score} / {total}
          </div>
          <div className="text-lg font-extrabold text-emerald-600">نسبة النجاح: {percentage}%</div>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleFormSubmit} className="bg-sky-50 p-6 rounded-2xl border-2 border-sky-200 space-y-4 text-right mb-6">
            <h3 className="text-lg font-black text-sky-900 text-center">
              📝 سجل اسمك وعمرك ودولتك لنشر النتيجة في لوحة شرف الأبطال!
            </h3>

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
                  placeholder="مثال: السعودية / مصر"
                  className="w-full px-4 py-2.5 border-2 border-sky-300 rounded-xl font-bold text-sm bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingResult}
              className={`w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-lg font-black py-3.5 px-6 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer ${
                isSavingResult ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isSavingResult ? '⏳ جاري إرسال النتيجة إلى لوحة الشرف...' : '🚀 إرسال النتيجة إلى لوحة شرف الأبطال العالمية 🏆'}
            </button>
          </form>
        ) : (
          <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-300 text-emerald-900 font-bold mb-6 space-y-3">
            <p className="text-xl font-black">✓ تم إرسال نتيجتك بنجاح وأضيفت إلى لوحة شرف الأبطال العامة ليراها الجميع!</p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                to="/leaderboard"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-xl shadow cursor-pointer"
              >
                🏆 عرض لوحة شرف الأبطال
              </Link>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button
            onClick={startNewTest}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer"
          >
            🔄 إعادة التحدي بأسئلة جديدة
          </button>
          <Link
            to="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 px-6 rounded-xl shadow"
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
            <h1 className="text-xl sm:text-2xl font-black text-amber-900">تحدي اختبر مهاراتك (50 سؤالاً)</h1>
            <p className="text-xs text-gray-500 font-bold">أجب عن الأسئلة المتنوعة واختبر ذكائك ومعلوماتك</p>
          </div>
        </div>
        <div className="bg-amber-500 text-white font-black px-3 py-1.5 rounded-xl shadow text-sm">
          النقاط: {score}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
          <span>السؤال {currentIndex + 1} من {total}</span>
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
