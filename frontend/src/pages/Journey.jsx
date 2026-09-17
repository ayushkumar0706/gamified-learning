import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  CheckCircle2, Lock, ChevronDown, ChevronUp, BookOpen,
  Zap, Trophy, Star, ArrowRight, Sparkles, Target, Loader2
} from 'lucide-react';

// ── Fallback icon map (used if level.icon is missing) ────────────────────────
const LEVEL_DEFAULTS = {
  1: { icon: '🌱', color: '#10B981' },
  2: { icon: '🧠', color: '#6366F1' },
  3: { icon: '🚀', color: '#8B5CF6' },
  4: { icon: '📄', color: '#F59E0B' },
  5: { icon: '🎤', color: '#EC4899' },
  6: { icon: '💼', color: '#0EA5E9' },
  7: { icon: '🎓', color: '#F97316' },
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
function JourneySkeleton() {
  return (
    <div className="page-container max-w-3xl mx-auto space-y-4">
      <div className="skeleton h-10 w-48 rounded-xl" />
      <div className="skeleton h-5 w-72 rounded-lg" />
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex gap-4 items-start">
          <div className="skeleton w-14 h-14 rounded-full shrink-0" />
          <div className="skeleton flex-1 h-20 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

// ── Clearance criterion row ───────────────────────────────────────────────────
function CriterionRow({ criterion, done }) {
  return (
    <div className={`flex items-start gap-2.5 py-1.5 ${done ? 'opacity-100' : 'opacity-70'}`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
        done ? 'bg-[var(--color-success)] text-white' : 'border-2 border-[var(--color-border)]'
      }`}>
        {done && <CheckCircle2 size={12} />}
      </div>
      <div>
        <p className={`text-sm font-medium ${done ? 'text-[var(--color-text)] line-through decoration-[var(--color-success)]' : 'text-[var(--color-text)]'}`}>
          {criterion.label}
        </p>
        {criterion.description && (
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{criterion.description}</p>
        )}
      </div>
    </div>
  );
}

// ── Level card (expanded detail panel) ───────────────────────────────────────
function LevelDetailPanel({ level, topics, progress, status, color }) {
  const navigate = useNavigate();
  const completedTopics = topics.filter(t => {
    const p = progress.find(p => p.topic?._id === t._id || p.topic === t._id);
    return p?.status === 'completed';
  });
  const progressPct = topics.length > 0
    ? Math.round((completedTopics.length / topics.length) * 100)
    : 0;

  return (
    <div className="mt-3 rounded-2xl border overflow-hidden animate-scale-in"
      style={{ borderColor: `${color}40` }}>

      {/* Header gradient */}
      <div className="px-5 py-4 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color}18, ${color}06)` }}>
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10"
          style={{ background: color }} />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color }}>
              {status === 'done' ? '✓ Completed' : status === 'active' ? '⚡ In Progress' : '🔒 Locked'}
            </p>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{level.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-black" style={{ color }}>+{level.xpReward ?? 500}</p>
            <p className="text-xs text-[var(--color-text-muted)]">XP Reward</p>
          </div>
        </div>

        {/* Progress bar */}
        {status !== 'locked' && topics.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[var(--color-text-muted)] font-medium">
                {completedTopics.length} / {topics.length} topics
              </span>
              <span className="font-bold" style={{ color }}>{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%`, background: color }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-4 bg-[var(--color-card)] space-y-5">
        {/* Topics */}
        {topics.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
              Topics in this level
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topics.map((topic) => {
                const p = progress.find(p => p.topic?._id === topic._id || p.topic === topic._id);
                const topicStatus = p?.status ?? 'not-started';
                return (
                  <button
                    key={topic._id}
                    onClick={() => status !== 'locked' && navigate(`/topics/${topic._id}`)}
                    disabled={status === 'locked'}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition-all ${
                      status === 'locked'
                        ? 'opacity-50 cursor-not-allowed bg-[var(--color-bg)]'
                        : 'hover:shadow-sm cursor-pointer'
                    }`}
                    style={{
                      background: topicStatus === 'completed'
                        ? 'var(--color-success-light)'
                        : topicStatus === 'in-progress'
                        ? 'var(--color-primary-light)'
                        : 'var(--color-bg)',
                      border: `1px solid ${
                        topicStatus === 'completed' ? 'var(--color-success)40'
                        : topicStatus === 'in-progress' ? 'var(--color-primary)40'
                        : 'var(--color-border)'}`
                    }}
                  >
                    <span className={`text-sm ${
                      topicStatus === 'completed' ? 'text-[var(--color-success)]'
                      : topicStatus === 'in-progress' ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text-subtle)]'
                    }`}>
                      {topicStatus === 'completed' ? '✓' : topicStatus === 'in-progress' ? '⚡' : '○'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">{topic.title}</p>
                      {topic.subject && (
                        <p className="text-xs text-[var(--color-text-muted)] truncate">{topic.subject}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {topics.length === 0 && (
          <div className="py-4 text-center">
            <p className="text-[var(--color-text-muted)] text-sm">No topics added yet.</p>
          </div>
        )}

        {/* Clearance criteria */}
        {level.clearanceCriteria?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
              Clearance Criteria
            </p>
            <div className="space-y-0.5">
              {level.clearanceCriteria.map((c) => (
                <CriterionRow key={c.criteriaId} criterion={c} done={status === 'done'} />
              ))}
            </div>
          </div>
        )}

        {/* Badge unlock preview */}
        {level.badgeUnlocked && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]">
            <span className="text-2xl">{level.badgeUnlocked.icon}</span>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">Badge Unlocked on Completion</p>
              <p className="font-bold text-[var(--color-text)] text-sm">{level.badgeUnlocked.name}</p>
            </div>
            <Star size={14} className="ml-auto text-[var(--color-xp)]" />
          </div>
        )}

        {/* CTA */}
        {status === 'active' && topics.length > 0 && (
          <button
            onClick={() => navigate(`/levels/${level._id}/topics`)}
            className="btn btn-primary w-full"
          >
            <BookOpen size={16} />
            Continue Learning
            <ArrowRight size={16} />
          </button>
        )}
        {status === 'done' && (
          <div className="flex items-center justify-center gap-2 py-2 text-[var(--color-success)] text-sm font-semibold">
            <CheckCircle2 size={16} />
            Level Complete — Well done!
          </div>
        )}
        {status === 'locked' && (
          <div className="flex items-center justify-center gap-2 py-2 text-[var(--color-text-subtle)] text-sm">
            <Lock size={14} />
            Complete previous levels to unlock
          </div>
        )}
      </div>
    </div>
  );
}

// ── Individual level node ─────────────────────────────────────────────────────
function LevelNode({ level, index, isLast, status, topics, progress, isExpanded, onToggle }) {
  const defaults = LEVEL_DEFAULTS[level.order] ?? LEVEL_DEFAULTS[1];
  const icon  = level.icon  || defaults.icon;
  const color = level.color || defaults.color;

  return (
    <div className="level-node w-full">
      {/* Connector above (skip for first) */}
      {index > 0 && (
        <div className={`level-connector mx-auto mb-1 ${
          status === 'done' || status === 'active' ? 'completed' : 'pending'
        }`} />
      )}

      {/* Row: circle + card */}
      <div className="flex items-start gap-4 w-full">
        {/* Circle */}
        <div
          className={`level-node-circle shrink-0 cursor-pointer hover:scale-110 transition-transform ${status}`}
          onClick={onToggle}
          title={level.name}
        >
          {status === 'done' ? '✓' : icon}
        </div>

        {/* Card */}
        <div className="flex-1">
          <button
            onClick={onToggle}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all hover:shadow-md group ${
              status === 'active'
                ? 'shadow-md'
                : status === 'locked'
                ? 'opacity-70'
                : ''
            }`}
            style={{
              borderColor: status === 'active'
                ? color
                : status === 'done'
                ? `${color}60`
                : 'var(--color-border)',
              background: isExpanded
                ? `${color}08`
                : 'var(--color-card)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-[var(--color-text)] text-lg leading-tight">{level.name}</h3>
                  {status === 'done' && (
                    <span className="badge badge-success text-xs">Complete</span>
                  )}
                  {status === 'active' && (
                    <span className="badge badge-primary text-xs animate-pulse">Current</span>
                  )}
                  {status === 'locked' && (
                    <span className="badge text-xs" style={{
                      background: 'var(--color-bg)',
                      color: 'var(--color-text-subtle)'
                    }}>
                      <Lock size={10} className="inline mr-1" />Locked
                    </span>
                  )}
                </div>
                <p className="text-[var(--color-text-muted)] text-sm mt-0.5 line-clamp-1">
                  {level.description}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold" style={{ color }}>+{level.xpReward ?? 500} XP</p>
                  <p className="text-xs text-[var(--color-text-muted)]">on clear</p>
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isExpanded ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg)] text-[var(--color-text-muted)]'
                }`}>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>
            </div>

            {/* Mini progress bar for active level */}
            {status === 'active' && topics.length > 0 && (() => {
              const done = topics.filter(t => {
                const p = progress.find(p => p.topic?._id === t._id || p.topic === t._id);
                return p?.status === 'completed';
              }).length;
              const pct = Math.round((done / topics.length) * 100);
              return (
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{done}/{topics.length} topics • {pct}%</p>
                </div>
              );
            })()}
          </button>

          {/* Expanded detail */}
          {isExpanded && (
            <LevelDetailPanel
              level={level}
              topics={topics}
              progress={progress}
              status={status}
              color={color}
            />
          )}
        </div>
      </div>

      {/* Connector below (skip for last) */}
      {!isLast && (
        <div className={`level-connector mx-auto mt-1 ${
          status === 'done' ? 'completed' : 'pending'
        }`} />
      )}
    </div>
  );
}

// ── Main Journey Page ─────────────────────────────────────────────────────────
export default function Journey() {
  const [levels, setLevels]       = useState([]);
  const [topics, setTopics]       = useState([]);   // all topics flat
  const [progress, setProgress]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [expanded, setExpanded]   = useState(null); // level._id of open panel

  useEffect(() => {
    const load = async () => {
      try {
        const [levelsRes, topicsRes, progressRes] = await Promise.all([
          api.get('/levels'),
          api.get('/topics'),
          api.get('/progress'),
        ]);
        setLevels(levelsRes.levels   ?? []);
        setTopics(topicsRes.topics   ?? []);
        setProgress(progressRes.progress ?? []);

        // Auto-expand first active level
        const lvls = levelsRes.levels ?? [];
        if (lvls.length > 0) {
          // Heuristic: first level that isn't fully completed
          setExpanded(lvls[0]._id); // expand first by default
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <JourneySkeleton />;

  if (error) return (
    <div className="page-container">
      <div className="card border-[var(--color-danger)] bg-[var(--color-danger-light)] p-6 text-center">
        <p className="text-[var(--color-danger)] font-semibold">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm mt-3">Retry</button>
      </div>
    </div>
  );

  // Calculate status per level
  const getLevelStatus = (level, index) => {
    // Get topics for this level
    const levelTopics = topics.filter(t =>
      t.level?._id === level._id || t.level === level._id
    );
    if (levelTopics.length === 0) {
      return index === 0 ? 'active' : index <= 1 ? 'active' : 'locked';
    }
    const completedCount = levelTopics.filter(t => {
      const p = progress.find(p => p.topic?._id === t._id || p.topic === t._id);
      return p?.status === 'completed';
    }).length;
    if (completedCount === levelTopics.length && levelTopics.length > 0) return 'done';
    if (completedCount > 0) return 'active';
    // If previous level is done, this one is active; otherwise locked
    if (index === 0) return 'active';
    return 'locked';
  };

  // Stats
  const totalCompleted = levels.filter((l, i) => getLevelStatus(l, i) === 'done').length;
  const totalXP = levels.reduce((sum, l) =>
    getLevelStatus(l, levels.indexOf(l)) === 'done' ? sum + (l.xpReward ?? 500) : sum, 0);

  return (
    <div className="page-container max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-[var(--color-xp)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Career Journey
          </span>
        </div>
        <h1 className="text-3xl font-black text-[var(--color-text)] mb-1">My Career Journey</h1>
        <p className="text-[var(--color-text-muted)]">
          7 levels. One destination. <span className="font-semibold text-[var(--color-text)]">Placement.</span>
        </p>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-success-light)] text-[var(--color-success)] text-sm font-bold">
            <CheckCircle2 size={14} />
            {totalCompleted} / {levels.length} Levels Done
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-xp-light)] text-[var(--color-xp-dark)] text-sm font-bold">
            <Zap size={14} />
            {totalXP.toLocaleString()} XP from levels
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-sm font-bold">
            <Target size={14} />
            {progress.filter(p => p.status === 'completed').length} topics completed
          </div>
        </div>
      </div>

      {/* Journey map */}
      {levels.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="font-bold text-[var(--color-text)]">No levels found</p>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            Ask your admin to seed the career levels.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-stretch">
          {levels.map((level, index) => {
            const status = getLevelStatus(level, index);
            const levelTopics = topics.filter(t =>
              t.level?._id === level._id || t.level === level._id
            );
            return (
              <LevelNode
                key={level._id}
                level={level}
                index={index}
                isLast={index === levels.length - 1}
                status={status}
                topics={levelTopics}
                progress={progress}
                isExpanded={expanded === level._id}
                onToggle={() => setExpanded(expanded === level._id ? null : level._id)}
              />
            );
          })}
        </div>
      )}

      {/* Bottom motivator */}
      <div className="mt-8 card text-center py-8">
        <p className="text-4xl mb-2">🎓</p>
        <p className="font-black text-[var(--color-text)] text-lg">The journey of 1000 miles begins with one step.</p>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">
          Every topic you complete brings you closer to your placement.
        </p>
      </div>
    </div>
  );
}
