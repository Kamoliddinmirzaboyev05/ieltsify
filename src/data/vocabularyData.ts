// Static Vocabulary Data - 6 Topics (expandable to 26)

export interface VocabItem {
  word: string;
  definition: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  examples?: string[];
}

export interface VocabTopic {
  id: string;
  title: string;
  icon: string;
  items: VocabItem[];
}

export const VOCABULARY_TOPICS: VocabTopic[] = [
  {
    id: 'family',
    title: 'Family',
    icon: '👨‍👩‍👧‍👦',
    items: [
      { word: 'Immediate family', definition: 'asosiy/kichkina oila (ota-ona, farzandlar)', level: 'B1' },
      { word: 'Nuclear family', definition: 'asosiy/kichkina oila', level: 'B1' },
      { word: 'Extended family', definition: 'katta oila (ota-ona, farzandlar, buvi, tog\'a)', level: 'B1' },
      { word: 'Family tree', definition: 'shajara oila daraxti', level: 'B1' },
      { word: 'Family members', definition: 'oila a\'zolari', level: 'A2' },
      { word: 'Distant relatives', definition: 'uzoq qarindoshlar', level: 'B2' },
      { word: 'Loving family', definition: 'baxtli, tinch, ahil oila', level: 'B1' },
      { word: 'Carefree childhood', definition: 'g\'am-gussasiz bolalik', level: 'B2' },
      { word: 'Dysfunctional family', definition: 'serg\'alva oila', level: 'C1' },
      { word: 'Troubled childhood', definition: 'g\'am-tashvishli bolalik', level: 'B2' },
      { word: 'Bitter divorce', definition: 'urush-janjal qilib ajrashish', level: 'C1' },
      { word: 'Broken home', definition: 'buzilgan oila', level: 'B2' },
      { word: 'Custody of children', definition: 'bolalarga vasiylik', level: 'C1' },
      { word: 'Joint custody', definition: 'ham ota, ham onaning vasilik qilishi', level: 'C1' },
      { word: 'Sole custody', definition: 'yo ota, yo onaning vasilik qilishi', level: 'C1' },
      { word: 'Pay child support', definition: 'aliment to\'lamoq', level: 'C1' },
      { word: 'Mutual divorce', definition: 'kelishib, janjalsiz ajrashish', level: 'C1' },
      { word: 'Stay on good terms', definition: 'bir-biri bilan yaxshi munosabatda qolmoq', level: 'B2' },
      { word: 'Get pregnant', definition: 'homilador bo\'lmoq', level: 'B1' },
      { word: 'Single mother', definition: 'nikohsiz bola ko\'rgan ayol', level: 'B2' },
      { word: 'Have an abortion', definition: 'abort qildirish', level: 'C1' },
      { word: 'Due date', definition: 'bola tug\'uladigan kun', level: 'B2' },
      { word: 'Give birth', definition: 'farzandni dunyoga keltirish', level: 'B1' },
      { word: 'Adoptive parents', definition: 'boqib olgan ota-onasi', level: 'C1' },
      { word: 'Bring up child', definition: 'bolani tarbiyalamoq', level: 'B2' },
      { word: 'Raise child', definition: 'bolani o\'stirmoq', level: 'B1' },
      { word: 'Family man', definition: 'uyim-joyim deydigan erkak', level: 'B2' },
      { word: 'Black sheep', definition: 'oilani boshqa a\'zolari bilan chiqisha olmaydigana\'zosi', level: 'C1' },
      { word: 'Run in blood', definition: 'o\'xhamoq, qoniga tortgan', level: 'C1' },
      { word: 'Siblings', definition: 'tug\'ushgan jigarlar, opa-ukalar', level: 'B1' },
      { word: 'Ancestors', definition: 'ajdodlar', level: 'B2' },
      { word: 'Descendants', definition: 'avlod', level: 'B2' },
      { word: 'See eye to eye', definition: 'butunlay fikriga qo\'shilmoq', level: 'C1' },
      { word: 'Get-together', definition: 'norasmiy yig\'ilish', level: 'B2' },
      { word: 'Skeleton in cupboard', definition: 'oilani hammadan yashiradigan siri', level: 'C2' },
      { word: 'Biological parent', definition: 'haqiqiy ota/onasi', level: 'B2' },
      { word: 'Family matters', definition: 'oilaviy masalalar', level: 'B1' },
    ]
  },
  {
    id: 'relationships',
    title: 'Relationships',
    icon: '💑',
    items: [
      { word: 'Make friends', definition: 'do\'st orttirmoq', level: 'A2' },
      { word: 'Casual acquaintances', definition: 'odatdagi tanish bilishlar', level: 'B2' },
      { word: 'Frienemy', definition: 'do\'st qiyofasidagi dushman', level: 'C1' },
      { word: 'Close friends', definition: 'yaqin do\'stlar', level: 'B1' },
      { word: 'Love at first sight', definition: 'bir ko\'rishda sevib qolmoq', level: 'B2' },
      { word: 'Fall in love', definition: 'bilan sevishmoq', level: 'B1' },
      { word: 'Significant other', definition: 'muhim bir inson', level: 'C1' },
      { word: 'Soul mate', definition: 'qalliq, sevgilisi', level: 'C1' },
      { word: 'Have feelings', definition: 'kimnidir yoqtirmoq', level: 'B2' },
      { word: 'Not my type', definition: 'u menga to\'g\'ri kelmas', level: 'B2' },
      { word: 'Unrequited love', definition: 'javobsiz sevgi', level: 'C2' },
      { word: 'Childhood sweetheart', definition: 'bolalikdagi sevgilisi', level: 'B2' },
      { word: 'Mutual friend', definition: 'ikki tomonlama do\'st', level: 'B2' },
      { word: 'Make commitment', definition: 'turmush qurishga qaror qilmoq', level: 'C1' },
      { word: 'Propose', definition: 'ayolni qo\'lini so\'ramoq', level: 'B2' },
      { word: 'Happily married', definition: 'baxtli turmush qurgan', level: 'B1' },
      { word: 'Have affair', definition: 'yurarkan', level: 'C1' },
      { word: 'Cheating', definition: 'xiyonat qilmoq', level: 'C1' },
      { word: 'Blind date', definition: 'birinchi uchrashuv', level: 'B2' },
      { word: 'Break heart', definition: 'yuragini sindirmoq', level: 'B2' },
      { word: 'Get engaged', definition: 'unashtirilmoq', level: 'B1' },
      { word: 'Go Dutch', definition: 'bo\'lishib to\'lamoq', level: 'B2' },
      { word: 'On me', definition: 'mening hisobimdan', level: 'B1' },
      { word: 'Kiss and make up', definition: 'urushib, yarashish', level: 'B2' },
      { word: 'Match made in heaven', definition: 'tangri yaratgan juftlik', level: 'C1' },
      { word: 'Puppy love', definition: 'babnik sevgi', level: 'B2' },
      { word: 'Say I do', definition: 'turmush qurmoq', level: 'B1' },
    ]
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: '👤',
    items: [
      { word: 'Gorgeous', definition: 'juda ham chiroyli', level: 'C1' },
      { word: 'Sleek hair', definition: 'uzun tekis sochlar', level: 'B2' },
      { word: 'Jet black hair', definition: 'qop-qora soch', level: 'B2' },
      { word: 'Pale blue eyes', definition: 'ochiq havorang ko\'zlar', level: 'C1' },
      { word: 'Radiant complexion', definition: 'issiq istara', level: 'C1' },
      { word: 'Hourglass figure', definition: 'ofatijon, ketvorgan', level: 'C1' },
      { word: 'Slender waist', definition: 'ingichga bel', level: 'B2' },
      { word: 'Round face', definition: 'dumaloq yuz', level: 'A2' },
      { word: 'Upturned nose', definition: 'qirra burun', level: 'B2' },
      { word: 'Striking resemblance', definition: '2 tomchi suvdek o\'xshamoq', level: 'C1' },
      { word: 'Hideously ugly', definition: 'juda ham xunuk', level: 'C1' },
      { word: 'Curly hair', definition: 'jingalak soch', level: 'A2' },
      { word: 'Unkempt hair', definition: 'tartibsiz soch', level: 'B2' },
      { word: 'Square face', definition: 'to\'rtburchak yuz', level: 'B1' },
      { word: 'Deep-set eyes', definition: 'ichiga kirgan ko\'zlar', level: 'B2' },
      { word: 'Bushy eyebrows', definition: 'qalin qoshlar', level: 'B2' },
      { word: 'Thick mustache', definition: 'qalin mo\'ylov', level: 'B1' },
      { word: 'Shaggy beard', definition: 'qalin soqol', level: 'B2' },
      { word: 'Facial hair', definition: 'yuzdagi tuklar', level: 'B1' },
      { word: 'Athletic build', definition: 'kachok', level: 'B2' },
      { word: 'Broad shoulders', definition: 'keng yelkalar', level: 'B1' },
      { word: 'Muscular arms', definition: 'baquvvat bilaklar', level: 'B2' },
      { word: 'Charming', definition: 'jozibali', level: 'B1' },
      { word: 'Handsome', definition: 'kelishgan', level: 'B1' },
      { word: 'Dressed to kill', definition: 'daxshat kiyingan', level: 'C1' },
      { word: 'All skin and bone', definition: 'juda ham ozg\'in', level: 'B2' },
    ]
  },
  {
    id: 'character',
    title: 'Character & Behavior',
    icon: '🎭',
    items: [
      { word: 'Painfully shy', definition: 'juda ham uyatchan', level: 'B2' },
      { word: 'Vivid imagination', definition: 'tasavvurga boy', level: 'C1' },
      { word: 'Outgoing personality', definition: 'kirishimli', level: 'B2' },
      { word: 'Sense of humor', definition: 'hazilkashlik', level: 'B1' },
      { word: 'Brutally honest', definition: 'juda ham rostgo\'y', level: 'C1' },
      { word: 'Fiercely loyal', definition: 'juda ham sadoqatli', level: 'C1' },
      { word: 'Show true color', definition: 'asil basharasini ko\'rsatmoq', level: 'C1' },
      { word: 'Play prank', definition: 'xazillashmoq', level: 'B2' },
      { word: 'Bear grudge', definition: 'ichida nafrat his qilish', level: 'C1' },
      { word: 'Low self-esteem', definition: 'o\'ziga past nazar', level: 'C1' },
      { word: 'Mean streak', definition: 'ziqna', level: 'C1' },
      { word: 'Busy-body', definition: 'hammaning ishiga burun suqadigan', level: 'C1' },
      { word: 'Cheapskate', definition: 'ziqna', level: 'C1' },
      { word: 'Couch potato', definition: 'TV qarash', level: 'B2' },
      { word: 'Down-to-earth', definition: 'realist', level: 'B2' },
      { word: 'Behind times', definition: 'zamondan orqada', level: 'C1' },
      { word: 'Go-getter', definition: 'maqsadga erishadigan', level: 'C1' },
      { word: 'Smart Alec', definition: 'juda ham aqlli', level: 'C1' },
      { word: 'Man of word', definition: 'bir so\'zli odam', level: 'B2' },
      { word: 'Social butterfly', definition: 'hamma bilan kelishadigan', level: 'C1' },
      { word: 'Wet blanket', definition: 'mazzani buzadigan', level: 'C1' },
    ]
  },
  {
    id: 'eating',
    title: 'Eating',
    icon: '🍽️',
    items: [
      { word: 'Eating habits', definition: 'ovqatlanish odati', level: 'B1' },
      { word: 'Junk food', definition: 'ozuqasiz ovqat', level: 'B1' },
      { word: 'Go on diet', definition: 'diyeta qilmoq', level: 'B2' },
      { word: 'Processed foods', definition: 'ximikatlarga boy ovqat', level: 'B2' },
      { word: 'Balanced diet', definition: 'muvozanatli diyeta', level: 'B2' },
      { word: 'Nourishing meals', definition: 'foydali ovqatlar', level: 'B2' },
      { word: 'Organic food', definition: 'tabiiy ovqat', level: 'B2' },
      { word: 'Fresh produce', definition: 'yangi sabzavotlar', level: 'B1' },
      { word: 'Quick snack', definition: 'tez tamaddi', level: 'A2' },
      { word: 'Home-cooked meal', definition: 'uyda pishirilgan', level: 'B1' },
      { word: 'Healthy appetite', definition: 'ko\'p ovqatlanish', level: 'B2' },
      { word: 'International cuisine', definition: 'xalqaro oshxona', level: 'B2' },
      { word: 'Food poisoning', definition: 'zaharlanish', level: 'B2' },
      { word: 'Light meals', definition: 'yengil taomlar', level: 'B1' },
      { word: 'Eat like pig', definition: 'befarosatlarcha ovqatlanmoq', level: 'C1' },
      { word: 'Eat like horse', definition: 'juda ko\'p ovqatlanmoq', level: 'C1' },
      { word: 'Gain weight', definition: 'semirish', level: 'B1' },
      { word: 'Lose weight', definition: 'ozmoq', level: 'B1' },
    ]
  },
  {
    id: 'books',
    title: 'Books & Movies',
    icon: '📚',
    items: [
      { word: 'Movie trailer', definition: 'kino haqida qisqacha video', level: 'B1' },
      { word: 'Opening night', definition: 'ochilish kechasi', level: 'B2' },
      { word: 'Film critic', definition: 'film tanqidchisi', level: 'B2' },
      { word: 'Movie stars', definition: 'mashhur aktyorlar', level: 'A2' },
      { word: 'Based on true story', definition: 'haqiqiy voqealarga asoslangan', level: 'B2' },
      { word: 'Leading role', definition: 'bosh rol', level: 'B2' },
      { word: 'Box-office hit', definition: 'eng ko\'p xit', level: 'C1' },
      { word: 'Engrossed in book', definition: 'kitobga kirib ketgan', level: 'C1' },
      { word: 'Main character', definition: 'asosiy qahramon', level: 'B1' },
      { word: 'Borrow books', definition: 'kitob olmoq', level: 'A2' },
      { word: 'Controversial topic', definition: 'muammoli masala', level: 'C1' },
      { word: 'Popcorn movie', definition: 'dam olish uchun kino', level: 'B2' },
      { word: 'Break leg', definition: 'omad', level: 'B2' },
      { word: 'In lime light', definition: 'omma nazarida', level: 'C1' },
    ]
  }
];

export const getAllVocabulary = () => {
  return VOCABULARY_TOPICS.flatMap(topic => 
    topic.items.map(item => ({
      ...item,
      topic: topic.title,
      topicId: topic.id
    }))
  );
};

export const getVocabularyByTopic = (topicId: string) => {
  const topic = VOCABULARY_TOPICS.find(t => t.id === topicId);
  return topic ? topic.items : [];
};

export const searchVocabulary = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return getAllVocabulary().filter(item =>
    item.word.toLowerCase().includes(lowerQuery) ||
    item.definition.toLowerCase().includes(lowerQuery)
  );
};
