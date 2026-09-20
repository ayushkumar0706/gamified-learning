import { Users, Building, ShieldAlert, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStatsData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Users', value: statsData?.totalUsers ?? '...', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Colleges', value: statsData?.totalColleges ?? '...', icon: Building, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Resources', value: statsData?.totalResources ?? '...', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Pending Moderation', value: statsData?.pendingModeration ?? '...', icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="page-container">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">Platform Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)]">{stat.label}</p>
              <h3 className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 min-h-[300px]">
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">Recent Users</h3>
          <div className="flex items-center justify-center h-[200px] text-[var(--color-text-muted)] text-sm">
            Coming Soon
          </div>
        </div>
        
        <div className="card p-6 min-h-[300px]">
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">Pending Reports</h3>
          <div className="flex items-center justify-center h-[200px] text-[var(--color-text-muted)] text-sm">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}
