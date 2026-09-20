import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GAMES } from '../constants';
import { NEW_GAMES_REGISTRY } from '../games/newGamesData';
import InteractiveNewGame from '../games/InteractiveNewGame';
import { useSettings } from '../contexts/SettingsContext';
import VipSubscriptionModal from '../components/VipSubscriptionModal';

// Import existing working game components
import MagicColorPuzzle from '../games/MagicColorPuzzle';
import WhackAMole from '../games/WhackAMole';
import MemoryMatch from '../games/MemoryMatch';
import PlaceholderGame from '../games/PlaceholderGame';
import AnimalMatching from '../games/AnimalMatching';
import FishCatching from '../games/FishCatching';
import FunFootball from '../games/FunFootball';
import SimpleNumbersChallenge from '../games/SimpleNumbersChallenge';
import FastBubbles from '../games/FastBubbles';
import DrawingCartoonCharacters from '../games/DrawingCartoonCharacters';
import AlphabetLearning from '../games/AlphabetLearning';
import MagicKidsPiano from '../games/MagicKidsPiano';
import DiscoverAnimalSounds from '../games/DiscoverAnimalSounds';
import WordGuessGame from '../games/WordGuessGame';
import ColorBalloonPop from '../games/ColorBalloonPop';
import MindAdventures from '../games/MindAdventures';
import WonderBubbles from '../games/WonderBubbles';
import ArrangeWonderBlocks from '../games/ArrangeWonderBlocks';
import MysteriousDesertTreasure from '../games/MysteriousDesertTreasure';
import PressTheCorrectColor from '../games/PressTheCorrectColor';
import TheRightPathPuzzle from '../games/TheRightPathPuzzle';
import CountTheItems from '../games/CountTheItems';
import ShapeMatching from '../games/ShapeMatching';
import CompleteThePattern from '../games/CompleteThePattern';
import BiggerOrSmaller from '../games/BiggerOrSmaller';
import HigherOrLower from '../games/HigherOrLower';
import NumberSequence from '../games/NumberSequence';
import SimpleQuiz from '../games/SimpleQuiz';
import CategorySort from '../games/CategorySort';
import FindTheDifference from '../games/FindTheDifference';
import LetterTracing from '../games/LetterTracing';
import PictureWordMatch from '../games/PictureWordMatch';
import WordOpposites from '../games/WordOpposites';
import FirstLetter from '../games/FirstLetter';
import SingularPlural from '../games/SingularPlural';
import CountTheSides from '../games/CountTheSides';
import FindTheLetter from '../games/FindTheLetter';
import FillMissingLetter from '../games/FillMissingLetter';
import ColorMixing from '../games/ColorMixing';
import ConnectTheDots from '../games/ConnectTheDots';
import ColorSorting from '../games/ColorSorting';
import WeightPuzzle from '../games/WeightPuzzle';
import NumberMaze from '../games/NumberMaze';
import ColorByNumber from '../games/ColorByNumber';
import CountTheDots from '../games/CountTheDots';
import LogicPatterns from '../games/LogicPatterns';
import HiddenWord from '../games/HiddenWord';
import FamousLandmarks from '../games/FamousLandmarks';
import GuessTheSound from '../games/GuessTheSound';
import VegetableOrFruit from '../games/VegetableOrFruit';
import JobsAndTools from '../games/JobsAndTools';
import ContinentsQuiz from '../games/ContinentsQuiz';
import HealthyFood from '../games/HealthyFood';
import InventionsQuiz from '../games/InventionsQuiz';
import SeaCreatures from '../games/SeaCreatures';
import TransportationTypes from '../games/TransportationTypes';
import SolarSystemQuiz from '../games/SolarSystemQuiz';
import StoryCharacters from '../games/StoryCharacters';
import BodyPartsQuiz from '../games/BodyPartsQuiz';
import WeatherTypes from '../games/WeatherTypes';
import FeelingsAndEmotions from '../games/FeelingsAndEmotions';
import DaysOfTheWeek from '../games/DaysOfTheWeek';
import MonthsQuiz from '../games/MonthsQuiz';
import AnimalGroups from '../games/AnimalGroups';
import FamousPaintings from '../games/FamousPaintings';
import MusicalInstruments from '../games/MusicalInstruments';
import DinosaurQuiz from '../games/DinosaurQuiz';
import WorldFlags from '../games/WorldFlags';
import FunnyMonsterMaker from '../games/FunnyMonsterMaker';
import PipePuzzle from '../games/PipePuzzle';
import MathCandyShop from '../games/MathCandyShop';
import HiddenObjectGame from '../games/HiddenObjectGame';
import TicTacToe from '../games/TicTacToe';
import DailyRoutine from '../games/DailyRoutine';
import FlashcardsGame from '../games/FlashcardsGame';
import MissingPartPuzzle from '../games/MissingPartPuzzle';

// Define a type for game components for better type safety
interface GameComponentProps {
  gameName: string;
}

const gameComponents: { [key: string]: React.ComponentType<GameComponentProps> } = {
  // === Educational Games ===
  'ابحث عن الجزء المفقود للصورة': MissingPartPuzzle,

  // === Flashcards Games ===
  'البطاقات المصورة: الفواكه الطازجة': FlashcardsGame,
  'البطاقات المصورة: الخضروات المفيدة': FlashcardsGame,
  'البطاقات المصورة: حيوانات المزرعة والغابة': FlashcardsGame,
  'البطاقات المصورة: وسائل النقل والمركبات': FlashcardsGame,
  'البطاقات المصورة: الألوان الجميلة': FlashcardsGame,
  'البطاقات المصورة: الأرقام والحساب': FlashcardsGame,
  'البطاقات المصورة: الأحرف العربية': FlashcardsGame,
  'البطاقات المصورة: الأحرف الإنجليزية': FlashcardsGame,
  'البطاقات المصورة: أفراد العائلة والمنزل': FlashcardsGame,
  'البطاقات المصورة: المهن والأدوات': FlashcardsGame,
  'البطاقات المصورة: الأشكال الهندسية': FlashcardsGame,
  'البطاقات المصورة: الملابس والأزياء': FlashcardsGame,
  'البطاقات المصورة: أدوات المدرسة': FlashcardsGame,

  // === Existing Games ===
  'مغامرات العقل الصغير': MindAdventures,
  'لغز الألوان السحرية': MagicColorPuzzle,
  'اضرب الخلد بسرعة': WhackAMole,
  'ذاكرة الصور السريعة': MemoryMatch,
  'مطابقة الحيوانات المرحِة': AnimalMatching,
  'صيد الأسماك الملوّنة': FishCatching,
  'كرة القدم الممتعة': FunFootball,
  'تحدي الأرقام السهلة': SimpleNumbersChallenge,
  'الفقاعات السريعة': FastBubbles,
  'رسم الشخصيات الكرتونية': DrawingCartoonCharacters,
  'تعلم الحروف الهجائية': AlphabetLearning,
  'بيانو الأطفال السحري': MagicKidsPiano,
  'اكتشف أصوات الحيوانات': DiscoverAnimalSounds,
  'لعبة تخمين الكلمة': WordGuessGame,
  'فرقعة بالونات الألوان': ColorBalloonPop,
  'ذكاء الفقاعات العجيبة': WonderBubbles,
  'ترتيب الكتل العجيبة': ArrangeWonderBlocks,
  'كنز الصحراء الغامض': MysteriousDesertTreasure,
  'اضغط اللون الصحيح': PressTheCorrectColor,
  'لغز الطريق الصحيح': TheRightPathPuzzle,
  'عد الفواكه': CountTheItems,
  'مطابقة الأشكال': ShapeMatching,
  'أكمل النمط': CompleteThePattern,
  'أكبر أم أصغر': BiggerOrSmaller,
  'عد الكواكب': CountTheItems,
  'ابحث عن الشكل': ShapeMatching,
  'نمط الألوان': CompleteThePattern,
  'بطاقات أعلى أو أدنى': HigherOrLower,
  'تحدي الأرقام المتسلسلة': NumberSequence,
  'مسابقة الأطفال الممتعة': SimpleQuiz,
  'لعبة تصنيف الأشياء': CategorySort,
  'ابحث عن الاختلافات': FindTheDifference,
  'كتابة الحروف': LetterTracing,
  'مطابقة الصورة بالكلمة': PictureWordMatch,
  'الكلمة وعكسها': WordOpposites,
  'الحرف الأول': FirstLetter,
  'المفرد والجمع': SingularPlural,
  'عد الأضلاع': CountTheSides,
  'البحث عن الحرف': FindTheLetter,
  'إملأ الحرف الناقص': FillMissingLetter,
  'مزج الألوان': ColorMixing,
  'توصيل النقاط': ConnectTheDots,
  'فرز الألوان': ColorSorting,
  'لغز الوزن': WeightPuzzle,
  'متاهة الأرقام': NumberMaze,
  'تلوين حسب الرقم': ColorByNumber,
  'عد النقاط': CountTheDots,
  'الأنماط المنطقية': LogicPatterns,
  'الكلمة المخفية': HiddenWord,
  'معالم شهيرة': FamousLandmarks,
  'خمن الصوت': GuessTheSound,
  'فاكهة أم خضار؟': VegetableOrFruit,
  'المهن وأدواتها': JobsAndTools,
  'مسابقة القارات': ContinentsQuiz,
  'الطعام الصحي': HealthyFood,
  'مسابقة الاختراعات': InventionsQuiz,
  'مخلوقات البحر': SeaCreatures,
  'أنواع المواصلات': TransportationTypes,
  'المجموعة الشمسية': SolarSystemQuiz,
  'شخصيات القصص': StoryCharacters,
  'أجزاء الجسم': BodyPartsQuiz,
  'أنواع الطقس': WeatherTypes,
  'المشاعر والأحاسيس': FeelingsAndEmotions,
  'أيام الأسبوع': DaysOfTheWeek,
  'شهور السنة': MonthsQuiz,
  'مجموعات الحيوانات': AnimalGroups,
  'لوحات عالمية': FamousPaintings,
  'الآلات الموسيقية': MusicalInstruments,
  'مسابقة الديناصورات': DinosaurQuiz,
  'أعلام الدول': WorldFlags,
  'صانع الوحوش المضحكة': FunnyMonsterMaker,
  'لغز توصيل الأنابيب': PipePuzzle,
  'متجر الحلوى للرياضيات': MathCandyShop,
  'البحث عن الأشياء المفقودة': HiddenObjectGame,
  'لعبة إكس أو': TicTacToe,
  'ترتيب أحداث اليوم': DailyRoutine,
};

import GoogleAdBanner from '../components/GoogleAdBanner';

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const game = GAMES.find(g => g.id.toString() === gameId);

  const { settings, isVipActive, isGameVip, getGameVipConfig } = useSettings();
  const currentId = game ? game.id : 0;
  const isVipPaidGame = isGameVip(currentId);
  const vipConfig = getGameVipConfig(currentId);
  const isTimerMode = vipConfig.restrictionType === 'timer';

  const trialDuration = vipConfig.timerSeconds || settings.paidSettings?.vipTrialDurationSeconds || 20;
  const [timeLeft, setTimeLeft] = useState<number>(trialDuration);
  const [showVipModal, setShowVipModal] = useState<boolean>(false);

  useEffect(() => {
    if (!isVipPaidGame || isVipActive || !isTimerMode) return;
    setTimeLeft(trialDuration);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowVipModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVipPaidGame, isVipActive, isTimerMode, trialDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!game) {
    return (
      <div className="text-center bg-white p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-red-600">لم يتم العثور على اللعبة</h1>
        <p className="text-gray-600 my-4">عذراً، اللعبة التي تبحث عنها غير موجودة.</p>
        <Link to="/" className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    );
  }

  // If game is in the new interactive games registry or not in legacy components, use InteractiveNewGame
  const isNewInteractiveGame = Boolean(NEW_GAMES_REGISTRY[game.name]);
  const GameComponent = isNewInteractiveGame
    ? InteractiveNewGame
    : (gameComponents[game.name] || InteractiveNewGame);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-sky-700 font-bold px-4 py-2 rounded-xl shadow-sm border border-sky-200 transition-all active:scale-95"
        >
          <span>→</span>
          <span>العودة لجميع الألعاب</span>
        </Link>
        <span className="text-sm font-bold bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
          {game.category}
        </span>
      </div>

      {isVipPaidGame && !isVipActive && isTimerMode && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between flex-wrap gap-2 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏱️</span>
            <div>
              <span className="font-black text-xs sm:text-sm block">مؤقت تجربة مجانية لألعاب VIP:</span>
              <span className="text-xs opacity-95">متبقي {formatTime(timeLeft)} قبل طلب تفعيل النسخة المدفوعة</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowVipModal(true)}
            className="px-4 py-2 bg-white text-amber-900 font-black text-xs rounded-xl shadow-sm hover:bg-amber-50 transition-colors cursor-pointer"
          >
            تفعيل الآن 🔑
          </button>
        </div>
      )}

      {isVipPaidGame && !isVipActive && !isTimerMode && (
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 p-3 rounded-2xl shadow-sm flex items-center justify-between flex-wrap gap-2 border border-amber-300">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <div>
              <span className="font-black text-xs sm:text-sm block">لعبة مشمولة باشتراك VIP:</span>
              <span className="text-xs text-amber-900">متاح لك تجربة مجانية حتى السؤال/المرحلة رقم {vipConfig.questionLimit || 10}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowVipModal(true)}
            className="px-3.5 py-1.5 bg-amber-950 text-white font-black text-xs rounded-xl shadow-sm hover:bg-amber-900 transition-colors cursor-pointer"
          >
            تفعيل النسخة الكاملة 🔑
          </button>
        </div>
      )}

      <GameComponent gameName={game.name} />

      <VipSubscriptionModal
        isOpen={showVipModal || (isVipPaidGame && !isVipActive && isTimerMode && timeLeft <= 0)}
        onClose={() => {
          if (isVipActive) {
            setShowVipModal(false);
          }
        }}
      />

      {/* Google Ad Banner in game page */}
      <GoogleAdBanner position="game" />
    </div>
  );
};

export default GamePage;