import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playAnimalSound, speakArabic, playSuccessSound, playErrorSound, playWinFanfare, playPopSound } from '../utils/soundEffects';

interface GameProps {
  gameName: string;
}

interface AnimalItem {
  id: string;
  name: string;
  emoji: string;
  soundNameAr: string; // اسم الصوت بالعربية (صهيل، زئير، نباح...)
  soundText: string;
  category: 'farm' | 'wild' | 'birds' | 'sea_insects';
  color: string;
  fact: string;
}

const ALL_ANIMALS: AnimalItem[] = [
  // Farm & Pets
  { id: 'horse', name: 'حصان', emoji: '🐴', soundNameAr: 'صهيل', soundText: 'صهيل الحصان 🐎', category: 'farm', color: 'from-amber-100 to-amber-200 border-amber-300', fact: 'الحصان يستطيع النوم وهو واقف!' },
  { id: 'cow', name: 'بقرة', emoji: '🐮', soundNameAr: 'خوار', soundText: 'مووو مووو (خوار)', category: 'farm', color: 'from-orange-100 to-orange-200 border-orange-300', fact: 'البقرة تعطينا الحليب اللذيذ والمفيد.' },
  { id: 'sheep', name: 'خروف', emoji: '🐑', soundNameAr: 'ثغاء', soundText: 'باع باع (ثغاء)', category: 'farm', color: 'from-emerald-100 to-emerald-200 border-emerald-300', fact: 'صوف الخروف يحمينا من برد الشتاء.' },
  { id: 'goat', name: 'ماعز', emoji: '🐐', soundNameAr: 'ثغاء الماعز', soundText: 'ميع ميع', category: 'farm', color: 'from-lime-100 to-lime-200 border-lime-300', fact: 'الماعز رشيق جداً ويتسلق الجبال بسهولة.' },
  { id: 'dog', name: 'كلب', emoji: '🐶', soundNameAr: 'نباح', soundText: 'هوهو (نباح)', category: 'farm', color: 'from-blue-100 to-blue-200 border-blue-300', fact: 'الكلب صديق مخلص ويتمتع بحاسة شم قوية جداً.' },
  { id: 'cat', name: 'قطة', emoji: '🐱', soundNameAr: 'مواء', soundText: 'مياوو (مواء)', category: 'farm', color: 'from-pink-100 to-pink-200 border-pink-300', fact: 'القطط تحب النظافة وتقضي ساعات في تنظيف نفسها.' },
  { id: 'rabbit', name: 'أرنب', emoji: '🐰', soundNameAr: 'خنين وخرخرة', soundText: 'خنين ناعم ولطيف', category: 'farm', color: 'from-rose-100 to-rose-200 border-rose-300', fact: 'الأرنب يأكل الجزر والخضروات وأسنانه تنمو باستمرار!' },
  { id: 'chicken', name: 'دجاجة', emoji: '🐔', soundNameAr: 'نقنقة', soundText: 'بق بق بق (نقنقة)', category: 'farm', color: 'from-amber-100 to-yellow-200 border-yellow-300', fact: 'الدجاجة تعتني بفراخها الصغار وتبيض لنا البيض الصحي.' },
  { id: 'donkey', name: 'حمار', emoji: '🫏', soundNameAr: 'نهيق', soundText: 'نهيق الحمار', category: 'farm', color: 'from-stone-100 to-stone-200 border-stone-300', fact: 'الحمار صبور وله ذاكرة قوية جداً.' },
  { id: 'rooster', name: 'ديك', emoji: '🐓', soundNameAr: 'صياح', soundText: 'كوكو كوكو (صياح)', category: 'farm', color: 'from-red-100 to-red-200 border-red-300', fact: 'الديك يوقظ المزرعة في الصباح الباكر.' },
  { id: 'duck', name: 'بطة', emoji: '🦆', soundNameAr: 'بطبطة', soundText: 'واك واك (بطبطة)', category: 'farm', color: 'from-teal-100 to-teal-200 border-teal-300', fact: 'ريش البط مضاد للماء ويساعدها على الطفو.' },

  // Wild Animals
  { id: 'lion', name: 'أسد', emoji: '🦁', soundNameAr: 'زئير', soundText: 'غرااار (زئير)', category: 'wild', color: 'from-amber-200 to-yellow-300 border-yellow-400', fact: 'الأسد يُلقب بملك الغابة لمهابته وقوته.' },
  { id: 'cheetah', name: 'فهد / نمر', emoji: '🐆', soundNameAr: 'خرخرة وزمجرة', soundText: 'زمجرة الفهد الصياد', category: 'wild', color: 'from-yellow-200 to-amber-300 border-amber-400', fact: 'الفهد أسرع حيوان على وجه الأرض في الجري!' },
  { id: 'fox', name: 'ثعلب', emoji: '🦊', soundNameAr: 'ضباح', soundText: 'ضباح الثعلب الذكي', category: 'wild', color: 'from-orange-200 to-amber-200 border-orange-300', fact: 'الثعلب مشهور بذكائه الحاد وحاستي السمع والشم.' },
  { id: 'elephant', name: 'فيل', emoji: '🐘', soundNameAr: 'نفير', soundText: 'طوووت (نفير الفيل)', category: 'wild', color: 'from-slate-200 to-slate-300 border-slate-400', fact: 'الفيل أضخم حيوان بري على كوكب الأرض ويتميز بخرطومه.' },
  { id: 'wolf', name: 'ذئب', emoji: '🐺', soundNameAr: 'عواء', soundText: 'أووووو (عواء الذئب)', category: 'wild', color: 'from-indigo-100 to-indigo-200 border-indigo-300', fact: 'الذئاب تعيش وتصطاد في مجموعات منظمة تسمى قطيعاً.' },
  { id: 'monkey', name: 'قرد', emoji: '🐒', soundNameAr: 'قهقهة', soundText: 'أوو أأ أأ (ضحك القرد)', category: 'wild', color: 'from-amber-100 to-stone-200 border-stone-300', fact: 'القرد يحب أكل الموز والتأرجح بمرونة بين الأشجار.' },
  { id: 'bear', name: 'دب', emoji: '🐻', soundNameAr: 'زمجرة', soundText: 'غروم غروم (زمجرة)', category: 'wild', color: 'from-amber-200 to-amber-300 border-amber-400', fact: 'الدب يدخل في بيات شتوي عميق طوال الشتاء.' },
  { id: 'camel', name: 'جمل', emoji: '🐪', soundNameAr: 'رغاء', soundText: 'رغاء الجمل 🏜️', category: 'wild', color: 'from-yellow-100 to-amber-200 border-yellow-300', fact: 'الجمل يُلقب بسفينة الصحراء ويتحمل العطش لأيام طويلة.' },
  { id: 'giraffe', name: 'زرافة', emoji: '🦒', soundNameAr: 'همهمة', soundText: 'همهمة هادئة ورقيقة', category: 'wild', color: 'from-amber-100 to-yellow-200 border-yellow-400', fact: 'الزرافة أطول حيوان على الأرض ولها لسان طويل جداً.' },

  // Birds & Amphibians
  { id: 'bird', name: 'عصفور', emoji: '🐦', soundNameAr: 'تغريد', soundText: 'سوسو سوسو (تغريد)', category: 'birds', color: 'from-sky-100 to-sky-200 border-sky-300', fact: 'العصافير تغرد بألحان عذبة تبعث على البهجة.' },
  { id: 'parrot', name: 'ببغاء', emoji: '🦜', soundNameAr: 'نعيب وتصفير', soundText: 'تصفير وتقليد الأصوات', category: 'birds', color: 'from-emerald-100 to-teal-200 border-teal-300', fact: 'الببغاء من أذكى الطيور ويستطيع تقليد كلام البشر!' },
  { id: 'owl', name: 'بومة', emoji: '🦉', soundNameAr: 'نعيق', soundText: 'هووهوو (نعيق البومة)', category: 'birds', color: 'from-purple-100 to-purple-200 border-purple-300', fact: 'البومة تستطيع تدوير رأسها بزاوية 270 درجة!' },
  { id: 'eagle', name: 'نسر / صقر', emoji: '🦅', soundNameAr: 'صرير الجارح', soundText: 'صرير حاد وقوي', category: 'birds', color: 'from-stone-200 to-amber-200 border-stone-400', fact: 'النسر يحلق على ارتفاعات شاهقة وله بصر حاد جداً.' },
  { id: 'pigeon', name: 'حمامة', emoji: '🕊️', soundNameAr: 'هديل', soundText: 'هديل الحمام الرقيق', category: 'birds', color: 'from-cyan-100 to-slate-200 border-slate-300', fact: 'الحمامة رمز السلام وكانت تُستخدم لنقل الرسائل.' },
  { id: 'penguin', name: 'بطريق', emoji: '🐧', soundNameAr: 'صياح البطريق', soundText: 'أصوات مرحة في الجليد', category: 'birds', color: 'from-slate-100 to-blue-200 border-slate-300', fact: 'البطريق طائر سباح ماهر يعيش في القطب المتجمد.' },
  { id: 'frog', name: 'ضفدع', emoji: '🐸', soundNameAr: 'نقيق', soundText: 'نق نق (نقيق)', category: 'birds', color: 'from-emerald-100 to-green-200 border-green-300', fact: 'الضفدع يستطيع القفز لمسافات تصل إلى 20 ضعف طوله!' },

  // Sea, Insects & Small Creatures
  { id: 'dolphin', name: 'دلفين', emoji: '🐬', soundNameAr: 'تصفير ونقر', soundText: 'تصفير مرح تحت الماء', category: 'sea_insects', color: 'from-cyan-100 to-blue-200 border-blue-300', fact: 'الدلفين صديق الإنسان وهو من أذكى المخلوقات البحرية.' },
  { id: 'whale', name: 'حوت أزرق', emoji: '🐋', soundNameAr: 'غناء الحوت', soundText: 'نغمات عميقة في المحيط', category: 'sea_insects', color: 'from-blue-200 to-indigo-300 border-indigo-400', fact: 'الحوت الأزرق هو أضخم كائن حي عاش في تاريخ الأرض!' },
  { id: 'bee', name: 'نحلة', emoji: '🐝', soundNameAr: 'طنين', soundText: 'بزززز (طنين النحلة)', category: 'sea_insects', color: 'from-yellow-100 to-amber-200 border-yellow-300', fact: 'النحلة تصنع لنا العسل الشافي من رحيق الأزهار.' },
  { id: 'cricket', name: 'صرصور الليل', emoji: '🦗', soundNameAr: 'صرير', soundText: 'صرير هادئ في الليل', category: 'sea_insects', color: 'from-lime-100 to-emerald-200 border-lime-300', fact: 'صرصور الليل يصدر صوته بفرك جناحيه معاً!' },
  { id: 'mouse', name: 'فأر صغير', emoji: '🐭', soundNameAr: 'صرير الفأر', soundText: 'صرير سريع وحاد', category: 'sea_insects', color: 'from-stone-100 to-pink-100 border-stone-300', fact: 'الفئران سريعة الحركة وفضولية جداً في استكشاف الأماكن.' },
];

const DiscoverAnimalSounds: React.FC<GameProps> = ({ gameName }) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'farm' | 'wild' | 'birds' | 'sea_insects'>('all');
  const [playingAnimalId, setPlayingAnimalId] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  // Quiz State
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [targetAnimal, setTargetAnimal] = useState<AnimalItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<AnimalItem[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredAnimals = selectedCategory === 'all'
    ? ALL_ANIMALS
    : ALL_ANIMALS.filter(a => a.category === selectedCategory);

  const handleAnimalPlay = (animal: AnimalItem) => {
    playPopSound();
    setPlayingAnimalId(animal.id);
    playAnimalSound(animal.name);

    if (voiceEnabled) {
      setTimeout(() => {
        speakArabic(`صوت ${animal.name}. ${animal.soundNameAr}`);
      }, 500);
    }

    setTimeout(() => {
      setPlayingAnimalId(null);
    }, 1500);
  };

  // Start new Quiz round
  const startNewQuizQuestion = () => {
    const randomTarget = ALL_ANIMALS[Math.floor(Math.random() * ALL_ANIMALS.length)];
    const otherAnimals = ALL_ANIMALS.filter(a => a.id !== randomTarget.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [randomTarget, ...otherAnimals].sort(() => Math.random() - 0.5);

    setTargetAnimal(randomTarget);
    setQuizOptions(options);
    setQuizFeedback(null);
    setSelectedQuizOption(null);

    // Auto play target sound
    setTimeout(() => {
      playAnimalSound(randomTarget.name);
    }, 300);
  };

  useEffect(() => {
    if (activeTab === 'quiz') {
      setQuizQuestionIndex(0);
      setQuizScore(0);
      setQuizFinished(false);
      startNewQuizQuestion();
    }
  }, [activeTab]);

  const handleQuizAnswer = (option: AnimalItem) => {
    if (quizFeedback !== null || !targetAnimal) return;
    setSelectedQuizOption(option.id);

    if (option.id === targetAnimal.id) {
      setQuizFeedback('correct');
      setQuizScore(s => s + 10);
      playSuccessSound();
      if (voiceEnabled) {
        speakArabic(`أحسنت! هذا صوت ${targetAnimal.name}`);
      }
    } else {
      setQuizFeedback('incorrect');
      playErrorSound();
    }

    setTimeout(() => {
      if (quizQuestionIndex + 1 >= 10) {
        setQuizFinished(true);
        playWinFanfare();
      } else {
        setQuizQuestionIndex(i => i + 1);
        startNewQuizQuestion();
      }
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-4 sm:p-7 rounded-3xl shadow-xl border-4 border-amber-300">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-4 border-b border-amber-100">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-2xl shadow transition-transform active:scale-95 text-sm sm:text-base"
        >
          <span>→</span>
          <span>العودة للألعاب</span>
        </Link>
        <div className="text-center">
          <h1 className="text-xl sm:text-3xl font-black text-amber-900 flex items-center justify-center gap-2">
            <span>🦁</span>
            <span>{gameName}</span>
            <span>🐴</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-bold mt-0.5">
            عالم أصوات الحيوانات الحقيقية الشيقة مع النطق العربي
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow border transition-all ${
              voiceEnabled ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-500 border-gray-300'
            }`}
            title="تفعيل أو كتم النطق العربي"
          >
            <span>{voiceEnabled ? '🗣️ نطق الاسم مفعّل' : '🔇 النطق صامت'}</span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => { playPopSound(); setActiveTab('explore'); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-base sm:text-lg transition-all shadow-sm ${
            activeTab === 'explore'
              ? 'bg-amber-500 text-white shadow-md scale-105'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }`}
        >
          <span>🐾</span>
          <span>استكشاف أصوات الحيوانات ({ALL_ANIMALS.length})</span>
        </button>
        <button
          onClick={() => { playPopSound(); setActiveTab('quiz'); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-base sm:text-lg transition-all shadow-sm ${
            activeTab === 'quiz'
              ? 'bg-purple-600 text-white shadow-md scale-105'
              : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
          }`}
        >
          <span>🎯</span>
          <span>تحدي خمن الصوت!</span>
        </button>
      </div>

      {/* TAB 1: EXPLORE ANIMALS */}
      {activeTab === 'explore' && (
        <div>
          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[
              { id: 'all', label: 'جميع الحيوانات 🌍' },
              { id: 'farm', label: 'حيوانات المزرعة 🐮' },
              { id: 'wild', label: 'حيوانات الغابة 🦁' },
              { id: 'birds', label: 'الطيور والمخلوقات 🦅' },
              { id: 'sea_insects', label: 'البحر والحشرات 🐬' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playPopSound();
                  setSelectedCategory(cat.id as any);
                }}
                className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <p className="text-center text-gray-700 font-bold mb-6 text-sm sm:text-base">
            👇 اضغط على أي حيوان لسماع صوته الحقيقي فوراً مع مؤثرات حية!
          </p>

          {/* Animals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {filteredAnimals.map((animal) => {
              const isPlaying = playingAnimalId === animal.id;
              return (
                <button
                  key={animal.id}
                  onClick={() => handleAnimalPlay(animal)}
                  className={`bg-gradient-to-b ${animal.color} p-4 sm:p-5 rounded-3xl flex flex-col items-center justify-between border-2 shadow-sm hover:shadow-xl transform transition-all active:scale-95 cursor-pointer relative overflow-hidden group ${
                    isPlaying ? 'scale-105 ring-4 ring-amber-400 shadow-2xl' : 'hover:-translate-y-1'
                  }`}
                >
                  {/* Sound Wave Animation Pill when playing */}
                  {isPlaying && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                      <span>🔊</span>
                      <span>صوت حي</span>
                    </div>
                  )}

                  {/* Animal Emoji */}
                  <div className={`text-5xl sm:text-6xl my-2 select-none transition-transform ${isPlaying ? 'animate-bounce scale-110' : 'group-hover:scale-110'}`}>
                    {animal.emoji}
                  </div>

                  {/* Animal Name */}
                  <span className="text-lg sm:text-xl font-black text-gray-900 mt-1">
                    {animal.name}
                  </span>

                  {/* Sound Name & Info */}
                  <div className="w-full mt-2 space-y-1">
                    <span className="block text-xs font-black text-amber-900 bg-white/80 py-1 px-2 rounded-xl shadow-xs">
                      {animal.soundText}
                    </span>
                    <p className="text-[11px] text-gray-600 font-medium line-clamp-2 px-1 text-center">
                      {animal.fact}
                    </p>
                  </div>

                  {/* Visual Audio Button */}
                  <div className="mt-3 w-full bg-white/90 hover:bg-white text-gray-800 font-bold text-xs py-1.5 px-3 rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 shadow-2xs">
                    <span>🔊</span>
                    <span>اسمع الصوت</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GUESS THE ANIMAL SOUND QUIZ */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto">
          {quizFinished ? (
            <div className="text-center bg-gradient-to-b from-purple-50 to-pink-50 p-8 rounded-3xl border-4 border-purple-300 animate-fade-in">
              <div className="text-7xl mb-4 animate-bounce">🏆</div>
              <h2 className="text-3xl font-black text-purple-900 mb-2">ما شاء الله يا بطل الحيوانات! 🌟</h2>
              <p className="text-lg text-gray-700 font-bold mb-4">لقد أنهيت مسابقة تخمين أصوات الحيوانات بنجاح</p>
              <div className="bg-white p-4 rounded-2xl max-w-xs mx-auto shadow-sm border border-purple-200 mb-6">
                <p className="text-gray-500 font-bold text-sm">مجموع نقاطك</p>
                <p className="text-4xl font-black text-purple-700">{quizScore} / 100</p>
              </div>
              <button
                onClick={() => {
                  setQuizQuestionIndex(0);
                  setQuizScore(0);
                  setQuizFinished(false);
                  startNewQuizQuestion();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-black py-3 px-8 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                🔄 العب المسابقة مرة أخرى
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-b from-purple-50 to-indigo-50 p-6 sm:p-8 rounded-3xl border-2 border-purple-200 shadow-inner text-center">
              {/* Quiz Progress & Score */}
              <div className="flex justify-between items-center mb-6">
                <span className="bg-purple-100 text-purple-900 font-black px-4 py-1.5 rounded-xl text-sm border border-purple-200">
                  السؤال {quizQuestionIndex + 1} من 10
                </span>
                <span className="bg-emerald-500 text-white font-black px-4 py-1.5 rounded-xl text-sm shadow">
                  النقاط: {quizScore} 🌟
                </span>
              </div>

              {/* Sound Player Box */}
              <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-purple-200 mb-6">
                <div className="text-5xl mb-3 animate-pulse">❓🔊</div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-800 mb-4">
                  استمع جيداً.. صوت أي حيوان هذا؟
                </h3>
                <button
                  onClick={() => {
                    if (targetAnimal) {
                      playAnimalSound(targetAnimal.name);
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-black text-base sm:text-lg px-6 py-3 rounded-2xl shadow-md transition-transform active:scale-95 inline-flex items-center gap-2 cursor-pointer animate-bounce"
                >
                  <span>🔊</span>
                  <span>أعد تشغيل الصوت</span>
                </button>
              </div>

              {/* 4 Choices Grid */}
              <div className="grid grid-cols-2 gap-4">
                {quizOptions.map((option) => {
                  const isSelected = selectedQuizOption === option.id;
                  const isCorrect = targetAnimal && option.id === targetAnimal.id;
                  let btnStyle = 'bg-white hover:bg-purple-50 border-purple-200 text-gray-800';

                  if (quizFeedback !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 scale-105 ring-4 ring-emerald-300';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300';
                    } else {
                      btnStyle = 'bg-gray-100 text-gray-400 opacity-60 border-gray-200';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={quizFeedback !== null}
                      className={`p-4 sm:p-5 rounded-2xl border-2 shadow-sm font-black flex flex-col items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${btnStyle}`}
                    >
                      <span className="text-4xl sm:text-5xl select-none">{option.emoji}</span>
                      <span className="text-base sm:text-lg">{option.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Alert */}
              {quizFeedback === 'correct' && (
                <div className="mt-4 p-3 bg-emerald-100 text-emerald-800 font-black rounded-2xl border border-emerald-300 text-lg animate-fade-in">
                  🎉 رائع ومبهر! إجابة صحيحة ({targetAnimal?.name} - {targetAnimal?.soundNameAr})
                </div>
              )}
              {quizFeedback === 'incorrect' && (
                <div className="mt-4 p-3 bg-rose-100 text-rose-800 font-black rounded-2xl border border-rose-300 text-base animate-fade-in">
                  💡 حاول ثانية يا بطل! الصوت الصحيح كان لـ {targetAnimal?.name}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscoverAnimalSounds;
