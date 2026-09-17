export function renderFooter() {

  return `
    <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
        <div class="footer-top">
        <div class="footer-brand">
            <a href="home.html">
            <img src="./src/assets/logo.svg" alt="Logo BRPF" class="logo">
            </a>
            <p class="footer-tagline">Bureau des Réclamations des Personnages Fictifs</p>
        </div>

        <div class="footer-info">
            <p>Ce site est géré par le Bureau des Réclamations des Personnages Fictifs (BRPF).</p>
            <nav class="footer-nav">
            <a href="home.html" class="footer-link">Accueil</a>
            <a href="mon-espace.html" class="footer-link">Mon espace</a>
            <a href="formulaire.html" class="footer-link">Déposer une réclamation</a>
            </nav>
        </div>
        </div>

        <hr class="footer-divider">

        <nav class="footer-links">
        <a href="#" class="footer-secondary-link">Mentions légales</a>
        <a href="#" class="footer-secondary-link">Données personnelles</a>
        <a href="#" class="footer-secondary-link">Gestion des cookies</a>
        <a href="#" class="footer-secondary-link">Aide &amp; procédure</a>
        </nav>

        <p class="footer-copyright">&copy; 2026 BRPF - Bureau des Réclamations des Personnages Fictifs. Tous droits réservés.</p>
    </div>
  </footer>
  `;
}

