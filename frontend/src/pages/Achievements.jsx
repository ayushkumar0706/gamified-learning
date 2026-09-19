import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Zap, CheckCircle2 } from 'lucide-react';
import { BADGE_DEFINITIONS, BADGE_CATEGORIES, RARITY_STYLES } from '../data/badges';



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
    // DB badge IDs so level-clearance badges can be evaluated
    dbBadgeIds: new Set((user?.badges ?? []).map((b) => b.badgeId)),
  };

  const achievementsWithStatus = BADGE_DEFINITIONS.map((ach) => {
    const isUnlocked = ach.checkUnlocked(statsContext);
    const progress = ach.getProgress(statsContext);
    const pct = Math.min(100, Math.round((progress.current / progress.max) * 100));
    return { ...ach, isUnlocked, progress, pct };
  });

  const filtered = achievementsWithStatus.filter(
    (a) => activeCategory === 'all' || a.category === activeCategory
  );

  const totalUnlocked = achievementsWithStatus.filter((a) => a.isUnlocked).length;
  const totalEarnedXP = achievementsWithStatus
    .filter((a) => a.isUnlocked)
    .reduce((acc, curr) => acc + (curr.xpReward ?? 0), 0);

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
        {BADGE_CATEGORIES.map((cat) => (
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
                {ach.name ?? ach.title}
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
