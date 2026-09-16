const RENDER_BACKEND_URL = 'https://brpf.onrender.com/api';

export const API_URL = 
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : RENDER_BACKEND_URL;