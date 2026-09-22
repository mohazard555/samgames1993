import { IslandQuestion, IslandOption } from '../types/adventureIslandTypes';

// Helper to shuffle options deterministically per question index
const deterministShuffle = <T>(arr: T[], seed: number): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = (seed * 37 + i * 13) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const generateQuestionsForIslandGame = (gameId: number): IslandQuestion[] => {
  const questions: IslandQuestion[] = [];

  // =========================================================================
  // 1. كهف الألغاز (ألغاز الصورة) - 50 Visual Riddles
  // =========================================================================
  if (gameId === 1) {
    const puzzleThemes = [
      { q: 'أي ظل يطابق هذا الحيوان تماماً؟', icon: '🦁', ans: 'الظل رقم 2 المطابق مع الذيل المرفوع', opts: ['الظل 1 (ذيل مقطوع)', 'الظل 2 (مطابق تماماً)', 'الظل 3 (أرجل مختلفة)'] },
      { q: 'كم عدد المثلثات الموجودة في هذا الشكل السحري؟', icon: '🔺', ans: '5 مثلثات', opts: ['5 مثلثات', '3 مثلثات', '7 مثلثات'] },
      { q: 'أي قطعة إذا أدرناها بزاوية 90 درجة تطابق الشكل الأصلي؟', icon: '🧩', ans: 'القطعة الخضراء المائلة', opts: ['القطعة الخضراء المائلة', 'القطعة الحمراء', 'القطعة الصفراء'] },
      { q: 'ما هو الشكل المنعكس في المرآة لهذا القارب؟', icon: '⛵', ans: 'الشراع إلى اليسار والمقدمة إلى اليمين', opts: ['الشراع إلى اليسار والمقدمة إلى اليمين', 'القارب مقلوب رأساً على عقب', 'القارب بنفس الاتجاه'] },
      { q: 'أي جزء ناقص ليكتمل شكل الفراشة الجميلة؟', icon: '🦋', ans: 'الجناح الأيمن الملون بنقاط بنفسجية', opts: ['الجناح الأيمن المنقط', 'جناح أسود سادة', 'جناح بدون نقاط'] },
      { q: 'كم مربعاً ترى في هذه الشبكة الملونة؟', icon: '🔲', ans: '6 مربعات', opts: ['6 مربعات', '4 مربعات', '8 مربعات'] },
      { q: 'أي مسار يؤدي إلى الماسة في الكهف بدون عوائق؟', icon: '💎', ans: 'المسار الأوسط ب', opts: ['المسار أ (مسدود)', 'المسار الأوسط ب', 'المسار ج (صخور)'] },
      { q: 'إذا طوينا الورقة من المنتصف، أي شكل سينتج؟', icon: '📄', ans: 'نصف قلب متطابق', opts: ['نصف قلب متطابق', 'مربع مشوه', 'دائرة مقصوصة'] },
      { q: 'ما هو الوجه العلوي للمكعب إذا طوينا هذا المخطط؟', icon: '🎲', ans: 'النجمة الذهبية', opts: ['النجمة الذهبية', 'الدائرة الزرقاء', 'المربع الأحمر'] },
      { q: 'أي شكل من الأشكال التالية غير مكرر في الكهف؟', icon: '🔮', ans: 'البلورة الزرقاء الوحيدة', opts: ['البلورة الزرقاء الوحيدة', 'البلورة الخضراء', 'البلورة البنفسجية'] },
    ];

    for (let i = 0; i < 50; i++) {
      const theme = puzzleThemes[i % puzzleThemes.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: theme.opts[0], isCorrect: theme.opts[0] === theme.ans, visual: '✨' },
        { id: `opt_${i}_2`, text: theme.opts[1], isCorrect: theme.opts[1] === theme.ans, visual: '🔍' },
        { id: `opt_${i}_3`, text: theme.opts[2], isCorrect: theme.opts[2] === theme.ans, visual: '🎯' },
      ];
      questions.push({
        id: qNum,
        gameId: 1,
        prompt: `[لغز ${qNum}]: ${theme.q} (رقم المشهد #${i + 101})`,
        hint: 'ركز على أطراف الشكل والتفاصيل الدقيقة في الكهف.',
        type: 'visual_puzzle',
        visualType: 'puzzle_board',
        visualData: { icon: theme.icon, index: i, detail: `كهف الألغاز - مستوى ${Math.floor(i / 10) + 1}` },
        options: deterministShuffle(opts, i + 3),
        explanation: `إجابة صحيحة رائعة! ${theme.ans} هي الحل المنطقي للغز.`,
      });
    }
  }

  // =========================================================================
  // 2. غابة الملاحظة (لاحظ وتذكر) - 50 Memory & Observation challenges
  // =========================================================================
  else if (gameId === 2) {
    const scenes = [
      { scene: 'أشجار الغابة والحيوانات', items: ['سنجاب 🐿️', 'تفاحة 🍎', 'عصفور 🐦', 'فطر 🍄'], q: 'ما هو الشيء الذي كان بجوار الفطر الملون؟', ans: 'تفاحة حمراء 🍎', wrong: ['نجمة ذهبية ⭐', 'كرة خضراء ⚽'] },
      { scene: 'بركة الماء الصافية', items: ['بطة صفراء 🦆', 'سمكة زرقاء 🐟', 'زهرة اللوتس 🪷', 'ضفدع أخضر 🐸'], q: 'ما لون السمكة التي كانت تسبح في البركة؟', ans: 'زرقاء 🐟', wrong: ['حمراء 🔴', 'صفراء 🟡'] },
      { scene: 'مخيم الكشافة', items: ['خيمة برتقالية ⛺', 'مصباح يدوي 🔦', 'حقيبة ظهر 🎒', 'بوصلة 🧭'], q: 'ماذا كان موضوعاً بجانب الخيمة البرتقالية؟', ans: 'حقيبة ظهر 🎒', wrong: ['دراجة هوائية 🚲', 'مظلة مطر ☂️'] },
      { scene: 'أزهار وفراشات الربيع', items: ['فراشة بنفسجية 🦋', 'نحلة نشيطة 🐝', 'وردة حمراء 🌹', 'دعسوقة 🐞'], q: 'أي حشرة صغيرة كانت تقف على أوراق الوردة؟', ans: 'دعسوقة 🐞', wrong: ['نملة سوداء 🐜', 'عنكبوت 🕷️'] },
      { scene: 'شجرة الفواكه اللذيذة', items: ['برتقالة 🍊', 'موزة 🍌', 'كرز 🍒', 'عنب 🍇'], q: 'كم نوعاً من الفواكه كان على الشجرة في المشهد؟', ans: '4 أنواع 🍒', wrong: ['نوعان فقط', '6 أنواع'] },
    ];

    for (let i = 0; i < 50; i++) {
      const s = scenes[i % scenes.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: s.ans, isCorrect: true, visual: '👀' },
        { id: `opt_${i}_2`, text: s.wrong[0], isCorrect: false, visual: '🌲' },
        { id: `opt_${i}_3`, text: s.wrong[1], isCorrect: false, visual: '🍃' },
      ];
      questions.push({
        id: qNum,
        gameId: 2,
        prompt: `[ملاحظة ${qNum}]: تذكر المشهد جيداً: ${s.q}`,
        hint: 'حاول استرجاع صورة الغابة في ذاكرتك!',
        type: 'memory_observe',
        visualType: 'memory_scene',
        visualData: { sceneName: s.scene, items: s.items, memoryDuration: 4 },
        options: deterministShuffle(opts, i * 7),
        explanation: `ممتاز! ذاكرتك قوية جداً، الإجابة الصحيحة هي: ${s.ans}.`,
      });
    }
  }

  // =========================================================================
  // 3. مصنع القطع (أي قطعة تناسب؟) - 50 Matching & Fitting pieces
  // =========================================================================
  else if (gameId === 3) {
    const pieces = [
      { shape: 'نجمة سداسية ناقصة ضلع', target: 'الضلع الذهبي المنحني', wrong1: 'مربع أزرق', wrong2: 'دائرة حمراء' },
      { shape: 'ترس ساعة مسنن ناقص سن', target: 'سن الترس البرونزي الحاد', wrong1: 'كرة ملساء', wrong2: 'مستطيل عريض' },
      { shape: 'لوحة بازل سيارة ينقصها عجلة', target: 'عجلة سوداء دائرية', wrong1: 'مقبض باب', wrong2: 'جناح طائرة' },
      { shape: 'مفتاح ميكانيكي بحاجة لمقبض', target: 'مقبض مطاطي أصفر مريح', wrong1: 'شوكة طعام', wrong2: 'سلسلة رفيعة' },
      { shape: 'جسر خشبي ينقصه لوح أوسط', target: 'لوح خشب مستطيل متطابق', wrong1: 'حجر دائري', wrong2: 'حبل متدلي' },
      { shape: 'قطعة فسيفساء مثلثة في جدار', target: 'مثلث فيروزي متساوي الأضلاع', wrong1: 'شبه منحرف بني', wrong2: 'نصف دائرة رمادية' },
    ];

    for (let i = 0; i < 50; i++) {
      const p = pieces[i % pieces.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: `${p.target} (مطابقة تماماً)`, isCorrect: true, visual: '🧩' },
        { id: `opt_${i}_2`, text: p.wrong1, isCorrect: false, visual: '⚙️' },
        { id: `opt_${i}_3`, text: p.wrong2, isCorrect: false, visual: '🔧' },
      ];
      questions.push({
        id: qNum,
        gameId: 3,
        prompt: `[تحدي ${qNum}]: انظر إلى الفراغ في هذا الشكل: أي قطعة تناسب الفراغ تماماً لتركيبها؟`,
        hint: 'قارن حدود الفراغ مع حواف القطع الثلاث.',
        type: 'fit_piece',
        visualType: 'puzzle_fit',
        visualData: { shapeDesc: p.shape, target: p.target, slotIndex: i },
        options: deterministShuffle(opts, i * 11),
        explanation: `أحسنت التركيب! ${p.target} تتطابق مع أبعاد وزوايا الشكل بدقة.`,
      });
    }
  }

  // =========================================================================
  // 4. جسر الأنماط (أكمل السلسلة) - 50 Patterns (Colors, Shapes, Numbers, Icons)
  // =========================================================================
  else if (gameId === 4) {
    const patternBases = [
      { seq: ['🔴', '🔵', '🔴', '🔵'], ans: '🔴 أحمر', wrong: ['🔵 أزرق', '🟡 أصفر'] },
      { seq: ['⭐', '🌙', '⭐', '🌙'], ans: '⭐ نجمة', wrong: ['☀️ شمس', '☁️ سحابة'] },
      { seq: ['🔺', '🟩', '🔺', '🟩'], ans: '🔺 مثلث أحمر', wrong: ['🟩 مربع أخضر', '🔵 دائرة زرقاء'] },
      { seq: ['🍎', '🍌', '🍇', '🍎', '🍌'], ans: '🍇 عنب', wrong: ['🍎 تفاحة', '🍊 برتقال'] },
      { seq: ['2', '4', '6', '8'], ans: '10', wrong: ['9', '12'] },
      { seq: ['🌱', '🌿', '🌳', '🌱', '🌿'], ans: '🌳 شجرة كبيرة', wrong: ['🌱 برعم', '🍂 ورقة خريف'] },
      { seq: ['⬆️', '➡️', '⬇️', '⬅️', '⬆️'], ans: '➡️ سهم لليمين', wrong: ['⬇️ سهم للأسفل', '↖️ سهم مائل'] },
      { seq: ['1', '3', '5', '7'], ans: '9', wrong: ['8', '11'] },
      { seq: ['🐱', '🐶', '🐱', '🐶'], ans: '🐱 قطة', wrong: ['🐶 كلب', '🐰 أرنب'] },
      { seq: ['🟢', '🟢', '🟡', '🟢', '🟢'], ans: '🟡 دائرة صفراء', wrong: ['🟢 دائرة خضراء', '🔴 دائرة حمراء'] },
      { seq: ['5', '10', '15', '20'], ans: '25', wrong: ['22', '30'] },
      { seq: ['☀️', '🌧️', '🌈', '☀️', '🌧️'], ans: '🌈 قوس قزح', wrong: ['⚡ برق', '❄️ ثلج'] },
    ];

    for (let i = 0; i < 50; i++) {
      const pat = patternBases[i % patternBases.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: pat.ans, isCorrect: true, visual: '🔗' },
        { id: `opt_${i}_2`, text: pat.wrong[0], isCorrect: false, visual: '❓' },
        { id: `opt_${i}_3`, text: pat.wrong[1], isCorrect: false, visual: '❌' },
      ];
      questions.push({
        id: qNum,
        gameId: 4,
        prompt: `[سلسلة ${qNum}]: ما هو العنصر التالي لإكمال هذا النمط المنطقي؟`,
        hint: 'لاحظ التكرار أو مقدار الزيادة المنتظمة بين العناصر.',
        type: 'sequence_pattern',
        visualType: 'pattern_bridge',
        visualData: { sequence: pat.seq, currentStep: i },
        options: deterministShuffle(opts, i * 5),
        explanation: `رائع! النمط يتبع تسلسلاً دقيقاً، والعنصر التالي هو: ${pat.ans}.`,
      });
    }
  }

  // =========================================================================
  // 5. بيت المحقق (من فعلها؟) - 50 Detective deduction cases
  // =========================================================================
  else if (gameId === 5) {
    const detectiveCases = [
      { case: 'من تناول قطعة الكعكة اللذيذة؟', clue: 'يوجد أثر سكر مطحون بلون وردي على قميص الشخص!', ans: 'الأرنب الذي يرتدي المريلة الوردية 🐰', suspects: ['الأرنب بالمريلة الوردية 🐰', 'الثعلب بمعطفه الأزرق 🦊', 'الدب بقبعته الخضراء 🐻'] },
      { case: 'من رسم هذه اللوحة الجميلة في الحديقة؟', clue: 'يوجد بقع ألوان زيتية صفراء على أكمام الرسام!', ans: 'الببغاء الرسام ومعه ريشة صفراء 🦜', suspects: ['الببغاء الرسام 🦜', 'القرد ماسك الموزة 🐵', 'السلحفاة الهادئة 🐢'] },
      { case: 'من سقى الأزهار في شرفة المنزل؟', clue: 'المرش الأخضر مبلل بجانب نباتات الصبار.', ans: 'القط الصغير ومعه مرش الماء الأخضر 🐱', suspects: ['القط الصغير 🐱', 'الكلب النائم 🐶', 'البومة القارئة 🦉'] },
      { case: 'من بنى هذا البرج الرائع من المكعبات؟', clue: 'المكعب الأخير على شكل نجمة زرقاء يحمله:', ans: 'سنجاب النشيط ومعه النجمة الزرقاء 🐿️', suspects: ['سنجاب النشيط 🐿️', 'الضفدع القافز 🐸', 'الخلد الحفار 🦔'] },
      { case: 'من ترك أثر الأقدام الطيني في الممر؟', clue: 'حجم الأثر صغير جداً وعلى شكل كف صغير ثلاثي الأصابع!', ans: 'البطة الصغيرة ذات الأقدام المجذافية 🦆', suspects: ['البطة الصغيرة 🦆', 'الفيل الضخم 🐘', 'الحصان السريع 🐴'] },
    ];

    for (let i = 0; i < 50; i++) {
      const c = detectiveCases[i % detectiveCases.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: c.suspects[0], isCorrect: c.suspects[0] === c.ans, visual: '🔍' },
        { id: `opt_${i}_2`, text: c.suspects[1], isCorrect: c.suspects[1] === c.ans, visual: '🕵️' },
        { id: `opt_${i}_3`, text: c.suspects[2], isCorrect: c.suspects[2] === c.ans, visual: '🔎' },
      ];
      questions.push({
        id: qNum,
        gameId: 5,
        prompt: `[قضية ${qNum}]: ${c.case} الدليل البصري: "${c.clue}"`,
        hint: 'طابق الدليل البصري مع أوصاف الشخصيات الثلاث.',
        type: 'detective_mystery',
        visualType: 'detective_scene',
        visualData: { clueText: c.clue, caseTitle: c.case },
        options: deterministShuffle(opts, i * 9),
        explanation: `تحري ذكي ومبهر! ${c.ans} هو صاحب الدليل المؤكد.`,
      });
    }
  }

  // =========================================================================
  // 6. قلعة المفاتيح (المفتاح الصحيح) - 50 Locks and Keys
  // =========================================================================
  else if (gameId === 6) {
    const keyPuzzles = [
      { lock: 'قفل على شكل قلب وردي بنجمتين', key: 'مفتاح وردي برأس قلب ونجمتين ⭐⭐', wrong1: 'مفتاح أزرق برأس مربع', wrong2: 'مفتاح أصفر بأسنان دائرية' },
      { lock: 'قفل ذهبي محفور عليه 4 نقاط مثلثة', key: 'مفتاح ذهبي بـ 4 أسنان مثلثة', wrong1: 'مفتاح فضي بـ 2 أسنان', wrong2: 'مفتاح برونزي بدون أسنان' },
      { lock: 'بوابة القلعة ذات القفل السداسي الأخضر', key: 'مفتاح زمردي برأس سداسي ⬡', wrong1: 'مفتاح دائري أحمر', wrong2: 'مفتاح بيضاوي بني' },
      { lock: 'صندوق الكنز بقفل نجمة البحر الزرقاء', key: 'مفتاح مائي برأس نجمة بحر 🌊', wrong1: 'مفتاح ناري برتقالي', wrong2: 'مفتاح حجري رمادي' },
      { lock: 'قفل البرج القديم عليه رسم هلال وقمر', key: 'مفتاح فضي مقوس يشبه الهلال 🌙', wrong1: 'مفتاح شمس ساطع ☀️', wrong2: 'مفتاح سحابة رمادي ☁️' },
    ];

    for (let i = 0; i < 50; i++) {
      const kp = keyPuzzles[i % keyPuzzles.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: kp.key, isCorrect: true, visual: '🗝️' },
        { id: `opt_${i}_2`, text: kp.wrong1, isCorrect: false, visual: '🔑' },
        { id: `opt_${i}_3`, text: kp.wrong2, isCorrect: false, visual: '🔒' },
      ];
      questions.push({
        id: qNum,
        gameId: 6,
        prompt: `[باب ${qNum}]: انظر إلى شكل القفل: "${kp.lock}". أي مفتاح هو المناسب لفتحه؟`,
        hint: 'قارن النقوش والرموز والألوان بين القفل والمفتاح.',
        type: 'match_key',
        visualType: 'castle_lock',
        visualData: { lockDesc: kp.lock, targetKey: kp.key },
        options: deterministShuffle(opts, i * 13),
        explanation: `انفتح القفل بنجاح! 🗝️ تم اختيار المفتاح المتطابق تماماً.`,
      });
    }
  }

  // =========================================================================
  // 7. برج الذاكرة (أين كان؟) - 50 Tower Windows Memory
  // =========================================================================
  else if (gameId === 7) {
    const memoryTowerData = [
      { item: 'التاج الملكي 👑', window: 'النافذة رقم 2 (الوسطى)', distractors: ['النافذة 1 (اليمنى)', 'النافذة 3 (اليسرى)'] },
      { item: 'الدرع الفضي 🛡️', window: 'النافذة العلوية رقم 1', distractors: ['النافذة السفلية رقم 4', 'النافذة الوسطى رقم 2'] },
      { item: 'البومة الحكيمة 🦉', window: 'شرفة البرج العالية', distractors: ['مدخل الباب الأرضي', 'النافذة الدائرية'] },
      { item: 'الساعة الذهبية ⏳', window: 'النافذة رقم 4 (في الأسفل)', distractors: ['النافذة رقم 1 (في القمة)', 'النافذة رقم 3'] },
      { item: 'البلورة السحرية 🔮', window: 'النافذة رقم 3 ذات الستارة الزرقاء', distractors: ['النافذة ذات الستارة الحمراء', 'النافذة الصفراء'] },
    ];

    for (let i = 0; i < 50; i++) {
      const mt = memoryTowerData[i % memoryTowerData.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: mt.window, isCorrect: true, visual: '🏰' },
        { id: `opt_${i}_2`, text: mt.distractors[0], isCorrect: false, visual: '🪟' },
        { id: `opt_${i}_3`, text: mt.distractors[1], isCorrect: false, visual: '🚪' },
      ];
      questions.push({
        id: qNum,
        gameId: 7,
        prompt: `[برج ${qNum}]: ركز في نوافذ البرج! أين كان يختبئ: ${mt.item}؟`,
        hint: 'تذكر موقع النافذة التي رأيت فيها العنصر قبل أن تُسدل الستائر!',
        type: 'tower_memory',
        visualType: 'tower_grid',
        visualData: { targetItem: mt.item, correctWindow: mt.window, floor: (i % 5) + 1 },
        options: deterministShuffle(opts, i * 7),
        explanation: `أصبت بدقة متناهية! ${mt.item} كان بالفعل في ${mt.window}.`,
      });
    }
  }

  // =========================================================================
  // 8. غرفة الأشياء المختفية (اختفى شيء) - 50 Disappearing items
  // =========================================================================
  else if (gameId === 8) {
    const disappearScenes = [
      { initial: ['دمية دب 🧸', 'طائرة ورقية 🪁', 'سيارة سباق 🏎️', 'كرة قدم ⚽', 'روبوت 🤖'], disappeared: 'طائرة ورقية 🪁' },
      { initial: ['مصباح 💡', 'كتاب 📖', 'ساعة منبه ⏰', 'نظارة 👓', 'كوب عصير 🥤'], disappeared: 'نظارة 👓' },
      { initial: ['تفاحة 🍎', 'موزة 🍌', 'فراولة 🍓', 'شطيرة 🥪', 'حليب 🥛'], disappeared: 'فراولة 🍓' },
      { initial: ['قلم تلوين 🖍️', 'مقص أوراق ✂️', 'دفتر رسم 📒', 'مسطرة 📏', 'ممحاة 🧼'], disappeared: 'مسطرة 📏' },
      { initial: ['قبعة صوفية 🧶', 'وشاح دافئ 🧣', 'قفازات 🧤', 'حذاء مطر 👢', 'معطف 🧥'], disappeared: 'وشاح دافئ 🧣' },
    ];

    for (let i = 0; i < 50; i++) {
      const ds = disappearScenes[i % disappearScenes.length];
      const qNum = i + 1;
      const remains = ds.initial.filter((x) => x !== ds.disappeared);
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: ds.disappeared, isCorrect: true, visual: '🧸' },
        { id: `opt_${i}_2`, text: remains[0], isCorrect: false, visual: '👀' },
        { id: `opt_${i}_3`, text: remains[1], isCorrect: false, visual: '🔍' },
      ];
      questions.push({
        id: qNum,
        gameId: 8,
        prompt: `[غرفة ${qNum}]: فجأة بعد سحابة الدخان الكرتونية اللطيفة 💨.. ما هو الشيء الذي اختفى من الغرفة؟`,
        hint: 'قارن قائمة الأشياء السابقة مع الأشياء الموجودة حالياً على الرفوف.',
        type: 'vanished_item',
        visualType: 'room_shelf',
        visualData: { remainingItems: remains, vanished: ds.disappeared },
        options: deterministShuffle(opts, i * 17),
        explanation: `عين الصقر! الشيء الذي اختفى هو: ${ds.disappeared}.`,
      });
    }
  }

  // =========================================================================
  // 9. سوق الجزيرة (متجر الطفل) - 50 Budget Shopping tasks
  // =========================================================================
  else if (gameId === 9) {
    const marketQuests = [
      { budget: 10, itemA: 'تفاحة 🍎', priceA: 3, itemB: 'موز 🍌', priceB: 4, req: 'اشترِ التفاحة والموز، كم عملة ستدفع وكم يتبقى معك؟', total: 7, change: 3 },
      { budget: 15, itemA: 'عصير برتقال 🍊', priceA: 5, itemB: 'شطيرة جبن 🥪', priceB: 6, req: 'اشترِ العصير والشطيرة، ما المجموع الإجمالي؟', total: 11, change: 4 },
      { budget: 8, itemA: 'دفتر تلوين 📒', priceA: 4, itemB: 'قلم رسم ✏️', priceB: 2, req: 'اختر الدفتر والقلم، كم عملة سيكلفان معاً؟', total: 6, change: 2 },
      { budget: 20, itemA: 'كرة شاطئ 🏐', priceA: 8, itemB: 'نظارة سباحة 🥽', priceB: 7, req: 'اشترِ معدات الشاطئ، كم يتبقى من الـ 20 عملة؟', total: 15, change: 5 },
      { budget: 12, itemA: 'مثلجات فراولة 🍦', priceA: 3, itemB: 'كعكة صغيرة 🧁', priceB: 5, req: 'ما مجموع ثمن المثلجات والكعكة؟', total: 8, change: 4 },
    ];

    for (let i = 0; i < 50; i++) {
      const mq = marketQuests[i % marketQuests.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: `المجموع = ${mq.total} عملات (الباقي: ${mq.change} 🪙)`, isCorrect: true, visual: '🛒' },
        { id: `opt_${i}_2`, text: `المجموع = ${mq.total + 2} عملات (الباقي: ${Math.max(0, mq.change - 2)} 🪙)`, isCorrect: false, visual: '🪙' },
        { id: `opt_${i}_3`, text: `المجموع = ${Math.max(1, mq.total - 3)} عملات (الباقي: ${mq.change + 3} 🪙)`, isCorrect: false, visual: '💰' },
      ];
      questions.push({
        id: qNum,
        gameId: 9,
        prompt: `[متجر ${qNum}]: لديك ${mq.budget} عملات ذهبية 🪙. ${mq.req}`,
        hint: `اجمع ثمن السلعتين: ${mq.priceA} + ${mq.priceB}.`,
        type: 'shopping_cart',
        visualType: 'market_stall',
        visualData: { budget: mq.budget, itemA: mq.itemA, priceA: mq.priceA, itemB: mq.itemB, priceB: mq.priceB },
        options: deterministShuffle(opts, i * 3),
        explanation: `تاجر صغير بارع! الحساب دقيق: ${mq.priceA} + ${mq.priceB} = ${mq.total} عملات والباقي ${mq.change} عملات.`,
      });
    }
  }

  // =========================================================================
  // 10. بنك الجزيرة (عدّ النقود) - 50 Coin counting challenges
  // =========================================================================
  else if (gameId === 10) {
    const coinPuzzles = [
      { coins: [5, 5, 2, 1], sum: 13, text: 'عملتان من فئة 5، وعملة من فئة 2، وعملة من فئة 1' },
      { coins: [10, 5, 2], sum: 17, text: 'ورقة أو عملة 10، وعملة 5، وعملة 2' },
      { coins: [5, 2, 2, 2], sum: 11, text: 'عملة 5، وثلاث عملات من فئة 2' },
      { coins: [10, 10, 5], sum: 25, text: 'عملتان من فئة 10، وعملة من فئة 5' },
      { coins: [2, 2, 2, 2, 1], sum: 9, text: 'أربع عملات من فئة 2، وعملة من فئة 1' },
      { coins: [10, 5, 5, 2], sum: 22, text: 'عملة 10، وعملتان من فئة 5، وعملة 2' },
      { coins: [5, 5, 5, 1], sum: 16, text: 'ثلاث عملات من فئة 5، وعملة 1' },
    ];

    for (let i = 0; i < 50; i++) {
      const cp = coinPuzzles[i % coinPuzzles.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: `${cp.sum} عملة ذهبية 🪙`, isCorrect: true, visual: '💰' },
        { id: `opt_${i}_2`, text: `${cp.sum + 3} عملات ذهبية 🪙`, isCorrect: false, visual: '🪙' },
        { id: `opt_${i}_3`, text: `${Math.max(1, cp.sum - 4)} عملات ذهبية 🪙`, isCorrect: false, visual: '🪙' },
      ];
      questions.push({
        id: qNum,
        gameId: 10,
        prompt: `[بنك ${qNum}]: عد العملات النقدية المعروضة على طاولة البنك: لديك ${cp.text}. كم المجموع الكلي؟`,
        hint: 'ابدأ بعدّ الفئات الأكبر أولاً (10 ثم 5 ثم 2 ثم 1).',
        type: 'count_money',
        visualType: 'bank_desk',
        visualData: { coins: cp.coins, targetSum: cp.sum },
        options: deterministShuffle(opts, i * 7),
        explanation: `حساب مصرفي مالي متقن! المجموع الدقيق هو: ${cp.sum} عملة نقدية.`,
      });
    }
  }

  // =========================================================================
  // 11. ساحة النرد (النرد الذكي) - 50 Smart Dice Challenges
  // =========================================================================
  else if (gameId === 11) {
    const diceChallenges = [
      { dice: [4, 5], q: 'ما مجموع نقاط النردين معاً؟', ans: '9 نقاط', opts: ['9 نقاط', '8 نقاط', '10 نقاط'] },
      { dice: [6, 3, 2], q: 'اجمع نقاط أحجار النرد الثلاثة:', ans: '11 نقطة', opts: ['11 نقطة', '12 نقطة', '10 نقاط'] },
      { dice: [5, 2], q: 'أي نرد يعرض العدد الأكبر وكم الفارق بينهما؟', ans: 'النرد 5، والفارق هو 3 نقاط', opts: ['النرد 5، والفارق هو 3 نقاط', 'النرد 2، والفارق نقطة', 'متساويان'] },
      { dice: [3, 4], q: 'إذا أردنا الوصول إلى الرقم 10، كم نقطة تنقصنا؟', ans: 'تنقصنا 3 نقاط', opts: ['تنقصنا 3 نقاط', 'تنقصنا نقطتان', 'تنقصنا 4 نقاط'] },
      { dice: [6, 6], q: 'أحسنت رمية مزدوجة! كم حاصل ضرب أو جمع 6 و 6؟', ans: 'المجموع 12 نقطة', opts: ['المجموع 12 نقطة', 'المجموع 10 نقاط', 'المجموع 14 نقطة'] },
    ];

    for (let i = 0; i < 50; i++) {
      const d = diceChallenges[i % diceChallenges.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: d.opts[0], isCorrect: d.opts[0] === d.ans, visual: '🎲' },
        { id: `opt_${i}_2`, text: d.opts[1], isCorrect: d.opts[1] === d.ans, visual: '🎯' },
        { id: `opt_${i}_3`, text: d.opts[2], isCorrect: d.opts[2] === d.ans, visual: '✨' },
      ];
      questions.push({
        id: qNum,
        gameId: 11,
        prompt: `[نرد ${qNum}]: رمينا أحجار النرد فحصلنا على: [${d.dice.join(' و ')}]. ${d.q}`,
        hint: 'احسب عدد النقاط السوداء على وجوه النرد بعناية.',
        type: 'smart_dice',
        visualType: 'dice_board',
        visualData: { diceValues: d.dice },
        options: deterministShuffle(opts, i * 11),
        explanation: `إجابة رائعة في ساحة النرد! ${d.ans}.`,
      });
    }
  }

  // =========================================================================
  // 12. بيت الأرقام (الرقم المفقود) - 50 Missing Number equations
  // =========================================================================
  else if (gameId === 12) {
    for (let i = 0; i < 50; i++) {
      const qNum = i + 1;
      const isSub = i % 2 === 1;
      let eqStr = '';
      let missingVal = 0;
      let hintText = '';

      if (!isSub) {
        const a = (i % 8) + 2;
        missingVal = (i % 6) + 3;
        const sum = a + missingVal;
        eqStr = `${a} + ❓ = ${sum}`;
        hintText = `اطرح ${a} من ${sum} لمعرفة الرقم الناقص!`;
      } else {
        const total = (i % 10) + 10;
        missingVal = (i % 7) + 2;
        const res = total - missingVal;
        eqStr = `${total} - ❓ = ${res}`;
        hintText = `كم يجب أن ننقص من ${total} حتى يصبح لدينا ${res}؟`;
      }

      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: `الرقم ${missingVal}`, isCorrect: true, visual: '🧮' },
        { id: `opt_${i}_2`, text: `الرقم ${missingVal + 2}`, isCorrect: false, visual: '🔢' },
        { id: `opt_${i}_3`, text: `الرقم ${Math.max(1, missingVal - 2)}`, isCorrect: false, visual: '🔢' },
      ];

      questions.push({
        id: qNum,
        gameId: 12,
        prompt: `[معادلة ${qNum}]: ما هو الرقم المفقود ليصبح الحساب صحيحاً؟ (${eqStr})`,
        hint: hintText,
        type: 'missing_number',
        visualType: 'math_abacus',
        visualData: { equation: eqStr, missingVal },
        options: deterministShuffle(opts, i * 19),
        explanation: `عبقري الحساب! الرقم المفقود هو بالفعل ${missingVal}.`,
      });
    }
  }

  // =========================================================================
  // 13. مرصد البيانات (اقرأ الرسم) - 50 Chart reading questions
  // =========================================================================
  else if (gameId === 13) {
    const chartTopics = [
      { title: 'الفواكه المفضلة للأصدقاء', bars: [{ label: 'تفاح 🍎', val: 8 }, { label: 'موز 🍌', val: 12 }, { label: 'فراولة 🍓', val: 5 }], q: 'أي فاكهة حصلت على أكبر عدد من أصوات الأطفال؟', ans: 'الموز 🍌 (12 صوتاً)' },
      { title: 'الحيوانات المفضلة في حديقة الحيوان', bars: [{ label: 'زرافة 🦒', val: 7 }, { label: 'أسد 🦁', val: 10 }, { label: 'باندا 🐼', val: 14 }], q: 'أي حيوان هو المفضل لدى أكبر عدد من الزوار؟', ans: 'الباندا 🐼 (14 صوتاً)' },
      { title: 'الرياضات المفضلة في المدرسة', bars: [{ label: 'كرة قدم ⚽', val: 15 }, { label: 'سباحة 🏊', val: 9 }, { label: 'جري 🏃', val: 6 }], q: 'كم طفلاً يفضل رياضة كرة القدم وفق الرسم البياني؟', ans: '15 طفلاً ⚽' },
      { title: 'ألوان الزهور في الحديقة', bars: [{ label: 'أحمر 🌹', val: 11 }, { label: 'أصفر 🌻', val: 11 }, { label: 'أزرق 🪻', val: 4 }], q: 'أي لونين من الزهور لهما نفس العدد تماماً؟', ans: 'الأحمر والأصفر (11 زهرة لكل منهما)' },
      { title: 'كواكب المجموعة الشمسية التي رصدها التلسكوب', bars: [{ label: 'المريخ 🪐', val: 6 }, { label: 'المشتري 🌕', val: 9 }, { label: 'زحل 🪐', val: 13 }], q: 'ما هو الكوكب الذي رصد منه أكبر عدد من الحلقات في الرسم؟', ans: 'زحل 🪐 (13 حلقة)' },
    ];

    for (let i = 0; i < 50; i++) {
      const ct = chartTopics[i % chartTopics.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: ct.ans, isCorrect: true, visual: '📊' },
        { id: `opt_${i}_2`, text: 'قيمة مساوية للأقل دائماً', isCorrect: false, visual: '📉' },
        { id: `opt_${i}_3`, text: 'لا يمكن معرفتها من الرسم', isCorrect: false, visual: '❓' },
      ];
      questions.push({
        id: qNum,
        gameId: 13,
        prompt: `[رسم ${qNum}]: انظر إلى الرسم البياني الملون بعنوان "${ct.title}": ${ct.q}`,
        hint: 'انظر إلى ارتفاع العمود الملون وقارنه بالأرقام على المحور الجانبي.',
        type: 'read_chart',
        visualType: 'bar_chart',
        visualData: { title: ct.title, bars: ct.bars },
        options: deterministShuffle(opts, i * 7),
        explanation: `قراءة ممتازة للبيانات! الإجابة الدقيقة من واقع الرسم هي: ${ct.ans}.`,
      });
    }
  }

  // =========================================================================
  // 14. خريطة العالم (اكتشف العالم) - 50 World Geography challenges
  // =========================================================================
  else if (gameId === 14) {
    const geoQuestions = [
      { q: 'ما هي أكبر قارة في العالم من حيث المساحة؟', ans: 'قارة آسيا 🌏', opts: ['قارة آسيا 🌏', 'قارة أوروبا 🌍', 'قارة أستراليا 🦘'] },
      { q: 'ما هو أطول نهر يمر في قارة إفريقيا ومصر والسودان؟', ans: 'نهر النيل 🌊', opts: ['نهر النيل 🌊', 'نهر الأمازون 🌳', 'نهر الدانوب ⛵'] },
      { q: 'أين تقع أهرامات الجيزة الشهيرة؟', ans: 'في جمهورية مصر العربية 🇪🇬', opts: ['في مصر 🇪🇬', 'في البرازيل 🇧🇷', 'في إيطاليا 🇮🇹'] },
      { q: 'ما هو أكبر محيط مائي على كوكب الأرض؟', ans: 'المحيط الهادئ 🌊', opts: ['المحيط الهادئ 🌊', 'المحيط الهندي 🚢', 'المحيط المتجمد ❄️'] },
      { q: 'أي قارة يعيش فيها البطريق في الجليد الشديد؟', ans: 'القارة القطبية الجنوبية (أنتاركتيكا) 🐧', opts: ['القارة القطبية الجنوبية 🐧', 'إفريقيا 🦁', 'أمريكا الجنوبية 🦙'] },
      { q: 'في أي قارة تقع المملكة العربية السعودية؟', ans: 'في قارة آسيا 🇸🇦', opts: ['في قارة آسيا 🇸🇦', 'في قارة إفريقيا', 'في قارة أوروبا'] },
      { q: 'أي غابة تعتبر رئة الأرض وتوجد في أمريكا الجنوبية؟', ans: 'غابات الأمازون المطيرة 🌳', opts: ['غابات الأمازون المطيرة 🌳', 'غابة الصنوبر', 'غابة البامبو'] },
      { q: 'ما هي القارة التي تشتهر بوجود حيوان الكنغر اللطيف؟', ans: 'قارة أستراليا 🦘', opts: ['قارة أستراليا 🦘', 'قارة آسيا', 'قارة أمريكا الشمالية'] },
    ];

    for (let i = 0; i < 50; i++) {
      const g = geoQuestions[i % geoQuestions.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: g.opts[0], isCorrect: g.opts[0] === g.ans, visual: '🌎' },
        { id: `opt_${i}_2`, text: g.opts[1], isCorrect: g.opts[1] === g.ans, visual: '🗺️' },
        { id: `opt_${i}_3`, text: g.opts[2], isCorrect: g.opts[2] === g.ans, visual: '🧭' },
      ];
      questions.push({
        id: qNum,
        gameId: 14,
        prompt: `[جغرافيا ${qNum}]: ${g.q}`,
        hint: 'فكر في خريطة كوكب الأرض والقارات والمحيطات السبعة.',
        type: 'world_map',
        visualType: 'globe_explorer',
        visualData: { mapTopic: g.q },
        options: deterministShuffle(opts, i * 17),
        explanation: `معلومات جغرافية مذهلة! ${g.ans} هي الإجابة الصحيحة تماماً.`,
      });
    }
  }

  // =========================================================================
  // 15. ساحة الأعلام (علم أي بلد؟) - 50 Country Flags
  // =========================================================================
  else if (gameId === 15) {
    const flags = [
      { flag: '🇸🇦', country: 'المملكة العربية السعودية', distractors: ['الكويت', 'الأردن'] },
      { flag: '🇪🇬', country: 'جمهورية مصر العربية', distractors: ['السودان', 'العراق'] },
      { flag: '🇦🇪', country: 'الإمارات العربية المتحدة', distractors: ['فلسطين', 'الكويت'] },
      { flag: '🇲🇦', country: 'المملكة المغربية', distractors: ['تونس', 'تركيا'] },
      { flag: '🇯🇴', country: 'المملكة الأردنية الهاشمية', distractors: ['سوريا', 'لبنان'] },
      { flag: '🇵🇸', country: 'دولة فلسطين', distractors: ['الأردن', 'السودان'] },
      { flag: '🇰🇼', country: 'دولة الكويت', distractors: ['الإمارات', 'قطر'] },
      { flag: '🇶🇦', country: 'دولة قطر', distractors: ['البحرين', 'عمان'] },
      { flag: '🇴🇲', country: 'سلطنة عُمان', distractors: ['اليمن', 'المغرب'] },
      { flag: '🇹🇳', country: 'الجمهورية التونسية', distractors: ['تركيا', 'الجزائر'] },
      { flag: '🇩🇿', country: 'الجمهورية الجزائرية', distractors: ['تونس', 'باكستان'] },
      { flag: '🇯🇵', country: 'اليابان (كوكب اليابان الشقيق)', distractors: ['الصين', 'كوريا'] },
      { flag: '🇫🇷', country: 'فرنسا', distractors: ['إيطاليا', 'هولندا'] },
      { flag: '🇧🇷', country: 'البرازيل', distractors: ['الأرجنتين', 'المكسيك'] },
      { flag: '🇨🇦', country: 'كندا (ورقة القيقب)', distractors: ['أمريكا', 'بريطانيا'] },
    ];

    for (let i = 0; i < 50; i++) {
      const f = flags[i % flags.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: f.country, isCorrect: true, visual: f.flag },
        { id: `opt_${i}_2`, text: f.distractors[0], isCorrect: false, visual: '🏳️' },
        { id: `opt_${i}_3`, text: f.distractors[1], isCorrect: false, visual: '🏳️' },
      ];
      questions.push({
        id: qNum,
        gameId: 15,
        prompt: `[علم ${qNum}]: انظر إلى هذا العلم المرفوع: ${f.flag}، ما هو اسم هذا البلد؟`,
        hint: 'انظر إلى ألوان العلم والرموز المميزة فيه.',
        type: 'flag_quiz',
        visualType: 'flag_card',
        visualData: { flagEmoji: f.flag, countryName: f.country },
        options: deterministShuffle(opts, i * 23),
        explanation: `بطل الأعلام! هذا هو علم: ${f.country} ${f.flag}.`,
      });
    }
  }

  // =========================================================================
  // 16. مدينة المعالم (أين يوجد؟) - 50 Famous World Landmarks
  // =========================================================================
  else if (gameId === 16) {
    const landmarks = [
      { name: 'الكعبة المشرفة والمسجد الحرام 🕋', loc: 'في مكة المكرمة بالمملكة العربية السعودية', distractors: ['في القاهرة', 'في إسطنبول'] },
      { name: 'أهرامات الجيزة وتمثال أبو الهول 🏺', loc: 'في الجيزة - مصر', distractors: ['في بغداد', 'في تونس'] },
      { name: 'برج خليفة الشاهق 🏙️', loc: 'في دبي - الإمارات العربية المتحدة', distractors: ['في الرياض', 'في الدوحة'] },
      { name: 'برج إيفل الشهير 🗼', loc: 'في باريس - فرنسا', distractors: ['في روما', 'في لندن'] },
      { name: 'ساعة بيج بن العريقة 🕰️', loc: 'في لندن - بريطانيا', distractors: ['في برلين', 'في مدريد'] },
      { name: 'تاج محل الرخامي الجميل 🕌', loc: 'في مدينة أغرا - الهند', distractors: ['في طوكيو', 'في كوالالمبور'] },
      { name: 'سور الصين العظيم 🧱', loc: 'في الصين', distractors: ['في روسيا', 'في اليابان'] },
      { name: 'مدينة البتراء الوردية 🏛️', loc: 'في الأردن', distractors: ['في لبنان', 'في المغرب'] },
      { name: 'المسجد النبوي الشريف 🕌', loc: 'في المدينة المنورة بالمملكة العربية السعودية', distractors: ['في القدس', 'في دمشق'] },
      { name: 'برج بيزا المائل 🏛️', loc: 'في إيطاليا', distractors: ['في اليونان', 'في إسبانيا'] },
    ];

    for (let i = 0; i < 50; i++) {
      const lm = landmarks[i % landmarks.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: lm.loc, isCorrect: true, visual: '🏛️' },
        { id: `opt_${i}_2`, text: lm.distractors[0], isCorrect: false, visual: '📍' },
        { id: `opt_${i}_3`, text: lm.distractors[1], isCorrect: false, visual: '📍' },
      ];
      questions.push({
        id: qNum,
        gameId: 16,
        prompt: `[معلم ${qNum}]: أين يقع المعلم التاريخي المشهور: ${lm.name}؟`,
        hint: 'فكر في المدينة والبلد الشهير الذي يحتضن هذا المعلم العظيم.',
        type: 'landmark_location',
        visualType: 'landmark_scene',
        visualData: { landmarkName: lm.name, location: lm.loc },
        options: deterministShuffle(opts, i * 13),
        explanation: `أحسنت المعرفة الحضارية! ${lm.name} يقع في: ${lm.loc}.`,
      });
    }
  }

  // =========================================================================
  // 17. وادي المشاعر (ماذا يشعر؟) - 50 Emotional intelligence scenarios
  // =========================================================================
  else if (gameId === 17) {
    const emotionScenarios = [
      { sit: 'فاز الصغير في سباق الجري وتلقى الميدالية الذهبية من أستاذه وابتسم بفرح عريض', feeling: 'فخور وسعيد جداً 🏆😊', wrong: ['حزين وغاضب 😢', 'خائف ومتردد 😨'] },
      { sit: 'سقطت كرة الآيس كريم من يد الطفلة على الأرض قبل أن تتناولها وتغيرت ملامح وجهها', feeling: 'حزينة ومحتاجة لمواساة 😢', wrong: ['متحمسة وفرحة 🥳', 'غاضبة جداً 😡'] },
      { sit: 'سمع الطفل صوتاً مفاجئاً وباب الغرفة يُفتح فجأة وظهر أصدقاؤه حاملين كعكة عيد ميلاده', feeling: 'متفاجئ ومبتهج للغاية 😮🎉', wrong: ['ضجران ونائم 😴', 'خائف وهارب 🏃'] },
      { sit: 'أخذ صديقه لعبته المفضلة بقوة دون استئذان ورفض إعادتها', feeling: 'غاضب ويحتاج للتعبير بهدوء 😡', wrong: ['مسرور ومضحوك عليه 😄', 'فخور بإنجازه 🎖️'] },
      { sit: 'يجلس الطفل في حديقة هادئة يستمع لتغريد العصافير ونسيم الهواء اللطيف', feeling: 'هادئ ومطمئن ومرتاح 😌🌿', wrong: ['خائف وقلق 😨', 'مصدوم ومندهش 😲'] },
    ];

    for (let i = 0; i < 50; i++) {
      const es = emotionScenarios[i % emotionScenarios.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: es.feeling, isCorrect: true, visual: '💖' },
        { id: `opt_${i}_2`, text: es.wrong[0], isCorrect: false, visual: '💭' },
        { id: `opt_${i}_3`, text: es.wrong[1], isCorrect: false, visual: '❓' },
      ];
      questions.push({
        id: qNum,
        gameId: 17,
        prompt: `[موقف ${qNum}]: في هذا الموقف: "${es.sit}". ماذا يشعر الطفل في هذا المشهد؟`,
        hint: 'انظر لتفاصيل الموقف والملامح وكيف يشعر الإنسان في مثل هذا الحدث.',
        type: 'emotion_recognition',
        visualType: 'emotion_card',
        visualData: { situation: es.sit },
        options: deterministShuffle(opts, i * 7),
        explanation: `ذكاء عاطفي رائع! الشعور الصحيح والملامح المطابقة هي: ${es.feeling}.`,
      });
    }
  }

  // =========================================================================
  // 18. قرية الأصدقاء (ماذا تفعل؟) - 50 Social etiquette & Kindness scenarios
  // =========================================================================
  else if (gameId === 18) {
    const socialScenarios = [
      { sit: 'رأيت صديقك الجديد في المدرسة يقف بمفرده في ساحة الألعاب ويبدو خجولاً، ماذا تفعل؟', act: 'أبتسم له وأدعوه للعب معنا بلطف 🤝', wrong1: 'أتجاهله وأذهب بمفردي', wrong2: 'أشير عليه وأضحك' },
      { sit: 'وجدت محفظة نقود مفقودة على أحد مقاعد الحديقة، ما هو التصرف الأمين؟', act: 'أسلمها لمسؤول الحديقة أو المعلم فوراً 💼', wrong1: 'أحتفظ بها لنفسي سراً', wrong2: 'أرميها بعيداً' },
      { sit: 'أثناء ركوب الحافلة صعدت سيدة مسنة تحمل أكياساً ولم تجد مكاناً للجلوس:', act: 'أقف بأدب وأقدم لها مقعدي بكل سرور 👵', wrong1: 'أنظر من النافذة وأتجاهلها', wrong2: 'أطلب منها الوقوف جانباً' },
      { sit: 'كسر أخوك الصغير قلمه بالخطأ وبدأ يبكي، ماذا تفعل لمساعدته؟', act: 'أواسيه وأشاركه أقلامي وأساعده في بريه ✏️', wrong1: 'أصرخ في وجهه', wrong2: 'أخبئ بقية الأقلام عنه' },
      { sit: 'انتهيت من تناول وجبتك الخفيفة في الحديقة العامة:', act: 'أضع المناديل والعلبة الفارغة في سلة المهملات 🗑️', wrong1: 'أتركها على العشب الأخضر', wrong2: 'أدفنها تحت المقعد' },
    ];

    for (let i = 0; i < 50; i++) {
      const sc = socialScenarios[i % socialScenarios.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: sc.act, isCorrect: true, visual: '🌟' },
        { id: `opt_${i}_2`, text: sc.wrong1, isCorrect: false, visual: '❌' },
        { id: `opt_${i}_3`, text: sc.wrong2, isCorrect: false, visual: '⚠️' },
      ];
      questions.push({
        id: qNum,
        gameId: 18,
        prompt: `[تصرف ${qNum}]: ${sc.sit}`,
        hint: 'اختر السلوك الذي ينشر المحبة والأمان والتعاون بين الأصدقاء.',
        type: 'social_choice',
        visualType: 'friends_village',
        visualData: { situation: sc.sit },
        options: deterministShuffle(opts, i * 11),
        explanation: `أحسنت السلوك والأخلاق! ${sc.act} هو السلوك المثالي للصديق المخلص.`,
      });
    }
  }

  // =========================================================================
  // 19. مرسم الجزيرة (صمّم غرفتك) - 50 Room design tasks
  // =========================================================================
  else if (gameId === 19) {
    const roomTasks = [
      { task: 'نريد وضع السرير المريح بجانب النافذة الكبيرة ليدخل ضوء الصباح:', choice: 'السرير ذو الغطاء الأزرق بجوار النافذة 🛏️🪟', wrong1: 'السرير خلف باب الغرفة', wrong2: 'السرير فوق طاولة الدراسة' },
      { task: 'نريد وضع مكتب المذاكرة في مكان مضيء وأنيق ومعه كرسي مريح:', choice: 'المكتب الخشبي المضيء مع مصباح القراءة 🪑📚', wrong1: 'المكتب في زاوية مظلمة دون كرسي', wrong2: 'المكتب في وسط الممر' },
      { task: 'اختر سجادة دافئة لمنتصف الغرفة تناسب ألوان الجدران الهادئة:', choice: 'سجادة دائرية ناعمة متعددة الألوان 🧶', wrong1: 'حصيرة صلبة وغير مريحة', wrong2: 'لوح خشب عريض' },
      { task: 'أين نضع خزانة الملابس والكتب المنظمة؟', choice: 'بمحاذاة الجدار الرئيسي لتوفير مساحة للعب 🚪📖', wrong1: 'أمام النافذة تماماً لحجب الضوء', wrong2: 'في منتصف الغرفة' },
      { task: 'اختر لوحة فنية لتعليقها على جدار الغرفة لإضفاء بهجة وجمال:', choice: 'لوحة ملونة لطبيعة الجزيرة الخلابة 🎨🖼️', wrong1: 'جدار فارغ تماماً', wrong2: 'ورقة بيضاء سادة' },
    ];

    for (let i = 0; i < 50; i++) {
      const rt = roomTasks[i % roomTasks.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: rt.choice, isCorrect: true, visual: '🎨' },
        { id: `opt_${i}_2`, text: rt.wrong1, isCorrect: false, visual: '📐' },
        { id: `opt_${i}_3`, text: rt.wrong2, isCorrect: false, visual: '🛋️' },
      ];
      questions.push({
        id: qNum,
        gameId: 19,
        prompt: `[تصميم ${qNum}]: مهمة الديكور المعماري: "${rt.task}". ما هو الاختيار الأفضل؟`,
        hint: 'فكر في الراحة والجمال وتوزيع المساحات في الغرفة.',
        type: 'room_design',
        visualType: 'room_planner',
        visualData: { designGoal: rt.task },
        options: deterministShuffle(opts, i * 7),
        explanation: `ذوق تصميم رفيع! ${rt.choice} يجعل الغرفة مريحة ومرتبة وغاية في الجمال.`,
      });
    }
  }

  // =========================================================================
  // 20. قلعة البناء (ابنِ قلعتك) - 50 Castle Architecture Challenges
  // =========================================================================
  else if (gameId === 20) {
    const castleTasks = [
      { task: 'ما هي القطعة الأساسية الأولى التي نبدأ بوضعها لبناء القلعة؟', choice: 'قواعد الأساس الحجرية المتينة 🧱', wrong1: 'علم القمة المرفرف 🚩', wrong2: 'أجراس البرج العالية 🔔' },
      { task: 'أين نضع أبراج المراقبة الدائرية للقلعة الملكية؟', choice: 'في الزوايا الأربع للقلعة لحمايتها 🏰', wrong1: 'تحت الماء في الخندق', wrong2: 'فوق سقف الباب فقط' },
      { task: 'ما هو الجزء الذي يسمح بدخول الفرسان فوق خندق الماء؟', choice: 'الجسر الخشبي المتحرك بسلاسل حديدية 🌉', wrong1: 'سور حجري مغلق', wrong2: 'نافذة زجاجية صغيرة' },
      { task: 'ماذا نضع في قمة أعلى برج في القلعة الملكية؟', choice: 'راية النجوم الملونة ترفرف في الهواء 🚩🌟', wrong1: 'صخور ثقيلة', wrong2: 'كومة رملية' },
      { task: 'كيف نجعل أسوار القلعة منيعة وقوية ضد الرياح؟', choice: 'بناء شرفات حجرية مسننة متناسقة 🛡️', wrong1: 'بناء سور من الورق المقوى', wrong2: 'ترك فتحات واسعة بلا سياج' },
    ];

    for (let i = 0; i < 50; i++) {
      const ct = castleTasks[i % castleTasks.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: ct.choice, isCorrect: true, visual: '🏰' },
        { id: `opt_${i}_2`, text: ct.wrong1, isCorrect: false, visual: '🧱' },
        { id: `opt_${i}_3`, text: ct.wrong2, isCorrect: false, visual: '🏗️' },
      ];
      questions.push({
        id: qNum,
        gameId: 20,
        prompt: `[بناء ${qNum}]: مرحلة تشييد القلعة: ${ct.task}`,
        hint: 'البناء يبدأ دائماً من الأساس المتين ويرتفع تدريجياً نحو القمة والزخارف.',
        type: 'build_castle',
        visualType: 'castle_blueprint',
        visualData: { buildStep: ct.task },
        options: deterministShuffle(opts, i * 19),
        explanation: `مهندس معماري عبقري! اختيارك لـ ${ct.choice} هو الأصح هندسياً.`,
      });
    }
  }

  // =========================================================================
  // 21. حديقة الجزيرة (صمّم حديقتك) - 50 Garden design challenges
  // =========================================================================
  else if (gameId === 21) {
    const gardenTasks = [
      { task: 'نريد زراعة صف من الأشجار لتوفير ظل منعش للأطفال:', choice: 'أشجار النخيل والصفصاف المورقة 🌴🌳', wrong1: 'نباتات شوكية جافة 🌵', wrong2: 'أعمدة حديدية صامتة' },
      { task: 'أين نضع نافورة المياه الراقصة في الحديقة؟', choice: 'في الساحة المركزية المحاطة بالزهور ⛲🌷', wrong1: 'خلف الباب الخارجي للحديقة', wrong2: 'فوق مقعد الجلوس' },
      { task: 'اختر زهوراً عطرة ذات ألوان مبهجة لمدخل الحديقة:', choice: 'زهور اللافندر والياسمين والورد الجوري 🪻🌹', wrong1: 'أعشاب ضارة صفراء', wrong2: 'أوراق يابسة بنية' },
      { task: 'أين نضع المقاعد الخشبية ليستريح الزوار؟', choice: 'تحت ظلال الأشجار بمحاذاة الممر الوردي 🪑🌿', wrong1: 'في منتصف بركة المياه', wrong2: 'تحت أشعة الشمس المباشرة الحارقة' },
      { task: 'ماذا نضيف في ركن المرح للأطفال في الحديقة؟', choice: 'أرجوحة وزحليقة آمنة وممتعة 🎡🎪', wrong1: 'صخور حادة وعالية', wrong2: 'براميل بلاستيكية فارغة' },
    ];

    for (let i = 0; i < 50; i++) {
      const gt = gardenTasks[i % gardenTasks.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: gt.choice, isCorrect: true, visual: '🌳' },
        { id: `opt_${i}_2`, text: gt.wrong1, isCorrect: false, visual: '🍃' },
        { id: `opt_${i}_3`, text: gt.wrong2, isCorrect: false, visual: '🍂' },
      ];
      questions.push({
        id: qNum,
        gameId: 21,
        prompt: `[حديقة ${qNum}]: مهمة تنسيق الحدائق الطبيعية: ${gt.task}`,
        hint: 'اختر العنصر الذي يمنح الحديقة رونقاً وخضرة وانتعاشاً وسلامة.',
        type: 'garden_design',
        visualType: 'garden_canvas',
        visualData: { gardenGoal: gt.task },
        options: deterministShuffle(opts, i * 13),
        explanation: `حديقة خلابة! تم تنسيق ${gt.choice} بأسلوب طبيعي ساحر.`,
      });
    }
  }

  // =========================================================================
  // 22. محطة الفضاء (صمّم مركبتك) - 50 Space Rocket & Rover Builder
  // =========================================================================
  else if (gameId === 22) {
    const spaceTasks = [
      { task: 'ما هو الجزء الذي يدفع الصاروخ بقوة هائلة للانطلاق نحو الفضاء؟', choice: 'محركات الدفع الصاروخية النفاثة 🔥🚀', wrong1: 'مروحة هواء يدوية', wrong2: 'عجلات مطاطية صغيرة' },
      { task: 'كيف تحصل المركبة الفضائية على الطاقة الكهربائية أثناء دورانها حول الأرض؟', choice: 'الألواح الشمسية الفضائية المفتوحة 🛰️☀️', wrong1: 'شمعة مضيئة', wrong2: 'بطارية ساعة صغيرة' },
      { task: 'ما هو الجزء الذي يجلس فيه رواد الفضاء لقيادة الرحلة بأمان؟', choice: 'كبسولة القيادة المعزولة ذات النوافذ الدائرية 🧑‍🚀🛸', wrong1: 'داخل خزان الوقود', wrong2: 'فوق جناح الصاروخ الخارجي' },
      { task: 'ما هي الآلة المجهزة بعجلات مخصصة للمشي وجمع العينات على سطح القمر؟', choice: 'مركبة المستكشف القمري (الروفر) 🚜🌕', wrong1: 'قارب شراعي بحري', wrong2: 'طائرة مروحية بدون وقود' },
      { task: 'ما الذي يتيح لرواد الفضاء التواصل والتحدث مع محطة الأرض؟', choice: 'هوائي الاتصال اللاسلكي الفضائي 📡📶', wrong1: 'صفارة كشافة', wrong2: 'جرس دراجة' },
    ];

    for (let i = 0; i < 50; i++) {
      const st = spaceTasks[i % spaceTasks.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: st.choice, isCorrect: true, visual: '🚀' },
        { id: `opt_${i}_2`, text: st.wrong1, isCorrect: false, visual: '🛰️' },
        { id: `opt_${i}_3`, text: st.wrong2, isCorrect: false, visual: '☄️' },
      ];
      questions.push({
        id: qNum,
        gameId: 22,
        prompt: `[فضاء ${qNum}]: تركيب وتجهيز مركبة الفضاء: ${st.task}`,
        hint: 'فكر في فيزياء الفضاء والرحلات الفلكية الآمنة.',
        type: 'space_builder',
        visualType: 'rocket_launchpad',
        visualData: { spaceStep: st.task },
        options: deterministShuffle(opts, i * 17),
        explanation: `رائد فضاء متميز! تركيب ${st.choice} اكتمل بنجاح والمركبة جاهزة للإطلاق.`,
      });
    }
  }

  // =========================================================================
  // 23. محطة القطار (قطار المعرفة) - 50 Train journey challenges
  // =========================================================================
  else if (gameId === 23) {
    const trainTasks = [
      { task: 'قطار المعرفة ينطلق من المحطة 1 نحو المحطة 3، كم عربة يجر القطار إذا كانت كل عربة تحمل لوناً مميزاً؟', choice: '3 عربات ملونة 🚃🚃🚃', wrong1: '10 عربات ثقيلة', wrong2: 'عربة واحدة فقط' },
      { task: 'أي تحذير صوتي أو ضوئي يطلقه القطار لتنبيه المشاة عند الاقتراب من التقاطع؟', choice: 'صفارة القطار المرحة وإشارة الضوء الأصفر 🚂🔔', wrong1: 'إطفاء كل الأنوار', wrong2: 'التوقف المفاجئ في الماء' },
      { task: 'ماذا يسمى المسار الحديدي الذي تسير عليه عجلات القطار الفولاذية؟', choice: 'سكة الحديد وقضبان الفولاذ 🛤️', wrong1: 'طريق رملي وعر', wrong2: 'مسار عشبي رطب' },
      { task: 'وصل القطار لمحطة الزهور! أي رمز يدل على محطة الزهور في خريطة المسار؟', choice: 'أيقونة الوردة الزهرية 🌸🚉', wrong1: 'أيقونة الثلج البارد ❄️', wrong2: 'أيقونة الصخور 🪨' },
      { task: 'إذا ركب 4 ركاب في المحطة الأولى وركب 3 ركاب في المحطة الثانية، كم راكباً في القطار الآن؟', choice: '7 ركاب سعداء 👨‍👩‍👧‍👦', wrong1: '5 ركاب', wrong2: '9 ركاب' },
    ];

    for (let i = 0; i < 50; i++) {
      const tt = trainTasks[i % trainTasks.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: tt.choice, isCorrect: true, visual: '🚂' },
        { id: `opt_${i}_2`, text: tt.wrong1, isCorrect: false, visual: '🛤️' },
        { id: `opt_${i}_3`, text: tt.wrong2, isCorrect: false, visual: '🎫' },
      ];
      questions.push({
        id: qNum,
        gameId: 23,
        prompt: `[محطة ${qNum}]: رحلة قطار المعرفة السريع: ${tt.task}`,
        hint: 'تابع مسار القطار وعرباته بدقة وتركيز.',
        type: 'train_challenge',
        visualType: 'train_track',
        visualData: { stationNumber: qNum },
        options: deterministShuffle(opts, i * 7),
        explanation: `توووت توووت! إجابة صحيحة، وصل القطار بسلام إلى المحطة! 🚂`,
      });
    }
  }

  // =========================================================================
  // 24. بوابة النجوم (تحدي النجوم) - 50 Grand Master Challenges
  // =========================================================================
  else if (gameId === 24) {
    const starChallenges = [
      { prompt: 'أي نجم من نجوم البوابة يضيء بأقوى طاقة منطقية إذا كان: أزرق > أحمر، وأحمر > أصفر؟', ans: 'النجم الأزرق 🔷', wrong: ['النجم الأحمر 🔴', 'النجم الأصفر 🟡'] },
      { prompt: 'إذا كانت النجمة الذهبية تزن 4 نقاط، والقمر يزن نقطتين، فكم تزن نجمتان وقمر واحد معاً؟', ans: '10 نقاط (4 + 4 + 2) 🌟', wrong: ['8 نقاط', '12 نقطة'] },
      { prompt: 'ما هو الشكل الهندسي المتناغم الذي يتشكل عند توصيل نجوم الدب الأكبر السبعة؟', ans: 'شكل المغرفة الكونية المتلألئة 🌌', wrong: ['دائرة مغلقة تامة', 'مثلث مستقيم'] },
      { prompt: 'أي مفتاح كوني يفتح بوابة النجوم: مفتاح الضوء أم مفتاح الظلام؟', ans: 'مفتاح ضياء المعرفة الذهبي 🗝️✨', wrong: ['مفتاح الضباب والرماد', 'مفتاح الصخور'] },
      { prompt: 'اكتشف النمط السري في أرقام البوابة: 3، 6، 9، 12، ما هو الرقم الذهبي التالي؟', ans: 'الرقم 15 (زيادة 3 في كل نجم) 🌟', wrong: ['الرقم 14', 'الرقم 16'] },
      { prompt: 'كم عدد أضلاع النجمة الخماسية الكلاسيكية؟', ans: '5 أضلاع ورؤوس ذهبية ⭐', wrong: ['4 أضلاع', '6 أضلاع'] },
      { prompt: 'إذا جمعنا نجوم الشجاعة 3 ونجوم الحكمة 4 ونجوم الإبداع 5، كم نجمة سحرية أصبح لدينا؟', ans: '12 نجمة سحرية متألقة 🌟', wrong: ['10 نجوم', '14 نجمة'] },
    ];

    for (let i = 0; i < 50; i++) {
      const sc = starChallenges[i % starChallenges.length];
      const qNum = i + 1;
      const opts: IslandOption[] = [
        { id: `opt_${i}_1`, text: sc.ans, isCorrect: true, visual: '🌟' },
        { id: `opt_${i}_2`, text: sc.wrong[0], isCorrect: false, visual: '✨' },
        { id: `opt_${i}_3`, text: sc.wrong[1], isCorrect: false, visual: '💫' },
      ];
      questions.push({
        id: qNum,
        gameId: 24,
        prompt: `[نجم ${qNum}]: التحدي الأسطوري لبوابة النجوم: ${sc.prompt}`,
        hint: 'اجمع بين الذكاء والمنطق والذاكرة لفتح أسرار البوابة!',
        type: 'star_portal_challenge',
        visualType: 'celestial_gate',
        visualData: { starChallengeIndex: i },
        options: deterministShuffle(opts, i * 29),
        explanation: `أسطوري ومبهر! لقد فككت شيفرة بوابة النجوم بنجاح: ${sc.ans}.`,
      });
    }
  }

  return questions;
};
