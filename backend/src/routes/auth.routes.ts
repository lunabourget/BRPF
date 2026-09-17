import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();
const authController = new AuthController();

// enregistrement
router.post('/register', (req, res) => authController.register(req, res));

// login
router.post('/login', (req, res) => authController.login(req, res));

// Routes protégées par JWT
router.get('/me', authenticateToken, (req, res) => authController.getProfile(req, res));
router.post('/logout', authenticateToken, (req, res) => authController.logout(req, res));

export default router;