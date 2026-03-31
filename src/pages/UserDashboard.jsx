import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getAllBooks, searchBooks, getBooksByGenre } from '../services/api.js';

export default function UserDashboard() {
  const { userId } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let res;
      if (search.trim()) {
        res = await searchBooks(search);
      } else if (genre.trim()) {
        res = await getBooksByGenre(genre);
      } else {
        res = await getAllBooks();
      }
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setGenre('');
    fetchBooks();
  };

  const handleGenre = (g) => {
    setGenre(g);
    setSearch('');
    setTimeout(fetchBooks, 0);
  };

  useEffect(() => {
    if (genre) fetchBooks();
  }, [genre]);

  const genres = ['Fiction', 'Science', 'History', 'Technology', 'Philosophy', 'Biography'];

  return (
    <div>
      <div className="hero-section mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="mb-2"><i className="bi bi-book me-2"></i>Welcome to the Library</h2>
              <p className="mb-3 opacity-75">Discover, borrow, and explore thousands of books</p>
              <form className="d-flex gap-2" onSubmit={handleSearch} style={{ maxWidth: 500 }}>
                <div className="input-group">
                  <span className="input-group-text bg-white border-0"><i className="bi bi-search"></i></span>
                  <input type="text" className="form-control border-0" placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-lib-gold">Search</button>
              </form>
            </div>
            <div className="col-md-4 text-end d-none d-md-block">
              <i className="bi bi-journal-richtext" style={{ fontSize: '6rem', opacity: 0.2 }}></i>
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <div className="mb-4 d-flex flex-wrap gap-2">
          <button className={`btn btn-sm ${!genre ? 'btn-lib' : 'btn-outline-secondary'} rounded-pill px-3`} onClick={() => { setGenre(''); setSearch(''); fetchBooks(); }}>All</button>
          {genres.map(g => (
            <button key={g} className={`btn btn-sm ${genre === g ? 'btn-lib' : 'btn-outline-secondary'} rounded-pill px-3`} onClick={() => handleGenre(g)}>{g}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-lib-primary" role="status" style={{ width: 48, height: 48 }}></div>
            <p className="mt-3 text-muted">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p className="text-muted mt-2">No books found</p>
          </div>
        ) : (
          <div className="row g-4">
            {books.map(book => (
              <div key={book.id} className="col-sm-6 col-md-4 col-lg-3">
                <div className="card card-book h-100 shadow-sm">
                  {book.qrCodeImage ? (
                    <img src={`data:image/png;base64,${book.qrCodeImage}`} className="card-img-top p-3" alt="QR" style={{ height: 160, objectFit: 'contain', background: '#f8f9fa' }} />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-lib-accent" style={{ height: 160 }}>
                      <i className="bi bi-book text-lib-primary" style={{ fontSize: '3rem', opacity: 0.4 }}></i>
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-lib-primary mb-1" style={{ fontSize: '0.95rem' }}>{book.title}</h6>
                    <p className="text-muted small mb-2">{book.author}</p>
                    {book.genre && <span className="badge badge-lib rounded-pill mb-2 align-self-start" style={{ fontSize: '0.7rem' }}>{book.genre}</span>}
                    <div className="mt-auto">
                      <Link to={`/books/${book.id}`} className="btn btn-lib btn-sm w-100">
                        <i className="bi bi-eye me-1"></i>View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
