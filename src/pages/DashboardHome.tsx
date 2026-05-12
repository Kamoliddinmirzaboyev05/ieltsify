import React, { useEffect, useMemo, useState } from 'react';
import { Flame, Star, Target, CheckCircle2, Circle, Headphones, BookOpen, Mic, PenLine, TrendingUp } from 'lucide-react';
import { fetchUserProfile } from '../services/authService';
import { supabase } from '../lib/supabase';

type SkillArea = 'Listening' | 'Reading' | 'Writing' | 'Speaking' | 'Vocabulary';
type DailyTaskStatus = 'pending' | 'completed';

interface UserProgress {
  userId: string;
  targetScore: number;
  bestScore: number;
  weakArea: SkillArea;
}

interface DailyTask {
  id: string;
  title: string;
  area: SkillArea;
  xp: number;
  status: DailyTaskStatus;
}

interface GamificationStats {
  currentStreak: number;
  totalXP: number;
  currentLevel: number;
  badges: string[];
  todayActive: boolean;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function xpForLevel(level: number): number {
  const n = Math.max(1, level);
  return n * n * 100;
}

function levelProgress(totalXP: number, currentLevel: number) {
  const nextLevel = currentLevel + 1;
  const prevCap = xpForLevel(currentLevel);
  const nextCap = xpForLevel(nextLevel);
  const intoLevel = totalXP - prevCap;
  const span = Math.max(1, nextCap - prevCap);
  const pct = Math.max(0, Math.min((intoLevel / span) * 100, 100));
  return { pct, nextLevel };
}

function generateDaily(area: SkillArea): DailyTask[] {
  const presets: Record<SkillArea, DailyTask[]> = {
    Listening: [
      { id: uid(), title: 'Practice Listening Part 1', area: 'Listening', xp: 30, status: 'pending' },
      { id: uid(), title: 'Transcribe 5 short clips', area: 'Listening', xp: 25, status: 'pending' },
      { id: uid(), title: 'Shadow 10 minutes of audio', area: 'Listening', xp: 20, status: 'pending' }
    ],
    Reading: [
      { id: uid(), title: 'Read 1 passage and answer 10 questions', area: 'Reading', xp: 30, status: 'pending' },
      { id: uid(), title: 'Scan & skim 2 news articles', area: 'Reading', xp: 20, status: 'pending' },
      { id: uid(), title: 'Extract 10 new words from passage', area: 'Reading', xp: 20, status: 'pending' }
    ],
    Writing: [
      { id: uid(), title: 'Task 1 outline practice', area: 'Writing', xp: 25, status: 'pending' },
      { id: uid(), title: 'Task 2 paragraph rewrite', area: 'Writing', xp: 30, status: 'pending' },
      { id: uid(), title: 'Grammar drills 15 min', area: 'Writing', xp: 15, status: 'pending' }
    ],
    Speaking: [
      { id: uid(), title: 'Record Part 2 response', area: 'Speaking', xp: 30, status: 'pending' },
      { id: uid(), title: 'Fluency drills 10 min', area: 'Speaking', xp: 20, status: 'pending' },
      { id: uid(), title: 'Pronunciation minimal pairs', area: 'Speaking', xp: 20, status: 'pending' }
    ],
    Vocabulary: [
      { id: uid(), title: 'Learn 10 new words', area: 'Vocabulary', xp: 20, status: 'pending' },
      { id: uid(), title: 'Review yesterday’s words', area: 'Vocabulary', xp: 15, status: 'pending' },
      { id: uid(), title: 'Use 5 words in sentences', area: 'Vocabulary', xp: 20, status: 'pending' }
    ]
  };
  return presets[area];
}

function areaIcon(area: SkillArea): React.ReactNode {
  const cls = 'w-4 h-4';
  if (area === 'Listening') return <Headphones className={cls} />;
  if (area === 'Reading') return <BookOpen className={cls} />;
  if (area === 'Writing') return <PenLine className={cls} />;
  if (area === 'Speaking') return <Mic className={cls} />;
  return <TrendingUp className={cls} />;
}

const DashboardHome: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>({
    userId: '',
    targetScore: 7.0,
    bestScore: 0,
    weakArea: 'Listening'
  });
  const [stats, setStats] = useState<GamificationStats>({
    currentStreak: 0,
    totalXP: 0,
    currentLevel: 1,
    badges: [],
    todayActive: false
  });
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userProfile = await fetchUserProfile();
        if (userProfile) {
          // Fetch coin data for XP
          const { data: coinData } = await supabase
            .from('user_coins')
            .select('total_earned, balance')
            .eq('user_id', userProfile.id)
            .single();

          setProgress(prev => ({
            ...prev,
            userId: userProfile.id as string,
            targetScore: userProfile.target_score || 7.0,
            bestScore: userProfile.skills ? (Object.values(userProfile.skills).reduce((a, b) => a + b, 0) / 4) : 0,
            weakArea: (userProfile.role as SkillArea) || 'Listening'
          }));
          
          setStats(prev => ({
            ...prev,
            totalXP: coinData?.total_earned || 0,
            currentLevel: Math.floor((coinData?.total_earned || 0) / 100) + 1,
            todayActive: !!userProfile.last_login && 
              new Date(userProfile.last_login).toDateString() === new Date().toDateString()
          }));
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setTasks(generateDaily(progress.weakArea));
    }
  }, [progress.weakArea, isLoading]);

  const level = useMemo(() => levelProgress(stats.totalXP, stats.currentLevel), [stats.totalXP, stats.currentLevel]);
  const targetPct = useMemo(() => {
    const ratio = progress.targetScore > 0 ? progress.bestScore / progress.targetScore : 0;
    return Math.max(0, Math.min(ratio * 100, 100));
  }, [progress.bestScore, progress.targetScore]);

  const onCompleteAll = () => {
    const updated = tasks.map(t => ({ ...t, status: 'completed' as const }));
    setTasks(updated);
    const gained = updated.reduce((acc, t) => acc + t.xp, 0);
    if (gained > 0) setStats(s => ({ ...s, totalXP: s.totalXP + gained, todayActive: true }));
  };

  const onToggleTask = (id: string) => {
    setTasks(prev => {
      const next = prev.map(t =>
        t.id === id ? { ...t, status: t.status === 'pending' ? ('completed' as const) : ('pending' as const) } : t
      );
      const gained = next
        .filter((t, i) => prev[i].status !== t.status && t.status === 'completed')
        .reduce((acc, t) => acc + t.xp, 0);
      if (gained > 0) setStats(s => ({ ...s, totalXP: s.totalXP + gained, todayActive: true }));
      return next;
    });
  };

  const onPracticeNow = () => {
    setStats(s => ({ ...s, totalXP: s.totalXP + 50, todayActive: true }));
    setProgress(p => ({ ...p, bestScore: Math.min(p.targetScore, p.bestScore + 0.1) }));
  };

  return (
    <div className="bg-transparent p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">Xush kelibsiz!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Bugungi IELTS tayyorgarligingizni davom ettiring.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Score</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 leading-none">{progress.targetScore.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 grid place-items-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 dark:text-slate-400 font-medium">Streak</div>
            <div className="text-lg font-bold text-gray-800 dark:text-slate-100">{stats.currentStreak} kun</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 grid place-items-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-slate-400 font-medium">Level</div>
                <div className="text-lg font-bold text-gray-800 dark:text-slate-100 leading-none">{stats.currentLevel}-daraja</div>
              </div>
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${level.pct}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 grid place-items-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-slate-400 font-medium">Progress</div>
                <div className="text-lg font-bold text-gray-800 dark:text-slate-100 leading-none">
                  {progress.bestScore.toFixed(1)}
                </div>
              </div>
            </div>
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{Math.round(targetPct)}%</div>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${targetPct}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 grid place-items-center shrink-0">
            {areaIcon(progress.weakArea)}
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 dark:text-slate-400 font-medium">Weak Area</div>
            <div className="text-lg font-bold text-gray-800 dark:text-slate-100 truncate">{progress.weakArea}</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 rounded-xl text-white p-6 shadow-md relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <PenLine className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold">AI Writing Evaluation</div>
          </div>
          <p className="text-sm text-blue-50/90 max-w-2xl">
            Insholaringizni AI orqali tekshiring va batafsil tahlil hamda band-score oling.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="px-5 py-2 rounded-lg bg-white text-blue-600 text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm">
              Tekshirishni boshlash
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-100/80 bg-blue-700/30 px-3 py-2 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4" />
              95%+ Aniqlik
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full -ml-10 -mb-10 blur-2xl" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
              <div className="text-base font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Kunlik Reja
              </div>
              <button
                onClick={onCompleteAll}
                className="px-3 py-1.5 rounded-lg text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
                disabled={!tasks || tasks.length === 0 || tasks.every(t => t.status === 'completed')}
              >
                Hammasini yakunlash
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {tasks && tasks.length > 0 ? (
                tasks.slice(0, 3).map(t => {
                  const done = t.status === 'completed';
                  return (
                    <div key={t.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <button 
                          onClick={() => onToggleTask(t.id)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            done 
                              ? 'bg-blue-600 border-blue-600 text-white' 
                              : 'bg-transparent border-gray-300 dark:border-slate-600'
                          }`}
                        >
                          {done && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className={`text-sm font-semibold ${done ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-slate-100'}`}>{t.title}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
                              {areaIcon(t.area)}
                              {t.area}
                            </span>
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">+{t.xp} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-gray-500 dark:text-slate-400 italic text-sm">
                  Rejalar yuklanmoqda...
                </div>
              )}
            </div>
            <div className="p-4 border-top border-gray-100 dark:border-slate-700">
              <button 
                onClick={onPracticeNow}
                className="w-full py-2.5 rounded-lg bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-slate-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                Barcha topshiriqlarni ko'rish
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Statistika
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Jami XP</span>
                <span className="font-bold text-gray-800 dark:text-slate-100">{stats.totalXP}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Faollik</span>
                <span className={`font-bold ${stats.todayActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {stats.todayActive ? 'Bugun faol' : 'Noaktiv'}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <span>Level Progress</span>
                  <span>{Math.round(level.pct)}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${level.pct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Mic className="w-4 h-4 text-blue-600" />
              Tezkor Mashq
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Weak area bo'yicha darhol mashq qilishni boshlang.
            </p>
            <button
              onClick={onPracticeNow}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
            >
              Mashqni boshlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
