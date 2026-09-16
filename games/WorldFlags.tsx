import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WORLD_FLAGS_50, FlagItem } from './banks/landmarksAndFlagsData';
import { playSuccessSound, playErrorSound, playWinFanfare, playPopSound } from '../utils/soundEffects';

interface GameProps {
  gameName: string;
}

const WorldFlags: React.FC<GameProps> = ({ gameName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [imgError, setImgError] = useState(false);

  const currentFlag: FlagItem = WORLD_FLAGS_50[currentIndex];

  const handleAnswer = (option: string) => {
    if (feedback !== null) return;
    playPopSound();
    setSelectedOption(option);

    // Some options are short name e.g. "السعودية" while country name might be "المملكة العربية السعودية"
    const isCorrect =
      option === currentFlag.country ||
      currentFlag.country.includes(option) ||
      option.includes(currentFlag.country);

    if (isCorrect) {
      setScore(s => s + 10);
      setFeedback('correct');
      playSuccessSound();
    } else {
      setFeedback('incorrect');
      playErrorSound();
    }

    setTimeout(() => {
      if (currentIndex + 1 >= WORLD_FLAGS_50.length) {
        setIsFinished(true);
        playWinFanfare();
      } else {
        setCurrentIndex(i => i + 1);
        setFeedback(null);
        setSelectedOption(null);
        setImgError(false);
      }
    }, 1800);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedOption(null);
    setImgError(false);
    setIsFinished(false);
    playPopSound();
  };

  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto text-center bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border-4 border-blue-500">
        <div className="text-6xl sm:text-7xl mb-4 animate-bounce">🚩</div>
        <h2 className="text-3xl sm:text-4xl font-black text-blue-900 mb-2">رائع جداً! خبير أعلام الدول</h2>
        <p className="text-gray-600 text-lg sm:text-xl font-bold mb-6">
          نتيجتك النهائية: <span className="text-emerald-600 font-black">{score}</span> من {WORLD_FLAGS_50.length * 10} نقطة
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-lg px-8 py-3 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            🔄 العب مرة أخرى
          </button>
          <Link
            to="/"
            className="bg-sky-500 hover:bg-sky-600 text-white font-black text-lg px-8 py-3 rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            🏠 الصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 sm:p-8 rounded-3xl shadow-xl border-4 border-blue-500">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-transform active:scale-95 text-sm sm:text-base"
        >
          → العودة
        </Link>
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-blue-900">{gameName}</h1>
          <span className="text-xs sm:text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
            العلم {currentIndex + 1} من {WORLD_FLAGS_50.length} ({currentFlag.continent})
          </span>
        </div>
        <div className="bg-emerald-500 text-white font-black py-2 px-4 rounded-xl shadow text-sm sm:text-base">
          النقاط: {score}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-blue-100 h-2.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / WORLD_FLAGS_50.length) * 100}%` }}
        />
      </div>

      {/* Main Flag Card */}
      <div className="bg-gradient-to-b from-blue-50 to-sky-50/50 p-4 sm:p-8 rounded-3xl border border-blue-200 shadow-inner text-center">
        <h2 className="text-xl sm:text-3xl font-black text-gray-800 mb-6">
          علم أي دولة هذا؟ 🌍
        </h2>

        {/* Real Flag Image from FlagCDN with Smooth Shadow & Fallback */}
        <div className="mx-auto w-full max-w-sm h-44 sm:h-56 rounded-2xl overflow-hidden shadow-lg mb-6 bg-white border-4 border-white flex items-center justify-center ring-2 ring-blue-200">
          {!imgError ? (
            <img
              src={currentFlag.image}
              alt={`علم ${currentFlag.country}`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-blue-800 font-black">
              <span className="text-6xl mb-2">🚩</span>
              <span>{currentFlag.country}</span>
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-4">
          {currentFlag.options.map((opt) => {
            const isChosen = selectedOption === opt;
            const isCorrect =
              opt === currentFlag.country ||
              currentFlag.country.includes(opt) ||
              opt.includes(currentFlag.country);

            let btnClass = 'bg-white text-gray-800 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 shadow-sm';

            if (feedback !== null) {
              if (isCorrect) {
                btnClass = 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-lg scale-102';
              } else if (isChosen && !isCorrect) {
                btnClass = 'bg-rose-500 text-white border-2 border-rose-600 shadow-lg opacity-80';
              } else {
                btnClass = 'bg-gray-100 text-gray-400 border-gray-200 opacity-50';
              }
            }

            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                className={`p-4 sm:p-5 rounded-2xl text-lg sm:text-xl font-black transition-all transform active:scale-95 flex items-center justify-between text-right cursor-pointer ${btnClass}`}
              >
                <span>{opt}</span>
                {feedback !== null && isCorrect && <span className="text-2xl">✅</span>}
                {feedback !== null && isChosen && !isCorrect && <span className="text-2xl">❌</span>}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="mt-4 p-4 rounded-2xl bg-white/90 border border-blue-200 shadow-sm max-w-xl mx-auto animate-fade-in">
            <p className={`text-xl sm:text-2xl font-black ${feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {feedback === 'correct'
                ? '🎉 إجابة صحيحة! أحسنت يا بطل! 🎉'
                : `❌ إجابة خاطئة! الدولة الصحيحة هي: ${currentFlag.country}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldFlags;
