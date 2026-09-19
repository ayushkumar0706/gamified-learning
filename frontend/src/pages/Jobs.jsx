import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Briefcase,  MapPin,  Users, ExternalLink,
  Search,  CheckCircle2,  Send, X, 
   ShieldCheck } from 'lucide-react';

const JOB_TYPES = ['All', 'Full-time', 'Internship'];
const LOCATIONS = ['All', 'Bangalore', 'Hyderabad', 'Pune', 'Gurgaon', 'Remote'];

export default function Jobs() {
  useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [onlyReferrals, setOnlyReferrals] = useState(false);

  // Referral Modal
  const [selectedJobForReferral, setSelectedJobForReferral] = useState(null);
  const [referralResume, setReferralResume] = useState('');
  const [referralNote, setReferralNote] = useState('');
  const [referralSent, setReferralSent] = useState(false);
  const [sentReferrals, setSentReferrals] = useState([]);

  useEffect(() => {
    api.get('/jobs')
      .then(res => {
        setJobs(res || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSendReferralRequest = async (e) => {
    e.preventDefault();
    if (!referralResume.trim()) {
      alert('Please provide a link to your resume (Google Drive or Dropbox).');
      return;
    }

    try {
      await api.post(`/jobs/${selectedJobForReferral.id}/referral`, {
        resumeUrl: referralResume,
        note: referralNote
      });
      setSentReferrals([...sentReferrals, selectedJobForReferral.id]);
      setReferralSent(true);

      setTimeout(() => {
        setSelectedJobForReferral(null);
        setReferralSent(false);
        setReferralResume('');
        setReferralNote('');
      }, 1300);
    } catch (err) {
      alert(err.message || 'Failed to send referral request');
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchType = selectedType === 'All' || job.type === selectedType;
    const matchLocation = selectedLocation === 'All' || job.location.includes(selectedLocation);
    const matchReferral = !onlyReferrals || job.referralAvailable;
    return matchSearch && matchType && matchLocation && matchReferral;
  });

  if (loading) {
    return <div className="page-container max-w-5xl mx-auto py-20 text-center"><span className="badge badge-primary">Loading Jobs...</span></div>;
  }

  return (
    <div className="page-container max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* ── Header Banner ── */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-emerald-600/15 via-teal-600/10 to-indigo-600/10 border border-emerald-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-success font-bold flex items-center gap-1">
                <Briefcase size={13} />
                Campus Placements & Off-Campus Jobs
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">Curated for Students</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text)]">
              Opportunities & Senior Referrals
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-xl leading-relaxed">
              Explore verified graduate roles and internships. Fast-track your application with direct senior alumni referrals from your college.
            </p>
          </div>

          <div className="card p-4 bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] text-center shrink-0 min-w-[170px]">
            <p className="text-2xl font-black text-[var(--color-success)]">
              {jobs.filter((j) => j.referralAvailable).length} Referrals
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)] font-semibold mt-0.5">Available by College Seniors</p>
          </div>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input
            type="text"
            placeholder="Search roles, companies, tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full pl-10 text-xs"
          />
        </div>

        {/* Dropdowns & Checkbox */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input text-xs py-1.5"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Types' : t}
              </option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="input text-xs py-1.5"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'All' ? 'All Locations' : loc}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyReferrals}
              onChange={(e) => setOnlyReferrals(e.target.checked)}
              className="accent-[var(--color-primary)]"
            />
            <span className="font-semibold text-[var(--color-text)]">Referral Available Only</span>
          </label>
        </div>
      </div>

      {/* ── Jobs Grid ── */}
      {filteredJobs.length === 0 ? (
        <div className="card text-center py-12 px-4 border border-[var(--color-border)]">
          <p className="text-3xl mb-2">💼</p>
          <h3 className="font-bold text-sm text-[var(--color-text)]">No job openings found</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Try resetting the filters or searching for another keyword.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const isSent = sentReferrals.includes(job.id);

            return (
              <div
                key={job.id}
                className="card p-5 border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:shadow-md"
              >
                {/* Left info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {job.logo || '💼'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-sm text-[var(--color-text)]">{job.title}</h2>
                      <span className="text-xs font-semibold text-[var(--color-primary)]">• {job.company}</span>
                      <span className="badge badge-primary text-[10px] py-0">{job.type}</span>
                      {job.referralAvailable && (
                        <span className="badge badge-success text-[10px] py-0 flex items-center gap-0.5">
                          <ShieldCheck size={11} /> Senior Referral
                        </span>
                      )}
                      {job.matchScore !== undefined && (
                        <span className="badge text-[10px] py-0 flex items-center gap-0.5" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                          🎯 {job.matchScore}% Match
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)] pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {job.location}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-[var(--color-text)]">{job.ctc}</span>
                      <span>•</span>
                      <span className="text-[var(--color-text-subtle)]">{job.batch}</span>
                    </div>

                    <p className="text-xs text-[var(--color-text-muted)] pt-1 max-w-2xl leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[var(--color-border)]">
                  {job.referralAvailable ? (
                    <button
                      onClick={() => setSelectedJobForReferral(job)}
                      disabled={isSent}
                      className={`btn text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer w-full md:w-auto justify-center ${
                        isSent
                          ? 'bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]/30'
                          : 'btn-primary'
                      }`}
                    >
                      {isSent ? (
                        <>
                          <CheckCircle2 size={13} />
                          Referral Requested
                        </>
                      ) : (
                        <>
                          <Users size={13} />
                          Ask for Referral
                        </>
                      )}
                    </button>
                  ) : null}

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1 cursor-pointer w-full md:w-auto justify-center"
                  >
                    Direct Apply
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Referral Request Modal ── */}
      {selectedJobForReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative border border-[var(--color-border)] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[var(--color-success)]" />
                  Request College Senior Referral
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  for <span className="font-bold text-[var(--color-text)]">{selectedJobForReferral.title}</span> at {selectedJobForReferral.company}
                </p>
              </div>
              <button
                onClick={() => setSelectedJobForReferral(null)}
                className="p-1 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {referralSent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-success-light)] text-[var(--color-success)] flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h3 className="font-bold text-base text-[var(--color-text)]">Referral Request Sent!</h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {selectedJobForReferral.seniorReferrer || 'The senior'} will review your resume and submit your internal profile to the hiring team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendReferralRequest} className="space-y-4 mt-4 text-xs">
                {/* Referrer info */}
                <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center gap-3">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="font-bold text-[var(--color-text)]">Campus Senior Available:</p>
                    <p className="text-[11px] text-[var(--color-primary)] font-medium">
                      {selectedJobForReferral.seniorReferrer || 'Alumni Referrer'}
                    </p>
                  </div>
                </div>

                {/* Resume Link */}
                <div>
                  <label className="block font-semibold mb-1 text-[var(--color-text)]">
                    Resume Link (Google Drive / Overleaf / Hosted PDF) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/file/d/..."
                    value={referralResume}
                    onChange={(e) => setReferralResume(e.target.value)}
                    className="input w-full text-xs"
                  />
                  <p className="text-[10px] text-[var(--color-text-subtle)] mt-1">Make sure view access is set to &quot;Anyone with the link&quot;.</p>
                </div>

                {/* Note */}
                <div>
                  <label className="block font-semibold mb-1 text-[var(--color-text)]">
                    Brief Note & Highlights (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Completed 150+ DSA problems, 2 Full Stack projects, and maintain a 30-day streak on LearnUp..."
                    value={referralNote}
                    onChange={(e) => setReferralNote(e.target.value)}
                    className="input w-full text-xs"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-3 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForReferral(null)}
                    className="btn btn-secondary flex-1 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Submit Referral Request
                    <Send size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
