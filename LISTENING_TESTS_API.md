# Listening Tests API Documentation

## API Endpoint

```
GET https://ieltsify.pythonanywhere.com/listening-tests/
```

## Response Format

### Success Response (200 OK)

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Listening 1",
      "slug": "listening-1",
      "description": "Test uchun",
      "html_file_url": "https://ieltsify.pythonanywhere.com/media/listening_tests/html/2026/02/Listening.html",
      "cover_image_url": "https://ieltsify.pythonanywhere.com/media/listening_tests/covers/2026/02/task1.jpg",
      "difficulty": "medium",
      "is_active": true,
      "created_at": "2026-02-12T20:29:05.899614+05:00",
      "updated_at": "2026-02-12T20:29:05.899657+05:00"
    }
  ]
}
```

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `count` | number | Jami testlar soni |
| `next` | string \| null | Keyingi sahifa URL'i (pagination) |
| `previous` | string \| null | Oldingi sahifa URL'i (pagination) |
| `results` | array | Testlar ro'yxati |

### Test Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Test ID'si |
| `title` | string | Test nomi |
| `slug` | string | URL uchun slug |
| `description` | string | Test tavsifi |
| `html_file_url` | string | HTML test fayli URL'i |
| `cover_image_url` | string | Muqova rasmi URL'i |
| `difficulty` | string | Qiyinlik darajasi: "easy", "medium", "hard" |
| `is_active` | boolean | Test faolmi |
| `created_at` | string | Yaratilgan vaqt (ISO 8601) |
| `updated_at` | string | Yangilangan vaqt (ISO 8601) |

## Frontend Implementation

### 1. Fetch Tests (with Authentication)

```typescript
const loadTests = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const accessToken = localStorage.getItem('access_token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add Authorization header if token exists
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/listening-tests/`, {
      headers,
    });
    
    // Handle 401 Unauthorized
    if (!response.ok) {
      if (response.status === 401) {
        message.error('Iltimos, tizimga kiring');
        navigate('/login');
        return;
      }
      throw new Error('Failed to load listening tests');
    }

    const data = await response.json();
    setTests(data.results.filter(test => test.is_active));
  } catch (error) {
    console.error('Error loading listening tests:', error);
  }
};
```

### 2. Display Tests

Tests are displayed in a responsive grid with:
- Cover image
- Title and description
- Difficulty badge (easy/medium/hard)
- Duration tag (30-40 min)
- "Start Test" button

### 3. Filter by Difficulty

```typescript
const filteredTests = difficulty === 'all'
  ? tests
  : tests.filter(t => t.difficulty === difficulty);
```

### 4. Navigate to Test

```typescript
const handleStartTest = (test: ListeningTest) => {
  navigate(`/listening/${test.slug}`, { state: { test } });
};
```

## UI Features

### Stats Cards
- Total tests count
- Test duration (30-40 min)
- Maximum band score (9.0)

### Test Cards
- Gradient cover image with fallback
- Difficulty badge with color coding:
  - Easy: Green (#52c41a)
  - Medium: Orange (#faad14)
  - Hard: Red (#f5222d)
- Hover animation (lift effect)
- Responsive design (mobile & desktop)

### Animations
- Framer Motion animations for smooth transitions
- Staggered card animations
- Hover effects

## Example Usage

```typescript
import { useState, useEffect } from 'react';

interface ListeningTest {
  id: number;
  title: string;
  slug: string;
  description: string;
  html_file_url: string;
  cover_image_url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ListeningHub = () => {
  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ieltsify.pythonanywhere.com/listening-tests/');
      const data = await response.json();
      setTests(data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <div className="tests-grid">
          {tests.map(test => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      )}
    </div>
  );
};
```

## Error Handling

### Image Load Error
If cover image fails to load, a gradient background with headphones icon is displayed as fallback.

### API Error
If API request fails, an error message is shown to the user.

### Empty State
If no tests are available, an empty state with appropriate message is displayed.

## Responsive Design

- Mobile: Single column grid
- Tablet: 2 columns
- Desktop: Auto-fill grid with minimum 350px cards

## Color Scheme

- Primary gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Easy: `#52c41a` (Green)
- Medium: `#faad14` (Orange)
- Hard: `#f5222d` (Red)

## Authentication

### Required Headers

All API requests require authentication:

```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <access_token>'
}
```

### Getting Access Token

Access token is stored in localStorage after login:

```typescript
const accessToken = localStorage.getItem('access_token');
```

### Handling 401 Unauthorized

If the API returns 401, redirect user to login:

```typescript
if (response.status === 401) {
  message.error('Iltimos, tizimga kiring');
  navigate('/login');
  return;
}
```

## Testing with Authentication

```bash
# Get access token first by logging in
curl -X POST https://ieltsify.pythonanywhere.com/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'

# Use the access token to fetch tests
curl https://ieltsify.pythonanywhere.com/listening-tests/ \
  -H "Authorization: Bearer <your_access_token>"
```


---

## Backend Configuration (PythonAnywhere)

### Django Settings

**settings.py**:
```python
import os

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# CORS settings for frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://your-app.vercel.app",
]

# Allow all origins for media files (or configure specific origins)
CORS_ALLOW_ALL_ORIGINS = True
```

### PythonAnywhere Static Files

**Web Tab > Static Files**:
```
URL: /media/
Directory: /home/yourusername/yourproject/media/
```

### File Permissions

```bash
chmod -R 755 /home/yourusername/yourproject/media/
```

### Directory Structure

```
media/
  listening_tests/
    html/
      2026/
        02/
          Listening.html
          Listening_okv0Ang.html
    covers/
      2026/
        02/
          task1.jpg
          IELTSIFY_logo.png
```

---

## Troubleshooting HTML File Loading

### Error: 404 - HTML fayl topilmadi

**Console Error**:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
ieltsify.pythonanywhere.com/media/listening_tests/html/2026/02/Listening.html
```

**Solutions**:

1. **Check file exists on server**:
   ```bash
   ls -la /home/yourusername/yourproject/media/listening_tests/html/2026/02/
   ```

2. **Verify PythonAnywhere Static Files configuration**:
   - Web tab > Static files
   - URL: `/media/`
   - Directory: Full path to media folder

3. **Check file permissions**:
   ```bash
   chmod -R 755 media/
   ```

4. **Verify URL format**:
   ```
   https://ieltsify.pythonanywhere.com/media/listening_tests/html/2026/02/Listening.html
   ```

### Error: 403 - Kirish taqiqlangan

**Solutions**:

1. **CORS configuration**:
   ```python
   # settings.py
   CORS_ALLOW_ALL_ORIGINS = True
   ```

2. **File permissions**:
   ```bash
   chmod 644 /path/to/file.html
   chmod 755 /path/to/directory/
   ```

### Error: CORS policy blocked

**Solutions**:

1. **Add CORS headers** (settings.py):
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
       "https://your-app.vercel.app",
   ]
   ```

2. **For media files, allow all origins**:
   ```python
   CORS_ALLOW_ALL_ORIGINS = True
   ```

---

## Frontend HTML Loading

### Without Authentication (Recommended for Media Files)

```typescript
const loadHtmlContent = async (test: ListeningTest) => {
  try {
    const response = await fetch(test.html_file_url, {
      mode: 'cors',
      credentials: 'omit', // Don't send credentials for media files
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        message.error('HTML fayl serverda topilmadi');
        return;
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    setHtmlContent(html);
  } catch (error) {
    console.error('Error loading HTML:', error);
    message.error('HTML faylni yuklashda xatolik');
  }
};
```

### Display HTML Content

```typescript
// Using dangerouslySetInnerHTML (direct rendering)
<div 
  dangerouslySetInnerHTML={{ __html: htmlContent }}
  style={{ padding: '20px' }}
/>
```

---

## Testing

### Browser Console Test

```javascript
// Test HTML file loading
fetch('https://ieltsify.pythonanywhere.com/media/listening_tests/html/2026/02/Listening.html')
  .then(r => {
    console.log('Status:', r.status);
    console.log('Headers:', Object.fromEntries(r.headers.entries()));
    return r.text();
  })
  .then(html => {
    console.log('HTML length:', html.length);
    console.log('First 200 chars:', html.substring(0, 200));
  })
  .catch(err => console.error('Error:', err));
```

### cURL Test

```bash
# Test HTML file access
curl -I https://ieltsify.pythonanywhere.com/media/listening_tests/html/2026/02/Listening.html

# Expected response:
# HTTP/1.1 200 OK
# Content-Type: text/html
# Access-Control-Allow-Origin: *
```

---

## Notes

- Media fayllar uchun autentifikatsiya talab qilinmaydi
- HTML fayllar to'g'ridan-to'g'ri sahifada render qilinadi (iframe emas)
- Audio playerlar va JavaScript to'liq ishlaydi
- CORS sozlamalari to'g'ri bo'lishi kerak
- Faqat `is_active: true` testlar ko'rsatiladi
