import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { playAnimalSound } from '../utils/soundEffects';

interface GameProps { gameName: string; }

const ANIMALS = [
  { name: 'بقرة', emoji: '🐮', soundText: 'موو موو', key: 'بقرة', color: 'from-amber-100 to-amber-200' },
  { name: 'كلب', emoji: '🐶', soundText: 'هوهو (نباح)', key: 'كلب', color: 'from-blue-100 to-blue-200' },
  { name: 'قطة', emoji: '🐱', soundText: 'مياو (مواء)', key: 'قطة', color: 'from-pink-100 to-pink-200' },
  { name: 'خروف', emoji: '🐑', soundText: 'باع باع (ثغاء)', key: 'خروف', color: 'from-green-100 to-green-200' },
  { name: 'أسد', emoji: '🦁', soundText: 'غراار (زئير)', key: 'أسد', color: 'from-orange-100 to-orange-200' },
  { name: 'ديك', emoji: '🐔', soundText: 'كوكو كوكو (صياح)', key: 'ديك', color: 'from-red-100 to-red-200' },
  { name: 'عصفور', emoji: '🐦', soundText: 'تغريد جميل (سوسو)', key: 'عصفور', color: 'from-sky-100 to-sky-200' },
  { name: 'بطة', emoji: '🦆', soundText: 'واك واك', key: 'بطة', color: 'from-teal-100 to-teal-200' },
];

const DiscoverAnimalSounds: React.FC<GameProps> = ({ gameName }) => {
  const [activeAnimal, setActiveAnimal] = useState<string | null>(null);

  const handleAnimalClick = (animal: (typeof ANIMALS)[0]) => {
    setActiveAnimal(animal.name);
    playAnimalSound(animal.key);
    setTimeout(() => {
      setActiveAnimal(null);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-yellow-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow">
          → العودة للألعاب
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-yellow-800">{gameName}</h1>
        <div className="text-xs bg-yellow-100 text-yellow-800 font-bold px-3 py-1.5 rounded-xl border border-yellow-300">
          🔊 اضغط واسمع
        </div>
      </div>

      <p className="text-lg sm:text-xl font-bold text-gray-700 mb-6">
        انقر على أي حيوان لسماع صوته الحقيقي فوراً! 🐾
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {ANIMALS.map((animal) => {
          const isActive = activeAnimal === animal.name;
          return (
            <button
              key={animal.name}
              onClick={() => handleAnimalClick(animal)}
              className={`bg-gradient-to-b ${animal.color} p-5 sm:p-6 rounded-3xl flex flex-col items-center justify-center border-2 border-yellow-200 shadow-md hover:shadow-xl transform transition-all active:scale-95 ${
                isActive ? 'scale-105 ring-4 ring-yellow-400' : 'hover:-translate-y-1'
              }`}
            >
              <span className={`text-6xl sm:text-7xl mb-2 select-none ${isActive ? 'animate-bounce' : ''}`}>
                {animal.emoji}
              </span>
              <span className="text-xl sm:text-2xl font-black text-gray-800">{animal.name}</span>
              <span className="text-xs text-gray-600 font-bold mt-1 bg-white/70 px-2 py-0.5 rounded-full">
                {animal.soundText}
              </span>
            </button>
          );
        })}
      </div>

      {activeAnimal && (
        <div className="mt-6 p-4 bg-yellow-100 rounded-2xl border-2 border-yellow-300 animate-fade-in">
          <p className="text-2xl sm:text-3xl font-black text-yellow-900">
            🔊 جاري تشغيل صوت {activeAnimal}!
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscoverAnimalSounds;
