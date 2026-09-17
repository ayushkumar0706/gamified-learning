import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Award, Trophy, Zap, Flame, Lock, CheckCircle2, Star,
  Shield, Target, Sparkles, Filter, ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Achievements' },
  { id: 'learning', label: '📚 Learning & Topics' },
  { id: 'streak', label: '🔥 Streaks' },
  { id: 'score', label: '🎯 Quizzes & Scores' },
  { id: 'career', label: '💼 Career & Senior' },
];

const ALL_ACHIEVEMENTS = [
  {
    id: 'first-step',
    title: 'First Step',
    category: 'learning',
    rarity: 'Common',
    xpReward: 50,
    icon: '🚀',
    description: 'Complete your very first topic module on LearnUp.',
    checkUnlocked: (data) => (data?.completedTopics ?? 0) >= 1,
    getProgress: (data) => ({ current: Math.min(1, data?.completedTopics ?? 0), max: 1 }),
  },
  {
    id: 'dsa-initiate',
    title: 'DSA Initiate',
    category: 'learning',
    rarity: 'Common',
    xpReward: 100,
    icon: '🧠',
    description: 'Complete 3 learning topics across any level.',
    checkUnlocked: (data) => (data?.completedTopics ?? 0) >= 3,
    getProgress: (data) => ({ current: Math.min(3, data?.completedTopics ?? 0), max: 3 }),
  },
  {
    id: 'dsa-warrior',
    title: 'DSA Warrior',
    category: 'learning',
    rarity: 'Rare',
    xpReward: 250,
    icon: '⚔️',
    description: 'Complete 6 core topics and build solid foundations.',
    checkUnlocked: (data) => (data?.completedTopics ?? 0) >= 6,
    getProgress: (data) => ({ current: Math.min(6, data?.completedTopics ?? 0), max: 6 }),
  },
  {
    id: 'streak-starter',
    title: 'Spark of Habit',
    category: 'streak',
    rarity: 'Common',
    xpReward: 50,
    icon: '⚡',
    description: 'Maintain an active daily learning streak for 2 days.',
    checkUnlocked: (data) => (data?.streak ?? 0) >= 2 || (data?.maxStreak ?? 0) >= 2,
    getProgress: (data) => ({ current: Math.min(2, Math.max(data?.streak ?? 0, data?.maxStreak ?? 0)), max: 2 }),
  },
  {
    id: 'streak-fire',
    title: 'On Fire',
    category: 'streak',
    rarity: 'Rare',
    xpReward: 150,
    icon: '🔥',
    description: 'Maintain a 5-day continuous learning streak.',
    checkUnlocked: (data) => (data?.streak ?? 0) >= 5 || (data?.maxStreak ?? 0) >= 5,
    getProgress: (data) => ({ current: Math.min(5, Math.max(data?.streak ?? 0, data?.maxStreak ?? 0)), max: 5 }),
  },
  {
    id: 'streak-legend',
    title: 'Habit Champion',
    category: 'streak',
    rarity: 'Legendary',
    xpReward: 500,
    icon: '👑',
    description: 'Reach an unbelievable 14-day study streak!',
    checkUnlocked: (data) => (data?.streak ?? 0) >= 14 || (data?.maxStreak ?? 0) >= 14,
    getProgress: (data) => ({ current: Math.min(14, Math.max(data?.streak ?? 0, data?.maxStreak ?? 0)), max: 14 }),
  },
  {
    id: 'quiz-ace',
    title: 'Quiz Ace',
    category: 'score',
    rarity: 'Common',
    xpReward: 80,
    icon: '🎯',
    description: 'Score 80% or higher on any topic assessment.',
    checkUnlocked: (data) => data?.recentAttempts?.some((a) => a.scorePercentage >= 80),
    getProgress: (data) => {
      const topScore = Math.max(0, ...(data?.recentAttempts?.map((a) => a.scorePercentage) || [0]));
      return { current: Math.min(80, topScore), max: 80, unit: '%' };
    },
  },
  {
    id: 'perfect-score',
    title: 'Flawless Victory',
    category: 'score',
    rarity: 'Epic',
    xpReward: 300,
    icon: '✨',
    description: 'Achieve a 100% perfect score on a topic quiz.',
    checkUnlocked: (data) => data?.recentAttempts?.some((a) => a.scorePercentage === 100),
    getProgress: (data) => {
      const hasPerfect = data?.recentAttempts?.some((a) => a.scorePercentage === 100);
      return { current: hasPerfect ? 1 : 0, max: 1 };
    },
  },
  {
    id: 'century-xp',
    title: 'Century Pioneer',
    category: 'learning',
    rarity: 'Common',
    xpReward: 100,
    icon: '💎',
    description: 'Accumulate 200 total XP from quizzes and milestones.',
    checkUnlocked: (data) => (data?.xp ?? 0) >= 200,
    getProgress: (data) => ({ current: Math.min(200, data?.xp ?? 0), max: 200, unit: 'XP' }),
  },
  {
    id: 'grand-master',
    title: 'Grand Master',
    category: 'learning',
    rarity: 'Legendary',
    xpReward: 1000,
    icon: '🏆',
    description: 'Amass 1,000+ total XP across your campus journey.',
    checkUnlocked: (data) => (data?.xp ?? 0) >= 1000,
    getProgress: (data) => ({ current: Math.min(1000, data?.xp ?? 0), max: 1000, unit: 'XP' }),
  },
  {
    id: 'senior-mentor',
    title: 'Campus Guide',
    category: 'career',
    rarity: 'Epic',
    xpReward: 400,
    icon: '🎓',
    description: 'Achieve Senior status to mentor juniors in your college.',
    checkUnlocked: (data) => data?.userRole === 'senior' || data?.userRole === 'admin',
    getProgress: (data) => ({
      current: data?.userRole === 'senior' || data?.userRole === 'admin' ? 1 : 0,
      max: 1,
    }),
  },
  {
    id: 'placement-ready',
    title: 'Placement Ready',
    category: 'career',
    rarity: 'Legendary',
    xpReward: 750,
    icon: '💼',
    description: 'Complete 10 topics and reach Level 5 on the platform.',
    checkUnlocked: (data) => (data?.completedTopics ?? 0) >= 10 && (data?.level ?? 1) >= 5,
    getProgress: (data) => ({ current: Math.min(10, data?.completedTopics ?? 0), max: 10, unit: 'topics' }),
  },
];

const RARITY_STYLES = {
  Common: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  Rare: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Epic: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  Legendary: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700',
};

export default function Achievements() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const dashRes = await api.get('/dashboard').catch(() => null);
        setDashboardData(dashRes?.dashboard || null);
      } catch (err) {
        console.error('Failed to load achievement stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statsContext = {
    xp: dashboardData?.xp ?? user?.xp ?? 0,
    level: dashboardData?.level ?? user?.level ?? 1,
    streak: dashboardData?.streak ?? user?.currentStreak ?? 0,
    maxStreak: dashboardData?.maxStreak ?? user?.maxStreak ?? 0,
    completedTopics: dashboardData?.progressSummary?.completedTopics ?? 0,
    recentAttempts: dashboardData?.recentAttempts || [],
    userRole: user?.role || 'student',
  };

  const achievementsWithStatus = ALL_ACHIEVEMENTS.map((ach) => {
    const isUnlocked = ach.checkUnlocked(statsContext);
    const progress = ach.getProgress(statsContext);
    const pct = Math.min(100, Math.round((progress.current / progress.max) * 100));
    return {
      ...ach,
      isUnlocked,
      progress,
      pct,
    };
  });

  const filtered = achievementsWithStatus.filter(
    (a) => activeCategory === 'all' || a.category === activeCategory
  );

  const totalUnlocked = achievementsWithStatus.filter((a) => a.isUnlocked).length;
  const totalEarnedXP = achievementsWithStatus
    .filter((a) => a.isUnlocked)
    .reduce((acc, curr) => acc + curr.xpReward, 0);

  if (loading) {
    return (
      <div className="page-container max-w-5xl mx-auto space-y-6">
        <div className="skeleton h-36 w-full rounded-2xl" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-9 w-28 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-44 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* ── Header Banner ── */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-500/10 border border-amber-500/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏅</span>
              <span className="badge badge-xp font-bold">Hall of Fame</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text)]">
              Achievements & Badges
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-lg">
              Unlock prestigious badges, elevate your college standing, and earn bonus XP on your journey to placement.
            </p>
          </div>

          {/* Quick counters */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="card p-4 text-center bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] min-w-[110px]">
              <p className="text-2xl font-black text-[var(--color-primary)]">
                {totalUnlocked} / {achievementsWithStatus.length}
              </p>
              <p className="text-[11px] font-semibold text-[var(--color-text-muted)] mt-0.5">Badges Earned</p>
            </div>
            <div className="card p-4 text-center bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] min-w-[110px]">
              <p className="text-2xl font-black text-amber-500">
                +{totalEarnedXP}
              </p>
              <p className="text-[11px] font-semibold text-[var(--color-text-muted)] mt-0.5">Bonus XP Gained</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Filters ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Achievements Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ach) => (
          <div
            key={ach.id}
            className={`card p-5 border transition-all flex flex-col justify-between relative overflow-hidden ${
              ach.isUnlocked
                ? 'border-amber-500/40 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent shadow-sm'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] opacity-75'
            }`}
          >
            {/* Top row: Icon & Rarity */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                    ach.isUnlocked
                      ? 'bg-amber-500/15 border border-amber-500/30'
                      : 'bg-[var(--color-bg)] border border-[var(--color-border)] text-gray-400 grayscale'
                  }`}
                >
                  {ach.isUnlocked ? ach.icon : '🔒'}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${RARITY_STYLES[ach.rarity]}`}>
                    {ach.rarity}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-0.5">
                    <Zap size={10} />
                    +{ach.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-black text-sm text-[var(--color-text)] flex items-center gap-1.5">
                {ach.title}
                {ach.isUnlocked && (
                  <CheckCircle2 size={15} className="text-[var(--color-success)] shrink-0" />
                )}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
                {ach.description}
              </p>
            </div>

            {/* Bottom: Progress Bar */}
            <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
              <div className="flex justify-between items-center text-[11px] mb-1.5">
                <span className="text-[var(--color-text-subtle)] font-medium">
                  {ach.isUnlocked ? 'Completed' : 'Progress'}
                </span>
                <span className="font-bold text-[var(--color-text)]">
                  {ach.progress.current} / {ach.progress.max} {ach.progress.unit || ''}
                </span>
              </div>
              <div className="w-full bg-[var(--color-border)] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    ach.isUnlocked
                      ? 'bg-[var(--color-success)]'
                      : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]'
                  }`}
                  style={{ width: `${ach.pct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
