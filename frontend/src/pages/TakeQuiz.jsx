import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function TakeQuiz() {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const startTimeRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await api.get(`/quizzes/${id}/take`);
        setQuiz(data.quiz);
        setQuestions(data.questions);
        startTimeRef.current = Date.now();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    const timeTakenSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    const formattedAnswers = questions.map((q) => ({
      question: q._id,
      selectedIndex: answers[q._id] ?? -1
    }));

    try {
      const data = await api.post('/attempts/submit', {
        quizId: id,
        answers: formattedAnswers,
        timeTakenSeconds
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmAndSubmit = () => {
    const allAnswered = questions.every((q) => answers[q._id] !== undefined);
    if (!allAnswered) {
      const unansweredCount = questions.filter((q) => answers[q._id] === undefined).length;
      const proceed = window.confirm(
        `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Submit anyway?`
      );
      if (!proceed) return;
    }
    handleSubmit();
  };

  if (loading) return <p className="p-6 text-slate-500">Loading quiz...</p>;
  if (error) return <p className="p-6 text-danger">Error: {error}</p>;

  if (result) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-success-light text-success flex items-center justify-center text-2xl mx-auto mb-4">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Quiz Complete!</h1>
          <p className="text-slate-500 mb-6">
            {result.correctCount} / {result.totalQuestions} correct
          </p>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 rounded-md p-3">
              <p className="text-xs text-slate-400">XP Earned</p>
              <p className="text-lg font-bold text-success">+{result.attempt.xpAwarded}</p>
            </div>
            <div className="bg-slate-50 rounded-md p-3">
              <p className="text-xs text-slate-400">Level</p>
              <p className="text-lg font-bold text-brand">{result.levelInfo.level}</p>
            </div>
            <div className="bg-slate-50 rounded-md p-3">
              <p className="text-xs text-slate-400">Progress</p>
              <p className="text-sm font-medium text-slate-700 mt-1.5">
                {result.progress.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const currentAnswered = answers[currentQuestion._id] !== undefined;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{quiz.topic?.title}</h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-slate-400 text-sm whitespace-nowrap">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div key={currentQuestion._id} className="bg-white rounded-lg border border-slate-200 p-5">
        <p className="font-medium text-slate-800 mb-4">{currentQuestion.questionText}</p>
        <div className="space-y-2">
          {currentQuestion.options.map((option, optIndex) => {
            const isSelected = answers[currentQuestion._id] === optIndex;
            return (
              <label
                key={optIndex}
                className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-brand bg-brand-light'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion._id}
                  checked={isSelected}
                  onChange={() => selectAnswer(currentQuestion._id, optIndex)}
                  className="accent-brand"
                />
                <span className={isSelected ? 'text-slate-800' : 'text-slate-600'}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex((i) => i - 1)}
          disabled={isFirstQuestion}
          className="px-4 py-2 text-slate-600 rounded-md border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={confirmAndSubmit}
            disabled={submitting}
            className="px-5 py-2 bg-success text-white rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex((i) => i + 1)}
            className="px-5 py-2 bg-brand text-white rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}