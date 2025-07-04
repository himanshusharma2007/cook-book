// src/services/api.config.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true 
});

// Add a response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.log('error.response', error.response)
    if (
      error.response &&
      error.response.status === 401 &&
      window.location.pathname !== '/login' && 
      window.location.pathname !== '/register' 
    ) {
      console.log("Redirecting to login due to 401 Unauthorized");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

