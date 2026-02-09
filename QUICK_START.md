# 🚀 IELTSify - Tez Boshlash Qo'llanmasi

## Yangi Funksiyalar

### 1️⃣ Vocabulary (So'z Boyligini Boshqarish)
**Yo'l**: `/dashboard/vocabulary`

**Imkoniyatlar**:
- ✅ So'zlarni qo'shish va tahrirlash
- ✅ CEFR darajasi (A1-C2)
- ✅ Mastery progress (o'rganish darajasi)
- ✅ Text-to-Speech (talaffuz eshitish)
- ✅ Qidiruv va filtrlash

**Qanday ishlatish**:
1. "Add Word" tugmasini bosing
2. So'z, ta'rif va daraja kiriting
3. "Got It!" tugmasi bilan o'rganganingizni belgilang
4. Volume ikonkasi bilan talaffuzni eshiting

---

### 2️⃣ Smart Article (Aqlli Maqola O'qish)
**Yo'l**: `/dashboard/smart-article`

**Imkoniyatlar**:
- ✅ Matnni highlight qilish
- ✅ Tanlangan so'zni tarjima qilish
- ✅ Vocabulary ga qo'shish (bir bosishda!)
- ✅ AI tahlil olish
- ✅ Text-to-Speech

**Qanday ishlatish**:
1. Maqolani tanlang
2. Istalgan matnni highlight qiling
3. Paydo bo'lgan menyudan:
   - "Define" - ta'rifini ko'ring
   - "Add to Vocab" - vocabulary ga qo'shing
   - "Speak" - talaffuzni eshiting
4. "Analyze Article" bilan AI tahlil oling

---

### 3️⃣ Resource Manager (Resurs Boshqaruvchisi)
**Yo'l**: `/dashboard/resource-manager`

**Imkoniyatlar**:
- ✅ HTML maqolalar yuklash
- ✅ YouTube video qo'shish
- ✅ So'zlar qo'shish
- ✅ Barcha ma'lumotlar localStorage da saqlanadi

**Qanday ishlatish**:

**Articles (Maqolalar)**:
1. "Articles" tabiga o'ting
2. HTML fayl yuklang yoki HTML kodni joylashtiring
3. Kategoriya va qiyinlik darajasini tanlang
4. "Upload Article" tugmasini bosing
5. Maqola darhol Smart Article da paydo bo'ladi!

**Listening (Tinglash)**:
1. "Listening" tabiga o'ting
2. YouTube URL kiriting
3. Kategoriya tanlang (Academic, General, Podcast, Lecture)
4. "Add Listening Resource" tugmasini bosing
5. Video darhol Listening Hub da paydo bo'ladi!

**Vocabulary (So'zlar)**:
1. "Vocabulary" tabiga o'ting
2. So'z va ta'rifni kiriting
3. CEFR darajasini tanlang
4. "Add to Vocabulary" tugmasini bosing

---

### 4️⃣ Listening Hub (Tinglash Markazi)
**Yo'l**: `/dashboard/listening-hub`

**Imkoniyatlar**:
- ✅ YouTube video ko'rish
- ✅ Kategoriyalar bo'yicha filtrlash
- ✅ Video ko'rayotganda yozuv qilish
- ✅ Yozuvlar avtomatik saqlanadi

**Qanday ishlatish**:
1. Kategoriya tanlang (yoki "All Categories")
2. Videoni tanlang
3. Video ko'ring va o'ng tarafda yozuv qiling
4. "Save Notes" tugmasini bosing

---

### 5️⃣ Global Search (Umumiy Qidiruv)
**Klaviatura**: `Ctrl + K` (Windows) yoki `Cmd + K` (Mac)

**Imkoniyatlar**:
- ✅ Barcha modullar bo'yicha qidiruv
- ✅ Vocabulary, Articles, Listening
- ✅ Real-time natijalar
- ✅ Tez navigatsiya

**Qanday ishlatish**:
1. `Ctrl + K` bosing
2. Qidiruv so'zini kiriting
3. Natijani bosing - tegishli sahifaga o'tadi
4. `ESC` bosing - yopiladi

---

## 💡 Maslahatlar

### Vocabulary o'rganish uchun:
1. Smart Article da maqola o'qing
2. Noma'lum so'zlarni highlight qiling
3. "Add to Vocab" bosing
4. Vocabulary sahifasida takrorlang
5. "Got It!" bilan o'rganganingizni belgilang

### Listening mashq qilish uchun:
1. Resource Manager da YouTube video qo'shing
2. Listening Hub ga o'ting
3. Video ko'ring va yozuv qiling
4. Yozuvlaringizni keyinroq ko'rib chiqing

### Maqola o'qish uchun:
1. Resource Manager da HTML maqola yuklang
2. Smart Article ga o'ting
3. Maqolani o'qing va so'zlarni highlight qiling
4. AI tahlil oling

---

## 🎯 Tizim Arxitekturasi

### Ma'lumotlar Saqlash
Barcha ma'lumotlar brauzer localStorage da saqlanadi:
- `ieltsify_vocabulary` - so'zlar
- `ieltsify_articles` - maqolalar
- `ieltsify_listening` - video resurslar
- `ieltsify_notes` - yozuvlar

### Xususiyatlar
- ✅ Offline ishlaydi
- ✅ Sahifa yangilanganda ma'lumotlar saqlanadi
- ✅ Server kerak emas
- ✅ Tez va xavfsiz

---

## 🔧 Texnik Ma'lumotlar

**Yaratilgan texnologiyalar**:
- React 19 + TypeScript
- Ant Design v6
- Framer Motion
- Web Speech API (TTS)
- localStorage API

**Yangi fayllar**:
```
src/
├── types/index.ts                    # TypeScript types
├── services/
│   ├── dataManager.ts               # Ma'lumotlar boshqaruvi
│   └── ttsService.ts                # Text-to-Speech
├── pages/
│   ├── VocabularyPage.tsx           # So'zlar sahifasi
│   ├── SmartArticlePage.tsx         # Aqlli maqola
│   ├── ResourceManagerPage.tsx      # Resurs boshqaruvchisi
│   └── ListeningHubPage.tsx         # Tinglash markazi
└── components/
    └── GlobalSearch.tsx             # Umumiy qidiruv
```

---

## 📱 Yangi Yo'llar (Routes)

| Yo'l | Sahifa | Tavsif |
|------|--------|--------|
| `/dashboard/vocabulary` | Vocabulary | So'zlar va flashcards |
| `/dashboard/smart-article` | Smart Article | Interaktiv maqola o'qish |
| `/dashboard/listening-hub` | Listening Hub | Video mashqlar |
| `/dashboard/resource-manager` | Resource Manager | Admin panel |

---

## 🎨 Dizayn Tizimi

**Ranglar**:
- Asosiy: `#10b981` (Emerald Green)
- Fon: `#0f172a` (Deep Sea Blue)
- Matn: `#ffffff` (White)

**Komponentlar**:
- Border radius: 12-16px
- Spacing: 16px/24px
- Font: Plus Jakarta Sans

---

## ⚡ Ishga Tushirish

```bash
# Paketlarni o'rnatish
npm install

# Development rejimida ishga tushirish
npm run dev

# Build qilish
npm run build
```

---

## 🎓 Workflow Misollari

### So'z qo'shish (3 usul):
1. **Resource Manager** → Vocabulary tab → Add
2. **Smart Article** → Highlight → "Add to Vocab"
3. **Vocabulary Page** → "Add Word" button

### Maqola yuklash va o'qish:
1. Resource Manager → Articles tab
2. HTML fayl yuklang
3. Smart Article ga o'ting
4. Maqolani tanlang va o'qing
5. So'zlarni highlight qiling

### Video qo'shish va mashq qilish:
1. Resource Manager → Listening tab
2. YouTube URL kiriting
3. Listening Hub ga o'ting
4. Videoni tanlang
5. Ko'ring va yozuv qiling

---

## 🔮 Kelajakdagi Yangilanishlar

- [ ] Real AI integratsiyasi (Google Gemini)
- [ ] Spaced repetition algoritmi
- [ ] Export/Import funksiyasi
- [ ] Cloud sync
- [ ] Advanced analytics
- [ ] Mobile app

---

**Savollar bo'lsa, README_FEATURES.md faylini o'qing!**

**Omad! 🎉**
