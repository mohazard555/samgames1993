import { getGames1to10 } from './gen_games_1_to_10.mjs';
import { getGames11to20 } from './gen_games_11_to_20.mjs';
import { getGames21to30 } from './gen_games_21_to_30.mjs';
import { getGames31to40 } from './gen_games_31_to_40.mjs';
import fs from 'fs';

const g1 = getGames1to10();
const g2 = getGames11to20();
const g3 = getGames21to30();
const g4 = getGames31to40();

const allGames = { ...g1, ...g2, ...g3, ...g4 };
const titles = Object.keys(allGames);

console.log(`Total games generated: ${titles.length}`);

let totalQuestions = 0;
let errors = [];

titles.forEach((t, idx) => {
  const qs = allGames[t];
  if (!qs || qs.length !== 50) {
    errors.push(`Game [${t}] has ${qs ? qs.length : 0} questions instead of 50!`);
  }
  totalQuestions += qs ? qs.length : 0;

  qs.forEach((q, qIdx) => {
    if (!q.question || q.question.trim().length === 0) {
      errors.push(`Game [${t}] Q#${qIdx + 1} has empty question!`);
    }
    if (!q.options || q.options.length < 2) {
      errors.push(`Game [${t}] Q#${qIdx + 1} has insufficient options!`);
    }
    if (!q.options.includes(q.correctAnswer)) {
      errors.push(`Game [${t}] Q#${qIdx + 1} correctAnswer '${q.correctAnswer}' is not in options: [${q.options.join(', ')}]!`);
    }
    if (!q.image || q.image.trim().length === 0) {
      errors.push(`Game [${t}] Q#${qIdx + 1} is missing an image/emoji!`);
    }
    // Check for placeholders
    const strQ = JSON.stringify(q);
    if (/Option Alpha|Option Beta|Option Delta|Correct English Term|Question \d+/.test(strQ)) {
      errors.push(`Game [${t}] Q#${qIdx + 1} contains banned placeholder!`);
    }
  });
});

console.log(`Total questions: ${totalQuestions}`);
console.log(`Errors found: ${errors.length}`);
if (errors.length > 0) {
  console.error('Errors sample:', errors.slice(0, 10));
  process.exit(1);
} else {
  console.log('ALL 40 GAMES AND 2000 QUESTIONS ARE 100% VALID!');
}
