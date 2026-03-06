import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSpotlight } from '../hooks/useSpotlight'
import './AuthPage.css'

export default function RegisterPage() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const { containerRef, glowRef, onMouseMove, onMouseLeave } = useSpotlight(700)
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await register(form.username, form.password, form.email)
      await login(form.username, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.')
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
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join Books Library today</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Choose a username" required />
          </div>
          <div className="form-group">
            <label>Email <span style={{opacity:0.4}}>(optional)</span></label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a password" required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={form.password2} onChange={(e) => setForm({ ...form, password2: e.target.value })} placeholder="Repeat your password" required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
