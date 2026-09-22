import { IslandZoneMeta, IslandQuestion, IslandPlayerProgress } from '../types/adventureIslandTypes';
import { ADVENTURE_ISLAND_ZONES } from './adventureIslandZones';
import { generateQuestionsForIslandGame } from './adventureIslandQuestionsGen';

const STORAGE_KEY = 'toysgame_adventure_island_progress_v1';

// Cache generated questions in memory per gameId so they stay consistent
const questionsCache: Record<number, IslandQuestion[]> = {};

export const getQuestionsForGame = (gameId: number): IslandQuestion[] => {
  if (!questionsCache[gameId]) {
    questionsCache[gameId] = generateQuestionsForIslandGame(gameId);
  }
  return questionsCache[gameId];
};

export const getZoneMeta = (gameId: number): IslandZoneMeta | undefined => {
  return ADVENTURE_ISLAND_ZONES.find((z) => z.id === gameId);
};

export const getInitialProgress = (): IslandPlayerProgress => {
  return {
    starsByGame: {},
    completedChallenges: {},
    totalStars: 0,
    unlockedZones: [1, 2, 3, 4], // Initial zones are open
  };
};

export const loadIslandProgress = (): IslandPlayerProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialProgress();
    const parsed = JSON.parse(raw);
    return {
      starsByGame: parsed.starsByGame || {},
      completedChallenges: parsed.completedChallenges || {},
      totalStars: parsed.totalStars || 0,
      unlockedZones: parsed.unlockedZones || [1, 2, 3, 4],
    };
  } catch {
    return getInitialProgress();
  }
};

export const saveIslandProgress = (progress: IslandPlayerProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save adventure island progress', e);
  }
};

export const recordChallengeResult = (
  gameId: number,
  challengeNum: number, // 1 to 50
  earnedStar: boolean
): IslandPlayerProgress => {
  const current = loadIslandProgress();
  const currentStars = current.starsByGame[gameId] || 0;

  // If this challenge gives a new star
  const prevCompleted = current.completedChallenges[gameId] || 0;
  if (challengeNum > prevCompleted) {
    current.completedChallenges[gameId] = challengeNum;
  }

  if (earnedStar && currentStars < challengeNum) {
    current.starsByGame[gameId] = challengeNum;
  }

  // Recalculate total stars
  let sum = 0;
  for (const gid in current.starsByGame) {
    sum += current.starsByGame[gid] || 0;
  }
  current.totalStars = sum;

  // Check unlocked zones
  const unlocked = new Set<number>(current.unlockedZones || [1, 2, 3, 4]);
  ADVENTURE_ISLAND_ZONES.forEach((zone) => {
    if (current.totalStars >= zone.requiredStars) {
      unlocked.add(zone.id);
    }
  });
  current.unlockedZones = Array.from(unlocked);

  saveIslandProgress(current);
  return current;
};

export const isZoneUnlocked = (zone: IslandZoneMeta, currentStars: number): boolean => {
  // Always unlock if child collected required stars, or if zone is naturally open
  return zone.requiredStars === 0 || currentStars >= zone.requiredStars;
};

export { ADVENTURE_ISLAND_ZONES };
