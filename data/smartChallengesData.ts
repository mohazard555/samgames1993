import { SmartChallengeGame } from '../types/smartChallengesTypes';
import { SMART_GAMES_METADATA } from './smartChallengesGamesMeta';
import { generateQuestionsForGame } from './smartChallengesQuestionsGen';

// Lazy-loaded or pre-instantiated games array
export const SMART_CHALLENGES_GAMES: SmartChallengeGame[] = SMART_GAMES_METADATA.map((meta) => {
  return {
    id: meta.id,
    title: meta.title,
    icon: meta.icon,
    shortDesc: meta.shortDesc,
    category: meta.category,
    color: meta.color,
    skill: meta.skill,
    questions: generateQuestionsForGame(meta.id),
  };
});

// Helper to quickly retrieve a single game by ID
export const getSmartChallengeGameById = (id: number): SmartChallengeGame | undefined => {
  const meta = SMART_GAMES_METADATA.find((m) => m.id === id);
  if (!meta) return undefined;
  return {
    id: meta.id,
    title: meta.title,
    icon: meta.icon,
    shortDesc: meta.shortDesc,
    category: meta.category,
    color: meta.color,
    skill: meta.skill,
    questions: generateQuestionsForGame(meta.id),
  };
};
