import { AuthService } from '../services/auth.service.js';

export function renderNavbar() {
  const isLoggedIn = AuthService.isAuthenticated();

  return `
    <nav class="navbar">
      <a href="${isLoggedIn ? 'home.html' : 'login.html'}" class="brand">BRPF</a>
      <ul class="nav-links">
        ${isLoggedIn ? `
          <li><a href="home.html">Accueil</a></li>
          <li><a href="mes-reclamations.html">Mes Réclamations</a></li>
          <li><a href="declarer-reclamation.html">Nouvelle Réclamation</a></li>
          <li><button id="logout-btn">Déconnexion</button></li>
        ` : `
          <li><a href="login.html">Connexion</a></li>
          <li><a href="register.html">Inscription</a></li>
        `}
      </ul>
    </nav>
  `;
}

export function initNavbarEvents() {
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    AuthService.logout();
  });
}