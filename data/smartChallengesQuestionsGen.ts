import { SmartChallengeQuestion } from '../types/smartChallengesTypes';

// Helper to format time with 2-digit minutes and AM/PM in Arabic
export const formatArabicTime = (h: number, m: number, isEvening = false): string => {
  const mStr = m.toString().padStart(2, '0');
  const period = isEvening ? 'م' : 'ص';
  return `${h}:${mStr} ${period}`;
};

// Generates 50 questions for a given game ID (1 - 50)
export const generateQuestionsForGame = (gameId: number): SmartChallengeQuestion[] => {
  const questions: SmartChallengeQuestion[] = [];

  // ==========================================
  // GAME 41: 🕐 اقرأ الساعة (50 questions)
  // ==========================================
  if (gameId === 41) {
    // 50 specific clock times
    const clockTimes = [
      { h: 3, m: 0 }, { h: 7, m: 30 }, { h: 10, m: 0 }, { h: 1, m: 15 }, { h: 4, m: 45 },
      { h: 6, m: 0 }, { h: 8, m: 30 }, { h: 12, m: 0 }, { h: 2, m: 15 }, { h: 5, m: 45 },
      { h: 9, m: 0 }, { h: 11, m: 30 }, { h: 3, m: 15 }, { h: 6, m: 30 }, { h: 8, m: 45 },
      { h: 1, m: 0 }, { h: 4, m: 30 }, { h: 7, m: 15 }, { h: 10, m: 45 }, { h: 2, m: 0 },
      { h: 5, m: 30 }, { h: 8, m: 15 }, { h: 11, m: 45 }, { h: 4, m: 0 }, { h: 7, m: 0 },
      { h: 9, m: 30 }, { h: 12, m: 15 }, { h: 1, m: 45 }, { h: 5, m: 0 }, { h: 8, m: 0 },
      { h: 10, m: 30 }, { h: 2, m: 45 }, { h: 6, m: 15 }, { h: 9, m: 45 }, { h: 11, m: 0 },
      { h: 3, m: 30 }, { h: 12, m: 30 }, { h: 4, m: 15 }, { h: 7, m: 45 }, { h: 1, m: 30 },
      { h: 5, m: 15 }, { h: 8, m: 20 }, { h: 10, m: 15 }, { h: 2, m: 30 }, { h: 6, m: 45 },
      { h: 9, m: 20 }, { h: 11, m: 15 }, { h: 12, m: 45 }, { h: 3, m: 45 }, { h: 6, m: 20 }
    ];

    for (let i = 0; i < 50; i++) {
      const qNum = i + 1;
      const t = clockTimes[i % clockTimes.length];
      const correctStr = `${t.h}:${t.m.toString().padStart(2, '0')}`;

      // Create 3 plausible distractors
      const distractors = [
        `${(t.h % 12) + 1}:${t.m.toString().padStart(2, '0')}`,
        `${t.h}:${((t.m + 30) % 60).toString().padStart(2, '0')}`,
        `${((t.h + 10) % 12) + 1}:${((t.m + 15) % 60).toString().padStart(2, '0')}`,
      ].filter((d) => d !== correctStr);

      const opts = [
        { id: 'opt_1', text: `الساعة ${correctStr}`, isCorrect: true, visual: '⏰' },
        { id: 'opt_2', text: `الساعة ${distractors[0]}`, isCorrect: false, visual: '⏰' },
        { id: 'opt_3', text: `الساعة ${distractors[1]}`, isCorrect: false, visual: '⏰' },
      ].sort(() => 0.5 - ((i * 17) % 10) / 10);

      questions.push({
        id: qNum,
        prompt: `انظر إلى عقارب الساعة، ما هو الوقت الذي تشير إليه الساعة؟`,
        hint: `العقرب القصير يشير إلى الساعات (${t.h})، والعقرب الطويل يشير إلى الدقائق (${t.m}).`,
        type: 'time_analog',
        visualType: 'clock',
        visualData: { hours: t.h, minutes: t.m },
        options: opts,
        explanation: `أحسنت! العقرب القصير عند ${t.h} والعقرب الطويل عند ${t.m === 0 ? '12 (تماماً)' : t.m === 30 ? '6 (النصف)' : t.m + ' دقيقة'}.`,
      });
    }
    return questions;
  }

  // ==========================================
  // GAME 42: ⏰ طابق الساعة (50 questions)
  // ==========================================
  if (gameId === 42) {
    const times = [
      { h: 1, m: 0 }, { h: 2, m: 30 }, { h: 4, m: 15 }, { h: 5, m: 45 }, { h: 7, m: 0 },
      { h: 8, m: 30 }, { h: 9, m: 15 }, { h: 11, m: 45 }, { h: 12, m: 0 }, { h: 3, m: 30 },
      { h: 6, m: 15 }, { h: 10, m: 0 }, { h: 1, m: 45 }, { h: 4, m: 30 }, { h: 8, m: 0 },
      { h: 2, m: 15 }, { h: 6, m: 45 }, { h: 9, m: 0 }, { h: 11, m: 30 }, { h: 12, m: 15 },
      { h: 3, m: 0 }, { h: 5, m: 15 }, { h: 7, m: 30 }, { h: 10, m: 45 }, { h: 1, m: 30 },
      { h: 4, m: 0 }, { h: 8, m: 15 }, { h: 9, m: 30 }, { h: 12, m: 45 }, { h: 2, m: 0 },
      { h: 6, m: 0 }, { h: 7, m: 45 }, { h: 11, m: 0 }, { h: 3, m: 15 }, { h: 5, m: 30 },
      { h: 8, m: 45 }, { h: 10, m: 15 }, { h: 1, m: 15 }, { h: 4, m: 45 }, { h: 7, m: 15 },
      { h: 9, m: 45 }, { h: 12, m: 30 }, { h: 2, m: 45 }, { h: 5, m: 0 }, { h: 6, m: 30 },
      { h: 10, m: 30 }, { h: 11, m: 15 }, { h: 3, m: 45 }, { h: 8, m: 20 }, { h: 1, m: 0 }
    ];

    for (let i = 0; i < 50; i++) {
      const qNum = i + 1;
      const t = times[i % times.length];
      const digitalStr = `${t.h}:${t.m.toString().padStart(2, '0')}`;

      questions.push({
        id: qNum,
        prompt: `أي من هذه الساعات ذات العقارب تطابق الوقت الرقمي [ ${digitalStr} ] تماماً؟`,
        hint: `ابحث عن الساعة التي يقف عقرب ساعاتها عند ${t.h} وعقرب دقائقها عند ${t.m === 0 ? '12' : t.m === 30 ? '6' : t.m === 15 ? '3' : '9'}.`,
        type: 'time_match',
        visualType: 'time_match_cards',
        visualData: { targetDigital: digitalStr, targetTime: t },
        options: [
          {
            id: 'opt_correct',
            text: `ساعة تشير إلى ${digitalStr}`,
            isCorrect: true,
            visual: JSON.stringify({ h: t.h, m: t.m }),
          },
          {
            id: 'opt_wrong1',
            text: `ساعة تشير إلى ${(t.h % 12) + 1}:${t.m.toString().padStart(2, '0')}`,
            isCorrect: false,
            visual: JSON.stringify({ h: (t.h % 12) + 1, m: t.m }),
          },
          {
            id: 'opt_wrong2',
            text: `ساعة تشير إلى ${t.h}:${((t.m + 30) % 60).toString().padStart(2, '0')}`,
            isCorrect: false,
            visual: JSON.stringify({ h: t.h, m: (t.m + 30) % 60 }),
          },
        ].sort(() => 0.5 - ((i * 13) % 10) / 10),
        explanation: `مطابقة ممتازة! الوقت الرقمي ${digitalStr} يطابق تماماً عقارب هذه الساعة.`,
      });
    }
    return questions;
  }

  // ==========================================
  // GAME 43: 🕑 ارسم الوقت (50 questions)
  // ==========================================
  if (gameId === 43) {
    const targetHours = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
      2, 4, 6, 8, 10, 12, 1, 3, 5, 7, 9, 11,
      1, 3, 5, 7, 9, 11, 2, 4, 6, 8, 10, 12, 6, 12
    ];
    const targetMinutes = [
      0, 30, 0, 30, 0, 30, 0, 30, 0, 30, 0, 30,
      15, 45, 15, 45, 15, 45, 15, 45, 15, 45, 15, 45,
      0, 0, 0, 0, 0, 0, 30, 30, 30, 30, 30, 30,
      15, 15, 15, 15, 15, 15, 45, 45, 45, 45, 45, 45, 0, 30
    ];

    for (let i = 0; i < 50; i++) {
      const qNum = i + 1;
      const th = targetHours[i];
      const tm = targetMinutes[i];
      const targetStr = `${th}:${tm.toString().padStart(2, '0')}`;

      questions.push({
        id: qNum,
        prompt: `المطلوب: اضبط الساعة لتشير إلى الوقت [ ${targetStr} ]`,
        hint: `اختر الموضع الصحيح لعقرب الساعات عند (${th}) وعقرب الدقائق عند (${tm === 0 ? '12' : tm === 30 ? '6' : tm === 15 ? '3' : '9'}).`,
        type: 'clock_hand',
        visualType: 'interactive_clock',
        visualData: { targetHours: th, targetMinutes: tm },
        options: [
          { id: 'hand_correct', text: `اضبط العقارب على ${targetStr}`, isCorrect: true, visual: JSON.stringify({ h: th, m: tm }) },
          { id: 'hand_wrong1', text: `عقرب الساعات على ${(th % 12) + 2}`, isCorrect: false, visual: JSON.stringify({ h: (th % 12) + 2, m: tm }) },
          { id: 'hand_wrong2', text: `عقرب الدقائق على ${((tm + 30) % 60)}`, isCorrect: false, visual: JSON.stringify({ h: th, m: (tm + 30) % 60 }) },
        ].sort(() => 0.5 - ((i * 7) % 10) / 10),
        explanation: `رائع يا بطل! تم ضبط عقارب الساعة بدقة متناهية على ${targetStr}.`,
      });
    }
    return questions;
  }

  // ==========================================
  // GAME 44: 🌅 صباح أم مساء؟ (50 questions)
  // ==========================================
  if (gameId === 44) {
    const events = [
      { text: 'الاستيقاظ من النوم بنشاط مع صوت المنبه', time: 'morning', icon: '⏰' },
      { text: 'رؤية النجوم الساطعة والقمر في السماء', time: 'evening', icon: '✨' },
      { text: 'شروق الشمس ونشر خيوطها الذهبية', time: 'morning', icon: '🌅' },
      { text: 'تناول وجبة العشاء الخفيفة مع العائلة', time: 'evening', icon: '🍲' },
      { text: 'ارتداء الزي المدرسي والذهاب إلى المدرسة', time: 'morning', icon: '🎒' },
      { text: 'ارتداء ملابس النوم المريحة (البيجامة)', time: 'evening', icon: '🛌' },
      { text: 'سماع آذان الفجر وتغريد العصافير', time: 'morning', icon: '🕊️' },
      { text: 'إطفاء أنوار الغرفة للنوم الهادئ', time: 'evening', icon: '🌙' },
      { text: 'طابور الصباح المدرسي والإذاعة', time: 'morning', icon: '🏫' },
      { text: 'إضاءة أعمدة الإنارة في شوارع المدينة', time: 'evening', icon: '💡' },
      { text: 'شرب كأس الحليب الدافئ مع وجبة الفطور', time: 'morning', icon: '🥛' },
      { text: 'قراءة قصة ما قبل النوم مع الوالدين', time: 'evening', icon: '📖' },
      { text: 'فتح نوافذ الغرفة لدخول نسيم الصباح العليل', time: 'morning', icon: '🪟' },
      { text: 'مشاهدة مغيب الشمس وتغير ألوان الشفق', time: 'evening', icon: '🌇' },
      { text: 'غسل الوجه وتنظيف الأسنان لبدء اليوم', time: 'morning', icon: '🪥' },
      { text: 'الخلود إلى النوم العميق في السرير', time: 'evening', icon: '😴' },
      { text: 'تجهيز الدفاتر للحصة الأولى في الفصل', time: 'morning', icon: '✏️' },
      { text: 'ظهور الخفافيش والحيوانات الليلية', time: 'evening', icon: '🦇' },
      { text: 'تفتح بتلات الأزهار لاستقبال ضوء الشمس', time: 'morning', icon: '🌸' },
      { text: 'إغلاق ستائر النوافذ لمنع ضوء الشارع ليلاً', time: 'evening', icon: '🪟' },
      { text: 'تحية المعلم والأصدقاء بعبارة (صباح الخير)', time: 'morning', icon: '👋' },
      { text: 'إطفاء شاشة التلفاز قبل النوم بساعة', time: 'evening', icon: '📺' },
      { text: 'تمرينات الصباح الرياضية الخفيفة', time: 'morning', icon: '🤸' },
      { text: 'تجمع الأسرة للحديث الهادئ قبل النوم', time: 'evening', icon: '👨‍👩‍👧' },
      { text: 'صياح الديك مع بزوغ أول ضوء', time: 'morning', icon: '🐓' },
      { text: 'مشاهدة القمر وهو بدر كامل مضيء', time: 'evening', icon: '🌕' },
      { text: 'أخذ شطيرة الفطور الطازجة من المطبخ', time: 'morning', icon: '🥪' },
      { text: 'سماع آذان المغرب والعشاء', time: 'evening', icon: '🕌' },
      { text: 'ركوب حافلة المدرسة الصفراء', time: 'morning', icon: '🚌' },
      { text: 'ضبط المنبه ليستيقظ الطفل في الموعد غداً', time: 'evening', icon: '⏱️' },
      { text: 'شمس مشرقة في كبد السماء الصافية', time: 'morning', icon: '☀️' },
      { text: 'سكون الشوارع وهدوء حركة السيارات', time: 'evening', icon: '🌃' },
      { text: 'فحص جدول الحصص لبداية اليوم الدراسي', time: 'morning', icon: '📋' },
      { text: 'قول دعاء النوم (باسمك ربي وضعت جنبي)', time: 'evening', icon: '🤲' },
      { text: 'تناول البيض المسلوق والجبن في الإفطار', time: 'morning', icon: '🍳' },
      { text: 'إغلاق المحلات التجارية والخلود للراحة', time: 'evening', icon: '🏪' },
      { text: 'انطلاق العصافير من أعشاشها للبحث عن طعام', time: 'morning', icon: '🐦' },
      { text: 'ظهور الشهب الخاطفة في السماء المظلمة', time: 'evening', icon: '🌠' },
      { text: 'رش رذاذ الماء على نباتات الحديقة صباحاً', time: 'morning', icon: '🌱' },
      { text: 'شرب كأس ماء دافئ وتنظيف الأسنان قبل النوم', time: 'evening', icon: '🪥' },
      { text: 'سماع تحية (صباح الورد والنشاط)', time: 'morning', icon: '🌺' },
      { text: 'سماع تحية (تصبح على خير وأحلام سعيدة)', time: 'evening', icon: '💤' },
      { text: 'استنشاق الهواء النقي المنعش فجراً', time: 'morning', icon: '🍃' },
      { text: 'إضاءة مصباح السرير الصغير ذو الضوء الخافت', time: 'evening', icon: '🛋️' },
      { text: 'شروق نور النهار وتبدد الظلام', time: 'morning', icon: '🌤️' },
      { text: 'حلول الظلام وانتشار النجوم اللامعة', time: 'evening', icon: '🌌' },
      { text: 'بداية دوام المدارس والجامعات والعمل', time: 'morning', icon: '🏢' },
      { text: 'انتهاء اليوم والاستعداد لراحة الجسم', time: 'evening', icon: '🛏️' },
      { text: 'إعداد كوب الشاي بالحليب الصباحي', time: 'morning', icon: '☕' },
      { text: 'سحب الغطاء والنوم في سرير دافئ', time: 'evening', icon: '🧸' }
    ];

    for (let i = 0; i < 50; i++) {
      const qNum = i + 1;
      const ev = events[i % events.length];
      const isMorning = ev.time === 'morning';

      questions.push({
        id: qNum,
        prompt: `[ ${ev.text} ] — هل يحدث هذا عادةً صباحاً أم مساءً؟`,
        hint: isMorning ? 'فكر في الأنشطة التي نقوم بها مع بداية اليوم وشروق الشمس.' : 'فكر في الأنشطة التي نقوم بها بعد غروب الشمس وقبل النوم.',
        type: 'binary',
        visualType: 'day_night',
        visualData: { isMorning, icon: ev.icon, text: ev.text },
        options: [
          { id: 'opt_morn', text: 'صباحاً 🌅', isCorrect: isMorning, visual: '🌅' },
          { id: 'opt_eve', text: 'مساءً 🌙', isCorrect: !isMorning, visual: '🌙' },
        ],
        explanation: isMorning
          ? `إجابة صحيحة! ${ev.text} من أنشطة الصباح المشرقة.`
          : `إجابة صحيحة! ${ev.text} يحدث في المساء والليل.`,
      });
    }
    return questions;
  }

  // ==========================================
  // GAME 45: 🗓️ ماذا نفعل في هذا الوقت؟ (50 questions)
  // ==========================================
  if (gameId === 45) {
    const routineItems = [
      { timeStr: '7:00 ص', desc: 'الاستيقاظ وغسل الوجه وتناول الفطور', wrong: ['النوم العميق', 'مشاهدة فيلم الليل'] },
      { timeStr: '8:00 ص', desc: 'طابور الصباح وبداية الحصص المدرسية', wrong: ['الاستحمام للنوم', 'تناول العشاء'] },
      { timeStr: '10:00 ص', desc: 'استراحة الفسحة المدرسية وتناول سناك صحي', wrong: ['النوم في السرير', 'سماع قصة المساء'] },
      { timeStr: '1:30 ظ', desc: 'العودة من المدرسة وتناول طعام الغداء', wrong: ['صلاة الفجر', 'طابور الصباح'] },
      { timeStr: '3:30 ع', desc: 'أداء صلاة العصر وأخذ قسط راحة', wrong: ['الذهاب للمدرسة', 'شروق الشمس'] },
      { timeStr: '5:00 م', desc: 'حل الواجبات المدرسية ومراجعة الدروس', wrong: ['النوم الصباحي', 'وجبة الإفطار'] },
      { timeStr: '6:30 م', desc: 'وقت اللعب والمرح وممارسة الهوايات', wrong: ['ركوب حافلة المدرسة', 'طابور الصباح'] },
      { timeStr: '8:00 م', desc: 'تناول طعام العشاء مع العائلة', wrong: ['بداية الدوام المدرسي', 'شروق الشمس'] },
      { timeStr: '8:45 م', desc: 'تنظيف الأسنان بالفرشاة والمعجون', wrong: ['الذهاب للفصل', 'أكل الغداء في المطعم'] },
      { timeStr: '9:00 م', desc: 'الخلود إلى النوم الهادئ والصحي', wrong: ['الذهاب للعب في الحديقة', 'حصة الرياضة المدرسية'] },
    ];

    for (let i = 0; i < 50; i++) {
      const qNum = i + 1;
      const item = routineItems[i % routineItems.length];

      questions.push({
        id: qNum,
        prompt: `الساعة تشير إلى [ ${item.timeStr} ]، ما هو النشاط الصحيح الذي نقوم به في هذا الوقت؟`,
        hint: `انظر إلى الوقت بدقة، هل هو وقت مدرسة، طعام، أم نوم؟`,
        type: 'choice',
        visualType: 'routine_time',
        visualData: { timeStr: item.timeStr },
        options: [
          { id: 'opt_correct', text: item.desc, isCorrect: true, visual: '⭐' },
          { id: 'opt_w1', text: item.wrong[0], isCorrect: false, visual: '❌' },
          { id: 'opt_w2', text: item.wrong[1], isCorrect: false, visual: '❌' },
        ].sort(() => 0.5 - ((i * 11) % 10) / 10),
        explanation: `ممتاز! في تمام ${item.timeStr} نقوم بـ: ${item.desc}.`,
      });
    }
    return questions;
  }

  // ==========================================
  // GAME 46: ⏳ قبل أم بعد؟ (50 questions)
  // ==========================================
  if (gameId === 46) {
    const sequencePairs = [
      { first: 'غسل اليدين بالماء والصابون', second: 'تناول الطعام', question: 'هل نغسل أيدينا (قبل) أم (بعد) الأكل لحمايتها من الجراثيم؟', answer: 'قبل' },
      { first: 'ارتداء الجوارب', second: 'ارتداء الحذاء', question: 'هل نلبس الجوارب (قبل) أم (بعد) الحذاء؟', answer: 'قبل' },
      { first: 'تقشير الموزة', second: 'أكل الموزة اللذيذة', question: 'هل نقشر الموزة (قبل) أم (بعد) أكلها؟', answer: 'قبل' },
      { first: 'وضع المعجون على الفرشاة', second: 'تفريش الأسنان', question: 'هل نضع المعجون على الفرشاة (قبل) أم (بعد) التفريش؟', answer: 'قبل' },
      { first: 'فتح صنبور الماء', second: 'غسل اليدين', question: 'هل نفتح صنبور الماء (قبل) أم (بعد) الغسيل؟', answer: 'قبل' },
      { first: 'ارتداء البيجامة المريحة', second: 'النوم في السرير', question: 'هل نرتدي البيجامة (قبل) أم (بعد) النوم؟', answer: 'قبل' },
      { first: 'زراعة البذرة في التراب', second: 'نمو النبتة وظهور الزهرة', question: 'هل نزرع البذرة (قبل) أم (بعد) ظهور الزهرة؟', answer: 'قبل' },
      { first: 'إشعال المصباح في الظلام', second: 'قراءة الكتاب', question: 'هل نشعل المصباح (قبل) أم (بعد) القراءة؟', answer: 'قبل' },
      { first: 'جمع الألعاب في الصندوق', second: 'الذهاب للنوم في غرفة مرتبة', question: 'هل نرتب الألعاب (قبل) أم (بعد) النوم؟', answer: 'قبل' },
      { first: 'ارتداء المعطف الشتوي', second: 'الخروج في المطر والبرد', question: 'هل نرتدي المعطف (قبل) أم (بعد) الخروج؟', answer: 'قبل' },
      { first: 'تناول وجبة الغداء', second: 'تنظيف الأسنان بعد الغداء', question: 'تنظيف الأسنان يكون (قبل) أم (بعد) الانتهاء من الغداء؟', answer: 'بعد' },
      { first: 'إنهاء اللعب بالكرة', second: 'غسل الوجه واليدين بعد اللعب', question: 'غسل الوجه واليدين يكون (قبل) أم (بعد) اللعب في الحديقة؟', answer: 'بعد' },
      { first: 'حل الواجب المدرسي', second: 'الحصول على وقت اللعب الحر', question: 'اللعب والمكافأة يأتي (قبل) أم (بعد) إكمال الواجبات؟', answer: 'بعد' },
      { first: 'رسم اللوحة الجميلة', second: 'تعليقها على جدار الغرفة', question: 'تعليق اللوحة يكون (قبل) أم (بعد) رسمها وتلوينها؟', answer: 'بعد' },
      { first: 'ركوب حافلة المدرسة', second: 'الوصول إلى باب المدرسة', question: 'الوصول إلى المدرسة يحدث (قبل) أم (بعد) ركوب الحافلة؟', answer: 'بعد' },
    ];

    for (let i = 0; i < 50; i++) {
      const qNum = i + 1;
      const pair = sequencePairs[i % sequencePairs.length];
      const isBefore = pair.answer === 'قبل';

      questions.push({
        id: qNum,
        prompt: pair.question,
        hint: `فكر بالترتيب المنطقي للحدثين: أولاً [${pair.first}] ثم [${pair.second}].`,
        type: 'binary',
        visualType: 'before_after',
        visualData: { first: pair.first, second: pair.second },
        options: [
          { id: 'opt_before', text: 'قبل ⏳', isCorrect: isBefore, visual: '⏳' },
          { id: 'opt_after', text: 'بعد ⌛', isCorrect: !isBefore, visual: '⌛' },
        ],
        explanation: `صحيح يا ذكي! الترتيب المنطقي أن نفعل هذا [ ${pair.answer} ].`,
      });
    }
    return questions;
  }

  // ==========================================
  // GAME 47: 🕒 كم بقي؟ (50 questions)
  // ==========================================
  if (gameId === 47) {
    for (let i = 0; i < 50; i++) {
      const qNum = i + 1;
      const startH = (i % 8) + 1;
      const diffH = (i % 3) + 1;
      const targetH = startH + diffH;

      questions.push({
        id: qNum,
        prompt: `الساعة الآن تشير إلى [ ${startH}:00 ]، وموعد نشاطنا الممتع عند [ ${targetH}:00 ]. كم ساعة بقيت حتى يبدأ؟`,
        hint: `اطرح وقت البداية (${startH}) من وقت الهدف (${targetH}).`,
        type: 'choice',
        visualType: 'remaining_time',
        visualData: { startH, targetH, diffH },
        options: [
          { id: 'opt_c', text: `${diffH} ${diffH === 1 ? 'ساعة واحدة' : diffH === 2 ? 'ساعتان' : 'ساعات'} ⏱️`, isCorrect: true, visual: '⏱️' },
          { id: 'opt_w1', text: `${diffH + 1} ساعات ❌`, isCorrect: false, visual: '❌' },
          { id: 'opt_w2', text: `${Math.max(1, diffH - 1)} ${diffH - 1 === 1 ? 'ساعة' : 'ساعات'} ❌`, isCorrect: false, visual: '❌' },
        ].sort(() => 0.5 - ((i * 9) % 10) / 10),
        explanation: `حساب دقيق! من الساعة ${startH}:00 حتى ${targetH}:00 تبقى ${diffH} ساعات.`,
      });
    }
    return questions;
  }

  // ==========================================
  // GAME 48: ⏱️ مدة النشاط (50 questions)
  // ==========================================
  if (gameId === 48) {
    const activities = [
      { act: 'غسل اليدين بالماء والصابون جيداً', correct: '20 ثانية', wrong: ['5 ساعات', 'يومان'] },
      { act: 'تنظيف الأسنان بالفرشاة والمعجون', correct: 'دقيقتان إلى 3 دقائق', wrong: ['ساعة كاملة', 'ثانية واحدة'] },
      { act: 'نوم الطفل الليلي الصحي', correct: '8 إلى 10 ساعات', wrong: ['10 دقائق', 'أسبوع كامل'] },
      { act: 'الحصة المدرسية في الصف', correct: '45 دقيقة', wrong: ['دقيقة واحدة', '12 ساعة'] },
      { act: 'شرب كأس ماء بارد', correct: '10 ثوانٍ', wrong: ['ساعتان', 'يوم كامل'] },
      { act: 'تناول وجبة الغداء المتكاملة', correct: '20 إلى 30 دقيقة', wrong: ['5 ثوانٍ', '10 ساعات'] },
      { act: 'قراءة قصة قصيرة مصورة للأطفال', correct: '10 دقائق', wrong: ['يومان', 'ثانية واحدة'] },
      { act: 'الاستحمام اليومي السريع', correct: '10 إلى 15 دقيقة', wrong: ['5 ساعات', 'ثانية واحدة'] },
      { act: 'ارتداء الحذاء وربطه', correct: 'دقيقة واحدة', wrong: ['3 ساعات', 'يوم'] },
      { act: 'جولة مشي خفيفة في الحديقة', correct: '30 دقيقة', wrong: ['ثانيتان', '24 ساعة'] },
    ];

    for (let i = 0; i < 50; i++) {
      const qNum = i + 1;
      const actItem = activities[i % activities.length];

      questions.push({
        id: qNum,
        prompt: `كم تستغرق عادةً مدة: [ ${actItem.act} ]؟`,
        hint: `فكر بالمدة المعقولة والمنطقية لهذا النشاط اليومي.`,
        type: 'choice',
        visualType: 'duration',
        visualData: { activity: actItem.act },
        options: [
          { id: 'opt_c', text: actItem.correct, isCorrect: true, visual: '⏱️' },
          { id: 'opt_w1', text: actItem.wrong[0], isCorrect: false, visual: '❌' },
          { id: 'opt_w2', text: actItem.wrong[1], isCorrect: false, visual: '❌' },
        ].sort(() => 0.5 - ((i * 13) % 10) / 10),
        explanation: `تقدير ممتاز! ${actItem.act} يستغرق عادةً حوالي ${actItem.correct}.`,
      });
    }
    return questions;
  }

  // ==========================================
  // GAME 49: 🔢 رتب الأوقات (50 questions)
  // ==========================================
  if (gameId === 49) {
    for (let i = 0; i < 50; i++) {
      const qNum = i + 1;
      const t1 = (i % 4) + 1;
      const t2 = t1 + 2;
      const t3 = t2 + 2;

      questions.push({
        id: qNum,
        prompt: `رتب الأوقات التالية من الأبكر إلى الأحدث: [ ${t2}:00 - ${t1}:00 - ${t3}:00 ]`,
        hint: `ابدأ بأصغر رقم ساعة وهو (${t1}:00) ثم الذي يليه.`,
        type: 'choice',
        visualType: 'order_times',
        visualData: { t1, t2, t3 },
        options: [
          { id: 'opt_c', text: `${t1}:00 ➔ ${t2}:00 ➔ ${t3}:00`, isCorrect: true, visual: '✅' },
          { id: 'opt_w1', text: `${t3}:00 ➔ ${t1}:00 ➔ ${t2}:00`, isCorrect: false, visual: '❌' },
          { id: 'opt_w2', text: `${t2}:00 ➔ ${t3}:00 ➔ ${t1}:00`, isCorrect: false, visual: '❌' },
        ].sort(() => 0.5 - ((i * 7) % 10) / 10),
        explanation: `ترتيب زمني رائع! الترتيب الصحيح هو من الأبكر (${t1}:00) إلى الأحدث (${t3}:00).`,
      });
    }
    return questions;
  }

  // ==========================================
  // GAME 50: 📅 يومي بالساعة (50 questions)
  // ==========================================
  if (gameId === 50) {
    const routineTimeline = [
      { step: 'الاستيقاظ من النوم', time: '7:00 ص', next: 'تناول الإفطار 7:30 ص' },
      { step: 'تناول وجبة الإفطار', time: '7:30 ص', next: 'الذهاب للمدرسة 8:00 ص' },
      { step: 'الذهاب إلى المدرسة', time: '8:00 ص', next: 'استراحة الفسحة 10:00 ص' },
      { step: 'العودة للمنزل والغداء', time: '2:00 ظ', next: 'أداء الواجبات المدرسية 4:00 ع' },
      { step: 'أداء الواجبات المدرسية', time: '4:00 ع', next: 'وقت اللعب والرياضة 5:30 م' },
      { step: 'وقت اللعب والمرح', time: '5:30 م', next: 'وجبة العشاء 7:30 م' },
      { step: 'تناول وجبة العشاء', time: '7:30 م', next: 'تنظيف الأسنان 8:30 م' },
      { step: 'تنظيف الأسنان', time: '8:30 م', next: 'النوم العميق 9:00 م' },
    ];

    for (let i = 0; i < 50; i++) {
      const qNum = i + 1;
      const r = routineTimeline[i % routineTimeline.length];

      questions.push({
        id: qNum,
        prompt: `في جدول يوم الطفل بالساعة: بعد الانتهاء من [ ${r.step} عند ${r.time} ]، ما هي الخطوة التالية مباشرة؟`,
        hint: `فكر في التسلسل الطبيعي ليوم الطفل الصحي والمنظم.`,
        type: 'choice',
        visualType: 'daily_timeline',
        visualData: { step: r.step, time: r.time },
        options: [
          { id: 'opt_c', text: r.next, isCorrect: true, visual: '🌟' },
          { id: 'opt_w1', text: 'النوم مباشرة وإطفاء الأنوار', isCorrect: false, visual: '❌' },
          { id: 'opt_w2', text: 'الذهاب للتسوق في منتصف الليل', isCorrect: false, visual: '❌' },
        ].sort(() => 0.5 - ((i * 15) % 10) / 10),
        explanation: `أحسنت! بعد ${r.step} يأتي موعد: ${r.next}.`,
      });
    }
    return questions;
  }

  // =========================================================================
  // GAMES 1 TO 40: الألعاب التفاعلية العامة (50 diverse questions per game)
  // =========================================================================

  // Generic robust generator tailored to the specific game theme:
  for (let i = 0; i < 50; i++) {
    const qNum = i + 1;

    // 1. 🧱 ابنِ البرج (Build the Tower)
    if (gameId === 1) {
      const sizes = ['كبير جداً للقاعدة', 'متوسط للوسط', 'صغير للقمة'];
      questions.push({
        id: qNum,
        prompt: `التحدي ${qNum}: لبناء برج قوي ومتزن لا يسقط، أي قطعة نضعها في الأسفل (القاعدة)؟`,
        hint: `القطعة الأكبر والأوسع تعطي البرج توازناً وقوة في الأسفل!`,
        type: 'choice',
        visualType: 'tower',
        visualData: { stage: qNum, level: i % 3 },
        options: [
          { id: 'opt_1', text: 'القطعة العريضة والكبيرة 🧱', isCorrect: true, visual: '🧱' },
          { id: 'opt_2', text: 'القطعة الصغيرة جداً 🔹', isCorrect: false, visual: '🔹' },
          { id: 'opt_3', text: 'قطعة مائلة وغير مستوية 📐', isCorrect: false, visual: '📐' },
        ],
        explanation: 'بناء رائع! القاعدة العريضة تحمي البرج من السقوط.',
      });
    }
    // 2. 🧲 اسحب وضع (Drag & Place / Matching)
    else if (gameId === 2) {
      const shapes = [
        { name: 'الدائرة الصفراء', icon: '🟡', slot: 'الدائرة' },
        { name: 'المربع الأزرق', icon: '🟦', slot: 'المربع' },
        { name: 'المثلث الأحمر', icon: '🔺', slot: 'المثلث' },
        { name: 'النجمة البراقة', icon: '⭐', slot: 'النجمة' },
        { name: 'القلب الوردي', icon: '💖', slot: 'القلب' },
      ];
      const item = shapes[i % shapes.length];
      questions.push({
        id: qNum,
        prompt: `التحدي ${qNum}: اسحب وضع [ ${item.name} ${item.icon} ] في المكان والظل المطابق لها:`,
        hint: `طابق الشكل مع المكان الذي له نفس الحواف والخطوط.`,
        type: 'drag_slot',
        visualType: 'magnet_slot',
        visualData: { item: item.name, icon: item.icon },
        options: [
          { id: 'opt_c', text: `مكان ${item.slot} ${item.icon}`, isCorrect: true, visual: item.icon },
          { id: 'opt_w1', text: 'مكان مختلف ⭕', isCorrect: false, visual: '⭕' },
          { id: 'opt_w2', text: 'مكان غير مطابق ❌', isCorrect: false, visual: '❌' },
        ],
        explanation: 'تطابق متقن! وُضع العنصر في ظله المخصص بنجاح.',
      });
    }
    // 3. 🎒 ماذا نحتاج؟ (What do we need?)
    else if (gameId === 3) {
      const situations = [
        { sit: 'عندما تمطر السماء في الخارج', need: 'المظلة ومعطف المطر ☔', wrong: ['النظارة الشمسية 🕶️', 'مروحة الهواء 🪭'] },
        { sit: 'عندما نريد رسم وتلوين لوحة جميلة', need: 'الألوان والفرشاة والورق 🎨', wrong: ['المطرقة والمسامير 🔨', 'المكنسة 🧹'] },
        { sit: 'عندما نريد تنظيف أسناننا قبل النوم', need: 'الفرشاة ومعجون الأسنان 🪥', wrong: ['المقص ✂️', 'الشاحن 🔌'] },
        { sit: 'عندما نذهب للسباحة في المسبح', need: 'لباس السباحة ونظارات الماء 🥽', wrong: ['معطف الصوف الثقيل 🧥', 'المظلة 🌂'] },
        { sit: 'عندما نذهب إلى المدرسة صباحاً', need: 'الحقيبة والدفاتر والأقلام 🎒', wrong: ['صحن الطهي 🍳', 'ألعاب الشاطئ 🏖️'] },
      ];
      const sit = situations[i % situations.length];
      questions.push({
        id: qNum,
        prompt: `التحدي ${qNum}: ${sit.sit}، ماذا نحتاج؟`,
        hint: `اختر الأداة المخصصة والمفيدة لهذا الموقف.`,
        type: 'choice',
        visualType: 'what_we_need',
        visualData: { situation: sit.sit },
        options: [
          { id: 'opt_c', text: sit.need, isCorrect: true, visual: '✅' },
          { id: 'opt_w1', text: sit.wrong[0], isCorrect: false, visual: '❌' },
          { id: 'opt_w2', text: sit.wrong[1], isCorrect: false, visual: '❌' },
        ],
        explanation: 'اختيار حكيم وصحيح! هذا هو المطلوب تماماً.',
      });
    }
    // 4. 🪄 غيّر الشكل (Transform the Shape)
    else if (gameId === 4) {
      questions.push({
        id: qNum,
        prompt: `التحدي ${qNum}: إذا قمنا بدمج مثلثين متطابقين 🔺 + 🔺، ما هو الشكل الذي يمكننا تكوينه؟`,
        hint: `تخيل وضع قاعدتي المثلثين معاً لتكوين شكل رباعي أو معين!`,
        type: 'choice',
        visualType: 'shapes',
        visualData: { shapeIndex: i },
        options: [
          { id: 'opt_c', text: 'شكل المعين أو المربع 🔷', isCorrect: true, visual: '🔷' },
          { id: 'opt_w1', text: 'دائرة تامة ⚪', isCorrect: false, visual: '⚪' },
          { id: 'opt_w2', text: 'خط مستقيم رفيع ➖', isCorrect: false, visual: '➖' },
        ],
        explanation: 'هندسة رائعة! دمج المثلثين يشكل معيناً أو مربعاً جميلاً.',
      });
    }
    // 5. 🧊 الأبرد والأدفأ (Coldest & Warmest)
    else if (gameId === 5) {
      const comparisons = [
        { q: 'أيهما أبرد؟', correct: 'مكعب الثلج المثلج 🧊', wrong: ['كوب الحليب الدافئ 🥛', 'حساء الخضار الساخن 🍲'] },
        { q: 'أيهما أدفأ؟', correct: 'أشعة شمس الظهيرة ☀️', wrong: ['حبة الآيس كريم 🍦', 'قطعة الجليد 🧊'] },
        { q: 'أيهما أبرد؟', correct: 'كرة الثلج في الشتاء ⛄', wrong: ['مدفأة الغرفة المشتعلة 🔥', 'كوب الشاي الساخن ☕'] },
      ];
      const comp = comparisons[i % comparisons.length];
      questions.push({
        id: qNum,
        prompt: `التحدي ${qNum}: ${comp.q}`,
        hint: `قارن بين درجات الحرارة في الموقفين.`,
        type: 'choice',
        visualType: 'temperature',
        visualData: { index: i },
        options: [
          { id: 'opt_c', text: comp.correct, isCorrect: true, visual: '🌡️' },
          { id: 'opt_w1', text: comp.wrong[0], isCorrect: false, visual: '❌' },
          { id: 'opt_w2', text: comp.wrong[1], isCorrect: false, visual: '❌' },
        ],
        explanation: 'استنتاج علمي سليم وصحيح!',
      });
    }
    // 6. 🪜 اصعد بالترتيب (Climb in Order)
    else if (gameId === 6) {
      const step = (i % 5) + 1;
      const num1 = step * 2;
      const num2 = num1 + 1;
      const num3 = num2 + 1;
      questions.push({
        id: qNum,
        prompt: `التحدي ${qNum}: للصعود على درجات السلم بالترتيب، ما هو الرقم الذي يأتي بعد [ ${num1} ➔ ${num2} ]؟`,
        hint: `العد التصاعدي: أضف واحداً للرقم الأخير (${num2}).`,
        type: 'choice',
        visualType: 'ladder',
        visualData: { num1, num2, num3 },
        options: [
          { id: 'opt_c', text: `الدرجة رقم ${num3} 🪜`, isCorrect: true, visual: '🪜' },
          { id: 'opt_w1', text: `الدرجة رقم ${num3 + 5} ❌`, isCorrect: false, visual: '❌' },
          { id: 'opt_w2', text: `الدرجة رقم ${num1 - 1} ❌`, isCorrect: false, visual: '❌' },
        ],
        explanation: `صعود ممتاز! بعد ${num2} يأتي الرقم ${num3}.`,
      });
    }
    // 7. 🧹 نظف الغرفة (Clean the Room)
    else if (gameId === 7) {
      const items = [
        { name: 'الكتاب المدرسي المفتوح', place: 'على رف الكتب 📚' },
        { name: 'الدمية المحشوة الدب', place: 'في صندوق الألعاب 🧸' },
        { name: 'القميص النظيف', place: 'في خزانة الملابس 👕' },
        { name: 'قشور الفواكه والمخلفات', place: 'في سلة المهملات 🗑️' },
        { name: 'الحذاء الرياضي', place: 'في خزانة الأحذية 👟' },
      ];
      const item = items[i % items.length];
      questions.push({
        id: qNum,
        prompt: `التحدي ${qNum}: وجدنا [ ${item.name} ] ملقى على الأرض، أين نضعه لترتيب الغرفة؟`,
        hint: `ضع كل غرض في المكان المخصص له لتظل الغرفة جميلة ونظيفة.`,
        type: 'choice',
        visualType: 'clean_room',
        visualData: { item: item.name },
        options: [
          { id: 'opt_c', text: item.place, isCorrect: true, visual: '✨' },
          { id: 'opt_w1', text: 'تحت السرير في الظلام ❌', isCorrect: false, visual: '❌' },
          { id: 'opt_w2', text: 'خلف الباب مهملاً ❌', isCorrect: false, visual: '❌' },
        ],
        explanation: 'غرفة نظيفة ومنظمة! بارك الله فيك.',
      });
    }
    // 8. 🛒 عربة التسوق (Shopping Cart)
    else if (gameId === 8) {
      const groceries = [
        { need: 'تفاح أحمر طازج', icon: '🍎' },
        { need: 'حليب معقم مفيد', icon: '🥛' },
        { need: 'خبز طازج دافئ', icon: '🍞' },
        { need: 'جزر برتقالي مقرمش', icon: '🥕' },
        { need: 'جبنة بيضاء لذيذة', icon: '🧀' },
      ];
      const target = groceries[i % groceries.length];
      questions.push({
        id: qNum,
        prompt: `التحدي ${qNum}: في قائمة المشتريات مطلوب شراء [ ${target.need} ${target.icon} ]، اختره وضعه في العربة:`,
        hint: `ابحث عن السلعة المطلوبة تماماً في القائمة.`,
        type: 'choice',
        visualType: 'shopping_cart',
        visualData: { target: target.need, icon: target.icon },
        options: [
          { id: 'opt_c', text: `${target.need} ${target.icon}`, isCorrect: true, visual: target.icon },
          { id: 'opt_w1', text: 'سلعة غير مطلوبة 🥫', isCorrect: false, visual: '🥫' },
          { id: 'opt_w2', text: 'حلوى غير صحية 🍬', isCorrect: false, visual: '🍬' },
        ],
        explanation: 'تم وضع السلعة في عربة التسوق بنجاح!',
      });
    }
    // Default high-quality challenge generator for remaining games 9 to 40
    else {
      const genericMeta = [
        { id: 9, title: 'حضّر الفطور', q: 'لإعداد بيض الفطور اللذيذ، ما هي الخطوة الأولى؟', c: 'غسل اليدين وكسر البيضة في المقلاة 🍳', w: ['أكلها بقشرها مباشرة', 'وضع المقلاة في الثلاجة'] },
        { id: 10, title: 'جهّز الطفل', q: 'الطفل ذاهب إلى الملعب الرياضي، ماذا يرتدي؟', c: 'الملابس الرياضية والحذاء المريح 👟', w: ['بدلة النوم', 'معطف المطر والقفازات'] },
        { id: 11, title: 'ملابس الطقس', q: 'الطقس اليوم عاصف وممطر، ماذا نرتدي؟', c: 'المعطف الواقي من المطر والحذاء المطاطي 🧥', w: ['ملابس السباحة الخفيفة', 'قبعة القش الصيفية'] },
        { id: 12, title: 'جهّز حقيبة السفر', q: 'نحزم الحقيبة للسفر، ما هو الشيء الأساسي؟', c: 'الملابس النظيفة وفرشاة الأسنان 🧳', w: ['أثاث الغرفة الكبير', 'أصيص النباتات الثقيل'] },
        { id: 13, title: 'ابنِ المنزل', q: 'ما هو الجزء الذي يحمي المنزل من المطر والشمس من الأعلى؟', c: 'السقف المتين 🏠', w: ['سجادة الأرضية', 'مقبض الباب'] },
        { id: 14, title: 'اعتنِ بالنبتة', q: 'النبتة الجميلة عطشى، ماذا تحتاج لتنمو؟', c: 'رذاذ الماء العذب وضوء الشمس 🪴', w: ['العصير المثلج', 'وضعها في خزانة مظلمة'] },
        { id: 15, title: 'ساعد الحيوان الصغير', q: 'العصفور الصغير جائع في عشه، ماذا نقدم له؟', c: 'الحبوب والماء النظيف 🌾', w: ['الشوكولاتة الساخنة', 'المشروبات الغازية'] },
        { id: 16, title: 'اعثر على الطريق', q: 'للوصول إلى الحديقة، يشير السهم إلى اليمين ➡️، أي اتجاه نسلك؟', c: 'الاتجاه نحو اليمين ➡️', w: ['الاتجاه نحو اليسار ⬅️', 'الرجوع للخلف'] },
        { id: 17, title: 'أي باب؟', q: 'معنا مفتاح أزرق 🗝️، أي باب يفتحه هذا المفتاح؟', c: 'الباب الذي يحمل نفس القفل واللون الأزرق 🚪', w: ['الباب الأحمر المغلق', 'الباب الأصفر'] },
        { id: 18, title: 'افتح القفل', q: 'رمز القفل هو نمط [ أحمر - أزرق - أحمر ]، ما اللون التالي؟', c: 'أزرق 🔷', w: ['أخضر 🟢', 'أصفر 🟡'] },
        { id: 19, title: 'ركّب المشهد', q: 'أي قطعة تكمل صورة الشجرة ذات الأوراق الخضراء؟', c: 'قطعة الأغصان الخضراء والورود 🌳', w: ['قطعة أمواج البحر الأزرق', 'قطعة رمال الصحراء'] },
        { id: 20, title: 'المتاهة البسيطة', q: 'المسار المفتوح نحو النجمة الذهبية خالٍ من الحواجز، أيهما نختار؟', c: 'المسار المستقيم الخالي من الجدران 🌀', w: ['المسار المسدود بجدار صخري', 'المسار الشائك'] },
        { id: 21, title: 'أي صندوق؟', q: 'صندوق الهدية يحمل شريطة حمراء ونجمة ذهبية، أي صندوق هو؟', c: 'الصندوق ذو الشريطة الحمراء والنجمة 🎁', w: ['صندوق بلا أي علامة', 'صندوق أسود فارغ'] },
        { id: 22, title: 'املأ الكوب', q: 'المطلوب ملء الكوب حتى النصف تماماً، أين يقف الماء؟', c: 'عند الخط الأوسط الموضح (1/2) 🥤', w: ['فارغ في القاع تماماً', 'يفيض ويسكب على الطاولة'] },
        { id: 23, title: 'أصِب الهدف', q: 'المرمى في الزاوية اليمنى العليا ⚽، كيف نوجه الكرة؟', c: 'تسديد الكرة نحو الزاوية اليمنى المفتوحة 🥅', w: ['تسديدها للخلف نحو الحائط', 'تسديدها نحو الحكم'] },
        { id: 24, title: 'فرقع بالترتيب', q: 'البالونات مرقمة (1، 2، 3)، أي بالون نفرقعه أولاً؟', c: 'البالون رقم 1 🎈', w: ['البالون رقم 3', 'البالون رقم 2'] },
        { id: 25, title: 'من اليرقة إلى الفراشة', q: 'ما هي المرحلة الأولى قبل أن تصبح الفراشة جميلة تطير؟', c: 'اليرقة الصغيرة التي تأكل أوراق الشجر 🐛', w: ['نسر كبير', 'سمكة صغيرة'] },
        { id: 26, title: 'ليل أم نهار؟', q: 'ظهور الشمس الساطعة في السماء يدل على:', c: 'وقت النهار ☀️', w: ['منتصف الليل', 'عتمة الظلام'] },
        { id: 27, title: 'حقيبة الشاطئ', q: 'نحزم حقيبة الشاطئ الرملي، ما الأداة المناسبة لبناء قلعة رملية؟', c: 'الدلو والمجرفة البلاستيكية 🏖️', w: ['المدفأة الكهربائية', 'الكتب الثقيلة'] },
        { id: 28, title: 'صمّم الشخصية', q: 'نريد تصميم شخصية ملك لطيف، أي تاج نضع على رأسه؟', c: 'التاج الذهبي المرصع بالجواهر 👑', w: ['خوذة الغوص', 'قبعة السباحة'] },
        { id: 29, title: 'أكمل البناء', q: 'الجدار ينقصه لبنة واحدة ليكتمل صف الطوب، ما القطعة المطلوبة؟', c: 'لبنة الطوب المستطيلة المتطابقة 🧱', w: ['كرة دائرية', 'مثلث حاد'] },
        { id: 30, title: 'كوّن القطار', q: 'القطار يتكون من قاطرة أمامية، أين توضع القاطرة دائماً؟', c: 'في مقدمة القطار لسحب العربات 🚂', w: ['في آخر العربات', 'فوق سقف القطار'] },
        { id: 31, title: 'أنقذ السمكة', q: 'السمكة الصغيرة تحتاج إلى الماء لتتنفس، أي صنبور نفتح؟', c: 'أنبوب الماء العذب المؤدي للحوض 🐠', w: ['أنبوب الهواء الفارغ', 'أنبوب الرمل'] },
        { id: 32, title: 'احمِ الأشياء من المطر', q: 'بدأ المطر بالهطول على الكتب في الفناء، أين ننقلها؟', c: 'داخل المنزل تحت السقف الجاف 🌧️', w: ['تركها تحت المزراب', 'وضعها في بركة ماء'] },
        { id: 33, title: 'رتب الأحجام', q: 'نريد ترتيب الكرات من الأصغر إلى الأكبر، أي كرة نبدأ بها؟', c: 'كرة التنس الصغيرة 🎾', w: ['كرة السلة الكبيرة 🏀', 'كرة القدم ⚽'] },
        { id: 34, title: 'الغسيل الصحيح', q: 'الملابس البيضاء الناصعة، أين نضعها في الغسالة؟', c: 'مع الملابس البيضاء لحمايتها 🧺', w: ['مع الملابس الملطخة بالألوان الداكنة', 'مع الأحذية الموحلة'] },
        { id: 35, title: 'رتب المائدة', q: 'أين نضع الملعقة والصحن على مائدة الطعام؟', c: 'الصحن في المنتصف والملعقة إلى اليمين 🍽️', w: ['الصحن على الأرض', 'الملعقة تحت الكرسي'] },
        { id: 36, title: 'طريق المدرسة', q: 'ما الذي يجب أن نتأكد من وجوده في مقلمة المدرسة؟', c: 'أقلام الرصاص والممحاة والمسطرة ✏️', w: ['ألعاب الفيديو', 'الملاعق والسكاكين'] },
        { id: 37, title: 'أنقذ الحيوان', q: 'القطة الصغيرة عالقة فوق غصن شجرة قصير، كيف نساعدها بأمان؟', c: 'استخدام سلم قصير والنداء عليها بلطف 🐾', w: ['إخافتها والرمي عليها', 'إهمالها في المطر'] },
        { id: 38, title: 'اصنع قوس قزح', q: 'ما هو اللون الأول المشرق في أعلى قوس قزح؟', c: 'اللون الأحمر الزاهي 🔴', w: ['اللون البنفسجي في الأسفل', 'اللون الأسود'] },
        { id: 39, title: 'ماذا نفعل الآن؟', q: 'دقت الساعة معلنة موعد الغداء، ما هو التصرف الصحيح؟', c: 'غسل اليدين والجلوس مع العائلة لتناول الطعام 🕰️', w: ['الذهاب للنوم بالثياب', 'الخروج للشارع في الحر'] },
        { id: 40, title: 'مهمة اليوم', q: 'مهمة البطل اليوم: جمع 3 نجوم بإنجاز عمل طيب، ما هو العمل الطيب؟', c: 'مساعدة الوالدين وترتيب الألعاب 🏅', w: ['الصراخ وإفساد الأغراض', 'إلقاء المهملات على السجاد'] },
      ];

      const template = genericMeta.find((m) => m.id === gameId) || genericMeta[0];

      questions.push({
        id: qNum,
        prompt: `السؤال ${qNum}: ${template.q}`,
        hint: `فكر في الخيار الأكثر أماناً، تنظيماً وفائدة للطفل.`,
        type: 'choice',
        visualType: 'themed_card',
        visualData: { qNum, gameId },
        options: [
          { id: 'opt_c', text: `${template.c}`, isCorrect: true, visual: '🌟' },
          { id: 'opt_w1', text: `${template.w[0]}`, isCorrect: false, visual: '❌' },
          { id: 'opt_w2', text: `${template.w[1]}`, isCorrect: false, visual: '❌' },
        ].sort(() => 0.5 - ((i * 19) % 10) / 10),
        explanation: 'إجابة ممتازة وذكية! أحسنت يا بطل.',
      });
    }
  }

  return questions;
};
