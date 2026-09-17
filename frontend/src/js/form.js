import { renderFooter } from '../components/footer.js';

async function loadRoles() {
  const response = await fetch('/api/roles');
  const roles = await response.json();
  const select = document.getElementById('id_character_role');
  
  roles.forEach(role => {
    const option = document.createElement('option');
    option.value = role.id;
    option.textContent = role.name;
    select.appendChild(option);
  });
}

function initFooter() {
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = renderFooter();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initFooter();
  loadRoles();
});