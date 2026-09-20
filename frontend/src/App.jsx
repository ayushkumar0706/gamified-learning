import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

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
import Messages from './pages/Messages';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJourney from './pages/admin/AdminJourney';
import AdminTopics from './pages/admin/AdminTopics';
import AdminModeration from './pages/admin/AdminModeration';
import AdminQuizzes from './pages/admin/AdminQuizzes';

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

// ── Admin page wrapper ────────────────────────────────────────────────────────
function AdminPage({ children, title }) {
  return (
    <AdminRoute>
      <AdminLayout title={title}>
        {children}
      </AdminLayout>
    </AdminRoute>
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
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

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
        <Route path="/messages"     element={<AppPage title="Messages"><Messages /></AppPage>} />

        {/* ── Admin Area ── */}
        <Route path="/admin"        element={<AdminPage title="Admin Panel"><AdminDashboard /></AdminPage>} />
        {/* We can map the rest of the nav items to ComingSoon or placeholders for now */}
        <Route path="/admin/users"  element={<AdminPage title="Users"><div className="p-8 text-center text-[var(--color-text-muted)]">Users Module Coming Soon</div></AdminPage>} />
        <Route path="/admin/colleges" element={<AdminPage title="Colleges"><div className="p-8 text-center text-[var(--color-text-muted)]">Colleges Module Coming Soon</div></AdminPage>} />
        <Route path="/admin/journey" element={<AdminPage title="Career Journey"><AdminJourney /></AdminPage>} />
        <Route path="/admin/content" element={<AdminPage title="Learning Topics"><AdminTopics /></AdminPage>} />
        <Route path="/admin/quizzes" element={<AdminPage title="Quiz Management"><AdminQuizzes /></AdminPage>} />
        <Route path="/admin/moderation" element={<AdminPage title="Moderation Queue"><AdminModeration /></AdminPage>} />
        <Route path="/admin/jobs"   element={<AdminPage title="Jobs"><div className="p-8 text-center text-[var(--color-text-muted)]">Jobs Module Coming Soon</div></AdminPage>} />
        <Route path="/admin/badges" element={<AdminPage title="Badges"><div className="p-8 text-center text-[var(--color-text-muted)]">Badges Module Coming Soon</div></AdminPage>} />
        <Route path="/admin/settings" element={<AdminPage title="Settings"><div className="p-8 text-center text-[var(--color-text-muted)]">Settings Module Coming Soon</div></AdminPage>} />

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