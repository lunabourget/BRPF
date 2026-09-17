import { AuthService } from '../services/auth.service.js';

export function renderHeader() {
  const isLoggedIn = AuthService.isAuthenticated();

  return `
    <header class="header">
      <a href="home.html">
        <img src="./src/assets/logo.svg" alt="Logo BRPF" class="logo">
      </a>
      <nav class="nav">
        <a href="home.html" class="nav-link">Accueil</a>
        <a href="mon-espace.html" class="nav-link">Mon espace</a>
        ${isLoggedIn
          ? '<button id="logout-btn" class="btn-login">Se déconnecter</button>'
          : '<a href="login.html" class="btn-login">Se connecter</a>'}
      </nav>
    </header>
  `;
}

export function initHeaderEvents() {
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    AuthService.logout();
  });
}
