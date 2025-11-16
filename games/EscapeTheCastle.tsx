import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const EscapeTheCastle: React.FC<GameProps> = ({ gameName }) => {
    const [hasKey, setHasKey] = useState(false);
    const [isDoorOpen, setIsDoorOpen] = useState(false);

    const findKey = () => {
        alert("لقد وجدت مفتاحاً مخفياً تحت السجادة!");
        setHasKey(true);
    };

    const openDoor = () => {
        if (hasKey) {
            setIsDoorOpen(true);
            alert("لقد هربت بنجاح!");
        } else {
            alert("الباب مغلق. أنت بحاجة إلى مفتاح!");
        }
    };
    
    const resetGame = () => {
        setHasKey(false);
        setIsDoorOpen(false);
    }

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold">{gameName}</h1>
                 <button onClick={resetGame} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p className="mb-4">ابحث عن طريقة للهروب من القلعة!</p>
            <div className="relative w-full max-w-lg h-96 bg-gray-300 mx-auto border-4 border-gray-600 p-4">
                <div className="absolute text-5xl top-1/2 left-10 cursor-pointer" onClick={openDoor} title="افتح الباب">🚪</div>
                <div className="absolute text-3xl bottom-10 right-10 cursor-pointer" onClick={findKey} title="ابحث هنا">🔑</div>
                <div className="absolute text-6xl bottom-8 right-8"> rugs </div>
                {isDoorOpen && <div className="absolute text-6xl top-1/2 left-10 animate-ping">🎉</div>}
            </div>
        </div>
    );
};

export default EscapeTheCastle;
