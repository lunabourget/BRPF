import { AuthService } from '../services/auth.service.js';
import { renderNavbar } from '../components/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 login.js chargé avec succès !');

  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.innerHTML = renderNavbar();
  }

  if (AuthService.isAuthenticated()) {
    window.location.href = 'home.html';
    return;
  }

  const loginBtn = document.getElementById('tab-login-btn');
  const registerBtn = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const feedback = document.getElementById('auth-feedback');
  const roleSelect = document.getElementById('reg-role');
  const yearSelect = document.getElementById('reg-work-year');

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

  // 1. Remplissage de la liste des années
  if (yearSelect) {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }
  }

  // 2. Remplissage dynamique des rôles depuis l'API
  async function loadRoles() {
    if (!roleSelect) return;
    try {
      const response = await fetch('/api/roles');
      if (!response.ok) return;
      const roles = await response.json();
      
      roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        roleSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Erreur chargement des rôles :', err);
    }
  }

  loadRoles();

  // 3. Bascule des onglets Connexion / Inscription
  if (loginBtn && registerBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm?.classList.add('active');
      registerForm?.classList.remove('active');
      clearFeedback();
    });

    registerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      registerForm?.classList.add('active');
      loginForm?.classList.remove('active');
      clearFeedback();
    });
  }

  // 4. Soumission Connexion
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFeedback();

      const email = document.getElementById('login-email')?.value.trim();
      const password = document.getElementById('login-password')?.value;

      if (!email || !password) return;

      try {
        await AuthService.login(email, password);
        window.location.href = 'home.html';
      } catch (err) {
        showFeedback(err.message, true);
      }
    });
  }

  // 5. Soumission Inscription
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
        lastName: document.getElementById('reg-lastname')?.value.trim() || undefined,
        email: emailEl.value.trim(),
        password: passwordEl.value,
        workOrigin: document.getElementById('reg-work')?.value.trim() || undefined,
        year: yearSelect?.value ? Number(yearSelect.value) : undefined,
        role: roleSelect?.value || undefined
      };

      try {
        await AuthService.register(userData);
        showFeedback('Compte créé avec succès ! Connectez-vous.', false);

        const loginEmailEl = document.getElementById('login-email');
        if (loginEmailEl) loginEmailEl.value = userData.email;

        registerForm.reset();
        loginBtn?.click();
      } catch (err) {
        showFeedback(err.message, true);
      }
    });
  }
});