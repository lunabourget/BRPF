import { renderFooter } from '../components/footer.js';

function initFooter() {
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = renderFooter();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initFooter();
});