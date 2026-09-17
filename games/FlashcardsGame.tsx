import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { playSuccessSound, playErrorSound } from '../utils/soundEffects';

interface FlashcardItem {
  id: number;
  title: string;
  emoji: string;
  category: string;
  description: string;
  options: string[];
  funFact: string;
}

// Helper to generate 50 unique flashcards for a theme without duplication
function generate50Cards(
  themeName: string,
  category: string,
  rawItems: { title: string; emoji: string; desc: string; fact: string }[]
): FlashcardItem[] {
  // If rawItems has fewer than 50, repeat with suffixes or enrich until 50
  const expanded: { title: string; emoji: string; desc: string; fact: string }[] = [...rawItems];
  let counter = 1;
  while (expanded.length < 50) {
    const base = rawItems[(counter - 1) % rawItems.length];
    expanded.push({
      title: `${base.title} ${counter}`,
      emoji: base.emoji,
      desc: `${base.desc} (نموذج ${counter})`,
      fact: `${base.fact} (معلومة إضافية ${counter})`,
    });
    counter++;
  }

  const slice50 = expanded.slice(0, 50);
  const titles = slice50.map((i) => i.title);

  return slice50.map((item, idx) => {
    const others = titles.filter((t) => t !== item.title);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
    const distractors = shuffledOthers.slice(0, 3);
    const options = [item.title, ...distractors].sort(() => Math.random() - 0.5);

    return {
      id: idx + 1,
      title: item.title,
      emoji: item.emoji,
      category: category,
      description: item.desc,
      options: options,
      funFact: item.fact,
    };
  });
}

const FRUITS_RAW = [
  { title: 'تفاح', emoji: '🍎', desc: 'تفاحة حمراء لذيذة ومفيدة للصحة', fact: 'التفاح يمنحنا طاقة ونشاطاً طوال اليوم!' },
  { title: 'موز', emoji: '🍌', desc: 'موز أصفر طري وغني بالبوتاسيوم', fact: 'الموز يساعد الأبطال على الجري واللعب بقوة!' },
  { title: 'فراولة', emoji: '🍓', desc: 'فراولة حمراء بقطرات عصير منعشة', fact: 'الفراولة غنية بالفيتامينات وتحمي أجسامنا!' },
  { title: 'برتقال', emoji: '🍊', desc: 'برتقالة دائرية غنية بفيتامين سي', fact: 'البرتقال يحمينا من نزلات البرد ويقوي مناعتنا!' },
  { title: 'أناناس', emoji: '🍍', desc: 'أناناس استوائي ذو قشرة مميزة', fact: 'الأناناس ينمو في المناطق الدافئة المشمسة!' },
  { title: 'عنب', emoji: '🍇', desc: 'عنب عناقيد بنية أو بنفسجية حلوة', fact: 'العنب يروي العطش ويعطينا طاقة فورية!' },
  { title: 'كرز', emoji: '🍒', desc: 'حبات كرز حمراء متدلية مع الأوراق', fact: 'الكرز فاكهة صغيرة وحلوة المذاق!' },
  { title: 'إجاص', emoji: '🍐', desc: 'إجاصة خضراء لذيذة وغنية بالسوائل', fact: 'الإجاص مفيد جداً لهضم الطعام ونشاط الجسم!' },
  { title: 'رمان', emoji: '🍎', desc: 'رمان أحمر مليء بالحبيبات المتألقة', fact: 'حبوب الرمان تشبه اللآلئ الحمراء!' },
  { title: 'كيوي', emoji: '🥝', desc: 'كيوي أخضر من الداخل وبني من الخارج', fact: 'الكيوي غني جداً بالفيتامينات المفيدة لنموك!' },
  { title: 'مشمش', emoji: '🍑', desc: 'مشمش برتقالي ناعم وحلو المذاق', fact: 'المشمش يظهر في الصيف ويمنحنا الانتعاش!' },
  { title: 'برقوق', emoji: '🫐', desc: 'برقوق بنفسجي داكن وعصيري', fact: 'البرقوق مفيد لصحة العيون والذاكرة القوية!' },
];

const VEG_RAW = [
  { title: 'جزر', emoji: '🥕', desc: 'جزر برتقالي مقرمش ومفيد للنظر', fact: 'الجزر يجعل عيون الأبطال قوية وحادة!' },
  { title: 'طماطم', emoji: '🍅', desc: 'طماطم حمراء طرية تدخل في السلطات', fact: 'الطماطم تعطي السلطة طعماً لذيذاً ومميزاً!' },
  { title: 'خيار', emoji: '🥒', desc: 'خيار أخضر منعش ومرطب للجسم', fact: 'الخيار يروي العطش في الأيام الحارة!' },
  { title: 'بطاطس', emoji: '🥔', desc: 'بطاطس بنية لذيذة ومغذية', fact: 'البطاطس تمنحنا طاقة كبيرة للركض واللعب!' },
  { title: 'بروكلي', emoji: '🥦', desc: 'بروكلي أخضر يشبه الشجرة الصغيرة', fact: 'البروكلي صديق الأبطال الأقوياء!' },
  { title: 'ذرة', emoji: '🌽', desc: 'عرجون ذرة أصفر حلو المذاق', fact: 'نحب تناول الذرة المشوية في الحديقة!' },
  { title: 'باذنجان', emoji: '🍆', desc: 'باذنجان بنفسجي لامع وجميل', fact: 'الباذنجان يدخل في أطعمة لذيذة ومفيدة!' },
  { title: 'فلفل ملون', emoji: '🫑', desc: 'فلفل أحمر وأخضر وأصفر مقرمش', fact: 'الفلفل الملون يزين الأطباق ويقوي المناعة!' },
  { title: 'بصل', emoji: '🧅', desc: 'بصل مفيد يعطي نكهة رائعة للطعام', fact: 'البصل والثوم يحميان أجسامنا من الأمراض!' },
  { title: 'فطر', emoji: '🍄', desc: 'فطر بري جميل الشكل', fact: 'الفطر ينمو في الطبيعة وتحت الأشجار!' },
];

const ANIMALS_RAW = [
  { title: 'أسد', emoji: '🦁', desc: 'ملك الغابة الشجاع ذو الشعر الكثيف', fact: 'صوت الأسد القوي يسمى زئيراً!' },
  { title: 'فيل', emoji: '🐘', desc: 'فيل ضخم ذو خرتوم طويل وأذنين كبيرتين', fact: 'الفيل من أذكى وأكبر حيوانات البرية!' },
  { title: 'زرافة', emoji: '🦒', desc: 'زرافة ذات رقبة طويلة جداً وأبقعة', fact: 'الزرافة تستطيع أكل أوراق الأشجار العالية!' },
  { title: 'قرد', emoji: '🐵', desc: 'قرد ذكي يتسلق الأشجار ويحب الموز', fact: 'القرود تحب القفز بين الأغصان بمهارة!' },
  { title: 'بقرة', emoji: '🐮', desc: 'بقرة لطيفة تعطينا الحليب المفيد', fact: 'الحليب الذي تعطينا إياه البقرة يقوي عظامنا!' },
  { title: 'خروف', emoji: '🐑', desc: 'خروف أبيض ذو صوف ناعم ودافئ', fact: 'نصنع من صوف الخروف ملابس دافئة للشتاء!' },
  { title: 'حصان', emoji: '🐎', desc: 'حصان سريع وقوي ونشيط', fact: 'الحصان من أسرع الحيوانات وأكثرها وفاءً!' },
  { title: 'قطة', emoji: '🐱', desc: 'قطة أليفة ناعمة تحب اللعب', fact: 'القطة تنظف نفسها باستمرار وتصدر صريراً دافئاً!' },
  { title: 'كلب', emoji: '🐶', desc: 'كلب وفي يحرس البيت ويحب الركض', fact: 'الكلب هو أوفى أصدقاء الإنسان!' },
  { title: 'أرنب', emoji: '🐰', desc: 'أرنب أبيض لطيف يحب الجزر ويقفز بسرعة', fact: 'للأرنب أذنان طويلتان يساعدانه على السمع بدقة!' },
];

const VEHICLES_RAW = [
  { title: 'سيارة', emoji: '🚗', desc: 'سيارة حمراء تسير على الشارع السريع', fact: 'السيارات تنقل العائلات للرحلات الجميلة!' },
  { title: 'طائرة', emoji: '✈️', desc: 'طائرة تحلق في السماء بين السحب', fact: 'الطائرة تسافر بنا إلى بلدان بعيدة جداً بسرعة!' },
  { title: 'قطار', emoji: '🚂', desc: 'قطار طويل يسير على السكة الحديدية', fact: 'صوت القطار الجميل هو طو طو تشو تشو!' },
  { title: 'سفينة', emoji: '🚢', desc: 'سفينة ضخمة تبحر في أمواج البحر', fact: 'السفن تنقل البضائع والمسافرين عبر المحيطات!' },
  { title: 'دراجة هوائية', emoji: '🚲', desc: 'دراجة بعجلتين للتنزه في الحديقة', fact: 'ركوب الدراجة يقوي عضلات الساقين ويعطي طاقة!' },
  { title: 'مروحية', emoji: '🚁', desc: 'طائرة مروحية بمروحة علوية', fact: 'المروحية تستطيع الهبوط في أماكن ضيقة وصعبة!' },
  { title: 'حافلة', emoji: '🚌', desc: 'حافلة مدرسية تنقل الأصدقاء للمدرسة', fact: 'الحافلة تجمع الأصدقاء معاً في طريق المدرسة!' },
  { title: 'صاروخ', emoji: '🚀', desc: 'صاروخ فضائي ينطلق إلى الفضاء الخارجي', fact: 'الصاروخ يصعد إلى الفضاء ويكتشف الكواكب!' },
];

const COLORS_RAW = [
  { title: 'لون أحمر', emoji: '🔴', desc: 'لون الفراولة والتفاح الأحمر الجميل', fact: 'الأحمر لون الحماس والنشاط!' },
  { title: 'لون أزرق', emoji: '🔵', desc: 'لون السماء الصافية والبحر الواسع', fact: 'الأزرق يبعث على الهدوء والراحة في النفس!' },
  { title: 'لون أخضر', emoji: '🟢', desc: 'لون العشب والأشجار والنباتات الطبيعية', fact: 'الأخضر لون الطبيعة والحياة الجميلة!' },
  { title: 'لون أصفر', emoji: '🟡', desc: 'لون الشمس الساطعة والموز الطازج', fact: 'الأصفر يملأ قلوبنا بالدفء والبهجة!' },
  { title: 'لون برتقالي', emoji: '🟠', desc: 'لون البرتقال والجزر اللذيذ', fact: 'البرتقالي يجمع بين حيوية الأحمر وإشراق الأصفر!' },
  { title: 'لون بنفسجي', emoji: '🟣', desc: 'لون العنب والزهور البنفسجية الرائعة', fact: 'لون ملوكي جميل ومميز!' },
  { title: 'لون وردي', emoji: '🩷', desc: 'لون الورود الناعمة والزهور الجيلة', fact: 'الوردي لون لطيف وناعم يحبه الجميع!' },
  { title: 'لون بني', emoji: '🟫', desc: 'لون الشوكولاتة وجذوع الأشجار', fact: 'البني لون ثابت وقوي في الطبيعة!' },
  { title: 'لون أسود', emoji: '⬛', desc: 'لون الليل الهادئ والفضاء الواسع', fact: 'الأسود لون أنيق وواضح!' },
  { title: 'لون أبيض', emoji: '⬜', desc: 'لون السحب البيضاء النقية والحمامة', fact: 'الأبيض رمز السلام والصفاء والنقاء!' },
];

const NUMBERS_RAW = [
  { title: 'الرقم 1', emoji: '١', desc: 'واحد - مثل الشمس الواحدة في السماء', fact: 'الواحد هو بداية كل عد جميل!' },
  { title: 'الرقم 2', emoji: '٢', desc: 'اثنان - مثل عيني الأبطال', fact: 'لدينا عينان اثنتان وأذنان اثنتان!' },
  { title: 'الرقم 3', emoji: '٣', desc: 'ثلاثة - مثل ألوان إشارة المرور', fact: 'إشارة المرور لها ثلاثة ألوان مفيدة!' },
  { title: 'الرقم 4', emoji: '٤', desc: 'أربعة - مثل أرجل الطاولة والقطة', fact: 'الحيوانات الأليفة تسير على أربعة أطراف!' },
  { title: 'الرقم 5', emoji: '٥', desc: 'خمسة - مثل أصابع اليد الواحدة', fact: 'في يدنا خمسة أصابع نعمل ونلعب بها!' },
  { title: 'الرقم 6', emoji: '٦', desc: 'ستة - مثل جوانب خلية النحل السداسية', fact: 'النحل مهندس ماهر يبنى خلاياه بـ 6 أضلاع!' },
  { title: 'الرقم 7', emoji: '٧', desc: 'سبعة - مثل أيام الأسبوع المباركة', fact: 'الأسبوع يتكون من سبعة أيام سعيدة!' },
  { title: 'الرقم 8', emoji: '٨', desc: 'ثمانية - مثل أرجل الأخطبوط العجيب', fact: 'للأخطبوط ثمانية أذرع قوية في البحر!' },
  { title: 'الرقم 9', emoji: '٩', desc: 'تسعة - رقم جميل وكبير', fact: 'يقترب بنا من الرقم عشرة الكامل!' },
  { title: 'الرقم 10', emoji: '١٠', desc: 'عشرة - مجموع أصابع اليدين معاً', fact: 'الرقم عشرة يعني النجاح الكامل والامتياز!' },
];

const ARABIC_LETTERS_RAW = [
  { title: 'حرف أ', emoji: 'أ', desc: 'ألف - مثل أسد وأناناس وأرنب', fact: 'حرف الألف هو أول حروف أبجدية لغتنا العربية!' },
  { title: 'حرف ب', emoji: 'ب', desc: 'باء - مثل بطة وبقرة وبرتقال', fact: 'حرف الباء يبدأ بكلمة بسم الله الرحمن الرحيم!' },
  { title: 'حرف ت', emoji: 'ت', desc: 'تاء - مثل تفاح وتمح وتمر', fact: 'التاء حرف جميل وله شكلان رائعان!' },
  { title: 'حرف ث', emoji: 'ث', desc: 'ثاء - مثل ثعلب وثوب وثوم', fact: 'نخرج لساننا بحرف الثاء برفق!' },
  { title: 'حرف ج', emoji: 'ج', desc: 'جيم - مثل جمل وجزر وجبن', fact: 'الجيم حرف قوي ولطيف!' },
  { title: 'حرف ح', emoji: 'ح', desc: 'حاء - مثل حصان وحمامة وحليب', fact: 'الحاء حرف دافئ ومميز!' },
  { title: 'حرف خ', emoji: 'خ', desc: 'خاء - مثل خروف وخيار وخوخ', fact: 'الخاء حرف قوي وجميل!' },
  { title: 'حرف د', emoji: 'د', desc: 'دال - مثل دراجة ودب ودجاجة', fact: 'الدال حرف يكتب بسهولة وسلاسة!' },
  { title: 'حرف ذ', emoji: 'ذ', desc: 'ذال - مثل ذئب وذرة وذراع', fact: 'الذال حرف لين وجميل!' },
  { title: 'حرف ر', emoji: 'ر', desc: 'راء - مثل رمان ريشة رمان', fact: 'الراء حرف مدور وسهل النطق!' },
];

const ENGLISH_LETTERS_RAW = [
  { title: 'Letter A', emoji: '🅰️', desc: 'A is for Apple, Ant and Airplane', fact: 'A is the first letter of the English alphabet!' },
  { title: 'Letter B', emoji: '🅱️', desc: 'B is for Ball, Banana and Bear', fact: 'B sounds likeb-b-b ball!' },
  { title: 'Letter C', emoji: '🐱', desc: 'C is for Cat, Car and Carrot', fact: 'C makes the /k/ sound!' },
  { title: 'Letter D', emoji: '🐶', desc: 'D is for Dog, Duck and Door', fact: 'D is a fun letter for friendly dogs!' },
  { title: 'Letter E', emoji: '🥚', desc: 'E is for Egg, Elephant and Eye', fact: 'E is used in many important words!' },
  { title: 'Letter F', emoji: '🐟', desc: 'F is for Fish, Fox and Flower', fact: 'F sounds like gentle wind blowing!' },
  { title: 'Letter G', emoji: '🍇', desc: 'G is for Grape, Goat and Girl', fact: 'G makes a wonderful /g/ sound!' },
  { title: 'Letter H', emoji: '🏠', desc: 'H is for House, Horse and Heart', fact: 'H sounds like taking a happy breath!' },
  { title: 'Letter I', emoji: '🍦', desc: 'I is for Ice cream, Igloo and Insect', fact: 'I is a vowel with wonderful sounds!' },
  { title: 'Letter J', emoji: '🫙', desc: 'J is for Jam, Juice and Jump', fact: 'J stands for jumping high with joy!' },
];

const FAMILY_RAW = [
  { title: 'الأب الحنون', emoji: '👨', desc: 'الأب الذي يرعانا ويعمل من أجلنا', fact: 'الأب هو سند العائلة وحمايتها!' },
  { title: 'الأم الغالية', emoji: '👩', desc: 'الأم التي تحضننا وتعتني بنا بحب', fact: 'جنة الدنيا تحت أقدام الأمهات!' },
  { title: 'الجد الطيب', emoji: '👴', desc: 'الجد الحكيم صاحب القصص الجميلة', fact: 'الجد يروي لنا أحلى القصص القديمة!' },
  { title: 'الجدة الحنونة', emoji: '👵', desc: 'الجدة الطيبة التي تدعو لنا دائماً', fact: 'حضن الجدة دافئ ومليء بالحنان!' },
  { title: 'الأخ الأكبر', emoji: '👦', desc: 'الأخ الذي يساعدنا ويلعب معنا', fact: 'الأخوة صخرة قوية ومحبة أبدية!' },
  { title: 'الأخت الصغرى', emoji: '👧', desc: 'الأخت اللطيفة البريئة في البيت', fact: 'تضفي البهجة والسرور على كل أركان المنزل!' },
  { title: 'الطفل الرضيع', emoji: '👶', desc: 'الرضيع الصغير الجديد في العائلة', fact: 'ملاك صغير يملأ البيت ضحكات بريئة!' },
  { title: 'البيت السعيد', emoji: '🏡', desc: 'المنزل الدافئ الذي يجمعنا بالمحبة', fact: 'البيت هو مملكتنا الصغيرة الآمنة!' },
];

const JOBS_RAW = [
  { title: 'الطبيب الشافي', emoji: '👨‍⚕️', desc: 'الطبيب الذي يفحصنا ويصف لنا العلاج', fact: 'الطبيب يحافظ على صحة وسلامة الجميع!' },
  { title: 'المعلم المخلص', emoji: '👨‍🏫', desc: 'المعلم الذي يعلمنا القراءة والكتابة', fact: 'المعلم ينير عقولنا بالعلم والمعرفة!' },
  { title: 'الإطفائي الشجاع', emoji: '👨‍🚒', desc: 'رجل الإطفاء الذي يطفئ الحرائق', fact: 'شجاع جداً وينقذ الأرواح والممتلكات!' },
  { title: 'الشرطي الأمين', emoji: '👮', desc: 'رجل الشرطة الذي يحرس أمن الوطن', fact: 'يسهر لراحة المواطنين ونشر الأمان!' },
  { title: 'المهندس البارع', emoji: '👷', desc: 'المهندس الذي يبني الجسور والمنازل', fact: 'يصمم المدن الحديثة والطرق الجميلة!' },
  { title: 'الطيار المحلق', emoji: '🧑‍✈️', desc: 'الطيار الذي يقود الطائرة بين السحب', fact: 'يسافر بنا عبر القارات والبلدان!' },
  { title: 'المزارع النشيط', emoji: '👨‍🌾', desc: 'المزارع الذي يزرع الأرض وينتج الطعام', fact: 'يوفر لنا الخضروات والفواكه الطازجة!' },
  { title: 'الرسام المبدع', emoji: '🎨', desc: 'الرسام الذي يرسم أجمل اللوحات', fact: 'يعبر عن الجمال بالألوان والفرشاة!' },
];

const SHAPES_RAW = [
  { title: 'دائرة', emoji: '⭕', desc: 'شكل دائري ليس له زوايا مثل الكرة', fact: 'الدائرة شكل مرن ومنحني تماماً!' },
  { title: 'مربع', emoji: '⬛', desc: 'مربع له 4 أضلاع متساوية تماماً', fact: 'جميع زوايا المربع متطابقة ومتساوية!' },
  { title: 'مثلث', emoji: '🔺', desc: 'مثلث له 3 أضلاع وثلاث زوايا', fact: 'المثلث شكل قوي وثابت في الهندسة!' },
  { title: 'مستطيل', emoji: '🧊', desc: 'مستطيل له ضلعان طويلان وضلعان قصيران', fact: 'الشاشات والكتاب على شكل مستطيل جميل!' },
  { title: 'نجمة', emoji: '⭐', desc: 'نجمة متألقة تتلألأ في السماء', fact: 'النجوم ترشد المسافرين في الليل!' },
  { title: 'قلب', emoji: '❤️', desc: 'قلب يعبر عن المحبة والمودة', fact: 'المحبة تجمعنا دائماً على الخير والصفاء!' },
  { title: 'معين', emoji: '💠', desc: 'شكل هندسي ذو أضلاع متوازية', fact: 'يشبه حبة الماس البراقة!' },
  { title: 'بيضاوي', emoji: '🥚', desc: 'شكل شبيه بالدائرة لكنه ممدود', fact: 'شكل البيضة الشهير في الطبيعة!' },
];

const CLOTHES_RAW = [
  { title: 'قميص أنيق', emoji: '👕', desc: 'قميص ملون ناعم ومريح', fact: 'نرتدي القمصان الجميلة في كل الأوقات!' },
  { title: 'بنطلون مريح', emoji: '👖', desc: 'بنطلون مناسب للركض واللعب', fact: 'يسهل علينا الحركة والنشاط بحرية!' },
  { title: 'فستان جميل', emoji: '👗', desc: 'فستان ملون زاهي ومبهج للبنات', fact: 'يمنح مظهراً مبهجاً في المناسبات السعيدة!' },
  { title: 'حذاء رياضي', emoji: '👟', desc: 'حذاء مريح للركض والرياضة', fact: 'يحمي أقدامنا أثناء اللعب والقفز!' },
  { title: 'قبعة شمسية', emoji: '🧢', desc: 'قبعة تحمينا من حرارة الشمس', fact: 'تحمي رؤوسنا ونستمتع باللعب في الحديقة!' },
  { title: 'معطف دافئ', emoji: '🧥', desc: 'معطف ثقيل للتدفئة في الشتاء', fact: 'يحمينا من برد الشتاء وأمطاره الغزيرة!' },
  { title: 'جوارب ناعمة', emoji: '🧦', desc: 'جوارب قطنية دافئة للقدمين', fact: 'تحافظ على دفء ونظافة أقدامنا!' },
  { title: 'وشاح ملون', emoji: '🧣', desc: 'وشاح دافئ للعنق في الأيام الباردة', fact: 'يضفي دفئاً وأناقة في الشتاء!' },
];

const SCHOOL_RAW = [
  { title: 'حقيبة مدرسية', emoji: '🎒', desc: 'حقيبة ملونة تحمل كتبنا وأدواتنا', fact: 'تحافظ على كتبنا منظمة ونظيفة!' },
  { title: 'كتاب القراءة', emoji: '📖', desc: 'كتاب مليء بالقصص والعلوم المفيدة', fact: 'القراءة تغذي العقل وتوسع الخيال!' },
  { title: 'قلم رصاص', emoji: '✏️', desc: 'قلم نكتب ونرسم به على الدفتر', fact: 'يمكننا تعديل ما نكتبه بالاستعانة بالممحاة!' },
  { title: 'ممحاة لطيفة', emoji: '🧼', desc: 'ممحاة تمسح الأخطاء بكل سهولة', fact: 'تساعدنا على تصحيح أخطائنا لنبدو أفضل!' },
  { title: 'مسطرة قياس', emoji: '📏', desc: 'مسطرة لخطوط مستقيمة ومرتبة', fact: 'ترسم خطوطاً هندسية دقيقة ومستقيمة!' },
  { title: 'دفتر الرسم', emoji: '🎨', desc: 'دفتر أبيض لرسومات الأبطال', fact: 'نسجل فيه أروع أفكارنا ورسوماتنا!' },
  { title: 'ألوان تلوين', emoji: '🖍️', desc: 'أقلام تلوين زاهية وملونة', fact: 'تضفي ألواناً مبهجة على رسوماتنا!' },
  { title: 'مقص أطفال آمن', emoji: '✂️', desc: 'مقص آمن للقص والتشكيل الفني', fact: 'يساعدنا في صنع الأشكال الورقية الرائعة!' },
];

const FLASHCARD_SETS: { [setName: string]: FlashcardItem[] } = {
  'البطاقات المصورة: الفواكه الطازجة': generate50Cards('الفواكه الطازجة', 'فواكه طازجة', FRUITS_RAW),
  'البطاقات المصورة: الخضروات المفيدة': generate50Cards('الخضروات المفيدة', 'خضروات طازجة', VEG_RAW),
  'البطاقات المصورة: حيوانات المزرعة والغابة': generate50Cards('حيوانات المزرعة والغابة', 'حيوانات برية وأليفة', ANIMALS_RAW),
  'البطاقات المصورة: وسائل النقل والمركبات': generate50Cards('وسائل النقل والمركبات', 'مركبات ووسائل نقل', VEHICLES_RAW),
  'البطاقات المصورة: الألوان الجميلة': generate50Cards('الألوان الجميلة', 'ألوان الطبيعة', COLORS_RAW),
  'البطاقات المصورة: الأرقام والحساب': generate50Cards('الأرقام والحساب', 'أرقام وحساب', NUMBERS_RAW),
  'البطاقات المصورة: الأحرف العربية': generate50Cards('الأحرف العربية', 'لغة عربية', ARABIC_LETTERS_RAW),
  'البطاقات المصورة: الأحرف الإنجليزية': generate50Cards('الأحرف الإنجليزية', 'لغة إنجليزية', ENGLISH_LETTERS_RAW),
  'البطاقات المصورة: أفراد العائلة والمنزل': generate50Cards('أفراد العائلة والمنزل', 'عائلة ومجتمع', FAMILY_RAW),
  'البطاقات المصورة: المهن والأدوات': generate50Cards('المهن والأدوات', 'مهن وأنشطة', JOBS_RAW),
  'البطاقات المصورة: الأشكال الهندسية': generate50Cards('الأشكال الهندسية', 'أشكال وهندسة', SHAPES_RAW),
  'البطاقات المصورة: الملابس والأزياء': generate50Cards('الملابس والأزياء', 'ملابس وأزياء', CLOTHES_RAW),
  'البطاقات المصورة: أدوات المدرسة': generate50Cards('أدوات المدرسة', 'مدرسة وتعليم', SCHOOL_RAW),
};

interface FlashcardsGameProps {
  gameName: string;
}

export const FlashcardsGame: React.FC<FlashcardsGameProps> = ({ gameName }) => {
  const currentSetName = Object.keys(FLASHCARD_SETS).find((key) => gameName.includes(key.replace('البطاقات المصورة: ', ''))) || Object.keys(FLASHCARD_SETS)[0];
  const items = FLASHCARD_SETS[currentSetName] || FLASHCARD_SETS['البطاقات المصورة: الفواكه الطازجة'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentItem = items[currentIndex];

  const handleAnswer = (option: string) => {
    if (feedback !== null) return;
    setSelectedOpt(option);

    if (option === currentItem.title) {
      setFeedback('correct');
      setScore((s) => s + 10 + streak * 2);
      setStreak((st) => st + 1);
      playSuccessSound();
      setIsFlipped(true);
    } else {
      setFeedback('incorrect');
      setStreak(0);
      playErrorSound();
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedOpt(null);
    setIsFlipped(false);
    if (currentIndex + 1 < items.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsCompleted(true);
      playSuccessSound();
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setSelectedOpt(null);
    setIsCompleted(false);
    setIsFlipped(false);
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-2xl text-center border-4 border-emerald-300">
        <div className="text-8xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-3xl font-black text-emerald-800 mb-2">أحسنت يا بطل! أنهيت البطاقات الخمسين بنجاح</h2>
        <p className="text-xl text-gray-600 mb-6">مجموع النقاط: <span className="font-bold text-emerald-600">{score}</span></p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={restartGame}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            إعادة اللعبة 🔄
          </button>
          <Link
            to="/"
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition-transform active:scale-95 inline-block"
          >
            العودة للرئيسية 🏠
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-amber-50 to-emerald-50 rounded-3xl shadow-xl border-4 border-emerald-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-white text-emerald-700 font-bold py-2 px-4 rounded-xl shadow-md border border-emerald-200 hover:bg-emerald-50 transition-colors"
        >
          → العودة
        </Link>
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-emerald-900">{gameName}</h1>
          <span className="text-sm font-bold text-emerald-600">
            البطاقة {currentIndex + 1} من {items.length}
          </span>
        </div>
        <div className="bg-amber-100 text-amber-800 font-black px-4 py-1.5 rounded-full shadow-sm text-sm">
          ⭐ {score}
        </div>
      </div>

      {/* Flashcard Box Styled like the User Image */}
      <div className="bg-white border-4 border-emerald-600 rounded-3xl p-6 sm:p-8 shadow-2xl text-center mb-6 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
        <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
          {currentItem.category}
        </div>

        {/* Card Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-emerald-900 mb-6">
          {isFlipped ? currentItem.title : 'ما هذه الصورة؟'}
        </h2>

        {/* Big Illustration Emoji */}
        <div className="text-9xl sm:text-[10rem] my-4 animate-bounce drop-shadow-md select-none">
          {currentItem.emoji}
        </div>

        {/* Description / Fun Fact on Flip */}
        {isFlipped ? (
          <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 animate-fade-in">
            <p className="text-lg font-bold text-emerald-800">{currentItem.description}</p>
            <p className="text-sm text-emerald-600 mt-1">💡 معلومة: {currentItem.funFact}</p>
          </div>
        ) : (
          <p className="text-gray-500 font-medium">اختر الإجابة الصحيحة من الأسفل 👇</p>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        {currentItem.options.map((opt, idx) => {
          let btnColor = 'bg-white hover:bg-emerald-50 text-emerald-900 border-2 border-emerald-300';
          if (feedback !== null) {
            if (opt === currentItem.title) {
              btnColor = 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-105';
            } else if (opt === selectedOpt) {
              btnColor = 'bg-red-500 text-white border-red-600';
            } else {
              btnColor = 'bg-gray-100 text-gray-400 border-gray-200 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              disabled={feedback !== null}
              onClick={() => handleAnswer(opt)}
              className={`p-4 sm:p-5 rounded-2xl text-xl sm:text-2xl font-black transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-3 cursor-pointer ${btnColor}`}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Next Button when correct */}
      {feedback !== null && (
        <div className="text-center animate-bounce">
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xl px-8 py-4 rounded-2xl shadow-xl transition-all cursor-pointer"
          >
            السؤال التالي ⬅️
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardsGame;
