// script.js - 香水问卷逻辑（多语言版本 - 包含缅甸语）
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxETRWl8xtSJ_O0coK5lmZU-6MHBTNmKUoyJf7M9iB5cQEP9Ain1nTRGPmMLhH7YGDX5g/exec"
let hasSentData = false; // 标记是否已发送数据

// 全局变量
let currentPage = "language";
let currentQuestion = 0;
let currentLanguage = "zh"; // 默认中文
let scores = {
  柑橘调: 0,
  果香调: 0,
  水生调: 0,
  绿叶调: 0,
  东方调: 0,
  木质调: 0,
  花香调: 0,
};
let userAnswers = {};

// 多语言文本
const translations = {
  zh: {
    // 语言选择页面
    chooseLanguage: "请选择语言",
    chinese: "中文",
    chineseDesc: "使用中文进行测试",
    english: "English",
    englishDesc: "Take the test in English",
    burmese: "မြန်မာ",
    burmeseDesc: "မြန်မာဘာသာဖြင့် စမ်းသပ်ပါ",
    startTest: "开始测试",
    languageDisclaimer: "您可以在测试过程中随时切换语言",

    // 欢迎页面
    findYourScent: "找到你的专属香调",
    welcomeText:
      "通过10个场景测试题，分析你的香调偏好<br />根据你的选择占比，推荐最适合你的香水类型",
    feature1: "香调占比分析",
    feature2: "个性化推荐",
    feature3: "专属调香建议",
    startButton: "开始测试",
    disclaimerText: "测试约需3-5分钟，所有数据仅用于分析",
    switchToEnglish: "Switch to English",
    switchToChinese: "切换到中文",
    switchToBurmese: "မြန်မာဘာသာသို့ပြောင်းရန်",

    // 基本信息页面
    back: "返回",
    basicInfo: "基本信息",
    continueQuiz: "继续场景测试",

    // 场景测试页面
    quizTitle: "场景测试",
    questionText: "第",
    questionText2: "题",
    scoreTitle: "当前香调分布",
    nextQuestion: "下一题",
    submitQuiz: "查看结果",

    // 结果页面
    resultTitle: "你的香调分析报告",
    resultSubtitle: "基于你的10个选择生成",
    dominantTitle: "你的主导香调",
    analysisTitle: "香调占比分析",
    recommendationTitle: "个性化推荐",
    suggestionTitle: "调香建议",
    restartTest: "重新测试",
    shareResult: "分享结果",

    // 分享模态框
    shareModalTitle: "分享你的香调分析",
    copyLink: "复制链接",

    // 香调描述
    citrusDesc: "你喜欢清新活力的感觉，适合日常提神醒脑，充满阳光气息。",
    fruityDesc: "你倾向于甜美可人的香气，充满亲和力，让人忍不住想靠近。",
    aquaticDesc: "你偏爱冷静理性的香调，清爽不张扬，自带高级感。",
    greenDesc: "你热爱自然随性的香气，贴近生活，让人感觉舒适自在。",
    orientalDesc: "你钟情神秘独特的香调，气场强大，充满异域风情。",
    woodyDesc: "你喜欢温暖可靠的气息，踏实稳重，给人安全感。",
    floralDesc: "你偏好温柔浪漫的香气，细腻动人，富有女性魅力。",

    // 推荐文案
    citrusRec:
      "推荐使用柠檬、柚子、佛手柑等精油，适合早晨使用提神醒脑。可以尝试「清晨阳光」或「柑橘之恋」配方。",
    fruityRec:
      "推荐桃子、荔枝、芒果等水果系香精，适合日常使用增加亲和力。建议尝试「蜜桃少女」或「热带果园」配方。",
    aquaticRec:
      "推荐海洋、雨水、莲花等清新系香料，适合工作场合保持冷静。可以尝试「雨后清晨」或「深海之谜」配方。",
    greenRec:
      "推荐青草、茶叶、薄荷等自然香料，适合休闲时光放松心情。建议尝试「森林漫步」或「茶园清晨」配方。",
    orientalRec:
      "推荐琥珀、麝香、肉桂等浓郁香料，适合晚宴或特殊场合。可以尝试「神秘东方」或「夜之魅惑」配方。",
    woodyRec:
      "推荐雪松、檀香、香根草等温暖木材，适合秋冬季节或需要展现稳重的场合。建议尝试「冬日暖木」或「书房时光」配方。",
    floralRec:
      "推荐玫瑰、茉莉、百合等花朵香精，适合约会或浪漫场合。可以尝试「玫瑰花园」或「白色花束」配方。",
  },

  en: {
    // 语言选择页面
    chooseLanguage: "Choose Language",
    chinese: "中文",
    chineseDesc: "Use Chinese for the test",
    english: "English",
    englishDesc: "Take the test in English",
    burmese: "မြန်မာ",
    burmeseDesc: "Take the test in Burmese",
    startTest: "Start Test",
    languageDisclaimer: "You can switch languages at any time during the test",

    // 欢迎页面
    findYourScent: "Find Your Signature Scent",
    welcomeText:
      "Analyze your fragrance preferences through 10 scenario questions<br />Recommend the most suitable perfume type based on your choice ratio",
    feature1: "Fragrance Ratio Analysis",
    feature2: "Personalized Recommendations",
    feature3: "Custom Blending Suggestions",
    startButton: "Start Test",
    disclaimerText:
      "The test takes about 3-5 minutes, all data is for analysis only",
    switchToEnglish: "Switch to English",
    switchToChinese: "切换到中文",
    switchToBurmese: "မြန်မာဘာသာသို့ပြောင်းရန်",

    // 基本信息页面
    back: "Back",
    basicInfo: "Basic Information",
    continueQuiz: "Continue to Scenario Test",

    // 场景测试页面
    quizTitle: "Scenario Testing",
    questionText: "Question",
    questionText2: "",
    scoreTitle: "Current Fragrance Distribution",
    nextQuestion: "Next Question",
    submitQuiz: "View Results",

    // 结果页面
    resultTitle: "Your Fragrance Analysis Report",
    resultSubtitle: "Generated based on your 10 choices",
    dominantTitle: "Your Dominant Fragrance",
    analysisTitle: "Fragrance Ratio Analysis",
    recommendationTitle: "Personalized Recommendations",
    suggestionTitle: "Blending Suggestions",
    restartTest: "Restart Test",
    shareResult: "Share Results",

    // 分享模态框
    shareModalTitle: "Share Your Fragrance Analysis",
    copyLink: "Copy Link",

    // 香调描述
    citrusDesc:
      "You enjoy fresh and vibrant scents, suitable for daily refreshment, full of sunshine energy.",
    fruityDesc:
      "You tend to prefer sweet and lovely fragrances, full of affinity that makes people want to get closer.",
    aquaticDesc:
      "You favor cool and rational fragrances, refreshing but not showy, with an innate sense of sophistication.",
    greenDesc:
      "You love natural and casual scents, close to life, making people feel comfortable and at ease.",
    orientalDesc:
      "You are drawn to mysterious and unique fragrances, with a strong presence and exotic charm.",
    woodyDesc:
      "You enjoy warm and reliable scents, steady and reassuring, providing a sense of security.",
    floralDesc:
      "You prefer gentle and romantic fragrances, delicate and moving, with feminine charm.",

    // 推荐文案
    citrusRec:
      "Recommended essential oils: lemon, grapefruit, bergamot, suitable for morning use to refresh. Try 'Morning Sunshine' or 'Citrus Love' formulas.",
    fruityRec:
      "Recommended fruit-based fragrances: peach, lychee, mango, suitable for daily use to increase affinity. Try 'Peach Girl' or 'Tropical Orchard' formulas.",
    aquaticRec:
      "Recommended fresh scents: ocean, rain, lotus, suitable for work environments to stay calm. Try 'After Rain Morning' or 'Deep Sea Mystery' formulas.",
    greenRec:
      "Recommended natural scents: grass, tea, mint, suitable for leisure time to relax. Try 'Forest Walk' or 'Tea Garden Morning' formulas.",
    orientalRec:
      "Recommended rich spices: amber, musk, cinnamon, suitable for evening parties or special occasions. Try 'Mysterious East' or 'Night Charm' formulas.",
    woodyRec:
      "Recommended warm woods: cedar, sandalwood, vetiver, suitable for autumn/winter seasons or occasions requiring stability. Try 'Winter Warm Wood' or 'Study Time' formulas.",
    floralRec:
      "Recommended flower-based fragrances: rose, jasmine, lily, suitable for dates or romantic occasions. Try 'Rose Garden' or 'White Bouquet' formulas.",
  },

  my: {
    // 语言选择页面
    chooseLanguage: "ဘာသာစကားရွေးချယ်ပါ",
    chinese: "တရုတ်",
    chineseDesc: "တရုတ်ဘာသာဖြင့် စမ်းသပ်ပါ",
    english: "အင်္ဂလိပ်",
    englishDesc: "အင်္ဂလိပ်ဘာသာဖြင့် စမ်းသပ်ပါ",
    burmese: "မြန်မာ",
    burmeseDesc: "မြန်မာဘာသာဖြင့် စမ်းသပ်ပါ",
    startTest: "စမ်းသပ်မှုစတင်ရန်",
    languageDisclaimer:
      "စမ်းသပ်မှုအတွင်း မည်သည့်အချိန်တွင်မဆို ဘာသာစကားပြောင်းနိုင်ပါသည်",

    // 欢迎页面
    findYourScent: "သင့်အတွက်သီးသန့်ရနံ့ကိုရှာဖွေပါ",
    welcomeText:
      "မေးခွန်း ၁၀ ခုဖြင့် သင်၏ရနံ့နှစ်သက်မှုကို ခွဲခြမ်းစိတ်ဖြာပေးပါသည်<br />သင်၏ရွေးချယ်မှုအချိုးအစားပေါ်မူတည်၍ သင့်တော်ဆုံးရနံ့အမျိုးအစားကို အကြံပြုပေးပါသည်",
    feature1: "ရနံ့အမျိုးအစားအချိုးအစားခွဲခြမ်းစိတ်ဖြာခြင်း",
    feature2: "အကြံပြုချက်များ",
    feature3: "သီးသန့်ရနံ့ပေါင်းစပ်အကြံပြုချက်များ",
    startButton: "စမ်းသပ်မှုစတင်ရန်",
    disclaimerText:
      "စမ်းသပ်မှုသည် ၃-၅ မိနစ်ခန့်ကြာပြီး ဒေတာအားလုံးကို ခွဲခြမ်းစိတ်ဖြာရန်သာအသုံးပြုပါသည်",
    switchToEnglish: "အင်္ဂလိပ်ဘာသာသို့ပြောင်းရန်",
    switchToChinese: "တရုတ်ဘာသာသို့ပြောင်းရန်",
    switchToBurmese: "မြန်မာဘာသာသို့ပြောင်းရန်",

    // 基本信息页面
    back: "ပြန်သွားရန်",
    basicInfo: "အခြေခံအချက်အလက်",
    continueQuiz: "ရှုမြင်ကွင်းစမ်းသပ်မှုဆက်လက်လုပ်ဆောင်ရန်",

    // 场景测试页面
    quizTitle: "ရှုမြင်ကွင်းစမ်းသပ်မှု",
    questionText: "မေးခွန်း",
    questionText2: "",
    scoreTitle: "လက်ရှိရနံ့ဖြန့်ဝေမှု",
    nextQuestion: "နောက်မေးခွန်း",
    submitQuiz: "ရလဒ်များကြည့်ရန်",

    // 结果页面
    resultTitle: "သင်၏ရနံ့ခွဲခြမ်းစိတ်ဖြာချက်အစီရင်ခံစာ",
    resultSubtitle: "သင်၏ရွေးချယ်မှု ၁၀ ခုပေါ်အခြေခံ၍ ထုတ်လုပ်ထားသည်",
    dominantTitle: "သင်၏အဓိကရနံ့",
    analysisTitle: "ရနံ့အမျိုးအစားအချိုးအစားခွဲခြမ်းစိတ်ဖြာခြင်း",
    recommendationTitle: "တစ်ဦးချင်းအကြံပြုချက်များ",
    suggestionTitle: "ရနံ့ပေါင်းစပ်အကြံပြုချက်များ",
    restartTest: "ပြန်လည်စမ်းသပ်ရန်",
    shareResult: "ရလဒ်များမျှဝေရန်",

    // 分享模态框
    shareModalTitle: "သင်၏ရနံ့ခွဲခြမ်းစိတ်ဖြာချက်ကိုမျှဝေပါ",
    copyLink: "လင့်ကိုကူးယူရန်",

    // 香调描述
    citrusDesc:
      "သင်သည် လန်းဆန်းပြီး စွမ်းအားပြည့်ဝသော ရနံ့များကို နှစ်သက်ပါသည်။ နေ့စဉ်လန်းဆန်းစေရန်၊ နေရောင်ခြည်၏စွမ်းအားပြည့်ဝမှုရှိသော ရနံ့များကို သဘောကျပါသည်။",
    fruityDesc:
      "သင်သည် ချိုမြိန်ပြီး ချစ်စရာကောင်းသော ရနံ့များကို ပိုမိုနှစ်သက်ပါသည်။ လူတွေကိုပိုမိုနီးစေလိုသော စွမ်းအားပြည့်ဝသော ရနံ့များဖြစ်ပါသည်။",
    aquaticDesc:
      "သင်သည် အေးမြပြီး ဆင်ခြင်တုံတရားရှိသော ရနံ့များကို နှစ်သက်ပါသည်။ လန်းဆန်းပြီး ချဲ့ကားမှုမရှိသော၊ မွန်မြတ်သောအရည်အသွေးရှိသော ရနံ့များဖြစ်ပါသည်။",
    greenDesc:
      "သင်သည် သဘာဝကျပြီး ပေါ့ပါးသော ရနံ့များကို နှစ်သက်ပါသည်။ ဘဝနှင့်နီးစပ်ပြီး လူတွေကို သက်တောင့်သက်သာခံစားရစေသော ရနံ့များဖြစ်ပါသည်။",
    orientalDesc:
      "သင်သည် လျှို့ဝှက်ဆန်းကြယ်ပြီး ထူးခြားသော ရနံ့များကို စွဲမက်ပါသည်။ အားကောင်းသောလူစွမ်းအားနှင့် ဆန်းကြယ်သောဆွဲဆောင်မှုရှိသော ရနံ့များဖြစ်ပါသည်။",
    woodyDesc:
      "သင်သည် နွေးထွေးပြီး ယုံကြည်စိတ်ချရသော ရနံ့များကို နှစ်သက်ပါသည်။ တည်ငြိမ်ပြီး စိတ်ချရမှုကို ပေးစွမ်းသော ရနံ့များဖြစ်ပါသည်။",
    floralDesc:
      "သင်သည် နူးညံ့ပြီး ချစ်ခြင်းမေတ္တာပြည့်ဝသော ရနံ့များကို နှစ်သက်ပါသည်။ သိမ်မွေ့ပြီး စွဲမက်ဖွယ်ကောင်းသော၊ အမျိုးသမီးဆန်သော ဆွဲဆောင်မှုရှိသော ရနံ့များဖြစ်ပါသည်။",

    // 推荐文案
    citrusRec:
      "အကြံပြုထားသော ချဉ်ချိုသစ်သီးရနံ့များ- သံပုရာသီး၊ ကျွဲကောသီး၊ လီမွန်သီး၊ မနက်ခင်းလန်းဆန်းစေရန် အသုံးပြုရန်သင့်တော်ပါသည်။ 'မနက်ခင်းနေရောင်ခြည်' သို့မဟုတ် 'သံပုရာချစ်ခြင်း' ဖော်မြူလာများကို စမ်းကြည့်ပါ။",
    fruityRec:
      "အကြံပြုထားသော သစ်သီးရနံ့များ- မက်မွန်သီး၊ လိုင်ချီးသီး၊ သရက်သီး၊ နေ့စဉ်အသုံးပြုရန် ဆွဲဆောင်မှုတိုးစေရန်သင့်တော်ပါသည်။ 'မက်မွန်မိန်းကလေး' သို့မဟုတ် 'အပူပိုင်းသစ်သီးဥယျာဉ်' ဖော်မြူလာများကို စမ်းကြည့်ပါ။",
    aquaticRec:
      "အကြံပြုထားသော ရေထုရနံ့များ- ပင်လယ်၊ မိုးရေ၊ ကြာပန်း၊ အလုပ်ပတ်ဝန်းကျင်တွင် အေးဆေးတည်ငြိမ်စွာနေထိုင်ရန် သင့်တော်ပါသည်။ 'မိုးရွာပြီးနောက်မနက်ခင်း' သို့မဟုတ် 'နက်ရှိုင်းသောပင်လယ်လျှို့ဝှက်ချက်' ဖော်မြူလာများကို စမ်းကြည့်ပါ။",
    greenRec:
      "အကြံပြုထားသော ရွက်စိမ်းရနံ့များ- မြက်ခင်း၊ လက်ဖက်၊ ပူစီနံ၊ အပန်းဖြေအချိန်များတွင် စိတ်ဖြေလျှော့ရန် သင့်တော်ပါသည်။ 'သစ်တောလမ်းလျှောက်ခြင်း' သို့မဟုတ် 'လက်ဖက်ခြံမနက်ခင်း' ဖော်မြူလာများကို စမ်းကြည့်ပါ။",
    orientalRec:
      "အကြံပြုထားသော အရှေ့တိုင်းရနံ့များ- ပယင်းရောင်၊ မတ်စ်အနံ့၊ သစ်ကြံ့ပိုးခေါက်၊ ညနေပွဲများသို့မဟုတ် အထူးအခမ်းအနားများအတွက် သင့်တော်ပါသည်။ 'လျှို့ဝှက်ဆန်းကြယ်သောအရှေ့ဖက်' သို့မဟုတ် 'ည၏ဆွဲဆောင်မှု' ဖော်မြူလာများကို စမ်းကြည့်ပါ။",
    woodyRec:
      "အကြံပြုထားသော သစ်မွှေးရနံ့များ- စီဒါသစ်၊ စန္ဒကူးသစ်၊ ဗက်တီဗာပင်၊ ဆောင်းရာသီများသို့မဟုတ် တည်ငြိမ်မှုပြသရန်လိုအပ်သောအခမ်းအနားများအတွက် သင့်တော်ပါသည်။ 'ဆောင်းရာသီနွေးထွေးသောသစ်သား' သို့မဟုတ် 'စာကြည့်ခန်းအချိန်' ဖော်မြူလာများကို စမ်းကြည့်ပါ။",
    floralRec:
      "အကြံပြုထားသော ပန်းရနံ့များ- နှင်းဆီ၊ စံပယ်ပန်း၊ လီလီပန်း၊ ချိန်းတွေ့ခြင်းသို့မဟုတ် ချစ်ခြင်းမေတ္တာပြည့်ဝသောအခမ်းအနားများအတွက် သင့်တော်ပါသည်။ 'နှင်းဆီဥယျာဉ်' သို့မဟုတ် 'အဖြူရောင်ပန်းစည်း' ဖော်�မြူလာများကို စမ်းကြည့်ပါ။",
  },
};

// 内嵌问题数据（中英缅三语）
const questions = {
  zh: [
    {
      id: "quiz1",
      text: "周末午后，你更想在以下哪种环境放松？",
      options: [
        {
          text: "露天咖啡馆，阳光洒在冰饮杯上",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "水果摊旁的长椅，闻着刚剥开的芒果香",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "海边的礁石上，吹着带水汽的冷风",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "公园的树荫下，踩着湿润的草地",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "老茶馆里，周围是檀香和香料的气息",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "复古书房，书架散发着旧木头的味道",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "闺蜜的花园，被玫瑰和茉莉环绕",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz2",
      text: '你更喜欢哪种气味带来的感官体验？',
      options: [
        { text: "酸中带甜的柑橘果皮香", category: "柑橘调", icon: "🍊" },
        {
          text: "软糯多汁的热带水果香",
          category: "果香调",
          icon: "🍑",
        },
        { text: "潮湿的岩石与水雾气息", category: "水生调", icon: "🌊" },
        { text: "鲜割的青草与树叶香", category: "绿叶调", icon: "🍃" },
        {
          text: "香草、琥珀与香料的复合浓韵",
          category: "东方调",
          icon: "🎭",
        },
        { text: "松针与檀香的干燥木质香", category: "木质调", icon: "🌲" },
        { text: "多种鲜花交织的馥郁花香", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz3",
      text: "别人对你的评价，哪句更符合你的期待？",
      options: [
        { text: '"你像小太阳，总能带动气氛"', category: "柑橘调", icon: "🍊" },
        { text: '"你很可爱，亲和力超强"', category: "果香调", icon: "🍑" },
        { text: '"你很冷静，做事很理性"', category: "水生调", icon: "🌊" },
        { text: '"你很随性，活得很自在"', category: "绿叶调", icon: "🍃" },
        { text: '"你很有气场，自带神秘感"', category: "东方调", icon: "🎭" },
        { text: '"你很可靠，让人觉得踏实"', category: "木质调", icon: "🌲" },
        { text: '"你很温柔，共情能力很强"', category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz4",
      text: '以下哪种"味道联想"让你更心动？',
      options: [
        { text: "气泡水、薄荷、青柠", category: "柑橘调", icon: "🍊" },
        { text: "蜜桃、荔枝、菠萝", category: "果香调", icon: "🍑" },
        { text: "浪花、海藻、冷雾", category: "水生调", icon: "🌊" },
        { text: "树叶、松针、青草", category: "绿叶调", icon: "🍃" },
        { text: "琥珀、麝香、肉桂", category: "东方调", icon: "🎭" },
        { text: "雪松、橡木、檀木", category: "木质调", icon: "🌲" },
        { text: "玫瑰、百合、铃兰", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz5",
      text: '参加聚会，你希望香水帮你"表达"什么？',
      options: [
        { text: "活力满满，轻松融入热闹", category: "柑橘调", icon: "🍊" },
        { text: "俏皮讨喜，让人忍不住靠近", category: "果香调", icon: "🍑" },
        { text: "保持分寸，享受安静独处", category: "水生调", icon: "🌊" },
        { text: "自在随性，不被束缚", category: "绿叶调", icon: "🍃" },
        { text: "独特出众，成为焦点", category: "东方调", icon: "🎭" },
        { text: "稳重成熟，让人信任", category: "木质调", icon: "🌲" },
        { text: "温柔迷人，传递浪漫感", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz6",
      text: '旅行时，你会更想把哪种"味道"装进行李箱？',
      options: [
        { text: "地中海的阳光柑橘香", category: "柑橘调", icon: "🍊" },
        { text: "热带海岛的甜芒果香", category: "果香调", icon: "🍑" },
        { text: "北欧峡湾的清冷海水香", category: "水生调", icon: "🌊" },
        { text: "新西兰草原的青草香", category: "绿叶调", icon: "🍃" },
        { text: "中东市集的浓郁香料香", category: "东方调", icon: "🎭" },
        { text: "西伯利亚森林的雪松木香", category: "木质调", icon: "🌲" },
        { text: "法国庄园的玫瑰花香", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz7",
      text: '面对"新香水"，你最先被哪种特质吸引？',
      options: [
        { text: "喷上就清醒，瞬间充满活力", category: "柑橘调", icon: "🍊" },
        { text: "甜得不腻人，闻着就开心", category: "果香调", icon: "🍑" },
        { text: "自带距离感，清冷不张扬", category: "水生调", icon: "🌊" },
        { text: "像走进自然，清爽无负担", category: "绿叶调", icon: "🍃" },
        { text: "越闻越有层次，充满神秘感", category: "东方调", icon: "🎭" },
        { text: "温暖又安心，像被拥抱", category: "木质调", icon: "🌲" },
        {
          text: "温柔又细腻，自带女人味/绅士感",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz8",
      text: '以下哪种"生活画面"，让你觉得"就该配这种香"？',
      options: [
        {
          text: "早上赶早八，需要一支香提神醒脑",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "和朋友逛甜品店，要搭甜甜的香",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "深夜加班，需要一支香冷静思考",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "周末爬山徒步，配一支自然的香",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "参加重要会议，要一支有气场的香",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "和长辈聊天，需要一支稳重的香",
          category: "木质调",
          icon: "🌲",
        },
        { text: "和恋人约会，要一支浪漫的香", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz9",
      text: '你更讨厌哪种"香调雷区"？',
      options: [
        { text: "完全不清爽，闷得人头晕", category: "柑橘调", icon: "🍊" },
        { text: "甜到发腻，像打翻糖罐", category: "果香调", icon: "🍑" },
        { text: "太暖太浓，没有呼吸感", category: "水生调", icon: "🌊" },
        { text: '太甜太腻，不够"接地气"', category: "绿叶调", icon: "🍃" },
        { text: "太淡太寡，毫无记忆点", category: "东方调", icon: "🎭" },
        { text: "太飘太轻，没有厚重感", category: "木质调", icon: "🌲" },
        { text: "太冲太烈，缺乏温柔感", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz10",
      text: '选一支"四季都能用的香"，你更看重它的？',
      options: [
        { text: "四季都清爽，不挑季节的活力", category: "柑橘调", icon: "🍊" },
        { text: "四季都讨喜，甜得刚刚好", category: "果香调", icon: "🍑" },
        { text: "四季都冷静，不热不燥", category: "水生调", icon: "🌊" },
        { text: "四季都自然，贴近生活", category: "绿叶调", icon: "🍃" },
        { text: "四季都独特，不随大流", category: "东方调", icon: "🎭" },
        { text: "四季都踏实，温暖稳定", category: "木质调", icon: "🌲" },
        { text: "四季都温柔，适配所有场合", category: "花香调", icon: "🌹" },
      ],
    },
  ],

  en: [
    {
      id: "quiz1",
      text: "Which of the following environments do you prefer to relax in on weekend afternoons?",
      options: [
        {
          text: "Outdoor café, sunlight shining on ice cream cups.",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "The bench next to the fruit stall smelled the fragrance of freshly peeled mangoes.",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "On the rocks by the seaside, there is a cold wind blowing with water vapor.",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "Under the shade of trees in the park, stepping on the moist grass.",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "In the old tea house, the surroundings are filled with the scent of sandalwood and spices.",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "Vintage study, bookshelves emit the scent of old wood.",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "My best friend's garden, surrounded by roses and jasmine.",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz2",
      text: 'Which scent do you prefer for the sensory experience?',
      options: [
        {
          text: "Sour and sweet citrus peel aroma.",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "Soft waxy and juicy tropical fruit flavor.",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "Moist rocks and water mist scent.",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "Fresh cut green grass and fragrant leaves .",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "The complex and rich aroma of vanilla, amber, and spices.",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "Dry woody fragrance of pine needles and sandalwood.",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "A rich floral fragrance interwoven with various flowers .",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz3",
      text: "Which sentence better meets your expectations when others evaluate you?",
      options: [
        {
          text: "You're like a little sun, always able to create an atmosphere.",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "You are very cute and have a strong affinity.",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "You are very calm and rational in your actions.",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "You are very casual and live comfortably.",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "You have a strong aura and a sense of mystery.",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "You are very reliable and make people feel at ease.",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "You are very gentle and have strong empathy.",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz4",
      text: 'Which of the following "Flavor associations fragrance group" makes you more tempted?',
      options: [
        {
          text: "Sparkling water, mint, lime.",
          category: "柑橘调",
          icon: "🍊",
        },
        { text: "Peach, lychee, pineapple.", category: "果香调", icon: "🍑" },
        { text: "Waves, seaweed, cold mist.", category: "水生调", icon: "🌊" },
        {
          text: "Leaves, pine needles, green grass.",
          category: "绿叶调",
          icon: "🍃",
        },
        { text: "Amber, musk, cinnamon.", category: "东方调", icon: "🎭" },
        { text: "Cedar, oak, sandalwood.", category: "木质调", icon: "🌲" },
        {
          text: "Roses, lilies, lilies of the valley.",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz5",
      text: 'What kind of perfume you want to help you express at a party?',
      options: [
        {
          text: "Full of vitality, easily blending into the hustle and bustle.",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "Playful and likable, making people unable to resist approaching.",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "Maintain moderation and enjoy quiet solitude.",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "Free and unrestrained, not bound by constraints.",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "Unique and outstanding, becoming the focus.",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "Steady and mature, trustworthy.",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "Gentle and charming, conveying a sense of romance.",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz6",
      text: 'When traveling, which "flavor" would you prefer to pack in your suitcase?',
      options: [
        {
          text: "The sunshine citrus fragrance of the Mediterranean.",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "Sweet mango fragrance of tropical islands.",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "The refreshing aroma of cold seawater in the Nordic fjords.",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "The fragrance of green grass on the grasslands of New Zealand.",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "The rich aroma of spices in Middle Eastern markets.",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "Cedar wood fragrance in Siberian forests.",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "The rose fragrance of French estates.",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz7",
      text: 'When you face the "new perfume", which trait attracted you first?',
      options: [
        {
          text: "Spray it and wake up, instantly full of vitality.",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "Sweet enough not to be cloying, it makes you happy to smell it.",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "Comes with a sense of distance, cool and understated.",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "Like stepping into nature, refreshing and burden free.",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "The more you smell, the more layered and mysterious it becomes.",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "Warm and reassuring, like being embraced.",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "Gentle and delicate, with a feminine/gentlemanly touch.",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz8",
      text: 'Which of the following "life scenes" make you feel that "this fragrance should be matched"?',
      options: [
        {
          text: "I need a fragrance to refresh myself and wake up my mind in the morning.",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "Strolling through a dessert shop with friends, you should pair it with a sweet fragrance.",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "Working late at night requires a fragrant incense to calm down and think.",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "Climbing and hiking on weekends, accompanied by a natural fragrance.",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "To attend important meetings, one should have a powerful fragrance.",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "Chatting with elders requires a steady fragrance.",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "Dating with a lover, wanting a romantic fragrance.",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz9",
      text: 'What kind of "fragrance minefield" do you dislike more?',
      options: [
        {
          text: "Completely not refreshing, suffocating, and making people dizzy.",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "Sweet to cloying, like knocking over a candy can.",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "Too warm, too thick, no breathing sensation.",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "Too sweet and greasy, not down-to-earth enough.",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "Too light and too few, with no memory points.",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "Too floating and too light, without a sense of heaviness.",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "Too strong and lacking in tenderness.",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz10",
      text: "Choose a fragrance that can be used throughout the four seasons, which one do you value more?",
      options: [
        {
          text: "Refreshing all year round, without choosing the vitality of the season.",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "All seasons are delightful, just right sweet.",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "Stay calm all year round, neither hot nor dry.",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "All seasons are natural, close to life.",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "Each season is unique, not following the crowd.",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "Four seasons are steady, warm and stable.",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "Gentle all year round, suitable for all occasions.",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
  ],

  my: [
    {
      id: "quiz1",
      text: "ပိတ်ရက် နေ့လည်တွေမှာ အောက်ပါနေရာတွေထဲက ဘယ်လိုနေရာမှာ သင် အပန်းဖြေ အနားယူချင် ပါသလဲ။",
      options: [
        {
          text: "ကော်ဖီဆိုင် အပြင်ဘက်။ (ရေခဲမုန့်ခွက်လေးပေါ် နေရောင်ဖြာကျနေတဲ့ နေရာ)။",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "လတ်လတ်ဆတ်ဆတ် အခွံခွါထားတဲ့ သရက်သီး အနံ့လေးမွှေးနေတဲ့ အသီးဆိုင် အပြင်ဘက်က ခုံတန်းနေရာ။",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "ပင်လယ်ရေငွေ့ ပါတဲ့ လေတဖြူးဖြူး တိုက်ခတ်နေတဲ့ ပင်လယ်ကမ်းစပ်ဘေး ကျောက်တုံးတွေ အနားက နေရာ။",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "ပန်းခြံထဲက သစ်ပင် အရိပ်အောက်။ (မြက်ခင်းအေးအေးပေါ် နင်းလျှောက်လို့ရတဲ့ နေရာ။)",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "ခေတ်ဟောင်း လက်ဖက်ရည်ဆိုင်။ (စန္ဒကူးနံ့နဲ့ ဟင်းခတ် အမွှေးအကြိုင်အနံ့တွေပြည့်နေတဲ့ နေရာ)။",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "ရှေးခေတ်ပုံစံ စာကြည့်တိုက်။ (သစ်သားအနံ့ မွှေးနေတဲ့ စာအုပ်စင်တွေ ရှိတဲ့နေရာ)။",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "သူငယ်ချင်းကောင်း ပန်းခြံ။ (နှင်းဆီ၊စံပယ်ပန်းအနံ့ ဝင်းရံနေတဲ့နေရာ)",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz2",
      text: "အာရုံတွင် ခံစားသိရှိမှု အတွက် အောက်ပါ ​မည်သည့်ရနံ့ကို သင် ပိုမို သဘောကျပါသလဲ။",
      options: [
        {
          text: "ချဥ်ချို သစ်သီးများ၏ အခွံရနံ့။",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "နူးညံ့ချောမွေ့ကာ အရည်ရွှမ်းသော သစ်သီး အရသာ ရနံ့။",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "စိုစွတ်သော ကျောက်တုံးများနှင့် မြူနှင်းတို့၏ ရနံ့။",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "လတ်ဆတ် လန်းဆန်းသော မြက်ခင်းရနံ့နှင့် ရွက်သစ်နုများ ရနံ့။",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "ရနံ့ကြိုင်လှိုင် မွှေးပျံ့သော ဗနီလာ၊ ကတိုးနံ့နှင့် ဟင်းခတ်အမွှေးကြိုင်များ၏ ရနံ့။",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "ထင်းရှူးပင်နှင့် စန္ဒကူးပင်တို့၏ သစ်မွှေးရနံ့။",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "ပန်းပေါင်းစုံတို့၏ ကြိုင်လှိုင် သင်းပျံ့သော ပန်းရနံ့။",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz3",
      text: "အခြားသူတွေ သင့်ကို ဘယ်လို လူအဖြစ် မှတ်ချက်ပေးတတ် ကြပါသလဲ။",
      options: [
        {
          text: "သင်ဟာ နေမင်းကြီး တစ်စင်းလို တောက်ပပြီး ပတ်ဝန်းကျင်ကို လင်းလက်စေသူ။",
          category: "柑橘调",
          icon: "🍊",
        },
        {
          text: "ချစ်ခင်မြတ်နိုးစရာ အပြည့်နဲ့ ချစ်စရာကောင်းတဲ့သူ။",
          category: "果香调",
          icon: "🍑",
        },
        {
          text: "တည်ငြိမ်ပြီး ကျိုးကြောင်းဆင်ခြင် နိုင်စွမ်း အပြည့်ရှိသူ။",
          category: "水生调",
          icon: "🌊",
        },
        {
          text: "ပေါ့ပါး သွက်လက်ပြီး သက်သောင့်သက်သာ နေထိုင်သူ။",
          category: "绿叶调",
          icon: "🍃",
        },
        {
          text: "စူးရှတဲ့ အရှိန်အဝါနဲ့ ပဟေဠိဆန်ဆန် ထက်မြက်သူ။",
          category: "东方调",
          icon: "🎭",
        },
        {
          text: "အားကိုး ယုံကြည်လို့ ရပြီး လူတွေကို စိတ်အေးလက်အေး ဖြစ်စေသူ။",
          category: "木质调",
          icon: "🌲",
        },
        {
          text: "နူးညံ့ သိမ်မွေ့ပြီး စာနာစိတ် အပြည့်ရှိသူ။",
          category: "花香调",
          icon: "🌹",
        },
      ],
    },
    {
      id: "quiz4",
      text: "သင့်ကို အောက်ပါ တွဲစပ်မှုက ပိုပြီး စွဲဆောင်နေပါသလဲ။",
      options: [
        { text: "စပါကလင်ရေ၊ ပူစီနံနဲ့ သံပရာသီး။", category: "柑橘调", icon: "🍊" },
        { text: "မက်မွန်သီး၊ လိုင်ချီးသီးနဲ့ နာနတ်သီး။", category: "果香调", icon: "🍑" },
        { text: "ပင်လယ်လှိုင်း၊ ပင်လယ်ရေညှိနဲ့ အေးမြတဲ့ မြူခိုး။", category: "水生调", icon: "🌊" },
        { text: "သစ်ရွက်တွေ၊ ထင်းရှူးပင်နဲ့ မြက်ခင်းစိမ်း။", category: "绿叶调", icon: "🍃" },
        { text: "နွေးထွေးတဲ့ ရွှေဝါရောင်အငွေ့၊ ကတိုးနံ့နဲ့ သစ်ကြံ့ပိုးခေါက်။", category: "东方调", icon: "🎭" },
        { text: "သစ်ကတိုး(တောင်တမာ)၊ ဝက်သစ်ချပင်နဲ့ စန္ဒကူးသစ်ပင်။", category: "木质调", icon: "🌲" },
        { text: "နှင်းဆီ၊ လီလီပန်းနဲ့ နှင်းပန်း။", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz5",
      text: "ပါတီပွဲ တခုမှာ သင့်အသွင်ကို ဘယ်လို ရေမွှေး ရနံ့မျိုးနဲ့ ဖော်ပြချင်ပါသလဲ။",
      options: [
        { text: "တက်ကြွပြီး ဆူညံတဲ့ ပတ်ဝန်းကျင်မှာ အလွယ်တကူ ရောနှောနိုင်တဲ့ အသွင်။", category: "柑橘调", icon: "🍊" },
        { text: "ပျော်ပျော် နေတတ်ပြီး လူချစ်လူခင်ပေါတဲ့ လူတွေအနားကပ်ချင်တဲ့ သူမျိုးအသွင်။", category: "果香调", icon: "🍑" },
        { text: "တစ်ဦးတည်း သီးသန့် အေးအေးဆေးဆေး နေတတ်တဲ့ အသွင်။", category: "水生调", icon: "🌊" },
        { text: "လွတ်လပ်ပြီး အထိန်းအကွပ်မရှိတဲ့ အသွင်။", category: "绿叶调", icon: "🍃" },
        { text: "ထူးခြား ထင်ပေါ်ပြီး လူအများကြား အာရုံစိုက်ခံရတဲ့ အသွင်။", category: "东方调", icon: "🎭" },
        { text: "တည်ငြိမ် ရင့်ကျက်ပြီး ယုံကြည်လို့ရသူ အသွင်။", category: "木质调", icon: "🌲" },
        { text: "ဆွဲဆောင်မှုရှိရှိ နူးညံ့ပြီး ချစ်မြတ်နိုးဖွယ်ရာ အသွင်။", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz6",
      text: "သင်ခရီးထွက်တဲ့အချိန် ခရီးဆောင်အိတ်ထဲမှာ ဘယ်လိုရနံ့မျိုးကို သယ်ဆောင်သွားချင်ပါသလဲ။",
      options: [
        { text: "မြေထဲပင်လယ် ဒေသရဲ့ စူးရှတဲ့ ရှောက်ချိုပင် ရနံ့။", category: "柑橘调", icon: "🍊" },
        { text: "အပူပိုင်း ကျွန်းစုတွေရဲ့ ချိုမြိန်တဲ့ သရက်သီး ရနံ့။", category: "果香调", icon: "🍑" },
        { text: "ဥရောပဒေသတွေရဲ့ လန်းဆန်း သန့်စင်တဲ့ ပင်လယ်ရေရနံ့။", category: "水生调", icon: "🌊" },
        { text: "နယူးဇီလန် နိုင်ငံရဲ့ မြက်ခင်းစိမ်းရနံ့။", category: "绿叶调", icon: "🍃" },
        { text: "အရှေ့အလယ်ပိုင်း ဒေသရဲ့ မွှေးပျံ့တဲ့ ဟင်းခတ်အမွှေးအကြိုင်တွေ ရနံ့။", category: "东方调", icon: "🎭" },
        { text: "ဆိုက်ဘေးရီးယား သစ်တောတွေထဲက သစ်ကတိုး တောင်တမာပင် ရနံ့။", category: "木质调", icon: "🌲" },
        { text: "ပြင်သစ် နိုင်ငံရဲ့ နှင်းဆီပန်း ရနံ့။", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz7",
      text: "ရေမွှေးအသစ် ရွေးချယ်ရာမှာ ဘယ်လိုအရာက သင့်ကို အရင်ဆုံး ဆွဲဆောင်နိုင်ပါသလဲ။",
      options: [
        { text: "ပထမဆုံး ဖြန်းလိုက်တာနဲ့ လန်းဆန်းပြီး စိတ်ကို သက်ဝင်လှုပ်ရှားစေတဲ့ ရနံ့", category: "柑橘调", icon: "🍊" },
        { text: "ချိုမြိန်ပေမယ့် မအီနေဘဲ အနံ့ရတာနဲ့ စိတ်ကိုပျော်သွား စေတဲ့ ရနံ့။", category: "果香调", icon: "🍑" },
        { text: "အေးစက်ပြီး တည်ကြည်တဲ့ အပြင် ချဉ်းကပ်ရခက်စေမယ့် အသွင်မျိုးနဲ့ ရနံ့။", category: "水生调", icon: "🌊" },
        { text: "စိတ်လွတ်ကိုယ်လွတ် သဘာဝ မြက်ခင်းစိမ်းပေါ် နင်းလျှောက်နေရသလို ရနံ့။", category: "绿叶调", icon: "🍃" },
        { text: "ပိုပြီး ထိတွေ့လေ ပဟေဠိဆန်လေ ဖြစ်စေတဲ့ ရနံ့။", category: "东方调", icon: "🎭" },
        { text: "ပွေ့ဖက်ခံထား ရသလို နွေးထွေးပြီး စိတ်လုံခြုံစေတဲ့ ရနံ့။", category: "木质调", icon: "🌲" },
        { text: "နူးညံ့ သိမ်မွေ့ပြီး လူကြီးလူကောင်း ဆန်တဲ့ ရနံ့။", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz8",
      text: "အောက်ပါ ဘဝဖြတ်သန်းပုံ မြင်ကွင်းများထဲတွင် မည်သည့် ရနံ့နှင့် သင်လိုက်ဖက်ညီသည်ဟု ခံစားရပါသလဲ။",
      options: [
        { text: "မနက်ခင်းမှာ စိတ်ကြည်လင်စေပြီး စိတ်ကို နိုးကြားစေမယ့် ရနံ့။", category: "柑橘调", icon: "🍊" },
        { text: "သူငယ်ချင်းတွေနဲ့ အတူ ကိတ်မုန့်ဆိုင်မှာ သွားလည်နေသလို ချိုမြိန်တဲ့ ရနံ့။", category: "果香调", icon: "🍑" },
        { text: "ညနက်တဲ့ထိ အလုပ်လုပ်ရတဲ့ အတွက် စိတ်တည်ငြိမ်ပြီး အတွေးရှင်းစေတဲ့ ရနံ့။", category: "水生调", icon: "🌊" },
        { text: "ပိတ်ရက်တွေမှာ တောင်တက်တဲ့ အချိန် ရတဲ့ သဘာဝ ရနံ့။", category: "绿叶调", icon: "🍃" },
        { text: "အရေးကြီး အစည်းအဝေးပွဲများ တက်ရန် အားကောင်းတဲ့ ရနံ့။", category: "东方调", icon: "🎭" },
        { text: "လူကြီးသူမများနှင့် စကားပြောချိန်တွင် တည်ငြိမ်သော အသွင်ကို ဆောင်စေသော ရနံ့။", category: "木质调", icon: "🌲" },
        { text: "ချစ်သူနှင့် Dateချိန်တွင် နွေးထွေးချိုမြိန်သော ရနံ့။", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz9",
      text: "မည်သည့် ရနံ့ပုံစံကို သင် မနှစ်သက်ပါသလဲ။",
      options: [
        { text: "မွန်းကြပ်ပြီး ခေါင်းမူးစေတဲ့ လန်းဆန်းမှုမရှိတဲ့ ရနံ့။", category: "柑橘调", icon: "🍊" },
        { text: "သကြားလုံး တိုင်ကီကြီးထဲ နစ်နေသလို ချိုအီတဲ့ ရနံ့။", category: "果香调", icon: "🍑" },
        { text: "ပူနွေး အီဆိမ့်ပြီး အသက်ရှူလို့မကောင်းတဲ့ ရနံ့။", category: "水生调", icon: "🌊" },
        { text: "ချိုအီလွန်းပြီး လက်တွေ့မကျတဲ့ ရနံ့။", category: "绿叶调", icon: "🍃" },
        { text: "အမှတ်ရစရာ မရှိလောက်အောင် ပေါ့ပါးလွန်းတဲ့ ရနံ့။", category: "东方调", icon: "🎭" },
        { text: "လေးနက် တည်ကြည်မှု မရှိဘဲ တိမ်လို လေလို လွင့်မျောနေတဲ့ ရနံ့။", category: "木质调", icon: "🌲" },
        { text: "နူးညံ့မှု မရှိဘဲ စူးရှ ပြင်းထန်လွန်းသော ရနံ့။", category: "花香调", icon: "🌹" },
      ],
    },
    {
      id: "quiz10",
      text: "တနှစ်ပတ်လုံး အသုံးပြုနိုင်မည့် ရနံ့ကို ရွေးချယ်ရာတွင် မည်သည့် ရနံ့ကို သင်ပိုမို တန်ဖိုးထားပါသလဲ။",
      options: [
        { text: "တနှစ်ပတ်လုံး အသုံးပြုဖို့ ကိုက်ညီပြီး ရာသီမရွေး စိတ်လန်းဆန်းစေသော ရနံ့။", category: "柑橘调", icon: "🍊" },
        { text: "သင့်လျော်တဲ့ ချိုမြိန်မှုနဲ့ တနှစ်ပတ်လုံး စိတ်ပျော်ရွှင်စေတဲ့ ရနံ့။", category: "果香调", icon: "🍑" },
        { text: "မပူလွန်း မအေးလွန်းဘဲ တနှစ်ပတ်လုံး တည်ငြိမ်စေတဲ့ ရနံ့။", category: "水生调", icon: "🌊" },
        { text: "လက်တွေ့ဘဝနဲ့ နီးစပ်ပြီး ရာသီမရွေး သဘာဝ ကျကျ ကိုက်ညီတဲ့ ရနံ့။", category: "绿叶调", icon: "🍃" },
        { text: "ရာသီဥတု တခုစီ အတွက် ထူးခြားမှု ရှိပြီး အများနဲ့ မတူညီတဲ့ ရနံ့။", category: "东方调", icon: "🎭" },
        { text: "နွေးထွေး တည်ငြိမ်ပြီး ဥတု သုံးပါးလုံး သုံးနိုင်မယ့် ရနံ့။", category: "木质调", icon: "🌲" },
        { text: "ပွဲတော်တိုင်းအတွက် သင့်လျော်စေမယ့် နူးညံ့ ညင်သာတဲ့ ရနံ့။", category: "花香调", icon: "🌹" },
      ],
    },
  ],
};

// 香调信息（多语言）
const categories = {
  柑橘调: {
    name: {
      zh: "柑橘调",
      en: "Citrus",
      my: "ချဉ်ချို သစ်သီးရနံ့"
    },
    icon: "🍊",
    color: "#FFA726",
    description: {
      zh: "清新活力，适合日常提神",
      en: "Fresh and vibrant, suitable for daily refreshment",
      my: "လန်းဆန်းပြီး စွမ်းအားပြည့်ဝ၊ နေ့စဉ်လန်းဆန်းစေရန်သင့်တော်",
    },
    personality: { zh: "阳光活力型", en: "Sunshine Energy Type", my: "နေရောင်ခြည်စွမ်းအားပြည့်ဝအမျိုးအစား" },
    detailedDesc: {
      zh: "你喜欢清新活力的感觉，适合日常提神醒脑，充满阳光气息。",
      en: "You enjoy fresh and vibrant scents, suitable for daily refreshment, full of sunshine energy.",
      my: "သင်သည် လန်းဆန်းပြီး စွမ်းအားပြည့်ဝသော ရနံ့များကို နှစ်သက်ပါသည်။ နေ့စဉ်လန်းဆန်းစေရန်၊ နေရောင်ခြည်၏စွမ်းအားပြည့်ဝမှုရှိသော ရနံ့များကို သဘောကျပါသည်။",
    },
    recommendedScents: {
      zh: ["柠檬", "柚子", "佛手柑", "橙", "葡萄柚"],
      en: ["Lemon", "Pomelo", "Bergamot", "Orange", "Grapefruit"],
      my: ["သံပုရာသီး", "ကျွဲကောသီး", "လီမွန်သီး", "လိမ္မော်သီး", "ဆန်းခစ်သီး"],
    },
    bestFor: {
      zh: ["早晨", "运动", "工作日", "夏季"],
      en: ["Morning", "Exercise", "Weekdays", "Summer"],
      my: ["မနက်ခင်း", "လေ့ကျင့်ခန်း", "အလုပ်ရက်များ", "နွေရာသီ"],
    },
  },
  果香调: {
    name: {
      zh: "果香调",
      en: "Fruity",
      my: "သစ်သီးရနံ့"
    },
    icon: "🍑",
    color: "#FF4081",
    description: {
      zh: "甜美可人，充满亲和力",
      en: "Sweet and lovely, full of affinity",
      my: "ချိုမြိန်ပြီး ချစ်စရာကောင်း၊ ဆွဲဆောင်မှုပြည့်ဝ",
    },
    personality: { zh: "甜美亲和型", en: "Sweet Affinity Type", my: "ချိုမြိန်ဆွဲဆောင်မှုအမျိုးအစား" },
    detailedDesc: {
      zh: "你倾向于甜美可人的香气，充满亲和力，让人忍不住想靠近。",
      en: "You tend to prefer sweet and lovely fragrances, full of affinity that makes people want to get closer.",
      my: "သင်သည် ချိုမြိန်ပြီး ချစ်စရာကောင်းသော ရနံ့များကို ပိုမိုနှစ်သက်ပါသည်။ လူတွေကိုပိုမိုနီးစေလိုသော စွမ်းအားပြည့်ဝသော ရနံ့များဖြစ်ပါသည်။",
    },
    recommendedScents: {
      zh: ["桃子", "苹果", "莓果", "荔枝", "芒果"],
      en: ["Peach", "Apple", "Berries", "Lychee", "Mango"],
      my: ["မက်မွန်သီး", "ပန်းသီး", "ဘယ်ရီသီးများ", "လိုင်ချီးသီး", "သရက်သီး"],
    },
    bestFor: {
      zh: ["约会", "聚会", "日常外出", "春季"],
      en: ["Date", "Party", "Daily Outing", "Spring"],
      my: ["ချိန်းတွေ့ခြင်း", "ပါတီပွဲ", "နေ့စဉ်အပြင်ထွက်ခြင်း", "နွေဦးရာသီ"],
    },
  },
  水生调: {
    name: {
      zh: "水生调",
      en: "Aquatic",
      my: "ရေထုရနံ့"
    },
    icon: "🌊",
    color: "#29B6F6",
    description: {
      zh: "冷静理性，清爽不张扬",
      en: "Calm and rational, refreshing but not showy",
      my: "အေးဆေးတည်ငြိမ်၊ လန်းဆန်းပြီး ချဲ့ကားမှုမရှိ",
    },
    personality: { zh: "冷静理性型", en: "Calm Rational Type", my: "အေးဆေးတည်ငြိမ်အမျိုးအစား" },
    detailedDesc: {
      zh: "你偏爱冷静理性的香调，清爽不张扬，自带高级感。",
      en: "You favor cool and rational fragrances, refreshing but not showy, with an innate sense of sophistication.",
      my: "သင်သည် အေးမြပြီး ဆင်ခြင်တုံတရားရှိသော ရနံ့များကို နှစ်သက်ပါသည်။ လန်းဆန်းပြီး ချဲ့ကားမှုမရှိသော၊ မွန်မြတ်သောအရည်အသွေးရှိသော ရနံ့များဖြစ်ပါသည်။",
    },
    recommendedScents: {
      zh: ["海洋", "雨水", "莲花", "西瓜酮", "醛香"],
      en: ["Ocean", "Rain", "Lotus", "Calone", "Aldehydes"],
      my: ["ပင်လယ်", "မိုးရေ", "ကြာပန်း", "ကယ်လုံး", "အယ်လ်ဒီဟိုက်ဒ်"],
    },
    bestFor: {
      zh: ["工作", "会议", "学习", "夏季"],
      en: ["Work", "Meeting", "Study", "Summer"],
      my: ["အလုပ်", "အစည်းအဝေး", "စာသင်ခြင်း", "နွေရာသီ"],
    },
  },
  绿叶调: {
    name: {
      zh: "绿叶调",
      en: "Green",
      my: "ရွက်စိမ်းရနံ့"
    },
    icon: "🍃",
    color: "#66BB6A",
    description: {
      zh: "自然随性，贴近生活",
      en: "Natural and casual, close to life",
      my: "သဘာဝကျပြီး ပေါ့ပါး၊ ဘဝနှင့်နီးစပ်",
    },
    personality: { zh: "自然随性型", en: "Natural Casual Type", my: "သဘာဝကျပေါ့ပါးအမျိုးအစား" },
    detailedDesc: {
      zh: "你热爱自然随性的香气，贴近生活，让人感觉舒适自在。",
      en: "You love natural and casual scents, close to life, making people feel comfortable and at ease.",
      my: "သင်သည် သဘာဝကျပြီး ပေါ့ပါးသော ရနံ့များကို နှစ်သက်ပါသည်။ ဘဝနှင့်နီးစပ်ပြီး လူတွေကို သက်တောင့်သက်သာခံစားရစေသော ရနံ့များဖြစ်ပါသည်။",
    },
    recommendedScents: {
      zh: ["青草", "茶叶", "薄荷", "罗勒", "无花果叶"],
      en: ["Grass", "Tea", "Mint", "Basil", "Fig Leaf"],
      my: ["မြက်ခင်း", "လက်ဖက်", "ပူစီနံ", "ပင်စိမ်း", "သဖန်းရွက်"],
    },
    bestFor: {
      zh: ["休闲", "旅行", "户外活动", "春夏"],
      en: ["Leisure", "Travel", "Outdoor Activities", "Spring/Summer"],
      my: ["အပန်းဖြေခြင်း", "ခရီးသွားခြင်း", "အပြင်ထွက်လှုပ်ရှားမှုများ", "နွေဦး/နွေရာသီ"],
    },
  },
  东方调: {
    name: {
      zh: "东方调",
      en: "Oriental",
      my: "အရှေ့တိုင်းရနံ့"
    },
    icon: "🎭",
    color: "#AB47BC",
    description: {
      zh: "神秘独特，气场强大",
      en: "Mysterious and unique, strong presence",
      my: "လျှို့ဝှက်ဆန်းကြယ်၊ အားကောင်းသောလူစွမ်းအား",
    },
    personality: { zh: "神秘气场型", en: "Mysterious Presence Type", my: "လျှို့ဝှက်ဆန်းကြယ်အမျိုးအစား" },
    detailedDesc: {
      zh: "你钟情神秘独特的香调，气场强大，充满异域风情。",
      en: "You are drawn to mysterious and unique fragrances, with a strong presence and exotic charm.",
      my: "သင်သည် လျှို့ဝှက်ဆန်းကြယ်ပြီး ထူးခြားသော ရနံ့များကို စွဲမက်ပါသည်။ အားကောင်းသောလူစွမ်းအားနှင့် ဆန်းကြယ်သောဆွဲဆောင်မှုရှိသော ရနံ့များဖြစ်ပါသည်။",
    },
    recommendedScents: {
      zh: ["琥珀", "麝香", "香草", "肉桂", "乳香"],
      en: ["Amber", "Musk", "Vanilla", "Cinnamon", "Frankincense"],
      my: ["ပယင်းရောင်", "မတ်စ်အနံ့", "ဗနီလာ", "သစ်ကြံ့ပိုးခေါက်", "သစ်ကြံ့ပိုးစေးနံ့"],
    },
    bestFor: {
      zh: ["晚宴", "特殊场合", "冬季", "夜间"],
      en: ["Dinner Party", "Special Occasions", "Winter", "Night"],
      my: ["ညနေပွဲ", "အထူးအခမ်းအနားများ", "ဆောင်းရာသီ", "ညအချိန်"],
    },
  },
  木质调: {
    name: {
      zh: "木质调",
      en: "Woody",
      my: "သစ်မွှေးရနံ့"
    },
    icon: "🌲",
    color: "#8D6E63",
    description: {
      zh: "温暖可靠，踏实稳重",
      en: "Warm and reliable, steady and reassuring",
      my: "နွေးထွေးပြီး ယုံကြည်စိတ်ချရ၊ တည်ငြိမ်စိတ်ချရ",
    },
    personality: { zh: "温暖可靠型", en: "Warm Reliable Type", my: "နွေးထွေးယုံကြည်ရအမျိုးအစား" },
    detailedDesc: {
      zh: "你喜欢温暖可靠的气息，踏实稳重，给人安全感。",
      en: "You enjoy warm and reliable scents, steady and reassuring, providing a sense of security.",
      my: "သင်သည် နွေးထွေးပြီး ယုံကြည်စိတ်ချရသော ရနံ့များကို နှစ်သက်ပါသည်။ တည်ငြိမ်ပြီး စိတ်ချရမှုကို ပေးစွမ်းသော ရနံ့များဖြစ်ပါသည်။",
    },
    recommendedScents: {
      zh: ["雪松", "檀香", "香根草", "广藿香", "橡木"],
      en: ["Cedar", "Sandalwood", "Vetiver", "Patchouli", "Oak"],
      my: ["စီဒါသစ်", "စန္ဒကူးသစ်", "ဗက်တီဗာပင်", "ပက်ချူလီ", "သစ်သားချောင်း"],
    },
    bestFor: {
      zh: ["秋冬", "正式场合", "商务", "室内"],
      en: ["Autumn/Winter", "Formal Occasions", "Business", "Indoor"],
      my: ["ဆောင်းဦး/ဆောင်းရာသီ", "တရားဝင်အခမ်းအနားများ", "စီးပွားရေး", "အိမ်တွင်းပိုင်း"],
    },
  },
  花香调: {
    name: {
      zh: "花香调",
      en: "Floral",
      my: "ပန်းရနံ့"
    },
    icon: "🌹",
    color: "#EC407A",
    description: {
      zh: "温柔浪漫，细腻动人",
      en: "Gentle and romantic, delicate and moving",
      my: "နူးညံ့ပြီး ချစ်ခြင်းမေတ္တာပြည့်ဝ၊ သိမ်မွေ့ပြီး စွဲမက်ဖွယ်",
    },
    personality: { zh: "温柔浪漫型", en: "Gentle Romantic Type", my: "နူးညံ့ချစ်ခြင်းမေတ္တာပြည့်ဝအမျိုးအစား" },
    detailedDesc: {
      zh: "你偏好温柔浪漫的香气，细腻动人，富有女性魅力。",
      en: "You prefer gentle and romantic fragrances, delicate and moving, with feminine charm.",
      my: "သင်သည် နူးညံ့ပြီး ချစ်ခြင်းမေတ္တာပြည့်ဝသော ရနံ့များကို နှစ်သက်ပါသည်။ သိမ်မွေ့ပြီး စွဲမက်ဖွယ်ကောင်းသော၊ အမျိုးသမီးဆန်သော ဆွဲဆောင်မှုရှိသော ရနံ့များဖြစ်ပါသည်။",
    },
    recommendedScents: {
      zh: ["玫瑰", "茉莉", "百合", "铃兰", "紫罗兰"],
      en: ["Rose", "Jasmine", "Lily", "Lily of the Valley", "Violet"],
      my: ["နှင်းဆီ", "စံပယ်ပန်း", "လီလီပန်း", "တောင်ဇလပ်ပန်း", "ဗိုင်ယိုလက်ပန်း"],
    },
    bestFor: {
      zh: ["约会", "浪漫场合", "春季", "女性场合"],
      en: ["Date", "Romantic Occasions", "Spring", "Feminine Occasions"],
      my: ["ချိန်းတွေ့ခြင်း", "ချစ်ခြင်းမေတ္တာပြည့်ဝသောအခမ်းအနားများ", "နွေဦးရာသီ", "အမျိုးသမီးအခမ်းအနားများ"],
    },
  },
};

// 香水配方（多语言）
const perfumeRecipes = {
  柑橘调: [
    {
      name: { zh: "柠檬", en: "Lemon", my: "သံပုရာသီး" },
      percentage: "40%",
      note: { zh: "前调", en: "Top Note", my: "အရင်ဆုံးအနံ့" },
    },
    {
      name: { zh: "佛手柑", en: "Bergamot", my: "လီမွန်သီး" },
      percentage: "30%",
      note: { zh: "前调", en: "Top Note", my: "အရင်ဆုံးအနံ့" },
    },
    {
      name: { zh: "橙花", en: "Orange Blossom", my: "လိမ္မော်ပန်း" },
      percentage: "20%",
      note: { zh: "中调", en: "Middle Note", my: "အလယ်အလတ်အနံ့" },
    },
    {
      name: { zh: "白麝香", en: "White Musk", my: "အဖြူရောမတ်စ်အနံ့" },
      percentage: "10%",
      note: { zh: "后调", en: "Base Note", my: "နောက်ဆုံးအနံ့" },
    },
  ],
  果香调: [
    {
      name: { zh: "水蜜桃", en: "Peach", my: "မက်မွန်သီး" },
      percentage: "35%",
      note: { zh: "前调", en: "Top Note", my: "အရင်ဆုံးအနံ့" },
    },
    {
      name: { zh: "红苹果", en: "Red Apple", my: "အနီရောင်ပန်းသီး" },
      percentage: "25%",
      note: { zh: "前调", en: "Top Note", my: "အရင်ဆုံးအနံ့" },
    },
    {
      name: { zh: "荔枝", en: "Lychee", my: "လိုင်ချီးသီး" },
      percentage: "25%",
      note: { zh: "中调", en: "Middle Note", my: "အလယ်အလတ်အနံ့" },
    },
    {
      name: { zh: "香草", en: "Vanilla", my: "ဗနီလာ" },
      percentage: "15%",
      note: { zh: "后调", en: "Base Note", my: "နောက်ဆုံးအနံ့" },
    },
  ],
  水生调: [
    {
      name: { zh: "海洋", en: "Ocean", my: "ပင်လယ်" },
      percentage: "40%",
      note: { zh: "前调", en: "Top Note", my: "အရင်ဆုံးအနံ့" },
    },
    {
      name: { zh: "莲花", en: "Lotus", my: "ကြာပန်း" },
      percentage: "30%",
      note: { zh: "中调", en: "Middle Note", my: "အလယ်အလတ်အနံ့" },
    },
    {
      name: { zh: "琥珀", en: "Amber", my: "ပယင်းရောင်" },
      percentage: "20%",
      note: { zh: "后调", en: "Base Note", my: "နောက်ဆုံးအနံ့" },
    },
    {
      name: { zh: "白麝香", en: "White Musk", my: "အဖြူရောင်ကြောင်လိပ်အနံ့" },
      percentage: "10%",
      note: { zh: "基调", en: "Foundation", my: "အခြေခံအနံ့" },
    },
  ],
  绿叶调: [
    {
      name: { zh: "青草", en: "Grass", my: "မြက်ခင်း" },
      percentage: "35%",
      note: { zh: "前调", en: "Top Note", my: "အရင်ဆုံးအနံ့" },
    },
    {
      name: { zh: "茶叶", en: "Tea", my: "လက်ဖက်" },
      percentage: "30%",
      note: { zh: "中调", en: "Middle Note", my: "အလယ်အလတ်အနံ့" },
    },
    {
      name: { zh: "铃兰", en: "Lily of the Valley", my: "တောင်ဇလပ်ပန်း" },
      percentage: "20%",
      note: { zh: "中调", en: "Middle Note", my: "အလယ်အလတ်အနံ့" },
    },
    {
      name: { zh: "橡木苔", en: "Oakmoss", my: "သစ်သားချောင်းမှော်" },
      percentage: "15%",
      note: { zh: "后调", en: "Base Note", my: "နောက်ဆုံးအနံ့" },
    },
  ],
  东方调: [
    {
      name: { zh: "琥珀", en: "Amber", my: "ပယင်းရောင်" },
      percentage: "30%",
      note: { zh: "前调", en: "Top Note", my: "အရင်ဆုံးအနံ့" },
    },
    {
      name: { zh: "香草", en: "Vanilla", my: "ဗနီလာ" },
      percentage: "25%",
      note: { zh: "中调", en: "Middle Note", my: "အလယ်အလတ်အနံ့" },
    },
    {
      name: { zh: "肉桂", en: "Cinnamon", my: "သစ်ကြံ့ပိုးခေါက်" },
      percentage: "20%",
      note: { zh: "中调", en: "Middle Note", my: "အလယ်အလတ်အနံ့" },
    },
    {
      name: { zh: "檀香", en: "Sandalwood", my: "စန္ဒကူးသစ်" },
      percentage: "25%",
      note: { zh: "后调", en: "Base Note", my: "နောက်ဆုံးအနံ့" },
    },
  ],
  木质调: [
    {
      name: { zh: "雪松", en: "Cedar", my: "စီဒါသစ်" },
      percentage: "35%",
      note: { zh: "前调", en: "Top Note", my: "အရင်ဆုံးအနံ့" },
    },
    {
      name: { zh: "香根草", en: "Vetiver", my: "ဗက်တီဗာပင်" },
      percentage: "25%",
      note: { zh: "中调", en: "Middle Note", my: "အလယ်အလတ်အနံ့" },
    },
    {
      name: { zh: "广藿香", en: "Patchouli", my: "ပက်ချူလီ" },
      percentage: "20%",
      note: { zh: "中调", en: "Middle Note", my: "အလယ်အလတ်အနံ့" },
    },
    {
      name: { zh: "麝香", en: "Musk", my: "မတ်စ်အနံ့" },
      percentage: "20%",
      note: { zh: "后调", en: "Base Note", my: "နောက်ဆုံးအနံ့" },
    },
  ],
  花香调: [
    {
      name: { zh: "玫瑰", en: "Rose", my: "နှင်းဆီ" },
      percentage: "40%",
      note: { zh: "前调", en: "Top Note", my: "အရင်ဆုံးအနံ့" },
    },
    {
      name: { zh: "茉莉", en: "Jasmine", my: "စံပယ်ပန်း" },
      percentage: "30%",
      note: { zh: "中调", en: "Middle Note", my: "အလယ်အလတ်အနံ့" },
    },
    {
      name: { zh: "百合", en: "Lily", my: "လီလီပန်း" },
      percentage: "20%",
      note: { zh: "中调", en: "Middle Note", my: "အလယ်အလတ်အနံ့" },
    },
    {
      name: { zh: "麝香", en: "Musk", my: "မတ်စ်အနံ့" },
      percentage: "10%",
      note: { zh: "后调", en: "Base Note", my: "နောက်ဆုံးအနံ့" },
    },
  ],
};

// DOM元素
const pages = {
  language: document.getElementById("languagePage"),
  welcome: document.getElementById("welcomePage"),
  basic: document.getElementById("basicInfoPage"),
  quiz: document.getElementById("quizPage"),
  note: document.getElementById("notePage"), 
  result: document.getElementById("resultPage"),
};

// 香调图片配置
const noteImages = {
  zh: "images/cn_note.png",
  en: "images/en_note.png",
  my: "images/my_note.png"
};
let hasShownNote = false; // 标记是否已经显示过注意事项

const categoryImages = {
  柑橘调: {
    zh: "images/cn_citrus.png",
    en: "images/en_citrus.png",
    my: "images/my_citrus.png"
  },
  果香调: {
    zh: "images/cn_fruity.png",
    en: "images/en_fruity.png",
    my: "images/my_fruity.png"
  },
  水生调: {
    zh: "images/cn_aquatic.png",
    en: "images/en_aquatic.png",
    my: "images/my_aquatic.png"
  },
  绿叶调: {
    zh: "images/cn_green.png",
    en: "images/en_green.png",
    my: "images/my_green.png"
  },
  东方调: {
    zh: "images/cn_oriental.png",
    en: "images/en_oriental.png",
    my: "images/my_oriental.png"
  },
  木质调: {
    zh: "images/cn_wooden.png",
    en: "images/en_wooden.png",
    my: "images/my_wooden.png"
  },
  花香调: {
    zh: "images/cn_floral.png",
    en: "images/en_floral.png",
    my: "images/my_floral.png"
  }
};



// 页面初始化
document.addEventListener("DOMContentLoaded", function () {
  // 绑定语言选择事件
  document.querySelectorAll(".language-option").forEach((option) => {
    option.addEventListener("click", function () {
      selectLanguage(this);
    });
  });

   // 绑定注意事项页面的确认按钮
  document.getElementById("confirmNoteBtn").addEventListener("click", showResults);
  
  // 绑定注意事项页面的语言切换按钮
  document.getElementById("switchLanguageBtnNote").addEventListener("click", toggleLanguageFromNote);
  
  // 绑定同意复选框
  document.getElementById("agreeCheck").addEventListener("change", function() {
    document.getElementById("confirmNoteBtn").disabled = !this.checked;
  });

  // 绑定开始测试按钮
  document.getElementById("startBtn").addEventListener("click", startTest);

  // 绑定继续按钮
  document.getElementById("continueBtn").addEventListener("click", startQuiz);

  // 绑定其他事件
  document
    .getElementById("toQuizBtn")
    .addEventListener("click", startSceneTest);
  document.getElementById("nextBtn").addEventListener("click", nextQuestion);
  document.getElementById("submitBtn").addEventListener("click", showResults);
  document.getElementById("restartBtn").addEventListener("click", restartQuiz);
  document.getElementById("shareBtn").addEventListener("click", openShareModal);

  // 绑定语言切换按钮
  document
    .getElementById("switchLanguageBtn")
    .addEventListener("click", toggleLanguage);
  document
    .getElementById("switchLanguageBtn2")
    .addEventListener("click", toggleLanguage);
  document
    .getElementById("switchLanguageBtn3")
    .addEventListener("click", toggleLanguage);
  document
    .getElementById("switchLanguageBtn4")
    .addEventListener("click", toggleLanguage);

  // 关闭模态框
  document.querySelector(".close").addEventListener("click", closeShareModal);
  window.addEventListener("click", function (event) {
    if (event.target === document.getElementById("shareModal")) {
      closeShareModal();
    }
  });

  // 分享按钮
  document.querySelectorAll(".share-option").forEach((btn) => {
    btn.addEventListener("click", shareResult);
  });

  // 默认选择中文
  selectLanguage(document.querySelector('.language-option[data-lang="zh"]'));
});

// 选择语言
function selectLanguage(element) {
  // 移除所有选中状态
  document.querySelectorAll(".language-option").forEach((option) => {
    option.classList.remove("selected");
  });

  // 选中当前选项
  element.classList.add("selected");

  // 设置语言
  currentLanguage = element.dataset.lang;

  // 启用开始测试按钮
  document.getElementById("startBtn").disabled = false;
}

// 开始测试（从语言选择页面）
function startTest() {
  updateUITexts();
  navigateTo("welcome");
}

// 新增函数：从注意事项页面返回
function goBackFromNote() {
  navigateTo("quiz");
  // 允许用户重新测试最后一道题
  if (currentQuestion === 9) {
    currentQuestion = 8; // 回到第9题（索引8）
    loadQuestion();
  }
}

// 新增函数：在注意事项页面切换语言
function toggleLanguageFromNote() {
  toggleLanguage();
  showNotePage(); // 重新加载注意事项页面内容
}

// 新增函数：显示注意事项页面
function showNotePage() {
  const lang = translations[currentLanguage];
  
  // 更新页面文本
  document.getElementById("noteBackText").textContent = lang.back;
  document.getElementById("noteTitle").textContent = 
    currentLanguage === "zh" ? "注意事项" : 
    currentLanguage === "en" ? "Important Notes" : 
    "သတိပြုရမည့်အချက်များ";
  document.getElementById("noteMessage").textContent = 
    currentLanguage === "zh" ? "请仔细阅读注意事项后查看测试结果" : 
    currentLanguage === "en" ? "Please read the important notes carefully before viewing the test results" :
    "စမ်းသပ်ရလဒ်များကိုကြည့်ရှုခြင်းမပြုမီ သတိပြုရမည့်အချက်များကို သေချာစွာဖတ်ရှုပါ";
  document.getElementById("agreeText").textContent = 
    currentLanguage === "zh" ? "我已阅读并理解上述注意事项" : 
    currentLanguage === "en" ? "I have read and understood the above notes" :
    "ကျွန်ုပ်သည် အထက်ပါသတိပြုရမည့်အချက်များကို ဖတ်ရှုနားလည်ပြီးဖြစ်သည်";
  document.getElementById("confirmText").textContent = 
    currentLanguage === "zh" ? "查看测试结果" : 
    currentLanguage === "en" ? "View Test Results" :
    "စမ်းသပ်ရလဒ်များကိုကြည့်ရှုရန်";
  
  // 设置切换语言按钮文本
  if (currentLanguage === "zh") {
    document.getElementById("switchLanguageTextNote").textContent = lang.switchToEnglish;
  } else if (currentLanguage === "en") {
    document.getElementById("switchLanguageTextNote").textContent = lang.switchToBurmese;
  } else {
    document.getElementById("switchLanguageTextNote").textContent = lang.switchToChinese;
  }
  
  // 加载对应语言的图片
  const noteImage = document.getElementById("noteImage");
  noteImage.src = noteImages[currentLanguage];
  noteImage.alt = currentLanguage === "zh" ? "注意事项" : 
                  currentLanguage === "en" ? "Important Notes" : 
                  "သတိပြုချက်များ";
  
  // 显示页面
  navigateTo("note");
  
  // 重置复选框状态
  document.getElementById("agreeCheck").checked = false;
  document.getElementById("confirmNoteBtn").disabled = true;
}
  

// 切换语言
function toggleLanguage() {
  if (currentLanguage === "zh") {
    currentLanguage = "en";
  } else if (currentLanguage === "en") {
    currentLanguage = "my";
  } else {
    currentLanguage = "zh";
  }
  
  updateUITexts();

  // 如果正在测试中，重新加载当前内容
  switch (currentPage) {
    case "quiz":
      loadQuestion();
      break;
    case "basic":
      renderBasicQuestions();
      break;
    case "result":
      // 重新渲染整个结果页面
      renderResultsPage();
      break;
  }
}

// 渲染整个结果页面（新增函数）
function renderResultsPage() {
  // 首先更新UI文本
  updateUITexts();
  
  // 然后重新计算并渲染结果
  calculateResults();
}

// 更新界面文本
function updateUITexts() {
  const lang = translations[currentLanguage];

  // 更新欢迎页面
  document.getElementById("welcomeTitle").textContent = lang.findYourScent;
  document.getElementById("welcomeText").innerHTML = lang.welcomeText;
  document.getElementById("feature1").textContent = lang.feature1;
  document.getElementById("feature2").textContent = lang.feature2;
  document.getElementById("feature3").textContent = lang.feature3;
  document.getElementById("continueText").textContent = lang.startButton;
  document.getElementById("disclaimerText").textContent = lang.disclaimerText;
  
  // 根据当前语言设置切换按钮文本
  if (currentLanguage === "zh") {
    document.getElementById("switchLanguageText").textContent = lang.switchToEnglish;
    document.getElementById("switchLanguageText2").textContent = lang.switchToEnglish;
    document.getElementById("switchLanguageText3").textContent = lang.switchToEnglish;
    document.getElementById("switchLanguageText4").textContent = lang.switchToEnglish;
  } else if (currentLanguage === "en") {
    document.getElementById("switchLanguageText").textContent = lang.switchToBurmese;
    document.getElementById("switchLanguageText2").textContent = lang.switchToBurmese;
    document.getElementById("switchLanguageText3").textContent = lang.switchToBurmese;
    document.getElementById("switchLanguageText4").textContent = lang.switchToBurmese;
  } else {
    document.getElementById("switchLanguageText").textContent = lang.switchToChinese;
    document.getElementById("switchLanguageText2").textContent = lang.switchToChinese;
    document.getElementById("switchLanguageText3").textContent = lang.switchToChinese;
    document.getElementById("switchLanguageText4").textContent = lang.switchToChinese;
  }

  // 更新基本信息页面
  document.getElementById("backText").textContent = lang.back;
  document.getElementById("basicInfoTitle").textContent = lang.basicInfo;
  document.getElementById("toQuizText").textContent = lang.continueQuiz;

  // 更新场景测试页面
  document.getElementById("backText2").textContent = lang.back;
  document.getElementById("quizTitle").textContent = lang.quizTitle;
  document.getElementById("questionNumberText").textContent = lang.questionText;
  document.getElementById("questionNumberText2").textContent =
    lang.questionText2;
  document.getElementById("scoreTitle").textContent = lang.scoreTitle;
  document.getElementById("nextText").textContent = lang.nextQuestion;
  document.getElementById("submitText").textContent = lang.submitQuiz;

  // 更新结果页面
  document.getElementById("resultTitle").textContent = lang.resultTitle;
  document.getElementById("resultSubtitle").textContent = lang.resultSubtitle;
  document.getElementById("dominantTitle").textContent = lang.dominantTitle;
  document.getElementById("analysisTitle").textContent = lang.analysisTitle;
  document.getElementById("recommendationTitle").textContent =
    lang.recommendationTitle;
  document.getElementById("suggestionTitle").textContent = lang.suggestionTitle;
  document.getElementById("restartText").textContent = lang.restartTest;
  document.getElementById("shareText").textContent = lang.shareResult;

  // 更新分享模态框
  document.getElementById("shareModalTitle").textContent = lang.shareModalTitle;
  document.getElementById("copyLinkText").textContent = lang.copyLink;
}

// 渲染基本信息问题
function renderBasicQuestions() {
  const container = document.getElementById("basicQuestionsContainer");
  const lang = translations[currentLanguage];

  const basicQuestions = {
    zh: [
      {
        id: "q1",
        text: "你是从哪里认识的AR Fragrance Studio？",
        options: ["抖音", "脸书", "微信", "朋友介绍", "路过逛到", "其他"],
      },
      {
        id: "q2",
        text: "是自己调香吗？",
        options: ["是", "否"],
      },
      {
        id: "q3",
        text: "选择性别",
        options: ["男", "女"],
      },
    ],
    en: [
      {
        id: "q1",
        text: "Where did you meet AR Fragrance Studio?",
        options: [
          "TikTok",
          "Facebook",
          "WeChat",
          "Introduction from a friend",
          "Passed by and strolled around",
          "Other",
        ],
      },
      {
        id: "q2",
        text: "Did you mix the fragrance yourself?",
        options: ["Yes", "No"],
      },
      {
        id: "q3",
        text: "Choose gender",
        options: ["Male", "Female"],
      },
    ],
    my: [
      {
        id: "q1",
        text: "AR Fragrance Studioကို ဘယ်နေရာကနေ သိရှိခဲ့တာပါလဲ။",
        options: ["TikTok", "Facebook", "WeChat", "သူငယ်ချင်းထံမှ တဆင့်", "ဖြတ်သွားဖြတ်လာခြင်းမှ တဆင့်", "အခြား"],
      },
      {
        id: "q2",
        text: "ရနံ့များကို စိတ်ကြိုက် ရောစပ်လိုပါသလား။",
        options: ["ဟုတ်ကဲ့", "မဟုတ်ပါ"],
      },
      {
        id: "q3",
        text: "Gender ရွေးချယ်ပါ။",
        options: ["အမျိုးသား", "အမျိုးသမီး"],
      },
    ],
  };

  const questions = basicQuestions[currentLanguage];

  let html = "";
  questions.forEach((question) => {
    html += `
            <div class="question-container">
                <h3>${question.text}</h3>
                <div class="option-list" id="${question.id}">
                    ${question.options
                      .map(
                        (option) => `
                        <div class="option-item" data-value="${option}">
                            ${option}
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `;
  });

  container.innerHTML = html;

  // 为选项添加点击事件
  questions.forEach((question) => {
    document
      .querySelectorAll(`#${question.id} .option-item`)
      .forEach((item) => {
        item.addEventListener("click", function () {
          // 移除同一问题的其他选中状态
          this.parentNode.querySelectorAll(".option-item").forEach((el) => {
            el.classList.remove("selected");
          });

          // 选中当前选项
          this.classList.add("selected");

          // 存储答案
          userAnswers[question.id] = this.dataset.value;

          // 检查是否所有基本信息都已填写
          checkBasicInfoComplete();
        });
      });
  });
}

// 检查基本信息是否完整
function checkBasicInfoComplete() {
  const complete = ["q1", "q2", "q3"].every((id) => userAnswers[id]);
  document.getElementById("toQuizBtn").disabled = !complete;
}

// 开始问卷
function startQuiz() {
  navigateTo("basic");
  renderBasicQuestions();
}

// 导航到指定页面
function navigateTo(page) {
  // 1. 切换可见页面
  Object.values(pages).forEach((p) => p.classList.remove("active"));
  pages[page].classList.add("active");
  currentPage = page;

  // 2. 每次页面切换时，回到顶部
  window.scrollTo({
    top: 0,
    behavior: "smooth", // 如果想瞬间跳转，可以改成 "auto"
  });
}

// 返回上一页
function goBack() {
  switch (currentPage) {
    case "welcome":
      navigateTo("language");
      break;
    case "basic":
      navigateTo("welcome");
      break;
    case "quiz":
      if (currentQuestion === 0) {
        navigateTo("basic");
      } else {
        currentQuestion--;
        loadQuestion();
      }
      break;
  }
}

// 开始场景测试
function startSceneTest() {
  navigateTo("quiz");
  currentQuestion = 0;
  scores = {
    柑橘调: 0,
    果香调: 0,
    水生调: 0,
    绿叶调: 0,
    东方调: 0,
    木质调: 0,
    花香调: 0,
  };
  loadQuestion();
}

// 加载问题
function loadQuestion() {
  const currentQuestions = questions[currentLanguage];

  if (currentQuestion >= currentQuestions.length) {
    document.getElementById("submitBtn").click();
    return;
  }

  const question = currentQuestions[currentQuestion];

  // 更新界面
  document.getElementById("questionText").textContent = question.text;
  document.getElementById("qNumber").textContent = currentQuestion + 1;
  document.getElementById("currentQuestion").textContent = currentQuestion + 1;

  // 更新进度条
  const progress = ((currentQuestion + 1) / currentQuestions.length) * 100;
  document.getElementById("quizProgress").style.width = `${progress}%`;

  // 渲染选项
  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
  const categoryInfo = categories[option.category] || {
    icon: "✨",
    color: "#8A6DAE",
  };
  const optionDiv = document.createElement("div");
  optionDiv.className = "quiz-option";
  optionDiv.dataset.index = index;
  optionDiv.dataset.category = option.category;

  // 只保留文字内容，不再显示上方图标，缩短卡片高度
  optionDiv.innerHTML = `
            <div class="option-text">${option.text}</div>
        `;

  optionDiv.addEventListener("click", function () {
    selectOption(this);
  });

    // 如果之前已经选择过这个问题，恢复选择状态
    if (userAnswers[question.id] === index.toString()) {
      optionDiv.classList.add("selected");
    }

    optionsContainer.appendChild(optionDiv);
  });

  // 更新按钮状态
  const hasAnswer = userAnswers[question.id] !== undefined;
  document.getElementById("nextBtn").disabled = !hasAnswer;
  document.getElementById("nextBtn").style.display =
    currentQuestion < currentQuestions.length - 1 ? "inline-flex" : "none";
  document.getElementById("submitBtn").style.display =
    currentQuestion === currentQuestions.length - 1 ? "inline-flex" : "none";

  // 更新分数预览
  updateScorePreview();
}

// 选择选项
function selectOption(element) {
  const currentQuestions = questions[currentLanguage];
  const question = currentQuestions[currentQuestion];
  const index = element.dataset.index;
  const category = element.dataset.category;

  // 移除同一问题的其他选中状态
  element.parentNode.querySelectorAll(".quiz-option").forEach((el) => {
    el.classList.remove("selected");
  });

  // 选中当前选项
  element.classList.add("selected");

  // 如果之前已经选择过这个问题，先减去之前的分数
  if (userAnswers[question.id] !== undefined) {
    const prevIndex = userAnswers[question.id];
    const prevCategory = question.options[prevIndex].category;
    scores[prevCategory]--;
  }

  // 更新分数和答案
  scores[category]++;
  userAnswers[question.id] = index;

  // 启用下一题按钮
  document.getElementById("nextBtn").disabled = false;

  // 更新分数预览
  updateScorePreview();
}

// 更新分数预览
function updateScorePreview() {
  const preview = document.getElementById("scorePreview");
  if (!preview) return; // ★★★ 加这一行即可 ★★★

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  if (total === 0) {
    preview.innerHTML =  "...";
    return;
  }

  preview.innerHTML = "";

  Object.entries(scores).forEach(([category, score]) => {
    if (score > 0) {
      const percent = Math.round((score / total) * 100);
      const categoryInfo = getCategoryInfo(category);
      const previewDiv = document.createElement("div");
      previewDiv.className = "category-preview";
      
      let questionText = "";
      if (currentLanguage === "zh") {
        questionText = "题";
      } else if (currentLanguage === "en") {
        questionText = "Q";
      } else {
        questionText = "မှတ်";
      }
      
      previewDiv.innerHTML = `
                <span>${categoryInfo.icon}</span>
                <span>${categoryInfo.name}: ${score}${questionText} (${percent}%)</span>
            `;
      preview.appendChild(previewDiv);
    }
  });
}

// 获取香调信息
function getCategoryInfo(category) {
  const categoryData = categories[category];
  if (!categoryData) {
    return {
      icon: "✨",
      color: "#8A6DAE",
      name: category,
      description:
        currentLanguage === "zh"
          ? "独特个性的香气选择"
          : currentLanguage === "en"
          ? "Unique and personal fragrance choice"
          : "ထူးခြားသော ကိုယ်ပိုင်ရနံ့ရွေးချယ်မှု",
      personality: currentLanguage === "zh" ? "个性型" : currentLanguage === "en" ? "Unique Type" : "ထူးခြားသောအမျိုးအစား",
      detailedDesc:
        currentLanguage === "zh"
          ? "你对香气有独特的见解和偏好。"
          : currentLanguage === "en"
          ? "You have unique insights and preferences for fragrances."
          : "သင်သည် ရနံ့များအတွက် ထူးခြားသောအမြင်နှင့် နှစ်သက်မှုများရှိပါသည်။",
      recommendedScents: [],
      bestFor: [],
      // 添加图片路径
      image: "images/default.png"
    };
  }

  return {
    icon: categoryData.icon,
    color: categoryData.color,
    name: categoryData.name[currentLanguage] || category,
    description: categoryData.description[currentLanguage],
    personality: categoryData.personality[currentLanguage],
    detailedDesc: categoryData.detailedDesc[currentLanguage],
    recommendedScents: categoryData.recommendedScents[currentLanguage],
    bestFor: categoryData.bestFor[currentLanguage],
    // 添加图片路径
    image: categoryImages[category] ? categoryImages[category][currentLanguage] : "images/default.png"
  };
}

// 下一题
function nextQuestion() {
  const currentQuestions = questions[currentLanguage];
  if (currentQuestion < currentQuestions.length - 1) {
    currentQuestion++;
    loadQuestion();
    //新增：切换题目后回到顶部，让用户先看到问题
    window.scrollTo({ top:0,behavior: "smooth" });
  }
}

// 显示结果
function showResults() {
  // 检查是否需要显示注意事项页面
  if (!hasShownNote) {
    hasShownNote = true;
    showNotePage();
    return;
  }
  
  // 如果已经显示过注意事项，则直接显示结果
  calculateResults();
  navigateTo("result");
}

// 计算结果
// 在calculateResults函数中，设置主导香调的大图片
function calculateResults() {
  console.log("Calculating results for language:", currentLanguage);
  console.log("Current scores:", scores);
  
  // 计算每个香调的总分和百分比
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const scorePercentages = {};

  Object.keys(scores).forEach((category) => {
    scorePercentages[category] =
      total > 0 ? (scores[category] / total) * 100 : 0;
  });

  // 找出主导香调
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const dominantScore = sortedScores[0][1];
  const dominantCategories = sortedScores.filter(
    ([cat, score]) => score === dominantScore,
  );

  // 获取主导香调信息并设置大图片
  if (dominantCategories.length > 0) {
    const dominantCategory = dominantCategories[0][0];
    const categoryInfo = getCategoryInfo(dominantCategory);
    
    // 设置主导香调大图片
    const dominantImage = document.getElementById("dominantImage");
    dominantImage.src = categoryInfo.image;
    dominantImage.alt = categoryInfo.name;
    
    // 添加错误处理
    dominantImage.onerror = function() {
      this.src = `images/default_${currentLanguage}.png`;
      this.onerror = null;
    };
  }

  // 显示主导香调信息
  const dominantContainer = document.getElementById("dominantCategory");
  dominantContainer.innerHTML = "";

  dominantCategories.forEach(([category, score]) => {
    const percent = scorePercentages[category].toFixed(1);
    const categoryInfo = getCategoryInfo(category);

    let questionText = "";
    if (currentLanguage === "zh") {
      questionText = "题";
    } else if (currentLanguage === "en") {
      questionText = "Q";
    } else {
      questionText = "မှတ်";
    }

    dominantContainer.innerHTML += `
      <div class="dominant-info">
        <div class="category-icon-large">${categoryInfo.icon}</div>
        <div class="category-name">${categoryInfo.name}</div>
        <div class="category-personality">${categoryInfo.personality}</div>
        <div class="category-score">${score}${questionText} · ${percent}%</div>
        <p class="category-description">
          ${categoryInfo.detailedDesc}
        </p>
      </div>
    `;
  });

  // 结果页目前仅展示主导香调大图，详细占比、个性化推荐和调香建议模块已移除
  // 如果将来需要恢复，可在此重新调用：
  // renderScoreChart(scorePercentages);
  // renderRecommendations(
  //   dominantCategories.map(([cat]) => cat),
  //   scorePercentages,
  // );
  // renderSuggestions(scorePercentages);

  // 发送数据到Google Sheets（如果尚未发送）
  if (!hasSentData) {
    sendResultsToGoogleSheets(dominantCategories);
    hasSentData = true;
  }
}



// 渲染分数图表
function renderScoreChart(percentages) {
  const chart = document.getElementById("scoreChart");
  const details = document.getElementById("scoreDetails");

  chart.innerHTML = "";
  details.innerHTML = "";

  Object.entries(percentages)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, percent]) => {
      if (percent === 0) return;

      const categoryInfo = getCategoryInfo(category);
      const color = categoryInfo.color;

      // 图表条
      const chartItem = document.createElement("div");
      chartItem.className = "chart-item";
      chartItem.innerHTML = `
                <div class="chart-label">
                    ${categoryInfo.icon} ${categoryInfo.name}
                </div>
                <div class="chart-bar">
                    <div class="chart-fill" style="
                        width: ${percent}%;
                        background: ${color};
                    "></div>
                </div>
                <div class="chart-percent">${percent.toFixed(1)}%</div>
            `;
      chart.appendChild(chartItem);

      // 详细分数
      const detailItem = document.createElement("div");
      detailItem.className = "detail-item";
      detailItem.style.backgroundColor = `${color}20`;
      
      let questionText = "";
      if (currentLanguage === "zh") {
        questionText = "题";
      } else if (currentLanguage === "en") {
        questionText = "Q";
      } else {
        questionText = "မှတ်";
      }
      
      detailItem.innerHTML = `
        <div style="font-size: 1.8rem;">${categoryInfo.icon}</div>
        <div style="font-weight: bold; margin: 8px 0;">${categoryInfo.name}</div>
        <div>${scores[category]} ${questionText}</div>
        <div style="font-size: 1.2rem; font-weight: bold; color: ${color};">
          ${percent.toFixed(1)}%
        </div>
      `;
      details.appendChild(detailItem);
    });
}

// 渲染个性化推荐
function renderRecommendations(dominantCategories, percentages) {
  const container = document.getElementById("recommendations");
  container.innerHTML = "";

  dominantCategories.forEach((category) => {
    const categoryInfo = getCategoryInfo(category);
    const recommendation = getRecommendationByCategory(category, percentages);
    const item = document.createElement("div");
    item.className = "recommendation-item";
    
    let recommendationTitle = "";
    if (currentLanguage === "zh") {
      recommendationTitle = "推荐";
    } else if (currentLanguage === "en") {
      recommendationTitle = "Recommendation";
    } else {
      recommendationTitle = "အကြံပြုချက်";
    }
    
    item.innerHTML = `
            <h4>${categoryInfo.icon} ${categoryInfo.name} ${recommendationTitle}</h4>
            <p>${recommendation}</p>
        `;
    container.appendChild(item);
  });
}

// 根据香调获取推荐
function getRecommendationByCategory(category, percentages) {
  const lang = translations[currentLanguage];

  const recommendations = {
    柑橘调: lang.citrusRec,
    果香调: lang.fruityRec,
    水生调: lang.aquaticRec,
    绿叶调: lang.greenRec,
    东方调: lang.orientalRec,
    木质调: lang.woodyRec,
    花香调: lang.floralRec,
  };

  return (
    recommendations[category] ||
    (currentLanguage === "zh"
      ? "根据你的偏好，可以尝试混合多种香调创造独特气息。"
      : currentLanguage === "en"
      ? "Based on your preferences, try blending multiple fragrance notes to create a unique scent."
      : "သင်၏နှစ်သက်မှုများအပေါ် အခြေခံ၍၊ ထူးခြားသောရနံ့တစ်ခုဖန်တီးရန် ရနံ့အမျိုးမျိုးကို ရောစပ်ကြည့်ပါ။")
  );
}

// 新增函数：发送结果到Google Sheets
function sendResultsToGoogleSheets(dominantCategories) {
  // 收集所有需要发送的数据
  const dataToSend = {
    language: currentLanguage,
    basicInfo: {
      q1: userAnswers.q1 || '',
      q2: userAnswers.q2 || '',
      q3: userAnswers.q3 || ''
    },
    scores: scores,
    dominantCategory: dominantCategories.length > 0 ? dominantCategories[0][0] : '',
    totalQuestions: Object.keys(scores).reduce((sum, category) => sum + scores[category], 0),
    quizAnswers: {}
  };
  
  // 收集所有场景测试的答案
  const currentQuestions = questions[currentLanguage];
  currentQuestions.forEach((question, index) => {
    const answerIndex = userAnswers[question.id];
    if (answerIndex !== undefined) {
      const answer = question.options[answerIndex];
      dataToSend.quizAnswers[`q${index + 1}`] = {
        question: question.text,
        answer: answer.text,
        category: answer.category
      };
    }
  });
  
  console.log('准备发送数据到Google Sheets:', dataToSend);
  
  // 发送数据到Google Apps Script
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // 由于Google Apps Script的CORS限制，使用no-cors模式
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSend)
  })
  .then(() => {
    console.log('数据已发送到Google Sheets');
    // 由于no-cors模式，我们无法读取响应，但可以假设发送成功
  })
  .catch(error => {
    console.error('发送数据到Google Sheets时出错:', error);
  });
}

// 渲染调香建议
function renderSuggestions(percentages) {
  const container = document.getElementById("suggestions");
  container.innerHTML = "";

  // 分析用户的香调分布
  const sortedPercentages = Object.entries(percentages).sort(
    (a, b) => b[1] - a[1],
  );
  const topCategories = sortedPercentages
    .filter(([cat, percent]) => percent > 0)
    .slice(0, 3);

  if (topCategories.length === 1 && topCategories[0][1] > 50) {
    // 单一主导香调
    container.innerHTML = `
            <div class="suggestion-item">
                <h4>${currentLanguage === "zh" ? "专注单一香调" : currentLanguage === "en" ? "Focus on Single Fragrance" : "ရနံ့တစ်မျိုးတည်းကိုအာရုံစိုက်ပါ"}</h4>
                <p>${
                  currentLanguage === "zh"
                    ? `你的香调偏好非常明确，可以专注于开发${getCategoryInfo(topCategories[0][0]).name}主题的香水。建议使用同香调的不同香料创造层次感。`
                    : currentLanguage === "en"
                    ? `Your fragrance preference is very clear, you can focus on developing ${getCategoryInfo(topCategories[0][0]).name} themed perfumes. It is recommended to use different spices of the same fragrance to create layers.`
                    : `သင်၏ရနံ့နှစ်သက်မှုသည်အလွန်ရှင်းလင်းပါသည်၊ ${getCategoryInfo(topCategories[0][0]).name}ခေါင်းစဉ်ရေမွှေးများဖွံ့ဖြိုးရန်အာရုံစိုက်နိုင်ပါသည်။ အလွှာများဖန်တီးရန်တူညီသောရနံ့၏မတူညီသောဟင်းခတ်အမွှေးအကြိုင်များကိုအသုံးပြုရန်အကြံပြုပါသည်။`
                }</p>
            </div>
        `;
  } else if (topCategories.length >= 2) {
    // 多重香调
    const categoryNames = topCategories
      .map(([cat]) => getCategoryInfo(cat).name)
      .join(currentLanguage === "zh" ? "、" : currentLanguage === "en" ? ", " : "၊ ");
    container.innerHTML = `
            <div class="suggestion-item">
                <h4>${currentLanguage === "zh" ? "香调混合艺术" : currentLanguage === "en" ? "Art of Fragrance Blending" : "ရနံ့ရောစပ်အတတ်ပညာ"}</h4>
                <p>${
                  currentLanguage === "zh"
                    ? `你对${categoryNames}都有兴趣，可以尝试将这些香调巧妙融合，创造独特的复合香型。`
                    : currentLanguage === "en"
                    ? `You are interested in ${categoryNames}, you can try to skillfully blend these fragrances to create unique compound scents.`
                    : `သင်သည် ${categoryNames}ကိုစိတ်ဝင်စားပါသည်၊ ထူးခြားသောရနံ့များဖန်တီးရန်ဤရနံ့များကိုကျွမ်းကျင်စွာရောစပ်နိုင်ပါသည်။`
                }</p>
            </div>
        `;
  }

  // 添加使用场景建议
  const mainCategory = topCategories.length > 0 ? topCategories[0][0] : null;
  if (mainCategory) {
    const categoryInfo = getCategoryInfo(mainCategory);
    if (categoryInfo.bestFor && categoryInfo.bestFor.length > 0) {
      const bestForText = categoryInfo.bestFor.join(
        currentLanguage === "zh" ? "、" : currentLanguage === "en" ? ", " : "၊ ",
      );
      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.innerHTML = `
                <h4>${currentLanguage === "zh" ? "最佳使用场景" : currentLanguage === "en" ? "Best Usage Scenarios" : "အကောင်းဆုံးအသုံးပြုမှုရှုမြင်ကွင်းများ"}</h4>
                <p>${
                  currentLanguage === "zh"
                    ? `你的主导香调特别适合：${bestForText}等场合。`
                    : currentLanguage === "en"
                    ? `Your dominant fragrance is particularly suitable for occasions such as: ${bestForText}.`
                    : `သင်ရနံ့အထူးသင့်တော်သောရှုမြင်ကွင်းမှာ- ${bestForText}စသည်တို့ဖြစ်သည်။`
                }</p>
            `;
      container.appendChild(item);
    }
  }
}

// 重新开始测试
function restartQuiz() {
  // 重置所有数据
  currentQuestion = 0;
  scores = {
    柑橘调: 0,
    果香调: 0,
    水生调: 0,
    绿叶调: 0,
    东方调: 0,
    木质调: 0,
    花香调: 0,
  };
  userAnswers = {};
  hasShownNote = false; // 重置注意事项显示标记
  hasSentData = false; // 重置数据发送标记

  // 返回到语言选择页面
  navigateTo("language");

  // 重置基本信息页面
  document.querySelectorAll(".option-item").forEach((item) => {
    item.classList.remove("selected");
  });
  document.getElementById("toQuizBtn").disabled = true;
}

// 打开分享模态框
function openShareModal() {
  document.getElementById("shareModal").style.display = "block";
}

// 关闭分享模态框
function closeShareModal() {
  document.getElementById("shareModal").style.display = "none";
}

// 分享结果
function shareResult(event) {
  const platform = event.currentTarget.dataset.platform;

  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const dominantCategory =
    sortedScores.length > 0
      ? sortedScores[0][0]
      : currentLanguage === "zh"
        ? "未知"
        : currentLanguage === "en"
        ? "Unknown"
        : "မသိ";
  
  const categoryInfo = getCategoryInfo(dominantCategory);

  let resultText = "";
  if (currentLanguage === "zh") {
    resultText = `我在AR Fragrance Studio做了香调测试，我的主导香调是：${categoryInfo.name}。你也来试试吧！`;
  } else if (currentLanguage === "en") {
    resultText = `I took the fragrance test at AR Fragrance Studio, my dominant fragrance is: ${categoryInfo.name}. Come and try it too!`;
  } else {
    resultText = `AR Fragrance Studio တွင် ရနံ့စမ်းသပ်မှုပြုလုပ်ခဲ့သည်၊ ကျွန်ုပ်၏အဓိကရနံ့မှာ- ${categoryInfo.name}။ သင်လည်းလာရောက်စမ်းသပ်ကြည့်ပါ!`;
  }

  const url = window.location.href;

  switch (platform) {
    case "wechat":
      alert(
        currentLanguage === "zh"
          ? "请使用微信扫描分享二维码或复制链接分享"
          : currentLanguage === "en"
          ? "Please use WeChat to scan the QR code or copy the link to share"
          : "မျှဝေရန် QR ကုဒ်ကိုစကင်ဖတ်ရန် သို့မဟုတ် လင့်ကိုကူးယူရန် WeChat ကိုအသုံးပြုပါ"
      );
      break;
    case "weibo":
      window.open(
        `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(resultText)}`,
        "_blank",
      );
      break;
    case "copy":
      navigator.clipboard
        .writeText(`${resultText} ${url}`)
        .then(() =>
          alert(
            currentLanguage === "zh"
              ? "链接已复制到剪贴板！"
              : currentLanguage === "en"
              ? "Link copied to clipboard!"
              : "လင့်ကိုကလစ်ဘုတ်သို့ကူးယူပြီးပါပြီ!"
          ),
        )
        .catch(() =>
          prompt(
            currentLanguage === "zh"
              ? "请手动复制链接："
              : currentLanguage === "en"
              ? "Please copy the link manually:"
              : "လင့်ကိုလက်ဖြင့်ကူးယူပါ-",
            url,
          ),
        );
      break;
  }

  closeShareModal();
}
