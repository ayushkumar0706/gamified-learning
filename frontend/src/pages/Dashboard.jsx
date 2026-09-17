import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import {
  Flame, Zap, Trophy, BookOpen, CheckCircle2, Lock,
  ArrowRight, TrendingUp, Clock, Star, ChevronRight, Rocket
} from 'lucide-react';

// ── Skeleton loader ──────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="page-container space-y-6 animate-pulse">
      <div className="skeleton h-10 w-64 rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 skeleton h-64 rounded-xl" />
        <div className="skeleton h-64 rounded-xl" />
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, color, bg }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: bg }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="stat-card-value">{value}</p>
      <p className="stat-card-label">{label}</p>
    </div>
  );
}

// ── XP bar ────────────────────────────────────────────────────────────────────
function XPBar({ xp, xpToNext }) {
  const pct = Math.min(100, Math.round((xp / (xp + xpToNext)) * 100));
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Zap size={14} className="text-[var(--color-xp)]" />
          <span className="text-sm font-bold text-[var(--color-text)]">{xp.toLocaleString()} XP</span>
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">{xpToNext.toLocaleString()} to next level</span>
      </div>
      <div className="xp-bar">
        <div
          className="xp-bar-fill"
          style={{ '--xp-pct': `${pct}%`, width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-[var(--color-text-subtle)] mt-1.5 text-right">{pct}% to next level</p>
    </div>
  );
}

// ── Journey mini-map ──────────────────────────────────────────────────────────
const LEVEL_META = [
  { icon: '🌱', name: 'Basic',          color: '#10B981' },
  { icon: '🧠', name: 'DSA',            color: '#6366F1' },
  { icon: '🚀', name: 'First Project',  color: '#8B5CF6' },
  { icon: '📄', name: 'Resume',         color: '#F59E0B' },
  { icon: '🎤', name: 'Interview Prep', color: '#EC4899' },
  { icon: '💼', name: 'Job Apply',      color: '#0EA5E9' },
  { icon: '🎓', name: 'Placement',      color: '#F97316' },
];

function JourneyMiniMap({ completedTopics, totalTopics }) {
  // Simple heuristic: mark first level complete if any topics done
  const activeIndex = 1; // hardcoded for now, will be dynamic in Journey page

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">My Journey</h2>
        <Link to="/journey" className="text-xs text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1">
          View all <ChevronRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {LEVEL_META.map((lvl, i) => {
          const status = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'locked';
          return (
            <div key={lvl.name} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                  status === 'done'   ? 'text-white' :
                  status === 'active' ? 'text-white ring-2 ring-offset-1' :
                  'bg-[var(--color-bg)] text-[var(--color-text-subtle)]'
                }`}
                style={{
                  background: status !== 'locked' ? lvl.color : undefined,
                  ringColor: status === 'active' ? lvl.color : undefined,
                }}
                title={lvl.name}
              >
                {status === 'done' ? '✓' : lvl.icon}
              </div>
              <p className="text-[9px] text-[var(--color-text-subtle)] text-center leading-tight hidden sm:block">
                {lvl.name.split(' ')[0]}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1.5">
          <span>Overall progress</span>
          <span>{completedTopics}/{totalTopics} topics</span>
        </div>
        <div className="xp-bar h-1.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
            style={{ width: totalTopics > 0 ? `${Math.round((completedTopics / totalTopics) * 100)}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Recent activity ───────────────────────────────────────────────────────────
function RecentActivity({ attempts }) {
  if (!attempts?.length) {
    return (
      <div className="card flex flex-col items-center justify-center py-10 text-center gap-3">
        <p className="text-3xl">📋</p>
        <p className="font-semibold text-[var(--color-text)]">No quizzes yet</p>
        <p className="text-sm text-[var(--color-text-muted)]">Take a quiz to see your results here.</p>
        <Link to="/learn" className="btn btn-primary btn-sm mt-1">
          <BookOpen size={14} />
          Start Learning
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="section-title">Recent Attempts</h2>
      <div className="space-y-2.5">
        {attempts.map((attempt, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg)]">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                attempt.scorePercentage >= 70
                  ? 'bg-[var(--color-success-light)] text-[var(--color-success)]'
                  : 'bg-[var(--color-danger-light)] text-[var(--color-danger)]'
              }`}
            >
              {attempt.scorePercentage >= 70 ? '✓' : '✗'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text)] truncate">{attempt.topicTitle}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {new Date(attempt.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <span
              className={`badge text-xs font-bold ${
                attempt.scorePercentage >= 70 ? 'badge-success' : 'badge-primary'
              }`}
              style={attempt.scorePercentage < 70 ? { background: 'var(--color-danger-light)', color: 'var(--color-danger)' } : {}}
            >
              {attempt.scorePercentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Quick actions ─────────────────────────────────────────────────────────────
function QuickActions() {
  const actions = [
    { icon: <BookOpen size={16} />, label: 'Continue Learning', to: '/learn',       color: 'btn-primary' },
    { icon: <Trophy size={16} />,   label: 'View Leaderboard',  to: '/leaderboard', color: 'btn-secondary' },
    { icon: <Rocket size={16} />,   label: 'My Journey',        to: '/journey',     color: 'btn-secondary' },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <Link key={a.to} to={a.to} className={`btn ${a.color} btn-sm`}>
          {a.icon}
          {a.label}
        </Link>
      ))}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/me')
      .then((data) => setDashboard(data.dashboard))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <DashboardSkeleton />;
  if (error) return (
    <div className="page-container">
      <div className="card border-[var(--color-danger)] bg-[var(--color-danger-light)] p-6 text-center">
        <p className="text-[var(--color-danger)] font-semibold">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm mt-3">
          Retry
        </button>
      </div>
    </div>
  );

  const { xp, level, xpToNextLevel, streak, maxStreak, progressSummary, recentAttempts } = dashboard;

  return (
    <div className="page-container space-y-6">
      {/* ── Greeting ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">
            {getGreeting()}, {user?.firstName} 👋
          </h1>
          {streak > 0 ? (
            <p className="text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1.5">
              <span className="streak-flame">🔥</span>
              You're on a <span className="font-bold text-[var(--color-danger)]">{streak} day streak</span> — keep it going!
            </p>
          ) : (
            <p className="text-[var(--color-text-muted)] mt-0.5">Start learning today to build your streak!</p>
          )}
        </div>
        <QuickActions />
      </div>

      {/* ── XP bar ── */}
      <XPBar xp={xp} xpToNext={xpToNextLevel} />

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<span className="streak-flame text-lg">🔥</span>}
          value={streak}
          label="Day Streak"
          color="var(--color-danger)"
          bg="var(--color-danger-light)"
        />
        <StatCard
          icon={<Zap size={18} />}
          value={`${xp.toLocaleString()}`}
          label="Total XP"
          color="var(--color-xp-dark)"
          bg="var(--color-xp-light)"
        />
        <StatCard
          icon={<Trophy size={18} />}
          value={`Lvl ${level}`}
          label="Current Level"
          color="var(--color-primary)"
          bg="var(--color-primary-light)"
        />
        <StatCard
          icon={<Star size={18} />}
          value={maxStreak}
          label="Best Streak"
          color="var(--color-secondary)"
          bg="var(--color-secondary-light)"
        />
      </div>

      {/* ── Main content grid ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Journey mini map + Progress */}
        <div className="lg:col-span-2 space-y-4">
          <JourneyMiniMap
            completedTopics={progressSummary?.completedTopics ?? 0}
            totalTopics={progressSummary?.totalTopics ?? 0}
          />

          {/* Progress detail */}
          <div className="card">
            <h2 className="section-title">Progress Overview</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Topics Started',    value: progressSummary?.inProgressTopics ?? 0, color: 'var(--color-xp)',     bg: 'var(--color-xp-light)'     },
                { label: 'Topics Completed',  value: progressSummary?.completedTopics   ?? 0, color: 'var(--color-success)', bg: 'var(--color-success-light)' },
                { label: 'Quizzes Taken',     value: recentAttempts?.length             ?? 0, color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-3.5 text-center"
                  style={{ background: item.bg }}
                >
                  <p className="text-2xl font-black" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs font-medium text-[var(--color-text-muted)] mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent attempts */}
        <div>
          <RecentActivity attempts={recentAttempts} />
        </div>
      </div>

      {/* ── CTA banner ── */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
      >
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
        <div className="flex-1 relative">
          <p className="text-white font-black text-lg">Ready to level up?</p>
          <p className="text-white/70 text-sm mt-0.5">Continue your DSA journey. You're 60% through.</p>
        </div>
        <Link to="/learn" className="btn bg-white text-[var(--color-primary-dark)] font-bold hover:shadow-lg transition-all shrink-0 relative">
          Continue Learning
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}