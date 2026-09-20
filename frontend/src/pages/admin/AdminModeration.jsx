import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldAlert, Play, Code, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AdminModeration() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await api.get('/admin/resources');
      const data = response.data.data;
      
      const vids = (data.videos || []).map(v => ({ ...v, resourceType: 'video' }));
      const code = (data.coding || []).map(c => ({ ...c, resourceType: 'coding' }));
      
      const combined = [...vids, ...code].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setResources(combined);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (type, id, newStatus) => {
    try {
      await api.patch(`/admin/resources/${type}/${id}/status`, { status: newStatus });
      
      // Optimistic update
      setResources(prev => prev.map(r => 
        (r._id === id && r.resourceType === type) ? { ...r, status: newStatus } : r
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to permanently delete this resource?")) return;
    
    try {
      if (type === 'video') {
        await api.delete(`/videoresources/${id}`);
      } else {
        await api.delete(`/coding-resources/${id}`);
      }
      
      setResources(prev => prev.filter(r => !(r._id === id && r.resourceType === type)));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const filteredResources = resources.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return r.status === 'flagged' || r.status === 'inactive';
    return r.status === filter;
  });

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="page-container max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Moderation Queue</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Review and manage submitted community resources.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-border)] pb-4">
        {['all', 'active', 'flagged'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${
              filter === f 
                ? 'bg-[var(--color-primary)] text-white' 
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
            }`}
          >
            {f === 'flagged' ? 'Needs Review' : f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredResources.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center">
            <ShieldAlert size={48} className="text-[var(--color-text-subtle)] mb-4" />
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">No Resources Found</h3>
            <p className="text-[var(--color-text-muted)]">Everything looks clean and well-moderated.</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <div key={`${resource.resourceType}-${resource._id}`} className="card p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-[var(--color-primary)] transition-colors">
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-[var(--color-border)] ${resource.resourceType === 'video' ? 'text-rose-500 bg-rose-500/10' : 'text-blue-500 bg-blue-500/10'}`}>
                {resource.resourceType === 'video' ? <Play size={24} /> : <Code size={24} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-[var(--color-text)] text-lg truncate">{resource.title}</h3>
                  <span className={`badge text-xs ${
                    resource.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                    resource.status === 'flagged' || resource.status === 'inactive' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-rose-500/10 text-rose-500'
                  }`}>
                    {resource.status}
                  </span>
                </div>
                
                <div className="text-sm text-[var(--color-text-muted)] truncate mt-1">
                  Submitted by <span className="font-semibold text-[var(--color-text)]">{resource.submittedBy?.firstName} {resource.submittedBy?.lastName}</span> ({resource.submittedBy?.role})
                </div>
                
                <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-[var(--color-text-subtle)]">
                  <span>Type: <span className="capitalize">{resource.resourceType}</span></span>
                  <span>•</span>
                  <span>Topic: {resource.topic?.title || 'Unknown'}</span>
                  {resource.reportCount > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-rose-500 flex items-center gap-1"><ShieldAlert size={12}/> {resource.reportCount} Reports</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0 shrink-0">
                <a href={resource.url} target="_blank" rel="noreferrer" className="btn btn-outline text-xs py-1.5 px-3">
                  View Link
                </a>
                
                {resource.status !== 'active' && (
                  <button 
                    onClick={() => handleStatusChange(resource.resourceType, resource._id, 'active')}
                    className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                    title="Approve"
                  >
                    <CheckCircle size={20} />
                  </button>
                )}
                
                {resource.status === 'active' && (
                  <button 
                    onClick={() => handleStatusChange(resource.resourceType, resource._id, resource.resourceType === 'video' ? 'flagged' : 'inactive')}
                    className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                    title="Flag / Suspend"
                  >
                    <XCircle size={20} />
                  </button>
                )}
                
                <div className="w-px h-6 bg-[var(--color-border)] mx-1" />

                <button 
                  onClick={() => handleDelete(resource.resourceType, resource._id)}
                  className="p-2 text-[var(--color-text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete Permanently"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
