import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getWaitingList } from '../services/api.js';

export default function WaitingList() {
  const { userId } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const res = await getWaitingList(userId); setList(Array.isArray(res.data) ? res.data : []); }
      catch { setList([]); }
      finally { setLoading(false); }
    })();
  }, [userId]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <i className="bi bi-clock-history text-lib-gold fs-4"></i>
        <h3 className="mb-0 text-lib-primary">My Waiting List</h3>
      </div>
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-lib-primary"></div></div>
      ) : list.length === 0 ? (
        <div className="text-center py-5"><i className="bi bi-clock fs-1 text-muted"></i><p className="text-muted mt-2">Your waiting list is empty</p></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-lib table-hover align-middle">
            <thead><tr><th>#</th><th>Book Title</th><th>Author</th><th>Status</th></tr></thead>
            <tbody>
              {list.map((item, i) => {
                const book = item.book || item;
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{book.title}</td>
                    <td>{book.author}</td>
                    <td><span className="badge bg-warning text-dark rounded-pill">Waiting</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
