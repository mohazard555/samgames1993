import { ChildSkillGame } from '../types/childSkillsTypes';

export const CHILD_SKILLS_GAMES: ChildSkillGame[] = [
  // 1. 🖼️ طابق الصورة
  {
    id: 1,
    icon: '🖼️',
    title: 'طابق الصورة',
    shortDesc: 'اختر الصورة المطابقة تماماً للصورة الكبيرة',
    skill: 'الملاحظة والتمييز البصري',
    category: 'visual',
    color: 'from-purple-500 to-indigo-600',
    minUnlockGames: 0,
    challenges: {
      easy: [
        {
          id: 'g1_e1',
          instruction: 'أي صورة تطابق الصورة الكبيرة في الأعلى؟',
          type: 'choice',
          targetVisual: '🐶',
          targetLabel: 'كلب لطيف',
          data: {
            options: [
              { id: '1', visual: '🐶', label: 'كلب لطيف', isCorrect: true },
              { id: '2', visual: '🐱', label: 'قطة أليفة', isCorrect: false },
            ],
          },
        },
        {
          id: 'g1_e2',
          instruction: 'أي صورة تطابق الصورة الكبيرة؟',
          type: 'choice',
          targetVisual: '🍎',
          targetLabel: 'تفاحة حمراء',
          data: {
            options: [
              { id: '1', visual: '🍌', label: 'موزة صفراء', isCorrect: false },
              { id: '2', visual: '🍎', label: 'تفاحة حمراء', isCorrect: true },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g1_m1',
          instruction: 'طابق وسيلة النقل الصحيحة:',
          type: 'choice',
          targetVisual: '🚗',
          targetLabel: 'سيارة حمراء',
          data: {
            options: [
              { id: '1', visual: '🚗', label: 'سيارة حمراء', isCorrect: true },
              { id: '2', visual: '🚌', label: 'حافلة صفراء', isCorrect: false },
              { id: '3', visual: '✈️', label: 'طائرة سريعة', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g1_h1',
          instruction: 'دقق جيداً واختر الصورة المتطابقة:',
          type: 'choice',
          targetVisual: '🦁',
          targetLabel: 'أسد شجاع',
          data: {
            options: [
              { id: '1', visual: '🐯', label: 'نمر مخطط', isCorrect: false },
              { id: '2', visual: '🐱', label: 'قطة صغيرة', isCorrect: false },
              { id: '3', visual: '🦁', label: 'أسد شجاع', isCorrect: true },
              { id: '4', visual: '🦊', label: 'ثعلب ماكر', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 2. 🔍 أين الاختلاف؟
  {
    id: 2,
    icon: '🔍',
    title: 'أين الاختلاف؟',
    shortDesc: 'ابحث عن العنصر المختلف بين العناصر المتشابهة',
    skill: 'التركيز والانتباه ودقة الملاحظة',
    category: 'visual',
    color: 'from-amber-500 to-orange-600',
    minUnlockGames: 0,
    challenges: {
      easy: [
        {
          id: 'g2_e1',
          instruction: 'أي عنصر هو المختلف عن باقي العناصر؟ اضغط عليه:',
          type: 'choice',
          data: {
            question: 'ابحث عن العنصر المختلف:',
            options: [
              { id: '1', visual: '🍎', label: 'تفاحة', isCorrect: false },
              { id: '2', visual: '🍎', label: 'تفاحة', isCorrect: false },
              { id: '3', visual: '🍌', label: 'موزة (مختلف)', isCorrect: true },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g2_m1',
          instruction: 'اضغط على الحيوان المختلف بين المجموعة:',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🐶', label: 'كلب', isCorrect: false },
              { id: '2', visual: '🐱', label: 'قطة (مختلف)', isCorrect: true },
              { id: '3', visual: '🐶', label: 'كلب', isCorrect: false },
              { id: '4', visual: '🐶', label: 'كلب', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g2_h1',
          instruction: 'اكتشف العنصر غير المتشابه واضغط عليه:',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🚗', label: 'سيارة', isCorrect: false },
              { id: '2', visual: '🚗', label: 'سيارة', isCorrect: false },
              { id: '3', visual: '🚗', label: 'سيارة', isCorrect: false },
              { id: '4', visual: '✈️', label: 'طائرة (مختلف)', isCorrect: true },
              { id: '5', visual: '🚗', label: 'سيارة', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 3. 🧩 أكمل الصورة
  {
    id: 3,
    icon: '🧩',
    title: 'أكمل الصورة',
    shortDesc: 'اختر القطعة المناسبة التي تكمل الصورة أو الشكل',
    skill: 'التفكير المنطقي والإدراك البصري',
    category: 'logic',
    color: 'from-blue-500 to-cyan-600',
    minUnlockGames: 0,
    challenges: {
      easy: [
        {
          id: 'g3_e1',
          instruction: 'ما هو النصف الآخر لشجرة الخضراء؟ 🌳',
          type: 'choice',
          targetVisual: '🌳',
          targetLabel: 'شجرة خضراء',
          data: {
            options: [
              { id: '1', visual: '🌳', label: 'نصف الشجرة', isCorrect: true },
              { id: '2', visual: '🚗', label: 'عجلة سيارة', isCorrect: false },
              { id: '3', visual: '🏠', label: 'باب منزل', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g3_m1',
          instruction: 'من يكمل عائلة الفواكه الصيفية؟ 🍉 🍓 _ ؟',
          type: 'choice',
          targetVisual: '🍉',
          data: {
            options: [
              { id: '1', visual: '🍇', label: 'عنب صيفي', isCorrect: true },
              { id: '2', visual: '👟', label: 'حذاء', isCorrect: false },
              { id: '3', visual: '📚', label: 'كتاب', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g3_h1',
          instruction: 'اختر القطعة الهندسية المكملة للمربع:',
          type: 'choice',
          targetVisual: '🟩',
          data: {
            options: [
              { id: '1', visual: '🟩', label: 'قطعة المربع', isCorrect: true },
              { id: '2', visual: '🔺', label: 'مثلث', isCorrect: false },
              { id: '3', visual: '🔵', label: 'دائرة', isCorrect: false },
              { id: '4', visual: '⭐', label: 'نجمة', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 4. 🧠 لعبة الذاكرة
  {
    id: 4,
    icon: '🧠',
    title: 'لعبة الذاكرة',
    shortDesc: 'اقلب البطاقات واعثر على الأزواج المتطابقة',
    skill: 'قوة الذاكرة والتركيز والربط الذهني',
    category: 'memory',
    color: 'from-pink-500 to-rose-600',
    minUnlockGames: 0,
    challenges: {
      easy: [
        {
          id: 'g4_e1',
          instruction: 'اعثر على بطاقتين متطابقتين (زوجين):',
          type: 'memory',
          data: {
            pairs: ['🍎', '🐶'],
          },
        },
      ],
      medium: [
        {
          id: 'g4_m1',
          instruction: 'اقلب البطاقات واعثر على الأزواج الثلاثة:',
          type: 'memory',
          data: {
            pairs: ['🍎', '🐶', '🚗'],
          },
        },
      ],
      hard: [
        {
          id: 'g4_h1',
          instruction: 'تحدي الذاكرة القوية: اعثر على جميع الأزواج الأربعة:',
          type: 'memory',
          data: {
            pairs: ['🍎', '🐶', '🚗', '⭐'],
          },
        },
      ],
    },
  },

  // 5. 🎨 لوّن حسب المطلوب
  {
    id: 5,
    icon: '🎨',
    title: 'لوّن حسب المطلوب',
    shortDesc: 'اختر اللون الصحيح لتلوين الشكل المطلوب',
    skill: 'معرفة الألوان والتمييز اللوني',
    category: 'visual',
    color: 'from-emerald-500 to-teal-600',
    minUnlockGames: 0,
    challenges: {
      easy: [
        {
          id: 'g5_e1',
          instruction: 'لوّن الدائرة باللون الأحمر 🔴:',
          type: 'coloring',
          targetVisual: '⚪',
          data: {
            correctColor: '#ef4444',
            colorName: 'أحمر',
            palette: [
              { color: '#ef4444', label: 'أحمر', emoji: '🔴' },
              { color: '#3b82f6', label: 'أزرق', emoji: '🔵' },
              { color: '#eab308', label: 'أصفر', emoji: '🟡' },
              { color: '#22c55e', label: 'أخضر', emoji: '🟢' },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g5_m1',
          instruction: 'لوّن المربع باللون الأزرق 🔵:',
          type: 'coloring',
          targetVisual: '⬜',
          data: {
            correctColor: '#3b82f6',
            colorName: 'أزرق',
            palette: [
              { color: '#22c55e', label: 'أخضر', emoji: '🟢' },
              { color: '#3b82f6', label: 'أزرق', emoji: '🔵' },
              { color: '#a855f7', label: 'بنفسجي', emoji: '🟣' },
              { color: '#f97316', label: 'برتقالي', emoji: '🟠' },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g5_h1',
          instruction: 'لوّن النجمة باللون الأصفر الذهبي 🟡:',
          type: 'coloring',
          targetVisual: '⭐',
          data: {
            correctColor: '#eab308',
            colorName: 'أصفر ذهبي',
            palette: [
              { color: '#ef4444', label: 'أحمر', emoji: '🔴' },
              { color: '#a855f7', label: 'بنفسجي', emoji: '🟣' },
              { color: '#eab308', label: 'أصفر', emoji: '🟡' },
              { color: '#10b981', label: 'أخضر', emoji: '🟢' },
            ],
          },
        },
      ],
    },
  },

  // 6. 🔴 ابحث عن اللون
  {
    id: 6,
    icon: '🔴',
    title: 'ابحث عن اللون',
    shortDesc: 'اضغط على كل الأشياء التي تحمل اللون المطلوب',
    skill: 'التركيز وتمييز الألوان في البيئة',
    category: 'visual',
    color: 'from-rose-500 to-red-600',
    minUnlockGames: 0,
    challenges: {
      easy: [
        {
          id: 'g6_e1',
          instruction: 'اضغط على كل الأشياء الحمراء 🔴:',
          type: 'find_multi',
          data: {
            targetLabel: 'أحمر',
            items: [
              { id: '1', visual: '🍎', label: 'تفاحة حمراء', isTarget: true },
              { id: '2', visual: '🍌', label: 'موزة صفراء', isTarget: false },
              { id: '3', visual: '🍓', label: 'فراولة حمراء', isTarget: true },
              { id: '4', visual: '🥦', label: 'بروكلي أخضر', isTarget: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g6_m1',
          instruction: 'اضغط على جميع العناصر الخضراء 🟢:',
          type: 'find_multi',
          data: {
            targetLabel: 'أخضر',
            items: [
              { id: '1', visual: '🥦', label: 'بروكلي', isTarget: true },
              { id: '2', visual: '🍅', label: 'طماطم', isTarget: false },
              { id: '3', visual: '🥒', label: 'خيار', isTarget: true },
              { id: '4', visual: '🌳', label: 'شجرة', isTarget: true },
              { id: '5', visual: '🍊', label: 'برتقالة', isTarget: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g6_h1',
          instruction: 'اضغط على جميع العناصر الصفراء 🟡:',
          type: 'find_multi',
          data: {
            targetLabel: 'أصفر',
            items: [
              { id: '1', visual: '🍌', label: 'موزة', isTarget: true },
              { id: '2', visual: '☀️', label: 'شمس', isTarget: true },
              { id: '3', visual: '🍎', label: 'تفاحة', isTarget: false },
              { id: '4', visual: '🍋', label: 'ليمونة', isTarget: true },
              { id: '5', visual: '🚙', label: 'سيارة زرقاء', isTarget: false },
              { id: '6', visual: '⭐', label: 'نجمة', isTarget: true },
            ],
          },
        },
      ],
    },
  },

  // 7. 🔺 طابق الشكل
  {
    id: 7,
    icon: '🔺',
    title: 'طابق الشكل',
    shortDesc: 'اختر الشكل الهندسي المطابق للشكل المعروض',
    skill: 'التعرف على الأشكال الهندسية الأساسية',
    category: 'visual',
    color: 'from-amber-600 to-yellow-600',
    minUnlockGames: 0,
    challenges: {
      easy: [
        {
          id: 'g7_e1',
          instruction: 'أي من الأشكال التالية هو مثلث 🔺؟',
          type: 'choice',
          targetVisual: '🔺',
          targetLabel: 'مثلث',
          data: {
            options: [
              { id: '1', visual: '🔺', label: 'مثلث', isCorrect: true },
              { id: '2', visual: '🔵', label: 'دائرة', isCorrect: false },
              { id: '3', visual: '🟩', label: 'مربع', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g7_m1',
          instruction: 'طابق شكل الدائرة 🔵:',
          type: 'choice',
          targetVisual: '🔵',
          data: {
            options: [
              { id: '1', visual: '🟩', label: 'مربع', isCorrect: false },
              { id: '2', visual: '🔵', label: 'دائرة', isCorrect: true },
              { id: '3', visual: '⭐', label: 'نجمة', isCorrect: false },
              { id: '4', visual: '🔺', label: 'مثلث', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g7_h1',
          instruction: 'طابق شكل النجمة الخماسية ⭐:',
          type: 'choice',
          targetVisual: '⭐',
          data: {
            options: [
              { id: '1', visual: '❤️', label: 'قلب', isCorrect: false },
              { id: '2', visual: '⭐', label: 'نجمة', isCorrect: true },
              { id: '3', visual: '🔷', label: 'معين', isCorrect: false },
              { id: '4', visual: '🟩', label: 'مربع', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 8. 🔢 عدّ الأشياء
  {
    id: 8,
    icon: '🔢',
    title: 'عدّ الأشياء',
    shortDesc: 'عد التفاحات أو العناصر واختر الرقم الصحيح',
    skill: 'مهارات العد ومفهوم الكميات',
    category: 'math',
    color: 'from-sky-500 to-blue-600',
    minUnlockGames: 0,
    challenges: {
      easy: [
        {
          id: 'g8_e1',
          instruction: 'كم تفاحة تشاهد أمامك؟ 🍎 🍎 🍎 🍎',
          type: 'count',
          targetVisual: '🍎',
          data: {
            count: 4,
            visual: '🍎',
            options: [2, 3, 4],
            correct: 4,
          },
        },
      ],
      medium: [
        {
          id: 'g8_m1',
          instruction: 'كم نجمة ساطعة في السماء؟',
          type: 'count',
          targetVisual: '⭐',
          data: {
            count: 6,
            visual: '⭐',
            options: [5, 6, 7],
            correct: 6,
          },
        },
      ],
      hard: [
        {
          id: 'g8_h1',
          instruction: 'عد السيارات بسرعة وبدقة:',
          type: 'count',
          targetVisual: '🚗',
          data: {
            count: 8,
            visual: '🚗',
            options: [7, 8, 9],
            correct: 8,
          },
        },
      ],
    },
  },

  // 9. ➕ اجمع الأشياء
  {
    id: 9,
    icon: '➕',
    title: 'اجمع الأشياء',
    shortDesc: 'اجمع العناصر معاً واحسب المجموع الإجمالي',
    skill: 'مبادئ الجمع الحسابي المبكر',
    category: 'math',
    color: 'from-green-500 to-emerald-600',
    minUnlockGames: 0,
    challenges: {
      easy: [
        {
          id: 'g9_e1',
          instruction: 'كم تفاحة لدينا في المجموع؟ 🍎🍎 + 🍎',
          type: 'add_sub',
          data: {
            leftCount: 2,
            rightCount: 1,
            op: '+',
            visual: '🍎',
            options: [2, 3, 4],
            correct: 3,
          },
        },
      ],
      medium: [
        {
          id: 'g9_m1',
          instruction: 'اجمع النجوم معاً: ⭐⭐⭐ + ⭐⭐',
          type: 'add_sub',
          data: {
            leftCount: 3,
            rightCount: 2,
            op: '+',
            visual: '⭐',
            options: [4, 5, 6],
            correct: 5,
          },
        },
      ],
      hard: [
        {
          id: 'g9_h1',
          instruction: 'احسب مجموع الكرات: ⚽⚽⚽ + ⚽⚽⚽',
          type: 'add_sub',
          data: {
            leftCount: 3,
            rightCount: 3,
            op: '+',
            visual: '⚽',
            options: [5, 6, 7],
            correct: 6,
          },
        },
      ],
    },
  },

  // 10. ➖ اطرح الأشياء
  {
    id: 10,
    icon: '➖',
    title: 'اطرح الأشياء',
    shortDesc: 'نقص العناصر واحسب الكمية المتبقية',
    skill: 'مبادئ الطرح والإنقاص الحسابي',
    category: 'math',
    color: 'from-red-500 to-rose-600',
    minUnlockGames: 0,
    challenges: {
      easy: [
        {
          id: 'g10_e1',
          instruction: 'كان لدينا 4 تفاحات 🍎🍎🍎🍎، أكلنا واحدة 🍎، كم بقي؟',
          type: 'add_sub',
          data: {
            leftCount: 4,
            rightCount: 1,
            op: '-',
            visual: '🍎',
            options: [2, 3, 4],
            correct: 3,
          },
        },
      ],
      medium: [
        {
          id: 'g10_m1',
          instruction: 'لدينا 5 سيارات 🚗🚗🚗🚗🚗، انطلقت سيارتان، كم بقي؟',
          type: 'add_sub',
          data: {
            leftCount: 5,
            rightCount: 2,
            op: '-',
            visual: '🚗',
            options: [2, 3, 4],
            correct: 3,
          },
        },
      ],
      hard: [
        {
          id: 'g10_h1',
          instruction: '6 كرات ⚽، أخذنا منها 3 كرات، كم بقي؟',
          type: 'add_sub',
          data: {
            leftCount: 6,
            rightCount: 3,
            op: '-',
            visual: '⚽',
            options: [2, 3, 4],
            correct: 3,
          },
        },
      ],
    },
  },

  // 11. 🔤 الحرف المفقود
  {
    id: 11,
    icon: '🔤',
    title: 'الحرف المفقود',
    shortDesc: 'اختر الحرف الناقص لتكوين الكلمة',
    skill: 'القراءة المبكرة والوعي الصوتي',
    category: 'language',
    color: 'from-violet-500 to-purple-600',
    minUnlockGames: 1,
    challenges: {
      easy: [
        {
          id: 'g11_e1',
          instruction: 'ما هو الحرف المفقود لتصبح الكلمة (بيت) 🏠؟ ب _ ت',
          type: 'choice',
          targetVisual: '🏠',
          data: {
            word: 'ب _ ت',
            options: [
              { id: '1', visual: 'ي', label: 'ي (بَيْت)', isCorrect: true },
              { id: '2', visual: 'ا', label: 'ا', isCorrect: false },
              { id: '3', visual: 'و', label: 'و', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g11_m1',
          instruction: 'ما الحرف الناقص لكلمة (شمس) ☀️؟ ش _ س',
          type: 'choice',
          targetVisual: '☀️',
          data: {
            word: 'ش _ س',
            options: [
              { id: '1', visual: 'م', label: 'م (شَمْس)', isCorrect: true },
              { id: '2', visual: 'ر', label: 'ر', isCorrect: false },
              { id: '3', visual: 'ل', label: 'ل', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g11_h1',
          instruction: 'الحرف الناقص لكلمة (كتاب) 📚؟ ك _ اب',
          type: 'choice',
          targetVisual: '📚',
          data: {
            word: 'ك _ اب',
            options: [
              { id: '1', visual: 'ت', label: 'ت (كِتَاب)', isCorrect: true },
              { id: '2', visual: 'س', label: 'س', isCorrect: false },
              { id: '3', visual: 'د', label: 'د', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 12. 🧩 أكمل الكلمة
  {
    id: 12,
    icon: '🧩',
    title: 'أكمل الكلمة',
    shortDesc: 'اختر الحرف الصحيح ليكتمل اسم الشيء المعروض',
    skill: 'تركيب الكلمات والتهجئة البسيطة',
    category: 'language',
    color: 'from-indigo-500 to-blue-600',
    minUnlockGames: 1,
    challenges: {
      easy: [
        {
          id: 'g12_e1',
          instruction: 'أكمل كلمة (قلم) ✏️: ق _ م',
          type: 'choice',
          targetVisual: '✏️',
          data: {
            options: [
              { id: '1', visual: 'ل', label: 'ل (قَلَم)', isCorrect: true },
              { id: '2', visual: 'د', label: 'د', isCorrect: false },
              { id: '3', visual: 'ر', label: 'ر', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g12_m1',
          instruction: 'أكمل كلمة (أسد) 🦁: أ _ د',
          type: 'choice',
          targetVisual: '🦁',
          data: {
            options: [
              { id: '1', visual: 'س', label: 'س (أَسَد)', isCorrect: true },
              { id: '2', visual: 'ص', label: 'ص', isCorrect: false },
              { id: '3', visual: 'م', label: 'م', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g12_h1',
          instruction: 'أكمل كلمة (وردة) 🌸: و _ دة',
          type: 'choice',
          targetVisual: '🌸',
          data: {
            options: [
              { id: '1', visual: 'ر', label: 'ر (وَرْدَة)', isCorrect: true },
              { id: '2', visual: 'ز', label: 'ز', isCorrect: false },
              { id: '3', visual: 'ل', label: 'ل', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 13. 🔠 طابق الحرف
  {
    id: 13,
    icon: '🔠',
    title: 'طابق الحرف',
    shortDesc: 'اختر الحرف المطابق للحرف الكبير المعروض',
    skill: 'التعرف البصري على الحروف الهجائية',
    category: 'language',
    color: 'from-teal-500 to-emerald-600',
    minUnlockGames: 1,
    challenges: {
      easy: [
        {
          id: 'g13_e1',
          instruction: 'طابق الحرف ( أ ):',
          type: 'choice',
          targetVisual: 'أ',
          targetLabel: 'حرف الألف',
          data: {
            options: [
              { id: '1', visual: 'أ', label: 'أ', isCorrect: true },
              { id: '2', visual: 'ب', label: 'ب', isCorrect: false },
              { id: '3', visual: 'ت', label: 'ت', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g13_m1',
          instruction: 'طابق الحرف ( م ):',
          type: 'choice',
          targetVisual: 'م',
          targetLabel: 'حرف الميم',
          data: {
            options: [
              { id: '1', visual: 'ن', label: 'ن', isCorrect: false },
              { id: '2', visual: 'م', label: 'م', isCorrect: true },
              { id: '3', visual: 'ل', label: 'ل', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g13_h1',
          instruction: 'طابق الحرف ( س ):',
          type: 'choice',
          targetVisual: 'س',
          targetLabel: 'حرف السين',
          data: {
            options: [
              { id: '1', visual: 'ش', label: 'ش', isCorrect: false },
              { id: '2', visual: 'ص', label: 'ص', isCorrect: false },
              { id: '3', visual: 'س', label: 'س', isCorrect: true },
              { id: '4', visual: 'ض', label: 'ض', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 14. 🔢 رتب الأرقام
  {
    id: 14,
    icon: '🔢',
    title: 'رتب الأرقام',
    shortDesc: 'رتب الأرقام تصاعدياً من الأصغر إلى الأكبر',
    skill: 'التسلسل العددي والترتيب المنطقي',
    category: 'math',
    color: 'from-amber-500 to-orange-600',
    minUnlockGames: 2,
    challenges: {
      easy: [
        {
          id: 'g14_e1',
          instruction: 'رتب الأرقام التالية من الأصغر للأكبر ( 3 - 1 - 2 ):',
          type: 'ordering',
          data: {
            items: ['1', '2', '3'],
            scrambled: ['3', '1', '2'],
          },
        },
      ],
      medium: [
        {
          id: 'g14_m1',
          instruction: 'رتب الأرقام ( 4 - 2 - 1 - 3 ):',
          type: 'ordering',
          data: {
            items: ['1', '2', '3', '4'],
            scrambled: ['4', '2', '1', '3'],
          },
        },
      ],
      hard: [
        {
          id: 'g14_h1',
          instruction: 'رتب الأرقام الخمسة تصاعدياً:',
          type: 'ordering',
          data: {
            items: ['1', '2', '3', '4', '5'],
            scrambled: ['5', '3', '1', '4', '2'],
          },
        },
      ],
    },
  },

  // 15. 📏 الكبير والصغير
  {
    id: 15,
    icon: '📏',
    title: 'الكبير والصغير',
    shortDesc: 'مقارنة الأحجام واختيار العنصر الأكبر أو الأصغر',
    skill: 'مقارنة الأحجام والإدراك المكاني',
    category: 'visual',
    color: 'from-cyan-500 to-blue-600',
    minUnlockGames: 2,
    challenges: {
      easy: [
        {
          id: 'g15_e1',
          instruction: 'أين هو الفيل الأكبر 🐘؟ اضغط عليه:',
          type: 'size_compare',
          data: {
            visual: '🐘',
            targetType: 'largest',
            items: [
              { id: '1', scale: 'lg', isCorrect: true, label: 'فيل كبير' },
              { id: '2', scale: 'sm', isCorrect: false, label: 'فيل صغير' },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g15_m1',
          instruction: 'اضغط على التفاحة الأصغر 🍎:',
          type: 'size_compare',
          data: {
            visual: '🍎',
            targetType: 'smallest',
            items: [
              { id: '1', scale: 'lg', isCorrect: false, label: 'كبيرة' },
              { id: '2', scale: 'sm', isCorrect: true, label: 'صغيرة' },
              { id: '3', scale: 'md', isCorrect: false, label: 'متوسطة' },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g15_h1',
          instruction: 'أين السيارة الأكبر حجماً 🚗؟',
          type: 'size_compare',
          data: {
            visual: '🚗',
            targetType: 'largest',
            items: [
              { id: '1', scale: 'sm', isCorrect: false },
              { id: '2', scale: 'xl', isCorrect: true },
              { id: '3', scale: 'md', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 16. ⚖️ أكثر أم أقل؟
  {
    id: 16,
    icon: '⚖️',
    title: 'أكثر أم أقل؟',
    shortDesc: 'قارن بين المجموعتين واختر المجموعة التي تحتوي على أكثر',
    skill: 'مقارنة الكميات والمجموعات',
    category: 'math',
    color: 'from-yellow-500 to-amber-600',
    minUnlockGames: 2,
    challenges: {
      easy: [
        {
          id: 'g16_e1',
          instruction: 'أي مجموعة تحتوي على تفاح أكثر؟',
          type: 'quantity_compare',
          data: {
            groupA: { count: 3, visual: '🍎', label: '3 تفاحات' },
            groupB: { count: 2, visual: '🍎', label: 'تفاحتان' },
            correct: 'A',
          },
        },
      ],
      medium: [
        {
          id: 'g16_m1',
          instruction: 'أي سلة بها موز أكثر 🍌؟',
          type: 'quantity_compare',
          data: {
            groupA: { count: 2, visual: '🍌', label: 'موزتان' },
            groupB: { count: 5, visual: '🍌', label: '5 موزات' },
            correct: 'B',
          },
        },
      ],
      hard: [
        {
          id: 'g16_h1',
          instruction: 'أين النجوم الأكثر عدداً ⭐؟',
          type: 'quantity_compare',
          data: {
            groupA: { count: 6, visual: '⭐', label: '6 نجوم' },
            groupB: { count: 4, visual: '⭐', label: '4 نجوم' },
            correct: 'A',
          },
        },
      ],
    },
  },

  // 17. 🐾 من صاحب الأثر؟
  {
    id: 17,
    icon: '🐾',
    title: 'من صاحب الأثر؟',
    shortDesc: 'استنتج أي حيوان يملك أثر القدم المعروض',
    skill: 'الاستنتاج والربط والملاحظة العلمية',
    category: 'science',
    color: 'from-orange-500 to-amber-600',
    minUnlockGames: 2,
    challenges: {
      easy: [
        {
          id: 'g17_e1',
          instruction: 'من صاحب هذا الأثر في الأرض 🐾؟',
          type: 'choice',
          targetVisual: '🐾',
          data: {
            options: [
              { id: '1', visual: '🐶', label: 'الكلب اللطيف', isCorrect: true },
              { id: '2', visual: '🐟', label: 'السمكة السابحة', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g17_m1',
          instruction: 'هذا الأثر لحيوان من المزرعة 🐾:',
          type: 'choice',
          targetVisual: '🐾',
          data: {
            options: [
              { id: '1', visual: '🐱', label: 'القطة الأليفة', isCorrect: true },
              { id: '2', visual: '🐍', label: 'الثعبان', isCorrect: false },
              { id: '3', visual: '🐌', label: 'الحلزون', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g17_h1',
          instruction: 'من يترك آثار أقدام ريشية في البركة؟',
          type: 'choice',
          targetVisual: '🐾',
          data: {
            options: [
              { id: '1', visual: '🦆', label: 'البطة المائية', isCorrect: true },
              { id: '2', visual: '🐴', label: 'الحصان', isCorrect: false },
              { id: '3', visual: '🐘', label: 'الفيل', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 18. 🌳 أين يعيش؟
  {
    id: 18,
    icon: '🌳',
    title: 'أين يعيش؟',
    shortDesc: 'حدد البيئة الطبيعية التي يعيش فيها الحيوان',
    skill: 'معرفة الحيوانات والبيئة المحيطة',
    category: 'science',
    color: 'from-green-600 to-teal-700',
    minUnlockGames: 2,
    challenges: {
      easy: [
        {
          id: 'g18_e1',
          instruction: 'أين تعيش السمكة 🐟؟',
          type: 'choice',
          targetVisual: '🐟',
          targetLabel: 'سمكة',
          data: {
            options: [
              { id: '1', visual: '🌊', label: 'في البحر والمياه', isCorrect: true },
              { id: '2', visual: '🌳', label: 'فوق أغصان الشجرة', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g18_m1',
          instruction: 'أين يعيش الأسد 🦁؟',
          type: 'choice',
          targetVisual: '🦁',
          data: {
            options: [
              { id: '1', visual: '🌳', label: 'في الغابة والبراري', isCorrect: true },
              { id: '2', visual: '🌊', label: 'في قاع المحيط', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g18_h1',
          instruction: 'أين يعيش الجمل 🐪؟',
          type: 'choice',
          targetVisual: '🐪',
          data: {
            options: [
              { id: '1', visual: '🏜️', label: 'في رمال الصحراء', isCorrect: true },
              { id: '2', visual: '❄️', label: 'فوق الجبال الجليدية', isCorrect: false },
              { id: '3', visual: '🌊', label: 'في أعماق النهر', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 19. 🍎 فاكهة أم خضار؟
  {
    id: 19,
    icon: '🍎',
    title: 'فاكهة أم خضار؟',
    shortDesc: 'صنف العنصر الغذائي إلى فاكهة لذيذة أو خضار مفيد',
    skill: 'التصنيف الغذائي والمعرفة العامة',
    category: 'science',
    color: 'from-rose-500 to-red-600',
    minUnlockGames: 3,
    challenges: {
      easy: [
        {
          id: 'g19_e1',
          instruction: 'التفاحة 🍎 هل هي فاكهة أم خضار؟',
          type: 'choice',
          targetVisual: '🍎',
          targetLabel: 'تفاحة',
          data: {
            options: [
              { id: '1', visual: '🍎', label: 'فاكهة حلوة', isCorrect: true },
              { id: '2', visual: '🥕', label: 'خضار', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g19_m1',
          instruction: 'الجزر 🥕 هل هو فاكهة أم خضار؟',
          type: 'choice',
          targetVisual: '🥕',
          data: {
            options: [
              { id: '1', visual: '🥕', label: 'خضار مقرمش ومفيد', isCorrect: true },
              { id: '2', visual: '🍎', label: 'فاكهة', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g19_h1',
          instruction: 'البروكلي 🥦 هل هو فاكهة أم خضار؟',
          type: 'choice',
          targetVisual: '🥦',
          data: {
            options: [
              { id: '1', visual: '🥦', label: 'خضار صحي', isCorrect: true },
              { id: '2', visual: '🍎', label: 'فاكهة', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 20. 🧺 ضع الشيء في مكانه
  {
    id: 20,
    icon: '🧺',
    title: 'ضع الشيء في مكانه',
    shortDesc: 'ضع كل شيء في مكانه الصحيح المنظم بالمنزل',
    skill: 'التنظيم والترتيب والربط الوظيفي',
    category: 'social',
    color: 'from-amber-600 to-orange-700',
    minUnlockGames: 3,
    challenges: {
      easy: [
        {
          id: 'g20_e1',
          instruction: 'أين نضع دمية الدب 🧸 عند النوم؟',
          type: 'choice',
          targetVisual: '🧸',
          data: {
            options: [
              { id: '1', visual: '🛏️', label: 'على السرير في غرفة النوم', isCorrect: true },
              { id: '2', visual: '🍽️', label: 'في طبق الطعام', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g20_m1',
          instruction: 'أين نضع التفاحة 🍎 لنأكلها؟',
          type: 'choice',
          targetVisual: '🍎',
          data: {
            options: [
              { id: '1', visual: '🍽️', label: 'في طبق الطعام', isCorrect: true },
              { id: '2', visual: '👞', label: 'داخل الحذاء', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g20_h1',
          instruction: 'أين نحفظ الكتب والقصص 📚؟',
          type: 'choice',
          targetVisual: '📚',
          data: {
            options: [
              { id: '1', visual: '🎒', label: 'في الحقيبة المدرسية', isCorrect: true },
              { id: '2', visual: '🧺', label: 'في سلة الغسيل', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 21. 🚗 ما وسيلة النقل؟
  {
    id: 21,
    icon: '🚗',
    title: 'ما وسيلة النقل؟',
    shortDesc: 'تعرف على وسيلة النقل المناسبة من خلال الصورة',
    skill: 'المعرفة العامة والتعرف على المركبات',
    category: 'social',
    color: 'from-blue-600 to-indigo-700',
    minUnlockGames: 3,
    challenges: {
      easy: [
        {
          id: 'g21_e1',
          instruction: 'ما هي وسيلة النقل في الصورة 🚗؟',
          type: 'choice',
          targetVisual: '🚗',
          data: {
            options: [
              { id: '1', visual: '🚗', label: 'سيارة', isCorrect: true },
              { id: '2', visual: '✈️', label: 'طائرة', isCorrect: false },
              { id: '3', visual: '🚢', label: 'سفينة', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g21_m1',
          instruction: 'ما هي وسيلة النقل التي تطير في السماء ✈️؟',
          type: 'choice',
          targetVisual: '✈️',
          data: {
            options: [
              { id: '1', visual: '✈️', label: 'طائرة تطير', isCorrect: true },
              { id: '2', visual: '🚌', label: 'حافلة تسير بالشارع', isCorrect: false },
              { id: '3', visual: '🚲', label: 'دراجة هوائية', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g21_h1',
          instruction: 'ما وسيلة النقل التي تبحر في المياه 🚢؟',
          type: 'choice',
          targetVisual: '🚢',
          data: {
            options: [
              { id: '1', visual: '🚢', label: 'سفينة بحرية', isCorrect: true },
              { id: '2', visual: '🚆', label: 'قطار سكة حديد', isCorrect: false },
              { id: '3', visual: '🚗', label: 'سيارة', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 22. 🏠 أين ينتمي؟
  {
    id: 22,
    icon: '🏠',
    title: 'أين ينتمي؟',
    shortDesc: 'هل ينتمي هذا الشيء للمنزل أم للحديقة والطبيعة؟',
    skill: 'التصنيف المكاني وفهم البيئة',
    category: 'social',
    color: 'from-emerald-500 to-teal-700',
    minUnlockGames: 3,
    challenges: {
      easy: [
        {
          id: 'g22_e1',
          instruction: 'السرير 🛏️ أين مكانه الطبيعي؟',
          type: 'choice',
          targetVisual: '🛏️',
          data: {
            options: [
              { id: '1', visual: '🏠', label: 'في المنزل', isCorrect: true },
              { id: '2', visual: '🌳', label: 'في الحديقة بالشارع', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g22_m1',
          instruction: 'الأشجار والزهور 🌳 أين مكانها؟',
          type: 'choice',
          targetVisual: '🌳',
          data: {
            options: [
              { id: '1', visual: '🌳', label: 'في الحديقة والطبيعة', isCorrect: true },
              { id: '2', visual: '🏠', label: 'داخل غرفة النوم', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g22_h1',
          instruction: 'أريكة الجلوس 🛋️ أين تنتمي؟',
          type: 'choice',
          targetVisual: '🛋️',
          data: {
            options: [
              { id: '1', visual: '🏠', label: 'في صالة المنزل', isCorrect: true },
              { id: '2', visual: '🌊', label: 'في قاع البحر', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 23. 👤 طابق الظل
  {
    id: 23,
    icon: '👤',
    title: 'طابق الظل',
    shortDesc: 'ابحث عن الظل الأسود المطابق للشكل الملون',
    skill: 'الإدراك البصري وإدراك معالم الأشكال',
    category: 'visual',
    color: 'from-slate-700 to-slate-900',
    minUnlockGames: 4,
    challenges: {
      easy: [
        {
          id: 'g23_e1',
          instruction: 'أي من الظلال التالية يطابق صورة التفاحة 🍎؟',
          type: 'choice',
          targetVisual: '🍎',
          targetLabel: 'تفاحة ملونة',
          data: {
            options: [
              { id: '1', visual: '🍎', isSilhouette: true, label: 'ظل التفاحة', isCorrect: true },
              { id: '2', visual: '🚗', isSilhouette: true, label: 'ظل السيارة', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g23_m1',
          instruction: 'طابق ظل الطائر 🐦 المحلق:',
          type: 'choice',
          targetVisual: '🐦',
          data: {
            options: [
              { id: '1', visual: '🐘', isSilhouette: true, label: 'ظل الفيل', isCorrect: false },
              { id: '2', visual: '🐦', isSilhouette: true, label: 'ظل الطائر', isCorrect: true },
              { id: '3', visual: '🚗', isSilhouette: true, label: 'ظل السيارة', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g23_h1',
          instruction: 'أي ظل يطابق شكل السيارة 🚗؟',
          type: 'choice',
          targetVisual: '🚗',
          data: {
            options: [
              { id: '1', visual: '⭐', isSilhouette: true, isCorrect: false },
              { id: '2', visual: '🚗', isSilhouette: true, label: 'ظل السيارة', isCorrect: true },
              { id: '3', visual: '🍎', isSilhouette: true, isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 24. 🕵️ اعثر على الشيء
  {
    id: 24,
    icon: '🕵️',
    title: 'اعثر على الشيء',
    shortDesc: 'ابحث عن الشيء المطلوب في اللوحة واضغط عليه',
    skill: 'البحث البصري والانتباه وسرعة البديهة',
    category: 'visual',
    color: 'from-amber-500 to-yellow-600',
    minUnlockGames: 4,
    challenges: {
      easy: [
        {
          id: 'g24_e1',
          instruction: 'أين الكرة ⚽؟ اضغط عليها بسرعة:',
          type: 'find_hidden',
          targetVisual: '⚽',
          data: {
            items: ['🍎', '🚗', '⚽', '🐶', '📚', '🧸'],
            target: '⚽',
          },
        },
      ],
      medium: [
        {
          id: 'g24_m1',
          instruction: 'ابحث عن النجمة الذهبية ⭐ بين الأشياء:',
          type: 'find_hidden',
          targetVisual: '⭐',
          data: {
            items: ['🚗', '🍎', '🐱', '⭐', '🏀', '🚌', '🍌', '🌸'],
            target: '⭐',
          },
        },
      ],
      hard: [
        {
          id: 'g24_h1',
          instruction: 'أين هو القلم ✏️؟ ابحث واضغط عليه:',
          type: 'find_hidden',
          targetVisual: '✏️',
          data: {
            items: ['🍎', '🚗', '⚽', '🐶', '📚', '🧸', '🌳', '✏️', '✈️'],
            target: '✏️',
          },
        },
      ],
    },
  },

  // 25. ⭐ ابحث عن الشكل المخفي
  {
    id: 25,
    icon: '⭐',
    title: 'ابحث عن الشكل المخفي',
    shortDesc: 'ابحث عن النجمة اللامعة وسط الأشكال المزدحمة',
    skill: 'التركيز البصري العميق وفصل الشكل عن الخلفية',
    category: 'visual',
    color: 'from-purple-600 to-pink-600',
    minUnlockGames: 4,
    challenges: {
      easy: [
        {
          id: 'g25_e1',
          instruction: 'أين النجمة المخفية ⭐؟ اضغط عليها:',
          type: 'find_hidden',
          targetVisual: '⭐',
          data: {
            items: ['🔵', '🟩', '⭐', '🔺'],
            target: '⭐',
          },
        },
      ],
      medium: [
        {
          id: 'g25_m1',
          instruction: 'ابحث عن النجمة وسط الدوائر والمربعات:',
          type: 'find_hidden',
          targetVisual: '⭐',
          data: {
            items: ['🔵', '🟩', '🔺', '🔵', '⭐', '🟩'],
            target: '⭐',
          },
        },
      ],
      hard: [
        {
          id: 'g25_h1',
          instruction: 'ابحث عن القلب الأحمر ❤️ المخفي:',
          type: 'find_hidden',
          targetVisual: '❤️',
          data: {
            items: ['🔵', '🟩', '🔺', '⭐', '🔵', '❤️', '🟩', '🔺'],
            target: '❤️',
          },
        },
      ],
    },
  },

  // 26. 🔄 ماذا يأتي بعد ذلك؟
  {
    id: 26,
    icon: '🔄',
    title: 'ماذا يأتي بعد ذلك؟',
    shortDesc: 'اكتشف النمط وأكمل التسلسل الصحيح',
    skill: 'التسلسل والتفكير الاستدلالي المنطقي',
    category: 'logic',
    color: 'from-teal-600 to-emerald-700',
    minUnlockGames: 4,
    challenges: {
      easy: [
        {
          id: 'g26_e1',
          instruction: 'ما هي الصورة التالية في نمط نمو الزهرة 🌱 ➜ 🌿 ➜ 🌸 ➜ ؟',
          type: 'choice',
          data: {
            sequence: ['🌱', '🌿', '🌸'],
            options: [
              { id: '1', visual: '🌸', label: 'زهرة متفتحة جميلة', isCorrect: true },
              { id: '2', visual: '🚗', label: 'سيارة', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g26_m1',
          instruction: 'أكمل النمط: 🍎 ➜ 🍌 ➜ 🍎 ➜ 🍌 ➜ ؟',
          type: 'choice',
          data: {
            sequence: ['🍎', '🍌', '🍎', '🍌'],
            options: [
              { id: '1', visual: '🍎', label: 'تفاحة', isCorrect: true },
              { id: '2', visual: '🥦', label: 'بروكلي', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g26_h1',
          instruction: 'أكمل نمط الأشكال: 🔵 ➜ 🟩 ➜ 🔵 ➜ 🟩 ➜ ؟',
          type: 'choice',
          data: {
            sequence: ['🔵', '🟩', '🔵', '🟩'],
            options: [
              { id: '1', visual: '🔵', label: 'دائرة زرقاء', isCorrect: true },
              { id: '2', visual: '🔺', label: 'مثلث', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 27. 🧠 رتب الأحداث
  {
    id: 27,
    icon: '🧠',
    title: 'رتب الأحداث',
    shortDesc: 'رتب أحداث اليوم بطريقة صحيحة زمنياً',
    skill: 'التسلسل الزمني وفهم الوقت والروتين',
    category: 'logic',
    color: 'from-indigo-600 to-violet-700',
    minUnlockGames: 5,
    challenges: {
      easy: [
        {
          id: 'g27_e1',
          instruction: 'رتب روتين الصباح ( الاستيقاظ ➜ الإفطار ➜ الذهاب للمدرسة ):',
          type: 'ordering',
          data: {
            items: ['☀️ الاستيقاظ', '🍳 الإفطار', '🎒 المدرسة'],
            scrambled: ['🎒 المدرسة', '☀️ الاستيقاظ', '🍳 الإفطار'],
          },
        },
      ],
      medium: [
        {
          id: 'g27_m1',
          instruction: 'رتب خطوات نمو الشجرة:',
          type: 'ordering',
          data: {
            items: ['🌱 بذرة تنبت', '🌿 شجيرة صغيرة', '🌳 شجرة كبيرة'],
            scrambled: ['🌳 شجرة كبيرة', '🌱 بذرة تنبت', '🌿 شجيرة صغيرة'],
          },
        },
      ],
      hard: [
        {
          id: 'g27_h1',
          instruction: 'رتب أوقات اليوم الأربعة:',
          type: 'ordering',
          data: {
            items: ['🌅 شروق الشمس', '☀️ وقت الظهيرة', '🌇 غروب الشمس', '🌙 الليل والنوم'],
            scrambled: ['🌙 الليل والنوم', '🌅 شروق الشمس', '🌇 غروب الشمس', '☀️ وقت الظهيرة'],
          },
        },
      ],
    },
  },

  // 28. 🚦 ماذا نفعل؟
  {
    id: 28,
    icon: '🚦',
    title: 'ماذا نفعل؟',
    shortDesc: 'تعلم قواعد السلامة وإشارة المرور',
    skill: 'السلامة والوعي المجتمعي والالتزام بالقواعد',
    category: 'social',
    color: 'from-red-600 to-rose-700',
    minUnlockGames: 5,
    challenges: {
      easy: [
        {
          id: 'g28_e1',
          instruction: 'عندما تضيء إشارة المرور باللون الأحمر 🔴، ماذا نفعل؟',
          type: 'choice',
          targetVisual: '🔴',
          data: {
            options: [
              { id: '1', visual: '🛑', label: 'نتوقف فوراً للسلامة', isCorrect: true },
              { id: '2', visual: '🏃', label: 'نركض في الشارع', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g28_m1',
          instruction: 'عندما تضيء الإشارة باللون الأخضر 🟢 للمشاة:',
          type: 'choice',
          targetVisual: '🟢',
          data: {
            options: [
              { id: '1', visual: '🚶', label: 'نعبر بأمان وحذر', isCorrect: true },
              { id: '2', visual: '🛑', label: 'ننام في الشارع', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g28_h1',
          instruction: 'قبل عبور الشارع من ممر المشاة، ماذا نفعل أولاً؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '👀', label: 'ننظر يميناً ويساراً', isCorrect: true },
              { id: '2', visual: '🙈', label: 'نغمض أعيننا', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 29. 🧼 العادات الصحية
  {
    id: 29,
    icon: '🧼',
    title: 'العادات الصحية',
    shortDesc: 'رتب خطوات غسل اليدين بالماء والصابون',
    skill: 'النظافة الشخصية والعادات الصحية السليمة',
    category: 'social',
    color: 'from-sky-500 to-cyan-600',
    minUnlockGames: 5,
    challenges: {
      easy: [
        {
          id: 'g29_e1',
          instruction: 'رتب خطوات غسل اليدين:',
          type: 'ordering',
          data: {
            items: ['💧 تبليل بالماء', '🧼 وضع الصابون', '👐 فرك اليدين', '💦 الشطف والتجفيف'],
            scrambled: ['💦 الشطف والتجفيف', '💧 تبليل بالماء', '👐 فرك اليدين', '🧼 وضع الصابون'],
          },
        },
      ],
      medium: [
        {
          id: 'g29_m1',
          instruction: 'رتب خطوات تنظيف الأسنان بالفرشاة 🪥:',
          type: 'ordering',
          data: {
            items: ['🪥 المعجون على الفرشاة', '🦷 تفريش الأسنان بلطف', '💧 المضمضة بالماء'],
            scrambled: ['💧 المضمضة بالماء', '🪥 المعجون على الفرشاة', '🦷 تفريش الأسنان بلطف'],
          },
        },
      ],
      hard: [
        {
          id: 'g29_h1',
          instruction: 'متى يجب أن نغسل أيدينا دائماً؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🧼', label: 'قبل الأكل وبعد اللعب', isCorrect: true },
              { id: '2', visual: '😴', label: 'فقط أثناء النوم', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 30. 🥦 الطعام الصحي
  {
    id: 30,
    icon: '🥦',
    title: 'الطعام الصحي',
    shortDesc: 'اختر الطعام الصحي الذي يقوي الجسم والأسنان',
    skill: 'الوعي الغذائي واختيار الأطعمة المفيدة',
    category: 'science',
    color: 'from-emerald-600 to-green-700',
    minUnlockGames: 5,
    challenges: {
      easy: [
        {
          id: 'g30_e1',
          instruction: 'اختر الطعام الصحي المفيد لجسمك:',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🥦', label: 'بروكلي وخضار طازج', isCorrect: true },
              { id: '2', visual: '🍭', label: 'حلوى وسكاكر مضرة', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g30_m1',
          instruction: 'أي من الأطعمة يعطينا فيتامينات قوية؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🍎', label: 'تفاحة حمراء صحية', isCorrect: true },
              { id: '2', visual: '🍬', label: 'حلوى مصاصة', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g30_h1',
          instruction: 'ما هو المشروب الأفضل لنمو العظام والأسنان؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🥛', label: 'الحليب الطبيعي', isCorrect: true },
              { id: '2', visual: '🥤', label: 'مشروبات غازية', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 31. 👁️ أعضاء الجسم
  {
    id: 31,
    icon: '👁️',
    title: 'أعضاء الجسم',
    shortDesc: 'تعرف على أعضاء جسم الإنسان ومواقعها',
    skill: 'معرفة الجسم والوعي الذاتي',
    category: 'science',
    color: 'from-indigo-500 to-purple-600',
    minUnlockGames: 6,
    challenges: {
      easy: [
        {
          id: 'g31_e1',
          instruction: 'أين هي العين 👁️؟ اضغط عليها:',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '👁️', label: 'العين (نرى بها)', isCorrect: true },
              { id: '2', visual: '👂', label: 'الأذن', isCorrect: false },
              { id: '3', visual: '👃', label: 'الأنف', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g31_m1',
          instruction: 'أين هي اليد 🖐️ التي نكتب ونرسم بها؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🦶', label: 'القدم', isCorrect: false },
              { id: '2', visual: '🖐️', label: 'اليد والأصابع', isCorrect: true },
              { id: '3', visual: '👄', label: 'الفم', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g31_h1',
          instruction: 'ما العضو المسؤول عن التفكير والذكاء في رأسنا 🧠؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🧠', label: 'الدماغ والعقل', isCorrect: true },
              { id: '2', visual: '❤️', label: 'القلب', isCorrect: false },
              { id: '3', visual: '🦴', label: 'العظمة', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 32. 🖐️ ماذا نستخدم؟
  {
    id: 32,
    icon: '🖐️',
    title: 'ماذا نستخدم؟',
    shortDesc: 'اربط بين النشاط والعضو أو الحاسة المناسبة له',
    skill: 'وظائف أعضاء الجسم والحواس الخمس',
    category: 'science',
    color: 'from-pink-500 to-rose-600',
    minUnlockGames: 6,
    challenges: {
      easy: [
        {
          id: 'g32_e1',
          instruction: 'بماذا نمسك الأشياء والألعاب؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🖐️', label: 'باليد والأصابع', isCorrect: true },
              { id: '2', visual: '👂', label: 'بالأذن', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g32_m1',
          instruction: 'بماذا نشم رائحة الأزهار العطرة 🌸؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '👃', label: 'بالأنف (حاسة الشم)', isCorrect: true },
              { id: '2', visual: '👁️', label: 'بالعين', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g32_h1',
          instruction: 'بماذا نتذوق طعم الآيس كريم اللذيذ 🍦؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '👅', label: 'باللسان (حاسة التذوق)', isCorrect: true },
              { id: '2', visual: '👂', label: 'بالأذن', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 33. 👨‍⚕️ من يعمل هنا؟
  {
    id: 33,
    icon: '👨‍⚕️',
    title: 'من يعمل هنا؟',
    shortDesc: 'حدد المهنة التي تعمل في هذا المكان',
    skill: 'الوعي الاجتماعي والتعرف على المهن',
    category: 'social',
    color: 'from-blue-600 to-cyan-700',
    minUnlockGames: 6,
    challenges: {
      easy: [
        {
          id: 'g33_e1',
          instruction: 'في المستشفى 🏥، من يعالج المرضى؟',
          type: 'choice',
          targetVisual: '🏥',
          data: {
            options: [
              { id: '1', visual: '👨‍⚕️', label: 'الطبيب المخلص', isCorrect: true },
              { id: '2', visual: '👨‍🍳', label: 'الطباخ', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g33_m1',
          instruction: 'في المدرسة 🏫، من يشرح الدروس للأطفال؟',
          type: 'choice',
          targetVisual: '🏫',
          data: {
            options: [
              { id: '1', visual: '👩‍🏫', label: 'المعلمة الفاضلة', isCorrect: true },
              { id: '2', visual: '👮‍♂️', label: 'شرطي المرور', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g33_h1',
          instruction: 'في المزرعة والحقل الأخضر 🌾، من يزرع النباتات؟',
          type: 'choice',
          targetVisual: '🌾',
          data: {
            options: [
              { id: '1', visual: '👨‍🌾', label: 'المزارع النشيط', isCorrect: true },
              { id: '2', visual: '👨‍🚀', label: 'رائد الفضاء', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 34. 👩‍🏫 طابق المهنة
  {
    id: 34,
    icon: '👩‍🏫',
    title: 'طابق المهنة',
    shortDesc: 'اربط بين شخصية المهنة ودورها المفيد في المجتمع',
    skill: 'تقدير المهن والعمل المجتمعي',
    category: 'social',
    color: 'from-amber-600 to-orange-700',
    minUnlockGames: 6,
    challenges: {
      easy: [
        {
          id: 'g34_e1',
          instruction: 'من يخمد النيران ويحمي البيوت 🚒؟',
          type: 'choice',
          targetVisual: '🚒',
          data: {
            options: [
              { id: '1', visual: '👨‍🚒', label: 'رجل الإطفاء الشجاع', isCorrect: true },
              { id: '2', visual: '👨‍🍳', label: 'الطباخ', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g34_m1',
          instruction: 'من ينظم حركة السيارات في الطريق 🚓؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '👮‍♂️', label: 'شرطي المرور', isCorrect: true },
              { id: '2', visual: '👨‍🌾', label: 'المزارع', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g34_h1',
          instruction: 'من يقود الطائرة في السماء ويسافر بين الدول ✈️؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '👨‍✈️', label: 'الطيار الماهر', isCorrect: true },
              { id: '2', visual: '👨‍⚕️', label: 'الطبيب', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 35. 🧰 ما الأداة المناسبة؟
  {
    id: 35,
    icon: '🧰',
    title: 'ما الأداة المناسبة؟',
    shortDesc: 'اختر الأداة المناسبة لكل مهنة وعمل',
    skill: 'ربط الأدوات بالاستخدامات الحياتية',
    category: 'social',
    color: 'from-cyan-600 to-blue-700',
    minUnlockGames: 7,
    challenges: {
      easy: [
        {
          id: 'g35_e1',
          instruction: 'ما هي أداة الميكانيكي ومصلح الألعاب 👨‍🔧؟',
          type: 'choice',
          targetVisual: '👨‍🔧',
          data: {
            options: [
              { id: '1', visual: '🔧', label: 'مفتاح الإصلاح', isCorrect: true },
              { id: '2', visual: '🍴', label: 'شوكة وسكين', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g35_m1',
          instruction: 'ما هي أداة الرسام والفنان 🎨؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🖌️', label: 'فرشاة الألوان', isCorrect: true },
              { id: '2', visual: '🔨', label: 'المطرقة', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g35_h1',
          instruction: 'ما الأداة التي يقيس بها النجار الخشب 🪚؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '📏', label: 'مسطرة ومتر القياس', isCorrect: true },
              { id: '2', visual: '🥄', label: 'ملعقة', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 36. 🌈 طقس اليوم
  {
    id: 36,
    icon: '🌈',
    title: 'طقس اليوم',
    shortDesc: 'تعرف على حالة الجو والطقس والمواسم',
    skill: 'فهم البيئة وتغيرات الطقس الطبيعية',
    category: 'science',
    color: 'from-sky-500 to-indigo-600',
    minUnlockGames: 7,
    challenges: {
      easy: [
        {
          id: 'g36_e1',
          instruction: 'ما هو الطقس عندما تشرق الشمس الساطعة ☀️؟',
          type: 'choice',
          targetVisual: '☀️',
          data: {
            options: [
              { id: '1', visual: '☀️', label: 'طقس مشمس ودافئ', isCorrect: true },
              { id: '2', visual: '🌧️', label: 'طقس ممطر', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g36_m1',
          instruction: 'ماذا نرتدي ونحمل عندما تمطر السماء 🌧️؟',
          type: 'choice',
          targetVisual: '🌧️',
          data: {
            options: [
              { id: '1', visual: '☂️', label: 'مظلة المطر ومعطف', isCorrect: true },
              { id: '2', visual: '🕶️', label: 'نظارة شمسية فقط', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g36_h1',
          instruction: 'ماذا يظهر في السماء بعد المطر والشمس 🌈؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🌈', label: 'قوس قزح الملون', isCorrect: true },
              { id: '2', visual: '🌪️', label: 'عاصفة ترابية', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 37. 🌱 ماذا يحتاج النبات؟
  {
    id: 37,
    icon: '🌱',
    title: 'ماذا يحتاج النبات؟',
    shortDesc: 'اختر ما تحتاجه النبتة لكي تنمو وتزهر',
    skill: 'العلوم الحيوية ورعاية الطبيعة',
    category: 'science',
    color: 'from-green-600 to-emerald-700',
    minUnlockGames: 7,
    challenges: {
      easy: [
        {
          id: 'g37_e1',
          instruction: 'ماذا تحتاج هذه النبتة الصغيرة 🌱 لكي تنمو؟',
          type: 'choice',
          targetVisual: '🌱',
          data: {
            options: [
              { id: '1', visual: '💧', label: 'ماء عذب وضوء شمس', isCorrect: true },
              { id: '2', visual: '⚽', label: 'كرة للعب', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g37_m1',
          instruction: 'من أين تستمد أوراق الشجر طاقتها الطبيعية؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '☀️', label: 'من نور الشمس الدافئ', isCorrect: true },
              { id: '2', visual: '📺', label: 'من شاشة التلفاز', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g37_h1',
          instruction: 'أين نزرع بذور النباتات 🌱؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🪴', label: 'في التربة الخصبة', isCorrect: true },
              { id: '2', visual: '🚗', label: 'فوق سطح السيارة', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 38. 🏃 تحدي السرعة
  {
    id: 38,
    icon: '🏃',
    title: 'تحدي السرعة',
    shortDesc: 'اضغط على جميع النجوم اللامعة برفق وسرعة',
    skill: 'سرعة الملاحظة والتوافق البصري الحركي',
    category: 'visual',
    color: 'from-amber-500 to-red-500',
    minUnlockGames: 7,
    challenges: {
      easy: [
        {
          id: 'g38_e1',
          instruction: 'اضغط على كل النجوم ⭐ المعروضة:',
          type: 'speed_tap',
          data: {
            target: '⭐',
            count: 3,
            items: [
              { id: '1', visual: '⭐', isTarget: true },
              { id: '2', visual: '🍎', isTarget: false },
              { id: '3', visual: '⭐', isTarget: true },
              { id: '4', visual: '🚗', isTarget: false },
              { id: '5', visual: '⭐', isTarget: true },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g38_m1',
          instruction: 'اضغط على النجوم الأربعة بسرعة وتركيز:',
          type: 'speed_tap',
          data: {
            target: '⭐',
            count: 4,
            items: [
              { id: '1', visual: '⭐', isTarget: true },
              { id: '2', visual: '🐶', isTarget: false },
              { id: '3', visual: '⭐', isTarget: true },
              { id: '4', visual: '🍌', isTarget: false },
              { id: '5', visual: '⭐', isTarget: true },
              { id: '6', visual: '⭐', isTarget: true },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g38_h1',
          instruction: 'تحدي الملاحظة السريعة: اضغط على جميع النجوم الخمس:',
          type: 'speed_tap',
          data: {
            target: '⭐',
            count: 5,
            items: [
              { id: '1', visual: '⭐', isTarget: true },
              { id: '2', visual: '⚽', isTarget: false },
              { id: '3', visual: '⭐', isTarget: true },
              { id: '4', visual: '⭐', isTarget: true },
              { id: '5', visual: '🚗', isTarget: false },
              { id: '6', visual: '⭐', isTarget: true },
              { id: '7', visual: '⭐', isTarget: true },
            ],
          },
        },
      ],
    },
  },

  // 39. 🏆 اجمع النجوم
  {
    id: 39,
    icon: '🏆',
    title: 'اجمع النجوم',
    shortDesc: 'أجب على أسئلة مشوقة واجمع أكبر عدد من النجوم الذهبية',
    skill: 'التحفيز والاستمرار وحل التحديات المتنوعة',
    category: 'logic',
    color: 'from-yellow-500 via-amber-500 to-orange-500',
    minUnlockGames: 8,
    challenges: {
      easy: [
        {
          id: 'g39_e1',
          instruction: 'ما هو الحيوان الذي ينبح ويحب حراسة البيت؟ 🐶',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🐶', label: 'الكلب اللطيف', isCorrect: true },
              { id: '2', visual: '🐱', label: 'القطة', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g39_m1',
          instruction: 'ما الفاكهة الصفراء التي يحبها القرد 🍌؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '🍌', label: 'الموزة اللذيذة', isCorrect: true },
              { id: '2', visual: '🍎', label: 'التفاحة', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g39_h1',
          instruction: 'ما هو حاصل جمع 2 + 2؟',
          type: 'choice',
          data: {
            options: [
              { id: '1', visual: '4', label: '4 تفاحات 🍎🍎🍎🍎', isCorrect: true },
              { id: '2', visual: '3', label: '3', isCorrect: false },
            ],
          },
        },
      ],
    },
  },

  // 40. 🗺️ مغامرة مهارات طفلي الصغير
  {
    id: 40,
    icon: '🗺️',
    title: 'مغامرة مهارات طفلي الصغير',
    shortDesc: 'المغامرة الكبرى: اجتز المراحل الخمس لتحصل على كأس بطل المهارات!',
    skill: 'التكامل المعرفي والتفكير الشامل وحصد البطولات',
    category: 'logic',
    color: 'from-purple-600 via-pink-600 to-amber-500',
    minUnlockGames: 8,
    challenges: {
      easy: [
        {
          id: 'g40_e1',
          instruction: 'المرحلة 1: طابق صورة القطة 🐱:',
          type: 'adventure',
          targetVisual: '🐱',
          data: {
            step: 1,
            totalSteps: 5,
            trailIcons: ['🏠', '🌳', '🏰', '⭐', '🏆'],
            options: [
              { id: '1', visual: '🐱', label: 'قطة', isCorrect: true },
              { id: '2', visual: '🐶', label: 'كلب', isCorrect: false },
            ],
          },
        },
      ],
      medium: [
        {
          id: 'g40_m1',
          instruction: 'المرحلة 2: كم نجمة في السماء ⭐⭐⭐؟',
          type: 'adventure',
          targetVisual: '⭐',
          data: {
            step: 2,
            totalSteps: 5,
            trailIcons: ['🏠', '🌳', '🏰', '⭐', '🏆'],
            options: [
              { id: '1', visual: '3', label: '3 نجوم', isCorrect: true },
              { id: '2', visual: '2', label: '2', isCorrect: false },
            ],
          },
        },
      ],
      hard: [
        {
          id: 'g40_h1',
          instruction: 'المرحلة النهائية الكبرى: اختر كأس بطل المهارات 🏆!',
          type: 'adventure',
          targetVisual: '🏆',
          data: {
            step: 5,
            totalSteps: 5,
            trailIcons: ['🏠', '🌳', '🏰', '⭐', '🏆'],
            options: [
              { id: '1', visual: '🏆', label: 'كأس البطولة الذهبي', isCorrect: true },
              { id: '2', visual: '⚽', label: 'كرة', isCorrect: false },
            ],
          },
        },
      ],
    },
  },
];

export const SKILL_BADGES = [
  { id: 'first_game', title: 'أول خطوة 🌟', icon: '🌟', description: 'إكمال أول لعبة في مهارات طفلي', requirement: 'أكمل لعبة واحدة', minGames: 1 },
  { id: 'five_games', title: 'المستكشف الصغير 🏅', icon: '🏅', description: 'إكمال 5 ألعاب بنجاح', requirement: 'أكمل 5 ألعاب', minGames: 5 },
  { id: 'ten_games', title: 'بطل التفكير 🏆', icon: '🏆', description: 'إكمال 10 ألعاب وتطوير المهارات', requirement: 'أكمل 10 ألعاب', minGames: 10 },
  { id: 'twenty_five', title: 'العبقري المتميز 🎯', icon: '🎯', description: 'إكمال 25 لعبة متنوعة', requirement: 'أكمل 25 لعبة', minGames: 25 },
  { id: 'champion', title: 'ملك المهارات 👑', icon: '👑', description: 'إكمال الألعاب كلها والحصول على كل النجوم', requirement: 'أكمل 40 لعبة', minGames: 40 },
];

import { getGame50Stages } from './childSkills50Stages';

// Dynamically attach all 50 non-repeating stages to every one of the 40 games
CHILD_SKILLS_GAMES.forEach((game) => {
  const stages50 = getGame50Stages(game.id);
  game.stages = stages50;
  game.challenges = {
    easy: stages50.filter((s) => s.difficulty === 'easy'),
    medium: stages50.filter((s) => s.difficulty === 'medium'),
    hard: stages50.filter((s) => s.difficulty === 'hard'),
  };
});
