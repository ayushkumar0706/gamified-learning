import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
      <Link to="/" className="font-bold text-lg text-brand">
        GamifiedLearn
      </Link>

      <div className="flex items-center gap-5">
        {user ? (
          <>
            <Link to="/dashboard" className="text-slate-600 hover:text-brand transition-colors">
              Dashboard
            </Link>
            <Link to="/levels" className="text-slate-600 hover:text-brand transition-colors">
              Learning Path
            </Link>
            <span className="text-slate-500 text-sm">Hi, {user.firstName}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md bg-danger text-white text-sm hover:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-brand hover:underline">
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-md bg-brand text-white text-sm hover:opacity-90 transition-opacity"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}