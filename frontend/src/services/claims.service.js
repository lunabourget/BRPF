import { API_URL, AuthService } from './auth.service.js';

export const ClaimsService = {

  async createClaim(formData) {
    const token = AuthService.getToken();
    const user = AuthService.getUser();

    if (!token || !user) {
      throw new Error('Vous devez être connecté pour envoyer une réclamation.');
    }

    const formattedName = `${formData.characterName} - ${formData.work} (${formData.workYear})`;

    const claimPayload = {
      name: formattedName,
      id_user: user.id,
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
  }
};