import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.get('/dashboard/me');
        setDashboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6 text-slate-500">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-danger">Error: {error}</p>;

  const xpPercentage = Math.min(
    100,
    Math.round((dashboard.xp / (dashboard.xp + dashboard.xpToNextLevel)) * 100)
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-bold shrink-0">
          {dashboard.level}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-slate-500 text-sm">Level {dashboard.level} Learner</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600 font-medium">{dashboard.xp} XP</span>
          <span className="text-slate-400">{dashboard.xpToNextLevel} XP to next level</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-slate-400 text-sm">Current Streak</p>
          <p className="text-2xl font-bold text-slate-800">
            {dashboard.streak} <span className="text-lg">🔥</span>
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-slate-400 text-sm">Best Streak</p>
          <p className="text-2xl font-bold text-slate-800">{dashboard.maxStreak}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Recent Attempts</h2>
        {dashboard.recentAttempts?.length ? (
          <ul className="space-y-2">
            {dashboard.recentAttempts.map((attempt) => (
              <li
                key={attempt._id}
                className="bg-white rounded-lg border border-slate-200 p-3 flex justify-between items-center"
              >
                <span className="text-slate-700">{attempt.quizTitle || 'Quiz'}</span>
                <span className="text-success font-medium text-sm">
                  {attempt.score}%
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400">No attempts yet. Go take a quiz!</p>
        )}
      </div>
    </div>
  );
}