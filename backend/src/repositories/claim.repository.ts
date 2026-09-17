import { db } from './db.js';
import { randomUUID } from 'crypto';
import type { ClaimEntity } from '../interfaces/claim.interface.js';


export class ClaimRepository {
  // Récupère toutes les réclamations d'un utilisateur avec statut, catégorie et réponse
  findByUserId(userId: string) {
    const stmt = db.prepare(`
      SELECT 
        c.id, 
        c.name, 
        c.nb_refus,
        s.name AS status,
        cat.name AS category,
        r.text AS response
      FROM claims c
      JOIN status s ON c.id_status = s.id
      JOIN categories cat ON c.id_category = cat.id
      LEFT JOIN responses r ON r.id_claim = c.id
      WHERE c.id_user = ?
    `);
    return stmt.all(userId);
  }

  // Trouver une réclamation par son ID
  findById(id: string): ClaimEntity | undefined {
    const stmt = db.prepare('SELECT * FROM claims WHERE id = ?');
    return stmt.get(id) as ClaimEntity | undefined;
  }

  // Créer une nouvelle réclamation
  create(claimData: { name: string; id_user: string; id_status: string; id_category: string }): ClaimEntity {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO claims (id, name, id_user, id_status, id_category, nb_refus)
      VALUES (?, ?, ?, ?, ?, 0)
    `);

    const categoryId = claimData.id_category ?? null;

    stmt.run(id, claimData.name, claimData.id_user, claimData.id_status, categoryId);

    return {
    id,
    name: claimData.name,
    id_user: claimData.id_user,
    id_status: claimData.id_status,
    id_category: categoryId,
    nb_refus: 0
  };
  }

  // Faire opposition (Incrémente nb_refus et remet le statut "En cours")
  incrementRefusalAndResetStatus(claimId: string, inProgressStatusId: string): boolean {
    const stmt = db.prepare(`
      UPDATE claims 
      SET nb_refus = nb_refus + 1, id_status = ? 
      WHERE id = ?
    `);
    const result = stmt.run(inProgressStatusId, claimId);
    return result.changes > 0;
  }
}