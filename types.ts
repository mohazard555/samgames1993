import type { ReactNode } from 'react';

export interface Game {
  id: number;
  name: string;
  description: string;
  category: string;
  icon?: ReactNode;
  iconName?: string;
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

export interface GoogleAdSettings {
  enabled: boolean;
  adClient: string; // e.g. "ca-pub-xxxxxxxxxxxxxx"
  adSlot: string;   // e.g. "1234567890"
  customHtml: string; // Optional custom script / banner html
  showTopBanner: boolean;
  showBottomBanner: boolean;
  showGameBanner: boolean;
}

export interface Settings {
  siteName: string;
  logoUrl: string;
  subscriptionUrl: string;
  youtubeUrls: string;
  backgroundMusicUrl: string;
  contactEmail: string;
  feedbackEmail: string;
  videoWaitTime: number; // Waiting duration in seconds for video watch countdown
  videoRequiredGameIds: number[]; // IDs of games that require watching a video
  adSettings: AdSettings;
  googleAdSettings: GoogleAdSettings;
}
