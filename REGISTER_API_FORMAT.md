# Register API Format

## Frontend'dan Backend'ga yuborilayotgan ma'lumotlar

### Endpoint
```
POST /accounts/register/
```

### Request Body
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securepassword123"
}
```

### Field Descriptions

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `username` | string | ✅ Yes | Foydalanuvchi nomi | - Kamida 3 ta belgi<br>- Maksimal 30 ta belgi<br>- Faqat harflar, raqamlar va _ |
| `email` | string | ✅ Yes | Email manzil | - To'g'ri email formati<br>- Unique bo'lishi kerak |
| `first_name` | string | ✅ Yes | Ism | - Kamida 1 ta belgi<br>- Lotin harflari |
| `last_name` | string | ✅ Yes | Familiya | - Kamida 1 ta belgi<br>- Lotin harflari |
| `password` | string | ✅ Yes | Parol | - Kamida 8 ta belgi |

### Success Response (201 Created)
```json
{
  "message": "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi",
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
  }
}
```

### Error Responses

#### 400 Bad Request - Validation Error
```json
{
  "username": ["Bu username allaqachon mavjud"],
  "email": ["Bu email allaqachon ro'yxatdan o'tgan"],
  "password": ["Parol juda qisqa"]
}
```

#### 400 Bad Request - Missing Fields
```json
{
  "username": ["Bu maydon to'ldirilishi shart"],
  "email": ["Bu maydon to'ldirilishi shart"],
  "first_name": ["Bu maydon to'ldirilishi shart"],
  "last_name": ["Bu maydon to'ldirilishi shart"],
  "password": ["Bu maydon to'ldirilishi shart"]
}
```

## Frontend Form Fields

Foydalanuvchi quyidagi 4 ta fieldni to'ldiradi:

1. **Username** - Foydalanuvchi nomi (john_doe)
2. **Email** - Email manzil (john@example.com)
3. **To'liq ism** - Ism va familiya (John Doe)
   - Frontend'da bu bitta field
   - Backend'ga `first_name` va `last_name` sifatida yuboriladi
4. **Parol** - Parol (kamida 8 ta belgi)

## Example: Frontend to Backend Conversion

### User Input:
```
Username: john_doe
Email: john@example.com
To'liq ism: John Michael Doe
Parol: mypassword123
```

### Sent to Backend:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Michael Doe",
  "password": "mypassword123"
}
```

### Logic:
```typescript
const nameParts = "John Michael Doe".trim().split(/\s+/);
const firstName = nameParts[0]; // "John"
const lastName = nameParts.slice(1).join(' '); // "Michael Doe"
```

## Testing with cURL

```bash
curl -X POST https://ieltsify.pythonanywhere.com/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "testpass123"
  }'
```

## Notes

- Username lowercase'ga o'zgartiriladi va trim qilinadi
- Email lowercase'ga o'zgartiriladi va trim qilinadi
- Agar foydalanuvchi faqat bitta so'z kiritsaham (masalan: "John"), u holda:
  - `first_name = "John"`
  - `last_name = "User"` (default)
