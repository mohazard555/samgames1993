import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAMOUS_LANDMARKS_50, LandmarkItem } from './banks/landmarksAndFlagsData';
import { playSuccessSound, playErrorSound, playWinFanfare, playPopSound } from '../utils/soundEffects';
import { useSettings } from '../contexts/SettingsContext';
import QuestionGateModal from '../components/QuestionGateModal';
import VipSubscriptionModal from '../components/VipSubscriptionModal';

interface GameProps {
  gameName: string;
}

const FamousLandmarks: React.FC<GameProps> = ({ gameName }) => {
  const { settings, isVipActive } = useSettings();
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const gateNumber = settings.paidSettings?.questionGateNumber ?? 15;
  const isQuestionGated =
    !isVipActive &&
    Boolean(settings.paidSettings?.enabled) &&
    settings.paidSettings?.questionGateEnabled !== false &&
    currentIndex + 1 >= gateNumber;

  const currentLandmark: LandmarkItem = FAMOUS_LANDMARKS_50[currentIndex];

  const handleAnswer = (option: string) => {
    if (feedback !== null) return;
    playPopSound();
    setSelectedOption(option);

    if (option === currentLandmark.country) {
      setScore(s => s + 10);
      setFeedback('correct');
      playSuccessSound();
    } else {
      setFeedback('incorrect');
      playErrorSound();
    }

    setTimeout(() => {
      if (currentIndex + 1 >= FAMOUS_LANDMARKS_50.length) {
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
      <div className="max-w-3xl mx-auto text-center bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border-4 border-amber-300">
        <div className="text-6xl sm:text-7xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-3xl sm:text-4xl font-black text-amber-800 mb-2">مبارك! أتممت رحلة المعالم الشهيرة</h2>
        <p className="text-gray-600 text-lg sm:text-xl font-bold mb-6">
          نتيجتك النهائية: <span className="text-emerald-600 font-black">{score}</span> من {FAMOUS_LANDMARKS_50.length * 10} نقطة
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleRestart}
            className="bg-amber-500 hover:bg-amber-600 text-white font-black text-lg px-8 py-3 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
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
    <div className="max-w-4xl mx-auto bg-white p-4 sm:p-8 rounded-3xl shadow-xl border-4 border-amber-300">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <Link
          to="/"
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-xl transition-transform active:scale-95 text-sm sm:text-base"
        >
          → العودة
        </Link>
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-amber-900">{gameName}</h1>
          <span className="text-xs sm:text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            المعلم {currentIndex + 1} من {FAMOUS_LANDMARKS_50.length}
          </span>
        </div>
        <div className="bg-emerald-500 text-white font-black py-2 px-4 rounded-xl shadow text-sm sm:text-base">
          النقاط: {score}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-amber-100 h-2.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-amber-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / FAMOUS_LANDMARKS_50.length) * 100}%` }}
        />
      </div>

      {/* Main Landmark Card */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50/50 p-4 sm:p-8 rounded-3xl border border-amber-200 shadow-inner text-center">
        <h2 className="text-xl sm:text-3xl font-black text-gray-800 mb-4">
          في أي بلد يقع هذا المعلم الشهير؟
        </h2>

        {/* Real Landmark Image with High Quality & Fallback */}
        <div className="relative mx-auto w-full max-w-lg h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-md mb-4 bg-amber-100 border-2 border-amber-200 flex items-center justify-center">
          {!imgError ? (
            <img
              src={currentLandmark.image}
              alt={currentLandmark.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-amber-700">
              <span className="text-6xl sm:text-7xl mb-2">🏛️</span>
              <span className="text-lg font-black">{currentLandmark.name}</span>
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
            <h3 className="text-xl sm:text-3xl font-black text-white drop-shadow">
              {currentLandmark.name}
            </h3>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-4">
          {currentLandmark.options.map((opt) => {
            const isChosen = selectedOption === opt;
            const isCorrect = opt === currentLandmark.country;

            let btnClass = 'bg-white text-gray-800 border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 shadow-sm';

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

        {/* Feedback & Fact */}
        {feedback && (
          <div className="mt-4 p-4 rounded-2xl bg-white/90 border border-amber-200 shadow-sm max-w-xl mx-auto animate-fade-in">
            <p className={`text-xl sm:text-2xl font-black mb-1 ${feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {feedback === 'correct'
                ? '🎉 إجابة صحيحة! أحسنت يا بطل! 🎉'
                : `❌ إجابة خاطئة! البلد الصحيح هو: ${currentLandmark.country}`}
            </p>
            <p className="text-sm sm:text-base text-gray-700 font-bold">
              💡 {currentLandmark.fact}
            </p>
          </div>
        )}
      </div>

      {/* Subscription Question Gate Modal */}
      <QuestionGateModal
        isOpen={isQuestionGated}
        currentQuestionNumber={currentIndex + 1}
        totalQuestions={FAMOUS_LANDMARKS_50.length}
        gameTitle={gameName}
        onOpenVipModal={() => setIsVipModalOpen(true)}
      />

      {/* VIP Full Upgrade & Sham Cash Modal */}
      <VipSubscriptionModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
      />
    </div>
  );
};

export default FamousLandmarks;
