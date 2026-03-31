import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getIssuedBooks, getFine, payFine } from '../services/api.js';

export default function IssuedBooks() {
  const { userId } = useAuth();
  const [books, setBooks] = useState([]);
  const [fine, setFine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, fineRes] = await Promise.all([getIssuedBooks(userId), getFine(userId)]);
      setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
      setFine(fineRes.data);
    } catch { setBooks([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [userId]);

  const handlePayFine = async () => {
    try { await payFine(userId); setMsg('Fine paid successfully!'); fetchData(); }
    catch { setMsg('Failed to pay fine'); }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <i className="bi bi-journal-check text-lib-primary fs-4"></i>
        <h3 className="mb-0 text-lib-primary">My Issued Books</h3>
      </div>

      {fine && fine.amount > 0 && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between">
          <div><i className="bi bi-exclamation-triangle me-2"></i>You have a fine of <strong>₹{fine.amount}</strong></div>
          <button className="btn btn-sm btn-lib-gold" onClick={handlePayFine}>Pay Fine</button>
        </div>
      )}
      {msg && <div className="alert alert-info py-2">{msg}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-lib-primary"></div></div>
      ) : books.length === 0 ? (
        <div className="text-center py-5"><i className="bi bi-journal fs-1 text-muted"></i><p className="text-muted mt-2">No issued books</p></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-lib table-hover align-middle">
            <thead><tr><th>#</th><th>Book Title</th><th>Issue Date</th><th>Return Date</th><th>Status</th></tr></thead>
            <tbody>
              {books.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td className="fw-semibold">{item.book?.title || item.title || 'N/A'}</td>
                  <td>{item.issueDate || '-'}</td>
                  <td>{item.returnDate || '-'}</td>
                  <td><span className={`badge ${item.returned ? 'bg-success' : 'bg-primary'} rounded-pill`}>{item.returned ? 'Returned' : 'Issued'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
