import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  GraduationCap, Building2, Search,  Calendar, Clock,
  Star, CheckCircle2,    
  ChevronRight, X, AlertCircle, Award } from 'lucide-react';

const COMPANIES = ['All', 'Google', 'Microsoft', 'Amazon', 'Atlassian', 'Uber', 'Flipkart', 'Startups'];

const MOCK_SENIORS = [
  {
    id: 'sen-1',
    name: 'Aarav Sharma',
    role: 'Software Development Engineer 1',
    company: 'Google',
    companyColor: 'from-blue-500 to-green-500',
    college: 'IIT / Top Tier Campus',
    branch: 'Computer Science',
    year: 'Class of 2024',
    rating: 4.9,
    sessionsCount: 38,
    responseTime: '~2 hrs',
    skills: ['DSA & LeetCode 400+', 'System Design', 'Resume Review', 'Google Interview Prep'],
    bio: 'Placed at Google through off-campus drive. Passionate about helping juniors crack algorithmic rounds and craft high-impact resumes.',
    availableDays: ['Saturday', 'Sunday', 'Wednesday Evening'] },
  {
    id: 'sen-2',
    name: 'Priya Patel',
    role: 'Frontend Engineer II',
    company: 'Microsoft',
    companyColor: 'from-cyan-500 to-blue-600',
    college: 'Tech Campus',
    branch: 'Information Technology',
    year: 'Class of 2023',
    rating: 5.0,
    sessionsCount: 52,
    responseTime: '< 1 hr',
    skills: ['React & Next.js', 'Frontend System Design', 'Portfolio Reviews', 'Referrals'],
    bio: '2+ years at Microsoft. Mentored 50+ students into product companies. Happy to review portfolios, projects, and conduct mock interviews.',
    availableDays: ['Friday Evening', 'Sunday Afternoon'] },
  {
    id: 'sen-3',
    name: 'Rohan Verma',
    role: 'Backend SDE',
    company: 'Amazon',
    companyColor: 'from-amber-500 to-orange-600',
    college: 'Engineering Institute',
    branch: 'Computer Science',
    year: 'Class of 2024',
    rating: 4.8,
    sessionsCount: 29,
    responseTime: '~3 hrs',
    skills: ['Java & Spring Boot', 'AWS & Cloud Architecture', 'Low-Level Design', 'Amazon LP Prep'],
    bio: 'Cracked Amazon SDE-1 on-campus. Specialized in Amazon Leadership Principles and object-oriented low-level design.',
    availableDays: ['Weekdays After 7 PM', 'Weekends'] },
  {
    id: 'sen-4',
    name: 'Sneha Kulkarni',
    role: 'Platform Engineer',
    company: 'Atlassian',
    companyColor: 'from-blue-600 to-indigo-700',
    college: 'Campus Tech',
    branch: 'Electronics & Comm.',
    year: 'Class of 2023',
    rating: 4.9,
    sessionsCount: 44,
    responseTime: '< 2 hrs',
    skills: ['Distributed Systems', 'Go & Docker', 'Non-CS to Tech Transition', 'Mock Interviews'],
    bio: 'Non-CS branch to Atlassian! If you are from ECE/EE and worried about coding rounds, let us build your custom roadmap together.',
    availableDays: ['Saturday', 'Sunday Morning'] },
  {
    id: 'sen-5',
    name: 'Aditya Mehta',
    role: 'Full Stack Engineer',
    company: 'Uber',
    companyColor: 'from-gray-800 to-black',
    college: 'State Tech University',
    branch: 'Computer Science',
    year: 'Class of 2024',
    rating: 4.9,
    sessionsCount: 21,
    responseTime: '~4 hrs',
    skills: ['Full Stack Dev', 'High Scale Microservices', 'Internship Strategies', 'Referrals'],
    bio: 'Joined Uber after a 6-month intern conversion. Can guide you on converting intern offers into full-time PPOs.',
    availableDays: ['Sunday', 'Tuesday Evening'] },
  {
    id: 'sen-6',
    name: 'Ananya Roy',
    role: 'Founding Engineer',
    company: 'Startups',
    companyColor: 'from-purple-600 to-pink-600',
    college: 'National Institute',
    branch: 'Computer Science',
    year: 'Class of 2023',
    rating: 5.0,
    sessionsCount: 31,
    responseTime: '< 1 hr',
    skills: ['Fast-Paced Startups', 'AI Engineering & LLMs', 'Hackathons Winner', 'Cold Emailing'],
    bio: 'Won 6 national hackathons and now building generative AI tooling. I guide students targeting high-equity high-growth startups.',
    availableDays: ['Flexible / On-Demand'] },
];

const SESSION_TYPES = [
  { id: 'resume', title: '1-on-1 Resume Critique', duration: '30 mins', icon: '📄', desc: 'Detailed line-by-line feedback to beat ATS filters.' },
  { id: 'mock', title: 'Mock Coding Interview', duration: '45 mins', icon: '💻', desc: 'Real interview simulation with problem solving & hints.' },
  { id: 'roadmap', title: 'Career & Placement Strategy', duration: '30 mins', icon: '🗺️', desc: 'Target company selection and custom preparation plan.' },
  { id: 'referral', title: 'Referral & Profile Review', duration: '20 mins', icon: '🤝', desc: 'Internal referral discussion for eligible job openings.' },
];

export default function Seniors() {
  const { user } = useAuth();
  const [seniors] = useState(MOCK_SENIORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');

  // Booking Modal
  const [selectedSenior, setSelectedSenior] = useState(null);
  const [selectedSessionType, setSelectedSessionType] = useState('resume');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNote, setBookingNote] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const [bookedSessions, setBookedSessions] = useState([]);

  // Senior promotion state
  const [promoting, setPromoting] = useState(false);
  const [promoMessage, setPromoMessage] = useState(null);

  const handleRequestSeniorStatus = async () => {
    setPromoting(true);
    setPromoMessage(null);
    try {
      const res = await api.post('/users/request-senior', {});
      setPromoMessage({ type: 'success', text: res.message || "Congratulations! You've been promoted to Senior!" });
    } catch (err) {
      setPromoMessage({
        type: 'info',
        text: err.message || 'Senior promotion requires 365 days on platform & 10 completed topics.' });
    } finally {
      setPromoting(false);
    }
  };

  const handleBookSession = (e) => {
    e.preventDefault();
    if (!bookingDate) {
      alert('Please choose a preferred session date.');
      return;
    }

    const sessionObj = {
      id: Date.now(),
      seniorName: selectedSenior.name,
      company: selectedSenior.company,
      type: SESSION_TYPES.find((s) => s.id === selectedSessionType)?.title,
      date: bookingDate,
      note: bookingNote };

    setBookedSessions([sessionObj, ...bookedSessions]);
    setBookingStatus('success');

    setTimeout(() => {
      setSelectedSenior(null);
      setBookingStatus('');
      setBookingDate('');
      setBookingNote('');
    }, 1200);
  };

  const filteredSeniors = seniors.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = selectedCompany === 'All' || s.company === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  return (
    <div className="page-container max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* ── Header Banner ── */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-purple-600/10 border border-blue-500/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-senior font-bold flex items-center gap-1">
                <GraduationCap size={13} />
                Senior Mentorship Network
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">College Cohort</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text)]">
              Learn from Placed Seniors
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-xl leading-relaxed">
              Connect 1-on-1 with verified campus alumni and seniors working at Google, Microsoft, Amazon, and top startups. Book resume critiques, mock interviews, and career guidance.
            </p>
          </div>

          {/* Quick stats / Senior promotion prompt */}
          <div className="shrink-0 space-y-2">
            <div className="card p-3.5 bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] text-center min-w-[200px]">
              <p className="text-xs text-[var(--color-text-muted)]">Campus Mentors Active</p>
              <p className="text-2xl font-black text-[var(--color-primary)]">24 Seniors</p>
              <p className="text-[10px] text-[var(--color-success)] font-semibold mt-0.5">● 100% Free for College Peers</p>
            </div>

            {user?.role !== 'senior' && (
              <button
                onClick={handleRequestSeniorStatus}
                disabled={promoting}
                className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Award size={13} />
                {promoting ? 'Checking Eligibility...' : 'Apply for Senior Mentor'}
              </button>
            )}
          </div>
        </div>

        {promoMessage && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
              promoMessage.type === 'success'
                ? 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/30'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
            }`}
          >
            <AlertCircle size={14} className="shrink-0" />
            <span>{promoMessage.text}</span>
          </div>
        )}
      </div>

      {/* ── Active Booked Sessions Drawer (if any) ── */}
      {bookedSessions.length > 0 && (
        <div className="card p-4 border-2 border-[var(--color-primary)]/40 bg-[var(--color-primary-light)]/30 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[var(--color-text)] flex items-center gap-1.5">
              <Calendar size={14} className="text-[var(--color-primary)]" />
              Your Upcoming Mentorship Sessions ({bookedSessions.length})
            </h3>
            <span className="badge badge-primary text-[10px]">Confirmed</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookedSessions.map((session) => (
              <div key={session.id} className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[var(--color-text)]">{session.seniorName}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{session.company} • {session.type}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-full">
                    {session.date}
                  </span>
                </div>
                {session.note && (
                  <p className="text-[11px] text-[var(--color-text-subtle)] mt-1 italic line-clamp-1">
                    &quot;{session.note}&quot;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Search & Company Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input
            type="text"
            placeholder="Search by senior, company, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full pl-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {COMPANIES.map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedCompany(comp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCompany === comp
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* ── Seniors Grid ── */}
      {filteredSeniors.length === 0 ? (
        <div className="card text-center py-12 px-4">
          <p className="text-3xl mb-2">🔍</p>
          <h3 className="font-bold text-sm text-[var(--color-text)]">No mentors match your search</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Try resetting the company filter or searching for another skill.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSeniors.map((senior) => (
            <div
              key={senior.id}
              className="card p-5 border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-200 flex flex-col justify-between hover:shadow-md relative group"
            >
              <div>
                {/* Header: Senior Name, Avatar & Company badge */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                    {senior.name.split(' ').map((n) => n[0]).join('')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm text-[var(--color-text)] truncate">{senior.name}</h3>
                      <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500 shrink-0">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        {senior.rating}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[var(--color-primary)] truncate">{senior.role}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                      <Building2 size={11} />
                      <span className="font-medium text-[var(--color-text)]">{senior.company}</span>
                      <span>• {senior.year}</span>
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 leading-relaxed mb-3">
                  {senior.bio}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {senior.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom bar: response time & booking CTA */}
              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                <div className="text-[10px] text-[var(--color-text-subtle)] flex items-center gap-1">
                  <Clock size={11} />
                  <span>Responds {senior.responseTime}</span>
                </div>

                <button
                  onClick={() => setSelectedSenior(senior)}
                  className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer"
                >
                  Book Session
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Booking Modal ── */}
      {selectedSenior && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative border border-[var(--color-border)] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
                  <GraduationCap size={18} className="text-[var(--color-primary)]" />
                  Schedule Mentorship Session
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  with <span className="font-bold text-[var(--color-text)]">{selectedSenior.name}</span> ({selectedSenior.company})
                </p>
              </div>
              <button
                onClick={() => setSelectedSenior(null)}
                className="p-1 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {bookingStatus === 'success' ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-success-light)] text-[var(--color-success)] flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h3 className="font-bold text-base text-[var(--color-text)]">Session Confirmed!</h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {selectedSenior.name} has been notified. A Google Meet / Discord invitation has been scheduled.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-4 mt-4 text-xs">
                {/* Session Type Options */}
                <div>
                  <label className="block font-semibold mb-2 text-[var(--color-text)]">Select Session Topic</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SESSION_TYPES.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setSelectedSessionType(type.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedSessionType === type.id
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/40'
                            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/40 bg-[var(--color-surface)]'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-[var(--color-text)]">
                          <span>{type.icon}</span>
                          <span className="text-xs">{type.title}</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{type.desc}</p>
                        <span className="inline-block text-[9px] font-bold text-[var(--color-primary)] mt-1.5">
                          ⏱ {type.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block font-semibold mb-1 text-[var(--color-text)]">Preferred Date & Slot</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="input w-full text-xs"
                  />
                  <p className="text-[10px] text-[var(--color-text-subtle)] mt-1">
                    Senior available on: {selectedSenior.availableDays.join(', ')}
                  </p>
                </div>

                {/* Note / Questions */}
                <div>
                  <label className="block font-semibold mb-1 text-[var(--color-text)]">
                    What would you like to focus on? (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={bookingNote}
                    onChange={(e) => setBookingNote(e.target.value)}
                    placeholder="e.g. Please review my project section, or test me on Binary Trees..."
                    className="input w-full text-xs"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-3 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => setSelectedSenior(null)}
                    className="btn btn-secondary flex-1 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Confirm Booking
                    <CheckCircle2 size={14} />
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
