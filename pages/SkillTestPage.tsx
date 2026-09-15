import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { playSuccessSound, playErrorSound, playWinFanfare, playPopSound } from '../utils/soundEffects';

interface SkillQuestion {
  id: number;
  question: string;
  emoji: string;
  category: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Master pool of 50 diverse questions for Show Skills mode
const SKILL_TEST_QUESTIONS: SkillQuestion[] = [
  { id: 1, category: 'علوم', emoji: '🌍', question: 'ما هو الكوكب الذي نعيش عليه ويسمى الكوكب الأزرق؟', options: ['المريخ', 'الأرض', 'المشتري', 'زحل'], correctAnswer: 'الأرض', explanation: 'الأرض هو كوكبنا الجميل المغطى بالمحيطات والمياه.' },
  { id: 2, category: 'حيوانات', emoji: '🐘', question: 'ما هو أكبر حيوان بري على كوكب الأرض؟', options: ['الفيل', 'الزرافة', 'الأسد', 'الحصان'], correctAnswer: 'الفيل', explanation: 'الفيل الإفريقي هو أضخم حيوان يعيش على اليابسة.' },
  { id: 3, category: 'فضاء', emoji: '☀️', question: 'ما هو النجم الكبير الذي يمدنا بالدفء والضوء نهاراً؟', options: ['القمر', 'الشمس', 'المريخ', 'الزهرة'], correctAnswer: 'الشمس', explanation: 'الشمس هي النجم الذي يمنحنا الحرارة والضوء.' },
  { id: 4, category: 'جغرافيا', emoji: '🌊', question: 'كم عدد المحيطات الرئيسية في كوكب الأرض؟', options: ['3 محيطات', '5 محيطات', '7 محيطات', 'محيط واحد'], correctAnswer: '5 محيطات', explanation: 'المحيطات الخمسة هي: الهادي، الأطلسي، الهندي، المتجمد الشمالي، والمتجمد الجنوبي.' },
  { id: 5, category: 'رياضيات', emoji: '🔢', question: 'ما ناتج جمع: 15 + 15؟', options: ['25', '30', '35', '20'], correctAnswer: '30', explanation: '15 مضافاً إليها 15 تساوي 30 تماماً.' },
  { id: 6, category: 'حيوانات', emoji: '🦒', question: 'ما هو الحيوان الذي يمتلك رقبة طويلة جداً ويأكل أوراق الأشجار العالية؟', options: ['الحمار الوحشي', 'الفهد', 'الزرافة', 'القرد'], correctAnswer: 'الزرافة', explanation: 'الزرافة تتميز برقبتها الطويلة التي تمكنها من الوصول لأعالي الأشجار.' },
  { id: 7, category: 'تاريخ', emoji: '🏛️', question: 'في أي دولة تقع الأهرامات المصرية العريقة؟', options: ['مصر', 'السعودية', 'المغرب', 'الإمارات'], correctAnswer: 'مصر', explanation: 'تقع أهرامات الجيزة الخالدة في جمهورية مصر العربية.' },
  { id: 8, category: 'رياضة', emoji: '⚽', question: 'كم عدد لاعبين فريق كرة القدم الأساسي في الملعب؟', options: ['9 لاعبين', '10 لاعبين', '11 لاعباً', '7 لاعبين'], correctAnswer: '11 لاعباً', explanation: 'يتكون الفريق الواحد في كرة القدم من 11 لاعباً أساسياً.' },
  { id: 9, category: 'علوم', emoji: '💧', question: 'ما هو الرمز الكيميائي للماء النقي؟', options: ['H2O', 'CO2', 'O2', 'NaCl'], correctAnswer: 'H2O', explanation: 'الماء يتكون من ذرتي هيدروجين وذرة أكسجين (H2O).' },
  { id: 10, category: 'حيوانات', emoji: '🦁', question: 'من هو ملك الغابة في عالم الحيوانات البرية؟', options: ['النمر', 'الأسد', 'الفيل', 'الدب'], correctAnswer: 'الأسد', explanation: 'يُلقب الأسد بملك الغابة لقوته وشجاعته.' },
  { id: 11, category: 'فضاء', emoji: '🌙', question: 'ما هو الجسم السماوي الذي يدور حول الأرض ويظهر ليلاً؟', options: ['القمر', 'المريخ', 'المذنب', 'الشهاب'], correctAnswer: 'القمر', explanation: 'القمر هو تابع الأرض الطبيعي الذي يدور حولها.' },
  { id: 12, category: 'ألوان', emoji: '🎨', question: 'ماذا ينتج عن دمج اللون الأصفر مع اللون الأزرق؟', options: ['اللون الأخضر', 'اللون البرتقالي', 'اللون البنفسجي', 'اللون الأحمر'], correctAnswer: 'اللون الأخضر', explanation: 'مزج الأصفر والأزرق يعطي لوناً أخضر ساحراً.' },
  { id: 13, category: 'علوم', emoji: '🌱', question: 'ماذا تحتاج النبتة الصغيرة لكي تنمو وتكبر؟', options: ['ماء وضوء شمس وتربة', 'ظلام تام ومواد بلاستيكية', 'سكر وثلج', 'حديد والصخور'], correctAnswer: 'ماء وضوء شمس وتربة', explanation: 'النباتات الحية تحتاج للماء والشمس والتربة والغذاء لتنمو.' },
  { id: 14, category: 'جغرافيا', emoji: '🗺️', question: 'ما هي عاصمة المملكة العربية السعودية؟', options: ['جدة', 'الرياض', 'مكة المكرمة', 'الدمام'], correctAnswer: 'الرياض', explanation: 'الرياض هي العاصمة الإدارية للمملكة العربية السعودية.' },
  { id: 15, category: 'رياضيات', emoji: '➗', question: 'ما ناتج قسمة 20 على 4؟', options: ['4', '5', '6', '10'], correctAnswer: '5', explanation: 'لأن 5 × 4 يساوي 20.' },
  { id: 16, category: 'حيوانات', emoji: '🐬', question: 'أي من هذه الكائنات يعيش في الماء ويعد من أذكى الحيوانات؟', options: ['الدلفين', 'القرش', 'قنديل البحر', 'الأخطبوط'], correctAnswer: 'الدلفين', explanation: 'الدلافين كائنات ذكية جداً واجتماعية تعيش في البحار والمحيطات.' },
  { id: 17, category: 'علوم', emoji: '⚡', question: 'ما هي الطاقة التي تشغل الأجهزة الكهربائية في المنزل؟', options: ['الكهرباء', 'الرياح فقط', 'الصوت', 'الجاذبية'], correctAnswer: 'الكهرباء', explanation: 'الكهرباء هي الطاقة الأساسية لتشغيل المصابيح والأجهزة.' },
  { id: 18, category: 'فضاء', emoji: '🚀', question: 'ماذا يسمى الشخص الذي يسافر إلى الفضاء بمركبة الفضاء؟', options: ['مهندس', 'رائد فضاء', 'بحار', 'طيار حربي'], correctAnswer: 'رائد فضاء', explanation: 'رائد الفضاء هو الشخص المدرب على استكشاف الفضاء الخارجي.' },
  { id: 19, category: 'رياضة', emoji: '🏀', question: 'ما هي الكرة التي تُرمى داخل سلة عالية في الرياضة؟', options: ['كرة السلة', 'كرة القدم', 'كرة التنس', 'البيسبول'], correctAnswer: 'كرة السلة', explanation: 'في كرة السلة يهدف اللاعبون لتسجيل النقاط بإدخال الكرة في السلة.' },
  { id: 20, category: 'حيوانات', emoji: '🐧', question: 'طائر بحري يعيش في الثلج ولا يستطيع الطيران ولكنه سباح ماهر:', options: ['النسر', 'البطريق', 'الحمامة', 'البجعة'], correctAnswer: 'البطريق', explanation: 'البطريق طائر قطبي مذهل يجيد السباحة ببراعة تحت الماء.' },
  { id: 21, category: 'علوم', emoji: '🍎', question: 'ما هي القوة التي تجذب الأشياء نحو أرضنا؟', options: ['الجاذبية الأرضية', 'المغناطيسية الفضائية', 'الكهرباء الساتاتيكية', 'ضغط الهواء'], correctAnswer: 'الجاذبية الأرضية', explanation: 'قوة الجاذبية هي التي تبقينا على الأرض وتمنعنا من الطيران.' },
  { id: 22, category: 'تاريخ', emoji: '✍️', question: 'من هو المخترع الشهير الذي اخترع المصباح الكهربائي؟', options: ['توماس أديسون', 'ألبرت أينشتاين', 'إسحاق نيوتن', 'غاليليو'], correctAnswer: 'توماس أديسون', explanation: 'المخترع العبقري توماس أديسون هو من اخترع المصباح الكهربائي العملي.' },
  { id: 23, category: 'جغرافيا', emoji: '🏜️', question: 'ماذا تسمى الأرض الواسعة المغطاة بالرمال الحارة والقليلة الأمطار؟', options: ['الغابة', 'الصحراء', 'البحيرة', 'الجزيرة'], correctAnswer: 'الصحراء', explanation: 'الصحراء تتميز برمالها الواسعة وقلة أمطارها وحرارتها.' },
  { id: 24, category: 'رياضيات', emoji: '✖️', question: 'ما ناتج ضرب 6 في 6؟', options: ['30', '36', '42', '48'], correctAnswer: '36', explanation: '6 ضرب 6 يساوي 36 تماماً.' },
  { id: 25, category: 'حيوانات', emoji: '🐝', question: 'ما هي الحشرة النافعة التي تصنع لنا العسل اللذيذ؟', options: ['الذباب', 'النحلة', 'البعوضة', 'النملة'], correctAnswer: 'النحلة', explanation: 'النحلة تمتص رحيق الأزهار وتصنع عسلاً فيه شفاء للناس.' },
  { id: 26, category: 'موسيقى', emoji: '🎸', question: 'آلة وتارية مشهورة يعزف عليها بالحركات والأوتار:', options: ['الجيتار', 'الطبلة', 'المزمار', 'الناي'], correctAnswer: 'الجيتار', explanation: 'الجيتار من أشهر الآلات الموسيقية المحبوبة.' },
  { id: 27, category: 'علوم', emoji: '🦷', question: 'كم عدد الأسنان اللبنية لدى الأطفال الصغار؟', options: ['20 سنة', '32 سنة', '10 أسنان', '20 سناً'], correctAnswer: '20 سناً', explanation: 'يمتلك الأطفال 20 سناً لبنياً تتساقط لتنمو مكانها الأسنان الدائمة.' },
  { id: 28, category: 'فضاء', emoji: '🌠', question: 'ماذا يسمى الشهاب الساقط في السماء أحياناً؟', options: ['نجم ساطع منطفئ', 'نجم السقوط أو الشهاب', 'كوكب صغير', 'سحابة غازية'], correctAnswer: 'نجم السقوط أو الشهاب', explanation: 'الشهاب هو صخرة فضائية تحترق عند دخولها الغلاف الجوي.' },
  { id: 29, category: 'جغرافيا', emoji: '🗼', question: 'في أي عاصمة أوروبية يقع برج إيفل الشهير؟', options: ['لندن', 'باريس', 'روما', 'مدريد'], correctAnswer: 'باريس', explanation: 'يقع برج إيفل الشامخ في عاصمة فرنسا، باريس.' },
  { id: 30, category: 'رياضة', emoji: '🏊', question: 'ما هي الرياضة التي تقام داخل حوض الماء وتتضمن العوم؟', options: ['السباحة', 'الجري', 'رفع الأثقال', 'ركوب الخيل'], correctAnswer: 'السباحة', explanation: 'السباحة رياضة ممتازة ومفيدة لصحة الجسم والقلب.' },
  { id: 31, category: 'حيوانات', emoji: '🐒', question: 'حيوان يحب صعود الأشجار وأكل الموز بحماس:', options: ['القط', 'القرد', 'الكلب', 'الخروف'], correctAnswer: 'القرد', explanation: 'القردة تتميز بالذكاء وخفة الحركة والقفز بين الأشجار.' },
  { id: 32, category: 'علوم', emoji: '🌡️', question: 'بماذا نقيس درجة حرارة جسم الإنسان عندما يصاب بالمرض؟', options: ['الميزان الحراري (الترمومتر)', 'المسطرة', 'الساعة', 'البوصلة'], correctAnswer: 'الميزان الحراري (الترمومتر)', explanation: 'ميزان الحرارة يقيس درجة الحرارة بدقة.' },
  { id: 33, category: 'رياضيات', emoji: '➕', question: 'إذا كان لديك 50 تفاحة وأكلت 10 تفاحات، كم يبقى معك؟', options: ['30', '40', '50', '20'], correctAnswer: '40', explanation: '50 - 10 = 40 تفاحة.' },
  { id: 34, category: 'تاريخ', emoji: '📜', question: 'أين تم اختراع الكتابة الأولى في تاريخ البشرية القديم؟', options: ['بلاد الرافدين (العراق ومصر القديمة)', 'أمريكا', 'أستراليا', 'القطب الشمالي'], correctAnswer: 'بلاد الرافدين (العراق ومصر القديمة)', explanation: 'نشأت الكتابة المسمارية والهيروغليفية في حضارات الشرق القديم.' },
  { id: 35, category: 'علوم', emoji: '👁️', question: 'ما هو عضو الإبصار والرؤية في جسم الإنسان؟', options: ['العين', 'الأذن', 'الأنف', 'اللسان'], correctAnswer: 'العين', explanation: 'العينان هما نافذتا الإنسان لرؤية العالم الجميل.' },
  { id: 36, category: 'حيوانات', emoji: '🐪', question: 'ماذا يسمى الحيوان الذي يعيش في الصحراء ويتحمل العطش ويسمى سفينة الصحراء؟', options: ['الجمل (الناقة)', 'الحصان', 'الفهد', 'السلحفاة'], correctAnswer: 'الجمل (الناقة)', explanation: 'الجمل يتحمل العطش والحرارة الشديدة في الصحراء.' },
  { id: 37, category: 'فضاء', emoji: '🌌', question: 'ما اسم المجرة الكبيرة التي ينتمي إليها كوكبنا والأرض؟', options: ['مجرة درب التبانة (السكة الحليبية)', 'مجرة أندروميدا', 'مجرة الدب الأكبر', 'سديم الجبار'], correctAnswer: 'مجرة درب التبانة (السكة الحليبية)', explanation: 'نظامنا الشمسي يقع في مجرة درب التبانة الرائعة.' },
  { id: 38, category: 'جغرافيا', emoji: '⛰️', question: 'ما هو أعلى جبل في العالم أجمع؟', options: ['جبل إيفرست', 'جبل طارق', 'جبل أوهود', 'جبل الهيمالايا'], correctAnswer: 'جبل إيفرست', explanation: 'قمة إيفرست هي أعلى قمة جبلية على وجه الأرض.' },
  { id: 39, category: 'رياضة', emoji: '🥇', question: 'ما هي الميدالية التي تنالها المركز الأول في المسابقات؟', options: ['الميدالية الذهبية', 'الميدالية الفضية', 'الميدالية البرونزية', 'شهادة تقدير'], correctAnswer: 'الميدالية الذهبية', explanation: 'الميدالية الذهبية هي جائزة التفوق للمركز الأول.' },
  { id: 40, category: 'حيوانات', emoji: '🦋', question: 'حشرة جميلة ذات أجنحة ملونة تبدأ حياتها كدودة ترابية:', options: ['الفراشة', 'الصرصور', 'البعوضة', 'النملة'], correctAnswer: 'الفراشة', explanation: 'الفراشة تمر بمرحلة الشرنقة لتتحول إلى كائن ساحر بألوان مذهلة.' },
  { id: 41, category: 'علوم', emoji: '🧲', question: 'ما هي الخاصية التي تجعل المغناطيس يجذب الحديد إليه؟', options: ['القوة المغناطيسية', 'الجاذبية الكهربائية', 'الضغط الجوي', 'حرارة الشمس'], correctAnswer: 'القوة المغناطيسية', explanation: 'المغناطيس يمتلك مجالاً مغناطيسياً يجذب المواد المعدنية كالحديد.' },
  { id: 42, category: 'رياضيات', emoji: '🧮', question: 'كم عدد زوايا المثلث الهندسية؟', options: ['3 زوايا', '4 زوايا', '5 زوايا', 'بلا زوايا'], correctAnswer: '3 زوايا', explanation: 'المثلث يتكون دائماً من 3 أضلاع و3 زوايا.' },
  { id: 43, category: 'تاريخ', emoji: '🗺️', question: 'من هو الرحالة العربي المسلم الشهير الذي كتب تحفة النظار في غرائب الأمصار؟', options: ['ابن بطوطة', 'ابن سينا', 'الخوارزمي', 'الإدريسي'], correctAnswer: 'ابن بطوطة', explanation: 'ابن بطوطة رحالة زار معظم العالم الإسلامي ودوّن رحلاته العجيبة.' },
  { id: 44, category: 'علوم', emoji: '👂', question: 'ما هو العضو المسؤول عن سماع الأصوات والنغمات؟', options: ['الأذن', 'الأنف', 'العين', 'الجلد'], correctAnswer: 'الأذن', explanation: 'الأذن تسمع الأصوات وتميز النغمات والكلمات.' },
  { id: 45, category: 'حيوانات', emoji: '🐅', question: 'حيوان مفترس من فصيلة السنوريات يتميز بالفرو الأصفر المخطط بالأسود:', options: ['النمر (الببر)', 'الفهد', 'الذئب', 'الثعلب'], correctAnswer: 'النمر (الببر)', explanation: 'النمر الببر يتميز بخطوطه السوداء الفريدة وقوته الجبارة.' },
  { id: 46, category: 'فضاء', emoji: '🪐', question: 'ما هو الكوكب المعروف بحلقاته الساحرة المحيطة به؟', options: ['زحل', 'المريخ', 'عطارد', 'الزهرة'], correctAnswer: 'زحل', explanation: 'كوكب زحل يحاط بحلقات مذهلة مكونة من الجليد والصخور.' },
  { id: 47, category: 'جغرافيا', emoji: '🌉', question: 'في أي قارة تقع دولة اليابان الشهيرة بالشروق؟', options: ['قارة آسيا', 'قارة أفريقيا', 'قارة أوروبا', 'قارة أمريكا'], correctAnswer: 'قارة آسيا', explanation: 'تقع اليابان في أقصى شرق قارة آسيا في عاصمتها طوكيو.' },
  { id: 48, category: 'رياضة', emoji: '🎾', question: 'ما هي الرياضة التي يُضرب فيها الكرة بالمضرب فوق شبكة صغيرة؟', options: ['التنس', 'كرة القدم', 'السباحة', 'الملاكمة'], correctAnswer: 'التنس', explanation: 'رياضة التنس تمارس بمضارب خفيفة وكرة صفراء فوق الشبكة.' },
  { id: 49, category: 'علوم', emoji: '🦴', question: 'كم عدد العظام في جسم الإنسان البالغ تقريبا؟', options: ['206 عظمة', '100 عظمة', '500 عظمة', '50 عظمة'], correctAnswer: '206 عظمة', explanation: 'يحتوي جسم الإنسان البالغ على 206 عظمة تدعم الجسم وتحمي الأعضاء.' },
  { id: 50, category: 'ذكاء', emoji: '🏆', question: 'ما هو الشيء الذي كلما أخذت منه كبر وكلما وضعت فيه صغر؟', options: ['الحفرة', 'الجبل', 'البحر', 'الكتاب'], correctAnswer: 'الحفرة', explanation: 'لغز ذكي: الحفرة كلما أخرجت منها تراباً كبرت واتسعت!' },
];

export const SkillTestPage: React.FC = () => {
  const { addSkillTestResult } = useSettings();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<SkillQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form submission state
  const [heroName, setHeroName] = useState('');
  const [heroAge, setHeroAge] = useState('');
  const [heroCountry, setHeroCountry] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Shuffle the 50 questions randomly on mount
    const shuffled = [...SKILL_TEST_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setIsCompleted(false);
    setIsSubmitted(false);
  }, []);

  if (questions.length === 0) {
    return <div className="text-center py-16 font-bold text-sky-600">جاري تحميل تحدي اختبر مهاراتك...</div>;
  }

  const currentQ = questions[currentIndex];
  const total = questions.length;

  const handleAnswer = (option: string) => {
    if (feedback !== null) return;
    setSelectedAnswer(option);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setFeedback('correct');
      setScore((s) => s + 1);
      playSuccessSound();
    } else {
      setFeedback('incorrect');
      playErrorSound();
    }

    setTimeout(() => {
      if (currentIndex + 1 >= total) {
        setIsCompleted(true);
        playWinFanfare();
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      }
    }, 1800);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroName.trim()) {
      alert('الرجاء إدخال اسم البطل الكريم.');
      return;
    }

    await addSkillTestResult({
      name: heroName,
      age: heroAge || 'غير محدد',
      country: heroCountry || 'غير محدد',
      score,
      total,
    });

    setIsSubmitted(true);
    playWinFanfare();
  };

  if (isCompleted) {
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border-4 border-amber-300 animate-fade-in text-center my-6">
        <div className="text-7xl sm:text-8xl mb-3 animate-bounce">🏆</div>
        <h1 className="text-3xl font-black text-amber-600 mb-1">أنهيت تحدي 50 سؤالاً بنجاح يا بطل!</h1>
        <p className="text-gray-600 font-bold mb-6">لقد أجبت على أسئلة مهارات الذكاء والمعلومات العامة</p>

        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border-2 border-amber-200 mb-8 max-w-md mx-auto shadow-inner">
          <div className="text-sm font-bold text-gray-500 mb-1">نتيجتك النهائية</div>
          <div className="text-5xl font-black text-amber-700 mb-2">
            {score} / {total}
          </div>
          <div className="text-lg font-extrabold text-emerald-600">نسبة النجاح: {percentage}%</div>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleFormSubmit} className="bg-sky-50 p-6 rounded-2xl border-2 border-sky-200 space-y-4 text-right mb-6">
            <h3 className="text-lg font-black text-sky-900 text-center">
              📝 سجل اسمك وعمرك ودولتك لنشر النتيجة في لوحة شرف الأبطال!
            </h3>

            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">اسم البطل / البطلة:</label>
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="مثال: أحمد محمد"
                required
                className="w-full px-4 py-2.5 border-2 border-sky-300 rounded-xl font-bold text-sm bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">العمر:</label>
                <input
                  type="text"
                  value={heroAge}
                  onChange={(e) => setHeroAge(e.target.value)}
                  placeholder="مثال: 10 سنوات"
                  className="w-full px-4 py-2.5 border-2 border-sky-300 rounded-xl font-bold text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">الدولة:</label>
                <input
                  type="text"
                  value={heroCountry}
                  onChange={(e) => setHeroCountry(e.target.value)}
                  placeholder="مثال: السعودية / مصر"
                  className="w-full px-4 py-2.5 border-2 border-sky-300 rounded-xl font-bold text-sm bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-lg font-black py-3.5 px-6 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              🚀 إرسال النتيجة إلى لوحة شرف الأبطال العالمية 🏆
            </button>
          </form>
        ) : (
          <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-300 text-emerald-900 font-bold mb-6 space-y-3">
            <p className="text-xl font-black">✓ تم إرسال نتيجتك بنجاح وأضيفت إلى لوحة شرف الأبطال العامة ليراها الجميع!</p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                to="/leaderboard"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-xl shadow cursor-pointer"
              >
                🏆 عرض لوحة شرف الأبطال
              </Link>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer"
          >
            🔄 إعادة التحدي بأسئلة جديدة
          </button>
          <Link
            to="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 px-6 rounded-xl shadow"
          >
            🏠 العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-amber-300 my-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 mb-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🧠</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-amber-900">تحدي اختبر مهاراتك (50 سؤالاً)</h1>
            <p className="text-xs text-gray-500 font-bold">أجب عن الأسئلة المتنوعة واختبر ذكائك ومعلوماتك</p>
          </div>
        </div>
        <div className="bg-amber-500 text-white font-black px-3 py-1.5 rounded-xl shadow text-sm">
          النقاط: {score}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
          <span>السؤال {currentIndex + 1} من {total}</span>
          <span>{Math.round(((currentIndex + 1) / total) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-b from-amber-50/50 to-white p-6 rounded-2xl border border-amber-200 shadow-inner mb-6 text-center">
        <div className="text-xs bg-amber-200 text-amber-900 font-black px-3 py-1 rounded-full inline-block mb-3">
          التصنيف: {currentQ.category}
        </div>
        <div className="text-6xl mb-3">{currentQ.emoji}</div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-6 leading-relaxed">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
          {currentQ.options.map((opt, idx) => {
            const isChosen = selectedAnswer === opt;
            const isCorrect = opt === currentQ.correctAnswer;

            let btnClass = 'bg-white text-gray-800 border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 shadow-md';
            if (feedback !== null) {
              if (isCorrect) {
                btnClass = 'bg-emerald-500 text-white border-2 border-emerald-600 scale-102';
              } else if (isChosen && !isCorrect) {
                btnClass = 'bg-rose-500 text-white border-2 border-rose-600 opacity-80';
              } else {
                btnClass = 'bg-gray-100 text-gray-400 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                className={`p-4 rounded-xl text-base sm:text-lg font-black transition-all transform active:scale-95 flex items-center justify-between text-right cursor-pointer ${btnClass}`}
              >
                <span>{opt}</span>
                {feedback !== null && isCorrect && <span>✅</span>}
                {feedback !== null && isChosen && !isCorrect && <span>❌</span>}
              </button>
            );
          })}
        </div>

        {feedback !== null && currentQ.explanation && (
          <div className="mt-4 bg-white/90 p-3 rounded-xl border border-amber-200 max-w-md mx-auto text-gray-700 text-xs sm:text-sm font-bold animate-fade-in">
            {currentQ.explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTestPage;
