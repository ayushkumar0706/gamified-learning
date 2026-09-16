import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicData = await api.get(`/topics/${id}`);
        setTopic(topicData.topic);

        const quizData = await api.get(`/quizzes?topic=${id}`);
        if (quizData.quizzes.length > 0) {
          setQuizId(quizData.quizzes[quizData.quizzes.length - 1]._id);
        }

        const videoData = await api.get(`/videos?topic=${id}`);
        setVideos(videoData.videos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="p-6 text-slate-500">Loading topic...</p>;
  if (error) return <p className="p-6 text-danger">Error: {error}</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div>
        <span className="inline-block px-2.5 py-1 rounded-full bg-brand-light text-brand text-xs font-medium mb-3">
          {topic.subject}
        </span>
        <h1 className="text-2xl font-bold text-slate-800">{topic.title}</h1>
        <p className="mt-3 text-slate-600 leading-relaxed">{topic.desciription}</p>

        {quizId ? (
          <button
            onClick={() => navigate(`/quizzes/${quizId}/take`)}
            className="mt-6 px-5 py-2.5 bg-success text-white rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Start Quiz
          </button>
        ) : (
          <p className="mt-6 text-slate-400 text-sm">No quiz available for this topic yet.</p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Related Videos</h2>
        {videos.length === 0 ? (
          <p className="text-slate-400 text-sm">No videos submitted for this topic yet.</p>
        ) : (
          <div className="space-y-3">
            {videos.map((video) => (
              <a
                key={video._id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-lg border border-slate-200 p-3 hover:border-brand transition-colors"
              >
                <p className="font-medium text-slate-800">{video.title}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {video.difficulty} · {video.upvotes} upvotes
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}