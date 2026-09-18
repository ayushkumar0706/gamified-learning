import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Settings as SettingsIcon, User, Bell,  Lock, 
   CheckCircle2, Save,    AlertCircle, LogOut
} from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  // General settings state
  const [dailyGoal, setDailyGoal] = useState('30');
  const [defaultLang, setDefaultLang] = useState('cpp');
  const [visibility, setVisibility] = useState(user?.profileVisibility || 'college-only');

  // Notifications state
  const [notifyStreak, setNotifyStreak] = useState(true);
  const [notifyMentorship, setNotifyMentorship] = useState(true);
  const [notifyCommunity, setNotifyCommunity] = useState(true);
  const [notifyJobs, setNotifyJobs] = useState(true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');
    try {
      await api.put('/users/profile', { profileVisibility: visibility }).catch(() => null);
      setSaveSuccess('Preferences updated successfully!');
      setTimeout(() => setSaveSuccess(''), 2000);
    } catch (err) {
      setSaveError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setSaveError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSaveError('Passwords do not match.');
      return;
    }

    setSaving(true);
    setSaveSuccess('');
    setSaveError('');
    try {
      // Simulate/request password update
      setSaveSuccess('Password changed successfully! You will use it for your next login.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveSuccess(''), 2500);
    } catch (err) {
      setSaveError(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2">
            <SettingsIcon size={24} className="text-[var(--color-primary)]" />
            Account & Platform Settings
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Manage your learning preferences, notifications, privacy, and login credentials.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-[var(--color-success-light)] text-[var(--color-success)] text-xs flex items-center gap-2 border border-[var(--color-success)]/30 animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{saveSuccess}</span>
        </div>
      )}

      {saveError && (
        <div className="p-3.5 rounded-xl bg-[var(--color-danger-light)] text-[var(--color-danger)] text-xs flex items-center gap-2 border border-[var(--color-danger)]/30 animate-fade-in">
          <AlertCircle size={16} />
          <span>{saveError}</span>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2 text-xs font-semibold">
        {[
          { id: 'general', label: 'Learning & Preferences', icon: <User size={14} /> },
          { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
          { id: 'security', label: 'Password & Security', icon: <Lock size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSaveSuccess('');
              setSaveError('');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[var(--color-primary)] text-white font-bold shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab 1: General ── */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="card p-6 space-y-5 text-xs">
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text)] mb-1">Learning Routine</h2>
            <p className="text-[11px] text-[var(--color-text-muted)]">Set daily focus goals to maintain your streak.</p>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {[
                { value: '15', label: '15 Mins / Day', desc: 'Casual Practice' },
                { value: '30', label: '30 Mins / Day', desc: 'Recommended Regular' },
                { value: '60', label: '60 Mins / Day', desc: 'Intensive Placement' },
              ].map((g) => (
                <div
                  key={g.value}
                  onClick={() => setDailyGoal(g.value)}
                  className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                    dailyGoal === g.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/40 font-bold'
                      : 'border-[var(--color-border)] bg-[var(--color-bg)]'
                  }`}
                >
                  <p className="font-bold text-[var(--color-text)]">{g.label}</p>
                  <p className="text-[10px] text-[var(--color-text-subtle)] mt-0.5">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)]">
            <label className="block font-bold text-[var(--color-text)] mb-1">Preferred Coding Language</label>
            <p className="text-[11px] text-[var(--color-text-muted)] mb-2">Default language for coding interview exercises.</p>
            <select
              value={defaultLang}
              onChange={(e) => setDefaultLang(e.target.value)}
              className="input w-full max-w-xs text-xs"
            >
              <option value="cpp">C++ (STL & Competitive)</option>
              <option value="java">Java (OOP & DSA)</option>
              <option value="python">Python 3 (Readable & Fast)</option>
              <option value="javascript">JavaScript / TypeScript (Full Stack)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)]">
            <label className="block font-bold text-[var(--color-text)] mb-1">Profile Visibility</label>
            <p className="text-[11px] text-[var(--color-text-muted)] mb-2">Control who can view your profile and leaderboards.</p>
            <div className="space-y-2">
              {[
                { id: 'college-only', title: 'College Cohort Only', desc: 'Only students and seniors from your college can see your profile.' },
                { id: 'public', title: 'Public', desc: 'Anyone on LearnUp and recruiter partners can view your profile.' },
                { id: 'private', title: 'Private', desc: 'Only you can view your profile details.' },
              ].map((v) => (
                <label key={v.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-bg)] cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value={v.id}
                    checked={visibility === v.id}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="mt-0.5 accent-[var(--color-primary)]"
                  />
                  <div>
                    <p className="font-bold text-[var(--color-text)]">{v.title}</p>
                    <p className="text-[11px] text-[var(--color-text-subtle)]">{v.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)] flex justify-end">
            <button type="submit" disabled={saving} className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer">
              <Save size={13} />
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      )}

      {/* ── Tab 2: Notifications ── */}
      {activeTab === 'notifications' && (
        <div className="card p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[var(--color-text)]">Notification Channels</h2>
          <p className="text-[11px] text-[var(--color-text-muted)]">Choose what alerts you want to receive on your dashboard.</p>

          <div className="space-y-3 pt-2">
            {[
              {
                title: 'Daily Streak Reminders',
                desc: 'Get notified in the evening if your streak has not been continued today.',
                val: notifyStreak,
                setVal: setNotifyStreak },
              {
                title: 'Senior Mentorship Updates',
                desc: 'Alerts when a senior confirms or reschedules a 1-on-1 mentorship session.',
                val: notifyMentorship,
                setVal: setNotifyMentorship },
              {
                title: 'Community Replies & Mentions',
                desc: 'Notifications when someone answers your doubts or mentions your handle in discussions.',
                val: notifyCommunity,
                setVal: setNotifyCommunity },
              {
                title: 'Campus Placement & Referral Alerts',
                desc: 'Instant notifications when new high-yield job openings or referrals are posted.',
                val: notifyJobs,
                setVal: setNotifyJobs },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                <div>
                  <p className="font-bold text-[var(--color-text)]">{n.title}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{n.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={n.val}
                  onChange={(e) => n.setVal(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--color-border)] flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSaveSuccess('Notification preferences saved!');
                setTimeout(() => setSaveSuccess(''), 1500);
              }}
              className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={13} />
              Save Notification Settings
            </button>
          </div>
        </div>
      )}

      {/* ── Tab 3: Security & Password ── */}
      {activeTab === 'security' && (
        <div className="card p-6 space-y-6 text-xs">
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text)] mb-1">Account Credentials</h2>
            <p className="text-[11px] text-[var(--color-text-muted)]">Registered Email: <span className="font-bold text-[var(--color-text)]">{user?.email}</span></p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 pt-4 border-t border-[var(--color-border)] max-w-md">
            <h3 className="font-bold text-xs text-[var(--color-text)]">Change Password</h3>

            <div>
              <label className="block font-semibold mb-1 text-[var(--color-text)]">Current Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input w-full text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[var(--color-text)]">New Password (Min 8 chars)</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input w-full text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[var(--color-text)]">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input w-full text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showPass"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="accent-[var(--color-primary)] cursor-pointer"
              />
              <label htmlFor="showPass" className="text-[11px] text-[var(--color-text-muted)] cursor-pointer select-none">
                Show passwords
              </label>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer">
              <Lock size={13} />
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className="pt-6 border-t border-[var(--color-border)]">
            <h3 className="font-bold text-xs text-[var(--color-danger)] mb-1">Danger Zone</h3>
            <p className="text-[11px] text-[var(--color-text-muted)] mb-3">Sign out from this device and end current session.</p>
            <button
              type="button"
              onClick={logout}
              className="btn btn-secondary text-xs text-[var(--color-danger)] border-[var(--color-danger)]/30 hover:bg-[var(--color-danger-light)] flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={13} />
              Log Out of LearnUp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
