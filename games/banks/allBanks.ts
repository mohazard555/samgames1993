import { GameDefinition, QuizQuestion, ComparisonRound } from '../newGamesData';
import { COMPARISONS_BANK } from './comparisonsBank';
import { SCIENCE_SPACE_BANK } from './scienceSpaceBank';
import { ANIMALS_NATURE_BANK } from './animalsNatureBank';
import { MATH_NUMBERS_BANK } from './mathNumbersBank';
import { ARABIC_LANGUAGE_BANK } from './arabicLanguageBank';
import { CULTURE_GEOGRAPHY_BANK } from './cultureGeographyBank';
import { SPORTS_MUSIC_PUZZLES_BANK } from './sportsMusicPuzzlesBank';

export function getAuthentic50Items(gameDef: GameDefinition): {
  type: 'quiz' | 'comparison';
  questions?: QuizQuestion[];
  comparisons?: ComparisonRound[];
} {
  const title = gameDef.title;

  // 1. Check comparisons bank first if type is comparison
  if (gameDef.type === 'comparison' || COMPARISONS_BANK[title]) {
    if (COMPARISONS_BANK[title] && COMPARISONS_BANK[title].length > 0) {
      return {
        type: 'comparison',
        comparisons: COMPARISONS_BANK[title],
      };
    }
  }

  // 2. Check quiz banks
  if (SCIENCE_SPACE_BANK[title]) {
    return { type: 'quiz', questions: SCIENCE_SPACE_BANK[title] };
  }
  if (ANIMALS_NATURE_BANK[title]) {
    return { type: 'quiz', questions: ANIMALS_NATURE_BANK[title] };
  }
  if (MATH_NUMBERS_BANK[title]) {
    return { type: 'quiz', questions: MATH_NUMBERS_BANK[title] };
  }
  if (ARABIC_LANGUAGE_BANK[title]) {
    return { type: 'quiz', questions: ARABIC_LANGUAGE_BANK[title] };
  }
  if (CULTURE_GEOGRAPHY_BANK[title]) {
    return { type: 'quiz', questions: CULTURE_GEOGRAPHY_BANK[title] };
  }
  if (SPORTS_MUSIC_PUZZLES_BANK[title]) {
    return { type: 'quiz', questions: SPORTS_MUSIC_PUZZLES_BANK[title] };
  }

  // 3. Fallback to existing gameDef items if any
  if (gameDef.type === 'comparison' && gameDef.comparisons && gameDef.comparisons.length > 0) {
    return { type: 'comparison', comparisons: gameDef.comparisons };
  }
  if (gameDef.questions && gameDef.questions.length > 0) {
    return { type: 'quiz', questions: gameDef.questions };
  }

  // Default to science quiz or comparison
  return {
    type: gameDef.type === 'comparison' ? 'comparison' : 'quiz',
    questions: SCIENCE_SPACE_BANK['أسرار الفضاء والكواكب'],
  };
}
