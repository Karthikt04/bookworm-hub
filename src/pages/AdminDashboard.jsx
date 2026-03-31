import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllBooks, deleteBook, promoteToLibrarian, promoteToAdmin } from '../services/api.js';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [msg, setMsg] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [promoteId, setPromoteId] = useState('');

  const fetchData = async () => {
    try {
      const [u, b] = await Promise.all([getAllUsers(), getAllBooks()]);
      setUsers(Array.isArray(u.data) ? u.data : []);
      setBooks(Array.isArray(b.data) ? b.data : []);
    } catch {}
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm('Delete this book permanently?')) return;
    try { await deleteBook(deleteId); setMsg('Book deleted!'); setDeleteId(''); fetchData(); }
    catch { setMsg('Failed to delete book'); }
  };

  const handlePromote = async (role) => {
    try {
      if (role === 'LIBRARIAN') await promoteToLibrarian(promoteId);
      else await promoteToAdmin(promoteId);
      setMsg(`User promoted to ${role}!`);
      setPromoteId('');
      fetchData();
    } catch { setMsg('Failed to promote user'); }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <i className="bi bi-shield-lock-fill text-lib-primary fs-4"></i>
        <h3 className="mb-0 text-lib-primary">Admin Dashboard</h3>
      </div>
      {msg && <div className="alert alert-info py-2 alert-dismissible fade show">{msg}<button type="button" className="btn-close" onClick={() => setMsg('')}></button></div>}

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card card p-4 text-center">
            <i className="bi bi-people fs-2 mb-2"></i>
            <h2 className="mb-0">{users.length}</h2>
            <small className="opacity-75">Total Users</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card card p-4 text-center">
            <i className="bi bi-book fs-2 mb-2"></i>
            <h2 className="mb-0">{books.length}</h2>
            <small className="opacity-75">Total Books</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card card p-4 text-center">
            <i className="bi bi-person-badge fs-2 mb-2"></i>
            <h2 className="mb-0">{users.filter(u => u.role === 'LIBRARIAN').length}</h2>
            <small className="opacity-75">Librarians</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="text-lib-primary mb-3"><i className="bi bi-trash me-2"></i>Delete Book</h5>
              <form onSubmit={handleDelete} className="d-flex gap-2">
                <input className="form-control" placeholder="Book ID" value={deleteId} onChange={e => setDeleteId(e.target.value)} required />
                <button type="submit" className="btn btn-danger">Delete</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="text-lib-primary mb-3"><i className="bi bi-arrow-up-circle me-2"></i>Promote User</h5>
              <div className="d-flex gap-2">
                <input className="form-control" placeholder="User ID" value={promoteId} onChange={e => setPromoteId(e.target.value)} />
                <button className="btn btn-lib" onClick={() => handlePromote('LIBRARIAN')} disabled={!promoteId}>Librarian</button>
                <button className="btn btn-lib-gold" onClick={() => handlePromote('ADMIN')} disabled={!promoteId}>Admin</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mt-4">
        <div className="card-body p-4">
          <h5 className="text-lib-primary mb-3"><i className="bi bi-people me-2"></i>User Management</h5>
          <div className="table-responsive">
            <table className="table table-lib table-hover align-middle">
              <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th></tr></thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td className="small text-truncate" style={{ maxWidth: 120 }}>{u.id}</td>
                    <td className="fw-semibold">{u.userName || u.username}</td>
                    <td>{u.email || '-'}</td>
                    <td>
                      <span className={`badge rounded-pill ${u.role === 'ADMIN' ? 'bg-danger' : u.role === 'LIBRARIAN' ? 'bg-primary' : 'bg-secondary'}`}>{u.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
