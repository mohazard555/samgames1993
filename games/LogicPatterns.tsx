import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

interface PatternItem {
    shape: 'circle' | 'square';
    color: 'red' | 'blue';
    size: 'small' | 'big';
}

// Fix: Explicitly type the PUZZLES array to prevent TypeScript from widening the
// string literal types to `string`, which causes assignment errors.
const PUZZLES: {
    pattern: PatternItem[];
    answer: PatternItem;
    options: PatternItem[];
}[] = [
    {
        pattern: [ {shape: 'square', color: 'red', size: 'small'}, {shape: 'square', color: 'red', size: 'big'}, {shape: 'square', color: 'blue', size: 'small'} ],
        answer: {shape: 'square', color: 'blue', size: 'big'},
        options: [ {shape: 'square', color: 'blue', size: 'big'}, {shape: 'circle', color: 'red', size: 'small'}, {shape: 'square', color: 'red', size: 'small'} ]
    },
    // Add more complex puzzles here
];

const ItemDisplay: React.FC<{ item: PatternItem }> = ({ item }) => {
    const style = {
        width: item.size === 'small' ? 40 : 60,
        height: item.size === 'small' ? 40 : 60,
        backgroundColor: item.color,
        borderRadius: item.shape === 'circle' ? '50%' : 0,
    };
    return <div style={style}></div>;
};


const LogicPatterns: React.FC<GameProps> = ({ gameName }) => {
    const [score, setScore] = useState(0);
    const [currentPuzzle, setCurrentPuzzle] = useState(PUZZLES[0]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const generateRound = useCallback(() => {
        setFeedback(null);
        // For simplicity, we'll just use the one puzzle, but this could be expanded
        const puzzle = PUZZLES[0];
        // Fix: Avoid mutating state and constants by creating a new shuffled array
        // and a new puzzle object for the state update.
        const shuffledOptions = [...puzzle.options].sort(() => Math.random() - 0.5);
        setCurrentPuzzle({ ...puzzle, options: shuffledOptions });
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleOptionClick = (option: PatternItem) => {
        if (feedback) return;
        if (JSON.stringify(option) === JSON.stringify(currentPuzzle.answer)) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(generateRound, 1200);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-purple-800">{gameName}</h1>
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg">النقاط: {score}</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-700 mb-8">أكمل النمط المنطقي:</h2>

            <div className="bg-purple-50 p-6 rounded-2xl flex justify-center items-center gap-6 mb-8">
                {currentPuzzle.pattern.map((item, index) => (
                    <ItemDisplay key={index} item={item} />
                ))}
                <div className="text-6xl font-bold text-purple-700">?</div>
            </div>

            <div className="flex justify-center items-center gap-6">
                {currentPuzzle.options.map((option, index) => (
                    <button key={index} onClick={() => handleOptionClick(option)} className="bg-purple-200 p-4 rounded-2xl hover:bg-purple-300">
                        <ItemDisplay item={option} />
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

export default LogicPatterns;