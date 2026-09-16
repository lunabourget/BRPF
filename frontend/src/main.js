// frontend/src/main.js
import { renderNavbar } from './components/navbar.js';

// 1. Sélection du conteneur HTML du header
const headerContainer = document.getElementById('header-container');

// 2. Injection du HTML de la navbar
if (headerContainer) {
  headerContainer.innerHTML = renderNavbar();
}

// 3. Gestion des interactions / événements (Optionnel)
document.addEventListener('DOMContentLoaded', () => {
  const homeLink = document.getElementById('nav-home');
  const dashboardLink = document.getElementById('nav-dashboard');

  homeLink?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Navigation vers l\'accueil');
    // Ici vous pourrez appeler l'affichage de votre vue homePage.js
  });

  dashboardLink?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Navigation vers le dashboard');
    // Ici vous pourrez appeler l'affichage de votre vue dashboard.js
  });
});

// src/main.js
import { createCard } from './components/card.js';
