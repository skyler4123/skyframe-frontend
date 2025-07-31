import axios from 'axios';
import { redirect } from 'next/navigation';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or get from cookies/context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token'); // Clear invalid token
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/sign_in';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
