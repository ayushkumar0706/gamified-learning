import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  MessageSquare, ThumbsUp, MessageCircle,  Plus, Search,
  Flame, Sparkles,  CheckCircle2,  Send, X, Shield,
   CornerDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CHANNELS = [
  { id: 'all', name: 'All Discussions', icon: '🌐' },
  { id: 'interview-prep', name: 'Interview Prep', icon: '🎤' },
  { id: 'dsa-doubts', name: 'DSA & Algorithms', icon: '🧠' },
  { id: 'project-showcase', name: 'Project Showcase', icon: '🚀' },
  { id: 'placements', name: 'Placement News', icon: '🎓' },
  { id: 'referrals', name: 'Referral Requests', icon: '🤝' },
];

function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Community() {
  useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('trending'); // 'trending' | 'newest'
  const [filterSeniors, setFilterSeniors] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Create Post Modal State
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newChannel, setNewChannel] = useState('interview-prep');
  const [newTags, setNewTags] = useState('');

  // Active Reply Box
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/community/posts?page=${page}&limit=10${filterSeniors ? '&filter=seniors' : ''}`);
      if (res.success) {
        setPosts(res.posts);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, [page, filterSeniors]);

  const handleUpvote = async (postId) => {
    try {
      const res = await api.post(`/community/posts/${postId}/upvote`);
      if (res.success) {
        setPosts(posts.map((p) => {
          if (p.id === postId) {
            return { ...p, upvotes: res.upvotes, upvoted: res.upvoted };
          }
          return p;
        }));
      }
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    try {
      const res = await api.post('/community/posts', {
        channel: newChannel,
        title: newTitle,
        content: newContent,
        tags: tagsArray
      });

      if (res.success) {
        // Refresh posts to get the newly formatted post
        fetchPosts();
        setIsCreatingPost(false);
        setNewTitle('');
        setNewContent('');
        setNewTags('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleAddReply = async (postId) => {
    if (!replyText.trim()) return;

    try {
      const res = await api.post(`/community/posts/${postId}/reply`, {
        content: replyText.trim()
      });

      if (res.success) {
        setPosts(posts.map((p) => {
          if (p.id === postId) {
            // Re-format replies to match frontend expectation
            const formattedReplies = res.replies.map(rep => ({
              id: rep._id,
              author: {
                name: `${rep.author.firstName} ${rep.author.lastName || ''}`.trim(),
                role: rep.author.role,
                company: rep.author.seniorProfile?.company
              },
              content: rep.content,
              createdAt: rep.createdAt
            }));
            return { ...p, replies: formattedReplies };
          }
          return p;
        }));
        setReplyText('');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const filteredPosts = posts
    .filter((p) => {
      const matchChannel = selectedChannel === 'all' || p.channel === selectedChannel;
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchChannel && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'trending') return b.upvotes - a.upvotes;
      return 0; // default order
    });

  return (
    <div className="page-container max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* ── Community Hero ── */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-purple-600/15 via-indigo-600/10 to-pink-600/10 border border-purple-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-primary font-bold flex items-center gap-1">
                <MessageSquare size={13} />
                Campus Community & Feed
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">Discord + LinkedIn</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text)]">
              College Knowledge Hub
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-lg leading-relaxed">
              Ask doubts, share interview experiences, discover referral opportunities, and collaborate with peers and seniors in your college.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingPost(true)}
            className="btn btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-2 shrink-0 shadow-lg cursor-pointer"
          >
            <Plus size={16} />
            Start Discussion
          </button>
        </div>
      </div>

      {/* ── Channel & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input
            type="text"
            placeholder="Search discussions, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full pl-10 text-xs"
          />
        </div>

        {/* Sort and Filter toggle */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto text-xs">
          <button
            onClick={() => { setFilterSeniors(!filterSeniors); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
              filterSeniors
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
            }`}
          >
            <Shield size={13} /> Seniors Only
          </button>

          <button
            onClick={() => setSortBy('trending')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
              sortBy === 'trending'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
            }`}
          >
            <Flame size={13} /> Trending
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
              sortBy === 'newest'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
            }`}
          >
            <Sparkles size={13} /> Newest
          </button>
        </div>
      </div>

      {/* ── Main Layout: Channels (Sidebar) + Feed ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Channels Sidebar */}
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)] px-2 mb-2">
            Channels
          </p>
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedChannel === ch.id
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{ch.icon}</span>
                <span>{ch.name}</span>
              </span>
              <span className="text-[10px] opacity-70">#</span>
            </button>
          ))}
        </div>

        {/* Discussions Feed */}
        <div className="md:col-span-3 space-y-4">
          {loading ? (
             <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="card p-5 border border-[var(--color-border)] skeleton h-48 rounded-2xl"></div>
               ))}
             </div>
          ) : filteredPosts.length === 0 ? (
            <div className="card text-center py-12 px-4 border border-[var(--color-border)]">
              <p className="text-3xl mb-2">💬</p>
              <h3 className="font-bold text-sm text-[var(--color-text)]">No posts in this channel yet</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Be the first to ask a doubt or start a conversation!</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="card p-5 border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-all duration-200 space-y-4"
              >
                {/* Author row */}
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/profile/${post.author.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {post.author.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-[var(--color-text)]">{post.author.name}</span>
                        {post.author.role === 'senior' && (
                          <span className="badge badge-senior text-[10px] py-0.5 px-1.5 flex items-center gap-1">
                            <Shield size={10} /> Senior Guide
                          </span>
                        )}
                        {post.author.company && (
                          <span className="text-[10px] text-[var(--color-primary)] font-bold">
                            @ {post.author.company}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--color-text-subtle)] mt-0.5">
                        {[post.author.branch, post.author.year].filter(Boolean).join(' · ')}
                        <span className="mx-1.5">•</span>
                        {formatTime(post.createdAt)}
                      </p>
                    </div>
                  </Link>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                    #{post.channel}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h2 className="font-black text-sm text-[var(--color-text)] mb-1.5">{post.title}</h2>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Tag chips */}
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Post Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpvote(post.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        post.upvoted
                          ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                          : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
                      }`}
                    >
                      <ThumbsUp size={13} className={post.upvoted ? 'fill-current' : ''} />
                      <span>{post.upvotes}</span>
                    </button>

                    <button
                      onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                      className="px-3 py-1.5 rounded-lg font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle size={13} />
                      <span>{post.replies.length} Replies</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-[var(--color-text-subtle)] flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-[var(--color-success)]" /> Verified Community
                  </span>
                </div>

                {/* Replies Thread Drawer */}
                {activeReplyPostId === post.id && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-3 bg-[var(--color-bg)]/50 p-3 rounded-xl">
                    <p className="text-[11px] font-bold text-[var(--color-text-muted)] flex items-center gap-1">
                      <CornerDownRight size={13} />
                      Replies ({post.replies.length})
                    </p>

                    {post.replies.map((rep) => (
                      <div key={rep.id} className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <Link to={`/profile/${rep.author.id}`} className="flex items-center gap-1.5 hover:opacity-80">
                            <span className="font-bold text-[var(--color-text)]">{rep.author.name}</span>
                            {rep.author.role === 'senior' && (
                              <span className="badge badge-senior text-[9px] py-0 px-1">Senior Guide</span>
                            )}
                            {rep.author.company && (
                              <span className="text-[10px] text-[var(--color-primary)] font-medium">
                                ({rep.author.company})
                              </span>
                            )}
                          </Link>
                          <span className="text-[10px] text-[var(--color-text-subtle)]">{formatTime(rep.createdAt)}</span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">{rep.content}</p>
                      </div>
                    ))}

                    {/* New reply form */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Write a helpful response..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                        className="input flex-1 text-xs"
                      />
                      <button
                        onClick={() => handleAddReply(post.id)}
                        className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer"
                      >
                        <Send size={13} />
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="btn btn-secondary text-xs px-3 py-1.5 cursor-pointer disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-[var(--color-text-muted)]">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="btn btn-secondary text-xs px-3 py-1.5 cursor-pointer disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Create Post Modal ── */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative border border-[var(--color-border)] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h2 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
                <MessageSquare size={18} className="text-[var(--color-primary)]" />
                Start a New Discussion
              </h2>
              <button
                onClick={() => setIsCreatingPost(false)}
                className="p-1 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 mt-4 text-xs">
              {/* Channel Selector */}
              <div>
                <label className="block font-semibold mb-1 text-[var(--color-text)]">Select Channel</label>
                <select
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  className="input w-full text-xs"
                >
                  {CHANNELS.filter((c) => c.id !== 'all').map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.icon} {ch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold mb-1 text-[var(--color-text)]">Discussion Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How do you approach Dynamic Programming on trees?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block font-semibold mb-1 text-[var(--color-text)]">Body Content</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Share details, problem links, or code snippets..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block font-semibold mb-1 text-[var(--color-text)]">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. LeetCode, Trees, Amazon, React"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="btn btn-secondary flex-1 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Publish Post
                  <Send size={13} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
