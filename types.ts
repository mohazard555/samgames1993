import type { ReactNode } from 'react';

export interface Game {
  id: number;
  name: string;
  description: string;
  category: string;
  icon?: ReactNode;
  iconName?: string;
  color: string;
  customRoute?: string;
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
  clientIp?: string; // عنوان IP لجهاز المستخدم
  deviceInfo?: string; // نوع الجهاز والمتصفح
  gistUrl?: string; // رابط Gist المرتبط
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'جديدة' | 'قيد الاطلاع' | 'تم الرد';
  createdAt: string;
  clientIp?: string; // عنوان IP لجهاز المستخدم
  deviceInfo?: string; // نوع الجهاز والمتصفح
  gistUrl?: string; // رابط Gist المرتبط
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

export interface ShamCashSettings {
  enabled: boolean;
  accountName: string; // e.g. "mohannad anis ahmad"
  accountCode: string; // e.g. "c08a30e9e1f27a4b0d98b215562a0dbc"
  instructions: string;
  price?: number; // مخصص لشام كاش (إن وُجد) أو يستخدم السعر العام
  currency?: string; // e.g. "ليرة سورية" أو "دولار"
  currencySymbol?: string; // e.g. "ل.س" أو "$"
}

export interface PaypalSettings {
  enabled: boolean;
  email: string;
  instructions: string;
  price?: number;
  currency?: string;
  currencySymbol?: string;
}

export interface BinancePaySettings {
  enabled: boolean;
  payId: string;
  emailOrPhone: string;
  instructions: string;
  price?: number;
  currency?: string;
  currencySymbol?: string;
}

export interface UsdtSettings {
  enabled: boolean;
  walletAddress: string;
  instructions: string;
  price?: number;
  currency?: string;
  currencySymbol?: string;
}

export interface OtherPaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  accountInfo: string;
  instructions: string;
  price?: number;
  currency?: string;
  currencySymbol?: string;
}

export interface PaidSettings {
  enabled: boolean; // تفعيل نظام النسخة المدفوعة VIP
  price: number; // السعر الافتراضي العام e.g. 3
  currency: string; // العملة الافتراضية العامة e.g. "دولار" أو "USD"
  currencySymbol?: string; // رمز العملة e.g. "$" أو "ل.س"
  periodName: string; // e.g. "تفعيل دائم مدى الحياة"
  paidGameIds: number[]; // الألعاب التي تحتاج اشتراك مدفوع لتفتح
  questionGateEnabled?: boolean; // تفعيل شرط الاشتراك عند الوصول لسؤال معين في ألعاب الـ 50 سؤال
  questionGateNumber?: number; // رقم السؤال الذي يتطلب اشتراك لمتابعة اللعب (افتراضي: 15)
  vipTrialDurationSeconds?: number; // مدة التجربة المجانية لألعاب VIP بالثواني قبل طلب الاشتراك (افتراضي 60)
  vip50GamesGateIds?: number[]; // قائمة معرّفات ألعاب الـ 50 سؤال التي تتطلب اشتراك VIP عند مرحلة معينة
  vip50StageThreshold?: number; // رقم المرحلة الذي يتوقف عنده اللعب ويطلب اشتراك VIP (مثلاً المرحلة 10 أو 15)
  timer50GamesIds?: number[]; // قائمة معرّفات ألعاب الـ 50 سؤال التي لها مؤقت زمني
  timer50DurationSeconds?: number; // مدة المؤقت الزمني لكل سؤال/مرحلة بالثواني (افتراضي: 20 ثانية)
  customGame50Config?: Record<number, { vipGateEnabled?: boolean; vipStage?: number; timerEnabled?: boolean; timerSeconds?: number }>;
  shamCash: ShamCashSettings;
  paypal: PaypalSettings;
  binancePay: BinancePaySettings;
  usdtTrc20: UsdtSettings;
  usdtErc20: UsdtSettings;
  otherMethods?: OtherPaymentMethod[];
}

export interface SubscriptionOrder {
  id: string; // e.g. "ORD-93821"
  customerName: string;
  customerPhone: string;
  paymentMethod: 'sham_cash' | string;
  amount: number;
  currency: string;
  transactionId: string; // رقم عملية التحويل
  senderAccount?: string; // رقم حساب المحول (اختياري)
  notes?: string;
  status: 'معلق' | 'موافق عليه' | 'مرفوض';
  createdAt: string;
  activationCode: string; // Unique generated activation code (e.g. "VIP-SHAM-8942-7719")
  barcodeValue?: string;
  activatedAt?: string;
  clientIp?: string; // عنوان IP لجهاز المشتري
  deviceInfo?: string; // نوع الجهاز والمتصفح
  gistUrl?: string; // رابط Gist المرتبط
}

export interface Settings {
  siteName: string;
  logoUrl: string;
  subscriptionUrl: string;
  whatsappUrl?: string; // رابط أو رقم واتساب لاستقبال طلبات الشراء
  youtubeUrls: string;
  backgroundMusicUrl: string;
  backgroundMusicEnabled?: boolean;
  contactEmail: string;
  feedbackEmail: string;
  videoWaitTime: number; // Waiting duration in seconds for video watch countdown
  videoRequiredGameIds: number[]; // IDs of games that require watching a video
  requireSubscriptionAndVideos?: boolean; // When false: visitors can play all games directly without needing channel subscription or video watch
  paidSettings?: PaidSettings;
  purchaseOrders?: SubscriptionOrder[];
  approvedActivationCodes?: string[];
  freeActivationCode?: string; // كود التفعيل المجاني المعتمد الوحيد
  codeDeviceBindings?: Record<string, string>;
  codeCustomerBindings?: Record<string, string>;
  codeIpBindings?: Record<string, string>; // ربط كل كود بعنوان IP الهاتف/الجهاز لمنع التلاعب
  codeActivationDetails?: Record<string, { ip: string; deviceInfo?: string; activatedAt: string; customerName?: string; deviceFingerprint?: string }>;
  hiddenGameNames?: string[];
  newGameIds?: number[];
  adSettings: AdSettings;
  googleAdSettings: GoogleAdSettings;
  feedbacks?: FeedbackItem[];
  contactMessages?: ContactMessage[];
  skillTestResults?: SkillTestResult[];
}

