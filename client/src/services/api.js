import axios from 'axios';

const API = axios.create({
  baseURL: 'https://robocutz-mern.vercel.app/api',
});

// Interceptor to attach Authorization Bearer token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('robocutz_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
