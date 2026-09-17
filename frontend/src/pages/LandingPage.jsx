import { Link } from 'react-router-dom';
import {
  Rocket, Flame, Trophy, Star, BookOpen, Users, MessageSquare,
  ChevronRight, CheckCircle2, Lock, Zap, Target, TrendingUp,
  ArrowRight, Sparkles, GraduationCap, Code2, FileText, Mic
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

// ── Data ──────────────────────────────────────────────────────────────────────

const CAREER_LEVELS = [
  { icon: '🌱', name: 'Basic',          color: '#10B981', desc: 'Build your programming foundation',        status: 'done'    },
  { icon: '🧠', name: 'DSA',            color: '#6366F1', desc: 'Master Data Structures & Algorithms',      status: 'active'  },
  { icon: '🚀', name: 'First Project',  color: '#8B5CF6', desc: 'Build & ship your first real project',     status: 'locked'  },
  { icon: '📄', name: 'Resume',         color: '#F59E0B', desc: 'Craft a placement-ready resume',           status: 'locked'  },
  { icon: '🎤', name: 'Interview Prep', color: '#EC4899', desc: 'Ace technical & HR interviews',            status: 'locked'  },
  { icon: '💼', name: 'Job Apply',      color: '#0EA5E9', desc: 'Apply strategically to the right roles',  status: 'locked'  },
  { icon: '🎓', name: 'Placement',      color: '#F97316', desc: 'Land your offer & start your career',     status: 'locked'  },
];

const FEATURES = [
  { icon: <Flame size={22} />,       color: 'var(--color-danger)',     label: 'Daily Streaks',      desc: 'Stay consistent. Build the habit that compounds.' },
  { icon: <Zap size={22} />,         color: 'var(--color-xp)',         label: 'XP & Levels',        desc: 'Every lesson, quiz, and challenge earns you XP.' },
  { icon: <Trophy size={22} />,      color: 'var(--color-xp)',         label: 'College Leaderboard', desc: 'See where you stand vs your college peers.' },
  { icon: <Star size={22} />,        color: 'var(--color-secondary)',  label: 'Badges',             desc: 'Unlock achievement badges as you progress.' },
  { icon: <Target size={22} />,      color: 'var(--color-primary)',    label: 'Challenges',         desc: 'Real problems to test your skills at each stage.' },
  { icon: <TrendingUp size={22} />,  color: 'var(--color-success)',    label: 'Level Ups',          desc: 'Clear criteria to unlock the next career level.' },
];

const LEADERBOARD_DEMO = [
  { rank: 1, medal: '🥇', name: 'Rahul Sharma',    level: 14, xp: '4,250', branch: 'CSE' },
  { rank: 2, medal: '🥈', name: 'Priya Verma',     level: 13, xp: '4,100', branch: 'IT'  },
  { rank: 3, medal: '🥉', name: 'Arjun Nair',      level: 12, xp: '3,920', branch: 'CSE' },
  { rank: 14, medal: '14', name: 'You',             level: 7,  xp: '1,740', branch: '—',   isYou: true },
];

// ── Components ────────────────────────────────────────────────────────────────

function HeroDashboardCard() {
  return (
    <div className="card max-w-sm w-full shadow-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
      {/* User header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
        <div>
          <p className="font-bold text-[var(--color-text)] text-sm">Ayush Kumar</p>
          <p className="text-xs text-[var(--color-text-muted)]">3rd Year · CSE · IET Lucknow</p>
        </div>
        <div className="ml-auto">
          <span className="badge badge-primary">Level 7</span>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-semibold text-[var(--color-text-muted)]">⚡ 1,740 XP</span>
          <span className="text-[var(--color-text-subtle)]">2,000 XP next level</span>
        </div>
        <div className="xp-bar">
          <div className="xp-bar-fill" style={{ '--xp-pct': '87%', width: '87%' }} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[var(--color-bg)] rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-[var(--color-danger)]">🔥 12</p>
          <p className="text-[10px] text-[var(--color-text-muted)] font-medium">Day Streak</p>
        </div>
        <div className="bg-[var(--color-bg)] rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-[var(--color-xp)]">⚡ 1,740</p>
          <p className="text-[10px] text-[var(--color-text-muted)] font-medium">Total XP</p>
        </div>
        <div className="bg-[var(--color-bg)] rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-[var(--color-primary)]">🏆 #14</p>
          <p className="text-[10px] text-[var(--color-text-muted)] font-medium">College Rank</p>
        </div>
      </div>

      {/* Mini journey */}
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wide">My Journey</p>
        <div className="space-y-1.5">
          {CAREER_LEVELS.slice(0, 4).map((lvl) => (
            <div key={lvl.name} className="flex items-center gap-2.5">
              <span className="text-sm">{lvl.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs font-medium ${lvl.status === 'locked' ? 'text-[var(--color-text-subtle)]' : 'text-[var(--color-text)]'}`}>
                    {lvl.name}
                  </span>
                  {lvl.status === 'done' && <CheckCircle2 size={12} className="text-[var(--color-success)]" />}
                  {lvl.status === 'active' && <span className="text-[10px] badge badge-primary">In Progress</span>}
                  {lvl.status === 'locked' && <Lock size={10} className="text-[var(--color-text-subtle)]" />}
                </div>
                <div className="h-1 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: lvl.status === 'done' ? '100%' : lvl.status === 'active' ? '60%' : '0%',
                      background: lvl.status === 'locked' ? 'transparent' : `linear-gradient(90deg, ${lvl.color}, ${lvl.color}dd)`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PublicNavbar />

      {/* ══ HERO ═══════════════════════════════════════════════════════════════ */}
      <section className="hero-gradient pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold mb-6">
                <Sparkles size={12} />
                Built for college students in India
              </div>

              <h1 className="text-5xl sm:text-6xl font-black text-[var(--color-text)] leading-[1.1] mb-6">
                YOUR COLLEGE.<br />
                YOUR JOURNEY.<br />
                <span className="gradient-text">YOUR PLACEMENT.</span>
              </h1>

              <p className="text-lg text-[var(--color-text-muted)] mb-8 leading-relaxed max-w-lg">
                Learn together. Compete with your peers. Get guidance from seniors.
                Build your career — one level at a time.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/onboarding" className="btn btn-primary btn-lg">
                  <Rocket size={18} />
                  Start Your Journey
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Login
                  <ChevronRight size={16} />
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {['A','R','P','K','S'].map((l, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: `hsl(${i * 50 + 200}, 70%, 55%)` }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  <span className="font-bold text-[var(--color-text)]">500+</span> students already on their journey
                </p>
              </div>
            </div>

            {/* Right — mock dashboard */}
            <div className="flex justify-center lg:justify-end">
              <HeroDashboardCard />
            </div>
          </div>
        </div>
      </section>

      {/* ══ JOURNEY MAP ════════════════════════════════════════════════════════ */}
      <section id="journey" className="py-20 px-4 sm:px-6 bg-[var(--color-card)] border-y border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="badge badge-primary mb-4 text-sm px-4 py-1.5">Section 1</span>
          <h2 className="text-4xl font-black text-[var(--color-text)] mb-3">Your Career Journey</h2>
          <p className="text-[var(--color-text-muted)] text-lg mb-14 max-w-xl mx-auto">
            7 clear milestones from beginner to placed. Always know where you are and what to do next.
          </p>

          {/* Vertical journey map */}
          <div className="relative max-w-sm mx-auto">
            {CAREER_LEVELS.map((lvl, i) => (
              <div key={lvl.name} className="flex items-stretch gap-4">
                {/* Left: connector + circle */}
                <div className="flex flex-col items-center w-14 shrink-0">
                  {/* Top connector */}
                  {i > 0 && (
                    <div
                      className="w-0.5 h-6"
                      style={{
                        background: CAREER_LEVELS[i - 1].status !== 'locked'
                          ? `linear-gradient(to bottom, ${CAREER_LEVELS[i-1].color}, ${lvl.color})`
                          : 'var(--color-border)'
                      }}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 transition-all shrink-0 ${
                      lvl.status === 'done'
                        ? 'text-white border-transparent shadow-lg'
                        : lvl.status === 'active'
                        ? 'text-white border-transparent shadow-xl ring-4 ring-opacity-30'
                        : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text-subtle)]'
                    }`}
                    style={{
                      background: lvl.status !== 'locked' ? lvl.color : undefined,
                      boxShadow: lvl.status === 'active' ? `0 0 20px ${lvl.color}55` : undefined,
                      ringColor: lvl.status === 'active' ? lvl.color : undefined,
                    }}
                  >
                    {lvl.status === 'done' ? '✓' : lvl.icon}
                  </div>

                  {/* Bottom connector */}
                  {i < CAREER_LEVELS.length - 1 && (
                    <div
                      className="w-0.5 flex-1 min-h-6"
                      style={{
                        background: lvl.status !== 'locked'
                          ? `linear-gradient(to bottom, ${lvl.color}, ${CAREER_LEVELS[i+1].color}80)`
                          : 'var(--color-border)'
                      }}
                    />
                  )}
                </div>

                {/* Right: content card */}
                <div className={`flex-1 py-3 mb-0 flex items-center ${i === CAREER_LEVELS.length - 1 ? '' : ''}`}>
                  <div
                    className={`w-full card p-3.5 text-left transition-all ${
                      lvl.status === 'active'
                        ? 'border-[var(--color-primary)] shadow-md'
                        : lvl.status === 'locked'
                        ? 'opacity-60'
                        : ''
                    }`}
                    style={lvl.status === 'active' ? { borderColor: lvl.color, boxShadow: `0 0 0 1px ${lvl.color}40` } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[var(--color-text)] text-sm">{lvl.name}</p>
                          {lvl.status === 'done' && <span className="badge badge-success text-[10px]">Complete</span>}
                          {lvl.status === 'active' && <span className="badge badge-primary text-[10px]">Current</span>}
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{lvl.desc}</p>
                      </div>
                      {lvl.status === 'locked' && <Lock size={14} className="text-[var(--color-text-subtle)] shrink-0 ml-2" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/onboarding" className="btn btn-primary btn-lg mt-12 inline-flex">
            Start Your Journey
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ══ LEADERBOARD PREVIEW ═══════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div>
              <span className="badge badge-primary mb-4 text-sm px-4 py-1.5">Section 2</span>
              <h2 className="text-4xl font-black text-[var(--color-text)] mb-4">
                Learn With<br />Your College
              </h2>
              <p className="text-[var(--color-text-muted)] text-lg mb-6 leading-relaxed">
                See where you stand. Learn from the best in your college. Rise together.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Users size={18} />, text: 'College-scoped leaderboard — compete with your actual peers' },
                  { icon: <TrendingUp size={18} />, text: 'Track your rank movement week over week' },
                  { icon: <Trophy size={18} />, text: 'Filter by XP, DSA, Streak, Placement Ready' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — leaderboard demo */}
            <div className="card shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-[var(--color-text)]">🏆 IET Lucknow</p>
                  <p className="text-xs text-[var(--color-text-muted)]">All Time · Overall</p>
                </div>
                <div className="flex gap-1">
                  {['Week', 'Month', 'All Time'].map((t) => (
                    <button
                      key={t}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                        t === 'All Time'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {LEADERBOARD_DEMO.map((row) => (
                  <div
                    key={row.rank}
                    className={`leaderboard-row ${row.isYou ? 'current-user' : ''}`}
                  >
                    <span className={`w-8 text-center font-bold text-sm ${
                      row.rank === 1 ? 'rank-medal-1' :
                      row.rank === 2 ? 'rank-medal-2' :
                      row.rank === 3 ? 'rank-medal-3' :
                      'text-[var(--color-text-muted)]'
                    }`}>
                      {row.rank <= 3 ? row.medal : `#${row.rank}`}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: `hsl(${row.rank * 80 + 180}, 65%, 55%)` }}
                    >
                      {row.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${row.isYou ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                        {row.name} {row.isYou && <span className="text-xs font-normal">(you)</span>}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">Level {row.level} · {row.branch}</p>
                    </div>
                    <span className="badge badge-xp text-xs">{row.xp} XP</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--color-text-subtle)] text-center mt-3">
                ↑ You moved up 3 positions this week 🎉
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES / GAMIFICATION ═══════════════════════════════════════════ */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-[var(--color-card)] border-y border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto text-center">
          <span className="badge badge-xp mb-4 text-sm px-4 py-1.5">Section 3</span>
          <h2 className="text-4xl font-black text-[var(--color-text)] mb-3">Gamified Learning</h2>
          <p className="text-[var(--color-text-muted)] text-lg mb-14 max-w-xl mx-auto">
            Learning should feel like progress. Every action earns you something.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`card text-left p-5 hover:shadow-md animate-fade-in stagger-${Math.min(i + 1, 5)}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white"
                  style={{ background: f.color, boxShadow: `0 4px 12px ${f.color}55` }}
                >
                  {f.icon}
                </div>
                <p className="font-bold text-[var(--color-text)] text-sm mb-1">{f.label}</p>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMMUNITY / SENIORS ═══════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conversation demo */}
            <div className="card shadow-xl space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                <p className="text-xs font-medium text-[var(--color-text-muted)]">Senior Chat — Rahul Sharma · 4th Year CSE</p>
              </div>
              {[
                { sender: 'senior', name: 'Rahul', text: "Hey! I saw you're on DSA. Which topics are you stuck on?" },
                { sender: 'you',    name: 'You',   text: "Trees and recursion mostly. Not sure how to think through the problems." },
                { sender: 'senior', name: 'Rahul', text: "Classic! I was there too. Start with the recursion tree visualization. For trees, always ask: left subtree, right subtree, root — in what order?" },
                { sender: 'you',    name: 'You',   text: "That actually makes sense! Can you recommend any specific problems to start?" },
                { sender: 'senior', name: 'Rahul', text: "Yep — Binary Tree Inorder, Level Order traversal, and then Maximum Depth. Do these 3 and you'll get the pattern 🎯" },
              ].map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.sender === 'you' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5 ${
                      msg.sender === 'senior' ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]' : 'bg-[var(--color-success)]'
                    }`}
                  >
                    {msg.name[0]}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.sender === 'you'
                        ? 'bg-[var(--color-primary)] text-white rounded-tr-sm'
                        : 'bg-[var(--color-bg)] text-[var(--color-text)] rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Right — copy */}
            <div>
              <span className="badge badge-secondary mb-4 text-sm px-4 py-1.5">Section 4</span>
              <h2 className="text-4xl font-black text-[var(--color-text)] mb-4">
                Never Prepare<br />Alone
              </h2>
              <p className="text-[var(--color-text-muted)] text-lg mb-8 leading-relaxed">
                Find seniors who've already been placed at your dream company. Ask questions. Get personalized guidance. Pay it forward when you get there.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <GraduationCap size={18} />, label: 'Seniors', sub: 'Mentorship' },
                  { icon: <Users size={18} />,         label: 'Peers',   sub: 'Competition' },
                  { icon: <MessageSquare size={18} />, label: 'Community', sub: 'Collaboration' },
                ].map((item, i) => (
                  <div key={i} className="card p-3 text-center">
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mx-auto mb-2">
                      {item.icon}
                    </div>
                    <p className="font-bold text-[var(--color-text)] text-sm">{item.label}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-2xl p-12 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)'
            }}
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-4">Start Today</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                Your Placement Journey<br />Starts Here.
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join your college. Pick up where you left off. Level up every day.
              </p>
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 bg-white text-[var(--color-primary-dark)] font-bold px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 text-lg"
              >
                <Rocket size={20} />
                Join Your College →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[var(--color-border)] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="gradient-text">LearnUp</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Built for college students. Designed to get you placed.
          </p>
          <div className="flex gap-4 text-sm text-[var(--color-text-muted)]">
            <Link to="/login" className="hover:text-[var(--color-text)] transition-colors">Login</Link>
            <Link to="/onboarding" className="hover:text-[var(--color-text)] transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
