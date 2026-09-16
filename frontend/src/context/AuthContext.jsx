import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) 

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const data = await api.get('/auth/me')
      setUser(data.user)
    } catch (err) {
      setUser(null) 
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    await api.post('/auth/login', { email, password })
    await checkAuth() 
  }

  const logout = async () => {
    await api.post('/auth/logout', {}) 
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}