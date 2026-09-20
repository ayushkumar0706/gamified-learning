import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] animate-pulse" />
          <p className="text-[var(--color-text-muted)] text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If onboarding is not complete, gate the entire app.
  // Allow /onboarding itself through to avoid a redirect loop.
  // Admins are exempt from onboarding.
  if (!user.onboardingComplete && location.pathname !== '/onboarding' && user.role !== 'admin') {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

export default ProtectedRoute