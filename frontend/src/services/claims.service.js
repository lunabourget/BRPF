import { API_URL, AuthService } from './auth.service.js';

export const ClaimsService = {

  async getUserClaims() {
    const token = AuthService.getToken();
    const user = await AuthService.getProfile();

    if (!token || !user) {
      throw new Error('Vous devez être connecté pour consulter vos réclamations.');
    }

    const response = await fetch(`${API_URL}/claims`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la récupération des réclamations.');
    }

    return data;
  },

  async createClaim(formData) {
    const token = AuthService.getToken();
    const user = await AuthService.getProfile();

    if (!token || !user) {
      throw new Error('Vous devez être connecté pour envoyer une réclamation.');
    }

    const fallbackName = `${formData.characterFirstName} ${formData.characterLastName} - ${formData.work} (${formData.workYear})`.trim();

    const claimPayload = {
      name: formData.description || fallbackName,
      description: formData.description,
      id_user: user.id,
      id_character_role: formData.id_character_role,
      id_status: formData.id_status || 'stat-1',
      id_category: formData.id_category || 'cat-0'
    };

    const response = await fetch(`${API_URL}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(claimPayload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de l’envoi de la réclamation.');
    }

    return data;
  },

  async contestClaim(claimId) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Vous devez être connecté pour signaler une réclamation.');
    }

    const response = await fetch(`${API_URL}/claims/${encodeURIComponent(claimId)}/contest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ inProgressStatusId: 'stat-1' })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors du signalement de la réclamation.');
    }

    return data;
  }
};