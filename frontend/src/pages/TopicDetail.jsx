import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  ChevronLeft, PlayCircle, Code2, Zap, BookOpen, CheckCircle2,
  Clock, ExternalLink, AlertCircle, ArrowRight, Star
} from 'lucide-react';

// ── Skeleton loader ───────────────────────────────────────────────────────────
function TopicSkeleton() {
  return (
    <div className="page-container max-w-3xl mx-auto space-y-5">
      <div className="skeleton h-5 w-32 rounded-lg" />
      <div className="skeleton h-9 w-3/4 rounded-xl" />
      <div className="skeleton h-4 w-full rounded-lg" />
      <div className="skeleton h-4 w-5/6 rounded-lg" />
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="skeleton h-28 rounded-xl" />
        <div className="skeleton h-28 rounded-xl" />
      </div>
      <div className="skeleton h-16 rounded-xl" />
    </div>
  );
}

// ── Status pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  if (status === 'completed')
    return <span className="badge badge-success">✓ Completed</span>;
  if (status === 'in-progress')
    return <span className="badge badge-primary">⚡ In Progress</span>;
  return (
    <span className="badge" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>
      ○ Not Started
    </span>
  );
}

// ── Video card ────────────────────────────────────────────────────────────────
function VideoCard({ video }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex items-start gap-3 hover:border-[var(--color-primary-muted)] group transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-[var(--color-danger-light)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
        <PlayCircle size={18} className="text-[var(--color-danger)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text)] truncate">{video.title}</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{video.channel || 'Video Resource'}</p>
        <div className="flex items-center gap-3 mt-2">
          {video.difficulty && (
            <span className="badge badge-secondary text-xs">{video.difficulty}</span>
          )}
          {video.upvotes > 0 && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <Star size={11} className="text-[var(--color-xp)]" />
              {video.upvotes}
            </span>
          )}
          <ExternalLink size={11} className="ml-auto text-[var(--color-text-subtle)] group-hover:text-[var(--color-primary)] transition-colors" />
        </div>
      </div>
    </a>
  );
}

// ── Coding resource card ──────────────────────────────────────────────────────
function CodingCard({ resource }) {
  const diffColor = {
    Easy:   { bg: 'var(--color-success-light)', text: 'var(--color-success)'  },
    Medium: { bg: 'var(--color-xp-light)',      text: 'var(--color-xp-dark)'  },
    Hard:   { bg: 'var(--color-danger-light)',  text: 'var(--color-danger)'   },
  }[resource.difficulty] || { bg: 'var(--color-bg)', text: 'var(--color-text-muted)' };

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex items-start gap-3 hover:border-[var(--color-primary-muted)] group transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
        <Code2 size={18} className="text-[var(--color-primary)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text)] truncate">{resource.title}</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{resource.platform || 'Practice Problem'}</p>
        <div className="flex items-center gap-2 mt-2">
          {resource.difficulty && (
            <span className="badge text-xs" style={{ background: diffColor.bg, color: diffColor.text }}>
              {resource.difficulty}
            </span>
          )}
          <ExternalLink size={11} className="ml-auto text-[var(--color-text-subtle)] group-hover:text-[var(--color-primary)] transition-colors" />
        </div>
      </div>
    </a>
  );
}

// ── Quiz CTA ──────────────────────────────────────────────────────────────────
function QuizCTA({ quizId, topicStatus, navigate }) {
  const isCompleted = topicStatus === 'completed';
  return (
    <div
      className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden"
      style={{ background: isCompleted ? 'linear-gradient(135deg,#059669,#10B981)' : 'linear-gradient(135deg,#4F46E5,#7C3AED)' }}
    >
      <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
      <div className="relative flex-1">
        <p className="text-white font-black text-base">
          {isCompleted ? '🎉 Topic Complete!' : '📝 Test Your Knowledge'}
        </p>
        <p className="text-white/70 text-sm mt-0.5">
          {isCompleted
            ? "You've already passed this quiz. Retake to practice."
            : 'Take the quiz to earn XP and mark this topic complete.'}
        </p>
      </div>
      <button
        onClick={() => navigate(`/quizzes/${quizId}/take`)}
        className="btn bg-white font-bold shrink-0 relative hover:shadow-lg transition-all"
        style={{ color: isCompleted ? 'var(--color-success-dark)' : 'var(--color-primary-dark)' }}
      >
        {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [topic,       setTopic]       = useState(null);
  const [quizId,      setQuizId]      = useState(null);
  const [videos,      setVideos]      = useState([]);
  const [coding,      setCoding]      = useState([]);
  const [topicStatus, setTopicStatus] = useState('not-started');
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicData, quizData, videoData, codingData, progressData] = await Promise.all([
          api.get(`/topics/${id}`),
          api.get(`/quizzes?topic=${id}`),
          api.get(`/videoresources?topic=${id}`).catch(() => ({ videos: [] })),
          api.get(`/coding-resources?topic=${id}`).catch(() => ({ resources: [] })),
          api.get('/progress').catch(() => ({ progress: [] })),
        ]);

        setTopic(topicData.topic);

        if (quizData.quizzes?.length > 0) {
          setQuizId(quizData.quizzes[quizData.quizzes.length - 1]._id);
        }

        setVideos(videoData.videos ?? []);
        setCoding(codingData.resources ?? codingData.codingResources ?? []);

        const prog = (progressData.progress ?? []).find(
          (p) => p.topic?._id === id || p.topic === id
        );
        setTopicStatus(prog?.status ?? 'not-started');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <TopicSkeleton />;

  if (error) return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="card border-[var(--color-danger)] bg-[var(--color-danger-light)] p-6 text-center">
        <AlertCircle size={24} className="text-[var(--color-danger)] mx-auto mb-2" />
        <p className="text-[var(--color-danger)] font-semibold">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm mt-3">Retry</button>
      </div>
    </div>
  );

  const hasResources = videos.length > 0 || coding.length > 0;

  return (
    <div className="page-container max-w-3xl mx-auto space-y-6 animate-fade-in">

      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      {/* Topic header */}
      <div className="card">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <div className="flex flex-wrap gap-2">
            {topic.subject && <span className="badge badge-primary">{topic.subject}</span>}
            <StatusPill status={topicStatus} />
          </div>
          {quizId && (
            <div className="flex items-center gap-1 text-xs text-[var(--color-xp-dark)] bg-[var(--color-xp-light)] px-2.5 py-1 rounded-full font-bold">
              <Zap size={12} />
              +XP on completion
            </div>
          )}
        </div>
        <h1 className="text-2xl font-black text-[var(--color-text)] mb-2">{topic.title}</h1>
        {(topic.description || topic.desciription) ? (
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            {topic.description ?? topic.desciription}
          </p>
        ) : (
          <p className="text-[var(--color-text-subtle)] text-sm italic">No description available.</p>
        )}
      </div>

      {/* Quiz CTA */}
      {quizId ? (
        <QuizCTA quizId={quizId} topicStatus={topicStatus} navigate={navigate} />
      ) : (
        <div className="card flex items-center gap-3 py-4 justify-center text-[var(--color-text-muted)]">
          <Clock size={16} />
          <span className="text-sm">No quiz available for this topic yet.</span>
        </div>
      )}

      {/* Resources */}
      {hasResources ? (
        <div className="space-y-5">
          {videos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <PlayCircle size={16} className="text-[var(--color-danger)]" />
                <h2 className="section-title mb-0">Video Resources</h2>
                <span className="badge text-xs ml-auto" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>
                  {videos.length}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {videos.map((v) => <VideoCard key={v._id} video={v} />)}
              </div>
            </div>
          )}
          {coding.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Code2 size={16} className="text-[var(--color-primary)]" />
                <h2 className="section-title mb-0">Practice Problems</h2>
                <span className="badge text-xs ml-auto" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>
                  {coding.length}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {coding.map((r) => <CodingCard key={r._id} resource={r} />)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-8">
          <BookOpen size={28} className="text-[var(--color-text-subtle)] mx-auto mb-2" />
          <p className="font-semibold text-[var(--color-text)]">No resources yet</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Learning materials will be added here soon.</p>
        </div>
      )}
    </div>
  );
}