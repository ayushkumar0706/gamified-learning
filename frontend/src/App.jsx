import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';

// Authenticated pages
import Dashboard from './pages/Dashboard';
import TopicList from './pages/TopicList';
import TopicDetail from './pages/TopicDetail';
import TakeQuiz from './pages/TakeQuiz';
import LevelList from './pages/LevelList';
import Journey from './pages/Journey';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Seniors from './pages/Seniors';
import Community from './pages/Community';
import Jobs from './pages/Jobs';
import Settings from './pages/Settings';

// ── Helpers ───────────────────────────────────────────────────────────────────
function AppLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] animate-pulse" />
        <p className="text-[var(--color-text-muted)] text-sm font-medium">Loading…</p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--color-bg)] px-4">
      <p className="text-7xl">🗺️</p>
      <h1 className="text-2xl font-black text-[var(--color-text)]">Lost your way?</h1>
      <p className="text-[var(--color-text-muted)]">This page doesn't exist in your learning journey.</p>
      <a href="/" className="btn btn-primary mt-2">Go Home</a>
    </div>
  );
}

// ── Authenticated page wrapper ────────────────────────────────────────────────
function AppPage({ children, title }) {
  return (
    <ProtectedRoute>
      <AppLayout title={title}>
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const { loading } = useAuth();
  if (loading) return <AppLoading />;

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"           element={<LandingPage />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* ── Authenticated app pages ── */}
        <Route path="/dashboard"  element={<AppPage title="Dashboard"><Dashboard /></AppPage>} />
        <Route path="/journey"    element={<AppPage title="My Career Journey"><Journey /></AppPage>} />
        <Route path="/learn"      element={<AppPage title="Learn"><TopicList /></AppPage>} />
        <Route path="/levels"     element={<AppPage title="Learning Path"><LevelList /></AppPage>} />
        <Route path="/levels/:levelId/topics" element={<AppPage title="Topics"><TopicList /></AppPage>} />
        <Route path="/topics"     element={<AppPage title="Topics"><TopicList /></AppPage>} />
        <Route path="/topics/:id" element={<AppPage title="Topic Detail"><TopicDetail /></AppPage>} />
        <Route path="/quizzes/:id/take" element={<AppPage title="Quiz"><TakeQuiz /></AppPage>} />

        {/* Real pages */}
        <Route path="/leaderboard"  element={<AppPage title="Leaderboard"><Leaderboard /></AppPage>} />
        <Route path="/achievements" element={<AppPage title="Achievements"><Achievements /></AppPage>} />
        <Route path="/profile"      element={<AppPage title="Profile"><Profile /></AppPage>} />
        <Route path="/seniors"      element={<AppPage title="Senior Mentorship"><Seniors /></AppPage>} />
        <Route path="/community"    element={<AppPage title="Community"><Community /></AppPage>} />
        <Route path="/jobs"         element={<AppPage title="Jobs & Internships"><Jobs /></AppPage>} />
        <Route path="/settings"     element={<AppPage title="Settings"><Settings /></AppPage>} />

        {/* Stubs for future pages */}
        <Route path="/messages"     element={<AppPage title="Messages"><ComingSoon icon="💬" name="Direct Messages" /></AppPage>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Temporary placeholder for upcoming pages
function ComingSoon({ icon, name }) {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <p className="text-6xl">{icon}</p>
      <h2 className="text-2xl font-black text-[var(--color-text)]">{name}</h2>
      <p className="text-[var(--color-text-muted)]">Coming up next — we're building this step by step!</p>
      <div className="flex gap-2 flex-wrap justify-center">
        <span className="badge badge-primary">In Progress</span>
        <span className="badge badge-xp">Phase 2</span>
      </div>
    </div>
  );
}