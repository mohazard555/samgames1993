import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { playSuccessSound, playErrorSound, playAnimalSound, playObjectSound } from '../utils/soundEffects';

interface GameProps { gameName: string; }

interface SoundItem {
  question: string;
  soundType: 'animal' | 'object';
  soundKey: string;
  answer: string;
  options: string[];
}

const SOUNDS: SoundItem[] = [
  { question: "ما هو الحيوان الذي يصدر هذا الصوت؟", soundType: 'animal', soundKey: 'قطة', answer: '🐱', options: ['🐶', '🐱', '🐮'] },
  { question: "ما هو الشيء الذي يصدر هذا الصوت؟", soundType: 'object', soundKey: 'سيارة', answer: '🚗', options: ['✈️', '🚲', '🚗'] },
  { question: "ما هو الحيوان الذي يصدر هذا الصوت؟", soundType: 'animal', soundKey: 'كلب', answer: '🐶', options: ['🐶', '🦁', '🐑'] },
  { question: "ما هو الشيء الذي يصدر هذا الصوت؟", soundType: 'object', soundKey: 'هاتف', answer: '☎️', options: ['⏰', '☎️', '🔔'] },
  { question: "ما هو الحيوان الذي يصدر هذا الصوت؟", soundType: 'animal', soundKey: 'بقرة', answer: '🐮', options: ['🐮', '🐱', '🐔'] },
  { question: "ما هو الحيوان الذي يصدر هذا الصوت؟", soundType: 'animal', soundKey: 'خروف', answer: '🐑', options: ['🐶', '🐑', '🦁'] },
  { question: "ما هو الحيوان الذي يصدر هذا الصوت؟", soundType: 'animal', soundKey: 'عصفور', answer: '🐦', options: ['🐦', '🦆', '🐮'] },
  { question: "ما هو الحيوان الذي يصدر هذا الصوت؟", soundType: 'animal', soundKey: 'بطة', answer: '🦆', options: ['🐱', '🦆', '🐑'] },
  { question: "ما هو الشيء الذي يصدر هذا الصوت؟", soundType: 'object', soundKey: 'جرس', answer: '🔔', options: ['🔔', '☎️', '🚗'] },
  { question: "ما هو الشيء الذي يصدر هذا الصوت؟", soundType: 'object', soundKey: 'ساعة', answer: '⏰', options: ['⏰', '🔔', '✈️'] },
];

const GuessTheSound: React.FC<GameProps> = ({ gameName }) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(SOUNDS[0]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const playCurrentSound = useCallback((item?: SoundItem) => {
    const q = item || currentQuestion;
    setIsPlayingAudio(true);
    if (q.soundType === 'animal') {
      playAnimalSound(q.soundKey);
    } else {
      playObjectSound(q.soundKey);
    }
    setTimeout(() => setIsPlayingAudio(false), 900);
  }, [currentQuestion]);

  const generateRound = useCallback(() => {
    setFeedback(null);
    const newQuestion = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
    const shuffledOptions = [...newQuestion.options].sort(() => Math.random() - 0.5);
    const questionObj = { ...newQuestion, options: shuffledOptions };
    setCurrentQuestion(questionObj);
    // Automatically play sound for the new question
    setTimeout(() => {
      playCurrentSound(questionObj);
    }, 300);
  }, [playCurrentSound]);

  useEffect(() => {
    generateRound();
  }, []);

  const handleAnswer = (option: string) => {
    if (feedback) return;
    if (option === currentQuestion.answer) {
      setScore((s) => s + 10);
      setFeedback('correct');
      playSuccessSound();
    } else {
      setFeedback('incorrect');
      playErrorSound();
    }
    setTimeout(generateRound, 1600);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-cyan-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow">
          → العودة للألعاب
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-cyan-800">{gameName}</h1>
        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl shadow">النقاط: {score}</div>
      </div>

      <div className="bg-gradient-to-b from-cyan-50 to-blue-50 p-6 sm:p-8 rounded-3xl border border-cyan-200 shadow-inner">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-6">{currentQuestion.question}</h2>

        {/* Audio play trigger button */}
        <div className="mb-8">
          <button
            onClick={() => playCurrentSound()}
            className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-lg sm:text-xl text-white shadow-lg transition-all active:scale-95 ${
              isPlayingAudio
                ? 'bg-amber-500 ring-4 ring-amber-300 animate-pulse'
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700'
            }`}
          >
            <span className="text-3xl">🔊</span>
            <span>{isPlayingAudio ? 'جاري تشغيل الصوت...' : 'انقر لسماع الصوت مرة أخرى'}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className="bg-white hover:bg-cyan-100 text-6xl sm:text-7xl p-6 rounded-2xl border-2 border-cyan-200 hover:border-cyan-400 shadow-md hover:shadow-lg transform transition-all active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="mt-6 text-2xl sm:text-3xl font-black animate-bounce">
          {feedback === 'correct' && <p className="text-emerald-600 bg-emerald-50 py-3 rounded-2xl border border-emerald-200">🎉 رائع! إجابة صحيحة! 🎉</p>}
          {feedback === 'incorrect' && <p className="text-rose-600 bg-rose-50 py-3 rounded-2xl border border-rose-200">😞 حاول مرة أخرى يا بطل! 😞</p>}
        </div>
      )}
    </div>
  );
};

export default GuessTheSound;
