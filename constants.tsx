import React from 'react';
import { Game } from './types';
import { PuzzlePieceIcon, RocketLaunchIcon, FlagIcon, LightBulbIcon, MagnifyingGlassIcon, BeakerIcon, UserGroupIcon, MusicalNoteIcon, PaintBrushIcon, ClockIcon, HeartIcon, StarIcon } from './components/Icons';

const gameNamesByCategory = {
  'ذكاء': [
    'مغامرات العقل الصغير', 'لغز الألوان السحرية', 'مكعبات التفكير الذكي', 'مطابقة الحيوانات المرحِة',
    'ذكاء الفقاعات العجيبة', 'تحدي الأرقام السهلة', 'رحلة الحروف الطائرة', 'ألغاز المتاهة الصغيرة',
    'ذاكرة الصور السريعة', 'ترتيب الكتل العجيبة'
  ],
  'مغامرات': [
    'مغامرة البطل الصغير', 'عالم الغابة السحرية', 'رحلة الكوكب المضيء', 'قفزات الأرنب المغامر',
    'مطاردة القراصنة', 'شجاعة الفارس اللطيف', 'الهروب من القلعة القديمة', 'سباق النينجا الصغير',
    'مغامرات البالون الطائر', 'كنز الصحراء الغامض'
  ],
  'سباق': [
    'سباق السيارات الصغيرة', 'دراجات البطل السريع', 'توكتوك السرعة القصوى', 'سباق الحيوانات اللطيفة', 'سباق الصواريخ المجنونة', 'سباق سيارات التيربو'
  ],
  'سرعة': [
    'اضرب الخلد بسرعة', 'اضغط اللون الصحيح', 'الفقاعات السريعة', 'النينجا القافز', 'صيد النجوم اللامعة'
  ],
  'رسم': [
    'تلوين الحيوانات الجميلة', 'رسم الشخصيات الكرتونية', 'كتاب التلوين السحري', 'تلوين السيارات السريعة', 'رسّام الباندا اللطيف'
  ],
  'طبخ': [
    'مطبخ الطباخ الصغير', 'صنع البيتزا اللذيذة', 'كعكة الشوكولاتة الكبيرة', 'متجر العصائر السحرية', 'سندويتش الشيف المرح'
  ],
  'بنات': [
    'تلبيس الأميرة الوردية', 'صالون التجميل الصغير', 'تصميم فستان الأحلام', 'تجميل القطة اللطيفة', 'يوم الأميرة الرقيقة'
  ],
  'رياضة': [
    'كرة القدم الممتعة', 'رميات السلة السحرية', 'سباق الجري المرح', 'تنس الطاولة المدهش', 'قفز الحبل السريع'
  ],
  'ألغاز': [
    'بازل الحيوانات', 'قطع الصورة المفقودة', 'تركيب القلعة الكبيرة', 'لغز الأشكال الهندسية', 'لغز الطريق الصحيح'
  ],
  'حيوانات': [
    'رعاية القط الصغير', 'مغامرات الكلب المرح', 'مزرعة الحيوانات السعيدة', 'إنقاذ الطائر الصغير', 'صيد الأسماك الملوّنة', 'اكتشف أصوات الحيوانات'
  ],
  'تعليمية': ['تعلم الحروف الهجائية'],
  'موسيقى': ['بيانو الأطفال السحري'],
  'فضاء': ['مغامرة رائد الفضاء'],
  'بناء': ['بناء المدينة الصغيرة'],
  'أبطال': ['صانع الأبطال الخارقين'],
  'كلمات': ['لعبة تخمين الكلمة'],
  'ألوان': ['فرقعة بالونات الألوان'],
};

const gameIcons = [<PuzzlePieceIcon />, <RocketLaunchIcon />, <FlagIcon />, <LightBulbIcon />, <MagnifyingGlassIcon />, <BeakerIcon />, <UserGroupIcon />, <MusicalNoteIcon />, <PaintBrushIcon />, <ClockIcon />, <HeartIcon />, <StarIcon />];
const colors = [
    'from-yellow-400 to-amber-500', 'from-blue-400 to-blue-600', 'from-green-400 to-emerald-500', 'from-orange-400 to-red-500',
    'from-lime-400 to-green-500', 'from-purple-400 to-indigo-500', 'from-amber-400 to-orange-500', 'from-pink-400 to-rose-500',
    'from-red-400 to-rose-500', 'from-cyan-400 to-teal-500', 'from-rose-400 to-fuchsia-500', 'from-slate-500 to-slate-700',
    'from-yellow-400 to-lime-500', 'from-orange-400 to-amber-500', 'from-violet-400 to-purple-600', 'from-sky-400 to-blue-500'
];

let gameId = 1;
const gamesList: Game[] = [];
Object.entries(gameNamesByCategory).forEach(([category, names]) => {
    names.forEach((name) => {
        gamesList.push({
            id: gameId,
            name: name,
            description: `لعبة ${category} ممتعة`,
            category: category,
            icon: gameIcons[gameId % gameIcons.length],
            color: colors[gameId % colors.length]
        });
        gameId++;
    });
});

export const GAMES: Game[] = gamesList;