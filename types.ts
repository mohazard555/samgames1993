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

export interface AdSettings {
  enabled: boolean;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  iconUrl: string;
}

export interface Settings {
  siteName: string;
  logoUrl: string;
  subscriptionUrl: string;
  youtubeUrls: string;
  backgroundMusicUrl: string;
  contactEmail: string;
  feedbackEmail: string;
  adSettings: AdSettings;
}