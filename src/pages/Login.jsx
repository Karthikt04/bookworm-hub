import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { login } from '../services/api.js';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(userName, password);
      const { token, role, userId } = res.data;
      loginUser(token, role, userId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #1a3c5e 0%, #0f2439 100%)' }}>
      <div className="login-card card p-0" style={{ width: '100%', maxWidth: 440 }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #1a3c5e, #2a5a8a)' }}>
              <i className="bi bi-book-half text-white fs-1"></i>
            </div>
            <h3 className="text-lib-primary mb-1">Library Management</h3>
            <p className="text-muted small">Sign in to your account</p>
          </div>
          {error && <div className="alert alert-danger py-2 small"><i className="bi bi-exclamation-circle me-1"></i>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small">Username</label>
              <div className="input-group">
                <span className="input-group-text bg-lib-accent border-0"><i className="bi bi-person"></i></span>
                <input type="text" className="form-control border-0 bg-lib-accent" placeholder="Enter username" value={userName} onChange={e => setUserName(e.target.value)} required />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold small">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-lib-accent border-0"><i className="bi bi-lock"></i></span>
                <input type="password" className="form-control border-0 bg-lib-accent" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn btn-lib w-100 py-2 fw-semibold" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</> : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
