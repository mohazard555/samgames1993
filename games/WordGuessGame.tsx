import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const WORDS = [
    { word: 'شمس', image: '☀️' },
    { word: 'قمر', image: '🌙' },
    { word: 'نجم', image: '⭐' },
    { word: 'قط', image: '🐈' },
];

const WordGuessGame: React.FC<GameProps> = ({ gameName }) => {
    const [currentWord, setCurrentWord] = useState(WORDS[0]);
    const [scrambled, setScrambled] = useState<string[]>([]);
    const [guessed, setGuessed] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);

    const setupWord = useMemo(() => () => {
        const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        setCurrentWord(newWord);
        setScrambled(newWord.word.split('').sort(() => Math.random() - 0.5));
        setGuessed([]);
        setIsCorrect(false);
    }, []);

    useEffect(() => {
        setupWord();
    }, [setupWord]);

    useEffect(() => {
        if (guessed.length === currentWord.word.length) {
            if (guessed.join('') === currentWord.word) {
                setIsCorrect(true);
                setTimeout(setupWord, 1500);
            }
        }
    }, [guessed, currentWord.word, setupWord]);

    const handleLetterClick = (letter: string, index: number) => {
        setGuessed([...guessed, letter]);
        setScrambled(scrambled.filter((_, i) => i !== index));
    };

    const handleReset = () => {
        setScrambled(currentWord.word.split('').sort(() => Math.random() - 0.5));
        setGuessed([]);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-cyan-200">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-cyan-800">{gameName}</h1>
                <button onClick={setupWord} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">كلمة جديدة</button>
            </div>
            
            <p className="text-xl text-gray-600 mb-4">رتّب الحروف لتكوين الكلمة الصحيحة!</p>
            <div className="text-9xl mb-6">{currentWord.image}</div>

            <div className="h-20 w-full bg-gray-100 rounded-lg flex justify-center items-center text-5xl tracking-[0.5em] mb-6">
                {guessed.join('')}
            </div>

            <div className="h-24 flex justify-center items-center gap-4">
                {scrambled.map((letter, index) => (
                    <button key={index} onClick={() => handleLetterClick(letter, index)} className="w-16 h-16 bg-cyan-400 text-white text-4xl font-bold rounded-lg flex items-center justify-center transform hover:scale-110">
                        {letter}
                    </button>
                ))}
            </div>

            <button onClick={handleReset} className="mt-4 text-sm text-red-500 hover:underline">إعادة المحاولة</button>

            {isCorrect && (
                <p className="mt-4 text-3xl font-bold text-green-500">🎉 أحسنت! 🎉</p>
            )}
        </div>
    );
};

export default WordGuessGame;
