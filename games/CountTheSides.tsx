import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const SHAPES = [
    { name: 'مثلث', sides: 3, element: <div className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-blue-500" /> },
    { name: 'مربع', sides: 4, element: <div className="w-24 h-24 bg-red-500" /> },
    { name: 'دائرة', sides: 0, element: <div className="w-24 h-24 bg-green-500 rounded-full" /> },
    { name: 'خماسي', sides: 5, element: <div className="w-28 h-28 bg-yellow-500" style={{clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}}/> },
];

const CountTheSides: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentShape, setCurrentShape] = useState(SHAPES[0]);
    const [options, setOptions] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        const correctShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        setCurrentShape(correctShape);

        const opts = new Set([correctShape.sides]);
        while(opts.size < 3) {
            const wrongOpt = SHAPES[Math.floor(Math.random() * SHAPES.length)].sides;
            opts.add(wrongOpt);
        }
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleOptionClick = (selectedSides: number) => {
        if (feedback) return;
        if (selectedSides === currentShape.sides) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-blue-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>

            <h2 className="text-3xl font-bold text-gray-700 mb-6">كم عدد أضلاع هذا الشكل؟</h2>
            <div className="h-40 flex justify-center items-center mb-8">{currentShape.element}</div>

            <div className="flex justify-center gap-4">
                {options.map(option => (
                    <button key={option} onClick={() => handleOptionClick(option)} className="bg-blue-500 text-white font-bold text-5xl w-32 h-32 rounded-full flex justify-center items-center hover:bg-blue-600">
                        {option}
                    </button>
                ))}
            </div>
            
            {feedback && (
                <div className="mt-6 text-4xl font-extrabold">
                    {feedback === 'correct' && <p className="text-green-500">🎉 صحيح! 🎉</p>}
                    {feedback === 'incorrect' && <p className="text-red-500">😞 خطأ! 😞</p>}
                </div>
            )}
        </div>
    );
};

export default CountTheSides;