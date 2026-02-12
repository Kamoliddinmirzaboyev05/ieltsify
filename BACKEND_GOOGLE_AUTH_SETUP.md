# Backend Google OAuth Setup (Django)

Bu qo'llanma backend'da Google OAuth'ni sozlash uchun.

## 1. Python kutubxonalarini o'rnatish

Backend serverida quyidagi buyruqlarni bajaring:

```bash
# Virtual environment'ni aktivlashtiring (agar bor bo'lsa)
source venv/bin/activate  # Linux/Mac
# yoki
venv\Scripts\activate  # Windows

# Google Auth kutubxonalarini o'rnatish
pip install google-auth==2.27.0
pip install google-auth-oauthlib==1.2.0
pip install google-auth-httplib2==0.2.0

# Yoki requirements.txt'ga qo'shing
echo "google-auth==2.27.0" >> requirements.txt
echo "google-auth-oauthlib==1.2.0" >> requirements.txt
echo "google-auth-httplib2==0.2.0" >> requirements.txt

# O'rnatish
pip install -r requirements.txt
```

## 2. Django settings.py sozlash

`settings.py` faylida quyidagilarni qo'shing:

```python
# Google OAuth sozlamalari
GOOGLE_OAUTH_CLIENT_ID = "490894542066-5ir3eqohco64requmce0823g28rrv938.apps.googleusercontent.com"

# CORS sozlamalari (agar CORS middleware o'rnatilgan bo'lsa)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://ieltsify.vercel.app",  # Production URL
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

## 3. Google OAuth View yaratish

`accounts/views.py` faylida quyidagi kodni qo'shing:

```python
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Google OAuth login/register endpoint
    
    Request body:
    {
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
    }
    
    Response:
    {
        "message": "Login successful",
        "user": {...},
        "tokens": {
            "access": "...",
            "refresh": "..."
        }
    }
    """
    try:
        token = request.data.get('id_token')
        
        if not token:
            logger.error("ID token not provided")
            return Response(
                {'error': 'ID token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        logger.info(f"Received token length: {len(token)}")
        
        # Verify the token
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                settings.GOOGLE_OAUTH_CLIENT_ID
            )
            
            logger.info(f"Token verified successfully")
            
            # Token is valid, get user info
            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            picture = idinfo.get('picture', '')
            email_verified = idinfo.get('email_verified', False)
            
            logger.info(f"User info: email={email}, name={first_name} {last_name}")
            
            if not email:
                logger.error("Email not found in token")
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
                }
            )
            
            # Update user info if exists
            if not created:
                user.first_name = first_name or user.first_name
                user.last_name = last_name or user.last_name
                user.save()
            
            logger.info(f"User {'created' if created else 'found'}: {user.username}")
            
            # Update picture if your User model has picture field
            if hasattr(user, 'picture') and picture:
                user.picture = picture
                user.save()
            
            # Update email_verified if your User model has this field
            if hasattr(user, 'email_verified'):
                user.email_verified = email_verified
                user.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Add custom claims if needed
            refresh['role'] = getattr(user, 'role', 'user')
            
            response_data = {
                'message': 'Registration successful' if created else 'Login successful',
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
                    'date_joined': user.date_joined.isoformat() if user.date_joined else None,
                    'last_login': user.last_login.isoformat() if user.last_login else None,
                    'picture': picture,
                },
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }
            
            logger.info(f"Sending successful response for user: {user.username}")
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            # Invalid token
            logger.error(f"Token verification failed: {str(e)}")
            return Response(
                {'error': 'Invalid Google token', 'detail': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Exception as e:
        logger.error(f"Unexpected error in google_auth: {str(e)}", exc_info=True)
        return Response(
            {'error': 'Server error', 'detail': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

## 4. URL routing sozlash

`accounts/urls.py` faylida:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('google/', views.google_auth, name='google_auth'),
    # ... other urls
]
```

Asosiy `urls.py` faylida:

```python
from django.urls import path, include

urlpatterns = [
    path('accounts/', include('accounts.urls')),
    # ... other urls
]
```

## 5. CORS middleware o'rnatish (agar o'rnatilmagan bo'lsa)

```bash
pip install django-cors-headers
```

`settings.py` da:

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Eng yuqorida
    'django.middleware.common.CommonMiddleware',
    # ...
]
```

## 6. Logging sozlash (ixtiyoriy, lekin tavsiya etiladi)

`settings.py` da:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

## 7. Testlash

### Backend serverini ishga tushiring:

```bash
python manage.py runserver
```

### cURL orqali test qiling:

```bash
# Test token bilan (bu ishlamaydi, lekin endpoint'ni tekshiradi)
curl -X POST http://localhost:8000/accounts/google/ \
  -H "Content-Type: application/json" \
  -d '{"id_token":"test_token"}'

# Javob:
# {"error": "Invalid Google token", "detail": "..."}
```

### Frontend'dan test qiling:

1. Frontend'ni ishga tushiring: `npm run dev`
2. `http://localhost:5173/register` ga o'ting
3. "Google bilan ro'yxatdan o'tish" tugmasini bosing
4. Google akkauntingizni tanlang
5. Backend console'da loglarni kuzating

## 8. Troubleshooting

### Xato: "Invalid Google token"

**Tekshirish:**
```python
# Django shell'da
python manage.py shell

from django.conf import settings
print(settings.GOOGLE_OAUTH_CLIENT_ID)
# Natija: 490894542066-5ir3eqohco64requmce0823g28rrv938.apps.googleusercontent.com
```

Frontend `.env` faylidagi `VITE_GOOGLE_CLIENT_ID` bilan bir xil bo'lishi kerak!

### Xato: "No module named 'google'"

```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2
```

### Xato: CORS error

`settings.py` da CORS sozlamalarini tekshiring:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### Xato: "User matching query does not exist"

User modelingizda `email` field unique bo'lishi kerak:

```python
# models.py
class User(AbstractUser):
    email = models.EmailField(unique=True)
```

## 9. Production deployment

### PythonAnywhere uchun:

1. Web tab'da "Reload" tugmasini bosing
2. Error log'ni tekshiring: `/var/log/yourusername.pythonanywhere.com.error.log`
3. CORS sozlamalariga production URL qo'shing:

```python
CORS_ALLOWED_ORIGINS = [
    "https://ieltsify.vercel.app",
]
```

### Environment variables:

PythonAnywhere'da environment variable qo'shish:

1. Web tab > "Virtualenv" section
2. "Go to directory" tugmasini bosing
3. `.env` fayl yarating:

```bash
echo "GOOGLE_OAUTH_CLIENT_ID=490894542066-5ir3eqohco64requmce0823g28rrv938.apps.googleusercontent.com" > .env
```

4. `settings.py` da:

```python
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

GOOGLE_OAUTH_CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
```

## 10. Xavfsizlik

1. **Client ID'ni environment variable'da saqlang**
2. **Client Secret'ni hech qachon frontend'ga yubormang**
3. **HTTPS ishlatish** (production'da)
4. **Token'ni har doim verify qiling**
5. **Rate limiting qo'shing** (DDoS hujumlaridan himoya)

```python
# Rate limiting (django-ratelimit)
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='10/m', method='POST')
@api_view(['POST'])
def google_auth(request):
    # ...
```

## Yordam

Agar muammo hal bo'lmasa:

1. Backend console'da loglarni tekshiring
2. Frontend browser console'da xatolarni o'qing
3. Network tab'da request/response'ni ko'ring
4. Backend error log'ni tekshiring
5. Google Cloud Console'da Client ID to'g'ri sozlanganligini tekshiring

## Foydali linklar

- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [google-auth Python library](https://google-auth.readthedocs.io/)
- [Django CORS headers](https://github.com/adamchainz/django-cors-headers)
