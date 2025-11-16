import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { GAMES } from '../constants';

// Import existing game components
import MagicColorPuzzle from '../games/MagicColorPuzzle';
import WhackAMole from '../games/WhackAMole';
import MemoryMatch from '../games/MemoryMatch';
import PlaceholderGame from '../games/PlaceholderGame';
import PizzaMaker from '../games/PizzaMaker';
import AnimalMatching from '../games/AnimalMatching';
import FishCatching from '../games/FishCatching';
import AnimalPuzzle from '../games/AnimalPuzzle';
import FunFootball from '../games/FunFootball';
import SimpleNumbersChallenge from '../games/SimpleNumbersChallenge';
import FastBubbles from '../games/FastBubbles';
import DrawingCartoonCharacters from '../games/DrawingCartoonCharacters';
import BigChocolateCake from '../games/BigChocolateCake';
import MagicBasketballShots from '../games/MagicBasketballShots';
import GeometricShapesPuzzle from '../games/GeometricShapesPuzzle';
import CaringForLittleCat from '../games/CaringForLittleCat';
import AlphabetLearning from '../games/AlphabetLearning';
import MagicKidsPiano from '../games/MagicKidsPiano';
import LittleCityBuilder from '../games/LittleCityBuilder';
import DiscoverAnimalSounds from '../games/DiscoverAnimalSounds';
import WordGuessGame from '../games/WordGuessGame';
import ColorBalloonPop from '../games/ColorBalloonPop';
import MindAdventures from '../games/MindAdventures';
import SmartThinkingCubes from '../games/SmartThinkingCubes';
import WonderBubbles from '../games/WonderBubbles';
import LittleMaze from '../games/LittleMaze';
import ArrangeWonderBlocks from '../games/ArrangeWonderBlocks';
import GlowingPlanetJourney from '../games/GlowingPlanetJourney';
import AdventurousRabbitJumps from '../games/AdventurousRabbitJumps';
import MysteriousDesertTreasure from '../games/MysteriousDesertTreasure';
import PressTheCorrectColor from '../games/PressTheCorrectColor';
import MagicJuiceShop from '../games/MagicJuiceShop';
import FunChefSandwich from '../games/FunChefSandwich';
import TheRightPathPuzzle from '../games/TheRightPathPuzzle';
import HappyAnimalFarm from '../games/HappyAnimalFarm';
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
import ShapeComposition from '../games/ShapeComposition';
import CountTheSides from '../games/CountTheSides';
import ShapeSorting from '../games/ShapeSorting';
import FindTheLetter from '../games/FindTheLetter';

// Import NEW educational and intelligence games
import FillMissingLetter from '../games/FillMissingLetter';
import MatchingShadow from '../games/MatchingShadow';
import ColorMixing from '../games/ColorMixing';
import ConnectTheDots from '../games/ConnectTheDots';
import ColorSorting from '../games/ColorSorting';
import WhichIsDifferent from '../games/WhichIsDifferent';
import WeightPuzzle from '../games/WeightPuzzle';
import NumberMaze from '../games/NumberMaze';
import ColorByNumber from '../games/ColorByNumber';
import ShapeSudoku from '../games/ShapeSudoku';
import CountTheDots from '../games/CountTheDots';
import ClockPuzzle from '../games/ClockPuzzle';
import LogicPatterns from '../games/LogicPatterns';
import HiddenWord from '../games/HiddenWord';


// Define a type for game components for better type safety
interface GameComponentProps {
  gameName: string;
}

const gameComponents: { [key: string]: React.ComponentType<GameComponentProps> } = {
  // === Existing Games ===
  'مغامرات العقل الصغير': MindAdventures,
  'لغز الألوان السحرية': MagicColorPuzzle,
  'اضرب الخلد بسرعة': WhackAMole,
  'ذاكرة الصور السريعة': MemoryMatch,
  'صنع البيتزا اللذيذة': PizzaMaker,
  'مطابقة الحيوانات المرحِة': AnimalMatching,
  'صيد الأسماك الملوّنة': FishCatching,
  'بازل الحيوانات': AnimalPuzzle,
  'كرة القدم الممتعة': FunFootball,
  'تحدي الأرقام السهلة': SimpleNumbersChallenge,
  'الفقاعات السريعة': FastBubbles,
  'رسم الشخصيات الكرتونية': DrawingCartoonCharacters,
  'كعكة الشوكولاتة الكبيرة': BigChocolateCake,
  'رميات السلة السحرية': MagicBasketballShots,
  'لغز الأشكال الهندسية': GeometricShapesPuzzle,
  'رعاية القط الصغير': CaringForLittleCat,
  'تعلم الحروف الهجائية': AlphabetLearning,
  'بيانو الأطفال السحري': MagicKidsPiano,
  'بناء المدينة الصغيرة': LittleCityBuilder,
  'اكتشف أصوات الحيوانات': DiscoverAnimalSounds,
  'لعبة تخمين الكلمة': WordGuessGame,
  'فرقعة بالونات الألوان': ColorBalloonPop,
  'مكعبات التفكير الذكي': SmartThinkingCubes,
  'ذكاء الفقاعات العجيبة': WonderBubbles,
  'ألغاز المتاهة الصغيرة': LittleMaze,
  'ترتيب الكتل العجيبة': ArrangeWonderBlocks,
  'رحلة الكوكب المضيء': GlowingPlanetJourney,
  'قفزات الأرنب المغامر': AdventurousRabbitJumps,
  'كنز الصحراء الغامض': MysteriousDesertTreasure,
  'اضغط اللون الصحيح': PressTheCorrectColor,
  'متجر العصائر السحرية': MagicJuiceShop,
  'سندويتش الشيف المرح': FunChefSandwich,
  'لغز الطريق الصحيح': TheRightPathPuzzle,
  'مزرعة الحيوانات السعيدة': HappyAnimalFarm,
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
  'تكوين الأشكال': ShapeComposition,
  'عد الأضلاع': CountTheSides,
  'فرز الأشكال': ShapeSorting,
  'البحث عن الحرف': FindTheLetter,
  
  // === New Educational & Intelligence Games ===
  'إملأ الحرف الناقص': FillMissingLetter,
  'البحث عن الظل المطابق': MatchingShadow,
  'مزج الألوان': ColorMixing,
  'توصيل النقاط': ConnectTheDots,
  'فرز الألوان': ColorSorting,
  'ما هو المختلف؟': WhichIsDifferent,
  'لغز الوزن': WeightPuzzle,
  'متاهة الأرقام': NumberMaze,
  'تلوين حسب الرقم': ColorByNumber,
  'سودوكو الأشكال للأطفال': ShapeSudoku,
  'عد النقاط': CountTheDots,
  'لغز الساعة': ClockPuzzle,
  'الأنماط المنطقية': LogicPatterns,
  'الكلمة المخفية': HiddenWord,
};

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const game = GAMES.find(g => g.id.toString() === gameId);

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

  const GameComponent = gameComponents[game.name] || PlaceholderGame;

  return <GameComponent gameName={game.name} />;
};

export default GamePage;