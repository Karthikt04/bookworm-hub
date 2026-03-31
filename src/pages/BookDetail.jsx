import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getBookById, addFavourite, addToWaitingList, addReview } from '../services/api.js';

export default function BookDetail() {
  const { id } = useParams();
  const { userId } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getBookById(id);
        setBook(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleFavourite = async () => {
    try { await addFavourite(userId, id); setMsg('Added to favourites!'); } catch { setMsg('Failed to add to favourites'); }
  };
  const handleWaiting = async () => {
    try { await addToWaitingList(userId, id); setMsg('Added to waiting list!'); } catch { setMsg('Failed to add to waiting list'); }
  };
  const handleReview = async (e) => {
    e.preventDefault();
    try { await addReview(rating, comment, userId, id); setMsg('Review submitted!'); setComment(''); } catch { setMsg('Failed to submit review'); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-lib-primary"></div></div>;
  if (!book) return <div className="container py-5"><div className="alert alert-warning">Book not found</div></div>;

  return (
    <div className="container py-4">
      {msg && <div className="alert alert-info py-2 alert-dismissible fade show"><i className="bi bi-info-circle me-1"></i>{msg}<button type="button" className="btn-close" onClick={() => setMsg('')}></button></div>}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-4 bg-lib-accent d-flex align-items-center justify-content-center p-4">
            {book.qrCodeImage ? (
              <img src={`data:image/png;base64,${book.qrCodeImage}`} alt="QR" className="img-fluid" style={{ maxHeight: 280 }} />
            ) : (
              <i className="bi bi-book" style={{ fontSize: '8rem', opacity: 0.2, color: 'var(--lib-primary)' }}></i>
            )}
          </div>
          <div className="col-md-8">
            <div className="card-body p-4">
              <h3 className="text-lib-primary mb-2">{book.title}</h3>
              <p className="text-muted mb-3"><i className="bi bi-person me-1"></i>{book.author}</p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {book.genre && <span className="badge badge-lib rounded-pill px-3 py-2">{book.genre}</span>}
                {book.isbn && <span className="badge bg-secondary rounded-pill px-3 py-2">ISBN: {book.isbn}</span>}
                <span className={`badge ${book.available ? 'bg-success' : 'bg-danger'} rounded-pill px-3 py-2`}>
                  {book.available ? 'Available' : 'Not Available'}
                </span>
              </div>
              {book.description && <p className="mb-3">{book.description}</p>}
              {book.publishedYear && <p className="small text-muted"><i className="bi bi-calendar me-1"></i>Published: {book.publishedYear}</p>}
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-lib" onClick={handleFavourite}><i className="bi bi-heart me-1"></i>Add to Favourites</button>
                <button className="btn btn-lib-gold" onClick={handleWaiting}><i className="bi bi-clock me-1"></i>Join Waiting List</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mt-4">
        <div className="card-body p-4">
          <h5 className="text-lib-primary mb-3"><i className="bi bi-chat-quote me-2"></i>Write a Review</h5>
          <form onSubmit={handleReview}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Rating</label>
                <select className="form-select" value={rating} onChange={e => setRating(e.target.value)}>
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="col-md-7">
                <label className="form-label small fw-semibold">Comment</label>
                <input type="text" className="form-control" placeholder="Write your review..." value={comment} onChange={e => setComment(e.target.value)} required />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-lib w-100">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {book.reviews && book.reviews.length > 0 && (
        <div className="card border-0 shadow-sm rounded-4 mt-4">
          <div className="card-body p-4">
            <h5 className="text-lib-primary mb-3"><i className="bi bi-star me-2"></i>Reviews</h5>
            {book.reviews.map((r, i) => (
              <div key={i} className="border-bottom py-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="text-lib-gold">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <span className="small text-muted">{r.userName || 'Anonymous'}</span>
                </div>
                <p className="mb-0 small">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
