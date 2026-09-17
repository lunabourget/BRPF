import { AuthService } from '../services/auth.service.js';

// Le header est désormais rendu par le script inline de login.html
// (src/components/header.js), commun à toutes les pages.

// Utilisation :
headerContainer.innerHTML = Navbar.renderNavbar();
Navbar.initNavbarEvents();
document.addEventListener('DOMContentLoaded', () => {
  // 2. Rediriger si déjà connecté
  if (AuthService.isAuthenticated()) {
    console.log('ℹ️ Utilisateur déjà connecté. Redirection vers home.html...');
    window.location.href = 'home.html';
    return;
  }

  // Récupération des éléments du DOM
  const loginBtn = document.getElementById('tab-login-btn');
  const registerBtn = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const feedback = document.getElementById('auth-feedback');
  // FIX: Déclaration manquante de roleSelect
  const roleSelect = document.getElementById('reg-role'); 

  function showFeedback(message, isError = true) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = `feedback-message ${isError ? 'error' : 'success'}`;
  }

  function clearFeedback() {
    if (!feedback) return;
    feedback.textContent = '';
    feedback.className = 'feedback-message';
  }

  // 3. Gestion de la bascule des onglets
  if (loginBtn && registerBtn) {
    loginBtn.addEventListener('click', () => {
      loginBtn.classList.add('active');
      registerBtn.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
      clearFeedback();
    });

  registerBtn.addEventListener('click', () => {
    registerBtn.classList.add('active');
    loginBtn.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    clearFeedback();
  });

  // 4. Soumission du formulaire de CONNEXION
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFeedback();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      await AuthService.login(email, password);
      window.location.href = 'home.html';
    } catch (err) {
      showFeedback(err.message, true);
    }
  });

  const roleSelect = document.getElementById('reg-role');
  const workYearSelect = document.getElementById('reg-work-year');

  function populateWorkYearDropdown() {
    if (!workYearSelect) return;

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      workYearSelect.appendChild(option);
    }
  }

  populateWorkYearDropdown();

  // Les rôles affichés sont ceux codés en dur dans login.html (voir commentaire
  // sur le <select id="reg-role">). On ne les recharge plus depuis l'API : les
  // libellés stockés en base sont périmés par rapport au texte inclusif voulu,
  // et les ajouter en plus créerait des doublons (ex: "Héros·ïne" et "Héros").

  // 5. Soumission du formulaire d'INSCRIPTION
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFeedback();

    // Les noms de champs envoyés doivent correspondre à ceux attendus par le
    // backend (voir backend/src/controllers/auth.controller.ts).
    const userData = {
      name: document.getElementById('reg-firstname').value.trim(),
      surname: document.getElementById('reg-lastname').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value,
      fictive_work: document.getElementById('reg-work').value.trim() || undefined,
      year: workYearSelect.value || undefined,
      id_character_role: roleSelect.value || undefined
    };

    try {
      await AuthService.register(userData);

      // Auto-bascule sur l'onglet Connexion pré-rempli
      // (loginBtn.click() efface le message via clearFeedback(), donc on
      // réaffiche le message de succès juste après la bascule)
      document.getElementById('login-email').value = userData.email;
      registerForm.reset();
      loginBtn.click();
      showFeedback('Compte créé avec succès ! Connectez-vous.', false);
    } catch (err) {
      showFeedback(err.message, true);
    }
  });
});