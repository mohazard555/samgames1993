export interface StoryScene {
  sceneNumber: number; // 1 to 10
  iconTag: string; // e.g. "🐰🌳"
  title: string; // brief scene title
  text: string; // the exact Arabic short narrative
  sceneKey: string; // unique identifier for the SVG illustration
  visualDescription: string;
}

export interface Story {
  id: string; // 'rabbit', 'bird', 'turtle', 'lion', 'bear'
  number: number; // 1 to 5
  title: string;
  characterIcon: string;
  moral: string;
  characterDesc: {
    name: string;
    clothing: string;
    features: string;
  };
  colorTheme: {
    primary: string;
    bgGradient: string;
    badgeBg: string;
    border: string;
  };
  scenes: StoryScene[];
}

export interface StoriesProgress {
  completedStoryIds: string[];
  lastReadScene: Record<string, number>;
  totalCompletedCount: number;
}
