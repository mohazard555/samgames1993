export type IslandCategory =
  | 'logic_puzzles'     // ألغاز ومنطق
  | 'memory_observation' // ذاكرة وملاحظة
  | 'money_math'         // مال وأرقام
  | 'world_culture'      // عالم ومعالم
  | 'social_emotions'    // مشاعر وأصدقاء
  | 'creativity_builder' // إبداع وبناء
  | 'star_adventure';    // مغامرة ونجوم

export interface IslandZoneMeta {
  id: number;
  name: string;           // e.g. كهف الألغاز
  gameTitle: string;      // e.g. ألغاز الصورة
  icon: string;           // e.g. 🧩
  shortDesc: string;
  category: IslandCategory;
  categoryLabel: string;
  color: string;
  mapCoords: {
    x: number; // percentage 0 - 100 on the map
    y: number; // percentage 0 - 100 on the map
  };
  requiredStars: number;
  skill: string;
  badge: string;
}

export interface IslandOption {
  id: string;
  text: string;
  visual?: string;
  isCorrect: boolean;
  extra?: any;
}

export interface IslandQuestion {
  id: number;
  gameId: number;
  prompt: string;
  hint: string;
  type: string;
  visualType?: string;
  visualData?: any;
  options: IslandOption[];
  explanation: string;
}

export interface IslandPlayerProgress {
  starsByGame: Record<number, number>; // gameId -> stars earned (0 - 50)
  completedChallenges: Record<number, number>; // gameId -> highest challenge reached
  totalStars: number;
  unlockedZones: number[];
}
