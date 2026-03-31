import axios from 'axios';

const API_BASE = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (userName, password) => api.post('/auth/login', { userName, password });

// Books
export const getAllBooks = () => api.get('/user/books');
export const getBookById = (id) => api.get(`/user/books/${id}`);
export const searchBooks = (prefix) => api.get('/user/books/search', { params: { prefix } });
export const getBooksByGenre = (genre) => api.get(`/user/books/genre/${genre}`);
export const addBook = (book) => api.post('/librarian/book', book);
export const updateBook = (bookId, book) => api.put(`/librarian/book/${bookId}`, book);
export const deleteBook = (bookId) => api.delete(`/admin/book/${bookId}`);

// Issue / Return
export const issueBook = (userId, bookId) => api.post('/librarian/issue', null, { params: { userId, bookId } });
export const returnBook = (issuedBookId) => api.put(`/librarian/return/${issuedBookId}`);

// Favourites
export const addFavourite = (userId, bookId) => api.post('/user/favourite', null, { params: { userId, bookId } });
export const getFavourites = (userId) => api.get(`/user/favourites/${userId}`);

// Waiting List
export const addToWaitingList = (userId, bookId) => api.post('/user/waiting-list', null, { params: { userId, bookId } });
export const getWaitingList = (userId) => api.get(`/user/waiting-list/${userId}`);

// Reviews
export const addReview = (rating, comment, userId, bookId) =>
  api.post('/user/review', null, { params: { rating, comment, userId, bookId } });

// Issued
export const getIssuedBooks = (userId) => api.get(`/user/issued/${userId}`);

// Fines
export const getFine = (userId) => api.get(`/user/fine/${userId}`);
export const payFine = (userId) => api.put(`/user/fine/pay/${userId}`);

// Admin
export const promoteToLibrarian = (userId) => api.put(`/admin/role/librarian/${userId}`);
export const promoteToAdmin = (userId) => api.put(`/admin/role/admin/${userId}`);

// Users
export const getAllUsers = () => api.get('/librarian/users');

export default api;
