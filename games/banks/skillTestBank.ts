import { QuizQuestion } from '../newGamesData';
import { SCIENCE_SPACE_BANK } from './scienceSpaceBank';
import { ANIMALS_NATURE_BANK } from './animalsNatureBank';
import { MATH_NUMBERS_BANK } from './mathNumbersBank';
import { ARABIC_LANGUAGE_BANK } from './arabicLanguageBank';
import { CULTURE_GEOGRAPHY_BANK } from './cultureGeographyBank';
import { SPORTS_MUSIC_PUZZLES_BANK } from './sportsMusicPuzzlesBank';

export interface EnrichedSkillQuestion extends QuizQuestion {
  category: string;
}

// Helper to extract all questions from a bank record
function extractFromRecord(record: Record<string, QuizQuestion[]>, categoryName: string): EnrichedSkillQuestion[] {
  const result: EnrichedSkillQuestion[] = [];
  for (const questions of Object.values(record)) {
    for (const q of questions) {
      result.push({
        ...q,
        category: categoryName,
      });
    }
  }
  return result;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns a randomized set of 50 authentic, diverse questions
 * covering science, nature, math, language, geography, and sports/puzzles.
 */
export function getRandom50DiverseQuestions(): EnrichedSkillQuestion[] {
  const scienceList = extractFromRecord(SCIENCE_SPACE_BANK, 'علوم وفضاء');
  const animalsList = extractFromRecord(ANIMALS_NATURE_BANK, 'حيوانات وطبيعة');
  const mathList = extractFromRecord(MATH_NUMBERS_BANK, 'رياضيات وذكاء');
  const arabicList = extractFromRecord(ARABIC_LANGUAGE_BANK, 'لغة عربية');
  const cultureList = extractFromRecord(CULTURE_GEOGRAPHY_BANK, 'ثقافة وجغرافيا');
  const sportsList = extractFromRecord(SPORTS_MUSIC_PUZZLES_BANK, 'رياضة وألغاز');

  // Sample quotas from each domain to guarantee balanced variety
  const pickedScience = shuffleArray(scienceList).slice(0, 9);
  const pickedAnimals = shuffleArray(animalsList).slice(0, 9);
  const pickedMath = shuffleArray(mathList).slice(0, 8);
  const pickedArabic = shuffleArray(arabicList).slice(0, 8);
  const pickedCulture = shuffleArray(cultureList).slice(0, 8);
  const pickedSports = shuffleArray(sportsList).slice(0, 8);

  const combined = [
    ...pickedScience,
    ...pickedAnimals,
    ...pickedMath,
    ...pickedArabic,
    ...pickedCulture,
    ...pickedSports,
  ];

  // If for some reason less than 50, fill from any remaining
  if (combined.length < 50) {
    const remaining = shuffleArray([
      ...scienceList,
      ...animalsList,
      ...mathList,
      ...arabicList,
      ...cultureList,
      ...sportsList,
    ]);
    for (const q of remaining) {
      if (combined.length >= 50) break;
      if (!combined.find((c) => c.question === q.question)) {
        combined.push(q);
      }
    }
  }

  // Shuffle the final 50 questions order and shuffle each question's options
  const finalShuffled = shuffleArray(combined.slice(0, 50)).map((item, index) => {
    return {
      ...item,
      id: index + 1,
      options: shuffleArray(item.options),
    };
  });

  return finalShuffled;
}
