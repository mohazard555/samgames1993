import { ChildSkillsStats, DifficultyLevel } from '../types/childSkillsTypes';
import { SKILL_BADGES } from '../data/childSkillsGamesData';

const STORAGE_KEY = 'my_child_skills_stats_v1';

export const getDefaultStats = (): ChildSkillsStats => {
  return {
    totalStars: 0,
    completedGamesCount: 0,
    badges: [],
    streak: 1,
    gamesProgress: {},
  };
};

export const getChildSkillsStats = (): ChildSkillsStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStats();
    const parsed = JSON.parse(raw);
    return {
      totalStars: parsed.totalStars || 0,
      completedGamesCount: parsed.completedGamesCount || 0,
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      streak: parsed.streak || 1,
      gamesProgress: parsed.gamesProgress || {},
    };
  } catch (e) {
    console.error('Failed to load child skills stats:', e);
    return getDefaultStats();
  }
};

export const saveChildSkillsStats = (stats: ChildSkillsStats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    window.dispatchEvent(new Event('child_skills_stats_updated'));
  } catch (e) {
    console.error('Failed to save child skills stats:', e);
  }
};

export const recordStageWin = (
  gameId: number,
  stageNumber: number,
  starsEarned: number = 1
): { stats: ChildSkillsStats; newBadge?: string } => {
  const stats = getChildSkillsStats();
  const existingProg = stats.gamesProgress[gameId] || {
    gameId,
    completed: false,
    stars: 0,
    completedDifficulties: [],
    completedStages: [],
    highestStageReached: 1,
  };

  if (!existingProg.completedStages) {
    existingProg.completedStages = [];
  }

  const alreadyCompletedStage = existingProg.completedStages.includes(stageNumber);
  if (!alreadyCompletedStage) {
    existingProg.completedStages.push(stageNumber);
    stats.totalStars += starsEarned;
  }

  existingProg.highestStageReached = Math.max(existingProg.highestStageReached || 1, stageNumber + 1);
  existingProg.stars = Math.max(existingProg.stars, existingProg.completedStages.length);

  // Difficulty tag
  const diff: DifficultyLevel = stageNumber <= 15 ? 'easy' : stageNumber <= 35 ? 'medium' : 'hard';
  if (!existingProg.completedDifficulties.includes(diff)) {
    existingProg.completedDifficulties.push(diff);
  }

  // If completed at least 50 stages or reached 50
  if (existingProg.completedStages.length >= 50 || stageNumber === 50) {
    existingProg.completed = true;
  }

  existingProg.lastPlayed = Date.now();
  stats.gamesProgress[gameId] = existingProg;

  // Update completed games count
  const completedCount = Object.values(stats.gamesProgress).filter((p) => p.completed).length;
  stats.completedGamesCount = completedCount;

  // Check badges
  let newBadgeFound: string | undefined;
  SKILL_BADGES.forEach((b) => {
    if (!stats.badges.includes(b.id) && completedCount >= b.minGames) {
      stats.badges.push(b.id);
      newBadgeFound = b.title;
    }
  });

  saveChildSkillsStats(stats);
  return { stats, newBadge: newBadgeFound };
};

export const recordGameWin = (
  gameId: number,
  difficulty: DifficultyLevel,
  starsEarned: number
): { stats: ChildSkillsStats; newBadge?: string } => {
  const stats = getChildSkillsStats();
  const existingProg = stats.gamesProgress[gameId] || {
    gameId,
    completed: false,
    stars: 0,
    completedDifficulties: [],
    completedStages: [],
    highestStageReached: 1,
  };

  existingProg.completed = true;
  existingProg.stars = Math.max(existingProg.stars, starsEarned);
  if (!existingProg.completedDifficulties.includes(difficulty)) {
    existingProg.completedDifficulties.push(difficulty);
  }
  existingProg.lastPlayed = Date.now();
  stats.gamesProgress[gameId] = existingProg;

  // Add stars
  stats.totalStars += starsEarned;

  // Update completed count
  const completedCount = Object.values(stats.gamesProgress).filter((p) => p.completed).length;
  stats.completedGamesCount = completedCount;

  // Check badges
  let newBadgeFound: string | undefined;
  SKILL_BADGES.forEach((b) => {
    if (!stats.badges.includes(b.id) && completedCount >= b.minGames) {
      stats.badges.push(b.id);
      newBadgeFound = b.title;
    }
  });

  saveChildSkillsStats(stats);
  return { stats, newBadge: newBadgeFound };
};
