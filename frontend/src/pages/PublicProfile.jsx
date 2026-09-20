import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { BADGES } from '../data/badges';
import { MapPin, Building, Calendar, Star, TrendingUp, Shield, Lock, Award, GraduationCap, Github, Linkedin, ExternalLink, MessageSquare, Flame } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

export default function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/profile/${id}`);
        if (res.user) {
          setProfile(res.user);
        } else {
          setError(res.message || 'Profile not found');
        }
      } catch (err) {
        setError(err.message || 'Unable to load profile. It may be private or restricted.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
      <div className="badge badge-primary">Loading Profile...</div>
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-20 px-4 text-center">
        <div className="w-20 h-20 bg-[var(--color-surface)] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--color-border)]">
          <Lock size={32} className="text-[var(--color-text-muted)]" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Profile Unavailable</h2>
        <p className="text-[var(--color-text-muted)]">{error}</p>
        <Link to="/" className="btn btn-primary mt-6 inline-flex">Return Home</Link>
      </div>
    </div>
  );

  const getBadgeIcon = (dbBadgeId) => {
    const badgeDef = BADGES.find(b => b.id === dbBadgeId);
    return badgeDef ? badgeDef.icon : '🏅';
  };

  const getBadgeName = (dbBadgeId) => {
    const badgeDef = BADGES.find(b => b.id === dbBadgeId);
    return badgeDef ? badgeDef.name : dbBadgeId;
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto pt-24 px-4 sm:px-6 pb-12">
        {/* Profile Header */}
        <div className="card p-8 mb-8 relative overflow-hidden bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent">
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-4xl font-bold text-white shadow-xl border-4 border-[var(--color-bg)] shrink-0 relative">
              {profile.firstName?.[0] || '?'}
              {profile.role === 'senior' && (
                <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg border-2 border-[var(--color-bg)]" title="Senior Status">
                  <Shield size={14} />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-black text-[var(--color-text)] mb-1">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">
                {profile.careerGoal || 'Building the future'}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <span className="badge bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]">
                  <GraduationCap size={14} className="mr-1.5 text-[var(--color-primary)]" />
                  {profile.college?.name || 'Unknown College'}
                </span>
                <span className="badge bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]">
                  <Building size={14} className="mr-1.5 text-[var(--color-secondary)]" />
                  {profile.branch || 'B.Tech'}
                </span>
                <span className="badge bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]">
                  <Calendar size={14} className="mr-1.5 text-[var(--color-success)]" />
                  {profile.year ? `Year ${profile.year}` : 'Student'}
                </span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-2">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white hover:bg-[#333] transition-colors border border-[var(--color-border)]">
                  <Github size={18} />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white hover:bg-[#0077b5] transition-colors border border-[var(--color-border)]">
                  <Linkedin size={18} />
                </a>
              )}
              {/* Message Button */}
              <Link to={`/messages?user=${profile._id}`} className="px-4 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm ml-2 font-semibold text-sm gap-2">
                <MessageSquare size={16} />
                Message
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column: Stats & About */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-[var(--color-text)] mb-4 text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-[var(--color-primary)]" />
                Platform Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-text-muted)] text-sm">Experience</span>
                  <span className="font-bold text-[var(--color-xp)] flex items-center gap-1">
                    <Star size={14} className="fill-current" /> {profile.xp || 0} XP
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-text-muted)] text-sm">Current Level</span>
                  <span className="badge badge-primary text-xs">Level {profile.level || 1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-muted)] text-sm">Best Streak</span>
                  <span className="font-bold text-[var(--color-danger)] flex items-center gap-1">
                    <Flame size={14} className="fill-current" /> {profile.maxStreak || 0} Days
                  </span>
                </div>
              </div>
            </div>

            {profile.bio && (
              <div className="card p-6">
                <h3 className="font-bold text-[var(--color-text)] mb-3 text-sm">About</h3>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Badges & Activity */}
          <div className="md:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-[var(--color-text)] mb-4 text-sm flex items-center gap-2">
                <Award size={16} className="text-[var(--color-secondary)]" />
                Earned Badges ({profile.badges?.length || 0})
              </h3>
              
              {profile.badges && profile.badges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {profile.badges.map((b) => (
                    <div key={b.badgeId} className="px-3 py-2 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] flex items-center gap-2" title={`Earned: ${new Date(b.earnedAt).toLocaleDateString()}`}>
                      <span className="text-lg">{getBadgeIcon(b.badgeId)}</span>
                      <span className="text-xs font-semibold text-[var(--color-text)]">{getBadgeName(b.badgeId)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[var(--color-text-subtle)] bg-[var(--color-bg)] rounded-xl border border-dashed border-[var(--color-border)]">
                  <Award size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No badges earned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
