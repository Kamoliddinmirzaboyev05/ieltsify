import React, { useEffect, useMemo, useState } from 'react';
import { Flame, Star, Target, CheckCircle2, Circle, Headphones, BookOpen, Mic, PenLine, TrendingUp } from 'lucide-react';

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

function initialProgress(): UserProgress {
  return { userId: 'u1', targetScore: 7.5, bestScore: 6.5, weakArea: 'Listening' };
}

function initialGamification(): GamificationStats {
  return { currentStreak: 5, totalXP: 860, currentLevel: 3, badges: ['Starter', 'First-Week'], todayActive: false };
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
  const [progress, setProgress] = useState<UserProgress>(initialProgress());
  const [stats, setStats] = useState<GamificationStats>(initialGamification());
  const [tasks, setTasks] = useState<DailyTask[]>([]);

  useEffect(() => {
    setTasks(generateDaily(progress.weakArea));
  }, [progress.weakArea]);

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
    <div className="bg-gray-50 dark:bg-transparent p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Action-Oriented Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Self-driven IELTS growth with gamification and next best actions.</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target</div>
          <div className="text-3xl font-extrabold text-rose-500 leading-none">8.0</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-emerald-500/15 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 grid place-items-center">
            <Flame className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500 dark:text-slate-400 font-medium">Streak</div>
            <div className="text-3xl font-bold text-gray-800 dark:text-slate-100">{stats.currentStreak} days</div>
            <div className={`text-xs ${stats.todayActive ? 'text-emerald-600' : 'text-slate-500'}`}>
              {stats.todayActive ? 'Today active' : 'Complete a task to keep streak'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-emerald-500/15 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 grid place-items-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-slate-400 font-medium">Level</div>
                <div className="text-3xl font-bold text-gray-800 dark:text-slate-100 leading-none">Lv {stats.currentLevel}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-400">{stats.totalXP} XP</div>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${level.pct}%` }} />
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-400 mt-2">Next: Level {stats.currentLevel + 1}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-emerald-500/15 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 grid place-items-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-slate-400 font-medium">Target Progress</div>
                <div className="text-3xl font-bold text-gray-800 dark:text-slate-100 leading-none">
                  {progress.bestScore.toFixed(1)} / {progress.targetScore.toFixed(1)}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-400">{Math.round(targetPct)}%</div>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${targetPct}%` }} />
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-400 mt-2">Best score toward target</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-emerald-500/15 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 grid place-items-center">
                {areaIcon(progress.weakArea)}
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-slate-400 font-medium">Weak Area</div>
                <div className="text-3xl font-bold text-gray-800 dark:text-slate-100 leading-none">{progress.weakArea}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-400">Best {progress.bestScore.toFixed(1)}</div>
          </div>
          <button
            onClick={onPracticeNow}
            className="w-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/25 py-2 px-6 rounded-lg text-sm font-semibold transition"
          >
            Practice Now
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl text-white p-6 md:p-8 shadow">
        <div className="flex items-center gap-3 mb-2">
          <img
            src="/logohead.png"
            onError={(e) => ((e.currentTarget as HTMLImageElement).src = '/logo.png')}
            alt="IELTSify"
            className="h-7 object-contain"
          />
          <div className="text-xl md:text-2xl font-bold">AI Writing Evaluation</div>
          <span className="ml-auto text-xs bg-emerald-600/90 px-2 py-1 rounded-md font-semibold">95%+ ACCURACY</span>
        </div>
        <p className="text-sm md:text-base text-white/90 max-w-3xl">
          Get actionable band-based feedback on essays with examples and targeted fixes.
        </p>
        <div className="mt-4">
          <button className="px-6 py-2 rounded-lg bg-white text-emerald-600 font-semibold hover:shadow-lg transition">
            Start Writing Evaluation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mt-0 border border-gray-100 dark:border-emerald-500/15">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-gray-800 dark:text-slate-100">Today’s Action Plan</div>
              <button
                onClick={onCompleteAll}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-500/15 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-200 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 transition"
                disabled={tasks.every(t => t.status === 'completed')}
              >
                Complete All
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-emerald-500/10">
              {tasks.slice(0, 3).map(t => {
                const done = t.status === 'completed';
                return (
                  <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-emerald-500/10 last:border-0">
                    <div className="flex items-center gap-3 flex-1 px-3 -mx-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/60 transition">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => onToggleTask(t.id)}
                        className="w-5 h-5 accent-emerald-600"
                      />
                      <div>
                        <div className={`font-semibold ${done ? 'text-emerald-700 line-through' : 'text-gray-800 dark:text-slate-100'}`}>{t.title}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                          {areaIcon(t.area)}
                          <span>{t.area}</span>
                          <span>•</span>
                          <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400 text-[11px] font-bold px-2 py-0.5 rounded-full">+{t.xp} XP</span>
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm ${done ? 'text-emerald-600' : 'text-gray-400 dark:text-slate-500'}`}>
                      {done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-emerald-500/15 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold text-gray-800 dark:text-slate-100">Weak Area</div>
              <div className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-700/60 text-gray-600 dark:text-slate-300">
                Best {progress.bestScore.toFixed(1)}
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 grid place-items-center">
                {areaIcon(progress.weakArea)}
              </div>
              <div className="font-semibold text-gray-800 dark:text-slate-100">{progress.weakArea}</div>
            </div>
            <button
              onClick={onPracticeNow}
              className="w-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/25 py-1.5 px-4 rounded-lg text-sm font-semibold transition"
            >
              Practice Now
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-emerald-500/15 shadow-sm p-6">
            <div className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-3">Level Progress</div>
            <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${level.pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mt-2">
              <div>Level {stats.currentLevel}</div>
              <div>{stats.totalXP} XP</div>
              <div>Next Level {stats.currentLevel + 1}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-emerald-500/15 shadow-sm p-6">
            <div className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-3">Streak</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 grid place-items-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none text-gray-800 dark:text-slate-100">{stats.currentStreak}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">days streak</div>
              </div>
            </div>
            <div className={`mt-2 text-xs ${stats.todayActive ? 'text-emerald-600' : 'text-gray-500 dark:text-slate-400'}`}>
              {stats.todayActive ? 'Today active' : 'Complete a task to keep streak'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
