import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useSpotlight } from '../hooks/useSpotlight'
import './ReviewsPage.css'

function StarDisplay({ rating }) {
  if (rating === null || rating === undefined) return null
  const val = parseFloat(rating)
  return (
    <span className="review-rating-stars">
      {[1,2,3,4,5,6,7,8,9,10].map(i => {
        const full = val >= i
        const half = !full && val >= i - 0.5
        return (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24" className="review-star-svg">
            <defs>
              <clipPath id={`rv-h-${i}`}>
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="var(--star-empty, rgba(255,255,255,0.08))"
              stroke="var(--star-stroke, rgba(255,255,255,0.12))"
              strokeWidth="1"
            />
            {full && <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f59e0b" />}
            {half && <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f59e0b" clipPath={`url(#rv-h-${i})`} />}
          </svg>
        )
      })}
      <span className="review-rating-num">{val}</span>
    </span>
  )
}

function ReviewCard({ book }) {
  const { containerRef, glowRef, onMouseMove, onMouseLeave } = useSpotlight(650)
  const hasCover = book.cover_url && book.cover_url.trim() !== ''

  return (
    <div className="review-card" ref={containerRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div ref={glowRef} className="spotlight-glow" />
      <div className={`review-card-inner ${hasCover ? 'review-card-has-cover' : ''}`}>
        {hasCover && (
          <div className="review-cover-wrap">
            <img
              src={book.cover_url}
              alt={book.title}
              className="review-cover-img"
              onError={e => { e.target.style.display = 'none'; e.target.parentElement.classList.add('review-cover-error') }}
            />
          </div>
        )}
        <div className="review-content">
          <div className="review-book-info">
            <h3>{book.title}</h3>
            <span>{book.author}</span>
            {book.genres && book.genres.length > 0 && (
              <div className="review-genres">
                {book.genres.map(g => <span key={g} className="review-genre-tag">{g}</span>)}
              </div>
            )}
          </div>
          {book.rating && <StarDisplay rating={book.rating} />}
          {book.notes && <p className="review-notes">"{book.notes}"</p>}
          {book.date_read && <span className="review-date">Finished: {book.date_read}</span>}
        </div>
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/books/').then(res => {
      setBooks(res.data.filter(b => b.notes || b.rating))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="reviews-loading">Loading...</div>

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h1>Reviews</h1>
        <p>Your notes and ratings</p>
      </div>
      {books.length === 0 ? (
        <div className="reviews-empty"><p>No reviews yet. Add notes or ratings to your books!</p></div>
      ) : (
        <div className="reviews-list">
          {books.map(book => <ReviewCard key={book.id} book={book} />)}
        </div>
      )}
    </div>
  )
}
