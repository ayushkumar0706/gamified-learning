import { useAuth } from '../../context/AuthContext';
import { Zap, Bell, Sun, Moon, Building2, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function Topbar({ title }) {
  const { user } = useAuth();
  const [dark, setDark] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (user) {
      api.get('/messages/unread-count')
        .then(res => setUnreadMessages(res.unreadCount || 0))
        .catch(() => {});
    }
  }, [user]);

  // Dark mode toggle
  useEffect(() => {
    const saved = localStorage.getItem('learnup-dark');
    if (saved === 'true') {
      document.documentElement.classList.add('dark');
    // eslint-disable-next-line react-hooks/set-state-in-effect
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('learnup-dark', String(next));
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <header className="topbar justify-between">
      {/* Left: page title + college chip */}
      <div className="flex items-center gap-3">
        {title && (
          <h1 className="text-base font-bold text-[var(--color-text)]">{title}</h1>
        )}
        {user?.college?.name && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold border border-[var(--color-primary)]/20">
            <Building2 size={11} />
            <span className="max-w-[160px] truncate">{user.college.name}</span>
          </div>
        )}
      </div>

      {/* Right cluster: streak, XP, rank, dark mode, bell, avatar */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Streak */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm font-bold">
          <span className="streak-flame">🔥</span>
          <span>{user?.currentStreak ?? 0}</span>
        </div>

        {/* XP */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-xp-light)] text-[var(--color-xp-dark)] text-sm font-bold">
          <Zap size={14} />
          <span>{(user?.xp ?? 0).toLocaleString()} XP</span>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Messages */}
        <Link
          to="/messages"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] transition-colors relative"
          aria-label="Messages"
        >
          <MessageSquare size={16} />
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--color-primary)] ring-2 ring-[var(--color-card)]" />
          )}
        </Link>

        {/* Notification bell */}
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={16} />
          {/* Dot indicator */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-danger)]" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:ring-2 hover:ring-[var(--color-primary)] transition-all">
          {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
        </div>
      </div>
    </header>
  );
}
