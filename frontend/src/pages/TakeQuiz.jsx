import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  ChevronLeft, ChevronRight, Zap, CheckCircle2, XCircle,
  AlertCircle, BookOpen, ArrowRight, Trophy
} from 'lucide-react';

// ── Loading skeleton ──────────────────────────────────────────────────────────
function QuizSkeleton() {
  return (
    <div className="page-container max-w-2xl mx-auto space-y-5">
      <div className="skeleton h-5 w-32 rounded-lg" />
      <div className="skeleton h-2 w-full rounded-full" />
      <div className="skeleton h-32 rounded-xl" />
      <div className="space-y-2.5">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
      </div>
    </div>
  );
}

// ── Result screen ─────────────────────────────────────────────────────────────
function ResultScreen({ result, navigate }) {
  const pct = result.scorePercentage;
  const passed = pct >= 70;

  return (
    <div className="page-container max-w-xl mx-auto animate-fade-in">
      <div className="card text-center py-8 px-6">
        {/* Score circle */}
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-5 ${
            passed
              ? 'bg-[var(--color-success-light)] text-[var(--color-success)]'
              : 'bg-[var(--color-danger-light)] text-[var(--color-danger)]'
          }`}
        >
          {pct}%
        </div>

        <h1 className="text-2xl font-black text-[var(--color-text)] mb-1">
          {passed ? '🎉 Quiz Passed!' : '📚 Keep Practicing'}
        </h1>
        <p className="text-[var(--color-text-muted)] mb-6">
          {result.correctCount} / {result.totalQuestions} correct
          {passed ? ' — Great work!' : ' — Try again to improve your score.'}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* XP earned */}
          <div className="rounded-xl p-3.5 bg-[var(--color-xp-light)] text-center">
            <p className="text-2xl font-black text-[var(--color-xp-dark)]">
              +{result.attempt?.xpAwarded ?? 0}
            </p>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mt-0.5 flex items-center justify-center gap-1">
              <Zap size={11} className="text-[var(--color-xp)]" /> XP Earned
            </p>
          </div>

          {/* Platform level */}
          <div className="rounded-xl p-3.5 bg-[var(--color-primary-light)] text-center">
            <p className="text-2xl font-black text-[var(--color-primary)]">
              {result.levelInfo?.level ?? '—'}
            </p>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mt-0.5">
              Platform Level
            </p>
          </div>

          {/* Status */}
          <div className={`rounded-xl p-3.5 text-center ${
            passed ? 'bg-[var(--color-success-light)]' : 'bg-[var(--color-bg)]'
          }`}>
            {passed
              ? <CheckCircle2 size={24} className="text-[var(--color-success)] mx-auto mb-0.5" />
              : <XCircle size={24} className="text-[var(--color-text-subtle)] mx-auto mb-0.5" />}
            <p className="text-xs font-medium text-[var(--color-text-muted)]">
              {passed ? 'Completed' : 'Incomplete'}
            </p>
          </div>
        </div>

        {/* Progress XP bar */}
        {result.levelInfo && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1.5">
              <span>XP Progress</span>
              <span>{result.levelInfo.xpIntoCurrentLevel} / {result.levelInfo.xpIntoCurrentLevel + result.levelInfo.xpNeededForNextLevel}</span>
            </div>
            <div className="xp-bar">
              <div
                className="xp-bar-fill"
                style={{
                  '--xp-pct': `${Math.round((result.levelInfo.xpIntoCurrentLevel / (result.levelInfo.xpIntoCurrentLevel + result.levelInfo.xpNeededForNextLevel)) * 100)}%`,
                  width: `${Math.round((result.levelInfo.xpIntoCurrentLevel / (result.levelInfo.xpIntoCurrentLevel + result.levelInfo.xpNeededForNextLevel)) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            <ChevronLeft size={16} />
            Back to Topic
          </button>
          <button
            onClick={() => navigate('/journey')}
            className="btn btn-primary"
          >
            <Trophy size={16} />
            My Journey
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main quiz component ───────────────────────────────────────────────────────
export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz,                 setQuiz]                 = useState(null);
  const [questions,            setQuestions]            = useState([]);
  const [answers,              setAnswers]              = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading,              setLoading]              = useState(true);
  const [error,                setError]                = useState('');
  const [submitting,           setSubmitting]           = useState(false);
  const [result,               setResult]               = useState(null);

  const startTimeRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await api.get(`/quizzes/${id}/take`);
        setQuiz(data.quiz);
        setQuestions(data.questions);
        startTimeRef.current = Date.now();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const timeTakenSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const formattedAnswers = questions.map((q) => ({
      question: q._id,
      selectedIndex: answers[q._id] ?? -1,
    }));
    try {
      const data = await api.post('/attempts/submit', {
        quizId: id,
        answers: formattedAnswers,
        timeTakenSeconds,
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmAndSubmit = () => {
    const unanswered = questions.filter((q) => answers[q._id] === undefined).length;
    if (unanswered > 0) {
      const proceed = window.confirm(
        `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`
      );
      if (!proceed) return;
    }
    handleSubmit();
  };

  // ── Render states ──
  if (loading) return <QuizSkeleton />;

  if (error && !result) return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="card border-[var(--color-danger)] bg-[var(--color-danger-light)] p-6 text-center">
        <AlertCircle size={24} className="text-[var(--color-danger)] mx-auto mb-2" />
        <p className="text-[var(--color-danger)] font-semibold">{error}</p>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm mt-3">Go Back</button>
      </div>
    </div>
  );

  if (result) return <ResultScreen result={result} navigate={navigate} />;

  const currentQuestion  = questions[currentQuestionIndex];
  const isLast           = currentQuestionIndex === questions.length - 1;
  const isFirst          = currentQuestionIndex === 0;
  const answeredCount    = Object.keys(answers).length;
  const progressPct      = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <div className="page-container max-w-2xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Exit
        </button>
        <div className="flex-1">
          <p className="text-sm font-bold text-[var(--color-text)] truncate">
            {quiz?.topic?.title ?? 'Quiz'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted)]">
          <BookOpen size={14} />
          {answeredCount}/{questions.length} answered
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className="font-bold text-[var(--color-primary)]">{progressPct}%</span>
        </div>
        <div className="xp-bar">
          <div
            className="xp-bar-fill transition-all duration-500"
            style={{ '--xp-pct': `${progressPct}%`, width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div key={currentQuestion._id} className="card animate-scale-in">
        <p className="font-bold text-[var(--color-text)] text-lg leading-relaxed mb-5">
          {currentQuestion.questionText}
        </p>
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, optIndex) => {
            const isSelected = answers[currentQuestion._id] === optIndex;
            return (
              <label
                key={optIndex}
                className={`quiz-option cursor-pointer select-none ${isSelected ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={currentQuestion._id}
                  checked={isSelected}
                  onChange={() => selectAnswer(currentQuestion._id, optIndex)}
                  className="sr-only"
                />
                {/* Option letter */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-bg)] text-[var(--color-text-muted)]'
                  }`}
                >
                  {String.fromCharCode(65 + optIndex)}
                </div>
                <span className="flex-1 text-sm text-[var(--color-text)]">{option}</span>
                {isSelected && <CheckCircle2 size={16} className="text-[var(--color-primary)] shrink-0" />}
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentQuestionIndex((i) => i - 1)}
          disabled={isFirst}
          className="btn btn-secondary btn-sm"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* Dot indicators */}
        <div className="flex-1 flex items-center justify-center gap-1.5 flex-wrap">
          {questions.map((q, i) => (
            <button
              key={q._id}
              onClick={() => setCurrentQuestionIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentQuestionIndex
                  ? 'bg-[var(--color-primary)] scale-125'
                  : answers[q._id] !== undefined
                  ? 'bg-[var(--color-success)]'
                  : 'bg-[var(--color-border)]'
              }`}
              title={`Question ${i + 1}`}
            />
          ))}
        </div>

        {isLast ? (
          <button
            onClick={confirmAndSubmit}
            disabled={submitting}
            className="btn btn-success btn-sm"
          >
            {submitting ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
            ) : (
              <>Submit Quiz <Zap size={14} /></>
            )}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex((i) => i + 1)}
            className="btn btn-primary btn-sm"
          >
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Submit error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}