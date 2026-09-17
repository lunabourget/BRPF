import { AuthService } from '../services/auth.service.js';
import { renderNavbar } from '../components/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 login.js chargé avec succès !');

  // 1. Initialiser le header (sans écouteur de déconnexion inutile ici)
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.innerHTML = renderNavbar();
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
      loginForm?.classList.add('active');
      registerForm?.classList.remove('active');
      clearFeedback();
    });

    registerBtn.addEventListener('click', () => {
      registerBtn.classList.add('active');
      loginBtn.classList.remove('active');
      registerForm?.classList.add('active');
      loginForm?.classList.remove('active');
      clearFeedback();
    });
  }

  // 4. Soumission du formulaire de CONNEXION
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFeedback();

      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');

      if (!emailInput || !passwordInput) return;

      const email = emailInput.value.trim();
      const password = passwordInput.value;

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

  // 5. Remplissage du menu déroulant
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

  // 6. Soumission du formulaire d'INSCRIPTION
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFeedback();

      const firstNameEl = document.getElementById('reg-firstname');
      const emailEl = document.getElementById('reg-email');
      const passwordEl = document.getElementById('reg-password');

      if (!firstNameEl || !emailEl || !passwordEl) return;

      const userData = {
        firstName: firstNameEl.value.trim(),
        email: emailEl.value.trim(),
        password: passwordEl.value,
        lastName: document.getElementById('reg-lastname')?.value.trim() || undefined,
        workOrigin: document.getElementById('reg-work')?.value.trim() || undefined,
        role: roleSelect?.value || undefined
      };

      console.log('🔄 [REGISTER] Envoi des données d\'inscription :', userData);

      try {
        await AuthService.register(userData);
        console.log('✅ [REGISTER] Inscription réussie !');
        showFeedback('Compte créé avec succès ! Connectez-vous.', false);

        const loginEmailEl = document.getElementById('login-email');
        if (loginEmailEl) {
          loginEmailEl.value = userData.email;
        }

        registerForm.reset();
        loginBtn?.click();
      } catch (err) {
        console.error('❌ [REGISTER] Erreur lors de l\'inscription :', err);
        showFeedback(err.message, true);
      }
    });
  }
});