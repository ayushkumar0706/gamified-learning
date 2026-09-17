import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Zap, BookOpen } from 'lucide-react';

export default function PublicNavbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If logged in, redirect to app
  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="gradient-text">LearnUp</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Features
            </a>
            <a
              href="#journey"
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              The Journey
            </a>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors px-3 py-2"
            >
              Login
            </Link>
            <Link
              to="/onboarding"
              className="btn btn-primary btn-sm"
            >
              <BookOpen size={14} />
              Join Your College
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-[var(--color-border)] px-4 py-4 space-y-3">
          <a href="#how-it-works" className="block text-sm font-medium text-[var(--color-text-muted)] py-2" onClick={() => setMenuOpen(false)}>
            How It Works
          </a>
          <a href="#features" className="block text-sm font-medium text-[var(--color-text-muted)] py-2" onClick={() => setMenuOpen(false)}>
            Features
          </a>
          <a href="#journey" className="block text-sm font-medium text-[var(--color-text-muted)] py-2" onClick={() => setMenuOpen(false)}>
            The Journey
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/login" className="btn btn-secondary w-full justify-center" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/onboarding" className="btn btn-primary w-full justify-center" onClick={() => setMenuOpen(false)}>
              Join Your College
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
