export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type GameCategory =
  | 'visual' // تمييز بصري وأشكال
  | 'logic' // تفكير ومنطق
  | 'math' // عد وحساب
  | 'language' // حروف وكلمات
  | 'science' // علوم وطبيعة وبيئة
  | 'social'; // حياة يومية ومهن وعادات

export interface ChildSkillChallenge {
  id: string;
  stageNumber?: number; // 1 to 50
  difficulty?: DifficultyLevel;
  instruction: string;
  questionPrompt?: string;
  targetVisual?: string;
  targetLabel?: string;
  type:
    | 'choice' // اختر من خيارات متعددة
    | 'memory' // بطاقات مقلوبة متطابقة
    | 'coloring' // اختر اللون المطلوب
    | 'find_multi' // اضغط على جميع العناصر المطلوبة
    | 'count' // كم عنصر موجود
    | 'add_sub' // جمع أو طرح
    | 'ordering' // ترتيب عناصر بتسلسل صحيح
    | 'size_compare' // مقارنة كبير وصغير
    | 'quantity_compare' // مقارنة أكثر وأقل
    | 'drag_place' // ضع الشيء في مكانه
    | 'find_hidden' // ابحث عن الشيء في اللوحة
    | 'sequence' // ماذا يأتي بعد ذلك
    | 'speed_tap' // اضغط على النجوم بسرعة
    | 'adventure'; // مغامرة المراحل
  data: any;
}

export interface ChildSkillGame {
  id: number;
  icon: string;
  title: string;
  shortDesc: string;
  skill: string;
  category: GameCategory;
  color: string;
  minUnlockGames: number; // 0 for initial 10 games
  challenges: Record<DifficultyLevel, ChildSkillChallenge[]>;
  stages?: ChildSkillChallenge[]; // All 50 stages sequentially
}

export interface GameProgress {
  gameId: number;
  completed: boolean;
  stars: number;
  completedDifficulties: DifficultyLevel[];
  completedStages?: number[]; // List of completed stage numbers (1 to 50)
  highestStageReached?: number; // Highest stage unlocked/reached (1 to 50)
  lastPlayed?: number;
}

export interface ChildSkillsStats {
  totalStars: number;
  completedGamesCount: number;
  badges: string[];
  streak: number;
  gamesProgress: Record<number, GameProgress>;
}

export interface SkillBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  requirement: string;
  isUnlocked: boolean;
}
