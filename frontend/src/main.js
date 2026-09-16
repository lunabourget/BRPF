import { renderNavbar } from './components/navbar.js';
import { createCard } from './components/card.js';

/**
 * Données statiques des cartes d'action principales
 */
const HOME_CARDS = [
  {
    title: 'Nouvelle réclamation',
    description: 'Déposer une demande pour contester votre scénario.',
    link: 'declarer-reclamation.html'
  },
  {
    title: 'Mes réclamations',
    description: 'Suivre l’avancement de vos dossiers en cours.',
    link: 'mes-reclamations.html'
  },
  {
    title: 'Aide & procédure',
    description: 'Comprendre les étapes, délais et pièces à fournir.',
    link: '#'
  }
];

/**
 * Injecte la barre de navigation dans le DOM
 */
function initNavbar() {
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.innerHTML = renderNavbar();
  }
}

/**
 * Génère et affiche les cartes d'accueil dans leur conteneur
 */
function renderHomeCards() {
  const cardsContainer = document.querySelector('#cards-container');
  if (!cardsContainer) return;

  // Réinitialise le contenu avant injection
  cardsContainer.innerHTML = '';

  HOME_CARDS.forEach((cardData) => {
    const cardElement = createCard(cardData);
    cardsContainer.appendChild(cardElement);
  });
}

/**
 * Attache les écouteurs d'événements pour la navigation
 */
function initNavigationEvents() {
  const homeLink = document.getElementById('nav-home');
  const dashboardLink = document.getElementById('nav-dashboard');

  homeLink?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("Navigation vers l'accueil");
  });

  dashboardLink?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Navigation vers le dashboard');
  });
}

/**
 * Point d'entrée principal initialisé au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderHomeCards();
  initNavigationEvents();
});