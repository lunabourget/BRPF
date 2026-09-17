import { Router, type Request, type Response } from 'express';
import { db } from '../repositories/db.js';

const router = Router();

// Interface générique correspondant à la structure de tes tables
interface ReferenceItem {
  id: string;
  name: string;
}

/**
 * GET /api/roles - Liste des rôles de personnages
 */
router.get('/roles', (_req: Request, res: Response) => {
  try {
    const roles = db.prepare('SELECT id, name FROM character_roles').all() as ReferenceItem[];
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des rôles.' });
  }
});

/**
 * GET /api/medias - Liste des médias / œuvres
 */
router.get('/medias', (_req: Request, res: Response) => {
  try {
    const medias = db.prepare('SELECT id, name FROM medias').all() as ReferenceItem[];
    res.json(medias);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des médias.' });
  }
});

/**
 * GET /api/status - Liste des statuts de réclamation
 */
router.get('/status', (_req: Request, res: Response) => {
  try {
    const statusList = db.prepare('SELECT id, name FROM status').all() as ReferenceItem[];
    res.json(statusList);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des statuts.' });
  }
});

/**
 * GET /api/categories - Liste des catégories de réclamation
 */
router.get('/categories', (_req: Request, res: Response) => {
  try {
    const categories = db.prepare('SELECT id, name FROM categories').all() as ReferenceItem[];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories.' });
  }
});

export default router;