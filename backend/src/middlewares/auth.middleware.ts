import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'brpf_secret_key_change_in_prod';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Accès non autorisé. Jeton JWT manquant.' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || typeof decoded !== 'object' || !decoded || !('userId' in decoded)) {
      res.status(403).json({ error: 'Jeton JWT invalide ou expiré.' });
      return;
    }

    req.userId = (decoded as { userId: string }).userId;
    next();
  });
}