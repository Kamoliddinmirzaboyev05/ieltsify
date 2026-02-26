// IELTS Vocabulary Data - 10 Topics

export interface VocabWord {
  word: string;
  trans: string;
  example: string;
}

export interface VocabTopic {
  id: string;
  title: string;
  words: VocabWord[];
}

export const VOCABULARY_TOPICS: VocabTopic[] = [
  {
    id: "travel",
    title: "Travel & Transport",
    words: [
      { word: "journey", trans: "sayohat", example: "The journey to London took three hours." },
      { word: "destination", trans: "manzil", example: "Paris is a popular tourist destination." },
      { word: "departure", trans: "jo'nash", example: "The departure time is 9 AM." },
      { word: "arrival", trans: "kelish", example: "What time is the arrival in New York?" },
      { word: "luggage", trans: "bagaj", example: "Please keep your luggage with you." },
      { word: "passport", trans: "pasport", example: "Don't forget your passport." },
      { word: "border", trans: "chegara", example: "We crossed the border at midnight." },
      { word: "customs", trans: "bojxona", example: "We had to go through customs at the airport." },
      { word: "flight", trans: "parvoz", example: "The flight was delayed by two hours." },
      { word: "platform", trans: "platforma", example: "The train leaves from platform 5." },
      { word: "schedule", trans: "jadval", example: "Check the bus schedule online." },
      { word: "reservation", trans: "bron", example: "I made a reservation for two nights." },
      { word: "accommodation", trans: "turar joy", example: "We need to find accommodation for the trip." },
      { word: "currency", trans: "valyuta", example: "Can I exchange currency at the airport?" },
      { word: "sightseeing", trans: "diqqatga sazovor joylarni ko'rish", example: "We spent the morning sightseeing." },
      { word: "guidebook", trans: "sayohat qo'llanmasi", example: "She bought a guidebook about Italy." },
      { word: "itinerary", trans: "sayohat rejasi", example: "Our itinerary includes five cities." },
      { word: "fare", trans: "yo'l haqi", example: "The bus fare is two dollars." },
      { word: "route", trans: "yo'nalish", example: "This is the fastest route to the city." },
      { word: "delay", trans: "kechikish", example: "There was a delay at the airport." },
      { word: "return ticket", trans: "qaytish bileti", example: "I bought a return ticket to Madrid." },
      { word: "local", trans: "mahalliy", example: "Try local food when you travel." },
      { word: "tourist", trans: "turist", example: "Many tourists visit this museum." },
      { word: "adventure", trans: "sarguzasht", example: "Traveling is a great adventure." },
      { word: "abroad", trans: "chet elda", example: "She has lived abroad for five years." },
      { word: "ferry", trans: "kema (parom)", example: "We took the ferry to the island." },
      { word: "highway", trans: "magistral yo'l", example: "Drive along the highway for 20 miles." },
      { word: "transfer", trans: "o'tish (transport)", example: "There is a transfer in Frankfurt." },
      { word: "visa", trans: "viza", example: "You need a visa to enter that country." },
      { word: "carrier", trans: "aviakompaniya", example: "This carrier offers cheap flights." },
      { word: "overnight", trans: "tunda / bir kechada", example: "We took an overnight train to Paris." },
      { word: "vehicle", trans: "transport vositasi", example: "Park your vehicle in the garage." },
      { word: "intersection", trans: "chorrahа", example: "Turn left at the intersection." },
      { word: "tourist attraction", trans: "turistik joy", example: "The Eiffel Tower is a great tourist attraction." },
      { word: "railway", trans: "temir yo'l", example: "The railway connects the two cities." },
      { word: "suburb", trans: "shahar atrofi", example: "They live in the suburbs of London." },
      { word: "journey planner", trans: "yo'l rejalashtiruvchi", example: "Use a journey planner to find the best route." },
      { word: "passenger", trans: "yo'lovchi", example: "All passengers must show their tickets." },
      { word: "boarding", trans: "samolyotga / kemaga chiqish", example: "Boarding starts at 8:30 AM." },
      { word: "explore", trans: "o'rganmoq / kashf etmoq", example: "I love to explore new cities." },
      { word: "stopover", trans: "to'xtash", example: "We had a stopover in Dubai." },
      { word: "map", trans: "xarita", example: "I used a map to find the museum." },
      { word: "connection", trans: "ulanish (reyslar)", example: "Miss the connection and you'll be late." },
      { word: "cabin crew", trans: "bort xizmatchilari", example: "The cabin crew served drinks." },
      { word: "travel insurance", trans: "sayohat sug'urtasi", example: "Always buy travel insurance." },
      { word: "check-in", trans: "ro'yxatdan o'tish", example: "Online check-in is available." },
      { word: "journey time", trans: "yo'l vaqti", example: "The journey time is about 4 hours." },
      { word: "roundabout", trans: "aylana chorraха", example: "Turn right at the roundabout." },
      { word: "port", trans: "port", example: "The ship arrived at the port." },
      { word: "cruise", trans: "kruiz", example: "They went on a cruise around the Mediterranean." },
    ]
  },
  {
    id: "health",
    title: "Health & Body",
    words: [
      { word: "symptom", trans: "belgi (kasallik)", example: "A sore throat is a symptom of a cold." },
      { word: "appointment", trans: "uchrashuv (doktorga)", example: "I have a doctor's appointment tomorrow." },
      { word: "prescription", trans: "retsept", example: "The doctor gave me a prescription." },
      { word: "treatment", trans: "davolash", example: "The treatment takes three weeks." },
      { word: "recovery", trans: "tuzalish", example: "Her recovery was quick." },
      { word: "injury", trans: "shikastlanish", example: "He had a knee injury." },
      { word: "pharmacy", trans: "dorixona", example: "Buy the medicine at the pharmacy." },
      { word: "surgeon", trans: "jarroh", example: "The surgeon operated for five hours." },
      { word: "emergency", trans: "favqulodda holat", example: "Call 911 in an emergency." },
      { word: "vaccination", trans: "emlash", example: "Children need vaccinations." },
      { word: "blood pressure", trans: "qon bosimi", example: "High blood pressure is dangerous." },
      { word: "diet", trans: "parhez / ovqatlanish", example: "A healthy diet is important." },
      { word: "exercise", trans: "jismoniy mashq", example: "Regular exercise keeps you fit." },
      { word: "allergy", trans: "allergiya", example: "She has an allergy to peanuts." },
      { word: "dose", trans: "doza", example: "Take one dose three times a day." },
      { word: "pulse", trans: "tomir urishi", example: "The nurse checked my pulse." },
      { word: "faint", trans: "hushini yo'qotmoq", example: "She fainted in the heat." },
      { word: "swollen", trans: "shishgan", example: "My ankle is swollen." },
      { word: "ache", trans: "og'riq (sekin)", example: "I have a backache today." },
      { word: "fever", trans: "isitma", example: "He has a high fever." },
      { word: "nausea", trans: "ko'ngil aynishi", example: "She felt nausea on the boat." },
      { word: "bandage", trans: "bog'lam", example: "Put a bandage on the cut." },
      { word: "checkup", trans: "tekshiruv", example: "Go for a regular checkup." },
      { word: "chronic", trans: "surunkali", example: "He has a chronic illness." },
      { word: "disabled", trans: "nogironlik", example: "She is disabled and uses a wheelchair." },
      { word: "heal", trans: "tuzalmoq / bitmoq", example: "The wound healed in a week." },
      { word: "painkiller", trans: "og'riq qoldiruvchi", example: "The doctor prescribed a painkiller." },
      { word: "healthy", trans: "sog'lom", example: "She lives a healthy lifestyle." },
      { word: "specialist", trans: "mutaxassis", example: "See a specialist for your back pain." },
      { word: "ward", trans: "shifoxona palatasi", example: "He is in the children's ward." },
    ]
  },
  {
    id: "work",
    title: "Work & Career",
    words: [
      { word: "application", trans: "ariza / ilova", example: "She sent her job application." },
      { word: "interview", trans: "suhbat", example: "I have a job interview tomorrow." },
      { word: "salary", trans: "maosh", example: "His salary is quite good." },
      { word: "promotion", trans: "lavozim ko'tarilishi", example: "She got a promotion last month." },
      { word: "resign", trans: "iste'fo bermoq", example: "He decided to resign from his job." },
      { word: "employer", trans: "ish beruvchi", example: "My employer is very supportive." },
      { word: "employee", trans: "xodim", example: "She is a new employee." },
      { word: "deadline", trans: "muddat", example: "The deadline for the project is Friday." },
      { word: "colleague", trans: "hamkasb", example: "My colleague helped me with the report." },
      { word: "overtime", trans: "qo'shimcha vaqt (ish)", example: "I worked overtime this week." },
    ]
  },
  {
    id: "education",
    title: "Education",
    words: [
      { word: "curriculum", trans: "o'quv dasturi", example: "The curriculum includes science and art." },
      { word: "assignment", trans: "vazifa / topshiriq", example: "Submit your assignment by Monday." },
      { word: "lecture", trans: "ma'ruza", example: "The lecture starts at 9 AM." },
      { word: "semester", trans: "semestr", example: "The spring semester begins in January." },
      { word: "scholarship", trans: "stipendiya", example: "She won a full scholarship." },
      { word: "graduate", trans: "bitirmoq / bitiruvchi", example: "He graduated from university." },
      { word: "tuition", trans: "o'qish to'lovi", example: "Tuition fees are increasing." },
      { word: "enroll", trans: "ro'yxatdan o'tmoq", example: "Enroll before the deadline." },
      { word: "campus", trans: "kampus", example: "The campus is very large." },
      { word: "thesis", trans: "dissertatsiya", example: "She is writing her thesis." },
    ]
  },
  {
    id: "technology",
    title: "Technology & Internet",
    words: [
      { word: "software", trans: "dasturiy ta'minot", example: "Install the latest software." },
      { word: "update", trans: "yangilash", example: "Please update your phone." },
      { word: "download", trans: "yuklab olish", example: "Download the app for free." },
      { word: "upload", trans: "yuklash (serverga)", example: "Upload your photo here." },
      { word: "connection", trans: "internet ulanishi", example: "The internet connection is slow." },
      { word: "search engine", trans: "qidiruv tizimi", example: "Use a search engine to find information." },
      { word: "password", trans: "parol", example: "Don't share your password." },
      { word: "account", trans: "akkaunt / hisob", example: "Create an account to continue." },
      { word: "backup", trans: "zaxira nusxa", example: "Always backup your files." },
      { word: "virus", trans: "kompyuter virusi", example: "My computer has a virus." },
    ]
  },
  {
    id: "food",
    title: "Food & Cooking",
    words: [
      { word: "ingredient", trans: "tarkibiy qism", example: "What ingredients do you need?" },
      { word: "recipe", trans: "retsept", example: "Follow the recipe carefully." },
      { word: "mixture", trans: "aralashma", example: "Stir the mixture well." },
      { word: "portion", trans: "porsiya", example: "This portion is very large." },
      { word: "flavour", trans: "ta'm / lazzat", example: "This soup has a great flavour." },
      { word: "spicy", trans: "achchiq", example: "The food was too spicy for me." },
      { word: "mild", trans: "yumshoq ta'mli", example: "I prefer mild food." },
      { word: "fresh", trans: "yangi / frеsh", example: "Always use fresh vegetables." },
      { word: "frozen", trans: "muzlatilgan", example: "Keep frozen food in the freezer." },
      { word: "organic", trans: "organik", example: "She buys organic vegetables." },
    ]
  },
  {
    id: "environment",
    title: "Environment & Nature",
    words: [
      { word: "pollution", trans: "ifloslanish", example: "Air pollution is a big problem." },
      { word: "climate change", trans: "iqlim o'zgarishi", example: "Climate change affects everyone." },
      { word: "recycle", trans: "qayta ishlash", example: "Recycle paper, glass and plastic." },
      { word: "renewable", trans: "qayta tiklanadigan", example: "Solar is a renewable energy source." },
      { word: "deforestation", trans: "o'rmonlarni kesish", example: "Deforestation destroys wildlife." },
      { word: "wildlife", trans: "yovvoyi tabiat", example: "Protect local wildlife." },
      { word: "endangered", trans: "yo'q bo'lib ketish xavfi ostida", example: "Tigers are endangered animals." },
      { word: "extinct", trans: "yo'q bo'lib ketgan", example: "Dinosaurs are now extinct." },
      { word: "ecosystem", trans: "ekosistema", example: "The rainforest ecosystem is complex." },
      { word: "sustainable", trans: "barqaror", example: "We need sustainable farming." },
    ]
  },
  {
    id: "money",
    title: "Money & Shopping",
    words: [
      { word: "afford", trans: "imkoniyati bo'lmoq", example: "I can't afford a new car." },
      { word: "discount", trans: "chegirma", example: "There is a 20% discount today." },
      { word: "receipt", trans: "kvitansiya", example: "Keep your receipt for returns." },
      { word: "refund", trans: "pulni qaytarish", example: "I asked for a refund." },
      { word: "bargain", trans: "arzon buyum / savdolashmoq", example: "That coat was a real bargain!" },
      { word: "invest", trans: "investitsiya qilmoq", example: "He invests in property." },
      { word: "loan", trans: "qarz / kredit", example: "She took out a loan." },
      { word: "mortgage", trans: "ipoteka", example: "They have a mortgage on their house." },
      { word: "tax", trans: "soliq", example: "Pay your taxes on time." },
      { word: "budget", trans: "byudjet", example: "We have a tight budget." },
    ]
  },
  {
    id: "relationships",
    title: "Relationships & Feelings",
    words: [
      { word: "affection", trans: "mehribonlik / mehr", example: "She shows affection for her children." },
      { word: "trust", trans: "ishonch", example: "Trust is important in a relationship." },
      { word: "argue", trans: "bahslashmoq", example: "They argue sometimes but still love each other." },
      { word: "forgive", trans: "kechirmoq", example: "Can you forgive me?" },
      { word: "lonely", trans: "yolg'iz", example: "She felt lonely in the new city." },
      { word: "jealous", trans: "hasadgo'y / rashkchi", example: "He was jealous of her success." },
      { word: "grateful", trans: "minnatdor", example: "I am very grateful for your help." },
      { word: "proud", trans: "g'ururli", example: "She is proud of her son." },
      { word: "embarrassed", trans: "uyalgan", example: "He was embarrassed by the mistake." },
      { word: "nervous", trans: "asabiy / xavotirli", example: "She felt nervous before the test." },
    ]
  },
  {
    id: "housing",
    title: "Housing & Home",
    words: [
      { word: "rent", trans: "ijara", example: "The rent is $800 a month." },
      { word: "landlord", trans: "uy egasi", example: "My landlord is very kind." },
      { word: "tenant", trans: "ijarachilar", example: "The tenant pays rent on time." },
      { word: "mortgage", trans: "ipoteka", example: "They are paying off their mortgage." },
      { word: "property", trans: "mol-mulk / ko'chmas mulk", example: "Property prices are rising." },
      { word: "lease", trans: "ijara shartnomasi", example: "Sign the lease before moving in." },
      { word: "furnish", trans: "mebel bilan jihozlamoq", example: "The flat is fully furnished." },
      { word: "appliance", trans: "maishiy texnika", example: "All kitchen appliances are included." },
      { word: "utility bill", trans: "kommunal to'lovlar", example: "Pay your utility bills monthly." },
      { word: "neighbourhood", trans: "mahalla / qo'shnilik", example: "We live in a safe neighbourhood." },
    ]
  }
];
