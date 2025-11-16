import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const OPTIONS = {
    capes: ['#DC2626', '#2563EB', '#FBBF24', '#16A34A'],
    masks: ['#1F2937', '#7C3AED', '#DB2777', '#F59E0B'],
    suits: ['#6B7280', '#D946EF', '#22D3EE', '#84CC16'],
};

const SuperheroMaker: React.FC<GameProps> = ({ gameName }) => {
    const [hero, setHero] = useState({ cape: OPTIONS.capes[0], mask: OPTIONS.masks[0], suit: OPTIONS.suits[0] });

    const randomizeHero = () => {
        setHero({
            cape: OPTIONS.capes[Math.floor(Math.random() * OPTIONS.capes.length)],
            mask: OPTIONS.masks[Math.floor(Math.random() * OPTIONS.masks.length)],
            suit: OPTIONS.suits[Math.floor(Math.random() * OPTIONS.suits.length)],
        });
    };

    return (
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-2xl border-4 border-red-500">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">→ العودة</Link>
                <h1 className="text-2xl font-bold text-red-800">{gameName}</h1>
                <button onClick={randomizeHero} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">بطل عشوائي</button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Options Panel */}
                <div className="w-full md:w-1/3 bg-gray-100 p-4 rounded-xl space-y-4">
                    <h3 className="font-bold text-lg">لون البدلة</h3>
                    <div className="flex gap-2 flex-wrap">{OPTIONS.suits.map(c => <button key={c} onClick={() => setHero(h => ({...h, suit: c}))} style={{backgroundColor: c}} className="w-12 h-12 rounded-full border-2 border-gray-300"></button>)}</div>
                    <h3 className="font-bold text-lg">لون القناع</h3>
                    <div className="flex gap-2 flex-wrap">{OPTIONS.masks.map(c => <button key={c} onClick={() => setHero(h => ({...h, mask: c}))} style={{backgroundColor: c}} className="w-12 h-12 rounded-full border-2 border-gray-300"></button>)}</div>
                    <h3 className="font-bold text-lg">لون الرداء</h3>
                    <div className="flex gap-2 flex-wrap">{OPTIONS.capes.map(c => <button key={c} onClick={() => setHero(h => ({...h, cape: c}))} style={{backgroundColor: c}} className="w-12 h-12 rounded-full border-2 border-gray-300"></button>)}</div>
                </div>

                {/* Hero Display */}
                <div className="w-full md:w-2/3 flex items-center justify-center bg-blue-100 rounded-2xl p-4 min-h-[400px]">
                    <div className="relative w-40 h-80">
                        {/* Cape */}
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-80 rounded-t-full" style={{backgroundColor: hero.cape, zIndex: 0}}></div>
                        {/* Head */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-200 rounded-full" style={{zIndex: 2}}>
                            {/* Mask */}
                            <div className="absolute top-1/4 left-0 w-full h-1/2" style={{backgroundColor: hero.mask}}></div>
                        </div>
                        {/* Body */}
                        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-28 h-40" style={{backgroundColor: hero.suit, zIndex: 1}}></div>
                         {/* Legs */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-20" style={{zIndex: 1}}>
                            <div className="absolute left-0 w-10 h-full" style={{backgroundColor: hero.suit}}></div>
                            <div className="absolute right-0 w-10 h-full" style={{backgroundColor: hero.suit}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperheroMaker;
