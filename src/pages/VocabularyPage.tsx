import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Check, X, BookOpen, Target, Trophy, Search, Filter } from 'lucide-react';
import { VOCABULARY_TOPICS } from '../data/vocabularyData';
import type { VocabTopic, VocabWord } from '../data/vocabularyData';

// ==================== TYPES ====================

type CEFRLevel = 'all' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
type Phase = 'FLASHCARDS' | 'QUIZ' | 'SPELLING' | 'DONE';

interface DailyGoal {
  target: number;
  current: number;
  streak: number;
}

// ==================== MAIN COMPONENT ====================

const VocabularyPage: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'study'>('dashboard');
  const [activeTopic, setActiveTopic] = useState<VocabTopic | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({
    target: 20,
    current: 12,
    streak: 7
  });

  const handleStartStudy = (topic: VocabTopic) => {
    setActiveTopic(topic);
    setView('study');
  };

  const handleFinishStudy = (learned: number) => {
    setDailyGoal(prev => ({
      ...prev,
      current: Math.min(prev.target, prev.current + learned)
    }));
    setView('dashboard');
    setActiveTopic(null);
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <Dashboard 
            key="dashboard"
            topics={VOCABULARY_TOPICS}
            dailyGoal={dailyGoal}
            onStartStudy={handleStartStudy}
          />
        ) : (
          <StudyMode 
            key="study"
            topic={activeTopic!}
            onFinish={handleFinishStudy}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== DASHBOARD ====================

interface DashboardProps {
  topics: VocabTopic[];
  dailyGoal: DailyGoal;
  onStartStudy: (topic: VocabTopic) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ topics, dailyGoal, onStartStudy }) => {
  const progress = (dailyGoal.current / dailyGoal.target) * 100;
  const [searchQuery, setSearchQuery] = useState('');
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('all');

  const getCEFRLevel = (wordCount: number): CEFRLevel => {
    if (wordCount <= 10) return 'A1';
    if (wordCount <= 20) return 'A2';
    if (wordCount <= 30) return 'B1';
    if (wordCount <= 40) return 'B2';
    if (wordCount <= 50) return 'C1';
    return 'C2';
  };

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
      const topicLevel = getCEFRLevel(topic.words.length);
      const matchesLevel = cefrLevel === 'all' || topicLevel === cefrLevel;
      return matchesSearch && matchesLevel;
    });
  }, [topics, searchQuery, cefrLevel]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Vocabulary Builder
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Master IELTS vocabulary with spaced repetition
        </p>
      </div>

      <div className="mb-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center">
              <Target className="text-white dark:text-slate-900" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Daily Goal</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{dailyGoal.streak} day streak</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{dailyGoal.current}</span>
            <span className="text-lg text-slate-400">/{dailyGoal.target}</span>
          </div>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-slate-900 dark:bg-white rounded-full"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 overflow-x-auto">
          <Filter className="text-slate-400 ml-2 flex-shrink-0" size={18} />
          {(['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setCefrLevel(level)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                cefrLevel === level
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {level === 'all' ? 'All' : level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTopics.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No topics found</p>
          </div>
        ) : (
          filteredTopics.map((topic, index) => {
            const topicLevel = getCEFRLevel(topic.words.length);
            const levelColors: Record<string, string> = {
              'A1': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
              'A2': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
              'B1': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
              'B2': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
              'C1': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
              'C2': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800'
            };
            
            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onStartStudy(topic)}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" size={24} />
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{topic.words.length} words</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${levelColors[topicLevel] || levelColors['B1']}`}>
                      {topicLevel}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{topic.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Start learning</p>
              </motion.button>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

// ==================== STUDY MODE (3-PHASE SYSTEM) ====================

interface StudyModeProps {
  topic: VocabTopic;
  onFinish: (learned: number) => void;
}

const StudyMode: React.FC<StudyModeProps> = ({ topic, onFinish }) => {
  // STATE MANAGEMENT
  const [phase, setPhase] = useState<Phase>('FLASHCARDS');
  const [flashcardQueue, setFlashcardQueue] = useState<VocabWord[]>([...topic.words]);
  const [quizQueue, setQuizQueue] = useState<VocabWord[]>([]);
  const [spellingQueue, setSpellingQueue] = useState<VocabWord[]>([]);
  const [masteredWords, setMasteredWords] = useState<VocabWord[]>([]);
  
  // FLASHCARD STATE
  const [isFlipped, setIsFlipped] = useState(false);
  
  // QUIZ STATE
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // SPELLING STATE
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingError, setSpellingError] = useState(false);
  const [spellingSuccess, setSpellingSuccess] = useState(false);

  const currentWord = phase === 'FLASHCARDS' 
    ? flashcardQueue[0] 
    : phase === 'QUIZ' 
    ? quizQueue[0] 
    : spellingQueue[0];

  const totalWords = topic.words.length;
  const progress = phase === 'FLASHCARDS' 
    ? ((totalWords - flashcardQueue.length) / totalWords) * 100
    : phase === 'QUIZ'
    ? ((totalWords - quizQueue.length) / totalWords) * 100
    : ((totalWords - spellingQueue.length) / totalWords) * 100;

  // ==================== PHASE 1: FLASHCARDS ====================

  const handleFlashcardAction = (known: boolean) => {
    if (known) {
      setMasteredWords(prev => [...prev, currentWord]);
    } else {
      setQuizQueue(prev => [...prev, currentWord]);
    }
    
    setIsFlipped(false);
    setTimeout(() => {
      const newQueue = flashcardQueue.slice(1);
      setFlashcardQueue(newQueue);
      
      if (newQueue.length === 0) {
        if (quizQueue.length > 0) {
          setPhase('QUIZ');
        } else {
          setPhase('DONE');
        }
      }
    }, 200);
  };

  const handlePronunciation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // ==================== PHASE 2: QUIZ ====================

  const getQuizOptions = (correctWord: VocabWord): string[] => {
    const allTranslations = topic.words
      .filter(w => w.word !== correctWord.word)
      .map(w => w.trans);
    
    const shuffled = allTranslations.sort(() => Math.random() - 0.5);
    const wrongAnswers = shuffled.slice(0, 3);
    const options = [...wrongAnswers, correctWord.trans];
    return options.sort(() => Math.random() - 0.5);
  };

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentWord.trans;
    setIsCorrect(correct);
    
    if (correct) {
      setTimeout(() => {
        setSpellingQueue(prev => [...prev, currentWord]);
        const newQueue = quizQueue.slice(1);
        setQuizQueue(newQueue);
        setSelectedAnswer(null);
        setIsCorrect(null);
        
        if (newQueue.length === 0) {
          setPhase('SPELLING');
        }
      }, 800);
    } else {
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  // ==================== PHASE 3: SPELLING ====================

  const handleSpellingCheck = () => {
    const userInput = spellingInput.trim().toLowerCase();
    const correctAnswer = currentWord.word.toLowerCase();
    
    if (userInput === correctAnswer) {
      setSpellingSuccess(true);
      setSpellingError(false);
      
      setTimeout(() => {
        setMasteredWords(prev => [...prev, currentWord]);
        const newQueue = spellingQueue.slice(1);
        setSpellingQueue(newQueue);
        setSpellingInput('');
        setSpellingSuccess(false);
        
        if (newQueue.length === 0) {
          setPhase('DONE');
        }
      }, 1000);
    } else {
      setSpellingError(true);
      setTimeout(() => {
        setSpellingError(false);
        setSpellingInput('');
      }, 600);
    }
  };

  // ==================== RENDER PHASES ====================

  if (phase === 'DONE') {
    const xpEarned = masteredWords.length * 10;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-screen px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-2xl"
        >
          <Trophy className="text-white" size={48} />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-slate-900 dark:text-white mb-2"
        >
          Daily Goal Reached! 🔥
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 dark:text-slate-400 mb-2"
        >
          You mastered {masteredWords.length} out of {totalWords} words
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-black text-emerald-500 mb-8"
        >
          +{xpEarned} XP
        </motion.div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => onFinish(masteredWords.length)}
          className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
        >
          Back to Topics
        </motion.button>
      </motion.div>
    );
  }

  if (!currentWord) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto px-4 py-4 min-h-screen flex flex-col"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <button
          onClick={() => onFinish(masteredWords.length)}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:border-slate-900 dark:hover:border-white transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {phase === 'FLASHCARDS' ? 'Learning' : phase === 'QUIZ' ? 'Quiz Mode' : 'Spelling Test'}
          </p>
          <p className="text-xs text-slate-400">
            {phase === 'FLASHCARDS' && `${flashcardQueue.length} remaining`}
            {phase === 'QUIZ' && `${quizQueue.length} to review`}
            {phase === 'SPELLING' && `${spellingQueue.length} to spell`}
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* PROGRESS BAR */}
      <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 overflow-hidden flex-shrink-0">
        <motion.div
          className={`h-full rounded-full ${
            phase === 'FLASHCARDS' ? 'bg-blue-500' : 
            phase === 'QUIZ' ? 'bg-purple-500' : 
            'bg-emerald-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* PHASE 1: FLASHCARDS */}
      {phase === 'FLASHCARDS' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            className="w-full max-w-md h-[350px] relative mb-8"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* FRONT */}
            <div
              className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-white p-6 flex flex-col items-center justify-center cursor-pointer shadow-2xl"
              style={{ backfaceVisibility: "hidden" }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                {currentWord.word}
              </h2>
              <button 
                onClick={handlePronunciation}
                className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
              >
                <Volume2 size={24} className="text-slate-600 dark:text-slate-400" />
              </button>
              <p className="text-xs text-slate-400 mt-auto">Tap card to flip</p>
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-white p-6 flex flex-col justify-center cursor-pointer shadow-2xl"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
                {currentWord.trans}
              </h3>
              <div className="w-16 h-px bg-slate-200 dark:bg-slate-800 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 text-center text-sm leading-relaxed px-2">
                "{currentWord.example}"
              </p>
              <p className="text-xs text-slate-400 mt-auto text-center">Tap to flip back</p>
            </div>
          </motion.div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 w-full max-w-md">
            <button
              onClick={() => handleFlashcardAction(false)}
              disabled={!isFlipped}
              className="flex-1 py-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 active:scale-95"
            >
              <X size={20} />
              <span className="text-sm sm:text-base">Didn't Know</span>
            </button>
            <button
              onClick={() => handleFlashcardAction(true)}
              disabled={!isFlipped}
              className="flex-1 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 active:scale-95"
            >
              <Check size={20} />
              <span className="text-sm sm:text-base">Got It</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: QUIZ */}
      {phase === 'QUIZ' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            {/* QUIZ CARD */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-purple-500 dark:border-purple-400 p-8 mb-6 text-center shadow-2xl">
              <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold mb-4">
                QUIZ MODE
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {currentWord.word}
              </h2>
              <button 
                onClick={handlePronunciation}
                className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 mx-auto"
              >
                <Volume2 size={24} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* QUIZ OPTIONS */}
            <div className="space-y-3">
              {getQuizOptions(currentWord).map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const showResult = selectedAnswer !== null;
                
                let buttonClass = "w-full py-4 px-6 rounded-xl font-semibold text-left transition-all border-2 ";
                
                if (showResult && isSelected) {
                  if (isCorrect) {
                    buttonClass += "bg-emerald-500 border-emerald-500 text-white scale-105";
                  } else {
                    buttonClass += "bg-rose-500 border-rose-500 text-white animate-shake";
                  }
                } else {
                  buttonClass += "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-purple-500 dark:hover:border-purple-400 hover:scale-105";
                }
                
                return (
                  <motion.button
                    key={idx}
                    onClick={() => !selectedAnswer && handleQuizAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={buttonClass}
                    whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                    whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: SPELLING */}
      {phase === 'SPELLING' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            {/* SPELLING CARD */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500 dark:border-emerald-400 p-8 mb-6 shadow-2xl">
              <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold mb-4">
                SPELLING TEST
              </div>
              
              {/* UZBEK TRANSLATION */}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
                {currentWord.trans}
              </h3>
              
              {/* CONTEXT SENTENCE WITH BLANK */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6">
                <p className="text-slate-700 dark:text-slate-300 text-center italic">
                  "{currentWord.example.replace(new RegExp(currentWord.word, 'gi'), '______')}"
                </p>
              </div>

              {/* SPELLING INPUT */}
              <input
                type="text"
                value={spellingInput}
                onChange={(e) => setSpellingInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && spellingInput && handleSpellingCheck()}
                placeholder="Type the English word..."
                className={`w-full p-4 text-center text-2xl font-bold tracking-widest rounded-xl outline-none transition-all border-2 ${
                  spellingSuccess 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                    : spellingError 
                    ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-600 dark:text-rose-400 animate-shake' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400'
                }`}
                autoFocus
              />
            </div>

            {/* CHECK BUTTON */}
            <button
              onClick={handleSpellingCheck}
              disabled={!spellingInput.trim() || spellingSuccess}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 active:scale-95"
            >
              <Check size={20} />
              Check Spelling
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VocabularyPage;
