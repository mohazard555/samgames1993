import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { GAMES } from '../constants';

// Import game components
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


// Define a type for game components for better type safety
interface GameComponentProps {
  gameName: string;
}

const gameComponents: { [key: string]: React.ComponentType<GameComponentProps> } = {
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