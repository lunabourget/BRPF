import { AuthService } from '../services/auth.service.js';

export function requireAuth() {
  if (!AuthService.isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }

  return true;
}
