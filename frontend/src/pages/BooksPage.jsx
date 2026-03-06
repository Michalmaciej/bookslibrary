import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useSpotlight } from '../hooks/useSpotlight'
import { useTilt } from '../hooks/useTilt'
import './BooksPage.css'

const STATUS_LABEL = { read: 'Read', reading: 'Reading', to_read: 'Want to read' }
const STATUS_COLOR = { read: '#4ade80', reading: '#60a5fa', to_read: '#f59e0b' }

/* rating from API: 0–10 decimal → 10 SVG stars with half-star support */
function StarDisplay({ rating }) {
  if (rating === null || rating === undefined) return <span className="book-rating-empty">—</span>

  const val = parseFloat(rating)

  return (
    <span className="book-rating-stars">
      {[1,2,3,4,5,6,7,8,9,10].map(i => {
        const full = val >= i
        const half = !full && val >= i - 0.5
        return (
          <svg key={i} width="11" height="11" viewBox="0 0 24 24" className="book-star-svg">
            <defs>
              <clipPath id={`bk-h-${i}`}>
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="var(--star-empty)"
              stroke="var(--star-stroke)"
              strokeWidth="1"
            />
            {full && (
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#f59e0b"
              />
            )}
            {half && (
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#f59e0b"
                clipPath={`url(#bk-h-${i})`}
              />
            )}
          </svg>
        )
      })}
      <span className="book-rating-num">{val}</span>
    </span>
  )
}

function ProgressBar({ current, total }) {
  if (!total || total === 0) return null
  const pct = Math.min(100, Math.round((current || 0) / total * 100))
  return (
    <div className="book-progress">
      <div className="book-progress-track">
        <div className="book-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="book-progress-label">
        {(current || 0).toLocaleString()} / {total.toLocaleString()} pp &middot; {pct}%
      </span>
    </div>
  )
}

function DeleteConfirmModal({ book, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="delete-modal" onClick={e => e.stopPropagation()}>
        <div className="delete-modal-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </div>
        <h3 className="delete-modal-title">Remove book?</h3>
        <p className="delete-modal-body">
          <span className="delete-modal-book-title">{book.title}</span>
          {book.author && <span className="delete-modal-author"> by {book.author}</span>}
          <br />will be permanently deleted.
        </p>
        <div className="delete-modal-actions">
          <button className="delete-modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="delete-modal-confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

function BookCard({ book, onDelete }) {
  const { containerRef, glowRef, onMouseMove: spotMove, onMouseLeave: spotLeave } = useSpotlight(500)
  const { ref: tiltRef, onMouseMove: tiltMove, onMouseLeave: tiltLeave } = useTilt(10)

  const setRef = (el) => { containerRef.current = el; tiltRef.current = el }
  const onMouseMove = (e) => { spotMove(e); tiltMove(e) }
  const onMouseLeave = (e) => { spotLeave(e); tiltLeave(e) }

  const hasCover = book.cover_url && book.cover_url.trim() !== ''

  return (
    <div className="book-card" ref={setRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div ref={glowRef} className="spotlight-glow" />
      <button className="book-delete" onClick={() => onDelete(book)}>✕</button>
      {hasCover && (
        <div className="book-cover-wrap">
          <img
            src={book.cover_url}
            alt={book.title}
            className="book-cover-img"
            onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.display = 'none' }}
          />
        </div>
      )}
      <div className="book-card-header">
        <span className="book-status" style={{ color: STATUS_COLOR[book.status] }}>{STATUS_LABEL[book.status]}</span>
      </div>
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">{book.author}</p>
      {book.genres && book.genres.length > 0 && (
        <div className="book-genres">
          {book.genres.map(g => <span key={g} className="book-genre-tag">{g}</span>)}
        </div>
      )}
      <ProgressBar current={book.current_page} total={book.total_pages} />
      <div className="book-footer">
        <StarDisplay rating={book.rating} />
        {book.date_read && <span className="book-date">{book.date_read}</span>}
      </div>
      {book.notes && <p className="book-notes">{book.notes}</p>}
    </div>
  )
}

export default function BooksPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => {
    api.get('/books/').then(res => setBooks(res.data)).finally(() => setLoading(false))
  }, [])

  const handleDelete = (book) => setPendingDelete(book)

  const confirmDelete = async () => {
    await api.delete(`/books/${pendingDelete.id}/`)
    setBooks(books.filter(b => b.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  if (loading) return <div className="books-loading">Loading...</div>

  return (
    <div className="books-container">
      <div className="books-header">
        <h1>My Library</h1>
        <span className="books-count">{books.length} {books.length === 1 ? 'book' : 'books'}</span>
      </div>
      {books.length === 0 ? (
        <div className="books-empty"><p>No books yet.<br />Add your first one from the home page!</p></div>
      ) : (
        <div className="books-grid">
          {books.map(book => <BookCard key={book.id} book={book} onDelete={handleDelete} />)}
        </div>
      )}
      {pendingDelete && (
        <DeleteConfirmModal
          book={pendingDelete}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
