import { ItemVisual } from '../components/QuizVisualCard';

export interface QuizOption {
  id: string;
  visual: ItemVisual;
  label: string;
  isCorrect: boolean;
}

export interface VisualQuizItem {
  id: number;
  category: string;
  categoryName: string;
  question: string;
  mainVisual: ItemVisual;
  options: QuizOption[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  emoji: string;
  description: string;
  color: string;
  count: number;
}

export const VISUAL_QUIZ_CATEGORIES: CategoryInfo[] = [
  { id: 'animals', name: 'الحيوانات', icon: '🐶', emoji: '🐶', description: 'مطابقة الحيوانات الأليفة والبرية الملونة', color: 'from-amber-500 to-orange-500', count: 25 },
  { id: 'fruits-vegetables', name: 'الفواكه والخضروات', icon: '🍎', emoji: '🍎', description: 'مطابقة الفواكه الطازجة والخضروات المفيدة', color: 'from-red-500 to-rose-600', count: 25 },
  { id: 'colors-shapes', name: 'الألوان والأشكال', icon: '🔴', emoji: '🔴', description: 'مطابقة الأشكال الهندسية والألوان الزاهية', color: 'from-pink-500 to-purple-600', count: 25 },
  { id: 'transportation', name: 'المواصلات', icon: '🚗', emoji: '🚗', description: 'مطابقة وسائل النقل والسيارات والقطارات', color: 'from-sky-500 to-blue-600', count: 25 },
  { id: 'daily-life', name: 'الأشياء اليومية', icon: '🏠', emoji: '🏠', description: 'مطابقة الأدوات والألعاب والأشياء اليومية', color: 'from-emerald-500 to-teal-600', count: 25 },
  { id: 'body-senses', name: 'جسم الإنسان والحواس', icon: '👁️', emoji: '👁️', description: 'تعرف على أعضاء الجسم والحواس بطريقة ممتعة', color: 'from-indigo-500 to-violet-600', count: 25 },
  { id: 'nature-environment', name: 'الطبيعة والبيئة', icon: '🌳', emoji: '🌳', description: 'مطابقة عناصر الطبيعة والأشجار والطقس', color: 'from-green-500 to-emerald-600', count: 25 },
  { id: 'jobs-activities', name: 'المهن والأنشطة', icon: '👨‍⚕️', emoji: '👨‍⚕️', description: 'مطابقة المهن المختلفة والأنشطة الرياضية', color: 'from-amber-600 to-yellow-600', count: 25 },
];

interface RawItem {
  name: string;
  wrongName: string;
  emoji?: string;
  wrongEmoji?: string;
  shapeKind?: ItemVisual['shapeKind'];
  shapeColor?: string;
  wrongShapeKind?: ItemVisual['shapeKind'];
  wrongShapeColor?: string;
  bg?: string;
  wrongBg?: string;
}

const buildCategoryItems = (
  catId: string,
  catName: string,
  startId: number,
  defaultBg: string,
  defaultWrongBg: string,
  rawItems: RawItem[]
): VisualQuizItem[] => {
  return rawItems.map((item, index) => {
    const qId = startId + index;
    const isCorrectOnLeft = qId % 2 === 0;

    const correctVisual: ItemVisual = item.shapeKind
      ? {
          type: 'shape',
          primary: item.name,
          shapeKind: item.shapeKind,
          shapeColor: item.shapeColor || '#ef4444',
          bgGradient: item.bg || defaultBg,
          accentColor: item.shapeColor || '#ef4444',
          themeIcon: '🔴',
        }
      : {
          type: 'emoji',
          primary: item.emoji || '⭐',
          bgGradient: item.bg || defaultBg,
          accentColor: '#8b5cf6',
          themeIcon: '✨',
        };

    const wrongVisual: ItemVisual = item.wrongShapeKind
      ? {
          type: 'shape',
          primary: item.wrongName,
          shapeKind: item.wrongShapeKind,
          shapeColor: item.wrongShapeColor || '#3b82f6',
          bgGradient: item.wrongBg || defaultWrongBg,
          accentColor: item.wrongShapeColor || '#3b82f6',
          themeIcon: '🔷',
        }
      : {
          type: 'emoji',
          primary: item.wrongEmoji || '🎯',
          bgGradient: item.wrongBg || defaultWrongBg,
          accentColor: '#ec4899',
          themeIcon: '🌟',
        };

    const correctOption: QuizOption = {
      id: `opt_c_${qId}`,
      visual: correctVisual,
      label: item.name,
      isCorrect: true,
    };

    const wrongOption: QuizOption = {
      id: `opt_w_${qId}`,
      visual: wrongVisual,
      label: item.wrongName,
      isCorrect: false,
    };

    return {
      id: qId,
      category: catId,
      categoryName: catName,
      question: 'أي صورة تطابق الصورة الكبيرة؟',
      mainVisual: correctVisual,
      options: isCorrectOnLeft ? [correctOption, wrongOption] : [wrongOption, correctOption],
    };
  });
};

// 1. Animals (1 - 25)
const animalsData: RawItem[] = [
  { name: 'كلب لطيف', wrongName: 'قطة أليفة', emoji: '🐶', wrongEmoji: '🐱' },
  { name: 'قطة صغيرة', wrongName: 'أرنب يقفز', emoji: '🐱', wrongEmoji: '🐰' },
  { name: 'أسد شجاع', wrongName: 'نمر مخطط', emoji: '🦁', wrongEmoji: '🐯' },
  { name: 'فيل ضخم', wrongName: 'حصان سريع', emoji: '🐘', wrongEmoji: '🐴' },
  { name: 'سمكة ملونة', wrongName: 'طائر يغرد', emoji: '🐟', wrongEmoji: '🐦' },
  { name: 'فراشة زاهية', wrongName: 'نحلة نشيطة', emoji: '🦋', wrongEmoji: '🐝' },
  { name: 'بقرة المزرعة', wrongName: 'خروف صوفي', emoji: '🐮', wrongEmoji: '🐑' },
  { name: 'دجاجة نشيطة', wrongName: 'بطة سابحة', emoji: '🐔', wrongEmoji: '🦆' },
  { name: 'زرافة طويلة', wrongName: 'فيل كبير', emoji: '🦒', wrongEmoji: '🐘' },
  { name: 'قرد مرح', wrongName: 'دب بني', emoji: '🐵', wrongEmoji: '🐻' },
  { name: 'ذئب بري', wrongName: 'ثعلب ماكر', emoji: '🐺', wrongEmoji: '🦊' },
  { name: 'بطريق لطيف', wrongName: 'بومة حكيمة', emoji: '🐧', wrongEmoji: '🦉' },
  { name: 'حمار وحشي', wrongName: 'حصان عربي', emoji: '🦓', wrongEmoji: '🐴' },
  { name: 'قنفذ صغير', wrongName: 'سلحفاة هادئة', emoji: '🦔', wrongEmoji: '🐢' },
  { name: 'دولفين ذكي', wrongName: 'حوت أزرق', emoji: '🐬', wrongEmoji: '🐳' },
  { name: 'كنغر يقفز', wrongName: 'أرنب بري', emoji: '🦘', wrongEmoji: '🐰' },
  { name: 'سنجاب مرح', wrongName: 'فأر صغير', emoji: '🐿️', wrongEmoji: '🐭' },
  { name: 'ببغاء ملون', wrongName: 'صقر محلق', emoji: '🦜', wrongEmoji: '🦅' },
  { name: 'تمساح نهري', wrongName: 'سحلية خضراء', emoji: '🐊', wrongEmoji: '🦎' },
  { name: 'ثور قوي', wrongName: 'بقرة حلوب', emoji: '🐂', wrongEmoji: '🐮' },
  { name: 'باندا لطيف', wrongName: 'دب قطبي', emoji: '🐼', wrongEmoji: '🐻‍❄️' },
  { name: 'هامستر صغير', wrongName: 'أرنب قطني', emoji: '🐹', wrongEmoji: '🐰' },
  { name: 'بجعة بيضاء', wrongName: 'بطة صفراء', emoji: '🦢', wrongEmoji: '🦆' },
  { name: 'طاووس فخور', wrongName: 'ديك رومي', emoji: '🦚', wrongEmoji: '🦃' },
  { name: 'سرطان البحر', wrongName: 'أخطبوط ذكي', emoji: '🦀', wrongEmoji: '🐙' },
];

// 2. Fruits & Vegetables (26 - 50)
const fruitsVegData: RawItem[] = [
  { name: 'تفاحة حمراء', wrongName: 'موزة صفراء', emoji: '🍎', wrongEmoji: '🍌' },
  { name: 'موزة ناضجة', wrongName: 'برتقالة طازجة', emoji: '🍌', wrongEmoji: '🍊' },
  { name: 'برتقالة منعشة', wrongName: 'تفاحة خضراء', emoji: '🍊', wrongEmoji: '🍏' },
  { name: 'فراولة حلوة', wrongName: 'بطيخ صيفي', emoji: '🍓', wrongEmoji: '🍉' },
  { name: 'شريحة بطيخ', wrongName: 'عنقود عنب', emoji: '🍉', wrongEmoji: '🍇' },
  { name: 'عنب بنفسجي', wrongName: 'ليمون حامض', emoji: '🍇', wrongEmoji: '🍋' },
  { name: 'جزر مقرمش', wrongName: 'خيار طازج', emoji: '🥕', wrongEmoji: '🥒' },
  { name: 'خيار أخضر', wrongName: 'طماطم حمراء', emoji: '🥒', wrongEmoji: '🍅' },
  { name: 'طماطم ناضجة', wrongName: 'حبة بطاطس', emoji: '🍅', wrongEmoji: '🥔' },
  { name: 'بطاطس لذيذة', wrongName: 'باذنجان داكن', emoji: '🥔', wrongEmoji: '🍆' },
  { name: 'بروكلي أخضر', wrongName: 'خس مقرمش', emoji: '🥦', wrongEmoji: '🥬' },
  { name: 'رمان ياقوتي', wrongName: 'كرز أحمر', emoji: '🍎', wrongEmoji: '🍒' },
  { name: 'أناناس استوائي', wrongName: 'بطيخ كبير', emoji: '🍍', wrongEmoji: '🍉' },
  { name: 'مانجو لذيذ', wrongName: 'خوخ طري', emoji: '🥭', wrongEmoji: '🍑' },
  { name: 'كيوي منعش', wrongName: 'أفوكادو صحي', emoji: '🥝', wrongEmoji: '🥑' },
  { name: 'ثوم صحي', wrongName: 'بصل أحمر', emoji: '🧄', wrongEmoji: '🧅' },
  { name: 'فلفل رومي', wrongName: 'فلفل حار', emoji: '🫑', wrongEmoji: '🌶️' },
  { name: 'عرنوس ذرة', wrongName: 'سنبلة قمح', emoji: '🌽', wrongEmoji: '🌾' },
  { name: 'خس أخضر', wrongName: 'جزر برتقالي', emoji: '🥬', wrongEmoji: '🥕' },
  { name: 'كرز ثنائي', wrongName: 'عنب أسود', emoji: '🍒', wrongEmoji: '🍇' },
  { name: 'توت أزرق', wrongName: 'مشمش ذهبي', emoji: '🫐', wrongEmoji: '🍑' },
  { name: 'يقطين برتقالي', wrongName: 'بطاطا حلوة', emoji: '🎃', wrongEmoji: '🍠' },
  { name: 'فطر بري', wrongName: 'زهرة ربيعية', emoji: '🍄', wrongEmoji: '🌸' },
  { name: 'جوز الهند', wrongName: 'بندق مقرمش', emoji: '🥥', wrongEmoji: '🌰' },
  { name: 'ليمون أصفر', wrongName: 'برتقال عصيري', emoji: '🍋', wrongEmoji: '🍊' },
];

// 3. Colors & Shapes (51 - 75) - Pure rich SVG Shapes
const colorsShapesData: RawItem[] = [
  { name: 'دائرة حمراء', wrongName: 'مربع أزرق', shapeKind: 'circle', shapeColor: '#ef4444', wrongShapeKind: 'square', wrongShapeColor: '#2563eb', bg: 'from-red-100 via-rose-50 to-orange-100', wrongBg: 'from-blue-100 via-sky-50 to-indigo-100' },
  { name: 'مربع أزرق', wrongName: 'مثلث أصفر', shapeKind: 'square', shapeColor: '#2563eb', wrongShapeKind: 'triangle', wrongShapeColor: '#eab308', bg: 'from-blue-100 via-sky-50 to-indigo-100', wrongBg: 'from-yellow-100 via-amber-50 to-orange-100' },
  { name: 'مثلث أصفر', wrongName: 'مستطيل أخضر', shapeKind: 'triangle', shapeColor: '#eab308', wrongShapeKind: 'rectangle', wrongShapeColor: '#10b981', bg: 'from-yellow-100 via-amber-50 to-orange-100', wrongBg: 'from-emerald-100 via-green-50 to-teal-100' },
  { name: 'مستطيل أخضر', wrongName: 'نجمة ذهبية', shapeKind: 'rectangle', shapeColor: '#10b981', wrongShapeKind: 'star', wrongShapeColor: '#f59e0b', bg: 'from-emerald-100 via-green-50 to-teal-100', wrongBg: 'from-amber-100 via-yellow-50 to-orange-100' },
  { name: 'نجمة ذهبية', wrongName: 'قلب أحمر', shapeKind: 'star', shapeColor: '#f59e0b', wrongShapeKind: 'heart', wrongShapeColor: '#ef4444', bg: 'from-amber-100 via-yellow-50 to-orange-100', wrongBg: 'from-rose-100 via-pink-50 to-red-100' },
  { name: 'قلب أحمر', wrongName: 'دائرة زرقاء', shapeKind: 'heart', shapeColor: '#ef4444', wrongShapeKind: 'circle', wrongShapeColor: '#3b82f6', bg: 'from-rose-100 via-pink-50 to-red-100', wrongBg: 'from-blue-100 via-sky-50 to-cyan-100' },
  { name: 'شكل بيضاوي بنفسجي', wrongName: 'معين برتقالي', shapeKind: 'oval', shapeColor: '#8b5cf6', wrongShapeKind: 'diamond', wrongShapeColor: '#f97316', bg: 'from-purple-100 via-violet-50 to-pink-100', wrongBg: 'from-orange-100 via-amber-50 to-yellow-100' },
  { name: 'معين برتقالي', wrongName: 'مربع أخضر', shapeKind: 'diamond', shapeColor: '#f97316', wrongShapeKind: 'square', wrongShapeColor: '#10b981', bg: 'from-orange-100 via-amber-50 to-yellow-100', wrongBg: 'from-emerald-100 via-green-50 to-teal-100' },
  { name: 'دائرة حمراء لامعة', wrongName: 'دائرة زرقاء', shapeKind: 'circle', shapeColor: '#dc2626', wrongShapeKind: 'circle', wrongShapeColor: '#2563eb', bg: 'from-red-100 to-rose-200', wrongBg: 'from-blue-100 to-indigo-200' },
  { name: 'مربع أزرق ملكي', wrongName: 'مربع أخضر', shapeKind: 'square', shapeColor: '#1d4ed8', wrongShapeKind: 'square', wrongShapeColor: '#059669', bg: 'from-blue-100 to-sky-200', wrongBg: 'from-emerald-100 to-teal-200' },
  { name: 'دائرة صفراء مشعة', wrongName: 'دائرة برتقالية', shapeKind: 'circle', shapeColor: '#facc15', wrongShapeKind: 'circle', wrongShapeColor: '#ea580c', bg: 'from-yellow-100 to-amber-200', wrongBg: 'from-orange-100 to-red-200' },
  { name: 'مثلث أخضر زمردي', wrongName: 'مثلث بنفسجي', shapeKind: 'triangle', shapeColor: '#10b981', wrongShapeKind: 'triangle', wrongShapeColor: '#9333ea', bg: 'from-emerald-100 to-green-200', wrongBg: 'from-purple-100 to-fuchsia-200' },
  { name: 'مربع بنفسجي', wrongName: 'مربع وردي', shapeKind: 'square', shapeColor: '#7c3aed', wrongShapeKind: 'square', wrongShapeColor: '#db2777', bg: 'from-purple-100 to-violet-200', wrongBg: 'from-pink-100 to-rose-200' },
  { name: 'قلب وردي', wrongName: 'قلب بني', shapeKind: 'heart', shapeColor: '#ec4899', wrongShapeKind: 'heart', wrongShapeColor: '#78350f', bg: 'from-pink-100 to-rose-200', wrongBg: 'from-amber-100 to-stone-200' },
  { name: 'دائرة بنية', wrongName: 'دائرة رمادية', shapeKind: 'circle', shapeColor: '#78350f', wrongShapeKind: 'circle', wrongShapeColor: '#64748b', bg: 'from-amber-100 to-orange-200', wrongBg: 'from-slate-100 to-gray-200' },
  { name: 'مربع أسود أنيق', wrongName: 'مربع أبيض فضي', shapeKind: 'square', shapeColor: '#18181b', wrongShapeKind: 'square', wrongShapeColor: '#94a3b8', bg: 'from-zinc-100 to-slate-300', wrongBg: 'from-gray-100 to-slate-200' },
  { name: 'هلال ذهبي لامع', wrongName: 'دائرة كاملة', shapeKind: 'crescent', shapeColor: '#f59e0b', wrongShapeKind: 'circle', wrongShapeColor: '#64748b', bg: 'from-yellow-100 via-amber-50 to-slate-100', wrongBg: 'from-slate-100 to-gray-200' },
  { name: 'خماسي أضلاع سماوي', wrongName: 'سداسي أضلاع ذهبي', shapeKind: 'pentagon', shapeColor: '#06b6d4', wrongShapeKind: 'hexagon', wrongShapeColor: '#f59e0b', bg: 'from-cyan-100 to-sky-200', wrongBg: 'from-amber-100 to-yellow-200' },
  { name: 'دائرة برتقالية', wrongName: 'دائرة خضراء', shapeKind: 'circle', shapeColor: '#f97316', wrongShapeKind: 'circle', wrongShapeColor: '#22c55e', bg: 'from-orange-100 to-amber-200', wrongBg: 'from-green-100 to-emerald-200' },
  { name: 'مربع أحمر ناصع', wrongName: 'مربع أصفر', shapeKind: 'square', shapeColor: '#ef4444', wrongShapeKind: 'square', wrongShapeColor: '#eab308', bg: 'from-red-100 to-rose-200', wrongBg: 'from-yellow-100 to-amber-200' },
  { name: 'مثلث أزرق سماوي', wrongName: 'مثلث أحمر', shapeKind: 'triangle', shapeColor: '#0ea5e9', wrongShapeKind: 'triangle', wrongShapeColor: '#dc2626', bg: 'from-sky-100 to-blue-200', wrongBg: 'from-red-100 to-rose-200' },
  { name: 'نجمة صفراء براقة', wrongName: 'نجمة زرقاء', shapeKind: 'star', shapeColor: '#eab308', wrongShapeKind: 'star', wrongShapeColor: '#3b82f6', bg: 'from-amber-100 to-yellow-200', wrongBg: 'from-blue-100 to-indigo-200' },
  { name: 'قلب أحمر رائع', wrongName: 'قلب وردي', shapeKind: 'heart', shapeColor: '#e11d48', wrongShapeKind: 'heart', wrongShapeColor: '#f472b6', bg: 'from-rose-100 to-red-200', wrongBg: 'from-pink-100 to-rose-200' },
  { name: 'مستطيل كحلي', wrongName: 'مستطيل برتقالي', shapeKind: 'rectangle', shapeColor: '#1e3a8a', wrongShapeKind: 'rectangle', wrongShapeColor: '#ea580c', bg: 'from-blue-100 to-indigo-200', wrongBg: 'from-orange-100 to-amber-200' },
  { name: 'دائرة بنفسجية زاهية', wrongName: 'مربع وردي', shapeKind: 'circle', shapeColor: '#7c3aed', wrongShapeKind: 'square', wrongShapeColor: '#db2777', bg: 'from-purple-100 to-violet-200', wrongBg: 'from-pink-100 to-rose-200' },
];

// 4. Transportation (76 - 100)
const transportationData: RawItem[] = [
  { name: 'سيارة حمراء', wrongName: 'حافلة صفراء', emoji: '🚗', wrongEmoji: '🚌' },
  { name: 'حافلة مدرسية', wrongName: 'قطار سريع', emoji: '🚌', wrongEmoji: '🚆' },
  { name: 'قطار سريع', wrongName: 'طائرة ركاب', emoji: '🚆', wrongEmoji: '✈️' },
  { name: 'طائرة محلقة', wrongName: 'سفينة بحرية', emoji: '✈️', wrongEmoji: '🚢' },
  { name: 'سفينة كبيرة', wrongName: 'قارب شراعي', emoji: '🚢', wrongEmoji: '⛵' },
  { name: 'دراجة هوائية', wrongName: 'دراجة نارية', emoji: '🚲', wrongEmoji: '🏍️' },
  { name: 'دراجة نارية', wrongName: 'سيارة أجرة', emoji: '🏍️', wrongEmoji: '🚕' },
  { name: 'سيارة إسعاف', wrongName: 'سيارة شرطة', emoji: '🚑', wrongEmoji: '🚓' },
  { name: 'سيارة شرطة', wrongName: 'عربة مطافئ', emoji: '🚓', wrongEmoji: '🚒' },
  { name: 'شاحنة نقل', wrongName: 'جرار زراعي', emoji: '🚚', wrongEmoji: '🚜' },
  { name: 'طائرة مروحية', wrongName: 'طائرة ورقية', emoji: '🚁', wrongEmoji: '🪁' },
  { name: 'قارب شراعي', wrongName: 'زورق سريع', emoji: '⛵', wrongEmoji: '🚤' },
  { name: 'جرار زراعي', wrongName: 'سيارة سباق', emoji: '🚜', wrongEmoji: '🏎️' },
  { name: 'صاروخ فضاء', wrongName: 'قمر صناعي', emoji: '🚀', wrongEmoji: '🛰️' },
  { name: 'مترو الأنفاق', wrongName: 'ترامواي مدينة', emoji: '🚇', wrongEmoji: '🚊' },
  { name: 'منطاد هوائي', wrongName: 'طائرة شراعية', emoji: '🎈', wrongEmoji: '🪂' },
  { name: 'سكوتر كهربائي', wrongName: 'لوح تزلج', emoji: '🛴', wrongEmoji: '🛹' },
  { name: 'عربة إطفاء', wrongName: 'سيارة إسعاف', emoji: '🚒', wrongEmoji: '🚑' },
  { name: 'شاحنة قمامة', wrongName: 'شاحنة وقود', emoji: '🚛', wrongEmoji: '🚚' },
  { name: 'غواصة بحرية', wrongName: 'قارب تجديف', emoji: '🚢', wrongEmoji: '🛶' },
  { name: 'تلفريك جبلي', wrongName: 'قطار معلق', emoji: '🚡', wrongEmoji: '🚟' },
  { name: 'عربة أطفال', wrongName: 'كرسي متحرك', emoji: '🛒', wrongEmoji: '🦽' },
  { name: 'سيارة سباق فورمولا', wrongName: 'سيارة عائلية', emoji: '🏎️', wrongEmoji: '🚙' },
  { name: 'دراجة أطفال', wrongName: 'دراجة جبلية', emoji: '🚲', wrongEmoji: '🏍️' },
  { name: 'سفينة فضاء', wrongName: 'طائرة ركاب', emoji: '🚀', wrongEmoji: '✈️' },
];

// 5. Daily Life (101 - 125)
const dailyLifeData: RawItem[] = [
  { name: 'كرة ملونة', wrongName: 'دمية دب', emoji: '⚽', wrongEmoji: '🧸' },
  { name: 'دمية دب لطيف', wrongName: 'كتاب قصص', emoji: '🧸', wrongEmoji: '📚' },
  { name: 'كتاب قصص ممتع', wrongName: 'قلم تلوين', emoji: '📚', wrongEmoji: '🖍️' },
  { name: 'قلم رصاص', wrongName: 'مقص أطفال', emoji: '✏️', wrongEmoji: '✂️' },
  { name: 'كوب شاي دافئ', wrongName: 'صحن طعام', emoji: '☕', wrongEmoji: '🍽️' },
  { name: 'ملعقة طعام', wrongName: 'شوكة سفرة', emoji: '🥄', wrongEmoji: '🍴' },
  { name: 'حذاء رياضي', wrongName: 'قبعة شمسية', emoji: '👟', wrongEmoji: '🧢' },
  { name: 'فرشاة أسنان', wrongName: 'مشط شعر', emoji: '🪥', wrongEmoji: '🪮' },
  { name: 'ساعة يد أنيقة', wrongName: 'هاتف ذكي', emoji: '⌚', wrongEmoji: '📱' },
  { name: 'كرسي خشبي', wrongName: 'سرير نوم', emoji: '🪑', wrongEmoji: '🛏️' },
  { name: 'حقيبة مدرسية', wrongName: 'صندوق هدايا', emoji: '🎒', wrongEmoji: '🎁' },
  { name: 'مظلة مطر ملونة', wrongName: 'معطف شتوي', emoji: '☂️', wrongEmoji: '🧥' },
  { name: 'مصباح إضاءة', wrongName: 'شمعة مضيئة', emoji: '💡', wrongEmoji: '🕯️' },
  { name: 'مفتاح باب', wrongName: 'قفل حديدي', emoji: '🔑', wrongEmoji: '🔒' },
  { name: 'وسادة نوم ناعمة', wrongName: 'أريكة جلوس', emoji: '🛋️', wrongEmoji: '🛏️' },
  { name: 'مقص أطفال آمن', wrongName: 'مسطرة قياس', emoji: '✂️', wrongEmoji: '📏' },
  { name: 'مرآة زينة', wrongName: 'نظارة طبية', emoji: '🪞', wrongEmoji: '👓' },
  { name: 'سلة مهملات', wrongName: 'صندوق كرتوني', emoji: '🗑️', wrongEmoji: '📦' },
  { name: 'صابونة نظافة', wrongName: 'منشفة قطنية', emoji: '🧼', wrongEmoji: '🧖' },
  { name: 'علبة ألوان رسم', wrongName: 'دفتر ملاحظات', emoji: '🎨', wrongEmoji: '📒' },
  { name: 'مروحة هواء', wrongName: 'مدفأة دافئة', emoji: '🪭', wrongEmoji: '🔥' },
  { name: 'منبه صباحي', wrongName: 'ساعة رملية', emoji: '⏰', wrongEmoji: '⌛' },
  { name: 'محفظة نقود', wrongName: 'حقيبة يد', emoji: '👛', wrongEmoji: '👜' },
  { name: 'نظارة شمسية', wrongName: 'قبعة صيفية', emoji: '🕶️', wrongEmoji: '👒' },
  { name: 'سماعات رأس', wrongName: 'ميكروفون صوت', emoji: '🎧', wrongEmoji: '🎤' },
];

// 6. Body & Senses (126 - 150)
const bodySensesData: RawItem[] = [
  { name: 'عين بشرية (حاسة البصر)', wrongName: 'أذن (حاسة السمع)', emoji: '👁️', wrongEmoji: '👂' },
  { name: 'أذن سامعة (حاسة السمع)', wrongName: 'أنف (حاسة الشم)', emoji: '👂', wrongEmoji: '👃' },
  { name: 'أنف شامت (حاسة الشم)', wrongName: 'فم مبتسم', emoji: '👃', wrongEmoji: '👄' },
  { name: 'فم وشفاه', wrongName: 'لسان (حاسة التذوق)', emoji: '👄', wrongEmoji: '👅' },
  { name: 'كف يد (حاسة اللمس)', wrongName: 'قدم بشرية', emoji: '✋', wrongEmoji: '🦶' },
  { name: 'قدم بشرية للمشي', wrongName: 'ساق تجري', emoji: '🦶', wrongEmoji: '🦵' },
  { name: 'أسنان بيضاء ناصعة', wrongName: 'لسان أحمر', emoji: '🦷', wrongEmoji: '👅' },
  { name: 'شعر الرأس', wrongName: 'عينان تريان', emoji: '💇', wrongEmoji: '👀' },
  { name: 'إصبع اليد للإشارة', wrongName: 'قبضة يد قوية', emoji: '☝️', wrongEmoji: '✊' },
  { name: 'وجه مبتسم سعيد', wrongName: 'وجه متفاجئ', emoji: '😊', wrongEmoji: '😲' },
  { name: 'قلب ينبض بالحياة', wrongName: 'دماغ مفكر وذكي', emoji: '❤️', wrongEmoji: '🧠' },
  { name: 'عظمة قوية وصحية', wrongName: 'عضلات الذراع', emoji: '🦴', wrongEmoji: '💪' },
  { name: 'ذراع وعضلات قوية', wrongName: 'ساق رياضية', emoji: '💪', wrongEmoji: '🦵' },
  { name: 'عينان تراقبان', wrongName: 'نظارة مكبرة', emoji: '👀', wrongEmoji: '🔍' },
  { name: 'صوت مسموع وكلام', wrongName: 'نغمة موسيقية', emoji: '🗣️', wrongEmoji: '🎵' },
  { name: 'حاسة اللمس بالكف', wrongName: 'عين تنظر', emoji: '🖐️', wrongEmoji: '👁️' },
  { name: 'ركبة الساق', wrongName: 'مرفق الذراع', emoji: '🦵', wrongEmoji: '💪' },
  { name: 'عقل يفكر بذكاء', wrongName: 'قلب محب', emoji: '🧠', wrongEmoji: '❤️' },
  { name: 'ابتسامة مشرقة', wrongName: 'ضحكة مرحة', emoji: '😁', wrongEmoji: '😂' },
  { name: 'خطوات مشي بالقدمين', wrongName: 'تصفيق باليدين', emoji: '🚶', wrongEmoji: '👏' },
  { name: 'إشارة نصر باليد', wrongName: 'إبهام ممتاز', emoji: '✌️', wrongEmoji: '👍' },
  { name: 'مصافحة محبة', wrongName: 'تلويح وداع', emoji: '🤝', wrongEmoji: '👋' },
  { name: 'تذوق باللسان', wrongName: 'شم بالأنف', emoji: '👅', wrongEmoji: '👃' },
  { name: 'سماع أصوات بالسماعة', wrongName: 'مكبر صوت', emoji: '🎧', wrongEmoji: '📢' },
  { name: 'نوم عميق وراحة', wrongName: 'استيقاظ نشيط', emoji: '😴', wrongEmoji: '🥳' },
];

// 7. Nature & Environment (151 - 175)
const natureEnvData: RawItem[] = [
  { name: 'شجرة خضراء مورقة', wrongName: 'زهرة ربيعية', emoji: '🌳', wrongEmoji: '🌸' },
  { name: 'زهرة متفتحة جميلة', wrongName: 'شمس مشرقة', emoji: '🌸', wrongEmoji: '☀️' },
  { name: 'شمس مشرقة ودافئة', wrongName: 'قمر منير في الليل', emoji: '☀️', wrongEmoji: '🌙' },
  { name: 'قمر ونجوم لامعة', wrongName: 'سحابة ممطرة', emoji: '🌙', wrongEmoji: '🌧️' },
  { name: 'سحابة بيضاء في السماء', wrongName: 'قطرة ماء نقية', emoji: '☁️', wrongEmoji: '💧' },
  { name: 'قطرة مطر عذبة', wrongName: 'ندفة ثلج باردة', emoji: '💧', wrongEmoji: '❄️' },
  { name: 'قوس قزح ملون', wrongName: 'شمس ذهبية', emoji: '🌈', wrongEmoji: '☀️' },
  { name: 'جبل عالي وصخري', wrongName: 'بحر أزرق واسع', emoji: '⛰️', wrongEmoji: '🌊' },
  { name: 'بحر وأمواج هادرة', wrongName: 'رمال صحراوية', emoji: '🌊', wrongEmoji: '🏜️' },
  { name: 'نهر جاري عذب', wrongName: 'بركان مشتعل', emoji: '🏞️', wrongEmoji: '🌋' },
  { name: 'ورقة شجر خضراء', wrongName: 'وردة حمراء', emoji: '🍃', wrongEmoji: '🌹' },
  { name: 'صبار صحراوي قوي', wrongName: 'نخلة باسقة', emoji: '🌵', wrongEmoji: '🌴' },
  { name: 'نخلة تمر باسقة', wrongName: 'شجرة صنوبر', emoji: '🌴', wrongEmoji: '🌲' },
  { name: 'صخرة جبلية صلبة', wrongName: 'رمال الشاطئ', emoji: '🪨', wrongEmoji: '🏖️' },
  { name: 'شلال مياه متدفق', wrongName: 'نافورة حديقة', emoji: '🌊', wrongEmoji: '⛲' },
  { name: 'برق ورعد عاصف', wrongName: 'رياح هوائية', emoji: '⚡', wrongEmoji: '💨' },
  { name: 'غابة أشجار كثيفة', wrongName: 'حديقة زهور', emoji: '🌲', wrongEmoji: '🌷' },
  { name: 'نار دافئة مشتعلة', wrongName: 'قطرة ماء باردة', emoji: '🔥', wrongEmoji: '💧' },
  { name: 'عش طيور دافئ', wrongName: 'خلية نحل عسل', emoji: '🪺', wrongEmoji: '🍯' },
  { name: 'نجم البحر على الشاطئ', wrongName: 'صدفة بحرية', emoji: '⭐', wrongEmoji: '🐚' },
  { name: 'زهرة عباد الشمس', wrongName: 'وردة جورية', emoji: '🌻', wrongEmoji: '🌹' },
  { name: 'رجل ثلج شتوي', wrongName: 'شمس صيفية حارة', emoji: '⛄', wrongEmoji: '☀️' },
  { name: 'نبتة صغيرة تنمو', wrongName: 'شجرة عملاقة', emoji: '🌱', wrongEmoji: '🌳' },
  { name: 'غروب الشمس الساحر', wrongName: 'سماء مرصعة بالنجوم', emoji: '🌅', wrongEmoji: '🌌' },
  { name: 'شروق الصباح المشرق', wrongName: 'سماء ملبدة بالغيوم', emoji: '🌄', wrongEmoji: '⛅' },
];

// 8. Jobs & Activities (176 - 200)
const jobsActivitiesData: RawItem[] = [
  { name: 'طبيب يعالج المرضى', wrongName: 'معلم يشرح الدرس', emoji: '👨‍⚕️', wrongEmoji: '👨‍🏫' },
  { name: 'معلمة تدرس الأطفال', wrongName: 'شرطي مرور نشيط', emoji: '👩‍🏫', wrongEmoji: '👮‍♂️' },
  { name: 'شرطي مرور ينظم السير', wrongName: 'رجل إطفاء شجاع', emoji: '👮‍♂️', wrongEmoji: '👨‍🚒' },
  { name: 'رجل إطفاء يخمد النيران', wrongName: 'طباخ ماهر يعد الوجبات', emoji: '👨‍🚒', wrongEmoji: '👨‍🍳' },
  { name: 'طباخ شيف يعد الطعام', wrongName: 'مزارع في الحقل', emoji: '👨‍🍳', wrongEmoji: '👨‍🌾' },
  { name: 'مزارع يحصد المحاصيل', wrongName: 'مهندس بناء وتشييد', emoji: '👨‍🌾', wrongEmoji: '👷‍♂️' },
  { name: 'لاعب كرة قدم ماهر', wrongName: 'لاعب كرة سلة محترف', emoji: '⚽', wrongEmoji: '🏀' },
  { name: 'رسام فنان بريشته', wrongName: 'عازف موسيقى', emoji: '🎨', wrongEmoji: '🎵' },
  { name: 'طبيب أسنان يحمي الابتسامة', wrongName: 'صيدلي يقدم الدواء', emoji: '🦷', wrongEmoji: '💊' },
  { name: 'سائق قطار سريع', wrongName: 'طيار يقود الطائرة', emoji: '🚆', wrongEmoji: '👨‍✈️' },
  { name: 'مهندس بناء معماري', wrongName: 'نجار ماهر', emoji: '📐', wrongEmoji: '🪚' },
  { name: 'رائد فضاء يكتشف النجوم', wrongName: 'عالم فلك بمنظاره', emoji: '👨‍🚀', wrongEmoji: '🔭' },
  { name: 'صياد سمك صبور', wrongName: 'سباح ماهر في البحر', emoji: '🎣', wrongEmoji: '🏊‍♂️' },
  { name: 'طالب علم مجتهد', wrongName: 'كاتب ومؤلف قصص', emoji: '🧑‍🎓', wrongEmoji: '✍️' },
  { name: 'مغني مسرحي موهوب', wrongName: 'ممثل مسرحي مبدع', emoji: '🎤', wrongEmoji: '🎭' },
  { name: 'مصور فوتوغرافي بكاميرته', wrongName: 'صحفي يكتب الأخبار', emoji: '📷', wrongEmoji: '📰' },
  { name: 'حارس مرمى شجاع', wrongName: 'لاعب كرة مضرب', emoji: '🧤', wrongEmoji: '🎾' },
  { name: 'خباز يعد الخبز الشهي', wrongName: 'بائع خضار وفاكهة', emoji: '🥖', wrongEmoji: '🍎' },
  { name: 'خياط ملابس أنيقة', wrongName: 'حلاق أطفال ماهر', emoji: '🧵', wrongEmoji: '✂️' },
  { name: 'متسابق دراجات هوائية', wrongName: 'متزلج على لوح التزلج', emoji: '🚴‍♂️', wrongEmoji: '🛹' },
  { name: 'غواص يكتشف أعماق البحر', wrongName: 'قبطان سفينة بحرية', emoji: '🤿', wrongEmoji: '⛵' },
  { name: 'بطل رفع أثقال قوي', wrongName: 'لاعب جمباز مرن', emoji: '🏋️‍♂️', wrongEmoji: '🤸‍♂️' },
  { name: 'قاضي عادل في المحكمة', wrongName: 'محامي يدافع بالحق', emoji: '⚖️', wrongEmoji: '💼' },
  { name: 'ميكانيكي يصلح السيارات', wrongName: 'كهربائي يصلح الإضاءة', emoji: '🔧', wrongEmoji: '💡' },
  { name: 'طيار يقود الهليكوبتر', wrongName: 'رائد فضاء يقود الصاروخ', emoji: '🚁', wrongEmoji: '🚀' },
];

export const ALL_VISUAL_QUIZ_ITEMS: VisualQuizItem[] = [
  ...buildCategoryItems('animals', 'الحيوانات', 1, 'from-amber-100 via-orange-50 to-amber-200', 'from-orange-100 via-amber-50 to-yellow-100', animalsData),
  ...buildCategoryItems('fruits-vegetables', 'الفواكه والخضروات', 26, 'from-rose-100 via-red-50 to-pink-200', 'from-amber-100 via-yellow-50 to-orange-100', fruitsVegData),
  ...buildCategoryItems('colors-shapes', 'الألوان والأشكال', 51, 'from-purple-100 via-pink-50 to-indigo-100', 'from-blue-100 via-sky-50 to-cyan-100', colorsShapesData),
  ...buildCategoryItems('transportation', 'المواصلات', 76, 'from-sky-100 via-blue-50 to-indigo-100', 'from-amber-100 via-orange-50 to-yellow-100', transportationData),
  ...buildCategoryItems('daily-life', 'الأشياء اليومية', 101, 'from-emerald-100 via-teal-50 to-green-200', 'from-purple-100 via-pink-50 to-rose-100', dailyLifeData),
  ...buildCategoryItems('body-senses', 'جسم الإنسان والحواس', 126, 'from-indigo-100 via-violet-50 to-purple-200', 'from-pink-100 via-rose-50 to-amber-100', bodySensesData),
  ...buildCategoryItems('nature-environment', 'الطبيعة والبيئة', 151, 'from-green-100 via-emerald-50 to-teal-200', 'from-sky-100 via-cyan-50 to-blue-100', natureEnvData),
  ...buildCategoryItems('jobs-activities', 'المهن والأنشطة', 176, 'from-amber-100 via-yellow-50 to-orange-200', 'from-blue-100 via-sky-50 to-indigo-100', jobsActivitiesData),
];
