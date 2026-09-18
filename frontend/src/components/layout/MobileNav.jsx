import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Map, BookOpen, Trophy,  User
} from 'lucide-react';

const MOBILE_NAV = [
  { to: '/dashboard',   icon: <LayoutDashboard size={20} />, label: 'Home'       },
  { to: '/journey',     icon: <Map size={20} />,             label: 'Journey'    },
  { to: '/learn',       icon: <BookOpen size={20} />,        label: 'Learn'      },
  { to: '/leaderboard', icon: <Trophy size={20} />,          label: 'Rank'       },
  { to: '/profile',     icon: <User size={20} />,            label: 'Profile'    },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav items-stretch">
      {MOBILE_NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isActive
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]'
            }`
          }
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
