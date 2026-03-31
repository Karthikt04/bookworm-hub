import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllBooks, issueBook, returnBook, addBook, updateBook } from '../services/api.js';

export default function LibrarianDashboard() {
  const [tab, setTab] = useState('issue');
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [msg, setMsg] = useState('');
  const [issueUserId, setIssueUserId] = useState('');
  const [issueBookId, setIssueBookId] = useState('');
  const [returnId, setReturnId] = useState('');

  // Add/Edit book
  const [bookForm, setBookForm] = useState({ title: '', author: '', genre: '', isbn: '', description: '', publishedYear: '' });
  const [editBookId, setEditBookId] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [u, b] = await Promise.all([getAllUsers(), getAllBooks()]);
        setUsers(Array.isArray(u.data) ? u.data : []);
        setBooks(Array.isArray(b.data) ? b.data : []);
      } catch {}
    })();
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    try { await issueBook(issueUserId, issueBookId); setMsg('Book issued successfully!'); }
    catch { setMsg('Failed to issue book'); }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try { await returnBook(returnId); setMsg('Book returned successfully!'); }
    catch { setMsg('Failed to return book'); }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      if (editBookId) {
        await updateBook(editBookId, bookForm);
        setMsg('Book updated!');
      } else {
        await addBook(bookForm);
        setMsg('Book added!');
      }
      setBookForm({ title: '', author: '', genre: '', isbn: '', description: '', publishedYear: '' });
      setEditBookId('');
      const b = await getAllBooks();
      setBooks(Array.isArray(b.data) ? b.data : []);
    } catch { setMsg('Failed to save book'); }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <i className="bi bi-person-badge-fill text-lib-primary fs-4"></i>
        <h3 className="mb-0 text-lib-primary">Librarian Dashboard</h3>
      </div>
      {msg && <div className="alert alert-info py-2 alert-dismissible fade show">{msg}<button type="button" className="btn-close" onClick={() => setMsg('')}></button></div>}

      <ul className="nav nav-pills mb-4 gap-2">
        {['issue', 'return', 'addBook', 'users'].map(t => (
          <li key={t} className="nav-item">
            <button className={`nav-link ${tab === t ? 'btn-lib text-white' : ''}`} onClick={() => setTab(t)}>
              {t === 'issue' && <><i className="bi bi-arrow-up-right me-1"></i>Issue Book</>}
              {t === 'return' && <><i className="bi bi-arrow-down-left me-1"></i>Return Book</>}
              {t === 'addBook' && <><i className="bi bi-plus-circle me-1"></i>Add/Edit Book</>}
              {t === 'users' && <><i className="bi bi-people me-1"></i>Users</>}
            </button>
          </li>
        ))}
      </ul>

      {tab === 'issue' && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h5 className="text-lib-primary mb-3">Issue a Book</h5>
            <form onSubmit={handleIssue} className="row g-3">
              <div className="col-md-5">
                <label className="form-label small fw-semibold">User ID</label>
                <input className="form-control" value={issueUserId} onChange={e => setIssueUserId(e.target.value)} required />
              </div>
              <div className="col-md-5">
                <label className="form-label small fw-semibold">Book ID</label>
                <input className="form-control" value={issueBookId} onChange={e => setIssueBookId(e.target.value)} required />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-lib w-100">Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tab === 'return' && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h5 className="text-lib-primary mb-3">Return a Book</h5>
            <form onSubmit={handleReturn} className="row g-3">
              <div className="col-md-8">
                <label className="form-label small fw-semibold">Issued Book ID</label>
                <input className="form-control" value={returnId} onChange={e => setReturnId(e.target.value)} required />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button type="submit" className="btn btn-lib w-100">Return</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tab === 'addBook' && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h5 className="text-lib-primary mb-3">{editBookId ? 'Edit Book' : 'Add New Book'}</h5>
            <form onSubmit={handleAddBook} className="row g-3">
              {editBookId && (
                <div className="col-12"><input className="form-control" placeholder="Book ID" value={editBookId} onChange={e => setEditBookId(e.target.value)} /></div>
              )}
              <div className="col-md-6"><input className="form-control" placeholder="Title" value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} required /></div>
              <div className="col-md-6"><input className="form-control" placeholder="Author" value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} required /></div>
              <div className="col-md-4"><input className="form-control" placeholder="Genre" value={bookForm.genre} onChange={e => setBookForm({...bookForm, genre: e.target.value})} /></div>
              <div className="col-md-4"><input className="form-control" placeholder="ISBN" value={bookForm.isbn} onChange={e => setBookForm({...bookForm, isbn: e.target.value})} /></div>
              <div className="col-md-4"><input className="form-control" placeholder="Published Year" value={bookForm.publishedYear} onChange={e => setBookForm({...bookForm, publishedYear: e.target.value})} /></div>
              <div className="col-12"><textarea className="form-control" placeholder="Description" rows="2" value={bookForm.description} onChange={e => setBookForm({...bookForm, description: e.target.value})}></textarea></div>
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-lib">{editBookId ? 'Update' : 'Add Book'}</button>
                {!editBookId && <button type="button" className="btn btn-outline-secondary" onClick={() => setEditBookId('temp')}>Switch to Edit</button>}
                {editBookId && <button type="button" className="btn btn-outline-secondary" onClick={() => setEditBookId('')}>Switch to Add</button>}
              </div>
            </form>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h5 className="text-lib-primary mb-3">All Users</h5>
            <div className="table-responsive">
              <table className="table table-lib table-hover align-middle">
                <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i}>
                      <td className="small">{u.id}</td>
                      <td className="fw-semibold">{u.userName || u.username}</td>
                      <td>{u.email || '-'}</td>
                      <td><span className="badge bg-secondary rounded-pill">{u.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
