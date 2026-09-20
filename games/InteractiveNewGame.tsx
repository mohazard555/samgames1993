import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NEW_GAMES_REGISTRY, GameDefinition, QuizQuestion, ComparisonRound } from './newGamesData';
import { GAMES } from '../constants';
import { getAuthentic50Items } from './banks/allBanks';
import { getQuestionVisual, getOptionEmoji } from '../src/utils/questionVisuals';
import { useSettings } from '../contexts/SettingsContext';
import QuestionGateModal from '../components/QuestionGateModal';
import VipSubscriptionModal from '../components/VipSubscriptionModal';
import {
  playSuccessSound,
  playErrorSound,
  playPopSound,
  playWinFanfare,
  playObjectSound,
  playPianoNote,
} from '../utils/soundEffects';

const EMOJI_REGEX = /[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}]/u;

function resolveItemEmoji(item?: { label: string; emoji?: string; description?: string }): string {
  if (!item) return '✨';
  if (item.emoji && item.emoji !== '⭐' && item.emoji !== '🎯' && EMOJI_REGEX.test(item.emoji)) {
    return item.emoji;
  }
  if (item.description) {
    const found = item.description.match(EMOJI_REGEX);
    if (found && found.length > 0) return found[0];
  }
  if (item.label) {
    const found = item.label.match(EMOJI_REGEX);
    if (found && found.length > 0) return found[0];
  }
  return '✨';
}

interface InteractiveNewGameProps {
  gameName: string;
}

export const InteractiveNewGame: React.FC<InteractiveNewGameProps> = ({ gameName }) => {
  const fallbackDef: GameDefinition = {
    id: `game-${gameName}`,
    title: gameName,
    category: 'ألعاب تفاعلية وتعليمية',
    type: 'quiz',
    themeColor: 'from-sky-500 to-indigo-600',
    iconEmoji: '🎮',
    description: `العب وتعلم مع لعبة ${gameName} الممتعة للأبطال الصغار!`,
  };
  const gameDef: GameDefinition = NEW_GAMES_REGISTRY[gameName] || fallbackDef;
  const { settings, isVipActive, isGameVip, getGameVipConfig } = useSettings();
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  const matchedGame = GAMES.find((g) => g.name === gameName);
  const currentGameId = matchedGame ? matchedGame.id : 0;
  const isVip = isGameVip(currentGameId);
  const vipConfig = getGameVipConfig(currentGameId);
  const isQuestionMode = vipConfig.restrictionType === 'question_limit';
  const gateNumber = vipConfig.questionLimit || settings.paidSettings?.questionGateNumber || 10;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [shuffledComparisons, setShuffledComparisons] = useState<ComparisonRound[]>([]);

  const isQuestionGated =
    !isVipActive &&
    Boolean(settings.paidSettings?.enabled) &&
    isVip &&
    isQuestionMode &&
    currentIndex + 1 >= gateNumber;

  const loadGameData = (def: GameDefinition) => {
    const data = getAuthentic50Items(def);
    if (data.type === 'quiz' && data.questions && data.questions.length > 0) {
      const randomized = data.questions.map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      })).sort(() => Math.random() - 0.5);
      setShuffledQuestions(randomized);
    } else if (data.comparisons && data.comparisons.length > 0) {
      const randomized = [...data.comparisons].sort(() => Math.random() - 0.5);
      setShuffledComparisons(randomized);
    }
  };

  useEffect(() => {
    if (gameDef) {
      loadGameData(gameDef);
      setCurrentIndex(0);
      setScore(0);
      setStreak(0);
      setFeedback(null);
      setSelectedAnswer(null);
      setIsCompleted(false);
    }
  }, [gameName]);

  if (!gameDef) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow-xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{gameName}</h2>
        <p className="text-gray-600 mb-6">جاري تجهيز محتوى هذه اللعبة التفاعلية...</p>
        <Link to="/" className="inline-block bg-sky-500 text-white font-bold px-6 py-2 rounded-xl">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const isQuiz = gameDef.type === 'quiz';
  const questions = shuffledQuestions.length > 0 ? shuffledQuestions : (gameDef.questions || []);
  const comparisons = shuffledComparisons.length > 0 ? shuffledComparisons : (gameDef.comparisons || []);
  const totalItems = isQuiz ? questions.length : comparisons.length;

  const handleQuizAnswer = (option: string, correctAnswer: string) => {
    if (feedback !== null) return;
    setSelectedAnswer(option);

    if (option === correctAnswer) {
      setFeedback('correct');
      const newScore = score + 10 + streak * 2;
      setScore(newScore);
      setStreak((s) => s + 1);
      playSuccessSound();
    } else {
      setFeedback('incorrect');
      setStreak(0);
      playErrorSound();
    }

    setTimeout(() => {
      if (currentIndex + 1 >= totalItems) {
        setIsCompleted(true);
        playWinFanfare();
      } else {
        setCurrentIndex((i) => i + 1);
        setFeedback(null);
        setSelectedAnswer(null);
      }
    }, 1800);
  };

  const handleComparisonSelect = (chosenIndex: number, correctIndex: number) => {
    if (feedback !== null) return;
    setSelectedAnswer(chosenIndex);

    if (chosenIndex === correctIndex) {
      setFeedback('correct');
      const newScore = score + 15 + streak * 3;
      setScore(newScore);
      setStreak((s) => s + 1);
      playSuccessSound();
    } else {
      setFeedback('incorrect');
      setStreak(0);
      playErrorSound();
    }

    setTimeout(() => {
      if (currentIndex + 1 >= totalItems) {
        setIsCompleted(true);
        playWinFanfare();
      } else {
        setCurrentIndex((i) => i + 1);
        setFeedback(null);
        setSelectedAnswer(null);
      }
    }, 1800);
  };

  const handleRestart = () => {
    playPopSound();
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setSelectedAnswer(null);
    setIsCompleted(false);
    if (gameDef) {
      loadGameData(gameDef);
    }
  };

  if (isCompleted) {
    const starCount = score >= totalItems * 10 ? 3 : score >= totalItems * 6 ? 2 : 1;

    return (
      <div className="max-w-2xl mx-auto text-center bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border-4 border-amber-300 animate-fade-in">
        <div className="text-7xl sm:text-8xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-3xl sm:text-4xl font-black text-amber-600 mb-2">
          رائع يا بطل! أنهيت اللعبة بنجاح 🎉
        </h2>
        <p className="text-lg text-gray-700 font-bold mb-6">{gameDef.title}</p>

        {/* Stars */}
        <div className="flex justify-center gap-3 text-5xl mb-6">
          <span className={starCount >= 1 ? 'text-amber-400 scale-110' : 'text-gray-300'}>⭐</span>
          <span className={starCount >= 2 ? 'text-amber-400 scale-125' : 'text-gray-300'}>⭐</span>
          <span className={starCount >= 3 ? 'text-amber-400 scale-110' : 'text-gray-300'}>⭐</span>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl mb-8 max-w-sm mx-auto">
          <p className="text-gray-600 font-bold mb-1">النتيجة النهائية</p>
          <p className="text-4xl font-black text-amber-700">{score} نقطة</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleRestart}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xl font-bold py-3 px-8 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            🔄 العب مرة أخرى
          </button>
          <Link
            to="/"
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xl font-bold py-3 px-8 rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            🏠 العودة لجميع الألعاب
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = isQuiz ? questions[currentIndex] : null;
  const currentComp = !isQuiz ? comparisons[currentIndex] : null;

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-sky-300">
      {/* Top Header */}
      <div className="flex justify-between items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="text-right">
          <h1 className="text-lg sm:text-2xl font-black text-sky-900 flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl">{gameDef.iconEmoji}</span>
            <span>{gameDef.title}</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 font-bold">{gameDef.description}</p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {streak > 1 && (
            <span className="bg-orange-500 text-white font-black px-2 sm:px-3 py-1 rounded-xl text-xs sm:text-sm shadow animate-pulse whitespace-nowrap">
              🔥 {streak}
            </span>
          )}
          <div className="bg-emerald-500 text-white font-black py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl shadow text-xs sm:text-base whitespace-nowrap">
            النقاط: {score}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
          <span>
            السؤال {currentIndex + 1} من {totalItems}
          </span>
          <span>{Math.round(((currentIndex + 1) / totalItems) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-400 to-emerald-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${((currentIndex + 1) / totalItems) * 100}%` }}
          />
        </div>
      </div>

      {/* MAIN GAME CONTENT */}
      {isQuiz && currentQ && (() => {
        const qVisual = getQuestionVisual(
          currentQ.question,
          currentQ.badge,
          currentQ.image,
          currentQ.correctAnswer
        );

        return (
          <div className="bg-gradient-to-b from-sky-50 to-blue-50/50 p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-inner">
            {/* Dynamic Question Thematic Visual (Directly linked to question content) */}
            <div className="flex flex-col items-center justify-center mb-4">
              {qVisual.type === 'image' ? (
                <img
                  src={qVisual.value}
                  alt={currentQ.question}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-2xl shadow-sm border border-sky-200 bg-white p-2"
                />
              ) : (
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ${qVisual.badgeBg} border-2 ${qVisual.badgeBorder} flex items-center justify-center text-3xl sm:text-4xl shadow-sm transition-transform hover:scale-110`}
                >
                  {qVisual.value}
                </div>
              )}
              {currentQ.badge && (
                <span className="mt-2.5 inline-block bg-sky-100 text-sky-800 text-xs font-black px-3 py-1 rounded-full border border-sky-200">
                  {currentQ.badge}
                </span>
              )}
            </div>

            {/* Question Text */}
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 text-center mb-4 leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {currentQ.options.map((option, idx) => {
                const isChosen = selectedAnswer === option;
                const isCorrectOpt = option === currentQ.correctAnswer;

                let btnStyle =
                  'bg-white text-gray-800 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50 shadow-md';

                if (feedback !== null) {
                  if (isCorrectOpt) {
                    btnStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-lg scale-102';
                  } else if (isChosen && !isCorrectOpt) {
                    btnStyle = 'bg-rose-500 text-white border-2 border-rose-600 shadow-lg opacity-80';
                  } else {
                    btnStyle = 'bg-gray-100 text-gray-400 border-gray-200 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(option, currentQ.correctAnswer)}
                    disabled={feedback !== null}
                    className={`p-4 sm:p-5 rounded-2xl text-lg sm:text-xl font-black transition-all transform active:scale-95 flex items-center justify-between text-right cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-2xl shadow-sm">
                        {getOptionEmoji(option)}
                      </span>
                      <span>{option}</span>
                    </div>
                    {feedback !== null && isCorrectOpt && <span className="text-2xl">✅</span>}
                    {feedback !== null && isChosen && !isCorrectOpt && (
                      <span className="text-2xl">❌</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback message and explanation */}
            {feedback && (
              <div className="mt-6 text-center animate-fade-in">
                <p
                  className={`text-2xl sm:text-3xl font-black mb-2 ${
                    feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {feedback === 'correct' ? '🎉 إجابة صحيحة! أحسنت يا بطل! 🎉' : '💡 إجابة غير صحيحة، حاول مجدداً!'}
                </p>
                {currentQ.explanation && (
                  <div className="bg-white/80 p-3 rounded-xl border border-sky-200 max-w-lg mx-auto text-gray-700 text-sm sm:text-base font-bold">
                    {currentQ.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* COMPARISON MODE */}
      {!isQuiz && currentComp && (() => {
        const emojiA = resolveItemEmoji(currentComp.itemA);
        const emojiB = resolveItemEmoji(currentComp.itemB);

        return (
          <div className="bg-gradient-to-b from-amber-50 to-orange-50/50 p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-amber-200 shadow-inner">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 text-center mb-4 sm:mb-8">
              {currentComp.prompt}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 max-w-2xl mx-auto mb-4 sm:mb-6">
              {/* Item A */}
              <button
                onClick={() => handleComparisonSelect(0, currentComp.correctIndex)}
                disabled={feedback !== null}
                className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-3 sm:border-4 text-center transition-all transform hover:scale-102 active:scale-95 cursor-pointer shadow-md ${
                  feedback === null
                    ? 'bg-white border-amber-300 hover:border-amber-400 hover:bg-amber-50/50'
                    : currentComp.correctIndex === 0
                    ? 'bg-emerald-100 border-emerald-500 scale-102'
                    : selectedAnswer === 0
                    ? 'bg-rose-100 border-rose-500 opacity-80'
                    : 'bg-gray-100 border-gray-200 opacity-50'
                }`}
              >
                <div className="text-5xl sm:text-7xl md:text-8xl mb-2 sm:mb-3 filter drop-shadow">
                  {emojiA}
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-gray-800 mb-1">
                  {currentComp.itemA.label}
                </h3>
                {currentComp.itemA.description && (
                  <p className="text-[11px] sm:text-xs text-gray-500 font-bold">{currentComp.itemA.description}</p>
                )}
                {feedback !== null && currentComp.correctIndex === 0 && (
                  <div className="mt-2 text-emerald-600 font-black text-sm sm:text-lg">✅ الإجابة الصحيحة</div>
                )}
                {feedback !== null && selectedAnswer === 0 && currentComp.correctIndex !== 0 && (
                  <div className="mt-2 text-rose-600 font-black text-sm sm:text-lg">❌ غير صحيح</div>
                )}
              </button>

              {/* Item B */}
              <button
                onClick={() => handleComparisonSelect(1, currentComp.correctIndex)}
                disabled={feedback !== null}
                className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-3 sm:border-4 text-center transition-all transform hover:scale-102 active:scale-95 cursor-pointer shadow-md ${
                  feedback === null
                    ? 'bg-white border-amber-300 hover:border-amber-400 hover:bg-amber-50/50'
                    : currentComp.correctIndex === 1
                    ? 'bg-emerald-100 border-emerald-500 scale-102'
                    : selectedAnswer === 1
                    ? 'bg-rose-100 border-rose-500 opacity-80'
                    : 'bg-gray-100 border-gray-200 opacity-50'
                }`}
              >
                <div className="text-5xl sm:text-7xl md:text-8xl mb-2 sm:mb-3 filter drop-shadow">
                  {emojiB}
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-gray-800 mb-1">
                  {currentComp.itemB.label}
                </h3>
                {currentComp.itemB.description && (
                  <p className="text-[11px] sm:text-xs text-gray-500 font-bold">{currentComp.itemB.description}</p>
                )}
                {feedback !== null && currentComp.correctIndex === 1 && (
                  <div className="mt-2 text-emerald-600 font-black text-sm sm:text-lg">✅ الإجابة الصحيحة</div>
                )}
                {feedback !== null && selectedAnswer === 1 && currentComp.correctIndex !== 1 && (
                  <div className="mt-2 text-rose-600 font-black text-sm sm:text-lg">❌ غير صحيح</div>
                )}
              </button>
            </div>

            {/* Feedback & Explanation */}
            {feedback && (
              <div className="text-center animate-fade-in">
                <p
                  className={`text-2xl sm:text-3xl font-black mb-2 ${
                    feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {feedback === 'correct' ? '🌟 أحسنت المقارنة يا بطل! 🌟' : '💡 حاول في الجولة القادمة!'}
                </p>
                {currentComp.explanation && (
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-200 max-w-lg mx-auto text-gray-700 text-sm sm:text-base font-bold">
                    {currentComp.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* Subscription Question Gate Modal when reaching question 15+ */}
      <QuestionGateModal
        isOpen={isQuestionGated}
        currentQuestionNumber={currentIndex + 1}
        totalQuestions={totalItems}
        gameTitle={gameDef.title}
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

export default InteractiveNewGame;
