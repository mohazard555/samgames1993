export interface LandmarkItem {
  id: number;
  name: string;
  country: string;
  image: string;
  options: string[];
  fact: string;
}

export interface FlagItem {
  id: number;
  country: string;
  code: string;
  image: string;
  options: string[];
  continent: string;
}

export const FAMOUS_LANDMARKS_50: LandmarkItem[] = [
  {
    id: 1,
    name: "أهرامات الجيزة",
    country: "مصر",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=600&auto=format&fit=crop&q=80",
    options: ["مصر", "السودان", "المكسيك", "اليونان"],
    fact: "إحدى عجائب الدنيا السبع القديمة الباقية حتى اليوم!"
  },
  {
    id: 2,
    name: "برج إيفل",
    country: "فرنسا",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&auto=format&fit=crop&q=80",
    options: ["فرنسا", "إيطاليا", "إسبانيا", "ألمانيا"],
    fact: "يقع في العاصمة باريس ويبلغ ارتفاعه نحو 330 متراً."
  },
  {
    id: 3,
    name: "سور الصين العظيم",
    country: "الصين",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&auto=format&fit=crop&q=80",
    options: ["الصين", "اليابان", "منغوليا", "الهند"],
    fact: "أطول بناء دفاعي شيده الإنسان في التاريخ ويمتد لآلاف الكيلومترات!"
  },
  {
    id: 4,
    name: "برج بيزا المائل",
    country: "إيطاليا",
    image: "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=600&auto=format&fit=crop&q=80",
    options: ["إيطاليا", "فرنسا", "اليونان", "البرتغال"],
    fact: "برج جرس كنيسة بدأ بالميلان أثناء بنائه بسبب التربة الرخوة."
  },
  {
    id: 5,
    name: "تاج محل",
    country: "الهند",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80",
    options: ["الهند", "باكستان", "إيران", "تركيا"],
    fact: "ضريح من الرخام الأبيض الفاخر شيده الإمبراطور شاه جهان."
  },
  {
    id: 6,
    name: "مدينة البتراء الوردية",
    country: "الأردن",
    image: "https://images.unsplash.com/photo-1579606032822-4a0b1274d6c4?w=600&auto=format&fit=crop&q=80",
    options: ["الأردن", "سوريا", "السعودية", "مصر"],
    fact: "مدينة عربية نبطية أثرية منحوتة بالكامل في الصخور الوردية."
  },
  {
    id: 7,
    name: "برج خليفة",
    country: "الإمارات",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80",
    options: ["الإمارات", "السعودية", "قطر", "الكويت"],
    fact: "أطول ناطحة سحاب وبرج من صنع الإنسان في العالم بارتفاع 828 متراً!"
  },
  {
    id: 8,
    name: "مدرج الكولوسيوم",
    country: "إيطاليا",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80",
    options: ["إيطاليا", "إسبانيا", "تركيا", "فرنسا"],
    fact: "مدرج روماني تاريخي عملاق يقع في قلب العاصمة روما."
  },
  {
    id: 9,
    name: "تمثال الحرية",
    country: "أمريكا",
    image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=600&auto=format&fit=crop&q=80",
    options: ["أمريكا", "كندا", "بريطانيا", "فرنسا"],
    fact: "يقع في خليج نيويورك وكان هدية من فرنسا إلى الشعب الأمريكي."
  },
  {
    id: 10,
    name: "ساعة بيغ بن الشهيرة",
    country: "بريطانيا",
    image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600&auto=format&fit=crop&q=80",
    options: ["بريطانيا", "هولندا", "ألمانيا", "بلجيكا"],
    fact: "برج الساعة الأيقوني التابع لقصر وستمنستر في العاصمة لندن."
  },
  {
    id: 11,
    name: "دار أوبرا سيدني",
    country: "أستراليا",
    image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=600&auto=format&fit=crop&q=80",
    options: ["أستراليا", "نيوزيلندا", "كندا", "جنوب إفريقيا"],
    fact: "تتميز بسقفها الأبيض المصمم على شكل أشرعة السفن العملاقة."
  },
  {
    id: 12,
    name: "جبل فوجي الثلجي",
    country: "اليابان",
    image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&auto=format&fit=crop&q=80",
    options: ["اليابان", "كوريا الجنوبية", "الصين", "فيتنام"],
    fact: "أعلى قمة جبلية بركانية في اليابان ويعد رمزاً ثقافياً شهيراً."
  },
  {
    id: 13,
    name: "قصر الحمراء التاريخي",
    country: "إسبانيا",
    image: "https://images.unsplash.com/photo-1592859632074-2f0aa27e7d69?w=600&auto=format&fit=crop&q=80",
    options: ["إسبانيا", "البرتغال", "المغرب", "إيطاليا"],
    fact: "تحفة العمارة الإسلامية الأندلسية في مدينة غرناطة."
  },
  {
    id: 14,
    name: "تمثال المسيح الفادي",
    country: "البرازيل",
    image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=600&auto=format&fit=crop&q=80",
    options: ["البرازيل", "الأرجنتين", "تشيلي", "المكسيك"],
    fact: "يطل على مدينة ريو دي جانيرو من قمة جبل كوركوفادو."
  },
  {
    id: 15,
    name: "مدينة ماتشو بيتشو الأثرية",
    country: "بيرو",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&auto=format&fit=crop&q=80",
    options: ["بيرو", "بوليفيا", "الإكوادور", "كولومبيا"],
    fact: "قلعة شعب الإنكا المفقودة في أعالي جبال الأنديز."
  },
  {
    id: 16,
    name: "نصب ستونهنج الصخري",
    country: "بريطانيا",
    image: "https://images.unsplash.com/photo-1599833975787-5c143f373c30?w=600&auto=format&fit=crop&q=80",
    options: ["بريطانيا", "أيرلندا", "السويد", "الدنمارك"],
    fact: "حجارة بريطانية دائرية غامضة تعود لآلاف السنين قبل الميلاد."
  },
  {
    id: 17,
    name: "جامع الشيخ زايد الكبير",
    country: "الإمارات",
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=600&auto=format&fit=crop&q=80",
    options: ["الإمارات", "عمان", "البحرين", "الكويت"],
    fact: "تحفة معمارية إسلامية رخامية بيضاء تقع في أبوظبي."
  },
  {
    id: 18,
    name: "الكعبة المشرفة والمسجد الحرام",
    country: "السعودية",
    image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=600&auto=format&fit=crop&q=80",
    options: ["السعودية", "مصر", "الأردن", "العراق"],
    fact: "قبلة المسلمين في صلواتهم وأطهر بقاع الأرض في مكة المكرمة."
  },
  {
    id: 19,
    name: "قبة الصخرة المشرفة",
    country: "فلسطين",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80",
    options: ["فلسطين", "الأردن", "لبنان", "سوريا"],
    fact: "معلم إسلامي ذهبي بارز في ساحات المسجد الأقصى بالقدس الشريف."
  },
  {
    id: 20,
    name: "جسر البوابة الذهبية",
    country: "أمريكا",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&auto=format&fit=crop&q=80",
    options: ["أمريكا", "كندا", "أستراليا", "بريطانيا"],
    fact: "جسر معلق برتقالي شهير يصل سان فرانسيسكو بخليجها."
  },
  {
    id: 21,
    name: "شلالات نياجرا العظيمة",
    country: "كندا",
    image: "https://images.unsplash.com/photo-1489447068241-b3490214e879?w=600&auto=format&fit=crop&q=80",
    options: ["كندا", "البرازيل", "النرويج", "سويسرا"],
    fact: "أشهر شلالات العالم وتقع على الحدود بين كندا وأمريكا."
  },
  {
    id: 22,
    name: "برجا بتروناس التوأم",
    country: "ماليزيا",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&auto=format&fit=crop&q=80",
    options: ["ماليزيا", "إندونيسيا", "سنغافورة", "تايلاند"],
    fact: "أطول برجين توأمين متصلين بجسر هوائي في كوالالمبور."
  },
  {
    id: 23,
    name: "آيا صوفيا التاريخية",
    country: "تركيا",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&auto=format&fit=crop&q=80",
    options: ["تركيا", "اليونان", "بلغاريا", "أذربيجان"],
    fact: "صرح معماري وتاريخي عريق يزين مدينة إسطنبول الساحرة."
  },
  {
    id: 24,
    name: "متحف اللوفر وهرمه الزجاجي",
    country: "فرنسا",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&auto=format&fit=crop&q=80",
    options: ["فرنسا", "بلجيكا", "هولندا", "إسبانيا"],
    fact: "أشهر متاحف الفن في العالم ويضم لوحة الموناليزا الشهيرة."
  },
  {
    id: 25,
    name: "معبد البارثينون في الأكروبوليس",
    country: "اليونان",
    image: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&auto=format&fit=crop&q=80",
    options: ["اليونان", "إيطاليا", "قبرص", "تركيا"],
    fact: "معبد يوناني إغريقي قديم يعلو هضبة الأكروبوليس في أثينا."
  },
  {
    id: 26,
    name: "معبد الكرنك وطريق الكباش",
    country: "مصر",
    image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600&auto=format&fit=crop&q=80",
    options: ["مصر", "العراق", "تونس", "المغرب"],
    fact: "أكبر دار عبادة أثرية في العالم القديم في مدينة الأقصر."
  },
  {
    id: 27,
    name: "أبراج الكويت الشاهقة",
    country: "الكويت",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    options: ["الكويت", "قطر", "البحرين", "عمان"],
    fact: "ثلاثة أبراج متألقة على ساحل الخليج العربي تمثل رمز الكويت."
  },
  {
    id: 28,
    name: "قلعة حلب التاريخية",
    country: "سوريا",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&auto=format&fit=crop&q=80",
    options: ["سوريا", "لبنان", "الأردن", "العراق"],
    fact: "واحدة من أقدم وأكبر القلاع المحصنة في العالم تعلو تلة طبيعية."
  },
  {
    id: 29,
    name: "قلعة أربيل الأثرية",
    country: "العراق",
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=600&auto=format&fit=crop&q=80",
    options: ["العراق", "إيران", "تركيا", "سوريا"],
    fact: "قلعة مأهولة بالسكان منذ آلاف السنين مسجلة في التراث العالمي."
  },
  {
    id: 30,
    name: "المدرج الروماني في عمّان",
    country: "الأردن",
    image: "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?w=600&auto=format&fit=crop&q=80",
    options: ["الأردن", "لبنان", "فلسطين", "تونس"],
    fact: "مسرح روماني يتسع لنحو 6000 متفرج في قلب العاصمة عمّان."
  },
  {
    id: 31,
    name: "قصر المصمك التاريخي",
    country: "السعودية",
    image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=600&auto=format&fit=crop&q=80",
    options: ["السعودية", "اليمن", "عمان", "الإمارات"],
    fact: "حصن طيني تاريخي شهد انطلاقة توحيد المملكة العربية السعودية."
  },
  {
    id: 32,
    name: "جامع السلطان قابوس الأكبر",
    country: "عمان",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80",
    options: ["عمان", "الإمارات", "الكويت", "البحرين"],
    fact: "مسجد فخم يشتهر بقبابه وثرياته وسجادته اليدوية الضخمة في مسقط."
  },
  {
    id: 33,
    name: "أعمدة قلعة بعلبك الرومانية",
    country: "لبنان",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80",
    options: ["لبنان", "سوريا", "الأردن", "اليونان"],
    fact: "مدينة الشمس التي تضم أضخم المعابد الرومانية حجماً في التاريخ."
  },
  {
    id: 34,
    name: "جامع القيروان الكبير",
    country: "تونس",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
    options: ["تونس", "المغرب", "الجزائر", "ليبيا"],
    fact: "أول مسجد بني في المغرب العربي وأسسه عقبة بن نافع."
  },
  {
    id: 35,
    name: "قصبة الوداية التاريخية",
    country: "المغرب",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80",
    options: ["المغرب", "الجزائر", "موريتانيا", "إسبانيا"],
    fact: "قلعة أثرية ساحلية ذات أزقة زرقاء وبيضاء في العاصمة الرباط."
  },
  {
    id: 36,
    name: "مقام الشهيد الشامخ",
    country: "الجزائر",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&auto=format&fit=crop&q=80",
    options: ["الجزائر", "تونس", "ليبيا", "مصر"],
    fact: "نصب تذكاري ضخم على شكل ثلاث أوراق نخيل تلتقي في قمة واحدة."
  },
  {
    id: 37,
    name: "شلالات فيكتوريا المدوية",
    country: "زامبيا",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&auto=format&fit=crop&q=80",
    options: ["زامبيا", "جنوب إفريقيا", "كينيا", "مصر"],
    fact: "تلقب بالدخان الذي يرعد وهي من أضخم وأعرض الشلالات في العالم."
  },
  {
    id: 38,
    name: "قصر فرساي الملكي",
    country: "فرنسا",
    image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=600&auto=format&fit=crop&q=80",
    options: ["فرنسا", "إسبانيا", "النمسا", "إنجلترا"],
    fact: "قصر ملوك فرنسا الفخم وحدائقه ونوافيره وقاعة المرايا الشهيرة."
  },
  {
    id: 39,
    name: "مدينة البندقية وقنواتها المائية",
    country: "إيطاليا",
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=600&auto=format&fit=crop&q=80",
    options: ["إيطاليا", "هولندا", "اليونان", "إسبانيا"],
    fact: "مدينة عائمة شيدت على أكثر من مائة جزيرة صغيرة يربطها الجسور."
  },
  {
    id: 40,
    name: "أهرامات المايا في تشيتشن إيتزا",
    country: "المكسيك",
    image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&auto=format&fit=crop&q=80",
    options: ["المكسيك", "البرازيل", "بيرو", "الأرجنتين"],
    fact: "هرم مدرج ضخم بني وفق حسابات فلكية معقدة لحضارة المايا القديمة."
  },
  {
    id: 41,
    name: "معبد أنغكور وات",
    country: "كمبوديا",
    image: "https://images.unsplash.com/photo-1508672019048-805b876b67e2?w=600&auto=format&fit=crop&q=80",
    options: ["كمبوديا", "تايلاند", "فيتنام", "الهند"],
    fact: "أكبر مجمع معابد ديني في العالم ويمثل رمز العلم الكمبودي."
  },
  {
    id: 42,
    name: "كنيسة القديس بطرس في الفاتيكان",
    country: "إيطاليا",
    image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&auto=format&fit=crop&q=80",
    options: ["إيطاليا", "فرنسا", "إسبانيا", "البرتغال"],
    fact: "أكبر كنيسة في العالم تقع في قلب أصغر دولة مستقلة."
  },
  {
    id: 43,
    name: "مبنى الإمباير ستيت الشاهق",
    country: "أمريكا",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80",
    options: ["أمريكا", "كندا", "بريطانيا", "أستراليا"],
    fact: "أشهر ناطحة سحاب كلاسيكية شيدت في حي مانهاتن بمدينة نيويورك."
  },
  {
    id: 44,
    name: "برج لندن وقلعته التاريخية",
    country: "بريطانيا",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80",
    options: ["بريطانيا", "أيرلندا", "اسكتلندا", "فرنسا"],
    fact: "قلعة عسكرية ملكية عريقة على ضفة نهر التايمز تضم جواهر التاج."
  },
  {
    id: 45,
    name: "قصر الباب العالي (طوب قابي)",
    country: "تركيا",
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=600&auto=format&fit=crop&q=80",
    options: ["تركيا", "إيران", "أذربيجان", "اليونان"],
    fact: "مركز حكم سلاطين الدولة العثمانية لما يقرب من 400 عام."
  },
  {
    id: 46,
    name: "جزيرة القيامة وتماثيل المواي",
    country: "تشيلي",
    image: "https://images.unsplash.com/photo-1510414842594-a61782153f5b?w=600&auto=format&fit=crop&q=80",
    options: ["تشيلي", "الأرجنتين", "البرازيل", "بيرو"],
    fact: "جزيرة بركانية نائية تشتهر بمئات التماثيل الصخرية البشرية الضخمة."
  },
  {
    id: 47,
    name: "مكتبة الإسكندرية الحديثة",
    country: "مصر",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80",
    options: ["مصر", "اليونان", "لبنان", "المغرب"],
    fact: "صرح ثقافي عالمي أقيم لإحياء ذكرى أقدم مكتبة علمية في التاريخ."
  },
  {
    id: 48,
    name: "مدينة بومبي الرومانية المدفونة",
    country: "إيطاليا",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80",
    options: ["إيطاليا", "اليونان", "تركيا", "إسبانيا"],
    fact: "مدينة أثرية حفظتها حمم بركان فيزوف الهائل بدقة عبر القرون."
  },
  {
    id: 49,
    name: "قوس النصر التاريخي",
    country: "فرنسا",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80",
    options: ["فرنسا", "إيطاليا", "بلجيكا", "ألمانيا"],
    fact: "يقف بشموخ في بداية شارع الشانزليزيه الشهير في باريس."
  },
  {
    id: 50,
    name: "قصر هشام وأرضية الفسيفساء",
    country: "فلسطين",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80",
    options: ["فلسطين", "الأردن", "سوريا", "لبنان"],
    fact: "قصر أموي تاريخي في أريحا يضم شجرة الحياة وأكبر سجادة فسيفساء."
  }
];

export const WORLD_FLAGS_50: FlagItem[] = [
  { id: 1, country: "المملكة العربية السعودية", code: "sa", image: "https://flagcdn.com/w320/sa.png", options: ["السعودية", "الكويت", "قطر", "عمان"], continent: "آسيا" },
  { id: 2, country: "جمهورية مصر العربية", code: "eg", image: "https://flagcdn.com/w320/eg.png", options: ["مصر", "السودان", "اليمن", "سوريا"], continent: "إفريقيا" },
  { id: 3, country: "دولة فلسطين", code: "ps", image: "https://flagcdn.com/w320/ps.png", options: ["فلسطين", "الأردن", "الإمارات", "الكويت"], continent: "آسيا" },
  { id: 4, country: "المملكة الأردنية الهاشمية", code: "jo", image: "https://flagcdn.com/w320/jo.png", options: ["الأردن", "فلسطين", "الكويت", "السودان"], continent: "آسيا" },
  { id: 5, country: "الإمارات العربية المتحدة", code: "ae", image: "https://flagcdn.com/w320/ae.png", options: ["الإمارات", "الكويت", "الأردن", "فلسطين"], continent: "آسيا" },
  { id: 6, country: "دولة قطر", code: "qa", image: "https://flagcdn.com/w320/qa.png", options: ["قطر", "البحرين", "عمان", "الكويت"], continent: "آسيا" },
  { id: 7, country: "مملكة البحرين", code: "bh", image: "https://flagcdn.com/w320/bh.png", options: ["البحرين", "قطر", "اليمن", "عمان"], continent: "آسيا" },
  { id: 8, country: "دولة الكويت", code: "kw", image: "https://flagcdn.com/w320/kw.png", options: ["الكويت", "الإمارات", "الأردن", "العراق"], continent: "آسيا" },
  { id: 9, country: "سلطنة عمان", code: "om", image: "https://flagcdn.com/w320/om.png", options: ["عمان", "اليمن", "الكويت", "قطر"], continent: "آسيا" },
  { id: 10, country: "الجمهورية العراقية", code: "iq", image: "https://flagcdn.com/w320/iq.png", options: ["العراق", "سوريا", "مصر", "اليمن"], continent: "آسيا" },
  { id: 11, country: "الجمهورية العربية السورية", code: "sy", image: "https://flagcdn.com/w320/sy.png", options: ["سوريا", "العراق", "مصر", "اليمن"], continent: "آسيا" },
  { id: 12, country: "الجمهورية اللبنانية", code: "lb", image: "https://flagcdn.com/w320/lb.png", options: ["لبنان", "تونس", "تركيا", "النمسا"], continent: "آسيا" },
  { id: 13, country: "المملكة المغربية", code: "ma", image: "https://flagcdn.com/w320/ma.png", options: ["المغرب", "تونس", "تركيا", "فيتنام"], continent: "إفريقيا" },
  { id: 14, country: "الجمهورية الجزائرية", code: "dz", image: "https://flagcdn.com/w320/dz.png", options: ["الجزائر", "تونس", "باكستان", "ليبيا"], continent: "إفريقيا" },
  { id: 15, country: "الجمهورية التونسية", code: "tn", image: "https://flagcdn.com/w320/tn.png", options: ["تونس", "تركيا", "المغرب", "الجزائر"], continent: "إفريقيا" },
  { id: 16, country: "دولة ليبيا", code: "ly", image: "https://flagcdn.com/w320/ly.png", options: ["ليبيا", "الجزائر", "تونس", "موريتانيا"], continent: "إفريقيا" },
  { id: 17, country: "جمهورية السودان", code: "sd", image: "https://flagcdn.com/w320/sd.png", options: ["السودان", "الأردن", "فلسطين", "الكويت"], continent: "إفريقيا" },
  { id: 18, country: "الجمهورية اليمنية", code: "ye", image: "https://flagcdn.com/w320/ye.png", options: ["اليمن", "مصر", "العراق", "سوريا"], continent: "آسيا" },
  { id: 19, country: "الجمهورية الإسلامية الموريتانية", code: "mr", image: "https://flagcdn.com/w320/mr.png", options: ["موريتانيا", "الجزائر", "السنغال", "مالي"], continent: "إفريقيا" },
  { id: 20, country: "جمهورية الصومال", code: "so", image: "https://flagcdn.com/w320/so.png", options: ["الصومال", "جيبوتي", "إثيوبيا", "السودان"], continent: "إفريقيا" },
  { id: 21, country: "جمهورية جيبوتي", code: "dj", image: "https://flagcdn.com/w320/dj.png", options: ["جيبوتي", "الصومال", "إريتريا", "اليمن"], continent: "إفريقيا" },
  { id: 22, country: "اليابان", code: "jp", image: "https://flagcdn.com/w320/jp.png", options: ["اليابان", "كوريا الجنوبية", "بنغلاديش", "الصين"], continent: "آسيا" },
  { id: 23, country: "جمهورية الصين الشعبية", code: "cn", image: "https://flagcdn.com/w320/cn.png", options: ["الصين", "فيتنام", "اليابان", "تركيا"], continent: "آسيا" },
  { id: 24, country: "كوريا الجنوبية", code: "kr", image: "https://flagcdn.com/w320/kr.png", options: ["كوريا الجنوبية", "اليابان", "سنغافورة", "تايلاند"], continent: "آسيا" },
  { id: 25, country: "الهند", code: "in", image: "https://flagcdn.com/w320/in.png", options: ["الهند", "إيرلندا", "إيطاليا", "إيران"], continent: "آسيا" },
  { id: 26, country: "إندونيسيا", code: "id", image: "https://flagcdn.com/w320/id.png", options: ["إندونيسيا", "موناكو", "بولندا", "سنغافورة"], continent: "آسيا" },
  { id: 27, country: "ماليزيا", code: "my", image: "https://flagcdn.com/w320/my.png", options: ["ماليزيا", "أمريكا", "ليبيريا", "الفلبين"], continent: "آسيا" },
  { id: 28, country: "الجمهورية التركية", code: "tr", image: "https://flagcdn.com/w320/tr.png", options: ["تركيا", "تونس", "أذربيجان", "سنغافورة"], continent: "آسيا وأوروبا" },
  { id: 29, country: "فرنسا", code: "fr", image: "https://flagcdn.com/w320/fr.png", options: ["فرنسا", "إيطاليا", "هولندا", "بلجيكا"], continent: "أوروبا" },
  { id: 30, country: "إيطاليا", code: "it", image: "https://flagcdn.com/w320/it.png", options: ["إيطاليا", "إيرلندا", "فرنسا", "المكسيك"], continent: "أوروبا" },
  { id: 31, country: "ألمانيا", code: "de", image: "https://flagcdn.com/w320/de.png", options: ["ألمانيا", "بلجيكا", "إسبانيا", "النمسا"], continent: "أوروبا" },
  { id: 32, country: "إسبانيا", code: "es", image: "https://flagcdn.com/w320/es.png", options: ["إسبانيا", "البرتغال", "ألمانيا", "إيطاليا"], continent: "أوروبا" },
  { id: 33, country: "المملكة المتحدة (بريطانيا)", code: "gb", image: "https://flagcdn.com/w320/gb.png", options: ["بريطانيا", "أستراليا", "نيوزيلندا", "أمريكا"], continent: "أوروبا" },
  { id: 34, country: "الولايات المتحدة الأمريكية", code: "us", image: "https://flagcdn.com/w320/us.png", options: ["أمريكا", "ماليزيا", "ليبيريا", "بريطانيا"], continent: "أمريكا الشمالية" },
  { id: 35, country: "كندا", code: "ca", image: "https://flagcdn.com/w320/ca.png", options: ["كندا", "سويسرا", "الدنمارك", "بيرو"], continent: "أمريكا الشمالية" },
  { id: 36, country: "البرازيل", code: "br", image: "https://flagcdn.com/w320/br.png", options: ["البرازيل", "الأرجنتين", "كولومبيا", "جنوب إفريقيا"], continent: "أمريكا الجنوبية" },
  { id: 37, country: "الأرجنتين", code: "ar", image: "https://flagcdn.com/w320/ar.png", options: ["الأرجنتين", "أوروغواي", "غواتيمالا", "اليونان"], continent: "أمريكا الجنوبية" },
  { id: 38, country: "أستراليا", code: "au", image: "https://flagcdn.com/w320/au.png", options: ["أستراليا", "نيوزيلندا", "بريطانيا", "فيجي"], continent: "أوقيانوسيا" },
  { id: 39, country: "روسيا", code: "ru", image: "https://flagcdn.com/w320/ru.png", options: ["روسيا", "سلوفاكيا", "صربيا", "هولندا"], continent: "أوروبا وآسيا" },
  { id: 40, country: "المكسيك", code: "mx", image: "https://flagcdn.com/w320/mx.png", options: ["المكسيك", "إيطاليا", "إسبانيا", "البرازيل"], continent: "أمريكا الشمالية" },
  { id: 41, country: "سويسرا", code: "ch", image: "https://flagcdn.com/w320/ch.png", options: ["سويسرا", "النمسا", "الدنمارك", "النرويج"], continent: "أوروبا" },
  { id: 42, country: "السويد", code: "se", image: "https://flagcdn.com/w320/se.png", options: ["السويد", "فنلندا", "النرويج", "أوكرانيا"], continent: "أوروبا" },
  { id: 43, country: "النرويج", code: "no", image: "https://flagcdn.com/w320/no.png", options: ["النرويج", "السويد", "الدنمارك", "آيسلندا"], continent: "أوروبا" },
  { id: 44, country: "اليونان", code: "gr", image: "https://flagcdn.com/w320/gr.png", options: ["اليونان", "الأرجنتين", "فنلندا", "قبرص"], continent: "أوروبا" },
  { id: 45, country: "جنوب إفريقيا", code: "za", image: "https://flagcdn.com/w320/za.png", options: ["جنوب إفريقيا", "كينيا", "نيجيريا", "غانا"], continent: "إفريقيا" },
  { id: 46, country: "باكستان", code: "pk", image: "https://flagcdn.com/w320/pk.png", options: ["باكستان", "الجزائر", "تركيا", "أذربيجان"], continent: "آسيا" },
  { id: 47, country: "سنغافورة", code: "sg", image: "https://flagcdn.com/w320/sg.png", options: ["سنغافورة", "إندونيسيا", "ماليزيا", "تركيا"], continent: "آسيا" },
  { id: 48, country: "نيوزيلندا", code: "nz", image: "https://flagcdn.com/w320/nz.png", options: ["نيوزيلندا", "أستراليا", "بريطانيا", "فيجي"], continent: "أوقيانوسيا" },
  { id: 49, country: "هولندا", code: "nl", image: "https://flagcdn.com/w320/nl.png", options: ["هولندا", "فرنسا", "روسيا", "لوكسمبورغ"], continent: "أوروبا" },
  { id: 50, country: "البرتغال", code: "pt", image: "https://flagcdn.com/w320/pt.png", options: ["البرتغال", "إسبانيا", "البرازيل", "إيطاليا"], continent: "أوروبا" }
];
