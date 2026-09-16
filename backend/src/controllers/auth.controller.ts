import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'brpf_secret_key_change_in_prod';

export class AuthController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // POST /api/auth/register
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, surname, email, password, fictive_work, year, id_character_role, id_media, author } = req.body;

      if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string' || typeof surname !== 'string') {
        res.status(400).json({ error: 'Champs obligatoires manquants ou invalides.' });
        return;
      }

      const existingUser = this.userRepository.findByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: 'Un utilisateur existe déjà avec cet email.' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepository.create({
        name,
        surname,
        email,
        password: hashedPassword,
        fictive_work,
        year: year ? Number(year) : undefined,
        id_character_role,
        id_media,
        author
      });

      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ message: 'Inscription réussie', user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'inscription." });
    }
  }

  // POST /api/auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).json({ error: 'Email et mot de passe requis.' });
        return;
      }

      const user = this.userRepository.findByEmail(email);
      if (!user || !user.password) {
        res.status(401).json({ error: 'Identifiants incorrects.' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Identifiants incorrects.' });
        return;
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '72h' }
      );

      const { password: _, ...userWithoutPassword } = user;
      res.json({ message: 'Connexion réussie', token, user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
  }
// GET /api/auth/profile
async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: 'Utilisateur non identifié.' });
        return;
      }

      const userProfile = this.userRepository.getProfileWithDetails(userId);

      if (!userProfile) {
        res.status(404).json({ error: 'Utilisateur introuvable.' });
        return;
      }

      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
    }
  }

  // POST /api/auth/logout
  async logout(_req: AuthenticatedRequest, res: Response): Promise<void> {
    // Avec des jetons JWT sans état (stateless), la déconnexion consiste pour le frontend à supprimer le token stocké localement.
    // Le serveur confirme simplement la demande.
    res.json({ message: 'Déconnexion réussie.' });
  }
}