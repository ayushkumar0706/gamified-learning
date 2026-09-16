import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await api.post('/auth/register', {
        firstName,
        lastName: lastName || undefined,
        email,
        password,
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
      })
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow'

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg border border-slate-200 w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-slate-800">Register</h1>

        {error && (
          <p className="text-danger text-sm text-center bg-danger-light rounded-md py-2 px-3">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Last Name (optional)
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Age (optional)</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Gender (optional)
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={inputClass}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand text-white py-2.5 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {submitting ? 'Registering...' : 'Register'}
        </button>

        <p className="text-sm text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-medium hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register