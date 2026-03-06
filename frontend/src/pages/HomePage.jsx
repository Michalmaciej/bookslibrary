import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import './HomePage.css'
import booksImage from '../assets/books.png'

const GENRES = [
  'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance',
  'Horror', 'Historical Fiction', 'Literary Fiction', 'Adventure', 'Crime',
  'Biography', 'Autobiography', 'Memoir', 'Self-Help', 'Non-Fiction',
  'Science', 'Philosophy', 'Psychology', 'History', 'Travel',
  'Poetry', "Children's", 'Young Adult', 'Humor', 'Classics',
  'Graphic Novel', 'Short Stories', 'Religion & Spirituality',
]

const STATUS_OPTIONS = [
  { value: 'read',     label: 'Read',              color: '#4ade80' },
  { value: 'reading',  label: 'Currently reading',  color: '#60a5fa' },
  { value: 'to_read',  label: 'Want to read',       color: '#f59e0b' },
]

/* ── Custom Status Select ── */
function CustomStatusSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = STATUS_OPTIONS.find(o => o.value === value)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="custom-select" ref={ref}>
      <button type="button" className={`custom-select-trigger ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        <span className="custom-select-dot" style={{ background: current.color }} />
        <span className="custom-select-label">{current.label}</span>
        <svg className="custom-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="custom-select-dropdown">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`custom-select-option ${opt.value === value ? 'selected' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false) }}
            >
              <span className="custom-select-dot" style={{ background: opt.color }} />
              <span>{opt.label}</span>
              {opt.value === value && (
                <svg className="custom-select-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Genre Multi-Select ── */
function GenreMultiSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = (genre) => {
    if (value.includes(genre)) onChange(value.filter(g => g !== genre))
    else onChange([...value, genre])
  }

  const label = value.length === 0
    ? 'Select genres...'
    : value.length <= 2
    ? value.join(', ')
    : `${value[0]}, ${value[1]} +${value.length - 2}`

  return (
    <div className="genre-select" ref={ref}>
      <button type="button" className={`genre-select-trigger ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        <span className={`genre-select-label ${value.length === 0 ? 'placeholder' : ''}`}>{label}</span>
        {value.length > 0 && (
          <span className="genre-select-count">{value.length}</span>
        )}
        <svg className="custom-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="genre-select-dropdown">
          <div className="genre-pills">
            {GENRES.map(genre => (
              <button
                key={genre}
                type="button"
                className={`genre-pill ${value.includes(genre) ? 'active' : ''}`}
                onClick={() => toggle(genre)}
              >
                {genre}
                {value.includes(genre) && <span className="genre-pill-x">✕</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Cover Input (URL or file→base64) ── */
function CoverInput({ value, onChange }) {
  const fileRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="cover-input">
      <div className="cover-input-row">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste image URL..."
          className="cover-input-url"
        />
        <button type="button" className="cover-input-browse" onClick={() => fileRef.current.click()}>
          Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>
      {value && (
        <div className="cover-preview">
          <img src={value} alt="Cover preview" onError={e => e.target.style.display = 'none'} />
          <button type="button" className="cover-preview-remove" onClick={() => onChange('')}>✕</button>
        </div>
      )}
    </div>
  )
}

/* ── Star Rating Picker (0–10, step 0.5, 10 stars) ── */
function StarRatingPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(null)
  const displayed = hovered !== null ? hovered : value

  const handleMouseMove = (e, i) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setHovered((e.clientX - rect.left) < rect.width / 2 ? i - 0.5 : i)
  }

  const handleClick = (e, i) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newVal = (e.clientX - rect.left) < rect.width / 2 ? i - 0.5 : i
    onChange(newVal === value ? 0 : newVal)
  }

  return (
    <div className="star-picker" onMouseLeave={() => setHovered(null)}>
      <div className="star-picker-stars">
        {[1,2,3,4,5,6,7,8,9,10].map(i => {
          const full = displayed >= i
          const half = !full && displayed >= i - 0.5
          return (
            <span key={i} className="star-picker-star" onMouseMove={e => handleMouseMove(e, i)} onClick={e => handleClick(e, i)}>
              <svg width="19" height="19" viewBox="0 0 24 24">
                <defs><clipPath id={`pick-h-${i}`}><rect x="0" y="0" width="12" height="24" /></clipPath></defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="var(--star-empty,rgba(255,255,255,0.1))" stroke="var(--star-stroke,rgba(255,255,255,0.15))" strokeWidth="1" />
                {full && <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f59e0b" />}
                {half && <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f59e0b" clipPath={`url(#pick-h-${i})`} />}
              </svg>
            </span>
          )
        })}
      </div>
      <span className="star-picker-value">
        {value > 0 ? `${value}/10` : <span className="star-picker-empty">not rated</span>}
      </span>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', author: '', genres: [], cover_url: '', status: 'read',
    rating: 0, total_pages: '', current_page: '', date_read: '', notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/books/', {
        ...form,
        rating: form.rating > 0 ? form.rating : null,
        total_pages: form.total_pages ? parseInt(form.total_pages) : null,
        current_page: form.current_page ? parseInt(form.current_page) : null,
        date_read: form.date_read || null,
      })
      setSuccess(true)
      setForm({ title: '', author: '', genres: [], cover_url: '', status: 'read', rating: 0, total_pages: '', current_page: '', date_read: '', notes: '' })
      setTimeout(() => { setSuccess(false); setShowForm(false) }, 1800)
    } catch {
      setError('Failed to add book.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-decoration">
            <img src={booksImage} alt="Books" width="200" height="200" />
          </div>
          <div className="hero-text">
            <h1>Welcome to your library</h1>
            <p>Track your books, write reviews, and build your personal collection.</p>
            <div className="hero-actions">
              <button className="btn-add" onClick={() => setShowForm(true)}>
                <span className="btn-icon">+</span> Add a book
              </button>
              <button className="btn-secondary" onClick={() => navigate('/books')}>
                Browse library <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add a book</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            {success ? (
              <div className="success-msg">
                <div className="success-msg-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="success-msg-title">Book added!</p>
                <p className="success-msg-sub">Your library has been updated.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Book title" required />
                  </div>
                  <div className="form-group">
                    <label>Author *</label>
                    <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Genres</label>
                    <GenreMultiSelect value={form.genres} onChange={(v) => setForm({ ...form, genres: v })} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <CustomStatusSelect value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Cover image</label>
                  <CoverInput value={form.cover_url} onChange={(v) => setForm({ ...form, cover_url: v })} />
                </div>
                <div className="form-group">
                  <label>Rating (0–10)</label>
                  <StarRatingPicker value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Total pages</label>
                    <input type="number" min="1" value={form.total_pages} onChange={(e) => setForm({ ...form, total_pages: e.target.value })} placeholder="e.g. 320" />
                  </div>
                  <div className="form-group">
                    <label>Current page</label>
                    <input type="number" min="0" value={form.current_page} onChange={(e) => setForm({ ...form, current_page: e.target.value })} placeholder="e.g. 120" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Date finished</label>
                  <input type="date" value={form.date_read} onChange={(e) => setForm({ ...form, date_read: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Your thoughts..." rows="3" />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add book'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
