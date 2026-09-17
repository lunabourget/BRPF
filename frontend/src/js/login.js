import { AuthService } from '../services/auth.service.js';
import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import Navbar from '../components/navbar.js';

// Utilisation :
headerContainer.innerHTML = Navbar.renderNavbar();
Navbar.initNavbarEvents();
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 login.js chargé avec succès !');

  // 1. Initialiser le header
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.innerHTML = renderNavbar();
    initNavbarEvents();
  }

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
  }

  // 4. Soumission du formulaire de CONNEXION
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFeedback();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      console.log('🔄 [LOGIN] Tentative de connexion pour :', email);

      try {
        const response = await AuthService.login(email, password);
        console.log('✅ [LOGIN] Connexion réussie ! Réponse backend :', response);

        window.location.href = 'home.html';
      } catch (err) {
        console.error('❌ [LOGIN] Erreur lors de la connexion :', err);
        showFeedback(err.message, true);
      }
    });
  }

  // Remplissage du menu déroulant
  async function populateRoleDropdown() {
    if (!roleSelect) return;

    try {
      const roles = await AuthService.getRoles();
      roles.forEach((role) => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        roleSelect.appendChild(option);
      });
    } catch (err) {
      console.warn('⚠️ Impossible de charger les rôles :', err.message);
    }
  }

  populateRoleDropdown();

  // 5. Soumission du formulaire d'INSCRIPTION
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFeedback();

      const userData = {
        firstName: document.getElementById('reg-firstname').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        password: document.getElementById('reg-password').value,
        lastName: document.getElementById('reg-lastname')?.value.trim() || undefined,
        workOrigin: document.getElementById('reg-work')?.value.trim() || undefined,
        role: roleSelect?.value || undefined
      };

      console.log('🔄 [REGISTER] Envoi des données d\'inscription :', userData);

      try {
        await AuthService.register(userData);
        console.log('✅ [REGISTER] Inscription réussie !');
        showFeedback('Compte créé avec succès ! Connectez-vous.', false);

        document.getElementById('login-email').value = userData.email;
        registerForm.reset();
        loginBtn.click();
      } catch (err) {
        console.error('❌ [REGISTER] Erreur lors de l\'inscription :', err);
        showFeedback(err.message, true);
      }
    });
  }
});