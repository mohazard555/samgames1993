import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

const ANIMALS = [
  { name: 'كلب', emoji: '🐶', silhouette: 'https://img.icons8.com/material-outlined/96/000000/dog.png' },
  { name: 'قطة', emoji: '🐱', silhouette: 'https://img.icons8.com/material-outlined/96/000000/cat.png' },
  { name: 'فأر', emoji: '🐭', silhouette: 'https://img.icons8.com/material-outlined/96/000000/mouse.png' },
  { name: 'أرنب', emoji: '🐰', silhouette: 'https://img.icons8.com/material-outlined/96/000000/rabbit.png' },
  { name: 'دب', emoji: '🐻', silhouette: 'https://img.icons8.com/material-outlined/96/000000/bear.png' },
  { name: 'باندا', emoji: '🐼', silhouette: 'https://img.icons8.com/material-outlined/96/000000/panda.png' },
];

// Simple silhouette component
const Silhouette: React.FC<{ animal: typeof ANIMALS[0] }> = ({ animal }) => (
    <div className="w-48 h-48 bg-gray-800 flex items-center justify-center rounded-2xl" style={{
        maskImage: `url(${animal.silhouette})`,
        WebkitMaskImage: `url(${animal.silhouette})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
    }}>
    </div>
);

const AnimalMatching: React.FC<GameProps> = ({ gameName }) => {
  const [score, setScore] = useState(0);
  const [targetAnimal, setTargetAnimal] = useState<typeof ANIMALS[0] | null>(null);
  const [options, setOptions] = useState<typeof ANIMALS[0][]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

  const generateNewRound = useCallback(() => {
    setFeedback(null);
    const correctAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setTargetAnimal(correctAnimal);

    const wrongOptions = ANIMALS.filter(a => a.name !== correctAnimal.name);
    const shuffledWrongOptions = shuffleArray(wrongOptions).slice(0, 3);
    
    const allOptions = shuffleArray([correctAnimal, ...shuffledWrongOptions]);
    setOptions(allOptions);
  }, []);

  useEffect(() => {
    generateNewRound();
  }, [generateNewRound]);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, animalName: string) => {
    e.dataTransfer.setData('text/plain', animalName);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (feedback) return;
    const droppedAnimalName = e.dataTransfer.getData('text/plain');
    if (droppedAnimalName === targetAnimal?.name) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
    setTimeout(() => generateNewRound(), 1500);
  };


  return (
    <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-green-300">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
          → العودة
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-green-800">{gameName}</h1>
        <div className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">
          النقاط: {score}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Drop Zone */}
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-3xl h-64" onDragOver={handleDragOver} onDrop={handleDrop}>
          {targetAnimal && <Silhouette animal={targetAnimal} />}
          <p className="mt-4 text-gray-500 font-semibold">اسحب الحيوان الصحيح إلى هنا</p>
        </div>
        
        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
            {options.map(animal => (
                <div 
                    key={animal.name} 
                    draggable 
                    onDragStart={(e) => handleDragStart(e, animal.name)} 
                    className="bg-green-100 p-4 rounded-2xl cursor-grab active:cursor-grabbing flex flex-col items-center justify-center transform hover:scale-105 transition-transform"
                >
                    <span className="text-7xl">{animal.emoji}</span>
                    <span className="font-bold text-lg text-green-900">{animal.name}</span>
                </div>
            ))}
        </div>
      </div>
      
       {feedback && (
        <div className="mt-6 text-4xl font-extrabold">
            {feedback === 'correct' && <p className="text-green-500">🎉 رائع! مطابق! 🎉</p>}
            {feedback === 'incorrect' && <p className="text-red-500">😞 ليس هذا! حاول مرة أخرى! 😞</p>}
        </div>
      )}

    </div>
  );
};

export default AnimalMatching;
