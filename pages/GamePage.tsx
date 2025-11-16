import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { GAMES } from '../constants';

// Import existing game components
import MagicColorPuzzle from '../games/MagicColorPuzzle';
import WhackAMole from '../games/WhackAMole';
import MemoryMatch from '../games/MemoryMatch';
import PlaceholderGame from '../games/PlaceholderGame';
import CarRace from '../games/CarRace';
import PizzaMaker from '../games/PizzaMaker';
import AnimalColoring from '../games/AnimalColoring';
import AnimalMatching from '../games/AnimalMatching';
import PrincessDressUp from '../games/PrincessDressUp';
import FishCatching from '../games/FishCatching';
import LittleHeroAdventure from '../games/LittleHeroAdventure';
import AnimalPuzzle from '../games/AnimalPuzzle';
import FunFootball from '../games/FunFootball';
import SimpleNumbersChallenge from '../games/SimpleNumbersChallenge';
import MagicForestWorld from '../games/MagicForestWorld';
import CuteAnimalRace from '../games/CuteAnimalRace';
import FastBubbles from '../games/FastBubbles';
import DrawingCartoonCharacters from '../games/DrawingCartoonCharacters';
import BigChocolateCake from '../games/BigChocolateCake';
import LittleBeautySalon from '../games/LittleBeautySalon';
import MagicBasketballShots from '../games/MagicBasketballShots';
import GeometricShapesPuzzle from '../games/GeometricShapesPuzzle';
import CaringForLittleCat from '../games/CaringForLittleCat';
import AlphabetLearning from '../games/AlphabetLearning';
import MagicKidsPiano from '../games/MagicKidsPiano';
import AstronautAdventure from '../games/AstronautAdventure';
import LittleCityBuilder from '../games/LittleCityBuilder';
import SuperheroMaker from '../games/SuperheroMaker';
import DiscoverAnimalSounds from '../games/DiscoverAnimalSounds';
import WordGuessGame from '../games/WordGuessGame';
import TurboCarRacing from '../games/TurboCarRacing';
import ColorBalloonPop from '../games/ColorBalloonPop';
import MindAdventures from '../games/MindAdventures';

// Import NEWLY CREATED game components
import SmartThinkingCubes from '../games/SmartThinkingCubes';
import WonderBubbles from '../games/WonderBubbles';
import FlyingLetters from '../games/FlyingLetters';
import LittleMaze from '../games/LittleMaze';
import ArrangeWonderBlocks from '../games/ArrangeWonderBlocks';
import GlowingPlanetJourney from '../games/GlowingPlanetJourney';
import AdventurousRabbitJumps from '../games/AdventurousRabbitJumps';
import PirateChase from '../games/PirateChase';
import GentleKnight from '../games/GentleKnight';
import EscapeTheCastle from '../games/EscapeTheCastle';
import LittleNinjaRace from '../games/LittleNinjaRace';
import FlyingBalloon from '../games/FlyingBalloon';
import MysteriousDesertTreasure from '../games/MysteriousDesertTreasure';
import FastHeroBikes from '../games/FastHeroBikes';
import TuktukRace from '../games/TuktukRace';
import CrazyRocketRace from '../games/CrazyRocketRace';
import PressTheCorrectColor from '../games/PressTheCorrectColor';
import JumpingNinja from '../games/JumpingNinja';
import CatchingShinyStars from '../games/CatchingShinyStars';
import MagicColoringBook from '../games/MagicColoringBook';
import ColoringFastCars from '../games/ColoringFastCars';
import CutePandaPainter from '../games/CutePandaPainter';
import LittleChefKitchen from '../games/LittleChefKitchen';
import MagicJuiceShop from '../games/MagicJuiceShop';
import FunChefSandwich from '../games/FunChefSandwich';
import DreamDressDesign from '../games/DreamDressDesign';
import CuteCatMakeover from '../games/CuteCatMakeover';
import GentlePrincessDay from '../games/GentlePrincessDay';
import FunRunningRace from '../games/FunRunningRace';
import AmazingTableTennis from '../games/AmazingTableTennis';
import FastRopeJumping from '../games/FastRopeJumping';
import MissingPicturePieces from '../games/MissingPicturePieces';
import BuildingTheBigCastle from '../games/BuildingTheBigCastle';
import TheRightPathPuzzle from '../games/TheRightPathPuzzle';
import FunDogAdventures from '../games/FunDogAdventures';
import HappyAnimalFarm from '../games/HappyAnimalFarm';
import SavingTheLittleBird from '../games/SavingTheLittleBird';


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
  'سباق السيارات الصغيرة': CarRace,
  'صنع البيتزا اللذيذة': PizzaMaker,
  'تلوين الحيوانات الجميلة': AnimalColoring,
  'مطابقة الحيوانات المرحِة': AnimalMatching,
  'تلبيس الأميرة الوردية': PrincessDressUp,
  'صيد الأسماك الملوّنة': FishCatching,
  'مغامرة البطل الصغير': LittleHeroAdventure,
  'بازل الحيوانات': AnimalPuzzle,
  'كرة القدم الممتعة': FunFootball,
  'تحدي الأرقام السهلة': SimpleNumbersChallenge,
  'عالم الغابة السحرية': MagicForestWorld,
  'سباق الحيوانات اللطيفة': CuteAnimalRace,
  'الفقاعات السريعة': FastBubbles,
  'رسم الشخصيات الكرتونية': DrawingCartoonCharacters,
  'كعكة الشوكولاتة الكبيرة': BigChocolateCake,
  'صالون التجميل الصغير': LittleBeautySalon,
  'رميات السلة السحرية': MagicBasketballShots,
  'لغز الأشكال الهندسية': GeometricShapesPuzzle,
  'رعاية القط الصغير': CaringForLittleCat,
  'تعلم الحروف الهجائية': AlphabetLearning,
  'بيانو الأطفال السحري': MagicKidsPiano,
  'مغامرة رائد الفضاء': AstronautAdventure,
  'بناء المدينة الصغيرة': LittleCityBuilder,
  'صانع الأبطال الخارقين': SuperheroMaker,
  'اكتشف أصوات الحيوانات': DiscoverAnimalSounds,
  'لعبة تخمين الكلمة': WordGuessGame,
  'سباق سيارات التيربو': TurboCarRacing,
  'فرقعة بالونات الألوان': ColorBalloonPop,

  // === Newly Built Games ===
  // ذكاء
  'مكعبات التفكير الذكي': SmartThinkingCubes,
  'ذكاء الفقاعات العجيبة': WonderBubbles,
  'رحلة الحروف الطائرة': FlyingLetters,
  'ألغاز المتاهة الصغيرة': LittleMaze,
  'ترتيب الكتل العجيبة': ArrangeWonderBlocks,
  // مغامرات
  'رحلة الكوكب المضيء': GlowingPlanetJourney,
  'قفزات الأرنب المغامر': AdventurousRabbitJumps,
  'مطاردة القراصنة': PirateChase,
  'شجاعة الفارس اللطيف': GentleKnight,
  'الهروب من القلعة القديمة': EscapeTheCastle,
  'سباق النينجا الصغير': LittleNinjaRace,
  'مغامرات البالون الطائر': FlyingBalloon,
  'كنز الصحراء الغامض': MysteriousDesertTreasure,
  // سباق
  'دراجات البطل السريع': FastHeroBikes,
  'توكتوك السرعة القصوى': TuktukRace,
  'سباق الصواريخ المجنونة': CrazyRocketRace,
  // سرعة
  'اضغط اللون الصحيح': PressTheCorrectColor,
  'النينجا القافز': JumpingNinja,
  'صيد النجوم اللامعة': CatchingShinyStars,
  // رسم
  'كتاب التلوين السحري': MagicColoringBook,
  'تلوين السيارات السريعة': ColoringFastCars,
  'رسّام الباندا اللطيف': CutePandaPainter,
  // طبخ
  'مطبخ الطباخ الصغير': LittleChefKitchen,
  'متجر العصائر السحرية': MagicJuiceShop,
  'سندويتش الشيف المرح': FunChefSandwich,
  // بنات
  'تصميم فستان الأحلام': DreamDressDesign,
  'تجميل القطة اللطيفة': CuteCatMakeover,
  'يوم الأميرة الرقيقة': GentlePrincessDay,
  // رياضة
  'سباق الجري المرح': FunRunningRace,
  'تنس الطاولة المدهش': AmazingTableTennis,
  'قفز الحبل السريع': FastRopeJumping,
  // ألغاز
  'قطع الصورة المفقودة': MissingPicturePieces,
  'تركيب القلعة الكبيرة': BuildingTheBigCastle,
  'لغز الطريق الصحيح': TheRightPathPuzzle,
  // حيوانات
  'مغامرات الكلب المرح': FunDogAdventures,
  'مزرعة الحيوانات السعيدة': HappyAnimalFarm,
  'إنقاذ الطائر الصغير': SavingTheLittleBird,
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