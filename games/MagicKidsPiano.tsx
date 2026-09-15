import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { playPianoNote } from '../utils/soundEffects';

interface GameProps {
  gameName: string;
}

const NOTES = [
  { name: 'C', arabic: 'دو', color: 'from-red-500 to-rose-600', key: 'C' },
  { name: 'D', arabic: 'ري', color: 'from-orange-500 to-amber-600', key: 'D' },
  { name: 'E', arabic: 'مي', color: 'from-yellow-400 to-amber-500', key: 'E' },
  { name: 'F', arabic: 'فا', color: 'from-green-500 to-emerald-600', key: 'F' },
  { name: 'G', arabic: 'صول', color: 'from-sky-500 to-blue-600', key: 'G' },
  { name: 'A', arabic: 'لا', color: 'from-indigo-500 to-purple-600', key: 'A' },
  { name: 'B', arabic: 'سي', color: 'from-purple-500 to-fuchsia-600', key: 'B' },
  { name: 'C2', arabic: 'دو عالية', color: 'from-pink-500 to-rose-500', key: 'C2' },
];

const MagicKidsPiano: React.FC<GameProps> = ({ gameName }) => {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const handlePlayNote = (noteKey: string) => {
    setActiveNote(noteKey);
    playPianoNote(noteKey);
    setTimeout(() => setActiveNote(null), 300);
  };

  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-purple-400">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow"
        >
          → العودة للألعاب
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-purple-800">{gameName}</h1>
        <div className="text-xs bg-purple-100 text-purple-800 font-bold px-3 py-1.5 rounded-xl border border-purple-300">
          🎹 اعزف الحانك
        </div>
      </div>

      <p className="text-lg sm:text-xl font-bold text-gray-700 mb-6">
        انقر على أي مفتاح لعزف نغمة موسيقية ساحرة وممتعة! 🎵✨
      </p>

      {/* Piano Keyboard Container */}
      <div className="bg-gray-900 p-4 sm:p-6 rounded-3xl shadow-2xl border-4 border-gray-700 max-w-2xl mx-auto">
        <div className="grid grid-cols-8 gap-1 sm:gap-2 h-64 sm:h-72 items-stretch">
          {NOTES.map((note) => {
            const isActive = activeNote === note.key;
            return (
              <button
                key={note.key}
                onClick={() => handlePlayNote(note.key)}
                className={`bg-gradient-to-b ${note.color} rounded-b-2xl border-2 border-white/40 shadow-lg flex flex-col justify-end items-center pb-4 select-none transform transition-all active:scale-95 cursor-pointer ${
                  isActive ? 'translate-y-3 brightness-125 ring-4 ring-yellow-300' : 'hover:brightness-110'
                }`}
              >
                <span className="text-white text-lg sm:text-2xl font-black drop-shadow">{note.arabic}</span>
                <span className="text-white/80 text-xs sm:text-sm font-mono font-bold mt-1">{note.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeNote && (
        <div className="mt-6 text-4xl sm:text-5xl font-black text-purple-600 animate-bounce">
          🎶 🎵 نغمة جميلة! 🎵 🎶
        </div>
      )}
    </div>
  );
};

export default MagicKidsPiano;
