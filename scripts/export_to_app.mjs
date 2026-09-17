import fs from 'fs';
import { getGames1to10 } from './gen_games_1_to_10.mjs';
import { getGames11to20 } from './gen_games_11_to_20.mjs';
import { getGames21to30 } from './gen_games_21_to_30.mjs';
import { getGames31to40 } from './gen_games_31_to_40.mjs';

function writePart(filePath, gamesMap, partNum) {
  const content = `import { QuizQuestion } from '../newGamesData';

export const englishPart${partNum}: Record<string, QuizQuestion[]> = ${JSON.stringify(gamesMap, null, 2)};
`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Wrote ${filePath} successfully.`);
}

writePart('./games/banks/englishBankPart1.ts', getGames1to10(), 1);
writePart('./games/banks/englishBankPart2.ts', getGames11to20(), 2);
writePart('./games/banks/englishBankPart3.ts', getGames21to30(), 3);
writePart('./games/banks/englishBankPart4.ts', getGames31to40(), 4);

console.log('All 4 parts written.');
