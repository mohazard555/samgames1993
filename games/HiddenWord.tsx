import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const WORDS = [
    { word: 'قطة', image: '🐈' },
    { word: 'شمس', image: '☀️' },
    { word: 'بيت', image: '🏠' },
];
const ALPHABET = 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');

const HiddenWord: React.FC<GameProps> = ({ gameName }) => {
    const [currentWord, setCurrentWord] = useState(WORDS[0]);
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [mistakes, setMistakes] = useState(0);

    const setupNewWord = () => {
        setCurrentWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
        setGuessedLetters([]);
        setMistakes(0);
    };

    useEffect(setupNewWord, []);

    const handleGuess = (letter: string) => {
        if (guessedLetters.includes(letter)) return;
        setGuessedLetters([...guessedLetters, letter]);
        if (!currentWord.word.includes(letter)) {
            setMistakes(m => m + 1);
        }
    };
    
    const isWon = currentWord.word.split('').every(l => guessedLetters.includes(l));
    const isLost = mistakes >= 6;

    const displayWord = currentWord.word.split('').map(l => guessedLetters.includes(l) ? l : '_').join(' ');

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-blue-800">{gameName}</h1>
                <div className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">الأخطاء: {mistakes}/6</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">خمّن الكلمة المتعلقة بالصورة:</h2>

            <div className="flex justify-center items-center gap-8 mb-6">
                <div className="text-8xl">{currentWord.image}</div>
                <div className="text-6xl font-bold tracking-[0.5em]">{displayWord}</div>
            </div>
            
            {isWon || isLost ? (
                 <div className="h-48 flex flex-col justify-center items-center">
                    <h2 className={`text-4xl font-bold mb-4 ${isWon ? 'text-green-500' : 'text-red-500'}`}>
                        {isWon ? '🎉 لقد فزت! 🎉' : '😞 لقد خسرت! 😞'}
                    </h2>
                    <p className="text-2xl">الكلمة كانت: {currentWord.word}</p>
                    <button onClick={setupNewWord} className="mt-4 bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">كلمة جديدة</button>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                    {ALPHABET.map(letter => (
                        <button key={letter} onClick={() => handleGuess(letter)} disabled={guessedLetters.includes(letter)} className="w-12 h-12 bg-blue-200 text-xl font-bold rounded-lg disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-300">
                            {letter}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HiddenWord;
