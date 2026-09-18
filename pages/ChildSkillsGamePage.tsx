import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CHILD_SKILLS_GAMES } from '../data/childSkillsGamesData';
import { getGame50Stages } from '../data/childSkills50Stages';
import { DifficultyLevel, ChildSkillChallenge } from '../types/childSkillsTypes';
import { GamePlayEngine } from '../components/child-skills/GamePlayEngine';
import { recordStageWin, recordGameWin, getChildSkillsStats } from '../utils/childSkillsStorage';

const ChildSkillsGamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const numericId = parseInt(gameId || '1', 10);
  const game = CHILD_SKILLS_GAMES.find((g) => g.id === numericId);

  // All 50 unique stages for this game
  const stages50: ChildSkillChallenge[] = useMemo(() => {
    if (!game) return [];
    return game.stages && game.stages.length === 50
      ? game.stages
      : getGame50Stages(game.id);
  }, [game]);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);
  const [isCompletedAllStages, setIsCompletedAllStages] = useState(false);
  const [isStagesModalOpen, setIsStagesModalOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [unlockedBadgeTitle, setUnlockedBadgeTitle] = useState<string | null>(null);

  // Load completed stages from storage
  const [completedStages, setCompletedStages] = useState<number[]>(() => {
    const stats = getChildSkillsStats();
    return stats.gamesProgress[numericId]?.completedStages || [];
  });

  // Current difficulty computed from current stage index
  const currentStageNumber = currentStageIndex + 1;
  const currentDifficulty: DifficultyLevel =
    currentStageNumber <= 15 ? 'easy' : currentStageNumber <= 35 ? 'medium' : 'hard';

  const currentChallenge = stages50[currentStageIndex];
  const isLastChallenge = currentStageIndex >= stages50.length - 1;

  // Sync completed stages when storage changes
  useEffect(() => {
    const stats = getChildSkillsStats();
    if (stats.gamesProgress[numericId]?.completedStages) {
      setCompletedStages(stats.gamesProgress[numericId].completedStages || []);
    }
  }, [numericId]);

  // If game not found
  if (!game || stages50.length === 0) {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-4 text-center" dir="rtl">
        <div className="text-6xl mb-4">🧩</div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">عذراً، اللعبة غير موجودة</h2>
        <button
          onClick={() => navigate('/my-child-skills')}
          className="mt-4 px-6 py-3 bg-sky-500 text-white font-black rounded-2xl shadow-md cursor-pointer"
        >
          العودة إلى مهارات طفلي
        </button>
      </div>
    );
  }

  // Jump to specific difficulty section
  const handleDifficultySectionJump = (diff: DifficultyLevel) => {
    if (diff === 'easy') setCurrentStageIndex(0);
    else if (diff === 'medium') setCurrentStageIndex(15);
    else setCurrentStageIndex(35);
    setIsCompletedAllStages(false);
  };

  // Called when child answers correctly in a stage
  const handleCorrect = () => {
    setSessionStars((s) => s + 1);

    // Record stage win in storage
    const { newBadge } = recordStageWin(game.id, currentStageNumber, 1);
    if (newBadge) {
      setUnlockedBadgeTitle(newBadge);
    }

    setCompletedStages((prev) => {
      if (!prev.includes(currentStageNumber)) {
        return [...prev, currentStageNumber];
      }
      return prev;
    });
  };

  // Move to next challenge or complete all 50 stages
  const handleNextChallenge = () => {
    if (isLastChallenge) {
      // Completed all 50 stages!
      const totalEarned = sessionStars + 1;
      const { newBadge } = recordGameWin(game.id, 'hard', totalEarned);
      if (newBadge) {
        setUnlockedBadgeTitle(newBadge);
      }
      setIsCompletedAllStages(true);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#f59e0b', '#ec4899', '#10b981', '#a855f7'],
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      setCurrentStageIndex((idx) => idx + 1);
    }
  };

  const handlePrevChallenge = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex((idx) => idx - 1);
      setIsCompletedAllStages(false);
    }
  };

  const handleReplay = () => {
    setCurrentStageIndex(0);
    setIsCompletedAllStages(false);
    setUnlockedBadgeTitle(null);
  };

  // Filter stages for stage selector modal
  const displayedStages = stages50.filter((_, idx) => {
    const num = idx + 1;
    if (stageFilter === 'easy') return num <= 15;
    if (stageFilter === 'medium') return num >= 16 && num <= 35;
    if (stageFilter === 'hard') return num >= 36;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-pink-50 py-4 sm:py-8 px-3 sm:px-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation & Status Bar */}
        <div className="bg-white/95 rounded-3xl p-3 sm:p-4 shadow-sm border-2 border-sky-100 flex items-center justify-between gap-2 mb-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/my-child-skills')}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-black text-xs sm:text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <span>⬅️</span>
            <span>العودة</span>
          </button>

          {/* Game Title with approved icon */}
          <div className="flex items-center gap-2 text-center">
            <span className="text-2xl sm:text-3xl">{game.icon}</span>
            <div className="text-right">
              <h1 className="text-sm sm:text-lg font-black text-gray-900 leading-tight">
                {game.title}
              </h1>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.2 rounded-full">
                {game.skill}
              </span>
            </div>
          </div>

          {/* Stage Selector Trigger Button & Stars */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStagesModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-sm transition-transform active:scale-95 cursor-pointer"
              title="عرض قائمة المراحل الـ 50"
            >
              <span>🗺️</span>
              <span>المراحل ({completedStages.length}/50)</span>
            </button>

            <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-2xl text-amber-900 font-black text-xs sm:text-sm shadow-xs">
              <span>⭐</span>
              <span>{sessionStars}</span>
            </div>
          </div>
        </div>

        {/* 🎚️ Difficulty & Section Quick Jumper */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <button
            onClick={() => handleDifficultySectionJump('easy')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              currentDifficulty === 'easy'
                ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            🟢 سهل (مراحل 1 - 15)
          </button>

          <button
            onClick={() => handleDifficultySectionJump('medium')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              currentDifficulty === 'medium'
                ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            🟡 متوسط (مراحل 16 - 35)
          </button>

          <button
            onClick={() => handleDifficultySectionJump('hard')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              currentDifficulty === 'hard'
                ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-300'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            🔴 متقدم (مراحل 36 - 50)
          </button>
        </div>

        {/* 📈 50-Stage Progress Bar & Stage Indicator */}
        <div className="mb-5 max-w-xl mx-auto bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-xs sm:text-sm font-black text-gray-700 mb-1.5 px-1">
            <div className="flex items-center gap-2">
              <span className="bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-lg">
                المرحلة {currentStageNumber} من 50
              </span>
              {completedStages.includes(currentStageNumber) && (
                <span className="text-amber-500 flex items-center gap-0.5 text-xs">
                  <span>⭐ مكتملة</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentStageIndex > 0 && (
                <button
                  onClick={handlePrevChallenge}
                  className="text-gray-500 hover:text-gray-800 font-black text-xs cursor-pointer hover:underline"
                >
                  ⬅️ السابقة
                </button>
              )}
              {currentStageIndex < 49 && (
                <button
                  onClick={handleNextChallenge}
                  className="text-sky-600 hover:text-sky-800 font-black text-xs cursor-pointer hover:underline"
                >
                  التالية ➜
                </button>
              )}
              <span className="text-gray-500 text-xs">
                {Math.round((currentStageNumber / 50) * 100)}%
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-300"
              style={{
                width: `${(currentStageNumber / 50) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* 🎮 Game Play Board */}
        {!isCompletedAllStages && currentChallenge ? (
          <GamePlayEngine
            challenge={currentChallenge}
            difficulty={currentDifficulty}
            onCorrectAnswer={handleCorrect}
            onNextChallenge={handleNextChallenge}
            isLastChallenge={isLastChallenge}
          />
        ) : isCompletedAllStages ? (
          /* 🏆 50-Stage Full Completion Grand Celebration Card */
          <div className="w-full max-w-lg mx-auto bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-300 text-center animate-fadeIn">
            <div className="text-6xl sm:text-7xl mb-3 animate-bounce">👑🏆</div>
            <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              بطل المهارات الخارق!
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-bold mb-4">
              مبارك يا بطل! لقد أتممت جميع المراحل الـ 50 في لعبة <span className="text-indigo-600">"{game.title}"</span> بنجاح باهر ودون أي تكرار! 🌟
            </p>

            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 inline-flex items-center gap-3 mb-6">
              <span className="text-3xl">⭐</span>
              <div className="text-right">
                <div className="text-xs font-bold text-amber-800">إجمالي النجوم المكتسبة</div>
                <div className="text-2xl font-black text-amber-950">+{sessionStars} نجمة ذهبية</div>
              </div>
            </div>

            {/* If a new badge unlocked */}
            {unlockedBadgeTitle && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300 animate-pulse">
                <div className="text-2xl mb-1">🏅</div>
                <div className="font-black text-sm text-purple-950">
                  مبارك! فزت بوسام جديد: {unlockedBadgeTitle}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleReplay}
                className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                إعادة من المرحلة 1 ↺
              </button>

              <button
                onClick={() => {
                  const nextId = game.id < 40 ? game.id + 1 : 1;
                  navigate(`/my-child-skills/${nextId}`);
                  setIsCompletedAllStages(false);
                  setCurrentStageIndex(0);
                  setSessionStars(0);
                }}
                className="py-3 px-6 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                اللعبة التالية ➜
              </button>

              <button
                onClick={() => navigate('/my-child-skills')}
                className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black rounded-2xl shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                جميع الألعاب 🏠
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* 📋 50-Stage Quick Selector Modal */}
      {isStagesModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          dir="rtl"
          onClick={() => setIsStagesModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-sky-200 overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{game.icon}</span>
                <div>
                  <h3 className="font-black text-base sm:text-lg leading-tight">
                    اختر المرحلة (1 - 50)
                  </h3>
                  <div className="text-[11px] text-sky-100 font-bold">
                    لعبة: {game.title} • المكتمل: {completedStages.length} / 50 مرحلة ⭐
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsStagesModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-black flex items-center justify-center cursor-pointer transition-transform active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-1.5 justify-center">
              <button
                onClick={() => setStageFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  stageFilter === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                الكل (50)
              </button>
              <button
                onClick={() => setStageFilter('easy')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  stageFilter === 'easy'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                🟢 سهل (1 - 15)
              </button>
              <button
                onClick={() => setStageFilter('medium')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  stageFilter === 'medium'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                🟡 متوسط (16 - 35)
              </button>
              <button
                onClick={() => setStageFilter('hard')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  stageFilter === 'hard'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                🔴 متقدم (36 - 50)
              </button>
            </div>

            {/* Stages 50 Grid */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {displayedStages.map((stage) => {
                  const num = stage.stageNumber || 1;
                  const isCurrent = currentStageNumber === num;
                  const isFinished = completedStages.includes(num);

                  return (
                    <button
                      key={stage.id}
                      onClick={() => {
                        setCurrentStageIndex(num - 1);
                        setIsCompletedAllStages(false);
                        setIsStagesModalOpen(false);
                      }}
                      className={`relative p-2 rounded-2xl font-black flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs ${
                        isCurrent
                          ? 'bg-gradient-to-b from-sky-500 to-indigo-600 text-white ring-3 ring-sky-300 scale-105 shadow-md'
                          : isFinished
                          ? 'bg-amber-50 border-2 border-amber-300 text-amber-950 hover:bg-amber-100'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{num}</span>
                      <span className="text-[10px]">
                        {isFinished ? '⭐' : num <= 15 ? '🟢' : num <= 35 ? '🟡' : '🔴'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
              <button
                onClick={() => setIsStagesModalOpen(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-black text-xs rounded-xl cursor-pointer"
              >
                إغلاق القائمة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildSkillsGamePage;
