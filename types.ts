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

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  rating: number; // 1 to 5
  category: string;
  message: string;
  status: 'قيد الاطلاع' | 'تمت المراجعة' | 'مكتمل';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'جديدة' | 'قيد الاطلاع' | 'تم الرد';
  createdAt: string;
}

export interface SkillTestResult {
  id: string;
  name: string;
  age: string;
  country: string;
  score: number;
  total: number;
  percentage: number;
  createdAt: string;
}

export interface Settings {
  siteName: string;
  logoUrl: string;
  subscriptionUrl: string;
  youtubeUrls: string;
  backgroundMusicUrl: string;
  backgroundMusicEnabled?: boolean;
  contactEmail: string;
  feedbackEmail: string;
  videoWaitTime: number; // Waiting duration in seconds for video watch countdown
  videoRequiredGameIds: number[]; // IDs of games that require watching a video
  adSettings: AdSettings;
  googleAdSettings: GoogleAdSettings;
  feedbacks?: FeedbackItem[];
  contactMessages?: ContactMessage[];
  skillTestResults?: SkillTestResult[];
}
