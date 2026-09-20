import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Layers, Plus, Pencil, Trash2, ChevronRight } from 'lucide-react';

export default function AdminJourney() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await api.get('/levels');
      // The API returns an array directly if it's the standard get all response, or maybe inside an object.
      // Let's assume response.data is the array or response.data.levels
      setLevels(response.data.levels || response.data || []);
    } catch (err) {
      console.error('Failed to fetch levels:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Career Journey</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Manage the core level progression structure.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>New Level</span>
        </button>
      </div>

      <div className="space-y-4">
        {levels.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center">
            <Layers size={48} className="text-[var(--color-text-subtle)] mb-4" />
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">No Levels Found</h3>
            <p className="text-[var(--color-text-muted)]">Get started by creating the first career level.</p>
          </div>
        ) : (
          levels.map((level) => (
            <div key={level._id} className="card p-5 flex items-center gap-4 hover:border-[var(--color-primary)] transition-colors group">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                style={{ backgroundColor: `${level.color}20`, color: level.color }}
              >
                {level.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-[var(--color-text)] text-lg truncate">{level.name}</h3>
                  <span className="badge bg-[var(--color-surface)] text-[var(--color-text-muted)] text-xs border border-[var(--color-border)]">
                    Level {level.order}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] truncate mt-1">
                  {level.description || "No description provided."}
                </p>
                
                <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-[var(--color-text-subtle)]">
                  <span>XP Required: {level.xpRequired}</span>
                  <span>•</span>
                  <span>Min Topics: {level.minTopicsToClear}</span>
                  <span>•</span>
                  <span>Quizzes: {level.minQuizzesToClear}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors">
                  <Pencil size={18} />
                </button>
                <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
                <button className="ml-2 p-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:border-[var(--color-primary)] transition-colors flex items-center gap-1 text-sm font-bold">
                  <span>Topics</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
