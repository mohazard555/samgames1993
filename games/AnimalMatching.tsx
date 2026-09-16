import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { playSuccessSound, playErrorSound, playAnimalSound } from '../utils/soundEffects';

interface GameProps {
  gameName: string;
}

const ANIMALS = [
  { name: 'كلب', emoji: '🐶', soundKey: 'كلب', silhouetteEmoji: '🐕' },
  { name: 'قطة', emoji: '🐱', soundKey: 'قطة', silhouetteEmoji: '🐈' },
  { name: 'خروف', emoji: '🐑', soundKey: 'خروف', silhouetteEmoji: '🐑' },
  { name: 'بقرة', emoji: '🐮', soundKey: 'بقرة', silhouetteEmoji: '🐄' },
  { name: 'أسد', emoji: '🦁', soundKey: 'أسد', silhouetteEmoji: '🦁' },
  { name: 'حصان', emoji: '🐴', soundKey: 'حصان', silhouetteEmoji: '🐎' },
  { name: 'فيل', emoji: '🐘', soundKey: 'فيل', silhouetteEmoji: '🐘' },
  { name: 'قرد', emoji: '🐒', soundKey: 'قرد', silhouetteEmoji: '🐵' },
  { name: 'بطة', emoji: '🦆', soundKey: 'بطة', silhouetteEmoji: '🦆' },
  { name: 'أرنب', emoji: '🐰', soundKey: 'أرنب', silhouetteEmoji: '🐇' },
  { name: 'ثعلب', emoji: '🦊', soundKey: 'ثعلب', silhouetteEmoji: '🦊' },
  { name: 'ديك', emoji: '🐓', soundKey: 'ديك', silhouetteEmoji: '🐔' },
  { name: 'بومة', emoji: '🦉', soundKey: 'بومة', silhouetteEmoji: '🦉' },
  { name: 'ضفدع', emoji: '🐸', soundKey: 'ضفدع', silhouetteEmoji: '🐸' },
  { name: 'دلفين', emoji: '🐬', soundKey: 'دلفين', silhouetteEmoji: '🐬' },
];

const AnimalMatching: React.FC<GameProps> = ({ gameName }) => {
  const [score, setScore] = useState(0);
  const [targetAnimal, setTargetAnimal] = useState<(typeof ANIMALS)[0] | null>(null);
  const [options, setOptions] = useState<typeof ANIMALS>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

  const generateNewRound = useCallback(() => {
    setFeedback(null);
    const correctAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setTargetAnimal(correctAnimal);

    const wrongOptions = ANIMALS.filter((a) => a.name !== correctAnimal.name);
    const shuffledWrongOptions = shuffleArray(wrongOptions).slice(0, 3);

    const allOptions = shuffleArray([correctAnimal, ...shuffledWrongOptions]);
    setOptions(allOptions);
  }, []);

  useEffect(() => {
    generateNewRound();
  }, [generateNewRound]);

  const handleSelectAnimal = (animalName: string) => {
    if (feedback) return;
    if (animalName === targetAnimal?.name) {
      setScore((s) => s + 10);
      setFeedback('correct');
      playSuccessSound();
      if (targetAnimal) {
        setTimeout(() => playAnimalSound(targetAnimal.soundKey), 250);
      }
    } else {
      setFeedback('incorrect');
      playErrorSound();
    }
    setTimeout(() => generateNewRound(), 1500);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, animalName: string) => {
    e.dataTransfer.setData('text/plain', animalName);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedAnimalName = e.dataTransfer.getData('text/plain');
    if (droppedAnimalName) {
      handleSelectAnimal(droppedAnimalName);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-emerald-300">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow"
        >
          → العودة للألعاب
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-emerald-800">{gameName}</h1>
        <div className="bg-amber-500 text-white font-bold py-2 px-4 rounded-xl shadow">النقاط: {score}</div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        {/* Drop Zone / Shadow View */}
        <div
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-emerald-50 to-teal-50 rounded-3xl border-4 border-dashed border-emerald-300 min-h-[260px] shadow-inner"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {targetAnimal && (
            <div className="relative">
              <span
                className="text-8xl sm:text-9xl block select-none filter grayscale contrast-200 brightness-0 opacity-80"
                title={`ظل ${targetAnimal.name}`}
              >
                {targetAnimal.emoji}
              </span>
            </div>
          )}
          <p className="mt-4 text-emerald-800 font-black text-base sm:text-lg">
            من هو الحيوان المطابق لهذا الظل؟ 🐾
          </p>
          <span className="text-xs text-gray-500 font-bold">(اسحب الحيوان أو اضغط عليه مباشرة)</span>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((animal) => (
            <button
              key={animal.name}
              draggable
              onDragStart={(e) => handleDragStart(e, animal.name)}
              onClick={() => handleSelectAnimal(animal.name)}
              className="bg-gradient-to-b from-emerald-100 to-green-200 hover:from-emerald-200 hover:to-green-300 p-4 sm:p-5 rounded-3xl cursor-pointer flex flex-col items-center justify-center transform hover:scale-105 active:scale-95 transition-all shadow-md border-2 border-emerald-300"
            >
              <span className="text-6xl sm:text-7xl mb-2 select-none">{animal.emoji}</span>
              <span className="font-black text-xl text-emerald-950">{animal.name}</span>
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="mt-6 text-2xl sm:text-3xl font-black animate-bounce">
          {feedback === 'correct' && (
            <p className="text-emerald-600 bg-emerald-50 py-3 rounded-2xl border border-emerald-200">
              🎉 رائع وممتاز! إجابة مطابقة تماماً! 🎉
            </p>
          )}
          {feedback === 'incorrect' && (
            <p className="text-rose-600 bg-rose-50 py-3 rounded-2xl border border-rose-200">
              😞 ليس هذا الحيوان.. ركّز وحاول مجدداً! 😞
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimalMatching;
