import type { Request, Response } from 'express';
import { ClaimRepository } from '../repositories/claim.repository.js';

export class ClaimController {
  private claimRepository: ClaimRepository;

  constructor() {
    this.claimRepository = new ClaimRepository();
  }

  // GET /api/claims?userId=xxx
  async getAllByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;

      if (typeof userId !== 'string') {
        res.status(400).json({ error: "L'ID utilisateur doit être une chaîne de caractères valide." });
        return;
      }

      const claims = this.claimRepository.findByUserId(userId);
      res.json(claims);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des réclamations.' });
    }
  }

    // POST /api/claims
    async create(req: Request, res: Response): Promise<void> {
    try {
        // Si votre middleware JWT attache req.user :
        // const userId = (req as any).user?.id; 
        
        // Sinon, on accepte id_user directement transmis du body
        const { name, id_user, id_category, id_status } = req.body;

        // ID du statut par défaut si non transmis par le front (ex: 'statut-en-cours-id')
        const DEFAULT_STATUS_ID = id_status || 'STATUS_PENDING_UUID'; 
        // ID de la catégorie par défaut si non gérée dans le HTML
        const DEFAULT_CATEGORY_ID = id_category || 'CATEGORY_DEFAULT_UUID';

        if (
        typeof name !== 'string' ||
        typeof id_user !== 'string'
        ) {
        res.status(400).json({ 
            error: "Le nom et l'identifiant utilisateur sont obligatoires." 
        });
        return;
        }

        const newClaim = this.claimRepository.create({ 
        name, 
        id_user, 
        id_status: DEFAULT_STATUS_ID, 
        id_category: DEFAULT_CATEGORY_ID 
        });

        res.status(201).json({ 
        message: 'Réclamation envoyée avec succès', 
        claim: newClaim 
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de la réclamation." });
    }
    }
  // POST /api/claims/:id/contest
  async contest(req: Request, res: Response): Promise<void> {
    try {
      const claimId = req.params.id;
      const { inProgressStatusId } = req.body;

      if (typeof claimId !== 'string') {
        res.status(400).json({ error: "L'identifiant de réclamation est invalide." });
        return;
      }

      if (typeof inProgressStatusId !== 'string') {
        res.status(400).json({ error: "L'ID du statut 'En cours' doit être une chaîne de caractères valide." });
        return;
      }

      const claim = this.claimRepository.findById(claimId);
      if (!claim) {
        res.status(404).json({ error: 'Réclamation introuvable.' });
        return;
      }

      if (claim.nb_refus >= 3) {
        res.status(403).json({ error: 'Niveau maximum de réclamation atteint (3 refus).' });
        return;
      }

      const updated = this.claimRepository.incrementRefusalAndResetStatus(claimId, inProgressStatusId);
      if (updated) {
        res.json({ message: 'Opposition prise en compte, réclamation renvoyée au niveau supérieur.' });
      } else {
        res.status(500).json({ error: "Impossible de mettre à jour la réclamation." });
      }
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du traitement de l'opposition." });
    }
  }
}