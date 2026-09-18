import React, { useState, useEffect } from 'react';
import { ChildSkillChallenge, DifficultyLevel } from '../../types/childSkillsTypes';
import { ChildSkillsVisualAsset } from './ChildSkillsVisualAsset';

interface GamePlayEngineProps {
  challenge: ChildSkillChallenge;
  difficulty: DifficultyLevel;
  onCorrectAnswer: () => void;
  onNextChallenge: () => void;
  isLastChallenge: boolean;
}

export const GamePlayEngine: React.FC<GamePlayEngineProps> = ({
  challenge,
  difficulty,
  onCorrectAnswer,
  onNextChallenge,
  isLastChallenge,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wiggleKey, setWiggleKey] = useState(0);

  // For multi-find / speed-tap challenges
  const [foundItemIds, setFoundItemIds] = useState<string[]>([]);

  // For memory game
  const [memoryCards, setMemoryCards] = useState<
    { id: number; visual: string; isFlipped: boolean; isMatched: boolean }[]
  >([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // For coloring
  const [currentColor, setCurrentColor] = useState<string | null>(null);

  // For ordering
  const [orderedList, setOrderedList] = useState<string[]>([]);

  // Reset states on challenge change
  useEffect(() => {
    setSelectedOptionId(null);
    setFeedbackState('idle');
    setFoundItemIds([]);
    setCurrentColor(null);

    // Setup memory cards if memory type
    if (challenge.type === 'memory' && challenge.data?.pairs) {
      const pairs: string[] = challenge.data.pairs;
      const deck = [...pairs, ...pairs]
        .map((visual, index) => ({
          id: index,
          visual,
          isFlipped: false,
          isMatched: false,
        }))
        .sort(() => Math.random() - 0.5);
      setMemoryCards(deck);
      setFlippedIndices([]);
    }

    // Setup ordering if ordering type
    if (challenge.type === 'ordering' && challenge.data?.scrambled) {
      setOrderedList([]);
    }
  }, [challenge]);

  // Handle Standard Choice Click
  const handleChoiceClick = (option: any) => {
    if (feedbackState === 'correct') return;

    setSelectedOptionId(option.id);
    if (option.isCorrect) {
      setFeedbackState('correct');
      onCorrectAnswer();
    } else {
      setFeedbackState('wrong');
      setWiggleKey((k) => k + 1);
      setTimeout(() => {
        setFeedbackState('idle');
      }, 1200);
    }
  };

  // Handle Memory Card Click
  const handleMemoryCardClick = (index: number) => {
    if (feedbackState === 'correct') return;
    if (memoryCards[index].isMatched || memoryCards[index].isFlipped) return;
    if (flippedIndices.length >= 2) return;

    const newDeck = [...memoryCards];
    newDeck[index].isFlipped = true;
    setMemoryCards(newDeck);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (newDeck[firstIdx].visual === newDeck[secondIdx].visual) {
        // Matched!
        setTimeout(() => {
          newDeck[firstIdx].isMatched = true;
          newDeck[secondIdx].isMatched = true;
          setMemoryCards([...newDeck]);
          setFlippedIndices([]);

          // Check all matched
          if (newDeck.every((c) => c.isMatched)) {
            setFeedbackState('correct');
            onCorrectAnswer();
          }
        }, 400);
      } else {
        // Not matched
        setTimeout(() => {
          newDeck[firstIdx].isFlipped = false;
          newDeck[secondIdx].isFlipped = false;
          setMemoryCards([...newDeck]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  // Handle Multi-Find Click
  const handleFindMultiClick = (item: any) => {
    if (feedbackState === 'correct') return;

    if (item.isTarget) {
      if (!foundItemIds.includes(item.id)) {
        const updated = [...foundItemIds, item.id];
        setFoundItemIds(updated);

        const targetCount = challenge.data.items.filter((i: any) => i.isTarget).length;
        if (updated.length >= targetCount) {
          setFeedbackState('correct');
          onCorrectAnswer();
        }
      }
    } else {
      setFeedbackState('wrong');
      setWiggleKey((k) => k + 1);
      setTimeout(() => setFeedbackState('idle'), 1000);
    }
  };

  // Handle Coloring Click
  const handleColorClick = (item: any) => {
    if (feedbackState === 'correct') return;
    setCurrentColor(item.color);

    if (item.color === challenge.data.correctColor) {
      setFeedbackState('correct');
      onCorrectAnswer();
    } else {
      setFeedbackState('wrong');
      setWiggleKey((k) => k + 1);
      setTimeout(() => setFeedbackState('idle'), 1000);
    }
  };

  // Handle Ordering Item Click
  const handleOrderingAdd = (val: string) => {
    if (feedbackState === 'correct') return;
    if (orderedList.includes(val)) return;

    const nextList = [...orderedList, val];
    setOrderedList(nextList);

    const targetList: string[] = challenge.data.items;
    if (nextList.length === targetList.length) {
      const isPerfect = nextList.every((v, i) => v === targetList[i]);
      if (isPerfect) {
        setFeedbackState('correct');
        onCorrectAnswer();
      } else {
        setFeedbackState('wrong');
        setWiggleKey((k) => k + 1);
        setTimeout(() => {
          setOrderedList([]);
          setFeedbackState('idle');
        }, 1200);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 💡 Instruction Banner */}
      <div className="w-full max-w-xl bg-white/95 border-2 border-sky-200 rounded-3xl p-4 sm:p-5 shadow-sm text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-xl sm:text-2xl animate-pulse">💡</span>
          <span className="text-xs sm:text-sm font-bold text-sky-700">مهمتك في هذا التحدي:</span>
        </div>
        <h3 className="text-base sm:text-xl font-black text-gray-800 leading-snug">
          {challenge.instruction}
        </h3>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="w-full max-w-xl bg-gradient-to-b from-white to-sky-50/60 border-2 border-sky-100 rounded-3xl p-4 sm:p-6 shadow-md mb-5 flex flex-col items-center justify-center min-h-[220px]">
        {/* Choice / Match Type */}
        {challenge.type === 'choice' && (
          <div className="w-full flex flex-col items-center">
            {challenge.targetVisual && (
              <div className="mb-6 p-4 bg-white rounded-3xl border-3 border-amber-300 shadow-sm">
                <ChildSkillsVisualAsset
                  itemKey={challenge.targetVisual}
                  size="xl"
                  label={challenge.targetLabel}
                  showLabel={!!challenge.targetLabel}
                />
              </div>
            )}

            {/* If there's an Arabic question prompt or word */}
            {challenge.data?.word && (
              <div className="mb-6 px-6 py-3 bg-indigo-50 border-2 border-indigo-200 rounded-2xl text-2xl sm:text-3xl font-black text-indigo-900 tracking-wider">
                {challenge.data.word}
              </div>
            )}

            {/* Options Grid */}
            <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 max-w-md">
              {challenge.data.options.map((opt: any) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrect = feedbackState === 'correct' && opt.isCorrect;
                const isWrong = isSelected && feedbackState === 'wrong';

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleChoiceClick(opt)}
                    className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-3 transition-all flex flex-col items-center justify-center gap-2 active:scale-95 cursor-pointer select-none min-h-[110px] sm:min-h-[130px] ${
                      isCorrect
                        ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300 scale-102 shadow-lg'
                        : isWrong
                        ? 'bg-red-100 border-red-500 animate-shake'
                        : 'bg-white hover:bg-sky-50 border-sky-200 hover:border-sky-400 shadow-xs'
                    }`}
                  >
                    <ChildSkillsVisualAsset
                      itemKey={opt.visual}
                      size="lg"
                      isSilhouette={opt.isSilhouette}
                    />
                    {opt.label && (
                      <span className="text-xs sm:text-sm font-black text-gray-800 text-center">
                        {opt.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 🧠 Memory Game Type */}
        {challenge.type === 'memory' && (
          <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-md w-full">
              {memoryCards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => handleMemoryCardClick(idx)}
                  disabled={card.isMatched || card.isFlipped}
                  className={`h-24 sm:h-28 rounded-2xl sm:rounded-3xl border-3 transition-all flex items-center justify-center text-4xl sm:text-5xl shadow-sm cursor-pointer select-none active:scale-95 ${
                    card.isMatched
                      ? 'bg-emerald-100 border-emerald-400 opacity-90 ring-2 ring-emerald-300'
                      : card.isFlipped
                      ? 'bg-white border-amber-400 shadow-md scale-102'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-300 text-white hover:brightness-110'
                  }`}
                >
                  {card.isFlipped || card.isMatched ? card.visual : '❓'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 🎨 Coloring Type */}
        {challenge.type === 'coloring' && (
          <div className="w-full flex flex-col items-center">
            <div className="mb-6 p-6 bg-white rounded-3xl border-3 border-gray-200 shadow-sm">
              <div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-400 flex items-center justify-center text-5xl transition-colors duration-300 shadow-inner"
                style={{ backgroundColor: currentColor || '#ffffff' }}
              >
                {!currentColor && <span className="text-gray-300">⚪</span>}
              </div>
            </div>

            <div className="text-xs sm:text-sm font-black text-gray-700 mb-2">
              اختر اللون المطلوب لتلوين الشكل:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {challenge.data.palette.map((item: any) => (
                <button
                  key={item.color}
                  onClick={() => handleColorClick(item)}
                  className="px-4 py-2.5 rounded-2xl border-2 border-gray-200 shadow-xs flex items-center gap-2 font-black text-xs sm:text-sm bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 🔴 Find Multi / Speed Tap */}
        {(challenge.type === 'find_multi' || challenge.type === 'speed_tap') && (
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-md w-full">
              {challenge.data.items.map((item: any) => {
                const isFound = foundItemIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleFindMultiClick(item)}
                    disabled={isFound}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl border-3 transition-all flex flex-col items-center justify-center cursor-pointer select-none active:scale-90 ${
                      isFound
                        ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300 scale-95 opacity-80'
                        : 'bg-white hover:bg-sky-50 border-sky-200 shadow-sm'
                    }`}
                  >
                    <ChildSkillsVisualAsset itemKey={item.visual} size="md" />
                    {isFound && (
                      <span className="text-[10px] font-black text-emerald-700">✓ تم</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 🔢 Count / Add / Subtract */}
        {(challenge.type === 'count' || challenge.type === 'add_sub') && (
          <div className="w-full flex flex-col items-center">
            {challenge.type === 'count' && (
              <div className="mb-6 flex flex-wrap items-center justify-center gap-2 p-4 bg-white rounded-3xl border-2 border-amber-200 shadow-xs max-w-sm">
                {Array.from({ length: challenge.data.count }).map((_, i) => (
                  <span key={i} className="text-4xl sm:text-5xl drop-shadow">
                    {challenge.data.visual}
                  </span>
                ))}
              </div>
            )}

            {challenge.type === 'add_sub' && (
              <div className="mb-6 flex items-center justify-center gap-3 p-4 bg-white rounded-3xl border-2 border-amber-200 shadow-xs">
                <div className="flex gap-1 text-3xl sm:text-4xl">
                  {Array.from({ length: challenge.data.leftCount }).map((_, i) => (
                    <span key={i}>{challenge.data.visual}</span>
                  ))}
                </div>
                <span className="text-2xl sm:text-3xl font-black text-sky-600">
                  {challenge.data.op}
                </span>
                <div className="flex gap-1 text-3xl sm:text-4xl">
                  {Array.from({ length: challenge.data.rightCount }).map((_, i) => (
                    <span key={i}>{challenge.data.visual}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Answer Number Buttons */}
            <div className="flex items-center justify-center gap-4">
              {challenge.data.options.map((num: number) => {
                const isCorrect = feedbackState === 'correct' && num === challenge.data.correct;
                return (
                  <button
                    key={num}
                    onClick={() => {
                      if (num === challenge.data.correct) {
                        setFeedbackState('correct');
                        onCorrectAnswer();
                      } else {
                        setFeedbackState('wrong');
                        setWiggleKey((k) => k + 1);
                        setTimeout(() => setFeedbackState('idle'), 1000);
                      }
                    }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl border-3 text-2xl sm:text-3xl font-black flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer ${
                      isCorrect
                        ? 'bg-emerald-500 border-emerald-600 text-white ring-4 ring-emerald-300'
                        : 'bg-white hover:bg-sky-50 border-sky-300 text-gray-800'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 🔢 Ordering / Events */}
        {challenge.type === 'ordering' && (
          <div className="w-full flex flex-col items-center">
            {/* Slot Display */}
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2 p-3 bg-white rounded-2xl border-2 border-indigo-200 min-h-[60px] w-full max-w-md">
              {orderedList.length === 0 ? (
                <span className="text-xs text-gray-400 font-bold">
                  اضغط على البطاقات أدناه بالترتيب الصحيح ⬇️
                </span>
              ) : (
                orderedList.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs animate-bounce"
                  >
                    {idx + 1}. {val}
                  </span>
                ))
              )}
            </div>

            {/* Scrambled Items to Tap */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-md">
              {challenge.data.scrambled.map((item: string, idx: number) => {
                const isChosen = orderedList.includes(item);
                return (
                  <button
                    key={idx}
                    onClick={() => handleOrderingAdd(item)}
                    disabled={isChosen}
                    className={`px-4 py-3 rounded-2xl border-2 font-black text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-xs ${
                      isChosen
                        ? 'bg-gray-100 border-gray-300 text-gray-400 line-through opacity-60'
                        : 'bg-white hover:bg-sky-50 border-sky-300 text-gray-800'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 📏 Size Compare */}
        {challenge.type === 'size_compare' && (
          <div className="w-full flex items-center justify-center gap-6 sm:gap-10">
            {challenge.data.items.map((item: any) => {
              const size = item.scale === 'lg' ? 'xl' : item.scale === 'xl' ? '2xl' : 'sm';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isCorrect) {
                      setFeedbackState('correct');
                      onCorrectAnswer();
                    } else {
                      setFeedbackState('wrong');
                      setWiggleKey((k) => k + 1);
                      setTimeout(() => setFeedbackState('idle'), 1000);
                    }
                  }}
                  className="p-4 bg-white hover:bg-amber-50 rounded-3xl border-3 border-amber-200 hover:border-amber-400 shadow-sm flex flex-col items-center justify-center active:scale-95 transition-all cursor-pointer"
                >
                  <ChildSkillsVisualAsset itemKey={challenge.data.visual} size={size as any} />
                  {item.label && (
                    <span className="text-xs font-black text-gray-700 mt-2">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ⚖️ Quantity Compare */}
        {challenge.type === 'quantity_compare' && (
          <div className="w-full flex items-center justify-center gap-4 sm:gap-8">
            <button
              onClick={() => {
                if (challenge.data.correct === 'A') {
                  setFeedbackState('correct');
                  onCorrectAnswer();
                } else {
                  setFeedbackState('wrong');
                  setWiggleKey((k) => k + 1);
                  setTimeout(() => setFeedbackState('idle'), 1000);
                }
              }}
              className="flex-1 p-4 bg-white hover:bg-sky-50 rounded-3xl border-3 border-sky-200 hover:border-sky-400 shadow-sm flex flex-col items-center cursor-pointer active:scale-95"
            >
              <div className="flex flex-wrap justify-center gap-1 text-3xl sm:text-4xl mb-2">
                {Array.from({ length: challenge.data.groupA.count }).map((_, i) => (
                  <span key={i}>{challenge.data.groupA.visual}</span>
                ))}
              </div>
              <span className="text-xs sm:text-sm font-black text-gray-800">
                {challenge.data.groupA.label}
              </span>
            </button>

            <span className="text-xl font-black text-gray-400">مقابل</span>

            <button
              onClick={() => {
                if (challenge.data.correct === 'B') {
                  setFeedbackState('correct');
                  onCorrectAnswer();
                } else {
                  setFeedbackState('wrong');
                  setWiggleKey((k) => k + 1);
                  setTimeout(() => setFeedbackState('idle'), 1000);
                }
              }}
              className="flex-1 p-4 bg-white hover:bg-sky-50 rounded-3xl border-3 border-sky-200 hover:border-sky-400 shadow-sm flex flex-col items-center cursor-pointer active:scale-95"
            >
              <div className="flex flex-wrap justify-center gap-1 text-3xl sm:text-4xl mb-2">
                {Array.from({ length: challenge.data.groupB.count }).map((_, i) => (
                  <span key={i}>{challenge.data.groupB.visual}</span>
                ))}
              </div>
              <span className="text-xs sm:text-sm font-black text-gray-800">
                {challenge.data.groupB.label}
              </span>
            </button>
          </div>
        )}

        {/* 🕵️ Find Hidden in Board */}
        {challenge.type === 'find_hidden' && (
          <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md w-full">
              {challenge.data.items.map((emoji: string, idx: number) => {
                const isTarget = emoji === challenge.data.target;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (isTarget) {
                        setFeedbackState('correct');
                        onCorrectAnswer();
                      } else {
                        setFeedbackState('wrong');
                        setWiggleKey((k) => k + 1);
                        setTimeout(() => setFeedbackState('idle'), 1000);
                      }
                    }}
                    className="h-16 sm:h-20 rounded-2xl bg-white hover:bg-amber-50 border-2 border-gray-200 hover:border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-xs transition-transform active:scale-90 cursor-pointer"
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 🗺️ Adventure Game Mode */}
        {challenge.type === 'adventure' && (
          <div className="w-full flex flex-col items-center">
            {/* Trail */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 p-3 bg-white rounded-2xl border-2 border-purple-200 shadow-xs">
              {challenge.data.trailIcons.map((icon: string, idx: number) => {
                const isCurrent = idx + 1 === challenge.data.step;
                const isDone = idx + 1 < challenge.data.step;
                return (
                  <div key={idx} className="flex items-center gap-1">
                    <span
                      className={`text-2xl sm:text-3xl p-1.5 rounded-xl ${
                        isCurrent
                          ? 'bg-purple-100 ring-2 ring-purple-400 animate-bounce'
                          : isDone
                          ? 'opacity-80'
                          : 'opacity-40 grayscale'
                      }`}
                    >
                      {icon}
                    </span>
                    {idx < challenge.data.trailIcons.length - 1 && (
                      <span className="text-gray-400 text-xs">➔</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 max-w-md w-full">
              {challenge.data.options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => handleChoiceClick(opt)}
                  className="p-5 bg-white hover:bg-purple-50 rounded-3xl border-3 border-purple-200 hover:border-purple-400 shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ChildSkillsVisualAsset itemKey={opt.visual} size="lg" />
                  <span className="text-xs sm:text-sm font-black text-gray-800">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 📣 Visual Feedback Alert Banner */}
      {feedbackState === 'correct' && (
        <div className="w-full max-w-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-fadeIn mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎉</span>
            <div>
              <div className="font-black text-lg sm:text-xl">أحسنت يا بطل! إجابة صحيحة!</div>
              <div className="text-xs font-bold text-emerald-100">+1 نجمة ذهبية ⭐</div>
            </div>
          </div>
          <button
            onClick={onNextChallenge}
            className="px-5 py-2.5 bg-white text-emerald-800 font-black text-sm rounded-xl shadow-md hover:bg-emerald-50 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>{isLastChallenge ? 'إنهاء التحدي 🏆' : 'التالي ➜'}</span>
          </button>
        </div>
      )}

      {feedbackState === 'wrong' && (
        <div
          key={wiggleKey}
          className="w-full max-w-xl bg-gradient-to-r from-rose-500 to-red-500 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 animate-shake mb-4"
        >
          <span className="text-2xl">💡</span>
          <span className="font-black text-sm sm:text-base">حاول مرة أخرى! يمكنك فعل ذلك يا بطل!</span>
        </div>
      )}
    </div>
  );
};
