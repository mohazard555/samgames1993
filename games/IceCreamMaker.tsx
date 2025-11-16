import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps { gameName: string; }

const SCOOPS = ['🍦', '🍧', '🍨']; // Representing different flavors
const TOPPINGS = ['🍓', '🍒', '✨'];

const IceCreamMaker: React.FC<GameProps> = ({ gameName }) => {
    const [scoops, setScoops] = useState<string[]>([]);
    const [toppings, setToppings] = useState<string[]>([]);

    const addScoop = (scoop: string) => {
        if (scoops.length < 3) {
            setScoops(s => [...s, scoop]);
        }
    };
    const addTopping = (topping: string) => {
        if (toppings.length < 2) {
            setToppings(t => [...t, topping]);
        }
    }
    
    const reset = () => {
        setScoops([]);
        setToppings([]);
    };

    return (
        <div className="max-w-4xl mx-auto text-center bg-white p-6 rounded-2xl shadow-2xl border-4 border-pink-300">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">→ العودة</Link>
                <h1 className="text-2xl font-bold text-pink-800">{gameName}</h1>
                <button onClick={reset} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">إعادة</button>
            </div>
            <p className="text-xl text-gray-700 mb-6">اصنع الآيس كريم اللذيذ الخاص بك!</p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                {/* Controls */}
                <div className="flex flex-col gap-4">
                    <div>
                        <h3 className="font-bold text-lg">النكهات</h3>
                        <div className="flex gap-2">
                            {SCOOPS.map((s, i) => <button key={i} onClick={() => addScoop(s)} className="text-6xl p-2 bg-gray-100 rounded-lg">{s}</button>)}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-bold text-lg">الزينة</h3>
                         <div className="flex gap-2">
                            {TOPPINGS.map((t, i) => <button key={i} onClick={() => addTopping(t)} className="text-4xl p-2 bg-gray-100 rounded-lg">{t}</button>)}
                        </div>
                    </div>
                </div>

                {/* Ice Cream Display */}
                <div className="w-40 h-80 flex flex-col-reverse items-center pt-4">
                    <div className="text-8xl"> V </div> {/* Cone */}
                    {scoops.map((scoop, i) => (
                        <div key={i} className="text-8xl -mb-12">{scoop}</div>
                    ))}
                     <div className="flex self-start justify-center w-full">
                        {toppings.map((topping, i) => (
                             <div key={i} className="text-4xl">{topping}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IceCreamMaker;