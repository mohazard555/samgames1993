import React, { useState, useMemo } from 'react';
import { playSuccessSound, playErrorSound, playPopSound, playWinFanfare } from '../utils/soundEffects';

interface GameProps {
  gameName: string;
}

interface RoutineItem {
  id: number;
  name: string;
  emoji: string;
  desc: string;
}

const ROUTINE_ITEMS: RoutineItem[] = [
  { id: 1, name: 'الاستيقاظ', emoji: '🛌', desc: 'في الصباح الباكر' },
  { id: 2, name: 'الإفطار', emoji: '🥞', desc: 'وجبة صحية ولذيذة' },
  { id: 3, name: 'المدرسة', emoji: '🏫', desc: 'التعلم مع الأصدقاء' },
  { id: 4, name: 'اللعب', emoji: '⚽', desc: 'المرح والرياضة' },
  { id: 5, name: 'النوم', emoji: '😴', desc: 'راحة بعد يوم جميل' },
];

const DailyRoutine: React.FC<GameProps> = ({ gameName }) => {
  const [placed, setPlaced] = useState<(RoutineItem | null)[]>([null, null, null, null, null]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Shuffle the items for the pool
  const initialPool = useMemo(() => {
    return [...ROUTINE_ITEMS].sort(() => Math.random() - 0.5);
  }, []);

  // Items currently available in the selection pool
  const availableItems = initialPool.filter(
    (item) => !placed.some((p) => p !== null && p.id === item.id)
  );

  // Tap an item to place it in the first empty slot
  const handleItemClick = (item: RoutineItem) => {
    playPopSound();
    setFeedback(null);
    const emptyIndex = placed.findIndex((p) => p === null);
    if (emptyIndex !== -1) {
      setPlaced((prev) => {
        const next = [...prev];
        next[emptyIndex] = item;
        return next;
      });
    }
  };

  // Tap a filled slot to remove the item back to the pool
  const handleSlotClick = (index: number) => {
    if (placed[index]) {
      playPopSound();
      setFeedback(null);
      setPlaced((prev) => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
    }
  };

  // HTML5 Drag & Drop handlers for desktop
  const handleDragStart = (e: React.DragEvent, item: RoutineItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    try {
      const item: RoutineItem = JSON.parse(e.dataTransfer.getData('application/json'));
      if (item && item.id) {
        playPopSound();
        setFeedback(null);
        setPlaced((prev) => {
          const next = [...prev];
          // If this item was in another slot, clear it
          const oldIndex = next.findIndex((p) => p?.id === item.id);
          if (oldIndex !== -1) {
            next[oldIndex] = null;
          }
          next[slotIndex] = item;
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const checkOrder = () => {
    const isFull = placed.every((item) => item !== null);
    if (!isFull) {
      playErrorSound();
      setFeedback('incorrect');
      return;
    }

    const isCorrect = placed.every((item, index) => item?.id === index + 1);
    if (isCorrect) {
      setFeedback('correct');
      setIsCompleted(true);
      playSuccessSound();
      playWinFanfare();
    } else {
      setFeedback('incorrect');
      playErrorSound();
    }
  };

  const reset = () => {
    playPopSound();
    setPlaced([null, null, null, null, null]);
    setFeedback(null);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl border-4 border-cyan-400">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-cyan-100">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-cyan-900 flex items-center gap-2">
          <span>⏰</span>
          <span>{gameName}</span>
        </h1>
        <button
          onClick={reset}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-xl shadow transition-transform active:scale-95 text-sm sm:text-base cursor-pointer"
        >
          🔄 إعادة
        </button>
      </div>

      <p className="text-sm sm:text-base md:text-lg text-gray-700 font-bold text-center mb-6">
        اضغط أو اسحب الأنشطة لترتيب أحداث اليوم من الصباح حتى المساء ☀️🌙
      </p>

      {/* Available items pool (Tap to place) */}
      <div className="mb-6 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200">
        <div className="text-xs sm:text-sm font-bold text-slate-500 mb-2 text-center">
          {availableItems.length > 0 ? 'اضغط على النشاط لوضعه في الترتيب:' : 'تم وضع جميع الأنشطة!'}
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 min-h-[90px] items-center">
          {availableItems.map((item) => (
            <button
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onClick={() => handleItemClick(item)}
              className="p-2 sm:p-3 bg-white hover:bg-cyan-50 active:scale-95 rounded-2xl shadow border-2 border-cyan-200 hover:border-cyan-400 flex flex-col items-center justify-center cursor-pointer transition-all w-20 sm:w-24 md:w-28 touch-manipulation"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl mb-1">{item.emoji}</span>
              <span className="font-bold text-xs sm:text-sm text-gray-800 line-clamp-1">{item.name}</span>
            </button>
          ))}
          {availableItems.length === 0 && (
            <p className="text-sm font-bold text-emerald-600 animate-pulse">
              جاهز للتحقق! اضغط على زر "تحقق من الترتيب" أدناه 👇
            </p>
          )}
        </div>
      </div>

      {/* Ordered Slots (1 to 5) - fully responsive grid for Android & mobile */}
      <div className="bg-gradient-to-r from-cyan-100 to-sky-100 p-3 sm:p-5 rounded-2xl border-2 border-cyan-300 mb-6">
        <div className="text-xs sm:text-sm font-bold text-cyan-900 mb-3 text-center">
          خط سير اليوم (1: أول نشاط ⬅️ 5: آخر نشاط)
        </div>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
          {placed.map((item, i) => (
            <div
              key={i}
              onDrop={(e) => handleDrop(e, i)}
              onDragOver={handleDragOver}
              onClick={() => handleSlotClick(i)}
              className={`min-h-[85px] sm:min-h-[110px] md:min-h-[130px] rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-1 sm:p-2 select-none relative ${
                item
                  ? 'bg-white border-cyan-400 shadow-md cursor-pointer hover:bg-red-50 hover:border-red-300'
                  : 'bg-white/70 border-dashed border-cyan-300 text-cyan-400'
              }`}
            >
              {/* Step number badge */}
              <span className="absolute top-1 right-1 text-[10px] sm:text-xs font-black bg-cyan-200 text-cyan-800 px-1.5 py-0.5 rounded-full">
                {i + 1}
              </span>

              {item ? (
                <>
                  <span className="text-2xl sm:text-4xl md:text-5xl mb-0.5 sm:mb-1">{item.emoji}</span>
                  <span className="font-black text-[11px] sm:text-xs md:text-sm text-gray-800 text-center leading-tight">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-gray-400 hidden sm:block">اضغط للإلغاء</span>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-3xl font-black text-cyan-300">{i + 1}</span>
                  <span className="text-[10px] sm:text-xs text-cyan-500 font-bold hidden xs:block">فارغ</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons & Feedback */}
      <div className="text-center space-y-4">
        {!isCompleted ? (
          <button
            onClick={checkOrder}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base sm:text-xl py-3 px-8 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            ✅ تحقق من الترتيب
          </button>
        ) : (
          <button
            onClick={reset}
            className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-base sm:text-xl py-3 px-8 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            🎉 ممتاز يا بطل! العب مرة أخرى 🔄
          </button>
        )}

        {feedback === 'correct' && (
          <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl text-emerald-800 font-black text-lg sm:text-2xl animate-bounce">
            🎉 رائع جداً! الترتيب صحيح ومثالي! أبدعت يا بطل! 🎉
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="p-3 sm:p-4 bg-rose-100 border-2 border-rose-300 rounded-2xl text-rose-800 font-bold text-sm sm:text-base animate-fade-in">
            {placed.some((p) => p === null)
              ? '⚠️ يرجى وضع جميع الأنشطة الـ 5 أولاً قبل التحقق!'
              : '💡 الترتيب غير صحيح بعد! فكر في تسلسل يومك: نستيقظ أولاً ثم نفطر ثم نذهب للمدرسة...'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyRoutine;
