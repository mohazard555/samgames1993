import { ChildSkillChallenge, DifficultyLevel } from '../types/childSkillsTypes';

// Helper to determine difficulty by stage index (0..49)
const getDifficulty = (stageIndex: number): DifficultyLevel => {
  if (stageIndex < 15) return 'easy';
  if (stageIndex < 35) return 'medium';
  return 'hard';
};

// ==========================================
// GAME 1: طابق الصورة (Match the image - 50 stages)
// ==========================================
const MATCH_ITEMS_50 = [
  { visual: '🐶', label: 'كلب لطيف' },
  { visual: '🐱', label: 'قطة أليفة' },
  { visual: '🦁', label: 'أسد شجاع' },
  { visual: '🐘', label: 'فيل ضخم' },
  { visual: '🦒', label: 'زرافة طويلة' },
  { visual: '🐵', label: 'قرد مرح' },
  { visual: '🐰', label: 'أرنب سريع' },
  { visual: '🐼', label: 'باندا ظريف' },
  { visual: '🦊', label: 'ثعلب ذكي' },
  { visual: '🐻', label: 'دب بني' },
  { visual: '🍎', label: 'تفاحة حمراء' },
  { visual: '🍌', label: 'موزة صفراء' },
  { visual: '🍇', label: 'عنب لذيذ' },
  { visual: '🍓', label: 'فراولة طازجة' },
  { visual: '🍉', label: 'بطيخ منعش' },
  { visual: '🍊', label: 'برتقالة حلوة' },
  { visual: '🍍', label: 'أناناس ذهبي' },
  { visual: '🍒', label: 'كرز أحمر' },
  { visual: '🥑', label: 'أفوكادو صحي' },
  { visual: '🥕', label: 'جزرة مقرمشة' },
  { visual: '🚗', label: 'سيارة سريعة' },
  { visual: '🚌', label: 'حافلة مدرسية' },
  { visual: '✈️', label: 'طائرة في السماء' },
  { visual: '🚀', label: 'صاروخ فضائي' },
  { visual: '🚢', label: 'سفينة في البحر' },
  { visual: '🚆', label: 'قطار سريع' },
  { visual: '🚁', label: 'طائرة مروحية' },
  { visual: '🚲', label: 'دراجة هوائية' },
  { visual: '⛵', label: 'قارب شراعي' },
  { visual: '🛵', label: 'دراجة نارية' },
  { visual: '⚽', label: 'كرة قدم' },
  { visual: '🏀', label: 'كرة سلة' },
  { visual: '🎾', label: 'كرة مضرب' },
  { visual: '🎈', label: 'بالون ملون' },
  { visual: '🧸', label: 'دبدوب ألعاب' },
  { visual: '🧁', label: 'كعكة صغيرة' },
  { visual: '🍕', label: 'شريحة بيتزا' },
  { visual: '🍩', label: 'دونات لذيذة' },
  { visual: '🍦', label: 'مثلجات باردة' },
  { visual: '🍿', label: 'فشار ساخن' },
  { visual: '🌞', label: 'شمس مشرقة' },
  { visual: '🌙', label: 'هلال مضيء' },
  { visual: '⭐', label: 'نجمة ذهبية' },
  { visual: '🌈', label: 'قوس قزح رائع' },
  { visual: '🌻', label: 'زهرة عباد الشمس' },
  { visual: '🌲', label: 'شجرة خضراء' },
  { visual: '🦋', label: 'فراشة جميلة' },
  { visual: '🐝', label: 'نحلة نشيطة' },
  { visual: '🐢', label: 'سلحفاة هادئة' },
  { visual: '🐬', label: 'دلفين يقفز' },
];

const generateGame1Stages = (): ChildSkillChallenge[] => {
  return MATCH_ITEMS_50.map((target, idx) => {
    const stageNum = idx + 1;
    const diff = getDifficulty(idx);
    const optionCount = diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4;
    
    // Pick distinct distractors
    const distractors: typeof MATCH_ITEMS_50 = [];
    let offset = 1;
    while (distractors.length < optionCount - 1) {
      const candidate = MATCH_ITEMS_50[(idx + offset * 7) % MATCH_ITEMS_50.length];
      if (candidate.visual !== target.visual && !distractors.some(d => d.visual === candidate.visual)) {
        distractors.push(candidate);
      }
      offset++;
    }

    const options = [
      { id: 'correct', visual: target.visual, label: target.label, isCorrect: true },
      ...distractors.map((d, dIdx) => ({
        id: `dist_${dIdx}`,
        visual: d.visual,
        label: d.label,
        isCorrect: false,
      })),
    ].sort(() => (stageNum % 2 === 0 ? 0.5 - Math.random() : Math.random() - 0.5));

    return {
      id: `g1_s${stageNum}`,
      stageNumber: stageNum,
      difficulty: diff,
      instruction: `المرحلة ${stageNum}: أي صورة تطابق ${target.label} في الأعلى؟`,
      type: 'choice',
      targetVisual: target.visual,
      targetLabel: target.label,
      data: { options },
    };
  });
};

// ==========================================
// GAME 2: أين الاختلاف؟ (Spot the odd one - 50 stages)
// ==========================================
const ODD_PAIRS_50 = [
  { same: '🍎', sameLabel: 'تفاح', odd: '🍌', oddLabel: 'موزة (مختلفة)' },
  { same: '🐱', sameLabel: 'قطط', odd: '🐶', oddLabel: 'كلب (مختلف)' },
  { same: '🚗', sameLabel: 'سيارات', odd: '✈️', oddLabel: 'طائرة (مختلفة)' },
  { same: '⚽', sameLabel: 'كرات قدم', odd: '🏀', oddLabel: 'كرة سلة (مختلفة)' },
  { same: '⭐', sameLabel: 'نجوم', odd: '🌙', oddLabel: 'قمر (مختلف)' },
  { same: '🍓', sameLabel: 'فراولة', odd: '🍇', oddLabel: 'عنب (مختلف)' },
  { same: '🦁', sameLabel: 'أسود', odd: '🐯', oddLabel: 'نمر (مختلف)' },
  { same: '🚌', sameLabel: 'حافلات', odd: '🚲', oddLabel: 'دراجة (مختلفة)' },
  { same: '🥕', sameLabel: 'جزر', odd: '🥦', oddLabel: 'بروكلي (مختلف)' },
  { same: '🎈', sameLabel: 'بالونات', odd: '🧸', oddLabel: 'دبدوب (مختلف)' },
  { same: '🐟', sameLabel: 'أسماك', odd: '🦀', oddLabel: 'سلطعون (مختلف)' },
  { same: '🍦', sameLabel: 'مثلجات', odd: '🧁', oddLabel: 'كعكة (مختلفة)' },
  { same: '🌻', sameLabel: 'أزهار عباد شمس', odd: '🌹', oddLabel: 'وردة حمراء (مختلفة)' },
  { same: '✈️', sameLabel: 'طائرات', odd: '🚀', oddLabel: 'صاروخ (مختلف)' },
  { same: '🐵', sameLabel: 'قرود', odd: '🐘', oddLabel: 'فيل (مختلف)' },
  { same: '🍉', sameLabel: 'بطيخ', odd: '🍊', oddLabel: 'برتقال (مختلف)' },
  { same: '🍕', sameLabel: 'بيتزا', odd: '🍔', oddLabel: 'برغر (مختلف)' },
  { same: '🚢', sameLabel: 'سفن', odd: '⛵', oddLabel: 'قارب شراعي (مختلف)' },
  { same: '🦋', sameLabel: 'فراشات', odd: '🐝', oddLabel: 'نحلة (مختلفة)' },
  { same: '🍩', sameLabel: 'دونات', odd: '🍪', oddLabel: 'كوكيز (مختلف)' },
  { same: '🐸', sameLabel: 'ضفادع', odd: '🐢', oddLabel: 'سلحفاة (مختلفة)' },
  { same: '🥑', sameLabel: 'أفوكادو', odd: '🌽', oddLabel: 'ذرة (مختلفة)' },
  { same: '🎸', sameLabel: 'غيتار', odd: '🥁', oddLabel: 'طبلة (مختلفة)' },
  { same: '🚁', sameLabel: 'مروحيات', odd: '🛸', oddLabel: 'صحن فضائي (مختلف)' },
  { same: '🐼', sameLabel: 'باندا', odd: '🐨', oddLabel: 'كوالا (مختلف)' },
  { same: '🍒', sameLabel: 'كرز', odd: '🍍', oddLabel: 'أناناس (مختلف)' },
  { same: '🚲', sameLabel: 'دراجات', odd: '🛵', oddLabel: 'دباب (مختلف)' },
  { same: '🦜', sameLabel: 'ببغاوات', odd: '🦉', oddLabel: 'بومة (مختلفة)' },
  { same: '🥞', sameLabel: 'بانكيك', odd: '🧇', oddLabel: 'وافل (مختلف)' },
  { same: '👑', sameLabel: 'تيجان', odd: '🎩', oddLabel: 'قبعة (مختلفة)' },
  { same: '🦊', sameLabel: 'ثعالب', odd: '🐺', oddLabel: 'ذئب (مختلف)' },
  { same: '🍐', sameLabel: 'إجاص', odd: '🍑', oddLabel: 'خوخ (مختلف)' },
  { same: '🚆', sameLabel: 'قطارات', odd: '🚇', oddLabel: 'مترو (مختلف)' },
  { same: '🐬', sameLabel: 'دلافين', odd: '🦈', oddLabel: 'قرش (مختلف)' },
  { same: '☕', sameLabel: 'أكواب شاي', odd: '🧃', oddLabel: 'علبة عصير (مختلفة)' },
  { same: '🌵', sameLabel: 'صبار', odd: '🌴', oddLabel: 'نخلة (مختلفة)' },
  { same: '🦆', sameLabel: 'بط', odd: '🦢', oddLabel: 'بجعة (مختلفة)' },
  { same: '🍇', sameLabel: 'عنب بنفسجي', odd: '🍋', oddLabel: 'ليمون أصفر (مختلف)' },
  { same: '🚒', sameLabel: 'سيارات إطفاء', odd: '🚑', oddLabel: 'إسعاف (مختلفة)' },
  { same: '🦒', sameLabel: 'زرافات', odd: '🦓', oddLabel: 'حمار وحشي (مختلف)' },
  { same: '🍅', sameLabel: 'طماطم', odd: '🥒', oddLabel: 'خيار (مختلف)' },
  { same: '⛵', sameLabel: 'قوارب شراع', odd: '🚤', oddLabel: 'قارب سريع (مختلف)' },
  { same: '🐧', sameLabel: 'بطاريق', odd: '🦭', oddLabel: 'فقمة (مختلفة)' },
  { same: '🍫', sameLabel: 'شوكولاتة', odd: '🍭', oddLabel: 'مصاصة (مختلفة)' },
  { same: '💎', sameLabel: 'جواهر زرقاء', odd: '💍', oddLabel: 'خاتم ذهبي (مختلف)' },
  { same: '🐴', sameLabel: 'خيول', odd: '🐪', oddLabel: 'جمل (مختلف)' },
  { same: '🍓', sameLabel: 'فراولة حمراء', odd: '🫐', oddLabel: 'توت أزرق (مختلف)' },
  { same: '🛵', sameLabel: 'سكوتر', odd: '🛹', oddLabel: 'لوح تزلج (مختلف)' },
  { same: '🐓', sameLabel: 'ديوك', odd: '🦃', oddLabel: 'ديك رومي (مختلف)' },
  { same: '🎁', sameLabel: 'هدايا حمراء', odd: '📦', oddLabel: 'صندوق كرتون (مختلف)' },
];

const generateGame2Stages = (): ChildSkillChallenge[] => {
  return ODD_PAIRS_50.map((pair, idx) => {
    const stageNum = idx + 1;
    const diff = getDifficulty(idx);
    const count = diff === 'easy' ? 3 : 4;
    const oddPos = (idx * 3 + 1) % count;

    const options = Array.from({ length: count }).map((_, oIdx) => {
      const isOdd = oIdx === oddPos;
      return {
        id: `opt_${oIdx}`,
        visual: isOdd ? pair.odd : pair.same,
        label: isOdd ? pair.oddLabel : pair.sameLabel,
        isCorrect: isOdd,
      };
    });

    return {
      id: `g2_s${stageNum}`,
      stageNumber: stageNum,
      difficulty: diff,
      instruction: `المرحلة ${stageNum}: أي عنصر هو المختلف عن الباقين؟ اضغط عليه!`,
      type: 'choice',
      data: { options },
    };
  });
};

// ==========================================
// GAME 3: أكمل الصورة / طابق الظل (50 stages)
// ==========================================
const generateGame3Stages = (): ChildSkillChallenge[] => {
  return MATCH_ITEMS_50.map((item, idx) => {
    const stageNum = idx + 1;
    const diff = getDifficulty(idx);
    const optionCount = diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4;

    const distractors: typeof MATCH_ITEMS_50 = [];
    let offset = 2;
    while (distractors.length < optionCount - 1) {
      const cand = MATCH_ITEMS_50[(idx + offset * 5) % MATCH_ITEMS_50.length];
      if (cand.visual !== item.visual && !distractors.some(d => d.visual === cand.visual)) {
        distractors.push(cand);
      }
      offset++;
    }

    const options = [
      { id: 'correct', visual: item.visual, label: item.label, isCorrect: true },
      ...distractors.map((d, dIdx) => ({
        id: `dist_${dIdx}`,
        visual: d.visual,
        label: d.label,
        isCorrect: false,
      })),
    ].sort(() => 0.5 - Math.random());

    return {
      id: `g3_s${stageNum}`,
      stageNumber: stageNum,
      difficulty: diff,
      instruction: `المرحلة ${stageNum}: أي خيار يكمل ويطابق ظل ${item.label}؟`,
      type: 'choice',
      targetVisual: item.visual,
      targetLabel: `ظل: ${item.label}`,
      data: { options },
    };
  });
};

// ==========================================
// GAME 4: لعبة الذاكرة (Memory game - 50 stages)
// ==========================================
const MEMORY_THEMES_50 = [
  ['🐶', '🐱'], ['🍎', '🍌'], ['🚗', '✈️'], ['⚽', '🏀'], ['⭐', '🌙'],
  ['🦁', '🐘'], ['🍓', '🍇'], ['🚌', '🚲'], ['🥕', '🥦'], ['🎈', '🧸'],
  ['🐟', '🐬'], ['🍦', '🧁'], ['🌻', '🌹'], ['🚀', '🛸'], ['🐵', '🦒'],
  ['🍉', '🍊'], ['🍕', '🍔'], ['🚢', '⛵'], ['🦋', '🐝'], ['🍩', '🍪'],
  ['🐸', '🐢'], ['🥑', '🌽'], ['🎸', '🥁'], ['🚁', '🚆'], ['🐼', '🦊'],
  ['🍒', '🍍'], ['🛵', '🛹'], ['🦜', '🦉'], ['🥞', '🧇'], ['👑', '💎'],
  ['🐶', '🐱', '🐰'], ['🍎', '🍌', '🍓'], ['🚗', '✈️', '🚀'], ['⚽', '🏀', '🎾'], ['⭐', '🌙', '☀️'],
  ['🦁', '🐘', '🦒'], ['🍇', '🍉', '🍍'], ['🚌', '🚲', '🚢'], ['🥕', '🥦', '🌽'], ['🎈', '🧸', '🎁'],
  ['🐟', '🐬', '🦀'], ['🍦', '🧁', '🍩'], ['🌻', '🌹', '🌷'], ['🐵', '🐼', '🦊'], ['🍕', '🍔', '🍟'],
  ['🐶', '🐱', '🐰', '🐻'], ['🍎', '🍌', '🍓', '🍇'], ['🚗', '✈️', '🚀', '🚢'], ['⚽', '🏀', '🎾', '🏈'], ['⭐', '🌙', '☀️', '🌈']
];

const generateGame4Stages = (): ChildSkillChallenge[] => {
  return MEMORY_THEMES_50.map((pairs, idx) => {
    const stageNum = idx + 1;
    const diff = getDifficulty(idx);
    return {
      id: `g4_s${stageNum}`,
      stageNumber: stageNum,
      difficulty: diff,
      instruction: `المرحلة ${stageNum}: افتح البطاقات واعثر على الأزواج المتطابقة! (${pairs.length * 2} بطاقات)`,
      type: 'memory',
      data: { pairs },
    };
  });
};

// ==========================================
// GAME 5: لوّن حسب المطلوب (Color as requested - 50 stages)
// ==========================================
const COLORING_50 = [
  { item: 'تفاحة حمراء', color: '#ef4444', emoji: '🍎', colorName: 'الأحمر' },
  { item: 'سماء زرقاء', color: '#3b82f6', emoji: '🌊', colorName: 'الأزرق' },
  { item: 'شمس مشرقة', color: '#eab308', emoji: '☀️', colorName: 'الأصفر' },
  { item: 'ورقة شجر', color: '#22c55e', emoji: '🍃', colorName: 'الأخضر' },
  { item: 'برتقالة طازجة', color: '#f97316', emoji: '🍊', colorName: 'البرتقالي' },
  { item: 'عنب ناضج', color: '#a855f7', emoji: '🍇', colorName: 'البنفسجي' },
  { item: 'حلوى وردية', color: '#ec4899', emoji: '🌸', colorName: 'الوردي' },
  { item: 'دب بني', color: '#78350f', emoji: '🐻', colorName: 'البني' },
  { item: 'فحمة سوداء', color: '#18181b', emoji: '⚫', colorName: 'الأسود' },
  { item: 'سحابة بيضاء', color: '#f8fafc', emoji: '☁️', colorName: 'الأبيض' },
  { item: 'فراولة حمراء', color: '#ef4444', emoji: '🍓', colorName: 'الأحمر' },
  { item: 'بحر عميق', color: '#3b82f6', emoji: '🐟', colorName: 'الأزرق' },
  { item: 'ليمونة حامضة', color: '#eab308', emoji: '🍋', colorName: 'الأصفر' },
  { item: 'ضفدع أخضر', color: '#22c55e', emoji: '🐸', colorName: 'الأخضر' },
  { item: 'جزرة حلوة', color: '#f97316', emoji: '🥕', colorName: 'البرتقالي' },
  { item: 'باذنجان', color: '#a855f7', emoji: '🍆', colorName: 'البنفسجي' },
  { item: 'زهرة كرز', color: '#ec4899', emoji: '🌺', colorName: 'الوردي' },
  { item: 'شوكولاتة', color: '#78350f', emoji: '🍫', colorName: 'البني' },
  { item: 'غراب ليلي', color: '#18181b', emoji: '🦅', colorName: 'الأسود' },
  { item: 'رجل ثلج', color: '#f8fafc', emoji: '☃️', colorName: 'الأبيض' },
  { item: 'طماطم حمراء', color: '#ef4444', emoji: '🍅', colorName: 'الأحمر' },
  { item: 'حوت أزرق', color: '#3b82f6', emoji: '🐋', colorName: 'الأزرق' },
  { item: 'موزة صفراء', color: '#eab308', emoji: '🍌', colorName: 'الأصفر' },
  { item: 'خيارة طازجة', color: '#22c55e', emoji: '🥒', colorName: 'الأخضر' },
  { item: 'يقطين خريفي', color: '#f97316', emoji: '🎃', colorName: 'البرتقالي' },
  { item: 'توت بنفسجي', color: '#a855f7', emoji: '🫐', colorName: 'البنفسجي' },
  { item: 'علكة وردية', color: '#ec4899', emoji: '🦩', colorName: 'الوردي' },
  { item: 'حبة بن قهوة', color: '#78350f', emoji: '☕', colorName: 'البني' },
  { item: 'إطار سيارة', color: '#18181b', emoji: '🚗', colorName: 'الأسود' },
  { item: 'بيضة بيضاء', color: '#f8fafc', emoji: '🥚', colorName: 'الأبيض' },
  { item: 'كرز أحمر', color: '#ef4444', emoji: '🍒', colorName: 'الأحمر' },
  { item: 'دلفين بحري', color: '#3b82f6', emoji: '🐬', colorName: 'الأزرق' },
  { item: 'ذرة ذهبية', color: '#eab308', emoji: '🌽', colorName: 'الأصفر' },
  { item: 'شجرة صنوبر', color: '#22c55e', emoji: '🌲', colorName: 'الأخضر' },
  { item: 'ثعلب برتقالي', color: '#f97316', emoji: '🦊', colorName: 'البرتقالي' },
  { item: 'بلورة أرجوانية', color: '#a855f7', emoji: '🔮', colorName: 'البنفسجي' },
  { item: 'شريط هدية وردي', color: '#ec4899', emoji: '🎀', colorName: 'الوردي' },
  { item: 'جذع شجرة', color: '#78350f', emoji: '🪵', colorName: 'البني' },
  { item: 'قطة سوداء', color: '#18181b', emoji: '🐈‍⬛', colorName: 'الأسود' },
  { item: 'قطن أبيض', color: '#f8fafc', emoji: '🐑', colorName: 'الأبيض' },
  { item: 'وردة جورية', color: '#ef4444', emoji: '🌹', colorName: 'الأحمر' },
  { item: 'قطرة ماء نقي', color: '#3b82f6', emoji: '💧', colorName: 'الأزرق' },
  { item: 'نجمة متلألئة', color: '#eab308', emoji: '⭐', colorName: 'الأصفر' },
  { item: 'بروكلي مفيد', color: '#22c55e', emoji: '🥦', colorName: 'الأخضر' },
  { item: 'مخروط مرور', color: '#f97316', emoji: '🚧', colorName: 'البرتقالي' },
  { item: 'زهرة خزامى', color: '#a855f7', emoji: '🪻', colorName: 'البنفسجي' },
  { item: 'قلب دافئ', color: '#ec4899', emoji: '💖', colorName: 'الوردي' },
  { item: 'قرد لطيف', color: '#78350f', emoji: '🐵', colorName: 'البني' },
  { item: 'نملة صغيرة', color: '#18181b', emoji: '🐜', colorName: 'الأسود' },
  { item: 'حمامة سلام', color: '#f8fafc', emoji: '🕊️', colorName: 'الأبيض' },
];

const MASTER_PALETTE = [
  { color: '#ef4444', emoji: '🔴', label: 'أحمر' },
  { color: '#3b82f6', emoji: '🔵', label: 'أزرق' },
  { color: '#eab308', emoji: '🟡', label: 'أصفر' },
  { color: '#22c55e', emoji: '🟢', label: 'أخضر' },
  { color: '#f97316', emoji: '🟠', label: 'برتقالي' },
  { color: '#a855f7', emoji: '🟣', label: 'بنفسجي' },
  { color: '#ec4899', emoji: '🌸', label: 'وردي' },
  { color: '#78350f', emoji: '🟤', label: 'بني' },
];

const generateGame5Stages = (): ChildSkillChallenge[] => {
  return COLORING_50.map((c, idx) => {
    const stageNum = idx + 1;
    const diff = getDifficulty(idx);
    return {
      id: `g5_s${stageNum}`,
      stageNumber: stageNum,
      difficulty: diff,
      instruction: `المرحلة ${stageNum}: اختر اللون (${c.colorName}) المناسب لـ ${c.item} ${c.emoji}`,
      type: 'coloring',
      data: {
        correctColor: c.color,
        palette: MASTER_PALETTE,
      },
    };
  });
};

// ==========================================
// GAME 6: ابحث عن اللون (Find the color - 50 stages)
// ==========================================
const generateGame6Stages = (): ChildSkillChallenge[] => {
  return COLORING_50.map((target, idx) => {
    const stageNum = idx + 1;
    const diff = getDifficulty(idx);
    const optionCount = diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4;

    const distractors: typeof COLORING_50 = [];
    let offset = 1;
    while (distractors.length < optionCount - 1) {
      const cand = COLORING_50[(idx + offset * 7) % COLORING_50.length];
      if (cand.color !== target.color && !distractors.some(d => d.color === cand.color)) {
        distractors.push(cand);
      }
      offset++;
    }

    const options = [
      { id: 'correct', visual: target.emoji, label: target.item, isCorrect: true },
      ...distractors.map((d, dIdx) => ({
        id: `dist_${dIdx}`,
        visual: d.emoji,
        label: d.item,
        isCorrect: false,
      })),
    ].sort(() => 0.5 - Math.random());

    return {
      id: `g6_s${stageNum}`,
      stageNumber: stageNum,
      difficulty: diff,
      instruction: `المرحلة ${stageNum}: أي من هذه الأشياء لونه ${target.colorName}؟`,
      type: 'choice',
      data: { options },
    };
  });
};

// ==========================================
// GAME 7: طابق الشكل (Match shape - 50 stages)
// ==========================================
const SHAPES_50 = [
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'كرة القدم', itemEmoji: '⚽' },
  { shape: 'مربع', shapeEmoji: '⏹️', item: 'صندوق الهدية', itemEmoji: '🎁' },
  { shape: 'مثلث', shapeEmoji: '🔺', item: 'شريحة البيتزا', itemEmoji: '🍕' },
  { shape: 'نجمة', shapeEmoji: '⭐', item: 'نجمة السماء', itemEmoji: '🌟' },
  { shape: 'قلب', shapeEmoji: '❤️', item: 'قلب المحبة', itemEmoji: '💖' },
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'برتقالة طازجة', itemEmoji: '🍊' },
  { shape: 'مربع', shapeEmoji: '⏹️', item: 'رغيف التوست', itemEmoji: '🍞' },
  { shape: 'مثلث', shapeEmoji: '🔺', item: 'هرم أثري', itemEmoji: '⛺' },
  { shape: 'مستطيل', shapeEmoji: '▭', item: 'باب الغرفة', itemEmoji: '🚪' },
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'قرص الساعة', itemEmoji: '⏰' },
  { shape: 'بيضاوي', shapeEmoji: '🥚', item: 'بيضة فطور', itemEmoji: '🥚' },
  { shape: 'مستطيل', shapeEmoji: '▭', item: 'شاشة الهاتف', itemEmoji: '📱' },
  { shape: 'هلال', shapeEmoji: '🌙', item: 'قمر رمضان', itemEmoji: '🌙' },
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'عجلة السيارة', itemEmoji: '🚗' },
  { shape: 'مربع', shapeEmoji: '⏹️', item: 'مكعب روبيك', itemEmoji: '🎲' },
  { shape: 'مثلث', shapeEmoji: '🔺', item: 'مثلث المرور', itemEmoji: '⚠️' },
  { shape: 'مستطيل', shapeEmoji: '▭', item: 'كتاب القراءة', itemEmoji: '📖' },
  { shape: 'نجمة', shapeEmoji: '⭐', item: 'نجم البحر', itemEmoji: '⭐' },
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'عملة ذهبية', itemEmoji: '🪙' },
  { shape: 'قلب', shapeEmoji: '❤️', item: 'بالون الحب', itemEmoji: '🎈' },
  { shape: 'مستطيل', shapeEmoji: '▭', item: 'سبورة الصف', itemEmoji: '📋' },
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'حلوى الدونات', itemEmoji: '🍩' },
  { shape: 'مربع', shapeEmoji: '⏹️', item: 'بلاطة أرضية', itemEmoji: '🧱' },
  { shape: 'مثلث', shapeEmoji: '🔺', item: 'شراع القارب', itemEmoji: '⛵' },
  { shape: 'بيضاوي', shapeEmoji: '🥚', item: 'كرة الرغبي', itemEmoji: '🏉' },
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'قرص الشمس', itemEmoji: '☀️' },
  { shape: 'مستطيل', shapeEmoji: '▭', item: 'لوح الشوكولاتة', itemEmoji: '🍫' },
  { shape: 'مربع', shapeEmoji: '⏹️', item: 'نافذة البيت', itemEmoji: '🪟' },
  { shape: 'مثلث', shapeEmoji: '🔺', item: 'قبعة الحفلة', itemEmoji: '🎉' },
  { shape: 'نجمة', shapeEmoji: '⭐', item: 'وسام الشجاعة', itemEmoji: '🎖️' },
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'زر القميص', itemEmoji: '🔘' },
  { shape: 'مستطيل', shapeEmoji: '▭', item: 'حقيبة السفر', itemEmoji: '🧳' },
  { shape: 'مربع', shapeEmoji: '⏹️', item: 'صندوق ألعاب', itemEmoji: '📦' },
  { shape: 'مثلث', shapeEmoji: '🔺', item: 'شريحة بطيخ', itemEmoji: '🍉' },
  { shape: 'قلب', shapeEmoji: '❤️', item: 'بطاقة معايدة', itemEmoji: '💌' },
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'عجلة الدراجة', itemEmoji: '🚲' },
  { shape: 'مستطيل', shapeEmoji: '▭', item: 'حافلة الركاب', itemEmoji: '🚌' },
  { shape: 'بيضاوي', shapeEmoji: '🥚', item: 'بالون مائي', itemEmoji: '🎈' },
  { shape: 'مثلث', shapeEmoji: '🔺', item: 'قطعة جبن صفراء', itemEmoji: '🧀' },
  { shape: 'مربع', shapeEmoji: '⏹️', item: 'طاولة مربعة', itemEmoji: '🪑' },
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'طبق طعام', itemEmoji: '🍽️' },
  { shape: 'مستطيل', shapeEmoji: '▭', item: 'مسطرة الرسم', itemEmoji: '📏' },
  { shape: 'نجمة', shapeEmoji: '⭐', item: 'زهرة النجمة', itemEmoji: '🌼' },
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'عدسة مكبرة', itemEmoji: '🔍' },
  { shape: 'مربع', shapeEmoji: '⏹️', item: 'وسادة النوم', itemEmoji: '🛋️' },
  { shape: 'مثلث', shapeEmoji: '🔺', item: 'سقف الكوخ', itemEmoji: '🛖' },
  { shape: 'مستطيل', shapeEmoji: '▭', item: 'ظرف الرسالة', itemEmoji: '✉️' },
  { shape: 'هلال', shapeEmoji: '🌙', item: 'موزة مقوسة', itemEmoji: '🍌' },
  { shape: 'دائرة', shapeEmoji: '⚪', item: 'كعكة عيد الميلاد', itemEmoji: '🎂' },
  { shape: 'قلب', shapeEmoji: '❤️', item: 'وسام حب', itemEmoji: '❤️' },
];

const generateGame7Stages = (): ChildSkillChallenge[] => {
  return SHAPES_50.map((s, idx) => {
    const stageNum = idx + 1;
    const diff = getDifficulty(idx);
    const optionCount = diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4;

    const distractors: typeof SHAPES_50 = [];
    let offset = 1;
    while (distractors.length < optionCount - 1) {
      const cand = SHAPES_50[(idx + offset * 7) % SHAPES_50.length];
      if (cand.shape !== s.shape && !distractors.some(d => d.shape === cand.shape)) {
        distractors.push(cand);
      }
      offset++;
    }

    const options = [
      { id: 'correct', visual: s.shapeEmoji, label: s.shape, isCorrect: true },
      ...distractors.map((d, dIdx) => ({
        id: `dist_${dIdx}`,
        visual: d.shapeEmoji,
        label: d.shape,
        isCorrect: false,
      })),
    ].sort(() => 0.5 - Math.random());

    return {
      id: `g7_s${stageNum}`,
      stageNumber: stageNum,
      difficulty: diff,
      instruction: `المرحلة ${stageNum}: ما هو الشكل الهندسي لـ (${s.item}) ${s.itemEmoji}؟`,
      type: 'choice',
      targetVisual: s.itemEmoji,
      targetLabel: s.item,
      data: { options },
    };
  });
};

// ==========================================
// GAME 8: عدّ الأشياء (Count items - 50 stages)
// ==========================================
const COUNT_ITEMS_50 = [
  { visual: '⭐', label: 'نجوم', count: 1 },
  { visual: '🍎', label: 'تفاحات', count: 2 },
  { visual: '🚗', label: 'سيارات', count: 3 },
  { visual: '🐱', label: 'قطط', count: 4 },
  { visual: '🎈', label: 'بالونات', count: 5 },
  { visual: '🍌', label: 'موزات', count: 2 },
  { visual: '🍓', label: 'فراولة', count: 3 },
  { visual: '⚽', label: 'كرات', count: 4 },
  { visual: '🌻', label: 'أزهار', count: 5 },
  { visual: '🐶', label: 'كلاب', count: 6 },
  { visual: '🦋', label: 'فراشات', count: 3 },
  { visual: '🍦', label: 'مثلجات', count: 4 },
  { visual: '🥕', label: 'جزر', count: 5 },
  { visual: '✈️', label: 'طائرات', count: 6 },
  { visual: '🍉', label: 'بطيخ', count: 7 },
  { visual: '🐟', label: 'أسماك', count: 4 },
  { visual: '🧁', label: 'كعكات', count: 5 },
  { visual: '🚀', label: 'صواريخ', count: 6 },
  { visual: '🍊', label: 'برتقال', count: 7 },
  { visual: '🐘', label: 'أفيال', count: 8 },
  { visual: '🦁', label: 'أسود', count: 5 },
  { visual: '🍕', label: 'بيتزا', count: 6 },
  { visual: '🍩', label: 'دونات', count: 7 },
  { visual: '🍒', label: 'كرز', count: 8 },
  { visual: '🚲', label: 'دراجات', count: 9 },
  { visual: '🐰', label: 'أرانب', count: 6 },
  { visual: '🍇', label: 'عنب', count: 7 },
  { visual: '🚢', label: 'سفن', count: 8 },
  { visual: '🧸', label: 'دباديب', count: 9 },
  { visual: '⭐', label: 'نجوم مضيئة', count: 10 },
  { visual: '🦆', label: 'بطات', count: 3 },
  { visual: '🐸', label: 'ضفادع', count: 4 },
  { visual: '🐝', label: 'نحل', count: 5 },
  { visual: '🌽', label: 'ذرة', count: 6 },
  { visual: '🥑', label: 'أفوكادو', count: 7 },
  { visual: '🍄', label: 'فطر', count: 8 },
  { visual: '🎸', label: 'غيتارات', count: 9 },
  { visual: '💎', label: 'جواهر', count: 10 },
  { visual: '🥥', label: 'جوز هند', count: 4 },
  { visual: '🍪', label: 'بسكويت', count: 5 },
  { visual: '🍅', label: 'طماطم', count: 6 },
  { visual: '🥒', label: 'خيار', count: 7 },
  { visual: '🛴', label: 'سكوترات', count: 8 },
  { visual: '🎨', label: 'لوحات رسم', count: 9 },
  { visual: '🌴', label: 'نخيل', count: 10 },
  { visual: '🍬', label: 'حلويات', count: 6 },
  { visual: '🍿', label: 'فشار', count: 7 },
  { visual: '🧃', label: 'عصائر', count: 8 },
  { visual: '🎁', label: 'صناديق هدايا', count: 9 },
  { visual: '👑', label: 'تيجان ذهبية', count: 10 },
];

const generateGame8Stages = (): ChildSkillChallenge[] => {
  return COUNT_ITEMS_50.map((c, idx) => {
    const stageNum = idx + 1;
    const diff = getDifficulty(idx);
    
    // Generate 3 unique options including correct count
    const opts = new Set<number>([c.count]);
    if (c.count > 1) opts.add(c.count - 1);
    else opts.add(c.count + 2);
    opts.add(c.count + 1);
    while (opts.size < 3) {
      opts.add(c.count + opts.size);
    }
    const options = Array.from(opts).sort((a, b) => a - b);

    return {
      id: `g8_s${stageNum}`,
      stageNumber: stageNum,
      difficulty: diff,
      instruction: `المرحلة ${stageNum}: كم عدد ${c.label} الموجودة؟ عُدّها واختر الرقم الصحيح:`,
      type: 'count',
      data: {
        visual: c.visual,
        count: c.count,
        correct: c.count,
        options,
      },
    };
  });
};

// ==========================================
// GAME 9: اجمع الأشياء (Add items - 50 stages)
// ==========================================
const ADD_PROBLEMS_50 = [
  { left: 1, right: 1, visual: '🍎' },
  { left: 1, right: 2, visual: '⭐' },
  { left: 2, right: 1, visual: '🚗' },
  { left: 2, right: 2, visual: '🐱' },
  { left: 1, right: 3, visual: '🎈' },
  { left: 3, right: 1, visual: '🍌' },
  { left: 2, right: 3, visual: '🍓' },
  { left: 3, right: 2, visual: '⚽' },
  { left: 1, right: 4, visual: '🌻' },
  { left: 4, right: 1, visual: '🐶' },
  { left: 3, right: 3, visual: '🦋' },
  { left: 2, right: 4, visual: '🍦' },
  { left: 4, right: 2, visual: '🥕' },
  { left: 1, right: 5, visual: '✈️' },
  { left: 5, right: 1, visual: '🍉' },
  { left: 4, right: 3, visual: '🐟' },
  { left: 3, right: 4, visual: '🧁' },
  { left: 2, right: 5, visual: '🚀' },
  { left: 5, right: 2, visual: '🍊' },
  { left: 1, right: 6, visual: '🐘' },
  { left: 6, right: 1, visual: '🦁' },
  { left: 4, right: 4, visual: '🍕' },
  { left: 5, right: 3, visual: '🍩' },
  { left: 3, right: 5, visual: '🍒' },
  { left: 2, right: 6, visual: '🚲' },
  { left: 6, right: 2, visual: '🐰' },
  { left: 5, right: 4, visual: '🍇' },
  { left: 4, right: 5, visual: '🚢' },
  { left: 3, right: 6, visual: '🧸' },
  { left: 6, right: 3, visual: '🦆' },
  { left: 5, right: 5, visual: '🐸' },
  { left: 6, right: 4, visual: '🐝' },
  { left: 7, right: 2, visual: '🌽' },
  { left: 2, right: 7, visual: '🥑' },
  { left: 7, right: 3, visual: '🍄' },
  { left: 3, right: 7, visual: '🎸' },
  { left: 8, right: 1, visual: '💎' },
  { left: 1, right: 8, visual: '🥥' },
  { left: 8, right: 2, visual: '🍪' },
  { left: 6, right: 5, visual: '🍅' },
  { left: 7, right: 4, visual: '🥒' },
  { left: 8, right: 3, visual: '🛴' },
  { left: 9, right: 1, visual: '🎨' },
  { left: 1, right: 9, visual: '🌴' },
  { left: 5, right: 6, visual: '🍬' },
  { left: 6, right: 6, visual: '🍿' },
  { left: 7, right: 5, visual: '🧃' },
  { left: 8, right: 4, visual: '🎁' },
  { left: 9, right: 2, visual: '👑' },
  { left: 7, right: 7, visual: '⭐' },
];

const generateGame9Stages = (): ChildSkillChallenge[] => {
  return ADD_PROBLEMS_50.map((p, idx) => {
    const stageNum = idx + 1;
    const diff = getDifficulty(idx);
    const sum = p.left + p.right;
    
    const opts = new Set<number>([sum]);
    if (sum > 1) opts.add(sum - 1);
    opts.add(sum + 1);
    while (opts.size < 3) opts.add(sum + 2);
    const options = Array.from(opts).sort((a, b) => a - b);

    return {
      id: `g9_s${stageNum}`,
      stageNumber: stageNum,
      difficulty: diff,
      instruction: `المرحلة ${stageNum}: ما هو ناتج الجمع؟ ${p.left} + ${p.right} = ؟`,
      type: 'add_sub',
      data: {
        op: '+',
        leftCount: p.left,
        rightCount: p.right,
        visual: p.visual,
        correct: sum,
        options,
      },
    };
  });
};

// ==========================================
// GAME 10: اطرح الأشياء (Subtract items - 50 stages)
// ==========================================
const SUB_PROBLEMS_50 = [
  { left: 2, right: 1, visual: '🍎' },
  { left: 3, right: 1, visual: '⭐' },
  { left: 3, right: 2, visual: '🚗' },
  { left: 4, right: 1, visual: '🐱' },
  { left: 4, right: 2, visual: '🎈' },
  { left: 4, right: 3, visual: '🍌' },
  { left: 5, right: 1, visual: '🍓' },
  { left: 5, right: 2, visual: '⚽' },
  { left: 5, right: 3, visual: '🌻' },
  { left: 5, right: 4, visual: '🐶' },
  { left: 6, right: 1, visual: '🦋' },
  { left: 6, right: 2, visual: '🍦' },
  { left: 6, right: 3, visual: '🥕' },
  { left: 6, right: 4, visual: '✈️' },
  { left: 6, right: 5, visual: '🍉' },
  { left: 7, right: 1, visual: '🐟' },
  { left: 7, right: 2, visual: '🧁' },
  { left: 7, right: 3, visual: '🚀' },
  { left: 7, right: 4, visual: '🍊' },
  { left: 7, right: 5, visual: '🐘' },
  { left: 7, right: 6, visual: '🦁' },
  { left: 8, right: 1, visual: '🍕' },
  { left: 8, right: 2, visual: '🍩' },
  { left: 8, right: 3, visual: '🍒' },
  { left: 8, right: 4, visual: '🚲' },
  { left: 8, right: 5, visual: '🐰' },
  { left: 8, right: 6, visual: '🍇' },
  { left: 8, right: 7, visual: '🚢' },
  { left: 9, right: 1, visual: '🧸' },
  { left: 9, right: 2, visual: '🦆' },
  { left: 9, right: 3, visual: '🐸' },
  { left: 9, right: 4, visual: '🐝' },
  { left: 9, right: 5, visual: '🌽' },
  { left: 9, right: 6, visual: '🥑' },
  { left: 9, right: 7, visual: '🍄' },
  { left: 9, right: 8, visual: '🎸' },
  { left: 10, right: 1, visual: '💎' },
  { left: 10, right: 2, visual: '🥥' },
  { left: 10, right: 3, visual: '🍪' },
  { left: 10, right: 4, visual: '🍅' },
  { left: 10, right: 5, visual: '🥒' },
  { left: 10, right: 6, visual: '🛴' },
  { left: 10, right: 7, visual: '🎨' },
  { left: 10, right: 8, visual: '🌴' },
  { left: 10, right: 9, visual: '🍬' },
  { left: 7, right: 3, visual: '🍿' },
  { left: 8, right: 4, visual: '🧃' },
  { left: 9, right: 5, visual: '🎁' },
  { left: 6, right: 3, visual: '👑' },
  { left: 5, right: 2, visual: '⭐' },
];

const generateGame10Stages = (): ChildSkillChallenge[] => {
  return SUB_PROBLEMS_50.map((p, idx) => {
    const stageNum = idx + 1;
    const diff = getDifficulty(idx);
    const result = p.left - p.right;
    
    const opts = new Set<number>([result]);
    if (result > 1) opts.add(result - 1);
    opts.add(result + 1);
    while (opts.size < 3) opts.add(result + 2);
    const options = Array.from(opts).sort((a, b) => a - b);

    return {
      id: `g10_s${stageNum}`,
      stageNumber: stageNum,
      difficulty: diff,
      instruction: `المرحلة ${stageNum}: ما هو ناتج الطرح؟ ${p.left} - ${p.right} = ؟`,
      type: 'add_sub',
      data: {
        op: '-',
        leftCount: p.left,
        rightCount: p.right,
        visual: p.visual,
        correct: result,
        options,
      },
    };
  });
};

// ==========================================
// GENERIC SEED DATA ENGINE FOR GAMES 11 TO 40
// ==========================================
interface UniversalStageBlueprint {
  question: string;
  visual?: string;
  word?: string;
  correct: { visual?: string; label: string };
  distractors: { visual?: string; label: string }[];
}

// Builds 50 unique stages for games that follow multiple-choice or specific mechanics
const build50FromBlueprints = (
  gameId: number,
  instructionTemplate: (stageNum: number, bp: UniversalStageBlueprint) => string,
  blueprints: UniversalStageBlueprint[]
): ChildSkillChallenge[] => {
  return blueprints.map((bp, idx) => {
    const stageNum = idx + 1;
    const diff = getDifficulty(idx);
    const distCount = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;
    const activeDist = bp.distractors.slice(0, distCount);

    const options = [
      { id: 'correct', visual: bp.correct.visual || bp.visual || '⭐', label: bp.correct.label, isCorrect: true },
      ...activeDist.map((d, dIdx) => ({
        id: `dist_${dIdx}`,
        visual: d.visual || '❓',
        label: d.label,
        isCorrect: false,
      })),
    ].sort(() => 0.5 - Math.random());

    return {
      id: `g${gameId}_s${stageNum}`,
      stageNumber: stageNum,
      difficulty: diff,
      instruction: instructionTemplate(stageNum, bp),
      type: 'choice',
      targetVisual: bp.visual,
      data: {
        word: bp.word,
        options,
      },
    };
  });
};

// Data bank for Game 11: الحرف المفقود (50 words)
const GAME_11_DATA: UniversalStageBlueprint[] = [
  { word: '_ـسد', visual: '🦁', question: 'أسد', correct: { label: 'أ' }, distractors: [{ label: 'ب' }, { label: 'ت' }, { label: 'ث' }] },
  { word: '_ـطة', visual: '🐱', question: 'قطة', correct: { label: 'ق' }, distractors: [{ label: 'ف' }, { label: 'ك' }, { label: 'ل' }] },
  { word: '_ـيارة', visual: '🚗', question: 'سيارة', correct: { label: 'س' }, distractors: [{ label: 'ش' }, { label: 'ص' }, { label: 'ض' }] },
  { word: '_ـوز', visual: '🍌', question: 'موز', correct: { label: 'م' }, distractors: [{ label: 'ن' }, { label: 'هـ' }, { label: 'و' }] },
  { word: '_ـفاح', visual: '🍎', question: 'تفاح', correct: { label: 'ت' }, distractors: [{ label: 'ث' }, { label: 'ب' }, { label: 'ي' }] },
  { word: '_ـمل', visual: '🐪', question: 'جمل', correct: { label: 'ج' }, distractors: [{ label: 'ح' }, { label: 'خ' }, { label: 'ع' }] },
  { word: '_ـصان', visual: '🐎', question: 'حصان', correct: { label: 'ح' }, distractors: [{ label: 'ج' }, { label: 'خ' }, { label: 'غ' }] },
  { word: '_ـروف', visual: '🐑', question: 'خروف', correct: { label: 'خ' }, distractors: [{ label: 'ح' }, { label: 'ج' }, { label: 'ف' }] },
  { word: '_ـب', visual: '🐻', question: 'دب', correct: { label: 'د' }, distractors: [{ label: 'ذ' }, { label: 'ر' }, { label: 'ز' }] },
  { word: '_ـئب', visual: '🐺', question: 'ذئب', correct: { label: 'ذ' }, distractors: [{ label: 'د' }, { label: 'ز' }, { label: 'س' }] },
  { word: '_ـيشة', visual: '🪶', question: 'ريشة', correct: { label: 'ر' }, distractors: [{ label: 'ز' }, { label: 'د' }, { label: 'و' }] },
  { word: '_ـرافة', visual: '🦒', question: 'زرافة', correct: { label: 'ز' }, distractors: [{ label: 'ر' }, { label: 'س' }, { label: 'ج' }] },
  { word: '_ـمس', visual: '☀️', question: 'شمس', correct: { label: 'ش' }, distractors: [{ label: 'س' }, { label: 'ص' }, { label: 'ط' }] },
  { word: '_ـقر', visual: '🦅', question: 'صقر', correct: { label: 'ص' }, distractors: [{ label: 'ض' }, { label: 'س' }, { label: 'ش' }] },
  { word: '_ـفدع', visual: '🐸', question: 'ضفدع', correct: { label: 'ض' }, distractors: [{ label: 'ص' }, { label: 'ط' }, { label: 'ظ' }] },
  { word: '_ـائرة', visual: '✈️', question: 'طائرة', correct: { label: 'ط' }, distractors: [{ label: 'ظ' }, { label: 'ت' }, { label: 'د' }] },
  { word: '_ـبي', visual: '🦌', question: 'ظبي', correct: { label: 'ظ' }, distractors: [{ label: 'ط' }, { label: 'ض' }, { label: 'ز' }] },
  { word: '_ـين', visual: '👁️', question: 'عين', correct: { label: 'ع' }, distractors: [{ label: 'غ' }, { label: 'ح' }, { label: 'ء' }] },
  { word: '_ـزالة', visual: '🦌', question: 'غزالة', correct: { label: 'غ' }, distractors: [{ label: 'ع' }, { label: 'ف' }, { label: 'ق' }] },
  { word: '_ـيل', visual: '🐘', question: 'فيل', correct: { label: 'ف' }, distractors: [{ label: 'ق' }, { label: 'ك' }, { label: 'ب' }] },
  { word: '_ـمر', visual: '🌙', question: 'قمر', correct: { label: 'ق' }, distractors: [{ label: 'ف' }, { label: 'ك' }, { label: 'م' }] },
  { word: '_ـتاب', visual: '📖', question: 'كتاب', correct: { label: 'ك' }, distractors: [{ label: 'ق' }, { label: 'ل' }, { label: 'ت' }] },
  { word: '_ـيمون', visual: '🍋', question: 'ليمون', correct: { label: 'ل' }, distractors: [{ label: 'ك' }, { label: 'م' }, { label: 'ن' }] },
  { word: '_ـخلة', visual: '🌴', question: 'نخلة', correct: { label: 'ن' }, distractors: [{ label: 'م' }, { label: 'ب' }, { label: 'ت' }] },
  { word: '_ـرم', visual: '⛺', question: 'هرم', correct: { label: 'هـ' }, distractors: [{ label: 'و' }, { label: 'ع' }, { label: 'م' }] },
  { word: '_ـردة', visual: '🌹', question: 'وردة', correct: { label: 'و' }, distractors: [{ label: 'ر' }, { label: 'د' }, { label: 'ي' }] },
  { word: '_ـد', visual: '✋', question: 'يد', correct: { label: 'ي' }, distractors: [{ label: 'ب' }, { label: 'ت' }, { label: 'ن' }] },
  { word: '_ـرنب', visual: '🐰', question: 'أرنب', correct: { label: 'أ' }, distractors: [{ label: 'ب' }, { label: 'ت' }, { label: 'ج' }] },
  { word: '_ـطة', visual: '🦆', question: 'بطة', correct: { label: 'ب' }, distractors: [{ label: 'ت' }, { label: 'ث' }, { label: 'ن' }] },
  { word: '_ـمساح', visual: '🐊', question: 'تمساح', correct: { label: 'ت' }, distractors: [{ label: 'ث' }, { label: 'ب' }, { label: 'ط' }] },
  { word: '_ـعلب', visual: '🦊', question: 'ثعلب', correct: { label: 'ث' }, distractors: [{ label: 'ت' }, { label: 'س' }, { label: 'ش' }] },
  { word: '_ـبل', visual: '🏔️', question: 'جبل', correct: { label: 'ج' }, distractors: [{ label: 'ح' }, { label: 'خ' }, { label: 'د' }] },
  { word: '_ـوت', visual: '🐋', question: 'حوت', correct: { label: 'ح' }, distractors: [{ label: 'ج' }, { label: 'خ' }, { label: 'هـ' }] },
  { word: '_ـبز', visual: '🍞', question: 'خبز', correct: { label: 'خ' }, distractors: [{ label: 'ح' }, { label: 'ج' }, { label: 'ك' }] },
  { word: '_ـراجة', visual: '🚲', question: 'دراجة', correct: { label: 'د' }, distractors: [{ label: 'ذ' }, { label: 'ر' }, { label: 'ز' }] },
  { word: '_ـرة', visual: '🌽', question: 'ذرة', correct: { label: 'ذ' }, distractors: [{ label: 'د' }, { label: 'ز' }, { label: 'ر' }] },
  { word: '_ـجل', visual: '👨', question: 'رجل', correct: { label: 'ر' }, distractors: [{ label: 'ز' }, { label: 'د' }, { label: 'ل' }] },
  { word: '_ـيتون', visual: '🫒', question: 'زيتون', correct: { label: 'ز' }, distractors: [{ label: 'ر' }, { label: 'س' }, { label: 'ص' }] },
  { word: '_ـمكة', visual: '🐟', question: 'سمكة', correct: { label: 'س' }, distractors: [{ label: 'ش' }, { label: 'ص' }, { label: 'ض' }] },
  { word: '_ـجرة', visual: '🌳', question: 'شجرة', correct: { label: 'ش' }, distractors: [{ label: 'س' }, { label: 'ج' }, { label: 'ص' }] },
  { word: '_ـابون', visual: '🧼', question: 'صابون', correct: { label: 'ص' }, distractors: [{ label: 'س' }, { label: 'ض' }, { label: 'ط' }] },
  { word: '_ـابط', visual: '👮', question: 'ضابط', correct: { label: 'ض' }, distractors: [{ label: 'ص' }, { label: 'ط' }, { label: 'ظ' }] },
  { word: '_ـبل', visual: '🥁', question: 'طبل', correct: { label: 'ط' }, distractors: [{ label: 'ت' }, { label: 'ظ' }, { label: 'د' }] },
  { word: '_ـرف', visual: '✉️', question: 'ظرف', correct: { label: 'ظ' }, distractors: [{ label: 'ط' }, { label: 'ض' }, { label: 'ز' }] },
  { word: '_ـصفور', visual: '🐦', question: 'عصفور', correct: { label: 'ع' }, distractors: [{ label: 'غ' }, { label: 'أ' }, { label: 'ص' }] },
  { word: '_ـيمة', visual: '☁️', question: 'غيمة', correct: { label: 'غ' }, distractors: [{ label: 'ع' }, { label: 'ف' }, { label: 'ق' }] },
  { word: '_ـراولة', visual: '🍓', question: 'فراولة', correct: { label: 'ف' }, distractors: [{ label: 'ق' }, { label: 'ب' }, { label: 'ت' }] },
  { word: '_ـطار', visual: '🚆', question: 'قطار', correct: { label: 'ق' }, distractors: [{ label: 'ك' }, { label: 'ف' }, { label: 'ط' }] },
  { word: '_ـلب', visual: '🐶', question: 'كلب', correct: { label: 'ك' }, distractors: [{ label: 'ق' }, { label: 'ل' }, { label: 'م' }] },
  { word: '_ـحم', visual: '🥩', question: 'لحم', correct: { label: 'ل' }, distractors: [{ label: 'ك' }, { label: 'م' }, { label: 'ن' }] },
];

// Helper to construct stages for games 11 through 40 based on realistic, thematic datasets
export const getGame50Stages = (gameId: number): ChildSkillChallenge[] => {
  switch (gameId) {
    case 1:
      return generateGame1Stages();
    case 2:
      return generateGame2Stages();
    case 3:
      return generateGame3Stages();
    case 4:
      return generateGame4Stages();
    case 5:
      return generateGame5Stages();
    case 6:
      return generateGame6Stages();
    case 7:
      return generateGame7Stages();
    case 8:
      return generateGame8Stages();
    case 9:
      return generateGame9Stages();
    case 10:
      return generateGame10Stages();

    case 11: // الحرف المفقود
      return build50FromBlueprints(
        11,
        (s, bp) => `المرحلة ${s}: ما هو الحرف المفقود في كلمة (${bp.word})؟`,
        GAME_11_DATA
      );

    case 12: // أكمل الكلمة
      return GAME_11_DATA.map((item, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        return {
          id: `g12_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: أكمل الكلمة التي تعبر عن الصورة:`,
          type: 'choice',
          targetVisual: item.visual,
          data: {
            word: item.word,
            options: [
              { id: '1', visual: item.visual, label: item.question, isCorrect: true },
              { id: '2', visual: '❓', label: `كلمة أخرى ${stageNum}`, isCorrect: false },
              { id: '3', visual: '❓', label: `كلمة بديلة ${stageNum}`, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 13: // طابق الحرف بالصورة
      return GAME_11_DATA.map((item, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const dist1 = GAME_11_DATA[(idx + 5) % 50];
        const dist2 = GAME_11_DATA[(idx + 13) % 50];
        return {
          id: `g13_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: أي صورة تبدأ بحرف (${item.correct.label})؟`,
          type: 'choice',
          data: {
            word: item.correct.label,
            options: [
              { id: '1', visual: item.visual, label: item.question, isCorrect: true },
              { id: '2', visual: dist1.visual, label: dist1.question, isCorrect: false },
              { id: '3', visual: dist2.visual, label: dist2.question, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 14: // رتب الأرقام
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const start = (idx % 10) + 1;
        const count = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5;
        const sequence = Array.from({ length: count }).map((_, i) => String(start + i));
        const scrambled = [...sequence].sort(() => 0.5 - Math.random());
        return {
          id: `g14_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: رتب الأرقام من الأصغر إلى الأكبر بالضغط عليها بالترتيب:`,
          type: 'ordering',
          data: {
            items: sequence,
            scrambled,
          },
        };
      });

    case 15: // الكبير والصغير
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const item = MATCH_ITEMS_50[idx % MATCH_ITEMS_50.length];
        const askBig = idx % 2 === 0;
        return {
          id: `g15_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: اضغط على ${askBig ? 'الشكل الأكبر 🐘' : 'الشكل الأصغر 🐜'}:`,
          type: 'size_compare',
          data: {
            visual: item.visual,
            items: [
              { id: '1', scale: 'lg', label: 'كبير', isCorrect: askBig },
              { id: '2', scale: 'sm', label: 'صغير', isCorrect: !askBig },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 16: // أكثر أم أقل
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const countA = (idx % 5) + 2;
        const countB = countA + 2;
        const askMore = idx % 2 === 0;
        const targetGroup = askMore ? 'B' : 'A';
        const item = MATCH_ITEMS_50[idx % MATCH_ITEMS_50.length];
        return {
          id: `g16_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: أين توجد كمية ${askMore ? 'أكثر ➕' : 'أقل ➖'}؟`,
          type: 'quantity_compare',
          data: {
            correct: targetGroup,
            groupA: { count: countA, visual: item.visual, label: `المجموعة أ (${countA})` },
            groupB: { count: countB, visual: item.visual, label: `المجموعة ب (${countB})` },
          },
        };
      });

    case 17: // من صاحب الأثر؟
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const item = MATCH_ITEMS_50[idx % MATCH_ITEMS_50.length];
        const dist = MATCH_ITEMS_50[(idx + 3) % MATCH_ITEMS_50.length];
        return {
          id: `g17_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: لمن هذا الأثر أو المسكن؟ 🐾`,
          type: 'choice',
          targetVisual: '🐾',
          targetLabel: `أثر قدم حيوان لطيف`,
          data: {
            options: [
              { id: '1', visual: item.visual, label: item.label, isCorrect: true },
              { id: '2', visual: dist.visual, label: dist.label, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 18: // أين يعيش؟
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const habitats = [
          { animal: 'السمكة', animalVisual: '🐠', habitat: 'في أعماق البحر 🌊', wrong: 'في الصحراء 🏜️' },
          { animal: 'الجمل', animalVisual: '🐪', habitat: 'في رمال الصحراء 🏜️', wrong: 'في المحيط 🌊' },
          { animal: 'القرد', animalVisual: '🐒', habitat: 'فوق أشجار الغابة 🌴', wrong: 'في القطب المتجمد ❄️' },
          { animal: 'البطريق', animalVisual: '🐧', habitat: 'في الجليد والبرد ❄️', wrong: 'في الصحراء الحارة 🏜️' },
          { animal: 'العصفور', animalVisual: '🐦', habitat: 'في العش فوق الشجرة 🌳', wrong: 'تحت الماء 🌊' },
        ];
        const cur = habitats[idx % habitats.length];
        return {
          id: `g18_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: أين يعيش (${cur.animal}) ${cur.animalVisual}؟`,
          type: 'choice',
          targetVisual: cur.animalVisual,
          targetLabel: cur.animal,
          data: {
            options: [
              { id: '1', visual: '🏡', label: cur.habitat, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 19: // فاكهة أم خضار؟
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const items = [
          { name: 'تفاح', visual: '🍎', isFruit: true },
          { name: 'جزر', visual: '🥕', isFruit: false },
          { name: 'موز', visual: '🍌', isFruit: true },
          { name: 'خيار', visual: '🥒', isFruit: false },
          { name: 'فراولة', visual: '🍓', isFruit: true },
          { name: 'طماطم', visual: '🍅', isFruit: false },
          { name: 'برتقال', visual: '🍊', isFruit: true },
          { name: 'بروكلي', visual: '🥦', isFruit: false },
          { name: 'عنب', visual: '🍇', isFruit: true },
          { name: 'ذرة', visual: '🌽', isFruit: false },
        ];
        const cur = items[idx % items.length];
        return {
          id: `g19_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: هل (${cur.name}) ${cur.visual} فاكهة أم خضار؟`,
          type: 'choice',
          targetVisual: cur.visual,
          targetLabel: cur.name,
          data: {
            options: [
              { id: '1', visual: '🍎', label: 'فاكهة لذيذة', isCorrect: cur.isFruit },
              { id: '2', visual: '🥕', label: 'خضار مفيد', isCorrect: !cur.isFruit },
            ],
          },
        };
      });

    case 20: // ضع الشيء في مكانه
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const placements = [
          { item: 'الحليب البارد', visual: '🥛', place: 'في الثلاجة 🧊', wrong: 'في خزانة الملابس 👕' },
          { item: 'القميص النظيف', visual: '👕', place: 'في الخزانة 🚪', wrong: 'في الفرن الساخن 🔥' },
          { item: 'السيارة', visual: '🚗', place: 'في كراج السيارات 🅿️', wrong: 'في غرفة النوم 🛏️' },
          { item: 'كتاب القراءة', visual: '📚', place: 'على رف المكتبة 📖', wrong: 'في حوض الاستحمام 🛁' },
          { item: 'الوسادة المريحة', visual: '🛏️', place: 'فوق السرير 🛌', wrong: 'في المطبخ 🍳' },
        ];
        const cur = placements[idx % placements.length];
        return {
          id: `g20_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: أين نضع (${cur.item}) ${cur.visual} في مكانه الصحيح؟`,
          type: 'choice',
          targetVisual: cur.visual,
          targetLabel: cur.item,
          data: {
            options: [
              { id: '1', visual: '✅', label: cur.place, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 21: // ما وسيلة النقل؟
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const transport = [
          { name: 'طائرة سريعة', visual: '✈️', type: 'تطير في السماء ☁️', wrong: 'تسير في البحر 🌊' },
          { name: 'سفينة ضخمة', visual: '🚢', type: 'تبحر في الماء 🌊', wrong: 'تسير على القضبان 🚆' },
          { name: 'قطار سريع', visual: '🚆', type: 'يسير على سكة الحديد 🛤️', wrong: 'يطير في الفضاء 🚀' },
          { name: 'سيارة مريحة', visual: '🚗', type: 'تسير على الطريق البري 🛣️', wrong: 'تبحر تحت الماء 🌊' },
          { name: 'صاروخ فضائي', visual: '🚀', type: 'ينطلق نحو الفضاء والنجوم 🌌', wrong: 'يسير في الشارع 🚗' },
        ];
        const cur = transport[idx % transport.length];
        return {
          id: `g21_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: أين تسير أو تعمل (${cur.name}) ${cur.visual}؟`,
          type: 'choice',
          targetVisual: cur.visual,
          targetLabel: cur.name,
          data: {
            options: [
              { id: '1', visual: '✅', label: cur.type, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 22: // أين ينتمي؟
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const rooms = [
          { item: 'السبورة والطباشير', visual: '📋', room: 'في المدرسة والصف 🏫', wrong: 'في المطبخ 🍳' },
          { item: 'المقلاة والملعقة', visual: '🍳', room: 'في مطبخ البيت 🍲', wrong: 'في الحمام 🛁' },
          { item: 'فرشاة الأسنان والمعجون', visual: '🪥', room: 'في الحمام 🚿', wrong: 'في حديقة الألعاب 🎡' },
          { item: 'سماعة الفحص الطبي', visual: '🩺', room: 'في عيادة الطبيب 🏥', wrong: 'في صالون الألعاب 🎮' },
          { item: 'الدبدوب وألعاب المكعبات', visual: '🧸', room: 'في غرفة ألعاب الأطفال 🎈', wrong: 'في الشارع العام 🚗' },
        ];
        const cur = rooms[idx % rooms.length];
        return {
          id: `g22_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: إلى أي مكان ينتمي (${cur.item}) ${cur.visual}؟`,
          type: 'choice',
          targetVisual: cur.visual,
          targetLabel: cur.item,
          data: {
            options: [
              { id: '1', visual: '📍', label: cur.room, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 23: // طابق الظل
      return generateGame3Stages().map((stg, i) => ({
        ...stg,
        id: `g23_s${i + 1}`,
        instruction: `المرحلة ${i + 1}: طابق الظل الأسود بالصورة الملونة المطابقة تماماً:`,
      }));

    case 24: // اعثر على الشيء
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const target = MATCH_ITEMS_50[idx % MATCH_ITEMS_50.length];
        const pool = [target.visual, '⚽', '🚗', '🐱', '🍎', '⭐', '🎈', '🌻', '🍦'].sort(() => 0.5 - Math.random());
        return {
          id: `g24_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: اعثر على (${target.label}) ${target.visual} بين العناصر واضغط عليه:`,
          type: 'find_hidden',
          data: {
            target: target.visual,
            items: pool,
          },
        };
      });

    case 25: // ابحث عن الشكل المخفي
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const target = SHAPES_50[idx % SHAPES_50.length];
        const items = ['⚪', '⏹️', '🔺', '⭐', '❤️', '🥚', '🌙', '▭', target.shapeEmoji].sort(() => 0.5 - Math.random());
        return {
          id: `g25_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: ابحث عن الشكل المخفي (${target.shape}) ${target.shapeEmoji} واضغط عليه:`,
          type: 'find_hidden',
          data: {
            target: target.shapeEmoji,
            items,
          },
        };
      });

    case 26: // ماذا يأتي بعد ذلك؟
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const patterns = [
          { seq: '🔴 🔵 🔴 🔵 [?]', correct: '🔴', wrong: '🔵' },
          { seq: '🍎 🍌 🍎 🍌 [?]', correct: '🍎', wrong: '🍌' },
          { seq: '⭐ 🌙 ⭐ 🌙 [?]', correct: '⭐', wrong: '🌙' },
          { seq: '🚗 🚌 🚗 🚌 [?]', correct: '🚗', wrong: '🚌' },
          { seq: '🐱 🐶 🐱 🐶 [?]', correct: '🐱', wrong: '🐶' },
        ];
        const cur = patterns[idx % patterns.length];
        return {
          id: `g26_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: ماذا يأتي بعد ذلك في النمط: ${cur.seq}؟`,
          type: 'choice',
          data: {
            word: cur.seq,
            options: [
              { id: '1', visual: cur.correct, label: 'الرمز التالي', isCorrect: true },
              { id: '2', visual: cur.wrong, label: 'خيار آخر', isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 27: // رتب الأحداث
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const stories = [
          { title: 'نمو النبتة', steps: ['بذرة في التربة 🌱', 'سقي بالماء والشمس 💧', 'نبتة وزهرة جميلة 🌸'] },
          { title: 'تناول الفطور', steps: ['غسل اليدين 🧼', 'تناول الطعام اللذيذ 🥪', 'تنظيف الأسنان 🪥'] },
          { title: 'الذهاب للمدرسة', steps: ['الاستيقاظ صباحاً ⏰', 'ارتداء الزي المدرسي 👕', 'ركوب الحافلة 🚌'] },
          { title: 'صنع العصير', steps: ['غسل الفواكه 🍊', 'عصر البرتقال 🥤', 'شرب العصير الطازج 🍹'] },
          { title: 'رسم اللوحة', steps: ['تجهيز الورقة والألوان 🎨', 'رسم الأشكال الجميلة ✏️', 'تعليق اللوحة بفخر 🖼️'] },
        ];
        const cur = stories[idx % stories.length];
        return {
          id: `g27_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: رتب خطوات (${cur.title}) بالترتيب الصحيح من البداية:`,
          type: 'ordering',
          data: {
            items: cur.steps,
            scrambled: [...cur.steps].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 28: // ماذا نفعل؟ (الآداب والسلوك)
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const scenarios = [
          { q: 'عندما نرى صديقاً حزيناً يبكي:', right: 'نواسيه ونبتسم له بلطف 😊', wrong: 'نتركه ونضحك عليه ❌' },
          { q: 'عندما يعطينا شخص هدية جميلة:', right: 'نقول له: شكراً جزيلاً لك 🎁', wrong: 'نأخذها بدون أي كلمة ❌' },
          { q: 'عندما ننتهي من اللعب بألعابنا:', right: 'نرتب الألعاب في صندوقها 📦', wrong: 'نتركها مبعثرة على الأرض ❌' },
          { q: 'قبل أن نأكل طعامنا الشهي:', right: 'نغسل أيدينا ونقول: بسم الله 🤲', wrong: 'نأكل بأيدٍ متسخة ❌' },
          { q: 'عندما نريد عبور الشارع بأمان:', right: 'نمسك يد أمنا وننظر يميناً ويساراً 🚸', wrong: 'نجري بسرعة دون انتباه ❌' },
        ];
        const cur = scenarios[idx % scenarios.length];
        return {
          id: `g28_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: ${cur.q}`,
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🌟', label: cur.right, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 29: // العادات الصحية
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const habits = [
          { q: 'كيف نحافظ على نظافة أسناننا من التسوس؟', right: 'نفرشيها بالمعجون مرتين يومياً 🪥', wrong: 'نأكل الكثير من السكاكر 🍭' },
          { q: 'ماذا نفعل لنشعر بالنشاط والتركيز صباحاً؟', right: 'ننام مبكراً ونستيقظ بنشاط 🌙', wrong: 'نسهر لوقت متأخر أمام الشاشات 📱' },
          { q: 'ما أفضل مشروب يروي جسمنا بالصحة؟', right: 'شرب الماء النقي بكثرة 💧', wrong: 'المشروبات الغازية الملونة 🥤' },
          { q: 'كيف نحمي أيدينا من الجراثيم قبل الطعام؟', right: 'غسلها جيداً بالماء والصابون 🧼', wrong: 'مسحها بالملابس ❌' },
          { q: 'ماذا نفعل للحفاظ على لياقة وقوة أجسامنا؟', right: 'ممارسة الرياضة والحركة 🏃', wrong: 'الجلوس طوال اليوم دون حركة 🛋️' },
        ];
        const cur = habits[idx % habits.length];
        return {
          id: `g29_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: ${cur.q}`,
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '💚', label: cur.right, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 30: // الطعام الصحي
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const foods = [
          { healthy: 'تفاحة طازجة 🍎', junk: 'حلوى مصاصة 🍭' },
          { healthy: 'حليب دافئ 🥛', junk: 'مشروب غازي 🥤' },
          { healthy: 'سلطة خضراء 🥗', junk: 'بطاطس شيبس مقلية 🍟' },
          { healthy: 'جزر مقرمش 🥕', junk: 'دونات بالسكر 🍩' },
          { healthy: 'سمك مشوي مفيد 🐟', junk: 'برغر مليء بالدهون 🍔' },
        ];
        const cur = foods[idx % foods.length];
        return {
          id: `g30_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: أي من هذين الخيارين طعام صحي ومفيد لجسمنا؟`,
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🥗', label: cur.healthy, isCorrect: true },
              { id: '2', visual: '🍟', label: cur.junk, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 31: // أعضاء الجسم والحواس
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const senses = [
          { sense: 'بماذا نرى الألوان والمناظر الجميلة؟', organ: 'العين 👁️', wrong: 'الأذن 👂' },
          { sense: 'بماذا نسمع أصوات العصافير والموسيقى؟', organ: 'الأذن 👂', wrong: 'الأنف 👃' },
          { sense: 'بماذا نشم رائحة الورد والزهور؟', organ: 'الأنف 👃', wrong: 'الفم 👄' },
          { sense: 'بماذا نتذوق طعامنا اللذيذ؟', organ: 'اللسان 👅', wrong: 'العين 👁️' },
          { sense: 'بماذا نلمس الأشياء ونشعر بنعومتها؟', organ: 'اليدين والأصابع ✋', wrong: 'القدم 🦶' },
          { sense: 'بماذا نمشي ونجري ونقفز؟', organ: 'القدمين والساقين 🦶', wrong: 'اليدين ✋' },
        ];
        const cur = senses[idx % senses.length];
        return {
          id: `g31_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: ${cur.sense}`,
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '✨', label: cur.organ, isCorrect: true },
              { id: '2', visual: '❓', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 32: // ماذا نستخدم؟
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const tools = [
          { task: 'لقص الورق والكرتون بأمان:', tool: 'المقص المخصص ✂️', wrong: 'الملعقة 🥄' },
          { task: 'لتناول الشوربة الساخنة:', tool: 'الملعقة 🥄', wrong: 'الشوكة 🍴' },
          { task: 'لتمشيط شعرنا وترتيبه:', tool: 'المشط والفرشاة 🪮', wrong: 'المسطرة 📏' },
          { task: 'لكتابة واجبنا ورسم الأشكال:', tool: 'قلم الرصاص ✏️', wrong: 'الممسحة 🧽' },
          { task: 'لتنظيف الأرض من الغبار:', tool: 'المكنسة 🧹', wrong: 'المفتاح 🔑' },
        ];
        const cur = tools[idx % tools.length];
        return {
          id: `g32_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: ماذا نستخدم ${cur.task}؟`,
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🛠️', label: cur.tool, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 33: // من يعمل هنا؟
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const places = [
          { place: 'في المستشفى يعالج المرضى:', worker: 'الطبيب والممرض 👨‍⚕️', wrong: 'النجار 🔨' },
          { place: 'في المدرسة يعلم الأطفال:', worker: 'المعلم والمعلمة 👨‍🏫', wrong: 'رجل الإطفاء 🚒' },
          { place: 'في مركز الإطفاء يخمد الحرائق:', worker: 'رجل الإطفاء الشجاع 👨‍🚒', wrong: 'الطيار ✈️' },
          { place: 'في المطبخ يطهو أشهى الوجبات:', worker: 'الطاهي الشيف 👨‍🍳', wrong: 'الشرطي 👮' },
          { place: 'في الحقل والمزرعة يزرع القمح:', worker: 'المزارع النشيط 🧑‍🌾', wrong: 'رائد الفضاء 🧑‍🚀' },
        ];
        const cur = places[idx % places.length];
        return {
          id: `g33_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: من يعمل ${cur.place}؟`,
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🌟', label: cur.worker, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 34: // طابق المهنة
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const jobs = [
          { job: 'الطبيب', tool: 'سماعة الفحص 🩺', wrong: 'المنشار 🪚' },
          { job: 'الرسام والفنان', tool: 'لوحة الألوان والفرشاة 🎨', wrong: 'المطرقة 🔨' },
          { job: 'رجل الإطفاء', tool: 'خرطوم المياه وشاحنة الإطفاء 🚒', wrong: 'الملعقة 🥄' },
          { job: 'الشرطي', tool: 'شارة وصفارة المرور 👮', wrong: 'المشرط 🩺' },
          { job: 'رائد الفضاء', tool: 'خوذة وبدلة الفضاء 🧑‍🚀', wrong: 'المشط 🪮' },
        ];
        const cur = jobs[idx % jobs.length];
        return {
          id: `g34_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: ما هي الأداة الخاصة بـ (${cur.job})؟`,
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '💼', label: cur.tool, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 35: // ما الأداة المناسبة؟
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const tasks = [
          { situation: 'لتثبيت مسمار في لوح خشبي:', tool: 'المطرقة 🔨', wrong: 'المقص ✂️' },
          { situation: 'لسقي أزهار الحديقة بالماء:', tool: 'مرش الماء 🚿', wrong: 'المكنسة 🧹' },
          { situation: 'لرؤية النجوم والكواكب البعيدة:', tool: 'التلسكوب الفضائي 🔭', wrong: 'النظارة الشمسية 🕶️' },
          { situation: 'لتكبير الحشرات الصغيرة ودراستها:', tool: 'العدسة المكبرة 🔍', wrong: 'المسطرة 📏' },
          { situation: 'لقياس طول الدفتر بدقة:', tool: 'المسطرة بالسنتيمتر 📏', wrong: 'القلم ✏️' },
        ];
        const cur = tasks[idx % tasks.length];
        return {
          id: `g35_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: ما هي الأداة المناسبة ${cur.situation}؟`,
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '⚙️', label: cur.tool, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 36: // طقس اليوم
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const weathers = [
          { weather: 'يوم ممطر وماء ينزل من السحاب 🌧️', gear: 'نحمل المظلة ونرتدي معطف المطر ☂️', wrong: 'نرتدي نظارة شمسية 🕶️' },
          { weather: 'يوم مشمس وحرارة عالية ☀️', gear: 'نرتدي قبعة شمس ونظارة شمسية 🧢', wrong: 'نرتدي كنزة صوف ثقيلة 🧥' },
          { weather: 'يوم مثلج والثلج أبيض وبارد ❄️', gear: 'نرتدي قفازات ووشاحاً دافئاً 🧤', wrong: 'نرتدي ملابس صيفية خفيفة 🩳' },
          { weather: 'يوم عاصف ورياح قوية 💨', gear: 'نطير الطائرة الورقية ونغلق النوافذ 🪁', wrong: 'نفتح مظلة خفيفة بالهواء ☂️' },
        ];
        const cur = weathers[idx % weathers.length];
        return {
          id: `g36_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: في (${cur.weather})، ماذا نرتدي أو نفعل؟`,
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🌈', label: cur.gear, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 37: // ماذا يحتاج النبات؟
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const needs = [
          { plant: 'لكي تنمو الزهرة وتكبر خضراء:', need: 'الماء والضوء والشمس 💧☀️', wrong: 'العصير والشوكولاتة 🍫' },
          { plant: 'لكي تعيش الأسماك سعيدة وسالمة:', need: 'ماء بحري نظيف 🌊', wrong: 'رمال الصحراء الجافة 🏜️' },
          { plant: 'لكي تنبت البذرة الصغيرة جذورها:', need: 'تربة خصبة ورطبة 🪴', wrong: 'أرض إسمنتية صلبة 🧱' },
          { plant: 'ماذا يحتاج الطائر ليبني عشه؟', need: 'أغصان وقش الحديقة 🪺', wrong: 'مكعبات حديدية ثقيلة 🔩' },
        ];
        const cur = needs[idx % needs.length];
        return {
          id: `g37_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: ${cur.plant}`,
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🌱', label: cur.need, isCorrect: true },
              { id: '2', visual: '❌', label: cur.wrong, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    case 38: // تحدي السرعة
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const target = MATCH_ITEMS_50[idx % MATCH_ITEMS_50.length];
        const count = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5;
        const items = [
          ...Array.from({ length: count }).map((_, i) => ({ id: `t_${i}`, visual: target.visual, isTarget: true })),
          ...Array.from({ length: 4 }).map((_, i) => ({ id: `d_${i}`, visual: '⚪', isTarget: false })),
        ].sort(() => 0.5 - Math.random());

        return {
          id: `g38_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: اضغط بسرعة على جميع (${target.label}) ${target.visual} الموجودة (${count} عناصر)!`,
          type: 'speed_tap',
          data: { items },
        };
      });

    case 39: // اجمع النجوم
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const count = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5;
        const items = [
          ...Array.from({ length: count }).map((_, i) => ({ id: `s_${i}`, visual: '⭐', isTarget: true })),
          ...Array.from({ length: 3 }).map((_, i) => ({ id: `c_${i}`, visual: '☁️', isTarget: false })),
        ].sort(() => 0.5 - Math.random());

        return {
          id: `g39_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum}: اجمع كل النجوم الذهبية اللامعة ⭐ بالضغط عليها (${count} نجوم)!`,
          type: 'find_multi',
          data: { items },
        };
      });

    case 40: // مغامرة مهارات طفلي الصغير (المراحل الـ 50)
      return Array.from({ length: 50 }).map((_, idx) => {
        const stageNum = idx + 1;
        const diff = getDifficulty(idx);
        const item = MATCH_ITEMS_50[idx % MATCH_ITEMS_50.length];
        const dist = MATCH_ITEMS_50[(idx + 4) % MATCH_ITEMS_50.length];
        const trailIcons = ['🚩', '🌲', '🏰'];

        return {
          id: `g40_s${stageNum}`,
          stageNumber: stageNum,
          difficulty: diff,
          instruction: `المرحلة ${stageNum} من مغامرة البطل: اختر بطاقة الطريق (${item.label}) لتواصل التقدم! 🗺️`,
          type: 'adventure',
          data: {
            step: Math.min(3, (idx % 3) + 1),
            trailIcons,
            options: [
              { id: '1', visual: item.visual, label: item.label, isCorrect: true },
              { id: '2', visual: dist.visual, label: dist.label, isCorrect: false },
            ].sort(() => 0.5 - Math.random()),
          },
        };
      });

    default:
      return generateGame1Stages();
  }
};
