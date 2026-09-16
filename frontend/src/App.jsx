import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TopicList from './pages/TopicList'
import TopicDetail from './pages/TopicDetail'
import TakeQuiz from './pages/TakeQuiz'
import LevelList from './pages/LevelList'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './pages/Register'
import Navbar from './components/Navbar';


function Home() {
  return <h1 className="text-3xl font-bold text-blue-600">Home Page</h1>
}

function About() {
  return <h1 className="text-3xl font-bold text-green-600">About Page</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/topics"
          element={
            <ProtectedRoute>
              <TopicList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/topics/:id"
          element={
            <ProtectedRoute>
              <TopicDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:id/take"
          element={
            <ProtectedRoute>
              <TakeQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/levels"
          element={
            <ProtectedRoute>
              <LevelList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/levels/:levelId/topics"
          element={
            <ProtectedRoute>
              <TopicList />
            </ProtectedRoute>
          }
        />
      <Route path="*" element={<p className="p-6">Page not found</p>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App