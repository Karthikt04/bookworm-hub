import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AppNavbar from './components/AppNavbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Favourites from './pages/Favourites.jsx';
import WaitingList from './pages/WaitingList.jsx';
import IssuedBooks from './pages/IssuedBooks.jsx';
import LibrarianDashboard from './pages/LibrarianDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['USER','LIBRARIAN','ADMIN']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute roles={['USER','LIBRARIAN','ADMIN']}><BookDetail /></ProtectedRoute>} />
          <Route path="/favourites" element={<ProtectedRoute roles={['USER','LIBRARIAN','ADMIN']}><Favourites /></ProtectedRoute>} />
          <Route path="/waiting-list" element={<ProtectedRoute roles={['USER','LIBRARIAN','ADMIN']}><WaitingList /></ProtectedRoute>} />
          <Route path="/issued-books" element={<ProtectedRoute roles={['USER','LIBRARIAN','ADMIN']}><IssuedBooks /></ProtectedRoute>} />
          <Route path="/librarian" element={<ProtectedRoute roles={['LIBRARIAN','ADMIN']}><LibrarianDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
