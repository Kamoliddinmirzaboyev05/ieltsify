import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Flame, 
  Trophy, 
  ChevronRight, 
  Check, 
  X, 
  Zap,
  MoreHorizontal,
  ArrowLeft,
  Volume2,
  Brain,
  Sparkles,
  Target,
  RefreshCw
} from 'lucide-react';

// --- 1. Data Models ---

type CefrLevel = 'B1' | 'B2' | 'C1' | 'C2';

interface Word {
  id: string;
  term: string;
  translation: string;
  definition: string;
  example: string;
  pronunciation: string;
  audioUrl?: string;
  cefrLevel: CefrLevel;
  masteryLevel: 1 | 2 | 3 | 4;
  nextReviewDate: string;
  categoryIds: string[];
}

interface Category {
  id: string;
  title: string;
  subtitle?: string;
  totalWords: number;
  learnedWords: number;
  icon: 'environment' | 'technology' | 'education' | 'health' | 'smart-article' | 'custom';
  color: string;
}

interface DailyVocabGoal {
  target: number;
  current: number;
  streak: number;
  xpEarned: number;
}

// --- Mock Data ---

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat_1', title: 'Environment', subtitle: 'Climate change & Nature', totalWords: 45, learnedWords: 12, icon: 'environment', color: 'from-emerald-500 to-teal-500' },
  { id: 'cat_2', title: 'Technology', subtitle: 'AI & Innovation', totalWords: 30, learnedWords: 5, icon: 'technology', color: 'from-blue-500 to-indigo-500' },
  { id: 'cat_3', title: 'Education', subtitle: 'University & Learning', totalWords: 25, learnedWords: 18, icon: 'education', color: 'from-orange-500 to-amber-500' },
  { id: 'cat_4', title: 'My Smart Words', subtitle: 'Saved from articles', totalWords: 12, learnedWords: 2, icon: 'smart-article', color: 'from-purple-500 to-violet-500' },
];

const MOCK_WORDS: Word[] = [
  {
    id: 'w1',
    term: 'Detrimental',
    translation: 'Zararli',
    definition: 'Tending to cause harm',
    example: 'The pollution had a detrimental effect on the environment.',
    pronunciation: '/ˌdet.rɪˈmen.təl/',
    cefrLevel: 'C1',
    masteryLevel: 1,
    nextReviewDate: new Date().toISOString(),
    categoryIds: ['cat_1']
  },
  {
    id: 'w2',
    term: 'Ubiquitous',
    translation: 'Hamma joyda mavjud',
    definition: 'Present, appearing, or found everywhere',
    example: 'Smartphones have become ubiquitous in modern society.',
    pronunciation: '/juːˈbɪk.wɪ.təs/',
    cefrLevel: 'C2',
    masteryLevel: 2,
    nextReviewDate: new Date().toISOString(),
    categoryIds: ['cat_2']
  },
  {
    id: 'w3',
    term: 'Mitigate',
    translation: 'Yengillashtirmoq',
    definition: 'Make less severe, serious, or painful',
    example: 'We need to mitigate the risks of climate change.',
    pronunciation: '/ˈmɪt.ɪ.ɡeɪt/',
    cefrLevel: 'C1',
    masteryLevel: 1,
    nextReviewDate: new Date().toISOString(),
    categoryIds: ['cat_1']
  },
  {
    id: 'w4',
    term: 'Prerequisite',
    translation: 'Talab qilinadigan shart',
    definition: 'A thing that is required as a prior condition for something else to happen or exist',
    example: 'A degree is a prerequisite for this job.',
    pronunciation: '/ˌpriːˈrek.wɪ.zɪt/',
    cefrLevel: 'B2',
    masteryLevel: 3,
    nextReviewDate: new Date().toISOString(),
    categoryIds: ['cat_3']
  }
];

// --- Components ---

const VocabularyPage: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'study'>('dashboard');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyVocabGoal>({
    target: 15,
    current: 8,
    streak: 12,
    xpEarned: 120
  });

  const handleStartStudy = (category: Category) => {
    setActiveCategory(category);
    setView('study');
  };

  const handleFinishStudy = (wordsLearned: number, xpGained: number) => {
    setDailyGoal(prev => ({
      ...prev,
      current: Math.min(prev.target, prev.current + wordsLearned),
      xpEarned: prev.xpEarned + xpGained
    }));
    setView('dashboard');
    setActiveCategory(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent pb-20 font-sans text-slate-900 dark:text-slate-100">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <VocabDashboard 
            key="dashboard"
            categories={MOCK_CATEGORIES} 
            dailyGoal={dailyGoal}
            onStartStudy={handleStartStudy}
          />
        ) : (
          <ActiveStudyMode 
            key="study"
            category={activeCategory!}
            words={MOCK_WORDS.filter(w => activeCategory ? w.categoryIds.includes(activeCategory.id) : true)} 
            onFinish={handleFinishStudy}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- View A: Dashboard ---

interface VocabDashboardProps {
  categories: Category[];
  dailyGoal: DailyVocabGoal;
  onStartStudy: (cat: Category) => void;
}

const VocabDashboard: React.FC<VocabDashboardProps> = ({ categories, dailyGoal, onStartStudy }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto px-4 pt-8"
    >
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Vocabulary</h1>
          <p className="text-slate-500 dark:text-slate-400">Master new words with SRS.</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-full border border-orange-100 dark:border-orange-800">
          <Flame size={20} className="text-orange-500 fill-orange-500" />
          <span className="font-bold text-orange-700 dark:text-orange-400">{dailyGoal.streak} Day Streak</span>
        </div>
      </div>

      {/* Daily Goal Progress */}
      <div className="mb-12 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="text-emerald-500" size={20} />
                  Today's Goal
                </h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{dailyGoal.current}</span>
                <span className="text-lg text-slate-400 font-medium">/{dailyGoal.target}</span>
              </div>
            </div>
            
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (dailyGoal.current / dailyGoal.target) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">+{dailyGoal.xpEarned} XP earned today</p>
          </div>

          <div className="w-px h-16 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

          <div className="flex gap-4">
            <div className="text-center px-6 py-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-100 dark:border-slate-700 min-w-[100px]">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Level</div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-200">C1</div>
            </div>
            <div className="text-center px-6 py-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-100 dark:border-slate-700 min-w-[100px]">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Rank</div>
              <div className="text-2xl font-black text-indigo-500">#42</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Sparkles size={20} className="text-yellow-500 fill-yellow-500" />
        Start Learning
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, index) => (
          <motion.div 
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onStartStudy(cat)}
            className="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cat.color}`}></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${cat.color} text-white shadow-lg shadow-current/20`}>
                {getCategoryIcon(cat.icon)}
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-500 transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{cat.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">{cat.subtitle}</p>

            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${cat.color}`} 
                style={{ width: `${(cat.learnedWords / cat.totalWords) * 100}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// --- View B: Active Study Mode ---

interface ActiveStudyModeProps {
  category: Category;
  words: Word[];
  onFinish: (wordsLearned: number, xpGained: number) => void;
}

const ActiveStudyMode: React.FC<ActiveStudyModeProps> = ({ category, words: initialWords, onFinish }) => {
  const [queue] = useState<Word[]>(initialWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ learned: 0, xp: 0 });

  const currentWord = queue[currentIndex];
  const isFinished = currentIndex >= queue.length;

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAction = (action: 'known' | 'unknown') => {
    if (action === 'known') {
      setSessionStats(prev => ({ learned: prev.learned + 1, xp: prev.xp + 10 }));
    }
    setIsFlipped(false);
    setCurrentIndex(prev => prev + 1);
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/40 rotate-12 relative z-10">
            <Trophy size={64} className="text-white drop-shadow-md" />
          </div>
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Session Complete!</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-md">
          You mastered <span className="text-emerald-500 font-bold">{sessionStats.learned} words</span> and earned <span className="text-indigo-500 font-bold">{sessionStats.xp} XP</span>.
        </p>
        <button 
          onClick={() => onFinish(sessionStats.learned, sessionStats.xp)}
          className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          Back to Dashboard
        </button>
      </motion.div>
    );
  }

  if (!currentWord) return <div>No words loaded</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto px-4 pt-6 h-[calc(100vh-80px)] flex flex-col"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => onFinish(sessionStats.learned, sessionStats.xp)}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{category.title}</span>
          <div className="flex gap-1.5">
            {queue.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 w-4 rounded-full transition-colors duration-300 ${idx === currentIndex ? 'bg-indigo-500 shadow-lg shadow-indigo-500/50' : idx < currentIndex ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'}`}
              />
            ))}
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Physical Card Container */}
      <div className="flex-1 flex items-center justify-center mb-8 perspective-1000 relative">
        <motion.div
          className="relative w-full aspect-[3/4] sm:h-[500px] cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          onClick={handleCardClick}
        >
          {/* FRONT */}
          <div 
            className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl dark:shadow-black/40 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
             {/* Mastery Dots */}
             <div className="absolute top-8 right-8 flex gap-1.5">
              {[1, 2, 3, 4].map(lvl => (
                <div 
                  key={lvl} 
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${currentWord.masteryLevel >= lvl ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-200 dark:bg-slate-700'}`}
                />
              ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <span className={`
                px-4 py-1.5 rounded-full text-xs font-bold mb-8 border
                ${currentWord.cefrLevel === 'C2' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800' : 
                  currentWord.cefrLevel === 'C1' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' :
                  'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'}
              `}>
                {currentWord.cefrLevel} Level
              </span>

              <h2 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight drop-shadow-sm">
                {currentWord.term}
              </h2>
              
              <span className="text-xl font-mono text-slate-500 dark:text-slate-400 mb-10">
                {currentWord.pronunciation}
              </span>

              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-blue-500 hover:text-blue-600 shadow-sm z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  // Audio logic
                }}
              >
                <Volume2 size={28} strokeWidth={2.5} />
              </motion.button>
            </div>

            <div className="text-sm text-slate-400 font-medium opacity-60 animate-pulse mt-auto">
              Tap card to flip
            </div>
          </div>

          {/* BACK */}
          <div 
            className="absolute inset-0 w-full h-full bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-black/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-0 overflow-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center w-full">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 mx-auto shadow-inner">
                <RefreshCw size={24} />
              </div>

              <h3 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-6">
                {currentWord.translation}
              </h3>
              
              <div className="w-1/2 h-px bg-slate-200 dark:bg-slate-800 mx-auto mb-6"></div>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 italic mb-2 px-4 leading-relaxed">
                "{currentWord.definition}"
              </p>
            </div>

            <div className="w-full bg-white dark:bg-black/20 p-6 border-t border-slate-200 dark:border-slate-800 rounded-b-[2.5rem]">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Context</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                {currentWord.example}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8 w-full max-w-md mx-auto">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction('unknown')}
          className="flex-1 py-4 rounded-2xl bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold text-lg border border-rose-200 dark:border-rose-800/50 flex items-center justify-center gap-2 shadow-sm"
        >
          <X size={24} strokeWidth={3} />
          Didn't Know
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction('known')}
          className="flex-1 py-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold text-lg border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center gap-2 shadow-sm"
        >
          <Check size={24} strokeWidth={3} />
          Got It
        </motion.button>
      </div>
    </motion.div>
  );
};

// Helper
function getCategoryIcon(type: string) {
  switch (type) {
    case 'environment': return <Zap size={28} fill="currentColor" className="text-white" />;
    case 'technology': return <Brain size={28} className="text-white" />; 
    case 'education': return <BookOpen size={28} className="text-white" />;
    case 'smart-article': return <Sparkles size={28} className="text-white" />;
    default: return <BookOpen size={28} className="text-white" />;
  }
}

export default VocabularyPage;
