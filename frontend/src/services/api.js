import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sarms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      // Don't redirect on auth endpoints — let the login form handle errors
      if (!url.includes('/auth/')) {
        localStorage.removeItem('sarms_token');
        window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;
