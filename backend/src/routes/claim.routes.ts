import { Router } from 'express';
import { ClaimController } from '../controllers/claim.controller.js';

const router = Router();
const claimController = new ClaimController();

// Récupérer les réclamations de l'utilisateur connecté
router.get('/', (req, res) => claimController.getAllByUser(req, res));

// Créer une réclamation
router.post('/', (req, res) => claimController.create(req, res));

// Faire opposition à un refus
router.post('/:id/contest', (req, res) => claimController.contest(req, res));

export default router;

