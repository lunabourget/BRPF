// frontend/src/main.js
import { renderNavbar } from './components/navbar.js';

// src/main.js
import { createMediaCard } from './components/mediaCard.js';
import { createCard } from './components/card.js';

const cardsContainer = document.querySelector('#cards-container');

// const container = document.querySelector('#media-card-container');
// container.appendChild(createMediaCard({
//   title: 'Mon titre',
//   description: 'Ma description',
//   imageSrc: './src/assets/mon-image.jpg',
//   onShare: () => console.log('Partagé !'),
//   onLearnMore: () => console.log('En savoir plus cliqué')
// }));
const cardsData = [
  { title: 'Nouvelle réclamation', description: 'Déposer une demande pour contester votre scénario.', link: 'declarer-reclamation.html' },
  { title: 'Mes réclamations', description: 'Suivre l’avancement de vos dossiers en cours.', link: 'mes-reclamations.html' },
  { title: 'Aide & procédure', description: 'Comprendre les étapes, délais et pièces à fournir.', link: '#' }
];
cardsData.forEach(data => cardsContainer.appendChild(createCard(data)));
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
