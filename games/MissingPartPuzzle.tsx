import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { playSuccessSound, playErrorSound } from '../utils/soundEffects';

interface PuzzleChallenge {
  id: number;
  title: string;
  mainEmoji: string;
  missingPart: string;
  category: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Generate 50 unique missing-part challenges
const BASE_ITEMS = [
  { title: 'السيارة الحمراء', emoji: '🚗', part: '🛞', options: ['🛞', '⛵', '🏠', '🍎'], correct: '🛞', desc: 'العجلة هي الجزء المفقود لتسير السيارة بنجاح!' },
  { title: 'الشجرة المثمرة', emoji: '🌳', part: '🍎', options: ['🍎', '⚽', '🚗', '🐱'], correct: '🍎', desc: 'التفاحة هي الثمرة المفقودة التي تنمو على الشجرة!' },
  { title: 'المنزل الدافئ', emoji: '🏡', part: '🚪', options: ['🚪', '🍌', '🚀', '🐟'], correct: '🚪', desc: 'الباب هو الجزء المفقود لدخول المنزل!' },
  { title: 'ساعة الحائط', emoji: '⏰', part: '🕰️', options: ['🕰️', '🍉', '⚽', '🚗'], correct: '🕰️', desc: 'العقارب والعداد هما الجزء المفقود لمعرفة الوقت!' },
  { title: 'القطة الأليفة', emoji: '🐱', part: '🐾', options: ['🐾', '✈️', '🍎', '⚽'], correct: '🐾', desc: 'آثار الأقدام أو المخالب هي الجزء المميز للقطة!' },
  { title: 'الطائرة السريعة', emoji: '✈️', part: '🪽', options: ['🪽', '🚗', '🏠', '🍌'], correct: '🪽', desc: 'الجناح هو الجزء المفقود لتحلق الطائرة في السحاب!' },
  { title: 'السفينة البحرية', emoji: '🚢', part: '⚓', options: ['⚓', '🍎', '🐱', '⏰'], correct: '⚓', desc: 'المرساة هي الجزء المفقود لتثبيت السفينة في البحر!' },
  { title: 'الدراجة الهوائية', emoji: '🚲', part: '⚙️', options: ['⚙️', '🏠', '🚀', '🍉'], correct: '⚙️', desc: 'الترس ودواسة السرعة هي الجزء المفقود للدراجة!' },
  { title: 'الحاسوب الذكي', emoji: '💻', part: '⌨️', options: ['⌨️', '🚗', '🍎', '⚽'], correct: '⌨️', desc: 'لوحة المفاتيح هي الجزء المفقود لكتابة الكلمات!' },
  { title: 'القلم الملون', emoji: '✏️', part: '✒️', options: ['✒️', '🐱', '🏠', '🍌'], correct: '✒️', desc: 'سن القلم هو الجزء المفقود للرسم والكتابة!' },
];

function generate50Challenges(): PuzzleChallenge[] {
  const challenges: PuzzleChallenge[] = [];
  for (let i = 1; i <= 50; i++) {
    const base = BASE_ITEMS[(i - 1) % BASE_ITEMS.length];
    // Create unique variations for title and options if i > BASE_ITEMS.length
    const suffix = i > BASE_ITEMS.length ? ` (${i})` : '';
    const correct = base.correct;
    // Shuffle options
    const shuffledOptions = [...base.options].sort(() => Math.random() - 0.5);

    challenges.push({
      id: i,
      title: `${base.title}${suffix}`,
      mainEmoji: base.emoji,
      missingPart: correct,
      category: 'ابحث عن الجزء المفقود',
      options: shuffledOptions,
      correctAnswer: correct,
      explanation: `${base.desc} (تحدي رقم ${i})`,
    });
  }
  return challenges;
}

const CHALLENGES = generate50Challenges();

interface MissingPartPuzzleProps {
  gameName?: string;
}

export const MissingPartPuzzle: React.FC<MissingPartPuzzleProps> = ({ gameName = 'ابحث عن الجزء المفقود للصورة' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentChallenge = CHALLENGES[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isCorrect !== null) return;
    setSelectedOpt(option);

    if (option === currentChallenge.correctAnswer) {
      setIsCorrect(true);
      setScore((s) => s + 10 + streak * 2);
      setStreak((st) => st + 1);
      playSuccessSound();
    } else {
      setIsCorrect(false);
      setStreak(0);
      playErrorSound();
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsCorrect(null);
    if (currentIndex + 1 < CHALLENGES.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsCompleted(true);
      playSuccessSound();
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOpt(null);
    setIsCorrect(null);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-2xl text-center border-4 border-emerald-300">
        <div className="text-8xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-3xl font-black text-emerald-800 mb-2">أحسنت يا بطل! أنهيت جميع تحديات الأجزاء المفقودة بنجاح</h2>
        <p className="text-xl text-gray-600 mb-6">مجموع النقاط: <span className="font-bold text-emerald-600">{score}</span></p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={restartGame}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            إعادة اللعبة 🔄
          </button>
          <Link
            to="/"
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition-transform active:scale-95 inline-block"
          >
            العودة للرئيسية 🏠
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-sky-50 to-emerald-50 rounded-3xl shadow-xl border-4 border-sky-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-white text-emerald-700 font-bold py-2 px-4 rounded-xl shadow-md border border-emerald-200 hover:bg-emerald-50 transition-colors"
        >
          → العودة
        </Link>
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-sky-900">{gameName}</h1>
          <span className="text-sm font-bold text-sky-600">
            اللغز {currentIndex + 1} من {CHALLENGES.length}
          </span>
        </div>
        <div className="bg-amber-100 text-amber-800 font-black px-4 py-1.5 rounded-full shadow-sm text-sm">
          ⭐ {score}
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="bg-white border-4 border-sky-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-center mb-6 relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full">
          {currentChallenge.category}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-sky-900 mb-4">
          ما هو الجزء المفقود لـ <span className="text-emerald-700">{currentChallenge.title}</span>؟
        </h2>

        {/* Display image with missing slot */}
        <div className="flex items-center justify-center gap-6 my-6">
          <div className="text-8xl sm:text-9xl bg-sky-50 p-6 rounded-3xl border-2 border-dashed border-sky-300 shadow-inner">
            {currentChallenge.mainEmoji}
          </div>
          <div className="text-5xl">➡️</div>
          <div className="text-8xl sm:text-9xl bg-amber-50 p-6 rounded-3xl border-4 border-amber-400 shadow-lg animate-pulse flex items-center justify-center w-36 h-36">
            {isCorrect ? currentChallenge.missingPart : '❓'}
          </div>
        </div>

        {isCorrect !== null && (
          <div className={`mt-4 p-4 rounded-2xl border text-lg font-bold animate-fade-in ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {isCorrect ? `🎉 إجابة صحيحة! ${currentChallenge.explanation}` : '❌ إجابة خاطئة، حاول مرة أخرى!'}
          </div>
        )}
      </div>

      {/* 4 Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {currentChallenge.options.map((opt, idx) => {
          let btnStyle = 'bg-white hover:bg-sky-50 border-2 border-sky-300 text-sky-900';
          if (selectedOpt === opt) {
            btnStyle = isCorrect ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-xl' : 'bg-red-500 text-white border-red-600';
          } else if (isCorrect && opt === currentChallenge.correctAnswer) {
            btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-xl';
          }

          return (
            <button
              key={idx}
              disabled={isCorrect !== null}
              onClick={() => handleSelectOption(opt)}
              className={`p-6 rounded-2xl text-6xl sm:text-7xl shadow-md transition-all transform active:scale-95 flex items-center justify-center cursor-pointer ${btnStyle}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {isCorrect !== null && (
        <div className="text-center animate-bounce">
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xl px-8 py-4 rounded-2xl shadow-xl transition-all cursor-pointer"
          >
            اللغز التالي ⬅️
          </button>
        </div>
      )}
    </div>
  );
};

export default MissingPartPuzzle;
