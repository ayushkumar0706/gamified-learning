import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Zap, LayoutDashboard, Map, BookOpen, Trophy, Users,
  GraduationCap, MessageSquare, Briefcase, Medal, User,
  Settings, LogOut, Building2, ShieldAlert
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard',   icon: <LayoutDashboard size={18} />, label: 'Dashboard'   },
  { to: '/journey',     icon: <Map size={18} />,             label: 'My Journey'  },
  { to: '/learn',       icon: <BookOpen size={18} />,        label: 'Learn'       },
  { to: '/leaderboard', icon: <Trophy size={18} />,          label: 'Leaderboard' },
  { to: '/community',   icon: <Users size={18} />,           label: 'Community'   },
  { to: '/seniors',     icon: <GraduationCap size={18} />,   label: 'Seniors'     },
  { to: '/messages',    icon: <MessageSquare size={18} />,   label: 'Messages'    },
  { to: '/jobs',        icon: <Briefcase size={18} />,       label: 'Jobs'        },
  { to: '/achievements',icon: <Medal size={18} />,           label: 'Achievements'},
];

const BOTTOM_ITEMS = [
  { to: '/profile',  icon: <User size={18} />,     label: 'Profile'  },
  { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="sidebar flex-col select-none">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
          <Zap size={15} className="text-white" />
        </div>
        <span className="text-white font-black text-lg tracking-tight">LearnUp</span>
      </div>

      {/* User mini-profile */}
      {user && (
        <div className="mx-3 mt-3 space-y-1.5">
          {/* Name + Level */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user.firstName?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[var(--color-sidebar-text)] text-xs truncate">Level {user.level || 1}</p>
            </div>
          </div>

          {/* College badge */}
          {user.college ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
              <Building2 size={13} className="text-[var(--color-primary)] shrink-0" />
              <p className="text-[var(--color-sidebar-text)] text-xs font-medium truncate">
                {user.college.name ?? 'Your College'}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 opacity-60">
              <Building2 size={13} className="text-[var(--color-sidebar-text)] shrink-0" />
              <p className="text-[var(--color-sidebar-text)] text-xs truncate">No college set</p>
            </div>
          )}
        </div>
      )}

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom items */}
      <div className="px-3 py-3 border-t border-white/5 space-y-0.5">
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className="sidebar-item"
            style={{ color: '#F59E0B' }}
          >
            <ShieldAlert size={18} />
            <span>Admin Panel</span>
          </NavLink>
        )}
        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] hover:text-[var(--color-danger)]"
          style={{ color: '#EF4444' }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
