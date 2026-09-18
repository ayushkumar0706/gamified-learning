import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Award, Flame, Zap, Edit3, ExternalLink,
  GraduationCap, Building2, Target, CheckCircle2,
  X, Save, Share2, Sparkles, AlertCircle, Code, Trophy
} from 'lucide-react';

// Badge definitions — a compact set used for the Profile badge shelf.
// Level-clearance badges (from user.badges[] in DB) are merged in dynamically.
const PROFILE_BADGE_DEFS = [
  { id: 'first-step',         name: 'First Step',       icon: '🚀', desc: 'Completed your first learning module' },
  { id: 'quiz-ace',           name: 'Quiz Ace',         icon: '🎯', desc: 'Scored 80%+ on any quiz' },
  { id: 'streak-fire',        name: 'On Fire',          icon: '🔥', desc: 'Maintained a 5-day learning streak' },
  { id: 'dsa-warrior',        name: 'DSA Warrior',      icon: '⚔️', desc: 'Completed 6 topics' },
  { id: 'foundation-builder', name: 'Foundation Builder', icon: '🌱', desc: 'Cleared the Basic level' },
  { id: 'dsa-warrior-lvl',    name: 'DSA Master',       icon: '🧠', desc: 'Cleared the DSA level' },
  { id: 'senior-mentor',      name: 'Campus Guide',     icon: '🎓', desc: 'Promoted to Senior Guide' },
  { id: 'century-xp',         name: 'Century Pioneer',  icon: '💎', desc: 'Earned 200+ XP' },
  { id: 'grand-master',       name: 'Grand Master',     icon: '🏆', desc: 'Earned 1,000+ XP' },
];

function GithubIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const PREP_LEVEL_LABELS = {
  'just-starting': '🌱 Just Starting Out',
  'learning-dsa': '🧠 Learning DSA',
  'building-projects': '🚀 Building Projects',
  'preparing-placements': '🎤 Preparing for Placements',
  'already-applying': '💼 Active Job Seeker',
};



export default function Profile() {
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editSuccess, setEditSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    careerGoal: '',
    currentPreparationLevel: 'just-starting',
    branch: '',
    year: 1,
    github: '',
    linkedin: '',
    leetcode: '',
    codeforces: '',
    profileVisibility: 'college-only',
  });

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // 1. Sync badges in background so profile shows latest
      try {
        await api.post('/users/badges/sync');
      } catch {
        // silently fail
      }

      // 2. Fetch profile and dashboard
      const [profRes, dashRes] = await Promise.all([
        api.get('/users/profile').catch(() => ({ user: authUser })),
        api.get('/dashboard').catch(() => null),
      ]);

      const activeUser = profRes?.user || authUser;
      setProfile(activeUser);
      setDashboardData(dashRes?.dashboard || null);

      setFormData({
        firstName: activeUser?.firstName || '',
        lastName: activeUser?.lastName || '',
        bio: activeUser?.bio || '',
        careerGoal: activeUser?.careerGoal || '',
        currentPreparationLevel: activeUser?.currentPreparationLevel || 'just-starting',
        branch: activeUser?.branch || '',
        year: activeUser?.year || 1,
        github: activeUser?.github || '',
        linkedin: activeUser?.linkedin || '',
        leetcode: activeUser?.leetcode || '',
        codeforces: activeUser?.codeforces || '',
        profileVisibility: activeUser?.profileVisibility || 'college-only',
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    fetchProfileData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setEditSuccess('');
    try {
      const res = await api.put('/users/profile', formData);
      if (res?.user) {
        setProfile(res.user);
        if (setAuthUser) setAuthUser(res.user);
      }
      setEditSuccess('Profile updated successfully!');
      setTimeout(() => {
        setIsEditing(false);
        setEditSuccess('');
      }, 900);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Profile URL copied to clipboard! 📋');
  };

  if (loading) {
    return (
      <div className="page-container max-w-4xl mx-auto space-y-6">
        <div className="skeleton h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="skeleton h-64 rounded-2xl" />
          <div className="md:col-span-2 skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const u = profile || authUser || {};
  const initials = `${u.firstName?.[0] || 'U'}${u.lastName?.[0] || ''}`.toUpperCase();
  const xp = dashboardData?.xp ?? u.xp ?? 0;
  const level = dashboardData?.level ?? u.level ?? 1;
  const streak = dashboardData?.streak ?? u.currentStreak ?? 0;
  const maxStreak = dashboardData?.maxStreak ?? u.maxStreak ?? streak;
  const completedTopics = dashboardData?.progressSummary?.completedTopics ?? 0;

  // ── Badge shelf: merge DB badges + stats-based checks ───────────────────
  const dbBadgeIds = new Set((u.badges ?? []).map((b) => b.badgeId));

  // Build merged badge list: known definitions + any extra DB badges not in defs
  const knownIds = new Set(PROFILE_BADGE_DEFS.map((b) => b.id));
  const extraDbBadges = (u.badges ?? [])
    .filter((b) => !knownIds.has(b.badgeId))
    .map((b) => ({
      id: b.badgeId, name: b.name, icon: b.icon,
      desc: b.description, unlocked: true
    }));

  const evaluatedBadges = [
    ...PROFILE_BADGE_DEFS.map((badge) => ({
      ...badge,
      unlocked: dbBadgeIds.has(badge.id),
    })),
    ...extraDbBadges,
  ];

  return (
    <div className="page-container max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* ── Banner & Identity Card ── */}
      <div className="card overflow-hidden relative border border-[var(--color-border)] p-0 shadow-lg">
        {/* Colorful Gradient Cover */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={copyProfileLink}
              className="px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={13} />
              Share
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-900 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 size={13} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 p-1 ring-4 ring-[var(--color-surface)] shadow-xl relative shrink-0">
                <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-white text-2xl sm:text-3xl font-black">
                  {initials}
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-success)] ring-2 ring-[var(--color-surface)] flex items-center justify-center text-[10px] text-white">
                  ✓
                </span>
              </div>

              <div className="mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-[var(--color-text)]">
                    {u.firstName} {u.lastName}
                  </h1>
                  <span className={`badge ${u.role === 'senior' ? 'badge-senior' : u.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                    {u.role === 'senior' ? '🎓 Senior Mentor' : u.role === 'admin' ? '⚡ Administrator' : '🎒 Student'}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1.5">
                  <Building2 size={13} />
                  {u.college?.name || 'Campus Student'}
                  {u.branch && ` • ${u.branch}`}
                  {u.year && ` • Year ${u.year}`}
                </p>
              </div>
            </div>

            {/* Preparation Level Pill */}
            <div className="self-start sm:self-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Target size={13} />
                {PREP_LEVEL_LABELS[u.currentPreparationLevel] || 'Just Starting Out'}
              </span>
            </div>
          </div>

          {/* Bio */}
          {u.bio ? (
            <p className="text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed mt-2">
              {u.bio}
            </p>
          ) : (
            <p className="text-xs italic text-[var(--color-text-subtle)] mt-1">
              No bio added yet. Click &quot;Edit Profile&quot; to showcase your interests and goals!
            </p>
          )}

          {/* Social / Dev Handles */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--color-border)] flex-wrap">
            {u.github && (
              <a
                href={u.github.startsWith('http') ? u.github : `https://github.com/${u.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors px-2.5 py-1 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]"
              >
                <GithubIcon size={14} />
                <span>GitHub</span>
                <ExternalLink size={10} className="opacity-50" />
              </a>
            )}
            {u.linkedin && (
              <a
                href={u.linkedin.startsWith('http') ? u.linkedin : `https://linkedin.com/in/${u.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900"
              >
                <LinkedinIcon size={14} />
                <span>LinkedIn</span>
                <ExternalLink size={10} className="opacity-50" />
              </a>
            )}
            {u.leetcode && (
              <a
                href={u.leetcode.startsWith('http') ? u.leetcode : `https://leetcode.com/${u.leetcode}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 transition-colors px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900"
              >
                <Code size={14} />
                <span>LeetCode</span>
                <ExternalLink size={10} className="opacity-50" />
              </a>
            )}
            {u.codeforces && (
              <a
                href={u.codeforces.startsWith('http') ? u.codeforces : `https://codeforces.com/profile/${u.codeforces}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 transition-colors px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900"
              >
                <Trophy size={14} />
                <span>Codeforces</span>
                <ExternalLink size={10} className="opacity-50" />
              </a>
            )}
            {!u.github && !u.linkedin && !u.leetcode && !u.codeforces && (
              <span className="text-xs text-[var(--color-text-subtle)]">No developer links connected yet</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Grid: Stats & Gamification Showcase ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Gamification Stats */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <h3 className="font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
              <Zap size={16} className="text-[var(--color-xp)]" />
              Learning Progress
            </h3>

            {/* Level & XP */}
            <div className="bg-[var(--color-bg)] p-3.5 rounded-xl border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">Current Rank</span>
                <span className="text-xs font-bold text-[var(--color-primary)]">Level {level}</span>
              </div>
              <div className="w-full bg-[var(--color-border)] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (xp % 200) / 2)}%` }}
                />
              </div>
              <p className="text-[11px] text-[var(--color-text-subtle)] mt-1.5 text-right font-medium">
                {xp} Total XP
              </p>
            </div>

            {/* Streak card */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
              <div className="flex items-center gap-2.5">
                <Flame size={22} className="fill-orange-500 text-orange-500 animate-pulse" />
                <div>
                  <p className="text-sm font-bold leading-none">{streak} Day Streak</p>
                  <p className="text-[11px] opacity-80 mt-0.5">Best: {maxStreak} days</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/20">
                Active 🔥
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-border)]">
              <div className="text-center p-2 rounded-lg bg-[var(--color-bg)]">
                <p className="text-lg font-black text-[var(--color-text)]">{completedTopics}</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Topics Finished</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-[var(--color-bg)]">
                <p className="text-lg font-black text-[var(--color-text)]">
                  {dashboardData?.recentAttempts?.length || 0}
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Quizzes Taken</p>
              </div>
            </div>
          </div>

          {/* Academic Profile */}
          <div className="card p-5 space-y-3">
            <h3 className="font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
              <GraduationCap size={16} className="text-[var(--color-primary)]" />
              Academic Info
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-text-muted)]">College</span>
                <span className="font-semibold text-right max-w-[160px] truncate">
                  {u.college?.name || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-text-muted)]">Branch</span>
                <span className="font-semibold">{u.branch || 'Not set'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-text-muted)]">Year</span>
                <span className="font-semibold">{u.year ? `Year ${u.year}` : 'Not set'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[var(--color-text-muted)]">Career Goal</span>
                <span className="font-semibold text-[var(--color-primary)]">{u.careerGoal || 'Software Engineer'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Badges Shelf & Activity */}
        <div className="md:col-span-2 space-y-6">
          {/* Badges Collection */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
                <Award size={16} className="text-amber-500" />
                Badges & Achievements
              </h3>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">
                {evaluatedBadges.filter(b => b.unlocked).length} / {evaluatedBadges.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {evaluatedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                    badge.unlocked
                      ? 'bg-gradient-to-b from-amber-500/5 to-transparent border-amber-500/30 shadow-sm'
                      : 'bg-[var(--color-bg)] border-[var(--color-border)] opacity-50 grayscale'
                  }`}
                >
                  <div className="text-3xl mb-1.5 transform hover:scale-110 transition-transform">
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>
                  <p className="text-xs font-bold text-[var(--color-text)] leading-tight">{badge.name}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1 leading-tight line-clamp-2">
                    {badge.desc}
                  </p>
                  {badge.unlocked && (
                    <span className="mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      EARNED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Learning Activity */}
          <div className="card p-5 space-y-4">
            <h3 className="font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500" />
              Recent Quiz Activity
            </h3>

            {dashboardData?.recentAttempts?.length > 0 ? (
              <div className="space-y-2.5">
                {dashboardData.recentAttempts.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text)]">{att.topicTitle}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)]">
                          {new Date(att.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        att.scorePercentage >= 70
                          ? 'bg-[var(--color-success-light)] text-[var(--color-success)]'
                          : 'bg-[var(--color-danger-light)] text-[var(--color-danger)]'
                      }`}
                    >
                      {att.scorePercentage}% Score
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[var(--color-text-muted)]">
                No quiz attempts yet. Start learning to record your streak and score!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative border border-[var(--color-border)] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                <Edit3 size={18} className="text-[var(--color-primary)]" />
                Edit Student Profile
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[var(--color-danger-light)] text-[var(--color-danger)] text-xs mt-3 flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {editSuccess && (
              <div className="p-3 rounded-xl bg-[var(--color-success-light)] text-[var(--color-success)] text-xs mt-3 flex items-center gap-2">
                <CheckCircle2 size={14} />
                {editSuccess}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4 text-xs">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--color-text)]">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[var(--color-text)]">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input w-full text-xs"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-[var(--color-text)]">Bio</label>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{formData.bio?.length || 0}/300</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell peers and seniors about what you are learning and building..."
                  className="input w-full text-xs"
                />
              </div>

              {/* Branch & Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--color-text)]">Branch / Stream</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="e.g. Computer Science"
                    className="input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[var(--color-text)]">Current Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="input w-full text-xs"
                  >
                    {[1, 2, 3, 4, 5].map((yr) => (
                      <option key={yr} value={yr}>Year {yr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preparation Level */}
              <div>
                <label className="block font-semibold mb-1 text-[var(--color-text)]">Preparation Stage</label>
                <select
                  value={formData.currentPreparationLevel}
                  onChange={(e) => setFormData({ ...formData, currentPreparationLevel: e.target.value })}
                  className="input w-full text-xs"
                >
                  {Object.entries(PREP_LEVEL_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Career Goal */}
              <div>
                <label className="block font-semibold mb-1 text-[var(--color-text)]">Target Career Goal</label>
                <input
                  type="text"
                  value={formData.careerGoal}
                  onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                  placeholder="e.g. Full Stack Developer, SDE 1"
                  className="input w-full text-xs"
                />
              </div>

              {/* Social / Developer Links */}
              <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
                <p className="font-bold text-[var(--color-text)]">Social & Developer Handles</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-[var(--color-text-muted)] block mb-0.5">GitHub Username/URL</label>
                    <input
                      type="text"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      placeholder="octocat"
                      className="input w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--color-text-muted)] block mb-0.5">LinkedIn Handle/URL</label>
                    <input
                      type="text"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="linkedin-user"
                      className="input w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--color-text-muted)] block mb-0.5">LeetCode Username</label>
                    <input
                      type="text"
                      value={formData.leetcode}
                      onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
                      placeholder="leetcode_id"
                      className="input w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--color-text-muted)] block mb-0.5">Codeforces Handle</label>
                    <input
                      type="text"
                      value={formData.codeforces}
                      onChange={(e) => setFormData({ ...formData, codeforces: e.target.value })}
                      placeholder="cf_tourist"
                      className="input w-full text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary flex-1 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary flex-1 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {saving ? 'Saving...' : (
                    <>
                      <Save size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
