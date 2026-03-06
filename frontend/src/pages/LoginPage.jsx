import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSpotlight } from '../hooks/useSpotlight'
import './AuthPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { containerRef, glowRef, onMouseMove, onMouseLeave } = useSpotlight(700)
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" ref={containerRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <div ref={glowRef} className="spotlight-glow" />
        <div className="auth-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="14" height="30" rx="3" fill="#e94560"/>
            <rect x="23" y="5" width="14" height="30" rx="3" fill="#7c3aed"/>
            <rect x="15" y="4" width="10" height="32" rx="5" fill="#0d0d1a"/>
            <rect x="16.5" y="4.5" width="7" height="31" rx="3.5" fill="#16213e"/>
          </svg>
        </div>
        <h1>Books Library</h1>
        <p className="auth-subtitle">Your personal reading library</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Enter your username" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
