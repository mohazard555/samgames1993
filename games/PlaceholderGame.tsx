import React from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

const PlaceholderGame: React.FC<GameProps> = ({ gameName }) => {
  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-amber-200">
      <div className="flex justify-between items-center mb-6">
          <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
              → العودة
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-800">{gameName}</h1>
          <div className="w-24"></div> {/* Placeholder for alignment */}
      </div>
      <div className="flex flex-col items-center justify-center h-80">
        <p className="text-3xl text-gray-700 mb-6">.هذه اللعبة قادمة قريباً</p>
        <div className="text-8xl animate-bounce">🚧</div>
        <p className="text-lg text-gray-500 mt-6">نحن نعمل بجد لإضافتها!</p>
      </div>
    </div>
  );
};

export default PlaceholderGame;
