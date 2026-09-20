import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { BookOpen, Plus, Pencil, Trash2, Link2 } from 'lucide-react';

export default function AdminTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await api.get('/topics');
      // The API returns topics in response.data or response.data.topics
      setTopics(response.data.topics || response.data || []);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
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
          <h1 className="text-2xl font-black text-[var(--color-text)]">Topics</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Manage learning topics and their level associations.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>New Topic</span>
        </button>
      </div>

      <div className="space-y-4">
        {topics.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center">
            <BookOpen size={48} className="text-[var(--color-text-subtle)] mb-4" />
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">No Topics Found</h3>
            <p className="text-[var(--color-text-muted)]">Create the first topic to start building the curriculum.</p>
          </div>
        ) : (
          topics.map((topic) => (
            <div key={topic._id} className="card p-5 flex items-center gap-4 hover:border-[var(--color-primary)] transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] flex items-center justify-center shrink-0 border border-[var(--color-border)] text-[var(--color-text-subtle)]">
                <BookOpen size={24} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-[var(--color-text)] text-lg truncate">{topic.title}</h3>
                  {topic.level && (
                    <span className="badge bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center gap-1">
                      <Link2 size={12} />
                      {topic.level?.name || "Level Bound"}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--color-text-muted)] truncate mt-1">
                  {topic.description || "No description provided."}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-[var(--color-text-subtle)]">
                  <span>Subject: {topic.subject || 'N/A'}</span>
                  <span>•</span>
                  <span>Order: {topic.order ?? 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors">
                  <Pencil size={18} />
                </button>
                <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
