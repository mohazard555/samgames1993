import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

interface Letter {
    id: number;
    char: string;
    x: number;
    y: number;
}

const ALPHABET = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';

const FlyingLetters: React.FC<GameProps> = ({ gameName }) => {
    const [letters, setLetters] = useState<Letter[]>([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');

    const startGame = () => {
        setLetters([]);
        setScore(0);
        setGameState('playing');
    };

    const gameLoop = useCallback(() => {
        if (gameState !== 'playing') return;

        // Move letters down
        setLetters(l => {
            const newLetters = l.map(letter => ({ ...letter, y: letter.y + 1 }));
            if (newLetters.some(letter => letter.y > 400)) {
                setGameState('over');
            }
            return newLetters;
        });
        
        // Add new letters
        if (Math.random() < 0.1) {
            const newLetter: Letter = {
                id: Date.now(),
                char: ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
                x: Math.random() * 550,
                y: -20,
            };
            setLetters(l => [...l, newLetter]);
        }

    }, [gameState]);

    useEffect(() => {
        const interval = setInterval(gameLoop, 100);
        return () => clearInterval(interval);
    }, [gameLoop]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;
            const key = e.key;
            let letterPopped = false;
            setLetters(l => {
                const newLetters = [...l];
                const index = newLetters.findIndex(letter => letter.char === key);
                if (index > -1) {
                    newLetters.splice(index, 1);
                    letterPopped = true;
                }
                return newLetters;
            });
            if (letterPopped) setScore(s => s + 1);
        };
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [gameState]);

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <div className="relative w-[600px] h-[400px] bg-sky-100 mx-auto border-2 border-gray-400 overflow-hidden">
                {letters.map(l => (
                    <div key={l.id} className="absolute text-2xl font-bold" style={{ top: l.y, left: l.x }}>{l.char}</div>
                ))}
                {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        {gameState === 'over' && <h2 className="text-4xl font-bold mb-4">انتهت اللعبة!</h2>}
                        <button onClick={startGame} className="bg-blue-500 font-bold py-3 px-6 rounded-full text-xl hover:bg-blue-600">
                            {gameState === 'idle' ? 'ابدأ' : 'العب مرة أخرى'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlyingLetters;
