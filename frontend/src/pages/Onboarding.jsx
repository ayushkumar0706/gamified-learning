import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Zap, Search, ChevronRight, ChevronLeft, Check, AlertCircle,
  Building2,    User, Mail, Lock,
  Eye, EyeOff, ArrowRight, Loader2
} from 'lucide-react';

// ── Step data ─────────────────────────────────────────────────────────────────
const PREP_LEVELS = [
  { id: 'just-starting',        label: 'Just starting out',           desc: 'I\'m new to programming / DSA', icon: '🌱' },
  { id: 'learning-dsa',         label: 'Learning DSA',                desc: 'Already doing arrays, linked lists…', icon: '🧠' },
  { id: 'building-projects',    label: 'Building projects',           desc: 'Learning web/app development', icon: '🚀' },
  { id: 'preparing-placements', label: 'Preparing for placements',    desc: 'Mock interviews, resume, etc.', icon: '🎤' },
  { id: 'already-applying',     label: 'Already applying to jobs',    desc: 'Active job search mode', icon: '💼' },
];

const CAREER_GOALS = [
  { id: 'Software Development', label: 'Software Development',  icon: '💻' },
  { id: 'DSA',                  label: 'DSA & Competitive',      icon: '🧠' },
  { id: 'Web Development',      label: 'Web Development',        icon: '🌐' },
  { id: 'Placements',           label: 'Campus Placements',      icon: '🎓' },
  { id: 'Interviews',           label: 'Interview Preparation',  icon: '🎤' },
];

const BRANCHES = ['Computer Science', 'Information Technology', 'Electronics & Comm.', 'Electrical', 'Mechanical', 'Civil', 'Chemical', 'Other'];
const YEARS = [
  { value: 1, label: '1st Year' },
  { value: 2, label: '2nd Year' },
  { value: 3, label: '3rd Year' },
  { value: 4, label: '4th Year' },
  { value: 5, label: '5th Year (Integrated)' },
];

// ── Progress dots ─────────────────────────────────────────────────────────────
function StepDots({ total, current }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i < current
              ? 'w-6 h-2 bg-[var(--color-primary)]'
              : i === current
              ? 'w-6 h-2 bg-[var(--color-primary)]'
              : 'w-2 h-2 bg-[var(--color-border)]'
          }`}
        />
      ))}
    </div>
  );
}

// ── Step 1 — College Search ───────────────────────────────────────────────────
function StepCollege({ data, onChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [debounce, setDebounce] = useState(null);

  const handleSearch = (val) => {
    setQuery(val);
    onChange({ college: null, collegeName: '' });
    if (debounce) clearTimeout(debounce);
    if (!val.trim()) { setResults([]); return; }
    setDebounce(setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(`/colleges?search=${encodeURIComponent(val)}`);
        setResults(res.colleges || []);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 400));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[var(--color-text)] mb-1">Where do you study?</h2>
        <p className="text-[var(--color-text-muted)]">We'll connect you with your college community.</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="input pl-10"
          placeholder="Search your college…"
          autoFocus
        />
        {searching && (
          <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] animate-spin" />
        )}
      </div>

      {/* Selected */}
      {data.college && (
        <div className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-[var(--color-primary)] bg-[var(--color-primary-light)]">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center">
            <Building2 size={16} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[var(--color-text)] text-sm">{data.collegeName}</p>
          </div>
          <Check size={16} className="text-[var(--color-primary)]" />
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !data.college && (
        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden divide-y divide-[var(--color-border)]">
          {results.map((c) => (
            <button
              key={c._id}
              onClick={() => { onChange({ college: c._id, collegeName: c.name }); setResults([]); setQuery(c.name); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-primary-light)] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
                <Building2 size={14} />
              </div>
              <div>
                <p className="font-medium text-[var(--color-text)] text-sm">{c.name}</p>
                {(c.city || c.state) && (
                  <p className="text-xs text-[var(--color-text-muted)]">{[c.city, c.state].filter(Boolean).join(', ')}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {query.trim() && results.length === 0 && !searching && !data.college && (
        <div className="text-center py-6">
          <p className="text-sm text-[var(--color-text-muted)] mb-3">College not found?</p>
          <button
            onClick={() => onChange({ college: 'other', collegeName: query.trim() })}
            className="btn btn-secondary btn-sm"
          >
            Add "{query.trim()}"
          </button>
        </div>
      )}
    </div>
  );
}

// ── Step 2 — Year & Branch ────────────────────────────────────────────────────
function StepAcademic({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[var(--color-text)] mb-1">Your academic details</h2>
        <p className="text-[var(--color-text-muted)]">This helps us personalise your experience.</p>
      </div>

      <div>
        <label className="input-label">Current Year</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {YEARS.map((y) => (
            <button
              key={y.value}
              onClick={() => onChange({ year: y.value })}
              className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                data.year === y.value
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary-muted)]'
              }`}
            >
              {y.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="input-label">Branch / Department</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {BRANCHES.map((b) => (
            <button
              key={b}
              onClick={() => onChange({ branch: b })}
              className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                data.branch === b
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary-muted)]'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 3 — Preparation Level ────────────────────────────────────────────────
function StepPrepLevel({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[var(--color-text)] mb-1">Where are you right now?</h2>
        <p className="text-[var(--color-text-muted)]">We'll place you at the right level on your journey.</p>
      </div>
      <div className="space-y-2.5">
        {PREP_LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => onChange({ currentPreparationLevel: level.id })}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              data.currentPreparationLevel === level.id
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary-muted)] bg-[var(--color-card)]'
            }`}
          >
            <span className="text-2xl">{level.icon}</span>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${data.currentPreparationLevel === level.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                {level.label}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{level.desc}</p>
            </div>
            {data.currentPreparationLevel === level.id && (
              <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                <Check size={12} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 4 — Career Goal ──────────────────────────────────────────────────────
function StepCareerGoal({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[var(--color-text)] mb-1">What's your primary goal?</h2>
        <p className="text-[var(--color-text-muted)]">This shapes your personalised roadmap.</p>
      </div>
      <div className="space-y-2.5">
        {CAREER_GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => onChange({ careerGoal: goal.id })}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              data.careerGoal === goal.id
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary-muted)] bg-[var(--color-card)]'
            }`}
          >
            <span className="text-2xl">{goal.icon}</span>
            <p className={`flex-1 font-semibold text-sm ${data.careerGoal === goal.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
              {goal.label}
            </p>
            {data.careerGoal === goal.id && (
              <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                <Check size={12} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 5 — Create Account ───────────────────────────────────────────────────
function StepAccount({ data, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-[var(--color-text)] mb-1">Create your account</h2>
        <p className="text-[var(--color-text-muted)]">Almost there — just a few more details.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label" htmlFor="ob-firstname">First Name</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
            <input id="ob-firstname" type="text" value={data.firstName} onChange={(e) => onChange({ firstName: e.target.value })}
              className="input pl-9" placeholder="Ayush" required />
          </div>
        </div>
        <div>
          <label className="input-label" htmlFor="ob-lastname">Last Name</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
            <input id="ob-lastname" type="text" value={data.lastName} onChange={(e) => onChange({ lastName: e.target.value })}
              className="input pl-9" placeholder="Kumar" />
          </div>
        </div>
      </div>

      <div>
        <label className="input-label" htmlFor="ob-email">Email Address</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input id="ob-email" type="email" value={data.email} onChange={(e) => onChange({ email: e.target.value })}
            className="input pl-9" placeholder="you@college.ac.in" required />
        </div>
      </div>

      <div>
        <label className="input-label" htmlFor="ob-password">Password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input id="ob-password" type={showPassword ? 'text' : 'password'} value={data.password}
            onChange={(e) => onChange({ password: e.target.value })}
            className="input pl-9 pr-9" placeholder="Min. 8 characters" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text)]">
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Summary of choices */}
      <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-border)] space-y-1.5">
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">Your Setup</p>
        {[
          { label: '🏫 College', value: data.collegeName || '—' },
          { label: '📅 Year',    value: data.year ? `${data.year}${['st','nd','rd','th'][Math.min(data.year-1,3)]} Year` : '—' },
          { label: '📚 Branch',  value: data.branch || '—' },
          { label: '🎯 Goal',    value: data.careerGoal || '—' },
        ].map((row) => (
          <div key={row.label} className="flex justify-between text-sm">
            <span className="text-[var(--color-text-muted)]">{row.label}</span>
            <span className="font-medium text-[var(--color-text)] truncate max-w-[55%] text-right">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Onboarding Component ─────────────────────────────────────────────────
const TOTAL_STEPS = 5;

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    college: null,
    collegeName: '',
    year: null,
    branch: '',
    currentPreparationLevel: '',
    careerGoal: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '' });

  const update = (partial) => setFormData((prev) => ({ ...prev, ...partial }));

  const canProceed = () => {
    if (step === 0) return !!formData.college;
    if (step === 1) return !!formData.year && !!formData.branch;
    if (step === 2) return !!formData.currentPreparationLevel;
    if (step === 3) return !!formData.careerGoal;
    if (step === 4) return !!formData.firstName && !!formData.email && formData.password.length >= 8;
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const body = {
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        email: formData.email,
        password: formData.password,
        college: formData.college !== 'other' ? formData.college : undefined,
        year: formData.year || undefined,
        branch: formData.branch || undefined,
        careerGoal: formData.careerGoal || undefined,
        currentPreparationLevel: formData.currentPreparationLevel || undefined };
      await api.post('/auth/register', body);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const STEPS = [
    <StepCollege    key={0} data={formData} onChange={update} />,
    <StepAcademic   key={1} data={formData} onChange={update} />,
    <StepPrepLevel  key={2} data={formData} onChange={update} />,
    <StepCareerGoal key={3} data={formData} onChange={update} />,
    <StepAccount    key={4} data={formData} onChange={update} />,
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex lg:w-[40%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #4F46E5 0%, #7C3AED 55%, #EC4899 100%)' }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white font-black text-xl">LearnUp</span>
        </div>

        <div className="relative">
          <p className="text-white/60 text-sm uppercase tracking-widest font-semibold mb-3">Your journey</p>
          <div className="space-y-3">
            {[
              { icon: '🌱', label: 'Basic', done: step >= 0 },
              { icon: '🧠', label: 'DSA', done: step >= 0 },
              { icon: '🚀', label: 'First Project', done: false },
              { icon: '🎓', label: 'Placement', done: false },
            ].map((lvl) => (
              <div key={lvl.label} className={`flex items-center gap-3 ${lvl.done ? '' : 'opacity-50'}`}>
                <span className="text-xl">{lvl.icon}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
                  <div className={`h-full rounded-full bg-white/70 transition-all duration-700 ${lvl.done ? 'w-3/4' : 'w-0'}`} />
                </div>
                <span className="text-white/70 text-xs font-medium">{lvl.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="text-white text-sm font-semibold mb-1">🎯 Sign up to get:</p>
            <ul className="space-y-1">
              {['Personalised learning roadmap', 'College leaderboard access', 'Senior mentorship network', 'XP & badge system'].map((t) => (
                <li key={t} className="flex items-center gap-2 text-xs text-white/80">
                  <Check size={12} className="text-[var(--color-success)]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="relative text-white/50 text-xs">Already registered? <a href="/login" className="text-white/80 hover:text-white underline">Log in</a></p>
      </div>

      {/* ── Right panel — steps ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            <StepDots total={TOTAL_STEPS} current={step} />
            <span className="text-xs text-[var(--color-text-muted)] font-medium">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
          </div>

          {/* Step content */}
          <div className="animate-fade-in" key={step}>
            {STEPS[step]}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm mt-4 border border-[var(--color-danger)]/20">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => { setError(''); setStep((s) => s - 1); }}
                className="btn btn-secondary"
              >
                <ChevronLeft size={18} />
                Back
              </button>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={() => { setError(''); setStep((s) => s + 1); }}
                disabled={!canProceed()}
                className="btn btn-primary flex-1"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || submitting}
                id="onboarding-submit"
                className="btn btn-primary flex-1"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    🚀 Start My Journey
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>

          {step === 0 && (
            <p className="text-center text-xs text-[var(--color-text-subtle)] mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Log in</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
