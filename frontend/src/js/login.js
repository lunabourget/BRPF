import { AuthService } from '../services/auth.service.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  // Si déjà connecté, redirige vers le tableau de bord
  if (AuthService.isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      await AuthService.login(email, password);
      // Redirection après connexion réussie
      window.location.href = 'index.html';
    } catch (err) {
      errorMessage.textContent = err.message;
    }
  });
});