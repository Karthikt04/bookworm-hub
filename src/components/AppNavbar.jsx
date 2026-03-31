import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AppNavbar() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-lib shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/dashboard">
          <i className="bi bi-book-half fs-4"></i>
          <span style={{ fontFamily: 'Merriweather, serif' }}>LibraryMS</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard"><i className="bi bi-grid me-1"></i>Books</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/favourites"><i className="bi bi-heart me-1"></i>Favourites</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/waiting-list"><i className="bi bi-clock me-1"></i>Waiting List</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/issued-books"><i className="bi bi-journal-check me-1"></i>Issued Books</Link>
            </li>
            {(role === 'LIBRARIAN' || role === 'ADMIN') && (
              <li className="nav-item">
                <Link className="nav-link" to="/librarian"><i className="bi bi-person-badge me-1"></i>Librarian</Link>
              </li>
            )}
            {role === 'ADMIN' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin"><i className="bi bi-shield-lock me-1"></i>Admin</Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <span className="badge badge-lib px-3 py-2 rounded-pill">{role}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
