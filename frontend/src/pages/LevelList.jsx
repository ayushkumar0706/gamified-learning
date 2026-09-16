import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function LevelList() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await api.get('/levels');
        setLevels(data.levels);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, []);

  if (loading) return <p className="p-6 text-slate-500">Loading levels...</p>;
  if (error) return <p className="p-6 text-danger">Error: {error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Your Learning Path</h1>
      <p className="text-slate-500 mb-6">Progress through each stage to get job-ready</p>

      <div className="space-y-3">
        {levels.map((level, index) => (
          <Link
            key={level._id}
            to={`/levels/${level._id}/topics`}
            className="flex items-center gap-4 bg-white rounded-lg border border-slate-200 p-4 hover:border-brand hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-brand-light text-brand flex items-center justify-center font-bold shrink-0">
              {index + 1}
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">{level.name}</h2>
              {level.description && (
                <p className="text-slate-400 text-sm">{level.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}