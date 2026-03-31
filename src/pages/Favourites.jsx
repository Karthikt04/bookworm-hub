import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getFavourites } from '../services/api.js';

export default function Favourites() {
  const { userId } = useAuth();
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const res = await getFavourites(userId); setFavs(Array.isArray(res.data) ? res.data : []); }
      catch { setFavs([]); }
      finally { setLoading(false); }
    })();
  }, [userId]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <i className="bi bi-heart-fill text-danger fs-4"></i>
        <h3 className="mb-0 text-lib-primary">My Favourites</h3>
      </div>
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-lib-primary"></div></div>
      ) : favs.length === 0 ? (
        <div className="text-center py-5"><i className="bi bi-heart fs-1 text-muted"></i><p className="text-muted mt-2">No favourites yet</p></div>
      ) : (
        <div className="row g-4">
          {favs.map((f, i) => {
            const book = f.book || f;
            return (
              <div key={book.id || i} className="col-sm-6 col-md-4 col-lg-3">
                <div className="card card-book h-100 shadow-sm">
                  <div className="d-flex align-items-center justify-content-center bg-lib-accent" style={{ height: 140 }}>
                    <i className="bi bi-book text-lib-primary" style={{ fontSize: '2.5rem', opacity: 0.4 }}></i>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-lib-primary mb-1">{book.title}</h6>
                    <p className="text-muted small mb-2">{book.author}</p>
                    <Link to={`/books/${book.id}`} className="btn btn-lib btn-sm w-100 mt-auto"><i className="bi bi-eye me-1"></i>View</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
