# IELTSIFY - IELTS Preparation Platform

Modern IELTS tayyorgarlik platformasi - Reading, Writing, Listening, Speaking ko'nikmalarini rivojlantirish uchun.

## Features

- 📝 **Writing Practice** - Full Test (Task 1 + Task 2) with AI evaluation
- 📖 **Reading Tests** - HTML-based reading passages with questions
- 🎧 **Listening Tests** - Audio-based listening practice
- 🗣️ **Speaking Practice** - Voice recording and AI feedback
- 📚 **Vocabulary Builder** - Topic-based vocabulary learning
- ✨ **Smart Article** - AI-powered article reading and comprehension
- 📊 **Progress Tracking** - Detailed performance analytics
- 🌓 **Dark/Light Mode** - Theme switching support
- 🔐 **Authentication** - Email/Password and Google OAuth

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Ant Design 5
- **Styling**: CSS-in-JS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **AI**: Google Gemini API
- **Backend**: Django REST API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd IELTSIFY

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your API keys to .env file
# VITE_GEMINI_API_KEY=your_gemini_api_key
# VITE_API_BASE_URL=https://ieltsify.pythonanywhere.com
# VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel deployment instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ieltsify)

## Environment Variables

Required environment variables:

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `VITE_GEMINI_API_KEY` - Google Gemini API Key

## Project Structure

```
IELTSIFY/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript types
│   ├── data/           # Static data
│   └── lib/            # Utility functions
├── public/             # Static assets
├── dist/               # Build output
└── vercel.json         # Vercel configuration
```

## Features in Detail

### Writing System
- Full Test mode: Task 1 (20 min) + Task 2 (40 min)
- Real-time word counter
- Auto-save functionality
- AI-powered evaluation with band scores
- Security features (copy/paste blocked)

### Reading Tests
- HTML file upload support
- Interactive question interface
- Timer functionality
- Progress tracking

### Listening Tests
- Audio file support
- Question synchronization
- Playback controls
- Score calculation

### Smart Article
- AI-powered article generation
- Vocabulary highlighting
- Comprehension questions
- Reading time tracking

### Vocabulary Builder
- Topic-based learning
- Flashcard system
- Progress tracking
- Spaced repetition

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@ieltsify.com or create an issue in the repository.
