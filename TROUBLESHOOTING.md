# Troubleshooting Guide

## Google OAuth Issues

### Error: "The given origin is not allowed for the given client ID"

**Sabab**: Google Cloud Console'da joriy domain (localhost yoki production URL) authorized origins'ga qo'shilmagan.

**Yechim**:
1. [Google Cloud Console](https://console.cloud.google.com/) ga kiring
2. **APIs & Services** > **Credentials** ga o'ting
3. OAuth 2.0 Client ID ni tanlang
4. **Authorized JavaScript origins** ga quyidagilarni qo'shing:
   - Development: `http://localhost:5173`
   - Production: `https://your-app.vercel.app`
5. **Save** bosing va serverni qayta ishga tushiring

Batafsil: [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

---

### Error: "'UserProfile' object has no attribute 'is_vip'"

**Sabab**: Backend'dagi Google OAuth endpoint response formati frontend bilan mos kelmayapti.

**Yechim**: Backend developer bilan bog'laning va quyidagi response formatini ta'minlashni so'rang:

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "is_vip": false,
    "vip_expires_at": null,
    "email_verified": true,
    "date_joined": "2024-01-01T00:00:00Z",
    "last_login": null,
    "picture": "https://..."
  },
  "tokens": {
    "access": "eyJ...",
    "refresh": "eyJ..."
  }
}
```

---

## Build Issues

### Error: "Module not found" or "Cannot find module"

**Yechim**:
```bash
# node_modules'ni o'chiring va qayta o'rnating
rm -rf node_modules package-lock.json
npm install
```

---

### Error: TypeScript compilation errors

**Yechim**:
```bash
# TypeScript cache'ni tozalang
rm -rf node_modules/.cache
npm run build
```

---

## Environment Variables Issues

### Error: "API Key is missing"

**Yechim**:
1. `.env` faylini tekshiring
2. Barcha kerakli o'zgaruvchilar mavjudligini tasdiqlang:
   ```env
   VITE_GEMINI_API_KEY=your_key_here
   VITE_API_BASE_URL=https://ieltsify.pythonanywhere.com
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   ```
3. Serverni qayta ishga tushiring (Ctrl+C, keyin `npm run dev`)

---

### Error: Environment variables not working in production

**Yechim** (Vercel):
1. Vercel dashboard'ga kiring
2. Project Settings > Environment Variables
3. Barcha o'zgaruvchilarni qo'shing
4. Redeploy qiling

---

## Backend API Issues

### Error: "Failed to fetch" or "Network error"

**Sabab**: Backend API ishlamayapti yoki CORS sozlamalari noto'g'ri.

**Yechim**:
1. Backend URL'ni tekshiring: `https://ieltsify.pythonanywhere.com`
2. Backend CORS sozlamalarini tekshiring
3. Browser console'da Network tab'ni oching va request details'ni ko'ring

---

### Error: 401 Unauthorized

**Sabab**: Token muddati tugagan yoki noto'g'ri.

**Yechim**:
```javascript
// Browser console'da
localStorage.clear()
// Keyin qayta login qiling
```

---

### Error: 404 - HTML fayl topilmadi (Reading/Listening)

**Sabab**: Backend serverda HTML fayl mavjud emas yoki URL noto'g'ri.

**Xato misoli**:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
ieltsify.pythonanywhere.com/media/reading_passages/html/2026/02/reading_cdi.html
```

**Yechim**:

1. **Backend'da faylni tekshiring**:
   - PythonAnywhere yoki backend serverga kiring
   - `/media/reading_passages/html/` yoki `/media/listening_tests/html/` papkasini tekshiring
   - Fayl mavjudligini tasdiqlang

2. **URL'ni to'g'ri formatda tekshiring**:
   ```
   https://ieltsify.pythonanywhere.com/media/reading_passages/html/2026/02/reading_cdi.html
   ```

3. **Backend MEDIA_URL va MEDIA_ROOT sozlamalarini tekshiring** (Django):
   ```python
   # settings.py
   MEDIA_URL = '/media/'
   MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
   ```

4. **Static files serving sozlamalarini tekshiring** (PythonAnywhere):
   - Web tab > Static files
   - URL: `/media/`
   - Directory: `/home/yourusername/yourproject/media/`

5. **Fayl permissions'ni tekshiring**:
   ```bash
   chmod -R 755 /path/to/media/
   ```

6. **CORS sozlamalarini tekshiring** (Django):
   ```python
   # settings.py
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
       "https://your-app.vercel.app",
   ]
   
   # Media fayllar uchun
   CORS_ALLOW_ALL_ORIGINS = True  # Yoki specific origins
   ```

7. **Browser console'da to'liq xatoni ko'ring**:
   - F12 > Network tab
   - Failed request'ni bosing
   - Headers va Response'ni tekshiring

**Vaqtinchalik yechim**: Agar HTML fayl hali yuklanmagan bo'lsa, backend admin panel orqali yangi test/passage yarating va HTML faylni yuklang.

---

## Deployment Issues (Vercel)

### Error: 404 on page refresh

**Sabab**: SPA routing sozlanmagan.

**Yechim**: `vercel.json` fayli mavjudligini tekshiring:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Error: Build fails on Vercel

**Yechim**:
1. Local'da build qiling: `npm run build`
2. Xatolarni tuzating
3. Commit va push qiling
4. Vercel avtomatik qayta deploy qiladi

---

## Performance Issues

### Large bundle size warning

**Yechim**: Code splitting qo'shing `vite.config.ts` da:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        }
      }
    }
  }
})
```

---

## Common Development Issues

### Port already in use

**Yechim**:
```bash
# Port'ni o'zgartiring
npm run dev -- --port 3000

# Yoki process'ni to'xtating
lsof -ti:5173 | xargs kill -9
```

---

### Hot reload not working

**Yechim**:
1. `.vite` cache'ni o'chiring: `rm -rf node_modules/.vite`
2. Serverni qayta ishga tushiring

---

## Need More Help?

1. Browser console'dagi xatolarni to'liq o'qing
2. Network tab'da request/response'larni tekshiring
3. Backend logs'ni tekshiring
4. GitHub Issues'da qidirib ko'ring
5. Yangi issue yarating batafsil ma'lumot bilan
