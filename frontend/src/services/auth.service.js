// Remplace par ton URL Render en production
export const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : 'https://brpf.onrender.com/api';

export const AuthService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erreur lors de la connexion.');

    // Stocke le token JWT dans le navigateur
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Erreur lors de l'inscription.");
    return data;
  },

  async getRoles() {
    try {
      const response = await fetch(`${API_URL}/roles`);
      if (!response.ok) return [];
      return await response.json(); // Renvoie un tableau d'objets [{ id, name }, ...]
    } catch (err) {
      console.error('Erreur lors de la récupération des rôles :', err);
      return [];
    }
  },

  async getProfile() {
    const token = this.getToken();
    if (!token) return null;

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      this.logout(); // Si le token est expiré ou invalide, on nettoie la session
      return null;
    }

    return await response.json();
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  }

  
};