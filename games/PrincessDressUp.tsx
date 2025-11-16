import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameProps {
  gameName: string;
}

const WARDROBE = {
    dresses: [
        { id: 'dress1', name: 'فستان وردي', color: '#FBCFE8' },
        { id: 'dress2', name: 'فستان أزرق', color: '#BFDBFE' },
        { id: 'dress3', name: 'فستان أصفر', color: '#FEF08A' },
    ],
    shoes: [
        { id: 'shoes1', name: 'حذاء وردي', color: '#F9A8D4' },
        { id: 'shoes2', name: 'حذاء أزرق', color: '#93C5FD' },
        { id: 'shoes3', name: 'حذاء أصفر', color: '#FDE047' },
    ],
    accessories: [
        { id: 'acc1', name: 'تاج', emoji: '👑' },
        { id: 'acc2', name: 'عقد', emoji: '💎' },
        { id: 'acc3', name: 'قبعة', emoji: '👒' },
    ]
};

type Outfit = {
    dress: string | null;
    shoes: string | null;
    accessory: string | null;
};

const PrincessDressUp: React.FC<GameProps> = ({ gameName }) => {
    const [outfit, setOutfit] = useState<Outfit>({ dress: null, shoes: null, accessory: null });

    const handleItemSelect = (category: keyof Outfit, value: string | null) => {
        setOutfit(prev => ({ ...prev, [category]: prev[category] === value ? null : value }));
    };

    const resetOutfit = () => {
        setOutfit({ dress: null, shoes: null, accessory: null });
    };

    const getDressColor = () => WARDROBE.dresses.find(d => d.id === outfit.dress)?.color || 'transparent';
    const getShoeColor = () => WARDROBE.shoes.find(s => s.id === outfit.shoes)?.color || 'transparent';
    const getAccessoryEmoji = () => WARDROBE.accessories.find(a => a.id === outfit.accessory)?.emoji || '';

    return (
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-2xl border-4 border-pink-200">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">→ العودة</Link>
                <h1 className="text-2xl md:text-3xl font-bold text-pink-800">{gameName}</h1>
                <button onClick={resetOutfit} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                    إعادة اللبس
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Wardrobe */}
                <div className="w-full md:w-1/3 bg-pink-50 p-4 rounded-xl space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-pink-700 mb-3">فساتين</h3>
                        <div className="flex gap-3">
                            {WARDROBE.dresses.map(item => (
                                <button key={item.id} onClick={() => handleItemSelect('dress', item.id)} className={`w-16 h-20 rounded-lg border-4 ${outfit.dress === item.id ? 'border-pink-500' : 'border-transparent'}`} style={{ backgroundColor: item.color }}></button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold text-pink-700 mb-3">أحذية</h3>
                        <div className="flex gap-3">
                            {WARDROBE.shoes.map(item => (
                                <button key={item.id} onClick={() => handleItemSelect('shoes', item.id)} className={`w-16 h-10 rounded-lg border-4 ${outfit.shoes === item.id ? 'border-pink-500' : 'border-transparent'}`} style={{ backgroundColor: item.color }}></button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold text-pink-700 mb-3">إكسسوارات</h3>
                        <div className="flex gap-3">
                            {WARDROBE.accessories.map(item => (
                                <button key={item.id} onClick={() => handleItemSelect('accessory', item.id)} className={`w-16 h-16 rounded-lg border-4 text-4xl flex items-center justify-center bg-gray-200 ${outfit.accessory === item.id ? 'border-pink-500' : 'border-transparent'}`}>{item.emoji}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Princess */}
                <div className="w-full md:w-2/3 flex items-center justify-center bg-pink-100 rounded-2xl p-4 min-h-[400px]">
                    <div className="relative w-48 h-96">
                        {/* Head */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-rose-200 rounded-full">
                           <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-black rounded-full"></div>
                           <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-black rounded-full"></div>
                           <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-8 h-4 border-b-2 border-black rounded-b-full"></div>
                           {outfit.accessory && <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl">{getAccessoryEmoji()}</div>}
                        </div>
                        {/* Body */}
                        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-28 h-48 bg-rose-200">
                             {/* Dress */}
                             {outfit.dress && <div className="absolute inset-0" style={{ backgroundColor: getDressColor() }}></div>}
                        </div>
                        {/* Legs */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24">
                            <div className="absolute left-0 w-8 h-full bg-rose-200"></div>
                            <div className="absolute right-0 w-8 h-full bg-rose-200"></div>
                            {/* Shoes */}
                             {outfit.shoes && <>
                                <div className="absolute bottom-0 -left-1 w-10 h-6" style={{ backgroundColor: getShoeColor() }}></div>
                                <div className="absolute bottom-0 -right-1 w-10 h-6" style={{ backgroundColor: getShoeColor() }}></div>
                             </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrincessDressUp;
