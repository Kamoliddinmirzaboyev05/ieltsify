# Smart Article - Yangi Xususiyatlar

## ✅ Qo'shilgan Funksiyalar

### 1. **Highlight va Popup Menyu** 🎯

Foydalanuvchi article da biror so'z yoki iborani highlight qilganda:
- Popup menyu avtomatik chiqadi
- 2 ta tugma ko'rsatiladi:
  - **Tarjima** - So'z haqida to'liq ma'lumot
  - **Tinglash** - So'zni talaffuz qilish

### 2. **AI-Powered Tarjima va Ta'rif** 🤖

**"Tarjima"** tugmasini bosganda modal oynada ko'rsatiladi:

#### A. So'z Ma'lumotlari:
- **So'z/Ibora**: Tanlangan matn
- **Daraja**: CEFR level (A1-C2)
- **Inglizcha Ta'rif**: Aniq va qisqa ta'rif
- **O'zbekcha Tarjima**: To'liq tarjima
- **Misollar**: 2 ta misol jumla

#### B. Dizayn:
- Daraja badge (ko'k rang)
- Ta'rif (kulrang fon)
- Tarjima (yashil fon, qalin shrift)
- Misollar (chap tomonda ko'k chiziq)

#### C. Amallar:
- **Vocabulary ga qo'shish** - Bir bosishda qo'shish
- **Tinglash** - So'zni eshitish

### 3. **Google Gemini API Integratsiyasi** 🔗

AI orqali real-time tarjima va ta'rif:

```javascript
const prompt = `Analyze this English word/phrase and provide information in JSON format:

Word/Phrase: "${selectedText}"

Return ONLY a JSON object with this exact structure:
{
  "word": "...",
  "definition": "Clear English definition",
  "translation": "O'zbek tilidagi tarjima",
  "examples": ["Example 1", "Example 2"],
  "level": "A1/A2/B1/B2/C1/C2"
}`;
```

### 4. **Vocabulary ga Avtomatik Qo'shish** 📚

Modal oynada "Vocabulary ga qo'shish" tugmasi:
- So'z, ta'rif, tarjima, misollar bilan birga qo'shiladi
- CEFR level avtomatik belgilanadi
- Agar so'z allaqachon mavjud bo'lsa, ogohlantirish ko'rsatiladi
- Muvaffaqiyatli qo'shilganda xabar chiqadi

### 5. **Text-to-Speech (TTS)** 🔊

2 joyda TTS mavjud:
1. **Popup menyuda**: Tanlangan so'zni tinglash
2. **Modal oynada**: So'zni qayta tinglash

### 6. **AI Article Analysis** 📊

"Analyze Article" tugmasi:
- Article haqida to'liq tahlil
- Asosiy vocabulary
- Main ideas
- IELTS relevance
- Practice tips

## 🎨 Foydalanuvchi Tajribasi

### Qanday Ishlaydi:

1. **Article Tanlash**:
   - Smart Article sahifasiga o'ting
   - Articleni tanlang va "Read" bosing

2. **So'z Highlight Qilish**:
   - Biror so'z yoki iborani sichqoncha bilan belgilang
   - Popup menyu avtomatik chiqadi

3. **Tarjima Olish**:
   - "Tarjima" tugmasini bosing
   - AI 2-3 soniyada ma'lumot tayyorlaydi
   - Modal oynada to'liq ma'lumot ko'rsatiladi

4. **Vocabulary ga Qo'shish**:
   - Modal oynada "Vocabulary ga qo'shish" tugmasini bosing
   - So'z avtomatik Vocabulary sahifasiga qo'shiladi
   - Keyinchalik Vocabulary sahifasida ko'rish mumkin

5. **Tinglash**:
   - "Tinglash" tugmasini bosing
   - So'z talaffuz qilinadi

## 🔧 Texnik Tafsilotlar

### Ishlatilgan Texnologiyalar:
- **Google Gemini API** - AI tarjima va tahlil
- **Web Speech API** - Text-to-Speech
- **React Hooks** - State management
- **Ant Design** - UI components

### API Request Format:
```typescript
{
  word: string;
  definition: string;
  translation: string;
  examples: string[];
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}
```

### LocalStorage:
- Vocabulary ma'lumotlari localStorage da saqlanadi
- Key: `ieltsify_vocabulary`
- Format: JSON array

## 🎯 IELTS Uchun Foyda

### Vocabulary Building:
- Har bir yangi so'zni darhol o'rganish
- Kontekstda ko'rish (article ichida)
- Misollar bilan mustahkamlash
- Daraja bo'yicha tashkil qilish

### Reading Practice:
- Real IELTS article formatida
- Highlight va note olish
- AI tahlil orqali tushunish
- Active reading skills

### Time Efficiency:
- Tez tarjima (2-3 soniya)
- Bir bosishda vocabulary ga qo'shish
- Qayta-qayta tinglash imkoniyati

## 📱 Responsive Design

- **Desktop**: Popup menyu so'z ustida
- **Mobile**: Popup menyu ekran o'rtasida
- **Tablet**: Moslashuvchan layout

## 🌐 Dark/Light Mode

- Popup menyu dark mode da qora fon
- Modal oyna theme ga moslashadi
- Barcha ranglar contrast uchun optimallashtirilgan

## ⚡ Performance

- AI response: 2-3 soniya
- Popup menyu: Instant
- TTS: 1 soniya
- Vocabulary qo'shish: Instant

## 🔒 Xavfsizlik

- API key .env faylida
- Client-side validation
- Error handling
- User-friendly xato xabarlari

## 📝 Eslatma

**API Key Kerak**: Google Gemini API key .env faylida bo'lishi shart:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

Agar API key yo'q bo'lsa:
1. https://makersuite.google.com/app/apikey
2. "Create API Key" tugmasi
3. .env fayliga qo'yish
4. Serverni qayta ishga tushirish

## 🎉 Natija

Smart Article endi to'liq interactive:
- ✅ Highlight va popup menyu
- ✅ AI tarjima va ta'rif
- ✅ O'zbekcha tarjima
- ✅ Misollar
- ✅ Vocabulary ga qo'shish
- ✅ Text-to-Speech
- ✅ AI article tahlil
- ✅ Dark/Light mode
- ✅ Responsive design

Bu IELTS tayyorgarlik uchun juda foydali tool!
