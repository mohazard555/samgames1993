// Utility to map question content, keywords, and topics to rich, relevant visual icons/emojis

export interface QuestionVisual {
  type: 'emoji' | 'image';
  value: string;
  badgeBg: string;
  badgeBorder: string;
}

const TOPIC_KEYWORDS: { keywords: string[]; emoji: string; bg: string; border: string }[] = [
  // Space & Astronomy
  {
    keywords: ['شمس', 'الشمسي', 'حرارة', 'ضوء', 'أشعة'],
    emoji: '☀️',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
  },
  {
    keywords: ['قمر', 'بدر', 'هلال', 'خسوف'],
    emoji: '🌕',
    bg: 'bg-indigo-100',
    border: 'border-indigo-300',
  },
  {
    keywords: ['كوكب', 'كواكب', 'المشتري', 'زحل', 'المريخ', 'عطارد', 'الزهرة', 'نبتون', 'أورانوس', 'فلك'],
    emoji: '🪐',
    bg: 'bg-purple-100',
    border: 'border-purple-300',
  },
  {
    keywords: ['صاروخ', 'فضاء', 'مركبة فضائية', 'رائد فضاء', 'محطة الفضاء'],
    emoji: '🚀',
    bg: 'bg-sky-100',
    border: 'border-sky-300',
  },
  {
    keywords: ['نجم', 'نجوم', 'مجرة', 'درب التبانة', 'نيازك', 'شهب'],
    emoji: '✨',
    bg: 'bg-blue-100',
    border: 'border-blue-300',
  },
  {
    keywords: ['أرض', 'كوكب الأرض', 'قارات', 'محيطات', 'غلاف جوي'],
    emoji: '🌍',
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
  },

  // Animals & Nature
  {
    keywords: ['أسد', 'زئير', 'عرين', 'ملك الغابة'],
    emoji: '🦁',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
  },
  {
    keywords: ['نمر', 'فهد', 'صياد'],
    emoji: '🐯',
    bg: 'bg-orange-100',
    border: 'border-orange-300',
  },
  {
    keywords: ['فيل', 'خرطوم', 'عاج'],
    emoji: '🐘',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
  },
  {
    keywords: ['زرافة', 'طول الزرافة', 'رقبة'],
    emoji: '🦒',
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
  },
  {
    keywords: ['حوت', 'الحوت الأزرق', 'دلفين', 'قرش', 'أسماك', 'محيط', 'بحر', 'مرجان'],
    emoji: '🐋',
    bg: 'bg-cyan-100',
    border: 'border-cyan-300',
  },
  {
    keywords: ['صقر', 'نسر', 'عصفور', 'طائر', 'حمامة', 'طيران', 'أجنحة', 'ريش'],
    emoji: '🦅',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
  },
  {
    keywords: ['سلحفاة', 'زواحف', 'قشرة'],
    emoji: '🐢',
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
  },
  {
    keywords: ['حصان', 'فرس', 'مهر', 'سباق الخيل'],
    emoji: '🐎',
    bg: 'bg-stone-100',
    border: 'border-stone-300',
  },
  {
    keywords: ['جمل', 'سفينة الصحراء', 'سنام'],
    emoji: '🐪',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
  },
  {
    keywords: ['شجرة', 'غابة', 'نبات', 'أزهار', 'أوراق', 'سيكويا', 'جذور', 'تمثيل ضوئي'],
    emoji: '🌲',
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
  },
  {
    keywords: ['ديناصور', 'ديناصورات', 'منقرض', 'أحافير'],
    emoji: '🦖',
    bg: 'bg-lime-100',
    border: 'border-lime-300',
  },
  {
    keywords: ['نحلة', 'عسل', 'خلية نحل', 'فراشة', 'حشرات'],
    emoji: '🐝',
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
  },

  // Physics & Science
  {
    keywords: ['بركان', 'حمم', 'صخور بركانية', 'لافا'],
    emoji: '🌋',
    bg: 'bg-rose-100',
    border: 'border-rose-300',
  },
  {
    keywords: ['مغناطيس', 'جاذبية', 'شحنات', 'كهرباء', 'تيار'],
    emoji: '🧲',
    bg: 'bg-red-100',
    border: 'border-red-300',
  },
  {
    keywords: ['مجهر', 'خلية', 'بكتيريا', 'ميكروسكوب', 'مختبر'],
    emoji: '🔬',
    bg: 'bg-teal-100',
    border: 'border-teal-300',
  },
  {
    keywords: ['قلب', 'نبض', 'دورة دموية', 'دم'],
    emoji: '🫀',
    bg: 'bg-rose-100',
    border: 'border-rose-300',
  },
  {
    keywords: ['دماغ', 'مخ', 'تفكير', 'ذاكرة', 'أعصاب'],
    emoji: '🧠',
    bg: 'bg-pink-100',
    border: 'border-pink-300',
  },
  {
    keywords: ['عظام', 'هيكل عظمي', 'جمجمة'],
    emoji: '🦴',
    bg: 'bg-gray-100',
    border: 'border-gray-300',
  },
  {
    keywords: ['ماء', 'جليد', 'ثلج', 'تبريد', 'مطر', 'سحاب'],
    emoji: '💧',
    bg: 'bg-sky-100',
    border: 'border-sky-300',
  },
  {
    keywords: ['نار', 'فرن', 'حرارة', 'درجة مئوية', 'اشتعال'],
    emoji: '🔥',
    bg: 'bg-orange-100',
    border: 'border-orange-300',
  },

  // Math & Numbers & Shapes
  {
    keywords: ['مثلث', 'مربع', 'دائرة', 'مستطيل', 'أضلاع', 'زوايا', 'هندسة'],
    emoji: '📐',
    bg: 'bg-blue-100',
    border: 'border-blue-300',
  },
  {
    keywords: ['جمع', 'طرح', 'ضرب', 'قسمة', 'معادلة', 'حساب', 'أرقام', 'عدد'],
    emoji: '🔢',
    bg: 'bg-violet-100',
    border: 'border-violet-300',
  },
  {
    keywords: ['نقود', 'ريال', 'درهم', 'دينار', 'شراء', 'سعر', 'متجر'],
    emoji: '🪙',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
  },
  {
    keywords: ['ساعة', 'دقائق', 'وقت', 'زمن', 'صباح', 'مساء'],
    emoji: '⏰',
    bg: 'bg-sky-100',
    border: 'border-sky-300',
  },

  // Language & Arabic
  {
    keywords: ['حرف', 'كلمة', 'جملة', 'لغة عربية', 'قواعد', 'مبتدأ', 'فعل', 'اسم', 'حروف'],
    emoji: '📖',
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
  },
  {
    keywords: ['كتابة', 'قلم', 'شاعر', 'قصيدة', 'مؤلف'],
    emoji: '✍️',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
  },
  {
    keywords: ['مرادف', 'معنى', 'ضد', 'عكس'],
    emoji: '📚',
    bg: 'bg-teal-100',
    border: 'border-teal-300',
  },

  // Geography & Landmarks & Capitals
  {
    keywords: ['عاصمة', 'دولة', 'مملكة', 'جمهورية', 'خريطة', 'قارة'],
    emoji: '🗺️',
    bg: 'bg-sky-100',
    border: 'border-sky-300',
  },
  {
    keywords: ['هرم', 'أهرامات', 'معلم', 'تمثال', 'آثار', 'قلعة', 'سور'],
    emoji: '🏛️',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
  },
  {
    keywords: ['برج', 'إيفل', 'خليفة', 'بيزا', 'ناطحة سحاب'],
    emoji: '🗼',
    bg: 'bg-blue-100',
    border: 'border-blue-300',
  },
  {
    keywords: ['علم', 'أعلام', 'راية'],
    emoji: '🚩',
    bg: 'bg-rose-100',
    border: 'border-rose-300',
  },

  // Transport
  {
    keywords: ['طائرة', 'مطار', 'طيران', 'مدرج'],
    emoji: '✈️',
    bg: 'bg-sky-100',
    border: 'border-sky-300',
  },
  {
    keywords: ['قطار', 'سكة حديد', 'مترو'],
    emoji: '🚆',
    bg: 'bg-indigo-100',
    border: 'border-indigo-300',
  },
  {
    keywords: ['سفينة', 'باخرة', 'قارب', 'ميناء'],
    emoji: '🚢',
    bg: 'bg-cyan-100',
    border: 'border-cyan-300',
  },
  {
    keywords: ['سيارة', 'مركبة', 'شاحنة', 'طريق', 'إشارة مرور'],
    emoji: '🚗',
    bg: 'bg-red-100',
    border: 'border-red-300',
  },

  // Music & Sound
  {
    keywords: ['بيانو', 'موسيقى', 'نغم', 'لحن', 'عود', 'كمان', 'طبل', 'جيتار', 'مزمار'],
    emoji: '🎵',
    bg: 'bg-purple-100',
    border: 'border-purple-300',
  },

  // Sports & Games
  {
    keywords: ['كرة قدم', 'مرمى', 'ملعب', 'هدف', 'حارس'],
    emoji: '⚽',
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
  },
  {
    keywords: ['سباحة', 'مسبح', 'غطس'],
    emoji: '🏊',
    bg: 'bg-cyan-100',
    border: 'border-cyan-300',
  },
  {
    keywords: ['رياضة', 'سباق', 'تمرين', 'كأس', 'ميدالية', 'بطولة'],
    emoji: '🏆',
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
  },
];

const EMOJI_REGEX = /[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}]/gu;

/**
 * Derives a vivid, contextual visual representation for any question
 */
export function getQuestionVisual(
  questionText: string,
  badge?: string,
  providedImage?: string,
  correctAnswer?: string
): QuestionVisual {
  // 1. If an image URL is explicitly provided
  if (providedImage && (providedImage.startsWith('http') || providedImage.startsWith('data:'))) {
    return {
      type: 'image',
      value: providedImage,
      badgeBg: 'bg-sky-50',
      badgeBorder: 'border-sky-300',
    };
  }

  // 2. If provided image is already an emoji
  if (providedImage && EMOJI_REGEX.test(providedImage)) {
    return {
      type: 'emoji',
      value: providedImage,
      badgeBg: 'bg-sky-100',
      badgeBorder: 'border-sky-300',
    };
  }

  // 3. If question text itself contains an emoji
  const foundInQuestion = questionText.match(EMOJI_REGEX);
  if (foundInQuestion && foundInQuestion.length > 0) {
    return {
      type: 'emoji',
      value: foundInQuestion[0],
      badgeBg: 'bg-sky-100',
      badgeBorder: 'border-sky-300',
    };
  }

  // 4. Check keyword match against combined context
  const fullText = `${questionText} ${badge || ''} ${correctAnswer || ''}`.toLowerCase();
  for (const item of TOPIC_KEYWORDS) {
    for (const kw of item.keywords) {
      if (fullText.includes(kw.toLowerCase())) {
        return {
          type: 'emoji',
          value: item.emoji,
          badgeBg: item.bg,
          badgeBorder: item.border,
        };
      }
    }
  }

  // 5. Default fallback based on category/badge
  return {
    type: 'emoji',
    value: '💡',
    badgeBg: 'bg-amber-100',
    badgeBorder: 'border-amber-300',
  };
}

const OPTION_EMOJIS: { keywords: string[]; emoji: string }[] = [
  // Fruits & Veg
  { keywords: ['تفاح', 'تفاحة', 'apple', 'apples'], emoji: '🍎' },
  { keywords: ['موز', 'banana', 'bananas'], emoji: '🍌' },
  { keywords: ['برتقال', 'orange', 'oranges'], emoji: '🍊' },
  { keywords: ['عنب', 'grape', 'grapes'], emoji: '🍇' },
  { keywords: ['بطيخ', 'watermelon'], emoji: '🍉' },
  { keywords: ['فراولة', 'strawberry'], emoji: '🍓' },
  { keywords: ['ليمون', 'lemon'], emoji: '🍋' },
  { keywords: ['خوخ', 'peach'], emoji: '🍑' },
  { keywords: ['أناناس', 'pineapple'], emoji: '🍍' },
  { keywords: ['مانجو', 'mango'], emoji: '🥭' },
  { keywords: ['كرز', 'cherry'], emoji: '🍒' },
  { keywords: ['كمثرى', 'pear'], emoji: '🍐' },
  { keywords: ['كيوي', 'kiwi'], emoji: '🥝' },
  { keywords: ['جزر', 'carrot', 'carrots'], emoji: '🥕' },
  { keywords: ['طماطم', 'tomato', 'tomatoes'], emoji: '🍅' },
  { keywords: ['خيار', 'cucumber'], emoji: '🥒' },
  { keywords: ['بطاطس', 'potato', 'potatoes'], emoji: '🥔' },
  { keywords: ['بصل', 'onion', 'onions'], emoji: '🧅' },
  { keywords: ['ثوم', 'garlic'], emoji: '🧄' },
  { keywords: ['ذرة', 'corn'], emoji: '🌽' },
  { keywords: ['بروكلي', 'broccoli', 'قرنبيط'], emoji: '🥦' },
  { keywords: ['فلفل', 'pepper', 'peppers'], emoji: '🫑' },
  { keywords: ['باذنجان', 'eggplant'], emoji: '🍆' },
  { keywords: ['فطر', 'mushroom'], emoji: '🍄' },
  { keywords: ['خس', 'lettuce', 'سبانخ', 'spinach'], emoji: '🥬' },

  // Animals
  { keywords: ['أسد', 'lion', 'lions'], emoji: '🦁' },
  { keywords: ['نمر', 'tiger', 'tigers'], emoji: '🐯' },
  { keywords: ['فيل', 'elephant', 'elephants'], emoji: '🐘' },
  { keywords: ['زرافة', 'giraffe'], emoji: '🦒' },
  { keywords: ['قرد', 'monkey'], emoji: '🐵' },
  { keywords: ['حمار', 'donkey'], emoji: '🫏' },
  { keywords: ['بقرة', 'cow', 'cows'], emoji: '🐮' },
  { keywords: ['خروف', 'sheep', 'غنم'], emoji: '🐑' },
  { keywords: ['حصان', 'horse', 'horses'], emoji: '🐎' },
  { keywords: ['دجاجة', 'chicken', 'chickens', 'دجاج'], emoji: '🐔' },
  { keywords: ['بطة', 'duck', 'ducks'], emoji: '🦆' },
  { keywords: ['قطة', 'cat', 'cats', 'قط'], emoji: '🐱' },
  { keywords: ['كلب', 'dog', 'dogs'], emoji: '🐶' },
  { keywords: ['أرنب', 'rabbit', 'rabbits'], emoji: '🐰' },
  { keywords: ['سمكة', 'fish', 'حوت', 'whale', 'قرش', 'shark'], emoji: '🐟' },
  { keywords: ['عصفور', 'bird', 'birds', 'طائر'], emoji: '🐦' },

  // Colors
  { keywords: ['أحمر', 'red'], emoji: '🔴' },
  { keywords: ['أزرق', 'blue'], emoji: '🔵' },
  { keywords: ['أخضر', 'green'], emoji: '🟢' },
  { keywords: ['أصفر', 'yellow'], emoji: '🟡' },
  { keywords: ['برتقالي', 'orange'], emoji: '🟠' },
  { keywords: ['بنفسجي', 'purple'], emoji: '🟣' },
  { keywords: ['زهري', 'وردي', 'pink'], emoji: '🩷' },
  { keywords: ['أسود', 'black'], emoji: '⬛' },
  { keywords: ['أبيض', 'white'], emoji: '⬜' },
  { keywords: ['بني', 'brown'], emoji: '🟫' },
  { keywords: ['رمادي', 'gray'], emoji: '🔘' },

  // Shapes & Numbers
  { keywords: ['دائرة', 'circle'], emoji: '⭕' },
  { keywords: ['مربع', 'square'], emoji: '⬛' },
  { keywords: ['مستطيل', 'rectangle'], emoji: '🧊' },
  { keywords: ['مثلث', 'triangle'], emoji: '🔺' },
  { keywords: ['نجمة', 'star'], emoji: '⭐' },
  { keywords: ['قلب', 'heart'], emoji: '❤️' },
];

export function getOptionEmoji(optionText: string): string {
  if (!optionText) return '⭐';
  const hasEmoji = optionText.match(EMOJI_REGEX);
  if (hasEmoji && hasEmoji.length > 0) {
    return hasEmoji[0];
  }

  const lower = optionText.toLowerCase();
  for (const item of OPTION_EMOJIS) {
    for (const kw of item.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return item.emoji;
      }
    }
  }
  return '✨';
}
