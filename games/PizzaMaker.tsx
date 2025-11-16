import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

interface Topping {
    id: number;
    src: string;
    name: string;
    x: number;
    y: number;
}

const INGREDIENTS = [
  { name: 'صلصة', src: 'https://img.icons8.com/color/96/tomato.png' },
  { name: 'جبن', src: 'https://img.icons8.com/color/96/cheese.png' },
  { name: 'فطر', src: 'https://img.icons8.com/color/96/mushroom.png' },
  { name: 'زيتون', src: 'https://img.icons8.com/color/96/olive.png' },
  { name: 'فلفل', src: 'https://img.icons8.com/color/96/paprika.png' },
  { name: 'سلامي', src: 'https://img.icons8.com/color/96/salami.png' },
];

const PizzaMaker: React.FC<GameProps> = ({ gameName }) => {
    const [toppings, setToppings] = useState<Topping[]>([]);
    const [finished, setFinished] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLImageElement>, src: string, name: string) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ src, name }));
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const dropZone = e.currentTarget.getBoundingClientRect();
        
        // Calculate position relative to the drop zone, centered on cursor
        const x = e.clientX - dropZone.left - 32; // half of icon width
        const y = e.clientY - dropZone.top - 32; // half of icon height

        setToppings([...toppings, { id: Date.now(), ...data, x, y }]);
    }
    
    const resetPizza = () => {
        setToppings([]);
        setFinished(false);
    }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300">
        <div className="flex justify-between items-center mb-6">
            <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">→ العودة</Link>
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-800">{gameName}</h1>
            <button onClick={resetPizza} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                البدء من جديد
            </button>
        </div>
      
        <div className="flex flex-col md:flex-row gap-8">
            {/* Ingredients Panel */}
            <div className="w-full md:w-1/4 bg-amber-100 p-4 rounded-xl">
                <h3 className="text-xl font-bold text-center text-amber-900 mb-4">المكونات</h3>
                <div className="grid grid-cols-2 gap-4">
                    {INGREDIENTS.map(ing => (
                        <div key={ing.name} className="flex flex-col items-center p-2 rounded-lg bg-white cursor-grab active:cursor-grabbing">
                           <img 
                                src={ing.src}
                                alt={ing.name}
                                draggable
                                onDragStart={(e) => handleDragStart(e, ing.src, ing.name)}
                                className="w-16 h-16"
                            />
                            <p className="text-sm font-semibold">{ing.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pizza Area */}
            <div className="w-full md:w-3/4 flex-1 flex flex-col items-center justify-center">
                {finished ? (
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-green-600 mb-4">🍕 بيتزا رائعة! 🍕</h2>
                        <p className="text-2xl animate-bounce">😋</p>
                    </div>
                ) : (
                    <>
                        <div 
                            onDragOver={handleDragOver} 
                            onDrop={handleDrop} 
                            className="relative w-[350px] h-[350px] md:w-[400px] md:h-[400px] bg-yellow-200 rounded-full flex items-center justify-center border-8 border-yellow-600"
                        >
                            <span className="text-gray-400 text-2xl hidden md:block">اسحب المكونات إلى هنا</span>
                             {toppings.map(topping => (
                                <img
                                    key={topping.id}
                                    src={topping.src}
                                    alt={topping.name}
                                    className="absolute w-16 h-16 pointer-events-none"
                                    style={{ left: `${topping.x}px`, top: `${topping.y}px` }}
                                />
                            ))}
                        </div>
                         <button onClick={() => setFinished(true)} className="mt-6 bg-green-500 text-white font-bold py-3 px-8 rounded-full text-xl hover:bg-green-600 transition-colors disabled:bg-gray-400" disabled={toppings.length === 0}>
                            انتهيت!
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
  );
};

export default PizzaMaker;
