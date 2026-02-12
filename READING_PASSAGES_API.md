# Reading Passages API Documentation

## API Endpoint

```
GET https://ieltsify.pythonanywhere.com/reading-passages/
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
      "title": "Reading 1",
      "slug": "reading-1",
      "html_content_url": "https://ieltsify.pythonanywhere.com/media/reading_passages/html/2026/02/reading_cdi.html",
      "cover_image_url": "https://ieltsify.pythonanywhere.com/media/reading_passages/covers/2026/02/logo_1.png",
      "difficulty": "medium",
      "word_count": 8610,
      "is_active": true,
      "created_at": "2026-02-12T21:47:28.864551+05:00",
      "updated_at": "2026-02-12T21:47:28.864582+05:00"
    }
  ]
}
```

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `count` | number | Jami passagelar soni |
| `next` | string \| null | Keyingi sahifa URL'i (pagination) |
| `previous` | string \| null | Oldingi sahifa URL'i (pagination) |
| `results` | array | Passagelar ro'yxati |

### Passage Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Passage ID'si |
| `title` | string | Passage nomi |
| `slug` | string | URL uchun slug |
| `html_content_url` | string | HTML content fayli URL'i |
| `cover_image_url` | string | Muqova rasmi URL'i |
| `difficulty` | string | Qiyinlik darajasi: "easy", "medium", "hard" |
| `word_count` | number | So'zlar soni |
| `is_active` | boolean | Passage faolmi |
| `created_at` | string | Yaratilgan vaqt (ISO 8601) |
| `updated_at` | string | Yangilangan vaqt (ISO 8601) |

## Frontend Implementation

### 1. Fetch Passages (with Authentication)

```typescript
const loadPassages = async () => {
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
    
    const response = await fetch(`${API_BASE_URL}/reading-passages/`, {
      headers,
    });
    
    // Handle 401 Unauthorized
    if (!response.ok) {
      if (response.status === 401) {
        message.error('Iltimos, tizimga kiring');
        navigate('/login');
        return;
      }
      throw new Error('Failed to load reading passages');
    }

    const data = await response.json();
    setPassages(data.results.filter(passage => passage.is_active));
  } catch (error) {
    console.error('Error loading reading passages:', error);
  }
};
```

### 2. Display Passages

Passages are displayed in a responsive grid with:
- Cover image
- Title
- Word count and reading time
- Difficulty badge (easy/medium/hard)
- "Start Reading" button

### 3. Calculate Reading Time

```typescript
const getReadingTime = (wordCount: number) => {
  // Average reading speed: 200-250 words per minute
  const minutes = Math.ceil(wordCount / 225);
  return `${minutes} min`;
};
```

### 4. Filter by Difficulty

```typescript
const filteredPassages = difficulty === 'all'
  ? passages
  : passages.filter(p => p.difficulty === difficulty);
```

### 5. Navigate to Passage

```typescript
const handleStartTest = (passage: ReadingPassage) => {
  navigate(`/reading/${passage.slug}`, { state: { passage } });
};
```

## UI Features

### Stats Cards
- Total passages count
- Test duration (60 min)
- Maximum band score (9.0)

### Passage Cards
- Gradient cover image with fallback
- Difficulty badge with color coding:
  - Easy: Green (#52c41a)
  - Medium: Orange (#faad14)
  - Hard: Red (#f5222d)
- Word count display
- Reading time calculation
- Hover animation (lift effect)
- Responsive design (mobile & desktop)

### Animations
- Framer Motion animations for smooth transitions
- Staggered card animations
- Hover effects

## Example Usage

```typescript
import { useState, useEffect } from 'react';

interface ReadingPassage {
  id: number;
  title: string;
  slug: string;
  html_content_url: string;
  cover_image_url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  word_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ReadingHub = () => {
  const [passages, setPassages] = useState<ReadingPassage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPassages();
  }, []);

  const loadPassages = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ieltsify.pythonanywhere.com/reading-passages/');
      const data = await response.json();
      setPassages(data.results);
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
        <div className="passages-grid">
          {passages.map(passage => (
            <PassageCard key={passage.id} passage={passage} />
          ))}
        </div>
      )}
    </div>
  );
};
```

## Error Handling

### Image Load Error
If cover image fails to load, a gradient background with book icon is displayed as fallback.

### API Error
If API request fails, an error message is shown to the user.

### Empty State
If no passages are available, an empty state with appropriate message is displayed.

## Responsive Design

- Mobile: Single column grid
- Tablet: 2 columns
- Desktop: Auto-fill grid with minimum 350px cards

## Color Scheme

- Primary gradient: `linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)`
- Easy: `#52c41a` (Green)
- Medium: `#faad14` (Orange)
- Hard: `#f5222d` (Red)

## Reading Time Calculation

Average reading speed: 225 words per minute

```typescript
const readingTime = Math.ceil(wordCount / 225); // minutes
```

Example:
- 8610 words ÷ 225 = 38.27 → 39 minutes

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

# Use the access token to fetch passages
curl https://ieltsify.pythonanywhere.com/reading-passages/ \
  -H "Authorization: Bearer <your_access_token>"
```

## Routes

- `/reading-hub` - Passagelar ro'yxati
- `/reading/:slug` - Alohida passage sahifasi

## Features Comparison

| Feature | Listening | Reading |
|---------|-----------|---------|
| Duration | 30-40 min | 60 min |
| Format | Audio | Text |
| Word Count | N/A | Displayed |
| Reading Time | N/A | Calculated |
| Sections | 4 sections | 3 passages |
| Questions | 40 questions | 40 questions |
