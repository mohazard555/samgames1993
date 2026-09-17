import { ENGLISH_LEARNING_BANK, ENGLISH_LEARNING_TITLES } from '../games/banks/englishLearningBank';
import { SHAPES_COLORS_BANK, SHAPES_COLORS_TITLES } from '../games/banks/shapesColorsBank';
import { WORD_IMAGE_BANK, WORD_IMAGE_TITLES } from '../games/banks/wordImageBank';

export function runContentValidation() {
  console.log('=== VALIDATION REPORT FOR CHILD LEARNING APP ===');

  // 1. English
  let engGames = ENGLISH_LEARNING_TITLES.length;
  let engQuestionsCount = 0;
  let engDuplicates = 0;
  let engMissingImages = 0;
  let engInvalidAnswers = 0;

  ENGLISH_LEARNING_TITLES.forEach(title => {
    const qs = ENGLISH_LEARNING_BANK[title] || [];
    if (qs.length !== 50) {
      console.warn(`[Warning] English game "${title}" has ${qs.length} questions (expected 50)`);
    }
    engQuestionsCount += qs.length;
    const ids = new Set<number>();
    qs.forEach(q => {
      if (ids.has(q.id)) engDuplicates++;
      ids.add(q.id);
      if (!q.image) engMissingImages++;
      if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) engInvalidAnswers++;
      if (q.options.some(opt => opt.includes('Option Alpha') || opt.includes('Correct English Term'))) {
        engInvalidAnswers++;
      }
    });
  });

  console.log('English:');
  console.log(`${engGames} games`);
  console.log(`${engQuestionsCount} questions`);
  console.log(`${engDuplicates} duplicates`);
  console.log(`${engMissingImages} missing images`);
  console.log(`${engInvalidAnswers} invalid answers`);
  console.log('');

  // 2. Shapes & Colors
  let shapesGames = SHAPES_COLORS_TITLES.length;
  let shapesQuestionsCount = 0;
  let shapesDuplicates = 0;
  let shapesMissingImages = 0;
  let shapesInvalidAnswers = 0;

  SHAPES_COLORS_TITLES.forEach(title => {
    const qs = SHAPES_COLORS_BANK[title] || [];
    if (qs.length !== 50) {
      console.warn(`[Warning] Shapes game "${title}" has ${qs.length} questions (expected 50)`);
    }
    shapesQuestionsCount += qs.length;
    const ids = new Set<number>();
    qs.forEach(q => {
      if (ids.has(q.id)) shapesDuplicates++;
      ids.add(q.id);
      if (!q.image) shapesMissingImages++;
      if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) shapesInvalidAnswers++;
    });
  });

  console.log('Shapes & Colors:');
  console.log(`${shapesGames} games`);
  console.log(`${shapesQuestionsCount} questions`);
  console.log(`${shapesDuplicates} duplicates`);
  console.log(`${shapesMissingImages} missing images`);
  console.log(`${shapesInvalidAnswers} invalid answers`);
  console.log('');

  // 3. Word & Image
  let wordGames = WORD_IMAGE_TITLES.length;
  let wordQuestionsCount = 0;
  let wordDuplicates = 0;
  let wordMissingImages = 0;
  let wordInvalidAnswers = 0;

  WORD_IMAGE_TITLES.forEach(title => {
    const qs = WORD_IMAGE_BANK[title] || [];
    if (qs.length !== 50) {
      console.warn(`[Warning] Word & Image game "${title}" has ${qs.length} questions (expected 50)`);
    }
    wordQuestionsCount += qs.length;
    const ids = new Set<number>();
    qs.forEach(q => {
      if (ids.has(q.id)) wordDuplicates++;
      ids.add(q.id);
      if (!q.image) wordMissingImages++;
      if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) wordInvalidAnswers++;
    });
  });

  console.log('Word & Image:');
  console.log(`${wordGames} games`);
  console.log(`${wordQuestionsCount} questions`);
  console.log(`${wordDuplicates} duplicates`);
  console.log(`${wordMissingImages} missing images`);
  console.log(`${wordInvalidAnswers} invalid answers`);
  console.log('=================================================');

  return {
    english: { games: engGames, questions: engQuestionsCount, duplicates: engDuplicates, missingImages: engMissingImages, invalidAnswers: engInvalidAnswers },
    shapes: { games: shapesGames, questions: shapesQuestionsCount, duplicates: shapesDuplicates, missingImages: shapesMissingImages, invalidAnswers: shapesInvalidAnswers },
    wordImage: { games: wordGames, questions: wordQuestionsCount, duplicates: wordDuplicates, missingImages: wordMissingImages, invalidAnswers: wordInvalidAnswers }
  };
}
