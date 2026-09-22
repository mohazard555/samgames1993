import React from 'react';
import { SmartChallengeQuestion } from '../../types/smartChallengesTypes';

interface SmartChallengeVisualProps {
  question: SmartChallengeQuestion;
  interactiveHour?: number;
  interactiveMinute?: number;
}

export const SmartChallengeVisual: React.FC<SmartChallengeVisualProps> = ({
  question,
  interactiveHour,
  interactiveMinute,
}) => {
  // 1. Analog Clock Rendering
  if (question.visualType === 'clock' || question.visualType === 'interactive_clock') {
    const rawHours = interactiveHour !== undefined ? interactiveHour : (question.visualData?.hours ?? 3);
    const rawMinutes = interactiveMinute !== undefined ? interactiveMinute : (question.visualData?.minutes ?? 0);

    const hourAngle = ((rawHours % 12) + rawMinutes / 60) * 30; // 360 / 12 = 30 deg
    const minuteAngle = rawMinutes * 6; // 360 / 60 = 6 deg

    // Generate 12 numbers around clock
    const clockNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-sky-50 to-indigo-50/50 rounded-3xl border-2 border-indigo-100 shadow-inner max-w-sm mx-auto">
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-white border-8 border-indigo-500 shadow-xl flex items-center justify-center">
          {/* Clock numbers */}
          {clockNumbers.map((num) => {
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const radius = 88; // radius in px
            const x = Math.round(radius * Math.cos(angle));
            const y = Math.round(radius * Math.sin(angle));

            return (
              <div
                key={num}
                className="absolute font-black text-slate-800 text-base sm:text-lg select-none"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                {num}
              </div>
            );
          })}

          {/* Clock Center Pin */}
          <div className="absolute w-5 h-5 rounded-full bg-amber-500 border-3 border-white shadow-md z-30" />

          {/* Hour Hand (short & thick) */}
          <div
            className="absolute origin-bottom rounded-full bg-indigo-900 z-10 transition-transform duration-300 shadow-sm"
            style={{
              width: '7px',
              height: '52px',
              top: 'calc(50% - 52px)',
              left: 'calc(50% - 3.5px)',
              transform: `rotate(${hourAngle}deg)`,
            }}
          />

          {/* Minute Hand (long & sleek) */}
          <div
            className="absolute origin-bottom rounded-full bg-rose-500 z-20 transition-transform duration-300 shadow-sm"
            style={{
              width: '4px',
              height: '75px',
              top: 'calc(50% - 75px)',
              left: 'calc(50% - 2px)',
              transform: `rotate(${minuteAngle}deg)`,
            }}
          />
        </div>

        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/90 rounded-full border border-indigo-200 text-xs font-black text-indigo-900 shadow-xs">
          <span>العقرب البنفسجي = الساعات</span>
          <span>•</span>
          <span className="text-rose-600">العقرب الوردي = الدقائق</span>
        </div>
      </div>
    );
  }

  // 2. Time Match Digital Display Card
  if (question.visualType === 'time_match_cards') {
    const digital = question.visualData?.targetDigital || '12:00';
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl border-3 border-cyan-400 shadow-lg max-w-sm mx-auto">
        <div className="text-xs text-cyan-300 font-bold mb-2 tracking-wider">الساعة الرقمية 📟</div>
        <div className="px-8 py-3 bg-black/80 rounded-2xl border border-cyan-500/50 shadow-inner font-mono text-4xl sm:text-5xl font-black text-cyan-400 tracking-widest animate-pulse">
          {digital}
        </div>
        <div className="mt-3 text-xs text-slate-300 font-bold">ابحث عن الساعة ذات العقارب المطابقة لهذا الوقت</div>
      </div>
    );
  }

  // 3. Day or Night Scene Card
  if (question.visualType === 'day_night') {
    const isMorning = question.visualData?.isMorning;
    const icon = question.visualData?.icon || '☀️';
    return (
      <div
        className={`p-6 rounded-3xl border-3 max-w-md mx-auto text-center shadow-md transition-all ${
          isMorning
            ? 'bg-gradient-to-b from-amber-100 via-sky-100 to-sky-50 border-amber-300'
            : 'bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 border-purple-500 text-white'
        }`}
      >
        <div className="text-6xl sm:text-7xl mb-3 drop-shadow-md animate-bounce">{icon}</div>
        <div className="text-lg sm:text-xl font-black mb-1">
          {question.visualData?.text}
        </div>
        <div
          className={`inline-block text-xs font-black px-3 py-1 rounded-full ${
            isMorning ? 'bg-amber-200 text-amber-900' : 'bg-purple-900/80 text-purple-200'
          }`}
        >
          {isMorning ? '🌅 نشاط يبدأ مع نور اليوم' : '🌙 نشاط هادئ مع سكون الليل'}
        </div>
      </div>
    );
  }

  // 4. Before / After Timeline
  if (question.visualType === 'before_after') {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-5 bg-gradient-to-r from-amber-50 to-rose-50 rounded-3xl border-2 border-amber-200 max-w-md mx-auto shadow-sm">
        <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-xs flex-1 text-center">
          <div className="text-xs font-bold text-amber-700 mb-1">الحدث الأول (1)</div>
          <div className="text-sm font-black text-gray-900">{question.visualData?.first}</div>
        </div>
        <span className="text-2xl text-amber-500 font-black">➔</span>
        <div className="p-3 bg-white rounded-2xl border border-rose-200 shadow-xs flex-1 text-center">
          <div className="text-xs font-bold text-rose-700 mb-1">الحدث الثاني (2)</div>
          <div className="text-sm font-black text-gray-900">{question.visualData?.second}</div>
        </div>
      </div>
    );
  }

  // 5. Tower Blocks Builder
  if (question.visualType === 'tower') {
    return (
      <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200 max-w-sm mx-auto">
        <div className="flex flex-col items-center gap-1.5 w-40">
          <div className="w-16 h-8 bg-pink-400 rounded-md shadow-xs border border-pink-500 flex items-center justify-center text-xs font-black text-white">
            قمة 🔹
          </div>
          <div className="w-24 h-10 bg-amber-400 rounded-md shadow-xs border border-amber-500 flex items-center justify-center text-xs font-black text-amber-950">
            وسط 🔸
          </div>
          <div className="w-36 h-12 bg-indigo-600 rounded-lg shadow-md border-2 border-indigo-700 flex items-center justify-center text-xs font-black text-white">
            قاعدة متينة 🧱
          </div>
        </div>
        <div className="w-48 h-3 bg-stone-300 rounded-full mt-2 shadow-inner" />
      </div>
    );
  }

  // 6. Ladder Steps
  if (question.visualType === 'ladder') {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-yellow-50 to-amber-100 rounded-3xl border-2 border-amber-200 max-w-sm mx-auto">
        <div className="flex flex-col gap-2 w-32 border-x-4 border-amber-700 px-2 py-1">
          <div className="h-7 bg-amber-300 rounded border border-amber-500 flex items-center justify-center font-black text-xs text-amber-950">
            ؟ الدرجة القادمة
          </div>
          <div className="h-7 bg-amber-400 rounded border border-amber-600 flex items-center justify-center font-black text-xs text-amber-950">
            {question.visualData?.num2}
          </div>
          <div className="h-7 bg-amber-500 rounded border border-amber-700 flex items-center justify-center font-black text-xs text-white">
            {question.visualData?.num1}
          </div>
        </div>
      </div>
    );
  }

  // 7. General Themed Card Display
  return (
    <div className="p-6 bg-gradient-to-br from-white via-sky-50/50 to-purple-50/50 rounded-3xl border-2 border-sky-100 shadow-sm text-center max-w-sm mx-auto">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-4xl shadow-md text-white mb-3">
        ⭐
      </div>
      <div className="text-xs font-black text-sky-800 bg-sky-100/80 px-3 py-1 rounded-full inline-block">
        تحدي الذكاء والملاحظة
      </div>
    </div>
  );
};
