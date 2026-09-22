export type SmartChallengeCategory = 'general' | 'time';

export type ChallengeType = 
  | 'choice' 
  | 'ordering' 
  | 'drag_slot' 
  | 'time_analog' 
  | 'time_match' 
  | 'clock_hand' 
  | 'binary';

export interface SmartChallengeOption {
  id: string;
  text: string;
  visual?: string; // Vector / emoji / illustration indicator
  isCorrect: boolean;
}

export interface SmartChallengeQuestion {
  id: number; // 1 to 50
  prompt: string;
  hint: string;
  type: ChallengeType;
  visualType: string;
  visualData?: any;
  options: SmartChallengeOption[];
  explanation?: string;
}

export interface SmartChallengeGame {
  id: number; // 1 to 50
  title: string;
  icon: string;
  shortDesc: string;
  category: SmartChallengeCategory;
  color: string;
  skill: string;
  questions: SmartChallengeQuestion[];
}

export interface SmartGameProgress {
  completedQuestions: number[];
  stars: number;
  bestScore: number;
  isCompleted: boolean;
  lastPlayedAt?: string;
}

export interface SmartChallengesStats {
  totalStars: number;
  completedGamesCount: number;
  badges: string[];
  gamesProgress: Record<number, SmartGameProgress>;
}
