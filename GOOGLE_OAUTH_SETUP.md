# Google OAuth Setup Guide

## Umumiy ma'lumot

Bu qo'llanma IELTSIFY ilovasida Google OAuth autentifikatsiyasini sozlash bo'yicha batafsil ko'rsatmalar beradi.

## Muammo

Agar quyidagi xatolarni ko'rsangiz:

```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
Failed to load resource: the server responded with a status of 403
```

Bu xato Google OAuth Client ID sozlamalarida joriy domain (localhost yoki production URL) qo'shilmaganligini bildiradi.

```
Error: Invalid Google token
```

Bu xato backend Google ID token'ni verify qila olmayotganini bildiradi. Sabablari:
1. Backend'da Google Client ID noto'g'ri sozlangan
2. Backend'da `google-auth-library` kutubxonasi o'rnatilmagan yoki noto'g'ri ishlayapti
3. Frontend va Backend'da turli Client ID'lar ishlatilmoqda
4. Token muddati tugagan (token 1 soat amal qiladi)

## Yechim

### 1-qadam: Google Cloud Console'ga kirish

1. [Google Cloud Console](https://console.cloud.google.com/) ga kiring
2. Agar loyihangiz bo'lmasa, yangi loyiha yarating:
   - "Select a project" tugmasini bosing
   - "New Project" ni tanlang
   - Loyiha nomini kiriting (masalan: "IELTSIFY")
   - "Create" tugmasini bosing

### 2-qadam: OAuth Consent Screen sozlash

1. Chap menuda **APIs & Services** > **OAuth consent screen** ga o'ting
2. **User Type** ni tanlang:
   - **Internal**: Faqat sizning organizatsiya uchun (Google Workspace kerak)
   - **External**: Barcha foydalanuvchilar uchun (tavsiya etiladi)
3. **Create** tugmasini bosing

4. **OAuth consent screen** ma'lumotlarini to'ldiring:

   **App information:**
   - App name: `IELTSIFY`
   - User support email: sizning emailingiz
   - App logo: (ixtiyoriy) logotipingizni yuklang

   **App domain:**
   - Application home page: `https://your-domain.com` (yoki `http://localhost:5173` development uchun)
   - Application privacy policy link: `https://your-domain.com/privacy`
   - Application terms of service link: `https://your-domain.com/terms`

   **Authorized domains:**
   - `localhost` (development uchun)
   - `your-domain.com` (production uchun)
   - `vercel.app` (agar Vercel'da deploy qilsangiz)

   **Developer contact information:**
   - Email addresses: sizning emailingiz

5. **Save and Continue** tugmasini bosing

6. **Scopes** sahifasida quyidagi scope'larni qo'shing:
   - `email` - foydalanuvchi emailini olish
   - `profile` - foydalanuvchi profil ma'lumotlarini olish
   - `openid` - OpenID Connect autentifikatsiyasi

   **Add or Remove Scopes** tugmasini bosing va quyidagilarni tanlang:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`

7. **Save and Continue** tugmasini bosing

8. **Test users** sahifasida (agar External va Testing mode'da bo'lsa):
   - **Add Users** tugmasini bosing
   - Test foydalanuvchilar emaillarini qo'shing
   - **Save and Continue** tugmasini bosing

9. **Summary** sahifasida barcha ma'lumotlarni tekshiring va **Back to Dashboard** tugmasini bosing

### 3-qadam: OAuth 2.0 Client ID yaratish

1. Chap menuda **APIs & Services** > **Credentials** ga o'ting
2. Yuqorida **+ CREATE CREDENTIALS** tugmasini bosing
3. **OAuth client ID** ni tanlang
4. **Application type** ni tanlang: **Web application**
5. **Name** kiriting: `IELTSIFY Web Client`

6. **Authorized JavaScript origins** ga quyidagi URL'larni qo'shing:

   **Development (localhost):**
   ```
   http://localhost:5173
   http://localhost:3000
   http://127.0.0.1:5173
   ```

   **Production (Vercel yoki boshqa hosting):**
   ```
   https://your-app-name.vercel.app
   https://your-custom-domain.com
   ```

   Har bir URL'ni alohida qo'shing (+ ADD URI tugmasini bosing)

7. **Authorized redirect URIs** ga quyidagi URL'larni qo'shing:

   **Development:**
   ```
   http://localhost:5173
   http://localhost:5173/login
   http://localhost:5173/register
   http://localhost:5173/dashboard
   ```

   **Production:**
   ```
   https://your-app-name.vercel.app
   https://your-app-name.vercel.app/login
   https://your-app-name.vercel.app/register
   https://your-app-name.vercel.app/dashboard
   ```

8. **CREATE** tugmasini bosing

9. OAuth client yaratilgandan keyin, **Client ID** va **Client secret** ko'rsatiladi:
   - **Client ID** ni nusxalang (masalan: `123456789-abc.apps.googleusercontent.com`)
   - **Client secret** ni xavfsiz joyda saqlang (frontend'da kerak emas)

### 4-qadam: Environment variables sozlash

1. Loyihangizning root papkasida `.env` faylini yarating (agar yo'q bo'lsa)
2. Quyidagi ma'lumotlarni kiriting:

```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
VITE_API_BASE_URL=https://ieltsify.pythonanywhere.com
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
VITE_ENABLE_GOOGLE_AUTH=true
```

**Muhim:**
- `VITE_GOOGLE_CLIENT_ID` ni Google Cloud Console'dan olgan Client ID bilan almashtiring
- `VITE_ENABLE_GOOGLE_AUTH=true` qilib qo'ying (Google OAuth'ni yoqish uchun)
- `.env` faylini `.gitignore` ga qo'shing (xavfsizlik uchun)

### 5-qadam: Development serverni qayta ishga tushirish

```bash
# Terminal'da serverni to'xtating (Ctrl+C)
# Qayta ishga tushiring
npm run dev
```

Yoki:

```bash
yarn dev
```

### 6-qadam: Testlash

1. Brauzerda `http://localhost:5173/register` yoki `http://localhost:5173/login` ga o'ting
2. "Google bilan ro'yxatdan o'tish" yoki "Google bilan kirish" tugmasini ko'rishingiz kerak
3. Tugmani bosing va Google akkauntingizni tanlang
4. Ruxsat bering va dashboard'ga yo'naltirilishingiz kerak

## Backend Integration

### Backend endpoint

Backend'da quyidagi endpoint bo'lishi kerak:

```
POST /accounts/google/
```

**Request body:**
```json
{
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI3..."
}
```

**Response (muvaffaqiyatli):**
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
    "picture": "https://lh3.googleusercontent.com/..."
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Backend'da tekshirish kerak:

1. **Google ID token'ni verify qilish** (muhim!)
2. Foydalanuvchi ma'lumotlarini olish (email, name, picture)
3. Agar foydalanuvchi mavjud bo'lsa - login
4. Agar foydalanuvchi mavjud bo'lmasa - register
5. JWT access va refresh tokenlarni qaytarish

### Backend sozlamalari (Django example):

**1. Kutubxonalarni o'rnatish:**
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2
```

**2. settings.py:**
```python
# Google OAuth sozlamalari
GOOGLE_OAUTH_CLIENT_ID = "your-client-id.apps.googleusercontent.com"
GOOGLE_OAUTH_CLIENT_SECRET = "your-client-secret"  # Optional, frontend uchun kerak emas

# CORS sozlamalari
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-app.vercel.app",
]

CORS_ALLOW_CREDENTIALS = True
```

**3. views.py (Google OAuth endpoint):**
```python
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def google_auth(request):
    """Google OAuth login/register endpoint"""
    try:
        token = request.data.get('id_token')
        
        if not token:
            return Response(
                {'error': 'ID token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify the token
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                settings.GOOGLE_OAUTH_CLIENT_ID
            )
            
            # Token is valid, get user info
            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            picture = idinfo.get('picture', '')
            email_verified = idinfo.get('email_verified', False)
            
            if not email:
                return Response(
                    {'error': 'Email not found in token'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if user exists
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                    'email_verified': email_verified,
                }
            )
            
            # Update picture if provided
            if picture and hasattr(user, 'picture'):
                user.picture = picture
                user.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login successful' if not created else 'Registration successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': getattr(user, 'role', 'user'),
                    'is_vip': getattr(user, 'is_vip', False),
                    'vip_expires_at': getattr(user, 'vip_expires_at', None),
                    'email_verified': getattr(user, 'email_verified', email_verified),
                    'date_joined': user.date_joined,
                    'last_login': user.last_login,
                    'picture': picture,
                },
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            # Invalid token
            return Response(
                {'error': 'Invalid Google token', 'detail': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Exception as e:
        return Response(
            {'error': 'Server error', 'detail': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

**4. urls.py:**
```python
from django.urls import path
from . import views

urlpatterns = [
    path('accounts/google/', views.google_auth, name='google_auth'),
    # ... other urls
]
```

### Muhim eslatmalar:

1. **Client ID bir xil bo'lishi kerak**: Frontend va Backend'da bir xil Google Client ID ishlatilishi shart
2. **Token verify qilish**: Backend albatta token'ni `google.oauth2.id_token.verify_oauth2_token()` orqali verify qilishi kerak
3. **CORS sozlamalari**: Backend CORS'ni to'g'ri sozlash kerak
4. **HTTPS**: Production'da HTTPS ishlatish tavsiya etiladi

## Production Deployment (Vercel)

### 1. Vercel Environment Variables

Vercel dashboard'da loyihangizni oching:

1. **Settings** > **Environment Variables** ga o'ting
2. Quyidagi o'zgaruvchilarni qo'shing:
   - `VITE_GOOGLE_CLIENT_ID`: Google Client ID
   - `VITE_ENABLE_GOOGLE_AUTH`: `true`
   - `VITE_API_BASE_URL`: Backend URL
   - `VITE_GEMINI_API_KEY`: Gemini API key

3. **Save** tugmasini bosing

### 2. Google Cloud Console'da production URL qo'shish

1. Google Cloud Console > Credentials ga o'ting
2. OAuth 2.0 Client ID ni tanlang
3. **Authorized JavaScript origins** ga production URL qo'shing:
   ```
   https://your-app-name.vercel.app
   ```
4. **Authorized redirect URIs** ga qo'shing:
   ```
   https://your-app-name.vercel.app
   https://your-app-name.vercel.app/login
   https://your-app-name.vercel.app/register
   ```
5. **Save** tugmasini bosing

### 3. Vercel'ga deploy qilish

```bash
# Git'ga commit qiling
git add .
git commit -m "Add Google OAuth"
git push

# Yoki Vercel CLI orqali
vercel --prod
```

## Troubleshooting

### Xato 1: 403 Forbidden - Origin not allowed

**Sabab:** Authorized JavaScript origins'da joriy domain yo'q

**Yechim:**
1. Google Cloud Console > Credentials ga o'ting
2. OAuth Client ID ni tanlang
3. Authorized JavaScript origins'ga domain qo'shing
4. Save va brauzer cache'ni tozalang

### Xato 2: Redirect URI mismatch

**Sabab:** Authorized redirect URIs'da joriy URL yo'q

**Yechim:**
1. Google Cloud Console > Credentials ga o'ting
2. Authorized redirect URIs'ga URL qo'shing
3. Save va qayta urinib ko'ring

### Xato 3: Backend 400 error - Invalid token

**Sabab:** Backend Google ID token'ni verify qila olmayapti

**Yechim:**

1. **Backend'da Google Client ID tekshiring:**
   - Backend settings.py faylida `GOOGLE_OAUTH_CLIENT_ID` to'g'ri sozlanganligini tekshiring
   - Frontend `.env` faylidagi `VITE_GOOGLE_CLIENT_ID` bilan bir xil bo'lishi kerak

2. **Backend'da google-auth kutubxonasi o'rnatilganligini tekshiring:**
   ```bash
   pip install google-auth google-auth-oauthlib google-auth-httplib2
   ```

3. **Backend logs'ni tekshiring:**
   - Backend console'da qanday xato chiqayotganini ko'ring
   - Token verify qilish jarayonida xato bo'lishi mumkin

4. **Token muddatini tekshiring:**
   - Google ID token 1 soat amal qiladi
   - Agar token eski bo'lsa, qaytadan login qiling

5. **CORS sozlamalarini tekshiring:**
   - Backend CORS'da frontend domain ruxsat etilganligini tekshiring

6. **Client ID turini tekshiring:**
   - Google Cloud Console'da "Web application" turi tanlangan bo'lishi kerak
   - "Android" yoki "iOS" turi ishlamaydi

**Backend'da debug qilish:**
```python
# views.py
import logging
logger = logging.getLogger(__name__)

@api_view(['POST'])
def google_auth(request):
    token = request.data.get('id_token')
    logger.info(f"Received token length: {len(token) if token else 0}")
    
    try:
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            settings.GOOGLE_OAUTH_CLIENT_ID
        )
        logger.info(f"Token verified successfully for: {idinfo.get('email')}")
        # ... rest of code
    except ValueError as e:
        logger.error(f"Token verification failed: {str(e)}")
        return Response({'error': 'Invalid Google token', 'detail': str(e)})
```

### Xato 4: CORS error

**Sabab:** Backend CORS sozlamalari noto'g'ri

**Yechim:**
Backend'da CORS headers qo'shing (Django example):

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-app.vercel.app",
]

CORS_ALLOW_CREDENTIALS = True
```

### Xato 5: Google button ko'rinmayapti

**Sabab:** 
- `VITE_ENABLE_GOOGLE_AUTH` false
- `VITE_GOOGLE_CLIENT_ID` yo'q
- Google script yuklanmagan

**Yechim:**
1. `.env` faylini tekshiring
2. Serverni qayta ishga tushiring
3. Browser console'da xatolarni tekshiring
4. Network tab'da `accounts.google.com/gsi/client` yuklanganligini tekshiring

### Xato 6: "UserProfile object has no attribute 'is_vip'"

**Sabab:** Backend response'da kerakli fieldlar yo'q

**Yechim:**
Backend serializer'da barcha fieldlarni qo'shing:
- `id`, `username`, `email`
- `first_name`, `last_name`
- `role`, `is_vip`, `vip_expires_at`
- `email_verified`, `date_joined`, `last_login`
- `picture`

## Testing Checklist

- [ ] Google Cloud Console'da OAuth consent screen sozlangan
- [ ] OAuth Client ID yaratilgan
- [ ] Authorized JavaScript origins qo'shilgan
- [ ] Authorized redirect URIs qo'shilgan
- [ ] `.env` faylida Client ID to'g'ri
- [ ] `VITE_ENABLE_GOOGLE_AUTH=true`
- [ ] Development server qayta ishga tushirilgan
- [ ] Browser cache tozalangan
- [ ] Google button ko'rinmoqda
- [ ] Google orqali login/register ishlayapti
- [ ] Backend'ga token yuborilmoqda
- [ ] Backend'dan access/refresh tokenlar qaytmoqda
- [ ] Dashboard'ga redirect bo'lmoqda

## Qo'shimcha resurslar

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In JavaScript Library](https://developers.google.com/identity/gsi/web/guides/overview)

## Yordam

Agar muammo hal bo'lmasa:

1. Browser console'ni oching (F12) va xatolarni o'qing
2. Network tab'da request/response'larni tekshiring
3. Backend logs'ni tekshiring
4. Google Cloud Console'da OAuth consent screen statusini tekshiring
5. `.env` faylida barcha o'zgaruvchilar to'g'ri ekanligini tekshiring
