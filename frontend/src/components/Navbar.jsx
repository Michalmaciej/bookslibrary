import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="theme-toggle-track">
        <span className="theme-toggle-star" />
        <span className="theme-toggle-star" />
        <span className="theme-toggle-star" />
        <div className="theme-toggle-thumb">
          {/* Moon icon — visible in dark mode */}
          <svg className="theme-icon-moon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
          {/* Sun icon — visible in light mode */}
          <svg className="theme-icon-sun" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </button>
  )
}

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <svg className="navbar-logo" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="9" height="18" rx="2" fill="#e94560"/>
          <rect x="15" y="4" width="9" height="18" rx="2" fill="#7c3aed"/>
          <rect x="10" y="3" width="6" height="20" rx="3" fill="#0d0d1a"/>
          <rect x="11" y="3.5" width="4" height="19" rx="2" fill="#16213e"/>
        </svg>
        <span className="navbar-title">Books Library</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
        <NavLink to="/books" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Books</NavLink>
        <NavLink to="/reviews" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Reviews</NavLink>
      </div>
      <div className="navbar-actions">
        <ThemeToggle />
        <button className="btn-logout" onClick={handleLogout}>Sign out</button>
      </div>
    </nav>
  )
}
