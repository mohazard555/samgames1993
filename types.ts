// Fix: Import ReactNode to resolve the "Cannot find namespace 'React'" error.
import type { ReactNode } from 'react';

export interface Game {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: ReactNode;
  color: string;
}

export interface Settings {
  siteName: string;
  logoUrl: string;
  youtubeUrls: string;
  backgroundMusicUrl: string;
}
