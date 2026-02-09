# Writing Simulator - Xavfsizlik Choralari

## ✅ Qo'shilgan Xavfsizlik Choralari

### 1. Copy/Paste/Cut Bloklash

**WritingSimulator.tsx** da quyidagi xavfsizlik choralari qo'shildi:

#### A. TextArea da:
- `onCopy` - Nusxa olishni bloklaydi
- `onCut` - Kesishni bloklaydi  
- `onPaste` - Qo'yishni bloklaydi
- `onContextMenu` - O'ng tugma menyusini bloklaydi

Har bir event da:
```javascript
e.preventDefault();
message.warning('Nusxa olish taqiqlanган!');
return false;
```

#### B. Keyboard Shortcut Bloklash:
useEffect orqali global keyboard event listener qo'shildi:

```javascript
const handleKeyDown = (e: KeyboardEvent) => {
  // Block Ctrl+C, Ctrl+V, Ctrl+X, Cmd+C, Cmd+V, Cmd+X
  if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
    e.preventDefault();
    message.warning('Nusxa olish/qo\'yish taqiqlanган!');
    return false;
  }
};
```

Bu quyidagilarni bloklaydi:
- **Windows/Linux**: Ctrl+C, Ctrl+V, Ctrl+X
- **Mac**: Cmd+C, Cmd+V, Cmd+X

#### C. Task Description Panel:
Chap panelda (task description) ham copy bloklangan:

```javascript
onCopy={(e) => e.preventDefault()}
onCut={(e) => e.preventDefault()}
onContextMenu={(e) => e.preventDefault()}
```

Va CSS orqali:
```css
userSelect: 'none',
WebkitUserSelect: 'none',
MozUserSelect: 'none',
msUserSelect: 'none',
```

## 🔒 Nima Bloklangan?

### Bloklangan Amallar:
1. ✅ Ctrl+C / Cmd+C (Copy)
2. ✅ Ctrl+V / Cmd+V (Paste)
3. ✅ Ctrl+X / Cmd+X (Cut)
4. ✅ O'ng tugma menyu (Context Menu)
5. ✅ Sichqoncha bilan select qilish (Task description panelda)

### Ruxsat Berilgan Amallar:
1. ✅ Yozish (typing)
2. ✅ Backspace/Delete
3. ✅ Arrow keys
4. ✅ Undo/Redo (Ctrl+Z, Ctrl+Y)
5. ✅ Select All (Ctrl+A) - faqat o'z yozgan matnini

## 🔐 API Key Xavfsizligi

### .env Fayli Yangilandi:
```
VITE_GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
```

**MUHIM**: 
- Eski API key leaked (sizib chiqgan)
- Yangi API key olish kerak: https://makersuite.google.com/app/apikey
- .env faylini hech qachon git ga commit qilmang
- .gitignore da .env mavjud

### API Key Olish:
1. https://makersuite.google.com/app/apikey ga kiring
2. "Create API Key" tugmasini bosing
3. API key ni nusxa oling
4. .env fayliga qo'ying:
   ```
   VITE_GEMINI_API_KEY=yangi_api_key_shu_yerga
   ```
5. Serverni qayta ishga tushiring

## 📝 Foydalanuvchi Tajribasi

Agar foydalanuvchi copy/paste qilmoqchi bo'lsa:
- Ogohlantirish xabari ko'rsatiladi: "Nusxa olish/qo'yish taqiqlanган!"
- Amal bajarilmaydi
- Foydalanuvchi faqat o'zi yozishi kerak

## 🎯 Maqsad

Bu xavfsizlik choralari IELTS Writing testining haqiqiy sharoitlarini taqlid qiladi:
- Foydalanuvchi faqat o'z bilimiga tayanadi
- Tashqi manbalardan nusxa olish mumkin emas
- Real test sharoitlari simulyatsiya qilinadi

## ⚠️ Eslatma

Bu xavfsizlik choralari 100% kafolat bermaydi, chunki:
- Browser developer tools orqali aylanib o'tish mumkin
- Screenshot olish mumkin
- Lekin oddiy foydalanuvchilar uchun yetarli

Agar qo'shimcha xavfsizlik kerak bo'lsa:
- Server-side monitoring qo'shish mumkin
- Webcam monitoring (proctoring)
- Screen recording detection
