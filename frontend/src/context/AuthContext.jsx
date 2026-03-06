import { createContext, useContext, useState } from 'react'
import api from '../api/axios'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('access_token')
    return token ? { token } : null
  })

  const login = async (username, password) => {
    const res = await axios.post('http://localhost:8000/api/auth/token/', { username, password })
    localStorage.setItem('access_token', res.data.access)
    localStorage.setItem('refresh_token', res.data.refresh)
    setUser({ username, token: res.data.access })
  }

  const register = async (username, password, email) => {
    await api.post('/auth/register/', { username, password, email })
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
