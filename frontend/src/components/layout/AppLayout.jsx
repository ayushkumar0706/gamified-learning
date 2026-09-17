import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';

/**
 * AppLayout wraps all authenticated pages.
 * - Desktop: fixed sidebar (240px) + scrollable main area with topbar
 * - Mobile: full-width main + fixed bottom nav
 */
export default function AppLayout({ children, title }) {
  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="app-main flex flex-col min-h-screen">
        {/* Sticky topbar */}
        <Topbar title={title} />

        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
