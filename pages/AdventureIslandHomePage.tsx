import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ADVENTURE_ISLAND_ZONES,
  loadIslandProgress,
  isZoneUnlocked,
} from '../data/adventureIslandData';
import { IslandZoneMeta, IslandCategory, IslandPlayerProgress } from '../types/adventureIslandTypes';

const CATEGORY_TABS: { key: IslandCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'كل الجزيرة (24)', icon: '🏝️' },
  { key: 'logic_puzzles', label: 'ألغاز ومنطق', icon: '🧩' },
  { key: 'memory_observation', label: 'ذاكرة وملاحظة', icon: '👀' },
  { key: 'money_math', label: 'مال وأرقام', icon: '🪙' },
  { key: 'world_culture', label: 'عالم ومعالم', icon: '🌎' },
  { key: 'social_emotions', label: 'مشاعر وأصدقاء', icon: '💖' },
  { key: 'creativity_builder', label: 'إبداع وبناء', icon: '🎨' },
  { key: 'star_adventure', label: 'مغامرة ونجوم', icon: '🌟' },
];

export const AdventureIslandHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<IslandPlayerProgress>(loadIslandProgress());
  const [selectedCategory, setSelectedCategory] = useState<IslandCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'cards'>('map');
  const [activeZone, setActiveZone] = useState<IslandZoneMeta | null>(null);
  const [freePlayMode, setFreePlayMode] = useState(false);

  useEffect(() => {
    setProgress(loadIslandProgress());
  }, []);

  const totalPossibleStars = ADVENTURE_ISLAND_ZONES.length * 50; // 1200 stars
  const unlockedCount = ADVENTURE_ISLAND_ZONES.filter((z) =>
    freePlayMode || isZoneUnlocked(z, progress.totalStars)
  ).length;

  const filteredZones = ADVENTURE_ISLAND_ZONES.filter((zone) => {
    const matchesCategory = selectedCategory === 'all' || zone.category === selectedCategory;
    const matchesSearch =
      zone.name.includes(searchQuery) ||
      zone.gameTitle.includes(searchQuery) ||
      zone.skill.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleZoneClick = (zone: IslandZoneMeta) => {
    setActiveZone(zone);
  };

  const handleStartGame = (zoneId: number) => {
    navigate(`/adventure-island/${zoneId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-teal-100 to-amber-50 text-gray-800 pb-16">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-700 text-white shadow-xl">
        {/* Decorative cartoon elements */}
        <div className="absolute top-2 left-6 text-6xl opacity-25 select-none animate-bounce">
          ☁️
        </div>
        <div className="absolute top-8 right-10 text-5xl opacity-30 select-none animate-pulse">
          🌈
        </div>
        <div className="absolute -bottom-6 left-1/3 text-7xl opacity-20 select-none">
          🏝️
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-amber-200 font-bold text-sm border border-white/30">
                <span>🌴 مرحبًا بك في الجزيرة السحرية!</span>
                <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full text-xs font-black">
                  24 منطقة تفاعلية
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md flex items-center justify-center md:justify-start gap-3">
                <span>🏝️ جزيرة المغامرات</span>
              </h1>
              <p className="text-sky-100 max-w-xl text-base sm:text-lg font-medium leading-relaxed">
                استكشف خريطة الجزيرة التفاعلية الرائعة! كل منطقة تمثل لعبة ذكاء ومغامرة مستقلة
                تحتوي على 50 تحدياً شيقاً (1200 تحدٍ تفاعلي بالكامل).
              </p>
            </div>

            {/* Island Player Stats Card */}
            <div className="bg-white/95 text-slate-800 rounded-3xl p-5 shadow-2xl border-4 border-amber-300 w-full md:w-auto min-w-[280px]">
              <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">⭐</span>
                  <div>
                    <div className="text-xs text-gray-500 font-bold">نجوم الجزيرة</div>
                    <div className="text-xl font-black text-amber-600">
                      {progress.totalStars} / {totalPossibleStars}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-3xl">🔓</span>
                  <div>
                    <div className="text-xs text-gray-500 font-bold">المناطق المفتوحة</div>
                    <div className="text-xl font-black text-teal-600">
                      {unlockedCount} / 24
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>إنجاز الجزيرة الإجمالي</span>
                  <span>{Math.round((progress.totalStars / totalPossibleStars) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(5, (progress.totalStars / totalPossibleStars) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <button
                  onClick={() => setFreePlayMode(!freePlayMode)}
                  className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                  title="يتيح للطفل استكشاف جميع المناطق بدون قيود"
                >
                  {freePlayMode ? '🔒 تفعيل نظام قفل النجوم' : '✨ فتح كل المناطق للعب الحر'}
                </button>
              </div>
            </div>
          </div>

          {/* View Toggle and Category Filters */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* View Mode Buttons */}
            <div className="inline-flex bg-black/20 p-1.5 rounded-2xl backdrop-blur-md border border-white/20">
              <button
                onClick={() => setViewMode('map')}
                className={`px-5 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                  viewMode === 'map'
                    ? 'bg-amber-400 text-slate-900 shadow-lg scale-105'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span>🗺️ خريطة الجزيرة الكرتونية</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-5 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                  viewMode === 'cards'
                    ? 'bg-amber-400 text-slate-900 shadow-lg scale-105'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span>🧭 دليل المناطق (24 لعبة)</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="ابحث عن منطقة أو لعبة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/90 text-gray-800 px-4 py-2 pr-10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
              />
              <span className="absolute right-3 top-2.5 text-gray-400 text-sm">🔍</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm border ${
                selectedCategory === cat.key
                  ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-teal-50 border-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Island Display Section */}
      <div className="max-w-7xl mx-auto px-4 mt-2">
        {viewMode === 'map' ? (
          /* =========================================================================
             1. INTERACTIVE ILLUSTRATED CARTOON ISLAND MAP
             ========================================================================= */
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-gradient-to-b from-sky-300 via-sky-200 to-teal-200 p-2 sm:p-4 select-none">
            {/* Ambient Water & Waves Background */}
            <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
              <div className="absolute -top-10 left-10 text-8xl text-sky-400/30">🌊</div>
              <div className="absolute top-1/3 -left-10 text-9xl text-sky-400/30">🌊</div>
              <div className="absolute bottom-10 right-10 text-8xl text-sky-400/30">🌊</div>
              <div className="absolute top-10 right-1/4 text-6xl text-sky-400/30">⛵</div>
            </div>

            {/* Map Canvas Container */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] min-h-[560px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 via-emerald-100 to-green-100 border-2 border-emerald-400/40 shadow-inner">
              {/* Island Landmass SVG Decoration */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1000 700"
                preserveAspectRatio="none"
              >
                {/* Beach & Shoreline Contour */}
                <path
                  d="M 100,200 Q 250,50 500,100 T 900,180 Q 950,400 850,600 T 450,650 Q 150,650 80,450 Z"
                  fill="#fde68a"
                  opacity="0.85"
                />
                {/* Lush Green Tropical Interior */}
                <path
                  d="M 140,220 Q 270,90 500,130 T 850,210 Q 890,390 800,560 T 450,600 Q 190,600 120,430 Z"
                  fill="#86efac"
                  opacity="0.75"
                />
                {/* Mountain Ridge & Highlands */}
                <path
                  d="M 350,250 Q 500,180 650,230 Q 720,380 620,480 Q 420,500 320,400 Z"
                  fill="#bbf7d0"
                  opacity="0.9"
                />

                {/* Adventure Path Trails connecting regions */}
                <path
                  d="M 180,154 Q 380,126 580,105 T 800,140 Q 660,210 440,224 T 220,266 Q 150,385 340,350 T 520,336 Q 720,322 880,378 Q 780,448 580,455 T 180,504 Q 380,476 580,455 T 920,504 Q 840,602 680,574 T 120,616"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                  opacity="0.5"
                />
              </svg>

              {/* Graphical Landmarks on the Island */}
              <div className="absolute top-[8%] left-[25%] text-4xl select-none opacity-80 animate-pulse">
                🌴
              </div>
              <div className="absolute top-[12%] right-[15%] text-4xl select-none opacity-80">
                🌴
              </div>
              <div className="absolute bottom-[20%] left-[8%] text-5xl select-none opacity-70">
                🏖️
              </div>
              <div className="absolute bottom-[8%] right-[25%] text-5xl select-none opacity-70">
                ⛵
              </div>
              <div className="absolute top-[4%] left-[45%] text-4xl select-none opacity-80">
                🏔️
              </div>
              <div className="absolute bottom-[10%] left-[35%] text-4xl select-none opacity-70">
                ⛺
              </div>
              <div className="absolute top-[28%] left-[48%] text-4xl select-none opacity-80 animate-bounce">
                🌈
              </div>

              {/* Render the 24 Interactive Zone Stations */}
              {ADVENTURE_ISLAND_ZONES.map((zone) => {
                const unlocked = freePlayMode || isZoneUnlocked(zone, progress.totalStars);
                const stars = progress.starsByGame[zone.id] || 0;
                const isSelected = activeZone?.id === zone.id;

                return (
                  <div
                    key={zone.id}
                    style={{
                      left: `${zone.mapCoords.x}%`,
                      top: `${zone.mapCoords.y}%`,
                    }}
                    onClick={() => handleZoneClick(zone)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-all duration-300 hover:scale-125"
                  >
                    {/* Zone Pin Container */}
                    <div className="relative flex flex-col items-center">
                      {/* Pulse Glow for Selected / Unlocked */}
                      {unlocked && (
                        <div
                          className={`absolute -inset-2 rounded-full blur-md opacity-60 animate-pulse ${
                            zone.id === 24
                              ? 'bg-amber-400'
                              : 'bg-teal-400'
                          }`}
                        />
                      )}

                      {/* Main Big Icon Circle */}
                      <div
                        className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-xl border-2 sm:border-3 transition-transform ${
                          isSelected
                            ? 'scale-110 border-white ring-4 ring-amber-400'
                            : 'border-white/80 group-hover:scale-110'
                        } ${
                          unlocked
                            ? `bg-gradient-to-br ${zone.color} text-white`
                            : 'bg-gray-400 text-gray-200 filter grayscale'
                        }`}
                      >
                        <span>{zone.icon}</span>

                        {/* Lock Overlay if locked */}
                        {!unlocked && (
                          <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-amber-300 text-sm sm:text-base font-bold">
                            🔒
                          </div>
                        )}

                        {/* Star Badge on Corner */}
                        {unlocked && stars > 0 && (
                          <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5 border border-white">
                            <span>⭐</span>
                            <span>{stars}</span>
                          </div>
                        )}
                      </div>

                      {/* Floating Zone Name Tooltip / Pill */}
                      <div
                        className={`mt-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-md border whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-amber-400 text-slate-900 border-amber-500 scale-105'
                            : 'bg-white/90 text-gray-800 border-gray-200 group-hover:bg-amber-100'
                        }`}
                      >
                        {zone.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Guidance Footer */}
            <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-teal-900 font-bold px-2 gap-2">
              <div className="flex items-center gap-2">
                <span>💡 انقر على أي منطقة على الخريطة لعرض تفاصيل التحدي والانطلاق في المغامرة!</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> مفتوح
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gray-400 inline-block" /> مقفل بنجوم
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> بوابة النجوم
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             2. GRID CARDS VIEW (دليل المناطق)
             ========================================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredZones.map((zone) => {
              const unlocked = freePlayMode || isZoneUnlocked(zone, progress.totalStars);
              const stars = progress.starsByGame[zone.id] || 0;

              return (
                <div
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  className={`relative rounded-3xl p-5 border-2 shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 ${
                    unlocked
                      ? 'bg-white hover:border-teal-400 hover:shadow-xl border-gray-200'
                      : 'bg-gray-100/90 border-gray-300 opacity-80'
                  }`}
                >
                  {/* Top card header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      {/* Big Icon */}
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 border-white ${
                          unlocked
                            ? `bg-gradient-to-br ${zone.color} text-white`
                            : 'bg-gray-400 text-gray-200'
                        }`}
                      >
                        {zone.icon}
                      </div>

                      {/* Status / Stars Badge */}
                      <div className="text-right">
                        {unlocked ? (
                          <div className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                            <span>⭐</span>
                            <span>{stars} / 50</span>
                          </div>
                        ) : (
                          <div className="bg-gray-200 text-gray-600 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                            <span>🔒 يحتاج {zone.requiredStars} ⭐</span>
                          </div>
                        )}
                        <span className="text-[10px] text-gray-400 font-bold block mt-1">
                          منطقة #{zone.id}
                        </span>
                      </div>
                    </div>

                    {/* Titles */}
                    <h3 className="text-lg font-black text-gray-900 group-hover:text-teal-600 transition-colors">
                      {zone.name}
                    </h3>
                    <div className="text-xs font-bold text-teal-700 mb-2">
                      اللعبة: {zone.gameTitle}
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                      {zone.shortDesc}
                    </p>
                  </div>

                  {/* Footer info & action */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                      {zone.categoryLabel}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (unlocked) handleStartGame(zone.id);
                        else handleZoneClick(zone);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        unlocked
                          ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      {unlocked ? 'ابدأ اللعب 🚀' : 'تفاصيل القفل 🔒'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          ACTIVE ZONE MODAL / PREVIEW CARD
          ========================================================================= */}
      {activeZone && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-400 relative overflow-hidden text-right">
            {/* Background color glow */}
            <div
              className={`absolute -top-12 -left-12 w-36 h-36 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${activeZone.color}`}
            />

            {/* Close Button */}
            <button
              onClick={() => setActiveZone(null)}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-black text-sm transition-colors"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg border-4 border-white bg-gradient-to-br ${activeZone.color} text-white shrink-0`}
              >
                {activeZone.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  المنطقة #{activeZone.id} • {activeZone.categoryLabel}
                </span>
                <h2 className="text-2xl font-black text-gray-900 mt-1">
                  {activeZone.name}
                </h2>
                <div className="text-sm font-black text-teal-700">
                  اللعبة: {activeZone.gameTitle}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              {activeZone.shortDesc}
            </p>

            {/* Attributes */}
            <div className="space-y-2 mb-6 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/70 border border-teal-100">
                <span className="text-gray-500 font-bold">المهارة المكتسبة:</span>
                <span className="font-black text-teal-800">{activeZone.skill}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-gray-500 font-bold">شارة الإنجاز:</span>
                <span className="font-black text-amber-800">🏅 {activeZone.badge}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
                <span className="text-gray-500 font-bold">تقدمك في هذه اللعبة:</span>
                <span className="font-black text-purple-800">
                  ⭐ {progress.starsByGame[activeZone.id] || 0} من 50 تحدياً
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {freePlayMode || isZoneUnlocked(activeZone, progress.totalStars) ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleStartGame(activeZone.id)}
                  className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-white font-black py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 text-base"
                >
                  <span>انطلق في المغامرة الآن! 🚀</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs font-bold text-center">
                  🔒 هذه المنطقة مقفلة حالياً. اجمع {activeZone.requiredStars} نجمة لفتحها (لديك{' '}
                  {progress.totalStars} ⭐).
                </div>
                <button
                  onClick={() => {
                    setFreePlayMode(true);
                    handleStartGame(activeZone.id);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-xs transition-colors"
                >
                  🔓 فتح وتجربة المنطقة في وضع اللعب الحر
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
