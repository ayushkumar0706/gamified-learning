import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  CheckCircle2, Lock, ChevronDown, ChevronUp, BookOpen,
  Zap, Star, ArrowRight, Sparkles, Target, Award, Loader2, Info
} from 'lucide-react';

const LEVEL_DEFAULTS = {
  1: { icon: '🌱', color: '#10B981' },
  2: { icon: '🧠', color: '#6366F1' },
  3: { icon: '🚀', color: '#8B5CF6' },
  4: { icon: '📄', color: '#F59E0B' },
  5: { icon: '🎤', color: '#EC4899' },
  6: { icon: '💼', color: '#0EA5E9' },
  7: { icon: '🎓', color: '#F97316' },
};

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

function CriterionRow({ criterion, met, pending, note }) {
  return (
    <div className={`flex items-start gap-2.5 py-1.5 ${met || pending ? 'opacity-100' : 'opacity-70'}`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
        met && !pending
          ? 'bg-[var(--color-success)] text-white'
          : pending
          ? 'bg-amber-500/20 text-amber-500'
          : 'border-2 border-[var(--color-border)]'
      }`}>
        {met && !pending && <CheckCircle2 size={12} />}
        {pending && <Info size={10} />}
      </div>
      <div>
        <p className={`text-sm font-medium ${
          met && !pending ? 'text-[var(--color-text)] line-through decoration-[var(--color-success)]'
          : pending ? 'text-amber-600 dark:text-amber-400'
          : 'text-[var(--color-text)]'
        }`}>
          {criterion.label}
        </p>
        {note && (
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5 italic">{note}</p>
        )}
        {!note && criterion.description && (
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{criterion.description}</p>
        )}
      </div>
    </div>
  );
}

function LevelDetailPanel({ level, topics, progress, status, color, onClear, isClearing }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State for placement offer
  const [placementCompany, setPlacementCompany] = useState('');
  const [placementRole, setPlacementRole] = useState('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  
  const handlePlacementSubmit = async (e) => {
    e.preventDefault();
    if (!placementCompany.trim() || !placementRole.trim()) return;
    try {
      setIsSubmittingOffer(true);
      const res = await api.post('/users/placement', { company: placementCompany, role: placementRole });
      if (res.success) {
        window.location.reload(); // Quickest way to refresh user context and criteria
      }
    } catch (err) {
      console.error(err);
      alert('Failed to log placement offer');
    } finally {
      setIsSubmittingOffer(false);
    }
  };
  
  const completedTopics = topics.filter(t => {
    const p = progress.find(p => p.topic?._id === t._id || p.topic === t._id);
    return p?.status === 'completed';
  });
  
  const progressPct = topics.length > 0
    ? Math.round((completedTopics.length / topics.length) * 100)
    : 0;

  const criteriaResults = (level.clearanceCriteria ?? []).map(c => {
    let met = false;
    let pending = false;
    let note = null;

    if (c.type === 'topic-completion') {
      const completed = progress.filter(p =>
        p.status === 'completed' && topics.some(t => t._id === (p.topic?._id || p.topic))
      ).length;
      met = completed >= (c.targetCount ?? 1);
    } else if (c.type === 'quiz-pass') {
      const passed = progress.filter(p =>
        p.bestScorePercentage >= 70 && topics.some(t => t._id === (p.topic?._id || p.topic))
      ).length;
      met = passed >= (c.targetCount ?? 1);
    } else if (c.type === 'problem-count') {
      // Client can't count attempts — show as pending with guidance
      pending = true;
      met = true; // backend will do real enforcement
      note = `Complete at least ${c.targetCount ?? 1} quiz attempts in this level to satisfy this criterion.`;
    } else if (c.type === 'challenge') {
      pending = true;
      met = true;
      note = 'This criterion will be verified manually or via an upcoming challenge system.';
    } else if (c.type === 'project') {
      pending = true;
      met = true;
      note = 'Submit your project link to a senior or admin for verification.';
    } else if (c.type === 'manual') {
      if (c.criteriaId === 'receive-offer') {
        const hasOffer = !!(user && user.placementOffer && user.placementOffer.company);
        pending = !hasOffer;
        met = hasOffer;
        note = hasOffer ? 'Offer verified!' : 'Please log your placement offer to complete this level.';
      } else {
        met = true;
      }
    } else {
      met = true; // default
    }

    return { ...c, met, pending, note };
  });
  const allCriteriaMet = criteriaResults.every(c => c.met);

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
              {criteriaResults.map((c) => (
                <CriterionRow key={c.criteriaId} criterion={c} met={status === 'done' || c.met} pending={c.pending} note={c.note} />
              ))}
            </div>
            
            {/* Inline Placement Form for Level 7 */}
            {criteriaResults.find(c => c.criteriaId === 'receive-offer' && c.pending) && status === 'active' && (
              <form onSubmit={handlePlacementSubmit} className="mt-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-3">
                <p className="text-sm font-bold text-[var(--color-text)] mb-2">🎉 Log Your Placement Offer</p>
                <input 
                  type="text" 
                  placeholder="Company Name (e.g., Google, Amazon)" 
                  value={placementCompany}
                  onChange={e => setPlacementCompany(e.target.value)}
                  className="input w-full text-sm"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Role (e.g., SDE Intern, Frontend Engineer)" 
                  value={placementRole}
                  onChange={e => setPlacementRole(e.target.value)}
                  className="input w-full text-sm"
                  required
                />
                <button 
                  type="submit" 
                  disabled={isSubmittingOffer}
                  className="btn btn-primary w-full text-sm flex items-center justify-center gap-2"
                >
                  {isSubmittingOffer ? 'Logging...' : 'Submit Offer & Level Up'}
                </button>
              </form>
            )}
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
          allCriteriaMet ? (
            <div className="mt-4 p-4 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary-light)] text-center">
              <p className="text-[var(--color-primary)] font-bold mb-2">You have met all requirements!</p>
              <button 
                onClick={onClear} 
                disabled={isClearing}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                {isClearing ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} />}
                {isClearing ? 'Clearing...' : 'Clear Level & Claim Reward'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate(`/levels/${level._id}/topics`)}
              className="btn btn-primary w-full flex gap-2 items-center justify-center"
            >
              <BookOpen size={16} />
              Continue Learning
              <ArrowRight size={16} />
            </button>
          )
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

function LevelNode({ level, index, isLast, status, topics, progress, isExpanded, onToggle, onClear, isClearing }) {
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
              onClear={onClear}
              isClearing={isClearing}
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

export default function Journey() {
  const [levels, setLevels]       = useState([]);
  const [topics, setTopics]       = useState([]);
  const [progress, setProgress]   = useState([]);
  const [clearedLevels, setClearedLevels] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [expanded, setExpanded]   = useState(null);
  const [clearing, setClearing]   = useState(null);
  const [celebration, setCelebration] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [levelsRes, topicsRes, progressRes, clearedRes] = await Promise.all([
          api.get('/levels'),
          api.get('/topics'),
          api.get('/progress/me'),
          api.get('/levels/my-progress').catch(() => ({ clearedLevels: [] }))
        ]);
        setLevels(levelsRes.levels   ?? []);
        setTopics(topicsRes.topics   ?? []);
        setProgress(progressRes.progress ?? []);
        setClearedLevels(clearedRes.clearedLevels ?? []);

        // Auto-expand first active level
        const lvls = levelsRes.levels ?? [];
        if (lvls.length > 0) {
          setExpanded(lvls[0]._id);
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

  const getLevelStatus = (level, index) => {
    const isCleared = clearedLevels.some(c => c.level === level._id || c.level?._id === level._id);
    if (isCleared) return 'done';
    
    if (index === 0) return 'active';
    
    const prevLevel = levels[index - 1];
    const prevCleared = clearedLevels.some(c => c.level === prevLevel._id || c.level?._id === prevLevel._id);
    if (prevCleared) return 'active';
    
    return 'locked';
  };

  const handleClearLevel = async (levelId) => {
    setClearing(levelId);
    try {
      const res = await api.post(`/levels/${levelId}/clear`);
      setCelebration(res);
      setClearedLevels(prev => [...prev, { level: levelId }]);
      const idx = levels.findIndex(l => l._id === levelId);
      if (idx !== -1 && idx + 1 < levels.length) {
         setExpanded(levels[idx + 1]._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to clear level');
    } finally {
      setClearing(null);
    }
  };

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
                onClear={() => handleClearLevel(level._id)}
                isClearing={clearing === level._id}
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

      {/* Celebration Modal */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--color-card)] w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl animate-scale-in border border-[var(--color-border)]">
            <div className="w-20 h-20 mx-auto rounded-full bg-[var(--color-success-light)] text-[var(--color-success)] flex items-center justify-center mb-4 text-4xl shadow-inner">
              🎉
            </div>
            <h2 className="text-2xl font-black text-[var(--color-text)] mb-2">Level Cleared!</h2>
            <p className="text-[var(--color-text-muted)] mb-6 text-sm">{celebration.message}</p>
            
            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-[var(--color-bg)] rounded-xl p-3 flex-1 border border-[var(--color-border)]">
                <p className="text-2xl font-black text-[var(--color-xp)]">+{celebration.xpAwarded}</p>
                <p className="text-xs text-[var(--color-text-muted)] font-bold mt-1 uppercase">XP Earned</p>
              </div>
            </div>

            {celebration.badgeAwarded && (
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 text-left flex gap-3 items-center">
                <span className="text-3xl drop-shadow-md">{celebration.badgeAwarded.icon}</span>
                <div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-0.5">New Badge Unlocked!</p>
                  <p className="font-bold text-[var(--color-text)]">{celebration.badgeAwarded.name}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setCelebration(null)}
              className="btn btn-primary w-full py-3 text-lg"
            >
              Continue Journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
