import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Trophy, Flame, Zap, TrendingUp, Users, Medal, ChevronUp, AlertCircle
} from 'lucide-react';

// ── Skeleton ──────────────────────────────────────────────────────────────────
function LeaderboardSkeleton() {
  return (
    <div className="page-container max-w-3xl mx-auto space-y-4">
      <div className="skeleton h-10 w-56 rounded-xl" />
      <div className="skeleton h-5 w-40 rounded-lg" />
      <div className="flex gap-2 mt-4">
        <div className="skeleton h-9 w-28 rounded-full" />
        <div className="skeleton h-9 w-28 rounded-full" />
      </div>
      <div className="space-y-2.5 mt-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ── Medal / rank display ──────────────────────────────────────────────────────
function RankDisplay({ rank }) {
  if (rank === 1) return <span className="rank-medal-1 text-xl">🥇</span>;
  if (rank === 2) return <span className="rank-medal-2 text-xl">🥈</span>;
  if (rank === 3) return <span className="rank-medal-3 text-xl">🥉</span>;
  return (
    <span className="w-8 text-center text-sm font-bold text-[var(--color-text-muted)]">
      {rank}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, size = 'md' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold shrink-0`}
    >
      {initials}
    </div>
  );
}

// ── Single leaderboard row ────────────────────────────────────────────────────
function LeaderboardRow({ entry, filter, isSticky = false }) {
  const isTop3 = entry.rank <= 3;
  return (
    <div
      className={`leaderboard-row ${entry.isCurrentUser ? 'current-user' : ''} ${
        isTop3 && !entry.isCurrentUser ? 'border-[var(--color-border)]' : ''
      } ${isSticky ? 'sticky bottom-0 z-10 shadow-lg' : ''}`}
    >
      {/* Rank */}
      <div className="w-8 flex items-center justify-center shrink-0">
        <RankDisplay rank={entry.rank} />
      </div>

      {/* Avatar */}
      <Avatar name={entry.name} size={isTop3 ? 'md' : 'sm'} />

      {/* Name & meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-bold truncate ${isTop3 ? 'text-base' : 'text-sm'} text-[var(--color-text)]`}>
            {entry.name}
            {entry.isCurrentUser && (
              <span className="ml-1.5 text-xs badge badge-primary">You</span>
            )}
          </p>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] truncate">
          {[entry.branch, entry.year ? `Year ${entry.year}` : null]
            .filter(Boolean)
            .join(' · ') || 'Student'}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Primary stat based on filter */}
        {filter === 'streak' ? (
          <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-danger)]">
            <span className="streak-flame">🔥</span>
            <span>{entry.streak}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-xp-dark)]">
            <Zap size={14} className="text-[var(--color-xp)]" />
            <span>{(entry.xp ?? 0).toLocaleString()}</span>
          </div>
        )}

        {/* Platform level badge */}
        <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-full">
          Lvl {entry.platformLevel}
        </div>
      </div>
    </div>
  );
}

// ── Top 3 podium banner ───────────────────────────────────────────────────────
function PodiumBanner({ top3 }) {
  if (!top3 || top3.length < 1) return null;
  // Display order: 2nd, 1st, 3rd
  const order = [top3[1], top3[0], top3[2]].filter(Boolean);
  const heights = top3[1] ? ['h-20', 'h-28', 'h-16'] : ['h-28'];

  return (
    <div className="card mb-2 py-6">
      <div className="flex items-end justify-center gap-3">
        {order.map((entry, i) => {
          const rankIndex = top3[1] ? [1, 0, 2][i] : 0;
          const height = heights[i];
          const colors = [
            { bg: 'var(--color-secondary-light)', text: 'var(--color-secondary)' },
            { bg: 'var(--color-xp-light)', text: 'var(--color-xp-dark)' },
            { bg: 'var(--color-success-light)', text: 'var(--color-success)' },
          ][rankIndex] ?? { bg: 'var(--color-bg)', text: 'var(--color-text-muted)' };

          return (
            <div key={entry.userId} className="flex flex-col items-center gap-2 flex-1 max-w-[110px]">
              <Avatar name={entry.name} />
              <p className="text-xs font-bold text-[var(--color-text)] text-center truncate w-full px-1">
                {entry.name.split(' ')[0]}
              </p>
              <div
                className={`${height} w-full rounded-t-xl flex items-start justify-center pt-2`}
                style={{ background: colors.bg }}
              >
                <p className="text-lg font-black" style={{ color: colors.text }}>
                  {rankIndex === 0 ? '🥇' : rankIndex === 1 ? '🥈' : '🥉'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Filter tabs ───────────────────────────────────────────────────────────────
const FILTERS = [
  { id: 'overall', label: 'Overall XP',    icon: <Zap size={14} /> },
  { id: 'streak',  label: 'Streak',        icon: <Flame size={14} /> },
];

// ── Main Leaderboard component ────────────────────────────────────────────────
export default function Leaderboard() {
  const { user } = useAuth();

  const [filter,           setFilter]           = useState('overall');
  const [leaderboard,      setLeaderboard]      = useState([]);
  const [currentUserEntry, setCurrentUserEntry] = useState(null);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.get(`/leaderboard?filter=${filter}&limit=50`);
        setLeaderboard(data.leaderboard ?? []);
        setCurrentUserEntry(data.currentUserEntry ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filter]);

  if (loading) return <LeaderboardSkeleton />;

  if (error) return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="card border-[var(--color-danger)] bg-[var(--color-danger-light)] p-6 text-center">
        <AlertCircle size={24} className="text-[var(--color-danger)] mx-auto mb-2" />
        <p className="text-[var(--color-danger)] font-semibold">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm mt-3">Retry</button>
      </div>
    </div>
  );

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  // Is current user already shown in the main list?
  const currentUserInList = leaderboard.some((r) => r.isCurrentUser);

  return (
    <div className="page-container max-w-3xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={20} className="text-[var(--color-xp)]" />
          <h1 className="text-2xl font-black text-[var(--color-text)]">College Leaderboard</h1>
        </div>
        <p className="text-[var(--color-text-muted)] text-sm">
          {user?.college
            ? 'Ranked within your college. Keep learning to climb!'
            : 'Join a college to see your rank.'}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`btn btn-sm flex items-center gap-1.5 ${
              filter === f.id ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {leaderboard.length === 0 ? (
        <div className="card text-center py-12">
          <Users size={32} className="text-[var(--color-text-subtle)] mx-auto mb-3" />
          <p className="font-bold text-[var(--color-text)]">No data yet</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Be the first to earn XP in your college!
          </p>
        </div>
      ) : (
        <div>
          {/* Podium */}
          <PodiumBanner top3={top3} />

          {/* Rows */}
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <LeaderboardRow key={entry.userId} entry={entry} filter={filter} />
            ))}

            {/* Separator + current user if outside top list */}
            {currentUserEntry && !currentUserInList && (
              <>
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 border-t-2 border-dashed border-[var(--color-border)]" />
                  <span className="text-xs text-[var(--color-text-muted)] font-medium">Your Position</span>
                  <div className="flex-1 border-t-2 border-dashed border-[var(--color-border)]" />
                </div>
                <LeaderboardRow entry={currentUserEntry} filter={filter} isSticky />
              </>
            )}
          </div>

          {/* Stats footer */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Students Ranked', value: leaderboard.length, icon: <Users size={16} /> },
              {
                label: 'Top XP',
                value: `${(leaderboard[0]?.xp ?? 0).toLocaleString()}`,
                icon: <Zap size={16} />,
              },
              {
                label: 'Top Streak',
                value: `${leaderboard[0]?.streak ?? 0} days`,
                icon: <Flame size={16} />,
              },
            ].map((stat) => (
              <div key={stat.label} className="stat-card text-center">
                <div className="flex items-center justify-center gap-1.5 text-[var(--color-text-muted)] mb-1">
                  {stat.icon}
                </div>
                <p className="stat-card-value text-lg">{stat.value}</p>
                <p className="stat-card-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
