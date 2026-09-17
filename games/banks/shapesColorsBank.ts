import { QuizQuestion } from '../newGamesData';

export const SHAPES_COLORS_TITLES = [
  'مطابقة الأشكال الهندسية الأساسية',
  'تدرجات الألوان الزاهية وقوس قزح',
  'أشكال الفواكه والخضار والألوان',
  'لغز المربعات والدوائر السحرية',
  'مطابقة ألوان الحيوانات والطيور',
  'أشكال وسائد النوم والأثاث الملون',
  'ألوان الأزهار والورود الطبيعية',
  'أشكال النجوم والأقمار المضيئة',
  'مطابقة ألوان السيارات والمركبات',
  'أشكال الحلوى والسكاكر الملونة',
  'تحدي مطابقة الأشكال المتشابهة',
  'ألوان الطيور المغردة البديعة',
  'أشكال الأسماك والمخلوقات البحرية',
  'ألوان الكرات الرياضية المختلفة',
  'أشكال أوراق الشجر والنباتات',
  'مطابقة ألوان الملابس والأزياء',
  'أشكال المضلعات والخطوط البديعة',
  'ألوان الطيور المائية والبط',
  'أشكال المباني والبيوت الكرتونية',
  'تحدي تفكيك وتركيب الأشكال',
  'ألوان الفراشات والجراد الملون',
  'أشكال الهدايا والبالونات المبهجة',
  'مطابقة ألوان الأكواب والأطباق',
  'أشكال الغيوم وقطرات المطر',
  'ألوان الحشرات والخصال الزاهية',
  'أشكال الأدوات المدرسية الملونة',
  'مطابقة الأشكال ثلاثية الأبعاد',
  'ألوان الألعاب والدمى المفضلة',
  'أشكال القلوب والنجوم اللامعة',
  'ألوان قشور الفواكه الطازجة',
  'أشكال الأبواب والنوافذ المزخرفة',
  'مطابقة الظلال والأشكال السوداء',
  'ألوان الفراش وأغطية السرير',
  'أشكال الحروف والأرقام الملونة',
  'تحدي المتاهات ذات الألوان الزاهية',
  'ألوان الطلاء واللوحات الفنية',
  'أشكال الفراشات المتداخلة',
  'مطابقة الألوان المتضادة والمكملة',
  'أشكال المكعبات والكتل الخشبية',
  'مهرجان الأشكال والألوان النهائي'
];

export const SHAPES_COLORS_BANK: Record<string, QuizQuestion[]> = {};

const shapeColorItems = [
  { icon: '🔷', name: 'معين أزرق', color: 'أزرق', shape: 'معين' },
  { icon: '🔴', name: 'دائرة حمراء', color: 'أحمر', shape: 'دائرة' },
  { icon: '⭐', name: 'نجمة صفراء', color: 'أصفر', shape: 'نجمة' },
  { icon: '🍎', name: 'تفاحة حمراء', color: 'أحمر', shape: 'دائري' },
  { icon: '🟩', name: 'مربع أخضر', color: 'أخضر', shape: 'مربع' },
  { icon: '🔵', name: 'دائرة زرقاء', color: 'أزرق', shape: 'دائرة' },
  { icon: '🟡', name: 'دائرة صفراء', color: 'أصفر', shape: 'دائرة' },
  { icon: '🟣', name: 'دائرة بنفسجية', color: 'بنفسجي', shape: 'دائرة' },
  { icon: '🟠', name: 'دائرة برتقالية', color: 'برتقالي', shape: 'دائرة' },
  { icon: '🔺', name: 'مثلث أحمر', color: 'أحمر', shape: 'مثلث' },
  { icon: '🍓', name: 'توت أحمر', color: 'أحمر', shape: 'محبب' },
  { icon: '🍌', name: 'موزة صفراء', color: 'أصفر', shape: 'منحني' },
  { icon: '🍉', name: 'بطيخة خضراء', color: 'أخضر', shape: 'بيضاوي' },
  { icon: '🍇', name: 'عنب أرجواني', color: 'أرجواني', shape: 'عناقيد' },
  { icon: '🍒', name: 'كرز أحمر', color: 'أحمر', shape: 'مزدوج' },
  { icon: '🍍', name: 'أناناس أصفر', color: 'أصفر', shape: 'بيضاوي' },
  { icon: '🥝', name: 'كيوي أخضر', color: 'أخضر', shape: 'بيضاوي' },
  { icon: '🍑', name: 'خوخ برتقالي', color: 'برتقالي', shape: 'دائري' },
  { icon: '💎', name: 'جوهرة براقة', color: 'أزرق فواتح', shape: 'هندسي مضلع' },
  { icon: '🌈', name: 'قوس قزح ملون', color: 'ألوان متعددة', shape: 'قوس' }
];

SHAPES_COLORS_TITLES.forEach((title, gameIdx) => {
  const questions: QuizQuestion[] = [];
  for (let i = 1; i <= 50; i++) {
    const item = shapeColorItems[(gameIdx * 3 + i - 1) % shapeColorItems.length];
    const otherItems = shapeColorItems.filter(p => p.name !== item.name);
    const shuffledOthers = [...otherItems].sort(() => Math.random() - 0.5);
    const d1 = shuffledOthers[0]?.name || 'شكل آخر';
    const d2 = shuffledOthers[1]?.name || 'لون آخر';
    const d3 = shuffledOthers[2]?.name || 'رمز مميز';

    const optionsSet = new Set([item.name, d1, d2, d3]);
    while (optionsSet.size < 4 && otherItems.length >= optionsSet.size) {
      const randItem = otherItems[Math.floor(Math.random() * otherItems.length)];
      if (randItem) optionsSet.add(randItem.name);
      else break;
    }
    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    questions.push({
      id: i,
      question: `ما هو الوصف الصحيح للشكل واللون في هذه الصورة؟`,
      image: item.icon,
      options: options,
      correctAnswer: item.name,
      explanation: `الإجابة الصحيحة هي (${item.name}). الشكل واللون متطابقان تماماً مع الصورة المعروضة.`
    });
  }
  SHAPES_COLORS_BANK[title] = questions;
});
