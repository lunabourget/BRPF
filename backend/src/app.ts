import express from 'express';
import cors from 'cors';
import { initDb } from './repositories/db.js';
import claimRoutes from './routes/claim.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());

// Initialisation de la base de données (création des tables)
initDb();

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Serveur et BDD opérationnels' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});


app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);

