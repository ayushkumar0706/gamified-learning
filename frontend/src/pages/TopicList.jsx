import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function TopicList() {
  const { levelId } = useParams();
  const [topics, setTopics] = useState([]);
  const [levelName, setLevelName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsData = await api.get(`/topics?level=${levelId}`);
        setTopics(topicsData.topics);

        const levelData = await api.get(`/levels/${levelId}`);
        setLevelName(levelData.level.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [levelId]);

  if (loading) return <p className="p-6 text-slate-500">Loading topics...</p>;
  if (error) return <p className="p-6 text-danger">Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">{levelName}</h1>
      <p className="text-slate-500 mb-6">Pick a topic to start learning</p>

      {topics.length === 0 ? (
        <p className="text-slate-400">No topics in this level yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <Link
              key={topic._id}
              to={`/topics/${topic._id}`}
              className="block bg-white rounded-lg border border-slate-200 p-4 hover:border-brand hover:shadow-sm transition-all"
            >
              <h2 className="font-semibold text-slate-800">{topic.title}</h2>
              <p className="text-slate-400 text-sm mt-1">{topic.subject}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}