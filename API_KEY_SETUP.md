# Google Gemini API Key Sozlash

## ❌ Muammo
```
API key not valid. Please pass a valid API key.
```

## ✅ Yechim

### 1. Serverni To'xtatish
Agar server ishlab turgan bo'lsa, to'xtating (Ctrl+C yoki Terminal da Stop tugmasi).

### 2. .env Faylini Tekshirish
`.env` faylida API key to'g'ri formatda bo'lishi kerak:

```
VITE_GEMINI_API_KEY=AIzaSyCkR5X9W_8CBPMehnpkGJQIYg_U1mS9nn8
```

**MUHIM**: 
- API key `AIza` bilan boshlanishi kerak
- Boshida yoki oxirida bo'sh joy bo'lmasligi kerak
- Qo'shtirnoq (`"`) ishlatilmasligi kerak

### 3. Serverni Qayta Ishga Tushirish
```bash
npm run dev
```

Yoki Vite dev server:
```bash
npx vite
```

### 4. Brauzerda Yangilash
- Brauzerni to'liq yangilang (Ctrl+Shift+R yoki Cmd+Shift+R)
- Yoki cache ni tozalang va qayta yuklang

## 🔑 Yangi API Key Olish

Agar API key ishlamasa yoki yo'q bo'lsa:

1. **Google AI Studio ga kiring**:
   - https://makersuite.google.com/app/apikey
   - yoki https://aistudio.google.com/app/apikey

2. **API Key yarating**:
   - "Create API Key" tugmasini bosing
   - Loyihani tanlang yoki yangi yarating
   - API key nusxa olinadi

3. **.env fayliga qo'ying**:
   ```
   VITE_GEMINI_API_KEY=yangi_api_key_shu_yerga
   ```

4. **Serverni qayta ishga tushiring**

## 🔍 Tekshirish

API key to'g'ri ishlayotganini tekshirish:

1. Writing sahifasiga o'ting
2. Biror writing task yarating (Resource Manager da)
3. Taskni boshlang
4. Task 1 va Task 2 ni yozing
5. Submit qiling
6. Agar AI feedback ko'rsatilsa - hammasi to'g'ri! ✅

## ⚠️ Keng Tarqalgan Xatolar

### Xato 1: API key boshida "Y" harfi
```
❌ VITE_GEMINI_API_KEY=YAIzaSyCkR5X9W_8CBPMehnpkGJQIYg_U1mS9nn8
✅ VITE_GEMINI_API_KEY=AIzaSyCkR5X9W_8CBPMehnpkGJQIYg_U1mS9nn8
```

### Xato 2: Qo'shtirnoq ishlatilgan
```
❌ VITE_GEMINI_API_KEY="AIzaSyCkR5X9W_8CBPMehnpkGJQIYg_U1mS9nn8"
✅ VITE_GEMINI_API_KEY=AIzaSyCkR5X9W_8CBPMehnpkGJQIYg_U1mS9nn8
```

### Xato 3: Bo'sh joy bor
```
❌ VITE_GEMINI_API_KEY= AIzaSyCkR5X9W_8CBPMehnpkGJQIYg_U1mS9nn8
✅ VITE_GEMINI_API_KEY=AIzaSyCkR5X9W_8CBPMehnpkGJQIYg_U1mS9nn8
```

### Xato 4: Server qayta ishga tushirilmagan
.env faylini o'zgartirgandan keyin **ALBATTA** serverni qayta ishga tushiring!

## 📝 Eslatma

- API key **MAXFIY** ma'lumot
- Uni hech kimga bermang
- Git ga commit qilmang (.gitignore da .env bor)
- Agar leak bo'lsa, Google AI Studio da o'chirib, yangi yarating

## 🆘 Yordam

Agar muammo hal bo'lmasa:

1. `.env` faylini o'chiring va qaytadan yarating
2. `node_modules` ni o'chiring va `npm install` qiling
3. Browser cache ni tozalang
4. Yangi API key oling
5. Serverni to'liq to'xtating va qayta ishga tushiring

## ✅ Hozirgi Holat

API key tuzatildi:
- ✅ Boshidagi "Y" harfi olib tashlandi
- ✅ To'g'ri format: `AIzaSyCkR5X9W_8CBPMehnpkGJQIYg_U1mS9nn8`
- ⏳ Serverni qayta ishga tushiring!

**Keyingi qadam**: 
```bash
# Terminal da:
npm run dev
```

Keyin brauzerni yangilang va Writing testini sinab ko'ring!
