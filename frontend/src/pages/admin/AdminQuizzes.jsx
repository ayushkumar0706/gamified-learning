import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  FileQuestion,
  Search,
  Plus,
  Brain,
  Edit2,
  Trash2,
  Eye,
  Archive,
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizData, topicData] = await Promise.all([
        api.get('/admin/quizzes'),
        api.get('/topics')
      ]);
      setQuizzes(quizData.quizzes || []);
      setTopics(topicData.topics || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/quizzes/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Are you sure you want to hard-delete this quiz? This is only allowed if no students have taken it.')) return;
    try {
      await api.delete(`/admin/quizzes/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete quiz');
    }
  };

  const filteredQuizzes = quizzes.filter(q => 
    q.topic?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.topic?.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Quiz Management</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">Manage, generate, and moderate quizzes across topics.</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="btn btn-primary flex items-center gap-2 self-start"
        >
          <Brain size={18} />
          Generate AI Quiz
        </button>
      </div>

      <div className="card p-4">
        <div className="relative w-full max-w-sm mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input
            type="text"
            placeholder="Search by topic or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input w-full pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">Loading quizzes...</div>
        ) : error ? (
          <div className="text-center py-12 text-[var(--color-danger)]">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-bg)] text-[var(--color-text-muted)]">
                <tr>
                  <th className="p-3 font-semibold rounded-tl-lg">Topic</th>
                  <th className="p-3 font-semibold">Subject</th>
                  <th className="p-3 font-semibold">Questions</th>
                  <th className="p-3 font-semibold">Difficulty</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredQuizzes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-[var(--color-text-subtle)]">
                      No quizzes found
                    </td>
                  </tr>
                ) : (
                  filteredQuizzes.map(quiz => (
                    <tr key={quiz._id} className="hover:bg-[var(--color-bg)]/50 transition-colors">
                      <td className="p-3 font-semibold text-[var(--color-text)]">
                        {quiz.topic?.title || 'Unknown Topic'}
                      </td>
                      <td className="p-3 text-[var(--color-text-muted)]">
                        {quiz.topic?.subject || '-'}
                      </td>
                      <td className="p-3 text-[var(--color-text-muted)]">
                        <span className="badge badge-secondary">{quiz.questionCount}</span>
                      </td>
                      <td className="p-3">
                        <span className="capitalize text-xs font-semibold text-[var(--color-primary)]">
                          {quiz.difficultyLevel}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`badge ${quiz.status === 'published' ? 'badge-success' : quiz.status === 'archived' ? 'badge-danger' : 'badge-secondary'}`}>
                          {quiz.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedQuiz(quiz);
                              setShowQuestionsModal(true);
                            }}
                            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded transition-colors"
                            title="Manage Questions"
                          >
                            <FileQuestion size={16} />
                          </button>
                          
                          {quiz.status === 'published' ? (
                            <button
                              onClick={() => handleUpdateStatus(quiz._id, 'archived')}
                              className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded transition-colors"
                              title="Archive"
                            >
                              <Archive size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(quiz._id, 'published')}
                              className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-success)] hover:bg-[var(--color-success-light)] rounded transition-colors"
                              title="Publish"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteQuiz(quiz._id)}
                            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded transition-colors"
                            title="Hard Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showGenerateModal && (
        <GenerateQuizModal 
          onClose={() => setShowGenerateModal(false)}
          onSuccess={() => {
            setShowGenerateModal(false);
            fetchData();
          }}
          topics={topics}
        />
      )}

      {showQuestionsModal && selectedQuiz && (
        <QuestionsModal 
          quiz={selectedQuiz}
          onClose={() => {
            setShowQuestionsModal(false);
            setSelectedQuiz(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// ── Generate Quiz Modal ──────────────────────────────────────────────────────
function GenerateQuizModal({ onClose, onSuccess, topics }) {
  const [topicId, setTopicId] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topicId) return alert('Select a topic');
    try {
      setGenerating(true);
      await api.post('/quizzes', { topicId, difficultyLevel: difficulty, count: Number(count) });
      onSuccess();
    } catch (err) {
      alert(err.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--color-surface)] rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2 mb-4">
          <Brain size={24} className="text-[var(--color-primary)]" />
          Generate AI Quiz
        </h2>
        
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-1">Topic</label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="input w-full"
              required
            >
              <option value="">-- Select a topic --</option>
              {topics.map(t => (
                <option key={t._id} value={t._id}>{t.subject ? `${t.subject}: ` : ''}{t.title}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input w-full"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-1">Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="input w-full"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={onClose} className="btn flex-1 text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-bg)]" disabled={generating}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1" disabled={generating}>
              {generating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Questions Modal ─────────────────────────────────────────────────────────
function QuestionsModal({ quiz, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add Question State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectIndex, setNewCorrectIndex] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/admin/quizzes/${quiz._id}/questions`);
        setQuestions(res.questions || []);
      } catch (err) {
        alert(err.message || 'Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [quiz]);

  const handleDelete = async (qId) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/admin/questions/${qId}`);
      setQuestions(questions.filter(q => q._id !== qId));
    } catch (err) {
      alert(err.message || 'Failed to delete question');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const filteredOptions = newOptions.filter(o => o.trim() !== '');
    if (filteredOptions.length < 2) return alert('Provide at least 2 options');
    
    try {
      const res = await api.post(`/admin/quizzes/${quiz._id}/questions`, {
        questionText: newQuestionText,
        options: filteredOptions,
        correctAnswerIndex: newCorrectIndex >= filteredOptions.length ? 0 : newCorrectIndex,
        explanation: newExplanation
      });
      setQuestions([...questions, res.question]);
      setShowAddForm(false);
      setNewQuestionText('');
      setNewOptions(['', '', '', '']);
      setNewCorrectIndex(0);
      setNewExplanation('');
    } catch (err) {
      alert(err.message || 'Failed to add question');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--color-surface)] rounded-2xl flex flex-col w-full max-w-4xl h-[80vh] shadow-2xl relative">
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {quiz.topic?.title} Quiz Questions
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm">Status: {quiz.status} | Source: {quiz.source}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-sm btn-secondary flex items-center gap-1"
            >
              <Plus size={14} /> Add Question
            </button>
            <button onClick={onClose} className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] rounded-lg">
              ✕
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {showAddForm && (
            <form onSubmit={handleAddQuestion} className="card p-4 border-2 border-[var(--color-primary-light)] mb-6 space-y-3">
              <h3 className="font-bold text-sm text-[var(--color-primary)]">Add New Question</h3>
              <input
                type="text" placeholder="Question Text" required className="input w-full text-sm"
                value={newQuestionText} onChange={e => setNewQuestionText(e.target.value)}
              />
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--color-text-muted)]">Options & Correct Answer</label>
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input 
                      type="radio" name="correctIndex" checked={newCorrectIndex === i} 
                      onChange={() => setNewCorrectIndex(i)} 
                    />
                    <input
                      type="text" placeholder={`Option ${i+1}`} className="input w-full text-sm py-1.5"
                      value={opt} onChange={e => {
                        const newArr = [...newOptions];
                        newArr[i] = e.target.value;
                        setNewOptions(newArr);
                      }}
                    />
                  </div>
                ))}
              </div>
              <input
                type="text" placeholder="Explanation (Optional)" className="input w-full text-sm"
                value={newExplanation} onChange={e => setNewExplanation(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-sm btn-primary w-full">Save Question</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-sm text-[var(--color-text-muted)]">Cancel</button>
              </div>
            </form>
          )}

          {loading ? (
            <p className="text-center text-[var(--color-text-muted)]">Loading questions...</p>
          ) : questions.length === 0 ? (
            <p className="text-center text-[var(--color-text-muted)]">No questions found in this quiz.</p>
          ) : (
            questions.map((q, idx) => (
              <div key={q._id} className="card p-4 border border-[var(--color-border)] relative group">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="font-semibold text-[var(--color-text)] flex-1">
                    <span className="text-[var(--color-text-subtle)] mr-2">{idx + 1}.</span>
                    {q.questionText}
                  </h3>
                  <button onClick={() => handleDelete(q._id)} className="text-[var(--color-text-subtle)] hover:text-[var(--color-danger)] transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-2 mt-3">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`text-xs p-2 rounded-lg border ${i === q.correctAnswerIndex ? 'bg-[var(--color-success-light)] border-[var(--color-success)] text-[var(--color-success-dark)] font-semibold' : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-muted)]'}`}>
                      {opt}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <p className="mt-3 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg)] p-2 rounded-lg">
                    <span className="font-semibold">Explanation:</span> {q.explanation}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
