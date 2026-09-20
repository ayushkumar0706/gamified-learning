import AdminSidebar from './AdminSidebar';
import Topbar from './Topbar';

export default function AdminLayout({ children, title }) {
  return (
    <div className="app-layout bg-[var(--color-bg)]">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <main className="app-main flex flex-col min-h-screen">
        {/* Sticky topbar */}
        <Topbar title={title} />

        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
