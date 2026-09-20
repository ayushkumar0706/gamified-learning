import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building,
  Map,
  BookOpen,
  ShieldAlert,
  Briefcase,
  Award,
  Settings,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { api } from '../../services/api';

const ADMIN_NAV_ITEMS = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Colleges', path: '/admin/colleges', icon: Building },
  { name: 'Career Journey', path: '/admin/journey', icon: Map },
  { name: 'Learning Content', path: '/admin/content', icon: BookOpen },
  { name: 'Quizzes', path: '/admin/quizzes', icon: BookOpen },
  { name: 'Moderation', path: '/admin/moderation', icon: ShieldAlert },
  { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
  { name: 'Badges', path: '/admin/badges', icon: Award },
];

export default function AdminSidebar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <aside className="sidebar hidden md:flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] w-64 h-screen sticky top-0">
      {/* Brand */}
      <div className="p-6">
        <Link to="/admin" className="flex items-center gap-2 text-[var(--color-text)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-danger)] flex items-center justify-center text-white font-black text-xl shadow-lg">
            A
          </div>
          <span className="text-xl font-black tracking-tight">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="mb-4">
          <Link to="/dashboard" className="nav-item text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-3 px-3 py-2 rounded-xl transition-colors">
            <ArrowLeft size={20} />
            <span className="font-semibold text-sm">Back to App</span>
          </Link>
        </div>
        
        <p className="px-3 text-xs font-bold text-[var(--color-text-subtle)] uppercase tracking-wider mb-2 mt-4">Management</p>
        
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[var(--color-danger-light)] text-[var(--color-danger)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-semibold text-sm">{item.name}</span>
            </NavLink>
          );
        })}
        
        <p className="px-3 text-xs font-bold text-[var(--color-text-subtle)] uppercase tracking-wider mb-2 mt-6">System</p>
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              isActive
                ? 'bg-[var(--color-danger-light)] text-[var(--color-danger)]'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]'
            }`
          }
        >
          <Settings size={20} />
          <span className="font-semibold text-sm">Settings</span>
        </NavLink>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-[var(--color-danger)] text-white flex items-center justify-center font-bold">
            {user?.firstName?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[var(--color-text)] truncate">
              {user?.firstName}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">Super Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg transition-colors"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
