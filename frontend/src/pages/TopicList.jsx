import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import {
  CheckCircle2, Clock, Zap, Search,
  ChevronRight, ArrowLeft, Lock, ChevronDown
} from 'lucide-react';

export default function TopicList() {
  const { levelId: paramLevelId } = useParams();

  const [levels, setLevels]           = useState([]);
  const [activeLevelId, setActiveLevelId] = useState(paramLevelId || null);
  const [levelInfo, setLevelInfo]     = useState(null);
  const [topics, setTopics]           = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [clearedLevelIds, setClearedLevelIds] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [showLevelPicker, setShowLevelPicker] = useState(false);

  // Filtering & Search
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // ── Step 1: Load levels + progress + cleared status once ──────────────────
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [levelsRes, progressRes, clearedRes] = await Promise.all([
          api.get('/levels'),
          api.get('/progress/me').catch(() => ({ progress: [] })),
          api.get('/levels/my-progress').catch(() => ({ clearedLevels: [] })),
        ]);

        const allLevels = levelsRes.levels || [];
        setLevels(allLevels);

        // Build progress map
        const pMap = {};
        (progressRes.progress || []).forEach((p) => {
          const tid = p.topic?._id || p.topic;
          if (tid) pMap[tid] = p.status;
        });
        setProgressMap(pMap);

        const cleared = clearedRes.clearedLevels || [];
        const clearedIds = cleared.map(c => c.level?._id || c.level);
        setClearedLevelIds(clearedIds);

        // Determine which level to show:
        // If coming from /levels/:levelId/topics, use that.
        // Otherwise, pick the user's active level (first un-cleared).
        let targetId = paramLevelId;
        if (!targetId && allLevels.length > 0) {
          // Active = first level not yet cleared
          const activeLevel = allLevels.find(l => !clearedIds.includes(l._id)) || allLevels[0];
          targetId = activeLevel._id;
        }

        setActiveLevelId(targetId);
      } catch (err) {
        setError(err.message || 'Failed to load');
        setLoading(false);
      }
    };
    init();
  }, [paramLevelId]);

  // ── Step 2: Load topics whenever activeLevelId changes ────────────────────
  useEffect(() => {
    if (!activeLevelId) return;
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError('');
        setSearchQuery('');
        setSelectedSubject('all');

        const [topicsRes, lvlRes] = await Promise.all([
          api.get(`/topics?level=${activeLevelId}`),
          api.get(`/levels/${activeLevelId}`).catch(() => null),
        ]);

        setTopics(topicsRes.topics || []);
        if (lvlRes?.level) setLevelInfo(lvlRes.level);
        else setLevelInfo(levels.find(l => l._id === activeLevelId) || null);
      } catch (err) {
        setError(err.message || 'Failed to load topics');
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [activeLevelId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived ───────────────────────────────────────────────────────────────
  const subjects = ['all', ...Array.from(new Set(topics.map(t => t.subject).filter(Boolean)))];

  const filteredTopics = topics.filter(t => {
    const matchesSearch =
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desciription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || t.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const completedCount = topics.filter(t => progressMap[t._id] === 'completed').length;
  const progressPct    = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  // Level status helper
  const getLevelStatus = (level, idx) => {
    if (clearedLevelIds.includes(level._id)) return 'done';
    const prev = levels[idx - 1];
    if (!prev || clearedLevelIds.includes(prev._id)) return 'active';
    return 'locked';
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-container max-w-5xl mx-auto space-y-6">
        <div className="skeleton h-36 w-full rounded-2xl" />
        <div className="flex gap-3">
          <div className="skeleton h-10 flex-1 rounded-xl" />
          <div className="skeleton h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton h-44 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[var(--color-danger-light)] text-[var(--color-danger)] flex items-center justify-center mx-auto text-xl">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">Could not load topics</h2>
        <p className="text-sm text-[var(--color-text-muted)]">{error}</p>
        <Link to="/journey" className="btn btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Return to Journey
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container max-w-5xl mx-auto space-y-6 animate-fade-in">

      {/* ── Header Card ── */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/journey"
                className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
              >
                <ArrowLeft size={12} /> My Journey
              </Link>
              {levelInfo && (
                <>
                  <span className="text-xs text-[var(--color-text-subtle)]">•</span>
                  <span className="badge badge-primary text-[10px]">{levelInfo.name}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text)]">
              {levelInfo ? `${levelInfo.icon || ''} ${levelInfo.name}` : 'Learning Topics'}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-xl">
              {levelInfo?.description || 'Explore foundational concepts, master high-yield topics, and test yourself with interactive quizzes.'}
            </p>

            {/* Level Switcher — only when not coming from a direct URL */}
            {!paramLevelId && levels.length > 0 && (
              <div className="relative mt-3 inline-block">
                <button
                  onClick={() => setShowLevelPicker(v => !v)}
                  className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-light)] px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  Browse another level
                  <ChevronDown size={12} className={showLevelPicker ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {showLevelPicker && (
                  <div className="absolute top-full mt-2 left-0 z-20 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden w-64 py-1">
                    {levels.map((lvl, idx) => {
                      const st = getLevelStatus(lvl, idx);
                      return (
                        <button
                          key={lvl._id}
                          onClick={() => {
                            setActiveLevelId(lvl._id);
                            setShowLevelPicker(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--color-bg)] transition-colors ${
                            lvl._id === activeLevelId ? 'bg-[var(--color-primary-light)]' : ''
                          } ${st === 'locked' ? 'opacity-50' : ''}`}
                        >
                          <span className="text-base">{lvl.icon || '📚'}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${lvl._id === activeLevelId ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                              {lvl.name}
                            </p>
                          </div>
                          {st === 'done' && <CheckCircle2 size={14} className="text-[var(--color-success)] shrink-0" />}
                          {st === 'locked' && <Lock size={13} className="text-[var(--color-text-subtle)] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress mini-card */}
          <div className="card p-4 bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] min-w-[170px] shrink-0">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-[var(--color-text-muted)]">Progress</span>
              <span className="text-[var(--color-primary)]">{progressPct}%</span>
            </div>
            <div className="w-full bg-[var(--color-border)] h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] text-center font-medium">
              {completedCount} of {topics.length} topics mastered
            </p>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input
            type="text"
            placeholder="Search topics, subjects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input w-full pl-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
              }`}
            >
              {sub === 'all' ? 'All Subjects' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* ── Topics Grid ── */}
      {filteredTopics.length === 0 ? (
        <div className="card text-center py-12 px-4 border border-[var(--color-border)]">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg)] text-2xl flex items-center justify-center mx-auto mb-3">
            {topics.length === 0 ? '📭' : '🔍'}
          </div>
          <h3 className="font-bold text-base text-[var(--color-text)]">
            {topics.length === 0 ? 'No topics yet for this level' : 'No topics found'}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {topics.length === 0
              ? 'Check back soon — content is being added!'
              : 'Try adjusting your search query or subject filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic, idx) => {
            const status      = progressMap[topic._id] || 'not-started';
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in-progress';

            return (
              <Link
                key={topic._id}
                to={`/topics/${topic._id}`}
                className={`card p-5 border transition-all duration-200 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 group relative ${
                  isCompleted
                    ? 'border-[var(--color-success)]/30 bg-gradient-to-b from-[var(--color-success)]/5 to-transparent'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
                      {topic.subject || 'Core CS'}
                    </span>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-success)] bg-[var(--color-success-light)] px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    ) : isInProgress ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-full">
                        <Zap size={12} />
                        In Progress
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[var(--color-text-subtle)]">
                        Topic {idx + 1}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                    {topic.description || topic.desciription || 'Master core interview concepts, algorithmic patterns, and practice challenges.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[var(--color-text-subtle)] text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      ~25m
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      <Zap size={12} />
                      +50 XP
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {isCompleted ? 'Review' : 'Start'}
                    <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}