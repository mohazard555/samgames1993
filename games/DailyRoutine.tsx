import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const ROUTINE_ITEMS = [
    { id: 1, name: 'الاستيقاظ', emoji: '🛌' },
    { id: 2, name: 'الإفطار', emoji: '🥞' },
    { id: 3, name: 'المدرسة', emoji: '🏫' },
    { id: 4, name: 'اللعب', emoji: '⚽' },
    { id: 5, name: 'النوم', emoji: '😴' },
];

const DailyRoutine: React.FC<GameProps> = ({ gameName }) => {
    const [placed, setPlaced] = useState<(typeof ROUTINE_ITEMS[0] | null)[]>([null, null, null, null, null]);
    const [feedback, setFeedback] = useState<string>('');
    const shuffledItems = React.useMemo(() => [...ROUTINE_ITEMS].sort(() => Math.random() - 0.5), []);

    const handleDragStart = (e: React.DragEvent, item: typeof ROUTINE_ITEMS[0]) => {
        e.dataTransfer.setData('application/json', JSON.stringify(item));
    };

    const handleDrop = (e: React.DragEvent, slotIndex: number) => {
        e.preventDefault();
        const item = JSON.parse(e.dataTransfer.getData('application/json'));
        if (!placed[slotIndex]) {
            setPlaced(p => {
                const newPlaced = [...p];
                newPlaced[slotIndex] = item;
                return newPlaced;
            });
        }
    };
    
    const checkOrder = () => {
        const isCorrect = placed.every((item, index) => item?.id === index + 1);
        if (isCorrect) {
            setFeedback('🎉 ترتيب رائع وصحيح! 🎉');
        } else {
            setFeedback('😞 حاول مرة أخرى، الترتيب غير صحيح. 😞');
        }
    }

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const reset = () => {
        setPlaced([null, null, null, null, null]);
        setFeedback('');
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-cyan-400">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-cyan-800">{gameName}</h1>
                <button onClick={reset} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p className="text-xl text-gray-700 mb-6">اسحب الأنشطة لترتيبها بشكل صحيح!</p>
            
            <div className="flex justify-center gap-4 mb-8">
                {shuffledItems.map(item => (
                     !placed.some(p => p?.id === item.id) &&
                     <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item)} className="p-2 bg-gray-200 rounded-lg flex flex-col items-center cursor-grab">
                        <span className="text-5xl">{item.emoji}</span>
                        <span className="font-bold">{item.name}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center gap-2 bg-cyan-100 p-4 rounded-lg">
                {placed.map((item, i) => (
                    <div key={i} onDrop={(e) => handleDrop(e, i)} onDragOver={handleDragOver} className="w-24 h-32 bg-white rounded-lg border-2 border-dashed flex flex-col items-center justify-center">
                       {item ? <>
                           <span className="text-5xl">{item.emoji}</span>
                           <span className="font-bold text-sm">{item.name}</span>
                       </> : <span className="text-3xl text-gray-400">{i + 1}</span>}
                    </div>
                ))}
            </div>
            
            <button onClick={checkOrder} className="mt-6 bg-green-500 text-white font-bold py-3 px-6 rounded-lg">تحقق من الترتيب</button>
            {feedback && <p className="mt-4 text-3xl font-bold">{feedback}</p>}
        </div>
    );
};

export default DailyRoutine;