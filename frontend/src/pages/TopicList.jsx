import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import {
   CheckCircle2,  Clock, Zap, Search,
   ChevronRight,   ArrowLeft
} from 'lucide-react';

export default function TopicList() {
  const { levelId } = useParams();
  const [topics, setTopics] = useState([]);
  const [levels, setLevels] = useState([]);
  const [levelInfo, setLevelInfo] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const endpoint = levelId ? `/topics?level=${levelId}` : '/topics';
        const [topicsRes, progressRes, levelsRes] = await Promise.all([
          api.get(endpoint),
          api.get('/progress').catch(() => ({ progress: [] })),
          api.get('/levels').catch(() => ({ levels: [] })),
        ]);

        setTopics(topicsRes.topics || []);
        setLevels(levelsRes.levels || []);

        if (levelId) {
          const currentLvl = levelsRes.levels?.find((l) => l._id === levelId);
          if (currentLvl) {
            setLevelInfo(currentLvl);
          } else {
            const singleLvlRes = await api.get(`/levels/${levelId}`).catch(() => null);
            if (singleLvlRes?.level) setLevelInfo(singleLvlRes.level);
          }
        }

        // Build quick lookup for topic status
        const pMap = {};
        (progressRes.progress || []).forEach((p) => {
          const topicId = p.topic?._id || p.topic;
          if (topicId) pMap[topicId] = p.status;
        });
        setProgressMap(pMap);
      } catch (err) {
        setError(err.message || 'Failed to load topics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [levelId]);

  // Extract subjects for filter tabs
  const subjects = ['all', ...Array.from(new Set(topics.map((t) => t.subject).filter(Boolean)))];

  // Filter topics
  const filteredTopics = topics.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desciription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || t.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const completedCount = topics.filter((t) => progressMap[t._id] === 'completed').length;
  const progressPct = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  if (loading) {
    return (
      <div className="page-container max-w-5xl mx-auto space-y-6">
        <div className="skeleton h-36 w-full rounded-2xl" />
        <div className="flex gap-3">
          <div className="skeleton h-10 flex-1 rounded-xl" />
          <div className="skeleton h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <Link to="/levels" className="btn btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Return to Levels
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* ── Header Card ── */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/levels"
                className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
              >
                <ArrowLeft size={12} /> All Levels
              </Link>
              {levelInfo && (
                <>
                  <span className="text-xs text-[var(--color-text-subtle)]">•</span>
                  <span className="badge badge-primary text-[10px]">Level {levelInfo.levelNumber || 1}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text)]">
              {levelInfo ? levelInfo.name : 'Curated Topics & Roadmaps'}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-xl">
              {levelInfo?.description ||
                'Explore foundational concepts, master high-yield topics, and test yourself with interactive quizzes.'}
            </p>
          </div>

          {/* Progress Card in Banner */}
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
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input
            type="text"
            placeholder="Search topics, subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full pl-10 text-xs"
          />
        </div>

        {/* Subject Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {subjects.map((sub) => (
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
            🔍
          </div>
          <h3 className="font-bold text-base text-[var(--color-text)]">No topics found</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Try adjusting your search query or subject filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic, idx) => {
            const status = progressMap[topic._id] || 'not-started';
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
                  {/* Top Bar: Subject & Status */}
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

                  {/* Title & Description */}
                  <h3 className="font-bold text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                    {topic.desciription || 'Master core interview concepts, algorithmic patterns, and practice challenges.'}
                  </p>
                </div>

                {/* Footer Bar */}
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