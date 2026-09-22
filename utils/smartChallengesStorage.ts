import { SmartChallengesStats, SmartGameProgress } from '../types/smartChallengesTypes';

const STORAGE_KEY = 'toysgame_smart_challenges_stats_v1';

const DEFAULT_STATS: SmartChallengesStats = {
  totalStars: 0,
  completedGamesCount: 0,
  badges: [],
  gamesProgress: {},
};

export const getSmartChallengesStats = (): SmartChallengesStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      totalStars: typeof parsed.totalStars === 'number' ? parsed.totalStars : 0,
      completedGamesCount: typeof parsed.completedGamesCount === 'number' ? parsed.completedGamesCount : 0,
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      gamesProgress: parsed.gamesProgress && typeof parsed.gamesProgress === 'object' ? parsed.gamesProgress : {},
    };
  } catch {
    return DEFAULT_STATS;
  }
};

export const saveSmartChallengesStats = (stats: SmartChallengesStats): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('smart_challenges_stats_updated', { detail: stats }));
    }
  } catch (e) {
    console.warn('Failed to save smart challenges stats:', e);
  }
};

export const recordSmartQuestionWin = (gameId: number, questionId: number): { isNewQuestion: boolean; totalStars: number } => {
  const stats = getSmartChallengesStats();
  const gameProgress: SmartGameProgress = stats.gamesProgress[gameId] || {
    completedQuestions: [],
    stars: 0,
    bestScore: 0,
    isCompleted: false,
  };

  const isNewQuestion = !gameProgress.completedQuestions.includes(questionId);

  if (isNewQuestion) {
    gameProgress.completedQuestions.push(questionId);
    gameProgress.stars += 1;
    stats.totalStars += 1;
  }

  gameProgress.lastPlayedAt = new Date().toISOString();
  stats.gamesProgress[gameId] = gameProgress;

  saveSmartChallengesStats(stats);
  return { isNewQuestion, totalStars: stats.totalStars };
};

export const recordSmartGameCompletion = (gameId: number, finalScore: number, finalStars: number): { newlyEarnedBadge?: string } => {
  const stats = getSmartChallengesStats();
  const gameProgress: SmartGameProgress = stats.gamesProgress[gameId] || {
    completedQuestions: [],
    stars: 0,
    bestScore: 0,
    isCompleted: false,
  };

  const wasCompleted = gameProgress.isCompleted;
  gameProgress.isCompleted = true;
  if (finalScore > gameProgress.bestScore) {
    gameProgress.bestScore = finalScore;
  }

  if (!wasCompleted) {
    stats.completedGamesCount += 1;
  }

  let newlyEarnedBadge: string | undefined = undefined;
  // Award badges based on milestones
  if (stats.completedGamesCount >= 1 && !stats.badges.includes('المبتدئ الذكي 🌟')) {
    stats.badges.push('المبتدئ الذكي 🌟');
    newlyEarnedBadge = 'المبتدئ الذكي 🌟';
  }
  if (stats.completedGamesCount >= 10 && !stats.badges.includes('بطل التحديات 🏆')) {
    stats.badges.push('بطل التحديات 🏆');
    newlyEarnedBadge = 'بطل التحديات 🏆';
  }
  if (stats.completedGamesCount >= 25 && !stats.badges.includes('عبقري الألغاز 🧠')) {
    stats.badges.push('عبقري الألغاز 🧠');
    newlyEarnedBadge = 'عبقري الألغاز 🧠';
  }
  if (stats.completedGamesCount >= 40 && !stats.badges.includes('فارس الذكاء 🏅')) {
    stats.badges.push('فارس الذكاء 🏅');
    newlyEarnedBadge = 'فارس الذكاء 🏅';
  }
  if (stats.completedGamesCount >= 50 && !stats.badges.includes('أسطورة عالم التحديات 👑')) {
    stats.badges.push('أسطورة عالم التحديات 👑');
    newlyEarnedBadge = 'أسطورة عالم التحديات 👑';
  }
  if (gameId >= 41 && gameId <= 50 && !stats.badges.includes('سيد الوقت والساعة ⏰')) {
    const timeGamesCompleted = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50].every(
      (id) => stats.gamesProgress[id]?.isCompleted
    );
    if (timeGamesCompleted) {
      stats.badges.push('سيد الوقت والساعة ⏰');
      newlyEarnedBadge = 'سيد الوقت والساعة ⏰';
    }
  }

  stats.gamesProgress[gameId] = gameProgress;
  saveSmartChallengesStats(stats);
  return { newlyEarnedBadge };
};
