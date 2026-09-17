import { requireAuth } from '../utils/guard.js';
import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { createCard } from '../components/card.js';

// 1. Protection : redirection vers login.html si non connecté
requireAuth();

/**
 * Cartes réservées aux utilisateurs connectés
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
    link: 'aide.html'
  }
];

function initHeader() {
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.innerHTML = renderNavbar();
    initNavbarEvents();
  }
}

function renderCards() {
  const cardsContainer = document.getElementById('cards-container');
  if (!cardsContainer) return;

  cardsContainer.innerHTML = '';
  HOME_CARDS.forEach((cardData) => {
    cardsContainer.appendChild(createCard(cardData));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  renderCards();
});