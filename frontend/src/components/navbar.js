// frontend/src/components/navbar.js
export default {
  renderNavbar,
  initNavbarEvents
};
export function renderNavbar() {
  return `
    <header class="main-header">
      <div class="logo">
        <a href="#" style="color: white; text-decoration: none;">Mon Application</a>
      </div>
      <nav>
        <ul class="nav-links">
          <li><a href="#home" id="nav-home">Accueil</a></li>
          <li><a href="#dashboard" id="nav-dashboard">Tableau de bord</a></li>
          <li><a href="#profile" id="nav-profile">Profil</a></li>
        </ul>
      </nav>
    </header>
  `;
}