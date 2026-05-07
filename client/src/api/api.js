import axios from 'axios';

// The URL where your backend is hosted
// During development, it uses localhost:5000
// After deployment, Vercel will use the VITE_API_URL you set in the dashboard
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach the JWT token to every request if it exists in localStorage
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
