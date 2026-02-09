# IELTSify - New Features Documentation

## 🎯 Overview
IELTSify is now a unified, interconnected IELTS learning ecosystem with advanced features for vocabulary management, smart article reading, and resource management.

## ✨ New Features

### 1. **Vocabulary Management System** (`/dashboard/vocabulary`)
- **Flashcard System**: Interactive vocabulary cards with mastery tracking
- **Text-to-Speech**: Built-in TTS using Web Speech API for pronunciation
- **CEFR Levels**: Organize words by A1-C2 levels
- **Mastery Progress**: Track learning progress with visual indicators
- **Search & Filter**: Quick search across all vocabulary
- **localStorage Persistence**: All data persists across sessions

**Key Components:**
- `src/pages/VocabularyPage.tsx`
- `src/services/ttsService.ts`

### 2. **Smart Article Reader** (`/dashboard/smart-article`)
- **Text Highlighting**: Select any text to get instant actions
- **Context Menu**: 
  - Define & Translate
  - Add to Vocabulary (instant sync)
  - Text-to-Speech
- **AI Analysis Panel**: Get AI-powered insights about articles
- **Side-by-Side View**: Article on left, analysis on right
- **HTML Support**: Render uploaded HTML articles

**Key Components:**
- `src/pages/SmartArticlePage.tsx`

### 3. **Resource Manager** (`/dashboard/resource-manager`)
- **Admin Dashboard**: Central hub for uploading resources
- **Three Resource Types**:
  - **Articles**: Upload HTML files or paste content
  - **Listening**: Add YouTube links with categories
  - **Vocabulary**: Quick add words with definitions
- **Instant Availability**: Resources appear immediately in respective modules
- **localStorage Backend**: No server required

**Key Components:**
- `src/pages/ResourceManagerPage.tsx`

### 4. **Listening Hub** (`/dashboard/listening-hub`)
- **YouTube Integration**: Embedded video player
- **Categorized Resources**: Academic, General, Podcast, Lecture
- **Interactive Notes**: Take notes while watching
- **Auto-save**: Notes persist with localStorage

**Key Components:**
- `src/pages/ListeningHubPage.tsx`

### 5. **Global Search** (Ctrl/Cmd + K)
- **Cross-Module Search**: Search across vocabulary, articles, and listening
- **Keyboard Shortcut**: Quick access with Ctrl+K or Cmd+K
- **Smart Navigation**: Click results to jump to relevant pages
- **Real-time Results**: Instant search as you type

**Key Components:**
- `src/components/GlobalSearch.tsx`

## 🏗️ Architecture

### Data Management Layer
**File**: `src/services/dataManager.ts`

Central data engine with managers for:
- `vocabularyManager`: CRUD operations for vocabulary
- `articleManager`: Article management
- `listeningManager`: Listening resource management
- `notesManager`: User notes management
- `globalSearch`: Cross-module search function

All data is stored in localStorage with these keys:
- `ieltsify_vocabulary`
- `ieltsify_articles`
- `ieltsify_listening`
- `ieltsify_notes`

### Type System
**File**: `src/types/index.ts`

TypeScript interfaces for:
- `VocabularyWord`
- `Article`
- `ListeningResource`
- `UserNote`
- `SearchResult`

### Services
1. **TTS Service** (`src/services/ttsService.ts`)
   - Web Speech API wrapper
   - Voice selection
   - Playback controls

2. **AI Service** (`src/services/aiService.ts`)
   - Mock AI analysis (ready for real API integration)

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Deep Sea Blue (#0f172a) + Emerald Green (#10b981)
- **Modern SaaS Look**: Clean, professional, minimalist
- **Responsive**: Mobile-first design with Ant Design Grid
- **Smooth Transitions**: Framer Motion animations
- **Consistent Spacing**: 16px/24px rhythm

### Navigation
- **Fixed Sidebar**: Always accessible navigation
- **Mobile Drawer**: Responsive mobile menu
- **Breadcrumbs**: Clear location indicators
- **Search Bar**: Global search in header

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📱 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/vocabulary` | VocabularyPage | Flashcard system |
| `/dashboard/smart-article` | SmartArticlePage | Interactive reader |
| `/dashboard/resource-manager` | ResourceManagerPage | Admin panel |
| `/dashboard/listening-hub` | ListeningHubPage | Video practice |

## 🔧 Technical Stack

- **Framework**: React 19 + TypeScript
- **Routing**: React Router v7
- **UI Library**: Ant Design v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Storage**: localStorage API
- **Speech**: Web Speech API
- **Build Tool**: Vite

## 💾 Data Persistence

All data is stored in browser localStorage:
- Survives page refreshes
- No backend required
- Instant read/write
- ~5-10MB storage limit

## 🎯 Key Workflows

### Adding Vocabulary
1. **Method 1**: Resource Manager → Vocabulary tab
2. **Method 2**: Smart Article → Highlight text → "Add to Vocab"
3. **Method 3**: Vocabulary page → "Add Word" button

### Reading Articles
1. Upload HTML in Resource Manager
2. Navigate to Smart Article
3. Select article from list
4. Highlight text for instant actions
5. View AI analysis in side panel

### Listening Practice
1. Add YouTube URL in Resource Manager
2. Go to Listening Hub
3. Select resource
4. Watch video + take notes
5. Notes auto-save

### Global Search
1. Press Ctrl+K (or Cmd+K on Mac)
2. Type search query
3. Click result to navigate
4. Press ESC to close

## 🔮 Future Enhancements

- [ ] Real AI API integration (Google Gemini)
- [ ] Spaced repetition algorithm for vocabulary
- [ ] Export/Import data functionality
- [ ] Cloud sync with backend
- [ ] Advanced analytics dashboard
- [ ] Collaborative features
- [ ] Mobile app (React Native)

## 📝 Notes

- All features work offline
- Data is stored locally in browser
- Clear browser data will reset everything
- Export feature coming soon for backup

## 🤝 Contributing

This is a modular architecture. To add new features:
1. Create types in `src/types/index.ts`
2. Add manager in `src/services/dataManager.ts`
3. Create page component in `src/pages/`
4. Add route in `src/App.tsx`
5. Update sidebar menu in `src/mockData.ts`

---

**Built with ❤️ for IELTS learners worldwide**
