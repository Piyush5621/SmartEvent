import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true, // Support session-based cookie sharing (Sanctum SPA)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Interceptor to handle csrf tokens & bearer auth tokens
api.interceptors.request.use(async (config) => {
  // 1. Attach Bearer token if it exists in localStorage (Sanctum Token Auth)
  const token = localStorage.getItem('api_token') || localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // 2. Attach CSRF token if performing write operations (Sanctum SPA Cookie Auth)
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getCsrfCookie = () => {
  return axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
};

export default api;
