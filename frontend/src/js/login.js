import { AuthService } from '../services/auth.service.js';
import { renderNavbar, initNavbarEvents } from '../components/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialiser le header
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.innerHTML = renderNavbar();
    initNavbarEvents();
  }

  // 2. Rediriger si déjà connecté
  if (AuthService.isAuthenticated()) {
    window.location.href = 'home.html';
    return;
  }

  const loginBtn = document.getElementById('tab-login-btn');
  const registerBtn = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const feedback = document.getElementById('auth-feedback');


  function showFeedback(message, isError = true) {
    feedback.textContent = message;
    feedback.className = `feedback-message ${isError ? 'error' : 'success'}`;
  }

  function clearFeedback() {
    feedback.textContent = '';
    feedback.className = 'feedback-message';
  }

  // 3. Gestion de la bascule des onglets
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

  async function populateRoleDropdown() {
    if (!roleSelect) return;

    const roles = await AuthService.getRoles();
    
    roles.forEach((role) => {
      const option = document.createElement('option');
      option.value = role.id;       // Valeur envoyée au serveur (id ou nom selon ta BD)
      option.textContent = role.name; // Texte affiché à l'utilisateur
      roleSelect.appendChild(option);
    });
  }

  // Initialisation du menu déroulant
  populateRoleDropdown();

  // 5. Soumission du formulaire d'INSCRIPTION
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFeedback();

    // Récupération des champs obligatoire + facultatifs
    const userData = {
      firstName: document.getElementById('reg-firstname').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value,
      lastName: document.getElementById('reg-lastname').value.trim() || undefined,
      workOrigin: document.getElementById('reg-work').value.trim() || undefined,
      role: roleSelect.value || undefined
    };

    try {
      await AuthService.register(userData);
      showFeedback('Compte créé avec succès ! Connectez-vous.', false);
      
      // Auto-bascule sur l'onglet Connexion pré-rempli
      document.getElementById('login-email').value = userData.email;
      registerForm.reset();
      loginBtn.click();
    } catch (err) {
      showFeedback(err.message, true);
    }
  });
});